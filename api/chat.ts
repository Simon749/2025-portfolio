import { GoogleGenAI } from "@google/genai";
import { getOrbitSystemInstruction } from "../src/lib/orbit/index.js";

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
  status?: (code: number) => ResponseLike;
  json?: (body: unknown) => void;
  statusCode?: number;
  end?: (body?: string) => void;
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

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function sendJson(
  res: ResponseLike,
  status: number,
  payload: unknown,
): void {
  // Vercel-style response
  if (typeof res.status === "function" && typeof res.json === "function") {
    const vercelRes = res.status(status);

    if (vercelRes && typeof vercelRes.json === "function") {
      vercelRes.json(payload);
      return;
    }
  }

  // Native Node.js response (used by local Vite middleware)
  res.statusCode = status;
  res.setHeader?.("Content-Type", "application/json; charset=utf-8");
  res.setHeader?.("Cache-Control", "no-store");
  res.end?.(JSON.stringify(payload));
}

function sendError(
  res: ResponseLike,
  status: number,
  message: string,
): void {
  sendJson(res, status, { error: message, reply: message });
}

function getClientKey(req: RequestLike): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;

  return (
    forwardedValue?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = rateBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

function readBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") {
    try {
      const parsed: unknown = JSON.parse(body);

      return parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : {};
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

      const role: ChatRole | null =
        item.role === "user"
          ? "user"
          : item.role === "model" ||
              item.role === "bot" ||
              item.role === "assistant"
            ? "model"
            : null;

      const rawText =
        typeof item.text === "string"
          ? item.text
          : typeof item.content === "string"
            ? item.content
            : "";

      const text = rawText.trim().slice(0, MAX_HISTORY_TEXT_LENGTH);

      return role && text ? { role, parts: [{ text }] } : null;
    })
    .filter((turn): turn is ChatTurn => turn !== null);
}

export default async function handler(
  req: RequestLike,
  res: ResponseLike,
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader?.("Allow", "POST");

    sendError(
      res,
      405,
      "This endpoint only accepts POST requests.",
    );
    return;
  }

  const body = readBody(req.body);
  const message =
    typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    sendError(res, 400, "Please enter a message.");
    return;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    sendError(
      res,
      400,
      `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
    );
    return;
  }

  if (isRateLimited(getClientKey(req))) {
    sendError(
      res,
      429,
      "Orbit is receiving too many requests. Please try again in a minute.",
    );
    return;
  }

  if (/^\s*(do a trick|show confetti|dance)\s*[!.?]*\s*$/i.test(message)) {
    sendJson(res, 200, { reply: "__TRICK__" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[Orbit] GEMINI_API_KEY is not configured.");

    sendError(
      res,
      503,
      "Orbit is not configured yet. Please try again later.",
    );
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const history = cleanHistory(body.history);

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

      sendError(
        res,
        502,
        "I couldn't put together a useful answer just now. Please try again.",
      );
      return;
    }

    sendJson(res, 200, { reply });
  } catch (error) {
    const err = error as {
      name?: string;
      message?: string;
      status?: number;
    };

    const upstreamStatus = Number(err?.status);

    console.error("[Orbit] Chat request failed:", {
      name: err?.name,
      message: err?.message,
      status: err?.status,
    });

    if (upstreamStatus === 503) {
      res.setHeader?.("Retry-After", "5");

      sendError(
        res,
        503,
        "Orbit's AI service is temporarily busy. Please try again in a few seconds.",
      );
      return;
    }

    if (upstreamStatus === 429) {
      res.setHeader?.("Retry-After", "10");

      sendError(
        res,
        429,
        "Orbit is receiving too many requests right now. Please try again shortly.",
      );
      return;
    }

    sendError(
      res,
      500,
      "Orbit hit a temporary technical problem. Please try again shortly.",
    );
  }
}
