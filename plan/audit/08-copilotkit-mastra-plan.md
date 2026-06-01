---
title: CopilotKit + Mastra plan forensic audit
date: 2026-05-22
scope:
  - /home/sk/mdeai/mdeapp
  - /home/sk/mdeai/plan
  - /home/sk/mdeai/tasks
requested_by: user
status: Not ready
---

# CopilotKit + Mastra Plan Forensic Audit

## Executive Verdict

| Area | Verdict |
|---|---|
| Overall correctness score | 🟡 **76/100** |
| Production readiness score | 🔴 **42/100** |
| Chance of success | 🟡 **Medium if corrected now; low if current docs are treated as ready** |
| Biggest blocker | `mdeapp` does **not build** and `npm run floor` is red |
| Runtime foundation | 🟢 Pattern 1 is basically correct: Next `/api/copilotkit` -> `CopilotRuntime` -> Mastra local agents -> AG-UI |
| Product readiness | 🔴 Not ready: no `/chat`, no `MapContext`, no map pins, no Roberto wizard, no HITL persistence, no ticket edge port |

**Brutal answer:** the tasks are **not 100% correct**. The plan can succeed, but only after fixing the red build/floor gates, promoting the CK backlog into executable tasks, and reconciling ordering drift across `roadmap.md`, `tasks/INDEX.md`, and `tasks/mastra/INDEX.md`.

**Top 5 critical fixes:**

1. Fix `npm run build` and `npm run floor` before implementing any new Mastra/CopilotKit work.
2. Make MAP-001 the next product gate before MASTRA-002, Roberto, or Camila UI work.
3. Promote CK-001..CK-005 from backlog entries into executable task files with evidence requirements.
4. Correct roadmap/task drift: use MAP-002, F46, and CK gates instead of old MAP-003/F17 ordering language.
5. Decide PostgresStore language precisely: post-MVP for demo, but required before production cutover or any "durable chat" claim.

## Evidence Snapshot

| Check | Result | Evidence |
|---|---|---|
| `npm run lint` | 🔴 Fail | `src/mastra/tools/search-rentals.ts:5` unused `rentalSchema` warning; max warnings is 0 |
| `npm run build` | 🔴 Fail | `src/mastra/tools/search-restaurants.ts:4` imports `./search-events.js`, which Turbopack cannot resolve |
| `npm run test` | 🟢 Pass | 6 test files, 43 tests passed |
| `npm run typecheck` | 🟢 Pass | `tsc --noEmit` exit 0 |
| `npm run floor` | 🔴 Fail | Stops at lint warning before typecheck/build/test/audit |
| `npm run check:mastra` | 🔴 Missing script | `package.json` has no `check:mastra` script |
| Requested `rg useCoAgent...` | 🟡 Partial | only `pingAgent` appears in UI; `routerAgent` exists in code but no `/chat` |
| Requested `rg :memory...` | 🟡 Expected debt | `:memory:`, `file::memory:`, and file LibSQL memory all present |
| Requested HITL/action rg | 🔴 Not wired | only `ApprovalPanel` comment mentions `renderAndWaitForResponse`; no actual CopilotKit action wiring |

## Runtime Architecture

The runtime foundation is the strongest part of the repo.

| Requirement | Status | Evidence |
|---|---|---|
| `/api/copilotkit` wiring | 🟢 Correct shape | `mdeapp/src/app/api/copilotkit/route.ts:1-28` builds `CopilotRuntime`, `ExperimentalEmptyAdapter`, and `copilotRuntimeNextJSAppRouterEndpoint` |
| Mastra local agents | 🟢 Registered | `mdeapp/src/mastra/index.ts:20-33` registers 6 agents and 3 workflows |
| AG-UI Mastra bridge | 🟢 Correct foundation | `route.ts:17-19` uses `getLocalAgentsWithLogging({ mastra })`; wrapper extends `MastraAgent` in `logging-mastra-agent.ts:22-88` |
| Agent names match current UI | 🟢 For root only | root provider `agent="pingAgent"` at `layout.tsx:32`; `useCoAgent({ name: "pingAgent" })` at `page.tsx:33-35` |
| Agent names match future `/chat` | 🔴 Not testable yet | no `mdeapp/src/app/chat/*` exists |
| `integrations/mastra` base used correctly | 🟢 Mostly | local example uses same route/provider/runtime pattern; mdeapp adds logging wrapper rather than second runtime |
| Second runtime introduced | 🟢 No | no LangGraph/CrewAI/PydanticAI/ADK/OpenAI runtime found in `mdeapp/src` |
| Package version safety | 🟡 Risk | CopilotKit is pinned at `1.55.2`, but `@ag-ui/mastra`, `@mastra/*`, and `mastra` are `"beta"` in `package.json:23,30-33,40` |

**Important nuance:** the current installed `@mastra/core` type surface includes `workflows?: ...` in `node_modules/@mastra/core/dist/agent/types.d.ts`. That means old F18 warnings saying `Agent({ workflows })` is unsupported are now stale. Do not follow F18's mandatory "tool-wrapper fallback" blindly without re-verifying installed types.

## Canvas Examples Usage

| Pattern from canvas examples | Represented? | Where | Verdict |
|---|---|---|---|
| Zod shared state | 🟡 Planned | F33, CK-002, crosswalk | Correct idea, not implemented |
| Working memory schema | 🟡 Partial | `pingAgent`, `rentalAgent`, `eventAgent`, `conciergeAgent` | Present, but storage is not durable and router has no memory |
| Typed `useCoAgent` | 🟡 Partial | root `MdeState`; F33/F36/CK-002 planned | only ping state currently wired |
| Generative UI cards | 🔴 Missing in app | F24/F25/F46/CK backlog | no `useCopilotAction({ render })` in `mdeapp/src` |
| Collaborative event draft state | 🟡 Planned | F33, F34, F36 | good direction; needs executable proof |
| Multi-section wizard state | 🟡 Planned | F36 + `canvas/mastra-pm` references | represented but no UI |
| HITL approval flows | 🟡 Planned | F37/F38 | current `ApprovalPanel` is a stub; no `renderAndWaitForResponse` wiring |

The examples are used in the right strategic way: `integrations/mastra` is the runtime base, while `canvas/mastra` and `canvas/mastra-pm` are pattern references. The missing piece is execution: the canvas-derived tasks are not yet real enough to protect Roberto or Camila.

## PRD And Roadmap Alignment

| Question | Answer |
|---|---|
| Are PRD/roadmap/tasks aligned? | 🟡 Mostly in architecture, not in exact ordering |
| Must MAP-001 happen before MASTRA-002? | **Yes.** MASTRA-002 requires `/chat` shell and map surface from MAP-001. |
| Must MAP-001 happen before MASTRA-001? | **No.** MASTRA-001 is deterministic router/workflow testing and can run before or parallel with MAP-001. |
| Should PostgresStore be MVP? | **No for local MVP demo; yes before production cutover/durable-memory claims.** |
| Are there fake-ready claims? | **Yes.** Docs say foundation/floor is green, but current `npm run floor` is red. |

### Ordering Drift Found

| File | Problem |
|---|---|
| `roadmap.md:322-335` | strict order still references MAP-003 and F17; task canon now says MAP-002 and F46 |
| `tasks/INDEX.md:83-86` | MVP track uses F18 before F46, but `tasks/INDEX.md:136` says F18 depends on F46; circular/inconsistent index row |
| `tasks/mastra/INDEX.md:63,72-79` | says hard gate MAP-001 -> MASTRA-001 -> MASTRA-002, then table puts MASTRA-001 before MAP-001 and says parallel is allowed; this should be clarified |
| `plan/mastra/mastra-roadmap.md:146` | labels PostgresStore as F20; executable task is MASTRA-003 |
| `prd.md:33-47` | repo truth is stale: it says tests/floor were green as of prior audit; current floor is not green |

## Task Scorecard

| Task | Score | Status | Will succeed? | Blocker | Required fix |
|---|---:|---|---|---|---|
| MAP-001 | 🟢 88 | Not Started | Yes, if first | no `/chat`, no `platform/contracts`, no map deps | Keep first; add CK-002 state contract tie-in and browser proof |
| MASTRA-001 | 🟢 86 | Not Started | Yes | build/floor red; missing router smoke tests | Keep; run before or parallel with MAP-001 |
| MASTRA-002 | 🟡 78 | Not Started | Yes after MAP-001 | `/chat` does not exist | Keep; cannot start before MAP-001 |
| MAP-002 | 🟡 80 | Not Started | Yes if MAP-001 lands | external MCP/grounding quota complexity | Keep after MAP-001; record redacted MCP proof |
| F46 | 🟡 74 | Not Started | Risky | depends on F18/MAP but F18/index drift; no CK state E2E | Modify; add CK-002/CK-005 dependency |
| F33 | 🟢 88 | Not Started | Yes | `src/lib/types.ts` is currently a file, task wants a folder/index | Modify path plan before implementation |
| F34 | 🟡 76 | Not Started | Likely | hostEventAgent absent; Spanish server prompt vs English Phase 1 needs explicit rule | Modify; register logging enum and use shared memory helper |
| F36 | 🟡 72 | Not Started | Risky | nested provider assumption unproven; no component test setup shown | Split provider decision from wizard UI if needed |
| F37 | 🟡 74 | Stub exists | Risky | current panel does not prevent double-submit and no actual action wiring | Modify; add negative double-click test |
| F38 | 🟡 70 | Not Started | Risky | unclear Next `/api/approval-commit` vs Supabase edge URL; service-role boundary must be strict | Split proxy decision from edge function deploy |
| EVT-01 | 🟡 76 | Not Started | Likely | Stripe secrets/F11, live webhook proof missing | Keep; do not tie to Mastra |
| MASTRA-004 | 🟡 78 | Not Started | Yes | route hardcodes `userId: null`; search tools inconsistently use audit wrapper | Keep after MASTRA-001; logged-in proof waits for `/chat` |
| MASTRA-005 | 🟢 85 | Not Started | Yes | script absent | Keep; can be done now after fixing red floor |
| MASTRA-003 | 🟡 79 | Not Started | Yes but not now | `@mastra/pg` absent; memory has 3 stores | Defer until MVP demo; require before production cutover |
| CK-001 | 🟡 78 | Backlog only | Not as-is | no executable task file; no `/chat` | Promote to task after MASTRA-002 |
| CK-002 | 🟡 80 | Backlog only | Not as-is | MapUiState not implemented | Promote to task; tie to MAP-001/F46 |
| CK-003 | 🟡 72 | Backlog only | Maybe | frontend tools not wired | Promote; minimum `focusMapPin` tool |
| CK-004 | 🟡 75 | Backlog alias | Maybe | delegated to F37/F38 but no acceptance bridge test | Keep alias but add E2E task |
| CK-005 | 🔴 68 | Backlog only | No before Playwright | no Playwright/e2e files | Promote after CK-002/F46 |
| CK-006 | 🟡 73 | Backlog only | Yes | Inspector not enabled | Optional dev task |
| CK-007 | 🟡 77 | Backlog only | Yes if fixture-based | no event fixture/validator | Promote with CK-001 |
| CK-008 | 🟡 73 | Backlog only | Yes post-MASTRA-003 | no PostgresStore/thread hydration | Defer |

## Corrections Per Task

| Task | Action | What it is trying to do | Audit correction | Real-world why it matters |
|---|---|---|---|---|
| MAP-001 | Keep | Build contracts, map shell, `/chat` | It is the real first product gate; add explicit `MapUiState` owner or link CK-002 as same PR follow-up | Camila cannot trust rental cards without pins |
| MASTRA-001 | Keep | Prove router/workflows/tools in Vitest | Add build/floor precondition and update F18 beta-drift note | Sofía catches broken workflow registration before Camila sees empty cards |
| MASTRA-002 | Keep | Put `routerAgent` on `/chat` | Depends on MAP-001, not just router code | `/chat` must stop being a ping echo before Tourist/Camila demos |
| MAP-002 | Keep | Grounded places and attribution | Keep fail-closed gates; do not merge without redacted MCP proof | Tourist needs real venues, not invented place IDs |
| F46 | Modify | Thin rental workflow/cards/pins | Add dependency on CK-002/CK-005 and remove F17 confusion | Camila's pin/card selection must stay synchronized |
| F33 | Modify | EventDraft Zod state | Resolve file-vs-folder type path before coding | Roberto's draft state should fail loudly if UI and agent drift |
| F34 | Modify | Host event agent | Use shared memory helper; verify `agent_type` enum; no production auto-publish | Roberto gets form-fill, not DB mutation |
| F36 | Split | Host wizard UI + frontend tools | First prove provider strategy, then build wizard | Double provider bugs would make Roberto's sidebar talk to the wrong agent |
| F37 | Modify | HITL panel | Add double-click/double-respond negative test and action wiring proof | One Approve click must not publish twice |
| F38 | Split | Approval commit edge | Separate Supabase edge function from any Next proxy route | AI proposes; edge/RPC owns published event authority |
| EVT-01 | Keep | Ticket checkout/webhook | Keep outside Mastra; require webhook signature/idempotency proof | Andrés' paid ticket path must not depend on an LLM |
| MASTRA-004 | Keep | user_id + audit wrappers | Add route session extraction and search-tool audit consistency | Patricia needs to trace Camila's logged-in searches |
| MASTRA-005 | Keep | `check:mastra` gate | Implement now, but allow `:memory:` until MASTRA-003 | Sofía blocks wrong agent names and package drift before merge |
| MASTRA-003 | Defer | PostgresStore memory | Not needed for first demo, required before production durable-memory claim | Camila turn 11 survives Vercel redeploy |
| CK-001 | Split/Promote | AG-UI SSE smoke | Make a real `tasks/copilotkit/CK-001-...md` | HTTP 200 is not proof that streaming works |
| CK-002 | Split/Promote | Typed map/card shared state | Make executable and co-own MAP-001/F46 contracts | Pin click and card focus cannot desync |
| CK-003 | Split/Promote | Frontend tool actions | Minimum map focus or modal tool | Agent can guide Camila's map without silent data mutation |
| CK-004 | Keep | Roberto HITL acceptance | Tie F37/F38 to one browser smoke | Roberto approval is the safety gate before event publish |
| CK-005 | Split/Promote | Playwright pin/card E2E | Add after UI exists; do not call Camila ready before it | Lucía needs proof that cards and pins stay together |
| CK-006 | Defer/Keep soft | Inspector | Optional dev-only | Helps Sofía debug AG-UI events |
| CK-007 | Split/Promote | AG-UI lifecycle validator | Use fixture/dev script with expected event ordering | Prevents frozen sidebar when tool stream ends early |
| CK-008 | Defer | Thread hydration | Depends on PostgresStore | Reloading `/chat` should restore Camila's context later |

## Critical Errors

1. **Build is red.**
   - Evidence: `npm run build` fails because `mdeapp/src/mastra/tools/search-restaurants.ts:4` imports `./search-events.js`; Turbopack cannot resolve it.
   - Required fix: change the import to a resolvable module path and rerun `npm run build`.

2. **Floor is red.**
   - Evidence: `npm run lint` and `npm run floor` fail on `mdeapp/src/mastra/tools/search-rentals.ts:5`, where `rentalSchema` is assigned a value but only used as a type.
   - Required fix: export/use the schema at runtime or convert the type derivation so ESLint is clean.

3. **`check:mastra` is promised but absent.**
   - Evidence: `mdeapp/package.json:5-19` has scripts, but no `check:mastra`; `npm run check:mastra` returns "Missing script".
   - Required fix: MASTRA-005 should add `scripts/check-mastra.mjs` and wire the script.

4. **No `/chat` product surface exists.**
   - Evidence: `mdeapp/src/app` has no `chat` route; root UI is `pingAgent` only at `layout.tsx:32` and `page.tsx:33-35`.
   - Required fix: MAP-001 must create `/chat` before MASTRA-002.

5. **Router code exists but is not user-facing.**
   - Evidence: `routerAgent` is registered in `mdeapp/src/mastra/index.ts:21-33` and defined at `agents/router.ts:7-48`, but no UI provider/useCoAgent points at `routerAgent`.
   - Required fix: MASTRA-002 after MAP-001.

6. **Thread persistence is not durable.**
   - Evidence: `mdeapp/src/mastra/index.ts:34-37` uses `LibSQLStore(:memory:)`; `agent-memory.ts:5-8` uses `file:mastra-agent-memory.db`; `agents/index.ts` uses `file::memory:`.
   - Required fix: MASTRA-003 after MVP demo, before production cutover.

7. **`ai_runs.user_id` is always null.**
   - Evidence: `logging-mastra-agent.ts:50-54` passes `userId: null`.
   - Required fix: MASTRA-004 must read the Supabase session in the route and propagate `userId/resourceId`.

8. **TypeScript build errors are hidden in `next build`.**
   - Evidence: `mdeapp/next.config.ts:6-9` has `typescript.ignoreBuildErrors = true`.
   - Required fix: acceptable short-term only if `npm run typecheck` is a hard gate; long-term remove or scope this when Mastra beta drift is resolved.

9. **Package drift risk is real.**
   - Evidence: `package.json:23,30-33,40` uses `"beta"` for AG-UI/Mastra packages. Lockfile currently resolves `@ag-ui/mastra` to `0.2.1-beta.2`, `@mastra/core` to `1.35.0`, `@mastra/memory` to `1.0.1-alpha.1`, and `mastra` to `1.1.0-alpha.3`.
   - Required fix: MASTRA-005 should fail if lockfile changes without re-verifying APIs.

10. **Service-role boundary needs tighter search-tool discipline.**
    - Evidence: server-only service role helper exists in allowed paths, but search tools also directly fall back to `SUPABASE_SERVICE_ROLE_KEY` from Mastra tool files.
    - Required fix: keep service role out of client bundles and centralize server-only clients; never import service helpers into client components.

## Missing Tasks

The CK backlog is useful, but backlog entries are not enough. Create these as executable task files under `tasks/copilotkit/`:

| New task | Priority | Depends on | Required proof |
|---|---|---|---|
| CK-001 AG-UI SSE smoke test | P0 | MAP-001, MASTRA-002 | one `/chat` turn streams text/tool lifecycle; event snippet or Inspector screenshot |
| CK-002 typed `MapUiState` + pin/card sync contract | P0 | MAP-001 | Zod schema, typed `useCoAgent`, `selectedRentalId`, `resultIds`, state parse tests |
| CK-003 Roberto HITL interrupt/resume acceptance | P0 | F36-F38 | browser smoke: action renders panel, respond resumes, edge persists decision |
| CK-004 frontend tools for map/modal/navigation | P1 | MAP-001 | `focusMapPin` or detail-modal frontend action works from agent call |
| CK-005 thread hydration after PostgresStore | P1 post-MVP | MASTRA-003 | reload/restart restores cards, pins, and thread context |

Also add:

| New task | Why |
|---|---|
| CK-006 AG-UI event lifecycle fixture validator | Prevents fake streaming readiness from plain HTTP 200 |
| CK-007 Playwright pin/card sync E2E | Required before Camila path is production-ready |
| TASK-FIX-001 build/floor red gate | Must run before MAP-001 or Mastra work |
| TASK-FIX-002 docs ordering reconciliation | Prevents builders from following MAP-003/F17 stale route |

## Production Risks

| Risk | Severity | Evidence | Fix |
|---|---|---|---|
| AG-UI event streaming unproven | High | no CK-001 executable task; no `/chat` | CK-001 + CK-007 |
| SSE lifecycle/frozen stream | High | no event-order fixture | lifecycle validator before production |
| Shared-state desync | High | `MapUiState` absent | CK-002 + CK-005 |
| Map pin/card sync | High | no `platform/maps` or map components | MAP-001 + F46 + CK-005 |
| Frontend tools absent | Medium | no `useCopilotAction` in app except none found | CK-003/CK-004 |
| HITL interrupt/resume | High | panel stub only; no `renderAndWaitForResponse` | F37 + CK HITL acceptance |
| Thread persistence | Medium now, high for cutover | LibSQL memory stores | MASTRA-003/CK-008 |
| PostgresStore timing | Medium | docs sometimes call it post-MVP, sometimes prod-ready | explicitly gate production cutover |
| Service-role leakage | High | direct env use in tools; allowed carve-out must be enforced | MASTRA-005 guard + central server-only helper |
| Auth/session mismatch | Medium | `ai_runs.user_id` hardcoded null | MASTRA-004 |
| Fake-ready docs | High | docs say floor green but current floor fails | update docs after gate fixes |
| Package/version drift | High | Mastra packages are `"beta"` | lock + check script |
| Missing Playwright tests | High | no `mdeapp/e2e` | CK-005/F39 |

## Correct Execution Order

This is the corrected order I would use now:

1. **TASK-FIX-001** - fix lint/build/floor red gates.
2. **MAP-001** - contracts, MapContext, vis.gl, `/chat` shell with `pingAgent`.
3. **MASTRA-001** - router/workflow/tool deterministic smoke. Can run before or parallel with MAP-001, but must be green before MASTRA-002.
4. **MASTRA-002** - switch `/chat` to `routerAgent`.
5. **CK-001 + CK-007** - prove AG-UI streaming lifecycle, not only HTTP status.
6. **MAP-002** - grounding + attribution + quota.
7. **CK-002** - typed `MapUiState` + rental selected/result state.
8. **F46** - rental cards + pin sync workflow.
9. **CK-003/CK-004/CK-005** - frontend tools + pin/card E2E.
10. **F33 -> F34 -> F36 -> F37 -> F38** - Roberto host event state, agent, wizard, HITL, approval commit.
11. **EVT-01** - ticket checkout/webhook.
12. **MASTRA-004** - `ai_runs.user_id` + audit coverage. Can start earlier, but logged-in `/chat` proof waits for MASTRA-002.
13. **MASTRA-005** - PR gate. Can run earlier after TASK-FIX-001; keep it before merge.
14. **MASTRA-003** - PostgresStore + CK-008 hydration.
15. evals/admin/production smoke.
16. advanced features only after MVP proof.

Compared with the expected order in the prompt: MAP-001 -> MASTRA-001 -> MASTRA-002 is correct. MAP-002 should happen before production trust claims, but AG-UI smoke should be inserted immediately after MASTRA-002. MASTRA-003 belongs after MVP demo but before production cutover.

## Final Recommendation

**Are the tasks 100% correct?** No. The architecture is directionally right, but the tasks are closer to **76/100** because execution order and readiness claims drift across docs, CK tasks are backlog-only, and current repo gates are red.

**Will the plan succeed?** Yes, if you fix gates first and keep one runtime foundation. The plan fails if builders treat the roadmap as "ready" while build/floor are red or if they skip MAP-001/CK state proof and jump into Roberto/Camila features.

**What must be fixed first?**

1. `npm run lint`, `npm run build`, and `npm run floor`.
2. MAP-001 `/chat` + platform contracts.
3. MASTRA-001 deterministic smoke.
4. MASTRA-002 router on `/chat`.
5. CK-001/CK-002/CK-005 executable tasks for streaming and state sync.

**What should not be built yet?**

- PostgresStore before the first MVP demo, unless production cutover is the immediate goal.
- CopilotKit v2 or any v1/v2 mix.
- LangGraph, CrewAI, PydanticAI, ADK, OpenAI fallback, or a second agent runtime.
- Full F17 legacy rentalAgent port when F46 thin workflow is the MVP path.
- OpenClaw/Hermes hot-path automation.
- Any AI path that silently mutates bookings, payments, tickets, or published events.

**North-star boundary remains correct:**

Supabase owns data. Mastra owns orchestration. CopilotKit owns UI/shared state. Maps owns geo display. Stripe/Supabase edge functions own money, tickets, and check-in authority. AI proposes only.
