# Review gate

Every change to `main` goes through a pull request that a website mod approves —
no direct pushes. This doc is the reviewer's checklist, plus the one-time setup
that enforces the gate and gives each PR a live preview.

New contributors start at [`../CONTRIBUTING.md`](../CONTRIBUTING.md); this doc is
for the mod doing the review and the admin doing the setup.

## 1. Reviewer's checklist

What a website mod checks on each PR before approving:

- **Open the Cloudflare preview link** (see §3), not just the diff — look at the
  real rendered page.
- **It renders:** text and images show, links work, and the Asterisk nav and
  way-back link are intact.
- **No briefs left in:** no `<p class="needs-copy">WRITE: …</p>` dashed boxes
  remain. Quick check: search the diff for `needs-copy`.
- **On brand:** the three brand colours only, League Spartan type, buttons via
  `{% include button.html %}` — no hand-rolled styles. The specifics live in
  [`style-checklist.md`](style-checklist.md); that is the source of truth.
- **No machine-written prose has gone live** — copy is human-written, or still a
  `needs-copy` brief (which means not ready to merge).
- **Build is green:** the author ran `bundle exec jekyll build` (exit 0), or CI
  did.

Then **Approve and merge**. On merge, GitHub Pages redeploys asterisk.coop
automatically.

## 2. Turn on branch protection for `main`

One-time, by a repo admin. This is what makes the gate mandatory — I cannot
perform it (no admin rights, and the house rule is never to touch `main`).

On GitHub: **Settings → Branches** (or **Rules → Rulesets**) → add a rule
targeting `main`:

- **Require a pull request before merging.**
- **Require approvals:** 1.
- (optional) **Require status checks to pass before merging** — enable once CI
  runs a `jekyll build`.
- **Do not allow bypassing the above settings** / block direct pushes to `main`.

Save. From then on, every change lands through a reviewed PR.

## 3. Connect Cloudflare Pages for per-PR previews

One-time, by an admin with the Cloudflare account. Gives every PR a live URL so
the reviewer sees the change, not just the diff. Free tier is enough.

On the Cloudflare dashboard: **Workers & Pages → Create application**. The
default create screen is the Workers flow (it shows `npx wrangler deploy`) —
that is **not** what a static Jekyll site needs. Instead click the
**"Need to use the legacy Pages workflow? Continue to Pages"** link at the bottom
→ **Connect to Git** → pick this repo. ("Legacy" is just Cloudflare's label for
the classic Pages flow; it is the right tool for a static site.)

Settings:

- **Production branch:** `main`.
- **Framework preset:** Jekyll.
- **Build command:** `bundle exec jekyll build`.
- **Build output directory:** `_site`.
- **Preview deployments:** **All non-production branches** (Settings → Builds &
  deployments). This is what gives each PR its own `*.pages.dev` preview — the
  URL the reviewer opens.

**Keep GitHub Pages as production.** asterisk.coop stays served by GitHub Pages;
Cloudflare Pages is preview-only. Do **not** point the custom domain at
Cloudflare — leave its deployments on the generated `*.pages.dev` URLs so the two
don't fight over the live domain. (Cloudflare's own "production" build of `main`
is just a copy on `*.pages.dev`; if it is red, that does not affect asterisk.coop.)

### File size limit (gotcha)

Cloudflare Pages rejects **any single file over 25 MiB** — the build succeeds but
the deploy fails at "Validating asset output directory". GitHub Pages allows up
to 100 MB, so a file can be fine on the live site yet break every Cloudflare
preview. Keep assets — especially GIFs and video — under 25 MiB. To find offenders:

```
find . -path ./.git -prune -o -type f -size +24M -print
```

A large GIF is usually the culprit; downscale it with ffmpeg (e.g. `scale=720`)
or convert it to an MP4/WebM `<video>`.
