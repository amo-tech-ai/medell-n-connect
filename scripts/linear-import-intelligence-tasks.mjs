#!/usr/bin/env node
/**
 * Import MIS intelligence tasks into Linear MDEAPP.
 * Canonical: tasks/intelligence/intelligence-plan.md + tasks/linear/intelligence-queue.json
 *            + tasks/intelligence/tasks/INT-*.md (22 conversational tasks)
 *
 * Usage:
 *   export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
 *   node scripts/linear-import-intelligence-tasks.mjs --dry-run
 *   node scripts/linear-import-intelligence-tasks.mjs --audit
 *   node scripts/linear-import-intelligence-tasks.mjs
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const AUDIT_ONLY = process.argv.includes("--audit");
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

/** MIS-M1 shipped 2026-06-01 — mark Done on import/update */
const SHIPPED = new Set([
  "VEC-001",
  "DATA-039",
  "DATA-040",
  "DATA-041",
  "DATA-042",
  "DATA-043",
  "DATA-044",
  "DATA-045",
  "DATA-047",
  "SEARCH-003",
  "MASTRA-MIS-001",
]);

/** Phase 1 FROZEN active queue — intelligence-queue.json */
const PHASE_1_ACTIVE = new Set([
  "VEC-001",
  "DATA-039",
  "DATA-040",
  "DATA-041",
  "DATA-042",
  "DATA-043",
  "DATA-044",
  "DATA-045",
  "DATA-047",
  "SEARCH-003",
  "MASTRA-MIS-001",
]);

const PHASE_1B = new Set([
  "VEC-003",
  "VEC-004",
  "SEARCH-001",
  "SEARCH-002",
  "AI-004",
  "AI-003",
  "DATA-046",
  "VEC-005",
]);

/** Full registry — local markdown / plan = source of truth */
const INTELLIGENCE_REGISTRY = [
  // VEC-001 → VEC-007
  {
    id: "VEC-001",
    intelOrder: 1,
    phase: "intel-0",
    stack: ["pgvector", "supabase"],
    layers: [],
    title: "pgvector inventory + duplicate HNSW cleanup",
    file: "tasks/vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md",
    priority: 1,
    blockedBy: [],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "VEC-002",
    intelOrder: 19,
    phase: "intel-deferred",
    stack: ["pgvector", "supabase"],
    layers: [],
    title: "Semantic V1 schema + RLS plan",
    file: "tasks/vector/VEC-002-semantic-v1-schema-and-rls-plan.md",
    priority: 2,
    blockedBy: ["VEC-001"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "VEC-003",
    intelOrder: 11,
    phase: "intel-1b",
    stack: ["pgvector"],
    layers: [],
    title: "Model registry + embedding contract",
    file: "tasks/vector/VEC-003-model-registry-and-embedding-contract.md",
    priority: 2,
    blockedBy: ["VEC-001"],
    milestone: "Phase 2 — Vector",
    note: "Phase 1b — before VEC-004 worker",
  },
  {
    id: "VEC-004",
    intelOrder: 12,
    phase: "intel-1b",
    stack: ["pgvector", "mastra"],
    layers: [],
    title: "Embedding text builders + worker",
    file: "tasks/vector/VEC-004-embedding-text-builders.md",
    priority: 2,
    blockedBy: ["VEC-003", "DATA-040"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "VEC-005",
    intelOrder: 18,
    phase: "intel-1b",
    stack: ["pgvector"],
    layers: ["observability"],
    title: "Golden semantic eval harness",
    file: "tasks/vector/VEC-005-semantic-eval-harness.md",
    priority: 2,
    blockedBy: ["VEC-004", "DATA-046"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "VEC-006",
    intelOrder: 20,
    phase: "intel-deferred",
    stack: ["pgvector", "supabase"],
    layers: ["observability"],
    title: "Semantic search logs + observability (Phase 2)",
    file: "tasks/vector/VEC-006-semantic-search-logs-and-observability.md",
    priority: 3,
    blockedBy: ["VEC-005"],
    milestone: "Phase 2 — Vector",
    note: "DATA-047 covers MVP search_logs — defer VEC-006 until Phase 2",
  },
  {
    id: "VEC-007",
    intelOrder: 21,
    phase: "intel-deferred",
    stack: ["pgvector"],
    layers: [],
    title: "Coffee-tour vector compatibility",
    file: "tasks/vector/VEC-007-coffee-tour-vector-compatibility.md",
    priority: 3,
    blockedBy: ["VEC-004"],
    milestone: "Phase 2 — Vector",
  },
  // DATA-039 → DATA-047
  {
    id: "DATA-039",
    intelOrder: 2,
    phase: "intel-0",
    stack: ["supabase"],
    layers: [],
    title: "Restaurants schema patch — neighborhood, nullable price/hours",
    file: "tasks/data/tasks-data/DATA-039-restaurants-schema-patch.md",
    priority: 1,
    blockedBy: [],
    milestone: "P1.5 — Venues MVP",
  },
  {
    id: "DATA-040",
    intelOrder: 3,
    phase: "intel-1",
    stack: ["supabase"],
    layers: [],
    title: "embedding_jobs queue",
    file: "tasks/data/tasks-data/DATA-040-embedding-jobs.md",
    priority: 1,
    blockedBy: ["VEC-001"],
    milestone: "Phase 2 — Vector",
    note: "1 migration = embedding_jobs only",
  },
  {
    id: "DATA-041",
    intelOrder: 4,
    phase: "intel-1",
    stack: ["supabase", "mastra"],
    layers: ["signals"],
    title: "venue_signals polymorphic + seed (human QA top 30)",
    file: "tasks/data/tasks-data/DATA-041-venue-signals.md",
    priority: 1,
    blockedBy: ["DATA-039", "DATA-040"],
    milestone: "P1.5 — Venues MVP",
    note: "1 migration = venue_signals only",
  },
  {
    id: "DATA-042",
    intelOrder: 5,
    phase: "intel-1",
    stack: ["supabase"],
    layers: ["signals"],
    title: "event_signals + seed published events",
    file: null,
    priority: 1,
    blockedBy: ["DATA-040"],
    milestone: "P1 — Events polish",
    note: "1 migration = event_signals only",
  },
  {
    id: "DATA-043",
    intelOrder: 6,
    phase: "intel-1",
    stack: ["supabase"],
    layers: ["signals"],
    title: "rental_signals + seed 44 apartments",
    file: null,
    priority: 1,
    blockedBy: ["DATA-040"],
    milestone: "P1 — Screens & café",
    note: "1 migration = rental_signals only",
  },
  {
    id: "DATA-044",
    intelOrder: 7,
    phase: "intel-1",
    stack: ["supabase"],
    layers: [],
    title: "neighborhood_profiles + Astorga seed",
    file: null,
    priority: 1,
    blockedBy: [],
    milestone: "P1 — Maps & core",
    note: "1 migration = neighborhood_profiles only",
  },
  {
    id: "DATA-045",
    intelOrder: 8,
    phase: "intel-1",
    stack: ["supabase"],
    layers: ["grounding"],
    title: "Evidence + grounding tables",
    file: null,
    priority: 1,
    blockedBy: ["DATA-041", "DATA-042", "DATA-043"],
    milestone: "P1.5 — Venues MVP",
    note: "1 migration = evidence only",
  },
  {
    id: "DATA-046",
    intelOrder: 17,
    phase: "intel-1b",
    stack: ["supabase"],
    layers: ["observability"],
    title: "Golden queries v2 (signal-backed)",
    file: "tasks/data/tasks-data/DATA-046-golden-queries-v2.md",
    priority: 2,
    blockedBy: ["DATA-041", "DATA-045", "SEARCH-003"],
    milestone: "Phase 2 — Vector",
    note: "Phase 1b after MIS-M1 gate",
  },
  {
    id: "DATA-047",
    intelOrder: 9,
    phase: "intel-1",
    stack: ["supabase"],
    layers: ["observability"],
    title: "search_logs + rank_explanation observability",
    file: "tasks/data/tasks-data/DATA-047-search-logs.md",
    priority: 1,
    blockedBy: [],
    milestone: "Phase 2 — Vector",
    note: "1 migration = search_logs only",
  },
  // SEARCH-001 → SEARCH-007
  {
    id: "SEARCH-001",
    intelOrder: 13,
    phase: "intel-1b",
    stack: ["mastra", "pgvector", "search"],
    layers: ["ranking"],
    title: "Wire hybrid_search_listings + rental_signals",
    file: "tasks/data/tasks-data/SEARCH-001-rental-hybrid.md",
    priority: 2,
    blockedBy: ["DATA-043", "DATA-047", "VEC-004"],
    milestone: "P1 — Screens & café",
    note: "After MIS-M1 gate — rentals hybrid",
  },
  {
    id: "SEARCH-002",
    intelOrder: 14,
    phase: "intel-1b",
    stack: ["mastra", "pgvector", "search"],
    layers: ["ranking"],
    title: "Wire hybrid_search_events + event_signals",
    file: "tasks/data/tasks-data/SEARCH-002-event-hybrid.md",
    priority: 2,
    blockedBy: ["DATA-042", "DATA-047", "VEC-004"],
    milestone: "P1 — Events polish",
    note: "After MIS-M1 gate",
  },
  {
    id: "SEARCH-003",
    intelOrder: 10,
    phase: "intel-1",
    stack: ["mastra", "pgvector", "search"],
    layers: ["ranking"],
    title: "Wire hybrid_search_restaurants + venue_signals",
    file: "tasks/data/tasks-data/SEARCH-003-restaurant-hybrid.md",
    priority: 1,
    blockedBy: ["DATA-041", "DATA-047", "VEC-001"],
    milestone: "P1.5 — Venues MVP",
    note: "First hybrid proof — NOT SEARCH-001 after DATA-041",
  },
  {
    id: "MASTRA-MIS-001",
    intelOrder: 11,
    phase: "intel-1",
    stack: ["mastra", "copilotkit"],
    layers: ["doc"],
    title: "Canonical production routing (concierge-only)",
    file: "tasks/mastra/MASTRA-MIS-001-routing-canonical.md",
    priority: 2,
    blockedBy: [],
    milestone: "P1.5 — Venues MVP",
    note: "Doc-only — / = conciergeAgent; routerAgent/workflows not prod",
  },
  {
    id: "SEARCH-004",
    intelOrder: 22,
    phase: "intel-deferred",
    stack: ["mastra", "search"],
    layers: ["ranking"],
    title: "Cross-domain retrieval workflow",
    file: null,
    priority: 3,
    blockedBy: ["SEARCH-003"],
    milestone: "Phase 2 — Vector",
    note: "Phase 2 — no multi-agent orchestration in Phase 1",
  },
  {
    id: "SEARCH-005",
    intelOrder: 23,
    phase: "intel-deferred",
    stack: ["pgvector", "search"],
    layers: ["ranking"],
    title: "Like this place similarity search",
    file: null,
    priority: 3,
    blockedBy: ["VEC-002", "SEARCH-003"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "SEARCH-006",
    intelOrder: 24,
    phase: "intel-deferred",
    stack: ["mastra", "search"],
    layers: ["ranking"],
    title: "Conversational query planner",
    file: null,
    priority: 3,
    blockedBy: ["SEARCH-003"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "SEARCH-007",
    intelOrder: 25,
    phase: "intel-deferred",
    stack: ["supabase", "search"],
    layers: ["ranking"],
    title: "Signal fusion ranker",
    file: null,
    priority: 3,
    blockedBy: ["DATA-041", "DATA-042", "DATA-043", "SEARCH-003"],
    milestone: "Phase 2 — Vector",
  },
  // AI-001 → AI-020 (registry gaps documented in report)
  {
    id: "AI-001",
    intelOrder: 26,
    phase: "intel-deferred",
    stack: ["mastra"],
    layers: ["ranking"],
    title: "Cross-domain discovery workflow",
    file: null,
    priority: 3,
    blockedBy: ["SEARCH-004"],
    milestone: "Phase 2 — Vector",
    note: "Phase 2 — defer orchestration",
  },
  {
    id: "AI-002",
    intelOrder: 27,
    phase: "intel-deferred",
    stack: ["mastra"],
    layers: ["ranking"],
    title: "Itinerary planning workflow",
    file: null,
    priority: 3,
    blockedBy: ["SEARCH-006"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "AI-003",
    intelOrder: 16,
    phase: "intel-1b",
    stack: ["mastra", "supabase"],
    layers: ["signals"],
    title: "Signal enrichment batch job",
    file: "tasks/data/tasks-data/AI-003-signal-enrichment.md",
    priority: 2,
    blockedBy: ["DATA-041", "VEC-004"],
    milestone: "P1.5 — Venues MVP",
    note: "gemini-3.1-flash-lite structured output",
  },
  {
    id: "AI-004",
    intelOrder: 15,
    phase: "intel-1b",
    stack: ["mastra", "supabase"],
    layers: ["grounding"],
    title: "Grounding verification pipeline",
    file: "tasks/data/tasks-data/AI-004-grounding-verify.md",
    priority: 2,
    blockedBy: ["DATA-045"],
    milestone: "P1.5 — Venues MVP",
    note: "Every card ≥1 citation or Places cache hit",
  },
  {
    id: "AI-010",
    intelOrder: 28,
    phase: "intel-deferred",
    stack: ["mastra"],
    layers: ["signals"],
    title: "Hidden gem detection job",
    file: null,
    priority: 4,
    blockedBy: ["DATA-041"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "AI-011",
    intelOrder: 29,
    phase: "intel-deferred",
    stack: ["mastra"],
    layers: ["signals"],
    title: "Local vs tourist classifier",
    file: null,
    priority: 4,
    blockedBy: ["AI-010"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "AI-012",
    intelOrder: 30,
    phase: "intel-deferred",
    stack: ["mastra"],
    layers: ["signals"],
    title: "Vibe extraction refresh on catalog change",
    file: null,
    priority: 4,
    blockedBy: ["VEC-004", "AI-003"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "AI-013",
    intelOrder: 31,
    phase: "intel-deferred",
    stack: ["mastra"],
    layers: ["signals"],
    title: "Nightlife timing engine",
    file: null,
    priority: 4,
    blockedBy: ["DATA-041"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "AI-014",
    intelOrder: 32,
    phase: "intel-deferred",
    stack: ["mastra", "pgvector"],
    layers: ["ranking"],
    title: "Recommendation graph builder",
    file: null,
    priority: 4,
    blockedBy: ["VEC-006"],
    milestone: "Phase 2 — Vector",
  },
  {
    id: "AI-015",
    intelOrder: 33,
    phase: "intel-deferred",
    stack: ["mastra"],
    layers: ["ranking"],
    title: "User taste vector (opt-in)",
    file: null,
    priority: 4,
    blockedBy: [],
    milestone: "Phase 2 — Vector",
    note: "Phase 3 only",
  },
  {
    id: "AI-020",
    intelOrder: 34,
    phase: "intel-deferred",
    stack: ["mastra"],
    layers: ["ranking"],
    title: "Multi-agent concierge router",
    file: null,
    priority: 4,
    blockedBy: ["SEARCH-004"],
    milestone: "Phase 2 — Vector",
    note: "Phase 2+ — not Phase 1",
  },
];

const INT_REALWORLD_TITLES = JSON.parse(
  readFileSync(join(ROOT, "tasks/linear/intelligence-int-realworld-titles.json"), "utf8"),
).titles;

function parseYamlFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const arrInline = line.match(/^(\w+):\s*\[(.*)\]\s*$/);
    if (arrInline) {
      out[arrInline[1]] = arrInline[2]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      continue;
    }
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[kv[1]] = v;
  }
  return out;
}

function loadIntelligenceTasksFromDisk() {
  const tasksDir = join(ROOT, "tasks/intelligence/tasks");
  const files = readdirSync(tasksDir)
    .filter((f) => /^INT-\d{3}-.*\.md$/.test(f))
    .sort((a, b) => parseInt(a.slice(4, 7), 10) - parseInt(b.slice(4, 7), 10));
  const priorityMap = { P0: 1, P1: 2, P2: 3, P3: 4 };

  return files.map((file) => {
    const filePath = join(tasksDir, file);
    const raw = readFileSync(filePath, "utf8");
    const fm = parseYamlFrontmatter(raw);
    const id = fm.id || file.match(/^(INT-\d{3})/)[1];
    const intSeq = parseInt(id.replace("INT-", ""), 10);
    const phaseRaw = String(fm.phase || "CORE").toUpperCase();
    const phase = phaseRaw === "CORE" || phaseRaw === "MVP" ? "intel-conv" : "intel-memory";
    const owners = fm.owner_system || [];
    const stack = [];
    if (owners.some((o) => /supabase/i.test(o))) stack.push("supabase");
    if (owners.some((o) => /mastra|gemini/i.test(o))) stack.push("mastra");
    if (owners.some((o) => /pgvector/i.test(o))) stack.push("pgvector");
    const layers = phase === "intel-conv" ? ["routing"] : ["memory"];
    const depends = fm.depends_on || [];

    return {
      id,
      intSeq,
      phase,
      stack,
      layers,
      title: INT_REALWORLD_TITLES[id] || fm.title || id,
      file: `tasks/intelligence/tasks/${file}`,
      priority: priorityMap[fm.priority] || 2,
      blockedBy: depends.filter((d) => /^(INT|VEC|DATA|SEARCH|AI)-/.test(d)),
      milestone:
        phase === "intel-conv"
          ? "Phase 2 — Conversational routing"
          : "Phase 2 — Memory & personalization",
      isIntTask: true,
      personas: fm.personas || [],
      priorityLabel: fm.priority || "P1",
      phaseLabel: fm.phase || phaseRaw,
    };
  });
}

const INT_TASKS = loadIntelligenceTasksFromDisk();
const FULL_REGISTRY = [...INTELLIGENCE_REGISTRY, ...INT_TASKS];

function buildLabelSpecs(registry) {
  return [
    { name: "track:intelligence", color: "#9B51E0", description: "Medellín Intelligence System (MIS)" },
    { name: "track:data", color: "#2D9CDB", description: "DATA layer (shared)" },
    { name: "phase:intel-0", color: "#6FCF97", description: "MIS Phase 0 — audit + pre-req" },
    { name: "phase:intel-1", color: "#F2994A", description: "MIS Phase 1 FROZEN — ship only these" },
    { name: "phase:intel-1b", color: "#F2C94C", description: "MIS Phase 1b — after MIS-M1 gate" },
    { name: "phase:intel-deferred", color: "#828282", description: "MIS Phase 2+ — do not execute yet" },
    {
      name: "phase:intel-conv",
      color: "#6C5CE7",
      description: "INT CORE+MVP — conversational routing (post MIS-M1)",
    },
    {
      name: "phase:intel-memory",
      color: "#A29BFE",
      description: "INT POST-MVP+ADVANCED — durable memory & personalization",
    },
    { name: "stack:supabase", color: "#2F80ED", description: "Supabase DDL / RLS" },
    { name: "stack:pgvector", color: "#56CCF2", description: "pgvector / hybrid RPC" },
    { name: "stack:search", color: "#BB6BD9", description: "SEARCH tool wiring" },
    { name: "stack:mastra", color: "#EB5757", description: "Mastra agents/tools" },
    { name: "layer:observability", color: "#27AE60", description: "search_logs, eval, latency" },
    { name: "layer:signals", color: "#E67E22", description: "venue/event/rental_signals" },
    { name: "layer:ranking", color: "#9B59B6", description: "Hybrid rank + signal fusion" },
    { name: "layer:grounding", color: "#16A085", description: "Evidence + citation pipeline" },
    { name: "layer:routing", color: "#E84393", description: "INT intent/slot routing + clarify" },
    { name: "layer:memory", color: "#00B894", description: "INT prefs, interactions, pgvector recall" },
    ...registry.filter((t) => t.intelOrder && t.intelOrder <= 18).map((t) => ({
      name: `intel-order:${String(t.intelOrder).padStart(2, "0")}`,
      color: "#BB87FC",
      description: `MIS execution order ${t.intelOrder} — ${t.id}`,
    })),
    ...registry.filter((t) => t.intSeq).map((t) => ({
      name: `int-seq:${String(t.intSeq).padStart(2, "0")}`,
      color: "#7B68EE",
      description: `INT execution order ${t.intSeq} — ${t.id}`,
    })),
  ];
}

const LABEL_SPECS = buildLabelSpecs(FULL_REGISTRY);

const MISSING_IN_REGISTRY = {
  "AI-005": "No spec in intelligence-plan §5.5 — gap in AI-001…020 range",
  "AI-006": "No spec in intelligence-plan §5.5",
  "AI-007": "No spec in intelligence-plan §5.5",
  "AI-008": "No spec in intelligence-plan §5.5",
  "AI-009": "No spec in intelligence-plan §5.5",
  "AI-016": "No spec in intelligence-plan §5.5",
  "AI-017": "No spec in intelligence-plan §5.5",
  "AI-018": "No spec in intelligence-plan §5.5",
  "AI-019": "No spec in intelligence-plan §5.5",
};

const API_KEY = process.env.LINEAR_API_KEY;
if (!API_KEY && !DRY_RUN && !AUDIT_ONLY) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

async function gql(query, variables = {}) {
  if (DRY_RUN && !query.includes("team(") && !query.includes("project(") && !query.includes("workflowStates")) {
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

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function readBody(task) {
  if (!task.file) {
    return `# ${task.id}\n\nSpec pending — see \`tasks/intelligence/intelligence-plan.md\` §5 registry.\n\nEvidence: \`tasks/data/evidence/MIS-M1-2026-06-01.md\` when shipped.`;
  }
  const path = join(ROOT, task.file);
  if (!existsSync(path)) {
    return `# ${task.id}\n\n**Spec file missing:** \`${task.file}\`\n\nSee MIS plan registry.`;
  }
  return readFileSync(path, "utf8");
}

function buildDescription(task, body) {
  const stripped = body.replace(/^---[\s\S]*?---\r?\n/, "").slice(0, 12000);
  if (task.isIntTask) {
    const header = [
      `**Track:** Intelligence · **int-seq:${String(task.intSeq).padStart(2, "0")}** · **${task.phaseLabel}** · **${task.priorityLabel}**`,
      task.personas?.length ? `**Personas:** ${task.personas.join(", ")}` : null,
      `**Stack:** ${task.stack.join(", ") || "Mastra, Gemini"}`,
      task.layers?.length ? `**Layer:** ${task.layers.join(", ")}` : null,
      `**Spec:** \`${task.file}\``,
      `**Index:** [\`INDEX.md\`](../../tasks/intelligence/tasks/INDEX.md)`,
      `**Plan:** [\`agent-plan.md\`](../../tasks/intelligence/agent-plan.md)`,
      task.blockedBy?.length ? `**Blocked by:** ${task.blockedBy.join(", ")}` : null,
      "**Gate:** Post MIS-M1 — do not start until Phase 1b shipped + browser proof on restaurants",
    ].filter(Boolean);
    return `${header.join("\n\n")}\n\n---\n\n${stripped}`;
  }
  const header = [
    task.intelOrder
      ? `**Track:** Intelligence (MIS) · **intel-order:${String(task.intelOrder).padStart(2, "0")}** · **${task.phase}**`
      : `**Track:** Intelligence (MIS) · **${task.phase}**`,
    `**Stack:** ${task.stack.join(", ")}`,
    task.layers?.length ? `**Layer:** ${task.layers.join(", ")}` : null,
    task.file ? `**Spec:** \`${task.file}\`` : "**Spec:** registry only (`intelligence-plan.md` §5)",
    `**Plan:** [\`intelligence-plan.md\`](../../tasks/intelligence/intelligence-plan.md)`,
    `**Queue:** [\`intelligence-queue.json\`](../../tasks/linear/intelligence-queue.json)`,
    SHIPPED.has(task.id)
      ? "**MIS-M1:** ✅ Shipped 2026-06-01 — see `tasks/data/evidence/MIS-M1-2026-06-01.md`"
      : null,
  ].filter(Boolean);
  if (task.note) header.push(`**Note:** ${task.note}`);
  return `${header.join("\n\n")}\n\n---\n\n${stripped}`;
}

function resolveState(task, stateMap) {
  if (SHIPPED.has(task.id)) return stateMap.Done || stateMap.Todo;
  if (task.isIntTask) return stateMap.Backlog || stateMap.Todo;
  if (task.phase === "intel-deferred") return stateMap.Backlog || stateMap.Todo;
  if (PHASE_1B.has(task.id)) return stateMap.Backlog || stateMap.Todo;
  return stateMap.Todo;
}

async function fetchProjectIssues() {
  const all = [];
  let cursor = null;
  for (;;) {
    const { data } = await gql(
      `query($projectId: String!, $after: String) {
        project(id: $projectId) {
          issues(first: 100, after: $after) { nodes { id identifier title url labels { nodes { name } } } pageInfo { hasNextPage endCursor } }
        }
      }`,
      { projectId: PROJECT_ID, after: cursor },
    );
    const conn = data.project.issues;
    all.push(...conn.nodes);
    if (!conn.pageInfo.hasNextPage) break;
    cursor = conn.pageInfo.endCursor;
  }
  return all;
}

function auditCollisions(registry, issues) {
  const bySpecPrefix = new Map();
  const collisions = [];
  for (const issue of issues) {
    const prefix = issue.title.split(" — ")[0]?.trim();
    if (!prefix) continue;
    if (bySpecPrefix.has(prefix)) {
      collisions.push({ specId: prefix, issues: [bySpecPrefix.get(prefix), issue] });
    } else {
      bySpecPrefix.set(prefix, issue);
    }
  }
  const dupTitles = issues.filter((i) => i.title.match(/^(DATA|VEC|SEARCH|AI)-/)).length;
  return { collisions, bySpecPrefix, dupTitles };
}

function auditDependencies(registry) {
  const ids = new Set(registry.map((t) => t.id));
  const missing = [];
  for (const task of registry) {
    for (const dep of task.blockedBy ?? []) {
      if (!ids.has(dep)) missing.push({ task: task.id, missingDep: dep });
    }
  }
  return missing;
}

async function main() {
  const report = {
    at: new Date().toISOString(),
    dryRun: DRY_RUN,
    auditOnly: AUDIT_ONLY,
    registryCount: FULL_REGISTRY.length,
    misCount: INTELLIGENCE_REGISTRY.length,
    intCount: INT_TASKS.length,
    phase1Active: [...PHASE_1_ACTIVE],
    missingInRegistry: MISSING_IN_REGISTRY,
    created: [],
    updated: [],
    skipped: [],
    errors: [],
    collisions: [],
    dependencyGaps: [],
    labelCheck: [],
    views: [],
  };

  // Pre-audit registry
  report.dependencyGaps = auditDependencies(FULL_REGISTRY);

  const { data: wsData } = await gql(
    `query($teamId: String!) { team(id: $teamId) { states { nodes { id name type } } } }`,
    { teamId: TEAM_ID },
  );
  const stateMap = Object.fromEntries(wsData.team.states.nodes.map((s) => [s.name, s.id]));

  const existingLabels = new Map();
  let labelCursor = null;
  for (;;) {
    const { data: page } = await gql(
      `query($teamId: String!, $after: String) {
        team(id: $teamId) { labels(first: 100, after: $after) { nodes { id name } pageInfo { hasNextPage endCursor } } }
      }`,
      { teamId: TEAM_ID, after: labelCursor },
    );
    for (const l of page.team.labels.nodes) existingLabels.set(l.name, l.id);
    if (!page.team.labels.pageInfo.hasNextPage) break;
    labelCursor = page.team.labels.pageInfo.endCursor;
  }

  const projectIssues = DRY_RUN || AUDIT_ONLY ? [] : await fetchProjectIssues();
  if (!DRY_RUN && !AUDIT_ONLY) {
    const { collisions } = auditCollisions(FULL_REGISTRY, projectIssues);
    report.collisions = collisions;
  }

  if (AUDIT_ONLY) {
    console.log("=== MIS Linear import audit ===");
    console.log(`Registry tasks: ${FULL_REGISTRY.length} (MIS ${INTELLIGENCE_REGISTRY.length} + INT ${INT_TASKS.length})`);
    console.log(`Phase 1 active: ${PHASE_1_ACTIVE.size}`);
    console.log(`Missing AI IDs: ${Object.keys(MISSING_IN_REGISTRY).join(", ")}`);
    console.log(`Dependency gaps: ${report.dependencyGaps.length}`);
    report.dependencyGaps.forEach((g) => console.log(`  ${g.task} → missing ${g.missingDep}`));
    writeFileSync(join(ROOT, "tasks/linear/intelligence-import-report.json"), JSON.stringify(report, null, 2));
    return;
  }

  async function ensureLabels() {
    const ids = {};
    for (const spec of LABEL_SPECS) {
      if (existingLabels.has(spec.name)) {
        ids[spec.name] = existingLabels.get(spec.name);
        continue;
      }
      if (DRY_RUN) {
        ids[spec.name] = `dry-${spec.name}`;
        console.log(`[dry-run] label ${spec.name}`);
        continue;
      }
      try {
        const { data } = await gql(
          `mutation($input: IssueLabelCreateInput!) { issueLabelCreate(input: $input) { success issueLabel { id name } } }`,
          { input: { teamId: TEAM_ID, name: spec.name, color: spec.color, description: spec.description } },
        );
        ids[spec.name] = data.issueLabelCreate.issueLabel.id;
        existingLabels.set(spec.name, ids[spec.name]);
        console.log(`label ${spec.name}`);
      } catch (err) {
        if (String(err.message).includes("duplicate")) {
          const { data: refresh } = await gql(
            `query($teamId: String!) { team(id: $teamId) { labels { nodes { id name } } } }`,
            { teamId: TEAM_ID },
          );
          const hit = refresh.team.labels.nodes.find((l) => l.name === spec.name);
          if (hit) {
            ids[spec.name] = hit.id;
            existingLabels.set(spec.name, hit.id);
            console.log(`label ${spec.name} (existing)`);
          } else throw err;
        } else throw err;
      }
      await sleep(120);
    }
    return ids;
  }

  const labelIds = await ensureLabels();
  report.labelCheck = LABEL_SPECS.map((s) => ({
    name: s.name,
    ok: Boolean(labelIds[s.name] || existingLabels.has(s.name)),
  }));

  const { data: msData } = await gql(
    `query($projectId: String!) { project(id: $projectId) { projectMilestones { nodes { id name } } } }`,
    { projectId: PROJECT_ID },
  );
  const milestoneMap = new Map(msData.project.projectMilestones.nodes.map((m) => [m.name, m.id]));

  let byTitle = new Map();
  if (!DRY_RUN) {
    const issues = await fetchProjectIssues();
    byTitle = new Map(issues.map((i) => [i.title.split(" — ")[0], i]));
  }

  const idToLinear = {};

  for (const task of FULL_REGISTRY) {
    const title = `${task.id} — ${task.title}`;
    const description = buildDescription(task, readBody(task));
    const labels = [
      labelIds["track:intelligence"],
      labelIds[`phase:${task.phase}`],
      task.intelOrder && task.intelOrder <= 18
        ? labelIds[`intel-order:${String(task.intelOrder).padStart(2, "0")}`]
        : null,
      task.intSeq ? labelIds[`int-seq:${String(task.intSeq).padStart(2, "0")}`] : null,
      ...task.stack.map((s) => labelIds[`stack:${s}`]).filter(Boolean),
      ...(task.layers ?? []).map((l) => labelIds[`layer:${l}`]).filter(Boolean),
      task.id.startsWith("DATA-") ? labelIds["track:data"] ?? existingLabels.get("track:data") : null,
    ].filter(Boolean);

    const milestoneId = milestoneMap.get(task.milestone);
    const stateId = resolveState(task, stateMap);
    const ex = byTitle.get(task.id);

    if (ex) {
      idToLinear[task.id] = ex;
      if (DRY_RUN) {
        console.log(`[dry-run] update ${ex.identifier} ${title}`);
        report.updated.push({ id: task.id, identifier: ex.identifier, dryRun: true });
        continue;
      }
      await gql(
        `mutation($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success } }`,
        {
          id: ex.id,
          input: { title, description, priority: task.priority, stateId, labelIds: labels, projectMilestoneId: milestoneId || undefined },
        },
      );
      report.updated.push({ id: task.id, identifier: ex.identifier, url: ex.url, state: SHIPPED.has(task.id) ? "Done" : task.phase });
      console.log(`updated ${task.id} → ${ex.identifier}`);
      await sleep(150);
      continue;
    }

    if (DRY_RUN) {
      console.log(`[dry-run] create ${title} [${task.phase}]`);
      idToLinear[task.id] = { id: `dry-${task.id}`, identifier: `DRY-${task.id}` };
      report.created.push({ id: task.id, phase: task.phase, dryRun: true });
      continue;
    }

    try {
      const { data } = await gql(
        `mutation($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier title url } } }`,
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
      byTitle.set(task.id, issue);
      report.created.push({ id: task.id, identifier: issue.identifier, url: issue.url, phase: task.phase, san: issue.identifier });
      console.log(`created ${task.id} → ${issue.identifier}`);
      await sleep(150);
    } catch (err) {
      report.errors.push({ id: task.id, error: err.message });
      console.error(`error ${task.id}: ${err.message}`);
    }
  }

  // blocked-by relations
  for (const task of FULL_REGISTRY) {
    if (!task.blockedBy?.length || DRY_RUN) continue;
    const issue = idToLinear[task.id];
    if (!issue?.id || String(issue.id).startsWith("dry-")) continue;
    for (const dep of task.blockedBy) {
      const blocker = idToLinear[dep];
      if (!blocker?.id) continue;
      try {
        await gql(
          `mutation($input: IssueRelationCreateInput!) { issueRelationCreate(input: $input) { success } }`,
          { input: { issueId: issue.id, relatedIssueId: blocker.id, type: "blocks" } },
        );
        console.log(`relation ${dep} blocks ${task.id}`);
        await sleep(100);
      } catch (err) {
        if (!String(err.message).includes("already")) console.warn(`relation ${dep}→${task.id}: ${err.message}`);
      }
    }
  }

  // View specs (manual in Linear UI — API has no custom view create)
  report.views = [
    { name: "INTELLIGENCE", filter: "project:MDEAPP label:track:intelligence" },
    { name: "INTEL Phase 1", filter: 'project:MDEAPP label:phase:intel-1 state:Todo,"In Progress","In Review","Done"' },
    { name: "INT Conversational (INT-001…022)", filter: "project:MDEAPP label:phase:intel-conv" },
    { name: "INT Memory (INT-011…020)", filter: "project:MDEAPP label:phase:intel-memory" },
    { name: "INTEL Search", filter: "project:MDEAPP label:track:intelligence label:stack:search" },
    { name: "INTEL Supabase", filter: "project:MDEAPP label:track:intelligence label:stack:supabase" },
    { name: "INTEL Ranking", filter: "project:MDEAPP label:track:intelligence label:layer:ranking" },
    { name: "INTEL Grounding", filter: "project:MDEAPP label:track:intelligence label:layer:grounding" },
    { name: "INTEL Observability", filter: "project:MDEAPP label:track:intelligence label:layer:observability" },
    { name: "INT Routing layer", filter: "project:MDEAPP label:layer:routing" },
    { name: "INT Memory layer", filter: "project:MDEAPP label:layer:memory" },
  ];

  const logPath = join(ROOT, "tasks/linear/intelligence-import-log.json");
  writeFileSync(logPath, JSON.stringify({ ...report }, null, 2));

  const reportMd = buildReportMarkdown(report, idToLinear);
  writeFileSync(join(ROOT, "tasks/linear/intelligence-import-report.md"), reportMd);

  console.log(`\nWrote ${logPath}`);
  console.log(`created: ${report.created.length} updated: ${report.updated.length} errors: ${report.errors.length}`);
}

function buildReportMarkdown(report, idToLinear) {
  const next10 = FULL_REGISTRY.filter(
    (t) => t.phase === "intel-1b" && !SHIPPED.has(t.id),
  )
    .sort((a, b) => a.intelOrder - b.intelOrder)
    .slice(0, 10)
    .map((t) => t.id);

  const phase1Done = [...PHASE_1_ACTIVE].filter((id) => SHIPPED.has(id));

  return `# MIS Linear import report — ${report.at.split("T")[0]}

## Summary

| Metric | Count |
|--------|------:|
| Registry imported | ${report.registryCount} (MIS ${report.misCount ?? "?"}, INT ${report.intCount ?? "?"}) |
| Created | ${report.created.length} |
| Updated | ${report.updated.length} |
| Errors | ${report.errors.length} |
| Phase 1 shipped (Done) | ${phase1Done.length}/10 |
| Collisions | ${report.collisions?.length ?? 0} |
| Missing AI specs (not imported) | ${Object.keys(MISSING_IN_REGISTRY).length} |

## Phase 1 status

**Shipped (MIS-M1):** ${phase1Done.join(", ")}

**Next execution (Phase 1b):** ${next10.join(" → ") || "SEARCH-001, SEARCH-002, VEC-004, DATA-046, AI-003, AI-004"}

## Missing tasks (no disk spec — not imported)

${Object.entries(MISSING_IN_REGISTRY)
  .map(([id, reason]) => `- **${id}:** ${reason}`)
  .join("\n")}

## Duplicate / collision report

${report.collisions?.length ? report.collisions.map((c) => `- **${c.specId}:** ${c.issues.map((i) => i.identifier).join(" vs ")}`).join("\n") : "None detected."}

## Dependency gaps

${report.dependencyGaps?.length ? report.dependencyGaps.map((g) => `- ${g.task} missing blocker ${g.missingDep}`).join("\n") : "All blockers in registry."}

## Labels

${report.labelCheck?.map((l) => `- \`${l.name}\` ${l.ok ? "✅" : "❌"}`).join("\n") ?? "See import log"}

## Views (create manually in Linear)

${report.views?.map((v) => `### ${v.name}\n\`\`\`text\n${v.filter}\n\`\`\``).join("\n\n") ?? ""}

## SAN ↔ SPEC map (new issues)

${report.created.filter((c) => c.san).map((c) => `| ${c.san} | ${c.id} |`).join("\n") || "See intelligence-import-log.json"}

---
Hub: [\`11-intelligence-views.md\`](./11-intelligence-views.md)
`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
