---
title: UX PR-stack remediation tasks (UX-013…035)
updated: 2026-06-01
status_snapshot: STATUS-2026-06-01.md
progress_note: 2026-06-01 session — UX-021 Done, UX-031/030 specs landed, CK POST fix WIP commit
verified: UX-TASKS-VERIFICATION-REPORT.md
linear_view: https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725
linear_import: ../../linear/ux-stack-import-log.json
spec_score: 82%
execution_readiness: 74%
owner: claude
source_audit: ../tests/24-mde-audit.md
source_notes: ../tests/notes-ux.md
skill_router: ../../../index-skills.md
lifecycle: ../../../.claude/skills/mde-task-lifecycle
prod: https://www.mdeai.co
---

# UX PR-stack remediation — tasks/ux/tasks

> **Linear board:** [UX tasks view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) · import log [`ux-stack-import-log.json`](../../linear/ux-stack-import-log.json)
> **Legacy UX-001…010:** [`UX-LEGACY-001-010-CONSOLIDATION.md`](UX-LEGACY-001-010-CONSOLIDATION.md) · parent specs [`../INDEX.md`](../INDEX.md) are archival.

## Status legend

| Dot | Meaning |
|-----|---------|
| 🟢 | **Complete** — shipped + verified (or user-approved Done) |
| 🟡 | **In progress** — partial ship, In Review, or blocked WIP |
| 🔴 | **Failed / blocked / canceled** — merge blocker, prod fail, or explicitly canceled |
| ⚪ | **Not started** — spec ready, zero execution (includes deferred backlog) |

## Progress summary

| Scope | 🟢 | 🟡 | 🔴 | ⚪ | **% complete** |
|-------|---:|---:|---:|---:|---------------:|
| **Active stack** (UX-013…036, rows 1–24 below) | 11 | 3 | 0 | 10 | **46%** (11/24) |
| **With WIP credit** (🟡 = 50%) | 11 | 3 | 0 | 10 | **52%** ((11+1.5)/24) |
| **Full UX program** (+ legacy UX-001…010) | 5 | 2 | 1 | 22 | **17%** (5/30 active; excl. canceled) |

**Latest snapshot:** [`STATUS-2026-06-01.md`](STATUS-2026-06-01.md) — `main` @ `293f55d`+; G2 + **#28** UX-036 merged; UX-022/025/026 + UX-021 on disk.

**WIP (🟡):** [UX-031](UX-031-live-audit-vertical-smoke.md) e2e landed — run `test:e2e:live-audit` · [UX-030](UX-030-card-system-tests.md) `card-unification.spec.ts` · [UX-010](UX-010-CARD-UNIFICATION-STRATEGY.md) epic [SAN-318](https://linear.app/sanjiovani/issue/SAN-318)

**Next up:** Deploy latest `main` → prod 4-query smoke → merge CK POST-storm slice

---

## All tasks (execution order)

| # | | ID | Linear | Title | P | Depends |
|---:|:-:|-----|--------|-------|---|---------|
| 1 | 🟢 | [UX-015](UX-015-ship-pr17-error-bridge-split-scope.md) | [SAN-320](https://linear.app/sanjiovani/issue/SAN-320) | Error bridge — merged **#21** | P0 | — |
| 2 | 🟢 | [UX-013](UX-013-wire-venue-anchors-cafe-fallback.md) | [SAN-427](https://linear.app/sanjiovani/issue/SAN-427) | Wire `venue_anchors` into café fallback | P0 | DATA-035 ✅ |
| 3 | 🟢 | [UX-014](UX-014-agent-tool-card-emit-without-writer.md) | [SAN-428](https://linear.app/sanjiovani/issue/SAN-428) | Agent tool cards without `writer.custom` | P0 | — |
| 4 | 🟢 | [UX-019](UX-019-event-fastpath-classifier-b09.md) | [SAN-429](https://linear.app/sanjiovani/issue/SAN-429) | Event fast-path B-09 — memory guard L55/L81 | P0 | — |
| 5 | 🟢 | [UX-016](UX-016-playwright-run-error-e2e.md) | [SAN-430](https://linear.app/sanjiovani/issue/SAN-430) | Playwright RUN_ERROR → error bubble e2e | P1 | UX-015 |
| 6 | 🟡 | [UX-031](UX-031-live-audit-vertical-smoke.md) | [SAN-431](https://linear.app/sanjiovani/issue/SAN-431) | Live audit 4-query matrix | P1 | UX-019, UX-013 | `live-audit-verticals.spec.ts` on disk |
| 6b | 🟢 | [UX-036](UX-036-restaurant-search-fast-path.md) | — | Restaurant fast path + cards | P0 | UX-014 | Merged **#28** @ `7a5c91e` |
| 7 | ⚪ | [UX-017](UX-017-rebase-pr19-onto-main.md) | [SAN-432](https://linear.app/sanjiovani/issue/SAN-432) | Rebase PR #19 onto main | P1 | UX-015, UX-013, UX-014 |
| 8 | ⚪ | [UX-035](UX-035-rental-parser-prod-verify.md) | [SAN-433](https://linear.app/sanjiovani/issue/SAN-433) | Verify UX-003 rental parser on prod | P1 | UX-003 ✅ |
| 9 | 🟢 | [UX-021](UX-021-card-accessibility-parity.md) | [SAN-434](https://linear.app/sanjiovani/issue/SAN-434) | Card a11y — aria-label, testId, data-result-kind | P0 | — |
| 10 | 🟢 | [UX-022](UX-022-domain-results-wrapper.md) | [SAN-435](https://linear.app/sanjiovani/issue/SAN-435) | DomainResults + restaurant pin/registrar | P0 | UX-014 |
| 11 | 🟢 | [UX-027](UX-027-rental-card-copy-leaks.md) | [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) | RentalCard prod copy leaks | P0 | — |
| 12 | ⚪ | [UX-020](UX-020-card-interaction-props-types.md) | [SAN-436](https://linear.app/sanjiovani/issue/SAN-436) | CardInteractionProps shared types | P2 | UX-022 |
| 13 | ⚪ | [UX-023](UX-023-result-card-shell.md) | [SAN-437](https://linear.app/sanjiovani/issue/SAN-437) | ResultCardShell + primitives | P1 | UX-020 |
| 14 | ⚪ | [UX-024](UX-024-hover-pin-parity.md) | [SAN-438](https://linear.app/sanjiovani/issue/SAN-438) | Hover→pin rental/event | P1 | UX-023 |
| 15 | 🟢 | [UX-025](UX-025-restaurant-card-rich.md) | [SAN-439](https://linear.app/sanjiovani/issue/SAN-439) | RestaurantCard rich | P1 | UX-022 |
| 16 | ⚪ | [UX-028](UX-028-place-result-card-fallback-upgrade.md) | [SAN-440](https://linear.app/sanjiovani/issue/SAN-440) | PlaceResultCard fallback upgrade | P1 | UX-025 |
| 17 | 🟡 | [UX-030](UX-030-card-system-tests.md) | [SAN-441](https://linear.app/sanjiovani/issue/SAN-441) | Pin parity + Playwright per domain | P1 | UX-022, UX-021 | `card-unification.spec.ts` |
| 18 | 🟢 | [UX-026](UX-026-attraction-card-rich.md) | [SAN-442](https://linear.app/sanjiovani/issue/SAN-442) | AttractionCard rich | P2 | UX-025 |
| 19 | ⚪ | [UX-029](UX-029-retire-grounded-place-card.md) | [SAN-443](https://linear.app/sanjiovani/issue/SAN-443) | Retire GroundedPlaceCard orphan | P2 | UX-026 |
| 20 | ⚪ | [UX-032](UX-032-new-chat-reset-thread-and-map.md) | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | New chat reset thread + map | P2 | UX-015 |
| 21 | ⚪ | [UX-033](UX-033-clear-stale-advanced-markers.md) | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Clear stale AdvancedMarkers | P2 | UX-015 |
| 22 | ⚪ | [UX-034](UX-034-prod-synthetic-concierge-monitor.md) | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | Prod synthetic concierge monitor | P2 | UX-015, UX-031 |
| 23 | ⚪ | [UX-018](UX-018-adk-grounding-url-vercel.md) | [SAN-444](https://linear.app/sanjiovani/issue/SAN-444) | ADK_GROUNDING_URL on Vercel (Phase 2) | P2 | ADK deploy |

### Epic & strategy (not counted in stack %)

| | ID | Linear | Title | P |
|:-:|-----|--------|-------|---|
| 🟡 | [UX-010](UX-010-CARD-UNIFICATION-STRATEGY.md) | [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) | Unified result cards — execute via UX-020…030 | P1 |

### Legacy closure (UX-001…010)

| | Legacy | Successor | Linear | Notes |
|:-:|--------|-----------|--------|-------|
| 🟢 | UX-001 | — | [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) | Concierge restored |
| 🟡 | UX-002 | UX-015 | [SAN-320](https://linear.app/sanjiovani/issue/SAN-320) | Error bubble — In Review |
| 🟢 | UX-003 | UX-035 verify | [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) | Parser merged; prod verify open |
| 🔴 | UX-004 | — | [SAN-317](https://linear.app/sanjiovani/issue/SAN-317) | Canceled |
| 🟡 | UX-005 | UX-015 | [SAN-319](https://linear.app/sanjiovani/issue/SAN-319) | Merged into UX-015 |
| ⚪ | UX-006 | UX-032 | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | New chat reset |
| ⚪ | UX-007 | UX-033 | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Stale markers |
| 🟢 | UX-008 | UX-027 | [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) | Save tooltip shipped |
| ⚪ | UX-009 | UX-034 | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | Prod synthetic monitor |
| 🟡 | UX-010 | UX-020…030 | [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) | Card epic — phased |

> **Forensic verification:** [`UX-TASKS-VERIFICATION-REPORT.md`](UX-TASKS-VERIFICATION-REPORT.md) — 82% spec / 74% execution readiness.

---

## Build order (authoritative)

```text
1  UX-015  ✅ merged #21
2  UX-013 ∥ UX-014 ∥ UX-019   ✅ merged #25, #26, #24
5  UX-016  ✅ e2e on main
6b UX-036  ✅ #28 merged — thin restaurant cards + fast path
6  UX-031  ⏳ e2e on PR #27 — rebase after #28
7  UX-017  Rebase PR #19
8  UX-035  Rental parser prod verify
9  UX-022  ✅ DomainResults + pin sync
15 UX-025  ✅ RestaurantCard rich
10 UX-021  Card P0 a11y (before UX-030 lock-in)
11 UX-027  ✅ Done (a8d2e26)
12 UX-020 → UX-024 → UX-023 → UX-025 → UX-026 → UX-029 → UX-030
20–22 UX-032, UX-033, UX-034
23 UX-018  Phase 2 / Backlog
```

---

## Skill routing

**Do not load `copilotkit-develop`** — v2 reference only. Use `copilotkit-integrations` + Mastra example.

| Task | Load first | Then | MCP |
|------|------------|------|-----|
| Any / Done | `mde-task-lifecycle` | `task-verifier`, `testing` | — |
| UX-013 | `mde-supabase` | `mastra`, `testing` | user-supabase |
| UX-014 | `copilotkit-integrations` | `mastra`, `copilotkit-agui` | copilotkit |
| UX-015, UX-017 | `mde-worktree-pr-flow` | `copilotkit`, `testing` | — |
| UX-016, UX-030, UX-031 | `testing` | `playwright-cli`, `copilotkit-debug` | — |
| UX-018 | `mde-vercel` | `gemini` | — |
| UX-020…029 | `copilotkit-integrations` | `shadcn`, `testing` | — |

## Merge gates

| Step | Action | Verify | Status |
|------|--------|--------|--------|
| G1 | Merge **#21** (UX-015) | RUN_ERROR bridge on prod | ✅ **Done** |
| G2 | Merge **#24–#26** (UX-019, UX-013, UX-014) | Events + café fallback + tool envelope on `main` | ✅ **Done** @ `5e20f3c` |
| G2b | Merge **#28** (UX-036 + UX-T-037) | Preview smoke → `suggest restaurants medellin` cards on preview/prod | ✅ **Done** |
| G3 | Merge **#19** after UX-017 | `npm test` + focused e2e | ⚪ Hold |
| G4 | **Hold #20 / #23** | MIS Phase 1b / Supabase track separate | 🔒 |

## Evidence paths

| Artifact | Path |
|----------|------|
| **Test tasks (implement first)** | [`tests/INDEX.md`](tests/INDEX.md) |
| Stack audit | [`../tests/24-mde-audit.md`](../tests/24-mde-audit.md) |
| Card pipeline audit | [`../tests/22-card-audit.md`](../tests/22-card-audit.md) |
| Live browser audit | [`../tests/23-live-audit.md`](../tests/23-live-audit.md) |
| Legacy map | [`UX-LEGACY-001-010-CONSOLIDATION.md`](UX-LEGACY-001-010-CONSOLIDATION.md) |
| Card strategy | [`UX-010-CARD-UNIFICATION-STRATEGY.md`](UX-010-CARD-UNIFICATION-STRATEGY.md) |

## Scope guardrails

- **One concern per PR** — UX-036/037 only in **#28**; do not batch #23, #27, #19.
- **Browser proof on prod** before marking search tasks Done.
- CopilotKit 1.55.2 only, Gemini-only, English-only (CLAUDE.md).
