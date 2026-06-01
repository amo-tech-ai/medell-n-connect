#!/usr/bin/env node
/**
 * Import UX-013…035 (tasks/ux/tasks/) into Linear MDEAPP.
 *
 * Usage:
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-import-ux-stack-tasks.mjs
 *   node scripts/linear-import-ux-stack-tasks.mjs --dry-run
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const TASKS_DIR = join(ROOT, "tasks/ux/tasks");
const DRY_RUN = process.argv.includes("--dry-run");
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

const API_KEY = process.env.LINEAR_API_KEY;
if (!API_KEY && !DRY_RUN) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

/** Authoritative UX stack order (top = implement first). */
const UX_STACK = [
  { id: "UX-015", order: 1, priority: 1, state: "In Review", milestone: "🚨 Launch Critical", updateIdentifier: "SAN-320", blockedBy: [] },
  { id: "UX-013", order: 2, priority: 1, state: "Todo", milestone: "🚨 Launch Critical", blockedBy: [] },
  { id: "UX-014", order: 3, priority: 1, state: "Todo", milestone: "🚨 Launch Critical", blockedBy: [] },
  { id: "UX-019", order: 4, priority: 1, state: "Todo", milestone: "🚨 Launch Critical", blockedBy: [] },
  { id: "UX-016", order: 5, priority: 2, state: "Todo", milestone: "🚨 Launch Critical", blockedBy: ["UX-015"] },
  { id: "UX-031", order: 6, priority: 2, state: "Todo", milestone: "🚨 Launch Critical", blockedBy: ["UX-019", "UX-013"] },
  { id: "UX-017", order: 7, priority: 2, state: "Todo", milestone: "🚨 Launch Critical", blockedBy: ["UX-015", "UX-013", "UX-014"] },
  { id: "UX-035", order: 8, priority: 2, state: "Todo", milestone: "🚨 Launch Critical", blockedBy: [], note: "Prod verify for merged UX-003 / SAN-316" },
  { id: "UX-021", order: 9, priority: 1, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: [] },
  { id: "UX-022", order: 10, priority: 1, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: ["UX-014"] },
  { id: "UX-027", order: 11, priority: 1, state: "In Review", milestone: "🚨 Launch Critical", updateIdentifier: "SAN-324", blockedBy: [] },
  { id: "UX-020", order: 12, priority: 3, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: ["UX-022"] },
  { id: "UX-023", order: 13, priority: 2, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: ["UX-020"] },
  { id: "UX-024", order: 14, priority: 2, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: ["UX-023"] },
  { id: "UX-025", order: 15, priority: 2, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: ["UX-023"] },
  { id: "UX-028", order: 16, priority: 2, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: ["UX-025"] },
  { id: "UX-030", order: 17, priority: 2, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: ["UX-022"] },
  { id: "UX-026", order: 18, priority: 3, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: ["UX-023"] },
  { id: "UX-029", order: 19, priority: 3, state: "Todo", milestone: "🍽️ Discovery — UI", blockedBy: ["UX-026"] },
  { id: "UX-032", order: 20, priority: 3, state: "Todo", milestone: "🚨 Launch Critical", updateIdentifier: "SAN-321", blockedBy: ["UX-015"] },
  { id: "UX-033", order: 21, priority: 3, state: "Todo", milestone: "🚨 Launch Critical", updateIdentifier: "SAN-323", blockedBy: ["UX-015"] },
  { id: "UX-034", order: 22, priority: 3, state: "Todo", milestone: "🚨 Launch Critical", updateIdentifier: "SAN-322", blockedBy: ["UX-015", "UX-031"] },
  { id: "UX-018", order: 23, priority: 3, state: "Backlog", milestone: "Deferred — Grounding search", blockedBy: [] },
];

const FILE_BY_ID = Object.fromEntries(
  readdirSync(TASKS_DIR)
    .filter((f) => f.startsWith("UX-") && f.endsWith(".md") && !f.includes("LEGACY") && !f.includes("VERIFICATION") && !f.includes("STRATEGY"))
    .map((f) => {
      const m = f.match(/^(UX-\d+)/);
      return m ? [m[1], f] : null;
    })
    .filter(Boolean),
);

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

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseFrontmatter(body) {
  const m = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return fm;
}

function buildDescription(task, file, body) {
  const fm = parseFrontmatter(body);
  const header = [
    `**Track:** UX PR-stack remediation · **ux-stack:${String(task.order).padStart(2, "0")}**`,
    `**Spec:** \`tasks/ux/tasks/${file}\``,
    `**Index:** [\`tasks/ux/tasks/INDEX.md\`](../../tasks/ux/tasks/INDEX.md)`,
    `**View:** [UX tasks](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725)`,
  ];
  if (task.note) header.push(`**Note:** ${task.note}`);
  if (fm.legacy_from) header.push(`**Legacy:** supersedes \`${fm.legacy_from}\``);
  if (fm.depends_on) header.push(`**Depends:** ${fm.depends_on}`);
  return `${header.join("\n\n")}\n\n---\n\n${body.replace(/^---[\s\S]*?---\r?\n/, "").slice(0, 10000)}`;
}

async function resolveStates() {
  const { data } = await gql(
    `query($teamId: String!) {
      team(id: $teamId) { states { nodes { id name type } } }
    }`,
    { teamId: TEAM_ID },
  );
  const map = {};
  for (const s of data.team.states.nodes) {
    map[s.name] = s.id;
  }
  return map;
}

async function fetchMilestones() {
  const { data } = await gql(
    `query($projectId: String!) {
      project(id: $projectId) { projectMilestones { nodes { id name } } }
    }`,
    { projectId: PROJECT_ID },
  );
  return new Map(data.project.projectMilestones.nodes.map((m) => [m.name, m.id]));
}

async function fetchLabels() {
  const { data } = await gql(
    `query($teamId: String!) {
      team(id: $teamId) { labels { nodes { id name } } }
    }`,
    { teamId: TEAM_ID },
  );
  return new Map(data.team.labels.nodes.map((l) => [l.name, l.id]));
}

async function ensureLabel(existing, spec) {
  if (existing.has(spec.name)) return existing.get(spec.name);
  if (DRY_RUN) return `dry-${spec.name}`;
  try {
    const { data } = await gql(
      `mutation($input: IssueLabelCreateInput!) {
        issueLabelCreate(input: $input) { success issueLabel { id name } }
      }`,
      { input: { teamId: TEAM_ID, name: spec.name, color: spec.color, description: spec.description } },
    );
    if (data.issueLabelCreate?.issueLabel?.id) {
      existing.set(spec.name, data.issueLabelCreate.issueLabel.id);
      return data.issueLabelCreate.issueLabel.id;
    }
  } catch (err) {
    if (!/duplicate label/i.test(err.message)) throw err;
  }
  const fresh = await fetchLabels();
  for (const [name, id] of fresh) existing.set(name, id);
  if (!existing.has(spec.name)) {
    throw new Error(`label missing after duplicate: ${spec.name}`);
  }
  return existing.get(spec.name);
}

async function fetchIssueByIdentifier(identifier) {
  const { data } = await gql(
    `query($id: String!) {
      issue(id: $id) { id identifier title url }
    }`,
    { id: identifier },
  );
  return data.issue;
}

async function fetchExistingByPrefix() {
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
  const byPrefix = new Map();
  for (const issue of issues) {
    const prefix = issue.title.split(" — ")[0];
    byPrefix.set(prefix, issue);
  }
  return byPrefix;
}

async function main() {
  const states = await resolveStates();
  const milestones = await fetchMilestones();
  const labels = await fetchLabels();

  await ensureLabel(labels, {
    name: "track:ux",
    color: "#EB5757",
    description: "UX track",
  }).catch(() => {});
  for (const task of UX_STACK) {
    await ensureLabel(labels, {
      name: `ux-stack:${String(task.order).padStart(2, "0")}`,
      color: "#F2994A",
      description: `UX stack order ${task.order} — ${task.id}`,
    });
  }

  const byPrefix = await fetchExistingByPrefix();
  const idToLinear = {};
  const log = { created: [], updated: [], errors: [], relations: [], sort: [] };

  for (const task of UX_STACK) {
    const file = FILE_BY_ID[task.id];
    if (!file) {
      log.errors.push({ id: task.id, error: "missing spec file" });
      continue;
    }
    const body = readFileSync(join(TASKS_DIR, file), "utf8");
    const fm = parseFrontmatter(body);
    const title = `${task.id} — ${fm.title || task.id}`;
    const description = buildDescription(task, file, body);
    const labelIds = [
      labels.get("track:ux"),
      labels.get(`ux-stack:${String(task.order).padStart(2, "0")}`),
      labels.get("phase-1"),
    ].filter(Boolean);
    const milestoneId = milestones.get(task.milestone);
    const stateId = states[task.state] || states.Todo;

    let existing = task.updateIdentifier
      ? await fetchIssueByIdentifier(task.updateIdentifier)
      : byPrefix.get(task.id);

    if (DRY_RUN) {
      console.log(`[dry-run] ${existing ? "update" : "create"} ${title} order=${task.order}`);
      idToLinear[task.id] = existing || { id: `dry-${task.id}`, identifier: task.updateIdentifier || `DRY-${task.id}` };
      (existing ? log.updated : log.created).push({ id: task.id, dryRun: true });
      continue;
    }

    try {
      if (existing) {
        await gql(
          `mutation($id: String!, $input: IssueUpdateInput!) {
            issueUpdate(id: $id, input: $input) { success }
          }`,
          {
            id: existing.id,
            input: {
              title,
              description,
              priority: task.priority,
              stateId,
              labelIds,
              projectMilestoneId: milestoneId || undefined,
              sortOrder: task.order * 1000,
            },
          },
        );
        idToLinear[task.id] = existing;
        log.updated.push({ id: task.id, identifier: existing.identifier, url: existing.url, order: task.order });
        console.log(`updated ${task.id} → ${existing.identifier} (order ${task.order})`);
      } else {
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
              labelIds,
              projectMilestoneId: milestoneId || undefined,
              sortOrder: task.order * 1000,
            },
          },
        );
        const issue = data.issueCreate.issue;
        idToLinear[task.id] = issue;
        byPrefix.set(task.id, issue);
        log.created.push({ id: task.id, identifier: issue.identifier, url: issue.url, order: task.order });
        console.log(`created ${task.id} → ${issue.identifier} (order ${task.order})`);
      }
      log.sort.push({ id: task.id, order: task.order, sortOrder: task.order * 1000 });
      await sleep(150);
    } catch (err) {
      log.errors.push({ id: task.id, error: err.message });
      console.error(`error ${task.id}: ${err.message}`);
    }
  }

  for (const task of UX_STACK) {
    const blocked = idToLinear[task.id];
    if (!blocked?.id || String(blocked.id).startsWith("dry-")) continue;
    for (const depId of task.blockedBy || []) {
      const blocker = idToLinear[depId];
      if (!blocker?.id || String(blocker.id).startsWith("dry-")) continue;
      if (DRY_RUN) continue;
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

  // Merge UX-005 into UX-015 on board
  if (!DRY_RUN && idToLinear["UX-015"]?.id) {
    try {
      const san319 = await fetchIssueByIdentifier("SAN-319");
      if (san319?.id && states.Canceled) {
        await gql(
          `mutation($id: String!, $input: IssueUpdateInput!) {
            issueUpdate(id: $id, input: $input) { success }
          }`,
          {
            id: san319.id,
            input: {
              stateId: states.Canceled,
              description: `**Superseded by ${idToLinear["UX-015"].identifier} (UX-015)** — thinking indicator ships in same PR #17.\n\nSpec: tasks/ux/tasks/UX-015-ship-pr17-error-bridge-split-scope.md`,
            },
          },
        );
        console.log("canceled SAN-319 → superseded by UX-015");
      }
    } catch (err) {
      log.errors.push({ id: "SAN-319-merge", error: err.message });
    }
  }

  const outPath = join(ROOT, "tasks/linear/ux-stack-import-log.json");
  writeFileSync(
    outPath,
    JSON.stringify({ generated: new Date().toISOString(), issues: UX_STACK.map((t) => ({ ...t, linear: idToLinear[t.id] })), ...log }, null, 2),
  );
  console.log(`\nDone. created=${log.created.length} updated=${log.updated.length} errors=${log.errors.length}`);
  console.log(`Log: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
