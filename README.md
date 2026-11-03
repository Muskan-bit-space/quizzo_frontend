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

`npm.cmd run dev:demo` is an explicit browser-only preview using sample accounts. It does not use MongoDB or create links that work across devices.

Checks: `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`. On restricted Windows environments, build with `npm.cmd run build -- --configLoader native`.
