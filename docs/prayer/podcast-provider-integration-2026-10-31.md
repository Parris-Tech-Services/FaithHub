# FaithHub podcast integration — 31 October 2026

## Outcome

The original 25 Spotify catalogue entries are unchanged. A single searchable catalogue now adds five new prayer resources, identified by stable IDs; no existing local reflection data or prayer notes are modified.

| Resource | Provider | Player in FaithHub | Fallback |
|---|---|---|---|
| St Teresa of Ávila’s Wisdom on Prayer (20 min, 13 Oct 2026) | Apple Podcasts | Official compact episode embed (175px) | Original Apple episode |
| Praying with Saint Augustine (25 min, 28 Aug 2026) | Apple Podcasts | Official compact episode embed (175px) | Original Apple episode |
| St Teresa, The Way of Perfection, chapter 26 (12:45) | Discerning Hearts | HTML audio served from original publisher's Blubrry MP3 | Original page with its own audio player |
| Praying with the Saints (evening prayer series) | Apple Podcasts | Official show embed (450px); browse episodes in it | Apple show page |
| Pray As You Go | Jesuits in Britain | **External only**: daily recordings vary and there is no vetted, stable per-episode embed URL | Official site |

The Spotify collection continues using the existing Spotify episode iframe, which is hosted by Spotify. All five additions appear in the same searchable catalogue, and the four compatible options have an on-page player. The external-only entry has an explicit outbound listening link, not a false Play button.

## Technical approach

- Apple Podcasts official guide: https://podcasters.apple.com/support/5619-apple-podcasts-embed-player
- Provider-embed URL patterns (Apple): https://embed.podcasts.apple.com/au/podcast/episode/id1272460524?i=1000796088412 ; https://embed.podcasts.apple.com/au/podcast/episode/id1597828386?i=1000786452531 ; https://embed.podcasts.apple.com/us/podcast/episode/id1503225013
- Spotify's official embed guide: https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed
- Discerning Hearts audio source and embed option, on its own page: https://www.discerninghearts.com/catholic-podcasts/dh-daily-lenten-school-prayer-st-teresa-avila-chap-26-way-perfection/
- Episode sources: https://podcasts.apple.com/au/podcast/st-teresa-of-%C3%A1vilas-wisdom-on-prayer/id1272460524?i=1000796088412 and https://podcasts.apple.com/au/podcast/praying-with-saint-augustine/id1597828386?i=1000786452531
- Pray As You Go: https://prayasyougo.org/ ; Praying with the Saints: https://podcasts.apple.com/us/podcast/praying-with-the-saints/id1503225013

No host credentials, API token, podcast media files or tracking backend are involved. The browser does not create a remote iframe or audio element until the listener chooses a playable item. Selecting another episode removes the old player. Publisher-hosted embeds and audio have their own privacy policies, and may require permission to play in a browser. A publisher link is always available.

## Behaviour and privacy

- Search matches title, show, tags, description and provider. The filter supports all, prayer, Spotify, Apple, publisher audio and external-only.
- A URL query `?episode=<stable ID>` selects a matching entry (without preloading it). It links the historic prayer resource cards directly to the main library.
- Legacy numeric Spotify selection key `faithhub-local-podcast-v1` is read when no v2 stable-ID selection exists; v2 saves a single selected ID locally. No personal prayer data moves.
- No autoplay, no automatically loaded publisher content, no local recordings and no third-party analytics added by FaithHub.
- Mobile-responsive cards and real browser tests cover initial placeholder state, searching, filters, Apple/Spotify/native-audio selection, switching, legacy state and deep links.
- Static tests: `node --test scripts/*.test.mjs`.
- Browser test: `node scripts/podcast-unified-browser.mjs` while serving the repo root at http://127.0.0.1:8765.
- GitHub Pages deployed mobile test: `scripts/pages-live-browser.mjs`, gated by exact post-deployment Git SHA.

## Limits

An iframe's presence alone does not prove full end-user audio playback or eligibility in every region/browser. A working player's controls and publisher's playback policy determine the listening experience. In-browser testing verifies the player URL, navigation, switching and layout; the publisher links are the supported fallback.

This change is incremental and does not claim that the entire public Spotify collection has been individually audited for rights or active playback.
