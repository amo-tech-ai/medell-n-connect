#!/usr/bin/env node
/**
 * Build master IMP-### implementation order from tasks/** specs + Linear import log.
 * Output: tasks/linear/implementation-order.json + implementation-order.csv
 *
 * Usage: node scripts/linear-build-implementation-order.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

const TASK_DIRS = [
  "tasks/core",
  "tasks/maps",
  "tasks/screens",
  "tasks/events/tasks",
  "tasks/data/tasks",
  "tasks/data/tasks-data",
  "tasks/trips/tasks",
  "tasks/real-estate/tasks",
  "tasks/vector",
  "tasks/agent/tasks",
  "tasks/mastra",
  "tasks/contest/tasks",
  "tasks/openclaw/tasks",
  "tasks/grounding-search/tasks",
];

const SKIP_FILES = new Set([
  "INDEX.md",
  "README.md",
  "SCREEN-TESTING-STANDARD.md",
  "00-index.md",
  "notes.md",
]);

const MILESTONES = [
  { name: "P0 — MVP gates", sortOrder: 0 },
  { name: "W1 foundation (shipped)", sortOrder: 0.5 },
  { name: "P1 — Events polish", sortOrder: 1 },
  { name: "P1 — Screens & café", sortOrder: 2 },
  { name: "P1 — Maps & core", sortOrder: 3 },
  { name: "P2 — Platform quality", sortOrder: 3.5 },
  { name: "Phase 2 — Vector", sortOrder: 4 },
  { name: "Phase 2 — Coffee tours (CTI)", sortOrder: 5 },
  { name: "Phase 2 — Events discovery", sortOrder: 6 },
  { name: "Deferred — Grounding search", sortOrder: 7 },
  { name: "Deferred — OpenClaw", sortOrder: 8 },
  { name: "Deferred — Contest", sortOrder: 9 },
];

const P0_IDS = new Set([
  "OPS-ANDRES-G1",
  "EVP-003-core",
  "EVP-013-core",
  "G3-core-host-publish-proof",
  "EVP-001-core",
  "F32",
  "AUTH-011",
  "MAP-002B",
  "MAP-008B",
]);

const SHIPPED_FOUNDATION = [
  "F01", "F01b", "F02", "F03", "F04", "F05", "F06", "F07", "F08", "F09", "F10",
  "F11", "F12", "F13", "F14", "F15", "F17", "F18", "F19", "F46", "F47", "F48",
  "F49", "F50", "F50b",
];

const SHIPPED_MAPS = [
  "MAP-001", "MAP-002", "MAP-004", "MAP-007B", "MAP-008", "MAP-009", "MAP-013",
  "MAP-014", "MAP-015", "MAP-016", "MAP-017", "MAP-018", "MAP-019", "MAP-030", "MAP-031",
];

const SHIPPED_SCREENS = [
  "SCREEN-001", "SCREEN-003", "SCREEN-004", "SCREEN-005", "SCREEN-006", "SCREEN-007",
  "SCREEN-008", "SCREEN-009", "SCREEN-011", "SCREEN-012", "SCREEN-013", "SCREEN-014",
  "SCREEN-015", "SCREEN-016", "SCREEN-019", "SCREEN-020",
];

const WITHIN_MILESTONE = {
  "W1 foundation (shipped)": [
    ...SHIPPED_FOUNDATION,
    ...SHIPPED_MAPS,
    ...SHIPPED_SCREENS,
    "MASTRA-001", "MASTRA-004", "MASTRA-005", "EVT-01", "ADK-CR",
  ],
  "P0 — MVP gates": [
    "OPS-ANDRES-G1",
    "EVP-003-core",
    "EVP-013-core",
    "G3-core-host-publish-proof",
    "EVP-001-core",
    "F32",
    "AUTH-011",
    "MAP-002B",
    "MAP-008B",
  ],
  "P1 — Events polish": ["EVP-014-core"],
  "P1 — Screens & café": ["SCREEN-017", "SCREEN-010", "CAFE-001", "SCREEN-002", "SCREEN-018"],
  "P1 — Maps & core": ["MAP-010", "MAP-002E", "MAP-002D", "MAP-002A-ADK"],
  "P2 — Platform quality": ["AUTH-005", "AUTH-009"],
  "Deferred — Grounding search": ["GS-005", "GS-006", "GS-007", "GS-008", "GS-009"],
};

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  const lines = m[1].split("\n");
  let key = null;
  let list = null;
  for (const line of lines) {
    if (list !== null) {
      if (/^\s+-\s+/.test(line)) {
        list.push(line.replace(/^\s+-\s+/, "").trim());
        continue;
      }
      fm[key] = list;
      list = null;
      key = null;
    }
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    key = kv[1];
    const val = kv[2].trim();
    if (val === "") {
      list = [];
      continue;
    }
    fm[key] = val.replace(/^["']|["']$/g, "");
    if (!val.startsWith("[")) key = null;
  }
  if (list !== null && key) fm[key] = list;
  return fm;
}

function isDone(status) {
  const s = String(status || "").toLowerCase();
  return s === "done" || s.includes("phase a.5 done") || s.includes("phase a done");
}

function isSkipped(status) {
  const s = String(status || "").toLowerCase();
  return s.includes("superseded") || s.includes("cancel");
}

function milestoneFor(id, done) {
  if (done && (SHIPPED_FOUNDATION.includes(id) || /^F\d/.test(id))) {
    return "W1 foundation (shipped)";
  }
  if (done && (id.startsWith("MAP-") || id.startsWith("SCREEN-") || id.startsWith("MASTRA-") || id === "EVT-01")) {
    return "W1 foundation (shipped)";
  }
  if (P0_IDS.has(id)) return "P0 — MVP gates";
  if (id === "MAP-002B" || id === "MAP-008B") return "P0 — MVP gates";
  if (/^EVP-014-core/.test(id)) return "P1 — Events polish";
  if (id.startsWith("AUTH-005") || id.startsWith("AUTH-009")) return "P2 — Platform quality";
  if (id.startsWith("AUTH-")) return "P0 — MVP gates";
  if (id.startsWith("G3-")) return "P0 — MVP gates";
  if (id.startsWith("SCREEN-") || id.startsWith("CAFE-")) return "P1 — Screens & café";
  if (id.startsWith("MAP-")) return "P1 — Maps & core";
  if (/^F\d/.test(id) || id.startsWith("MASTRA-")) return "P1 — Maps & core";
  if (id.startsWith("VEC-")) return "Phase 2 — Vector";
  if (id.startsWith("CTI-")) return "Phase 2 — Coffee tours (CTI)";
  if (id.startsWith("EVP-")) return "Phase 2 — Events discovery";
  if (id.startsWith("OCL-")) return "Deferred — OpenClaw";
  if (id.startsWith("CTEST-")) return "Deferred — Contest";
  if (id.startsWith("GS-")) return "Deferred — Grounding search";
  if (id === "OPS-ANDRES-G1") return "P0 — MVP gates";
  return "P1 — Maps & core";
}

function rankKey(id, msName, done) {
  const ms = MILESTONES.find((m) => m.name === msName) ?? MILESTONES[3];
  const explicit = WITHIN_MILESTONE[msName] ?? [];
  const idx = explicit.indexOf(id);
  let sub = idx >= 0 ? idx : 5000;
  if (sub === 5000) {
    const num = id.match(/(\d+)/);
    sub = num ? 1000 + parseInt(num[1], 10) : 9000 + id.charCodeAt(0);
  }
  // Done before open within same milestone bucket
  const doneBias = done ? 0 : 10000;
  return ms.sortOrder * 100000 + doneBias + sub;
}

function listMdFiles(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((n) => n.endsWith(".md") && !SKIP_FILES.has(n))
    .filter((n) => !n.includes("-wire-"))
    .filter((n) => !/^\d{3}-(?!scr)/.test(n))
    .map((n) => join(abs, n));
}

function loadSpecs() {
  const specs = [];
  for (const dir of TASK_DIRS) {
    for (const file of listMdFiles(dir)) {
      const raw = readFileSync(file, "utf8");
      const fm = parseFrontmatter(raw);
      const stem = basename(file, ".md");
      const id = fm.id || stem;
      if (isSkipped(fm.status)) continue;
      const done = isDone(fm.status);
      const msName = milestoneFor(id, done);
      specs.push({
        id,
        title: fm.title || stem,
        status: fm.status || "Unknown",
        done,
        specPath: file.replace(ROOT + "/", ""),
        msName,
        rank: rankKey(id, msName, done),
      });
    }
  }
  // Manual ops task
  if (!specs.find((s) => s.id === "OPS-ANDRES-G1")) {
    specs.push({
      id: "OPS-ANDRES-G1",
      title: "Andrés G1 — manual Stripe test payment",
      status: "Not Started",
      done: false,
      specPath: "todo.md",
      msName: "P0 — MVP gates",
      rank: rankKey("OPS-ANDRES-G1", "P0 — MVP gates", false),
    });
  }
  return specs.sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id));
}

function loadLinearMap() {
  const logPath = join(ROOT, "tasks/linear/import-log.json");
  const log = JSON.parse(readFileSync(logPath, "utf8"));
  const map = new Map();
  for (const row of [...(log.created ?? []), ...(log.skipped ?? [])]) {
    if (row.id && row.identifier) map.set(row.id, row.identifier);
  }
  return map;
}

function padImp(n) {
  return String(n).padStart(3, "0");
}

function main() {
  const specs = loadSpecs();
  const linearMap = loadLinearMap();

  const shippedSpecs = specs.filter((s) => s.done).sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id));
  const openSpecs = specs.filter((s) => !s.done).sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id));
  const ordered = [...shippedSpecs, ...openSpecs];

  const rows = ordered.map((s, i) => ({
    imp: padImp(i + 1),
    impNum: i + 1,
    taskId: s.id,
    san: linearMap.get(s.id) ?? null,
    statusDisk: s.status,
    shipped: s.done,
    milestone: s.msName,
    specPath: s.specPath,
    title: s.title,
    inLinear: linearMap.has(s.id),
  }));

  const shipped = rows.filter((r) => r.shipped);
  const open = rows.filter((r) => !r.shipped);

  const inLinear = rows.filter((r) => r.inLinear);

  const manifest = {
    generated: new Date().toISOString().slice(0, 10),
    scheme: {
      IMP: "Global implementation sequence (001 = first ever, ascending)",
      SAN: "Linear team auto-ID (creation order — immutable)",
      taskId: "Domain prefix from tasks/** frontmatter (F01, SCREEN-021, MAP-011…)",
    },
    counts: {
      total: rows.length,
      shipped: shipped.length,
      open: open.length,
      inLinear: inLinear.length,
    },
    nextOpen: open[0] ?? null,
    rows,
  };

  writeFileSync(
    join(ROOT, "tasks/linear/implementation-order.json"),
    JSON.stringify(manifest, null, 2),
  );

  const csvHeader =
    "IMP,Task ID,SAN,Status (disk),Shipped,Milestone,In Linear,Spec path,Title\n";
  const csvBody = rows
    .map((r) =>
      [
        r.imp,
        r.taskId,
        r.san ?? "",
        `"${String(r.statusDisk).replace(/"/g, '""')}"`,
        r.shipped ? "yes" : "no",
        `"${r.milestone}"`,
        r.inLinear ? "yes" : "no",
        r.specPath,
        `"${String(r.title).replace(/"/g, '""')}"`,
      ].join(","),
    )
    .join("\n");
  writeFileSync(join(ROOT, "tasks/linear/implementation-order.csv"), csvHeader + csvBody);

  console.log(`IMP-001 … IMP-${padImp(rows.length)} (${rows.length} tasks)`);
  console.log(`  Shipped: ${shipped.length} · Open: ${open.length} · In Linear: ${inLinear.length}`);
  console.log(`  Next open: IMP-${open[0]?.imp} ${open[0]?.taskId} (${open[0]?.san ?? "not in Linear"})`);
  console.log(`Wrote tasks/linear/implementation-order.json + .csv`);
}

main();
