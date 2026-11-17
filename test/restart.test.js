import { test } from "node:test";
import assert from "node:assert/strict";
import { isRestartVisible } from "../src/restart.js";
import { createGame, tick } from "../src/rules.js";

test("restart button is hidden before the game ends", () => {
  assert.equal(isRestartVisible(createGame().over), false);
  assert.equal(isRestartVisible(tick(createGame(), 29).over), false);
});

test("restart button is visible once the game is over", () => {
  assert.equal(isRestartVisible(tick(createGame(), 30).over), true);
});

test("a new game hides the restart button again", () => {
  const over = tick(createGame(), 30);
  assert.equal(isRestartVisible(over.over), true);
  const fresh = createGame();
  assert.equal(fresh.score, 0);
  assert.equal(fresh.timeLeft, 30);
  assert.equal(isRestartVisible(fresh.over), false);
});
