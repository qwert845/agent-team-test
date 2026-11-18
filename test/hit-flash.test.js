import { test } from "node:test";
import assert from "node:assert/strict";
import { getTargetColor, FLASH_COLOR, TARGET_COLOR } from "../src/hit-flash.js";
import { createGame, hit, tick } from "../src/rules.js";

test("target is bright right after a hit and returns to normal at exactly 0.15s", () => {
  assert.equal(getTargetColor(0), FLASH_COLOR);
  assert.equal(getTargetColor(0.14), FLASH_COLOR);
  assert.equal(getTargetColor(0.15), TARGET_COLOR);
  assert.equal(getTargetColor(1), TARGET_COLOR);
});

test("target is normal before any hit, after the game is over, and for invalid input", () => {
  assert.equal(getTargetColor(null), TARGET_COLOR);
  assert.equal(getTargetColor(0, true), TARGET_COLOR);
  assert.equal(getTargetColor(-1), TARGET_COLOR);
  assert.equal(getTargetColor("0"), TARGET_COLOR);
  assert.equal(getTargetColor(NaN), TARGET_COLOR);
});

test("hitting again within 0.15s restarts the flash; hitting after game over does not flash", () => {
  let s = hit(createGame());
  s = tick(s, 0.1);
  assert.equal(getTargetColor(s.sinceHit, s.over), FLASH_COLOR);
  s = hit(s);
  s = tick(s, 0.1);
  assert.equal(getTargetColor(s.sinceHit, s.over), FLASH_COLOR);
  s = tick(s, 0.05);
  assert.equal(getTargetColor(s.sinceHit, s.over), TARGET_COLOR);
  let over = tick(hit(createGame()), 100);
  over = hit(over);
  assert.equal(getTargetColor(over.sinceHit, over.over), TARGET_COLOR);
});
