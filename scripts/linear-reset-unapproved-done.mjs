#!/usr/bin/env node
/**
 * Move MDEAPP Done issues → In Review unless label `approved-done` is set.
 * Policy: only the user approves completion (see tasks/linear/04-completion-approval.md).
 *
 * Usage:
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-reset-unapproved-done.mjs
 *   node scripts/linear-reset-unapproved-done.mjs --dry-run
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const API_KEY = process.env.LINEAR_API_KEY;
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";
const IN_REVIEW = "19528451-7c5f-4c8e-9831-c59387239233";
const APPROVAL_LABEL = "approved-done";

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

async function fetchDoneIssues() {
  const issues = [];
  let cursor = null;
  for (;;) {
    const { data } = await gql(
      `query($id: String!, $after: String) {
        project(id: $id) {
          issues(first: 50, after: $after, filter: { state: { name: { eq: "Done" } } }) {
            nodes {
              id identifier title description
              labels { nodes { name } }
              completedAt createdAt
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

function isAutoImported(issue) {
  if (!issue.completedAt || !issue.createdAt) return false;
  const delta = new Date(issue.completedAt) - new Date(issue.createdAt);
  return delta < 5000; // bulk import closed within 5s of create
}

async function main() {
  const issues = DRY_RUN ? [] : await fetchDoneIssues();
  const report = { moved: [], skipped: [], dryRun: DRY_RUN, at: new Date().toISOString() };

  console.log(`Done issues in MDEAPP: ${issues.length}`);

  for (const issue of issues) {
    const labels = issue.labels.nodes.map((l) => l.name);
    if (labels.includes(APPROVAL_LABEL)) {
      report.skipped.push({ id: issue.identifier, reason: "approved-done label" });
      continue;
    }

    const note = `\n\n---\n**Completion approval pending** (${report.at.slice(0, 10)}) — moved from Done → In Review. User must approve before Done. Evidence may exist on disk; see \`tasks/evidence/\`.${isAutoImported(issue) ? " _(auto-imported without approval)_" : ""}`;
    const description = (issue.description || "") + note;

    if (DRY_RUN) {
      report.moved.push({ id: issue.identifier, title: issue.title, autoImported: isAutoImported(issue) });
      continue;
    }

    await gql(
      `mutation($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) { success }
      }`,
      { id: issue.id, input: { stateId: IN_REVIEW, description } },
    );
    report.moved.push({ id: issue.identifier, title: issue.title, autoImported: isAutoImported(issue) });
    await sleep(80);
  }

  const out = join(ROOT, "tasks/linear/reset-unapproved-done.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`Moved: ${report.moved.length} · Skipped (approved): ${report.skipped.length}`);
  console.log(`Log: ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
