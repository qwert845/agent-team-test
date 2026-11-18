import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("assets/target.png is a 64x64 PNG and index.html shows it inside the target button", () => {
  const png = readFileSync(new URL("../assets/target.png", import.meta.url));
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 64);
  assert.equal(png.readUInt32BE(20), 64);
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /<button id="target"[^>]*><img id="target-art" src="assets\/target\.png"/);
});
