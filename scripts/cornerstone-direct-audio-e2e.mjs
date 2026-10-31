// Browser acceptance for every public direct-audio episode.
// Never downloads full audio or rehosts media. Tests HTMLAudioElement in FaithHub.
import fs from 'node:fs';
import {chromium} from 'playwright';
const all=JSON.parse(fs.readFileSync('cornerstone-episodes.json','utf8'));
const items=all.episodes.filter(e=>e.mode==='audio'&&e.showId!=='293630407');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'en-AU'});
const results=[];
try{
 await page.goto('http://127.0.0.1:8765/podcasts.html?topic=cornerstone',{waitUntil:'domcontentloaded',timeout:20000});
 await page.getByText(/117 Cornerstone recordings/).waitFor({timeout:30000});
 for(const e of items){
   try{
     await page.locator('#filter').selectOption('cornerstone');
     await page.locator('#search').fill(e.title);
     const row=page.locator('#grid article').filter({hasText:e.title}).first();
     await row.locator('[data-select]').click({timeout:6000});
     const audio=page.locator('#playerHost audio');
     await audio.waitFor({timeout:5000});
     await page.evaluate(()=>{
       const a=document.querySelector('#playerHost audio');
       const b=document.createElement('button');b.id='play-sample';b.textContent='Play audio in page';
       b.onclick=()=>a.play().catch(err=>{b.dataset.error=err.name;});
       document.body.append(b);
     });
     await page.locator('#play-sample').focus();
     await page.keyboard.press('Enter');
     try{await page.waitForFunction(()=>document.querySelector('#playerHost audio')?.currentTime>=5,null,{timeout:13000});}
     catch{}
     const status=await page.evaluate(()=>{
       const a=document.querySelector('#playerHost audio');
       return {pos:a.currentTime,duration:a.duration,paused:a.paused,error:a.error?.code||null,readyState:a.readyState};
     });
     const ok=status.pos>=5;
     results.push({id:e.id,title:e.title,showId:e.showId,status:ok?'VERIFIED_PLAYABLE':'PLAYBACK_FAILED',...status});
     console.log('AUDIO_RESULT',JSON.stringify(results.at(-1)));
     await page.locator('#play-sample').evaluate(b=>b.remove());
     await audio.evaluate(a=>{a.pause();a.removeAttribute('src');a.load();});
   }catch(err){
     results.push({id:e.id,title:e.title,showId:e.showId,status:'PLAYBACK_FAILED',error:String(err).slice(0,180)});
     console.log('AUDIO_RESULT',JSON.stringify(results.at(-1)));
   }
 }
}finally{await browser.close()}
console.log('AUDIO_ALL_SUMMARY',JSON.stringify({total:items.length,verified:results.filter(e=>e.status==='VERIFIED_PLAYABLE').length,failed:results.filter(e=>e.status==='PLAYBACK_FAILED').length}));
fs.writeFileSync('cornerstone-direct-audio-test-results.json',JSON.stringify({testedAt:new Date().toISOString(),browser:'GithubActions Chromium mobile 390px',results},null,2));
// This is an audit: failures are reflected in statuses and must not be claimed as success.
if(results.length!==items.length)process.exitCode=1;
