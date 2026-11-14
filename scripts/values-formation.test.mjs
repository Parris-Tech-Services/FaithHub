import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { INVENTORY } from '../assets/backup-centre.mjs';

const read = (rel) => readFileSync(new URL('../' + rel, import.meta.url), 'utf8');

function mountHome(initialStorage = {}) {
  const html = read('index.html');
  const mainScript = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
  const writes = [];
  const removals = [];
  const store = new Map(Object.entries(initialStorage));

  const elements = new Map();
  const makeEl = (id = '') => ({
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    checked: id === 'faithhub-presence-mode',
    hidden: id === 'meterWrap',
    open: false,
    dataset: {},
    style: {},
    attributes: new Map(),
    classList: {
      set: new Set(),
      toggle(cls, force) {
        const on = force === undefined ? !this.set.has(cls) : Boolean(force);
        if (on) this.set.add(cls);
        else this.set.delete(cls);
      },
      contains(cls) {
        return this.set.has(cls);
      },
    },
    setAttribute(k, v) {
      this.attributes.set(k, String(v));
    },
    getAttribute(k) {
      return this.attributes.get(k) ?? null;
    },
    addEventListener(type, fn) {
      this['on' + type] = fn;
    },
    focus() {},
  });

  for (const id of [
    'themeBtn',
    'meter',
    'meterWrap',
    'postureNote',
    'faithhub-presence-mode',
    'tabs',
    'app',
    'date',
    'todayBtn',
    'resetBtn',
    'faithhub-style',
    'appearance-details',
  ]) {
    elements.set(id, makeEl(id));
  }

  let confirmAnswer = true;
  const timers = [];
  const document = {
    body: makeEl('body'),
    getElementById(id) {
      return elements.get(id) ?? null;
    },
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    },
  };

  const localStorage = {
    getItem(k) {
      return store.has(k) ? store.get(k) : null;
    },
    setItem(k, v) {
      writes.push([k, String(v)]);
      store.set(k, String(v));
    },
    removeItem(k) {
      removals.push(k);
      store.delete(k);
    },
  };

  const sandbox = {
    document,
    localStorage,
    window: {
      confirm: () => confirmAnswer,
      addEventListener() {},
    },
    Date,
    Math,
    JSON,
    String,
    Number,
    Boolean,
    Object,
    Array,
    setInterval(fn, ms) {
      const handle = { fn, ms, cleared: false };
      timers.push(handle);
      return handle;
    },
    clearInterval(handle) {
      if (handle) handle.cleared = true;
    },
  };

  vm.runInNewContext(
    mainScript +
      '\n;globalThis.__fh = { isPresenceMode, setPresenceMode, startStillness, endStillness, setTab: (t) => { tab = t; render(); }, getStillness: () => ({ ...stillness }), toggleVeil: () => { veilCommunityNotes = !veilCommunityNotes; render(); }, clearCommunity: () => { entry().community = { church: false, checkedIn: false, served: false, notes: "" }; saveState(); render(); }, getEntry: () => entry() };',
    sandbox
  );

  return {
    elements,
    store,
    writes,
    removals,
    timers,
    api: sandbox.__fh,
    setConfirm(v) {
      confirmAnswer = v;
    },
  };
}

test('VAL-001: Presence-over-performance mode hides progress meter and completion counts by default', () => {
  const home = mountHome();
  assert.equal(home.api.isPresenceMode(), true, 'Presence mode must default to true');
  assert.equal(home.elements.get('meterWrap').hidden, true, 'Progress meter must be hidden by default');
  assert.equal(home.elements.get('faithhub-presence-mode').checked, true, 'Presence mode checkbox must be checked');
  assert.match(home.elements.get('postureNote').textContent, /Presence over performance/);
  assert.doesNotMatch(home.elements.get('app').innerHTML, /touched today/i);

  // Opting out of presence mode reveals the space-made meter inside existing rule-of-life storage key
  home.api.setPresenceMode(false);
  assert.equal(home.api.isPresenceMode(), false);
  assert.equal(home.elements.get('meterWrap').hidden, false);
  const saved = JSON.parse(home.store.get('faithhub-rule-of-life-v2'));
  assert.equal(saved.preferences.presenceMode, false);

  // Secondary React companion mirrors presence-by-default and hides completion fraction pill
  const reactApp = read('src/App.jsx');
  assert.match(reactApp, /const presenceMode = state\.preferences\?\.presenceMode !== false/);
  assert.match(reactApp, /\{!presenceMode && <div className="meter">/);
  assert.match(reactApp, /\{!presenceMode && <span className="pill">/);
});

test('VAL-002: Sabbath stillness and silence flows perform zero localStorage writes and require no logging', () => {
  const home = mountHome();
  const baselineWrites = home.writes.length;
  const baselineRemovals = home.removals.length;

  home.api.setTab('sabbath');
  const sabbathInitialHtml = home.elements.get('app').innerHTML;
  assert.match(sabbathInitialHtml, /Sabbath \/ rest/);
  assert.match(sabbathInitialHtml, /Sit in open silence/);
  assert.doesNotMatch(sabbathInitialHtml, /<details[^>]*open/, 'Optional Sabbath log stays closed when empty');

  // Open silence and timed stillness must never write to localStorage
  home.api.startStillness(null);
  assert.match(home.elements.get('app').innerHTML, /Unlogged stillness: nothing is being saved or counted/);
  home.api.startStillness(3);
  assert.equal(home.api.getStillness().secondsLeft, 180);
  assert.match(home.elements.get('app').innerHTML, /3:00/);
  home.api.endStillness();
  assert.equal(home.api.getStillness().active, false);

  assert.equal(home.writes.length, baselineWrites, 'Stillness flow must make zero localStorage.setItem writes');
  assert.equal(home.removals.length, baselineRemovals, 'Stillness flow must make zero localStorage.removeItem calls');
  assert.equal(home.api.getEntry().sabbath.planned, false);
  assert.equal(home.api.getEntry().sabbath.rested, false);
});

test('VAL-003: Family/community consent safeguards, shared-screen veil, and 14-key audit doc are aligned', () => {
  const home = mountHome({
    'faithhub-rule-of-life-v2': JSON.stringify({
      entries: {
        [new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0')]: {
          date: 'today',
          rhythms: {},
          reflection: { gratitude: '', repentance: '', fear: '', grace: '', fruit: '', body: '', prayer: '' },
          sabbath: { planned: false, rested: false, notes: '' },
          community: { church: true, checkedIn: false, served: false, notes: 'Pray for J.S.' },
        },
      },
    }),
  });

  home.api.setTab('family');
  const familyHtml = home.elements.get('app').innerHTML;
  assert.match(familyHtml, /Consent &amp; shared-screen care:/);
  assert.match(familyHtml, /without their permission/);
  assert.match(familyHtml, /data-nested="community:notes"\s+placeholder=/);

  // Veiling conceals textarea on shared screen without deleting stored note
  home.api.toggleVeil();
  assert.match(home.elements.get('app').innerHTML, /data-nested="community:notes" hidden/);
  assert.equal(home.api.getEntry().community.notes, 'Pray for J.S.');

  // Clearing removes community notes cleanly
  home.api.clearCommunity();
  assert.equal(home.api.getEntry().community.notes, '');
  assert.equal(home.api.getEntry().community.church, false);

  // Audit document covers every INVENTORY storage key and VALUES_PRETASK_GATE record
  const auditDoc = read('docs/privacy-consent-audit-2026-11-14.md');
  for (const field of [
    'Real-life value protected:',
    'Possible displacement:',
    'Existing system checked:',
    'Smallest useful action:',
    'Stop condition:',
    'Human outcome:',
    'Evidence required:',
    'Decision:',
  ]) {
    assert.ok(auditDoc.includes(field), 'Missing pre-task gate field: ' + field);
  }
  for (const item of INVENTORY) {
    assert.ok(auditDoc.includes('`' + item.key + '`'), 'Audit doc missing storage key: ' + item.key);
  }
});
