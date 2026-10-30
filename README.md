# Rule of Life Companion

Engineering principles: v5.1
Assurance tier: 3 (private prayer material may be entered locally)
Canonical repository: https://github.com/Parris-Tech-Services/FaithHub

A gentle, non-performance-based spiritual formation app for daily Scripture, prayer rhythms, fruits of the Spirit reflection, repentance/gratitude, family prayer prompts, community rhythms, and Sabbath/rest tracking.

## Run locally

```bash
npm install
npm run dev
```

## Build locally

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a new GitHub repository, for example `rule-of-life-companion`.
2. Unzip this project and open a terminal in the project folder.
3. Run:

```bash
git init
git add .
git commit -m "Initial Rule of Life Companion app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rule-of-life-companion.git
git push -u origin main
```

4. In GitHub, go to **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Open the **Actions** tab and wait for `Deploy to GitHub Pages` to finish.

Your site should appear at:

```text
https://YOUR_USERNAME.github.io/rule-of-life-companion/
```

## Prayer: four ways of talking with God

- **[Open the interactive prayer practice](prayer-practice.html):** gratitude, lament, petition and intercession, with Scripture, original prayers and optional private notes. Prayer notes are only stored in this browser after the visitor deliberately saves them.
- **[Read the source-linked theological research](docs/prayer/john-mark-comer-talking-with-god-2026-10-29.md)** (29 October 2026): primary sources, theological distinctions, practice and cautions. The original Practicing the Way material groups petition and intercession together under *talking with God*; these are not its four top-level prayer sessions.
- Source: [Practicing the Way Prayer Practice](https://www.practicingtheway.org/prayer).

## Scripture Atlas and research roadmap (29 October 2026)

- **[Open Scripture Atlas](scripture-atlas.html)**: 126 context-aware passages including 31 Psalms, Bible.com NIV and Bible Gateway WEB links, searchable themes, twelve seven-day reading journeys, memorisation cues, original guide read-aloud, bookmarking, private opt-in reflection and export. This is a *curated guide*, not the complete Bible.
- **[Numbered, Scripture-grounded roadmap](docs/faithhub-bible-prayer-feature-roadmap-2026-10-29.md)**: 182 prioritised, biblically grounded features with official app comparisons, acceptance criteria, existing/implemented/planned statuses and rights/privacy safeguards.
- [World English Bible permissions](https://ebible.org/engwebp/copyright.htm). Scripture is linked to providers; extended copyrighted translations are not reproduced.

## Featured Scripture

- [Luke 11:5–13 (NIV) — Ask, seek, knock](https://bible.com/bible/111/luk.11.5-13.NIV). This reading is included in the daily Scripture rotation and linked permanently from FaithHub's main page.
- [Gentle reflection and prayer](readings/luke-11-5-13.md).

## Notes

- Entries are saved in local browser storage only.
- There are no streaks or scores.
- The progress bar is intentionally framed as “space made to notice God”, not spiritual performance.

## Growing closer to Jesus with technology (31 October 2026)

- **[Pray for people · Private intercession cards](intercessions.html):** save a request locally with initials, categories and optional follow-through actions; return to another prayer, edit, mark entrusted, resume, export/import or delete all. Includes an immediate, timer-free, one-minute prayer. All saves are explicit, local browser storage is unencrypted, and no contact messages are sent.
- **[Research comparison and privacy decisions](docs/christian-technology-formation-2026-10-31.md):** Lectio 365, Inner Room, Echo, YouVersion, BibleProject, Hallow, Dwell and Practicing the Way; identifies already existing FaithHub capabilities, a narrow implemented gap, and future experiments with no overstated status.
- The homepage, everyday prayer and practice library all link to the new intercession guide. The existing Scripture and podcast features remain independent. Tests: `node --test scripts/*.test.mjs` and `node scripts/intercession-browser.mjs` while serving the root site.

## Unified prayer podcast library (31 October 2026)

- **[Search and listen in FaithHub](podcasts.html):** the original 25 Spotify episodes plus five verified prayer resources, with search across all sources and topic/provider filters.
- Compatible recordings use Spotify or Apple official embeds, or the publisher's own audio; *Pray As You Go* remains an external daily-listening link. All entries provide an original-publisher fallback.
- [Provider compatibility, privacy and test evidence](docs/prayer/podcast-provider-integration-2026-10-31.md). Podcast players load only when selected, not on page load. No third-party audio is copied to the repo.
- Saints prayer cards [link directly to their recordings](saints-prayer.html) in the main library.

## Prayer with the saints (31 October 2026)

- **[Pray with Jesus · Wisdom of the saints](saints-prayer.html):** a five-minute, non-performance-based prayer practice, six source-grounded historic teachers, the Jesus Prayer, and verified podcast episodes.
- **[Primary-source research and podcast verification](docs/prayer/saints-prayer-research-2026-10-31.md):** Scripture and historic texts across Christian traditions, plus editorial cautions and episode links.
- The main page, existing everyday prayer guide, prayer library and podcast page all link to this new practice. Static-only; no notes, tracking, audio rehosting or new dependencies. Test using `node --test scripts/*.test.mjs`.

## Everyday prayer

[Jesus, here with me](daily-prayer.html) offers seven everyday prayer moments, one saved daily anchor, a calendar reminder download, all nine fruits of the Spirit with practical responses, free prayer apps and a private resource shelf. Import a version-1 shelf JSON or add your own HTTPS links. Use **Back up my shelf** before clearing browser data; re-import merges without deleting existing links. Files and emails themselves remain with their original providers.

The live GitHub Pages workflow publishes the root HTML and assets directly; no npm build is needed for that deployment. Test with `node --test scripts/*.test.mjs`; preview that exact path with `python3 -m http.server 8765`. The Vite/React path is secondary.

[Research, privacy, recovery and known limitations](docs/prayer/daily-prayer-research.md). No website background notification service is implemented: import the calendar file and check calendar notifications, or use a phone alarm.

## Faithful feature roadmap and prayer library

- [Numbered 100-feature roadmap](docs/FAITHHUB_FEATURE_ROADMAP.md): official app research, biblical grounding, acceptance conditions, priorities and honest implementation status.
- [Prayer and Bible library](prayer-library.html): 12 guided practices, a seven-reading Gospel journey and four family prayer moments. Search by theme or Scripture; expand one practice and begin.
- Tests: `node --test scripts/*.test.mjs`. The new library does not change or migrate existing saved data.

## Explore the Psalms — focused UX improvement (29 October 2026)

[Open the Psalm pathway](psalms.html) to choose rest, lament, gratitude or waiting; open an authorised full Psalm, follow an original prayer prompt, and optionally save a small private, browser-only reflection. The page links to Sons of Korah, Colin Buchanan, Paul Roe, e-Sword, and the existing Scripture Atlas/Prayer Practice without copying third-party recordings or Bible modules.

Research and prioritised follow-ups: [FaithHub UX research](docs/UX_RESEARCH_SCRIPTURE_EXPLORER_2026-10-29.md). Tests: `node --test scripts/*.test.mjs`; static deployment automatically includes the new page and excludes the overlapping floating podcast button on it. No user research or cross-device sync is claimed.
