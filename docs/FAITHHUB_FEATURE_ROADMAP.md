# FaithHub: a prayerful, biblically grounded feature roadmap

Research date: 29 October 2026. Canonical repository: https://github.com/Parris-Tech-Services/FaithHub.

## Purpose

Help a person come to Jesus, commune with the Father through the Son in the Holy Spirit, receive Scripture faithfully, and grow in love of God and neighbour. Prayer is relationship and participation in God's work, not an app achievement. Salvation and God's love are gifts of grace, not rewards for usage (Ephesians 2:8–10); fruit grows through abiding in Christ (John 15:1–17; Galatians 5:16–26).

This is a broad, numbered backlog of 100 concrete ideas, not a claim of exhaustive theological coverage or a promise to build everything. The roadmap intentionally distinguishes product ideas from biblical commands. References give the theological rationale and must be read in context; they do not prove that a particular software feature is required by God.

## Faithfulness and product boundaries

- Centre Jesus' life, teaching, death and resurrection. Preserve the distinction between Scripture, interpretation, historic practice and original prayer.
- Default to the user's Protestant Christian context while identifying Catholic, Orthodox, Anglican or other traditions respectfully. Do not silently import disputed practices as universal obligations.
- Do not fabricate revelation, speak as Jesus, predict answers, diagnose spiritual failure or rank holiness. Prayer duration, mood, app usage and wearable data cannot measure God's approval.
- Welcome lament, doubt, repentance and unanswered prayer. Do not promise prosperity, cure, emotional calm or specific outcomes.
- Encourage local church, wise counsel and practical love. Safeguarding, healthcare, accountability and appropriate boundaries remain important.
- No streak penalties, spiritual leaderboards, manipulative scarcity or engagement-maximising feeds. The main success question is whether the user actually finds it easier to pray and love, not whether time in the app increases.
- Personal material stays private. No automatic email, social sharing, public prayer requests or imported contact lists. Sharing requires an explicit user action.
- Link to copyrighted resources unless permission permits reproduction. Record Bible translation licences before embedding substantial text or audio.

## Research: what other apps offer and what to adapt

These are official provider descriptions reviewed on the research date, not hands-on testing of every app. Features, pricing and platform support can change. No vendor efficacy claim is adopted as proven.

| Source | Observed useful ideas | FaithHub adaptation and boundary |
|---|---|---|
| S1: [Practicing the Way](https://www.practicingtheway.org/prayer) | Four movements; daily time/place; practice and reflection | Keep prayer simple; original guides and contextual Scripture; no official affiliation claimed. |
| S2: [PrayerMate](https://www.prayermate.net/app?locale=en), [v10 announcement](https://blog.prayermate.net/en/prayermate-v10/) | Prayer organisation, reminders, groups, encouragement histories | Private requests and gentle review; do not equate a recorded encouragement with objectively verified causation. |
| S3: [Inner Room](https://innerroom.app/the-app/) | Personal prayer organisation and reminders | Simple cards and intentional returns, with explicit privacy controls. |
| S4: [YouVersion](https://www.youversion.com/bible-app), [prayer help](https://help.youversion.com/l/en/article/fj48sysun2-prayer-ios) | Free reading, listening, plans and prayer | Scripture-to-prayer pathways; link to authorised Bible text and audio. |
| S5: [BibleProject](https://bibleproject.com/app/) | Biblical structure, themes, reflection, videos and classes | Context before application; resource pathways, not isolated proof texts. |
| S6: [Lectio 365](https://lectio365.com/the-app/), [Pray As You Go](https://prayasyougo.org/) | Daily guided prayer and audio reflection | Optional morning/midday/night pathways; identify traditions. |
| S7: [Dwell](https://dwellapp.io/), [repeat/reflect explanation](https://dwellapp.io/articles/II5UDeMB0abIdrmZMuW2o) | Audio Scripture; repeating passages with quiet gaps | Licensed listening plus silence; old documentation is inspiration, not proof of current platform parity. |
| S8: [Hallow overview](https://help.hallow.com/en/articles/9650908-overview-of-the-mobile-app), [free access](https://help.hallow.com/en/articles/3279868-how-do-i-access-the-free-version-of-the-app) | Morning/night routines, collections, favourites, downloads, family and community | Borrow navigation and optional routines; Catholic content is clearly labelled. Free tier is not the whole paid catalogue. |

## Status and sequencing

**Implemented** means code added in this change; see release evidence for checks and deployment. **Existing** means already present in the inspected source, not a new delivery. **Planned** means not delivered. **Gated** means a proposal that needs the named architecture, permissions, licences or review first. Existing prayer notes and Sabbath/community reflections are not re-counted as new features; the proposals below specify extensions.

1. Ship and verify the prayer library and Gospel/family paths (items 1–12, 21–22, 51–54).
2. Next implement request cards and journal recovery together (31–38, 78, 81), then memory practice and context tools (23–30, 91).
3. Improve accessibility and offline behaviour (83–88), with real Android testing before claiming phone support.
4. Only then consider cloud, sharing, push or licensed audio gates (60, 64, 74–75, 82, 85, 89, 99). No calendar dates or unsupported effort estimates are promised.

Each acceptance statement below is a condition of delivery, not a claim that planned features already exist. Dependencies: all persisted-data features require item 81 and safe schema migration; all audio requires rights/transcripts; all shared/private-server features require authenticated access tests and consent. Human theological review is still pending, especially before sensitive guidance or AI-generated content grows.

## Numbered backlog

### Prayer foundations

Priority / inspiration: Now / S1, S2, S3.

1. **Lord’s Prayer pathway** — Implemented. Biblical grounding: Matthew 6:5–15. Acceptance: Guide praise, kingdom, needs, confession and protection in context.
2. **Adoration** — Implemented. Biblical grounding: Psalm 145. Acceptance: Offer praise focused on God’s character rather than outcomes.
3. **Confession and grace** — Implemented. Biblical grounding: 1 John 1:5–2:2. Acceptance: Connect honest confession, Christ’s advocacy and practical repair.
4. **Honest lament** — Implemented. Biblical grounding: Psalm 13; Psalm 88. Acceptance: Allow complaint and unresolved grief without a forced happy ending.
5. **Specific thanksgiving** — Implemented. Biblical grounding: Psalm 103:1–5. Acceptance: Invite one concrete gift without denying pain.
6. **Intercession** — Implemented. Biblical grounding: 1 Timothy 2:1–6. Acceptance: Guide prayer for people, communities and those in authority.
7. **Prayer for enemies** — Implemented. Biblical grounding: Matthew 5:43–48. Acceptance: Ask for good and an end to harm while affirming safe boundaries.
8. **Evening review** — Implemented. Biblical grounding: Psalm 139:23–24. Acceptance: Label the Examen as a later method and invite grace, honesty and surrender.
9. **Scripture meditation** — Implemented. Biblical grounding: Psalm 1:1–3. Acceptance: Guide reading, reflection, response and rest without claiming a mandated method.
10. **Gethsemane surrender** — Implemented. Biblical grounding: Luke 22:39–46. Acceptance: Allow honest desires and trust without equating surrender with passivity.

### A rhythm that fits ordinary life

Priority / inspiration: Now / S1, S2, S3.

11. **Stillness with Jesus** — Implemented. Biblical grounding: Mark 1:35–39. Acceptance: Provide an optional quiet practice with comfortable posture.
12. **Prayerful discernment** — Implemented. Biblical grounding: James 1:5–8. Acceptance: Include Scripture, counsel and responsibility; reject random-verse divination.
13. **One daily anchor** — Existing. Biblical grounding: Deuteronomy 6:6–9. Acceptance: Persist one existing-event cue without turning the passage into an app prescription.
14. **Calendar reminder export** — Existing. Biblical grounding: Psalm 55:17. Acceptance: Offer daily recurrence while clearly requiring import and notification setup.
15. **Comfortable embodied prayer** — Existing. Biblical grounding: Romans 12:1. Acceptance: Offer sitting, standing and open hands without physical requirements.
16. **Pray the room** — Existing. Biblical grounding: 1 Timothy 2:1. Acceptance: Invite intercession for people nearby without declaring thoughts divine messages.
17. **Coming-home prayer** — Existing. Biblical grounding: Colossians 3:12–14. Acceptance: Connect the transition home with patience, truth and gentleness.
18. **One-minute low-energy mode** — Planned. Biblical grounding: Romans 8:26–27. Acceptance: Offer a single accessible prayer and an immediate exit; no minimum duration.
19. **Editable quiet hours** — Planned. Biblical grounding: Mark 2:27. Acceptance: Respect chosen rest windows and daylight-saving changes before push reminders ship.
20. **Restart without debt** — Planned. Biblical grounding: Lamentations 3:22–24. Acceptance: Let users resume a plan without overdue warnings, streak loss or guilt copy.

### Meet Jesus and understand Scripture

Priority / inspiration: Next / S4, S5.

21. **Seven-reading Gospel journey** — Implemented. Biblical grounding: John 20:30–31. Acceptance: Provide seven contextual passages, questions and original prayer responses.
22. **Searchable prayer practices** — Implemented. Biblical grounding: Colossians 3:16. Acceptance: Search titles, references and guidance with an honest empty state.
23. **Context-first passage viewer** — Planned. Biblical grounding: 2 Timothy 3:14–17. Acceptance: Display book, genre and surrounding passage before an application prompt.
24. **Whole-book reading plans** — Planned. Biblical grounding: Luke 24:27. Acceptance: Offer Mark, Luke, John and Philippians without fragmenting their arguments.
25. **Bible story overview** — Planned. Biblical grounding: Luke 24:44–49. Acceptance: Explain creation, fall, covenant, Christ and new creation with contextual references.
26. **Psalms by form** — Planned. Biblical grounding: Psalm 1; Psalm 13; Psalm 145. Acceptance: Distinguish praise, lament, wisdom and thanksgiving with book context.
27. **Prayers of Scripture collection** — Planned. Biblical grounding: Ephesians 1:15–23; 3:14–21. Acceptance: Include biblical speakers, recipients and circumstances, not isolated formulas.
28. **Sermon on the Mount journey** — Planned. Biblical grounding: Matthew 5–7. Acceptance: Pair contextual teaching with prayer and responsible application.
29. **Translation choice** — Planned. Biblical grounding: Nehemiah 8:8. Acceptance: Record translation and licensing; never blend versions into an unattributed quote.
30. **BibleProject context companions** — Planned. Biblical grounding: Acts 17:11. Acceptance: Link relevant book overviews and distinguish commentary from Scripture.

### Remember people and pray faithfully

Priority / inspiration: Next / S2, S3.

31. **Private prayer cards** — Planned. Biblical grounding: Philippians 1:3–5. Acceptance: Create, edit and archive requests locally with explicit saving and recovery.
32. **Prayer categories** — Planned. Biblical grounding: Ephesians 6:18. Acceptance: Organise family, friends, church, neighbours and world without quotas.
33. **Gentle request rotation** — Planned. Biblical grounding: Colossians 4:2. Acceptance: Rotate selected cards transparently; no claim God chose the next card.
34. **Time-sensitive requests** — Planned. Biblical grounding: Romans 12:15. Acceptance: Support an event date and expiry review rather than stale urgent labels.
35. **Encouragement history** — Planned. Biblical grounding: Psalm 77:11–12. Acceptance: Record user-reported encouragement without asserting verified divine causation.
36. **Unanswered prayer space** — Planned. Biblical grounding: Psalm 88. Acceptance: Keep unresolved requests without marking people spiritually unsuccessful.
37. **Request update timeline** — Planned. Biblical grounding: Philippians 4:6–7. Acceptance: Preserve dated edits and allow correction without losing previous meaning.
38. **Anonymous display names** — Planned. Biblical grounding: Matthew 6:6. Acceptance: Permit initials and hide details on shared screens by default.
39. **Prayer follow-through** — Planned. Biblical grounding: James 2:14–17. Acceptance: Suggest a voluntary practical action without automatic contact or messages.
40. **Mission and world prayer** — Planned. Biblical grounding: 1 Timothy 2:1–4. Acceptance: Use dated, attributed public information and avoid publishing private missionary details.

### Formation and fruit of the Spirit

Priority / inspiration: Next / S1, S5.

41. **Nine fruits with daily actions** — Existing. Biblical grounding: Galatians 5:16–26. Acceptance: Pair each fruit with a prayer and small response; no holiness rating.
42. **Love in action review** — Planned. Biblical grounding: 1 Corinthians 13:1–7. Acceptance: Ask about patient, truthful care without a score or comparison.
43. **Gentle speech practice** — Planned. Biblical grounding: James 1:19–20; Ephesians 4:29. Acceptance: Help users pause, listen and speak truth without harshness.
44. **Repair after conflict** — Planned. Biblical grounding: Matthew 5:23–24; Romans 12:18. Acceptance: Distinguish apology, restitution, reconciliation and safe boundaries.
45. **Forgiveness exploration** — Planned. Biblical grounding: Ephesians 4:32. Acceptance: Explain forgiveness without requiring unsafe access or instant restored trust.
46. **Generosity prompts** — Planned. Biblical grounding: 2 Corinthians 9:7. Acceptance: Invite voluntary giving with no payment flow or manipulative fundraising.
47. **Hospitality experiment** — Planned. Biblical grounding: Romans 12:13. Acceptance: Offer a modest welcome appropriate to capacity and household agreement.
48. **Service without recognition** — Planned. Biblical grounding: Matthew 6:1–4. Acceptance: Invite discreet service without a public feed or reward system.
49. **Sabbath planning** — Planned. Biblical grounding: Mark 2:27–28. Acceptance: Support rest, worship and delight while acknowledging Christian differences.
50. **Rule-of-life seasonal review** — Planned. Biblical grounding: John 15:1–17. Acceptance: Revisit sustainable rhythms and responsibilities with grace and counsel.

### Family, marriage and community

Priority / inspiration: Next / S2, S6.

51. **Family mealtime prayer** — Implemented. Biblical grounding: Psalm 104:14–15. Acceptance: Invite a brief thank-you with an option for children to listen.
52. **Family bedtime prayer** — Implemented. Biblical grounding: Psalm 4:8. Acceptance: Welcome good and hard moments without requiring participation.
53. **Family repair prayer** — Implemented. Biblical grounding: Ephesians 4:32. Acceptance: Model adult apology; never force children to confess or hug.
54. **Leaving-home blessing** — Implemented. Biblical grounding: Colossians 3:12–14. Acceptance: Invite kindness in simple language and a shared small action.
55. **Child-friendly Gospel retellings** — Planned. Biblical grounding: Mark 10:13–16. Acceptance: Label retellings, retain biblical meaning and require adult review.
56. **Draw a prayer** — Planned. Biblical grounding: Psalm 150. Acceptance: Allow nonverbal expression; do not infer a child’s spiritual or psychological state.
57. **Couple prayer invitations** — Planned. Biblical grounding: Ephesians 4:2–3. Acceptance: Make participation mutual and voluntary with separate private reflections.
58. **Small-group discussion guides** — Planned. Biblical grounding: Hebrews 10:24–25. Acceptance: Provide contextual discussion and opt-in prayer without public disclosure.
59. **Local church rhythm links** — Planned. Biblical grounding: Acts 2:42. Acceptance: Use current, verified public details rather than old invitations as live schedules.
60. **Private prayer groups** — Gated. Biblical grounding: Galatians 6:2. Acceptance: Require authenticated membership, consent, moderation and tested access control.

### Audio, beauty and attention

Priority / inspiration: Later / S4, S5, S6, S7.

61. **Listen-then-pray podcast prompts** — Existing. Biblical grounding: James 1:22. Acceptance: Pair existing resources with an invitation to respond, not endless autoplay.
62. **Original guided prayer audio** — Planned. Biblical grounding: Romans 8:26. Acceptance: Review scripts, license voices and provide transcripts; never impersonate Jesus.
63. **Audio Scripture provider links** — Planned. Biblical grounding: Romans 10:17. Acceptance: Open authorised providers with clear free/paid availability; no copied audio.
64. **Licensed audio Bible integration** — Gated. Biblical grounding: Colossians 3:16. Acceptance: Ship only after usage rights, attribution and provider terms are resolved.
65. **Repeat and reflect controls** — Planned. Biblical grounding: Psalm 119:15. Acceptance: Let users loop authorised audio and choose silent gaps without forced playback.
66. **Sleep timer** — Planned. Biblical grounding: Psalm 4:8. Acceptance: Stop playback at the chosen time and test locked-screen behaviour honestly.
67. **Optional background sound** — Planned. Biblical grounding: Psalm 46:10. Acceptance: Keep sound off by default; preserve voice clarity and an immediate mute.
68. **Beautiful prayer-card deck** — Planned. Biblical grounding: Psalm 19:1. Acceptance: Use original licensed art, accessible text and deliberate selection; no fortune-telling framing.
69. **Printable prayer cards** — Planned. Biblical grounding: Deuteronomy 6:6–9. Acceptance: Provide readable print output with source attribution and no personal-data default.
70. **Screen-light prayer mode** — Planned. Biblical grounding: Matthew 6:6. Acceptance: Offer a minimal display and easy exit so prayer need not become more screen time.

### Use existing resources well

Priority / inspiration: Next / S1, S4, S5.

71. **Private resource shelf** — Existing. Biblical grounding: Colossians 3:16. Acceptance: Save verified HTTPS links locally with bounded imports and backup.
72. **Resource provenance labels** — Planned. Biblical grounding: Acts 17:11. Acceptance: Show author, source, tradition, date and whether content is original or quoted.
73. **Search my approved resources** — Planned. Biblical grounding: Proverbs 18:13. Acceptance: Search only selected resources and expose coverage gaps honestly.
74. **Private Drive connection** — Gated. Biblical grounding: Proverbs 11:13. Acceptance: Require least-privilege authorisation and prevent private material entering public builds.
75. **Private Gmail prayer triage** — Gated. Biblical grounding: Proverbs 11:13. Acceptance: Let the owner review extracted requests; never send emails or auto-share.
76. **Historical request review** — Planned. Biblical grounding: Ecclesiastes 3:1–8. Acceptance: Display original dates and request confirmation before treating old news as current.
77. **Resource-to-practice mapping** — Planned. Biblical grounding: James 1:22. Acceptance: Attach a specific prayer or loving action to each curated teaching.
78. **Practice reflection journal** — Planned. Biblical grounding: Psalm 139:23–24. Acceptance: Offer what helped, what was hard and next steps, with deliberate saving.
79. **Cornerstone collection** — Planned. Biblical grounding: Acts 2:42–47. Acceptance: Privately curate permissioned material and distinguish community memory from doctrine.
80. **Weekly resource simplicity** — Planned. Biblical grounding: Luke 10:38–42. Acceptance: Allow one selected resource for the week without a crowded recommendation feed.

### Accessibility, privacy and dependable delivery

Priority / inspiration: Foundation / engineering requirements, not Bible commands.

81. **All-data export and restore** — Planned. Biblical grounding: Proverbs 27:23. Acceptance: Round-trip all personal notes, cards and settings; verify before migration.
82. **Encrypted cross-device sync** — Gated. Biblical grounding: Proverbs 11:13. Acceptance: Threat-model encryption, recovery, deletion and per-user access before launch.
83. **Offline prayer library** — Planned. Biblical grounding: Deuteronomy 6:6–9. Acceptance: Cache approved public content, label offline status and test update recovery.
84. **Installable app** — Planned. Biblical grounding: Deuteronomy 6:6–9. Acceptance: Verify supported-device install and offline behaviour; no unsupported promises.
85. **Reliable opt-in push** — Gated. Biblical grounding: 1 Corinthians 14:40. Acceptance: Require backend scheduling, consent, timezone handling, cancellation and device testing.
86. **Accessible reading controls** — Planned. Biblical grounding: 1 Corinthians 12:22. Acceptance: Support text scaling, contrast, screen readers and reduced motion.
87. **Keyboard and touch audit** — Planned. Biblical grounding: 1 Corinthians 12:22. Acceptance: Complete core flows by keyboard and on a small touch screen.
88. **Plain-language and low-load mode** — Planned. Biblical grounding: Romans 15:1–2. Acceptance: Provide short sentences, one primary action and optional detail.
89. **Private-by-default sharing** — Gated. Biblical grounding: Proverbs 11:13. Acceptance: Preview recipient and content; require explicit sharing action and revocation support.
90. **Release and recovery evidence** — Planned. Biblical grounding: Proverbs 12:22. Acceptance: Record commit, checks, deployment, browser evidence and rollback steps truthfully.

### Deeper discipleship and careful future exploration

Priority / inspiration: Later / original synthesis.

91. **Scripture memory practice** — Planned. Biblical grounding: Psalm 119:11. Acceptance: Offer reveal/hide, retrieval and context without spiritual rankings.
92. **Advent and Easter journeys** — Planned. Biblical grounding: Luke 2; Luke 24. Acceptance: Label calendar traditions and offer Scripture-led seasonal paths.
93. **Grief and waiting collection** — Planned. Biblical grounding: John 11:17–44; Romans 8:18–27. Acceptance: Make room for sorrow and hope without predicting healing timelines.
94. **Prayer in illness** — Planned. Biblical grounding: James 5:13–16. Acceptance: Invite prayer and church support while affirming appropriate healthcare.
95. **Work as service** — Planned. Biblical grounding: Colossians 3:23–24. Acceptance: Connect integrity and care to actual work without glorifying overwork.
96. **Creation gratitude walk** — Planned. Biblical grounding: Psalm 104. Acceptance: Offer safe, eyes-open noticing and thanksgiving without location tracking.
97. **Justice and mercy reflection** — Planned. Biblical grounding: Micah 6:8; Luke 4:16–21. Acceptance: Connect prayer with informed, humble action and careful sourcing.
98. **Theological review register** — Planned. Biblical grounding: Acts 17:11; 1 Thessalonians 5:21. Acceptance: Record context checks and qualified human review for disputed or consequential material.
99. **Optional AI drafting assistant** — Gated. Biblical grounding: 1 Thessalonians 5:21. Acceptance: Only user-requested drafts, clear AI labels, verified citations, no divine voice or authority claims.
100. **Personal seasonal discernment** — Planned. Biblical grounding: Romans 12:1–2. Acceptance: Review whether the app supports love of God and neighbour; permit removing features and stepping away.

## Delivery and validation

New implementation lives in `prayer-library.html` and `assets/practice-library.mjs`: 12 guided practices, seven Gospel readings, four family prayer prompts, search and links to three additional companions. The seven readings are one roadmap feature; the backlog is not a misleading count of shipped screens. Existing page navigation and the Vite multipage configuration include the library. No new storage schema, external script or dependency is introduced.

Run `node --test scripts/*.test.mjs`, `node --check assets/practice-library.mjs`, and `git diff --check`. GitHub Pages packages the static root files directly, so its workflow is the production build; Vite is a secondary path. Verify practice search, expanded guidance and Scripture links in the deployed browser. Human theological review, native Android acceptance and every planned/gated item remain open. Rollback is a normal revert of this additive release; existing prayer notes and shelves are untouched.
