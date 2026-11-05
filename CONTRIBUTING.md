# Contributing to the Asterisk Labs website

Want your project or tool on the site, or a fix to an existing page? Pick the
way that suits you below. Whichever you choose, the path is the same:

> **branch → pull request → a website mod reviews → merge → it goes live.**

Never commit to `main` directly.

## Five ways to add or edit a page

1. **No-code — submission form** (Asterisk members). Fill in the
   [Notion submission form](https://app.notion.com/p/6f5f0f615dbd49da8f5b5c55fc15d1a8)
   and a website mod turns it into a page for you. Needs Asterisk workspace
   access. Best if you don't want to touch the repo at all. Mods:
   [`docs/notion-intake.md`](docs/notion-intake.md).

2. **Markdown.** Copy a starter and write in Markdown — prose, lists, links,
   images.
   - Projects: copy [`project-pages/_template.md`](project-pages/_template.md)
   - Tools: copy it into `tools-pages/`
   - Guides: [`project-pages/README.md`](project-pages/README.md) ·
     [`tools-pages/README.md`](tools-pages/README.md)

3. **Custom HTML.** For a page that needs its own canvas, widget or layout. Copy
   [`project-pages/_template.html`](project-pages/_template.html). Same guides as
   above.

4. **With Claude.** Let Claude Code build the entry and page from your content.
   Run the **add-page** skill (`.claude/skills/add-page/`); the house rules it
   follows are in [`CLAUDE.md`](CLAUDE.md). You can also paste a GitHub repo or
   your project's page — Claude scaffolds the page structure (headings, links,
   logo) with `WRITE:` placeholders for you to fill, and never writes the prose
   itself.

5. **Bring your own page.** Built a page in its own repo, served at
   `asterisk.coop/<name>/` (like TACO)? List it with a `url:` entry in
   `_data/tools.yml` (or `projects.yml`), and add one line so it carries the
   Asterisk nav — see [Nav bar for external pages](#nav-bar-for-external-pages)
   below.

Ways 1–4 produce the same thing: an entry in `_data/projects.yml` or
`_data/tools.yml`, and an optional detail page — on a branch, for review. Way 5
links a page that lives in its own repo.

## Card logo and status

- **Logo:** set `image:` to a file in `assets/imgs/`. No logo? Claude pulls your
  project's own logo from its page or links if there is one, otherwise drops in a
  temporary `emoji:` placeholder.
- **Status (tools):** set `status:` to one of 🧪 `experimental`, 🔥 `hot code`,
  ✅ `stable`, 📦 `archived`. It shows as a colour badge on the tools card, and —
  on a page that embeds the nav bar — as a label at the top-left.

## Nav bar for external pages

A page built in its own repo (served under `asterisk.coop/<name>/`) doesn't get
the site nav automatically. Add one line near the end of its `<body>`:

    <script src="https://asterisk.coop/assets/asterisk-bar.js" defer data-status="hot code"></script>

It injects a slim Asterisk bar (logo + nav, matching the main site) and, from
`data-status`, a status label at the top-left. The bar lives in this repo
(`assets/asterisk-bar.js`), so it updates centrally — you add the line once.

## Style

Follow the media kit so every page looks like one site:
[`docs/style-checklist.md`](docs/style-checklist.md) — the three brand colours,
League Spartan type, buttons via `{% include button.html %}`, and the rule that
no machine-written prose goes live.

Missing copy is left as a `<p class="needs-copy">WRITE: …</p>` brief, not filler
or generated text — a human writes it before merge.

## Review and publish

1. Preview locally first: `bundle exec jekyll serve --port 4000`, open your page,
   then `bundle exec jekyll build` (must exit 0).
2. Commit to a **branch**, not `main`.
3. Open a pull request. A website mod reviews it — a Cloudflare Pages preview on
   the PR shows the change live before it merges.
4. On merge, GitHub Pages redeploys asterisk.coop automatically.

Mods and admins: the reviewer's checklist and the one-time branch-protection and
preview setup are in [`docs/review-gate.md`](docs/review-gate.md).

## Where things live

| Path | What |
|------|------|
| `_data/projects.yml`, `_data/tools.yml` | the listings (cards are generated from these) |
| `project-pages/`, `tools-pages/` | detail pages + their README guides |
| `_layouts/project.html` | the detail-page layout (`theme:` sets the accent colour) |
| `_includes/` | shared components (buttons, viewers) |
| `assets/` | CSS and images |
| `assets/asterisk-bar.js` | the drop-in nav bar embedded by external project pages |
| `/brand`, `docs/style-checklist.md` | the media kit and the short style rules |
