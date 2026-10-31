// Real Chromium acceptance of user-selected private Drive and on-device audio.
// No personal Drive IDs or files appear in the public repository/test fixture.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
const base=(process.env.FAITHHUB_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
try{
  for(const width of [390,1100]){
    const context=await browser.newContext({viewport:{width,height:820}});
    const page=await context.newPage();
    await page.route('**/cornerstone-episodes.json',route=>route.fulfill({
      status:200,contentType:'application/json',body:JSON.stringify({version:1,shows:[],episodes:[
        {id:'cornerstone:episode:293630407:public-test',title:'A genuine public Mixcloud Muster',show:'Cornerstone Community Podcast',
         showId:'293630407',tags:['cornerstone'],mode:'mixcloud',provider:'mixcloud',
         url:'https://www.mixcloud.com/cornerstonecommunitypodcast/muster-2018-andrew-vincent-first-things-first/',
         embed:'https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2Fcornerstonecommunitypodcast%2Fmuster-2018-andrew-vincent-first-things-first%2F'}
      ]})
    }));
    await page.goto(base+'/podcasts.html',{waitUntil:'domcontentloaded'});
    await page.getByText('31 of 31 recordings shown').waitFor({timeout:16000});
    await page.locator('#filter').selectOption('cornerstone');
    assert.equal(await page.locator('#grid [data-select]').count(),1);
    await page.locator('#grid [data-select]').click();
    assert.match(await page.locator('#playerHost iframe').getAttribute('src'),/mixcloud\.com\/widget\/iframe/);
    const DRIVE='PRIVATE_TEST_ID_0123456789';
    const manifest={version:1,recordings:[{title:'My private Cornerstone talk',driveId:DRIVE}]};
    await page.locator('#driveCatalogueFile').setInputFiles({
      name:'my-cornerstone-private.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(manifest))
    });
    await page.getByText(/1 Drive entries imported/).waitFor();
    await page.locator('#filter').selectOption('cornerstone-private');
    assert.equal(await page.locator('#grid article').count(),1);
    await page.locator('#grid [data-select]').click();
    assert.equal(await page.locator('#playerHost iframe').getAttribute('src'),'https://drive.google.com/file/d/'+DRIVE+'/preview');
    assert.equal(await page.evaluate(id=>localStorage.getItem('faithhub-cornerstone-drive-private-v1').includes(id),DRIVE),true);
    // Only synthetic metadata persists between reloads.
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#filter').selectOption('cornerstone-private');
    assert.equal(await page.locator('#grid article').count(),1);
    await page.locator('#privateAudioFiles').setInputFiles({
      name:'one-local-sermon.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('ID3 synthetic test only')
    });
    await page.getByText(/1 audio file\(s\) loaded/).waitFor();
    assert.equal(await page.locator('#grid article').count(),2);
    await page.getByRole('button',{name:'Listen here'}).last().click();
    assert.match(await page.locator('#playerHost audio').getAttribute('src'),/^blob:/);
    await page.locator('#clearLocalAudio').click();
    assert.equal(await page.locator('#grid article').count(),1);
    await page.locator('#clearPrivateCatalogue').click();
    assert.equal(await page.locator('#grid article').count(),0);
    assert.equal(await page.evaluate(()=>localStorage.getItem('faithhub-cornerstone-drive-private-v1')),null);
    const pageErrors=[];
    page.on('pageerror',e=>pageErrors.push(e.message));
    const sizes=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(sizes.scroll<=sizes.inner+1,JSON.stringify(sizes));
    assert.deepEqual(pageErrors,[]);
    await context.close();
    console.log('PASS private Drive import, signed-in preview, local MP3, deletion and Mixcloud embed:',width);
  }
}finally{await browser.close();}
