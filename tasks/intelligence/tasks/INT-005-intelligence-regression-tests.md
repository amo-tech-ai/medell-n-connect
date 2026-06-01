---
id: INT-005
title: Intelligence regression tests
phase: CORE
priority: P0
status: Not Started
owner_system: [Testing]
personas: [Lucía, Camila]
depends_on: [INT-002, INT-003, INT-004]
unblocks: [INT-006, INT-007, INT-008]
linear_title: "INT-005 — Intelligence regression tests"
linear_labels: [intelligence, core, p0, testing]
implements: []
related_re: []
related_vec: []
commit_ledger: null
---

# INT-005 — Intelligence regression tests

## Problem

No single test suite guards CORE intelligence behavior across parser, routing, and prod smoke.

## User story

As **Lucía**, I need automated proof that CORE intelligence does not regress when we add memory later.

## Example prompts (fixture table)

| Prompt | Must NOT | Must |
|--------|----------|------|
| `list rentals in june 1 to 30 $1000 medellin` | Generic canned clarify | Gemini or search |
| `1BR in Laureles under $80/night` | Agent round-trip | Fast-path API 200 |
| `salsa events this weekend near Provenza` | — | event slots (INT-007 prep) |

## Implementation steps

1. Vitest: parser + fast-path + intent-slots (no live Gemini)
2. Optional: Playwright prod smoke spec `e2e/intelligence/core-rental-hero.spec.ts`
3. Evidence doc: `tasks/testing/evidence/YYYY-MM-DD/int-005-core-regression.md`
4. Wire into `npm run test` subset for CI

## Files likely touched

- `mdeapp/src/lib/__tests__/rental-query-parser.test.ts`
- `mdeapp/src/lib/__tests__/rental-search-fast-path.test.ts`
- `mdeapp/e2e/intelligence/core-rental-hero.spec.ts` (new)
- `tasks/testing/prompts/real-estate/03-rental-agent.md` (reference)

## Data requirements

None.

## RLS / security

N/A.

## Tests

This task **is** the test task.

## Acceptance criteria

- [ ] CI runs new tests on PR touching `rental-query-parser` or fast-path hooks
- [ ] Evidence file with localhost + optional prod URLs
- [ ] `01-rentals-prompt` narrow path still passes

## Failure points

- Flaky prod Playwright (use `data-pin-id` pattern from PR #12)

## Dependencies

INT-002, INT-003, INT-004

## Verify

```bash
cd mdeapp && npm run test && npm run typecheck
```
