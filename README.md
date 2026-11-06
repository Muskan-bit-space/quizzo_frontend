# Quizly frontend

React/Vite UI for publishing quizzes, sharing links, taking self-paced quizzes, and viewing participant results.

- [UI architecture and workflow](documentation/overview.md)
- [Shared backend contract](documentation/backend-contract.md)
- [Backend setup](../backend/README.md)
- [Verification status](../backend/documentation/verification.md)
- [Real-time multiplayer sessions](../backend/documentation/realtime-sessions.md)

Install with `npm.cmd ci`, start the backend, then run `npm.cmd run dev`. Vite proxies `/api` to `http://127.0.0.1:4444` by default. See [.env.example](.env.example) for an alternate proxy destination or separately hosted API.

To play together, open your saved quiz and click **Host this quiz live**, then **Create live room**. The waiting room displays the **8-character room code**. Participants sign in and open **Join a quiz -> Join a live room**. Live rooms have their own code; the existing longer `/q/...` quiz code continues to open a self-paced quiz. Vite also proxies `/socket.io`, including WebSocket upgrades. Run one backend process per database; see the feature guide for recovery and deployment details.

For the complete app on one origin, run `npm.cmd run build` and follow the backend guide to serve this folder's `dist`.

## Deploy the frontend to Vercel

Use the **Vite** framework preset, Build Command `npm run build`, and Output Directory `dist`. Leave Root Directory empty for the frontend-only repository; set it to `frontend` only if the connected repository contains both folders.

The included [vercel.json](vercel.json) rewrites application URLs to `index.html` so React Router can resolve them. This allows refreshing or directly opening routes such as `/crud`, `/q/:shareId`, and `/live/:sessionId` without Vercel returning `404 NOT_FOUND`. Commit and push this configuration to the connected branch, then redeploy for it to take effect.

For the real app, set `VITE_DEMO_MODE=false` and `VITE_API_URL` to the public backend origin (for example, `https://<your-service>.onrender.com`) in Vercel's environment settings. These values are embedded at build time, so changing them requires a new deployment. The Vite development proxy does not run on Vercel; REST and Socket.IO must reach the separately hosted backend. Set backend `CORS_ORIGIN` to the frontend's exact HTTPS origin.

After deployment, open `/auth/signin` directly and refresh it, then sign in and refresh `/crud`. Also verify that a shared quiz link opens from a new tab. If `/` itself returns Vercel's 404, check the deployment/domain and Root Directory settings as well.

## Browser-only demo

`npm.cmd run dev:demo` is an explicit browser-only preview using sample accounts. It does not use MongoDB or create links that work across devices.

Checks: `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`. On restricted Windows environments, build with `npm.cmd run build -- --configLoader native`.
