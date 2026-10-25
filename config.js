// Relative /api requests work through Vite's proxy and the production server.
// Set VITE_API_URL only when hosting the API on a separate public origin.
export const BACKEND_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
