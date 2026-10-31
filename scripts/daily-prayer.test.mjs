import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {moments,fruits,validateShelf,mergeShelf,createCalendar} from '../assets/prayer-data.mjs';
const empty={version:1,resources:[]};
test('backup round trip preserves resource meanings and untrusted text stays text',()=>{
 const data={version:1,resources:[{title:'<img src=x onerror=alert(1)>',url:'https://drive.google.com/file/d/example/view'}]};
 assert.deepEqual(validateShelf(JSON.parse(JSON.stringify(validateShelf(data)))),data);
});
test('unsafe links and unknown storage schemas are rejected',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,hello','http://example.org','https://user:password@example.org'])assert.throws(()=>validateShelf({version:1,resources:[{title:'test',url}]}));
 for(const value of [null,[],{}, {version:2,resources:[]},{version:1,resources:[{title:'',url:'https://example.org'}]}])assert.throws(()=>validateShelf(value));
});
test('imports merge without duplicates or mutating existing links, with bounded size',()=>{
 const a={version:1,resources:[{title:'A',url:'https://example.org/'}]},b={version:1,resources:[{title:'renamed',url:'https://example.org/'},{title:'B',url:'https://example.com/'}]};
 const original=JSON.stringify(a);const result=mergeShelf(a,b);assert.equal(result.resources.length,2);assert.equal(result.resources[0].title,'A');assert.equal(JSON.stringify(a),original);assert.deepEqual(mergeShelf(result,b),result);
 assert.throws(()=>validateShelf({version:1,resources:Array(51).fill(a.resources[0])}));assert.deepEqual(mergeShelf(empty,empty),empty);
});
test('daily calendar uses floating wall time, a stable UID, daily repeat and an alarm',()=>{
 const now=new Date(2026,9,29,23,30);const ics=createCalendar('07:05',now);
 assert.match(ics,/DTSTART:20261029T070500\r\n/);assert.match(ics,/RRULE:FREQ=DAILY\r\n/);assert.match(ics,/BEGIN:VALARM/);assert.match(ics,/TRIGGER:PT0M/);assert.match(ics,/UID:daily-prayer-0705@faithhub/);assert.ok(ics.endsWith('\r\n'));
 for(const invalid of ['25:00','07:60','7:00','12:00\r\nSUMMARY:injected'])assert.throws(()=>createCalendar(invalid,now));
});
test('all prayer moments have a Scripture and next action; all nine fruits present',()=>{assert.equal(new Set(moments.map(m=>m.id)).size,7);for(const m of moments)assert.ok(m.prayer&&m.scripture&&m.next&&m.posture);assert.equal(fruits.length,9);});
test('new page has local scripts only, privacy boundaries and accessible controls',()=>{
 const html=readFileSync(new URL('../daily-prayer.html',import.meta.url),'utf8');const js=readFileSync(new URL('../assets/daily-prayer.mjs',import.meta.url),'utf8');
 const externals=[...html.matchAll(/<script[^>]+src=["'](https?:[^"']+)["'][^>]*>/g)];
 assert.ok(externals.length<=1,'At most the approved analytics settings script may be present');
 for(const tag of externals){
   assert.equal(tag[1],'https://parris-analytics.parris-neathaustralia.workers.dev/tracker.js');
   assert.match(tag[0],/data-site=["']faithhub["']/);
   assert.match(tag[0],/referrerpolicy=["']no-referrer["']/);
 }assert.doesNotMatch(js,/innerHTML|fetch\(/);assert.match(html,/no reminder|does not activate a reminder/);assert.match(js,/localStorage\.setItem/);assert.match(js,/textContent/);
});
