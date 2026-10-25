# Quizly frontend

React/Vite UI for publishing quizzes, sharing links, taking self-paced quizzes, and viewing participant results.

- [UI architecture and workflow](documentation/overview.md)
- [Shared backend contract](documentation/backend-contract.md)
- [Backend setup](../quizzo_backend/README.md)
- [Verification status](../quizzo_backend/documentation/verification.md)

Install with `npm.cmd ci`, start the backend, then run `npm.cmd run dev`. Vite proxies `/api` to `http://127.0.0.1:4444` by default. See [.env.example](.env.example) for an alternate proxy destination or separately hosted API.

For the complete app on one origin, run `npm.cmd run build` and follow the backend guide to serve this folder's `dist`.

`npm.cmd run dev:demo` is an explicit browser-only preview using sample accounts. It does not use MongoDB or create links that work across devices.

Checks: `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run build`. On restricted Windows environments, build with `npm.cmd run build -- --configLoader native`.
