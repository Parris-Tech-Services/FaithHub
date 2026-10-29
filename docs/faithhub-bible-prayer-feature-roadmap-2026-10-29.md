# FaithHub — Bible, Psalm, Scripture, Prayer and Faith Feature Roadmap

**Research date:** 29 October 2026  
**Repository:** [Parris-Tech-Services/FaithHub](https://github.com/Parris-Tech-Services/FaithHub)  
**Scope:** Research-based, biblically grounded development roadmap covering existing features, additions in the Scripture Atlas delivery, and future candidates. **This is a backlog, not a claim every item has been implemented.**

## North star and theology

**FaithHub exists to help people be with Jesus, become like Jesus and do what Jesus taught, by opening the Scriptures in their literary, historical, covenantal and canonical contexts and responding through prayer, worship, community and loving action.** Luke 24:27 and 44–47, John 15:4–17, 2 Timothy 3:14–17, James 1:22–27, Psalm 1, Mark 12:28–34 and Matthew 28:18–20 are orienting texts. No app can mediate divine grace mechanically, replace corporate worship or guarantee answered prayer.

### Research: what other apps do well

| App | Officially supported patterns | FaithHub adaptation / differentiation |
|---|---|---|
| [YouVersion Bible App](https://www.youversion.com/bible-app) | Bible versions, listening, bookmarks, private notes, plans, prayer and verse art | Strong passage navigation and flexible plans; no guilt-driven streaks or copied Bible text |
| [BibleProject](https://bibleproject.com/app/) | Unified biblical story, animations, structured studies and context | Context-first study with canonical story and Jesus at its centre; link to licensed videos |
| [Lectio 365](https://lectio365.com/) | Morning, midday and night devotionals, P.R.A.Y., examen and audio | Read, reflect and pray through Scripture; flexible gentle daily rhythms |
| [Dwell](https://dwellapp.io/) | Audio Bible, listening routines, playlists and child-oriented audio | Licensed Bible audio provider links before any native audio ambitions |
| [Bible Gateway](https://www.biblegateway.com/app/) | Multiple translations, side-by-side comparison, notes, highlights and audio | External links to complete NIV and WEB chapters; later rights-safe comparison |
| [Logos](https://support.logos.com/hc/en-us/articles/360017893592-Using-Guides) | Passage, word study and exegetical guides | Verifiable book context, original-language aids with human review rather than fake expertise |
| [Hallow](https://hallow.com/features/) | Guided prayer, duration choices, journaling and prayer reminders | Short choices and sincerity without automatically gamifying practice; recognise Catholic specificity |
| [PrayerMate](https://www.prayermate.net/app?locale=en) | Prayer-card organisation, daily rotation and source-backed intercession feeds | Private opt-in personal cards and accurate biblical intercession without public disclosure |
| [Pray As You Go](https://prayasyougo.org/) | Scripture, music and reflective audio in a regular contemplative pattern | Short listening guides with transcript and Scripture provenance |
| [Church of England Daily Prayer](https://www.churchofengland.org/prayer-and-worship/join-us-service-daily-prayer/daily-prayer-app-and-podcast) | Morning/evening/night office, Psalms, seasons and liturgical settings | Optional prayers of the hours with open denominational labelling |
| [Practicing the Way](https://www.practicingtheway.org/resources) | Prayer, Scripture, Sabbath, fasting, solitude, generosity, service, community and witness | A non-coercive Rule of Life; reflection plus everyday loving action |

**Evidence hierarchy:** Bible references and original texts first; original ministry/product feature pages for competitor comparisons; independently written application notes; historical scholarship for disputable contexts. Distinguish what a source states from our interpretation and from product speculation.

### Text rights and source safeguards

- The [World English Bible (66-book Protestant edition)](https://ebible.org/engwebp/copyright.htm) is public domain; retain proper edition provenance, stable versioning, and trademark designation. Full text integration is a **future** task, not claimed complete.
- The [NIV](https://www.bible.com/bible/111/GEN.1.NIV) and [ESV](https://api.esv.org/) have different permissions. Current Atlas links out rather than reproducing long passages; do not cache them without permission.
- Structured [CrossReferences.org data](https://crossreferences.org/project/data/) is CC BY 4.0 but Bible translation text remains independently licensed.
- Never invent Bible quotes, Hebrew/Greek etymologies, revelations, prophecies, promises of healing, resurrection of the dead, or divine approval of a user's choices.
- Respect distinct Christian traditions on canon and secondary doctrine; disclose interpretive disagreements rather than presenting a single speculative tradition as an undisputed fact.

### What is already present and what this delivery adds

**Pre-existing:** [daily FaithHub rhythms](../../index.html), [everyday prayer](../../daily-prayer.html), [four ways of talking with God](../../prayer-practice.html), [Luke 11 study](../../readings/luke-11-5-13.md), prayer reflection, family and Sabbath.

**This delivery — Scripture Atlas:** [scripture-atlas.html](../../scripture-atlas.html) introduces curated Scripture and Psalms with original context/prayers, search/filter, external full NIV/WEB reading links, optional audio of *original study material*, guided seven-day plans, voluntary reading marks, bookmarks, reference recall, personal notes with explicit Save, export and delete. It **is not a full Bible corpus, full-text Bible search, or licensed audio Bible**.

**Status key:** `Built` = feature implemented in this PR (pending its tests and deployment); `Existing` = present before this PR; `Next` = recommended backlog; `Later` = needs theological, editorial, technical or privacy design. Priority P0 = correctness and safe foundation; P1 = core experience; P2 = exploratory. A built feature is not automatically a verified hands-on product acceptance test.

### Numbered backlog


## Scripture foundation, canon, text and licences

**Scripture orientation:** Luke 24:27; 2 Timothy 3:16–17; Psalm 119:105.

**001. Curated Scripture Atlas with contextual notes** — `Built` · P0. List curated passages and link full readings without falsely claiming complete Bible coverage.

**002. Verified canon and book-name map** — `Next` · P0. Validate all 66 Protestant-canon books and abbreviations against trusted Scripture sources.

**003. Rights-safe WEB full-text reader** — `Next` · P0. Integrate verified 66-book WEB Protestant edition offline with attribution and exact chapter/verse provenance.

**004. Published passage citation policy** — `Built` · P0. Clearly separate Bible text, historical quotation, original commentary and devotional application.

**005. NIV passage links** — `Built` · P0. Link accurately to Bible.com's full NIV text rather than copying copyrighted chapters.

**006. Public-domain translation switcher** — `Next` · P1. Choose WEB classic vs Protestant LORD edition without silently mixing variants.

**007. Bible book introductions** — `Next` · P1. Author and review genre, audience, date uncertainty, covenant setting and theological themes per book.

**008. Textual variant notes** — `Later` · P1. Explain significant manuscript differences without sensationalism or masking uncertainty.

**009. Deuterocanon awareness** — `Later` · P1. Explain Catholic, Orthodox and Protestant canon differences respectfully without mixing canons silently.

**010. Translation philosophy explainer** — `Next` · P1. Explain formal/dynamic approaches and reasons to compare versions carefully.


## Bible navigation, reading and discovery

**Scripture orientation:** Deuteronomy 6:6–9; Nehemiah 8:8; John 5:39.

**011. Search curated passages by topic or reference** — `Built` · P0. Search original annotations and Scripture references, without pretending to full-text search.

**012. Filter by Bible book and testament** — `Built` · P0. Support meaningful book/testament filters, including Psalms and Gospels.

**013. Guided passage detail** — `Built` · P0. Show context, observation, response, prayer and both external reading links.

**014. Psalm-only browsing mode** — `Built` · P0. Find and study explicitly curated Psalms with one tap.

**015. Full canon book-chapter-verse picker** — `Next` · P1. Navigate every book/chapter once licensed or public-domain text is integrated.

**016. Bible wide full-text search** — `Next` · P1. Index WEB with exact references, ranked hits and transparent search behavior.

**017. Parallel translations** — `Later` · P1. Display properly licensed translations with distinctive labels and source notices.

**018. Cross-references with attribution** — `Next` · P1. Add vetted CC BY 4.0 Treasury of Scripture Knowledge cross-refs; verify source licences.

**019. Passage context navigation** — `Next` · P1. Link preceding/following chapters and paragraph pericopes.

**020. Canonical timeline and book overview** — `Later` · P2. Show eras, kings, exile and New Testament history with chronological uncertainty marked.


## Psalms, worship and poetic prayer

**Scripture orientation:** Psalm 13; Psalm 23; Psalm 88; Psalm 150.

**021. Praise, lament, confession, trust and stillness Psalm choices** — `Built` · P0. Provide curated Psalm entry points without forcing emotional positivity.

**022. Praying a Psalm guided response** — `Built` · P0. Offer read/notice/respond/leave-space prompts grounded in the whole Psalm.

**023. Psalm genre guide** — `Next` · P1. Distinguish praise, thanksgiving, communal and individual laments, royal and wisdom Psalms.

**024. Parallelism and metaphor notes** — `Next` · P1. Teach Hebrew poetic parallelism and figurative language.

**025. Psalm 88 as unresolved lament** — `Built` · P1. Support faithful grief without requiring a hopeful emotional ending.

**026. Psalm of the week** — `Next` · P1. Suggest a Psalm with full-context reading, not random isolated fragments.

**027. Psalm of pilgrimage** — `Next` · P1. Curate Songs of Ascents with historical and devotional context.

**028. Imprecatory Psalm pastoral notes** — `Next` · P1. Explain judgement language without sanctioning revenge, violence or abuse.

**029. Psalm and Jesus connections** — `Later` · P1. Explore Jesus' use of Psalms in Gospels with citation and interpretation.

**030. User-composed responsorial psalm** — `Later` · P2. Let people choose refrain and write a private response without altering Scripture text.


## Jesus, the gospel and discipleship

**Scripture orientation:** Mark 1:15; Matthew 5–7; John 15:1–17.

**031. Begin with Jesus reading path** — `Built` · P0. Seven contextual readings from Gospels, including mission and humble service.

**032. Gospel harmony comparison** — `Next` · P1. Compare parallel accounts without flattening distinct evangelists' emphases.

**033. Sermon on the Mount reader** — `Next` · P1. Walk Matthew 5–7 section by section with the social context of the kingdom.

**034. Parables in context** — `Next` · P1. Describe audience, tension, surprise and central question without over-allegorising every detail.

**035. Jesus' questions collection** — `Next` · P1. Explore the questions Jesus asks before writing an answer.

**036. Miracles and kingdom signs** — `Next` · P1. Connect stories of healing and provision to gospel purpose without promising healing.

**037. Passion week reading path** — `Next` · P1. Follow the gospel narratives with a historically cautious chronology.

**038. Resurrection encounters** — `Next` · P1. Explore distinct resurrection stories, witnesses and doubts.

**039. The Lord's Prayer line-by-line** — `Next` · P1. Explain Father, kingdom, daily bread, forgiveness, temptation and deliverance.

**040. Follow Jesus in everyday decisions** — `Later` · P2. Reflect on humility, neighbour love and truth in concrete scenarios.


## Learning to pray and regular rhythms

**Scripture orientation:** Luke 11:1–13; Matthew 6:5–13; 1 Thessalonians 5:17.

**041. Four forms of talking with God** — `Existing` · P0. Distinguish gratitude, lament, petition and intercession from Comer's four top-level movements.

**042. Embodied prayer and posture** — `Existing` · P0. Provide standing, seated, open-hand and gentle kneeling alternatives.

**043. Daily prayer anchor and calendar reminder** — `Existing` · P0. Support a real reminder source without claiming a website can send push notifications.

**044. Prayer with Scripture in Atlas** — `Built` · P0. Offer an original prayer responding directly to every curated passage.

**045. Scripture-based breath prayer** — `Next` · P1. Pair short verified biblical phrases with voluntary gentle breathing without medical claims.

**046. ACTS prayer guide** — `Next` · P1. Explain adoration, confession, thanksgiving and supplication as a helpful convention, not a biblical command.

**047. P.R.A.Y. approach** — `Next` · P1. Offer Pause, Rejoice, Ask, Yield with attribution to Lectio 365 and original guidance.

**048. The Lord's Prayer at midday** — `Next` · P1. Offer a one-step midday pause anchored in Jesus' words.

**049. Morning/noon/evening prayer office** — `Next` · P1. Offer short, adaptable offices with Scripture, silence and prayer.

**050. Seasonal prayer calendar** — `Later` · P2. Provide biblical feast and church-year options with denominational flexibility.


## Lament, confession and pastoral wisdom

**Scripture orientation:** Psalm 13; Psalm 51; Psalm 88; Romans 8:26.

**051. Open-ended lament practice** — `Existing` · P0. Let people honestly express grief without a forced happy ending.

**052. Safety notes around unanswered prayer** — `Existing` · P0. Never portray prayer as a technique that guarantees outcomes.

**053. Lament linked to Psalms** — `Next` · P1. Choose a lament Psalm and write a private original response.

**054. Confession and repentance prompts** — `Next` · P1. Distinguish conviction, shame, forgiveness and wise repair.

**055. Prayer for uncertainty** — `Next` · P1. Make space for doubt, questioning and uncertainty with no spiritual ranking.

**056. Trauma-informed participation** — `Next` · P1. Permit passing or stopping and never require disclosure to groups.

**057. Grief and remembrance journal** — `Later` · P1. Create private space to remember the dead without prescribing emotional stages.

**058. Prayers of protest and justice** — `Next` · P1. Use prophetic lament to ask for justice and compassionate action.

**059. Spiritual abuse red flags** — `Later` · P2. Distinguish faithfulness from coercion, control and unsafe pastoral claims.

**060. Pastoral referral pathway** — `Later` · P2. Encourage real care and urgent safety support where prayer alone is insufficient.


## Intercession, prayer cards and caring

**Scripture orientation:** 1 Timothy 2:1–2; James 5:16; John 17.

**061. Private four-form prayer practice** — `Existing` · P0. Offer gratitude, lament, petition, intercession and opt-in local notes.

**062. Bible-indexed intercession topics** — `Next` · P1. Suggest references for family, church, authorities, peace and the marginalised.

**063. Pray the room from FaithHub** — `Next` · P1. Guide someone to invite a person or situation to mind without claiming revelation certainty.

**064. Private custom prayer cards** — `Next` · P1. Store individual intentions locally and encrypt only when secure storage is implemented.

**065. Consent-based prayer sharing** — `Later` · P1. Share only with explicit consent and privacy-safe controls, never via a public repository.

**066. Follow-up with practical kindness** — `Later` · P1. Offer optional actions such as meals and encouragement without turning prayer into task guilt.

**067. Intercessory prayer from epistles** — `Next` · P1. Pray Ephesians 3, Colossians 1 and Philippians 1 in context.

**068. Prayers for leaders and institutions** — `Next` · P1. Pray for wisdom and justice without partisan propaganda.

**069. Mission and global church guides** — `Later` · P2. Choose contextually sourced needs and avoid harmful missionary stereotypes.

**070. Sensitive-people data protection** — `Next` · P2. No health, crisis or identifying prayer request should reach public logs or analytics.


## Reading plans, pathways and discernment

**Scripture orientation:** Psalm 1; Acts 17:11; 2 Timothy 3:16–17.

**071. Twelve seven-day thematic reading paths** — `Built` · P0. Supply structured sequences with seven real references each.

**072. User-driven reading marks** — `Built` · P0. Mark passages revisited without asserting they were read or calculating streaks.

**073. Chronological Bible plan** — `Next` · P1. Provide a balanced whole-canon reading path with clear historical assumptions.

**074. Whole-Bible one-year path** — `Next` · P1. Allow flexible dates and no guilt over missed days.

**075. Gospels in 30 days** — `Next` · P1. Cover all four with meaningful pacing and explanatory context.

**076. Psalms and Proverbs companion** — `Next` · P1. Offer daily wisdom and psalm readings without treating Proverbs as unconditional promises.

**077. Life-stage thematic plans** — `Next` · P1. Create fatigue, parenting, work, friendship and caregiving pathways, clearly not personalised prophecy.

**078. Advent and Easter journeys** — `Next` · P1. Present season-based plans with adaptable Protestant/other traditions.

**079. Plan resume and reset** — `Next` · P1. Resume, restart or archive a plan without deleting notes or imposing a score.

**080. Community reading plan** — `Later` · P2. Allow groups to read together only with consent and private controls.


## Bible literacy, genres and hermeneutics

**Scripture orientation:** Nehemiah 8:8; Luke 24:27; 2 Peter 3:15–16.

**081. Context-first prompts** — `Built` · P0. Show context, reflect and prayer before suggesting a personal application.

**082. Genre identification** — `Next` · P1. Distinguish narrative, law, wisdom, psalm, prophecy, Gospel, letter, apocalypse.

**083. Observation–interpretation–application workflow** — `Next` · P1. Ask what it says, what it meant, and how to respond faithfully.

**084. Covenant and redemptive story** — `Next` · P1. Connect creation, fall, Israel, Jesus, church and new creation responsibly.

**085. Original audience and setting** — `Next` · P1. Add author, audience, purpose and date caveats where debated.

**086. Misuse warning for proof texts** — `Next` · P1. Flag famous passages frequently detached from context.

**087. Proverbs are wisdom not guarantees** — `Next` · P1. Teach how poetic wisdom works in a fallen world.

**088. Prophetic promise context** — `Next` · P1. Do not repurpose specific ancient national promises as individual predictions.

**089. Apocalyptic symbolism primer** — `Later` · P1. Explain Revelation and Daniel images with multiple responsible interpretive schools.

**090. Interpretation spectrum** — `Later` · P2. Distinguish core Christian confession from contested secondary questions without false equivalence.


## Memory, meditation and active recall

**Scripture orientation:** Psalm 119:11; Deuteronomy 6:6–9; Colossians 3:16.

**091. Scripture-reference recall prompt** — `Built` · P0. Ask users to recall a studied passage and reopen the text to check accuracy.

**092. Original guide text browser read-aloud** — `Built` · P0. Offer optional read-aloud of commentary and prayer, clearly not audio Bible.

**093. Verse-level memory cards using WEB** — `Next` · P1. Only quote verified public-domain verse text and label translation.

**094. Hide-and-reveal word exercise** — `Next` · P1. Fade portions of known text gradually with explicit source attribution.

**095. Spaced repetition without guilt** — `Next` · P1. Schedule voluntary recall suggestions with no failure or streak language.

**096. Type from memory practice** — `Next` · P1. Compare user input to chosen WEB passage locally and show gentle accuracy feedback.

**097. Memory verse by theme** — `Next` · P1. Choose verses about love, wisdom, peace and gospel without arbitrary proof-texting.

**098. Recite with a child** — `Later` · P1. Design age-appropriate joyful repetition without a graded scoreboard.

**099. Print memory cards** — `Later` · P1. Print reference and verified text with attribution and layout control.

**100. Memorisation without sight** — `Later` · P2. Audio-first recall prompts with a full-accessible alternative.


## Audio, silence and listening

**Scripture orientation:** Romans 10:17; 1 Samuel 3:10; Luke 10:39.

**101. Listening to original study guides** — `Built` · P0. Use native speech synthesis on request and provide a Stop control.

**102. Link external full audio Bible** — `Next` · P1. Open provider-hosted, permitted recordings for the exact passage.

**103. Optional speed controls** — `Next` · P1. Expose voice rate for local read-aloud without influencing Scripture text.

**104. Silence without a countdown** — `Next` · P1. Offer a distraction-free quiet screen without making minutes a score.

**105. Lectio Divina sequence** — `Next` · P1. Read, meditate, pray and contemplate with context and discernment notes.

**106. Audio Scripture playlist** — `Later` · P1. Build links to licensed public audio resources rather than copying commercial tracks.

**107. Low bandwidth downloadable WEB text** — `Later` · P1. Provide local public-domain Scripture chapters in a versioned offline cache.

**108. Family listen-along mode** — `Later` · P1. Simple big controls for shared reading, with children able to opt out.

**109. Accessible voice selection** — `Later` · P2. Use available system speech voices without assuming a voice is always installed.

**110. Guided embodied prayer audio** — `Later` · P2. Produce original prompts with transcripts and no forced breathing rhythms.


## Journals, bookmarks, privacy and backup

**Scripture orientation:** Psalm 139:23–24; Habakkuk 2:2; Luke 2:19.

**111. Private passage bookmarks** — `Built` · P0. Allow intentional save/remove of referenced passages locally.

**112. Explicit-save Scripture reflection** — `Built` · P0. Never auto-save a sensitive note merely because someone typed it.

**113. Delete a passage note** — `Built` · P0. Permit deletion, with confirmation for stored content.

**114. Export sensitive notes to JSON** — `Built` · P0. Allow deliberate local backup with a privacy warning.

**115. Clear all Atlas data** — `Built` · P0. Erase local passage notes, marks and bookmarks after explicit confirmation.

**116. Restore backup with validation** — `Next` · P1. Import backed-up notes with schema, size caps, merge rules and user confirmation.

**117. Passage-linked prayer journal** — `Next` · P1. Connect local prayer drafts to explicit Scripture references.

**118. User-selectable private device lock** — `Later` · P1. Consider encryption with locally held key, threat-modelled for lost-device access.

**119. Sync only by explicit opt-in** — `Later` · P1. Never silently sync personal notes, identifying prayer subjects or family health.

**120. Minimal metrics and data dashboard** — `Later` · P2. Audit local data usage with user-controlled purge and no telemetry by default.


## Family, children and intergenerational faith

**Scripture orientation:** Deuteronomy 6:6–9; Mark 10:13–16; Psalm 78:4–7.

**121. Short family prayer prompt** — `Existing` · P0. Keep Scripture and prayer invitations gentle and opt-in.

**122. Children's story selection** — `Next` · P1. Use whole-story context, not just disconnected moral slogans.

**123. Read aloud parent-child Psalms** — `Next` · P1. Choose accessible verses and short responses with one-tap prompts.

**124. Age-appropriate Bible questions** — `Next` · P1. Ask who, what, why, and what Jesus teaches; avoid fear-inducing quizzes.

**125. Biblical story sequencing** — `Next` · P1. Help children see creation, Israel, Jesus and new creation in order.

**126. Colour and drawing prompts** — `Later` · P1. Allow drawing an original response to a Bible story; never present invented art as biblical evidence.

**127. Family blessing with consent** — `Next` · P1. Offer positive short prayers without forcing physical touch or disclosure.

**128. Parent reflection notes** — `Next` · P1. Private observations with no child's identifying data sent to the public repo.

**129. Child-friendly quiet mode** — `Later` · P1. Support reading, story listening and one-sentence prayer with simple accessible controls.

**130. Neurodiversity-friendly layouts** — `Later` · P2. Add predictable navigation, reduced motion and adjustable sensory load.


## Rule of life, Sabbath and spiritual disciplines

**Scripture orientation:** Mark 1:35; John 15:4–5; Exodus 20:8–11; Luke 10:38–42.

**131. Gentle daily rhythms** — `Existing` · P0. Keep morning, midday, evening and family practices without scorekeeping.

**132. Sabbath reflection and rest** — `Existing` · P0. Treat rest as gift rather than achievement.

**133. Rule of Life workshop** — `Next` · P1. Choose flexible rhythms of prayer, rest, Scripture, community, service and generosity.

**134. Sabbath preparation prompts** — `Next` · P1. Plan simple delights and realistic responsibilities with family consent.

**135. Fasting wisdom and safeguards** — `Later` · P1. Explain biblical practice; do not suggest fasting to pregnant, eating-disordered or medically vulnerable people.

**136. Solitude and silence invitation** — `Next` · P1. Make a short, body-accessible time without pressure.

**137. Generosity without guilt** — `Next` · P1. Reflect on uncoerced giving and justice rather than quotas.

**138. Community commitment** — `Next` · P1. Encourage church fellowship and appropriate accountability in real life.

**139. Service pathways** — `Next` · P1. Connect passages on neighbour love to freely chosen local care.

**140. Annual rhythms review** — `Later` · P2. Allow honest reflection without comparing one person's holiness to another.


## Theology, doctrine and church history

**Scripture orientation:** Acts 2:42; John 1:1–18; 1 Corinthians 15.

**141. Apostles' Creed explainer** — `Next` · P1. Present traditional creedal Christian claims and relevant Scripture with attribution.

**142. Nicene Creed explainer** — `Next` · P1. Cover Trinity and Christology without reducing mystery to oversimple analogies.

**143. Trinity in Scripture** — `Next` · P1. Explain Father, Son and Spirit with interpretive care.

**144. Grace, faith and works** — `Next` · P1. Place Ephesians, James and Pauline texts in context.

**145. Atonement viewpoints** — `Later` · P1. Map major orthodox Christian emphases and debated accounts fairly.

**146. Resurrection case study** — `Next` · P1. Read 1 Corinthians 15 and Gospel resurrection passages without sensational claims.

**147. Christian unity and difference** — `Next` · P1. Describe traditions respectfully, including baptism and communion differences.

**148. Women in Scripture** — `Later` · P1. Explore narratives and contested church interpretations with honest sourcing.

**149. Church fathers and reformers library** — `Later` · P1. Use licensed/public-domain primary texts with historical setting.

**150. Church calendar and liturgy** — `Later` · P2. Present denominational options without implying one is universally normative.


## Ethics, justice and Christ-shaped action

**Scripture orientation:** Micah 6:8; Matthew 25:31–46; James 1:27.

**151. Justice and neighbour-love reading path** — `Built` · P0. Connect Scripture to humane, accountable action.

**152. Sermon ethics reflection** — `Next` · P1. Draw practical applications while guarding against abuse-enabling interpretations.

**153. Peacemaking and conflict** — `Next` · P1. Differentiate forgiveness, reconciliation, boundaries and safety.

**154. Workplace faithfulness** — `Next` · P1. Explore truth, skill, justice, service and rest with fair treatment of colleagues.

**155. Creation care readings** — `Next` · P1. Trace stewardship, creatureliness and responsible use of resources.

**156. Money and generosity path** — `Next` · P1. Include poverty, honest work and wise stewardship without prosperity promises.

**157. Hospitality to strangers** — `Next` · P1. Develop practical prompts with safeguards and dignity.

**158. Care for the sick** — `Next` · P1. Discuss presence and practical service without equating prayer with medical treatment.

**159. Power, leadership and authority** — `Later` · P1. Read Moses, Jesus and letters against exploitation and coercion.

**160. Local service resource links** — `Later` · P2. Curate verified church and charity links with dates and independent check criteria.


## Community, pastoral accountability and safeguarding

**Scripture orientation:** Galatians 6:1–2; James 5:16; Hebrews 10:24–25.

**161. Church and small-group study sheets** — `Next` · P1. Export Scripture references, questions and original discussion prompts.

**162. Safe discussion guides** — `Next` · P1. Permit passing, limit disclosure, and handle disagreement respectfully.

**163. Leader prep with source links** — `Next` · P1. Show provenance, context and major translation notes.

**164. Appropriate pastoral care boundaries** — `Next` · P1. Do not diagnose, promise miracles or give coercive directives.

**165. Prayer request consent model** — `Later` · P1. Require explicit sharing, visibility and deletion control.

**166. Sensitive notes never public by default** — `Built` · P1. No private prayer requests or identifying medical information in public GitHub content.

**167. Moderation policy for future sharing** — `Later` · P1. Block harassment, threats, coercion, hateful speech and disclosure abuse.

**168. Disclosure and mandatory reporting** — `Later` · P1. Document safeguarding obligations for any future church-group feature.

**169. Pastoral referral links** — `Later` · P2. Verify local care resources before recommending contacts.

**170. Facilitator guides by experience** — `Later` · P2. Design beginner and experienced leader modes without spiritual hierarchy.


## Product architecture, accessibility and quality

**Scripture orientation:** 1 Corinthians 14:40; Proverbs 11:14; 2 Corinthians 8:20–21.

**171. Accessible standalone Scripture Atlas** — `Built` · P0. Deploy responsive, keyboard-accessible study page to existing GitHub Pages build.

**172. Automated reference-integrity checks** — `Next` · P0. Test passage IDs, plan references and external link formatting in CI.

**173. No third-party analytics in private study** — `Built` · P0. Keep reflective entries out of telemetry and publicly deployed assets.

**174. WCAG keyboard and contrast testing** — `Next` · P1. Audit all controls, labels, focus flows and contrast on phone and desktop.

**175. Screen-reader study journey** — `Next` · P1. Test full navigation with actual screen readers, not only static inspection.

**176. Offline reading architecture** — `Later` · P1. Use versioned service worker and attribution for verified public-domain WEB text.

**177. Storage migration and corruption recovery** — `Next` · P1. Gracefully handle schema changes, quotas and malformed localStorage.

**178. Full privacy-first export/import** — `Next` · P1. Validate every field and use consent before merging sensitive notes.

**179. Browser playtest automation** — `Next` · P1. Exercise filtering, reading plans, notes, bookmarks, memory prompt and deletion.

**180. Source and editorial review workflow** — `Next` · P1. Require biblical source verification and independent review for substantive interpretive claims.

**181. Production deploy monitoring** — `Next` · P1. Confirm GitHub Pages Actions success and live page availability for each merge.

**182. Translation-source update checks** — `Later` · P2. Detect new WEB releases and process corrections with traceable provenance.


## Delivery order and gates

**Foundation:** Audit reference integrity and current UI; ensure all curated references and plans resolve, all provider links point at the intended translation, and source text rights are honoured. Preserve existing prayer notes and site deployment behavior.

**Next release:** Versioned full WEB text and real reference search, accurate Bible book map, contextual full chapter reader, independent Scripture-source checks, privacy migration tests and responsive real-device checks. Do not label a guided curated collection as a full Bible until the full text is present.

**Following releases:** Psalms and lament prayers, passage study, reading plans and memory, audio via permitted providers, safe family modes and group studies with safeguarding.

**Research-only before build:** Sync/auth, AI answers, group sharing, donations, advanced word-study tools, medical/trauma-sensitive resources. Each needs product review, legal/privacy analysis, Christian scholarship or pastoral oversight, and honest source citations.

### Acceptance and non-negotiables

1. Each passage or claim must be traceable to actual chapter/verse and genre. Show disputed interpretation as disputed.
2. Never generate invented Bible quotations. The app can quote properly attributed public-domain Bible text or link to licensed providers.
3. A Biblical promise to an ancient audience cannot automatically become a guarantee to a modern reader.
4. Prayer forms, postures and time spent never rank a person's holiness; no guilt-based streaks or coercion.
5. Lament can remain unresolved. Don't force positive emotions or present prayer as replacement for clinical or safeguarding care.
6. Scripture application should be responsible, compassionate, nonviolent and contextual, with real-world boundaries.
7. Personal prayers, children, family and medical details remain private by default; consent is required for any sharing or syncing.
8. All public-facing media must be rights-safe and credited. No copying devotional content or audio without licences.
9. Tests should check canonical IDs, chapter/ranges, plans, browser script syntax, accessibility basics, local-save/erase functionality and deployed links.
10. Claims of build, merge, testing and live operation require independently verified evidence, not just a created file or PR.

### Cross-repo link policy

FaithHub is the canonical Scripture/prayer product and roadmap. JoshHub may link to FaithHub from its dashboard; ResearchGems may make recall cards from *verified* FaithHub content. Avoid duplicating private prayer content or implying features are deployed across every app. A separate JoshHub prayer-card deck already exists; this roadmap proposes integration only if privacy and user intent are confirmed.
