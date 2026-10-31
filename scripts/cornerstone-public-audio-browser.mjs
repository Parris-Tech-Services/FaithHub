import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.env.FAITHHUB_URL||'http://127.0.0.1:8765').replace(new RegExp('/$'),'');
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(/faithhub-cornerstone-audio\.parris-neathaustralia\.workers\.dev/.test(r.url()))requests.push({status:r.status(),type:r.headers()['content-type'],url:r.url().slice(0,120)})});
 await page.route('**/cornerstone-episodes.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:1,shows:[],episodes:[]})}));
 const response=await page.goto(base+'/podcasts.html?topic=cornerstone',{waitUntil:'domcontentloaded',timeout:30000});
 assert.equal(response.status(),200);
 await page.getByText(/205 public MP3\/M4A recordings with direct audio sources/).waitFor({timeout:15000});
 await page.locator('#filter').selectOption('cornerstone-public');
 assert.equal(await page.locator('#grid article').count(),205);
 await page.locator('#search').fill('Muster-2013-Session-1');
 assert.equal(await page.locator('#grid article').count(),1);
 await page.locator('#grid article').getByRole('button',{name:'Listen here'}).click();
 const audio=page.locator('#playerHost audio');
 await audio.waitFor({timeout:10000});
 assert.match(await audio.getAttribute('src'),/faithhub-cornerstone-audio[.]parris-neathaustralia[.]workers[.]dev[/]audio[/]/);
 assert.equal(await page.locator('#playerHost iframe').count(),0,'All public audio should be native HTML5, not iframe previews');
 // Test real MP3 bytes decoding, not just loading a player. Chromium is allowed autoplay
 // in ephemeral CI; actual FaithHub listeners click native audio controls.
 let playError='';
 try{await audio.evaluate(el=>el.play())}catch(e){playError=e.message}
 let progressed=false;
 try{
  await page.waitForFunction(()=>document.querySelector('#playerHost audio')?.currentTime>=2,null,{timeout:24000});
  progressed=true;
 }catch{}
 const state=await audio.evaluate(el=>({currentTime:el.currentTime,readyState:el.readyState,paused:el.paused,error:el.error?.code}));
 console.log('REAL_AUDIO_RESULT',JSON.stringify({progressed,state,playError,requests:requests.slice(0,8),errors}));
 assert.ok(progressed,'Real source did not advance past 2 seconds in HTML5 player');
 await page.getByText(/Playing in FaithHub/).waitFor({timeout:5000});
 assert.deepEqual(errors,[]);
 await page.locator('#search').fill('Roe');
 assert.ok(await page.locator('#grid article').count()>0,'Public library filters by teaching title');
 console.log('PASS_NATIVE_PUBLIC_CORNERSTONE_MP3_AUDIO');
}finally{await browser.close()}
