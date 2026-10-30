import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STORAGE_KEY,CATEGORIES,normaliseCard,parseCards,validateBackup,activeCards,dailyStartIndex,makeBackup} from '../assets/intercession.mjs';
const html=readFileSync(new URL('../intercessions.html',import.meta.url),'utf8');
const source=readFileSync(new URL('../assets/intercession.mjs',import.meta.url),'utf8');
const fixture=(id,status='active')=>({id,name:'Friend '+id,category:'friends',request:'A gentle request',action:'Offer a helpful check-in',status,createdAt:'2026-10-31T00:00:00.000Z'});

test('entry normalization refuses invalid records and trims all user-supplied fields',()=>{
 assert.equal(normaliseCard({}),null);
 assert.equal(normaliseCard({...fixture('x'),name:'   '}),null);
 assert.equal(normaliseCard({...fixture('x'),id:'<script>'}),null);
 const v=normaliseCard({...fixture('x'),name:' A '.repeat(100),category:'unapproved',status:'answered',request:'Q'.repeat(350)});
 assert.equal(v.name.length,80);
 assert.equal(v.category,'other');
 assert.equal(v.status,'active');
 assert.equal(v.request.length,280);
 assert.equal(CATEGORIES.length,6);
});
test('in-memory record parsing is bounded and deduplicated',()=>{
 assert.equal(parseCards('bad json').length,0);
 assert.equal(parseCards('{}').length,0);
 const saved=parseCards(JSON.stringify([fixture('a'),fixture('a'),fixture('b','entrusted')]));
 assert.equal(saved.length,2);
 assert.equal(activeCards(saved).length,1);
 assert.equal(dailyStartIndex([], '2026-10-31'),0);
 assert.equal(dailyStartIndex(saved,'2026-10-31'),dailyStartIndex(saved,'2026-10-31'));
 const many=Array.from({length:120},(_,i)=>fixture('id-'+i));
 assert.equal(parseCards(JSON.stringify(many)).length,100);
});
test('backups are versioned and invalid or duplicate imports are rejected',()=>{
 const cards=[fixture('a'),fixture('b','entrusted')];
 assert.equal(validateBackup(makeBackup(cards)).length,2);
 assert.throws(()=>validateBackup('{"version":2,"cards":[]}'));
 assert.throws(()=>validateBackup('{"version":1,"cards":[{"id":"bad"}]}'));
 assert.throws(()=>validateBackup(JSON.stringify({version:1,cards:[cards[0],cards[0]]})));
});
test('page includes accessible labelled inputs and offline-oriented prayer safeguards',()=>{
 for(const id of ['card-name','card-category','card-request','card-action','card-form','featured','next-card','card-list','delete-all','export-cards','import-cards','backup-status']){
   assert.ok(html.includes('id="'+id+'"'),id);
 }
 assert.match(html,/unencrypted/);
 assert.match(html,/No streaks/);
 assert.match(html,/No automatic emails or sharing/);
 assert.match(html,/one-minute prayer/i);
 assert.match(html,/assets\/intercession\.mjs/);
 assert.doesNotMatch(source,/fetch\(|sendBeacon\(|XMLHttpRequest|WebSocket|mailto:|navigator\.share/i);
 assert.equal(STORAGE_KEY,'faithhub-intercessions-v1');
});
test('entry points link to private prayer cards and research',()=>{
 for(const path of ['index.html','daily-prayer.html','prayer-library.html']){
   assert.ok(readFileSync(new URL('../'+path,import.meta.url),'utf8').includes('href="intercessions.html"'),path);
 }
 assert.ok(readFileSync(new URL('../README.md',import.meta.url),'utf8').includes('intercessions.html'));
 assert.ok(readFileSync(new URL('../docs/christian-technology-formation-2026-10-31.md',import.meta.url),'utf8').includes('Inner Room'));
});
