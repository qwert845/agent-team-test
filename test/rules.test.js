import { test } from "node:test";
import assert from "node:assert/strict";
import { createGame, hit, tick, ROUND_SECONDS } from "../src/rules.js";

test("a new game starts at zero with the full round", () => {
  assert.deepEqual(createGame(), { score: 0, timeLeft: ROUND_SECONDS, over: false, combo: 0, sinceHit: null });
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

test("a hit within 1 second of the last one raises the combo", () => {
  let s = hit(createGame());
  assert.equal(s.combo, 0);
  s = hit(tick(s, 0.5));
  assert.equal(s.combo, 1);
  s = hit(tick(s, 1));
  assert.equal(s.combo, 2);
});

test("waiting more than 1 second resets the combo to 0", () => {
  let s = hit(tick(hit(createGame()), 0.5));
  assert.equal(s.combo, 1);
  s = tick(s, 1.01);
  assert.equal(s.combo, 0);
  s = hit(s);
  assert.equal(s.combo, 0);
});

test("while the combo is 3 or more, a hit gives 2 points", () => {
  let s = hit(createGame());
  const scores = [];
  for (let i = 0; i < 4; i++) {
    s = hit(tick(s, 0.2));
    scores.push([s.combo, s.score]);
  }
  // score after first hit is 1; combo 1 -> +1, 2 -> +1, 3 -> +2, 4 -> +2
  assert.deepEqual(scores, [[1, 2], [2, 3], [3, 5], [4, 7]]);
});

test("createGame(seconds) starts with the given seconds", () => {
  assert.equal(createGame(10).timeLeft, 10);
  assert.equal(createGame(45.5).timeLeft, 45.5);
});

test("createGame falls back to 30 for missing, non-positive or non-number values", () => {
  for (const bad of [undefined, 0, -5, NaN, Infinity, "10", null]) {
    assert.equal(createGame(bad).timeLeft, 30);
  }
});
