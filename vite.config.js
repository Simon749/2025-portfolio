import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import chatHandler from "./api/chat.ts";

const handler = chatHandler?.default ?? chatHandler;

function orbitApiPlugin() {
  return {
    name: "orbit-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/api/chat") return next();

        const send = (status, payload) => {
          if (res.headersSent) return;
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(JSON.stringify(payload));
        };

        if (req.method !== "POST") {
          req.body = {};
          Promise.resolve(handler(req, res)).catch((error) => {
            console.error("[Orbit] local /api/chat failed:", error);
            send(500, {
              error: "LOCAL_API_ERROR",
              reply: "Orbit is temporarily unavailable. Please try again later.",
            });
          });
          return;
        }

        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("error", (error) => {
          console.error("[Orbit] body read failed:", error);
          send(400, { error: "INVALID_JSON", reply: "Send valid JSON." });
        });
        req.on("end", () => {
          try {
            const raw = Buffer.concat(chunks).toString("utf8").trim();
            req.body = raw ? JSON.parse(raw) : {};
          } catch (error) {
            console.error("[Orbit] invalid JSON:", error);
            send(400, { error: "INVALID_JSON", reply: "Send valid JSON." });
            return;
          }

          Promise.resolve(handler(req, res)).catch((error) => {
            console.error("[Orbit] local /api/chat failed:", error);
            send(500, {
              error: "LOCAL_API_ERROR",
              reply: "Orbit is temporarily unavailable. Please try again later.",
            });
          });
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    plugins: [react(), tailwindcss(), orbitApiPlugin()],
  };
});
