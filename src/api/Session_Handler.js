import client from "./axios.jsx";
import { DEMO_MODE } from "../../config.js";

const auth = token => {
  if (DEMO_MODE) throw new Error("Live rooms require the connected backend. Start the app in normal mode to host or join.");
  if (!token) throw new Error("Please sign in to continue.");
  return { headers: { Authorization: `Bearer ${token}` } };
};
const Session_Handler = {
  async create(quizId, token) { return (await client.post("/api/sessions", { quizId }, auth(token))).data; },
  async join(roomCode, displayName, token) { return (await client.post("/api/sessions/join", { roomCode, displayName }, auth(token))).data; },
  async list(token) { return (await client.get("/api/sessions", auth(token))).data; },
  async results(id, token) { return (await client.get(`/api/sessions/${encodeURIComponent(id)}/results`, auth(token))).data; },
};
export default Session_Handler;
