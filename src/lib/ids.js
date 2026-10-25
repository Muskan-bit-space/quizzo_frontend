// getRandomValues also works on a local-network HTTP origin, where browsers
// may not expose randomUUID. These identify drafts and requests, not sessions.
export function createId() {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return Array.from(globalThis.crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, "0")).join("");
}
