#!/usr/bin/env node
/**
 * Prefix Linear issue titles with [IMP-NNN] from implementation-order.json
 *
 * Title format: [IMP-042] TASK-ID — rest of title
 *
 * Usage:
 *   node scripts/linear-build-implementation-order.mjs   # refresh manifest first
 *   node scripts/linear-apply-imp-numbers.mjs --dry-run
 *   node scripts/linear-apply-imp-numbers.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";
const API_KEY = process.env.LINEAR_API_KEY;
const DRY_RUN = process.argv.includes("--dry-run");

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

function parseTaskId(title) {
  const stripped = title.replace(/^\[IMP-\d+\]\s*/, "");
  return stripped.split(" — ")[0]?.trim() ?? stripped;
}

function buildTitle(imp, taskId, rest) {
  const suffix = rest ? ` — ${rest}` : "";
  return `[IMP-${imp}] ${taskId}${suffix}`;
}

async function fetchProjectIssues() {
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
  const manifest = JSON.parse(
    readFileSync(join(ROOT, "tasks/linear/implementation-order.json"), "utf8"),
  );
  const impByTask = new Map(manifest.rows.filter((r) => r.inLinear).map((r) => [r.taskId, r.imp]));

  const issues = await fetchProjectIssues();
  const log = { updated: [], skipped: [], dryRun: DRY_RUN };

  for (const issue of issues) {
    const taskId = parseTaskId(issue.title);
    const imp = impByTask.get(taskId);
    if (!imp) {
      log.skipped.push({ identifier: issue.identifier, taskId, reason: "no IMP mapping" });
      continue;
    }

    const parts = issue.title.replace(/^\[IMP-\d+\]\s*/, "").split(" — ");
    const rest = parts.slice(1).join(" — ");
    const newTitle = buildTitle(imp, taskId, rest);

    if (newTitle === issue.title) {
      log.skipped.push({ identifier: issue.identifier, taskId, imp, reason: "already prefixed" });
      continue;
    }

    if (DRY_RUN) {
      console.log(`${issue.identifier}: ${issue.title.slice(0, 50)}… → ${newTitle.slice(0, 60)}…`);
      continue;
    }

    await gql(
      `mutation($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) { success }
      }`,
      { id: issue.id, input: { title: newTitle } },
    );
    log.updated.push({ identifier: issue.identifier, taskId, imp, title: newTitle });
    await sleep(55);
  }

  if (!DRY_RUN) {
    console.log(`Updated ${log.updated.length} titles with [IMP-NNN] prefix`);
    console.log(`Skipped ${log.skipped.length}`);
  }

  writeFileSync(join(ROOT, "tasks/linear/imp-apply-log.json"), JSON.stringify(log, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
