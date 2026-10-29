# Rule of Life Companion

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

## Featured Scripture

- [Luke 11:5–13 (NIV) — Ask, seek, knock](https://bible.com/bible/111/luk.11.5-13.NIV). This reading is included in the daily Scripture rotation and linked permanently from FaithHub's main page.
- [Gentle reflection and prayer](readings/luke-11-5-13.md).

## Notes

- Entries are saved in local browser storage only.
- There are no streaks or scores.
- The progress bar is intentionally framed as “space made to notice God”, not spiritual performance.
