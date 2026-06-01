#!/usr/bin/env node
/**
 * Sort MDEAPP Todo column by implementation order (manual board sort).
 * Also re-applies milestone + priority from disk taxonomy.
 *
 * Usage:
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-sort-todo.mjs
 *   node scripts/linear-sort-todo.mjs --dry-run
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";
const API_KEY = process.env.LINEAR_API_KEY;
const DRY_RUN = process.argv.includes("--dry-run");

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
  { name: "P0 — MVP gates", sortOrder: 0 },
  { name: "P1 — Events polish", sortOrder: 1 },
  { name: "P1 — Screens & café", sortOrder: 2 },
  { name: "P1 — Maps & core", sortOrder: 3 },
  { name: "Phase 2 — Vector", sortOrder: 4 },
  { name: "Phase 2 — Coffee tours (CTI)", sortOrder: 5 },
  { name: "Phase 2 — Events discovery", sortOrder: 6 },
  { name: "Deferred — Grounding search", sortOrder: 7 },
  { name: "Deferred — OpenClaw", sortOrder: 8 },
  { name: "Deferred — Contest", sortOrder: 9 },
];

const P0_IDS = new Set([
  "OPS-ANDRES-G1",
  "SCREEN-021",
  "EVP-001-core",
  "EVP-003-core",
]);

/** Explicit pull order within milestone (top first). */
const WITHIN_MILESTONE = {
  "P0 — MVP gates": [
    "OPS-ANDRES-G1",
    "EVP-003-core",
    "EVP-001-core",
    "SCREEN-021",
  ],
  "P1 — Events polish": ["EVP-013-core", "EVP-014-core"],
  "P1 — Screens & café": [
    "SCREEN-010",
    "SCREEN-017",
    "CAFE-001",
    "SCREEN-002",
    "SCREEN-018",
  ],
  "P1 — Maps & core": ["MAP-002E", "MAP-002D", "MAP-002A-ADK"],
  "Phase 2 — Vector": [], // VEC-001..005 natural
  "Deferred — Grounding search": ["GS-005", "GS-006", "GS-007", "GS-008", "GS-009"],
};

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

function milestoneFor(id) {
  if (P0_IDS.has(id)) return "P0 — MVP gates";
  if (/^EVP-013-core|^EVP-014-core/.test(id)) return "P1 — Events polish";
  if (id.startsWith("SCREEN-") || id.startsWith("CAFE-")) {
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

function taskSortKey(id) {
  const msName = milestoneFor(id);
  const ms = MILESTONES.find((m) => m.name === msName) ?? MILESTONES[3];
  const explicit = WITHIN_MILESTONE[msName] ?? [];
  const idx = explicit.indexOf(id);
  let sub = idx >= 0 ? idx : 5000;

  if (sub === 5000) {
    const num = id.match(/(\d+)/);
    if (num) sub = 1000 + parseInt(num[1], 10);
    else sub = 9000 + id.charCodeAt(0);
  }

  return ms.sortOrder * 100000 + sub;
}

function parseTaskId(title) {
  const stripped = title.replace(/^\[IMP-\d+\]\s*/, "");
  return stripped.split(" — ")[0]?.trim() ?? stripped;
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
  return new Map(data.project.projectMilestones.nodes.map((m) => [m.name, m]));
}

async function fetchTodoIssues() {
  const issues = [];
  let cursor = null;
  for (;;) {
    const { data } = await gql(
      `query($id: String!, $after: String) {
        project(id: $id) {
          issues(first: 50, after: $after) {
            nodes {
              id
              identifier
              title
              sortOrder
              priority
              state { id name type }
              projectMilestone { id name }
            }
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
  return issues.filter((i) => i.state?.type === "unstarted" || i.state?.name === "Todo");
}

async function main() {
  const milestoneMap = await fetchMilestones();
  const todos = await fetchTodoIssues();
  console.log(`Todo issues: ${todos.length}`);

  const ranked = todos
    .map((issue) => {
      const taskId = parseTaskId(issue.title);
      const msName = milestoneFor(taskId);
      return {
        issue,
        taskId,
        msName,
        rank: taskSortKey(taskId),
        pri: priorityFor(msName, taskId),
      };
    })
    .sort((a, b) => a.rank - b.rank || a.taskId.localeCompare(b.taskId));

  const log = { updated: [], dryRun: DRY_RUN, top20: [] };

  for (let i = 0; i < ranked.length; i++) {
    const { issue, taskId, msName, rank, pri } = ranked[i];
    const sortOrder = (i + 1) * 1000;
    const ms = milestoneMap.get(msName);
    if (i < 20) {
      log.top20.push({
        order: i + 1,
        identifier: issue.identifier,
        taskId,
        milestone: msName,
        sortOrder,
      });
    }

    const input = {
      sortOrder,
      priority: pri,
      ...(ms ? { projectMilestoneId: ms.id } : {}),
    };

    if (DRY_RUN) {
      if (i < 25) {
        console.log(
          `[dry-run] ${i + 1}. ${issue.identifier} ${taskId} → sortOrder=${sortOrder} ms=${msName} pri=${pri}`,
        );
      }
      continue;
    }

    try {
      await gql(
        `mutation($id: String!, $input: IssueUpdateInput!) {
          issueUpdate(id: $id, input: $input) { success }
        }`,
        { id: issue.id, input },
      );
      log.updated.push({
        identifier: issue.identifier,
        taskId,
        sortOrder,
        milestone: msName,
        priority: pri,
      });
      if ((i + 1) % 25 === 0) console.log(`  … ${i + 1}/${ranked.length}`);
      await sleep(55);
    } catch (e) {
      console.error(`${issue.identifier}: ${e.message}`);
    }
  }

  if (!DRY_RUN) {
    console.log(`Updated sortOrder on ${log.updated.length} Todo issues`);
    console.log("Top 10 Todo (implementation order):");
    for (const row of log.top20.slice(0, 10)) {
      console.log(`  ${row.order}. ${row.identifier} — ${row.taskId} (${row.milestone})`);
    }
  }

  const outPath = join(ROOT, "tasks/linear/todo-sort-log.json");
  writeFileSync(outPath, JSON.stringify(log, null, 2));
  console.log(`Log: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
