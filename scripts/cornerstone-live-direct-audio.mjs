// Actual production audio progress acceptance: checks real FaithHub Pages on a
// confirmed deployed SHA, not a PR preview or fabricated media fixture.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const expected=process.env.EXPECTED_DEPLOY_SHA;
assert.match(expected||'',/^[0-9a-f]{40}$/i,'A deployed source SHA is required');
const base='https://parris-tech-services.github.io/FaithHub/';
const browser=await chromium.launch({headless:true});
const records=[];
try {
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'en-AU'});
 let home=await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
 assert.equal(home?.status(),200);
 const marker=await page.locator('meta[name="faithhub-deploy-sha"]').getAttribute('content');
 assert.equal(marker,expected,'Home deploy marker must match this Pages workflow source SHA');
 await page.goto(base+'podcasts.html?topic=cornerstone',{waitUntil:'domcontentloaded',timeout:30000});
 await page.getByText(/public catalogue entries:/).waitFor({timeout:35000});
 for(const title of ['Mini Muster Bendigo 2012','Mick Duncan Salt Session 2']){
   await page.locator('#filter').selectOption('cornerstone-verified');
   await page.locator('#search').fill(title);
   const card=page.locator('#grid article').filter({hasText:title}).first();
   await card.waitFor({timeout:9000});
   await card.getByRole('button',{name:'Listen here'}).click();
   const audio=page.locator('#playerHost audio');
   await audio.waitFor();
   await page.evaluate(()=>{
     const a=document.querySelector('#playerHost audio');
     const b=document.createElement('button');b.id='e2e-audio-play';b.textContent='Play';
     b.addEventListener('click',()=>a.play().catch(error=>b.dataset.error=error.name));
     document.body.append(b);
   });
   await page.locator('#e2e-audio-play').focus();
   await page.keyboard.press('Enter');
   await page.waitForFunction(()=>document.querySelector('#playerHost audio')?.currentTime>=5,null,{timeout:22000});
   const result=await page.evaluate(()=>{
     const a=document.querySelector('#playerHost audio');
     return {time:a.currentTime,duration:a.duration,paused:a.paused,readyState:a.readyState,error:a.error?.code||null,status:document.querySelector('#playbackStatus').textContent};
   });
   assert.ok(result.time>=5&&result.readyState>=2&&!result.paused&&!result.error,JSON.stringify(result));
   assert.match(result.status,/Playback verified in this browser:/);
   records.push({title,seconds:result.time,playbackStatus:'VERIFIED_PLAYABLE'});
   console.log('LIVE_AUDIO_PASS',JSON.stringify(records.at(-1)));
   await audio.evaluate(a=>a.pause());
   await page.locator('#e2e-audio-play').evaluate(b=>b.remove());
 }
 console.log('LIVE_AUDIO_SUMMARY',JSON.stringify({deploymentSha:expected,count:records.length,verified:records.map(x=>x.title)}));
}finally {await browser.close()}
