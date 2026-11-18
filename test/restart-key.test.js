import { test } from "node:test";
import assert from "node:assert/strict";
import { isRestartKey } from "../src/restart-key.js";

test("R restarts only a finished game", () => {
  assert.equal(isRestartKey("r", true), true);
  assert.equal(isRestartKey("R", true), true);
  assert.equal(isRestartKey("r", false), false);
  assert.equal(isRestartKey("x", true), false);
  assert.equal(isRestartKey("Enter", true), false);
});
