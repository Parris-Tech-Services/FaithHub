import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const guide = read("prayer-practice.html");
const home = read("index.html");
const react = read("src/App.jsx");
const research = read("docs/prayer/john-mark-comer-talking-with-god-2026-10-29.md");

test("four forms are available with labelled optional notes and opt-in persistence", () => {
  for (const kind of ["thankfulness", "lament", "petition", "intercession"]) {
    assert.ok(guide.includes('id="' + kind + '"'), kind + " section is missing");
    assert.ok(guide.includes('data-save="' + kind + '"'), kind + " save control is missing");
    assert.ok(guide.includes('data-clear="' + kind + '"'), kind + " clear control is missing");
    assert.ok(guide.includes('data-status="' + kind + '"'), kind + " live status is missing");
  }
  assert.ok(guide.includes("window.confirm("), "clear-all requires confirmation");
  assert.ok(guide.includes("Saved on this device."));
  assert.ok(guide.includes("No streaks. No scores."));
  assert.ok(!/<script\s+src=/i.test(guide), "standalone guide should not load remote scripts");
});

test("guide and research distinguish the official four sessions from the adapted four forms", () => {
  assert.match(guide, /talking to God, talking with God, listening to God, and being with God/i);
  assert.match(research, /petition.*intercession.*separate, related practices/i);
  assert.match(research, /The Prayer Practice/);
  assert.match(research, /independently transcribed/i);
  assert.match(guide, /https:\/\/www\.practicingtheway\.org\/prayer/);
});

test("pages link together and their inline JavaScript is syntactically valid", () => {
  assert.ok(home.includes('href="prayer-practice.html"'));
  assert.ok(react.includes('href="prayer-practice.html"'));
  for (const [name, html] of [["index.html", home], ["prayer-practice.html", guide]]) {
    const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1].trim()).filter(Boolean);
    assert.ok(scripts.length > 0, name + " has no inline script");
    for (const code of scripts) assert.doesNotThrow(() => new vm.Script(code, { filename: name }));
  }
});
