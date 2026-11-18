import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("assets/background.png is a 640x360 PNG and #field uses it over the solid fallback color", () => {
  const png = readFileSync(new URL("../assets/background.png", import.meta.url));
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 640);
  assert.equal(png.readUInt32BE(20), 360);
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /#field \{[^}]*background: url\("assets\/background\.png"\)[^}]*, #2a2a2e;/);
});
