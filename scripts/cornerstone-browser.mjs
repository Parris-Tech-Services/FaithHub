import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.FAITHHUB_BASE_URL || 'http://127.0.0.1:8765';
const browser = await chromium.launch({headless:true});
try {
  for (const viewport of [{width:390,height:844},{width:1280,height:900}]) {
    const page = await browser.newPage({viewport});
    await page.goto(base+'/cornerstone-teachings.html',{waitUntil:'domcontentloaded'});
    await page.getByRole('heading',{name:'Cornerstone Teachings'}).waitFor();
    assert.equal(await page.locator('#resources .resource').count(),11);
    assert.equal(await page.locator('#pathways button').count(),6);
    await page.locator('#search').fill('Laurie');
    assert.ok(await page.locator('#resources .resource').count() >= 2);
    await page.locator('#search').fill('');
    await page.locator('#kind').selectOption('video');
    assert.equal(await page.locator('#resources .resource').count(),2);
    await page.locator('#kind').selectOption('all');
    await page.getByRole('button',{name:'Romans 12',exact:true}).click();
    await page.getByRole('heading',{name:'Let love be genuine'}).waitFor();
    assert.match(await page.locator('#verseLink').getAttribute('href'),/ROM\.12\.9-13/);
    await page.locator('#check').click();
    assert.match(await page.locator('#feedback').textContent(),/Choose one answer/);
    await page.locator('input[name="cornerstone-answer"][value="1"]').check();
    await page.locator('#check').click();
    assert.match(await page.locator('#feedback').textContent(),/That's right/);
    await page.locator('#journal').fill('A private reflection for browser acceptance.');
    await page.locator('#save').click();
    assert.match(await page.locator('#storageStatus').textContent(),/Saved in this browser/);
    await page.getByRole('button',{name:'Jesus in Mark'}).click();
    await page.getByRole('button',{name:'Romans 12',exact:true}).click();
    assert.equal(await page.locator('#journal').inputValue(),'A private reflection for browser acceptance.');
    await page.locator('#export').click();
    assert.match(await page.locator('#storageStatus').textContent(),/exported/);
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#clear').click();
    assert.equal(await page.locator('#journal').inputValue(),'');
    assert.equal(await page.evaluate(() => localStorage.getItem('faithhub-cornerstone-journal-v1')),null);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    assert.equal(overflow,false,'No horizontal scroll at viewport '+viewport.width);
    await page.close();
  }
  console.log('Cornerstone Teachings: responsive resource search, 6-path navigation, quiz, local save/export/delete all passed.');
} finally {
  await browser.close();
}
