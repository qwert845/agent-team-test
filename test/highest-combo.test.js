import { test } from "node:test";
import assert from "node:assert/strict";
import { updateHighestCombo } from "../src/highest-combo.js";

test("highest combo keeps the largest combo reached during the round", () => {
  let highest = 0;
  for (const combo of [0, 1, 3, 2, 0, 2]) {
    highest = updateHighestCombo(highest, combo);
  }
  assert.equal(highest, 3);
});

test("highest combo stays zero without a positive combo", () => {
  assert.equal(updateHighestCombo(0, 0), 0);
});
