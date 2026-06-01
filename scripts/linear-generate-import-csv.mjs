#!/usr/bin/env node
/**
 * Scan tasks/ → linear-import.csv + linear-import-review.md
 * Does not modify app code or call Linear write APIs.
 *
 * Usage: node scripts/linear-generate-import-csv.mjs
 * Requires LINEAR_API_KEY in env (reads from .env.local via caller).
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

const TASK_DIRS = [
  "tasks/core",
  "tasks/maps",
  "tasks/screens",
  "tasks/events",
  "tasks/vector",
  "tasks/agent/tasks",
  "tasks/mastra",
  "tasks/contest/tasks",
  "tasks/openclaw/tasks",
  "tasks/grounding-search/tasks",
];

const SKIP_DIR_PARTS = ["/commit/", "/audit/", "/notes/", "/testing/", "/wireframes/"];

const OPEN = new Set(["not started", "in progress", "partial", "open", "draft", "not started"]);
const DONE = new Set(["done", "shipped"]);
const SKIP_STATUS = new Set(["superseded", "cancelled", "canceled"]);

const MANUAL = [
  {
    id: "OPS-ANDRES-G1",
    title: "Andrés G1 — manual Stripe test payment → paid row + wallet QR",
    status: "Not Started",
    priority: "P0",
    phase: "phase-1",
    depends_on: [],
    relPath: "todo.md",
    track: "ops",
  },
];

const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

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
    if (val.startsWith("[") && val.endsWith("]")) {
      fm[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      fm[key] = val.replace(/^["']|["']$/g, "");
      key = null;
    }
  }
  if (list !== null && key) fm[key] = list;
  return fm;
}

function listMd(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((n) => n.endsWith(".md") && !n.endsWith("INDEX.md") && n !== "README.md")
    .map((n) => join(abs, n));
}

function track(id) {
  if (!id) return "core";
  if (id.startsWith("SCREEN-") || id.startsWith("CAFE-")) return "screens";
  if (id.startsWith("MAP-")) return "maps";
  if (id.startsWith("EVP-")) return "events";
  if (id.startsWith("VEC-")) return "vector";
  if (id.startsWith("CTI-")) return "agent";
  if (id.startsWith("MASTRA-")) return "mastra";
  if (id.startsWith("CTEST-")) return "contest";
  if (id.startsWith("OCL-")) return "openclaw";
  if (id.startsWith("GS-")) return "grounding";
  if (/^F\d/.test(id)) return "core";
  return "core";
}

function priorityLabel(p) {
  const m = { P0: "Urgent", P1: "High", P2: "Medium", P3: "Low", P4: "Low" };
  return m[String(p || "P2").toUpperCase()] ?? "Medium";
}

function linearStatus(status) {
  const s = String(status || "").toLowerCase();
  if (DONE.has(s)) return "Done";
  if (s === "in progress" || s === "partial") return "In Progress";
  if (SKIP_STATUS.has(s)) return "Canceled";
  return "Todo";
}

function isOpen(status) {
  const s = String(status || "").toLowerCase();
  return OPEN.has(s);
}

function csvEscape(s) {
  const t = String(s ?? "").replace(/\r/g, "");
  if (/[",\n]/.test(t)) return `"${t.replace(/"/g, '""')}"`;
  return t;
}

function labelsFor(task) {
  const labels = [`track:${task.track}`];
  if (task.phase && /phase\s*2|phase-2|cti-c|post-mvp|advanced|phase 2/i.test(String(task.phase))) {
    labels.push("phase-2");
  } else {
    labels.push("phase-1");
  }
  return labels.join(", ");
}

function descriptionFor(task) {
  const deps = task.depends_on?.length ? task.depends_on.join(", ") : "—";
  return [
    `**Task ID:** \`${task.id}\``,
    `**Spec:** \`${task.relPath}\``,
    `**Repo status:** ${task.status}`,
    `**Priority:** ${task.priority || "P2"}`,
    task.phase ? `**Phase:** ${task.phase}` : null,
    `**Depends on:** ${deps}`,
    "",
    "_Generated from mdeai tasks/ for Linear MDEAPP project._",
  ]
    .filter(Boolean)
    .join("\n");
}

async function fetchLinearIssues(apiKey) {
  const map = new Map();
  if (!apiKey) return map;
  let cursor = null;
  for (;;) {
    const res = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: apiKey },
      body: JSON.stringify({
        query: `query($id: String!, $after: String) {
          project(id: $id) {
            issues(first: 50, after: $after) {
              nodes { identifier title }
              pageInfo { hasNextPage endCursor }
            }
          }
        }`,
        variables: { id: PROJECT_ID, after: cursor },
      }),
    });
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
    const conn = json.data.project.issues;
    for (const issue of conn.nodes) {
      const prefix = issue.title.split(" — ")[0];
      map.set(prefix, issue.identifier);
    }
    if (!conn.pageInfo.hasNextPage) break;
    cursor = conn.pageInfo.endCursor;
  }
  return map;
}

function loadImportLog() {
  const p = join(ROOT, "tasks/linear/import-log.json");
  if (!existsSync(p)) return new Map();
  const log = JSON.parse(readFileSync(p, "utf8"));
  const m = new Map();
  for (const row of log.created || []) m.set(row.id, row.identifier);
  return m;
}

async function main() {
  const apiKey = process.env.LINEAR_API_KEY;
  const all = [];

  for (const dir of TASK_DIRS) {
    for (const file of listMd(dir)) {
      const rel = relative(ROOT, file);
      if (SKIP_DIR_PARTS.some((p) => rel.includes(p))) continue;
      const raw = readFileSync(file, "utf8");
      const fm = parseFrontmatter(raw);
      if (!fm.status && !fm.id) continue;
      const stem = basename(file, ".md");
      const id = fm.id || stem;
      all.push({
        id,
        title: fm.title || stem,
        status: fm.status || "Not Started",
        priority: fm.priority || "P2",
        phase: fm.phase || "",
        depends_on: Array.isArray(fm.depends_on) ? fm.depends_on : [],
        relPath: rel,
        track: track(id),
        open: isOpen(fm.status),
      });
    }
  }
  for (const m of MANUAL) all.push({ ...m, open: true });

  all.sort((a, b) => {
    const ta = a.track.localeCompare(b.track);
    if (ta) return ta;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });

  const openRows = all.filter((t) => t.open);
  let linearMap = new Map();
  try {
    linearMap = await fetchLinearIssues(apiKey);
  } catch (e) {
    console.warn("Linear API read failed:", e.message);
    linearMap = loadImportLog();
  }
  if (linearMap.size === 0) linearMap = loadImportLog();

  const headers = [
    "Title",
    "Description",
    "Priority",
    "Status",
    "Assignee",
    "Created",
    "Completed",
    "Labels",
    "Estimate",
  ];

  const csvLines = [headers.join(",")];
  for (const task of openRows) {
    const title = `${task.id} — ${task.title}`;
    const row = [
      csvEscape(title),
      csvEscape(descriptionFor(task)),
      csvEscape(priorityLabel(task.priority)),
      csvEscape(linearStatus(task.status)),
      "",
      "",
      "",
      csvEscape(labelsFor(task)),
      "",
    ];
    csvLines.push(row.join(","));
  }

  const csvPath = join(ROOT, "linear-import.csv");
  writeFileSync(csvPath, csvLines.join("\n") + "\n");

  const byTrack = {};
  const byStatus = {};
  for (const t of all) {
    byTrack[t.track] = byTrack[t.track] || { open: 0, done: 0, other: 0 };
    const s = String(t.status).toLowerCase();
    if (isOpen(t.status)) byTrack[t.track].open++;
    else if (DONE.has(s)) byTrack[t.track].done++;
    else byTrack[t.track].other++;
    byStatus[t.status] = (byStatus[t.status] || 0) + 1;
  }

  const already = openRows.filter((t) => linearMap.has(t.id));
  const missing = openRows.filter((t) => !linearMap.has(t.id));

  const p0 = openRows.filter((t) =>
    ["OPS-ANDRES-G1", "SCREEN-021", "EVP-003-core", "EVP-001-core", "SCREEN-010"].includes(t.id),
  );

  let md = `# linear-import-review.md

Generated: ${new Date().toISOString().slice(0, 10)}  
Source: scan of \`/home/sk/mdeai/tasks/**\`  
Output CSV: [\`linear-import.csv\`](./linear-import.csv) (Linear CLI / CSV import format)  
Target project: [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/overview) · Team **Sanjiovani**

---

## Summary

| Metric | Count |
|--------|------:|
| Task specs scanned (with \`status:\`) | **${all.length}** |
| **Open** (CSV rows) | **${openRows.length}** |
| Done / shipped (excluded from CSV) | ${all.length - openRows.length - all.filter((t) => SKIP_STATUS.has(String(t.status).toLowerCase())).length} |
| Superseded / cancelled (excluded) | ${all.filter((t) => SKIP_STATUS.has(String(t.status).toLowerCase())).length} |
| Already in Linear MDEAPP | **${already.length}** |
| Open but not in Linear | **${missing.length}** |

Linear API: ${apiKey ? "verified (read-only project query)" : "not set — cross-ref from import-log.json only"}

---

## CSV format

Columns match [Linear CSV import](https://linear.app/docs/import-issues) (\`@linear/import\` CLI → **Linear** option):

| Column | Source |
|--------|--------|
| Title | \`{id} — {title}\` from frontmatter |
| Description | Spec path, status, depends_on |
| Priority | P0→Urgent, P1→High, P2→Medium, P3/P4→Low |
| Status | Repo Not Started/Open→**Todo**; In Progress/Partial→**In Progress** |
| Labels | \`track:{screens|maps|core|events|vector|agent|…}\`, \`phase-1\` or \`phase-2\` |
| Assignee / Created / Completed / Estimate | empty (Linear fills on import) |

**Import command (optional CLI path):**

\`\`\`bash
cd /home/sk/mdeai
export LINEAR_API_KEY=...   # from .env.local
pnpm dlx @linear/import     # choose Linear CSV → linear-import.csv
\`\`\`

Preferred path remains \`node scripts/linear-import-tasks.mjs\` (GraphQL, preserves relations).

---

## Scanned directories

| Directory | Included |
|-----------|----------|
| \`tasks/core\` | F* platform |
| \`tasks/maps\` | MAP-* |
| \`tasks/screens\` | SCREEN-*, CAFE-* |
| \`tasks/events\` | EVP-* |
| \`tasks/vector\` | VEC-* |
| \`tasks/agent/tasks\` | CTI-* |
| \`tasks/mastra\` | MASTRA-* |
| \`tasks/contest/tasks\` | CTEST-* (Phase 2+) |
| \`tasks/openclaw/tasks\` | OCL-* |
| \`tasks/grounding-search/tasks\` | GS-* |

**Excluded:** \`tasks/commit/\`, \`tasks/audit/\`, \`tasks/notes/\`, \`tasks/testing/\`, \`tasks/wireframes/\`, INDEX/README-only files.

---

## By track

| Track | Open | Done | Other |
|-------|-----:|-----:|------:|
`;

  for (const [tr, c] of Object.entries(byTrack).sort()) {
    md += `| ${tr} | ${c.open} | ${c.done} | ${c.other} |\n`;
  }

  md += `
---

## By repo status

| Status | Count |
|--------|------:|
`;
  for (const [st, n] of Object.entries(byStatus).sort((a, b) => b[1] - a[1])) {
    md += `| ${st} | ${n} |\n`;
  }

  md += `
---

## P0 queue (implementation order)

| Task ID | CSV title | Linear |
|---------|-----------|--------|
`;
  for (const t of p0) {
    const lin = linearMap.get(t.id) || "—";
    const link =
      typeof lin === "string" && lin.startsWith("SAN-")
        ? `[${lin}](https://linear.app/sanjiovani/issue/${lin})`
        : lin;
    md += `| ${t.id} | ${t.id} — ${t.title.slice(0, 50)}… | ${link} |\n`;
  }

  md += `
---

## Open tasks — Linear cross-reference

| Task ID | Track | Priority | Spec | Linear |
|---------|-------|----------|------|--------|
`;
  for (const t of openRows) {
    const lin = linearMap.get(t.id) || "**missing**";
    md += `| ${t.id} | ${t.track} | ${t.priority} | \`${t.relPath}\` | ${lin} |\n`;
  }

  if (missing.length) {
    md += `
### Missing from Linear (${missing.length})

`;
    for (const t of missing) md += `- \`${t.id}\` — ${t.relPath}\n`;
  }

  md += `
---

## Notes

- **Done** tasks intentionally omitted from CSV (Linear best practice: import open work only).
- Prior GraphQL import: \`tasks/linear/import-log.json\` (SAN-95…SAN-178, 84 issues, 107 block relations).
- Re-run CSV generator: \`node scripts/linear-generate-import-csv.mjs\` with \`LINEAR_API_KEY\` from \`.env.local\`.
- Spec files remain source of truth under \`tasks/\`; flip \`status: Done\` + evidence when shipping.

`;

  const mdPath = join(ROOT, "linear-import-review.md");
  writeFileSync(mdPath, md);

  console.log(`Wrote ${csvPath} (${openRows.length} rows)`);
  console.log(`Wrote ${mdPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
