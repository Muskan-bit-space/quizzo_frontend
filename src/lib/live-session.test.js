import test from "node:test";
import assert from "node:assert/strict";
import { normalizeRoomCode, remainingSeconds, socketCommand } from "./live-session.js";

test("the countdown follows the supplied absolute server deadline including elapsed and missed time", () => {
  const deadline = new Date(130000).toISOString();
  assert.equal(remainingSeconds(deadline, 100000), 30);
  assert.equal(remainingSeconds(deadline, 114500), 16);
  assert.equal(remainingSeconds(deadline, 129999), 1);
  assert.equal(remainingSeconds(deadline, 130000), 0);
  assert.equal(remainingSeconds(deadline, 190000), 0);
  assert.equal(remainingSeconds(null, 100000), 0);
  assert.equal(normalizeRoomCode(" abcd2345 "), "ABCD2345");
  assert.throws(() => normalizeRoomCode("bad"));
});
test("command acknowledgements distinguish accepted, rejected, disconnected and unconfirmed writes", async () => {
  await assert.rejects(socketCommand(null, "answer:submit", {}), /disconnected/);
  const socket = (err, response) => ({ connected: true, timeout(ms) { assert.equal(ms, 10000); return this; }, emit(event, payload, callback) {
    assert.equal(event, "answer:submit"); assert.deepEqual(payload, { optionIndex: 1 }); callback(err, response);
  } });
  assert.deepEqual(await socketCommand(socket(null, { ok: true, data: { recorded: true } }), "answer:submit", { optionIndex: 1 }), { recorded: true });
  await assert.rejects(socketCommand(socket(null, { ok: false, error: { status: 409, message: "Already recorded" } }), "answer:submit", { optionIndex: 1 }), e => e.status === 409);
  await assert.rejects(socketCommand(socket(new Error("timeout")), "answer:submit", { optionIndex: 1 }), /Synchronizing/);
});
