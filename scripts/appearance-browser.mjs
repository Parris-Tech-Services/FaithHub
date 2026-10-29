import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn('npm',['run','dev','--','--host','127.0.0.1'],{stdio:'ignore'});
const wait=async()=>{for(let i=0;i<50;i++){try{const r=await fetch('http://127.0.0.1:5173/');if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('Vite unavailable');};
let browser;
try {
 await wait(); browser=await chromium.launch({headless:true});
 for(const width of [360,390,768,1280]){
  const context=await browser.newContext({viewport:{width,height:820},deviceScaleFactor:1});
  const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'}); console.log('HTTP',response?.status());
  console.log('PAGE',width,page.url(),(await page.content()).slice(0,450)); await page.locator('.appearance-settings summary').click({timeout:5000});
  const selector=page.locator('#faithhub-style');
  for(const [value,cls] of [['original',''],['sanctuary','sanctuary-theme'],['uxpilot','uxpilot-theme']]){
   await selector.selectOption(value);assert.equal(await selector.inputValue(),value);
   if(cls)assert.equal(await page.locator('body').evaluate((el,c)=>el.classList.contains(c === 'sanctuary-theme' ? 'style-sanctuary' : 'style-editorial'),cls),true);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert.ok(overflow<=2,`Horizontal overflow ${overflow}px at ${width}px in ${value}`);
  }
  await page.reload();await page.locator('.appearance-settings summary').click();
  assert.equal(await page.locator('#faithhub-style').inputValue(),'uxpilot');
  assert.equal(errors.length,0,errors.join('; '));
  await page.screenshot({path:`faithhub-${width}.png`,fullPage:true});
  await context.close();
 }
 console.log('PASS: 3 styles, persistence, no horizontal overflow, 4 viewports, no runtime errors');
} finally {await browser?.close();server.kill();}
