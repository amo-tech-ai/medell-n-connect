#!/usr/bin/env node
/**
 * Sync Linear titles to canonical SPEC-IDs (mvp-canonical-titles.json).
 * SAN-* immutable. Does not change states or milestones.
 *
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-sync-mvp-titles.mjs --dry-run
 *   node scripts/linear-sync-mvp-titles.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const API_KEY = process.env.LINEAR_API_KEY;

if (!API_KEY && !DRY_RUN) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

const catalog = JSON.parse(
  readFileSync(join(ROOT, "tasks/linear/mvp-canonical-titles.json"), "utf8"),
);
const rows = catalog.titles;

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

async function main() {
  const log = { updated: [], skipped: [], errors: [], collisions: [] };
  const seen = new Map();

  for (const row of rows) {
    const title = `${row.spec_id} — ${row.title}`;
    if (seen.has(row.spec_id)) {
      log.collisions.push({ spec_id: row.spec_id, linear: [seen.get(row.spec_id), row.linear] });
    }
    seen.set(row.spec_id, row.linear);

    if (DRY_RUN) {
      console.log(`[dry-run] ${row.linear} → ${title}`);
      log.updated.push({ linear: row.linear, title, was: row.was, dryRun: true });
      continue;
    }
    try {
      const { data } = await gql(
        `query($id: String!) { issue(id: $id) { id identifier title } }`,
        { id: row.linear },
      );
      const issue = data.issue;
      if (!issue) {
        log.errors.push({ linear: row.linear, error: "not found" });
        continue;
      }
      if (issue.title === title) {
        log.skipped.push({ linear: row.linear, title });
        continue;
      }
      await gql(
        `mutation($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success } }`,
        { id: issue.id, input: { title } },
      );
      console.log(`${issue.identifier}: ${issue.title} → ${title}`);
      log.updated.push({ linear: row.linear, from: issue.title, to: title });
      await new Promise((r) => setTimeout(r, 120));
    } catch (e) {
      log.errors.push({ linear: row.linear, error: e.message });
    }
  }

  const out = join(ROOT, "tasks/linear/mvp-title-sync-log.json");
  writeFileSync(
    out,
    `${JSON.stringify({ generated: new Date().toISOString(), dryRun: DRY_RUN, ...log }, null, 2)}\n`,
  );
  console.log(`\nupdated=${log.updated.length} skipped=${log.skipped.length} errors=${log.errors.length} collisions=${log.collisions.length}`);
  if (log.collisions.length) console.warn("Collisions:", log.collisions);
  console.log(`Log: ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
