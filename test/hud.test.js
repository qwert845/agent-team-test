import { test } from "node:test";
import assert from "node:assert/strict";

test("HUD shows scores and keeps the best finished score across restarts", async () => {
  const hud = { textContent: "", style: {} };
  const timeBar = { setAttribute() {} };
  const timeBarFill = { style: {} };
  const best = { textContent: "" };
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
  const elements = { hud, best, target, field, restart, "time-bar": timeBar, "time-bar-fill": timeBarFill };
  const originalDocument = globalThis.document;
  const originalPerformance = globalThis.performance;
  const originalAnimationFrame = globalThis.requestAnimationFrame;
  let frame;

  try {
    globalThis.document = { getElementById: (id) => elements[id] };
    globalThis.performance = { now: () => 0 };
    globalThis.requestAnimationFrame = (callback) => { frame = callback; };
    await import("../src/main.js");

    assert.equal(hud.textContent, "점수 0  ·  남은 시간 0:30");
    assert.equal(best.textContent, "최고 점수 0");
    frame(30_000);
    assert.equal(hud.textContent, "끝 · 점수 0 · 최고 연속 0");
    assert.equal(best.textContent, "최고 점수 0");
    restart.click();
    assert.equal(hud.textContent, "점수 0  ·  남은 시간 0:30");
    target.click();
    assert.equal(hud.textContent, "점수 1  ·  남은 시간 0:30");
    assert.equal(best.textContent, "최고 점수 0");
    frame(30_000);
    assert.equal(hud.textContent, "끝 · 점수 1 · 최고 연속 0 · 최고 기록!");
    assert.equal(best.textContent, "최고 점수 1");
    assert.equal(restart.hidden, false);
    frame(30_000);
    assert.equal(hud.textContent, "끝 · 점수 1 · 최고 연속 0 · 최고 기록!");
    restart.click();
    assert.equal(hud.textContent, "점수 0  ·  남은 시간 0:30");
    assert.equal(best.textContent, "최고 점수 1");
    assert.equal(restart.hidden, true);
    frame(1_000);
    assert.equal(hud.textContent, "점수 0  ·  남은 시간 0:29");
    target.click();
    assert.equal(best.textContent, "최고 점수 1");
    frame(31_000);
    assert.equal(hud.textContent, "끝 · 점수 1 · 최고 연속 0");
    assert.equal(best.textContent, "최고 점수 1");
    restart.click();
    target.click();
    target.click();
    assert.equal(best.textContent, "최고 점수 1");
    frame(30_000);
    assert.equal(hud.textContent, "끝 · 점수 2 · 최고 연속 1 · 최고 기록!");
    assert.equal(best.textContent, "최고 점수 2");
    restart.click();
    assert.equal(best.textContent, "최고 점수 2");
    frame(30_000);
    assert.equal(hud.textContent, "끝 · 점수 0 · 최고 연속 0");
    assert.equal(best.textContent, "최고 점수 2");
  } finally {
    globalThis.document = originalDocument;
    globalThis.performance = originalPerformance;
    globalThis.requestAnimationFrame = originalAnimationFrame;
  }
});
