import { test } from "node:test";
import assert from "node:assert/strict";
import { isNewBestScore } from "../src/best-score.js";

test("a finished score must beat the previous best to set a new record", () => {
  assert.equal(isNewBestScore(0, 0), false);
  assert.equal(isNewBestScore(1, 0), true);
  assert.equal(isNewBestScore(1, 1), false);
  assert.equal(isNewBestScore(0, 1), false);
  assert.equal(isNewBestScore(2, 1), true);
});
