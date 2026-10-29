// Real Chromium smoke check. Synthetic text only; no publisher or user data is copied.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 8766;
const server = spawn('python3', ['-m','http.server',String(PORT),'--bind','127.0.0.1'], {
  cwd: new URL('..', import.meta.url).pathname, stdio: 'ignore'
});
let browser;
try {
  let up = false;
  for (let i=0;i<35;i++) {
    if (server.exitCode !== null) throw Error('Static server failed');
    try {
      const response = await fetch('http://127.0.0.1:'+PORT+'/psalms.html');
      if (response.ok) { up = true; break; }
    } catch {}
    await sleep(200);
  }
  assert.ok(up, 'Static site must load');

  browser = await chromium.launch({headless:true});
  const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:1});
  const page = await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+PORT+'/psalms.html', {waitUntil:'load'});
  await page.getByRole('heading',{name:'Bring your whole heart to Scripture.'}).waitFor();
  assert.equal(await page.locator('#passage-title').textContent(),'Psalm 23');
  assert.equal(await page.locator('#psalm-options button').count(),4);
  assert.equal(await page.locator('#read-passage').getAttribute('target'),'_blank');

  await page.getByRole('button',{name:/I feel hurt/}).click();
  assert.equal(await page.locator('#passage-title').textContent(),'Psalm 13');
  assert.equal(await page.getByRole('button',{name:/I feel hurt/}).getAttribute('aria-pressed'),'true');
  assert.match(await page.locator('#read-passage').getAttribute('href'),/PSA\.13\.NIV$/);

  const field=page.getByLabel('My honest response');
  await field.fill('Synthetic unsaved prayer');
  await page.getByRole('button',{name:/I want to thank God/}).click();
  await page.getByRole('button',{name:/I feel hurt/}).click();
  assert.equal(await field.inputValue(),'','Switching away must not silently save an unsaved reflection');

  await field.fill('Synthetic private note for browser QA');
  await page.getByRole('button',{name:'Save privately'}).click();
  assert.match(await page.locator('#note-status').textContent(),/Saved in this browser only/);
  await page.reload();
  await page.getByRole('button',{name:/I feel hurt/}).click();
  assert.equal(await field.inputValue(),'Synthetic private note for browser QA');

  page.once('dialog',async dialog=>dialog.dismiss());
  await page.getByRole('button',{name:'Delete this note'}).click();
  assert.equal(await field.inputValue(),'Synthetic private note for browser QA');
  page.once('dialog',async dialog=>dialog.accept());
  await page.getByRole('button',{name:'Delete this note'}).click();
  assert.equal(await field.inputValue(),'');
  assert.match(await page.locator('#note-status').textContent(),/deleted from this browser/);

  const width = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  assert.ok(width.scroll <= width.viewport+1,'No horizontal overflow at mobile viewport: '+JSON.stringify(width));

  await page.getByRole('button',{name:/I need rest/}).focus();
  const outline=await page.getByRole('button',{name:/I need rest/}).evaluate(el=>getComputedStyle(el).outlineStyle);
  assert.notEqual(outline,'none','Keyboard focus indicator must exist');

  await page.screenshot({path:'psalms-mobile-qa.png',fullPage:true});
  await context.close();
  const desktop=await browser.newContext({viewport:{width:1366,height:900}});
  const desktopPage=await desktop.newPage();
  await desktopPage.goto('http://127.0.0.1:'+PORT+'/psalms.html');
  await desktopPage.getByRole('link',{name:/Explore Sons of Korah/}).waitFor();
  await desktopPage.getByRole('link',{name:/Explore the Bible atlas/}).waitFor();
  await desktopPage.screenshot({path:'psalms-desktop-qa.png',fullPage:true});
  assert.deepEqual(errors,[], 'No uncaught browser errors');
  await desktop.close();
  console.log('PASS: Chromium mobile and desktop, four pathways, authorised links, no auto-save, explicit save, cancel/confirm delete, reload, mobile overflow and keyboard focus.');
} finally {
  if(browser) await browser.close();
  server.kill('SIGTERM');
}
