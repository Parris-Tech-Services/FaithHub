# FaithHub UX research and focused redesign — Scripture → prayer → trusted voices

**Research and code date:** 29 October 2026 (Australia/Sydney). **Scope:** Direct reading of FaithHub's root HTML/pages/assets/deploy workflow, published UX research and verified creator websites. This is an **engineering review and single-slice improvement**, not a usability study with actual participants or an audited redesign of every page.

## Core user need

A person may open FaithHub without the energy or vocabulary for a formal Bible study. The first question should be **“What is true for me today?”**, not “Which feature menu do I want?” The product goal is to make the next step towards Jesus clearer, then enable deeper study without crowding the main choice. No streaks, spiritual grading or claims that an app measures grace.

## What I found in the existing site

- **Useful content is distributed:** homepage Today/Prayer/Reflection/Family/Sabbath, daily prayer, four-way prayer practice, podcast library, Genesis study, the newer prayer library and Scripture atlas. Context changes require finding separate links and remembering where you were.
- **The root toolbar is dense**, with multiple unrelated actions alongside date navigation. On mobile, full-width controls make scanning slower. The fixed podcast launcher in the Pages deployment can obscure bottom content; new Scripture page is excluded because it already has a clear native Listen navigation item.
- **FaithHub already has a capable deeper prayer library** (12 practices, Gospel reading journey, family). Do not rebuild it in the Scripture slice.
- **The spiritual tone is a strength:** gentle language, explicit privacy, optional prayer reminders and no performance pressure. Preserve it rather than replacing it with daily completion gamification.
- **Bible-media ambitions need rights boundaries:** current NIV excerpts have an attribution; this feature instead links authorised entire Psalms at Bible.com and links original creators' websites rather than embedding copyrighted music or proprietary e-Sword/Glo databases.

These are **source-based UX hypotheses**, not measured visitor behaviour. No actual screen-reader, mobile-device or cognitive-accessibility user panel has yet been run.

## External research shaping the selected design

1. [NN/g — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): show a small number of primary decisions first; put special-purpose tools one step deeper. Application: four need-based Psalm starters, then optional prayer, notes, e-Sword and links.
2. [NN/g — Mobile experience](https://www.nngroup.com/reports/mobile-website-and-application-usability/): mobile navigation, discoverability, tap areas and forms deserve explicit testing. Application: native buttons/links, a single-column view on narrow screens and clear labels.
3. [W3C — WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) and [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): visible keyboard focus, target spacing and minimal focus obstruction. Application: strong focus outlines, at least 44px planned touch controls, skip link and status announcements.
4. [e-Sword's 2026 UI changes](https://www.e-sword.net/changes.html) and [original capabilities](https://www.e-sword.net/): a focused study surface, search, context, cross-references and easily available tools. Application: stay focused on passage first, link official full study environment instead of making a shallow copy.
5. [Glo's original five lenses](https://books.google.com/books/about/Glo.html?id=gU5LPgAACAAJ): Bible, Atlas, Timeline, Topics, Media. Application: **one topical-to-passage lens** now; atlas, timelines and licensed media are separate gated roadmap work, not shipped.
6. Primary creators: [Sons of Korah](https://sonsofkorah.com/), [Colin Buchanan](https://colinbuchanan.com.au/) and [Paul Roe / The Outback Historian](https://www.theoutbackhistorian.com.au/). Their official sites substantiate Psalms-focused music, family Christian music and faith-related Australian historical storytelling, respectively. No unauthorised embedding.

## What this release actually changes: one coherent slice

**Explore the Psalms** at `psalms.html`, linked directly from the homepage and daily prayer page:

1. **Choose:** Rest, lament, gratitude or waiting—each mapped to a real Psalm (23, 13, 100, 27) with a short context-aware *original* FaithHub summary, one notice question and a short original prayer.
2. **Read:** Open the whole passage at the Bible App in a separate tab, with context intact. Never present a one-verse quote as a substitute for the surrounding Psalm.
3. **Respond:** Optional notes require an explicit Save; a separate explicit, confirmed Delete removes only that Psalm's local note. No implicit saving on selection change, no sync, no third-party analytics, no account requirement.
4. **Listen and follow:** Official Sons of Korah, Colin Buchanan and Paul Roe websites, plus the related memorial, in a clearly secondary, non-intrusive resource section.
5. **Study deeply:** Official e-Sword link and a clear path to FaithHub’s existing four-way prayer practice.
6. **Accessible by default:** responsive cards, semantic `main`, nav landmarks, descriptive buttons with `aria-pressed`, a keyboard skip link, reduced-motion preference, honest `role=status` storage feedback and text-safe DOM rendering.

**Unbuilt:** audio-player integration, Glo visual maps/timeline, parallel copyrighted translations, song/lyric ingestion, universal cross-site search, user profiles, notification service or cross-device note sync.

## Whole-app UX improvement opportunities, ranked

| Priority | Domain | Specific next action | Why it matters | Proof of completion |
|---|---|---|---|---|
| P0 | Navigation / architecture | Rationalise homepage toolbar into **Today, Pray, Scripture, Listen, More** across static and React pages; preserve quick date controls inside Today | Fewer competing choices and consistent returns | Mobile navigation playtest on all pages, no dead links |
| P0 | Accessibility | Test with Android TalkBack, keyboard-only, 200% zoom, reduced-motion, 320px width; fix errors | Current code's semantics don't establish device-level accessibility | Actual device/test recordings and zero blocking WCAG 2.2 A/AA issues |
| P0 | Privacy / recovery | Unified, versioned backup/restore for *opt-in* prayer and Scripture notes, with visible deletion, shared-device guidance | Local-only data can vanish on browser reset | Import/export round-trip + corruption + malicious HTML tests |
| P0 | Reading | Consistent typography for Scripture references, context, licence/translation, reading vs original reflection | Avoid proof-texting and blurred content authority | Theological review + accessibility check |
| P1 | Search / discovery | Unified search over local practices, Psalms and selected official external sources with labels | Reduces scattered navigation and source confusion | Correct matches, no-result and offline state, no uncontrolled requests |
| P1 | Bible study | Parallel licensed translation links, cross-references and context notes based on e-Sword | Serious study without licensing violations | Source-rights table, tested links, notes provenance |
| P1 | Visual understanding | Original map and timeline entry points for Bible books, inspired by Glo's lenses | Spatial/chronological context when useful | Fact-checked geography and timelines, keyboard alternative |
| P1 | Family | Dedicated family entry point from Colin Buchanan and existing family prayers | Simple parent-child flows | Observed family playtest and safe outbound link handling |
| P1 | Trust | Verified Christian creator directory with official sites, attribution and dead-link monitoring | Helpful, respectful links; no false affiliation | URL checks and rights audit |
| P1 | Performance | Limit font/assets and 3rd-party scripts; test on slow Android networks | Fast first action and clarity | Lighthouse metrics on deployed exact SHA and offline failure state |
| P1 | Continuity | Link from passage to appropriate prayer practice and back without losing unsaved text | Complete the intention, not just a page view | Real browser interaction and note-preservation tests |
| P2 | Personalization | Optional favourite passages/reading history stored locally | Easier return without surveillance | No default tracking, delete/export and privacy review |
| P2 | Onboarding | One contextual first-visit explanation, dismissible | Discoverability without modal overload | First-time and returning-user usability study |
| P2 | Internationalization | AU wording, right-to-left feasibility, read-aloud controls through licensed sources | Broader accessibility | Locale testing and translation rights |
| P2 | Growth measurement | Optional, privacy-respecting feedback prompts, not engagement gamification | Measure **helped me pray/read** rather than visit streaks | Explicit consent, no third-party tracking default, human feedback |

## Verification plan

The code-level regression suite must test: pathways unique, links HTTPS and real Bible references; malformed browser data fails harmlessly; no remote media scripts or copies; source controls/skip link exist; root/prayer navigation and deployment include the new page; note save/delete are explicit.

A full live acceptance adds: Chromium mobile 390x844 and desktop, keyboard focus, no horizontal overflow, choosing lament updates Psalm 13 and URL, saving/reloading restores a local note, changing Psalm doesn't save unsaved changes, cancel deletion preserves notes and confirmed deletion clears them. No claim of human usability research is warranted from browser automation alone.

**Source and permission boundaries:** Psalm references/contexts original text, not licensed passage reproduction. External Christian websites are linked, not copied. No claim of official affiliation or paid licensing. The visible site invites visitors to read and pray; it does not announce God's direct voice or promise outcomes.
