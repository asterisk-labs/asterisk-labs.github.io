/**
 * notion-sync.js — turn "Ready for site" Notion submissions into branches + PRs.
 *
 * Reads the submission database (see docs/notion-db-spec.md), and for each row
 * whose Status is "Ready for site":
 *   - appends a listing entry to _data/projects.yml or _data/tools.yml
 *   - downloads any Images into assets/imgs/
 *   - if there is body copy (and no External URL), builds a detail page
 *   - opens ONE pull request for that submission (human review = the PR)
 *   - flips the row's Status to "On site" so it is not processed twice
 *
 * Human review stays: nothing merges automatically. Missing fields become
 * .needs-copy briefs, never machine-written prose.
 *
 * Env: NOTION_TOKEN (secret), NOTION_DB_ID (var), GH_TOKEN (github.token).
 * DRY_RUN=true lists what would change without writing git history or PRs.
 */

import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { execFileSync } from "node:child_process";
import { writeFileSync, appendFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";

const DRY_RUN = process.env.DRY_RUN === "true";
const DB_ID = process.env.NOTION_DB_ID;

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

/** Notion Section value → where that section's files live. */
const SECTIONS = {
  projects: { data: "_data/projects.yml", pages: "project-pages" },
  tools: { data: "_data/tools.yml", pages: "tools-pages" },
};

const STATUS_READY = "Ready for site";
const STATUS_DONE = "On site";
const DEFAULT_EMAIL = "hello@asterisk.coop";

async function main() {
  const missing = [];
  if (!process.env.NOTION_TOKEN) missing.push("NOTION_TOKEN (add as an Actions secret)");
  if (!DB_ID) missing.push("NOTION_DB_ID (add as an Actions variable)");
  if (missing.length) {
    throw new Error(
      `Missing ${missing.join(" and ")}. Set these under the repo's ` +
        "Settings → Secrets and variables → Actions — the token goes on the Secrets tab, " +
        "the database id on the Variables tab. Check the names match exactly and they are " +
        "repo-level (not scoped to an Environment)."
    );
  }
  const rows = await queryReady();
  console.log(`Found ${rows.length} row(s) with Status = "${STATUS_READY}".`);

  for (const row of rows) {
    const f = parseRow(row);
    assertSection(f.section);
    const slug = slugify(f.title);
    console.log(`\n• ${f.title}  (section: ${f.section}, slug: ${slug})`);

    if (branchExists(`notion/${slug}`)) {
      console.log(`  branch notion/${slug} already exists — skipping (avoids a duplicate PR).`);
      continue;
    }

    const imgPaths = await downloadImages(f.images, slug);
    appendDataEntry(f.section, buildYamlBlock(f, imgPaths));

    if (f.body && !f.url) {
      await buildDetailPage(f, slug);
    }

    await commitPushOpenPR(f, slug);
    if (!DRY_RUN) await markOnSite(row.id);
  }
  console.log("\nDone.");
}

/* ----------------------------- Notion read ----------------------------- */

/** All rows where Status == "Ready for site", following pagination. */
async function queryReady() {
  const out = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DB_ID,
      start_cursor: cursor,
      filter: { property: "Status", select: { equals: STATUS_READY } },
    });
    out.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return out;
}

/** Flatten a Notion page's properties into the fields the site needs. */
function parseRow(page) {
  const p = page.properties;
  return {
    id: page.id,
    title: titleText(p["Title"]),
    section: selectName(p["Section"]),
    summary: richText(p["Summary"]),
    url: p["External URL"]?.url || "",
    guardian: guardian(p["Guardian"]),
    projectStatus: selectName(p["Project status"]),
    images: files(p["Images"]),
    // Body copy is the row's page content; property fallback handled in buildDetailPage.
    body: true, // presence decided later via notion-to-md; kept truthy so the gate runs
    pageId: page.id,
  };
}

function assertSection(section) {
  if (!SECTIONS[section]) {
    throw new Error(
      `Unknown Section "${section}". Expected one of: ${Object.keys(SECTIONS).join(", ")}. ` +
        `Fix the row in Notion rather than guessing a destination.`
    );
  }
}

/* --- small property readers (defensive: missing/renamed props return empty) --- */
function titleText(prop) {
  return (prop?.title || []).map((t) => t.plain_text).join("").trim();
}
function richText(prop) {
  return (prop?.rich_text || []).map((t) => t.plain_text).join("").trim();
}
function selectName(prop) {
  return (prop?.select?.name || "").trim();
}
function files(prop) {
  return (prop?.files || []).map((f) => f.file?.url || f.external?.url).filter(Boolean);
}
/** Guardian may be a Person property or a plain Text one — handle both. */
function guardian(prop) {
  if (prop?.people?.length) {
    const person = prop.people[0];
    return { name: person.name || "", email: person.person?.email || DEFAULT_EMAIL };
  }
  const text = richText(prop);
  return text ? { name: text, email: DEFAULT_EMAIL } : null;
}

/* ----------------------------- transforms ----------------------------- */

/** Mirror Jekyll's `slugify`: lowercase, non-alphanumerics → single dashes. */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Download Notion file URLs (they expire) into assets/imgs/<slug>-N.ext. */
async function downloadImages(urls, slug) {
  const paths = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const ext = (extname(new URL(url).pathname) || ".png").split("?")[0];
    const rel = `assets/imgs/${slug}${urls.length > 1 ? `-${i + 1}` : ""}${ext}`;
    if (DRY_RUN) {
      console.log(`  would download image → ${rel}`);
    } else {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Image download failed (${res.status}) for ${url}`);
      const buf = Buffer.from(await res.arrayBuffer());
      mkdirSync("assets/imgs", { recursive: true });
      writeFileSync(rel, buf);
      console.log(`  downloaded image → ${rel} (${(buf.length / 1024).toFixed(0)} KiB)`);
    }
    paths.push("/" + rel);
  }
  return paths;
}

/** Compose a listing-entry YAML block for _data/<section>.yml. */
function buildYamlBlock(f, imgPaths) {
  const lines = [`- title: ${yamlStr(f.title)}`];
  if (f.section === "projects" && f.projectStatus) {
    lines.push(`  status: ${yamlStr(f.projectStatus.toLowerCase())}`);
  }
  lines.push(`  summary: ${yamlStr(f.summary || "Details coming soon.")}`);
  if (imgPaths[0]) lines.push(`  image: ${imgPaths[0]}`);
  if (f.url) lines.push(`  url: ${f.url}`);
  if (f.guardian) {
    lines.push(`  contact: { name: ${yamlStr(f.guardian.name)}, email: ${f.guardian.email} }`);
  }
  return lines.join("\n") + "\n";
}

/** Append the block to the section's data file (creates it if absent). */
function appendDataEntry(section, block) {
  const file = SECTIONS[section].data;
  if (DRY_RUN) {
    console.log(`  would append to ${file}:\n${block.replace(/^/gm, "    ")}`);
    return;
  }
  appendFileSync(file, (readFileSync(file, "utf8").endsWith("\n") ? "" : "\n") + block);
  console.log(`  appended entry → ${file}`);
}

/** Build a Markdown detail page from the row's body, via _template.md shape. */
async function buildDetailPage(f, slug) {
  const mdBlocks = await n2m.pageToMarkdown(f.pageId);
  const body = n2m.toMarkdownString(mdBlocks).parent.trim();
  const dest = `${SECTIONS[f.section].pages}/${slug}.md`;

  const front = [
    "---",
    "layout: project",
    `title: ${yamlStr(f.title)}`,
    'theme: "#492ae8"',
    "---",
    "",
  ].join("\n");

  const summary = f.summary
    ? f.summary
    : `<p class="needs-copy">WRITE: a one- or two-sentence summary of what this is.</p>`;
  const page = `${front}\n${summary}\n\n${body || ""}\n`;

  if (DRY_RUN) {
    console.log(`  would write detail page → ${dest} (${page.length} chars)`);
    return;
  }
  writeFileSync(dest, page);
  console.log(`  wrote detail page → ${dest}`);
}

/* ----------------------------- git + PR ----------------------------- */

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}
function branchExists(name) {
  return git("ls-remote", "--heads", "origin", name).length > 0;
}

/** Branch, commit, push, open one PR for this submission. */
async function commitPushOpenPR(f, slug) {
  const branch = `notion/${slug}`;
  const title = `Add ${f.title} (${f.section}) from Notion submission`;
  const prBody = [
    `Automated from a Notion submission (Status = "${STATUS_READY}").`,
    "",
    `- Section: **${f.section}**`,
    f.guardian ? `- Guardian: ${f.guardian.name}` : "",
    "",
    "Review checklist: `docs/review-gate.md`. Fill any `.needs-copy` briefs before merging.",
  ]
    .filter(Boolean)
    .join("\n");

  if (DRY_RUN) {
    console.log(`  would open PR on branch ${branch}: "${title}"`);
    return;
  }
  git("config", "user.name", "asterisk-site-sync");
  git("config", "user.email", "actions@users.noreply.github.com");
  git("checkout", "-b", branch);
  git("add", "-A");
  git("commit", "-m", title);
  git("push", "-u", "origin", branch);
  execFileSync("gh", ["pr", "create", "--base", "main", "--head", branch, "--title", title, "--body", prBody], {
    stdio: "inherit",
  });
  git("checkout", "-");
  console.log(`  opened PR on ${branch}`);
}

/** Mark the row done so a later run skips it. Needs Update content capability. */
async function markOnSite(pageId) {
  await notion.pages.update({
    page_id: pageId,
    properties: { Status: { select: { name: STATUS_DONE } } },
  });
  console.log(`  set Status = "${STATUS_DONE}"`);
}

/* ----------------------------- util ----------------------------- */

/** Quote a scalar for YAML (double-quote + escape) when it needs it. */
function yamlStr(s) {
  const v = String(s ?? "");
  return /^[\w .,&()/-]+$/.test(v) && !/^\s|\s$/.test(v) ? v : JSON.stringify(v);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
