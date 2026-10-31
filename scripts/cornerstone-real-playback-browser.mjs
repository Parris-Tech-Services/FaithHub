// Actual browser playback regression for publisher-hosted Cornerstone audio.
// Unlike iframe/render tests, requires Mixcloud to report advancing timeline.
// Never downloads, transcodes, caches, proxies or stores publisher content.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.env.FAITHHUB_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
let testFailures=0;
try {
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'en-AU'});
  const log=[];
  page.on('pageerror',e=>log.push('PAGE ERROR '+e.message));
  page.on('console',m=>{if(m.type()==='error')log.push('CONSOLE ERROR '+m.text().slice(0,180));});
  page.on('requestfailed',r=>{
    if(/mixcloud|audio|cdn|akamai|cloudfront|media|widget/i.test(r.url()))
      log.push('REQ FAIL '+new URL(r.url()).hostname+' '+(r.failure()?.errorText||'').slice(0,140));
  });
  page.on('response',res=>{
    if((res.status()>=400) && /mixcloud|audio|cdn|media|widget/i.test(res.url()))
      log.push('HTTP '+res.status()+' '+new URL(res.url()).hostname);
  });
  const resp=await page.goto(base+'/podcasts.html?topic=cornerstone',{waitUntil:'domcontentloaded',timeout:35000});
  assert.equal(resp.status(),200);
  await page.getByText(/117 Cornerstone recordings:/).waitFor({timeout:60000});
  await page.locator('#search').fill('Heart of the Father');
  const card=page.locator('#grid article').filter({hasText:'The Heart of the Father – Part 1'}).first();
  await card.waitFor({timeout:15000});
  const button=card.getByRole('button',{name:'Listen here'});
  await button.click();
  const iframe=page.locator('#playerHost iframe');
  await iframe.waitFor();
  const src=await iframe.getAttribute('src');
  assert.ok(src.startsWith('https://www.mixcloud.com/widget/iframe/'),'Only official widget allowed');
  console.log('SOURCE_WIDGET',src);
  const frame=await (await iframe.elementHandle()).contentFrame();
  try{await frame.waitForLoadState('domcontentloaded',{timeout:18000})}catch{}
  await page.waitForTimeout(3500);
  let buttons=[];
  try{
    buttons=await frame.locator('button,[role=button],input[type=button]').evaluateAll(xs=>xs.slice(0,24).map(x=>({
      tag:x.tagName,cls:String(x.className).slice(0,90),title:x.title,aria:x.getAttribute('aria-label'),text:x.textContent?.trim().slice(0,70)
    })));
  }catch(e){log.push('FRAME INSPECT ERROR '+e.message.slice(0,160))}
  console.log('FRAME_BUTTONS',JSON.stringify(buttons));
  console.log('FRAME_URL',frame.url());
  await page.addScriptTag({url:'https://widget.mixcloud.com/media/js/widgetApi.js'});
  const widgetReady=await page.evaluate(async()=>{
    if(!window.Mixcloud?.PlayerWidget)return false;
    const widget=window.Mixcloud.PlayerWidget(document.querySelector('#playerHost iframe'));
    window.__mixWidget=widget;
    window.__mixEvents=[];
    try{
      await Promise.race([widget.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Mixcloud widget ready timeout')),12000))]);
      for(const event of ['play','pause','progress','buffering','error','ended']){
        widget.events[event].on((...args)=>window.__mixEvents.push({event,details:args.slice(0,2),at:Date.now()}));
      }
      return true;
    }catch(e){window.__mixApiError=e.message;return false;}
  });
  console.log('WIDGET_API_READY',widgetReady);
  if(!widgetReady) console.log('WIDGET_API_ERROR',await page.evaluate(()=>window.__mixApiError));
  // Prefer actual player control, not merely programmatic play().
  let clicked=false;
  for(const selector of ['button[aria-label*="Play" i]','[role=button][aria-label*="Play" i]','button[title*="Play" i]','.play-button','.playButton','button:has(svg)','[class*=play-button]']){
    try{
      const loc=frame.locator(selector).first();
      if(await loc.count() && await loc.isVisible()){
        await loc.click({timeout:4500});clicked=true;
        console.log('CLICKED_IN_WIDGET',selector);
        break;
      }
    }catch(e){log.push('CLICK FAILED '+selector+' '+e.message.slice(0,90))}
  }
  // API control via real user gesture as a fallback.
  if(!clicked && widgetReady){
    await page.evaluate(()=>{
      const b=document.createElement('button');b.id='play-ci';b.textContent='Play test';
      b.addEventListener('click',()=>{window.__mixWidget.play().catch(e=>window.__mixEvents.push({event:'playRejected',details:[e.message],at:Date.now()}));});
      document.body.append(b);
    });
    await page.locator('#play-ci').click();
    clicked=true;console.log('CLICKED_API_PLAY_WITH_USER_GESTURE');
  }
  if(!clicked) console.log('NO_PLAY_CONTROL_FOUND');
  const results=[];
  for(let i=0;i<7;i++){
    await page.waitForTimeout(3200);
    if(widgetReady){
      const item=await page.evaluate(async()=>{
        const w=window.__mixWidget;
        const [p,paused,duration]=await Promise.allSettled([w.getPosition(),w.getIsPaused(),w.getDuration()]);
        const unwrap=(x)=>x.status==='fulfilled'?x.value:'ERROR: '+x.reason?.message;
        return {pos:unwrap(p),paused:unwrap(paused),duration:unwrap(duration),events:window.__mixEvents.slice(-15)};
      }).catch(e=>({error:e.message}));
      results.push(item);console.log('PLAYBACK_SAMPLE',i,JSON.stringify(item));
      const nums=results.map(v=>v.pos).filter(x=>typeof x==='number');
      if(nums.length>=2 && Math.max(...nums)-Math.min(...nums)>=2) break;
    }
  }
  console.log('PLAYBACK_ERRORS',JSON.stringify(log.slice(-30)));
  const positions=results.map(v=>v.pos).filter(x=>typeof x==='number');
  const progress=positions.length>=2?Math.max(...positions)-Math.min(...positions):0;
  console.log('RESULT_SUMMARY',JSON.stringify({iframeLoaded:true,clicked,apiReady:widgetReady,progressSeconds:progress,positions,events:results.at(-1)?.events?.map(e=>e.event)}));
  assert.ok(progress>=2,'Audio NOT VERIFIED: Mixcloud timeline did not advance by two seconds during actual browser playback test');
  console.log('PASS_REAL_AUDIO_PROGRESS');
}catch(e){console.error('PLAYBACK_TEST_FAILED',e.stack);testFailures++}
finally{await browser.close();}
if(testFailures)process.exitCode=1;
