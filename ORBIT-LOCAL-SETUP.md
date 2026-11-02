# Orbit local update

This package adds a modular knowledge base and a refreshed Gemini API handler.
It deliberately leaves `src/components/PortfolioBot.jsx` unchanged so the
existing chat UI, robot avatar, and confetti interaction can be tested without
a UI redesign.

## Files to copy

Copy these paths into the matching locations in your existing Vite project:

- `api/chat.ts` (replace the existing file)
- `src/lib/orbit/` (new folder and files)

The old `src/lib/orbit-brain.ts` is no longer imported by the new API handler.
You can leave it in place temporarily, then delete it after confirming there
are no other imports.

## Environment variables

Keep your Gemini key in a local `.env` file. Do not commit it or paste it into
source files.

```env
GEMINI_API_KEY=your_real_key_here
# Optional: override the model if your Gemini account does not support the default.
GEMINI_MODEL=gemini-3.8-flash
```

The existing `vite.config.js` already loads `.env` for its local middleware
according to the repository inspection. Restart the Vite dev server after
changing environment variables.

## Run locally

From the project root in PowerShell:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite and test the chat.

Then run a production build:

```powershell
npm run build
```

## Manual test checklist

1. Ask: `What's Simon's complete tech stack?`
   - Expect a categorized answer covering frontend, backend, databases,
     authentication, payments/communications, deployment, and AI tools.
2. Ask: `Tell me about DevShop.`
   - Expect its purpose, features, technologies, and supplied links.
3. Ask: `What about its database?`
   - Expect Orbit to understand that "its" refers to DevShop.
4. Ask: `Tell me about EduTrack Kenya.`
   - Expect a project overview and no invented live URL.
5. Ask: `What is PropFlow?`
   - Expect the multi-tenant property-management context and role structure.
6. Ask: `How many years of experience does Simon have?`
   - Expect approximately two years, not three or more.
7. Ask: `Does Simon have professional Svelte experience?`
   - Expect Orbit not to claim professional Svelte/SvelteKit experience.
8. Ask: `How can I contact Simon?`
   - Expect the portfolio, GitHub, and LinkedIn URLs.
9. Type `do a trick`.
   - Expect the existing confetti interaction to continue working.
10. Send an empty message and a message longer than 700 characters.
    - Expect a validation response.
11. Stop the server, then run `npm run build`.
    - Resolve any TypeScript/Vite errors before deploying.

## Important implementation notes

- The API handler uses the existing `@google/genai` package.
- The default Gemini model is configurable through `GEMINI_MODEL`. If the model
  name is unavailable to your API key, set this variable to a model supported
  by your Google AI account.
- The in-memory rate limiter is best-effort only. Serverless instances do not
  share memory; use a shared rate-limit store before relying on it for
  production abuse prevention.
- The handler accepts the current frontend's `history` format (`role` plus
  `text`) and also accepts `content`.
- The handler returns `{ "reply": "..." }`, preserving the existing frontend
  response contract.
- Do not deploy until local tests and the production build pass.
