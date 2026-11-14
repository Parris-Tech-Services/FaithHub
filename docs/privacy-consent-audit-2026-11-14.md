# FaithHub Privacy, Export, Analytics & Family/Community Consent Audit (14 November 2026)

- **Repository:** `Parris-Tech-Services/FaithHub`
- **Assurance Tier:** Tier 3 (private prayer, confession, lament, intercession, and family/community notes may be entered locally)
- **Tasks Covered:** `VAL-001` (Presence-over-performance default), `VAL-002` (Unlogged Sabbath/rest & silence flows), `VAL-003` (Private prayer, export, analytics & family/community consent boundary audit)

---

## 1. Values Pre-Task Gate Record (`VALUES_PRETASK_GATE.md`)

- **Real-life value protected:** Unhurried abiding with Jesus, genuine Sabbath rest without productivity pressure, and dignity/consent for family, children, and church community members remembered in prayer.
- **Possible displacement:** Removing subtle completion bars and fraction badges prevents spiritual formation from turning into checklist performance; unlogged stillness lets someone step away from the screen rather than maintaining an app habit.
- **Existing system checked:** Audited all 13 root static HTML surfaces, 10 `assets/*.mjs` modules, and the secondary React companion (`src/App.jsx`) in `Parris-Tech-Services/FaithHub` instead of creating a new app or cloud backend.
- **Smallest useful action:**
  1. Enable **Presence over performance** by default in `index.html` and `src/App.jsx` (`VAL-001`), hiding progress bars and rhythm counts unless explicitly opted into in Appearance/Settings.
  2. Add **zero-storage Stillness & Unlogged Sabbath Rest** flows (`VAL-002`) with Scripture anchors and optional gentle pauses that write nothing to `localStorage` and tuck Sabbath checkboxes behind an optional disclosure.
  3. Audit all storage, export, analytics, and consent boundaries (`VAL-003`), reconcile 2 unindexed `faithhub-*` storage keys + Cornerstone podcast restore validation in `assets/backup-centre.mjs`, and add family/community consent guidance plus shared-screen veil and clear controls.
- **Stop condition:** 100% pass across `node --test scripts/*.test.mjs`, clean `npm run build`, verified GitHub Pages deployment matching `meta[name="faithhub-deploy-sha"]`, and `JoshMemory` queue reconciliation.
- **Human outcome:** Deeper faithfulness, more presence, reduced spiritual performance burden, and safer boundaries around family/community confidences.
- **Evidence required:** Automated regression tests (`scripts/values-formation.test.mjs`, `scripts/backup-centre.test.mjs`), Vite production build, and live GitHub Pages SHA check.
- **Decision:** `build` (focused simplification and boundary hardening inside existing `FaithHub`).

---

## 2. Complete Browser Storage & Export Inventory (14 Audited `FaithHub` Keys)

FaithHub has **no user accounts, no cloud database for prayer notes, and no background server sync**. All personal entries remain in origin-scoped browser `localStorage` until the user explicitly deletes them or downloads a local file.

| # | `localStorage` Key | Surface(s) | Kind | Sensitivity | Backup Centre (`backup.html`) | Page-Level Export / Clear |
|---|---|---|---|---|---|---|
| 1 | `faithhub-rule-of-life-v2` | `index.html` | JSON object | **High** (examen, confession, family/community notes, optional `preferences.presenceMode`) | Yes | Day reset (`#resetBtn`) & Family clear (`#clearCommunityBtn`) with `window.confirm` |
| 2 | `faithhub-theme` | `index.html`, `cornerstone-teachings.html` | `'light' \| 'dark'` | Low (UI preference) | Yes | Toggle button |
| 3 | `faithhub-appearance-v1` | `index.html`, `src/App.jsx` | `'original' \| 'sanctuary' \| 'uxpilot'` | Low (UI style) | Yes | Appearance menu |
| 4 | `faithhub:prayer-shelf:v1` | `daily-prayer.html` (`assets/daily-prayer.mjs`) | JSON object | Medium (saved HTTPS links/titles to personal Drive/Gmail prayer letters) | Yes | `#export` JSON backup, per-item remove |
| 5 | `faithhub:prayer-anchor:v1` | `daily-prayer.html` (`assets/daily-prayer.mjs`) | `'kettle' \| 'lunch' \| 'home' \| 'bed'` | Low (habit cue) | Yes | Overwritable selector; `.ics` download is stateless |
| 6 | `faithhub:prayer-four-movements:notes:v1` | `prayer-practice.html` | JSON object | **High** (thankfulness, lament, petition, intercession notes; explicit click-to-save only) | Yes | Per-movement clear + `#clear-all` with `window.confirm` |
| 7 | `faithhub:scripture-atlas:v1` | `scripture-atlas.html` (`assets/scripture-atlas.mjs`) | JSON object | **High** (Scripture journal notes & passage bookmarks; explicit click-to-save only) | Yes | `#journal-export`, `#journal-delete`, `#journal-reset` |
| 8 | `faithhub-psalm-explore-notes-v1` | `psalms.html` (`assets/psalm-explorer-data.mjs`) | JSON object | **High** (honest Psalm responses; explicit click-to-save only) | Yes | Save privately / Delete note with `window.confirm` |
| 9 | `faithhub-intercessions-v1` | `intercessions.html` (`assets/intercession.mjs`) | JSON array | **High** (names/initials, prayer requests, care actions; veiled on screen by default) | Yes | `#export-cards` JSON download, `#delete-all` with `window.confirm` |
| 10 | `faithhub-cornerstone-journal-v1` | `cornerstone-teachings.html` | JSON object | **High** (private pathway reflections; explicit click-to-save only) | **Yes (reconciled in `VAL-003`)** | `#export` JSON download, `#clear` with `confirm` |
| 11 | `faithhub-cornerstone-drive-private-v1` | `podcasts.html` | JSON array | Medium (user-imported Drive file IDs, titles, folder names; no audio bytes stored) | **Yes (reconciled in `VAL-003`)** | Clear private Drive catalogue control |
| 12 | `faithhub-podcast-selected-v2` | `podcasts.html` | Episode ID string | Low (last selected episode ID) | **Yes (validator widened in `VAL-003`)** | Updated on selection |
| 13 | `faithhub-local-podcast-v1` | `podcasts.html` (legacy read-only fallback) | Legacy index `0..24` | Low | Yes | Legacy compatibility |
| 14 | `rule-of-life-companion-v1` | `src/App.jsx` (secondary Vite/React app) | JSON object | **High** (secondary companion entries & `preferences.presenceMode`) | Yes | Day reset & Family clear with `window.confirm` |

### Zero-Storage Flows Verified (`VAL-002`)
- **Stillness & Unlogged Sabbath Sanctuary (`index.html` & `src/App.jsx`):** Open silence, 1/3/5-minute quiet pauses, and Scripture stillness words hold state strictly in volatile JavaScript memory and never invoke `localStorage.setItem` or `removeItem`.
- **Static Prayer & Reading Guides (`saints-prayer.html`, `prayer-library.html`, `ab401a-genesis.html`, `go-deeper.html`):** Perform zero `localStorage` writes of prayer text.

---

## 3. Analytics & Remote Script Boundary Audit

### 3.1 First-Party Opt-In Analytics (`parris-analytics` `tracker.js`)
- **Where loaded:** `index.html`, `ab401a-genesis.html`, `cornerstone-teachings.html`, `daily-prayer.html`, `podcasts.html`, `prayer-library.html`, `prayer-practice.html`, `psalms.html`, `saints-prayer.html`, `scripture-atlas.html`.
- **Where absent (zero external scripts at all):** `intercessions.html`, `backup.html`, `go-deeper.html`.
- **Verified privacy properties of `https://parris-analytics.parris-neathaustralia.workers.dev/tracker.js`:**
  1. **Strict opt-in gate:** `allowed` initializes to `false`. No network beacon is sent unless the visitor explicitly clicks **Allow analytics** (`parris-analytics-consent-v2:faithhub === "granted"`).
  2. **Browser privacy signals honoured immediately:** Exits before rendering or tracking if `navigator.globalPrivacyControl === true`, `navigator.doNotTrack === "1"`, or `window.doNotTrack === "1"`.
  3. **Payload minimization:** Sends only `{ site: "faithhub", path: location.pathname.slice(0, 180), event: "page_view" | "session_start" | "interaction" }` with `credentials: "omit"` and `referrerPolicy: "no-referrer"`. Query strings (`location.search`), hashes (`location.hash`), form fields, DOM text, cookies, visitor IDs, and `FaithHub` `localStorage` keys are never read or transmitted.
  4. **Prayer typing isolation:** The `keydown` listener explicitly ignores events originating from `INPUT`, `TEXTAREA`, `SELECT`, or `isContentEditable` elements, so typing a prayer, confession, or family note never triggers an analytics interaction ping or local timestamp update.
  5. **Analytics-owned browser storage keys** (separate `parris-analytics-*` namespace, intentionally excluded from `FaithHub` personal note backups):
     - `localStorage['parris-analytics-consent-v2:faithhub']` (`'granted' | 'denied'`)
     - `localStorage['parris-analytics-local-last-action-v1:faithhub']` (ISO timestamp shown locally in the analytics panel when opted in)
     - `sessionStorage['parris-analytics-session-v1:faithhub']` (`'1'`)

### 3.2 Shared Parris Network Toolbar (`parris-network.js`)
- **Where loaded:** `index.html` only (`https://parris-tech-services.github.io/WhirringWilderness/network/parris-network.js?v=2.1`), docked into `#faithhub-tools-slot`.
- **Boundary:** Same GitHub Pages organisation (`parris-tech-services.github.io`). Dedicated private intercession (`intercessions.html`) and full-archive backup (`backup.html`) pages intentionally load zero external scripts, and `scripts/assert-allowed-analytics.mjs` enforces that standalone Scripture/prayer pages load no unapproved remote scripts.

### 3.3 Third-Party Media & Scripture Links
- **Podcasts (`podcasts.html`):** Spotify, Apple Podcasts, Mixcloud, and audio players do **not** preload on page open (`#playerHost` starts empty); third-party embeds mount only after a visitor explicitly selects an episode to play.
- **Scripture links (`bible.com`, `biblegateway.com`) & external prayer apps:** Open in a new tab with `rel="noopener noreferrer"` under those providers' own privacy policies.

---

## 4. Defects Found & Remediated in `VAL-003`

1. **Unindexed `faithhub-*` keys previously blocked full backups on `backup.html`:**
   - *Finding:* `cornerstone-teachings.html` (`faithhub-cornerstone-journal-v1`) and `podcasts.html` (`faithhub-cornerstone-drive-private-v1`) wrote `faithhub-*` keys added after `backup-centre.mjs`'s original 12-key list. Because `backup-centre.mjs` fails closed when unrecognised `faithhub[-:]*` keys exist (`Export stopped: unrecognised FaithHub data was found`), saving a Cornerstone reflection or importing a private Drive CSV prevented `backup.html` from exporting a full backup.
   - *Fix:* Added both keys to `INVENTORY` (`14` audited keys total) and added a repository-wide automated scan in `scripts/backup-centre.test.mjs` so no future `faithhub[-:]*` `localStorage` key can be added without updating `INVENTORY`.
2. **Cornerstone & Drive episode IDs rejected during backup restore:**
   - *Finding:* Opening `podcasts.html` stores `cornerstone:episode:...` (or `public:drive:...` / `private:drive:...`) in `faithhub-podcast-selected-v2`, whereas `validateValue` in `assets/backup-centre.mjs` previously only accepted `spotify|apple|audio|external` prefixes, causing `parseBackup` to reject valid backups containing Cornerstone selections.
   - *Fix:* Updated `validateValue` (`kind: 'podcast'`) to validate `cornerstone:` and `public:drive:` / `private:drive:` IDs alongside existing provider prefixes, covered by unit tests in `scripts/backup-centre.test.mjs`.
3. **Family & community consent and shared-screen care (`index.html` & `src/App.jsx`):**
   - *Finding:* While `intercessions.html` already warned against entering confidential details without permission and veiled saved cards on shared screens, the `Family` tab in `index.html` and `src/App.jsx` prompted *"Who needs care?... Is there anyone to forgive, bless, or reach out to?"* without a consent reminder, shared-screen veil, or targeted clear button.
   - *Fix:* Added an explicit **Consent & shared-screen care** banner (advising initials/general descriptions and reminding that browser storage and JSON exports are unencrypted), a **Hide notes on shared screen** veil toggle, and a **Clear family & community notes** button with confirmation.

---

## 5. Residual Risks & Honest Limitations

- **Unencrypted local storage and JSON exports:** Neither browser `localStorage` nor downloaded `.json` backup files are encrypted at rest. Anyone with access to the same unlocked device profile or downloaded backup file can read saved notes. Shared-screen veil buttons prevent casual shoulder-surfing only.
- **No cross-device sync or automatic cloud backup:** Clearing site data in the browser permanently deletes local notes unless the user has downloaded a backup via `backup.html` or the page-specific export button.
