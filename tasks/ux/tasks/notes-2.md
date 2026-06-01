Updated `tasks/ux/tasks` with a forensic snapshot. Full detail: [`STATUS-2026-06-01.md`](tasks/ux/tasks/STATUS-2026-06-01.md).

## Completed on `main` (`5e20f3c`)

| PR | Tasks | Verified |
|----|-------|----------|
| **#21** | UX-015, UX-016, UX-027 | Error bridge + `concierge-run-error` e2e |
| **#22** | B-01…B-10 | Classifier, café seed, event dates, rental reply |
| **#24** | UX-019 | Event fast-path memory guard (L55/L81) |
| **#25** | UX-013 | `venue_anchors` café fallback |
| **#26** | UX-014 | No `writer.custom` on search tools |

**Progress:** active stack **6/24 done (26%)**, +2 in review (UX-036, UX-031).

## Verified working (localhost, 2026-06-01)

- **Events:** `salsa events this weekend` — cards + ≤10 CopilotKit POSTs (`test:e2e:copilot-budget`)
- **Restaurants:** `suggest restaurants medellin` — fast path + cards — **only on PR #28 branch**, not prod
- **P0 e2e:** `npm run test:e2e:p0-focused` — all three specs PASS (~36s) on clean dev
- **CI #28:** lint · test · build PASS

## Errors / blockers / failure points

| # | Issue | Impact |
|---|--------|--------|
| 1 | **#28 not merged** | Prod still shows restaurant **prose only, no cards** |
| 2 | **Vercel preview SSO** | Automated preview smoke **blocked** — merge gate needs human |
| 3 | **Prod CopilotKit POST storm** | `ERR_INSUFFICIENT_RESOURCES` under stress — **not fixed by #28** |
| 4 | **Café silent UI** | 200 after ~19s; bubble missing 60s+ — separate from UX-013 data path |
| 5 | **Maps billing** | `BillingNotEnabledMapError` on browser Maps key |
| 6 | **Full `npm run test:e2e`** | 219 tests — unrelated failures; **do not use** for sign-off |
| 7 | **UX-T-037 not in CI** | Must run `test:e2e:p0-focused` locally before merge |
| 8 | **#27 / #23** | Live-audit e2e on #27 only; Supabase on #23 — **keep out of #28** |

## In review (not Done)

| ID | Where | Status |
|----|-------|--------|
| **UX-036** | [PR #28](https://github.com/amo-tech-ai/mdeapp/pull/28) | In Review — local e2e ✅, preview smoke ❌ |
| **UX-T-037** | Same PR | In Review — same verification |
| **UX-031** | PR **#27** only | `live-audit-verticals.spec.ts` **not on main** |

## Files touched

- [`INDEX.md`](tasks/ux/tasks/INDEX.md) — progress, merge gates G1/G2 ✅, G2b (#28), UX-036 row, implementation order
- [`tests/INDEX.md`](tasks/ux/tasks/tests/INDEX.md) — P0 e2e commands; UX-T-031/037 corrected
- [`UX-036`](tasks/ux/tasks/UX-036-restaurant-search-fast-path.md), [`UX-T-037`](tasks/ux/tasks/tests/UX-T-037-restaurant-fast-path-e2e.md), [`UX-031`](tasks/ux/tasks/UX-031-live-audit-vertical-smoke.md) — status + verification tables

**Next:** preview smoke on #28 → merge → prod `suggest restaurants medellin` must show cards → rebase #27 for UX-031.