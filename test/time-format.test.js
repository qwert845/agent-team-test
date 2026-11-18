import { test } from "node:test";
import assert from "node:assert/strict";
import { formatRemainingTime } from "../src/time-format.js";

test("remaining time displays minutes and two-digit seconds after rounding up", () => {
  assert.equal(formatRemainingTime(30), "0:30");
  assert.equal(formatRemainingTime(9), "0:09");
  assert.equal(formatRemainingTime(0), "0:00");
  assert.equal(formatRemainingTime(60), "1:00");
  assert.equal(formatRemainingTime(29.2), "0:30");
  assert.equal(formatRemainingTime(60.1), "1:01");
});

test("invalid display values show zero remaining", () => {
  assert.equal(formatRemainingTime(-1), "0:00");
  assert.equal(formatRemainingTime("10"), "0:00");
  assert.equal(formatRemainingTime(Number.NaN), "0:00");
});
