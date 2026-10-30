# Podcast Integration TODO

**Decision:** Add — strong fit.  
**Status:** Independent FaithHub podcast experience deployed from this repository.  
**Topic bank:** Bible, theology, prayer, spiritual formation, Christian living, Sabbath/rest, family faith.

## Completed
- [x] Curate 25 thoughtful Spotify episodes across Scripture, prayer, formation, Sabbath, family and theology.
- [x] Keep the main FaithHub **🎧 Podcasts** button native to this repository.
- [x] Build a self-contained podcast player in `podcasts.html` with direct Spotify embeds.
- [x] Add **🎲 Different podcast** and per-episode **▶ Play here** controls.
- [x] Persist the last selected episode locally and avoid immediate repeats for random selection.
- [x] Keep Spotify deep links available without assuming autoplay.
- [x] Keep episode metadata and tags inside FaithHub rather than loading a shared JoshHub catalogue.
- [x] Keep the experience visually simple and separate from quiet prayer/reflection screens.

## Independence rule
FaithHub does **not** require JoshHub, `podcast-launcher-v3.js`, `podcast-dock-universal.js`, or a remote podcast JSON file for its podcast experience. If another app's podcast implementation fails, FaithHub remains unaffected.

## Future
- [x] Add lightweight browser-level automated tests for player selection and persistence — verified in `scripts/podcast-unified-browser.mjs` (mobile/desktop, last selected Spotify migration, filtering, player switching) and `scripts/podcast-unified.test.mjs` (provider contracts).
- [ ] Review/refresh episode curation periodically. This requires checking the actual publishers, episode metadata and playback; catalogue presence alone is not verification. Last integration review: 31 October 2026.

### Current integration evidence (31 October 2026)

- FaithHub currently has **30 indexed resources**: 25 original Spotify episodes and five prayer additions. Four additions have provider-aware on-page players, while Pray As You Go remains an official external link.
- Both automated selection/persistence checks and a real-browser mobile/desktop run passed in the earlier podcast release. This does **not** establish that all 30 external streams play in all browsers or regions.
- No cost or paid service is required to run FaithHub's catalogue, though provider access can vary.
