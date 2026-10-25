import client from "./axios.jsx";
import { DEMO_MODE } from "../../config.js";
import { demoApi } from "./demoApi.js";
import { quizPayload } from "../lib/quiz.js";
const authenticated = token => {
  if (!token) throw new Error("Please sign in to continue.");
  return { headers: { Authorization: `Bearer ${token}` } };
};
const part = value => encodeURIComponent(value);
const Quiz_Handler = {
  async createQuiz(quiz, token) {
    const payload = quizPayload(quiz);
    if (DEMO_MODE) return demoApi.createQuiz(payload, token);
    const { data } = await client.post("/api/quizzes", payload, authenticated(token));
    return data;
  },
  async getMyQuizzes(token) {
    if (DEMO_MODE) return demoApi.getMyQuizzes(token);
    return (await client.get("/api/quizzes", authenticated(token))).data;
  },
  async getQuiz(id, token) {
    if (DEMO_MODE) return demoApi.getQuiz(id, token);
    return (await client.get(`/api/quizzes/${part(id)}`, authenticated(token))).data;
  },
  async getAttempts(id, token) {
    if (DEMO_MODE) return demoApi.getAttempts(id, token);
    return (await client.get(`/api/quizzes/${part(id)}/attempts`, authenticated(token))).data;
  },
  async getSharedQuiz(code, token) {
    if (DEMO_MODE) return demoApi.getSharedQuiz(code, token);
    return (await client.get(`/api/shared/quizzes/${part(code)}`, authenticated(token))).data;
  },
  async startAttempt(code, token, requestId) {
    if (DEMO_MODE) return demoApi.startAttempt(code, token, requestId);
    const config = authenticated(token);
    config.headers["Idempotency-Key"] = requestId;
    return (await client.post(`/api/shared/quizzes/${part(code)}/attempts`, {}, config)).data;
  },
  async getAttempt(id, token) {
    if (DEMO_MODE) return demoApi.getAttempt(id, token);
    return (await client.get(`/api/attempts/${part(id)}`, authenticated(token))).data;
  },
  async submitAttempt(id, answers, token) {
    if (DEMO_MODE) return demoApi.submitAttempt(id, answers, token);
    const config = authenticated(token);
    config.headers["Idempotency-Key"] = `submit-${id}`;
    return (await client.post(`/api/attempts/${part(id)}/submit`, { answers }, config)).data;
  },
};
export default Quiz_Handler;
