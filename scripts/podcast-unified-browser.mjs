// Real browser test of the local published HTML, with no personal data or audio autoplay.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.env.FAITHHUB_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
// Synthetic catalogue replaces the public feed only in ephemeral CI browsers.
const publicFeedFixture={
  version:1,shows:[
    {showId:293630407,title:'Cornerstone Community Podcast',expectedByPublisher:96},
    {showId:1631726711,title:'Cornerstone Community Bendigo',expectedByPublisher:18},
    {showId:1631658757,title:'Cornerstone Community Bendigo — Paul Roe',expectedByPublisher:1}
  ],
  episodes:Array.from({length:115},(_,i)=>{
    const old=i<96,paul=i===114;
    const id=old?'293630407':paul?'1631658757':'1631726711';
    const title=paul?'Paul Roe — The Character of Jesus':old?'Cornerstone archive talk '+(i+1):'Bendigo Muster '+(i-95);
    return {
      id:'cornerstone:episode:'+id+':fixture-'+i,title,show:old?'Cornerstone Community Podcast':paul?'Paul Roe':"Cornerstone Community Bendigo",
      tags:['cornerstone','discipleship'],duration:'38 min',provider:old?'external':'audio',mode:old?'unavailable':'audio',
      url:'https://podcasts.apple.com/au/podcast/id'+id,
      embed:'https://public-media.example.org/audio/'+i+'.mp3',date:'2018-12-01',note:'Synthetic browser fixture',showId:id
    };
  })
};
const addFixture=async page=>{
  await page.route('**/cornerstone-episodes.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(publicFeedFixture)}));
  // This legacy-provider regression isolates the 115 historic RSS entries.
  // Public 205-file archive has its own real-media browser acceptance.
  await page.route('**/assets/cornerstone-public-recordings.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:1,entries:[]})}));
};
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:1,locale:'en-AU'});
  const page=await context.newPage();
  await addFixture(page);
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+'/podcasts.html',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200);
  await page.getByText('145 of 145 recordings shown').waitFor();
  assert.equal(await page.locator('#grid article').count(),145);
  assert.equal(await page.locator('#playerHost iframe, #playerHost audio').count(),0,'No provider embed before selection');
  await page.locator('#search').fill('Augustine');
  assert.equal(await page.locator('#grid article').count(),1);
  await page.locator('#grid [data-select]').click();
  assert.match(await page.locator('#playerHost iframe').getAttribute('src'),/embed\.podcasts\.apple\.com\/au\/podcast\/episode\/id1597828386\?i=1000786452531/);
  assert.match(await page.locator('#publisherLink').getAttribute('href'),/podcasts\.apple\.com\/au/);
  await page.locator('#search').fill('');
  await page.locator('#filter').selectOption('audio');
  assert.equal(await page.locator('#grid article').count(),20);
  await page.locator('#grid [data-select]').first().click();
  assert.equal(await page.locator('#playerHost iframe').count(),0,'Previous Apple iframe removed');
  assert.match(await page.locator('#playerHost audio').getAttribute('src'),/WP-Chap26\.mp3$/);
  assert.equal(await page.locator('#publisherLink').getAttribute('href'),'https://www.discerninghearts.com/catholic-podcasts/dh-daily-lenten-school-prayer-st-teresa-avila-chap-26-way-perfection/');
  await page.locator('#filter').selectOption('external');
  assert.equal(await page.locator('#grid article').count(),97,'Existing external prayer + 96 historical recordings with unavailable audio');
  assert.equal(await page.locator('#grid [data-select]').count(),0,'External-only content should never claim playable audio');
  await page.locator('#search').fill('Pray As You Go');
  assert.equal(await page.locator('#grid article').count(),1);
  assert.equal(await page.locator('#grid article a').getAttribute('href'),'https://prayasyougo.org/');
  await page.locator('#search').fill('');
  await page.locator('#filter').selectOption('cornerstone-audio');
  assert.equal(await page.locator('#grid article').count(),19);
  await page.locator('#filter').selectOption('cornerstone-archive');
  assert.equal(await page.locator('#grid article').count(),96);
  assert.equal(await page.locator('#grid [data-select]').count(),0);
  await page.locator('#filter').selectOption('cornerstone');
  assert.equal(await page.locator('#grid article').count(),115);
  assert.equal(await page.locator('#grid [data-select]').count(),19,'19 source streams should be selectable in-page');
  assert.match(await page.locator('#cornerstoneFeedStatus').textContent(),/115 Cornerstone recordings: 19/);
  await page.locator('#search').fill('Paul Roe');
  assert.equal(await page.locator('#grid article').count(),1);
  await page.locator('#grid [data-select]').click();
  assert.match(await page.locator('#playerHost audio').getAttribute('src'),/114\.mp3$/);
  await page.locator('#search').fill('');
  assert.equal(await page.locator('#grid [data-select]').count(),19);
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
  await addFixture(dp);
  await dp.goto(base+'/podcasts.html',{waitUntil:'domcontentloaded'});
  await dp.getByText('145 of 145 recordings shown').waitFor();
  assert.equal(await dp.locator('#grid article').count(),145);
  await dp.locator('#filter').selectOption('prayer');
  assert.ok(await dp.locator('#grid article').count()>=5);
  await desktop.close();
  console.log('PASS: unified 145-item catalogue (30 original+115 Cornerstone, 19 streamable), Apple/Spotify/publisher player selection, external fallback, search, mobile, desktop, deep links and legacy migration.');
} finally{
  await browser.close();
}
