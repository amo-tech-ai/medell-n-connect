#!/usr/bin/env node
/**
 * Organize MDEAPP: milestones, priorities, dependencies.
 * Usage: LINEAR_API_KEY=... node scripts/linear-organize-project.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";
const API_KEY = process.env.LINEAR_API_KEY;

const TASK_DIRS = [
  "tasks/core",
  "tasks/maps",
  "tasks/screens",
  "tasks/events",
  "tasks/vector",
  "tasks/agent/tasks",
  "tasks/mastra",
  "tasks/contest/tasks",
  "tasks/openclaw/tasks",
  "tasks/grounding-search/tasks",
];

const MILESTONES = [
  {
    name: "P0 — MVP gates",
    sortOrder: 0,
    description:
      "Andrés G1 paid proof · SCREEN-021 Phase A · EVP-001/003 proof. Ship before new verticals.",
  },
  {
    name: "P1 — Events polish",
    sortOrder: 1,
    description: "EVP-013 COP/images · EVP-014 /host/events · refresh anti-fake-done evidence.",
  },
  {
    name: "P1 — Screens & café",
    sortOrder: 2,
    description: "SCREEN-010/017 optional · CAFE-001 · deferred 002/018.",
  },
  {
    name: "P1 — Maps & core",
    sortOrder: 3,
    description: "Open MAP-* post-MVP · F20–F32 · MASTRA-004.",
  },
  {
    name: "Phase 2 — Vector",
    sortOrder: 4,
    description: "VEC-001→005 before SCREEN-021 Phase B semantic rerank.",
  },
  {
    name: "Phase 2 — Coffee tours (CTI)",
    sortOrder: 5,
    description: "CTI-001A…010 — farm tours, not café SCREEN-021.",
  },
  {
    name: "Phase 2 — Events discovery",
    sortOrder: 6,
    description: "EVP-015+ mvp pack · post-MVP event web discovery.",
  },
  {
    name: "Deferred — Grounding search",
    sortOrder: 7,
    description: "GS-005…009 · MAP-002D sidecar research.",
  },
  {
    name: "Deferred — OpenClaw",
    sortOrder: 8,
    description: "OCL-* VPS automation · after EVP-020/022 for discovery.",
  },
  {
    name: "Deferred — Contest",
    sortOrder: 9,
    description: "CTEST-* · /contests frozen Phase 2+.",
  },
];

const P0_IDS = new Set([
  "OPS-ANDRES-G1",
  "SCREEN-021",
  "EVP-001-core",
  "EVP-003-core",
]);

if (!API_KEY) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

async function gql(query, variables = {}) {
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
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
  return readdirSync(abs)
    .filter((n) => n.endsWith(".md") && !n.endsWith("INDEX.md") && n !== "README.md")
    .map((n) => join(abs, n));
}

function milestoneFor(id) {
  if (P0_IDS.has(id)) return "P0 — MVP gates";
  if (/^EVP-013-core|^EVP-014-core/.test(id)) return "P1 — Events polish";
  if (id.startsWith("SCREEN-") || id.startsWith("CAFE-")) {
    if (P0_IDS.has(id)) return "P0 — MVP gates";
    return "P1 — Screens & café";
  }
  if (id.startsWith("MAP-")) return "P1 — Maps & core";
  if (/^F\d/.test(id) || id.startsWith("MASTRA-")) return "P1 — Maps & core";
  if (id.startsWith("VEC-")) return "Phase 2 — Vector";
  if (id.startsWith("CTI-")) return "Phase 2 — Coffee tours (CTI)";
  if (id.startsWith("EVP-")) return "Phase 2 — Events discovery";
  if (id.startsWith("OCL-")) return "Deferred — OpenClaw";
  if (id.startsWith("CTEST-")) return "Deferred — Contest";
  if (id.startsWith("GS-")) return "Deferred — Grounding search";
  if (id === "OPS-ANDRES-G1") return "P0 — MVP gates";
  return "P1 — Maps & core";
}

function priorityFor(milestoneName, id) {
  if (P0_IDS.has(id) || milestoneName === "P0 — MVP gates") return 1;
  if (milestoneName.startsWith("P1")) return 2;
  if (milestoneName.startsWith("Phase 2")) return 3;
  return 4;
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
  return null;
}

async function fetchProjectIssues() {
  const issues = [];
  let cursor = null;
  for (;;) {
    const { data } = await gql(
      `query($id: String!, $after: String) {
        project(id: $id) {
          issues(first: 50, after: $after) {
            nodes { id identifier title priority priorityLabel }
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

async function fetchMilestones() {
  const { data } = await gql(
    `query($id: String!) {
      project(id: $id) {
        projectMilestones { nodes { id name sortOrder } }
      }
    }`,
    { id: PROJECT_ID },
  );
  return data.project.projectMilestones.nodes;
}

async function ensureMilestones(existing) {
  const byName = new Map(existing.map((m) => [m.name, m]));
  for (const spec of MILESTONES) {
    if (byName.has(spec.name)) {
      console.log(`milestone exists: ${spec.name}`);
      continue;
    }
    const { data } = await gql(
      `mutation($input: ProjectMilestoneCreateInput!) {
        projectMilestoneCreate(input: $input) {
          success
          projectMilestone { id name }
        }
      }`,
      {
        input: {
          projectId: PROJECT_ID,
          name: spec.name,
          description: spec.description,
          sortOrder: spec.sortOrder,
        },
      },
    );
    const m = data.projectMilestoneCreate.projectMilestone;
    byName.set(m.name, m);
    console.log(`created milestone: ${m.name}`);
    await sleep(150);
  }
  return byName;
}

async function main() {
  const log = { milestones: [], assigned: [], priorities: [], relations: [], errors: [] };

  const existingMs = await fetchMilestones();
  const milestoneMap = await ensureMilestones(existingMs);

  const issues = await fetchProjectIssues();
  const taskIdToIssue = new Map();
  for (const issue of issues) {
    const prefix = issue.title.split(" — ")[0];
    taskIdToIssue.set(prefix, issue);
  }

  for (const issue of issues) {
    const taskId = issue.title.split(" — ")[0];
    const msName = milestoneFor(taskId);
    const ms = milestoneMap.get(msName);
    if (!ms) continue;

    const pri = priorityFor(msName, taskId);
    try {
      await gql(
        `mutation($id: String!, $input: IssueUpdateInput!) {
          issueUpdate(id: $id, input: $input) { success }
        }`,
        {
          id: issue.id,
          input: {
            projectMilestoneId: ms.id,
            priority: pri,
          },
        },
      );
      log.assigned.push({ taskId, identifier: issue.identifier, milestone: msName, priority: pri });
      await sleep(80);
    } catch (e) {
      log.errors.push({ taskId, step: "assign", error: e.message });
    }
  }

  console.log(`Assigned ${log.assigned.length} issues to milestones`);

  const lookup = { byId: new Map(), byStem: new Map() };
  const depsByTask = new Map();

  for (const dir of TASK_DIRS) {
    for (const file of listMdFiles(dir)) {
      const raw = readFileSync(file, "utf8");
      const fm = parseFrontmatter(raw);
      const stem = basename(file, ".md");
      const id = fm.id || stem;
      lookup.byId.set(id, id);
      lookup.byStem.set(stem, id);
      if (Array.isArray(fm.depends_on) && fm.depends_on.length) {
        depsByTask.set(id, fm.depends_on);
      }
    }
  }
  depsByTask.set("OPS-ANDRES-G1", []);

  for (const [taskId, deps] of depsByTask) {
    const blocked = taskIdToIssue.get(taskId);
    if (!blocked) continue;
    for (const dep of deps) {
      const depId = normalizeDepKey(dep, lookup);
      if (!depId) continue;
      const blocker = taskIdToIssue.get(depId);
      if (!blocker) continue;
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
          blocked: taskId,
          blockedBy: depId,
          blocker: blocker.identifier,
          blockedIssue: blocked.identifier,
        });
        await sleep(60);
      } catch (e) {
        if (!/already exists|duplicate/i.test(e.message)) {
          log.relations.push({ blocked: taskId, blockedBy: depId, error: e.message });
        }
      }
    }
  }

  console.log(`Relations: ${log.relations.filter((r) => !r.error).length} created/confirmed`);

  // Project summary/description already set via Linear MCP save_project (GraphQL ProjectUpdateInput lacks summary).
  try {
    await gql(
      `mutation($id: String!, $input: ProjectUpdateInput!) {
        projectUpdate(id: $id, input: $input) { success }
      }`,
      {
        id: PROJECT_ID,
        input: {
          description: `Phase 1 mdeapp — MVP gates first. See tasks/linear/02-views-sort.md`,
        },
      },
    );
  } catch (e) {
    console.warn(`Project description update skipped: ${e.message}`);
  }

  const outPath = join(ROOT, "tasks/linear/organize-log.json");
  writeFileSync(outPath, JSON.stringify(log, null, 2));
  console.log(`Log: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
