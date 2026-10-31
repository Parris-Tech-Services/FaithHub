# Cornerstone Community audio source recovery — evidence audit
Date: 31 October 2026

## Evidence, not assumptions
- Original public feed: Apple/iTunes ID `293630407` contains **96 RSS enclosure records**.
- Historic feed is hosted by `feeds.feedburner.com/CornerstoneCommunityPodcast`. Original audio enclosure host `cms.cornerstone.edu.au` fails DNS resolution.
- Mixcloud publisher API lists **97 uploads**. The existing importer associates 95 with RSS titles by fuzzy string similarity and adds two extras; matching text does **not** establish audio identity or playable media.
- Two real GitHub Actions Chromium checks (2008 `The Heart of the Father – Part 1`, 2018 `Muster 2018 – Andrew Vincent – First Things First`) failed: the Mixcloud Widget API reported play and then pause, playback time remaining at 0 seconds. Browser displayed mixed-content media warnings and denied encrypted-media permissions; these warnings are not proven to be the sole root cause.
- Source-finding checks on Wayback for three historic RSS MP3 enclosures returned no media snapshot. Absence of captures for those samples does not prove all 96 are unarchived.

## Private recovery — do not publish file identifiers or audio
A read-only comparison of **44 audio files** in the user's connected Cornerstone Drive archive against the public original RSS feed resolved **29 one-to-one original file matches by both exact basename and byte length**. Other copies and materials exist; 34 candidate distinct private MP3 recordings were kept in a separate user-only JSON import manifest, not committed to this public repository. No audio, Drive IDs, user credentials, or private metadata are in this project.

Crucially, the original RSS contains **two different `Everything Counts – Bendigo Regional Muster` items**. They refer to *different actual audio files*:
- `04-AndyVincent-CornerstoneMiniMusterBendigo2012.mp3` — 45,004,800 bytes;
- `02-SteveJohnston-CornerstoneMiniMusterBendigo2012.mp3` — 37,603,328 bytes.

Both have exact filename/size matches in the private Drive archive and must not be deduplicated solely by title. Both Andy Vincent and Steve Johnston originals were independently retrieved and inspected: ID3 titles/artists match the 2012 event, and durations are 2,811.776 seconds and 2,349.174 seconds respectively. FFmpeg decoded representative 10–12-second sections of both with measured nonzero sound. Local Chromium HTML5 file-picker tests verified each recording progressed beyond five seconds, paused, sought and resumed to 25 seconds at 390px and 1280px viewports. **This verifies the two private original files, not public streams or the authenticated private Drive iframe.**

## Public inventory classification
The deployment-time `cornerstone-audio-inventory.json` now explicitly separates `SOURCE_REACHABLE`, `EMBED_ONLY`, `PLAYBACK_FAILED`, `PRIVATE_AUTH_REQUIRED`, and `MISSING`. These are public source-record classifications, **not a claim of 117 distinct recordings nor 117 playable files**. All 19 directly hosted Anchor/Spotify episodes underwent real mobile-size Chromium browser testing in GitHub Actions run [41193048655](https://github.com/Parris-Tech-Services/FaithHub/actions/runs/41193048655). **14 advanced over five seconds and were VERIFIED_PLAYABLE**. **Five failed with HTMLMediaElement media error 4** in that CI environment and are labelled PLAYBACK_FAILED, although a different Android browser might behave differently. Two Mixcloud episodes also failed actual playback, leaving 95 Mixcloud uploads unverified (EMBED_ONLY). The one original RSS entry with no separate public source has a privately recovered original MP3.

## Implementation and privacy
- The existing FaithHub podcast page supports verified publisher audio, official Mixcloud embeds, Google Drive preview requiring the listener's permissions, and locally selected MP3/M4A files via browser blob URLs. No private files are uploaded or copied to the public site.
- The private archive manifests and original MP3s stay in the user's private conversation file store or Drive; the private JSON is imported by the listener on their own device.
- GitHub Actions must verify true HTML5 media time advancement, not just existence of the iframe, a Play event, or HTTP 200.

## Next recovery targets
1. Locate and verify original public replacement audio for the remaining RSS enclosures not in the local private archive. Do not scrape Mixcloud raw audio or bypass its API/media licensing.
2. Test official Mixcloud playback on a normal user-authenticated Android Chrome session before diagnosing CDN restrictions conclusively.
3. Where a private original has been recovered, use the listener's authorised Drive account or on-device MP3 picker to play within FaithHub. Public hosting of private files requires explicit rights clearance and user authorisation.
4. Maintain an episode-level record of listening tests, original source and any matched private file evidence without ever exposing private file IDs.
