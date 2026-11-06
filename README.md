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

## Troubleshooting reload and direct-link errors

### Reported shortcoming and usability impact

On 6 November 2026, refreshing the deployed frontend was reported to show a hosting error: **This page doesn't exist**, `404 NOT_FOUND`. The screenshot appears to be Vercel's error page. The source inspection found a missing single-page application (SPA) fallback, which explains the pattern where navigation inside the app works but reloading a nested URL fails. The deployed URL was not independently tested.

This affects more than the reload button: bookmarks, shared quiz links, and opening nested URLs in a new tab can fail before the app loads. It is independent of demo mode and does not, by itself, mean the quiz or account was deleted.

### Why navigation works but a reload fails

[all_routes.jsx](src/logic/all_routes.jsx) uses React Router's `BrowserRouter`. Once the app is loaded, clicking an internal link lets React change the URL and render a screen without requesting a new HTML document from the host.

Reloading `/crud`, or opening `/q/<shareId>` directly, instead requests that path from Vercel first. Vite builds one entry document, `dist/index.html`; it does not create a physical HTML file for each React route. Without a hosting fallback, Vercel can return its own 404 before React Router or the authentication guard runs. Local Vite development handles SPA navigation, so working locally does not verify production routing.

### Temporary workaround and lasting fix

Until the corrected deployment is available, open the site's root URL (`/`), sign in if needed, and navigate using the app's buttons. For a shared quiz, use **Join a quiz** and paste its link/code after entering the app. This can restore access when the root page works, but it does not fix refreshes or direct links. If `/` also fails, investigate the deployment itself.

The existing [vercel.json](vercel.json) supplies the lasting fix: its `/(.*)` rewrite serves `/index.html` for application routes while keeping the requested browser URL. React Router then resolves that URL and applies the usual sign-in requirements. Vercel continues to serve existing build assets normally. Include this file in the Vercel project root and deploy the revision containing it; a local configuration change cannot update an already deployed site.

For split hosting, keep `VITE_API_URL` pointed at the public backend. The SPA rewrite does not implement API endpoints or proxy live sockets. The production build passed after the routing configuration was added; the deployed refresh behavior still requires the checks below.

### How to debug similar errors

1. **Record the failing address and trigger.** Compare `/`, `/auth/signin`, and the affected nested URL. Try both in-app navigation and a direct open/reload. Note the deployed revision and whether the deployment URL and custom domain behave differently.
2. **Inspect the document request.** Open browser DevTools, select **Network**, enable **Preserve log**, and reload. Inspect the request with type **document**, its status, response body, and headers. A hosting-branded 404 means the entry document was not served. React's own not-found screen means the app loaded and its route matching needs inspection. An API request returning 404 after the page loads is a separate failure.
3. **Check the deployed build and fallback.** Confirm the deployment succeeded, includes `vercel.json`, and uses the intended branch/commit. Check the Vite preset, `npm run build`, and `dist` output. Root Directory is empty for the frontend-only repo, or `frontend` for a repo containing both apps. Verify `index.html` exists in the output and the configuration is inside the selected project root. Redeploy after correcting these settings.
4. **If the document loads, inspect the next failing request.** Missing JavaScript/CSS, a module MIME-type error, or HTML returned for an asset points to asset paths/build output or fallback handling. A Console exception after assets load points to frontend execution. Do not treat every blank screen as the same hosting 404.
5. **Check API and session failures separately.** Inspect the actual request URL. For Vercel plus a separate backend, REST requests must reach the backend origin configured by build-time `VITE_API_URL`. A same-origin `/api/...` response containing HTML can mean the SPA fallback caught a misdirected API request. Check the backend `/health`, backend logs, and exact `CORS_ORIGIN`. A 401/403 on session restoration needs authentication/authorization investigation; it is different from a missing HTML document.
6. **Verify the deployed result.** Directly open and reload `/auth/signin`; sign in and reload `/crud`; open a real shared `/q/<shareId>` link in a new tab. A signed-out protected route should reach sign-in, then return to the requested destination. Confirm successful document and asset requests, working API calls, and no hosting 404. Compare the deployment URL with the custom domain if only one still fails.

For an independent HTTP check, run `curl.exe -i https://<your-frontend-domain>/auth/signin` on Windows (replace the placeholder). Expect HTTP 200 and the app's HTML entry document. This verifies the document response only; it does not execute React, restore a session, or prove API/live-room behavior. A successful local production build likewise does not prove the deployed rewrite is active.

Keep the failing URL, timestamp, HTTP status, hosting request ID, and relevant deployment/backend logs when reporting the issue. Remove passwords, tokens, and database credentials from anything shared. Clearing browser storage is not a routing fix and can remove local drafts or unfinished selections.

## Browser-only demo

`npm.cmd run dev:demo` is an explicit browser-only preview using sample accounts. It does not use MongoDB or create links that work across devices.

Checks: `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`. On restricted Windows environments, build with `npm.cmd run build -- --configLoader native`.
