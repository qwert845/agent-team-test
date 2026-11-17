import { test } from "node:test";
import assert from "node:assert/strict";
import { createGame, hit, tick, ROUND_SECONDS } from "../src/rules.js";

test("a new game starts at zero with the full round", () => {
  assert.deepEqual(createGame(), { score: 0, timeLeft: ROUND_SECONDS, over: false });
});

test("a hit adds one point and leaves the old state alone", () => {
  const before = createGame();
  const after = hit(before);
  assert.equal(after.score, 1);
  assert.equal(before.score, 0);
});

test("time runs out, the game ends and stops counting", () => {
  let s = tick(createGame(), ROUND_SECONDS + 5);
  assert.equal(s.timeLeft, 0);
  assert.equal(s.over, true);
  assert.equal(hit(s).score, 0);
});
