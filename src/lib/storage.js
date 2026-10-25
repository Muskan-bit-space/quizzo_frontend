export function readStorage(key, fallback, storage) {
  try { return JSON.parse((storage || localStorage).getItem(key)) ?? fallback; } catch { return fallback; }
}
export function writeStorage(key, value, storage) {
  try { (storage || localStorage).setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
