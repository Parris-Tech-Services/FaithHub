import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";
import test from "node:test";
const get=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const home=get("index.html");
const deploy=get(".github/workflows/deploy.yml");
const css=home.match(/<style>([\s\S]*?)<\/style>/)?.[1]||"";
const scripts=[...home.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);

test("The deployment cannot put the Podcasts link over the mobile navigation",()=>{
 assert.doesNotMatch(deploy,/position\s*:\s*fixed/i,"Do not inject a fixed-position Podcasts link");
 assert.doesNotMatch(deploy,/<a[^>]*id="faithhub-podcast-button"/,"Do not render the old launcher");
 assert.match(deploy,/podcast_nav/,"Keep the shortcut available on pages without their own navigation");
 assert.match(deploy,/href="podcasts\.html"/,"Home uses direct in-flow navigation");
 assert.match(home,/<a class="study-link" href="podcasts\.html">Faith podcasts<\/a>/);
 assert.match(home,/<details class="resource-links">/);
 assert.match(home,/<summary>Explore Scripture, prayer and learning<\/summary>/);
 assert.match(css,/\.resource-link-grid/);
});
test("Settings control is docked in the page flow with contrast and a 48px target",()=>{
 assert.match(home,/id="faithhub-tools-slot"/);
 assert.match(home,/[\x27\x22]parris-tools-launcher[\x27\x22]/);
 assert.match(home,/new MutationObserver\(combinedDock\)/);
 assert.match(home,/id="faithhub-analytics-slot"/);
 assert.match(home,/dockAnalytics/);
 assert.match(css,/#parris-tools-launcher\s*\{/);
 assert.match(css,/position:\s*static\s*!important/);
 assert.match(css,/width:\s*48px\s*!important/);
 assert.match(css,/height:\s*48px\s*!important/);
 assert.match(css,/min-width:\s*48px\s*!important/);
 assert.match(css,/min-height:\s*48px\s*!important/);
 assert.match(css,/opacity:\s*1\s*!important/);
 assert.match(css,/background:\s*var\(--active-bg\)\s*!important/);
 assert.match(css,/color:\s*var\(--active-fg\)\s*!important/);
 assert.match(css,/#parris-tools-panel[\s\S]*?position:\s*absolute\s*!important/);
 assert.match(home,/>App settings<\/span>/);
});
test("Tabs, date input and keyboard have accessible names and focus",()=>{
 assert.match(home,/class="skip-link" href="#app"/);
 assert.match(home,/id="tabs" role="tablist" aria-label="FaithHub daily areas"/);
 assert.match(home,/id="app" role="tabpanel" aria-labelledby="tab-today"/);
 assert.match(home,/for="date">Practice date/);
 assert.match(home,/role="tab"/);
 assert.match(home,/aria-selected=/);
 assert.match(home,/event\.key === 'ArrowRight'/);
 assert.match(home,/event\.key === 'ArrowLeft'/);
 assert.match(css,/focus-visible/);
});
test("Reflection typing no longer destroys the focused field on each keystroke",()=>{
 assert.match(home,/function setReflection\(key, value\) \{ entry\(\)\.reflection\[key\] = value; saveState\(\); updateMeter\(\); \}/);
 assert.doesNotMatch(home,/function setReflection\(key, value\)[^\n]*render\(\)/);
 assert.match(home,/entry\(\)\[section\]\[key\] = element\.value;\s*saveState\(\)/);
 assert.match(home,/document\.querySelector\('\[data-rhythm="' \+ id \+ '"\]'\)\?\.focus\(\)/);
});
test("Daily date is the local day and destructive resets ask first",()=>{
 assert.match(home,/now\.getFullYear\(\)/);
 assert.match(home,/now\.getMonth\(\) \+ 1/);
 assert.doesNotMatch(home,/new Date\(\)\.toISOString\(\)\.slice\(0, 10\)/);
 assert.match(home,/window\.confirm\('Delete all saved rhythms and reflections/);
});
test("Homepage inline scripts remain valid JavaScript",()=>{
 assert.ok(scripts.length>=2);
 for(const script of scripts) assert.doesNotThrow(()=>new Script(script), "Invalid inline JavaScript");
});
test("Reduced motion and small viewport layout are addressed",()=>{
 assert.match(css,/@media\s*\(max-width:\s*520px\)/);
 assert.match(css,/grid-template-columns:\s*repeat\(3,minmax\(0,1fr\)\)/);
 assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
 assert.match(css,/min-height:\s*44px/);
});
