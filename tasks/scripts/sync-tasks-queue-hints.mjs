#!/usr/bin/env node
/**
 * Hint which tasks.md rows may be stale vs mdeapp git history.
 * Usage: node tasks/scripts/sync-tasks-queue-hints.mjs [--since 30]
 * Does NOT auto-edit tasks.md — prints suggestions only.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const TASKS_MD = path.join(REPO_ROOT, "tasks.md");
const MDEAPP = path.join(REPO_ROOT, "mdeapp");

const sinceDays = (() => {
  const i = process.argv.indexOf("--since");
  return i >= 0 ? Number(process.argv[i + 1]) || 30 : 30;
})();

const TASK_PATTERN =
  /\b(VEN-\d+|SEARCH-\d+|DATA-\d+|SAN-\d+|TRIP-\d+|MAP-\d+[A-Z]?|AUTH-\d+|F13|OPS-JOURNEY)\b/gi;

function gitLog(since) {
  const r = spawnSync(
    "git",
    [
      "log",
      `--since=${since} days ago`,
      "--oneline",
      "--grep=feat",
      "--grep=fix",
      "--all-match",
    ],
    { cwd: MDEAPP, encoding: "utf8" },
  );
  if (r.status !== 0) {
    const r2 = spawnSync(
      "git",
      ["log", `--since=${since} days ago`, "--oneline"],
      { cwd: MDEAPP, encoding: "utf8" },
    );
    return r2.stdout ?? "";
  }
  return r.stdout ?? "";
}

function readTasksMd() {
  return fs.readFileSync(TASKS_MD, "utf8");
}

function main() {
  const log = gitLog(sinceDays);
  const tasksMd = readTasksMd();
  const mentionedInGit = new Set();
  for (const line of log.split("\n")) {
    for (const m of line.matchAll(TASK_PATTERN)) {
      mentionedInGit.add(m[1].toUpperCase());
    }
    for (const m of line.matchAll(/\(#(\d+)\)/g)) {
      mentionedInGit.add(`PR-${m[1]}`);
    }
  }

  const doneSection = tasksMd.includes("## Venues — done");
  const inDone = new Set();
  const doneMatch = tasksMd.match(/### Venues — done[\s\S]*?(?=###|## Other)/);
  if (doneMatch) {
    for (const m of doneMatch[0].matchAll(TASK_PATTERN)) {
      inDone.add(m[1].toUpperCase());
    }
  }

  const activeStale = [];
  for (const id of mentionedInGit) {
    if (id.startsWith("PR-")) continue;
    const inActive = tasksMd.includes(`**${id}**`);
    if (inActive && !inDone.has(id) && !tasksMd.includes(`| **${id}**`)) {
      // row might still be active with wrong dot
    }
    if (inActive && tasksMd.match(new RegExp(`\\|[^\\n]*\\*\\*${id}\\*\\*[^\\n]*🟢`))) {
      continue;
    }
    if (mentionedInGit.has(id) && inActive && !inDone.has(id)) {
      const row = tasksMd
        .split("\n")
        .find((l) => l.includes(`**${id}**`) && l.startsWith("|"));
      if (row && !row.includes("🟢") && !row.includes("100")) {
        activeStale.push({ id, row: row.trim() });
      }
    }
  }

  console.log(`# tasks.md queue hints (${sinceDays}d mdeapp git)\n`);
  console.log(`Tasks mentioned in commits: ${[...mentionedInGit].filter((x) => !x.startsWith("PR")).join(", ") || "(none)"}\n`);

  if (activeStale.length === 0) {
    console.log("No obvious stale active rows (🟢/100% mismatch).");
  } else {
    console.log("## Consider updating tasks.md:\n");
    for (const { id, row } of activeStale) {
      console.log(`- **${id}** — in git but active row not 🟢:\n  ${row}\n`);
    }
  }

  console.log("\nRun: node tasks/scripts/sync-tasks-queue-hints.mjs --since 14");
  console.log("Playbook: tasks/notes/improve.md §9");
}

main();
