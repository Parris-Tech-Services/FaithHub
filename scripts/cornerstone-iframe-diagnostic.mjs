import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true, args:['--autoplay-policy=no-user-gesture-required']});
const path='http://127.0.0.1:8765/';
try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'en-AU'});
  const errors=[];
  page.on('console',m=>{if(m.type()==='error'&&/Mixed Content|encrypted-media|media/i.test(m.text()))errors.push(m.text().slice(0,230));});
  await page.goto(path+'podcasts.html?topic=cornerstone',{waitUntil:'domcontentloaded'});
  await page.getByText(/117 Cornerstone recordings/).waitFor({timeout:25000});
  await page.locator('#search').fill('The Heart of the Father');
  await page.locator('#grid [data-select]').first().click();
  await page.locator('#playerHost iframe').waitFor();
  await page.waitForTimeout(4500);
  const iframe=page.locator('#playerHost iframe');
  const contentFrame=await (await iframe.elementHandle()).contentFrame();
  const structure=await contentFrame.evaluate(()=>{
    const root=document.body;
    const counts={div:document.querySelectorAll('div').length,button:document.querySelectorAll('button').length,img:document.images.length,svg:document.querySelectorAll('svg').length};
    const hits=[];
    for(const y of [10,30,55,90,120,150])for(const x of [10,30,55,85,120,180,250,310]){
      const el=document.elementFromPoint(x,y);
      if(el&&el!==document.body){const label=String(el.outerHTML).slice(0,280);if(!hits.includes(label))hits.push(label)}
    }
    return {frameLocation:location.pathname,counts,html:(root?.innerHTML||'').slice(0,7000),hits:hits.slice(0,28)};
  });
  console.log('EMBED_DOM',JSON.stringify(structure).slice(0,11000));
  // Click visible left-side Mixcloud play control at distinct plausible widget coordinates.
  const box=await iframe.boundingBox();
  const candidates=[[0.13,0.28],[0.1,0.5],[0.5,0.5],[0.7,0.18]];
  await page.addScriptTag({url:'https://widget.mixcloud.com/media/js/widgetApi.js'});
  const ready=await page.evaluate(async()=>{
    const w=window.Mixcloud.PlayerWidget(document.querySelector('#playerHost iframe'));
    window.__mixWidget=w;await w.ready;return true;
  });
  console.log('WIDGET_READY',ready,'IFRAME_BOX',JSON.stringify(box));
  let successes=0;
  try{
    const play=contentFrame.locator('[data-testid="widget-play-button"]');
    console.log('REAL_WIDGET_PLAY_EXISTS',await play.count());
    await play.click({timeout:9000});
    await page.waitForTimeout(8500);
    const state=await page.evaluate(async()=>({pos:await window.__mixWidget.getPosition(),paused:await window.__mixWidget.getIsPaused(),duration:await window.__mixWidget.getDuration()}));
    console.log('REAL_WIDGET_BUTTON_CLICK',JSON.stringify(state));
    if(typeof state.pos==='number'&&state.pos>=5)successes++;
  }catch(err){console.log('REAL_WIDGET_CLICK_FAILED',String(err).slice(0,320));}
  for(let n=0;n<candidates.length && !successes;n++){
    const [x,y]=candidates[n];
    const pos={x:box.x+box.width*x,y:box.y+box.height*y};
    await page.mouse.click(pos.x,pos.y);
    await page.waitForTimeout(6500);
    const state=await page.evaluate(async()=>{const w=window.__mixWidget;return {time:await w.getPosition(),paused:await w.getIsPaused(),duration:await w.getDuration()}});
    console.log('DIRECT_IFRAME_CLICK',n,JSON.stringify({x,y,state}));
    if(typeof state.time==='number'&&state.time>=2){successes++;break;}
  }
  console.log('BROWSER_MIXCLOUD_WARNINGS',JSON.stringify(errors.slice(0,10)));
  console.log('MIXCLOUD_DIRECT_CLICK_VERIFIED',successes>0);
}finally{await browser.close()}