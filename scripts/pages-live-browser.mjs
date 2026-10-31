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
        const teresaInFaithHub = await page.getByRole('link',{name:'Listen in FaithHub'}).first().getAttribute('href');
        assert.equal(teresaInFaithHub,'podcasts.html?episode=apple%3Ateresa-2026');
        const teresa = await page.getByRole('link',{name:'Open in Apple Podcasts'}).first().getAttribute('href');
        assert.match(teresa,/i=1000796088412/);
        const saintsWidth = await page.evaluate(()=>({actual:document.documentElement.scrollWidth,visible:window.innerWidth}));
        assert.ok(saintsWidth.actual<=saintsWidth.visible+1,'Saints guide overflows mobile: '+JSON.stringify(saintsWidth));
      }
      if (EXPECTED) {
        // Confirm the exact deployed commit serves the unified podcast catalogue
        // and exposes the correct on-demand provider players on mobile.
        const pod=await page.goto(BASE+'podcasts.html',{waitUntil:'domcontentloaded',timeout:30000});
        assert.equal(pod?.status(),200,'Public unified podcast catalogue missing');
        const feedResponse=await page.request.get(BASE+'cornerstone-episodes.json');
        assert.equal(feedResponse.status(),200);
        const feed=await feedResponse.json();
        assert.equal(feed.version,1);
        const liveMixcloud=feed.episodes.filter(e=>e.mode==='mixcloud');
        const liveUnplayable=feed.episodes.filter(e=>e.mode==='unavailable');
        const liveAudio=feed.episodes.filter(e=>e.mode==='audio');
        assert.ok(liveMixcloud.length>=90,'Publisher-hosted Mixcloud source recovery unexpectedly missing');
        assert.ok(liveUnplayable.length<=6,'Too many historical podcast sources remain unavailable');
        assert.ok(liveAudio.length>=19,'Working original audio feeds missing');
        const expectedItems=30+feed.episodes.length;
        await page.waitForFunction(n=>document.querySelectorAll('#grid article').length===n,expectedItems,{timeout:16000});
        assert.equal(await page.locator('#grid article').count(),expectedItems);
        assert.equal(await page.locator('#playerHost iframe, #playerHost audio').count(),0,
          'Third-party embeds must not preload before listener chooses an episode');
        await page.locator('#search').fill('Augustine');
        assert.equal(await page.locator('#grid article').count(),1);
        await page.locator('#grid [data-select]').click();
        assert.match(await page.locator('#playerHost iframe').getAttribute('src'),
          /embed\.podcasts\.apple\.com\/au\/podcast\/episode\/id1597828386/);
        await page.locator('#filter').selectOption('audio');
        await page.locator('#search').fill('');
        await page.locator('#grid [data-select]').first().click();
        assert.equal(await page.locator('#playerHost iframe').count(),0);
        assert.match(await page.locator('#playerHost audio').getAttribute('src'),/WP-Chap26\.mp3$/);
        await page.locator('#filter').selectOption('cornerstone');
        assert.equal(await page.locator('#grid article').count(),feed.episodes.length,'All imported Cornerstone recordings must appear');
        const status=await page.locator('#cornerstoneFeedStatus').textContent();
        assert.match(status,/Cornerstone recordings:/);
        assert.equal(await page.locator('#grid [data-select]').count(),liveMixcloud.length+liveAudio.length);
        await page.locator('#search').fill('Character of Jesus - 25th June 2022');
        assert.equal(await page.locator('#grid article').count(),1);
        await page.locator('#grid [data-select]').click();
        assert.match(await page.locator('#playerHost audio').getAttribute('src'),/^https:\/\/anchor\.fm\//);
        await page.locator('#search').fill('Muster 2018 - Andrew Vincent - First Things First');
        assert.equal(await page.locator('#grid article').count(),1);
        assert.equal(await page.locator('#grid [data-select]').count(),1,'Recovered 2018 Muster talk must now offer in-page playback');
        await page.locator('#grid [data-select]').click();
        const frameUrl=await page.locator('#playerHost iframe').getAttribute('src');
        assert.match(frameUrl,/^https:\/\/www\.mixcloud\.com\/widget\/iframe\/\?/,'Official Mixcloud player must load in FaithHub');
        const podWidth=await page.evaluate(()=>({width:window.innerWidth,scroll:document.documentElement.scrollWidth}));
        assert.ok(podWidth.scroll<=podWidth.width+1,'Public podcast page has mobile overflow: '+JSON.stringify(podWidth));
      }
      if (EXPECTED) {
        // Exact deployed SHA must expose Cornerstone Teachings, the six original
        // study paths and a usable interactive, non-graded reflection on mobile.
        const source=await page.goto(BASE+'cornerstone-teachings.html',{waitUntil:'domcontentloaded',timeout:30000});
        assert.equal(source?.status(),200,'Cornerstone Teachings must be published');
        const marker=await page.locator('meta[name="faithhub-deploy-sha"]').getAttribute('content');
        assert.equal(marker,EXPECTED,'Cornerstone page must match exact deployed SHA');
        await page.getByRole('heading',{name:'Cornerstone Teachings'}).waitFor();
        assert.equal(await page.locator('#resources .resource').count(),11);
        assert.equal(await page.locator('#pathways button').count(),6);
        // Check the published theme control, exact source and saved preference.
        await page.evaluate(() => localStorage.setItem('faithhub-theme', 'light'));
        await page.reload({waitUntil:'domcontentloaded'});
        assert.equal(await page.locator('#themeToggle').textContent(), 'Dark mode');
        const bgLight = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        await page.locator('#themeToggle').click();
        assert.equal(await page.locator('#themeToggle').textContent(), 'Light mode');
        assert.equal(await page.locator('#themeToggle').getAttribute('aria-pressed'), 'true');
        assert.equal(await page.evaluate(() => localStorage.getItem('faithhub-theme')), 'dark');
        assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), bgLight);
        await page.reload({waitUntil:'domcontentloaded'});
        assert.equal(await page.locator('#themeToggle').textContent(), 'Light mode', 'Dark mode must persist across live reloads');
        await page.locator('#themeToggle').click();
        assert.equal(await page.evaluate(() => localStorage.getItem('faithhub-theme')), 'light');
        await page.getByRole('button',{name:'Romans 12',exact:true}).click();
        assert.ok((await page.locator('#verseLink').getAttribute('href')).includes('ROM.12.9-13'));
        await page.locator('input[name="cornerstone-answer"][value="1"]').check();
        await page.locator('#check').click();
        assert.match(await page.locator('#feedback').textContent(),/That's right/);
        await page.locator('#journal').fill('Synthetic deployment evidence only');
        await page.locator('#save').click();
        await page.reload({waitUntil:'domcontentloaded'});
        await page.getByRole('button',{name:'Romans 12',exact:true}).click();
        assert.equal(await page.locator('#journal').inputValue(),'Synthetic deployment evidence only');
        page.once('dialog',dialog=>dialog.accept());
        await page.locator('#clear').click();
        assert.equal(await page.locator('#journal').inputValue(),'');
        const size=await page.evaluate(()=>({width:window.innerWidth,scroll:document.documentElement.scrollWidth}));
        assert.ok(size.scroll<=size.width+1,'Cornerstone page must fit mobile viewport');
      }
      if (EXPECTED) {
        // Verify the newly deployed private prayer-card journey with synthetic data
        // in the ephemeral CI browser. No user's actual prayer notes are accessed.
        const prayerResponse=await page.goto(BASE+'intercessions.html',{waitUntil:'domcontentloaded',timeout:30000});
        assert.equal(prayerResponse?.status(),200,'Private intercession guide must be deployed');
        await page.getByText('0 of 0 saved cards shown').waitFor({timeout:10000});
        await page.locator('#card-name').fill('Synthetic CI only');
        await page.locator('#card-request').fill('A fictional prayer request for testing');
        await page.locator('#save-card').click();
        assert.equal(await page.locator('#card-list article').count(),1);
        await page.reload({waitUntil:'domcontentloaded'});
        assert.equal(await page.locator('#card-list article').count(),1,'Local card should survive reload');
        page.once('dialog',dialog=>dialog.accept());
        await page.locator('#delete-all').click();
        assert.equal(await page.locator('#card-list article').count(),0);
        assert.equal(await page.evaluate(()=>localStorage.getItem('faithhub-intercessions-v1')),null);
        const prayerSize=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,visible:window.innerWidth}));
        assert.ok(prayerSize.actual<=prayerSize.visible+1,'Intercession page must not overflow mobile width');
      }
      if(EXPECTED){
        // Exercise a real browser backup/restore on the exact published SHA
        // using exclusively synthetic data, in an isolated CI browser context.
        const backupResponse=await page.goto(BASE+'backup.html',{waitUntil:'domcontentloaded',timeout:30000});
        assert.equal(backupResponse?.status(),200,'Backup centre must be deployed');
        await page.getByText(/known data types currently saved/).waitFor();
        const data=await page.evaluate(()=>{
          localStorage.setItem('faithhub-intercessions-v1',JSON.stringify([{id:'ci-1',name:'Synthetic Person',status:'active'}]));
          return localStorage.getItem('faithhub-intercessions-v1');
        });
        await page.reload({waitUntil:'domcontentloaded'});
        await page.getByText(/known data types currently saved/).waitFor();
        const original=await page.evaluate(()=>localStorage.getItem('faithhub-intercessions-v1'));
        assert.equal(original,data);
        const archive=JSON.stringify({format:'faithhub-browser-backup',version:1,
          createdAt:'2026-10-31T00:00:00.000Z',records:{'faithhub-intercessions-v1':original}});
        await page.evaluate(()=>localStorage.removeItem('faithhub-intercessions-v1'));
        await page.locator('#import-all').setInputFiles({name:'synthetic-ci-only.json',mimeType:'application/json',buffer:Buffer.from(archive)});
        await page.getByText(/This mode would restore 1/).waitFor();
        page.once('dialog',dialog=>dialog.accept());
        await page.locator('#restore-all').click();
        await page.getByText(/Restored 1 data type/).waitFor();
        assert.equal(await page.evaluate(()=>localStorage.getItem('faithhub-intercessions-v1')),original);
        const width=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,visible:innerWidth}));
        assert.ok(width.actual<=width.visible+1,'Backup page mobile overflow '+JSON.stringify(width));
        await page.evaluate(()=>localStorage.removeItem('faithhub-intercessions-v1'));
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
                'save/reload/delete','no mobile overflow','desktop links','deployed saints guide when SHA bound','synthetic intercession card save/reload/delete when SHA bound','Cornerstone course navigation, quiz, local reflection and deployed SHA','synthetic cross-page backup restore when SHA bound','no JS errors'],
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
