#!/usr/bin/env node
/**
 * Apply human-readable MVP titles, area labels, milestone rename, and missing P0 issues.
 *
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-apply-product-titles.mjs --dry-run
 *   node scripts/linear-apply-product-titles.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const API_KEY = process.env.LINEAR_API_KEY;
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";
const LAUNCH_MS = "🚨 Launch Critical";
const OLD_P0_MS = "P0 — MVP gates";

const STATE = {
  Todo: "1c623f30-d632-4571-bfd8-67e121a6376f",
  Done: "0627f54f-ca57-4969-b6df-8ff21c236f7d",
  Canceled: "86cab00d-3256-4bb9-b839-2e65f869567a",
  Backlog: "a629f971-4b1d-46b6-8807-23a0c173a601",
};

const AREA_LABELS = [
  { name: "area:launch", color: "#EB5757" },
  { name: "area:stability", color: "#F2C94C" },
  { name: "area:maps", color: "#26B5CE" },
  { name: "area:venues", color: "#BB6BD9" },
  { name: "area:events", color: "#F2994A" },
  { name: "area:rentals", color: "#56CCF2" },
  { name: "area:concierge", color: "#6FCF97" },
  { name: "area:payments", color: "#27AE60" },
  { name: "area:future", color: "#828282" },
];

/** identifier → product title + metadata */
const TITLE_UPDATES = [
  {
    id: "SAN-178",
    title: "Prove live ticket purchase on production",
    spec: "OPS-ANDRES-G1",
    imp: "079",
    persona: "Andrés",
    areas: ["area:launch", "area:payments"],
  },
  {
    id: "SAN-116",
    title: "Isolate ticket vs sponsor Stripe webhooks",
    spec: "EVP-003-core",
    imp: "080",
    persona: "Andrés",
    areas: ["area:launch", "area:payments"],
  },
  {
    id: "SAN-117",
    title: "Fix event cards inside AI chat",
    spec: "EVP-013-core",
    imp: "081",
    persona: "Andrés / Tourist",
    areas: ["area:launch", "area:events"],
  },
  {
    id: "SAN-115",
    title: "Sign off MVP launch proof checklist",
    spec: "EVP-001-core",
    imp: "083",
    persona: "All personas",
    areas: ["area:launch"],
  },
  {
    id: "SAN-100",
    title: "Run production smoke tests on mdeai.co",
    spec: "F32",
    imp: "084",
    persona: "Sofía",
    areas: ["area:launch", "area:stability"],
    milestone: LAUNCH_MS,
  },
  {
    id: "SAN-114",
    title: "Build café discovery cards (Phase A shipped)",
    spec: "SCREEN-021",
    imp: "063",
    persona: "Tourist / Camila",
    areas: ["area:venues"],
    state: "Done",
    milestone: "P1 — Screens & café",
  },
  {
    id: "SAN-316",
    title: "Fix rental price parsing (“$500 a night”)",
    spec: "UX-003",
    imp: "093",
    persona: "Camila",
    areas: ["area:launch", "area:rentals", "area:concierge"],
  },
  {
    id: "SAN-320",
    title: "Show retryable errors when AI chat fails",
    spec: "UX-002",
    imp: "094",
    persona: "Tourist",
    areas: ["area:launch", "area:concierge"],
  },
  {
    id: "SAN-319",
    title: "Add visible “thinking” state in AI chat",
    spec: "UX-005",
    imp: "095",
    persona: "Tourist",
    areas: ["area:launch", "area:concierge"],
  },
  {
    id: "SAN-322",
    title: "Add production AI chat health monitor",
    spec: "UX-009",
    imp: "101",
    persona: "Sofía",
    areas: ["area:launch", "area:stability", "area:concierge"],
  },
  {
    id: "SAN-321",
    title: "Reset chat and map on “New chat”",
    spec: "UX-006",
    imp: "098",
    persona: "Camila",
    areas: ["area:launch", "area:concierge"],
  },
  {
    id: "SAN-323",
    title: "Clear ghost map pins after empty search",
    spec: "UX-007",
    imp: "099",
    persona: "Camila",
    areas: ["area:launch", "area:maps", "area:concierge"],
  },
  {
    id: "SAN-324",
    title: "Fix confusing Save button tooltip",
    spec: "UX-008",
    imp: "100",
    persona: "Camila",
    areas: ["area:launch", "area:rentals"],
  },
  {
    id: "SAN-315",
    title: "Restore AI concierge on production",
    spec: "UX-001",
    imp: "097",
    persona: "Tourist",
    areas: ["area:concierge"],
  },
  {
    id: "SAN-317",
    title: "Disable broken category chips if concierge fails (optional)",
    spec: "UX-004",
    imp: "096",
    persona: "Tourist",
    areas: ["area:future"],
    state: "Canceled",
    milestone: LAUNCH_MS,
  },
  {
    id: "SAN-318",
    title: "Unify search result cards (one card, one pin)",
    spec: "UX-010",
    imp: "102",
    persona: "Camila / Tourist",
    areas: ["area:concierge"],
    milestone: "P1 — Screens & café",
  },
  {
    id: "SAN-118",
    title: "Build Roberto’s “My events” dashboard",
    spec: "EVP-014-core",
    imp: "086",
    persona: "Roberto",
    areas: ["area:events"],
    milestone: "P1 — Events polish",
  },
];

const CREATE_ISSUES = [
  {
    taskId: "G3-core-host-publish-proof",
    title: "Prove Roberto can publish an event on production",
    spec: "tasks/events/tasks/G3-core-host-publish-proof.md",
    imp: "082",
    persona: "Roberto",
    areas: ["area:launch", "area:events"],
    priority: 1,
    blocks: ["SAN-115"],
  },
  {
    taskId: "AUTH-011",
    title: "Verify production login and Vercel env",
    spec: "tasks/data/tasks-data/AUTH-011-production-auth-checklist.md",
    imp: "085",
    persona: "Camila / Roberto",
    areas: ["area:launch", "area:stability"],
    priority: 2,
  },
  {
    taskId: "MAP-002B",
    title: "Deploy grounded place search to production",
    spec: "tasks/maps/MAP-002B-prod-adk-deploy.md",
    imp: "091",
    persona: "Camila / Tourist",
    areas: ["area:launch", "area:maps"],
    priority: 2,
  },
  {
    taskId: "MAP-008B",
    title: "Verify Google Maps pins on production",
    spec: "tasks/maps/MAP-008B-vercel-map-id-verify.md",
    imp: "092",
    persona: "Camila",
    areas: ["area:launch", "area:maps"],
    priority: 2,
  },
];

const UX_SUB_ISSUES = [
  { id: "SAN-360", title: "Extract shared result card shell" },
  { id: "SAN-361", title: "Remove duplicate search results panel" },
  { id: "SAN-362", title: "Build rich restaurant result cards" },
  { id: "SAN-363", title: "Build rich attraction result cards" },
  { id: "SAN-364", title: "Clean up orphan cards and event citations" },
  { id: "SAN-365", title: "Add tests for unified result cards" },
];

const report = { dryRun: DRY_RUN, updated: [], created: [], errors: [] };

if (!API_KEY && !DRY_RUN) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

async function gql(query, variables = {}) {
  if (DRY_RUN && query.trim().startsWith("mutation")) {
    return { data: {} };
  }
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

function trackingBlock(row) {
  return [
    `**Spec:** \`${row.spec}\` · **IMP:** ${row.imp} · **Persona:** ${row.persona}`,
    "",
    "| Field | Value |",
    "|-------|-------|",
    `| Task ID | \`${row.spec.split("/").pop()?.replace(".md", "") || row.spec}\` |`,
    `| Spec path | \`${row.spec}\` |`,
    `| Board group | ${(row.areas || []).join(", ")} |`,
    "",
    "_Title updated by `scripts/linear-apply-product-titles.mjs` (2026-05-30)._",
  ].join("\n");
}

async function ensureAreaLabels() {
  const { data } = await gql(
    `query($teamId: String!) { team(id: $teamId) { labels { nodes { id name } } } }`,
    { teamId: TEAM_ID },
  );
  const map = new Map(data.team.labels.nodes.map((l) => [l.name, l.id]));
  for (const spec of AREA_LABELS) {
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
    await sleep(80);
  }
  return map;
}

async function fetchMilestones() {
  const { data } = await gql(
    `query($id: String!) { project(id: $id) { projectMilestones { nodes { id name } } } }`,
    { id: PROJECT_ID },
  );
  return new Map(data.project.projectMilestones.nodes.map((m) => [m.name, m.id]));
}

async function renameLaunchMilestone(msMap) {
  const oldId = msMap.get(OLD_P0_MS);
  if (!oldId) {
    report.errors.push(`Milestone not found: ${OLD_P0_MS}`);
    return;
  }
  if (DRY_RUN) {
    report.updated.push({ type: "milestone", from: OLD_P0_MS, to: LAUNCH_MS });
    msMap.set(LAUNCH_MS, oldId);
    msMap.delete(OLD_P0_MS);
    return;
  }
  await gql(
    `mutation($id: String!, $input: ProjectMilestoneUpdateInput!) {
      projectMilestoneUpdate(id: $id, input: $input) { success }
    }`,
    {
      id: oldId,
      input: {
        name: LAUNCH_MS,
        description:
          "Launch blockers: paid tickets, webhooks, event cards, host publish, prod UX, smoke, auth, maps on mdeai.co",
      },
    },
  );
  msMap.set(LAUNCH_MS, oldId);
  msMap.delete(OLD_P0_MS);
  report.updated.push({ type: "milestone", from: OLD_P0_MS, to: LAUNCH_MS });
  await sleep(120);
}

async function fetchIssue(identifier) {
  const { data } = await gql(
    `query($id: String!) {
      issue(id: $id) {
        id identifier title description
        labels { nodes { id name } }
        projectMilestone { id name }
      }
    }`,
    { id: identifier },
  );
  return data.issue;
}

async function updateIssue(row, labelMap, msMap) {
  const issue = await fetchIssue(row.id);
  if (!issue) {
    report.errors.push({ id: row.id, error: "not found" });
    return;
  }

  const msName = row.milestone ?? LAUNCH_MS;
  const msId = msMap.get(msName);
  const wantLabels = new Set([
    ...issue.labels.nodes.map((l) => l.name),
    ...(row.areas || []),
    "mvp",
    "phase-1",
  ]);
  if (row.spec.startsWith("UX-")) wantLabels.add("track:ux");
  if (row.spec.startsWith("EVP") || row.spec === "OPS-ANDRES-G1") wantLabels.add("track:events");
  const labelIds = [...wantLabels].map((n) => labelMap.get(n)).filter(Boolean);

  const prior = issue.description?.trim() || "";
  const desc =
    prior && !prior.includes("linear-apply-product-titles")
      ? `${trackingBlock(row)}\n\n---\n\n${prior}`
      : trackingBlock(row);

  const input = {
    title: row.title,
    description: desc,
    ...(msId ? { projectMilestoneId: msId } : {}),
    ...(labelIds.length ? { labelIds } : {}),
    ...(row.state ? { stateId: STATE[row.state] } : {}),
  };

  if (DRY_RUN) {
    report.updated.push({ id: row.id, title: row.title, state: row.state });
    return;
  }

  await gql(
    `mutation($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) { success }
    }`,
    { id: issue.id, input },
  );
  report.updated.push({ id: row.id, title: row.title, state: row.state });
  await sleep(100);
}

async function createIssue(row, labelMap, msMap) {
  const msId = msMap.get(LAUNCH_MS);
  const labelNames = new Set([...(row.areas || []), "mvp", "phase-1", "production", "blocking"]);
  if (row.taskId.startsWith("AUTH")) labelNames.add("track:core");
  if (row.taskId.startsWith("MAP")) labelNames.add("track:maps");
  if (row.taskId.startsWith("G3")) labelNames.add("track:events");
  const labelIds = [...labelNames].map((n) => labelMap.get(n)).filter(Boolean);

  const desc = trackingBlock({
    spec: row.spec,
    imp: row.imp,
    persona: row.persona,
    areas: row.areas,
  });

  if (DRY_RUN) {
    report.created.push({ taskId: row.taskId, title: row.title, dryRun: true });
    return null;
  }

  const { data } = await gql(
    `mutation($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { id identifier title url } }
    }`,
    {
      input: {
        teamId: TEAM_ID,
        projectId: PROJECT_ID,
        title: row.title,
        description: desc,
        priority: row.priority,
        stateId: STATE.Todo,
        labelIds,
        ...(msId ? { projectMilestoneId: msId } : {}),
      },
    },
  );
  const issue = data.issueCreate.issue;
  if (row.blocks?.length) {
    for (const blocker of row.blocks) {
      const b = await fetchIssue(blocker);
      if (b) {
        await gql(
          `mutation($input: IssueRelationCreateInput!) {
            issueRelationCreate(input: $input) { success }
          }`,
          {
            input: {
              issueId: b.id,
              relatedIssueId: issue.id,
              type: "blocks",
            },
          },
        );
        await sleep(60);
      }
    }
  }
  report.created.push({
    taskId: row.taskId,
    identifier: issue.identifier,
    url: issue.url,
  });
  await sleep(120);
  return issue;
}

async function main() {
  const labelMap = await ensureAreaLabels();
  let msMap = await fetchMilestones();
  await renameLaunchMilestone(msMap);
  msMap = await fetchMilestones();

  for (const row of TITLE_UPDATES) {
    try {
      await updateIssue(row, labelMap, msMap);
    } catch (e) {
      report.errors.push({ id: row.id, error: String(e.message || e) });
    }
  }

  for (const sub of UX_SUB_ISSUES) {
    try {
      await updateIssue(
        { ...sub, spec: "UX-010", imp: "102", persona: "Camila", areas: ["area:concierge"], milestone: "P1 — Screens & café" },
        labelMap,
        msMap,
      );
    } catch (e) {
      report.errors.push({ id: sub.id, error: String(e.message || e) });
    }
  }

  for (const row of CREATE_ISSUES) {
    try {
      await createIssue(row, labelMap, msMap);
    } catch (e) {
      report.errors.push({ taskId: row.taskId, error: String(e.message || e) });
    }
  }

  const outPath = join(ROOT, "tasks/linear/product-titles-apply-log.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nWrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
