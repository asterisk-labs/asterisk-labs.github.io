# Notion intake (manual)

How a website mod turns a no-code form submission into a page by hand — the
fallback when you don't want to run the automation. The
[`notion-sync`](../.github/workflows/notion-sync.yml) workflow now does steps 2–4
for you (one PR per submission); this manual path still works if you prefer it or
the Action is unavailable. See the end of this doc.

## When to use

A no-code contributor filled in the Notion submission form and set its
**Status = "Ready for site"**. The database is specified in
[`notion-db-spec.md`](notion-db-spec.md).

## Steps

1. **Open the submission** in Notion. Note: **Section** (projects or tools),
   **Title**, **Summary**, **External URL** (if any), **Guardian**, **Images**,
   and the **Body** copy.

2. **Add the listing entry.** Copy a block in `_data/projects.yml` or
   `_data/tools.yml` (Section decides which) and fill it from the submission:

   ```yaml
   - title: <Title>
     summary: <Summary>          # paste verbatim
     # status: ongoing           # projects.yml only
     # url: <External URL>        # if they gave one, you may be done here
     contact: { name: <Guardian>, email: hello@asterisk.coop }
   ```

   If they gave an **External URL** and no body copy, set `url:` to it and skip
   to step 5 — no detail page needed.

3. **Images.** Save any attached images into `assets/imgs/` and reference them
   from the page (and as the card `image:` if they sent a logo).

4. **Detail page.** Copy `project-pages/_template.md` to
   `project-pages/<name>.md` (or `tools-pages/<name>.md`). Then:
   - Paste the contributor's body copy **verbatim**. Do not rewrite it.
   - Anything they did not provide stays a `<p class="needs-copy">WRITE: …</p>`
     brief — never fill it with generated prose.
   - Point the entry's `url:` at `<name>.html`.

5. **Test**, then open the PR — follow [`review-gate.md`](review-gate.md):
   `bundle exec jekyll serve --port 4000`, then `bundle exec jekyll build`
   (exit 0), commit to a branch, open a pull request.

6. **Close the loop.** Once the PR merges, set the Notion row's **Status** to
   **"On site"** so it is not picked up again.

## The automation

Steps 2–4 above are what [`.github/workflows/notion-sync.yml`](../.github/workflows/notion-sync.yml)
(script: [`scripts/notion-sync.js`](../scripts/notion-sync.js)) does: pull rows
where Status = "Ready for site", append the data entry, download images, build a
detail page from the body, and open one branch + PR per submission. The human
review stays — it is the PR. On merge, set the row's Status to "On site" (the
Action does this automatically).

**Run it:** Actions tab → **notion-sync** → **Run workflow**. Leave
**dry_run = true** first — it logs every file it would write and PR it would open,
without touching anything. Set `dry_run = false` (or let the daily schedule run)
once the dry-run log looks right. Prerequisites: secret `NOTION_TOKEN`, variable
`NOTION_DB_ID`, and the database shared with the integration. Property names must
match [`notion-db-spec.md`](notion-db-spec.md).
