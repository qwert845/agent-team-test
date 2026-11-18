import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";

test("pointer focus on the target does not leave an outline", () => {
  assert.match(css, /#target:focus:not\(:focus-visible\)\s*\{[^}]*\boutline:\s*none\s*;/);
});

test("keyboard focus on the target keeps its outline and restart styling is untouched", () => {
  assert.doesNotMatch(css, /#target:focus-visible\s*\{[^}]*\boutline:\s*none\s*;/);
  assert.doesNotMatch(css, /#restart(?::[^\s{]+)?\s*\{[^}]*\boutline:\s*none\s*;/);
  assert.match(html, /#target\s*\{[^}]*width:\s*64px;[^}]*height:\s*64px;[^}]*border:\s*0;[^}]*padding:\s*0;/);
});
