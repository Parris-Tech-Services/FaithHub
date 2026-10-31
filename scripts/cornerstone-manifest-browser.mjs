// Browser acceptance: the Colab CSV is imported locally, searchable, persistent,
// and no personal Drive IDs are uploaded, fetched or committed by FaithHub.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.env.FAITHHUB_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const fakeId='1FakePrivateDriveAudioABC123';
const fakeOther='1FakePrivateDriveAudioDEF456';
const fixture='source_folder,filename,status,copy_file_id,bytes,source_file_id,error\r\n'+
  'Cornerstone Podcasts/Paul Roe,Paul_Roe_Resurrection.mp3,copied and verified,'+fakeId+',125000,secret-old-id,\r\n'+
  'Cornerstone Podcasts/Pete Vol,"Love, Fruit of the Spirit.mp3",copied and verified,'+fakeOther+',165000,secret-old-id-2,\r\n'+
  'Cornerstone Podcasts,MONO-020.mp3,copied and verified,1ZeroLength1234567890,0,secret,\r\n';
try{
  const page=await browser.newPage({viewport:{width:390,height:844},locale:'en-AU'});
  const externalCalls=[];
  page.on('request',req=>{if(req.url().includes('drive.google.com'))externalCalls.push(req.url())});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/cornerstone-episodes.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:1,shows:[],episodes:[]})}));
  const result=await page.goto(base+'/podcasts.html?topic=cornerstone',{waitUntil:'domcontentloaded'});
  assert.equal(result?.status(),200);
  await page.locator('#driveCatalogueFile').setInputFiles({name:'Josh_Calder_Cornerstone_Copy_Results.csv',mimeType:'text/csv',buffer:Buffer.from(fixture)});
  await page.getByText(/2 Drive entries imported; 2 private recordings available/).waitFor({timeout:15000});
  assert.match(await page.locator('#privateImportStatus').innerText(),/1 zero-byte entries excluded/);
  await page.locator('#filter').selectOption('cornerstone-private');
  assert.equal(await page.locator('#grid article').count(),2);
  await page.locator('#search').fill('Paul Roe');
  assert.equal(await page.locator('#grid article').count(),1);
  await page.locator('#grid [data-select]').click();
  assert.match(await page.locator('#playerHost iframe').getAttribute('src'),new RegExp(fakeId+'/preview'));
  assert.match(await page.locator('#playerMeta').innerText(),/Paul Roe/);
  assert.ok(!externalCalls.some(u=>u.includes(fakeOther)),'Unselected Drive file must not load');
  const stored=await page.evaluate(()=>localStorage.getItem('faithhub-cornerstone-drive-private-v1'));
  assert.match(stored,/Paul Roe/);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#filter').selectOption('cornerstone-private');
  assert.equal(await page.locator('#grid article').count(),2,'All saved private recordings restored after reload');
  assert.equal(await page.locator('#search').inputValue(),''); // Search resets on reload
  await page.locator('#search').fill('Love, Fruit');
  assert.equal(await page.locator('#grid article').count(),1);
  await page.locator('#clearPrivateCatalogue').click();
  assert.equal(await page.locator('#grid article').count(),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('faithhub-cornerstone-drive-private-v1')),null);
  assert.deepEqual(errors,[]);
  console.log('PASS: local CSV, folder metadata, search, Drive preview, persistence, privacy, clearing');
}finally{await browser.close()}
