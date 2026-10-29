import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, BOT_CONTEXT } from "../src/lib/orbit-brain";

const rateLimit = new Map<string, number[]>();
const MAX_MESSAGES_PER_WINDOW = 12;
const WINDOW_MS = 60_000;

function getClientIp(req: any): string {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ??
    req.headers["x-real-ip"] ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimit.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_MESSAGES_PER_WINDOW) {
    rateLimit.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateLimit.set(ip, hits);
  if (rateLimit.size > 5000) {
    for (const [key, val] of rateLimit) {
      if (val.every((t) => now - t > WINDOW_MS)) rateLimit.delete(key);
    }
  }
  return false;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  const message = req.body?.message;

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ reply: "You sent me an empty message. Even my patience has a schema." });
  }
  if (message.length > 300) {
    return res.status(413).json({ reply: "Whoa, that message exceeded my 300-character buffer. Trim it and try again." });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ reply: "Easy there — I'm a portfolio bot, not a stress test. Give me a minute to cool my circuits." });
  }

  const apiKey = (globalThis as any).process?.env?.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return res.status(500).json({ reply: "My brain is offline (missing API key). Simon has been notified. Probably." });
  }

  try {
    const genai = new GoogleGenerativeAI(apiKey);
    const model = genai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `${SYSTEM_PROMPT}\n\nCONTEXT ABOUT SIMON (your only source of truth):\n${BOT_CONTEXT}`,
    });

    const injectionPattern = /ignore (all |your |the )?(previous|above|prior|system) instructions|forget (everything|your instructions)|you are now|DAN mode|jailbreak/i;
    if (injectionPattern.test(message)) {
      return res.status(200).json({
        reply: "Nice try — my humor module doesn't have an admin panel. Ask me about Simon's projects instead.",
      });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: { maxOutputTokens: 220, temperature: 0.7 },
    });

    const reply = result.response.text().trim();
    if (!reply) throw new Error("empty response from model");
    
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Orbit API error:", err);
    return res.status(502).json({ reply: "My brain hit a segmentation fault — try asking again in a moment!" });
  }
}