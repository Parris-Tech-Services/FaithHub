import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INVENTORY,makeBackup,parseBackup,inventoryStorage,planRestore,restore,validateValue,MAX_FILE_BYTES} from '../assets/backup-centre.mjs';

class Storage {
  constructor(entries=[]){this.map=new Map(entries);this.failOn=null;}
  get length(){return this.map.size;}
  key(i){return [...this.map.keys()][i]??null;}
  getItem(key){return this.map.has(key)?this.map.get(key):null;}
  setItem(key,value){if(key===this.failOn)throw Error('Simulated storage error');this.map.set(key,String(value));}
  removeItem(key){this.map.delete(key);}
}
const fixture=[
 ['faithhub-rule-of-life-v2',JSON.stringify({entries:{'2026-10-31':{reflection:{prayer:'Sensitive text'}}}})],
 ['faithhub:prayer-anchor:v1','home'],
 ['faithhub:prayer-shelf:v1',JSON.stringify({version:1,resources:[]})],
 ['faithhub:scripture-atlas:v1',JSON.stringify({notes:{},bookmarks:[]})],
 ['faithhub-intercessions-v1',JSON.stringify([{id:'a',name:'Initials AB',request:'Personal request'}])],
 ['faithhub-podcast-selected-v2','apple:teresa-2026'],
 ['rule-of-life-companion-v1',JSON.stringify({entries:{}})]
];
test('inventory contains all 12 existing storage writers, no duplicate IDs',()=>{
  assert.equal(INVENTORY.length,12);
  assert.equal(new Set(INVENTORY.map(x=>x.key)).size,12);
  const expected=INVENTORY.map(x=>x.key);
  for(const [path,key] of [
    ['index.html','faithhub-rule-of-life-v2'],
    ['index.html','faithhub-theme'],
    ['index.html','faithhub-appearance-v1'],
    ['assets/daily-prayer.mjs','faithhub:prayer-shelf:v1'],
    ['assets/daily-prayer.mjs','faithhub:prayer-anchor:v1'],
    ['prayer-practice.html','faithhub:prayer-four-movements:notes:v1'],
    ['assets/scripture-atlas.mjs','faithhub:scripture-atlas:v1'],
    ['assets/psalm-explorer-data.mjs','faithhub-psalm-explore-notes-v1'],
    ['assets/intercession.mjs','faithhub-intercessions-v1'],
    ['podcasts.html','faithhub-podcast-selected-v2'],
    ['podcasts.html','faithhub-local-podcast-v1'],
    ['src/App.jsx','rule-of-life-companion-v1']
  ]){
    assert.ok(expected.includes(key),key);
    assert.ok(readFileSync(new URL('../'+path,import.meta.url),'utf8').includes(key),path);
  }
});
test('export restores exact existing data without modifying input',()=>{
 const initial=new Storage(fixture);
 const {blob,count,unrecognised}=makeBackup(initial,'2026-10-31T12:00:00.000Z');
 assert.equal(count,fixture.length);
 assert.deepEqual(unrecognised,[]);
 assert.equal(new TextEncoder().encode(blob).length<MAX_FILE_BYTES,true);
 const parsed=parseBackup(blob);
 const empty=new Storage();
 const done=restore(empty,parsed);
 assert.equal(done.restored,fixture.length);
 assert.deepEqual([...empty.map.entries()],fixture);
 assert.deepEqual([...initial.map.entries()],fixture);
});
test('safe default skip preserves already existing data',()=>{
 const saved=new Storage([['faithhub-intercessions-v1','[{"id":"original","name":"private"}]']]);
 const file=parseBackup(makeBackup(new Storage(fixture)).blob);
 assert.equal(planRestore(saved,file).writes.length,fixture.length-1);
 const result=restore(saved,file);
 assert.equal(result.restored,fixture.length-1);
 assert.equal(saved.getItem('faithhub-intercessions-v1'),'[{"id":"original","name":"private"}]');
 const replaced=restore(saved,file,true);
 assert.equal(replaced.replaced,1);
 assert.equal(saved.getItem('faithhub-intercessions-v1'),fixture[4][1]);
});
test('unknown FaithHub keys are detected rather than silently falsely covered',()=>{
 const x=inventoryStorage(new Storage([['faithhub-new-secret-v3','secret'],fixture[0]]));
 assert.deepEqual(x.unrecognised,['faithhub-new-secret-v3']);
});
test('malformed files and unsafe keys are rejected before writing',()=>{
 const good=JSON.parse(makeBackup(new Storage(fixture)).blob);
 const bad=[
  '{', '{}',JSON.stringify({...good,version:2}),
  JSON.stringify({...good,records:{'not-the-app':'secret'}}),
  JSON.stringify({...good,records:{'faithhub-intercessions-v1':'{}'}}),
  JSON.stringify({...good,records:{'faithhub-theme':'neon'}}),
  JSON.stringify({...good,records:{'faithhub-rule-of-life-v2':'{"__proto__":{"polluted":true}}'}}),
  JSON.stringify({...good,records:{'faithhub-rule-of-life-v2':'{"entries":null,"constructor":"evil"}'}})
 ];
 for(const s of bad)assert.throws(()=>parseBackup(s));
 for(const v of ['unknown','test'])assert.throws(()=>validateValue(INVENTORY.find(x=>x.kind==='anchor'),v));
});
test('partial storage failure rolls back completed writes',()=>{
 const file=parseBackup(makeBackup(new Storage(fixture)).blob);
 const target=new Storage([['faithhub-rule-of-life-v2','{"entries":{"keep":true}}']]);
 const old=[...target.map.entries()];
 target.failOn='faithhub:scripture-atlas:v1';
 assert.throws(()=>restore(target,file,true),/rolled back/);
 assert.deepEqual([...target.map.entries()],old);
});
test('page provides explicit confirmation, safe mode, privacy guidance and discoverability',()=>{
 const page=readFileSync(new URL('../backup.html',import.meta.url),'utf8');
 const js=readFileSync(new URL('../assets/backup-centre.mjs',import.meta.url),'utf8');
 for(const name of ['import-all','export-all','overwrite-option','restore-all','data-count','backup-status','restore-status'])assert.ok(page.includes('id="'+name+'"'),name);
 assert.match(page,/not encrypted/i);
 assert.match(page,/This works only with data saved in this browser/);
 assert.match(js,/window\.confirm/);
 assert.match(js,/roll.*back|rolled back/);
 assert.doesNotMatch(js,/fetch\(|sendBeacon|XMLHttpRequest|mailto:/);
 for(const path of ['index.html','daily-prayer.html','intercessions.html']){
  assert.ok(readFileSync(new URL('../'+path,import.meta.url),'utf8').includes('href="backup.html"'),path);
 }
});
