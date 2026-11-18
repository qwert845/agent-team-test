import { test } from "node:test";
import assert from "node:assert/strict";
import { getTimeBar, TIME_BAR_COLOR } from "../src/time-bar.js";
import { URGENT_COLOR } from "../src/urgent.js";

test("time bar keeps fractional ratios and clamps them to 0–1", () => {
  assert.deepEqual(getTimeBar(30, 30), { ratio: 1, color: TIME_BAR_COLOR });
  assert.deepEqual(getTimeBar(15, 30), { ratio: 0.5, color: TIME_BAR_COLOR });
  assert.deepEqual(getTimeBar(7.5, 30), { ratio: 0.25, color: TIME_BAR_COLOR });
  assert.deepEqual(getTimeBar(31, 30), { ratio: 1, color: TIME_BAR_COLOR });
  assert.deepEqual(getTimeBar(0, 30), { ratio: 0, color: URGENT_COLOR });
  assert.deepEqual(getTimeBar(-1, 30), { ratio: 0, color: URGENT_COLOR });
});

test("time bar uses zero progress for invalid display inputs", () => {
  assert.deepEqual(getTimeBar(10, 0), { ratio: 0, color: TIME_BAR_COLOR });
  assert.deepEqual(getTimeBar(10, -30), { ratio: 0, color: TIME_BAR_COLOR });
  assert.deepEqual(getTimeBar("10", 30), { ratio: 0, color: TIME_BAR_COLOR });
  assert.deepEqual(getTimeBar(NaN, 30), { ratio: 0, color: TIME_BAR_COLOR });
});

test("time bar becomes red at 5 seconds and clears to its original color when over", () => {
  assert.deepEqual(getTimeBar(5.01, 30), { ratio: 5.01 / 30, color: TIME_BAR_COLOR });
  assert.deepEqual(getTimeBar(5, 30), { ratio: 5 / 30, color: URGENT_COLOR });
  assert.deepEqual(getTimeBar(0, 30, true), { ratio: 0, color: TIME_BAR_COLOR });
});

test("time bar shrinks during play and refills on restart", async () => {
  const hud = { textContent: "", style: {} };
  const best = { textContent: "" };
  const combo = { textContent: "", style: {} };
  const field = { clientWidth: 640, clientHeight: 360 };
  const target = { style: {}, addEventListener() {} };
  const restart = {
    hidden: true,
    addEventListener(event, listener) {
      if (event === "click") this.click = listener;
    },
  };
  const values = {};
  const timeBar = { setAttribute(name, value) { values[name] = value; } };
  const timeBarFill = { style: {} };
  const elements = { hud, best, combo, field, target, restart, "time-bar": timeBar, "time-bar-fill": timeBarFill };
  const originalDocument = globalThis.document;
  const originalPerformance = globalThis.performance;
  const originalAnimationFrame = globalThis.requestAnimationFrame;
  let frame;

  try {
    globalThis.document = { getElementById: (id) => elements[id] };
    globalThis.performance = { now: () => 0 };
    globalThis.requestAnimationFrame = (callback) => { frame = callback; };
    await import("../src/main.js");

    assert.equal(timeBarFill.style.width, "100%");
    frame(15_000.0000002);
    assert.equal(values["aria-valuenow"], "50");
    assert.notEqual(timeBarFill.style.width, "50%");
    frame(22_500);
    assert.equal(timeBarFill.style.width, "25%");
    assert.equal(timeBarFill.style.backgroundColor, TIME_BAR_COLOR);
    frame(25_000);
    assert.equal(timeBarFill.style.backgroundColor, URGENT_COLOR);
    frame(30_000);
    assert.equal(timeBarFill.style.width, "0%");
    assert.equal(timeBarFill.style.backgroundColor, TIME_BAR_COLOR);
    assert.equal(values["aria-valuenow"], "0");
    restart.click();
    assert.equal(timeBarFill.style.width, "100%");
    assert.equal(values["aria-valuenow"], "100");
  } finally {
    globalThis.document = originalDocument;
    globalThis.performance = originalPerformance;
    globalThis.requestAnimationFrame = originalAnimationFrame;
  }
});
