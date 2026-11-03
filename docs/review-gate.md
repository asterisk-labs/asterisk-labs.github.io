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

On the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to
Git** → pick this repo:

- **Framework preset:** Jekyll.
- **Build command:** `bundle exec jekyll build`.
- **Build output directory:** `_site`.
- **Preview deployments:** on — this is the per-PR URL Cloudflare comments on
  each pull request.

**Keep GitHub Pages as production.** asterisk.coop stays served by GitHub Pages;
Cloudflare Pages is preview-only. Do **not** point the custom domain at
Cloudflare — leave its deployments on the generated `*.pages.dev` preview URLs so
the two don't fight over the live domain.
