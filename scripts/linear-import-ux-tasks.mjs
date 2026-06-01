#!/usr/bin/env node
/**
 * Import UX-001…010 into Linear MDEAPP with track + order + IMP labels.
 *
 * Usage:
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-import-ux-tasks.mjs
 *   node scripts/linear-import-ux-tasks.mjs --dry-run
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

const STATE = {
  Todo: "1c623f30-d632-4571-bfd8-67e121a6376f",
  "In Progress": "e9b4149e-0c6f-4201-98a1-6ccc8297d2cd",
  Done: "f8b0d0a0-0b0a-4b0a-8b0a-000000000001", // resolved at runtime
  Backlog: "a629f971-4b1d-46b6-8807-23a0c173a601",
};

/** Tier 1C implementation order — plan.md 2026-05-29 */
const UX_PACK = [
  {
    id: "UX-003",
    imp: 93,
    uxOrder: 1,
    title: 'Deploy "$500 a night" price-wording parser fix',
    file: "UX-003-deploy-price-wording-parser-fix.md",
    priority: 1,
    state: "Todo",
    milestone: "P0 — MVP gates",
    blockedBy: [],
    optional: false,
  },
  {
    id: "UX-002",
    imp: 94,
    uxOrder: 2,
    title: "Render user-facing, retryable error on RUN_ERROR/timeout",
    file: "UX-002-render-user-facing-error-on-run-error.md",
    priority: 1,
    state: "Todo",
    milestone: "P0 — MVP gates",
    blockedBy: ["UX-003"],
    optional: false,
  },
  {
    id: "UX-005",
    imp: 95,
    uxOrder: 3,
    title: 'Add visible "thinking" indicator for concierge runs',
    file: "UX-005-add-concierge-loading-indicator.md",
    priority: 1,
    state: "Todo",
    milestone: "P0 — MVP gates",
    blockedBy: ["UX-003"],
    note: "Same PR as UX-002",
    optional: false,
  },
  {
    id: "UX-009",
    imp: 101,
    uxOrder: 4,
    title: "Production synthetic monitor for conciergeAgent",
    file: "UX-009-prod-synthetic-concierge-monitor.md",
    priority: 2,
    state: "Todo",
    milestone: "P0 — MVP gates",
    blockedBy: ["UX-002", "UX-005"],
    optional: false,
  },
  {
    id: "UX-006",
    imp: 98,
    uxOrder: 5,
    title: 'Make "New chat" reset thread + memory + results + pins',
    file: "UX-006-new-chat-reset-thread-and-map.md",
    priority: 2,
    state: "Todo",
    milestone: "P0 — MVP gates",
    blockedBy: ["UX-009"],
    optional: false,
  },
  {
    id: "UX-007",
    imp: 99,
    uxOrder: 6,
    title: "Clear stale AdvancedMarker DOM after empty results",
    file: "UX-007-clear-stale-advanced-markers.md",
    priority: 2,
    state: "Todo",
    milestone: "P0 — MVP gates",
    blockedBy: ["UX-009"],
    optional: false,
  },
  {
    id: "UX-008",
    imp: 100,
    uxOrder: 7,
    title: 'Replace internal Save tooltip ("SCREEN-011") copy',
    file: "UX-008-fix-save-tooltip-copy.md",
    priority: 3,
    state: "Todo",
    milestone: "P0 — MVP gates",
    blockedBy: ["UX-006", "UX-007"],
    optional: false,
  },
  {
    id: "UX-001",
    imp: 97,
    uxOrder: 8,
    title: "Restore conciergeAgent on prod (EAUTHTIMEOUT)",
    file: "UX-001-restore-concierge-agent-prod.md",
    priority: 1,
    state: "Done",
    milestone: "P0 — MVP gates",
    blockedBy: [],
    note: "Shipped PR #13 — 2026-05-28",
    optional: false,
  },
  {
    id: "UX-004",
    imp: 96,
    uxOrder: 9,
    title: "Disable Events/Food chips while concierge down (optional)",
    file: "UX-004-disable-events-food-chips-while-concierge-down.md",
    priority: 4,
    state: "Backlog",
    milestone: "P0 — MVP gates",
    blockedBy: [],
    note: "Skip if concierge stays green (UX-001 done)",
    optional: true,
  },
  {
    id: "UX-010",
    imp: 102,
    uxOrder: 10,
    title: "Unified result-card architecture (one result = one rich card + one pin)",
    file: "UX-010-unified-result-card-architecture.md",
    priority: 2,
    state: "In Progress",
    milestone: "P1 — Screens & café",
    blockedBy: [],
    note: "After C-012 merge — M0→M5 separate PRs",
    optional: false,
  },
];

const NEW_LABELS = [
  { name: "track:ux", color: "#EB5757", description: "UX prod remediation — Tier 1C" },
  ...UX_PACK.map((t) => ({
    name: `ux-order:${String(t.uxOrder).padStart(2, "0")}`,
    color: "#F2994A",
    description: `UX implementation order ${t.uxOrder} — ${t.id} (IMP-${String(t.imp).padStart(3, "0")})`,
  })),
  ...UX_PACK.map((t) => ({
    name: `imp:${String(t.imp).padStart(3, "0")}`,
    color: "#BB87FC",
    description: `Global plan IMP-${String(t.imp).padStart(3, "0")} — ${t.id}`,
  })),
];

const API_KEY = process.env.LINEAR_API_KEY;
if (!API_KEY && !DRY_RUN) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

async function gql(query, variables = {}) {
  if (DRY_RUN && !query.includes("team(") && !query.includes("project(") && !query.includes("workflowStates")) {
    return { data: {} };
  }
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

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function resolveDoneStateId() {
  const { data } = await gql(
    `query($teamId: String!) {
      team(id: $teamId) {
        states { nodes { id name type } }
      }
    }`,
    { teamId: TEAM_ID },
  );
  const done = data.team.states.nodes.find((s) => s.type === "completed" || s.name === "Done");
  if (!done) throw new Error("Could not resolve Done state");
  STATE.Done = done.id;
  return done.id;
}

async function ensureLabels(existing) {
  const ids = {};
  for (const spec of NEW_LABELS) {
    if (existing.has(spec.name)) {
      ids[spec.name] = existing.get(spec.name);
      continue;
    }
    if (DRY_RUN) {
      ids[spec.name] = `dry-${spec.name}`;
      console.log(`[dry-run] label ${spec.name}`);
      continue;
    }
    const { data } = await gql(
      `mutation($input: IssueLabelCreateInput!) {
        issueLabelCreate(input: $input) {
          success
          issueLabel { id name }
        }
      }`,
      {
        input: {
          teamId: TEAM_ID,
          name: spec.name,
          color: spec.color,
          description: spec.description,
        },
      },
    );
    ids[spec.name] = data.issueLabelCreate.issueLabel.id;
    existing.set(spec.name, ids[spec.name]);
    console.log(`label ${spec.name}`);
    await sleep(120);
  }
  return ids;
}

async function fetchMilestones() {
  const { data } = await gql(
    `query($projectId: String!) {
      project(id: $projectId) {
        projectMilestones { nodes { id name } }
      }
    }`,
    { projectId: PROJECT_ID },
  );
  return new Map(data.project.projectMilestones.nodes.map((m) => [m.name, m.id]));
}

async function fetchExistingIssues() {
  const issues = [];
  let cursor = null;
  for (;;) {
    const { data } = await gql(
      `query($projectId: String!, $after: String) {
        project(id: $projectId) {
          issues(first: 50, after: $after) {
            nodes { id identifier title url }
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

function buildDescription(task, body) {
  const imp = String(task.imp).padStart(3, "0");
  const header = [
    `**Track:** UX prod remediation (Tier 1C) · **IMP-${imp}** · **ux-order:${String(task.uxOrder).padStart(2, "0")}**`,
    `**Spec:** \`tasks/ux/${task.file}\``,
    `**Plan:** [\`plan.md\`](../../plan.md) Tier 1C · [\`tasks/ux/INDEX.md\`](../../tasks/ux/INDEX.md)`,
  ];
  if (task.note) header.push(`**Note:** ${task.note}`);
  if (task.optional) header.push("**Optional:** skip if concierge stays green.");
  return `${header.join("\n\n")}\n\n---\n\n${body.replace(/^---[\s\S]*?---\r?\n/, "").slice(0, 12000)}`;
}

async function main() {
  await resolveDoneStateId();

  const { data: labelData } = await gql(
    `query($teamId: String!) {
      team(id: $teamId) { labels { nodes { id name } } }
    }`,
    { teamId: TEAM_ID },
  );
  const existingLabels = new Map(labelData.team.labels.nodes.map((l) => [l.name, l.id]));
  const labelIds = await ensureLabels(existingLabels);
  const milestoneMap = await fetchMilestones();
  const existing = await fetchExistingIssues();
  const byPrefix = new Map();
  for (const issue of existing) {
    byPrefix.set(issue.title.split(" — ")[0], issue);
  }

  const idToLinear = {};
  const log = { created: [], updated: [], skipped: [], errors: [], relations: [] };

  for (const task of UX_PACK) {
    const title = `${task.id} — ${task.title}`;
    const prefix = task.id;
    const body = readFileSync(join(ROOT, "tasks/ux", task.file), "utf8");
    const description = buildDescription(task, body);
    const labels = [
      labelIds["track:ux"],
      labelIds[`ux-order:${String(task.uxOrder).padStart(2, "0")}`],
      labelIds[`imp:${String(task.imp).padStart(3, "0")}`],
      labelIds["phase-1"] || existingLabels.get("phase-1"),
    ].filter(Boolean);

    const milestoneId = milestoneMap.get(task.milestone);
    const stateId = STATE[task.state] || STATE.Todo;

    if (byPrefix.has(prefix)) {
      const ex = byPrefix.get(prefix);
      idToLinear[task.id] = ex;
      if (DRY_RUN) {
        console.log(`[dry-run] update ${ex.identifier} ${title}`);
        log.updated.push({ id: task.id, identifier: ex.identifier, dryRun: true });
        continue;
      }
      try {
        await gql(
          `mutation($id: String!, $input: IssueUpdateInput!) {
            issueUpdate(id: $id, input: $input) { success }
          }`,
          {
            id: ex.id,
            input: {
              title,
              description,
              priority: task.priority,
              stateId,
              labelIds: labels,
              projectMilestoneId: milestoneId || undefined,
            },
          },
        );
        log.updated.push({ id: task.id, identifier: ex.identifier, url: ex.url });
        console.log(`updated ${task.id} → ${ex.identifier}`);
        await sleep(150);
      } catch (err) {
        log.errors.push({ id: task.id, error: err.message });
        console.error(`update error ${task.id}: ${err.message}`);
      }
      continue;
    }

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
            priority: task.priority,
            stateId,
            labelIds: labels,
            projectMilestoneId: milestoneId || undefined,
          },
        },
      );
      const issue = data.issueCreate.issue;
      idToLinear[task.id] = issue;
      byPrefix.set(prefix, issue);
      log.created.push({ id: task.id, identifier: issue.identifier, url: issue.url, imp: task.imp, uxOrder: task.uxOrder });
      console.log(`created ${task.id} → ${issue.identifier}`);
      await sleep(150);
    } catch (err) {
      log.errors.push({ id: task.id, error: err.message });
      console.error(`create error ${task.id}: ${err.message}`);
    }
  }

  for (const task of UX_PACK) {
    const blocked = idToLinear[task.id];
    if (!blocked?.id || String(blocked.id).startsWith("dry-")) continue;
    for (const depId of task.blockedBy) {
      const blocker = idToLinear[depId];
      if (!blocker?.id || String(blocker.id).startsWith("dry-")) continue;
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
        log.relations.push({ task: task.id, blockedBy: depId, blocker: blocker.identifier });
        await sleep(100);
      } catch (err) {
        if (!/already exists|duplicate/i.test(err.message)) {
          log.relations.push({ task: task.id, blockedBy: depId, error: err.message });
        }
      }
    }
  }

  const outPath = join(ROOT, "tasks/linear/ux-import-log.json");
  writeFileSync(outPath, JSON.stringify({ generated: new Date().toISOString(), ...log }, null, 2));

  let importLog = { created: [], skipped: [], errors: [], relations: [] };
  try {
    importLog = JSON.parse(readFileSync(join(ROOT, "tasks/linear/import-log.json"), "utf8"));
  } catch {
    /* ok */
  }
  for (const row of [...log.created, ...log.updated]) {
    if (row.dryRun) continue;
    const entry = { id: row.id, identifier: row.identifier, url: row.url, source: "ux-import-2026-05-29" };
    const idx = importLog.created.findIndex((r) => r.id === row.id);
    if (idx >= 0) importLog.created[idx] = entry;
    else importLog.created.push(entry);
  }
  writeFileSync(join(ROOT, "tasks/linear/import-log.json"), JSON.stringify(importLog, null, 2));

  console.log(`\nDone. created=${log.created.length} updated=${log.updated.length} errors=${log.errors.length}`);
  console.log(`Log: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
