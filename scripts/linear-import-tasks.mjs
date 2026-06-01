#!/usr/bin/env node
/**
 * Import open mdeai task specs into Linear (MDEAPP project).
 *
 * Usage:
 *   LINEAR_API_KEY=lin_api_... node scripts/linear-import-tasks.mjs
 *   LINEAR_API_KEY=lin_api_... node scripts/linear-import-tasks.mjs --dry-run
 *
 * Output: tasks/linear/import-log.json
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");

const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

const TASK_DIRS = [
  "tasks/core",
  "tasks/maps",
  "tasks/screens",
  "tasks/events/tasks",
  "tasks/data/tasks",
  "tasks/data/tasks-data",
  "tasks/trips/tasks",
  "tasks/real-estate/tasks",
  "tasks/vector",
  "tasks/agent/tasks",
  "tasks/mastra",
  "tasks/contest/tasks",
  "tasks/openclaw/tasks",
  "tasks/grounding-search/tasks",
];

const OPEN_STATUSES = new Set([
  "not started",
  "in progress",
  "partial",
  "open",
  "draft",
]);

const STATE_IDS = {
  Todo: "1c623f30-d632-4571-bfd8-67e121a6376f",
  "In Progress": "e9b4149e-0c6f-4201-98a1-6ccc8297d2cd",
  Backlog: "a629f971-4b1d-46b6-8807-23a0c173a601",
};

const TRACK_LABELS = [
  { name: "track:screens", color: "#4EA7FC" },
  { name: "track:maps", color: "#26b5ce" },
  { name: "track:core", color: "#BB87FC" },
  { name: "track:events", color: "#F2994A" },
  { name: "track:vector", color: "#95a2b3" },
  { name: "track:agent", color: "#5e6ad2" },
  { name: "track:mastra", color: "#bec2c8" },
  { name: "track:contest", color: "#f7c8c8" },
  { name: "track:openclaw", color: "#7a7a7a" },
  { name: "track:grounding", color: "#56ccf2" },
  { name: "phase-1", color: "#0f783c" },
  { name: "phase-2", color: "#f2c94c" },
];

const MANUAL_ISSUES = [
  {
    id: "OPS-ANDRES-G1",
    title: "Andrés G1 — manual Stripe test payment → paid row + wallet QR",
    status: "Not Started",
    priority: "P0",
    track: "track:events",
    phase: "phase-1",
    depends_on: [],
    relPath: "todo.md",
    body: "Ops gate from tasks/commit/PROGRESS-TASK-TRACKER.md. Run smoke:ticket-paid-proof, pay test card, verify event_orders.status=paid.",
  },
];

const API_KEY = process.env.LINEAR_API_KEY;
if (!API_KEY && !DRY_RUN) {
  console.error("Set LINEAR_API_KEY (lin_api_...) in environment.");
  process.exit(1);
}

async function gql(query, variables = {}) {
  if (DRY_RUN) return { data: {} };
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  const lines = m[1].split("\n");
  let key = null;
  let list = null;

  for (const line of lines) {
    if (list !== null) {
      if (/^\s+-\s+/.test(line)) {
        list.push(line.replace(/^\s+-\s+/, "").trim());
        continue;
      }
      fm[key] = list;
      list = null;
      key = null;
    }
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    key = kv[1];
    const val = kv[2].trim();
    if (val === "") {
      list = [];
      continue;
    }
    if (val.startsWith("[") && val.endsWith("]")) {
      fm[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      fm[key] = val.replace(/^["']|["']$/g, "");
      key = null;
    }
  }
  if (list !== null && key) fm[key] = list;
  return fm;
}

function listMdFiles(dir) {
  const abs = join(ROOT, dir);
  let files = [];
  for (const name of readdirSync(abs)) {
    const p = join(abs, name);
    if (statSync(p).isDirectory()) continue;
    if (name.endsWith(".md") && !name.endsWith("INDEX.md") && name !== "README.md")
      files.push(p);
  }
  return files;
}

function trackForId(id) {
  if (!id) return "track:core";
  if (id.startsWith("SCREEN-") || id.startsWith("CAFE-")) return "track:screens";
  if (id.startsWith("MAP-")) return "track:maps";
  if (id.startsWith("EVP-")) return "track:events";
  if (id.startsWith("VEC-")) return "track:vector";
  if (id.startsWith("CTI-")) return "track:agent";
  if (id.startsWith("MASTRA-")) return "track:mastra";
  if (id.startsWith("CTEST-")) return "track:contest";
  if (id.startsWith("OCL-")) return "track:openclaw";
  if (id.startsWith("GS-")) return "track:grounding";
  if (/^F\d/.test(id)) return "track:core";
  return "track:core";
}

function priorityNum(p) {
  const map = { P0: 1, P1: 2, P2: 3, P3: 4, P4: 4 };
  return map[String(p || "P2").toUpperCase()] ?? 3;
}

function linearState(status) {
  const s = String(status || "").toLowerCase();
  if (s === "in progress" || s === "partial") return STATE_IDS["In Progress"];
  return STATE_IDS.Todo;
}

function isOpen(status) {
  return OPEN_STATUSES.has(String(status || "").toLowerCase());
}

function normalizeDepKey(dep, lookup) {
  const d = String(dep).trim();
  if (lookup.byId.has(d)) return d;
  if (lookup.byStem.has(d)) return lookup.byStem.get(d);
  const stem = basename(d, ".md");
  if (lookup.byStem.has(stem)) return lookup.byStem.get(stem);
  for (const [k, id] of lookup.byStem) {
    if (k.startsWith(d) || d.startsWith(k)) return id;
  }
  const prefix = d.split("-")[0];
  if (/^(F|MAP|SCREEN|EVP|VEC|CTI|MASTRA)\d/.test(d) || /^F\d/.test(d)) {
    const short = d.match(/^(F\d+|MAP-\d+|SCREEN-\d+|VEC-\d+|CTI-\d+[A-Z]?|MASTRA-\d+|EVP-\d+-core|EVP-\d+-mvp|EVP-\d+-advanced)/)?.[1];
    if (short && lookup.byId.has(short)) return short;
  }
  return null;
}

function buildDescription(task) {
  const lines = [
    `**Task ID:** \`${task.id}\``,
    `**Spec:** \`${task.relPath}\``,
    `**Repo status:** ${task.status}`,
  ];
  if (task.priority) lines.push(`**Priority:** ${task.priority}`);
  if (task.phase) lines.push(`**Phase:** ${task.phase}`);
  if (task.depends_on?.length) {
    lines.push(`**Depends on:** ${task.depends_on.join(", ")}`);
  }
  if (task.summary) {
    lines.push("", "## Summary", task.summary);
  }
  lines.push("", "---", "_Imported from mdeai tasks/ — spec file is source of truth._");
  return lines.join("\n");
}

function extractSummary(body) {
  const idx = body.search(/^##\s+(1\.\s+)?Purpose/m);
  if (idx === -1) return "";
  return body.slice(idx, idx + 800).trim();
}

async function ensureLabels(existingNames) {
  const labelIds = {};
  for (const { name, color } of TRACK_LABELS) {
    if (existingNames.has(name)) {
      labelIds[name] = existingNames.get(name);
      continue;
    }
    if (DRY_RUN) {
      labelIds[name] = `dry-${name}`;
      continue;
    }
    const { data } = await gql(
      `mutation($input: IssueLabelCreateInput!) {
        issueLabelCreate(input: $input) { success issueLabel { id name } }
      }`,
      {
        input: {
          name,
          color,
          teamId: TEAM_ID,
        },
      },
    );
    const id = data.issueLabelCreate.issueLabel.id;
    labelIds[name] = id;
    existingNames.set(name, id);
    await sleep(120);
  }
  return labelIds;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchExistingProjectIssues() {
  const issues = [];
  let cursor = null;
  for (;;) {
    const { data } = await gql(
      `query($projectId: String!, $after: String) {
        project(id: $projectId) {
          issues(first: 50, after: $after) {
            nodes { id identifier title }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`,
      { projectId: PROJECT_ID, after: cursor },
    );
    const conn = data.project.issues;
    issues.push(...conn.nodes);
    if (!conn.pageInfo.hasNextPage) break;
    cursor = conn.pageInfo.endCursor;
  }
  return issues;
}

function titleForTask(task) {
  return `${task.id} — ${task.title}`;
}

async function main() {
  const allFiles = TASK_DIRS.flatMap(listMdFiles);
  const lookup = { byId: new Map(), byStem: new Map() };
  const allParsed = [];

  for (const file of allFiles) {
    const raw = readFileSync(file, "utf8");
    const fm = parseFrontmatter(raw);
    const stem = basename(file, ".md");
    const id = fm.id || stem;
    const relPath = relative(ROOT, file);
    lookup.byId.set(id, id);
    lookup.byStem.set(stem, id);
    if (stem.startsWith(id)) lookup.byStem.set(stem, id);
    allParsed.push({
      id,
      title: fm.title || stem,
      status: fm.status || "Not Started",
      priority: fm.priority,
      phase: fm.phase,
      depends_on: Array.isArray(fm.depends_on) ? fm.depends_on : [],
      relPath,
      body: raw.replace(/^---[\s\S]*?---\r?\n/, ""),
      open: isOpen(fm.status),
    });
  }

  for (const m of MANUAL_ISSUES) {
    allParsed.push({ ...m, open: true, body: m.body || "" });
    lookup.byId.set(m.id, m.id);
  }

  const toImport = allParsed.filter((t) => t.open);
  console.log(`Open tasks to import: ${toImport.length}`);

  let labelIds = {};
  let existingByTitlePrefix = new Map();

  if (!DRY_RUN) {
    const { data: labelData } = await gql(
      `query($teamId: String!) {
        team(id: $teamId) { labels { nodes { id name } } }
      }`,
      { teamId: TEAM_ID },
    );
    const existingLabels = new Map(
      labelData.team.labels.nodes.map((l) => [l.name, l.id]),
    );
    labelIds = await ensureLabels(existingLabels);

    const existing = await fetchExistingProjectIssues();
    for (const issue of existing) {
      const prefix = issue.title.split(" — ")[0];
      existingByTitlePrefix.set(prefix, issue);
    }
  }

  const idToLinear = {};
  const log = { created: [], skipped: [], errors: [], relations: [] };

  for (const task of toImport) {
    const title = titleForTask(task);
    const prefix = task.id;

    if (existingByTitlePrefix.has(prefix)) {
      const ex = existingByTitlePrefix.get(prefix);
      idToLinear[task.id] = ex;
      log.skipped.push({ id: task.id, identifier: ex.identifier, reason: "exists" });
      console.log(`skip ${task.id} → ${ex.identifier}`);
      continue;
    }

    const labels = [labelIds[trackForId(task.id)]];
    if (task.phase && /phase\s*2|phase-2|post-mvp|postmvp|advanced|cti-c|ocl-c/i.test(String(task.phase))) {
      labels.push(labelIds["phase-2"]);
    } else {
      labels.push(labelIds["phase-1"]);
    }

    const description = buildDescription({
      ...task,
      summary: extractSummary(task.body),
    });

    if (DRY_RUN) {
      console.log(`[dry-run] create ${title}`);
      idToLinear[task.id] = { id: `dry-${task.id}`, identifier: `DRY-${task.id}` };
      log.created.push({ id: task.id, dryRun: true });
      continue;
    }

    try {
      const { data } = await gql(
        `mutation($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue { id identifier title url }
          }
        }`,
        {
          input: {
            teamId: TEAM_ID,
            projectId: PROJECT_ID,
            title,
            description,
            priority: priorityNum(task.priority),
            stateId: linearState(task.status),
            labelIds: labels.filter(Boolean),
          },
        },
      );
      const issue = data.issueCreate.issue;
      idToLinear[task.id] = issue;
      existingByTitlePrefix.set(prefix, issue);
      log.created.push({
        id: task.id,
        identifier: issue.identifier,
        url: issue.url,
      });
      console.log(`created ${task.id} → ${issue.identifier}`);
      await sleep(150);
    } catch (err) {
      log.errors.push({ id: task.id, error: err.message });
      console.error(`error ${task.id}: ${err.message}`);
    }
  }

  // Pass 2: blocked-by relations (only among imported issues)
  for (const task of toImport) {
    const blocked = idToLinear[task.id];
    if (!blocked?.id || blocked.id.startsWith("dry-")) continue;

    for (const dep of task.depends_on || []) {
      const depId = normalizeDepKey(dep, lookup);
      if (!depId) continue;
      const blocker = idToLinear[depId];
      if (!blocker?.id || blocker.id.startsWith("dry-")) continue;

      if (DRY_RUN) {
        log.relations.push({ task: task.id, blockedBy: depId, dryRun: true });
        continue;
      }

      try {
        await gql(
          `mutation($input: IssueRelationCreateInput!) {
            issueRelationCreate(input: $input) { success }
          }`,
          {
            input: {
              issueId: blocker.id,
              relatedIssueId: blocked.id,
              type: "blocks",
            },
          },
        );
        log.relations.push({
          task: task.id,
          blockedBy: depId,
          blocker: blocker.identifier,
        });
        await sleep(100);
      } catch (err) {
        if (!/already exists|duplicate/i.test(err.message)) {
          log.relations.push({
            task: task.id,
            blockedBy: depId,
            error: err.message,
          });
        }
      }
    }
  }

  const outPath = join(ROOT, "tasks/linear/import-log.json");
  let prior = { created: [], skipped: [], errors: [], relations: [] };
  try {
    prior = JSON.parse(readFileSync(outPath, "utf8"));
  } catch {
    /* first run */
  }
  const mergedCreated = [
    ...prior.created.filter((r) => !log.created.some((n) => n.id === r.id)),
    ...log.created,
  ];
  const mergedSkipped = [
    ...prior.skipped.filter((r) => !log.skipped.some((n) => n.id === r.id)),
    ...log.skipped,
  ];
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        created: mergedCreated,
        skipped: mergedSkipped,
        errors: [...prior.errors, ...log.errors],
        relations: [...prior.relations, ...log.relations],
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
