# tools (open-source)

How the tools section works, and how to add or look after an item.

> New here? Start at the front door: [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
> — the four ways to contribute, the style rules, and the review process.
>
> Looking for the funded **projects** section? See
> [`../project-pages/README.md`](../project-pages/README.md).

## Overview

The listing at **/tools.html** is built from one data file, **`_data/tools.yml`**.
Each entry becomes a card. The tools section is open-source tools, datasets and
models — kept separate from funded projects, so there is no `status` field. A card can link to
a detail page in this folder, to an external repo, or — if no page exists yet —
to the shared **under construction** placeholder.

```
_data/tools.yml  ──►  /tools.html   (cards)
        │
        ├─ url: tools-pages/<name>.html      a detail page in this folder
        ├─ url: https://github.com/…         an external repo or link
        └─ (no url)                          under-construction.html?p=<item>
```

You never edit `tools.html` to add an item — only the data file.

## Add an item

1. Open **`_data/tools.yml`** and copy an existing block.
2. Edit its fields:

   | field     | required | notes |
   |-----------|----------|-------|
   | `title`   | yes      | shown on the card; also the slug |
   | `summary` | yes      | one or two lines on the card |
   | `image`   | no       | logo in `assets/imgs/`; omit to show the dashed "under construction" mark |
   | `url`     | no       | a detail page or external link; omit to use the placeholder |
   | `contact` | no       | `{ name, email }` — the guardian named on the placeholder |

3. Commit. The card appears automatically.

## The "under construction" placeholder

An item with no `url` links to the shared
`project-pages/under-construction.html?p=<slug>`. It names the item and, if you
set `contact`, the guardian responsible. The placeholder is shared with the
projects section — same page, same dashed mark — and shows a "← back to tools"
link for tools items.

```yaml
- title: TACO
  summary: Details coming soon.
  contact: { name: Jane Doe, email: hello@asterisk.coop }
```

## Build a real detail page

When an item earns its own page, put it in **this folder** (`tools-pages/`). Copy
a starter from `project-pages/` — both use the shared `project` layout:

- **Markdown:** `project-pages/_template.md` → `tools-pages/<name>.md`
- **HTML:** `project-pages/_template.html` → `tools-pages/<name>.html`

Set a `theme:` colour, write the content, and leave
`<p class="needs-copy">WRITE: …</p>` briefs for copy you don't have yet (a human
fills these before merge). Add buttons with `{% include button.html … %}`. Point
the item's `url` in `_data/tools.yml` at `tools-pages/<name>.html`.

For the `project.css` helpers and the **test before you push** steps, see
[`../project-pages/README.md`](../project-pages/README.md#build-a-real-detail-page).

## Retiring an item

Delete its block from `_data/tools.yml`. If it had a detail page worth keeping,
copy it into `archive/` (excluded from the published site) and remove the live
page.
