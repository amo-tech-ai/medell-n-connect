#!/usr/bin/env node
/**
 * Push rich descriptions (purpose, goals, URLs, proof) to existing Linear issues.
 *
 *   LINEAR_API_KEY=... node scripts/linear-enrich-descriptions.mjs
 *   LINEAR_API_KEY=... node scripts/linear-enrich-descriptions.mjs --dry-run
 *   LINEAR_API_KEY=... node scripts/linear-enrich-descriptions.mjs --only WIRE-018,WIRE-026,SCREEN-020
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, basename } from "node:path";
import { buildLinearDescription } from "./lib/linear-issue-description.mjs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const ONLY = onlyArg
  ? new Set(onlyArg.replace("--only=", "").split(",").map((s) => s.trim()))
  : null;

const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

const SCAN_DIRS = [
  "tasks/screens",
  "tasks/core",
  "tasks/events/tasks",
  "tasks/events/wireframes",
  "tasks/venues",
  "tasks/venues/cafes",
  "tasks/venues/tasks/mvp/wireframes",
  "tasks/trips",
  "tasks/trips/wireframes",
  "tasks/trips/tasks",
  "tasks/maps",
  "tasks/maps/wireframes",
  "tasks/real-estate",
  "tasks/real-estate/wireframes",
  "tasks/real-estate/tasks",
];

const SKIP = new Set([
  "INDEX.md",
  "SCREEN-TESTING-STANDARD.md",
  "README.md",
  "notes.md",
]);

const API_KEY = process.env.LINEAR_API_KEY;
if (!API_KEY && !DRY_RUN) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

async function gql(query, variables = {}) {
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: API_KEY },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  let key = null;
  let list = null;
  for (const line of m[1].split("\n")) {
    if (list !== null) {
      if (/^\s+-\s+/.test(line)) {
        list.push(line.replace(/^\s+-\s+/, "").trim());
        continue;
      }
      fm[key] = list;
      list = null;
      key = null;
    }
    const kv = line.match(/^([a-zA-Z0-9_.]+):\s*(.*)$/);
    if (!kv) continue;
    key = kv[1];
    const val = kv[2].trim();
    if (val === "") {
      list = [];
      continue;
    }
    if (val === "[]") {
      fm[key] = [];
      key = null;
      continue;
    }
    fm[key] = val.replace(/^["']|["']$/g, "");
  }
  if (list !== null && key) fm[key] = list;
  return fm;
}

function kind(file) {
  if (/-wire-/.test(file) || /type:\s*wireframe/m.test(readFileSync(file, "utf8").slice(0, 400)))
    return "wire";
  if (/-scr-/.test(file)) return "scr";
  return "scr";
}

function taskId(fm, file, k) {
  if (fm.id) return fm.id;
  const stem = basename(file, ".md");
  if (k === "wire" && /^WIRE-/.test(stem)) return stem.split("-")[0] + "-" + stem.match(/\d+/)?.[0];
  return stem;
}

function statusField(fm, k) {
  if (fm.status) return fm.status;
  if (fm.build_status) return fm.build_status;
  return "Not Started";
}

function listSpecs() {
  const out = [];
  for (const dir of SCAN_DIRS) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    const walk = (d) => {
      for (const n of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, n.name);
        if (n.isDirectory()) {
          walk(p);
          continue;
        }
        if (!n.name.endsWith(".md") || SKIP.has(n.name)) continue;
        const isTaskMd =
          /-scr-|-wire-|CAFE-|SCREEN-/.test(n.name) ||
          /^WIRE-/.test(n.name) ||
          /^F\d/.test(n.name) ||
          /^MAP-|^EVT-|^TRIP-|^RE-|^AUTH-|^MASTRA-|^GS-|^VEC-|^DATA-/.test(n.name);
        if (!isTaskMd) continue;
        try {
          readFileSync(p, "utf8");
        } catch {
          continue;
        }
        out.push(p);
      }
    };
    walk(abs);
  }
  return [...new Set(out)].sort();
}

function parseIdFromTitle(title) {
  return title.replace(/^\[IMP-\d+\]\s*/, "").split(" — ")[0]?.trim() ?? title;
}

async function fetchIssues() {
  const issues = [];
  let cursor = null;
  for (;;) {
    const { data } = await gql(
      `query($id: String!, $after: String) {
        project(id: $id) {
          issues(first: 50, after: $after) {
            nodes { id identifier title description }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`,
      { id: PROJECT_ID, after: cursor },
    );
    const conn = data.project.issues;
    issues.push(...conn.nodes);
    if (!conn.pageInfo.hasNextPage) break;
    cursor = conn.pageInfo.endCursor;
  }
  return issues;
}

async function main() {
  const specs = listSpecs().map((file) => {
    const raw = readFileSync(file, "utf8");
    const fm = parseFrontmatter(raw);
    const k = kind(file);
    return {
      file,
      kind: k,
      fm,
      id: fm.id || basename(file, ".md"),
      title: fm.title || basename(file, ".md"),
      status: statusField(fm, k),
      relPath: relative(ROOT, file),
      body: raw.replace(/^---[\s\S]*?---\r?\n/, ""),
    };
  });

  const byId = new Map(specs.map((s) => [s.id, s]));

  if (DRY_RUN) {
    for (const id of ONLY || byId.keys()) {
      const t = byId.get(id);
      if (!t) {
        console.warn(`no spec for ${id}`);
        continue;
      }
      console.log(`\n=== ${id} ===\n`);
      console.log(buildLinearDescription(t, ROOT));
    }
    return;
  }

  const issues = await fetchIssues();
  let updated = 0;
  let skipped = 0;

  for (const issue of issues) {
    const taskId = parseIdFromTitle(issue.title);
    if (ONLY && !ONLY.has(taskId)) continue;

    const spec = byId.get(taskId);
    if (!spec) continue;

    const description = buildLinearDescription(spec, ROOT);
    const d = issue.description || "";
    const isBoilerplate =
      d.includes("Imported from tasks/") && !d.includes("## Purpose");
    const hasRich =
      d.includes("## Purpose") &&
      d.includes("## Where to view") &&
      d.includes("## Completion proof");
    if (hasRich && !isBoilerplate) {
      skipped++;
      continue;
    }

    await gql(
      `mutation($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) { success }
      }`,
      { id: issue.id, input: { description } },
    );
    updated++;
    console.log(`updated ${issue.identifier} (${taskId})`);
    await sleep(120);
  }

  console.log(`Done: ${updated} updated, ${skipped} already rich, ${issues.length} issues scanned`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
