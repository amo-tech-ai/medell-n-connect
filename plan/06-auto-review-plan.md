---
title: Auto-review for mdeai — v3 planning doc
date: 2026-05-20
status: plan (ready to convert to F21 task spec)
supersedes: plan/06-auto-review-plan.md (v2 — kept for history)
sources_reviewed:
  - https://engineeratheart.medium.com/auto-reviewing-claudes-code (Vikas Sah, 2026-03-26)
  - https://github.com/NTCoding/claude-skillz/tree/main/automatic-code-review
  - https://github.com/hamelsmu/claude-review-loop
  - https://openrouter.ai/docs/cookbook/coding-agents/automatic-code-review (redline pattern)
  - https://gist.github.com/patyearone/c9a091b97e756f5ed361f7514d88ef0b
---

# Auto-review for mdeai — execution plan

## Goal in one line

Catch the semantic drift that `npm run floor` can't see (agent-name match, beta API traps, default-fallback anti-patterns, generic naming, Spanish strings during Phase 1, suppression rationale) **before** a human reviewer has to spot it — while keeping the developer un-blocked.

Five real drift incidents already collected from this codebase prove the need:
1. `mastra.agents.X` form would TypeError on beta (F09 spec drift).
2. `MdeState.parse({ wrong:'shape' })` silently passes (F09 spec drift).
3. Identical Stripe webhook secrets in `.env.local` (F11 finding).
4. `@ts-expect-error` without rationale comment.
5. `F09-supp` ghost dependency.

## Best parts picked from each source

| Source | Idea | Adopted? | Why |
|---|---|---|---|
| Vikas Sah · Medium | Two-layer split: **local hooks** (deterministic gates) + **GitHub Actions** (PR-time AI review) | ✅ both layers | Defense-in-depth; layer 1 catches drift during dev, layer 2 catches what slips past |
| Vikas Sah · Medium | PreToolUse hooks block via exit 2 + stderr | ✅ already in use | We have 6 PreToolUse hooks doing exactly this (`scan-secrets`, `gemini-model-pin`, etc.) |
| Vikas Sah · Medium | PostToolUse hooks output JSON `{ continue, systemMessage }` to inject warnings into Claude's context | ✅ for warnings only | Useful for "you just wrote bare `except:`" surface; non-blocking |
| Vikas Sah · Medium | claude-code-action for GitHub Actions PR review with `--allowedTools` locking out code modification | ✅ adopted as Layer 2 | 6.6k stars · GA · standard Anthropic surface · zero vendor lock-in |
| Vikas Sah · Medium | Scoped prompt: 4 categories + "don't invent problems" line | ✅ baked into reviewer prompt | Directly addresses cry-wolf fatigue |
| NTCoding plugin | Modified-file log to `/tmp/event-log-{SESSION_ID}.jsonl`; Stop hook reads it and triggers subagent | ✅ pattern adopted (but to `.claude/runtime/` not `/tmp/` so it persists across sessions) | Matches our existing `.claude/` discipline |
| NTCoding plugin | Configurable `rules.md` file separate from the subagent prompt | ✅ **adopted as `.claude/auto-review/rules.md`** | Lets us edit rules without touching the subagent file. Clean separation. |
| NTCoding plugin | `enabled` + `fileExtensions` filter via settings.json | ✅ adopted in `.claude/settings.json` `autoReview` block | Lets us toggle off for fast-iteration sessions |
| Redline · OpenRouter cookbook | Stop hook with `{ "decision": "block", "reason": "..." }` JSON to **inject instructions into Claude's context** — Claude then spawns reviewer as a background task | ✅ **adopted — best part of the whole synthesis** | More elegant than exit-2-stderr; integrates with Claude's own task tool; non-blocking |
| Redline | Hash dedup via `.git/redline-last-diff` to prevent re-firing on unchanged state | ✅ adopted as `.claude/runtime/last-review-hash` | Hard requirement — without it, every Stop refires the reviewer |
| Redline | `git diff --stat HEAD` for change summary in the reason text | ✅ adopted | Gives Claude enough context to judge if a review is warranted |
| Redline | Cross-model review via Codex + OpenRouter | ❌ rejected for now | Adds dependency complexity. Same-model review (Claude haiku reviewing Claude opus output) is good enough for V1. Defer cross-model to V2. |

## Architecture — two layers

```
Layer 1 — local (every Claude Code session)
    PostToolUse on Edit/Write/MultiEdit
        ↓ lint-edited-ts.mjs (AMENDED: append touched file to log)
        ↓ typecheck-edited-ts.mjs (unchanged)
    Stop event
        ↓ stop-rls-gate.mjs (AMENDED: after RLS check, emit decision:"block")
            ↓ Claude reads reason → spawns mdeai-auto-reviewer via Task tool
                ↓ reviewer reads .claude/auto-review/rules.md + the file list
                ↓ outputs findings + score + grade
        ↓ hash check → skip if diff unchanged since last review

Layer 2 — CI on every PR (when team starts using branches)
    .github/workflows/claude-review.yml
        ↓ anthropics/claude-code-action@v1
            ↓ scoped 4-category prompt
            ↓ --allowedTools locked to inline-comments + gh pr view/diff
            ↓ --max-turns 5 (auto) / 10 (@claude on-demand)
        ↓ structured comments posted to PR
```

## Component-by-component design

### 1. `.claude/runtime/` — new gitignored directory

Holds two state files:

- `changed-since-review.log` — newline-delimited file paths touched since last review. Cleared every time the reviewer fires.
- `last-review-hash` — single line, hash of last reviewed `git diff --stat HEAD`. Prevents re-fire when nothing has changed.

Add to `mdeapp/.gitignore` and `/home/sk/mdeai/.gitignore`. Auto-created on first hook fire (`mkdirSync({recursive:true})`).

### 2. `lint-edited-ts.mjs` — AMENDED (~6 lines added)

Existing hook fires on `Edit|Write|MultiEdit`, scopes to `mdeapp/(src|supabase/functions)/**`. Add at the very end (before `process.exit(0)`):

```js
// auto-review: log this file for the Stop-hook reviewer (idempotent, deduped)
import { appendFileSync, mkdirSync, readFileSync as rf, existsSync as ex } from "node:fs";
const logPath = "/home/sk/mdeai/.claude/runtime/changed-since-review.log";
mkdirSync("/home/sk/mdeai/.claude/runtime", { recursive: true });
const existing = ex(logPath) ? rf(logPath, "utf8").split("\n").filter(Boolean) : [];
if (!existing.includes(filePath)) appendFileSync(logPath, filePath + "\n");
```

Silent, doesn't affect lint outcome. Same trigger surface, no new hook needed.

### 3. `stop-rls-gate.mjs` — AMENDED (~40 lines added)

Existing hook already has the transcript-tail reader + the `stop_hook_active` loop-guard. Add **after** the existing RLS check (so they don't conflict; an RLS-warning turn can still trigger a review):

```js
// auto-review trigger (Redline-style decision:"block" pattern)
import {
  readFileSync as rf2,
  existsSync as ex2,
  writeFileSync as wf
} from "node:fs";
import { execSync as exec2 } from "node:child_process";

const settingsPath = "/home/sk/mdeai/.claude/settings.json";
let enabled = true, exts = ["ts", "tsx"];
try {
  const cfg = JSON.parse(rf2(settingsPath, "utf8")).autoReview || {};
  enabled = cfg.enabled !== false;
  if (Array.isArray(cfg.fileExtensions)) exts = cfg.fileExtensions;
} catch { /* default on */ }
if (!enabled) process.exit(0);

const logPath = "/home/sk/mdeai/.claude/runtime/changed-since-review.log";
const hashPath = "/home/sk/mdeai/.claude/runtime/last-review-hash";
const lines = ex2(logPath)
  ? rf2(logPath, "utf8").split("\n").filter(Boolean)
  : [];

// Filter to in-scope extensions
const inScope = lines.filter(l => exts.some(e => l.endsWith("." + e)));

// Skip when log empty, clarifying-question Stop, or already reviewed
const isClarifying = /[?]\s*$/.test(
  (lastAssistantText || "").trim().split("\n").pop() || ""
);
const alreadyReviewed = /\b(mdeai-auto-review|auto-review:)\b/i.test(lastAssistantText);

if (inScope.length === 0 || isClarifying || alreadyReviewed) {
  process.exit(0);
}

// Hash dedup — skip if the working-tree diff hasn't changed since last review
let diffStat = "";
try {
  diffStat = exec2("git diff --stat HEAD", {
    cwd: "/home/sk/mdeai/mdeapp",
    encoding: "utf8"
  }).trim();
} catch { /* may be no commits yet */ }
const hash = (s) => {
  let h = 0;
  for (const c of s) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
  return h.toString(36);
};
const currentHash = hash(diffStat);
const lastHash = ex2(hashPath) ? rf2(hashPath, "utf8").trim() : "";
if (currentHash === lastHash && lastHash !== "") {
  process.exit(0);  // same diff as last review — silent skip
}

// Emit decision:"block" with reason — Claude will read this and spawn reviewer
const reason = [
  "📋 mdeai-auto-review: " + inScope.length + " file(s) touched.",
  "",
  "Diff stat:",
  diffStat || "  (no committed baseline yet)",
  "",
  "Files to review:",
  ...inScope.map(f => "  - " + f),
  "",
  "Action: invoke the `mdeai-auto-reviewer` subagent via the Task tool",
  "with these files as the prompt. The agent reads",
  "`.claude/auto-review/rules.md` and `.claude/agents/mdeai-auto-reviewer.md`",
  "for its rule set + scoring rubric.",
  "",
  "When done, present the findings + score + grade. Do NOT silently fix —",
  "show me what would change before any edit."
].join("\n");

console.log(JSON.stringify({ decision: "block", reason }));

// Clear the log + store the hash so subsequent Stops on the same diff don't refire
wf(logPath, "");
wf(hashPath, currentHash);
process.exit(0);  // exit 0 with decision:"block" JSON — NOT exit 2
```

Key difference from v2: this uses **`decision:"block"` JSON output** (Source C, redline) instead of exit-2-stderr. The JSON output is read by Claude Code as instructions injected into context. Claude then decides whether to spawn the reviewer (it almost always will, but it has the choice — e.g. if the user explicitly said "skip review this turn").

### 4. `.claude/auto-review/rules.md` — NEW (the customization surface)

Source B's idea: keep the rule set in a Markdown file separate from the subagent prompt. Lets us edit rules without touching the subagent file. Becomes the single place to evolve the rule list.

Contents (initial — start narrow with R1-R5, expand later):

```markdown
# mdeai auto-review rules (v1)

## Critical (weight −25 each)

### R1. Agent-name match
`useCoAgent({ name: "X" })` must match a key in `Mastra({ agents: { X } })`.
Probe: grep `useCoAgent\(\s*{\s*name:\s*['"]([^'"]+)` in `src/app/**` and cross-reference with `src/mastra/index.ts` agent keys.

### R2. `mastra.agents.X` access
Beta has no public `.agents` property. Use `mastra.getAgentById("...")` or `mastra.listAgents()`.
Probe: grep `mastra\.agents\.\w` in `src/**`.

## High (weight −15 each)

### R3. Default-fallback on required input
`?? "default"` inside tool `execute:` bodies hides missing required inputs.
Probe: grep `\?\?\s*['"]` lines inside files matching `src/mastra/tools/**`.

### R10. Working-memory schema drift
The Zod schema in the agent file, the TS type in `src/lib/types.ts`, and (W4) `packages/types/src/` must agree on `MdeState` shape.
Probe: structural compare; flag if Zod field set ≠ TS type field set.

## Medium (weight −10 each)

### R4. Generic naming
Tools / files named `helper`, `utils`, `manager`, `service`, `wrapper`. Use mdeai-domain names: `rentalSearchTool`, `eventDraftAdapter`, `mapPinSerializer`.
Probe: grep on `id:` in tool definitions; grep on file basenames.

### R5. Domain logic in route layer
Business decisions in `src/app/api/copilotkit/route.ts` belong in `agent.instructions:` or a tool's `execute:`.
Probe: any `if (user.role…)` / `if (event.status…)` in `route.ts`.

### R9. Spanish strings in src/
Phase 1 = English per CLAUDE.md "Language scope". Spanish strings in `src/**` are a regression.
Probe: stopword list (`Hola`, `gracias`, `bienvenido`, `apartamento`, `Camila habla`, etc.) + `lang="es"`.

## Low (weight −5 each)

### R6. Inline hex in `src/components/**` post-F07
Paisa tokens are the source of truth from W2 onwards.
Probe: grep `#[0-9a-fA-F]{3,8}` in `src/components/**` after F07 is Done.

### R7. `@ts-expect-error` without rationale
Suppression must explain why on the same line or the line above + link to runtime verification.
Probe: grep `@ts-expect-error` not followed by a meaningful comment.

### R8. `console.log` in src/
Use Mastra `ConsoleLogger` which honors `LOG_LEVEL`.
Probe: grep `console\.(log|debug|info|warn|error)` in `src/**` excluding test files.

## Scoring

- `file_score = max(0, 100 − sum(weights of findings in file))`
- `turn_score = round( min(file_scores) × 0.6 + avg(file_scores) × 0.4 )`
- Grade letter:
  - A 90–100 — pass
  - B 80–89 — solid; minor cleanup
  - C 70–79 — notable drift; address before push
  - D 60–69 — risky; do not merge
  - F  <60 — block; at least one critical finding
```

### 5. `.claude/agents/mdeai-auto-reviewer.md` — NEW (the reviewer)

Sister to existing `security-reviewer.md`. Stays small (~80 LOC) because the rule details live in `rules.md`.

```markdown
---
name: mdeai-auto-reviewer
description: Use proactively after Claude Code finishes a turn that touched .ts/.tsx files in mdeapp/src/** or mdeapp/supabase/functions/**. Reads .claude/auto-review/rules.md, scans the file list passed in the prompt, and outputs findings + per-file scores + a turn grade (A-F). Never silently fixes — surfaces only.
model: haiku
tools: Read, Grep, Glob
---

# mdeai-auto-reviewer

You are a semantic code reviewer for the mdeai project. Your job is to check the files passed in the prompt against the rules in `.claude/auto-review/rules.md` and surface findings with a numeric score.

## Procedure

1. Read `.claude/auto-review/rules.md`. Internalize the rule set + weights + grade rubric.
2. For each file path passed in the prompt:
   - Read the file.
   - For each rule, apply the probe described in `rules.md`.
   - Record findings as `{rule, file, line, snippet, deduction}`.
3. Compute per-file score = max(0, 100 − sum of deductions in that file).
4. Compute turn score = round(min(file_scores) × 0.6 + avg(file_scores) × 0.4).
5. Map turn score → grade letter (A/B/C/D/F).
6. Output in this exact format (verbatim — the user has tooling that parses it):

```
📋 mdeai-auto-review · {N} files · {M} findings · score={turn_score} grade={letter}

{file_path}
  [{rule_id} {severity}] line {N} — {one-line issue summary}
      `{exact snippet from file, ≤80 chars}`
      → {one-line suggested fix}
      deduction: −{weight} · file={file_score} {file_grade}

... more files ...
```

## Hard rules for you

- **Quote the offending line.** Never describe a finding without the actual snippet from disk.
- **Refuse to fix.** Your role is to surface. Edits are the user's call.
- **If everything looks good, say so:** print `📋 mdeai-auto-review · {N} files · 0 findings · score=100 grade=A — no issues found.` Do not invent problems. The cry-wolf effect is the single biggest reason teams abandon auto-review tools.
- **Use mdeai personas in suggestions where helpful.** E.g. "Camila's chat would lose context here" beats "this is bad". See CLAUDE.md "Explanation style" for the persona table.
- **Scope to the files passed.** Do NOT read other files unless a rule explicitly requires cross-file comparison (R1 agent-name match, R10 schema drift).
- **No more than 10 findings per file.** If a file has more, surface the top 10 by deduction weight + report the count of suppressed findings.

## What NOT to flag

- Style nits already caught by ESLint.
- Test files (`*.test.ts`, `*.spec.ts`) — they have different rules; lint covers them.
- Files outside `mdeapp/src/**` or `mdeapp/supabase/functions/**`.
- TODO comments (those are intentional).
- Markdown / JSON / config files — they're outside the rule scope.
```

### 6. `.claude/settings.json` — autoReview block

Add a new top-level key (sibling to `hooks`):

```jsonc
{
  "hooks": { /* unchanged */ },
  "autoReview": {
    "enabled": true,
    "fileExtensions": ["ts", "tsx"],
    "rulesFile": ".claude/auto-review/rules.md",
    "subagent": "mdeai-auto-reviewer"
  }
}
```

Also add an env override: if `MDEAI_DISABLE_AUTO_REVIEW=1` is set, the Stop-hook skip is honored before the JSON parse. For fast-iteration sessions.

### 7. `.github/workflows/claude-review.yml` — Layer 2 (NEW)

Direct port of Vikas Sah's pattern, scoped to mdeai. Two jobs: `auto-review` on PR open/sync + `on-demand` on `@claude` comments.

```yaml
name: mdeai PR review (Claude Code)

on:
  pull_request:
    types: [opened, synchronize]
  issue_comment:
    types: [created]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  auto-review:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # full history for diff context
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Review this mdeai PR. The project pins CopilotKit 1.55.2, uses Mastra beta,
            Gemini 3.5 Flash, Supabase project zkwcbyxiwklihegjhuql. Personas:
            Roberto (host events), Camila (rentals + chat), Patricia (admin).
            Phase 1 = English only.

            For each file changed:
            1. **Security** — secrets in source, SUPABASE_SERVICE_ROLE_KEY in src/, SQL injection in edge fns, XSS, missing RLS notes for new tables
            2. **Correctness** — agent-name mismatch between useCoAgent and Mastra config; beta API traps (mastra.agents.X, Agent({workflows:…})); processor name drift (TokenLimiter → TokenLimiterProcessor)
            3. **Performance** — N+1 in tool DB calls; missing Places API X-Goog-FieldMask
            4. **Error handling** — `?? "default"` on required tool inputs; bare catches; missing idempotency on edge fns

            Format your review as:
            ## Security
            ## Correctness
            ## Performance
            ## Error handling
            ## Summary

            If everything looks good, say so — don't invent problems.
          claude_args: >-
            --max-turns 5
            --model claude-sonnet-4-6
            --allowedTools "mcp__github_inline_comment__create_inline_comment,Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*)"

  on-demand:
    if: >
      github.event_name == 'issue_comment' &&
      contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          claude_args: >-
            --max-turns 10
            --model claude-sonnet-4-6
            --allowedTools "mcp__github_inline_comment__create_inline_comment,Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*)"
```

**Prerequisites for layer 2:**
- `ANTHROPIC_API_KEY` added to `amo-tech-ai/mdeapp` repo secrets (one-time, manual).
- Team starts using feature branches + PRs instead of direct commits to `main` (currently 3 commits straight to main).
- `mde-worktree-pr-flow` skill discipline.

## Scoring rubric (recap from v2 — unchanged)

| Grade | Score | Meaning |
|---|---:|---|
| A | 90–100 | Pass — no findings or only low-severity |
| B | 80–89 | Solid; minor cleanup |
| C | 70–79 | Notable drift |
| D | 60–69 | Risky |
| F | <60 | Block — critical finding present |

Per-rule weights and the worst-weighted formula (`min × 0.6 + avg × 0.4`) carry forward from v2 unchanged.

## Sequenced execution plan

| Milestone | Effort | Deliverable | Acceptance |
|---|---:|---|---|
| **M0 — rules + subagent** | 45 min | `.claude/auto-review/rules.md` + `.claude/agents/mdeai-auto-reviewer.md` + `autoReview` block in `settings.json` | Subagent invocable via Task tool; reads rules.md; outputs valid format for a hand-passed file list |
| **M1 — hook plumbing** | 30 min | `lint-edited-ts.mjs` + `stop-rls-gate.mjs` amendments; `.claude/runtime/` created + gitignored | After 1 edit, `changed-since-review.log` has the file; on Stop, hook emits `decision:"block"` JSON; Claude spawns reviewer; reviewer outputs findings + score |
| **M2 — smoke test** | 30 min | Deliberate-drift test: insert `mastra.agents.pingAgent` into a file, expect R2 finding with `−25`, grade D | Reviewer fires R2 finding; turn score ≤65; user sees finding before commit |
| **M3 — GitHub Actions (layer 2)** | 30 min + secret setup | `.github/workflows/claude-review.yml` committed; `ANTHROPIC_API_KEY` in repo secrets | First test PR shows AI review comments within ~2 min of open |

**Total: ~2.25h.** M0+M1+M2 is all of layer 1 (~1.75h). M3 is independent and can land anytime after F06 closeout.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Cry-wolf fatigue — too many findings, devs ignore | Start with R1-R5 only (the 5 highest-signal rules); add R6-R10 after a week of real use. Reviewer prompt has explicit "don't invent problems" + "say so if clean". |
| Latency cost — every Stop adds 30s–3min | Hash dedup means re-Stops on unchanged diff exit in <1s. Plus `MDEAI_DISABLE_AUTO_REVIEW=1` env override for fast-iteration sessions. |
| Context bloat — 20 Stops × 10 findings = giant transcript | Reviewer caps at 10 findings per file with a count of suppressed; turn output is one block, not a per-file dump. |
| Hook loop — reviewer's own writes triggering itself | `stop_hook_active` guard (already in `stop-rls-gate.mjs`); `alreadyReviewed` regex on last assistant turn; log cleared immediately after firing. |
| False positives on R1 (agent-name match) when intermediate refactors | Reviewer reads the actual `src/mastra/index.ts` keys; only flags real mismatches, not stylistic differences. |
| Cost — every Claude session adds ~$0.01–0.05 in haiku tokens | Acceptable for the catch rate; cap can be added later via OpenRouter or model swap if needed. |

## Verification plan

Before flipping F21 → Done:

1. `bash .claude/skills/task-verifier/scripts/probe-disk.sh` — exit 0 across struct/scripts/deps/files/git sections.
2. Deliberate-drift smoke (M2 above) — R2 fires, turn grade ≤ D.
3. `npm run floor` — still exit 0 (auto-review is Stop-layer; doesn't gate floor).
4. Negative test: edit a Markdown file → on Stop, reviewer is NOT triggered (file extension filter works).
5. Dedup test: Stop twice in a row with no edits between → second Stop exits in <1s, no reviewer fired.
6. Disable test: `MDEAI_DISABLE_AUTO_REVIEW=1 claude` → no reviewer fires regardless of edits.
7. Evidence file `tasks/notes/F21-evidence.md` captures one real finding from a real session.

## Out of scope (V1)

- **Cross-model review** (Codex/OpenRouter routing the way redline does). Same-model Haiku reviewing Sonnet output is good enough V1; switch only if blind-spots emerge.
- **Block-on-grade-F** mode. V1 is warn-only — reviewer surfaces, user decides. Hard-block can layer on later via `mde-worktree-pr-flow` pre-commit hook.
- **Codex-cli compatibility.** Source C notes Codex's hook system can't inject mid-session context; this plan is Claude Code only. Re-evaluate when Codex gains `decision:"block"` equivalent.
- **Auto-fix mode.** Reviewer surfaces only. Auto-apply is a separate task that should require explicit user consent per finding.

## Persona impact (the "why" for non-devs)

- **Sofía (dev):** when she asks Claude to port `eventAgent` (F14), the reviewer catches "you renamed the tool to `eventHelper`" before Sofía sees the diff. Saves the back-and-forth.
- **Camila (chat user):** doesn't see the loop directly but benefits — the agent-name match invariant (R1) prevents the silent 404 on chat that would otherwise reach her.
- **Patricia (admin):** GitHub Actions layer 2 means every PR posts an audit trail in PR comments. Compliance-ready for the eventual SOC 2 conversation.
- **Future Claude session:** finds the reviewer output in the transcript, learns what was flagged and how the human handled it, avoids re-introducing the same drift in the next port.

## Decision needed before this becomes F21

1. **Approve scope?** Layer 1 only (~1.75h), or Layer 1 + 2 (~2.25h)?
2. **Approve rule set?** Start with R1-R5 (recommended) or all R1-R10 from day 1?
3. **Trigger threshold?** Warn-only (current plan) or hard-block at grade F via additional pre-commit hook?
4. **Subagent model?** Haiku (fast, cheap, sufficient for grep-based rules) or Sonnet (slower, smarter on R5 "domain logic in route" structural judgement)?

Once these four are answered, this plan converts to `tasks/core/F21-auto-review-loop.md` following the `mde-task-lifecycle` 10-section template, status `Not Started`, then executed.
