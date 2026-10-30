// Real browser test of the local published HTML, with no personal data or audio autoplay.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.env.FAITHHUB_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:1,locale:'en-AU'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+'/podcasts.html',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200);
  await page.getByText('33 of 33 recordings shown').waitFor();
  assert.equal(await page.locator('#grid article').count(),33);
  assert.equal(await page.locator('#playerHost iframe, #playerHost audio').count(),0,'No provider embed before selection');
  await page.locator('#search').fill('Augustine');
  assert.equal(await page.locator('#grid article').count(),1);
  await page.locator('#grid [data-select]').click();
  assert.match(await page.locator('#playerHost iframe').getAttribute('src'),/embed\.podcasts\.apple\.com\/au\/podcast\/episode\/id1597828386\?i=1000786452531/);
  assert.match(await page.locator('#publisherLink').getAttribute('href'),/podcasts\.apple\.com\/au/);
  await page.locator('#search').fill('');
  await page.locator('#filter').selectOption('audio');
  assert.equal(await page.locator('#grid article').count(),1);
  await page.locator('#grid [data-select]').click();
  assert.equal(await page.locator('#playerHost iframe').count(),0,'Previous Apple iframe removed');
  assert.match(await page.locator('#playerHost audio').getAttribute('src'),/WP-Chap26\.mp3$/);
  assert.equal(await page.locator('#publisherLink').getAttribute('href'),'https://www.discerninghearts.com/catholic-podcasts/dh-daily-lenten-school-prayer-st-teresa-avila-chap-26-way-perfection/');
  await page.locator('#filter').selectOption('external');
  assert.equal(await page.locator('#grid article').count(),4,'Existing external prayer and three Cornerstone collections');
  assert.equal(await page.locator('#grid [data-select]').count(),0,'External-only content should never claim playable audio');
  await page.locator('#search').fill('Pray As You Go');
  assert.equal(await page.locator('#grid article').count(),1);
  assert.equal(await page.locator('#grid article a').getAttribute('href'),'https://prayasyougo.org/');
  await page.locator('#search').fill('');
  await page.locator('#filter').selectOption('cornerstone');
  assert.equal(await page.locator('#grid article').count(),3);
  assert.equal(await page.locator('#grid [data-select]').count(),0,'Cornerstone links open at official publisher, not fake embeds');
  await page.locator('#filter').selectOption('spotify');
  assert.equal(await page.locator('#grid article').count(),25);
  await page.locator('#grid [data-select]').first().click();
  assert.match(await page.locator('#playerHost iframe').getAttribute('src'),/^https:\/\/open\.spotify\.com\/embed\/episode\//);
  assert.equal(await page.locator('#playerHost audio').count(),0,'Old audio source removed');
  const widths=await page.evaluate(()=>({inner:window.innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(widths.scroll<=widths.inner+1,'Podcast page has mobile overflow '+JSON.stringify(widths));

  // A historic numeric selection remains usable, without loading a third-party embed on startup.
  await page.evaluate(()=>{
    localStorage.removeItem('faithhub-podcast-selected-v2');
    localStorage.setItem('faithhub-local-podcast-v1','10');
  });
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#playerTitle').textContent(),'How Does Jesus Teach Us to Pray?');
  assert.equal(await page.locator('#playerHost iframe, #playerHost audio').count(),0);
  await page.goto(base+'/podcasts.html?episode=apple%3Ateresa-2026',{waitUntil:'domcontentloaded'});
  assert.match(await page.locator('#playerTitle').textContent(),/Teresa/);
  assert.equal(await page.locator('#filter').inputValue(),'prayer');
  assert.equal(await page.locator('#playerHost iframe').count(),0);
  await page.locator('#filter').selectOption('all');
  await page.locator('#search').fill('no-such-podcast-episode-123');
  assert.equal(await page.locator('#grid article').count(),0);
  assert.equal(await page.locator('#empty').isVisible(),true);
  assert.deepEqual(errors,[],'No uncaught page JS exceptions');
  await context.close();

  const desktop=await browser.newContext({viewport:{width:1366,height:900}});
  const dp=await desktop.newPage();
  await dp.goto(base+'/podcasts.html',{waitUntil:'domcontentloaded'});
  assert.equal(await dp.locator('#grid article').count(),33);
  await dp.locator('#filter').selectOption('prayer');
  assert.ok(await dp.locator('#grid article').count()>=5);
  await desktop.close();
  console.log('PASS: unified 33-item catalogue, Apple/Spotify/publisher player selection, external fallback, search, mobile, desktop, deep links and legacy migration.');
} finally{
  await browser.close();
}
