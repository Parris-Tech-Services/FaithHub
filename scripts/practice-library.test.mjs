import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {practices,gospelJourney,familyPrayers,findPractices} from '../assets/practice-library.mjs';
test('practice search finds relevant Scripture and handles empty or unmatched queries',()=>{assert.equal(findPractices('').length,12);assert.ok(findPractices('  JAMES  ').some(p=>p.id==='discern'));assert.equal(findPractices('zzzz-no-match').length,0);assert.ok(findPractices('lament').some(p=>p.id==='lament'));});
test('all practices and reading paths have contextual Scripture and actionable prompts',()=>{assert.equal(new Set(practices.map(p=>p.id)).size,12);for(const p of practices){assert.ok(p.context.length>30);assert.ok(p.steps.length>=3);assert.match(p.passage,/^[A-Z1-3]+\.\d/);}assert.equal(gospelJourney.length,7);assert.equal(familyPrayers.length,4);});
test('roadmap maintains 100 stable unique feature numbers and honest statuses',()=>{const text=readFileSync(new URL('../docs/FAITHHUB_FEATURE_ROADMAP.md',import.meta.url),'utf8');const entries=[...text.matchAll(/^(\d+)\. \*\*(.*?)\*\* — (Implemented|Existing|Planned|Gated)\./gm)];assert.equal(entries.length,100);assert.deepEqual(entries.map(x=>Number(x[1])),Array.from({length:100},(_,i)=>i+1));assert.equal(entries.filter(x=>x[3]==='Implemented').length,26);});
