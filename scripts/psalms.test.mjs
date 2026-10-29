import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  psalmPaths, christianVoices, getPsalmPath, parsePrivateNotes,
  preparePrivateNote, serializePrivateNotes, MAX_NOTE_LENGTH, NOTE_KEY
} from '../assets/psalm-explorer-data.mjs';

const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
test('four Bible-linked Psalm pathways each have original prayer and context', () => {
  assert.equal(psalmPaths.length, 4);
  assert.equal(new Set(psalmPaths.map(p => p.id)).size, 4);
  for (const p of psalmPaths) {
    assert.match(p.bibleUrl, /^https:\/\/www\.bible\.com\/bible\/111\/PSA\.[0-9]+\.NIV$/);
    for (const field of ['reference','topic','overview','notice','prayer','practice','cueLine']) {
      assert.ok(p[field].length > 20 || (field==='reference' && /^Psalm \d+$/.test(p[field])), p.id + ' ' + field);
    }
    assert.ok(['lament','petition','thankfulness','intercession'].includes(p.practiceAnchor));
  }
  assert.equal(getPsalmPath('invalid'), psalmPaths[0]); // malformed query cannot direct arbitrary links.
  assert.equal(getPsalmPath('lament').reference,'Psalm 13');
});

test('all linked creators are genuine HTTPS sources, no uploaded audio or copied lyrics', () => {
  assert.deepEqual(christianVoices.map(c=>c.name),['Sons of Korah','Colin Buchanan','Paul Roe']);
  for(const c of christianVoices) {
    const u = new URL(c.url);
    assert.equal(u.protocol,'https:');
    assert.ok(c.cta && c.detail && c.category);
  }
  const html=read('psalms.html');
  assert.doesNotMatch(html, /<(?:iframe|audio|video)\b|<script[^>]*src=["']https?:/i);
  assert.match(html, /Scripture first/);
});

test('private notes are explicitly opt-in, bounded, and schema validated', () => {
  assert.match(NOTE_KEY, /faithhub/);
  assert.deepEqual(parsePrivateNotes(null),{});
  assert.deepEqual(parsePrivateNotes('{garbled'),{});
  assert.deepEqual(parsePrivateNotes('{"version":2,"notes":{"rest":"old"}}'),{});
  assert.deepEqual(parsePrivateNotes('{"version":1,"notes":{"hack":"no","rest":"welcome"}}'),{rest:'welcome'});
  assert.throws(()=>preparePrivateNote(null),TypeError);
  assert.throws(()=>preparePrivateNote('a'.repeat(MAX_NOTE_LENGTH+1)),RangeError);
  assert.equal(preparePrivateNote('  honest  '),'  honest  ');
  const s=serializePrivateNotes({rest:'A private thought',hack:'not saved',lament:'  ',wait:'b'.repeat(MAX_NOTE_LENGTH+1)});
  assert.deepEqual(JSON.parse(s),{version:1,notes:{rest:'A private thought'}});
  assert.deepEqual(parsePrivateNotes(s),{rest:'A private thought'});
});

test('page includes accessible selector, note deletion and no forced engagement', () => {
  const html=read('psalms.html');
  const js=read('assets/psalm-explorer.mjs');
  const css=read('assets/psalm-explorer.css');
  for(const attr of ['lang="en-AU"','name="viewport"','href="#main"','aria-label="Choose a Scripture pathway"','aria-pressed="true"','aria-live="polite"','id="save-note"','id="delete-note"']) {
    assert.ok(html.includes(attr),attr);
  }
  for (const id of psalmPaths.map(x=>x.id)) assert.ok(html.includes('data-path="'+id+'"'));
  assert.match(js,/localStorage\.setItem\(NOTE_KEY/);
  assert.match(js,/window\.confirm/);
  assert.doesNotMatch(js,/innerHTML|fetch\(/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:48px/);
  assert.doesNotMatch(html,/streak counter|total hours|scoreboard/i);
});

test('page linked from actual home and prayer navigation; Vite and Pages deploy it',()=>{
  const homepage=read('index.html');
  const daily=read('daily-prayer.html');
  const config=read('vite.config.js');
  const deploy=read('.github/workflows/deploy.yml');
  assert.match(homepage,/href="psalms\.html"/);
  assert.match(daily,/href="psalms\.html"/);
  assert.match(config,/psalms: fileURLToPath/);
  assert.match(deploy,/test -f _site\/psalms\.html/);
  assert.match(deploy,/\('podcasts\.html','psalms\.html'\)/);
});
