// Headless Chromium coverage for the reported UXAuditPro findings.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const {chromium} = require("playwright");
const origin = process.env.FAITHHUB_URL || "http://127.0.0.1:8765";

// Simulate the documented shared-shell launcher's original 34px/fixed/low-opacity
// defaults. The production shell itself remains external and unchanged.
const stubSharedShell = "(" + function mockShell(){
  const launcher=document.createElement("button");
  launcher.id="parris-tools-launcher";
  launcher.type="button";
  launcher.textContent="⚙";
  launcher.setAttribute("aria-label","Open app settings");
  Object.assign(launcher.style,{position:"fixed",right:"10px",bottom:"10px",width:"34px",height:"34px",
    opacity:".58",background:"rgba(15,23,42,.72)",color:"#f8fafc",border:"1px solid #94a3b8",zIndex:"2147483646"});
  const panel=document.createElement("div");
  panel.id="parris-tools-panel";panel.hidden=true;panel.textContent="Shared app tools";
  Object.assign(panel.style,{position:"fixed",right:"10px",bottom:"52px",width:"200px",padding:"12px",
    background:"#0f172a",color:"#fff",zIndex:"2147483646"});
  launcher.addEventListener("click",()=>{panel.hidden=!panel.hidden;launcher.setAttribute("aria-expanded",String(!panel.hidden))});
  document.body.append(panel,launcher);
} + ")();";
function rgb(input){return (input.match(/[\d.]+/g)||[]).map(Number).slice(0,3)}
function lum(x){const p=x.map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});return .2126*p[0]+.7152*p[1]+.0722*p[2]}
function contrast(a,b){const l=[lum(rgb(a)),lum(rgb(b))].sort((x,y)=>y-x);return(l[0]+.05)/(l[1]+.05)}
async function metrics(page){return page.locator("#parris-tools-launcher").evaluate(el=>{const r=el.getBoundingClientRect(),css=getComputedStyle(el);return{width:r.width,height:r.height,x:r.x,y:r.y,color:css.color,background:css.backgroundColor,opacity:css.opacity,position:css.position,inside:el.parentElement?.id}})}
async function main(){
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,390,768,1280]){
   const page=await browser.newPage({viewport:{width,height:844},timezoneId:"Australia/Sydney"});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   await page.route("**/WhirringWilderness/network/parris-network.js*",r=>r.fulfill({status:200,contentType:"application/javascript",body:stubSharedShell}));
   await page.goto(origin+"/",{waitUntil:"domcontentloaded"});
   await page.locator('[data-tab="today"]').waitFor();
   await page.locator("#parris-tools-launcher").waitFor();
   await page.waitForFunction(()=>document.querySelector("#parris-tools-launcher")?.parentElement?.id==="faithhub-tools-slot");
   const s=await metrics(page);
   assert.equal(s.inside,"faithhub-tools-slot",width+"px settings not in toolbar");
   assert.equal(s.position,"static",width+"px settings remain fixed");
   assert.ok(s.width>=44&&s.height>=44,width+"px target "+s.width+"x"+s.height);
   assert.equal(s.opacity,"1",width+"px gear opacity");
   assert.ok(contrast(s.color,s.background)>=4.5,width+"px gear contrast "+contrast(s.color,s.background));
   const scroll=await page.evaluate(()=>({page:document.documentElement.scrollWidth,view:document.documentElement.clientWidth}));
   assert.ok(scroll.page<=scroll.view+1,width+"px horizontal overflow "+JSON.stringify(scroll));
   assert.equal(await page.locator("#faithhub-podcast-button").count(),0);
   await page.locator(".resource-links summary").click();
   const genesis=page.locator('a[href="ab401a-genesis.html"]');
   assert.ok(await genesis.isVisible(),width+"px Genesis is hidden");
   await genesis.scrollIntoViewIfNeeded();
   const hit=await genesis.evaluate(el=>{const r=el.getBoundingClientRect();const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return t===el||el.contains(t)});
   if(!hit){const debug=await genesis.evaluate(el=>{const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,other=document.elementFromPoint(cx,cy);return {rect:{x:r.x,y:r.y,width:r.width,height:r.height},viewport:{width:innerWidth,height:innerHeight},hit:other?.outerHTML?.slice(0,440),parent:el.parentElement?.outerHTML?.slice(0,350)}});console.log('GENESIS_HIT_DEBUG',width,JSON.stringify(debug));}
   assert.ok(hit,width+"px Genesis link covered");
   await page.locator('[data-tab="sabbath"]').click();
   assert.equal(await page.locator('[data-tab="sabbath"]').getAttribute("aria-selected"),"true");
   assert.ok(await page.getByText("Sabbath / rest").isVisible());
   await page.locator("#parris-tools-launcher").click();
   assert.ok(await page.locator("#parris-tools-panel").isVisible(),"Settings panel didn't open");
   assert.equal(await page.locator("#parris-tools-panel").evaluate(el=>getComputedStyle(el).position),"absolute");
   await page.locator("#parris-tools-launcher").click();
   await page.locator("#themeBtn").click();
   const dark=await metrics(page);
   assert.ok(contrast(dark.color,dark.background)>=4.5,width+"px dark settings contrast");
   await page.locator("#themeBtn").click();
   await page.locator('[data-tab="today"]').focus();
   await page.keyboard.press("ArrowRight");
   assert.equal(await page.locator('[data-tab="prayer"]').getAttribute("aria-selected"),"true");
   await page.locator('[data-tab="reflection"]').click();
   const grateful=page.locator('[data-ref="gratitude"]');
   await grateful.fill("Thank you for a faithful beginning");
   assert.equal(await grateful.evaluate(el=>document.activeElement===el),true,"Typing lost focus");
   await grateful.press("End");await page.keyboard.type("!");
   assert.equal(await grateful.inputValue(),"Thank you for a faithful beginning!","Second keystroke lost");
   page.once("dialog",d=>d.dismiss());await page.locator("#resetBtn").click();
   assert.equal(await grateful.inputValue(),"Thank you for a faithful beginning!","Cancelled reset deleted data");
   page.once("dialog",d=>d.accept());await page.locator("#resetBtn").click();
   assert.equal(await page.locator('[data-ref="gratitude"]').inputValue(),"","Confirmed reset failed");
   await page.locator('[data-tab="family"]').click();
   const note=page.locator('[data-nested="community:notes"]');
   await note.fill("Two words");await note.press("End");await page.keyboard.type(" more");
   assert.equal(await note.inputValue(),"Two words more","Family typing interrupted");
   if(width===390){fs.mkdirSync("test-results",{recursive:true});await page.locator('[data-tab="today"]').click();await page.screenshot({path:"test-results/faithhub-mobile-390.png",fullPage:true})}
   assert.deepEqual(errors,[],width+"px JavaScript error");
   console.log("PASS "+width+"px | 48px settings, contrast "+contrast(s.color,s.background).toFixed(2)+":1; nav, keyboard and reflection work");
   await page.close();
  }
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e.stack||String(e));process.exitCode=1});
