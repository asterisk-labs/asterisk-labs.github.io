# Contributing to the Asterisk Labs website

Want your project or tool on the site, or a fix to an existing page? Pick the
way that suits you below. Whichever you choose, the path is the same:

> **branch → pull request → a website mod reviews → merge → it goes live.**

Never commit to `main` directly.

## Four ways to add or edit a page

1. **No-code — submission form.** Fill in the form and a website mod turns it
   into a page for you. _(Form link: coming soon.)_ Best if you don't want to
   touch the repo at all.

2. **Markdown.** Copy a starter and write in Markdown — prose, lists, links,
   images.
   - Projects: copy [`project-pages/_template.md`](project-pages/_template.md)
   - Tools (magic): copy it into `magic-pages/`
   - Guides: [`project-pages/README.md`](project-pages/README.md) ·
     [`magic-pages/README.md`](magic-pages/README.md)

3. **Custom HTML.** For a page that needs its own canvas, widget or layout. Copy
   [`project-pages/_template.html`](project-pages/_template.html). Same guides as
   above.

4. **With Claude.** Let Claude Code build the entry and page from your content.
   Run the **add-page** skill (`.claude/skills/add-page/`); the house rules it
   follows are in [`CLAUDE.md`](CLAUDE.md).

All four produce the same thing: an entry in `_data/projects.yml` or
`_data/magic.yml`, and an optional detail page — on a branch, for review.

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

## Where things live

| Path | What |
|------|------|
| `_data/projects.yml`, `_data/magic.yml` | the listings (cards are generated from these) |
| `project-pages/`, `magic-pages/` | detail pages + their README guides |
| `_layouts/project.html` | the detail-page layout (`theme:` sets the accent colour) |
| `_includes/` | shared components (buttons, viewers) |
| `assets/` | CSS and images |
| `/brand`, `docs/style-checklist.md` | the media kit and the short style rules |
