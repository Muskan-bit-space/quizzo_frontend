import { createDemoApi } from "./demoStore.js";
// Lazily access storage so importing the API does not create preview records.
const storage = { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) };
export const demoApi = createDemoApi(storage);
