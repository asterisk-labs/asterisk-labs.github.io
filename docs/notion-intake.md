# Notion intake (manual)

How a website mod turns a no-code form submission into a page by hand. This
works today and needs nothing external. The automated version
([`notion-sync`](../.github/workflows/notion-sync.yml.disabled)) will replace
steps 2–4 once the database exists — see the end of this doc.

## When to use

A no-code contributor filled in the Notion submission form and set its
**Status = "Ready for site"**. The database is specified in
[`notion-db-spec.md`](notion-db-spec.md).

## Steps

1. **Open the submission** in Notion. Note: **Section** (projects or magic),
   **Title**, **Summary**, **External URL** (if any), **Guardian**, **Images**,
   and the **Body** copy.

2. **Add the listing entry.** Copy a block in `_data/projects.yml` or
   `_data/magic.yml` (Section decides which) and fill it from the submission:

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
   `project-pages/<name>.md` (or `magic-pages/<name>.md`). Then:
   - Paste the contributor's body copy **verbatim**. Do not rewrite it.
   - Anything they did not provide stays a `<p class="needs-copy">WRITE: …</p>`
     brief — never fill it with generated prose.
   - Point the entry's `url:` at `<name>.html`.

5. **Test**, then open the PR — follow [`review-gate.md`](review-gate.md):
   `bundle exec jekyll serve --port 4000`, then `bundle exec jekyll build`
   (exit 0), commit to a branch, open a pull request.

6. **Close the loop.** Once the PR merges, set the Notion row's **Status** to
   **"On site"** so it is not picked up again.

## What the automation will change

Steps 2–4 are exactly what the `notion-sync` GitHub Action automates: pull rows
where Status = "Ready for site", convert the body to Markdown, download images,
and open the branch + PR for you. The human review stays — it is the PR. That
workflow is stubbed and disabled until the database (3b) exists; see
[`notion-db-spec.md`](notion-db-spec.md) and the stub at
`.github/workflows/notion-sync.yml.disabled`.
