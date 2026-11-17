import { test } from "node:test";
import assert from "node:assert/strict";
import { isUrgent } from "../src/urgent.js";

test("more than 5 seconds left is not urgent", () => {
  assert.equal(isUrgent(30), false);
  assert.equal(isUrgent(5.01), false);
});

test("5 seconds or less is urgent", () => {
  assert.equal(isUrgent(5), true);
  assert.equal(isUrgent(0.5), true);
});

test("a finished game is not urgent", () => {
  assert.equal(isUrgent(0, true), false);
});
