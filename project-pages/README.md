# Project pages

How the projects section works, and how to add or look after a project.

> New here? Start at the front door: [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
> — the four ways to contribute, the style rules, and the review process.
>
> Looking for the open-source **magic** section? See
> [`../magic-pages/README.md`](../magic-pages/README.md).

## Overview

The listing at **/projects.html** is built from one data file, **`_data/projects.yml`**.
Each entry becomes a card, grouped by status. A card can link to a full detail
page in this folder, to an external link, or — if no page exists yet — to a shared
**under construction** placeholder.

```
_data/projects.yml  ──►  /projects.html   (cards, grouped Ongoing → Upcoming → Complete)
        │
        ├─ url: project-pages/<name>.html     a full, custom detail page
        ├─ url: https://…                     an external link
        └─ (no url)                           under-construction.html?p=<project>
```

You never edit `projects.html` to add a project — only the data file.

## Add a project (the quick way)

1. Open **`_data/projects.yml`** and copy an existing block.
2. Edit its fields:

   | field     | required | notes |
   |-----------|----------|-------|
   | `title`   | yes      | shown on the card |
   | `status`  | yes      | `ongoing` \| `upcoming` \| `complete` — sets the section + badge |
   | `summary` | yes      | one or two lines on the card |
   | `image`   | no       | logo in `assets/imgs/`; omit to show the dashed "under construction" mark |
   | `url`     | no       | a detail page or external link; omit to use the placeholder |
   | `contact` | no       | `{ name, email }` — the guardian named on the placeholder |

3. (optional) Drop a logo in **`assets/imgs/`** — a wide "banner" logo (symbol +
   wordmark), transparent PNG or SVG, works best.
4. Commit. The card appears automatically, in the right section.

That is the whole job for a listing card.

## The "under construction" placeholder

A project with no `url` links to `project-pages/under-construction.html?p=<slug>`.
That page names the project and, if you set `contact`, the **guardian** responsible
for it:

```yaml
- title: RainCheck
  status: upcoming
  summary: Short description here.
  contact: { name: Jane Doe, email: hello@asterisk.coop }
```

Use it to put a project live before its real page exists, and to make someone
accountable for building it.

## Build a real detail page

When a project earns its own page, start from a template in this folder — both
use the shared `project` layout, so you only write the content:

- **Markdown:** copy **`_template.md`** to `project-pages/<name>.md` (prose, lists,
  links, images; drop in raw HTML when you need something custom).
- **HTML:** copy **`_template.html`** to `project-pages/<name>.html`.

```
---
layout: project
title: My Project
theme: "#3aa1a1"      # optional: heading accent colour
---
```

Then:
- Write the content however you like — **pages are free-form** (compare
  `project-clouds-decoded.html`'s interactive canvas with `earth-compress.html`'s
  plain text). Consistency is the colours and type, not the layout.
- For copy you don't have yet, leave a brief, not placeholder prose:
  `<p class="needs-copy">WRITE: one line on what this does.</p>` — it shows as a
  dashed box on the page, and a human fills it in before merge.
- Add buttons with `{% include button.html text="…" href="…" variant="primary" %}`.
- Point the project's `url` in `_data/projects.yml` at `project-pages/<name>.html`
  (Jekyll builds `<name>.md` into `<name>.html` too).

The `_template.*` files are not published (the leading `_`).

### Helpers in `project.css`
- `.project-desc` — the readable text column.
- `.project-p` — a paragraph with the standard spacing (HTML pages).
- `<h2>` inside `.project-desc` — gets a themed accent underline (uses `theme:`).
- `.gradual-reveal` + the small reveal `<script>` — fades elements in on load.

## Test before you push

Preview locally before you commit:

```
bundle exec jekyll serve --port 4000
```
Open `http://localhost:4000/projects.html` and your page. Check it renders — text
and images show, links work, no `.needs-copy` briefs left by accident. Then
confirm a clean build:

```
bundle exec jekyll build        # must exit 0, no errors
```

Commit to a **branch**, not `main`, and open a pull request — a website mod
reviews and merges (a Cloudflare Pages preview on the PR shows it live).

## "magic" (open-source tools)

Open-source tools, datasets and models are a separate section with its own data
file (`_data/magic.yml`), page (`/magic.html`) and guide. It works the same way
as projects, minus the `status` field. See
[`../magic-pages/README.md`](../magic-pages/README.md).

## Retiring a project

Delete its block from `_data/projects.yml`. If it had a detail page worth keeping
for reference, copy it into **`archive/`** (excluded from the published site) and
remove the live page — see `archive/` for examples.
