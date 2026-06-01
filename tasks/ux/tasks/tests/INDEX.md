---
title: UX stack — test tasks (implement before / with feature tasks)
updated: 2026-06-01
status_snapshot: ../STATUS-2026-06-01.md
parent: ../INDEX.md
audits: ../../tests/23-live-audit.md · ../../tests/24-mde-audit.md · ../../tests/25-ux-stack-test-plan-and-prompt.md
evidence_root: ../../../testing/evidence/
run_from: mdeapp/
---

# UX test tasks — `tasks/ux/tasks/tests/`

Executable test specs. **Implement these before or in the same PR** as the linked feature task. Evidence → `tasks/testing/evidence/<date>/`.

## Execution order

| # | Test task | Output file(s) | Blocks feature | Priority |
|---|-----------|------------------|----------------|----------|
| 0 | [UX-T-CK](UX-T-CK-copilotkit-mvp-tests.md) | `e2e/copilotkit-mvp.spec.ts` + smoke scripts | G1, CopilotKit CI | **P0** |
| 0b | [UX-T-MA](UX-T-MA-mastra-mvp-tests.md) | `src/mastra/**/__tests__/**` + workflow tests | G2, Mastra CI | **P0** |
| 0c | [UX-T-SB](UX-T-SB-supabase-mvp-tests.md) | `src/lib/supabase/__tests__/**` + verify scripts | G2, Supabase CI | **P0** |
| 0d | [UX-T-GM](UX-T-GM-maps-adk-grounding-mvp-tests.md) | Maps/ADK Vitest + smoke scripts | G2, Maps CI | **P0** |
| 1 | [UX-T-016](UX-T-016-concierge-run-error.spec.md) | `mdeapp/e2e/concierge-run-error.spec.ts` | UX-015, UX-016 | P0 |
| 2 | [UX-T-031](UX-T-031-live-audit-verticals.spec.md) | `mdeapp/e2e/live-audit-verticals.spec.ts` | UX-031, G2 gate | P0 |
| 3 | [UX-T-019](UX-T-019-event-memory-guard.md) | extend `event-search-fast-path.test.ts` | UX-019 | P0 |
| 4 | [UX-T-013](UX-T-013-cafe-fallback-vitest.md) | `search-grounded-places-cafe-fallback.test.ts` | UX-013 | P0 |
| 5 | [UX-T-014](UX-T-014-agent-card-emit-vitest.md) | extend card emit tests | UX-014 | P0 |
| 5b | [UX-T-037](UX-T-037-restaurant-fast-path-e2e.md) | `copilotkit-request-budget` + `restaurant-card-fast-path` | UX-036, CK-P0-07 | **P0** |
| 6 | [UX-T-035](UX-T-035-prod-rental-parser.spec.md) | `e2e/prod-rental-parser.spec.ts` (optional `@prod`) | UX-035 | P1 |
| 6b | [UX-T-027](UX-T-027-rental-card-copy-regression.md) | `rental-card-copy.test.tsx` | UX-027 ✅ | P0 |
| 7 | [UX-T-030](UX-T-030-card-unification.spec.md) | `e2e/card-unification.spec.ts` | UX-030 | P1 |
| 8 | [UX-T-CU](UX-T-CU-card-unification-mvp-tests.md) | card Vitest + dedup e2e matrix | UX-010, G3 | **P0** |
| — | [UX-T-RW](UX-T-RW-real-world-catalog.md) | backlog scenarios | post-UX-031 | P1–P2 |
| — | [AGENT-PROMPT](AGENT-PROMPT-chrome-playwright.md) | — | agent session | — |
| — | [UX-T-CK § Agent prompt](UX-T-CK-copilotkit-mvp-tests.md#agent-prompt--copilotkit-test-implementation) | CopilotKit MVP matrix | agent session | — |
| — | [UX-T-MA § Agent prompt](UX-T-MA-mastra-mvp-tests.md#agent-prompt--mastra-test-implementation) | Mastra MVP matrix | agent session | — |
| — | [UX-T-SB § Agent prompt](UX-T-SB-supabase-mvp-tests.md#agent-prompt--supabase-test-implementation) | Supabase MVP matrix | agent session | — |
| — | [UX-T-GM § Agent prompt](UX-T-GM-maps-adk-grounding-mvp-tests.md#agent-prompt--maps--adk--grounding-test-implementation) | Maps/ADK MVP matrix | agent session | — |
| — | [UX-T-CU § Agent prompt](UX-T-CU-card-unification-mvp-tests.md#agent-prompt--card-unification-test-implementation) | Card unification matrix | agent session | — |

## Commands (after specs land)

```bash
cd mdeapp && npm run dev
npm run test:e2e:p0-focused              # budget + restaurant-fast-path + run-error (preferred)
# or individually:
npm run test:e2e:copilot-budget
npm run test:e2e:restaurant-fast-path    # requires UX-036 (#28)
npm run test:e2e:concierge-run-error
# Do NOT run bare `npm run test:e2e` (219 tests) — see mdeapp/e2e/README.md
```

## Chrome DevTools MCP

Exploratory pass **after** Playwright green — see [AGENT-PROMPT-chrome-playwright.md](AGENT-PROMPT-chrome-playwright.md) § MCP checklist.

## Status legend

| Dot | Meaning |
|-----|---------|
| ⚪ | Spec written, code not implemented |
| 🟡 | Spec partially implemented |
| 🟢 | Spec passes locally + evidence captured |

| Test task | Status |
|-----------|--------|
| UX-T-CK | ⚪ |
| UX-T-MA | 🟡 partial (P0 Vitest; UX-014 writer guard ✅) |
| UX-T-SB | 🟡 partial (static tests; live gated) |
| UX-T-GM | 🟡 partial (Vitest + smokes; venue_anchors fallback ✅) |
| UX-T-016 | 🟢 |
| UX-T-031 | 🟡 (spec on PR #27 only; not on main) |
| UX-T-013 | 🟢 |
| UX-T-014 | 🟢 |
| UX-T-037 | 🟡 (in PR #28; `test:e2e:p0-focused` PASS locally 2026-06-01; not in CI) |
| UX-T-019 | 🟢 |
| UX-T-035 | ⚪ |
| UX-T-CU | 🟡 partial (Vitest; Playwright card-unification pending) |
| UX-T-027 | 🟢 |
| UX-T-030 | ⚪ |
