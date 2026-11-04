# Asterisk Labs website

The Jekyll site for [asterisk.coop](https://asterisk.coop), deployed by GitHub Pages.

## Run locally

```bash
bundle install
bundle exec jekyll serve --port 4000   # http://localhost:4000
bundle exec jekyll build               # must exit 0
```

## Contributing

Start at **[CONTRIBUTING.md](CONTRIBUTING.md)** — the four ways to add or edit a
page (Markdown, custom HTML, the add-page skill, or the members-only Notion form),
the style rules, and the review process.

Never commit to `main`. Work on a branch and open a pull request; a website mod
reviews (with a Cloudflare Pages preview) and merges.

## Structure — what lives where

| Path | What |
|------|------|
| root `*.html`, `index.md` | the site's pages (`/about`, `/projects`, `/tools`, `/team`, …) |
| `_data/projects.yml`, `_data/tools.yml` | the listings — cards are generated from these |
| `project-pages/`, `tools-pages/` | detail pages, each folder with its own `README.md` guide |
| `_layouts/`, `_includes/` | page templates and shared components (e.g. `button.html`) |
| `assets/` | CSS, images, fonts |
| `brand/`, `docs/style-checklist.md` | the media kit and the short style rules |
| `docs/` | contributor and ops runbooks (`review-gate`, `notion-intake`, `notion-db-spec`) |
| `scripts/`, `.github/workflows/` | the `notion-sync` automation (submissions → PRs) |
| `CLAUDE.md`, `.claude/` | house rules for Claude Code and the `add-page` skill |
| `_config.yml`, `Gemfile`, `CNAME` | Jekyll config, Ruby deps, and the custom domain |

## Deploy and review

```
branch → pull request → website mod reviews (Cloudflare preview) → merge → GitHub Pages redeploys
```

Members can also submit a page with no code via the Notion form (see
[CONTRIBUTING.md](CONTRIBUTING.md)); the `notion-sync` workflow turns each
submission into a PR automatically, twice a day.
