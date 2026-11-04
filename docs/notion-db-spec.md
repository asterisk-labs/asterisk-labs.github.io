# Notion submission database — spec

The property list to hand Notion AI when building the submission database. Each
property maps to a field in a `_data` entry or the detail page, so rows convert
cleanly to a page. Keep the property **names** exactly as below — the
`notion-sync` Action (see [`notion-intake.md`](notion-intake.md)) references them
by name, and renaming one breaks the sync.

## Properties

| Property | Type | Required | Maps to |
|----------|------|----------|---------|
| `Title` | Title | yes | the entry `title` (also the page slug) |
| `Section` | Select | yes | which listing: `projects` or `tools` |
| `Status` | Select | yes | intake state: `Draft` · `Ready for site` · `On site` |
| `Summary` | Text | yes | the card `summary` (one or two lines) |
| `External URL` | URL | no | the entry `url` — an external link; if set, no detail page is made |
| `Guardian` | Person or Text | no | the `contact` named on the card/placeholder |
| `Project status` | Select | no | projects only: `ongoing` · `upcoming` · `complete` (the `status` field) |
| `Images` | Files & media | no | downloaded into `assets/imgs/` |
| `Body` | Text (or page content) | no | the detail-page copy; left as `needs-copy` briefs if empty |

## Notes

- **Status drives intake.** The Action (and a mod doing it by hand) only picks up
  rows set to **`Ready for site`**. `Draft` is ignored; `On site` is set after
  merge so a row is not processed twice.
- **Section's values matter.** Use exactly `projects` or `tools` — the code keys
  off them to choose the data file and folder.
- **External URL vs Body.** If `External URL` is set, the entry just links out and
  no detail page is built. Otherwise `Body` becomes the page; anything missing
  stays a `needs-copy` brief for a human.
- **Project status** applies only to the projects section (tools has no status).
- **Stable names.** Add properties if you like, but do not rename the ones above
  without updating the Action.
