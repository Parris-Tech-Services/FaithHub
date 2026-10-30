import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
test('saints prayer guide includes accessible direct prayer and grounded primary-source readings',()=>{
 const html=read('../saints-prayer.html');
 assert.match(html,/<html lang="en-AU">/);
 assert.match(html,/name="viewport"/);
 assert.match(html,/id="start"/);
 assert.match(html,/id="teachers"/);
 assert.match(html,/id="listen"/);
 assert.match(html,/Lord Jesus Christ, Son of God/);
 for(const name of ['Augustine','Teresa','Ignatius','Brother Lawrence','Benedict','Thérèse']) assert.ok(html.includes(name),name);
 for(const source of ['newadvent.org/fathers/1102130.htm','ccel.org/ccel/teresa/way/way.i.xxxii.html','orderofthecommonlife.org/spiritual-exercises-full-text','ccel.org/ccel/lawrence/practice.all.html','gutenberg.org/files/50040/50040-h/50040-h.htm','ccel.org/ccel/therese/autobio.all.html']) assert.ok(html.includes(source),source);
 assert.doesNotMatch(html,/<iframe\b/i);
 assert.doesNotMatch(html,/<script\b/i);
});
test('verified podcast destinations are present and linked via ordinary anchors',()=>{
 const html=read('../saints-prayer.html');
 for(const part of ['i=1000796088412','i=1000786452531','discerninghearts.com/catholic-podcasts/','prayasyougo.org/','praying-with-the-saints/id1503225013']) assert.ok(html.includes(part),part);
 assert.match(html,/rel="noopener noreferrer"/);
});
test('guide is discoverable from FaithHub and existing prayer surfaces',()=>{
 for(const page of ['index.html','daily-prayer.html','prayer-library.html','podcasts.html']){
   const html=read('../'+page);
   assert.ok(html.includes('href="saints-prayer.html"'),page);
 }
 assert.ok(read('../README.md').includes('saints-prayer.html'));
 assert.ok(read('../docs/prayer/saints-prayer-research-2026-10-31.md').includes('## Primary historical witnesses'));
});
