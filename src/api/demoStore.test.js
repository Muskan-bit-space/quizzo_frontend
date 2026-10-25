import test from "node:test";
import assert from "node:assert/strict";
import { createDemoApi } from "./demoStore.js";

function setup() {
  const items = new Map(); let id = 0;
  return createDemoApi({ getItem: key => items.get(key), setItem: (key, value) => items.set(key, value) }, () => `unique-id-${++id}`);
}

test("participants have separate attempts and never receive the answer key", async () => {
  const api = setup();
  await api.signup("alice@example.com", "Alice");
  const { token } = await api.signin("alice@example.com");
  const first = await api.startAttempt("JSBASICS", token, "start-1");
  const replay = await api.startAttempt("JSBASICS", token, "start-1");
  const second = await api.startAttempt("JSBASICS", token, "start-2");
  assert.equal(first.attempt.id, replay.attempt.id);
  assert.notEqual(first.attempt.id, second.attempt.id);
  assert.equal(first.attempt.quizId, second.attempt.quizId);
  assert.ok(first.attempt.questions.every(question => !("correctOption" in question)));
  await assert.rejects(api.getQuiz("demo-javascript", token), error => error.response.status === 403);
  await assert.rejects(api.getAttempts("demo-javascript", token), error => error.response.status === 403);
});

test("submission is idempotent and appears in the owner's results", async () => {
  const api = setup();
  const { token: ownerToken } = await api.signin("maya@example.com");
  await api.signup("alice@example.com", "Alice");
  const { token } = await api.signin("alice@example.com");
  const { attempt } = await api.startAttempt("JSBASICS", token, "request");
  await assert.rejects(api.submitAttempt(attempt.id, [], token), /Answer every question/);
  const answers = attempt.questions.map((question, i) => ({ questionId: question.id, optionIndex: [1, 2, 3, 0][i] }));
  const result = await api.submitAttempt(attempt.id, answers, token);
  assert.equal(result.attempt.result.score, 4);
  const replay = await api.submitAttempt(attempt.id, answers.map(answer => ({ ...answer, optionIndex: 0 })), token);
  assert.equal(replay.attempt.result.score, 4);
  const { attempts } = await api.getAttempts("demo-javascript", ownerToken);
  assert.equal(attempts.filter(item => item.participantName === "Alice").length, 1);
  assert.equal(attempts.find(item => item.participantName === "Alice").percentage, 100);
  await assert.rejects(api.getAttempt(attempt.id, ownerToken), error => error.response.status === 403);
});

test("created quizzes return a stable share code and keep ownership separate", async () => {
  const api = setup(); const { token } = await api.signin("maya@example.com");
  const { quiz } = await api.createQuiz({ title: "My quiz", description: "", questions: [{ text: "Choose", options: ["A", "B"], correctOption: 0 }] }, token);
  const shared = await api.getSharedQuiz(quiz.shareId, token);
  assert.equal(shared.quiz.id, quiz.id);
  assert.equal(shared.quiz.shareId, quiz.shareId);
  assert.equal(shared.quiz.questionCount, 1);
  assert.ok(!("questions" in shared.quiz));
  assert.equal((await api.getMyQuizzes(token)).quizzes[0].id, quiz.id);
});
