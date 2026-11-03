# Orbit Vercel import and font-path fix

This update addresses the exact deployed error:

`ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/src/lib/orbit/index.ts' imported from /var/task/api/chat.js`

## Apply the files

From the project root, copy these files/folders into the matching locations:

- Replace `api/chat.ts`.
- Replace `src/index.css`.
- Add the JavaScript modules in `src/lib/orbit/`.

The API now imports `../src/lib/orbit/index.js`. The knowledge-base modules are plain JavaScript ES modules, so the deployed Node runtime does not need to resolve `.ts` files at runtime.

## Remove the old TypeScript knowledge-base modules

After copying the new `.js` files, remove the old files from `src/lib/orbit/` to avoid stale duplicates:

```powershell
Remove-Item .\src\lib\orbit\*.ts
```

Do not run this until you have copied the new `.js` files and checked that the folder contains them.

## Check the expected paths

```powershell
Test-Path .\src\lib\orbit\index.js
Test-Path .\src\lib\orbit\instructions.js
Test-Path .\public\fonts\amiamie\otf\Amiamie-Regular.otf
Test-Path .\public\fonts\amiamie\ttf\Amiamie-Regular.ttf
```

All four should return `True`.

## Check local build

```powershell
npm run build
```

Then run locally:

```powershell
npm run dev
```

Ask Orbit:
- `What is Simon's complete tech stack?`
- `What projects has Simon worked on?`
- `Tell me more about DevShop.`
- `What about its database?`

Also test `do a trick`.

## Check font URLs locally

With Vite running, open these paths in your browser:

- `http://localhost:5173/fonts/amiamie/otf/Amiamie-Regular.otf`
- `http://localhost:5173/fonts/ttf/Amiamie-Regular.ttf`

They should return the font files, not a 404.

## Deployment

Do not push until the local build and chat tests pass. After pushing, wait for a new successful Vercel Production deployment, then retest `/api/chat`.

Keep `GEMINI_API_KEY` in Vercel's Production environment variables. Never put it in source code or commit it.

The API's in-memory rate limiter is only best-effort across serverless instances. Use a shared rate-limit store if globally consistent production limits are required.
