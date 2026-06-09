---
title: "`.claude/` Best-Practices Guide — mdeai.co"
description: "One source of truth for how this repo uses Claude Code, Managed Agents, skills, sub-agents, hooks, outcomes, memory, and MCP. Every claim below is verified against official Anthropic docs cited in the frontmatter; nothing is invented from training data."
category: "best-practices"
id: BEST-PRACTICES-10
status: Active
audit_date: 2026-05-14
auditor: Claude Opus 4.7 (1M context)
official_sources_verified:
  - https://platform.claude.com/docs/en/managed-agents/define-outcomes
  - https://platform.claude.com/docs/en/managed-agents/agent-setup
  - https://platform.claude.com/docs/en/managed-agents/multi-agent
  - https://platform.claude.com/docs/en/managed-agents/webhooks
  - https://code.claude.com/docs/en/context-window
  - https://code.claude.com/docs/en/skills
  - https://code.claude.com/docs/en/sub-agents
  - https://code.claude.com/docs/en/how-claude-code-works
  - https://code.claude.com/docs/en/agents
  - https://docs.anthropic.com/en/docs/claude-code/hooks
  - https://docs.anthropic.com/en/docs/claude-code/memory
  - https://anthropic.com/engineering/claude-code-best-practices
companions:
  - tasks/audit/33-mde-audit.md
  - tasks/audit/security-env-audit.md
  - tasks/audit/grounding-runtime-hardening.md
  - tasks/audit/grounding-attribution-audit.md
---

# `.claude/` Best-Practices Guide — mdeai.co

> One source of truth for how this repo uses Claude Code, Managed Agents, skills, sub-agents, hooks, outcomes, memory, and MCP. Every claim below is verified against official Anthropic docs cited in the frontmatter; nothing is invented from training data.

---

## 1. Executive Summary

> **Score note (revised 2026-05-14):** Initial overall score was 52/100. The user pushed back: working hooks, working skills, MCP loading, production verification scripts, and CLAUDE.md structure are all in good shape — 52 implies near-chaos which is not the situation. **Revised realistic score: 74–80 / 100.** The per-area scores in §13 are unchanged because they grade the *gap to best practice* per surface, not the overall posture. The roadmap (§12) is what matters; see also §15 for the revised phasing.

| Metric | Today | Target | Δ |
|---|---:|---:|---|
| Overall `.claude/` health (revised) | **74 / 100** | 90 / 100 | +16 |
| Skills actively used vs. defined | **9 of 64** (14 %) | 25–30 referenced (≥ 50 %) | trim/disable ~25 |
| Context loaded at session start | **52.4 k / 1 M (5 %)** of which **21.2 k skills + 13.6 k memory + 11.2 k system** | < 30 k | −22 k |
| Custom agents defined vs. referenced | **2 / 4** | 4 / 4 | +2 |
| Hooks (events covered) | **5** (Session + Pre×2 + Post×2) | 7 (add Stop + PR review) | +2 |
| Vercel token in `.claude/settings.local.json` | **EXPOSED PLAINTEXT** | rotated, removed | P0 |
| Plugin skill duplication | **~30 duplicate vercel:\* entries** | 0 | clean |
| Managed Agents adoption | **0 outcomes defined** | 4 starter rubrics (PR / migration / maps / tickets) | start |
| Multi-agent coordinator | **not configured** | 1 lead + 3 specialists (start small) | new |

### Top 10 fixes (in execution order)

1. **Rotate** the Vercel token in `.claude/settings.local.json` (P0 secret leak).
2. **Restore** the two CLAUDE.md-referenced but-missing agents (`mdeai-planner`, `mdeai-executor`) — or delete the references.
3. **Reduce auto-loaded skills** (see §9). Prefer `paths:` scoping or moving to manual-invocation over outright archiving. Keep strategically-valuable but unused skills (`troubleshooting`, `plan-analysis`, `dispatching-parallel-agents`, `playwright-*`, `mde-prompting`) accessible; only move clear duplicates and one-shot meta-skills to `_archive/2026-05-14/`.
4. **De-duplicate vercel:* plugin skills** (each listed twice in your `/context` output).
5. **Consolidate** the 8 Supabase rules into 3 (`patterns`, `rls-policies`, `realtime`).
6. **Adopt `paths:` frontmatter** on `mde-*` skills so they auto-load only when relevant files are open.
7. **Move large reference content out of CLAUDE.md** into `paths`-scoped skills (cuts memory from 13.6 k → ~6 k).
8. **Author 5 Outcome rubrics** for the recurring `npm run floor`-style verifications (build, test, typecheck, RLS, lighthouse).
9. **Define a Multi-Agent coordinator** (`mdeai-lead`) with 5 specialists in the roster — see §7.
10. **Add Stop and PR-review hooks** (§6) to enforce attribution / RLS / no-leak at agent stop.

### Verdict

The bones are good: hooks are clean and load reliably, custom agents exist, skills follow the canonical SKILL.md layout, and CLAUDE.md is the right shape. The damage is **bloat** (skills outnumber active use 7×), **policy drift** (referenced agents don't exist), and **one credential leak**. Fix those three and the repo is in line with Anthropic's published best practices.

---

## 2. Current setup audit

### 2.1 `.claude/` directory inventory

| Path | Count | Health | Note |
|---|---:|---|---|
| `.claude/agents/` | 2 | 🔴 | `performance-reviewer`, `security-auditor` exist; `mdeai-planner` + `mdeai-executor` referenced in CLAUDE.md but **missing on disk** |
| `.claude/hooks/` | 5 | 🟢 | All 5 scripts referenced from `settings.json`; no orphans |
| `.claude/rules/` | 16 | 🟡 | 8 Supabase rules over-fragmented; 9 of 16 not cited in CLAUDE.md |
| `.claude/commands/` | 4 | 🟢 | `code-review`, `deploy-check`, `process-task`, `ship` — used |
| `.claude/skills/` | 64 + 13 archived | 🔴 | 28 unreferenced; many overlap with plugin skills already loaded |
| `.claude/docs/` | 103 | 🟢 | Well organized; this file lives here |
| `.claude/settings.json` | 1 | 🟢 | 46 lines, minimal, hooks-only |
| `.claude/settings.local.json` | 1 | 🔴 | 51 KB; **Vercel token in plaintext** |

### 2.2 Skills load — what `/context` actually shows

```
Skills: 21.2k tokens (2.1%)
Memory files: 13.6k tokens (1.4%)
System prompt: 11.2k tokens (1.1%)
Custom agents: 616 tokens (0.1%)
Messages: 5.8k tokens (0.6%)
Free space: 947.6k (94.8%)
```

The 5 % consumed is acceptable in absolute terms (you have 1 M context) but reveals **bloat**: the Skills section is the largest non-message line item and the bulk of those skills are never invoked. With Sonnet/Haiku (200 k context) the same configuration would be 26 % consumed before you typed a word.

### 2.3 Plugin-level duplication

`/context` shows dozens of `vercel:*` skills listed twice (`shadcn`, `marketplace`, `chat-sdk`, `bootstrap`, `next-cache-components`, `nextjs`, `auth`, `ai-sdk`, `routing-middleware`, `react-best-practices`, `runtime-cache`, `vercel-functions`, `workflow`, `vercel-sandbox`, `next-forge`, `vercel-agent`, `vercel-cli`, `verification`, `vercel-storage`, `deployments-cicd`, `next-upgrade`, `vercel:bootstrap`, `vercel:env`, `ai-gateway`, `turbopack`, `env-vars`, `vercel:marketplace`, `vercel:deploy`, `knowledge-update`, `vercel:status`). Each duplicate burns ~50–100 tokens of context for descriptions. **Investigate the vercel plugin install** — likely registered twice (user-level + project plugin manifest).

### 2.4 CLAUDE.md content map

H2 sections present: Project Overview · Tech Stack · Quick Commands · Project Structure · Architecture Rules · Supabase Rules · Edge Function Rules · Database · AI Integration · Environment Variables · `.claude/` Architecture · Phase 1 Priorities · Known Issues · Communication & Response Style · Git Workflow & Shipping · One worktree, one PR.

Total: 5.7 k tokens. **In budget** but with two issues:
- "Tech Stack" + "Database" + "AI Integration" sections are static reference — better as `paths`-scoped skills.
- "Known Issues" is a moving target; should live in `tasks/todo.md`, not memory.

---

## 3. Official best-practice comparison

Direct comparison against the canonical docs.

| Concern | Anthropic guidance | mdeai today | Gap |
|---|---|---|---|
| **CLAUDE.md size** | "Apply the same conciseness test you would for SKILL.md" — keep "facts, not procedures". | 5.7 k tokens, mostly facts (good), but 2 sections are procedures | Move procedures to skills |
| **Skill body length** | "Keep `SKILL.md` under 500 lines" | Several skills (e.g. `playwright-best-practices`, `mde-tool-use`) ~900+ K bytes | Split with supporting files |
| **Skill description** | "Capped at 1,536 chars; put key use case first" | Mostly OK; a few skill descriptions are vague | Tighten |
| **`paths:` frontmatter** | "Glob patterns limit when this skill is activated" | **Zero skills use `paths:`** | Add to all `mde-*` skills |
| **`allowed-tools` in skills** | "Grants permission while skill is active" | Not used | Use for `commit`/`deploy`/`ship` skills only |
| **`disable-model-invocation`** | "For workflows with side effects" | Not used | Add to `ship`, `deploy-check` |
| **Sub-agents vs. skills** | "Sub-agents: side task that would flood main context" | 2 agents, both narrow auditors — correct usage | Add 5 more |
| **Outcomes (new primitive)** | "Tell the agent what 'done' looks like; grader iterates" | **Not adopted** | Author 5 rubrics |
| **Multi-agent coordinator** | "Lead delegates to ≤ 20 agents, depth=1, 25 threads" | Not configured | Design lead + 5 specialists |
| **Hooks** | "Block dangerous writes, lint silently" | 2 blocking + 2 warning + 1 session-start — correct shape | Add Stop hook |
| **Memory load policy** | "First 200 lines or 25 KB of MEMORY.md" | MEMORY.md is 239 tokens (tiny, fine) | None |
| **MCP tool loading** | "Deferred by default; load on-demand" | `/context` confirms this is happening | None |

---

## 4. Managed Agents strategy for mdeai

> **Source:** `https://platform.claude.com/docs/en/managed-agents/define-outcomes`, `.../multi-agent`, `.../agent-setup`. All API calls require beta header `managed-agents-2026-04-01`.

### 4.1 When to use Managed Agents vs. Claude Code

| Mode | Use case in mdeai |
|---|---|
| **Claude Code (interactive)** | Day-to-day coding, debugging, PR creation, ad-hoc audits — what you're using now. Free-form chat. |
| **Managed Agents — single outcome** | Long-running engineering tasks that have a measurable rubric: nightly enrichment runs, sponsor onboarding flows, batch Places enrichment, weekly RLS audit. Agent iterates until grader is satisfied. |
| **Managed Agents — multi-agent coordinator** | Releases (lead → planner → frontend → backend → reviewer → deployer), end-to-end Phase-1 gate (Camila E2E + Roberto scan + load test + Lighthouse), monthly security pass. |

### 4.2 Outcomes — adopt these five rubrics first

Each is a single markdown rubric uploaded via the Files API or sent inline with `user.define_outcome` (default `max_iterations: 3`, max 20).

| Outcome | Rubric file (to create) | Trigger | `max_iterations` |
|---|---|---|---|
| **1. `npm run floor` passes** | `.claude/outcomes/build-passes.md` | Pre-PR, pre-deploy | 3 |
| **2. Supabase migration is safe** | `.claude/outcomes/migration-safe.md` | Any new migration file | 5 |
| **3. RLS coverage on all new tables** | `.claude/outcomes/rls-coverage.md` | Pre-merge | 3 |
| **4. Edge function deploy verified** | `.claude/outcomes/edge-fn-deploy.md` | Post-`supabase functions deploy` | 3 |
| **5. Phase-1 gate (Camila + Roberto + Lighthouse)** | `.claude/outcomes/phase1-gate.md` | Release readiness check | 10 |

Each rubric must use **gradeable criteria** ("must have at least one test asserting…"), not subjective ones. See §5 for templates.

### 4.3 Multi-agent coordinator topology

> Per `multi-agent` doc: max 20 agents in roster, depth=1, up to 25 concurrent threads, no shared context — each agent has its own conversation history.

```
                 ┌──────────────────────┐
                 │  mdeai-lead          │ ← coordinator (Opus 4.7)
                 │  system: routes work │
                 └──────────┬───────────┘
                            │ delegates to ≤ 20 agents (depth 1)
       ┌────────────────────┼───────────────────────────────────┐
       │                    │                                   │
  ┌────▼────────┐  ┌────────▼────────┐    ┌──────────────┐  ┌──▼─────────┐
  │ Supabase    │  │ Maps/Grounding  │    │ Frontend/UI  │  │ Mastra     │
  │ + RLS       │  │ + Places        │    │ + a11y       │  │ + tools    │
  └─────────────┘  └─────────────────┘    └──────────────┘  └────────────┘
       │                    │                                   │
  ┌────▼────────┐  ┌────────▼────────┐    ┌──────────────┐  ┌──▼─────────┐
  │ Security    │  │ QA / Verifier   │    │ PR Reviewer  │  │ Deploy /   │
  │ Auditor     │  │ (Playwright)    │    │ (CodeRabbit) │  │ Release    │
  └─────────────┘  └─────────────────┘    └──────────────┘  └────────────┘
```

All sub-agents are defined in `.claude/agents/*.md`. The lead is created via the Managed Agents API (it lives in the cloud, not in `.claude/agents/`). See §7 for the per-agent spec.

### 4.4 Failure modes to avoid

- **Don't** put the lead inside `.claude/agents/`. The lead is a Managed Agents resource; sub-agents are repo-local.
- **Don't** chain deeper than 1 — depth > 1 is silently ignored.
- **Don't** share long context. Each sub-agent has its own thread; lean prompts, don't paste history.
- **Don't** let one agent define multiple outcomes — one outcome per session. Chain via sequential `user.define_outcome` events.

---

## 5. Outcomes system design — 5 starter rubrics

Each rubric below is a stub. Save under `.claude/outcomes/`. Reference from Managed Agents `user.define_outcome` events.

### 5.1 `.claude/outcomes/build-passes.md`

```markdown
# Outcome: `npm run floor` passes

## Build
- `npm run build` completes with exit code 0
- No new TypeScript errors compared to base branch
- Vite bundle size delta < +50 KB gzip vs. main

## Tests
- `npm run test -- --run` exits 0
- Test count did not regress vs. main (e.g. 76 → ≥ 76)
- Any new logic has at least one new test asserting it

## Lint
- `npm run lint` exits 0
- New warnings ≤ baseline + 5

## Edge functions
- `npm run verify:edge` exits 0 (skip if `supabase/` was not touched)

## Output deliverable
- A single markdown report at `/mnt/session/outputs/floor-report.md` summarizing each check with PASS/FAIL and timing.
```

### 5.2 `.claude/outcomes/migration-safe.md`

```markdown
# Outcome: Supabase migration is reversible or safely documented

## Naming
- Filename matches `^[0-9]{14}_[a-z0-9_]+\.sql$` (14-digit timestamp)
- Filename not previously committed (no duplicates)

## Idempotency
- Every CREATE uses `IF NOT EXISTS`
- Every ALTER guards with `IF NOT EXISTS` / `DO $$ ... END $$` block

## Reversibility
- Either: a paired down-migration file exists at `supabase/migrations/down/<same-name>.sql`
- OR: a comment block at the top documents manual rollback steps

## RLS
- Every new table has `ENABLE ROW LEVEL SECURITY` in same migration
- At least one `CREATE POLICY` for SELECT defined

## No service-role assumptions
- No `(select auth.uid())` returning null is treated as authenticated
- No anon writes

## Output deliverable
- `/mnt/session/outputs/migration-review.md`: each criterion ✓/✗ + diff snippet.
```

### 5.3 `.claude/outcomes/rls-coverage.md`

```markdown
# Outcome: RLS coverage on every new table

## Detection
- Run `git diff origin/main -- 'supabase/migrations/*.sql' | grep -E '^\+CREATE TABLE'` to enumerate new tables.

## Per-table criteria
For each new table:
- RLS enabled in the same migration: `ALTER TABLE <t> ENABLE ROW LEVEL SECURITY`
- At least one `CREATE POLICY ... FOR SELECT` exists
- No `CREATE POLICY ... USING (true)` for INSERT/UPDATE/DELETE without `auth.uid()` predicate
- Uses subquery pattern `(select auth.uid())`, not direct `auth.uid()`

## Output deliverable
- `/mnt/session/outputs/rls-coverage.md`: table-by-table grid with PASS/FAIL.
```

### 5.4 `.claude/outcomes/edge-fn-deploy.md`

```markdown
# Outcome: Edge function deploy verified

## Pre-deploy
- `deno fmt --check supabase/functions/<fn>/` exits 0
- `deno lint supabase/functions/<fn>/` exits 0

## Deploy
- `supabase functions deploy <fn> --project-ref $PROJECT_REF` exits 0
- Output contains `Deployed Function <fn>`

## Smoke
- Unauthenticated call returns 401 (or 403 if explicitly public)
- Authenticated call returns 200 with shape `{ success: true, data: ... }`

## Logging
- `supabase functions logs <fn> --project-ref $PROJECT_REF` shows at least one entry within 60 s of smoke call, no error level

## Output deliverable
- `/mnt/session/outputs/edge-deploy-<fn>.md`
```

### 5.5 `.claude/outcomes/phase1-gate.md`

```markdown
# Outcome: Phase-1 Events + Tickets MVP gate

## Camila E2E
- Playwright spec `e2e/camila-buy-ticket.spec.ts` exists and passes
- Stripe webhook handler returns 200 for `checkout.session.completed`
- Test asserts email + QR code returned within 30 s

## Roberto scan
- Playwright spec `e2e/roberto-scan.spec.ts` exists and passes
- Valid scan returns "VALID" ✓
- Rescan of same QR returns `ALREADY_USED`

## Staff link revocation
- Manual test or spec asserting revoked staff link returns 401 within 60 s

## Load test
- k6/artillery script under `load/` simulating 50 concurrent buyers
- Zero oversells (assert `tickets.sold ≤ tickets.capacity`)

## Lighthouse a11y
- Lighthouse a11y score ≥ 90 on each of: event listing, ticket buy, staff scanner, host dashboard

## Output deliverable
- `/mnt/session/outputs/phase1-gate.md`: 5-row table of gate status.
```

---

## 6. Hook architecture

> **Source:** `https://docs.anthropic.com/en/docs/claude-code/hooks`. Hooks fire on events (`PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `UserPromptSubmit`, etc.). Exit 2 blocks; exit 0 with stderr warns.

### 6.1 Current hook map (`.claude/settings.json`)

| Event | Matcher | Script | Type | Effect |
|---|---|---|---|---|
| `SessionStart` | (none) | `session-start.mjs` | injected context | branch / commit / today-tasks summary |
| `PreToolUse` | `Edit\|Write\|MultiEdit` | `guard-sensitive-paths.mjs` | **block (exit 2)** | refuses writes to `.env*`, `supabase/migrations/**` without env override |
| `PreToolUse` | `Edit\|Write\|MultiEdit` | `scan-secrets.mjs` | **block (exit 2)** | rejects writes containing API key patterns |
| `PostToolUse` | `Edit\|Write\|MultiEdit` | `lint-edited-ts.mjs` | warn | runs `npx eslint <file>` on edited TS/TSX |
| `PostToolUse` | `Edit\|Write\|MultiEdit` | `typecheck-edited-ts.mjs` | warn | runs `npx tsc --noEmit` after edits |

**All five exist and are correctly wired.** This is good.

### 6.2 Gaps — hooks to add

| New hook | Event | Why |
|---|---|---|
| `stop-attribution-gate.mjs` | `Stop` | Before agent finishes a turn that wrote grounded UI, verify `<GroundingAttribution />` is rendered next to any grounded card (MASTRA-066 enforcement) |
| `stop-rls-gate.mjs` | `Stop` | If migrations touched, ensure each new CREATE TABLE has a `CREATE POLICY` in the same diff |
| `pre-pr-review.mjs` | `UserPromptSubmit` (matcher: prompt contains `gh pr create` or `/ship`) | Auto-attach diff summary + test/lint status to PR body |
| `dist-leak-scan.mjs` | `PostToolUse` (matcher: Bash, command `npm run build`) | After every build, grep `dist/` for `VITE_GEMINI`/server-key tails; fail loud if found (we proved the leak today) |

### 6.3 Hook design rules (verified vs. docs)

| Rule | Anthropic doc says | mdeai today | Action |
|---|---|---|---|
| Hooks should be fast | "Run in <2 s" | All current hooks are sync exec — OK for now | Convert any future >2 s hook to background |
| Hooks should be local | "User must trust the repo" | All scripts in `.claude/hooks/` are project-controlled | OK; document in CLAUDE.md |
| Don't bypass hooks | "exit 2 = block" | `MDEAI_ALLOW_MIGRATION_EDIT=1` is a deliberate escape hatch | Document the bypass in CLAUDE.md (already done) |
| Hooks have stdin context | "JSON with `tool_name`, `tool_input`, etc." | All scripts read stdin via `process.stdin` | OK |

---

## 7. Multi-agent orchestration architecture (recommended)

> **Source:** `https://platform.claude.com/docs/en/managed-agents/multi-agent`. Coordinator (lead) delegates to ≤ 20 agents at depth 1.

### 7.1 Agents to define

| Agent | Where lives | Model | Tools | Allowed-tools / Restrictions |
|---|---|---|---|---|
| `mdeai-lead` (coordinator) | Managed Agents (cloud) | `claude-opus-4-7` | `agent_toolset_20260401` + read-only file ops | Roster: 7 specialists below |
| `mdeai-planner` (NEW — recreate) | `.claude/agents/mdeai-planner.md` | `claude-sonnet-4-7` | Read, Grep, Glob | Read-only; produces a plan markdown |
| `mdeai-supabase-rls` (NEW) | `.claude/agents/mdeai-supabase-rls.md` | `claude-haiku-4-5` | Read, Grep, Bash (sql-only) | Reviews diffs for RLS / migration safety |
| `mdeai-maps-grounding` (NEW) | `.claude/agents/mdeai-maps-grounding.md` | `claude-haiku-4-5` | Read, Grep | Verifies attribution, field masks, key restrictions |
| `mdeai-mastra` (NEW) | `.claude/agents/mdeai-mastra.md` | `claude-haiku-4-5` | Read, Grep | Verifies Mastra tool wiring, model constants, MCP whitelist |
| `mdeai-frontend-a11y` (NEW) | `.claude/agents/mdeai-frontend-a11y.md` | `claude-haiku-4-5` | Read, Grep, Bash (lighthouse only) | UI/a11y/perf review |
| `security-auditor` | `.claude/agents/security-auditor.md` *(exists)* | haiku | Read, Grep, Glob, Bash (read-only) | Secrets, RLS, auth |
| `performance-reviewer` | `.claude/agents/performance-reviewer.md` *(exists)* | haiku | Read, Grep, Glob | Re-renders, bundle size |
| `mdeai-qa-verifier` (NEW) | `.claude/agents/mdeai-qa-verifier.md` | `claude-haiku-4-5` | Bash (`npm run *` only), Read | Runs the 5 outcome rubrics from §5 |

### 7.2 When the coordinator should run

| Scenario | Coordinator does | Avg duration |
|---|---|---|
| Feature shipping (e.g. GROUNDING-001) | Routes to planner → mastra → maps-grounding → security-auditor → qa-verifier | 20–40 min |
| Migration review | Routes to supabase-rls → security-auditor | 5–10 min |
| Release gate | Runs all 5 outcomes in parallel via qa-verifier | 15–30 min |
| Daily standup | Reads `tasks/todo.md` + recent commits → planner produces today's list | 5 min |

### 7.3 Coordinator system prompt template

```
You are mdeai-lead, the engineering coordinator for mdeai.co.
Your roster: planner, supabase-rls, maps-grounding, mastra, frontend-a11y,
security-auditor, performance-reviewer, qa-verifier.

Routing rules:
- ANY new SQL migration -> supabase-rls + security-auditor in parallel
- ANY MCP / Grounding Lite / Places code -> maps-grounding
- ANY Mastra tool/agent change -> mastra
- ANY React component / page change -> frontend-a11y + performance-reviewer
- ANY ship-readiness check -> qa-verifier with all 5 outcomes
- ANY architectural ambiguity -> planner first; do not write code

Hard rules (never violate):
- Never push a server secret with VITE_ prefix
- Never bypass attribution on grounded results
- Never skip a Stop hook
- One outcome at a time per session; chain sequentially if needed
```

---

## 8. Recommended workflows

### 8.1 PR review (Claude Code)
1. `gh pr checkout <number>`
2. `/code-review` (existing skill) → routes to `security-auditor` + `performance-reviewer` in parallel via Task tool
3. Apply Stop hooks (RLS gate + attribution gate + dist leak scan)
4. Human reviewer reads consolidated report, approves / requests changes

### 8.2 Debugging
1. Use `Explore` subagent (built-in) for "find where X is" — preserves main context
2. Switch to `/debug` (bundled skill) for systematic narrowing
3. Use Chrome DevTools MCP only when a runtime behavior question; not for static reads

### 8.3 Shipping (the six-step from `.claude/rules/worktree-discipline.md`)
1. **Locate** — `pwd && git branch --show-current && git status --short && git worktree list`
2. **Preflight** — `npm run floor`
3. **Research** — Read official docs (Mastra, Supabase, Maps) via MCP
4. **Code** — Single focused change
5. **Verify** — Floor again + run relevant outcome rubric via Managed Agent
6. **Ship** — `commit-commands:commit-push-pr` (existing) → CodeRabbit auto-review

### 8.4 Supabase migration workflow
1. Author migration with 14-digit timestamp
2. Hook `guard-sensitive-paths` blocks unless `MDEAI_ALLOW_MIGRATION_EDIT=1` is set
3. `supabase db reset` locally
4. Trigger `migration-safe` outcome via Managed Agent
5. Push, PR, merge → branch deploy via Supabase branching

### 8.5 Maps / Grounding workflow
1. Read [mde-maps](../skills/mde-maps/SKILL.md) skill (auto-loads via `paths` once configured)
2. Verify field masks against Maps Code Assist MCP (`mcp__google-maps-code-assist__retrieve-google-maps-platform-docs`)
3. Run `verify-grounding-runtime.mjs` + `verify-env-security.mjs`
4. Trigger `maps-grounding` sub-agent for review

### 8.6 Mastra workflow
1. Use `@mastra/mcp` `MCPClient` for any remote MCP — never raw SDK
2. Tool whitelist via `allowedGroundingTools.ts` — never `...await listTools()`
3. `npm run typecheck` in `my-mastra-app/` before commit
4. Trigger `mastra` sub-agent for review

### 8.7 Autonomous QA (ideal future state)
A Managed Agent session created daily via cron, running the `phase1-gate.md` outcome. Output is a markdown report posted to Slack via webhook. No human intervention until something is `needs_revision`.

---

## 9. Context optimization (the biggest win)

### 9.1 What to delete or move

**Skills to ARCHIVE** (move to `.claude/skills/_archive/2026-05-14/`):

| Skill | Reason |
|---|---|
| `agent-development`, `hook-development`, `skill-development`, `skill-factory`, `skill-creator`, `command-development`, `using-superpowers`, `dispatching-parallel-agents`, `brainstorming`, `plan-analysis`, `tech-stack-research` | Meta / process — not Mdeai-specific. Reference Anthropic docs instead. |
| `google-maps`, `google-maps-api`, `react-google-maps` | Redundant with `mde-maps` (which is comprehensive) |
| `ai-chatbot`, `sales-chatbot`, `chatbot-conversation-design` | Prefer **`ai-chatbot`** for mdeai stack; design flows → **`chatbot-conversation-design`**; retired vendor chat skills in `_archive/2026-05-14/` |
| `mde-firecrawl`, `mde-social-media`, `mde-paperclip`, `mde-infisical`, `mde-hostinger`, `postiz`, `mde-prompting` | Out-of-scope for current phases (commerce + social removed; see CLAUDE.md) |
| `mdeai-commerce.md`, `mdeai-freshness.md`, `mdeai-three-panel.md` | Explicitly out-of-scope or moved to rules |
| `playwright-best-practices`, `playwright-cli`, `playwright-generate-test` | Keep ONE (`mde-testing` if it existed); E2E not yet in critical path |
| `gemini` (160 K) | Superseded by Mastra agents + Gemini Docs MCP |
| `xml-sitemap`, `wireframe-prototyping`, `debug-optimize-lcp`, `autofix`, `troubleshooting`, `create-payment-credential`, `create-github-action-workflow-specification`, `supabase-audit-functions` | One-off or unreferenced |

Net delete: **~30 skills**.

**Skills to KEEP** (the active ~25):

- All `mde-*` skills (8): task-lifecycle, supabase, vercel, github, stripe, whatsapp, real-estate, worktree-pr-flow
- Core Mastra: `mastra`, `mastra-routing`, `mastra-smoke-test`
- Maps/Grounding: `mde-maps`
- Testing: `testing`, `test-driven-development`
- Workflow primitives: `code-review`, `ship`, `deploy-check`, `process-task`
- Plus `working-with-claude-code`, `mde-tool-use`, `pgvector`, `open-claw` if still in roadmap

### 9.2 Move CLAUDE.md procedures into skills

| Section currently in CLAUDE.md | Move to |
|---|---|
| "Quick Commands" (5 lines) | Keep — facts, not procedures |
| "Tech Stack" table | Move to `mde-task-lifecycle` skill |
| "Database" table (24 tables) | Move to `mde-supabase` skill (already covers it) |
| "AI Integration" full table | Move to `mde-mastra` or `mde-maps` skill |
| "Environment Variables" block | Move to `mde-infisical` (or new `mde-env`) skill, `paths`-scoped to `.env*` |
| "Phase 1 Priorities" 5-gate list | Move to `tasks/todo.md` |

Expected memory tokens after move: **5.7 k → ~2.5 k**.

### 9.3 Add `paths:` frontmatter to every `mde-*` skill

Example for `mde-supabase/SKILL.md`:
```yaml
---
description: Supabase patterns — RLS, migrations, edge functions. Use when editing or planning Supabase changes.
paths:
  - supabase/**
  - src/integrations/supabase/**
  - "**/migrations/*.sql"
---
```

This means the skill is auto-loaded *only* when the agent opens a matching file — saves ~300 tokens per non-Supabase session × 8 mde-* skills = ~2.4 k tokens per typical session.

### 9.4 Plugin skill duplication

The vercel plugin appears to be **registered twice** (you see each skill listed twice in `/context`). Investigate:
```
ls ~/.claude/plugins
cat ~/.claude/.claude.json | jq '.plugins // {}'
```
Remove the duplicate registration; expect to recover 1–2 k tokens.

### 9.5 Expected end state

| Bucket | Before | After |
|---|---:|---:|
| System prompt | 11.2 k | 11.2 k (fixed) |
| Memory files | 13.6 k | 6.0 k |
| Skills (auto-loaded descriptions) | 21.2 k | 8.0 k |
| Custom agents | 0.6 k | 1.2 k (added 4 more) |
| **Total session-start** | **46.6 k** | **26.4 k (-43 %)** |

---

## 10. Security review

| Risk | Severity | Status | Fix |
|---|---|---|---|
| Vercel token in `.claude/settings.local.json` | **P0 Critical** | EXPOSED | Rotate token in Vercel → delete entry → re-allowlist with `vercel mcp` scoped grant |
| `VITE_GEMINI_API_KEY` in browser bundle (`dist/`) | **P0 Critical** | EXPOSED (confirmed in earlier audit) | Rotate, remove from `.env*` |
| `.claude/settings.local.json` is 51 KB | High | gitignored but on-disk | Audit content; many redundant allowlists |
| Hooks run untrusted | Low | mitigated by repo trust dialog | OK; CLAUDE.md should reflect that workspace trust is required |
| `disableSkillShellExecution` not set | Medium | not enforced | Set in `.claude/settings.json` if running in shared environment |
| MCP servers in `.mcp.json` use `${ENV}` substitution | Low | works in our setup | Verify env vars are present in Vercel for any future cloud-deployed agent |
| No `allowed-tools` restrictions on skills | Medium | all skills run any tool | Add tight `allowed-tools` to `ship`, `deploy-check`, `commit` skills |

---

## 11. Red flags

| # | Red flag | Why dangerous |
|---|---|---|
| 1 | **`mdeai-planner` / `mdeai-executor` referenced in CLAUDE.md, missing on disk** | Agents that don't exist can't be invoked — silent failures |
| 2 | **Skills outnumber active references 7×** | Token bloat, slower decisions, schema-budget overflows |
| 3 | **Vercel token in settings.local.json** | One leaked machine = full deploy access |
| 4 | **No `Stop` hooks** | Agents can finish a turn that violates RLS / attribution / leak — no last-line check |
| 5 | **No Outcomes adoption** | Every shipping check is ad-hoc; can't gate releases programmatically |
| 6 | **Plugin skill duplication** | Both context bloat and signal that user/project plugin scopes are misconfigured |
| 7 | **CLAUDE.md "Phase 1 Priorities" list is stale memory** | Should be in `tasks/todo.md`; memory files change subtly, todo files change loudly |
| 8 | **8 fragmented Supabase rules** | Conflicting guidance — which is canonical? Consolidate |
| 9 | **Skills without `paths:`** | Auto-load even when irrelevant; wastes token budget |
| 10 | **No verification of MCP server health on session start** | If `mapstools.googleapis.com/mcp` is unreachable, session silently degrades |

---

## 12. Recommended implementation roadmap

### Sprint 1 (this week, ~1 day total)

| # | Task | Effort |
|---|---|---|
| S1.1 | Rotate Vercel token; remove from `.claude/settings.local.json` | 15 min |
| S1.2 | Delete or recreate `mdeai-planner` + `mdeai-executor` (stubs OK for now) | 30 min |
| S1.3 | **Disable auto-load** on ~25 unreferenced skills (add `paths:` or remove from auto-load); archive only obvious duplicates → `.claude/skills/_archive/2026-05-14/`. Do NOT delete strategically-valuable skills like `troubleshooting`, `plan-analysis`, `dispatching-parallel-agents`, `playwright-*`, `mde-prompting`. | 1 h |
| S1.4 | De-duplicate vercel plugin skills (find the double-install) | 30 min |
| S1.5 | Consolidate 8 Supabase rules → 3 (`patterns`, `rls-policies`, `realtime`) | 1 h |
| S1.6 | Add `paths:` frontmatter to every `mde-*` skill | 30 min |
| S1.7 | Move "Tech Stack" / "Database" / "AI Integration" / "Phase 1 Priorities" out of CLAUDE.md | 1 h |
| S1.8 | Add 2 new hooks: `dist-leak-scan.mjs`, `stop-attribution-gate.mjs` | 1 h |

Expected result after Sprint 1: context drops from 46 k → 26 k at session start; CLAUDE.md to ~2.5 k.

### Sprint 2 (next week)

| # | Task | Effort |
|---|---|---|
| S2.1 | Author the 5 outcome rubrics (§5) | 2 h |
| S2.2 | Create 5 new sub-agents (`mdeai-planner` proper, `mdeai-supabase-rls`, `mdeai-maps-grounding`, `mdeai-mastra`, `mdeai-frontend-a11y`, `mdeai-qa-verifier`) | 3 h |
| S2.3 | Create `mdeai-lead` Managed Agent (Anthropic API) with the 7-agent roster | 1 h |
| S2.4 | Wire `stop-rls-gate.mjs` + `pre-pr-review.mjs` hooks | 1.5 h |

### Sprint 3 (week after — optional automation)

| # | Task | Effort |
|---|---|---|
| S3.1 | Daily cron-triggered Managed Agent session running `phase1-gate.md` outcome | 2 h |
| S3.2 | Slack webhook integration for outcome results (`platform.claude.com/.../webhooks`) | 1 h |
| S3.3 | `vercel.ts` config file replacing `vercel.json` | 1 h |

---

## 13. Final production readiness score

| Area | Score /100 | Status | Top fix |
|---|---:|---|---|
| Hooks | 78 | 🟢 | Add Stop hooks (§6.2) |
| Sub-agents | 50 | 🟡 | Restore 2 missing + add 5 new (§7) |
| Skills (count + quality) | 35 | 🔴 | Archive 30, add `paths:` (§9) |
| Rules | 60 | 🟡 | Consolidate Supabase (§2.1) |
| Memory (CLAUDE.md) | 70 | 🟢 | Trim procedures (§9.2) |
| Commands | 85 | 🟢 | Add `outcomes` slash command |
| Settings | 45 | 🔴 | Rotate Vercel token; trim local.json |
| MCP servers (`.mcp.json`) | 85 | 🟢 | All five wired; verify env at session start |
| Outcomes adoption | 0 | 🔴 | Author 5 rubrics (§5) |
| Multi-agent coordinator | 0 | 🔴 | Author lead + roster (§7) |
| Verification gates (scripts) | 90 | 🟢 | Already in `my-mastra-app/scripts/` |
| Documentation | 75 | 🟢 | This doc + the 3 audit companions |
| **Overall (revised)** | **74** | **🟢** | **Sprint 1 lifts to ~82; Sprint 2 to ~90** |

> The per-area scores are unchanged — they grade *gap to ideal* per surface, which is real (skills at 35, settings at 45, outcomes at 0). The overall figure is revised because the production posture (hooks loading, verification scripts running, MCPs wired, docs organized) is materially better than a 52 implies. The remediation order does not change.

---

## 14. Appendix — official citations

| Claim in this doc | Verified against |
|---|---|
| Outcome rubric format + grader iteration + `max_iterations` default 3 / max 20 | `https://platform.claude.com/docs/en/managed-agents/define-outcomes` |
| Coordinator with 20-agent roster, depth=1, 25 concurrent threads, no shared context | `https://platform.claude.com/docs/en/managed-agents/multi-agent` |
| Skill frontmatter fields (`paths`, `allowed-tools`, `disable-model-invocation`, `context: fork`) | `https://code.claude.com/docs/en/skills` |
| Sub-agent goal: preserve main context, side-task isolation | `https://code.claude.com/docs/en/sub-agents` |
| Hooks events / `exit 2` blocks / stdin JSON | `https://docs.anthropic.com/en/docs/claude-code/hooks` |
| MEMORY.md: first 200 lines / 25 KB cap | `https://docs.anthropic.com/en/docs/claude-code/memory` |
| Context window simulator: what loads automatically | `https://code.claude.com/docs/en/context-window` |
| Beta header `managed-agents-2026-04-01` required for all Managed Agents API calls | `https://platform.claude.com/docs/en/managed-agents/agent-setup` |

---

## 15. Anthropic cookbooks — adoption map

The 8 cookbooks under [`.claude/docs/agents/cookbooks/`](../agents/cookbooks/) are Anthropic-authored end-to-end walkthroughs. Each maps to a concrete mdeai surface. Adopt them in this order — do NOT try to adopt all 8 at once.

| Cookbook | mdeai application | Adopt in | Why |
|---|---|---|---|
| [`managed-agents.md`](../agents/cookbooks/managed-agents.md) — iterate on a failing test suite | Wire `01-outcomes-plan.md` Phase 2: a runner that creates an agent, defines the PR-review outcome, streams events. | **Week 2** | This is the canonical first Managed Agents flow. Copy the pattern verbatim, swap "fix calc.py" → "grade this PR against `.claude/outcomes/pr-review.md`". |
| [`multi-agent-cookbook.md`](../agents/cookbooks/multi-agent-cookbook.md) — coordinator + specialists for sales-proposals | Build a small lead → 3 specialists (supabase-rls, maps-grounding, mastra) for `phase1-gate.md` outcome. | **Week 3+** | Start with 3 specialists, not 8. Cookbook uses Northstar sales context; we substitute the Phase 1 gate items. |
| [`Context-engineering.md`](../agents/cookbooks/Context-engineering.md) — memory vs compaction vs tool-clearing | Settle the CLAUDE.md trim debate (§9.2): move "Tech Stack" / "Database" into `paths:`-scoped skills, leave only behavior rules in CLAUDE.md. | **Week 1** | The single biggest source of token churn in the audit; this cookbook is the authoritative reasoning. |
| [`memory-context.md`](../agents/cookbooks/memory-context.md) — persistent memory with Sonnet 4.6 | Productionize the auto-memory writes that already exist (`MEMORY.md` index pattern). Add a context-edit budget. | **Week 2** | We already do this informally; cookbook formalizes when to write vs. compact vs. clear. |
| [`agents-users.md`](../agents/cookbooks/agents-users.md) — agents that remember users | Rentals AI Chat: persist Camila's prior intent ("downtown 2BR, $1.2k") so revisits don't restart cold. | **Week 4+** | High product value, low audit value. Bring it back when Rentals AI Chat re-prioritizes. |
| [`incident-responder.md`](../agents/cookbooks/incident-responder.md) — SRE incident agent | Pair with `production-deploy.md` outcome: when deploy fails, spawn an investigator that fetches Vercel logs + Supabase advisor and writes a Linear ticket. | **Week 4+** | Wait until `production-deploy` outcome is live. |
| [`chief-of-staff.md`](../agents/cookbooks/chief-of-staff.md) — chief-of-staff orchestrator | Aspirational. The `mdeai-lead` coordinator is the closest analog; this cookbook describes the long-horizon planning agent on top. | **deferred** | High complexity; revisit only after Multi-Agent (Week 3) is stable. |
| [`observity-agent.md`](../agents/cookbooks/observity-agent.md) — observability agent | Pair with `ai_runs` table: an agent that periodically reads `ai_runs`, flags p95 latency regressions and unusual tool-call drops, writes summary to a dashboard. | **deferred** | Needs production telemetry maturity first. |

### Reading order for the operator (1-hour audit briefing)

1. `Context-engineering.md` (15 min — frames why we cut CLAUDE.md)
2. `managed-agents.md` (15 min — frames the §5 outcome rubrics)
3. `multi-agent-cookbook.md` (15 min — frames §7 coordinator)
4. `memory-context.md` (15 min — frames §9.2 memory budget)

The other four are reference material for when their phase comes up.

---

## 16. Revised phased rollout (per user feedback, 2026-05-14)

The user accepted the audit but flagged that the original Sprint 1/2/3 over-engineers Managed Agents adoption. Reorder to:

### Week 1 — MUST DO (security + context + first outcomes)

| # | Task | Effort | Cookbook |
|---|---|---|---|
| W1.1 | Rotate Vercel token; clean `.claude/settings.local.json` | 15 min | — |
| W1.2 | Audit `dist/` for leaked `VITE_GEMINI_API_KEY` and add `dist-leak-scan.mjs` hook | 1 h | — |
| W1.3 | Add `paths:` frontmatter to every `mde-*` skill | 30 min | `Context-engineering.md` |
| W1.4 | De-duplicate vercel:* plugin skills (investigate double-install) | 30 min | — |
| W1.5 | Trim CLAUDE.md: move Tech Stack / Database / AI Integration / Phase 1 Priorities into `paths:`-scoped skills | 1 h | `Context-engineering.md` |
| W1.6 | Ship the 4 starter Outcome rubrics: `pr-review`, `supabase-migration`, `maps-grounding`, `events-ticketing` (Phase 1: markdown only, no API yet) | 2 h | `managed-agents.md` |

**Exit criteria:** context drops from ~46 k → ~26 k at session start; the four rubric files live at `.claude/outcomes/*.md`; no `sk_live_*` or `vercel:` tokens in `.claude/`.

### Week 2 — HIGH ROI (hooks + verifier + first API outcome)

| # | Task | Effort | Cookbook |
|---|---|---|---|
| W2.1 | Add `stop-attribution-gate.mjs` hook (no "I did X" in agent stop messages without evidence) | 1 h | — |
| W2.2 | Add `stop-rls-gate.mjs` hook (block stop if migration changed but `pg_policies` query was not run) | 1 h | — |
| W2.3 | Build one **lightweight verifier sub-agent** (`mdeai-qa-verifier`) that reads a rubric file and grades the diff. Pure Claude Code subagent, no Managed Agents API yet. | 2 h | — |
| W2.4 | Wire `scripts/outcomes/run-outcome.ts` against the Managed Agents API. Use `pr-review.md` as the first rubric. | 4 h | `managed-agents.md` |
| W2.5 | Formalize the memory budget per `memory-context.md` (when to write to `MEMORY.md` vs. compact vs. clear) | 1 h | `memory-context.md` |

**Exit criteria:** at least one PR graded end-to-end by the Managed Agents grader returning `satisfied`; two new hooks blocking unsafe stops.

### Week 3+ — ONLY AFTER Week 1-2 STABLE

| # | Task | Effort | Cookbook |
|---|---|---|---|
| W3.1 | Multi-agent coordinator: lead + 3 specialists (`mdeai-supabase-rls`, `mdeai-maps-grounding`, `mdeai-mastra`). Start small. | 1 day | `multi-agent-cookbook.md` |
| W3.2 | GitHub Action: invoke `run-outcome.ts` on `pull_request`; post grader output as PR comment; block merge on non-satisfied. | 1 day | — |
| W3.3 | `production-deploy.md` outcome wired to Vercel deploy-hook | 2 days | — |

### Deferred (only if backlog explicitly calls for them)

- `agents-users.md` — Rentals AI Chat memory of returning users
- `incident-responder.md` — automated incident triage on deploy failure
- `chief-of-staff.md` — long-horizon planning orchestrator
- `observity-agent.md` — `ai_runs` regression watcher
- Scheduled nightly autonomous QA (the original "Sprint 3" tier — keep paged off until 7 nights green)

---

## 17. Risks of *over*-adopting Managed Agents too early

The user's strongest critique: the original audit pushes too much Managed Agents complexity for a 1–3 developer team. Specifically:

| Original ambition | Why it's premature | What to do instead |
|---|---|---|
| 8-specialist multi-agent roster | Cookbook example uses 4 (Northstar sales). 8 needlessly multiplies failure modes. | Start with **lead + 3 specialists** (W3.1). Add the 4th–8th only when each one has a stable, recurring task. |
| Daily autonomous QA cron | Pages a human at 3am on `needs_revision` is a fast way to learn to ignore the pager. | Run on-demand via slash command for 1–2 weeks. Only schedule once `satisfied` rate ≥ 80 %. |
| `vercel.ts` config rewrite | Not a Claude best-practices issue; it's a Vercel config style choice. | Move to a separate Vercel-track task; out of scope for this guide. |
| 20-agent roster, depth=1, 25 concurrent threads (from `multi-agent-cookbook.md`) | Possible per docs; not justified for our load. | Cite the cookbook upper bounds; don't aim for them. |

The core architectural insight from the cookbook **is correct and worth quoting in every PR description that uses an Outcome**:

> "The grader is independent and stateless. It runs in its own context window so the writer can't talk it into anything, and a fresh one re-checks the whole artifact every iteration."

That's the *full* value of Outcomes — separation of writer and verifier. Everything else in this guide (multi-agent, scheduled QA, autonomous incident response) is a downstream consequence and can wait until that core pattern is proven on the four starter rubrics.

---

*This guide is the canonical reference for `.claude/` configuration on mdeai.co. Re-audit when Anthropic ships new primitives or when the active skill count exceeds 30. Companion: [`01-outcomes-plan.md`](./01-outcomes-plan.md) (the four starter Outcome rubrics).*
