// End-to-end acceptance against the REAL GitHub Pages URL after successful deployment.
// This script makes no changes outside its ephemeral test browser/localStorage.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const BASE = 'https://parris-tech-services.github.io/FaithHub/';
const EXPECTED = process.env.EXPECTED_DEPLOY_SHA || '';
if (EXPECTED && !/^[a-f0-9]{40}$/i.test(EXPECTED)) throw Error('Expected source SHA must be 40 hex chars');
const browser = await chromium.launch({headless:true});
let lastError;
try {
  for(let attempt=1; attempt<=6; attempt++){
    const context=await browser.newContext({
      viewport:{width:390,height:844},isMobile:true,
      deviceScaleFactor:1,locale:'en-AU',
    });
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    try{
      const home=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:30000});
      assert.equal(home?.status(),200,'Real FaithHub home must load');
      const homeMarker=await page.locator('meta[name="faithhub-deploy-sha"]').getAttribute('content').catch(()=>null);
      if(EXPECTED) assert.equal(homeMarker,EXPECTED,'Public homepage is not the verified deployment SHA yet');
      if (!EXPECTED) {
        // PR preview exercises the CURRENT deployed site, whose resource links
        // may still be inside a closed details menu. It cannot assert that the
        // PR's newly visible hero shortcut is already public.
        const collapsed = page.locator('details.resource-links > summary');
        await collapsed.click();
      }
      const psalmsLink=page.getByRole('link',{name:/Explore Scripture .* Psalms/i}).first();
      await psalmsLink.waitFor({timeout:18000});
      await psalmsLink.click();
      await page.waitForURL(url=>url.pathname.endsWith('/FaithHub/psalms.html'),{timeout:18000});
      const passage=page.locator('#passage-title');
      await passage.waitFor();
      const remoteMarker=await page.locator('meta[name="faithhub-deploy-sha"]').getAttribute('content').catch(()=>null);
      if(EXPECTED) assert.equal(remoteMarker,EXPECTED,'Public Psalm page is not the verified deployment SHA yet');
      await page.getByRole('button',{name:/I feel hurt/}).click();
      assert.equal(await passage.textContent(),'Psalm 13','Real live mobile interaction failed');
      const readUrl=await page.locator('#read-passage').getAttribute('href');
      assert.match(readUrl,/PSA\.13\.NIV$/,'Link to authorised Psalm must update');
      const field=page.getByLabel('My honest response');
      await field.fill('Synthetic CI only: no personal prayer');
      await page.getByRole('button',{name:/I feel hurt/}).click();
      assert.equal(await field.inputValue(),'Synthetic CI only: no personal prayer','Repeated click must preserve unsaved reflection');
      await page.getByRole('button',{name:'Save privately'}).click();
      await page.reload({waitUntil:'domcontentloaded'});
      await page.getByRole('button',{name:/I feel hurt/}).click();
      assert.equal(await field.inputValue(),'Synthetic CI only: no personal prayer','Private note should restore from ephemeral browser localStorage');
      page.once('dialog',d=>d.accept());
      await page.getByRole('button',{name:'Delete this note'}).click();
      assert.equal(await field.inputValue(),'','Note must delete after confirmation');
      const widths=await page.evaluate(()=>({
        visible:window.innerWidth, actual:document.documentElement.scrollWidth,
      }));
      assert.ok(widths.actual<=widths.visible+1,'No mobile horizontal overflow: '+JSON.stringify(widths));
      // After a verified main deployment, exercise the newly published prayer guide
      // on an actual mobile Chromium page, not just its Git source.
      if (EXPECTED) {
        const saints = await page.goto(BASE+'saints-prayer.html',{waitUntil:'domcontentloaded',timeout:30000});
        assert.equal(saints?.status(),200,'The saints prayer guide must be publicly published');
        await page.getByRole('heading',{name:'Jesus, teach me to pray.'}).waitFor();
        await page.getByRole('heading',{name:'What the saints taught about prayer'}).waitFor();
        const augustine = await page.getByRole('link',{name:"Read Augustine's letter"}).getAttribute('href');
        assert.equal(augustine,'https://www.newadvent.org/fathers/1102130.htm');
        const teresa = await page.getByRole('link',{name:'Listen on Apple Podcasts'}).first().getAttribute('href');
        assert.match(teresa,/i=1000796088412/);
        const saintsWidth = await page.evaluate(()=>({actual:document.documentElement.scrollWidth,visible:window.innerWidth}));
        assert.ok(saintsWidth.actual<=saintsWidth.visible+1,'Saints guide overflows mobile: '+JSON.stringify(saintsWidth));
      }
      if (EXPECTED) {
        // Confirm the exact deployed commit serves the unified podcast catalogue
        // and exposes the correct on-demand provider players on mobile.
        const pod=await page.goto(BASE+'podcasts.html',{waitUntil:'domcontentloaded',timeout:30000});
        assert.equal(pod?.status(),200,'Public unified podcast catalogue missing');
        await page.getByText('30 of 30 recordings shown').waitFor({timeout:10000});
        assert.equal(await page.locator('#grid article').count(),30);
        assert.equal(await page.locator('#playerHost iframe, #playerHost audio').count(),0,
          'Third-party embeds must not preload before listener chooses an episode');
        await page.locator('#search').fill('Augustine');
        assert.equal(await page.locator('#grid article').count(),1);
        await page.locator('#grid [data-select]').click();
        assert.match(await page.locator('#playerHost iframe').getAttribute('src'),
          /embed\.podcasts\.apple\.com\/au\/podcast\/episode\/id1597828386/);
        await page.locator('#filter').selectOption('audio');
        await page.locator('#search').fill('');
        await page.locator('#grid [data-select]').click();
        assert.equal(await page.locator('#playerHost iframe').count(),0);
        assert.match(await page.locator('#playerHost audio').getAttribute('src'),/WP-Chap26\.mp3$/);
        const podWidth=await page.evaluate(()=>({width:window.innerWidth,scroll:document.documentElement.scrollWidth}));
        assert.ok(podWidth.scroll<=podWidth.width+1,'Public podcast page has mobile overflow: '+JSON.stringify(podWidth));
      }
      assert.deepEqual(errors,[],'No uncaught client JS errors');
      await context.close();
      const desk=await browser.newContext({viewport:{width:1366,height:900}});
      const dp=await desk.newPage();
      const result=await dp.goto(BASE+'psalms.html',{waitUntil:'domcontentloaded'});
      assert.equal(result?.status(),200);
      await dp.getByRole('link',{name:/Explore Sons of Korah/}).waitFor();
      await dp.getByRole('link',{name:/Explore the Bible atlas/}).waitFor();
      if(EXPECTED) {
        const marker=await dp.locator('meta[name="faithhub-deploy-sha"]').getAttribute('content');
        assert.equal(marker,EXPECTED);
      }
      await desk.close();
      console.log(JSON.stringify({
        status:'PASS',target:'public deployed GitHub Pages, real Chromium mobile + desktop',
        expected_deploy_sha:EXPECTED||'not asserted (PR preview)',
        source_sha_observed:remoteMarker||'unmarked legacy deployment',
        checks:['home navigation','Psalm 13 interaction','authorised link','unsaved draft',
                'save/reload/delete','no mobile overflow','desktop links','deployed saints guide when SHA bound','no JS errors'],
        caveat:'One scoped browser journey, not whole-product usability or human evaluation',
      }));
      lastError=null;
      break;
    }catch(err){
      lastError=err;
      await context.close();
      const reason = String(err?.message || err);
      // Retry transient networking or actual post-deploy SHA propagation only.
      // A broken element or assertion in PR smoke is a defect, not a reason
      // to waste six browser sessions before reporting the real failure.
      const retryable = /net::|ERR_CONNECTION|ERR_NAME_NOT_RESOLVED/i.test(reason) ||
        (Boolean(EXPECTED) && /not the verified deployment SHA yet/i.test(reason));
      if (!retryable || attempt === 6) throw err;
      console.log('Attempt '+attempt+': '+reason.slice(0,220)+'; retrying a transient condition.');
      await new Promise(resolve=>setTimeout(resolve,8000));
    }
  }
  if(lastError)throw lastError;
}finally{await browser.close();}
