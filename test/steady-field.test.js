import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("hidden restart button keeps its space (invisible, not display:none) so the field does not move", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /#restart\[hidden\]\s*\{[^}]*display:\s*block[^}]*visibility:\s*hidden[^}]*\}/);
  assert.match(html, /<button id="restart" hidden>/);
});
