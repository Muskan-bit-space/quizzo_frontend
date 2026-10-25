import test from "node:test";
import assert from "node:assert/strict";
import { parseShareCode, quizPayload, safeDestination, shareUrl, validateQuestion } from "./quiz.js";

test("share links carry only a validated code", () => {
  assert.equal(parseShareCode(" JSBASICS "), "JSBASICS");
  assert.equal(parseShareCode("https://quizly.example/q/share_123?invite=yes"), "share_123");
  assert.equal(shareUrl("share_123", "https://quizly.example"), "https://quizly.example/q/share_123");
  for (const input of ["", "javascript:alert(1)", "https://example.com/other/code", "/q/%2F%2Fbad", "abc/def"]) assert.throws(() => parseShareCode(input));
  assert.equal(safeDestination("https://other.example"), "/crud");
  assert.equal(safeDestination("//other.example"), "/crud");
  assert.equal(safeDestination("/\\other.example"), "/crud");
  assert.equal(safeDestination("/q/JSBASICS"), "/q/JSBASICS");
});

test("quiz payload strips draft identifiers and untrusted ownership fields", () => {
  const result = quizPayload({ title: "  Capitals  ", owner: "someone-else", description: "  Europe  ", questions: [{ id: "draft-only", text: " Capital of France? ", options: [" Paris ", " Rome "], correctOption: 0 }] });
  assert.deepEqual(result, { title: "Capitals", description: "Europe", questions: [{ text: "Capital of France?", options: ["Paris", "Rome"], correctOption: 0 }] });
});

test("question validation rejects duplicates, empty choices and invalid indexes", () => {
  const question = { text: "Choose one", options: ["Paris", " paris "], correctOption: 0 };
  assert.match(validateQuestion(question), /different/);
  assert.match(validateQuestion({ ...question, options: ["Paris", " "] }), /Fill/);
  assert.match(validateQuestion({ ...question, options: ["Paris", "Rome"], correctOption: -1 }), /Select/);
  assert.match(validateQuestion({ ...question, options: ["Paris", "Rome"], correctOption: 2 }), /Select/);
  assert.throws(() => quizPayload({ title: "Quiz", questions: [] }), /between 1 and 200/);
});
