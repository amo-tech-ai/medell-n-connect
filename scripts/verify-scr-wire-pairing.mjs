#!/usr/bin/env node
/**
 * Verify scr ↔ wire frontmatter pairing across domain task folders.
 * Exit 0 if all bidirectional links OK.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

const SCAN_DIRS = [
  "tasks/screens",
  "tasks/events/wireframes",
  "tasks/venues",
  "tasks/venues/tasks/mvp/wireframes",
  "tasks/trips",
  "tasks/maps/wireframes",
  "tasks/real-estate",
];

const SKIP = new Set([
  "INDEX.md",
  "00-index.md",
  "SCR-WIRE-PAIRING-CHECKLIST.md",
  "SCREEN-TESTING-STANDARD.md",
  "notes.md",
  "003-events-README.md",
  "005-008-places-README.md",
  "007-wire-nightlife-explorer.md",
]);

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  let key = null;
  let list = null;
  for (const line of m[1].split("\n")) {
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
    if (val === "[]") {
      fm[key] = [];
      key = null;
      continue;
    }
    fm[key] = val.replace(/^["']|["']$/g, "");
    if (!val.startsWith("[")) key = null;
  }
  if (list !== null && key) fm[key] = list;
  return fm;
}

/** @type {Map<string, { relPath: string, absPath: string }>} */
const fileIndex = new Map();

for (const dir of SCAN_DIRS) {
  const absDir = join(ROOT, dir);
  if (!existsSync(absDir)) continue;
  for (const f of readdirSync(absDir)) {
    if (!f.endsWith(".md") || SKIP.has(f)) continue;
    fileIndex.set(f, { relPath: `${dir}/${f}`, absPath: join(absDir, f) });
  }
}

const scrs = [...fileIndex.entries()].filter(([f]) => /-scr-/.test(f));
const wires = [...fileIndex.entries()].filter(([f]) => /-wire-/.test(f));

const scrWire = new Map();
const wireScr = new Map();

for (const [scrFile, { absPath }] of scrs) {
  scrWire.set(scrFile, parseFrontmatter(readFileSync(absPath, "utf8")).wireframes ?? []);
}
for (const [wireFile, { absPath }] of wires) {
  wireScr.set(wireFile, parseFrontmatter(readFileSync(absPath, "utf8")).screens ?? []);
}

const issues = [];

for (const [scr, ws] of scrWire) {
  const scrLoc = fileIndex.get(scr)?.relPath ?? scr;
  for (const w of ws) {
    const wf = w.endsWith(".md") ? w : `${w}.md`;
    if (!fileIndex.has(wf)) {
      issues.push(`MISSING FILE: ${scrLoc} → ${wf}`);
      continue;
    }
    const back = wireScr.get(wf) ?? [];
    if (!back.includes(scr)) {
      issues.push(`ONE-WAY: ${scrLoc} → ${fileIndex.get(wf).relPath} (add ${scr} to wire screens:)`);
    }
  }
}

for (const [wire, ss] of wireScr) {
  const wireLoc = fileIndex.get(wire)?.relPath ?? wire;
  for (const s of ss) {
    if (!s) continue;
    const sf = s.endsWith(".md") ? s : `${s}.md`;
    const back = scrWire.get(sf) ?? [];
    if (!back.includes(wire)) {
      issues.push(`ONE-WAY: ${wireLoc} → ${fileIndex.get(sf)?.relPath ?? sf} (add ${wire} to scr wireframes:)`);
    }
  }
}

if (issues.length) {
  console.error(`\n${issues.length} pairing issue(s):\n`);
  for (const i of issues) console.error(`  • ${i}`);
  process.exit(1);
}

console.log(
  `OK — ${scrs.length} scr, ${wires.length} wire, all bidirectional pairs match (${SCAN_DIRS.length} scan roots)`,
);
process.exit(0);
