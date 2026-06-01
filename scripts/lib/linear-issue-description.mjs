/**
 * Rich Linear issue descriptions from mdeai task specs.
 * Every imported issue should include: purpose, goals, features, real-world example,
 * view URLs (localhost + prod), and completion proof when shipped.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PROD = "https://www.mdeai.co";
const LOCAL = "http://localhost:3001";
/** Demo trip from SCREEN-013 evidence — Camila salsa weekend */
const DEMO_TRIP_ID = "11111111-1111-1111-1111-000000000002";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** @param {unknown} v */
function asList(v) {
  if (Array.isArray(v)) return v;
  if (v == null || v === "") return [];
  return [String(v)];
}

/** @param {string} body @param {string[]} sectionNames */
export function extractSection(body, sectionNames) {
  for (const name of sectionNames) {
    const re = new RegExp(`^##\\s+${escapeRe(name)}\\s*$`, "im");
    const m = body.match(re);
    if (!m) continue;
    const start = m.index + m[0].length;
    const rest = body.slice(start);
    const endMatch = rest.match(/^##\s+/m);
    const content = (endMatch ? rest.slice(0, endMatch.index) : rest).trim();
    if (content) return content.slice(0, 1500);
  }
  return "";
}

/** @param {string} userStory */
export function extractPersona(userStory) {
  const m = userStory.match(/As\s+\*\*([^*]+)\*\*/i) || userStory.match(/As\s+(\w+)/i);
  return m ? m[1].trim() : "";
}

/** @param {string} body */
export function extractSurface(body, fm) {
  const screen = extractSection(body, ["Screen / path", "Screen", "Path", "Route"]);
  if (screen) {
    const first = screen.split("\n")[0].replace(/^[-*]\s*/, "").trim();
    if (first) return first.slice(0, 120);
  }
  if (fm.path) return fm.path;
  return "";
}

/** @param {string} text */
function firstParagraph(text) {
  if (!text) return "";
  const block = text.split(/\n##\s+/)[0].trim();
  const para = block.split(/\n\n+/)[0].replace(/\n/g, " ").trim();
  return para.slice(0, 500);
}

/** @param {string} buildScope */
export function extractFeatureBullets(buildScope, max = 6) {
  if (!buildScope) return [];
  const lines = buildScope.split("\n");
  const out = [];
  for (const line of lines) {
    const t = line.trim();
    if (!/^[-*]/.test(t)) continue;
    const item = t.replace(/^[-*]\s+/, "").replace(/\*\*/g, "").trim();
    if (item.length < 8 || item.length > 200) continue;
    if (/^###\s/.test(item)) continue;
    out.push(item);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * @param {{ persona?: string, userStory?: string, goal?: string, title?: string, surface?: string, kind?: string }}
 */
/** @param {string} pathRaw */
function expandPath(pathRaw) {
  if (!pathRaw) return [];
  const p = pathRaw.trim();
  const routes = [];
  if (p.includes("all MVP") || p.includes("Cross-cutting")) {
    routes.push(
      { label: "Home / chat", path: "/" },
      { label: "Trips dashboard", path: "/trips" },
      { label: "Trip workspace (demo)", path: `/trips/${DEMO_TRIP_ID}` },
      { label: "Login", path: "/login" },
    );
    return routes;
  }
  if (p.includes("café") || p.includes("cafe mode") || p === "/ (café mode)") {
    routes.push({
      label: "Home — café chat (sample prompt below)",
      path: "/",
      note: 'Send in chat: "Quiet cafés near Laureles"',
    });
    return routes;
  }
  if (p.includes("modal")) {
    routes.push({
      label: "Home — open modal from rental/event card",
      path: "/",
      note: "Use Schedule viewing or checkout CTA on a card",
    });
    return routes;
  }
  const normalized = p
    .replace(/\s*\(.*\)/, "")
    .replace(/chat-first only.*/i, "")
    .trim();
  if (normalized.includes(":id")) {
    routes.push({
      label: "Trip workspace (demo trip)",
      path: normalized.replace(":id", DEMO_TRIP_ID),
    });
    routes.push({ label: "Trips list", path: "/trips" });
    return routes;
  }
  if (normalized.startsWith("/")) {
    routes.push({ label: normalized, path: normalized.split(/\s/)[0] });
    return routes;
  }
  return [{ label: p, path: "/" }];
}

/**
 * @param {{ fm?: Record<string, unknown>, body?: string, id?: string, screen_ids?: string[] }}
 */
export function resolveViewUrls(task) {
  const fm = task.fm || {};
  const surface =
    extractSurface(task.body || "", fm) || String(fm.path || "");
  const routes = expandPath(surface);
  if (!routes.length && fm.path) routes.push(...expandPath(String(fm.path)));

  return routes.map((r) => ({
    label: r.label,
    localhost: `${LOCAL}${r.path}`,
    prod: `${PROD}${r.path}`,
    note: r.note,
  }));
}

/**
 * @param {string} taskId
 * @param {string} [repoRoot]
 */
export function loadEvidenceSnippet(taskId, repoRoot = process.cwd()) {
  const candidates = [
    join(repoRoot, "tasks/evidence", `${taskId}-evidence.md`),
    join(repoRoot, "tasks/notes", `${taskId}-evidence.md`),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, "utf8");
    const rel = p.replace(repoRoot + "/", "");
    const lines = [];
    const verified = raw.match(/\*\*Verified:\*\*\s*(.+)/i)?.[1];
    const date = raw.match(/\*\*Date:\*\*\s*(.+)/i)?.[1];
    if (verified || date) lines.push(`Verified: ${verified || date}`);

    const pw = raw.match(/(\d+\/\d+)\s*pass/i) || raw.match(/Playwright[^\n]*(\d+\/\d+)/i);
    if (pw) lines.push(`Playwright: ${pw[1] || pw[0]}`);

    const floor = /floor[^\n]*exit\s*0/i.test(raw) ? "floor: exit 0" : "";
    if (floor) lines.push(floor);

    const grade = raw.match(/Grade:\s*\*\*([^*]+)\*\*/)?.[1];
    if (grade) lines.push(`Grade: ${grade.trim()}`);

    return { relPath: rel, summary: lines.length ? lines.join(" · ") : "Evidence file on disk", raw: raw.slice(0, 400) };
  }
  return null;
}

export function buildRealWorldExample({ persona, userStory, goal, title, surface, kind }) {
  if (persona && userStory) {
    const want = userStory.match(/I want (.+?),/is)?.[1]?.trim();
    const so = userStory.match(/so (.+?)[.\n]/is)?.[1]?.trim();
    const surfaceBit = surface ? ` on \`${surface}\`` : "";
    const action = want ? `taps through the flow to ${want.toLowerCase()}` : "uses this screen";
    const outcome = so ? ` → ${so}` : goal ? ` → ${firstParagraph(goal)}` : "";
    return `**${persona}**${surfaceBit} ${action}${outcome}.`;
  }
  if (goal) {
    return firstParagraph(goal);
  }
  const noun = kind === "wire" ? "designer/dev" : "user";
  return `When shipped, a ${noun} can complete **${title || "this flow"}** on mdeai without workarounds.`;
}

/**
 * @param {{
 *   id: string,
 *   title: string,
 *   relPath: string,
 *   status?: string,
 *   fm?: Record<string, unknown>,
 *   kind?: string,
 *   body?: string,
 *   summary?: string,
 * }} task
 */
function isShipped(task) {
  const s = String(task.status || task.fm?.status || task.fm?.build_status || "").toLowerCase();
  return /done|shipped|phase a\.5 done|phase a done/.test(s);
}

/**
 * @param {*} task
 * @param {string} [repoRoot]
 */
export function buildLinearDescription(task, repoRoot = process.cwd()) {
  const fm = task.fm || {};
  const body = task.body || "";
  const kind = task.kind || "task";

  let goal = firstParagraph(
    extractSection(body, ["Goal", "Goals", "Purpose", "1. Purpose", "Objective"]),
  );
  const userStory = firstParagraph(extractSection(body, ["User story", "User Story"]));

  if (!goal && kind === "wire") {
    const intro = body.match(/^#\s+[^\n]+\n+([\s\S]*?)(?=\n##\s+)/)?.[1];
    goal =
      firstParagraph(intro) ||
      (fm.persona && fm.path
        ? `Design + UX spec for **${fm.persona}** on \`${fm.path}\`: ${task.title}.`
        : "");
    const state = extractSection(body, ["Current mdeai state", "Current state"]);
    if (state) {
      const shipped = state
        .split("\n")
        .filter((l) => /\|\s*✅/.test(l))
        .slice(0, 4)
        .map((l) => l.split("|")[1]?.trim())
        .filter(Boolean);
      if (shipped.length) goal += ` Shipped: ${shipped.join("; ")}.`;
    }
  }
  const persona = extractPersona(userStory);
  const surface = extractSurface(body, fm);
  const buildScope = extractSection(body, [
    "Build scope",
    "Scope",
    "Implementation",
    "Deliverables",
  ]);
  const features = extractFeatureBullets(buildScope);
  const acceptance = extractSection(body, ["Acceptance criteria", "Acceptance Criteria"]);
  const acceptLines = acceptance
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+\[?\s?[xX ]?\]?\s/.test(l))
    .slice(0, 4)
    .map((l) => l.replace(/^[-*]\s+\[?\s?[xX ]?\]?\s*/, ""));

  const purpose =
    goal ||
    userStory ||
    firstParagraph(task.summary || "") ||
    `${task.title} — see spec for full scope.`;

  const goalsBlock = [];
  if (goal) goalsBlock.push(goal);
  if (userStory && userStory !== goal) goalsBlock.push(userStory);
  if (acceptLines.length) {
    goalsBlock.push("", "Key outcomes:", ...acceptLines.map((l) => `- ${l}`));
  }

  const realWorld = buildRealWorldExample({
    persona,
    userStory,
    goal,
    title: task.title,
    surface,
    kind,
  });

  const typeLabel =
    kind === "wire"
      ? "wireframe / design spec"
      : kind === "scr"
        ? "screen build spec"
        : "platform task";

  const lines = [
    `## Purpose`,
    purpose,
    "",
    `## Goals`,
    goalsBlock.length ? goalsBlock.join("\n") : purpose,
    "",
    `## Features`,
  ];

  if (features.length) {
    lines.push(...features.map((f) => `- ${f}`));
  } else if (buildScope) {
    lines.push(firstParagraph(buildScope));
  } else {
    lines.push(`- Implement **${task.title}** per spec`);
    const blocks = asList(fm.blocks);
    if (blocks.length) lines.push(`- Unblocks: ${blocks.join(", ")}`);
  }

  lines.push("", `## Real-world example`, realWorld);

  if (persona || surface) {
    lines.push("", `## Persona & surface`);
    if (persona) lines.push(`- **Persona:** ${persona}`);
    if (surface) lines.push(`- **Surface:** ${surface}`);
  }

  const viewUrls = resolveViewUrls({ fm, body, id: task.id, screen_ids: fm.screen_ids });
  if (viewUrls.length) {
    lines.push("", `## Where to view (exact URLs)`);
    lines.push("| Surface | Localhost | Production |");
    lines.push("|---------|-----------|------------|");
    for (const v of viewUrls) {
      const note = v.note ? ` (${v.note})` : "";
      lines.push(`| ${v.label}${note} | [open](${v.localhost}) | [open](${v.prod}) |`);
    }
    lines.push("", `**Local dev:** \`cd mdeapp && npm run dev\` → confirm port on \`[ui]\` line (usually \`:3001\`).`);
  }

  const screenIds = asList(fm.screen_ids);
  const pairedScreen = screenIds[0] || fm.paired_scr;
  if (kind === "wire" && pairedScreen) {
    const sid = screenIds[0] || fm.paired_scr;
    if (sid && String(sid).startsWith("SCREEN-")) {
      lines.push(`- **Built as:** \`${sid}\` — use URLs above (wireframe = design; screen = implementation).`);
    }
  }

  const evidence =
    loadEvidenceSnippet(task.id, repoRoot) ||
    (screenIds[0] ? loadEvidenceSnippet(screenIds[0], repoRoot) : null);

  if (isShipped(task) || evidence) {
    lines.push("", `## Completion proof`);
    if (evidence) {
      lines.push(`- **Evidence file:** \`${evidence.relPath}\``);
      lines.push(`- **Summary:** ${evidence.summary}`);
    } else if (isShipped(task)) {
      lines.push(`- Repo marks **${task.status || fm.build_status || "Done"}** — add \`tasks/evidence/${task.id}-evidence.md\` if missing.`);
    }
    if (fm.playwright_spec) {
      lines.push(`- **Playwright:** \`${fm.playwright_spec}\``);
    }
    lines.push(
      `- **Agent must verify:** restart dev → localhost URLs above → same flow on [mdeai.co](${PROD}/) before claiming ship.`,
    );
  }

  lines.push(
    "",
    `## Tracking`,
    `| Field | Value |`,
    `|-------|-------|`,
    `| Task ID | \`${task.id}\` |`,
    `| Spec | \`${task.relPath}\` |`,
    `| Type | ${typeLabel} |`,
    `| Repo status | ${task.status || "—"} |`,
  );

  if (fm.priority) lines.push(`| Priority | ${fm.priority} |`);
  if (fm.phase) lines.push(`| Phase | ${fm.phase} |`);
  const deps = Array.isArray(fm.depends_on)
    ? fm.depends_on
    : fm.depends_on
      ? [fm.depends_on]
      : [];
  if (deps.length) lines.push(`| Depends on | ${deps.join(", ")} |`);
  const wfs = asList(fm.wireframes);
  if (wfs.length) lines.push(`| Wireframes | ${wfs.join(", ")} |`);
  if (fm.evidence_file) lines.push(`| Evidence | \`${fm.evidence_file}\` |`);

  lines.push(
    "",
    "---",
    "_Spec file on disk is source of truth. Repo `status: Done` → Linear **In Review** until user approves Done._",
  );

  return lines.join("\n");
}
