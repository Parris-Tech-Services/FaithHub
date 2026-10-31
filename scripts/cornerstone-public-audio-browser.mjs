// Live-browser verification of public Cornerstone catalogue and an unauthenticated
// Google Drive preview. Loading a preview is NOT proof that audio progresses.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.env.FAITHHUB_URL||'http://127.0.0.1:8765').replace(new RegExp('/
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/cornerstone-episodes.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:1,shows:[],episodes:[]})}));
 const res=await page.goto(base+'/podcasts.html?topic=cornerstone',{waitUntil:'domcontentloaded',timeout:30000});
 assert.equal(res?.status(),200);
 await page.getByText(/205 recovered public MP3\/M4A recordings/).waitFor({timeout:12000});
 await page.locator('#filter').selectOption('cornerstone-public');
 assert.equal(await page.locator('#grid article').count(),205);
 await page.locator('#search').fill('Muster 2013 Session 1');
 const cards=page.locator('#grid article');
 assert.equal(await cards.count(),1);
 await cards.first().getByRole('button',{name:'Listen here'}).click();
 const frameEl=page.locator('#playerHost iframe');
 assert.match(await frameEl.getAttribute('src'),/drive\.google\.com\/file\/d\//);
 assert.match(await page.locator('#playbackStatus').textContent(),/public Google Drive audio player/i);
 const frame=await (await frameEl.elementHandle()).contentFrame();
 let frameTitle='',frameText='',controls=[];
 try{
  await frame.waitForLoadState('domcontentloaded',{timeout:22000});
  frameTitle=await frame.title();
  frameText=(await frame.locator('body').innerText({timeout:7000})).slice(0,400);
  controls=await frame.locator('button,[role=button],video,audio').evaluateAll(es=>es.slice(0,20).map(x=>({tag:x.tagName,role:x.getAttribute('role'),aria:x.getAttribute('aria-label'),title:x.getAttribute('title'),text:x.textContent?.slice(0,30)})));
 }catch(e){console.log('EMBED_INSPECT_WARNING',e.message.slice(0,240))}
 console.log('DRIVE_PREVIEW_INSPECT',JSON.stringify({frameUrl:frame.url(),frameTitle,frameText,controls}));
 // The public iframe itself must not request Google sign-in to open its track.
 assert.ok(!/ServiceLogin|accounts\.google\.com\/signin/.test(frame.url()),'Public archive unexpectedly redirects to sign-in');
 // Playback can be blocked by Google in headless CI. We explicitly distinguish that from catalogue success.
 let mediaTrace=[];
 try{
  const play=frame.locator('[aria-label*="Play" i],button[title*="Play" i],[role=button][title*="Play" i]').first();
  if(await play.count()){await play.click({timeout:5000});await page.waitForTimeout(5500);}
  mediaTrace=await page.frames().reduce(async (p, f)=>{
   const x=await p;
   try{x.push({url:f.url().slice(0,120),media:await f.locator('audio,video').evaluateAll(es=>es.map(v=>({time:v.currentTime,paused:v.paused,readyState:v.readyState})))})}catch{}
   return x;
  },Promise.resolve([]));
 }catch(e){console.log('PLAYBACK_PROBE_WARNING',e.message.slice(0,240))}
 const progressed=mediaTrace.some(x=>x.media.some(v=>v.time>=2));
 console.log('AUDIO_PROGRESS',JSON.stringify({progressed,mediaTrace}));
 assert.deepEqual(errors,[]);
 console.log('PASS_PUBLIC_CORNERSTONE_CATALOGUE',205);
}finally{await browser.close()}
),'');
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/cornerstone-episodes.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:1,shows:[],episodes:[]})}));
 const res=await page.goto(base+'/podcasts.html?topic=cornerstone',{waitUntil:'domcontentloaded',timeout:30000});
 assert.equal(res?.status(),200);
 await page.getByText(/205 recovered public MP3\/M4A recordings/).waitFor({timeout:12000});
 await page.locator('#filter').selectOption('cornerstone-public');
 assert.equal(await page.locator('#grid article').count(),205);
 await page.locator('#search').fill('Muster 2013 Session 1');
 const cards=page.locator('#grid article');
 assert.equal(await cards.count(),1);
 await cards.first().getByRole('button',{name:'Listen here'}).click();
 const frameEl=page.locator('#playerHost iframe');
 assert.match(await frameEl.getAttribute('src'),/drive\.google\.com\/file\/d\//);
 assert.match(await page.locator('#playbackStatus').textContent(),/public Google Drive audio player/i);
 const frame=await (await frameEl.elementHandle()).contentFrame();
 let frameTitle='',frameText='',controls=[];
 try{
  await frame.waitForLoadState('domcontentloaded',{timeout:22000});
  frameTitle=await frame.title();
  frameText=(await frame.locator('body').innerText({timeout:7000})).slice(0,400);
  controls=await frame.locator('button,[role=button],video,audio').evaluateAll(es=>es.slice(0,20).map(x=>({tag:x.tagName,role:x.getAttribute('role'),aria:x.getAttribute('aria-label'),title:x.getAttribute('title'),text:x.textContent?.slice(0,30)})));
 }catch(e){console.log('EMBED_INSPECT_WARNING',e.message.slice(0,240))}
 console.log('DRIVE_PREVIEW_INSPECT',JSON.stringify({frameUrl:frame.url(),frameTitle,frameText,controls}));
 // The public iframe itself must not request Google sign-in to open its track.
 assert.ok(!/ServiceLogin|accounts\.google\.com\/signin/.test(frame.url()),'Public archive unexpectedly redirects to sign-in');
 // Playback can be blocked by Google in headless CI. We explicitly distinguish that from catalogue success.
 let mediaTrace=[];
 try{
  const play=frame.locator('[aria-label*="Play" i],button[title*="Play" i],[role=button][title*="Play" i]').first();
  if(await play.count()){await play.click({timeout:5000});await page.waitForTimeout(5500);}
  mediaTrace=await page.frames().reduce(async (p, f)=>{
   const x=await p;
   try{x.push({url:f.url().slice(0,120),media:await f.locator('audio,video').evaluateAll(es=>es.map(v=>({time:v.currentTime,paused:v.paused,readyState:v.readyState})))})}catch{}
   return x;
  },Promise.resolve([]));
 }catch(e){console.log('PLAYBACK_PROBE_WARNING',e.message.slice(0,240))}
 const progressed=mediaTrace.some(x=>x.media.some(v=>v.time>=2));
 console.log('AUDIO_PROGRESS',JSON.stringify({progressed,mediaTrace}));
 assert.deepEqual(errors,[]);
 console.log('PASS_PUBLIC_CORNERSTONE_CATALOGUE',205);
}finally{await browser.close()}
