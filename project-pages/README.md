# Project pages

How the projects section works, and how to add or look after a project.

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

When a project earns its own page:

1. Create **`project-pages/<name>.html`** starting with front matter:
   ```
   ---
   layout: default
   title: My Project
   ---
   ```
2. (optional) Link the shared styles for the standard look:
   `<link href="project.css" rel="stylesheet">`
3. Set a **theme colour** on the top container — it drives the heading accent bars:
   `<div class="… container-fluid" style="--theme:#3aa1a1"> … </div>`
4. Write the content however you like. **Project pages are free-form** — compare
   `project-clouds-decoded.html` (interactive canvas) with `earth-compress.html`
   (text). Nothing forces them to look the same.
5. Point the project's `url` in `_data/projects.yml` at your new page.

### Helpers in `project.css`
- `.project-desc` — the readable text column.
- `.project-p` — a paragraph.
- `<h2>` inside `.project-desc` — gets a themed accent underline (uses `--theme`).
- `.gradual-reveal` + the small reveal `<script>` — fades elements in on load.

## Retiring a project

Delete its block from `_data/projects.yml`. If it had a detail page worth keeping
for reference, copy it into **`archive/`** (excluded from the published site) and
remove the live page — see `archive/` for examples.
