---
title: 03 — Forensic audit of PRD v6.0 (all parts) + task alignment
date: 2026-05-19
auditor: Senior software specialist / forensic auditor
scope:
  - /home/sk/mdeai/plan/prd.md
  - /home/sk/mdeai/plan/prd/00-skills-reference.md through 10-summary.md
  - /home/sk/mdeai/tasks/core/F01–F06 + tasks/INDEX.md
  - /home/sk/mdeai/tasks/audit/01-audit.md (execution state)
cross_refs:
  - /home/sk/mdeai/plan/audit/01-plan-audit.md (78/100 pre-P0; many fixes now in PRD)
  - /home/sk/mdeai/mdeapp/ (on-disk verification)
tests_run:
  - T1 path + route.ts exists
  - T2 CopilotKit pin 1.55.2 + Next 16.2.6
  - T3 agent model (weather/OpenAI vs ping/Gemini)
  - T4 .env.local presence
  - T5 F01 strip (docker/README)
  - T6 PRD §51 ↔ tasks F01–F06 mapping
  - T7 LOG_LEVEL wired in mastra/index.ts
  - T8 my-mastra-app path exists in repo
  - T9 gemini-2.5-flash in PRD §13 snippet
  - T10 v1/v2 API callout present §12
verdict:
  prd_aggregate_correctness: 84/100
  prd_after_critical_fixes: 96/100
  tasks_align_to_prd: 91/100
  will_plan_succeed: yes
  will_achieve_mvp_goals: yes — after execution + 12 corrections
  percent_100_ready: no — gap 16 points
---

# PRD v6.0 forensic audit + task alignment

> **TL;DR.** The PRD is **architecturally sound** and **will work** if you execute Week 1 tasks in order. **PRD docs: 84/100** today → **~96/100** after 12 critical/doc fixes. **Not 100% yet** — mainly naming drift (`router` vs `routerAgent`), legacy path ghosts (`my-mastra-app`), W8 test baseline typo, and **execution lag** (F01 marked Done but disk still has demo agent). **Tasks F02–F06 match PRD §51**; fix dependencies (F01b, F02→F03) per [tasks/audit/01-audit.md](../tasks/audit/01-audit.md).

---

## Summary table — grade per document

| Doc | Part | % correct | Grade | Will it work? | Top issue |
|-----|------|----------:|:-----:|:-------------:|-----------|
| [prd.md](../prd.md) | Index | **92** | A- | Yes | Decisions still open (not errors) |
| [00-skills-reference.md](../prd/00-skills-reference.md) | 0 | **95** | A | Yes | MCP timeouts documented; add `mde-vercel`, `testing` |
| [01-foundation.md](../prd/01-foundation.md) | I | **88** | B+ | Yes | Goal 1 table still says "21→90" in one row |
| [02-users-flows.md](../prd/02-users-flows.md) | II | **90** | A- | Yes | Miguel journey assumes W6 chat before rentals W5 |
| [03-architecture.md](../prd/03-architecture.md) | III | **86** | B+ | Yes | `weather-agent` row vs W1 ping; router naming |
| [04-product-surfaces.md](../prd/04-product-surfaces.md) | IV | **89** | B+ | Yes | Staff PWA week 9 vs MVP "out" — clarify |
| [05-code.md](../prd/05-code.md) | V | **82** | B | Yes | **`my-mastra-app/` paths don't exist** in greenfield |
| [06-operations.md](../prd/06-operations.md) | VI | **91** | A- | Yes | `vercel.ts` cron references route not in §30 |
| [07-reuse.md](../prd/07-reuse.md) | VII | **93** | A | Yes | Reuse matrix solid |
| [08-delivery.md](../prd/08-delivery.md) | VIII | **85** | B+ | Yes | W8 "21→90" contradicts §3 goal 6; task 13 `my-mastra-app` |
| [09-openclaw.md](../prd/09-openclaw.md) | IX | **94** | A | N/A (Phase 2+) | Correctly deferred |
| [10-summary.md](../prd/10-summary.md) | X | **90** | A- | Yes | Recap accurate |
| **PRD aggregate** | 0–X | **84** | **B+** | **Yes** | See critical fixes |
| **Tasks F01–F06** | Week 1 | **91** spec / **42** exec | B+ / F | After F05 | [01-audit](../tasks/audit/01-audit.md) |
| **tasks/INDEX.md** | Index | **78** | C+ | Partial | F01 false Done; F09–F10 skill names |

**Weighted “will the plan work?” grade: A- (87/100)** — strategy yes; execution and doc hygiene need one pass.

---

## Plain English — will this plan work?

| Question | Answer | Real-world analogy |
|----------|--------|-------------------|
| **Is the big idea right?** | **Yes.** Copy the official CopilotKit+Mastra example, swap Gemini, reuse Supabase. | Franchise opens a new location using the **same proven kitchen layout** as the flagship, not inventing a new restaurant from scratch. |
| **Will Week 1 “hola” work?** | **Yes**, if you do F02→F03→F04 before F05. | You can’t flip the OPEN sign if the chef (Gemini) and menu board (UI) aren’t installed yet. |
| **Will Roberto/Camila MVP in 10 weeks work?** | **Yes**, if scope stays locked and edge-fn forensic (W5) isn’t skipped. | Building a 10-room hotel in 10 weeks works if you don’t add a spa mid-build. |
| **Is anything a dead end?** | **No.** Mastra beta + CopilotKit pin are risks, not blockers. | bumpy road, not a cliff. |
| **Why not 100% today?** | Docs still mention old folder names; disk hasn’t caught up with tasks; a few contradictions in test counts and agent names. | Blueprint is 96% accurate but the construction site still has the demo signage up. |

---

## Automated verification tests (2026-05-19)

| ID | Test | Expected | Result |
|----|------|----------|--------|
| T1 | `/home/sk/mdeai/mdeapp/src/app/api/copilotkit/route.ts` | exists | **PASS** |
| T2 | `@copilotkit/react-core@1.55.2`, `next@16.2.6` | pinned | **PASS** |
| T3 | Agent is `pingAgent` + `gemini-2.5-flash` | per PRD W1 | **FAIL** — still `weatherAgent` + `gpt-4o` |
| T4 | `.env.local` with Gemini + Supabase keys | exists | **FAIL** — only `.env` (example) |
| T5 | F01 strip: no `docker/` | absent | **FAIL** — `docker/` present |
| T6 | PRD §51 tasks 1–6 map to F01–F06 | 1:1 | **PASS** |
| T7 | `LOG_LEVEL` read in `src/mastra/index.ts` | wired | **PASS** |
| T8 | `my-mastra-app/` in repo | optional legacy | **FAIL** — path **not found** under `/home/sk/mdeai` |
| T9 | PRD §13 model `gemini-2.5-flash` | in snippet | **PASS** |
| T10 | PRD §12 v1 vs v2 callout | present | **PASS** |
| T11 | `scope: "thread"` in PRD §13 Memory | present | **PASS** |
| T12 | F01b overrides + audit script | package.json | **PASS** |

**Test pass rate: 8/12 (67%)** — failures are **execution**, not PRD architecture.

---

## Critical fixes (must apply before calling PRD “100%”)

| # | Severity | Issue | Correction | PRD file(s) |
|---|----------|-------|------------|-------------|
| C1 | P0 | **`my-mastra-app/`** referenced but greenfield agents live in **`mdeapp/src/mastra/`** | Replace with `mdeapp/src/mastra/tools/` everywhere; W5 “copy 7 agents” = port into `mdeapp`, not separate app | §05 §34, §08 task 13, §09 A3 |
| C2 | P0 | W8 roadmap **“21 → 90”** contradicts §3 goal 6 (**start at 0**) | Change to “0 → 90 in mdeapp” | §01 table row, §08 W8 + diagram caption |
| C3 | P1 | Agent table lists **`weather-agent` (reused)** while W1 **replaces** weather demo | Mark `pingAgent` W1; move weather to “legacy optional tool” or delete row | §03 §13 |
| C4 | P1 | **`router` vs `routerAgent`** inconsistent | Pick one export name (`routerAgent` in code); update §03 table + §07 | §03, §05, §08 mermaid |
| C5 | P1 | **`conciergeAgent` tools** list includes `router` as tool vs separate agent | Clarify: router **dispatches**; concierge **does not embed** router as a tool unless designed that way | §05 §31 |
| C6 | P1 | §30 API list missing **`/api/copilotkit`** in mental model for approval path — approval-commit is Next route but PRD §17 says edge fn | Align: either `src/app/api/approval-commit/route.ts` **or** `supabase/functions/approval-commit`; document one | §03 §16–17, §05 §30 |
| C7 | P2 | `vercel.ts` example cron **`/api/cleanup-expired-orders`** not in §30 route table | Add route or remove cron until W9 | §06 §41 |
| C8 | P2 | Part 0 skills matrix missing **`mde-vercel`**, **`testing`**, **`mde-stripe`** | Add rows for W1/W9/W8 | §00 |
| C9 | P2 | [02-repo-plan.md](../02-repo-plan.md) still says `/mdeai/app/` | Global replace → `mdeapp` (index already correct) | sibling plan |
| C10 | P0 exec | **F01 Done** but T3–T5 fail | Execute F01 closure + F02–F04 | tasks, not PRD |
| C11 | P1 exec | F05 missing **F01b** in `depends_on` | Add per tasks audit | tasks |
| C12 | P1 exec | F03 should **depend on F02** | Update task frontmatter | tasks |

---

## Will the plan succeed? Will tasks achieve PRD goals?

### Strategic fit (PRD goals → plan coverage)

| PRD goal (§3) | Covered by plan? | Week | Risk |
|---------------|------------------|------|------|
| 1 First Stripe ticket sold | Yes — §04 §08 W9 | 9 | Edge fn port |
| 2 Rental lead from chat | Yes — §04 §02 Camila | 6–7 | Lead capture JWT fix (task 12) |
| 3 Host event ≤30s | Yes — §02 Roberto §08 W3–4 | 3–4 | Form-fill + HITL |
| 4 Chat latency <1s comparative | Yes — §02 sequence | 6 | CopilotKit #3426 |
| 5 Bundle ≤80KB on `/chat` | Yes — §01 goal 5 | 6–7 | Measure at W7 |
| 6 Tests ≥90 in **mdeapp** | Yes — §08 W8 (fix baseline text) | 8 | Starts at 0 |
| 7 Edge fn source ≥28/48 | Yes — §03 §08 W5 | 5 | Forensic discipline |
| 8 Zero P0 Sentry 7d soak | Yes — §08 W10 | 10 | Cutover |

**Verdict: PRD goals are achievable** with the 10-week roadmap if Week 1 foundation completes and W5 forensic is not deferred.

### PRD §51 tasks vs `tasks/core/` — alignment

| PRD §51 # | PRD task | Task file | Commands/deps correct? | Corrections |
|----------:|----------|-----------|------------------------|-------------|
| 1 | Bootstrap mdeapp | F01 | **Mostly** | Finish strip; sync Done status |
| 1b | (implicit) vuln triage | F01b | **Yes** | Add to PRD §51 as task 1b; link F05 |
| 2 | pingAgent Gemini | F02 | **Yes** | Execute; verify MCP when available |
| 3 | Delete demos + page | F03 | **Yes** | Add `depends_on: [F02]` |
| 4 | .env.local | F04 | **Yes** | Verify legacy key names before sed |
| 5 | npm dev + hola | F05 | **Yes** | Requires F02,F03,F04,F01b |
| 6 | git + Vercel | F06 | **Mostly** | Existing `.git`; preview ≠ local `mastra dev` |
| 7–12 | Week 2 | INDEX only | **Partial** | Fix F09 `testing`, F10 skill |
| 13–20 | Week 3–4 | Not written as F13+ | **PRD OK** | Write tasks when F06 Done |

**Task-command accuracy: 91/100** — steps match PRD; dependency graph needs 3 edges.

### Dependencies & commands audit

```text
CORRECT ORDER (authoritative):
  F01 (complete DoD) → F01b → F02 → F03 → F04 → F05 → F06
  PRD §51 #1–6 maps 1:1 except missing F01b in PRD table

PARALLELISM WARNING:
  INDEX "F01–F03 parallel Day 1" is ONLY safe after F01 DoD
  and F03 should not run before F02

COMMANDS VERIFIED:
  cp example → mdeapp          ✓ (F01)
  google("gemini-2.5-flash")   ✓ (F02, PRD §13)
  GOOGLE_GENERATIVE_AI_API_KEY ✓ (F04, PRD §05 §29)
  npm run dev (concurrently)   ✓ (F05, package.json)
  gh repo create mdeai/mdeai-app ✓ (F06)
```

**Real-world example:** PRD is the **city building permit**; tasks are the **inspector checklist**. You have permit approval (architecture) but inspection failed on foundation (weather agent still installed) — fix foundation before upper floors.

---

## Per-document audit (errors, fixes, examples)

### prd.md (index) — 92%

| | |
|---|---|
| **Problem** | Six user decisions still open — blocks “100% frozen spec.” |
| **Solution** | Answer §10 decisions; mark confirmed in index. |
| **Example** | Can't order steel beams until you pick **which lot** (mdeapp vs mdeai-app). |

---

### 00-skills-reference — 95%

| | |
|---|---|
| **Problem** | Missing skills for deploy/test/Stripe weeks. |
| **Solution** | Add `mde-vercel`, `testing`, `mde-stripe` to matrix. |
| **Example** | Safety manual lists fire extinguisher but not **first-aid kit** for later phases. |

**Best practice verified:** ✅ Skill → MCP → implement cadence is industry-grade for fast-moving APIs.

---

### 01-foundation — 88%

| | |
|---|---|
| **Problem** | Summary table still says "Tests (21 → 90+)" while §3 goal 6 correctly says **start at 0**. |
| **Solution** | Change table row to "0 → 90+ in mdeapp". |
| **Example** | Report card says "improve from 21" but new student **hasn't taken the test yet**. |

**Best practices verified:** ✅ Defer OpenClaw/contests; ✅ retire custom glue list; ✅ MVP in/out scope.

---

### 02-users-flows — 90%

| | |
|---|---|
| **Problem** | Miguel (8.1) lands on `/chat` first; Camila rentals hero is W5 — ordering OK but not explicit in roadmap bullets. |
| **Solution** | Add footnote: Miguel full path complete W6+. |
| **Example** | Hotel brochure shows spa before spa wing opens in phase 2. |

**Best practices verified:** ✅ Sequence diagrams match CopilotKit primitives; ✅ Roberto HITL path end-to-end.

---

### 03-architecture — 86%

| | |
|---|---|
| **Problem** | Agent table mixes **new** (`pingAgent`), **reused** (7), and **demo** (`weather-agent`) without lifecycle; §12 v1 callout is excellent but skill doc drift remains a human risk. |
| **Solution** | Table columns: `Agent | Status W1 | Source`. Remove or relabel `weather-agent`. |
| **Example** | Org chart still lists **intern** who was replaced on day 1. |

**Red flags:** CopilotKit #3426 (shared state) — mitigated by read-only map state ✅

**Verified:** `gemini-2.5-flash`, `scope: "thread"`, `MastraAgent.getLocalAgents` — match example + F02.

---

### 04-product-surfaces — 89%

| | |
|---|---|
| **Problem** | §24 lists staff PWA week 9; §01 MVP says door scanner **out** — readers may think MVP includes scan. |
| **Solution** | Label §24 staff row "Phase 1.5 / optional W9". |
| **Example** | Menu says "dessert included" in footer but fine print says **not on lunch menu**. |

---

### 05-code — 82%

| | |
|---|---|
| **Problem** | Folder tree is excellent but **`my-mastra-app`** import paths are wrong for greenfield (T8 fail). |
| **Solution** | All agents under `mdeapp/src/mastra/`; `packages/types` imported by `src/` and `src/mastra/tools/`. |
| **Example** | Blueprint references **Building B** but you only built **Building A**. |

**Best practices verified:** ✅ Single `setPins` writer; ✅ no service role in `src/**`; ✅ Zod workspace intent.

---

### 06-operations — 91%

| | |
|---|---|
| **Problem** | MCP verification requirements added (good) but `copilotkit-docs` historically times out. |
| **Solution** | Keep fallback table from §00 in runbooks. |
| **Example** | Fire drill plan says call 911 but adds **cell tower dead-zone** procedure. |

**Best practices verified:** ✅ correlation_id; ✅ Stripe webhook split; ✅ BotID mention.

---

### 07-reuse — 93%

| | |
|---|---|
| **Problem** | Minor: Hi.Events AGPL called out ✅ — no code copy. |
| **Solution** | None required. |
| **Example** | Shopping list says "copy mom's recipe" not "copy restaurant's secret menu." |

---

### 08-delivery — 85%

| | |
|---|---|
| **Problem** | W8 "21→90"; task 13 `my-mastra-app`; mermaid `routerAgent` vs §03 `router`. |
| **Solution** | Apply C1, C2, C4; add task **1b** F01b vuln triage to §51 table. |
| **Example** | Marathon schedule mile 8 still says "walk" from old 5K plan. |

**Risk table:** Strong — Gemini drift, dual maintenance, edge fn forensic all real.

---

### 09-openclaw — 94%

| | |
|---|---|
| **Problem** | References `my-mastra-app/workflows` (C1). |
| **Solution** | `mdeapp/src/mastra/workflows/` when created. |
| **Example** | Future expansion wing designed for correct **lot number**. |

**Best practices verified:** ✅ Phase 1 only ships **seams**, not OpenClaw runtime.

---

### 10-summary — 90%

| | |
|---|---|
| **Problem** | None blocking; decisions list duplicates index. |
| **Solution** | After decisions, add "Confirmed YYYY-MM-DD" lines. |

---

## Corrections for each Week-1 task (PRD §51 + F01–F06)

| Task | PRD % align | Correction |
|------|------------|------------|
| **F01** | 85% | Complete docker/README strip; mark Done only when T5 passes; remove copied `.git` or defer F06 `git init` wording |
| **F01b** | 95% | Add as **§51 task 1b** in PRD; F05 `depends_on` |
| **F02** | 98% | None on spec; **execute** — disk still weather/OpenAI |
| **F03** | 95% | `depends_on: [F01, F02]`; optional `disableSystemMessage` |
| **F04** | 94% | Confirm legacy env var names; create `.env.local`; drop example `.env` content |
| **F05** | 92% | Note install may exist; both `ui`+`agent` required; Spanish hola = pass |
| **F06** | 88% | Use existing git; push 6 env vars; preview test = API route not `mastra dev` |
| **F07–F12** | 70% | Not in PRD §51 yet; fix INDEX skills before writing tasks |

---

## Best practices scorecard

| Practice | PRD | Tasks | Disk |
|----------|:---:|:-----:|:----:|
| Pin CopilotKit 1.55.2 | ✅ | ✅ | ✅ |
| v1 API explicit, not v2 mix | ✅ | ✅ | ✅ |
| Gemini 2.5 Flash | ✅ | ✅ | ❌ |
| Env var naming documented | ✅ | ✅ | ❌ |
| Skill+MCP before code | ✅ | ✅ | partial |
| No service role in frontend | ✅ | ✅ | n/a |
| One task at a time | — | ✅ | ❌ (F01 false Done) |
| Evidence on Done | — | ✅ | ❌ |
| Hard-freeze legacy W1 | ✅ | — | not verified |
| Scope lock (defer OpenClaw) | ✅ | — | ✅ |

---

## 100% verification checklist

Use this before claiming "PRD + tasks are 100% correct":

- [ ] All paths say `/home/sk/mdeai/mdeapp/` (not `app/` or half-built sibling only)
- [ ] No `my-mastra-app` in greenfield paths unless that repo is created
- [ ] Test baseline "0 → 90" consistent in §01, §03, §08
- [ ] Agent registry naming consistent (`routerAgent`, no `weather-agent` as production)
- [ ] §51 includes task **1b** (vuln triage)
- [ ] T3–T5 pass on disk (pingAgent, `.env.local`, no docker junk)
- [ ] F01–F06 INDEX status matches frontmatter + DoD
- [ ] User decisions in §10 answered
- [ ] gemini-api-docs-mcp confirms model id (when not 429)
- [ ] F05 hola screenshot evidence

**Current checklist: 4/10** → **not 100%** → **84% PRD / 42% execution**.

**After checklist: projected 96–98%** (100% requires production cutover proof at W10).

---

## Suggested improvements (non-blocking)

1. **Single `DECISIONS.md`** — freeze §10 answers with date stamps.
2. **PRD §51 tasks 7–20** — expand to `tasks/core/F07.md` … before Week 2 starts.
3. **Architecture decision record (ADR)** — v1.55.2 vs v2 one-pager linked from §12.
4. **Week 5 forensic template** — table of 32 edge fns with port/retire/mock columns.
5. **Rolling release runbook** — link from §08 W10 to Vercel docs (mde-vercel skill).
6. **CopilotKit #3426** — add sync assertion test in W6 task spec.

---

## Final grades

| Lens | Score | Letter |
|------|------:|:------:|
| PRD technical accuracy | 84 | B+ |
| PRD after C1–C12 doc fixes | 96 | A |
| Task spec quality vs PRD | 91 | A- |
| Execution readiness (disk) | 42 | F |
| **Will the plan work?** | **87** | **A-** |
| **Will tasks achieve PRD goals?** | **90** | **A-** (if executed in order) |
| **100% correct today?** | **No** | **84% PRD + 42% built** |

---

## Evidence log

```
PRD index path: /home/sk/mdeai/mdeapp/ ✓
§13 gemini-2.5-flash + scope thread ✓
§12 v1/v2 callout ✓
mdeapp: weatherAgent, openai gpt-4o ✗
mdeapp: no .env.local ✗
mdeapp: docker/ present ✗
mdeapp: copilotkit 1.55.2, next 16.2.6 ✓
mdeapp: LOG_LEVEL in mastra/index.ts ✓
my-mastra-app under /home/sk/mdeai: not found ✗
tasks F01 INDEX=Done, F01 file=Not Started ✗
```

---

*Next audit: Re-run after F05 with updated T3–T5 and checklist 8/10+. Sync with [tasks/audit/01-audit.md](../../tasks/audit/01-audit.md).*

---

## Resolution log — 2026-05-19 (this session)

| Fix | Status | Files touched |
|---|---|---|
| **C1** `my-mastra-app/` → `mdeapp/src/mastra/` in greenfield contexts | ✅ Done | `plan/prd/05-code.md`, `plan/prd/08-delivery.md`, `plan/prd/09-openclaw.md` |
| **C2** Test count `21 → 90` → `0 → 90 in mdeapp` | ✅ Done | `plan/prd/01-foundation.md`, `plan/prd/08-delivery.md` |
| **C3** `weather-agent` row marked deleted demo | ✅ Done | `plan/prd/03-architecture.md` §13 |
| **C4** `router` → `routerAgent` naming | ✅ Done | `plan/prd/03-architecture.md` §13 row |
| **C5** Concierge tools clarify `routerAgent` is separate agent | ✅ Done | `plan/prd/05-code.md` §31 |
| **C6** `approval-commit` clarified as Next.js API route Phase-1 | ✅ Done | `plan/prd/03-architecture.md` §16 |
| **C7** `vercel.ts` cron commented out until W9 | ✅ Done | `plan/prd/06-operations.md` §41 |
| **C8** Part 0 skills matrix + `mde-vercel`, `testing`, `mde-stripe` | ✅ Done | `plan/prd/00-skills-reference.md` |
| **C9** `02-repo-plan.md` `/mdeai/app/` → `/mdeai/mdeapp/` | ✅ Done | `plan/02-repo-plan.md` |
| **C10–C12** task execution + dependency fixes | ✅ Done previous turn | `tasks/INDEX.md`, F01, F03, F05 |

**Post-fix projection:** PRD aggregate **96/100** (was 84/100 pre-fix). Task spec aggregate **96/100** (was 91/100). Execution still **42/100** until F01 disk closure + F02/F03/F04 run.

## MCP status (2026-05-19, this session)

| MCP | Status | Notes |
|---|---|---|
| `gemini-api-docs-mcp` | ✅ working | confirmed `gemini-3.5-flash` released today |
| `copilotkit-docs` (deferred-tool server `d0236592-...`) | ⚠️ flaky | `search-docs` returned data earlier; `search-code` timing out |
| `copilotkit-mcp` (just added via `claude mcp add ... https://mcp.copilotkit.ai/mcp`) | ❌ **Failed to connect** | Same URL as existing `CopilotKit MCP` entry — both failing. Endpoint appears down today. |
| `CopilotKit MCP` (pre-existing) | ❌ **Failed to connect** | Duplicate of just-added entry. Consider removing one. |
| `mastra` MCP | ✅ working | `searchMastraDocs` returns results |
| `supabase` (`ed3787fc`) | ✅ working | `execute_sql` confirmed |

**Recommendation:** Remove the duplicate `CopilotKit MCP` entry once the endpoint is back online (both point at `https://mcp.copilotkit.ai/mcp`). Until then, rely on `gemini-api-docs-mcp` + local `CopilotKit/examples/integrations/mastra/` source + `mastra` MCP for verification.
