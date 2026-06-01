#!/usr/bin/env node
/**
 * Re-apply track:ux and track:data after prefix-catalog migration stripped them.
 * Views filter on these labels — issues still exist on MDEAPP project.
 *
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-restore-track-labels.mjs --dry-run
 *   node scripts/linear-restore-track-labels.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const API_KEY = process.env.LINEAR_API_KEY;

const UX_IDS = JSON.parse(readFileSync(join(ROOT, "tasks/linear/ux-import-log.json"), "utf8")).issues.map(
  (i) => i.identifier,
);
// UX-010 sub-issues
for (const id of ["SAN-360", "SAN-361", "SAN-362", "SAN-363", "SAN-364", "SAN-365"]) {
  if (!UX_IDS.includes(id)) UX_IDS.push(id);
}

const DATA_IDS = JSON.parse(readFileSync(join(ROOT, "tasks/linear/data-import-log.json"), "utf8")).created.map(
  (i) => i.identifier,
);

const TRACK_LABELS = [
  { name: "track:ux", color: "#9B51E0", description: "UX prod remediation — Camila/Tourist chat" },
  { name: "track:data", color: "#2F80ED", description: "Data layer — Supabase foundation pack" },
];

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

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function ensureLabels() {
  const map = new Map();
  let after;
  do {
    const { data } = await gql(
      `query($teamId: String!, $after: String) {
        team(id: $teamId) {
          labels(first: 100, after: $after) {
            nodes { id name }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`,
      { teamId: TEAM_ID, after: after ?? null },
    );
    for (const l of data.team.labels.nodes) map.set(l.name, l.id);
    after = data.team.labels.pageInfo.hasNextPage ? data.team.labels.pageInfo.endCursor : null;
  } while (after);

  for (const def of TRACK_LABELS) {
    if (map.has(def.name)) continue;
    if (DRY_RUN) {
      map.set(def.name, `dry-${def.name}`);
      continue;
    }
    try {
      const { data: c } = await gql(
        `mutation($input: IssueLabelCreateInput!) { issueLabelCreate(input: $input) { success issueLabel { id name } } }`,
        { input: { name: def.name, color: def.color, description: def.description, teamId: TEAM_ID } },
      );
      map.set(def.name, c.issueLabelCreate.issueLabel.id);
    } catch (e) {
      if (!String(e.message).includes("duplicate")) throw e;
      const { data: again } = await gql(
        `query($filter: IssueLabelFilter!) { issueLabels(filter: $filter, first: 1) { nodes { id name } } }`,
        { filter: { name: { eq: def.name }, team: { id: { eq: TEAM_ID } } } },
      );
      const found = again.issueLabels.nodes[0];
      if (!found) throw e;
      map.set(def.name, found.id);
    }
    await sleep(80);
  }
  return map;
}

async function fetchIssue(identifier) {
  const { data } = await gql(
    `query($id: String!) { issue(id: $id) { id identifier labels { nodes { id name } } } }`,
    { id: identifier },
  );
  return data.issue;
}

async function addLabel(identifier, trackName, labelMap, report) {
  const issue = await fetchIssue(identifier);
  if (!issue) {
    report.missing.push(identifier);
    return;
  }
  const names = issue.labels.nodes.map((l) => l.name);
  if (names.includes(trackName)) {
    report.skipped.push(identifier);
    return;
  }
  const labelIds = [...issue.labels.nodes.map((l) => l.id), labelMap.get(trackName)].filter(Boolean);
  if (DRY_RUN) {
    report.updated.push({ identifier, trackName });
    return;
  }
  await gql(
    `mutation($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success } }`,
    { id: issue.id, input: { labelIds } },
  );
  report.updated.push({ identifier, trackName });
  await sleep(70);
}

async function main() {
  const labelMap = await ensureLabels();
  const report = { updated: [], skipped: [], missing: [] };

  for (const id of UX_IDS) await addLabel(id, "track:ux", labelMap, report);
  for (const id of DATA_IDS) await addLabel(id, "track:data", labelMap, report);

  const out = join(ROOT, "tasks/linear/track-labels-restore-log.json");
  const payload = {
    generated: new Date().toISOString(),
    dryRun: DRY_RUN,
    ux: UX_IDS.length,
    data: DATA_IDS.length,
    ...report,
  };
  writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify(payload, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
