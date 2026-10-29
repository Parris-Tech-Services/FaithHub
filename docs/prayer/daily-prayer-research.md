# Everyday prayer: research and implementation

Reviewed 29 October 2026. This is a practice design, not a claim that reminders cause holiness.

## Public sources

- [Practicing the Way: Prayer](https://www.practicingtheway.org/prayer): choose a daily time and place; its four sessions are talking to God, talking with God, listening to God and being with God. FaithHub's short situational prayers are original adaptations, not quotations or an official course.
- [Fixed-Hour Prayer](https://www.practicingtheway.org/episodes/teaching-fixed-hour-prayer-prayer-e08-from-the-archive): a podcast teaching on returning attention to God at set points in the day. FaithHub offers one daily anchor first, rather than imposing a full daily office.
- [Lectio 365](https://lectio365.com/the-app/): free guided Bible prayer morning, midday and night; text and audio, offline downloads. Recommended for guided practice.
- [Inner Room](https://innerroom.app/the-app/): organise personal prayers and set reminders. [Provider privacy policy](https://www.24-7prayer.com/inner-room/privacy-policy/) describes no-cost provision. Use the current official download links rather than old store package IDs.
- [Pray As You Go](https://prayasyougo.org/): guided audio Scripture prayer, with Catholic/Jesuit roots. [Provider account of the free app](https://www.jesuit.org.uk/news/jesuit-prayer-app-pray-as-you-go-turns-20-serving-a-global-community-of-over-half-a-million).
- [Praying Like Monks, Living Like Fools](https://www.24-7prayer.com/resource/praying-like-monks-living-like-fools/): Tyler Staton's book, distinguished from free apps.

Practical synthesis: connect a short prayer to an existing daily event, leave a visible cue, optionally use one repeating alarm, and restart gently after missed days. Fixed times and existing-event anchors are options, not a guarantee of consistency. A physical object is a reminder, not something with spiritual power. Embodied postures are optional and comfortable; no controlled breathing or forced emotional response is required.

## Connected-source scope and privacy

Targeted searches covered the owner's personal and Cornerstone Drive and Gmail accounts. Read the Prayer Companion Guide, a historical Cornerstone community prayer letter, a daily-prayer devotional, an invitation to contemplative prayer, and relevant opening portions of a personal formation report and a Psalms guide. This was not an exhaustive review of all files or emails. Old prayer letters and invitations must not be presented as current events.

These support a personal shelf for existing materials, community intercession, quiet embodied prayer, and reflection after listening. The personal formation report is an interpretive secondary source: its physiological measurements and conclusions were not independently validated and are not used in the app to diagnose the user or measure spiritual progress. Private names, message bodies, document IDs and private links are not published in this public repository. A separate private import file supplies selected verified resource links for the owner.

## Architecture and recovery

GitHub Pages publishes the standalone root HTML files directly using `.github/workflows/deploy.yml`; the React source is an alternate implementation, not the deployed renderer. The new daily-prayer page is linked from both entry paths and included in the Vite multi-page input. It adds no dependencies and requests no notification permission. No external scripts run on this page; podcast playback remains on the existing separate page.

`assets/prayer-data.mjs` owns prompts, validated shelf schema, merging and calendar generation. `assets/daily-prayer.mjs` owns UI and browser persistence. The new keys are `faithhub:prayer-anchor:v1` and `faithhub:prayer-shelf:v1`; existing notes and entries are untouched. Shelf imports merge by URL, cap at 50 links/200 KB, reject non-HTTPS/credential-bearing URLs and render titles as text. Invalid stored data blocks writes instead of silently replacing it. Export and re-import recover the shelf; this is local storage, not encrypted storage or cross-device sync. Simultaneous writes in separate tabs are not transactional; storage events and re-reading before mutation reduce stale writes but cannot guarantee atomic multi-tab updates.

Calendar export uses daily recurrence, a floating local wall time and a display alarm. Importing and enabling calendar notifications remains necessary. No push scheduling or background service is claimed. Changing the time creates a different UID; remove the older calendar event to avoid two reminders.

## Validation

Run `node --test scripts/*.test.mjs` and `node --check assets/daily-prayer.mjs`. Tests cover shelf round-trip recovery, invalid schemas, unsafe URLs, non-destructive merge/deduplication, calendar recurrence/local-time format/injection rejection, and existing prayer guide regressions. Static Pages publication needs no npm build. Browser acceptance and deployment results are recorded in the change delivery report.
