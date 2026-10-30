import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const page=readFileSync(new URL('../podcasts.html',import.meta.url),'utf8');
const guide=readFileSync(new URL('../saints-prayer.html',import.meta.url),'utf8');
const start=page.indexOf('const episodes = [');
const end=page.indexOf('const STORAGE=',start);
assert.ok(start!==-1&&end>start,'original Spotify catalogue and provider model exist');
const {episodes,featured,catalogue}=runInNewContext(page.slice(start,end)+';({episodes,featured,catalogue})');

test('all 25 existing Spotify recordings retained and all five new resources included',()=>{
  assert.equal(episodes.length,25);
  assert.equal(featured.length,5);
  assert.equal(catalogue.length,30);
  assert.equal(new Set(catalogue.map(e=>e.id)).size,30);
  for(const [id,title,provider,mode] of [
    ['apple:teresa-2026','St Teresa of Ávila’s Wisdom on Prayer','apple','apple'],
    ['apple:augustine-2026','Praying with Saint Augustine','apple','apple'],
    ['audio:teresa-ch26','The Way of Perfection — Chapter 26','audio','audio'],
    ['apple:praying-with-saints','Praying with the Saints — Evening Prayer','apple','apple-show'],
    ['external:pray-as-you-go','Pray As You Go — Daily Guided Prayer','external','external']
  ]){
    const e=catalogue.find(e=>e.id===id);
    assert.ok(e,id);
    assert.equal(e.title,title);
    assert.equal(e.provider,provider);
    assert.equal(e.mode,mode);
    assert.ok(e.tags.includes('prayer'),id);
  }
});

test('all provider links are HTTPS and embedded endpoints are official or publisher hosted',()=>{
  for(const e of catalogue){
    const link=new URL(e.url);
    assert.equal(link.protocol,'https:');
    if(e.mode==='spotify'){
      assert.equal(link.hostname,'open.spotify.com');
      assert.equal(new URL(e.embed).hostname,'open.spotify.com');
    } else if(e.mode==='apple'||e.mode==='apple-show'){
      assert.equal(link.hostname,'podcasts.apple.com');
      assert.equal(new URL(e.embed).hostname,'embed.podcasts.apple.com');
      assert.match(e.embed,/\/podcast\/episode\/id\d+/);
    } else if(e.mode==='audio'){
      assert.equal(new URL(e.embed).hostname,'media.blubrry.com');
      assert.match(e.embed,/WP-Chap26\.mp3$/);
    } else {
      assert.equal(e.mode,'external');
      assert.equal(e.embed,undefined);
    }
  }
});

test('the player is on demand, searchable and has external fallbacks',()=>{
  assert.match(page,/id="search"/);
  assert.match(page,/id="filter"/);
  assert.match(page,/id="resultCount"/);
  assert.match(page,/id="playerHost"/);
  assert.match(page,/function matches\(e\)/);
  assert.match(page,/function render\(\)/);
  assert.match(page,/load:false/);
  assert.match(page,/showSelected\(current\);/);
  assert.match(page,/playerHost\.replaceChildren\(\)/);
  assert.match(page,/data-select/);
  assert.match(page,/rel="noopener noreferrer"/);
  assert.match(page,/LEGACY_STORAGE='faithhub-local-podcast-v1'/);
  assert.match(page,/URLSearchParams\(window\.location\.search\)/);
  assert.doesNotMatch(page,/<iframe id="playerFrame"/);
});

test('each compatible saints resource links back to the same catalogue',()=>{
  for(const id of ['apple%3Ateresa-2026','apple%3Aaugustine-2026','audio%3Ateresa-ch26','apple%3Apraying-with-saints']){
    assert.ok(guide.includes('podcasts.html?episode='+id),id);
  }
  assert.ok(guide.includes('https://prayasyougo.org/'));
});
