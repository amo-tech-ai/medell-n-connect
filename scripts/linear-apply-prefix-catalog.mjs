#!/usr/bin/env node
/**
 * Apply PREFIX-### — Human title to all MDEAPP issues.
 * SAN-### stays as Linear ID; product code lives in title + description.
 *
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-fetch-all-issues.mjs
 *   node scripts/linear-apply-prefix-catalog.mjs --dry-run
 *   node scripts/linear-apply-prefix-catalog.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const API_KEY = process.env.LINEAR_API_KEY;
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

const LAUNCH_MS = "🚨 Launch Critical";
const MS = {
  launch: LAUNCH_MS,
  eventsPolish: "🎟️ Events — Polish",
  discoveryUi: "🍽️ Discovery — UI",
  mapsGrowth: "🗺️ Maps — Growth",
  venuesPhase2: "🍽️ Venues — Phase 2",
  tripsPhase2: "🏠 Trips — Phase 2",
  eventsDiscovery: "🔮 Events — Discovery",
  vector: "🔮 Platform — Vector",
  cti: "🔮 Coffee tours",
  openclaw: "🔮 Automation — OpenClaw",
  grounding: "🔮 Search — Grounding",
  contest: "🔮 Deferred — Contest",
};

const STATE = {
  Done: "0627f54f-ca57-4969-b6df-8ff21c236f7d",
  Canceled: "86cab00d-3256-4bb9-b839-2e65f869567a",
  Duplicate: "828458f3-58b6-4e04-8f09-52d91f3c3ba4",
  Backlog: "a629f971-4b1d-46b6-8807-23a0c173a601",
};

/** SAN → fixed catalog (launch + high-traffic) */
const EXPLICIT = {
  "SAN-178": { code: "PAY-001", title: "Prove live ticket purchase on production", spec: "OPS-ANDRES-G1", ms: MS.launch },
  "SAN-116": { code: "PAY-002", title: "Isolate ticket vs sponsor Stripe webhooks", spec: "EVP-003-core", ms: MS.launch },
  "SAN-117": { code: "EVT-001", title: "Fix event cards inside AI chat", spec: "EVP-013-core", ms: MS.launch },
  "SAN-366": { code: "EVT-002", title: "Prove Roberto can publish an event on production", spec: "G3-core-host-publish-proof", ms: MS.launch },
  "SAN-115": { code: "OPS-001", title: "Sign off MVP launch proof checklist", spec: "EVP-001-core", ms: MS.launch },
  "SAN-100": { code: "OPS-002", title: "Run production smoke tests on mdeai.co", spec: "F32", ms: MS.launch },
  "SAN-367": { code: "ATH-001", title: "Verify production login and Vercel env", spec: "AUTH-011", ms: MS.launch },
  "SAN-368": { code: "MAP-001", title: "Deploy grounded place search to production", spec: "MAP-002B", ms: MS.launch },
  "SAN-369": { code: "MAP-002", title: "Verify Google Maps pins on production", spec: "MAP-008B", ms: MS.launch },
  "SAN-315": { code: "AIA-001", title: "Restore AI concierge on production", spec: "UX-001", ms: MS.launch },
  "SAN-316": { code: "RNT-001", title: "Fix rental price parsing (“$500 a night”)", spec: "UX-003", ms: MS.launch },
  "SAN-320": { code: "AIA-002", title: "Show retryable errors when AI chat fails", spec: "UX-002", ms: MS.launch },
  "SAN-319": { code: "AIA-003", title: "Add AI chat thinking indicator", spec: "UX-005", ms: MS.launch },
  "SAN-322": { code: "OPS-003", title: "Add production AI chat health monitor", spec: "UX-009", ms: MS.launch },
  "SAN-321": { code: "AIA-004", title: "Reset chat and map on “New chat”", spec: "UX-006", ms: MS.launch },
  "SAN-323": { code: "MAP-003", title: "Clear ghost map pins after empty search", spec: "UX-007", ms: MS.launch },
  "SAN-324": { code: "UIX-001", title: "Fix confusing Save button tooltip", spec: "UX-008", ms: MS.launch },
  "SAN-317": { code: "AIA-099", title: "Disable category chips when concierge is down (optional)", spec: "UX-004", state: "Canceled", ms: MS.launch },
  "SAN-114": { code: "CAF-001", title: "Build café discovery cards in chat", spec: "SCREEN-021", state: "Done", ms: MS.discoveryUi },
  "SAN-318": { code: "AIA-010", title: "Unify search result cards (one card, one pin)", spec: "UX-010", ms: MS.discoveryUi },
  "SAN-360": { code: "AIA-011", title: "Extract shared result card shell", spec: "UX-010-M0", parent: "SAN-318", ms: MS.discoveryUi },
  "SAN-361": { code: "AIA-012", title: "Remove duplicate search results panel", spec: "UX-010-M1", parent: "SAN-318", ms: MS.discoveryUi },
  "SAN-362": { code: "VEN-001", title: "Build rich restaurant result cards", spec: "UX-010-M2", parent: "SAN-318", ms: MS.discoveryUi },
  "SAN-363": { code: "VEN-002", title: "Build rich attraction result cards", spec: "UX-010-M3", parent: "SAN-318", ms: MS.discoveryUi },
  "SAN-364": { code: "AIA-013", title: "Clean up orphan cards and event citations", spec: "UX-010-M4", parent: "SAN-318", ms: MS.discoveryUi },
  "SAN-365": { code: "AIA-014", title: "Add tests for unified result cards", spec: "UX-010-M5", parent: "SAN-318", ms: MS.discoveryUi },
  "SAN-118": { code: "EVT-003", title: "Build Roberto’s “My events” dashboard", spec: "EVP-014-core", ms: MS.eventsPolish },
  "SAN-272": { code: "CAF-099", title: "Wireframe: café listings (duplicate)", spec: "WIRE-026", duplicateOf: "SAN-114", state: "Duplicate" },
  "SAN-235": { code: "UIX-099", title: "Wireframe: chat chrome (planning)", spec: "WIRE-014", state: "Backlog", ms: MS.discoveryUi },
};

const PREFIX_LABELS = [
  "prefix:EVT", "prefix:MAP", "prefix:VEN", "prefix:CAF", "prefix:TRP", "prefix:RNT",
  "prefix:AIA", "prefix:PAY", "prefix:AUT", "prefix:SYS", "prefix:OPS", "prefix:UIX",
  "prefix:ATH", "prefix:ADM", "phase:launch", "phase:post-mvp",
];

const MILESTONE_RENAMES = [
  { from: "P1 — Events polish", to: MS.eventsPolish },
  { from: "P1 — Screens & café", to: MS.discoveryUi },
  { from: "P1 — Maps & core", to: MS.mapsGrowth },
  { from: "P1.5 — Venues MVP", to: MS.venuesPhase2 },
  { from: "P1.5 — Trips MVP", to: MS.tripsPhase2 },
  { from: "Phase 2 — Events discovery", to: MS.eventsDiscovery },
  { from: "Phase 2 — Vector", to: MS.vector },
  { from: "Phase 2 — Coffee tours (CTI)", to: MS.cti },
  { from: "Deferred — OpenClaw", to: MS.openclaw },
  { from: "Deferred — Grounding search", to: MS.grounding },
  { from: "Deferred — Contest", to: MS.contest },
];

const counters = {};
const catalog = [];
const report = { dryRun: DRY_RUN, updated: 0, skipped: 0, errors: [], milestones: [] };

if (!API_KEY && !DRY_RUN) {
  console.error("LINEAR_API_KEY required");
  process.exit(1);
}

function nextCode(prefix) {
  counters[prefix] = (counters[prefix] || 0) + 1;
  return `${prefix}-${String(counters[prefix]).padStart(3, "0")}`;
}

function parseTaskId(title) {
  const imp = title.match(/^\[IMP-\d+\]\s+([A-Z][A-Z0-9_-]+)/);
  if (imp) return imp[1];
  const wire = title.match(/^(WIRE-\d+)/);
  if (wire) return wire[1];
  const screen = title.match(/^(SCREEN-\d+)/);
  if (screen) return screen[1];
  return null;
}

function humanTitle(title, taskId) {
  if (!title.includes("[IMP-")) {
    return title.replace(/^\[UX-010 · M\d+\]\s*/, "").trim();
  }
  const parts = title.split(" — ");
  if (parts.length >= 2) return parts.slice(1).join(" — ").trim();
  return title.replace(/^\[IMP-\d+\]\s+\S+\s*—?\s*/, "").trim() || taskId;
}

function prefixFor(taskId, title, labels) {
  if (!taskId) {
    if (/concierge|RUN_ERROR|thinking/i.test(title)) return "AIA";
    if (/Stripe|webhook|payment|ticket/i.test(title)) return "PAY";
    return "SYS";
  }
  if (taskId.startsWith("MAP-") || taskId.startsWith("GS-")) return "MAP";
  if (taskId === "EVP-003-core" || taskId === "OPS-ANDRES-G1" || /webhook|STRIPE/i.test(taskId)) return "PAY";
  if (taskId.startsWith("EVP-") || taskId.startsWith("G3")) return "EVT";
  if (taskId === "EVP-001-core" || taskId === "F32") return "OPS";
  if (taskId.startsWith("UX-") || taskId.startsWith("INT-")) return "AIA";
  if (taskId.startsWith("AUTH-")) return "ATH";
  if (taskId.startsWith("VEN-") || taskId.startsWith("SCREEN-022") || taskId.startsWith("SCREEN-023")) return "VEN";
  if (taskId.startsWith("CAFE") || taskId === "SCREEN-021") return "CAF";
  if (taskId.startsWith("TRIP-")) return "TRP";
  if (taskId.startsWith("RE-")) return "RNT";
  if (taskId.startsWith("OCL-")) return "AUT";
  if (taskId.startsWith("WIRE-") || taskId.startsWith("SCREEN-")) return "UIX";
  if (taskId.startsWith("F32") || taskId.startsWith("OPS-")) return "OPS";
  if (/^F\d/.test(taskId) || taskId.startsWith("MASTRA") || taskId.startsWith("VEC-") || taskId.startsWith("data-") || taskId.startsWith("CTEST")) return "SYS";
  if (taskId.startsWith("CTI-")) return "TRP";
  if (labels.some((l) => l.includes("track:maps"))) return "MAP";
  if (labels.some((l) => l.includes("track:events"))) return "EVT";
  if (labels.some((l) => l.includes("track:ux"))) return "AIA";
  if (labels.some((l) => l.includes("surface:trips"))) return "TRP";
  if (labels.some((l) => l.includes("surface:venues"))) return "VEN";
  return "SYS";
}

function milestoneFor(taskId, msName, prefix, explicitMs) {
  if (explicitMs) return explicitMs;
  if (msName === LAUNCH_MS) return LAUNCH_MS;
  if (taskId?.startsWith("EVP-01") && parseInt(taskId.split("-")[1], 10) >= 15) return MS.eventsDiscovery;
  if (taskId?.startsWith("OCL-")) return MS.openclaw;
  if (taskId?.startsWith("GS-")) return MS.grounding;
  if (taskId?.startsWith("VEC-")) return MS.vector;
  if (taskId?.startsWith("CTI-")) return MS.cti;
  if (taskId?.startsWith("CTEST")) return MS.contest;
  if (taskId?.startsWith("VEN-") || msName?.includes("Venues")) return MS.venuesPhase2;
  if (taskId?.startsWith("TRIP-") || msName?.includes("Trips")) return MS.tripsPhase2;
  if (taskId?.startsWith("EVP-") || msName?.includes("Events polish")) return MS.eventsPolish;
  if (taskId?.startsWith("UX-") || taskId?.startsWith("SCREEN-") || taskId?.startsWith("WIRE-") || msName?.includes("Screens")) return MS.discoveryUi;
  if (taskId?.startsWith("MAP-") || msName?.includes("Maps")) return MS.mapsGrowth;
  if (prefix === "OPS" && taskId === "F32") return MS.launch;
  return msName || MS.mapsGrowth;
}

function buildEntry(issue) {
  const id = issue.identifier;
  if (EXPLICIT[id]) {
    const e = EXPLICIT[id];
    return {
      linearId: issue.id,
      identifier: id,
      code: e.code,
      title: `${e.code} — ${e.title}`,
      spec: e.spec,
      ms: e.ms,
      state: e.state,
      duplicateOf: e.duplicateOf,
      prefix: e.code.split("-")[0],
    };
  }

  const labels = issue.labels.nodes.map((l) => l.name);
  const taskId = parseTaskId(issue.title);
  const prefix = prefixFor(taskId, issue.title, labels);
  const code = nextCode(prefix);
  const name = humanTitle(issue.title, taskId || id);
  const ms = milestoneFor(taskId, issue.projectMilestone?.name, prefix, null);

  return {
    linearId: issue.id,
    identifier: id,
    code,
    title: `${code} — ${name}`,
    spec: taskId || "see-description",
    ms,
    prefix,
  };
}

function description(entry, prior) {
  const header = [
    `## Product code`,
    `**${entry.code}** — ${entry.title.replace(`${entry.code} — `, "")}`,
    "",
    "| Traceability | Value |",
    "|--------------|-------|",
    `| Linear | ${entry.identifier} |`,
    `| Spec | \`${entry.spec}\` |`,
    `| Prefix | ${entry.prefix} |`,
    "",
    "_Catalog naming: `scripts/linear-apply-prefix-catalog.mjs` · Registry: `tasks/linear/prefix-catalog.json`_",
    "",
    "---",
    "",
  ].join("\n");
  const body = prior?.trim() || "";
  if (body && !body.includes("Product code")) return header + body;
  return header + (body || "_See spec file on disk._");
}

async function gql(query, variables = {}) {
  if (DRY_RUN && query.trim().startsWith("mutation")) return { data: {} };
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: API_KEY },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json;
}

async function ensureLabels() {
  const { data } = await gql(
    `query($teamId: String!) { team(id: $teamId) { labels { nodes { id name } } } }`,
    { teamId: TEAM_ID },
  );
  const map = new Map(data.team.labels.nodes.map((l) => [l.name, l.id]));
  for (const name of PREFIX_LABELS) {
    if (map.has(name)) continue;
    if (DRY_RUN) { map.set(name, `dry-${name}`); continue; }
    const colors = { launch: "#EB5757", "post-mvp": "#828282" };
    const color = name.includes("launch") ? colors.launch : name.startsWith("prefix:") ? "#5E6AD2" : colors["post-mvp"];
    const { data: c } = await gql(
      `mutation($input: IssueLabelCreateInput!) { issueLabelCreate(input: $input) { success issueLabel { id name } } }`,
      { input: { name, color, teamId: TEAM_ID } },
    );
    map.set(name, c.issueLabelCreate.issueLabel.id);
    await sleep(80);
  }
  return map;
}

async function renameMilestones() {
  const { data } = await gql(
    `query($id: String!) { project(id: $id) { projectMilestones { nodes { id name } } } }`,
    { id: PROJECT_ID },
  );
  const byName = new Map(data.project.projectMilestones.nodes.map((m) => [m.name, m.id]));
  for (const { from, to } of MILESTONE_RENAMES) {
    const mid = byName.get(from);
    if (!mid) continue;
    if (DRY_RUN) {
      report.milestones.push({ from, to });
      continue;
    }
    await gql(
      `mutation($id: String!, $input: ProjectMilestoneUpdateInput!) {
        projectMilestoneUpdate(id: $id, input: $input) { success }
      }`,
      { id: mid, input: { name: to } },
    );
    report.milestones.push({ from, to });
    await sleep(100);
  }
}

async function fetchIssueFull(identifier) {
  const { data } = await gql(
    `query($id: String!) { issue(id: $id) { id identifier title description labels { nodes { id name } } } }`,
    { id: identifier },
  );
  return data.issue;
}

async function applyEntry(entry, labelMap) {
  const issue = await fetchIssueFull(entry.identifier);
  if (!issue) return;

  const existingByName = new Map(issue.labels.nodes.map((l) => [l.name, l.id]));
  const labelNames = new Set(issue.labels.nodes.map((l) => l.name));
  labelNames.add(`prefix:${entry.prefix}`);
  if (entry.ms === MS.launch) labelNames.add("phase:launch");
  else if (!issue.labels.nodes.some((l) => l.name === "phase:launch")) labelNames.add("phase:post-mvp");
  labelNames.add("mvp");
  labelNames.add("phase-1");

  const labelIds = [...labelNames]
    .map((n) => labelMap.get(n) ?? existingByName.get(n))
    .filter(Boolean);
  const msMap = await getMilestoneMap();
  const msId = msMap.get(entry.ms);

  const input = {
    title: entry.title,
    description: description(entry, issue.description),
    ...(msId ? { projectMilestoneId: msId } : {}),
    ...(labelIds.length ? { labelIds } : {}),
    ...(entry.state ? { stateId: STATE[entry.state] } : {}),
  };

  if (DRY_RUN) {
    catalog.push(entry);
    report.updated++;
    return;
  }

  await gql(
    `mutation($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success } }`,
    { id: issue.id, input },
  );

  if (entry.duplicateOf) {
    const dup = await fetchIssueFull(entry.duplicateOf);
    if (dup) {
      await gql(
        `mutation($input: IssueRelationCreateInput!) { issueRelationCreate(input: $input) { success } }`,
        { input: { issueId: dup.id, relatedIssueId: issue.id, type: "duplicate" } },
      );
    }
  }

  catalog.push(entry);
  report.updated++;
  await sleep(90);
}

let milestoneCache;
async function getMilestoneMap() {
  if (milestoneCache) return milestoneCache;
  const { data } = await gql(
    `query($id: String!) { project(id: $id) { projectMilestones { nodes { id name } } } }`,
    { id: PROJECT_ID },
  );
  milestoneCache = new Map(data.project.projectMilestones.nodes.map((m) => [m.name, m.id]));
  return milestoneCache;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const snapshotPath = join(ROOT, "tasks/linear/linear-issues-snapshot.json");
  const issues = JSON.parse(readFileSync(snapshotPath, "utf8"));
  issues.sort((a, b) => parseInt(a.identifier.replace("SAN-", ""), 10) - parseInt(b.identifier.replace("SAN-", ""), 10));

  await renameMilestones();
  const labelMap = await ensureLabels();

  for (const issue of issues) {
    try {
      const entry = buildEntry(issue);
      await applyEntry(entry, labelMap);
    } catch (e) {
      report.errors.push({ id: issue.identifier, error: String(e.message || e) });
    }
  }

  const catalogPath = join(ROOT, "tasks/linear/prefix-catalog.json");
  writeFileSync(
    catalogPath,
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        scheme: "PREFIX-### in title; SAN-### immutable in Linear",
        counters,
        entries: catalog,
      },
      null,
      2,
    ),
  );
  writeFileSync(join(ROOT, "tasks/linear/prefix-apply-log.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, catalogSize: catalog.length, counters }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
