#!/usr/bin/env node
/**
 * Sync MDEAPP Linear board to canonical MVP order (plan.md / core-mvp-order.json).
 *
 * - Preserves global IMP from implementation-order.json
 * - Active queue IMP 079-092 from core-mvp-order.json (title prefix)
 * - Imports ONLY missing active-queue tasks (not bulk ADV import)
 * - Milestones: P0 | P1 | P2 | ADV
 * - Does not delete issues
 *
 * Usage:
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-sync-mvp.mjs
 *   node scripts/linear-sync-mvp.mjs --dry-run
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const API_KEY = process.env.LINEAR_API_KEY;
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";
const INITIATIVE_NAME = "Phase 1 MVP Exit";

const STATE = {
  Todo: "1c623f30-d632-4571-bfd8-67e121a6376f",
  "In Progress": "e9b4149e-0c6f-4201-98a1-6ccc8297d2cd",
  Backlog: "a629f971-4b1d-46b6-8807-23a0c173a601",
};

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

const MILESTONE_SPECS = [
  { name: "P0", sortOrder: 0, description: "MVP exit blockers — IMP 079-083 A, 084-092 B" },
  { name: "P1", sortOrder: 1, description: "MVP polish — IMP 086-089" },
  { name: "P2", sortOrder: 2, description: "Platform quality — IMP 090 AUTH-005" },
  { name: "ADV", sortOrder: 3, description: "Post-MVP — MAP-005+, trips, rentals, Phase 2+" },
];

const LABEL_SPECS = [
  { name: "core", color: "#BB87FC" },
  { name: "mvp", color: "#0f783c" },
  { name: "maps", color: "#26b5ce" },
  { name: "events", color: "#F2994A" },
  { name: "auth", color: "#5e6ad2" },
  { name: "trips", color: "#56ccf2" },
  { name: "rentals", color: "#95a2b3" },
  { name: "data", color: "#bec2c8" },
  { name: "blocking", color: "#eb5757" },
  { name: "production", color: "#f2c94c" },
  { name: "post-mvp", color: "#7a7a7a" },
  { name: "advanced", color: "#6366f1" },
];

/** IMP numbers that must never sit in Todo (ADV spine). */
const ADV_BLOCK_TODO = new Set([
  "MAP-005", "MAP-006", "MAP-011", "MAP-011A", "MAP-012", "MAP-012A", "MAP-023", "MAP-034", "MAP-002A",
]);

if (!API_KEY && !DRY_RUN) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

const coreOrder = JSON.parse(readFileSync(join(ROOT, "tasks/linear/core-mvp-order.json"), "utf8"));
const implOrder = JSON.parse(readFileSync(join(ROOT, "tasks/linear/implementation-order.json"), "utf8"));

const activeQueue = coreOrder.activeQueue;
const activeByTaskId = new Map(activeQueue.map((r) => [r.taskId, r]));
const activeImpByTaskId = new Map(activeQueue.map((r) => [r.taskId, r.imp]));
const globalImpByTaskId = new Map(implOrder.rows.map((r) => [r.taskId, r.imp]));

const report = {
  generated: new Date().toISOString(),
  dryRun: DRY_RUN,
  conflicts: [],
  duplicates: [],
  missingLabels: [],
  missingDependencies: [],
  imported: [],
  updated: [],
  deferred: [],
  todoSort: [],
  finalOrder: [],
};

async function gql(query, variables = {}) {
  if (DRY_RUN && !query.includes("query")) return { data: {} };
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
      fm[key] = val.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
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
  if (!statSync(abs, { throwIfNoentry: false })) return [];
  return readdirSync(abs)
    .filter((n) => n.endsWith(".md") && !["INDEX.md", "README.md", "LEGACY-ID-MAP.md", "notes-events.md"].includes(n))
    .map((n) => join(abs, n));
}

function parseTaskId(title) {
  return title.replace(/^\[IMP-\d+\]\s*/, "").split(" — ")[0]?.trim() ?? title;
}

function impFor(taskId) {
  if (activeImpByTaskId.has(taskId)) return activeImpByTaskId.get(taskId);
  if (globalImpByTaskId.has(taskId)) return globalImpByTaskId.get(taskId);
  return null;
}

function buildTitle(taskId, restTitle) {
  const imp = impFor(taskId);
  const suffix = restTitle ? ` — ${restTitle}` : "";
  return imp ? `[IMP-${imp}] ${taskId}${suffix}` : `${taskId}${suffix}`;
}

function labelsFor(taskId, row) {
  const labels = new Set();
  if (row?.milestone === "P0" || row?.milestone === "P1") labels.add("mvp");
  if (row?.milestone === "P2") labels.add("core");
  if (row?.milestone === "ADV" || !row) {
    labels.add("post-mvp");
    labels.add("advanced");
  }
  if (taskId.startsWith("MAP-")) labels.add("maps");
  if (taskId.startsWith("EVP-") || taskId === "OPS-ANDRES-G1" || taskId.startsWith("G3")) labels.add("events");
  if (taskId.startsWith("AUTH-")) labels.add("auth");
  if (taskId.startsWith("TRIP-")) labels.add("trips");
  if (taskId.startsWith("RE-")) labels.add("rentals");
  if (taskId.startsWith("data-")) labels.add("data");
  if (/^F\d/.test(taskId) || taskId.startsWith("SCREEN-")) labels.add("core");
  if (["OPS-ANDRES-G1", "EVP-003-core", "EVP-013-core", "G3-core-host-publish-proof", "EVP-001-core"].includes(taskId)) {
    labels.add("blocking");
  }
  if (["F32", "AUTH-011", "MAP-002B", "MAP-008B", "EVP-001-core"].includes(taskId)) {
    labels.add("production");
  }
  if (!row && (taskId.startsWith("VEC-") || taskId.startsWith("OCL-") || taskId.startsWith("CTEST-") || taskId.startsWith("CTI-") || taskId.startsWith("GS-"))) {
    labels.add("advanced");
  }
  return [...labels];
}

function priorityFor(row, taskId) {
  if (row) {
    const p = row.priority?.toLowerCase();
    if (row.milestone === "P0" || p === "urgent") return 1;
    if (row.milestone === "P1" || p === "high") return 2;
    if (row.milestone === "P2" || p === "medium") return 3;
  }
  if (ADV_BLOCK_TODO.has(taskId) || taskId.startsWith("VEC-") || taskId.startsWith("OCL-")) return 4;
  return 4;
}

function milestoneNameFor(row, taskId) {
  if (row) return row.milestone;
  if (ADV_BLOCK_TODO.has(taskId)) return "ADV";
  if (taskId.startsWith("VEC-") || taskId.startsWith("CTI-") || taskId.startsWith("OCL-") || taskId.startsWith("CTEST-") || taskId.startsWith("GS-")) return "ADV";
  if (/^EVP-0(1[5-9]|[2-4][0-9])/.test(taskId)) return "ADV";
  if (taskId.startsWith("MAP-00") && !["MAP-002B", "MAP-008B"].includes(taskId)) return "ADV";
  return "ADV";
}

function loadDiskSpecs() {
  const specs = new Map();
  for (const dir of TASK_DIRS) {
    for (const file of listMdFiles(dir)) {
      const raw = readFileSync(file, "utf8");
      const fm = parseFrontmatter(raw);
      const stem = basename(file, ".md");
      const id = fm.id || stem;
      specs.set(id, {
        id,
        title: fm.title || stem,
        status: fm.status || "Not Started",
        relPath: relative(ROOT, file),
        depends_on: Array.isArray(fm.depends_on) ? fm.depends_on : [],
        body: raw,
      });
    }
  }
  specs.set("OPS-ANDRES-G1", {
    id: "OPS-ANDRES-G1",
    title: "Andrés G1 — manual Stripe test payment → paid row + wallet QR",
    status: "Not Started",
    relPath: "todo.md",
    depends_on: [],
    body: "",
  });
  return specs;
}

async function fetchAllIssues() {
  const issues = [];
  let cursor = null;
  for (;;) {
    const { data } = await gql(
      `query($id: String!, $after: String) {
        project(id: $id) {
          issues(first: 50, after: $after) {
            nodes {
              id identifier title sortOrder priority
              state { id name type }
              projectMilestone { id name }
              labels { nodes { id name } }
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
  return issues;
}

async function ensureLabels() {
  const { data } = await gql(
    `query($teamId: String!) { team(id: $teamId) { labels { nodes { id name } } } }`,
    { teamId: TEAM_ID },
  );
  const map = new Map(data.team.labels.nodes.map((l) => [l.name, l.id]));
  for (const spec of LABEL_SPECS) {
    if (map.has(spec.name)) continue;
    if (DRY_RUN) {
      map.set(spec.name, `dry-${spec.name}`);
      continue;
    }
    const { data: created } = await gql(
      `mutation($input: IssueLabelCreateInput!) {
        issueLabelCreate(input: $input) { success issueLabel { id name } }
      }`,
      { input: { name: spec.name, color: spec.color, teamId: TEAM_ID } },
    );
    map.set(spec.name, created.issueLabelCreate.issueLabel.id);
    await sleep(100);
  }
  return map;
}

async function ensureMilestones() {
  const { data } = await gql(
    `query($id: String!) { project(id: $id) { projectMilestones { nodes { id name sortOrder } } } }`,
    { id: PROJECT_ID },
  );
  const map = new Map(data.project.projectMilestones.nodes.map((m) => [m.name, m]));
  for (const spec of MILESTONE_SPECS) {
    if (map.has(spec.name)) continue;
    if (DRY_RUN) {
      map.set(spec.name, { id: `dry-${spec.name}`, name: spec.name });
      continue;
    }
    const { data: created } = await gql(
      `mutation($input: ProjectMilestoneCreateInput!) {
        projectMilestoneCreate(input: $input) { success projectMilestone { id name } }
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
    const m = created.projectMilestoneCreate.projectMilestone;
    map.set(m.name, m);
    await sleep(120);
  }
  return map;
}

async function importMissingActive(diskSpecs, issueByTaskId, labelMap, milestoneMap) {
  for (const row of activeQueue) {
    if (row.linear || issueByTaskId.has(row.taskId)) continue;
    const spec = diskSpecs.get(row.taskId);
    if (!spec) {
      report.missingDependencies.push({ taskId: row.taskId, reason: "spec file not found on disk" });
      continue;
    }
    const title = buildTitle(row.taskId, spec.title);
    const labelNames = labelsFor(row.taskId, row);
    const labelIds = labelNames.map((n) => labelMap.get(n)).filter(Boolean);
    const ms = milestoneMap.get(row.milestone);

    if (DRY_RUN) {
      report.imported.push({ taskId: row.taskId, imp: row.imp, title, dryRun: true });
      continue;
    }

    const { data } = await gql(
      `mutation($input: IssueCreateInput!) {
        issueCreate(input: $input) { success issue { id identifier title url } }
      }`,
      {
        input: {
          teamId: TEAM_ID,
          projectId: PROJECT_ID,
          title,
          description: `**Task ID:** \`${row.taskId}\`\n**Spec:** \`${spec.relPath}\`\n**IMP:** ${row.imp}\n**Milestone:** ${row.milestone}\n\n_Imported by linear-sync-mvp.mjs_`,
          priority: priorityFor(row, row.taskId),
          stateId: STATE.Todo,
          labelIds,
          ...(ms ? { projectMilestoneId: ms.id } : {}),
        },
      },
    );
    const issue = data.issueCreate.issue;
    issueByTaskId.set(row.taskId, {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      state: { name: "Todo", type: "unstarted" },
      labels: { nodes: labelNames.map((n) => ({ name: n })) },
    });
    report.imported.push({ taskId: row.taskId, imp: row.imp, identifier: issue.identifier, url: issue.url });
    await sleep(150);
  }
}

async function updateIssue(issue, taskId, row, milestoneMap, labelMap) {
  const msName = milestoneNameFor(row, taskId);
  const ms = milestoneMap.get(msName);
  const labelNames = labelsFor(taskId, row);
  const labelIds = labelNames.map((n) => labelMap.get(n)).filter(Boolean);
  for (const n of labelNames) {
    if (!labelMap.has(n)) report.missingLabels.push({ taskId, label: n });
  }

  const rest = issue.title.replace(/^\[IMP-\d+\]\s*/, "").split(" — ").slice(1).join(" — ");
  const newTitle = buildTitle(taskId, rest || undefined);
  const pri = priorityFor(row, taskId);

  const isAdv = msName === "ADV" || (!row && impFor(taskId) && parseInt(impFor(taskId), 10) >= 93);
  const isActive = !!row;
  let stateId = undefined;
  if (isAdv && !isActive) {
    stateId = STATE.Backlog;
  }

  const input = {
    title: newTitle !== issue.title ? newTitle : undefined,
    priority: pri,
    ...(ms ? { projectMilestoneId: ms.id } : {}),
    ...(labelIds.length ? { labelIds } : {}),
    ...(stateId ? { stateId } : {}),
  };

  if (Object.values(input).every((v) => v === undefined)) return null;

  if (DRY_RUN) {
    return { taskId, identifier: issue.identifier, imp: impFor(taskId), msName, pri, stateId: stateId ? "Backlog" : null, title: newTitle };
  }

  await gql(
    `mutation($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) { success }
    }`,
    { id: issue.id, input: Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined)) },
  );
  await sleep(60);
  return { taskId, identifier: issue.identifier, imp: impFor(taskId), msName, pri, title: newTitle, deferred: !!stateId };
}

async function applyBlockedBy(issueByTaskId) {
  for (const row of activeQueue) {
    const blocked = issueByTaskId.get(row.taskId);
    if (!blocked?.id) continue;
    for (const dep of row.blocked_by || []) {
      const blocker = issueByTaskId.get(dep);
      if (!blocker?.id) {
        report.missingDependencies.push({ taskId: row.taskId, blocked_by: dep, reason: "blocker not in Linear" });
        continue;
      }
      if (DRY_RUN) continue;
      try {
        await gql(
          `mutation($input: IssueRelationCreateInput!) {
            issueRelationCreate(input: $input) { success }
          }`,
          { input: { issueId: blocker.id, relatedIssueId: blocked.id, type: "blocks" } },
        );
        await sleep(50);
      } catch (e) {
        if (!/already exists|duplicate/i.test(e.message)) {
          report.conflicts.push({ type: "blocked-by", taskId: row.taskId, dep, error: e.message });
        }
      }
    }
  }
}

async function sortTodo(issueByTaskId) {
  const sortOrder = [];
  let order = 1;

  const add = (taskId) => {
    const issue = issueByTaskId.get(taskId);
    if (!issue || issue.state?.name !== "Todo") return;
    sortOrder.push({ order: order++, taskId, imp: impFor(taskId), identifier: issue.identifier });
  };

  for (const row of activeQueue) add(row.taskId);

  const todos = [...issueByTaskId.entries()]
    .filter(([, i]) => i.state?.name === "Todo")
    .map(([taskId]) => taskId)
    .filter((id) => !activeByTaskId.has(id));

  todos.sort((a, b) => {
    const ia = parseInt(impFor(a) || "9999", 10);
    const ib = parseInt(impFor(b) || "9999", 10);
    return ia - ib || a.localeCompare(b);
  });
  for (const id of todos) add(id);

  for (const row of sortOrder) {
    const issue = issueByTaskId.get(row.taskId);
    if (!issue || DRY_RUN) continue;
    await gql(
      `mutation($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) { success }
      }`,
      { id: issue.id, input: { sortOrder: row.order * 1000 } },
    );
    await sleep(45);
  }
  report.todoSort = sortOrder;
  report.finalOrder = sortOrder.slice(0, 20);
}

async function main() {
  console.log(DRY_RUN ? "DRY RUN — linear-sync-mvp" : "linear-sync-mvp");

  const diskSpecs = loadDiskSpecs();
  const labelMap = await ensureLabels();
  const milestoneMap = await ensureMilestones();

  let issues = DRY_RUN ? [] : await fetchAllIssues();
  if (DRY_RUN) {
    try {
      const csv = readFileSync(join(ROOT, "tasks/linear/MDEAPP › Issues (2).csv"), "utf8");
      console.log(`(dry-run) using CSV snapshot ${issues.length} issues skipped — run without --dry-run for live sync`);
    } catch {
      /* ok */
    }
  }

  const issueByTaskId = new Map();
  const dupes = new Map();
  for (const issue of issues) {
    const taskId = parseTaskId(issue.title);
    if (issueByTaskId.has(taskId)) {
      report.duplicates.push({ taskId, a: issueByTaskId.get(taskId).identifier, b: issue.identifier });
    }
    issueByTaskId.set(taskId, issue);
    if (!dupes.has(taskId)) dupes.set(taskId, []);
    dupes.get(taskId).push(issue.identifier);
  }

  await importMissingActive(diskSpecs, issueByTaskId, labelMap, milestoneMap);

  if (!DRY_RUN) issues = await fetchAllIssues();
  issueByTaskId.clear();
  for (const issue of issues) {
    issueByTaskId.set(parseTaskId(issue.title), issue);
  }

  for (const row of activeQueue) {
    const issue = issueByTaskId.get(row.taskId);
    if (!issue) {
      report.conflicts.push({ taskId: row.taskId, imp: row.imp, reason: "still missing after import" });
      continue;
    }
    const u = await updateIssue(issue, row.taskId, row, milestoneMap, labelMap);
    if (u) report.updated.push(u);
  }

  for (const [taskId, issue] of issueByTaskId) {
    if (activeByTaskId.has(taskId)) continue;
    const imp = impFor(taskId);
    const impNum = imp ? parseInt(imp, 10) : 9999;
    const isAdv =
      impNum >= 93 ||
      ADV_BLOCK_TODO.has(taskId) ||
      taskId.startsWith("VEC-") ||
      taskId.startsWith("OCL-") ||
      taskId.startsWith("CTEST-") ||
      taskId.startsWith("CTI-") ||
      taskId.startsWith("GS-") ||
      /^EVP-0(1[5-9]|[2-4][0-9])/.test(taskId);
    if (!isAdv) continue;
    const u = await updateIssue(issue, taskId, null, milestoneMap, labelMap);
    if (u?.deferred) report.deferred.push(u);
    else if (u) report.updated.push(u);
  }

  await applyBlockedBy(issueByTaskId);
  await sortTodo(issueByTaskId);

  const outPath = join(ROOT, "tasks/linear/sync-mvp-report.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  const mdPath = join(ROOT, "tasks/notes/13-linear-sync-report.md");
  writeFileSync(
    mdPath,
    `# Linear sync report (${report.generated.slice(0, 10)})

${DRY_RUN ? "**DRY RUN** — re-run without \`--dry-run\` to apply.\n" : ""}

## Final Todo order (top 14)

| # | IMP | Task | Linear |
|---|-----|------|--------|
${report.finalOrder.map((r) => `| ${r.order} | ${r.imp ?? "—"} | ${r.taskId} | ${r.identifier ?? "—"} |`).join("\n")}

## Imported (${report.imported.length})

${report.imported.map((r) => `- **${r.taskId}** IMP-${r.imp} → ${r.identifier ?? "dry-run"}`).join("\n") || "_none_"}

## Conflicts (${report.conflicts.length})

${report.conflicts.map((c) => `- ${JSON.stringify(c)}`).join("\n") || "_none_"}

## Duplicates (${report.duplicates.length})

${report.duplicates.map((d) => `- \`${d.taskId}\`: ${d.a} vs ${d.b}`).join("\n") || "_none_"}

## Missing dependencies (${report.missingDependencies.length})

${report.missingDependencies.map((m) => `- ${JSON.stringify(m)}`).join("\n") || "_none_"}

## Deferred to Backlog/ADV (${report.deferred.length})

${report.deferred.slice(0, 15).map((d) => `- ${d.identifier} ${d.taskId}`).join("\n")}${report.deferred.length > 15 ? `\n- … +${report.deferred.length - 15} more` : ""}

JSON: \`tasks/linear/sync-mvp-report.json\`
`,
  );

  console.log(`\nReport: ${mdPath}`);
  console.log(`Imported: ${report.imported.length} · Updated: ${report.updated.length} · Deferred: ${report.deferred.length}`);
  console.log(`Conflicts: ${report.conflicts.length} · Duplicates: ${report.duplicates.length}`);
  if (report.finalOrder.length) {
    console.log("\nTop Todo order:");
    for (const r of report.finalOrder.slice(0, 12)) {
      console.log(`  ${r.order}. [IMP-${r.imp}] ${r.taskId} (${r.identifier})`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
