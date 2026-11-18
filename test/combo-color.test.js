import { test } from "node:test";
import assert from "node:assert/strict";
import { getComboColor, COMBO_GOLD } from "../src/combo-color.js";

test("combo text is gold from 3 and normal below that", () => {
  assert.equal(getComboColor(0), "");
  assert.equal(getComboColor(2), "");
  assert.equal(getComboColor(3), COMBO_GOLD);
  assert.equal(getComboColor(10), COMBO_GOLD);
  assert.equal(COMBO_GOLD, "#f5a524");
});

test("combo text is normal when the game is over or the value is invalid", () => {
  assert.equal(getComboColor(5, true), "");
  assert.equal(getComboColor(-1), "");
  assert.equal(getComboColor("3"), "");
  assert.equal(getComboColor(NaN), "");
  assert.equal(getComboColor(undefined), "");
});
