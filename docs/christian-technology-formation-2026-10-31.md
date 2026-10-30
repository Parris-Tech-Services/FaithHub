# Christians, technology, and growing closer to Jesus — research and FaithHub decisions
Reviewed: 31 October 2026. Public provider material was checked against current features of FaithHub, not treated as evidence that an app automatically makes someone more holy.

## A critical distinction: means, not ends
Digital resources can make Scripture, Christian teaching and prayer easier to access. They do not replace God, the Church, a trusted friend, worship, service or healthy embodied presence. A 2023 Pew survey of highly religious American adults reported that in-person prayer or Bible study groups were much more common than online equivalents (61% vs 19%), so keep offline discipleship central rather than maximising time in an app: https://www.pewresearch.org/religion/2023/06/02/use-of-apps-and-websites-in-religious-life/

## What Christian apps are doing, what FaithHub already has, and what is worth adding

| Resource / Christian practice | Official source and feature | Already in FaithHub (verified from actual repo) | Recommendation |
|---|---|---|---|
| Lectio 365 / praying morning, midday and evening | https://lectio365.com/the-app/ — Scripture, spoken guided prayer, PRAY, Lord’s Prayer, Examen, optional audio and offline downloads | Daily prayer moments, one recurring calendar reminder, guided prayer library, evening examen | **Enhance**, but avoid duplicating the provider’s copyrighted daily scripts. Add an explicit no-pressure one-minute mode; offer links to originals. |
| Inner Room / keeping people in prayer | https://www.24-7prayer.com/a-new-inner-room-app/ and https://innerroom.app/ — local private requests, grouping, guided journeys | Intercession *practice* and free-text notes, but no per-person private cards in the reviewed source | **Implement** optional browser-only prayer cards, categories, gentle rotation, return-to-request and non-judgemental archive. |
| Echo Prayer / helping people remember | https://www.echoprayer.com/ — requests, tags, reminders, prayer sessions, optional group sharing | Single daily reminder for personal prayer; not a per-person reminder engine | Implement a deliberate *Pray now* selection; defer proactive notifications and social sharing until permission and privacy design exist. |
| YouVersion / Scripture with friends | https://www.youversion.com/bible-app — reading plans, audio, highlights, notes, prayer, trusted groups | Scripture Atlas with 126 curated passages, twelve reading journeys, bookmark and private reflection, plus family activities | Keep provider links. Genuine group features must be opt-in and secured; **not implemented**. |
| BibleProject / contextual learning | https://bibleproject.com/app/ — courses, contextual videos, podcasts, references | Atlas, Psalms, curated journey and a podcast library | Add contextual BibleProject book-level companion links only where appropriate; do not scrape or republish licensed material. |
| Hallow / guided contemplation | https://play.google.com/store/apps/details?id=app.hallow.android — 5/10/15 min guided prayer, journal, communal challenges | Prayer-practice library, saints teachings, notes, podcasts | Offer a short, non-timed option; avoid pressure from challenges or engagement streaks. Some practices are denominational and should be labelled. |
| Dwell / Scripture listening | https://apps.apple.com/au/app/dwell-audio-bible/id1343917374 — replay and Selah pause for reflection, offline listening | Some Scripture text-linked reading and original guide read-aloud; no licensed audio Bible hosted | Consider permitted text-to-speech and simple repeat for original or public-domain text later; do not redistribute Dwell audio. |
| Practicing the Way / Jesus-shaped habits | https://www.practicingtheway.org/ and https://www.practicingtheway.org/resources — prayer, solitude, Scripture, Sabbath, generosity, service, community | Existing daily rhythms, fruit prompts, rest and family community tabs | **Integrate prayer with a user-chosen act of care**, not just a completed checkbox. Don't use performance scores or suppose a clicked action equals love. |

## Implemented in this change
1. **Private intercession cards**, with a person/situation using aliases or initials, prayer text and one optional action of care, grouped by family/friends/church/neighbours/world/other.
2. **Simple prayer rotation** through active cards, based on local date and a visible Next button; algorithmic selection is not divine guidance.
3. **One-minute, timer-free prayer** with no typing or save requirement. You can close the app immediately.
4. **Archive as ‘entrusted’**, not ‘answered’ — it leaves space for unanswered requests and avoids spiritual scorekeeping; resume any request.
5. **Explicit save, edit, delete, delete-all, JSON backup and confirmed import** in local browser storage. No login, analytics, notifications, email or external transmission. Local storage is unencrypted and other users of the same browser profile may see it; no false privacy promises.
6. **A homepage and daily-prayer navigation link** to make it discoverable.

## Future experiments (not claimed implemented)
1. A quiet read-aloud of *original or licence-cleared* guided prayers with adjustable speed and no auto-play. Check accessibility and browser support.
2. Scripture repetition and recall, without streaks or scores, using a licensed/public-domain text corpus, with Bible translation attribution.
3. Optional family prayer cards and prayer for someone together, without displaying children's personal information publicly.
4. Offline mode and deliberately reduced-screen-time prompts; explicitly test network loss and backup semantics.
5. Small-group shared requests only after explicit permission, identity controls, secure storage and a safeguarding review. Default *off*.
6. Daily morning/noon/night links to official Lectio 365, instead of copying their daily content.
7. A configurable seasonal Rule of Life review that honours responsibilities and isn't graded.
8. In-person church and friendship prompts; no automatic sending or contact.

## Safeguards
- These features are an independent FaithHub implementation, not official versions of any other app. Cite sources; reproduce no protected lessons or audio.
- Never equate app use, streaks, saved cards or response time with holiness or God’s approval.
- Private notes about others should use aliases on shared devices. Do not collect a phone number, address, email or location for a prayer card.
- No messages, emails, invites, notifications or publishing are sent from this feature.
- No inference that a prayer was answered; the user alone can mark a card ‘entrusted’ or continue praying.
- Physical and emotional safety, appropriate help, consent and boundaries remain important; prayer is not a substitute.
- Tests: Node unit assertions and a real browser test against desktop/mobile preview; exact deployed-Git-SHA live browser check on GitHub Pages.

## Scripture anchors (links; no reproduced copyrighted translation)
- [1 Timothy 2:1–6](https://www.bible.com/bible/111/1TI.2.1-6.NIV), asking for others.
- [James 2:14–17](https://www.bible.com/bible/111/JAS.2.14-17.NIV), faith and practical care.
- [Philippians 1:3–11](https://www.bible.com/bible/111/PHP.1.3-11.NIV), prayer for the church.
- [Galatians 5:22–23](https://www.bible.com/bible/111/GAL.5.22-23.NIV), fruit of the Spirit.
