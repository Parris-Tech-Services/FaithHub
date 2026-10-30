import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const BASE=(process.env.FAITHHUB_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:390,height:844},{width:1366,height:900}]){
  const context=await browser.newContext({viewport,acceptDownloads:true});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const res=await page.goto(BASE+'/backup.html',{waitUntil:'domcontentloaded'});
  assert.equal(res?.status(),200,'Backup centre must load');
  await page.evaluate(()=>{
    localStorage.setItem('faithhub-rule-of-life-v2',JSON.stringify({entries:{synthetic:{reflection:{prayer:'Synthetic CI prayer; not real data'}}}}));
    localStorage.setItem('faithhub-intercessions-v1',JSON.stringify([{id:'test-ci',name:'Imaginary A',request:'Synthetic need'}]));
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByText('2 of 12 known data types currently saved').waitFor();
  const dl=page.waitForEvent('download');
  await page.locator('#export-all').click();
  const download=await dl;
  assert.match(download.suggestedFilename(),/^faithhub-private-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const raw=await readFile(await download.path(),'utf8');
  const backup=JSON.parse(raw);
  assert.equal(backup.version,1);
  assert.equal(Object.keys(backup.records).length,2);
  assert.match(backup.records['faithhub-intercessions-v1'],/Imaginary A/);
  await page.evaluate(()=>{
    localStorage.removeItem('faithhub-rule-of-life-v2');
    localStorage.removeItem('faithhub-intercessions-v1');
  });
  await page.reload({waitUntil:'domcontentloaded'});
  assert.match(await page.locator('#data-count').textContent(),/0 of 12/);
  await page.locator('#import-all').setInputFiles({name:'faithhub-original.json',mimeType:'application/json',buffer:Buffer.from(raw)});
  await page.getByText(/This mode would restore 2/).waitFor();
  assert.equal(await page.locator('#restore-all').isEnabled(),true);
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#restore-all').click();
  await page.getByText(/Restored 2 data type\(s\)/).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('faithhub-intercessions-v1')),backup.records['faithhub-intercessions-v1']);
  // Default restore never overwrites existing notes.
  await page.evaluate(()=>localStorage.setItem('faithhub-intercessions-v1','[{"id":"new","name":"Preserve"}]'));
  await page.locator('#import-all').setInputFiles({name:'faithhub-original.json',mimeType:'application/json',buffer:Buffer.from(raw)});
  await page.getByText(/This mode would restore 0/).waitFor();
  assert.equal(await page.locator('#restore-all').isDisabled(),true);
  assert.match(await page.evaluate(()=>localStorage.getItem('faithhub-intercessions-v1')),/Preserve/);
  await page.locator('#overwrite-option').check();
  await page.getByText(/This mode would restore 1/).waitFor();
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#restore-all').click();
  await page.getByText(/Restored 1 data type\(s\)/).waitFor();
  assert.match(await page.evaluate(()=>localStorage.getItem('faithhub-intercessions-v1')),/Imaginary A/);
  const afterOverwrite=await page.evaluate(()=>localStorage.getItem('faithhub-intercessions-v1'));
  await page.locator('#import-all').setInputFiles({name:'malformed.json',mimeType:'application/json',buffer:Buffer.from('{"version":900}')});
  await page.getByText(/Not ready to restore/).waitFor();
  assert.equal(await page.locator('#restore-all').isDisabled(),true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('faithhub-intercessions-v1')),afterOverwrite);
  const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));
  assert.ok(widths.scroll<=widths.view+1,'Horizontal overflow: '+JSON.stringify(widths));
  assert.deepEqual(errors,[],'No uncaught page errors');
  await context.close();
 }
 console.log('PASS backup centre: both viewports, actual download bytes, restore, conservative conflicts, confirmed overwrite, malformed import and privacy');
}finally{await browser.close();}
