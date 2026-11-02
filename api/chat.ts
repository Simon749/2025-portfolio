import { GoogleGenAI } from "@google/genai";
import { getOrbitSystemInstruction } from "../src/lib/orbit/index.ts";

type ChatRole = "user" | "model";

type ChatTurn = {
  role: ChatRole;
  parts: [{ text: string }];
};

type RequestLike = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader?: (name: string, value: string) => void;
};

type IncomingTurn = {
  role?: unknown;
  text?: unknown;
  content?: unknown;
};

const MAX_MESSAGE_LENGTH = 700;
const MAX_HISTORY_TURNS = 10;
const MAX_HISTORY_TEXT_LENGTH = 900;
const MAX_REQUESTS_PER_WINDOW = 15;
const RATE_WINDOW_MS = 60_000;

// This is a best-effort per-instance limit. Serverless instances do not share memory.
// Use a shared store (for example, Redis/Upstash) if you need globally consistent limits.
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientKey(req: RequestLike): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = forwardedValue?.split(",")[0]?.trim() || req.socket?.remoteAddress;
  return ip || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = rateBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

function readBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  return body && typeof body === "object"
    ? (body as Record<string, unknown>)
    : {};
}

function cleanHistory(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-MAX_HISTORY_TURNS)
    .map((item: IncomingTurn): ChatTurn | null => {
      if (!item || typeof item !== "object") return null;

      const rawRole = item.role;
      const role: ChatRole | null =
        rawRole === "user"
          ? "user"
          : rawRole === "model" || rawRole === "bot" || rawRole === "assistant"
            ? "model"
            : null;

      const rawText =
        typeof item.text === "string"
          ? item.text
          : typeof item.content === "string"
            ? item.content
            : "";

      const text = rawText.trim().slice(0, MAX_HISTORY_TEXT_LENGTH);
      if (!role || !text) return null;

      return { role, parts: [{ text }] };
    })
    .filter((turn): turn is ChatTurn => turn !== null);
}

function sendError(res: ResponseLike, status: number, message: string) {
  return res.status(status).json({ error: message, reply: message });
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== "POST") {
    res.setHeader?.("Allow", "POST");
    return sendError(res, 405, "This endpoint only accepts POST requests.");
  }

  const body = readBody(req.body);
  const message =
    typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    return sendError(res, 400, "Please enter a message.");
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return sendError(
      res,
      400,
      `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
    );
  }

  if (isRateLimited(getClientKey(req))) {
    return sendError(
      res,
      429,
      "Orbit is receiving too many requests. Please try again in a minute.",
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[Orbit] GEMINI_API_KEY is not configured.");
    return sendError(
      res,
      503,
      "Orbit is not configured yet. Please try again later.",
    );
  }

  // Keep the playful confetti action deterministic and independent of the AI.
  if (/^\s*(do a trick|show confetti|dance)\s*[!.?]*\s*$/i.test(message)) {
    return res.status(200).json({ reply: "__TRICK__" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const history = cleanHistory(body.history);

    // Avoid sending a malformed conversation that begins with a model turn.
    while (history.length > 0 && history[0].role !== "user") {
      history.shift();
    }

    const contents: ChatTurn[] = [
      ...history,
      { role: "user", parts: [{ text: message }] },
    ];

    const model =
      process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

    const result = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: getOrbitSystemInstruction(),
        temperature: 0.35,
        maxOutputTokens: 650,
      },
    });

    const reply = result.text?.trim();

    if (!reply) {
      console.error("[Orbit] Gemini returned an empty response.");
      return sendError(
        res,
        502,
        "I couldn't put together a useful answer just now. Please try again.",
      );
    }

    return res.status(200).json({ reply });
  } catch (error) {
    const err = error as {
      name?: string;
      message?: string;
      status?: number;
    };

    console.error("[Orbit] Chat request failed:", {
      name: err?.name,
      message: err?.message,
      status: err?.status,
    });

    return sendError(
      res,
      500,
      "Orbit hit a temporary technical problem. Please try again shortly.",
    );
  }
}
