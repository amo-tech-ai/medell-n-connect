#!/usr/bin/env node
/**
 * Import DATA-001…035 into Linear MDEAPP with track + order + IMP labels.
 *
 * Usage:
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-import-data-tasks.mjs
 *   node scripts/linear-import-data-tasks.mjs --dry-run
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

const STATE = {
  Todo: "1c623f30-d632-4571-bfd8-67e121a6376f",
  "In Progress": "e9b4149e-0c6f-4201-98a1-6ccc8297d2cd",
  Done: "f8b0d0a0-0b0a-4b0a-8b0a-000000000001",
  Backlog: "a629f971-4b1d-46b6-8807-23a0c173a601",
};

/** Tier 4 data foundation — INDEX-data.md + plan.md 2026-05-29 */
const DATA_PACK = [
  { id: "DATA-001", imp: 155, dataOrder: 1, title: "Venues data inventory — cafés, restaurants, nightclubs", file: "data-001-inventory.md", priority: 1, state: "Done", milestone: "P1.5 — Venues MVP", blockedBy: [] },
  { id: "DATA-012", imp: 156, dataOrder: 2, title: "Events data inventory — live schema vs EVP roadmap", file: "data-012-events-data-inventory.md", priority: 1, state: "Done", milestone: "P1 — Events polish", blockedBy: [] },
  { id: "DATA-019", imp: 157, dataOrder: 3, title: "Rentals data inventory — live schema vs real-estate PRD", file: "data-019-rentals-data-inventory.md", priority: 1, state: "Done", milestone: "P1 — Screens & café", blockedBy: [] },
  { id: "DATA-026", imp: 158, dataOrder: 4, title: "Trips data inventory — live schema vs trips-plan", file: "data-026-trips-data-inventory.md", priority: 1, state: "Done", milestone: "P1.5 — Trips MVP", blockedBy: [] },
  { id: "DATA-034", imp: 159, dataOrder: 5, title: "Maps geo inventory — inventory lat/lng + place_id coverage", file: "data-034-maps-geo-inventory.md", priority: 2, state: "Done", milestone: "P1 — Maps & core", blockedBy: [] },
  { id: "DATA-002", imp: 160, dataOrder: 6, title: "Three-kind catalog contract — café, restaurant, nightclub", file: "data-002-catalog-contract.md", priority: 1, state: "Done", milestone: "P1.5 — Venues MVP", blockedBy: ["DATA-001"] },
  { id: "DATA-009", imp: 161, dataOrder: 7, title: "Supabase schema migrations — venue booking, anchors, rental indexes", file: "data-009-schema-migrations-m1-m3.md", priority: 1, state: "Done", milestone: "P1.5 — Venues MVP", blockedBy: ["DATA-002"], note: "M1 venue_booking_requests + M2 venue_anchors + M3 rental indexes — live 2026-05-29" },
  { id: "DATA-035", imp: 162, dataOrder: 8, title: "Café listings → venue_anchors seed (metadata + Places verify)", file: "data-035-cafe-listings-venue-anchor-seed.md", priority: 1, state: "Done", milestone: "P1.5 — Venues MVP", blockedBy: ["DATA-009"] },
  { id: "DATA-004", imp: 163, dataOrder: 9, title: "Restaurant catalog verify + gap-fill (not full re-seed)", file: "data-004-restaurant-seed.md", priority: 1, state: "Done", milestone: "P1.5 — Venues MVP", blockedBy: ["DATA-009"] },
  { id: "DATA-003", imp: 164, dataOrder: 10, title: "Café seed sign-off + golden-query map", file: "data-003-cafe-seed.md", priority: 1, state: "Done", milestone: "P1.5 — Venues MVP", blockedBy: ["DATA-035", "DATA-002", "DATA-009"] },
  { id: "DATA-005", imp: 165, dataOrder: 11, title: "Nightclub / bar anchor seed + Places verify", file: "data-005-nightclub-seed.md", priority: 1, state: "Done", milestone: "P1.5 — Venues MVP", blockedBy: ["DATA-009", "DATA-035"] },
  { id: "DATA-006", imp: 166, dataOrder: 12, title: "Golden eval queries — café, restaurant, nightclub", file: "data-006-golden-queries.md", priority: 2, state: "Done", milestone: "P1.5 — Venues MVP", blockedBy: ["DATA-003", "DATA-005"] },
  { id: "DATA-007", imp: 167, dataOrder: 13, title: "place_details_cache coverage — all venue kinds", file: "data-007-cache-audit.md", priority: 2, state: "Todo", milestone: "P1.5 — Venues MVP", blockedBy: ["DATA-006"], note: "Blocked — MAP-005 places proxy not verified" },
  { id: "DATA-008", imp: 168, dataOrder: 14, title: "Places backfill cron / edge job", file: "data-008-places-backfill-cron.md", priority: 2, state: "Todo", milestone: "P1.5 — Venues MVP", blockedBy: ["DATA-007"], note: "Blocked — after DATA-007" },
  { id: "DATA-010", imp: 169, dataOrder: 15, title: "Postgres function search_path hardening batch", file: "data-010-postgres-search-path-hardening.md", priority: 1, state: "Done", milestone: "P0 — MVP gates", blockedBy: [] },
  { id: "DATA-011", imp: 170, dataOrder: 16, title: "Edge function MVP freeze matrix + guest-lead abuse audit", file: "data-011-edge-hardening-evidence.md", priority: 1, state: "Done", milestone: "P0 — MVP gates", blockedBy: ["DATA-010"] },
  { id: "DATA-013", imp: 171, dataOrder: 17, title: "event_qa schema — Ask Host Q&A + moderation", file: "data-013-event-qa-schema.md", priority: 2, state: "Backlog", milestone: "P1 — Events polish", blockedBy: ["DATA-012"] },
  { id: "DATA-016", imp: 172, dataOrder: 18, title: "events AI content approval columns — vibe tags + summary", file: "data-016-events-ai-content-approval-columns.md", priority: 2, state: "Backlog", milestone: "P1 — Events polish", blockedBy: ["DATA-012"] },
  { id: "DATA-018", imp: 173, dataOrder: 19, title: "Event admin ops SQL — exception queue views", file: "data-018-event-admin-ops-views.md", priority: 2, state: "Backlog", milestone: "P1 — Events polish", blockedBy: ["DATA-012"] },
  { id: "DATA-014", imp: 174, dataOrder: 20, title: "event_live_updates schema — host day-of feed", file: "data-014-event-live-updates-schema.md", priority: 3, state: "Backlog", milestone: "P1 — Events polish", blockedBy: ["DATA-012"] },
  { id: "DATA-015", imp: 175, dataOrder: 21, title: "Attendee social visibility schema — audience breakdown", file: "data-015-event-attendee-social-schema.md", priority: 3, state: "Backlog", milestone: "P1 — Events polish", blockedBy: ["DATA-012"] },
  { id: "DATA-017", imp: 176, dataOrder: 22, title: "Discovered events pipeline schema — web ingest + approval queue", file: "data-017-discovered-events-pipeline-schema.md", priority: 3, state: "Backlog", milestone: "P1 — Events polish", blockedBy: ["DATA-012"] },
  { id: "DATA-020", imp: 177, dataOrder: 23, title: "leads rental FK — apartment_id + preferred_showing_at", file: "data-020-leads-rental-fk-columns.md", priority: 2, state: "Done", milestone: "P1 — Screens & café", blockedBy: ["DATA-019", "DATA-009"] },
  { id: "DATA-023", imp: 178, dataOrder: 24, title: "Rental golden queries — Camila eval SQL pack", file: "data-023-rental-golden-queries.md", priority: 2, state: "Done", milestone: "P1 — Screens & café", blockedBy: ["DATA-020"] },
  { id: "DATA-021", imp: 179, dataOrder: 25, title: "showings lifecycle — lead → showing row bridge", file: "data-021-showings-lead-bridge.md", priority: 2, state: "Done", milestone: "P1 — Screens & café", blockedBy: ["DATA-020"] },
  { id: "DATA-022", imp: 180, dataOrder: 26, title: "apartments.neighborhood_id FK — join neighborhoods table", file: "data-022-apartments-neighborhood-fk.md", priority: 3, state: "Backlog", milestone: "P1 — Screens & café", blockedBy: ["DATA-019"] },
  { id: "DATA-024", imp: 181, dataOrder: 27, title: "Rental booking commerce prep — bookings ↔ payments Stripe", file: "data-024-rental-booking-commerce-prep.md", priority: 3, state: "Backlog", milestone: "P1 — Screens & café", blockedBy: ["DATA-020"] },
  { id: "DATA-025", imp: 182, dataOrder: 28, title: "Hermes rental analytics — scoring_logs + market_snapshots", file: "data-025-hermes-rental-analytics-tables.md", priority: 3, state: "Backlog", milestone: "Phase 2 — Vector", blockedBy: ["DATA-019"] },
  { id: "DATA-027", imp: 183, dataOrder: 29, title: "trip_items type CHECK extension + insert RPC", file: "data-027-trip-items-insert-rpc.md", priority: 2, state: "Done", milestone: "P1.5 — Trips MVP", blockedBy: ["DATA-026"] },
  { id: "DATA-029", imp: 184, dataOrder: 30, title: "Commerce trip_id linkage — event_orders, leads, showings", file: "data-029-commerce-trip-id-linkage.md", priority: 2, state: "Done", milestone: "P1.5 — Trips MVP", blockedBy: ["DATA-027"] },
  { id: "DATA-030", imp: 185, dataOrder: 31, title: "Trips golden queries pack", file: "data-030-trips-golden-queries.md", priority: 2, state: "Done", milestone: "P1.5 — Trips MVP", blockedBy: ["DATA-029"] },
  { id: "DATA-028", imp: 186, dataOrder: 32, title: "event_orders / showings → trip_items idempotent sync", file: "data-028-booking-trip-item-sync.md", priority: 2, state: "Todo", milestone: "P1.5 — Trips MVP", blockedBy: ["DATA-029"], note: "Blocked — app/webhook sync not wired; next after DATA-021" },
  { id: "DATA-031", imp: 187, dataOrder: 33, title: "trip_items itinerary covering index", file: "data-031-trip-items-itinerary-index.md", priority: 3, state: "Backlog", milestone: "P1.5 — Trips MVP", blockedBy: ["DATA-027"] },
  { id: "DATA-032", imp: 188, dataOrder: 34, title: "mastra_threads trip_id metadata index", file: "data-032-mastra-threads-trip-metadata-index.md", priority: 3, state: "Backlog", milestone: "P1.5 — Trips MVP", blockedBy: ["DATA-026"] },
  { id: "DATA-033", imp: 189, dataOrder: 35, title: "route_cache schema + RLS + TTL", file: "data-033-route-cache-schema.md", priority: 3, state: "Backlog", milestone: "P1 — Maps & core", blockedBy: ["DATA-034"] },
];

const NEW_LABELS = [
  { name: "track:data", color: "#2F80ED", description: "Data layer — Tier 4 Supabase foundation" },
  ...DATA_PACK.map((t) => ({
    name: `data-order:${String(t.dataOrder).padStart(2, "0")}`,
    color: "#56CCF2",
    description: `Data implementation order ${t.dataOrder} — ${t.id} (IMP-${String(t.imp).padStart(3, "0")})`,
  })),
  ...DATA_PACK.map((t) => ({
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
    try {
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
    } catch (err) {
      if (!String(err.message).includes("duplicate")) throw err;
      const found = existing.get(spec.name);
      if (found) {
        ids[spec.name] = found;
        continue;
      }
      const { data: again } = await gql(
        `query($filter: IssueLabelFilter!) { issueLabels(filter: $filter, first: 1) { nodes { id name } } }`,
        { filter: { name: { eq: spec.name }, team: { id: { eq: TEAM_ID } } } },
      );
      const label = again.issueLabels.nodes[0];
      if (!label) throw err;
      ids[spec.name] = label.id;
      existing.set(spec.name, label.id);
    }
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
  const map = new Map(data.project.projectMilestones.nodes.map((m) => [m.name, m.id]));
  for (const m of data.project.projectMilestones.nodes) {
    console.log(`  milestone: ${m.name}`);
  }
  return map;
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

/** SAN-325…359 ↔ DATA-001…033 from last import log (survives SYS-* title renames). */
function loadDataIssueMap() {
  const logPath = join(ROOT, "tasks/linear/data-import-log.json");
  try {
    const log = JSON.parse(readFileSync(logPath, "utf8"));
    const byDataId = new Map();
    for (const row of log.created ?? []) {
      if (row.id && row.identifier) byDataId.set(row.id, row);
    }
    return byDataId;
  } catch {
    return new Map();
  }
}

function buildDescription(task, body) {
  const imp = String(task.imp).padStart(3, "0");
  const header = [
    `**Track:** Data foundation (Tier 4) · **IMP-${imp}** · **data-order:${String(task.dataOrder).padStart(2, "0")}**`,
    `**Spec:** \`tasks/data/tasks-data/${task.file}\``,
    `**Plan:** [\`plan.md\`](../../plan.md) Tier 4 · [\`INDEX-data.md\`](../../tasks/data/tasks-data/INDEX-data.md)`,
  ];
  if (task.note) header.push(`**Note:** ${task.note}`);
  return `${header.join("\n\n")}\n\n---\n\n${body.replace(/^---[\s\S]*?---\r?\n/, "").slice(0, 12000)}`;
}

async function main() {
  await resolveDoneStateId();
  console.log("Milestones:");
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
  const byIdentifier = new Map(existing.map((issue) => [issue.identifier, issue]));
  const dataIssueMap = loadDataIssueMap();

  const idToLinear = {};
  const log = { created: [], updated: [], skipped: [], errors: [], relations: [] };

  for (const task of DATA_PACK) {
    const title = `${task.id} — ${task.title}`;
    const body = readFileSync(join(ROOT, "tasks/data/tasks-data", task.file), "utf8");
    const description = buildDescription(task, body);
    const labels = [
      labelIds["track:data"],
      labelIds[`data-order:${String(task.dataOrder).padStart(2, "0")}`],
      labelIds[`imp:${String(task.imp).padStart(3, "0")}`],
      existingLabels.get("phase-1"),
    ].filter(Boolean);

    const milestoneId = milestoneMap.get(task.milestone);
    if (!milestoneId && !DRY_RUN) {
      console.warn(`warn: milestone not found: ${task.milestone} (${task.id})`);
    }
    const stateId = STATE[task.state] || STATE.Todo;

    const mapped = dataIssueMap.get(task.id);
    const ex = mapped?.identifier ? byIdentifier.get(mapped.identifier) : undefined;

    if (ex) {
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
        log.updated.push({ id: task.id, identifier: ex.identifier, url: ex.url, imp: task.imp, dataOrder: task.dataOrder });
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
      byIdentifier.set(issue.identifier, issue);
      log.created.push({ id: task.id, identifier: issue.identifier, url: issue.url, imp: task.imp, dataOrder: task.dataOrder });
      console.log(`created ${task.id} → ${issue.identifier}`);
      await sleep(150);
    } catch (err) {
      log.errors.push({ id: task.id, error: err.message });
      console.error(`create error ${task.id}: ${err.message}`);
    }
  }

  for (const task of DATA_PACK) {
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

  const outPath = join(ROOT, "tasks/linear/data-import-log.json");
  writeFileSync(outPath, JSON.stringify({ generated: new Date().toISOString(), pack: DATA_PACK.length, ...log }, null, 2));

  let importLog = { created: [], skipped: [], errors: [], relations: [] };
  try {
    importLog = JSON.parse(readFileSync(join(ROOT, "tasks/linear/import-log.json"), "utf8"));
  } catch {
    /* ok */
  }
  for (const row of [...log.created, ...log.updated]) {
    if (row.dryRun) continue;
    const entry = {
      id: row.id,
      identifier: row.identifier,
      url: row.url,
      imp: row.imp,
      dataOrder: row.dataOrder,
      source: "data-import-2026-05-29",
    };
    const idx = importLog.created.findIndex((r) => r.id === row.id);
    if (idx >= 0) importLog.created[idx] = entry;
    else importLog.created.push(entry);
  }
  writeFileSync(join(ROOT, "tasks/linear/import-log.json"), JSON.stringify(importLog, null, 2));

  console.log(`\nDone. created=${log.created.length} updated=${log.updated.length} errors=${log.errors.length} relations=${log.relations.length}`);
  console.log(`Log: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
