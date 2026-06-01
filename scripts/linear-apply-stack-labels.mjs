#!/usr/bin/env node
/**
 * Add stack:* labels from prefix:* (merge — never drop track:* or phase:*).
 *
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-fetch-all-issues.mjs
 *   node scripts/linear-apply-stack-labels.mjs --dry-run
 *   node scripts/linear-apply-stack-labels.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const API_KEY = process.env.LINEAR_API_KEY;

const STACK_DEFS = [
  { name: "stack:mastra", color: "#5E6AD2" },
  { name: "stack:copilotkit", color: "#7B61FF" },
  { name: "stack:nextjs", color: "#000000" },
  { name: "stack:supabase", color: "#3ECF8E" },
  { name: "stack:maps", color: "#34A853" },
  { name: "stack:stripe", color: "#635BFF" },
  { name: "stack:gemini", color: "#4285F4" },
  { name: "stack:playwright", color: "#2EAD33" },
  { name: "stack:openclaw", color: "#828282" },
  { name: "stack:whatsapp", color: "#25D366" },
];

/** prefix label suffix → stack labels (1–3) */
const PREFIX_STACKS = {
  EVT: ["stack:stripe", "stack:mastra", "stack:nextjs"],
  PAY: ["stack:stripe", "stack:nextjs"],
  MAP: ["stack:maps", "stack:gemini", "stack:nextjs"],
  AIA: ["stack:mastra", "stack:copilotkit", "stack:gemini"],
  ATH: ["stack:supabase", "stack:nextjs"],
  OPS: ["stack:nextjs"],
  RNT: ["stack:nextjs", "stack:mastra"],
  CAF: ["stack:maps", "stack:copilotkit", "stack:nextjs"],
  VEN: ["stack:supabase", "stack:maps"],
  TRP: ["stack:supabase", "stack:maps", "stack:nextjs"],
  UIX: ["stack:nextjs", "stack:playwright"],
  SYS: ["stack:supabase", "stack:nextjs"],
  AUT: ["stack:openclaw"],
  ADM: ["stack:supabase", "stack:nextjs"],
};

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

async function loadLabelMap() {
  const map = new Map();
  let after;
  do {
    const { data } = await gql(
      `query($teamId: String!, $after: String) {
        team(id: $teamId) {
          labels(first: 100, after: $after) { nodes { id name } pageInfo { hasNextPage endCursor } }
        }
      }`,
      { teamId: TEAM_ID, after: after ?? null },
    );
    for (const l of data.team.labels.nodes) map.set(l.name, l.id);
    after = data.team.labels.pageInfo.hasNextPage ? data.team.labels.pageInfo.endCursor : null;
  } while (after);

  for (const def of STACK_DEFS) {
    if (map.has(def.name)) continue;
    if (DRY_RUN) {
      map.set(def.name, `dry-${def.name}`);
      continue;
    }
    try {
      const { data: c } = await gql(
        `mutation($input: IssueLabelCreateInput!) { issueLabelCreate(input: $input) { success issueLabel { id name } } }`,
        {
          input: {
            name: def.name,
            color: def.color,
            description: `Tech stack — ${def.name.replace("stack:", "")}`,
            teamId: TEAM_ID,
          },
        },
      );
      map.set(def.name, c.issueLabelCreate.issueLabel.id);
    } catch (e) {
      if (!String(e.message).includes("duplicate")) throw e;
    }
    await sleep(60);
  }
  return map;
}

function stacksForIssue(issue) {
  const names = issue.labels.nodes.map((l) => l.name);
  const stacks = new Set();
  const prefix = names.find((n) => n.startsWith("prefix:"));
  if (prefix) {
    const key = prefix.replace("prefix:", "");
    for (const s of PREFIX_STACKS[key] ?? []) stacks.add(s);
  }
  if (names.includes("track:data")) stacks.add("stack:supabase");
  if (names.includes("track:ux")) {
    stacks.add("stack:copilotkit");
    stacks.add("stack:mastra");
  }
  if (/playwright|e2e|SCREEN-/i.test(issue.title) || names.some((n) => n.includes("UIX"))) {
    stacks.add("stack:playwright");
  }
  return [...stacks];
}

async function updateIssue(issue, stacks, labelMap, report) {
  if (!stacks.length) {
    report.skipped.push(issue.identifier);
    return;
  }
  const existingByName = new Map(issue.labels.nodes.map((l) => [l.name, l.id]));
  const want = new Set([...issue.labels.nodes.map((l) => l.name), ...stacks]);
  const labelIds = [...want].map((n) => labelMap.get(n) ?? existingByName.get(n)).filter(Boolean);
  const had = stacks.filter((s) => existingByName.has(s));
  if (had.length === stacks.length) {
    report.unchanged.push(issue.identifier);
    return;
  }
  if (DRY_RUN) {
    report.updated.push({ id: issue.identifier, add: stacks.filter((s) => !existingByName.has(s)) });
    return;
  }
  await gql(
    `mutation($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success } }`,
    { id: issue.id, input: { labelIds } },
  );
  report.updated.push({ id: issue.identifier, add: stacks.filter((s) => !existingByName.has(s)) });
  await sleep(65);
}

async function main() {
  const snapshot = JSON.parse(readFileSync(join(ROOT, "tasks/linear/linear-issues-snapshot.json"), "utf8"));
  const labelMap = await loadLabelMap();
  const report = { updated: [], unchanged: [], skipped: [] };

  for (const row of snapshot) {
    const { data } = await gql(
      `query($id: String!) { issue(id: $id) { id identifier title labels { nodes { id name } } } }`,
      { id: row.identifier },
    );
    const issue = data.issue;
    if (!issue) continue;
    const stacks = stacksForIssue(issue);
    await updateIssue(issue, stacks, labelMap, report);
  }

  const out = join(ROOT, "tasks/linear/stack-labels-apply-log.json");
  const payload = { generated: new Date().toISOString(), dryRun: DRY_RUN, total: snapshot.length, ...report };
  writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify({ ...payload, updated: payload.updated.length, unchanged: payload.unchanged.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
