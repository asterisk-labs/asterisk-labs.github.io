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
- **Logo: check the destination and its links first.** If the entry has a `url`
  (or the copy links to the project's own site, repo or partners), open those and
  look for a real logo/mark to use as the card `image:` — always prefer it over a
  placeholder. Save it to `assets/imgs/`. Only if there is genuinely no logo, fall
  back to a cute, on-topic **emoji** (`emoji:` on the `_data/*.yml` entry, e.g. 🤳
  for a cloud-photo project) and let the contributor choose. Never leave a broken
  `image:` pointing at a file that doesn't exist.
- **Paste a link → scaffold placeholders, don't write prose.** The contributor
  may paste a GitHub repo or the project's own page. Fetch it to shape the page
  STRUCTURE only — sensible section headings, the real repo/site as
  `button.html` links, the logo as the `image:` — and turn what you learn into
  *specific* `.needs-copy` briefs (e.g. `WRITE: one line on what <the actual
  feature> does`). Never synthesise body copy: every sentence a reader would read
  stays a brief for a human author. The golden rule holds — no generated prose.

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
- Temporary emoji logo: `emoji:` on the `_data/*.yml` entry (card fallback is
  image → emoji → construction mark), and `{% include emoji-logo.html emoji="…" %}`
  at the top of the detail page.
- Any new reusable component → `_includes/`.

## 5. Offer visuals
- **Mine the copy's links for ready-made visuals.** When the text links to
  partners, apps, funders or datasets, open those pages and suggest specific
  assets worth integrating (a partner logo, an official badge, a screenshot, a
  hero image), on-brand and WITH the contributor. Confirm usage rights before
  embedding a third party's image; save any approved asset to `assets/imgs/`.

**Always propose at least one on-brand visual** — a method/mechanism diagram, an
animated hero, an explanatory or interactive figure — and build it WITH the
contributor. This is required, not optional: a page of copy with no visual
proposed is not finished. On-brand: the three main colours, SVG where possible,
respect `prefers-reduced-motion`.

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
`.needs-copy` gaps, **at least one visual was proposed** (built with the
contributor, or explicitly declined by them), and it is on a branch as a PR.
