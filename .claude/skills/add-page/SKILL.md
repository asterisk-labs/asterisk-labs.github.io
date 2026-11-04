---
name: add-page
description: Add or update a project or open-source ("tools") page on the Asterisk Labs website — a listing entry and/or a detail page. Use when a contributor wants their project or tool on the site.
---

# Add or update a page

Follow the repo's golden rules (`CLAUDE.md`) and `docs/style-checklist.md`.
You lay pages out; you do not write their prose.

## 1. Read first
- The right guide: `project-pages/README.md` (funded projects) or
  `tools-pages/README.md` (open-source tools).
- `docs/style-checklist.md`. Skim `/brand` if unsure on style.

## 2. Get the content
Ask the contributor for their material, form-shaped:
title · ~100-word summary · ~500-word body · image(s) · contact.
- Use their text close to verbatim — only add connective / structural markup.
- **Where copy is missing, insert a brief, not prose:**
  `<p class="needs-copy">WRITE: one line on what X does and who it's for.</p>`
  Never write the paragraph yourself.

## 3. Pick the pathway
- **Listing only** — just a `_data/*.yml` entry (card → under-construction placeholder).
- **Markdown page** — copy `project-pages/_template.md`.
- **Custom HTML page** — copy `project-pages/_template.html`.

## 4. Build
- Add or update the entry in `_data/projects.yml` or `_data/tools.yml`
  (fields per the README).
- Detail page → the right folder (`project-pages/` or `tools-pages/`),
  `layout: project` with an optional `theme:` hex colour.
- Drop the supplied text and images in; put `.needs-copy` briefs in the gaps.
- Buttons via `{% include button.html text="…" href="…" variant="primary" %}`.
- Any new reusable component → `_includes/`.

## 5. Offer visuals
Proactively suggest graphics, diagrams or animations that would help the page
(a method diagram, an animated hero, an explanatory figure) and build them WITH
the contributor. On-brand: the three main colours, SVG where possible, respect
`prefers-reduced-motion`.

## 6a. Test — before committing
    bundle exec jekyll serve --port 4000
Open `http://localhost:4000/<page>` and check it renders: text and images show,
links work, nav / way-back present, every `.needs-copy` brief is intended. Then:
    bundle exec jekyll build        # must exit 0, no Liquid errors
(You can run serve in the background and curl the page for HTTP 200 + expected text.)

## 6b. Ship
Commit to a **branch** (never `main`); open a pull request for a website mod to
review. A Cloudflare Pages preview on the PR lets them see it live.

## Done when
The card shows on the listing, the page renders, there are no accidental
`.needs-copy` gaps, and it is on a branch as a PR.
