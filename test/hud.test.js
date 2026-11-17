import { test } from "node:test";
import assert from "node:assert/strict";

test("HUD shows the current score on start, hit, and finish", async () => {
  const hud = { textContent: "", style: {} };
  const target = {
    style: {},
    addEventListener(event, listener) {
      if (event === "click") this.click = listener;
    },
  };
  const field = { clientWidth: 640, clientHeight: 360 };
  const restart = {
    hidden: true,
    addEventListener(event, listener) {
      if (event === "click") this.click = listener;
    },
  };
  const elements = { hud, target, field, restart };
  const originalDocument = globalThis.document;
  const originalPerformance = globalThis.performance;
  const originalAnimationFrame = globalThis.requestAnimationFrame;
  let frame;

  try {
    globalThis.document = { getElementById: (id) => elements[id] };
    globalThis.performance = { now: () => 0 };
    globalThis.requestAnimationFrame = (callback) => { frame = callback; };
    await import("../src/main.js");

    assert.equal(hud.textContent, "점수 0  ·  남은 시간 30초");
    target.click();
    assert.equal(hud.textContent, "점수 1  ·  남은 시간 30초");
    frame(30_000);
    assert.equal(hud.textContent, "끝 · 점수 1");
    assert.equal(restart.hidden, false);
    restart.click();
    assert.equal(hud.textContent, "점수 0  ·  남은 시간 30초");
    assert.equal(restart.hidden, true);
    frame(1_000);
    assert.equal(hud.textContent, "점수 0  ·  남은 시간 29초");
  } finally {
    globalThis.document = originalDocument;
    globalThis.performance = originalPerformance;
    globalThis.requestAnimationFrame = originalAnimationFrame;
  }
});
