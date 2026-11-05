# Asterisk Labs website — notes for Claude

This repo is a Jekyll static site deployed by GitHub Pages to asterisk.coop.

## Golden rules

- **Never commit to `main`.** Work on a branch and open a pull request; a website
  mod reviews and merges. A per-PR Cloudflare Pages preview lets them see it live.
- **Never write page prose.** Use the contributor's copy as given. Where copy is
  missing, leave a `.needs-copy` brief saying what to write (e.g.
  `WRITE: a first paragraph describing X and Y`) — never generated text or filler.
- **Follow the media kit.** Read `docs/style-checklist.md`; use the three main
  brand colours only; insert buttons with `{% include button.html %}`; don't
  hand-roll styles.
- **Share components.** New reusable pieces (buttons, viewers, diagrams) go in
  `_includes/` so other sessions find and reuse them.
- **Offer visuals.** Proactively suggest on-brand graphics, diagrams or animations
  that would strengthen a page, and build them with the contributor.

## Where things live

- `_data/projects.yml`, `_data/tools.yml` — the listings (cards are generated from these)
- `project-pages/`, `tools-pages/` — detail pages, each with its own README
- `_layouts/project.html` — the detail-page layout (Markdown or HTML, `theme:` colour)
- `_includes/` — shared components · `assets/` — CSS and images
- `/brand` — the media kit · `docs/style-checklist.md` — the short style rules

## How to work

1. Read the relevant README (`project-pages/` or `tools-pages/`) and the style checklist.
2. Build and preview locally **before committing**:
   `bundle exec jekyll serve --port 4000` → open the page → `bundle exec jekyll build`
   (must exit 0).
3. Commit to a branch; open a PR.

To add or update a project or tool page, use the **add-page** skill
(`.claude/skills/add-page/`).
