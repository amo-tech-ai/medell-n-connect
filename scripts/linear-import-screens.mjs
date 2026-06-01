#!/usr/bin/env node
/**
 * Import scr + wire specs from all domain folders into Linear MDEAPP.
 * Includes Done/shipped screens and wireframes — imported as In Review until user approves Done.
 *
 * Usage:
 *   LINEAR_API_KEY=... node scripts/linear-import-screens.mjs
 *   LINEAR_API_KEY=... node scripts/linear-import-screens.mjs --dry-run
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, basename } from "node:path";
import { buildLinearDescription } from "./lib/linear-issue-description.mjs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const SCAN_DIRS = [
  "tasks/screens",
  "tasks/events/wireframes",
  "tasks/venues",
  "tasks/venues/cafes",
  "tasks/trips",
  "tasks/maps/wireframes",
  "tasks/real-estate",
];

const SKIP_FILES = new Set([
  "INDEX.md",
  "00-index.md",
  "SCR-WIRE-PAIRING-CHECKLIST.md",
  "SCREEN-TESTING-STANDARD.md",
  "notes.md",
  "003-events-README.md",
  "005-008-places-README.md",
  "007-wire-nightlife-explorer.md",
  "README.md",
]);

function listSpecs() {
  const out = [];
  for (const dir of SCAN_DIRS) {
    const absDir = join(ROOT, dir);
    if (!existsSync(absDir)) continue;
    for (const n of readdirSync(absDir)) {
      if (
        !n.endsWith(".md") ||
        SKIP_FILES.has(n) ||
        (!/-scr-/.test(n) && !/-wire-/.test(n) && !n.startsWith("CAFE-"))
      ) {
        continue;
      }
      const p = join(absDir, n);
      try {
        readFileSync(p, "utf8");
      } catch {
        continue;
      }
      out.push(p);
    }
  }
  return out.sort();
}

const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

const STATE_IDS = {
  Todo: "1c623f30-d632-4571-bfd8-67e121a6376f",
  "In Progress": "e9b4149e-0c6f-4201-98a1-6ccc8297d2cd",
  "In Review": "19528451-7c5f-4c8e-9831-c59387239233",
  Done: "0627f54f-ca57-4969-b6df-8ff21c236f7d",
  Backlog: "a629f971-4b1d-46b6-8807-23a0c173a601",
};

const MILESTONE_IDS = {
  "P0 — MVP gates": "2d7e9933-4834-4c14-a74e-c6c16d8e17af",
  "P1 — Screens & café": "80fe78ad-59de-48f5-9815-7c208c0f0176",
  "Deferred — Contest": "49eb9a6d-f4b2-4da9-b157-eef36ee9c63c",
};

const LABELS = [
  { name: "track:screens", color: "#4EA7FC" },
  { name: "doc:wireframe", color: "#95E1D3" },
  { name: "doc:screen-spec", color: "#F38181" },
  { name: "phase-1", color: "#0f783c" },
  { name: "phase-2", color: "#f2c94c" },
];

const API_KEY = process.env.LINEAR_API_KEY;
if (!API_KEY && !DRY_RUN) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

async function gql(query, variables = {}) {
  if (DRY_RUN && !query.includes("workflowStates") && !query.includes("labels")) {
    return { data: {} };
  }
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
    if (!val.startsWith("[")) key = null;
  }
  if (list !== null && key) fm[key] = list;
  return fm;
}

function kind(file) {
  const base = basename(file);
  if (/-wire-/.test(base)) return "wire";
  if (/-scr-/.test(base)) return "scr";
  return "subtask";
}

function statusField(fm, k) {
  if (k === "wire") return fm.build_status || "Not Started";
  return fm.status || "Not Started";
}

function linearState(status) {
  const s = String(status || "").toLowerCase();
  // User approval required for Done — disk Done → In Review (tasks/linear/04-completion-approval.md)
  if (s === "done") return STATE_IDS["In Review"];
  if (s.includes("in progress") || s === "partial" || s === "mixed" || s.includes("phase a.5")) {
    return STATE_IDS["In Progress"];
  }
  if (s === "deferred" || s === "frozen" || s === "reference") return STATE_IDS.Backlog;
  return STATE_IDS.Todo;
}

function priorityNum(p) {
  const map = { P0: 1, P1: 2, P2: 3, P3: 4 };
  return map[String(p || "P2").toUpperCase()] ?? 3;
}

function milestoneFor(task, k) {
  const st = String(statusField(task.fm, k)).toLowerCase();
  if (task.id === "SCREEN-021" || task.id === "CAFE-001") return "P0 — MVP gates";
  if (["deferred", "frozen"].includes(st) || task.fm.phase?.includes("Phase 2")) {
    return "P1 — Screens & café";
  }
  return "P1 — Screens & café";
}

function taskId(fm, file, k) {
  if (fm.id) return fm.id;
  const stem = basename(file, ".md");
  if (k === "wire") return `WIRE-FILE-${stem}`;
  return stem;
}

function titleFor(task) {
  return `${task.id} — ${task.title}`;
}

function parseIdFromTitle(title) {
  return title.replace(/^\[IMP-\d+\]\s*/, "").split(" — ")[0]?.trim() ?? title;
}

function buildDescription(task, body) {
  return buildLinearDescription({ ...task, fm: task.fm, body }, ROOT);
}

async function ensureLabels(existing) {
  const ids = {};
  for (const { name, color } of LABELS) {
    if (existing.has(name)) {
      ids[name] = existing.get(name);
      continue;
    }
    if (DRY_RUN) {
      ids[name] = `dry-${name}`;
      continue;
    }
    const { data } = await gql(
      `mutation($input: IssueLabelCreateInput!) {
        issueLabelCreate(input: $input) { success issueLabel { id name } }
      }`,
      { input: { name, color, teamId: TEAM_ID } },
    );
    ids[name] = data.issueLabelCreate.issueLabel.id;
    existing.set(name, ids[name]);
    await sleep(100);
  }
  return ids;
}

async function fetchExistingIssues() {
  const issues = [];
  let cursor = null;
  for (;;) {
    const { data } = await gql(
      `query($id: String!, $after: String) {
        project(id: $id) {
          issues(first: 50, after: $after) {
            nodes { id identifier title state { name } }
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
      id: taskId(fm, file, k),
      title: fm.title || basename(file, ".md"),
      status: statusField(fm, k),
      relPath: relative(ROOT, file),
      priority: fm.priority || (k === "wire" ? "P2" : "P1"),
      body: raw.replace(/^---[\s\S]*?---\r?\n/, ""),
    };
  });

  const scrCount = specs.filter((s) => s.kind === "scr").length;
  const wireCount = specs.filter((s) => s.kind === "wire").length;
  console.log(`Importing ${specs.length} specs (${scrCount} scr, ${wireCount} wire, ${specs.length - scrCount - wireCount} other)`);

  let labelIds = {};
  const existingById = new Map();

  if (!DRY_RUN) {
    const { data } = await gql(
      `query($teamId: String!) { team(id: $teamId) { labels { nodes { id name } } } }`,
      { teamId: TEAM_ID },
    );
    const labelMap = new Map(data.team.labels.nodes.map((l) => [l.name, l.id]));
    labelIds = await ensureLabels(labelMap);

    for (const issue of await fetchExistingIssues()) {
      existingById.set(parseIdFromTitle(issue.title), issue);
    }
  }

  const log = { created: [], skipped: [], updated: [], errors: [] };

  for (const task of specs) {
    if (existingById.has(task.id)) {
      const ex = existingById.get(task.id);
      log.skipped.push({ id: task.id, identifier: ex.identifier, reason: "exists" });
      console.log(`skip ${task.id} → ${ex.identifier}`);
      continue;
    }

    const labels = [labelIds["track:screens"]];
    labels.push(task.kind === "wire" ? labelIds["doc:wireframe"] : labelIds["doc:screen-spec"]);
    labels.push(labelIds["phase-1"]);

    const msName = milestoneFor(task, task.kind);
    const msId = MILESTONE_IDS[msName];

    const input = {
      teamId: TEAM_ID,
      projectId: PROJECT_ID,
      title: titleFor(task),
      description: buildDescription(task, task.body),
      priority: priorityNum(task.priority),
      stateId: linearState(task.status),
      labelIds: labels.filter(Boolean),
      ...(msId ? { projectMilestoneId: msId } : {}),
    };

    if (DRY_RUN) {
      console.log(`[dry-run] create ${input.title} (${task.status} → state)`);
      log.created.push({ id: task.id, dryRun: true });
      continue;
    }

    try {
      const { data } = await gql(
        `mutation($input: IssueCreateInput!) {
          issueCreate(input: $input) { success issue { id identifier title url } }
        }`,
        { input },
      );
      const issue = data.issueCreate.issue;
      existingById.set(task.id, issue);
      log.created.push({ id: task.id, identifier: issue.identifier, url: issue.url, kind: task.kind });
      console.log(`created ${task.id} → ${issue.identifier}`);
      await sleep(150);
    } catch (err) {
      log.errors.push({ id: task.id, error: err.message });
      console.error(`error ${task.id}: ${err.message}`);
    }
  }

  const outPath = join(ROOT, "tasks/linear/screens-import-log.json");
  writeFileSync(outPath, JSON.stringify({ ...log, importedAt: new Date().toISOString() }, null, 2));

  // Merge into main import-log.json
  const mainLogPath = join(ROOT, "tasks/linear/import-log.json");
  let prior = { created: [], skipped: [], errors: [], relations: [] };
  try {
    prior = JSON.parse(readFileSync(mainLogPath, "utf8"));
  } catch {
    /* ok */
  }
  const merge = (arr, add) => [
    ...arr.filter((r) => !add.some((n) => n.id === r.id)),
    ...add,
  ];
  writeFileSync(
    mainLogPath,
    JSON.stringify(
      {
        ...prior,
        created: merge(prior.created ?? [], log.created.filter((r) => !r.dryRun)),
        skipped: merge(prior.skipped ?? [], log.skipped),
        errors: [...(prior.errors ?? []), ...log.errors],
      },
      null,
      2,
    ),
  );

  console.log(`\nDone. created=${log.created.length} skipped=${log.skipped.length} errors=${log.errors.length}`);
  console.log(`Log: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
