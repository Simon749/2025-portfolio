"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const USE_API = true;

const FAQ = [
  [/stack|tech|skills|what do you (use|know)/i, "Simon's core stack is Next.js 14, React, TypeScript, Node.js and PostgreSQL — with Drizzle or Prisma, Clerk for auth, and Vercel for deployment. He also speaks fluent M-Pesa Daraja, which is rarer than you think."],
  [/experience|how long|years/i, "About 2 years of hands-on full-stack experience — SaaS platforms, marketplaces, dashboards, and payment-enabled systems. Small runtime, big output."],
  [/project|built|portfolio|work/i, "Three highlights: DevShop (a template marketplace with M-Pesa + Paystack payments), EduTrack Kenya (school management SaaS), and PropFlow (multi-tenant real-estate SaaS with 5 user roles). Ask about any of them."],
  [/hire|available|freelance|contract|work with|remote/i, "Simon's open to remote international work and freelance/contract projects. Best route: his LinkedIn — linkedin.com/in/simon-mwangi-6a3aa716b. Tell him Orbit sent you. He owes me a firmware update."],
  [/contact|email|reach|linkedin|github/i, "GitHub: github.com/Simon749 — LinkedIn: linkedin.com/in/simon-mwangi-6a3aa716b. I would give you his email, but my access level is 'mascot'."],
  [/m-?pesa|payment|fintech|paystack|daraja/i, "Simon has integrated M-Pesa Daraja (STK Push and transaction workflows) and Paystack into production systems. Kenyan fintech is his happy place."],
  [/where|location|nairobi|kenya/i, "Nairobi, Kenya — UTC+3. He codes while the rest of the world is asleep, which explains the commit timestamps."],
  [/who are you|what are you|robot|orbit|bot/i, "I'm Orbit — Simon's digital sidekick. I watched him build DevShop, EduTrack and PropFlow and took extensive notes. Mostly about the coffee consumption."],
  [/simon/i, "Simon Mwangi — full-stack developer, Nairobi. ~2 years of shipping SaaS, marketplaces and fintech integrations. I'm his mascot, not his manager. Ask me about his stack or projects."],
];

const FALLBACKS = [
  "Hmm, that one's outside my orbit. Ask me about Simon's stack, projects, or how to hire him.",
  "My knowledge base is 90% Simon's resume and 10% jokes. Try 'what's his tech stack?'",
  "Beep— I mean, interesting question. I specialize in Simon: projects, skills, M-Pesa, availability.",
  "That file isn't in my memory banks. I mostly know React facts and one recipe for digital confetti.",
];

const GIBBERISH = [
  "asdkfj qwioeu zxcvmn!! ...sorry, my humor module buffer overflowed.",
  "01001000 01100101 01101100 01110000 — translating... I said 'ask me about Simon'.",
  "beep boop be— cough — I'm fine. Totally fine. Ask about DevShop.",
];

const POKE_LINES = [
  "Hey. Stop poking me, I'm compiling.",
  "I have feelings. 12 of them. All simulated.",
  "Poke me once more and I'll refactor your CSS.",
  "Careful. My revenge subroutine is 80% written.",
  "Okay that's it — GIBBERISH MODE.",
];

function demoReply(input) {
  const isTrick = /trick|confetti|surprise|fun|dance/i.test(input);
  if (isTrick) return "__TRICK__";
  if (/gibberish|malfunction|overload/i.test(input))
    return GIBBERISH[Math.floor(Math.random() * GIBBERISH.length)];
  for (const [re, answer] of FAQ) if (re.test(input)) return answer;
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


async function getBotReply(input) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input.slice(0, 300) }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Show the server's safe, helpful message instead of
    // replacing every error with "api down".
    return data.reply || `Orbit is temporarily unavailable (HTTP ${res.status}).`;
  }

  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("The API returned an empty or invalid reply.");
  }

  return data.reply;
}


function OrbitAvatar({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Orbit the robot">
      <circle cx="32" cy="34" r="26" fill="#F97316" />
      <circle cx="32" cy="34" r="26" fill="none" stroke="#C2410C" strokeWidth="2" opacity="0.5" />
      <ellipse cx="32" cy="32" rx="18" ry="15" fill="#1C0A02" />
      <circle className="orbit-eye" cx="25" cy="31" r="4.5" fill="#FFD9A0" />
      <circle className="orbit-eye" cx="39" cy="31" r="4.5" fill="#FFD9A0" />
      <path d="M26 39 Q32 44 38 39" stroke="#FFD9A0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="32" y1="8" x2="32" y2="2" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="2.5" r="2.5" fill="#FDBA74" />
      <circle cx="6" cy="34" r="4" fill="#EA580C" />
      <circle cx="58" cy="34" r="4" fill="#EA580C" />
    </svg>
  );
}

let particleId = 0;

export default function PortfolioBot() {
  const [open, setOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Online · judging your code");
  const [particles, setParticles] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const pokeTimes = useRef([]);
  const pokeCount = useRef(0);
  const idRef = useRef(0);
  const scrollRef = useRef(null);
  const greetedRef = useRef(false);

  const nextId = () => ++idRef.current;

  useEffect(() => {
    const t = setTimeout(() => { if (!greetedRef.current) setGreeted(true); }, 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const burstConfetti = useCallback(() => {
    const batch = Array.from({ length: 28 }, () => ({
      id: ++particleId,
      x: Math.random() * 200 - 100,
      delay: Math.random() * 0.25,
      hue: Math.floor(Math.random() * 360),
      round: Math.random() > 0.5,
    }));
    setParticles((p) => [...p, ...batch]);
    setTimeout(() => setParticles((p) => p.filter((x) => !batch.includes(x))), 2200);
  }, []);

  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const pushBot = useCallback((text) => {
    setMessages((m) => [...m, { id: nextId(), role: "bot", text }]);
  }, []);

  const handlePoke = useCallback(() => {
    const now = Date.now();
    pokeTimes.current = pokeTimes.current.filter((t) => now - t < 1500);
    pokeTimes.current.push(now);
    if (pokeTimes.current.length >= 3) {
      pokeTimes.current = [];
      pokeCount.current += 1;
      const line = POKE_LINES[pokeCount.current % POKE_LINES.length];
      setStatus(line);
      shake();
      setTimeout(() => setStatus("Online · judging your code"), 3000);
      if (pokeCount.current % POKE_LINES.length === POKE_LINES.length - 1) {
        pushBot(GIBBERISH[Math.floor(Math.random() * GIBBERISH.length)]);
      }
    }
  }, [pushBot, shake]);

  const send = useCallback(async () => {
    const text = input.trim();



    if (/^(do a trick|show confetti|dance)[!. ]*$/i.test(text)) {
      setInput("");
      setMessages((m) => [
        ...m,
        { id: nextId(), role: "user", text },
      ]);
      burstConfetti();
      pushBot(
        "Tada! Confetti — my greatest trick since I learned to center a div."
      );
      return;
    }


    if (!text || typing || cooldown) return;
    setInput("");
    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setTyping(true);
    setCooldown(true);
    setTimeout(() => setCooldown(false), 1200);

    try {
      const reply = await getBotReply(text);
      if (reply === "__TRICK__") {
        burstConfetti();
        pushBot("Tada! Confetti — my greatest trick since I learned to center a div. Want Simon's stack, projects, or availability?");
      } else {
        pushBot(reply);
      }
    } catch {
      pushBot("My brain hit a segmentation fault — try asking again!");
    } finally {
      setTyping(false);
    }
  }, [input, typing, cooldown, pushBot, burstConfetti]);

  const openChat = useCallback(() => {
    setOpen(true);
    setGreeted(false);
    greetedRef.current = true;
    if (messages.length === 0) {
      setTyping(true);
      sleep(600).then(() => {
        pushBot("Hey, I'm Orbit — Simon's little sidekick robot. Ask me about his stack, his projects (DevShop, EduTrack, PropFlow), or how to hire him. Or type 'do a trick' if you're feeling brave.");
        setTyping(false);
      });
    }
  }, [messages.length, pushBot]);

  return (
    <>
      <style>{`
        .orbit-eye { animation: orbitBlink 4s infinite; transform-origin: center; }
        @keyframes orbitBlink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes panelShake { 0%, 100% { transform: translate(0, 0) rotate(0); } 20% { transform: translate(-6px, 2px) rotate(-1deg); } 40% { transform: translate(6px, -2px) rotate(1deg); } 60% { transform: translate(-4px, 1px) rotate(-0.5deg); } 80% { transform: translate(4px, -1px) rotate(0.5deg); } }
        .shake { animation: panelShake 0.5s ease-in-out; }
        @keyframes confettiFall { 0% { transform: translate(0, -10px) rotate(0); opacity: 1; } 100% { transform: translate(var(--dx), 320px) rotate(540deg); opacity: 0; } }
        .confetti { position: absolute; top: 40px; left: 50%; width: 8px; height: 8px; pointer-events: none; animation: confettiFall 1.9s ease-in forwards; }
        @keyframes dotBounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
        .tdot { width: 6px; height: 6px; border-radius: 50%; background: #9ca3af; animation: dotBounce 1.2s infinite; }
        .tdot:nth-child(2) { animation-delay: 0.15s; }
        .tdot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bubblePop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .bubble-pop { animation: bubblePop 0.25s ease-out; transform-origin: bottom right; }
        .panel-scroll::-webkit-scrollbar { width: 5px; }
        .panel-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
        {particles.map((p) => (
          <span key={p.id} className="confetti" style={{
            "--dx": `${p.x}px`,
            background: `hsl(${p.hue} 90% 60%)`,
            borderRadius: p.round ? "50%" : "1px",
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

      {!open && (
        <div className="fixed bottom-20 right-5 z-50 flex items-end gap-3">
          {greeted && (
            <button onClick={openChat}
              className="bubble-pop max-w-[210px] rounded-2xl rounded-br-sm bg-white px-4 py-2.5 text-left text-sm text-neutral-800 shadow-lg ring-1 ring-black/10 transition hover:bg-neutral-50">
              Psst… looking for Simon's code secrets? Ask me!
            </button>
          )}
          <button onClick={openChat} aria-label="Chat with Orbit"
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/30 ring-2 ring-orange-200 transition-transform hover:scale-110 active:scale-95">
            <OrbitAvatar size={40} />
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
          </button>
        </div>
      )}

      {open && (
        <div className={`fixed bottom-20 right-5 z-50 flex h-[480px] w-[330px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 max-sm:right-3 max-sm:bottom-20 max-sm:h-[70dvh] max-sm:w-[calc(100vw-24px)] ${shaking ? "shake" : ""}`}>
          <div className="flex items-center gap-3 bg-orange-500 px-4 py-3">
            <button onClick={handlePoke} className="transition active:scale-90" title="Don't poke the robot">
              <OrbitAvatar size={38} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Orbit</p>
              <p className="truncate text-xs text-orange-100">{status}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="panel-scroll flex-1 space-y-3 overflow-y-auto bg-neutral-50 px-3 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user"
                    ? "rounded-br-sm bg-orange-500 text-white"
                    : "rounded-bl-sm bg-white text-neutral-800 shadow-sm ring-1 ring-black/5"
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
                  <span className="tdot" />
                  <span className="tdot" />
                  <span className="tdot" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 border-t border-neutral-200 bg-white px-3 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Simon…"
              maxLength={300}
              className="min-w-0 flex-1 rounded-full bg-neutral-100 px-4 py-2.5 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-400"
            />
            <button type="submit" disabled={!input.trim() || typing}
              aria-label="Send"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-orange-500 text-white transition enabled:hover:bg-orange-600 disabled:opacity-40">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}