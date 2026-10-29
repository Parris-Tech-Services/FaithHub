import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import test from "node:test";
import {PASSAGES,PLANS,THEMES,validateAtlas} from "../assets/scripture-atlas-data.mjs";
const read = name => readFileSync(new URL("../"+name,import.meta.url),"utf8");
const html=read("scripture-atlas.html");
const script=read("assets/scripture-atlas.mjs");
const css=read("assets/scripture-atlas.css");
const roadmap=read("docs/faithhub-bible-prayer-feature-roadmap-2026-10-29.md");

test("Scripture indices and reading paths resolve without duplicates",()=>{
 const totals=validateAtlas();
 assert.ok(totals.passages>=120);
 assert.ok(totals.psalms>=30);
 assert.equal(totals.plans,12);
 assert.ok(totals.themes>=14);
 assert.equal(new Set(PASSAGES.map(p=>p.ref)).size,PASSAGES.length);
 for(const p of PASSAGES){
  assert.ok(p.context.length>30, p.ref+" missing context");
  assert.ok(p.question.endsWith("?"),p.ref+" prompt not a question");
  assert.ok(p.prayer.length>15,p.ref+" lacks original prayer");
  assert.ok(p.niv.startsWith("https://www.bible.com/bible/111/"),p.ref);
  assert.ok(p.web.startsWith("https://www.biblegateway.com/passage/?search="),p.ref);
  if(p.verses.includes(":"))assert.match(p.niv,/\.\d+\.\d+/,p.ref+" bad Bible.com chapter-verse URL");
 }
});
test("Curated paths provide seven verified readings",()=>{
 const seen=new Set();
 for(const plan of PLANS){
  assert.equal(plan.refs.length,7,plan.id);
  assert.ok(!seen.has(plan.id),plan.id);
  seen.add(plan.id);
  for(const ref of plan.refs)assert.ok(PASSAGES.some(x=>x.ref===ref),"Unresolved reading "+ref);
 }
});
test("Scripture Atlas page contains linked, accessible controls and no external code",()=>{
 for(const id of ["search","theme-filter","testament-filter","book-filter","psalm-only","saved-only","passage-grid","show-more","today-passage","study-ref","read-niv","read-web","plan-grid","plan-days","journal-save","journal-export","journal-delete","journal-reset"]){
  assert.ok(html.includes('id="'+id+'"'),id+" missing");
 }
 assert.ok(html.includes('aria-live="polite"'));
 assert.ok(html.includes('type="module" src="assets/scripture-atlas.mjs"'));
 assert.ok(!/<script[^>]+src=["']https?:\/\//i.test(html),"no remote scripts");
 assert.ok(css.includes("@media(max-width:560px)"));
});
test("Journal and personal marks persist only through explicit user actions",()=>{
 assert.match(script,/journal-save"\)\.addEventListener\("click"/);
 assert.match(script,/journal-delete"\)\.addEventListener\("click"/);
 assert.match(script,/journal-export"\)\.addEventListener\("click"/);
 assert.match(script,/journal-reset"\)\.addEventListener\("click"/);
 assert.match(script,/localStorage\.setItem/);
 assert.match(script,/localStorage\.removeItem/);
 assert.ok(!/\bfetch\s*\(/.test(script),"no remote calls with prayer notes");
 assert.ok(!/\bXMLHttpRequest\b/.test(script));
});
test("Application scripts are syntactically valid as browser modules",()=>{
 for(const file of ["assets/scripture-atlas.mjs","assets/scripture-atlas-data.mjs"]){
  const result=spawnSync(process.execPath,["--check",new URL("../"+file,import.meta.url).pathname],{encoding:"utf8"});
  assert.equal(result.status,0,file+": "+result.stderr);
 }
});
test("Roadmap contains a continuous, genuinely numbered faith-based backlog",()=>{
 const numbers=[...roadmap.matchAll(/^\*\*(\d{3})\./gm)].map(m=>Number(m[1]));
 assert.equal(numbers.length,182);
 assert.deepEqual(numbers,Array.from({length:182},(_,i)=>i+1));
 assert.ok(roadmap.includes("Psalm 13"));
 assert.ok(roadmap.includes("copyrighted"));
 assert.ok(roadmap.includes("Full text integration is a **future** task"));
});
test("Navigation and Vite build expose Scripture Atlas",()=>{
 assert.ok(read("index.html").includes('href="scripture-atlas.html"'));
 assert.ok(read("daily-prayer.html").includes('href="scripture-atlas.html"'));
 assert.ok(read("src/App.jsx").includes('href="scripture-atlas.html"'));
 assert.ok(read("vite.config.js").includes("atlas: fileURLToPath"));
 assert.ok(read("README.md").includes("182 prioritised"));
});
