---
id: CTEST-007
title: Contest Playwright proof gates
status: Draft
priority: P0
phase: Contest testing
effort: 1-2d
depends_on:
  - CTEST-002
  - CTEST-003
  - CTEST-006
skill:
  - testing
  - playwright-cli
docs:
  - ../../../plan/contests/docs/12-task-proof-gates.md
---

# CTEST-007 — Contest Playwright Proof Gates

## Goal

Define the test suite that prevents fake Done status for contest work.

## Required Test Specs

| Spec | Flow |
|---|---|
| `e2e/contest/host-contest-new.spec.ts` | Roberto creates draft and sees approval card. |
| `e2e/contest/public-contest.spec.ts` | Fan views public contest and contestant profile. |
| `e2e/contest/vote-free.spec.ts` | Fan submits valid free vote and receives receipt. |
| `e2e/contest/vote-negative.spec.ts` | Duplicate/closed/invalid token votes fail. |
| `e2e/contest/stripe-paid-vote.spec.ts` | Stripe fixture issues paid vote credit via webhook. |
| `e2e/contest/ticket-qr-checkin.spec.ts` | Paid ticket shows QR; valid/duplicate/invalid scan behavior. |
| `e2e/contest/judge-scoring.spec.ts` | Judge submits score; locked score cannot change. |
| `e2e/contest/sponsor-proposal.spec.ts` | Sponsor proposal draft requires approval before send/export. |

## Done Gate Bundle

```bash
cd mdeapp
npm run test
npm run lint
npm run typecheck
npm run build
npm run verify:console
npm run floor
npx playwright test e2e/contest --project=chromium
```

## Acceptance Criteria

- [ ] Test data factory creates one contest, three contestants, one judge, one sponsor lead, one ticket tier.
- [ ] E2E tests avoid real external charges/messages.
- [ ] Stripe uses fixtures/test mode only.
- [ ] Browser screenshots/traces saved on failure.
- [ ] Evidence files record route, SQL, API, and browser proof.

## Evidence Files

| Task | Evidence path |
|---|---|
| CTEST-001 | `tasks/contest/notes/CTEST-001-evidence.md` |
| CTEST-002 | `tasks/contest/notes/CTEST-002-evidence.md` |
| CTEST-003 | `tasks/contest/notes/CTEST-003-evidence.md` |
| CTEST-004 | `tasks/contest/notes/CTEST-004-evidence.md` |
| CTEST-005 | `tasks/contest/notes/CTEST-005-evidence.md` |
| CTEST-006 | `tasks/contest/notes/CTEST-006-evidence.md` |
| CTEST-007 | `tasks/contest/notes/CTEST-007-evidence.md` |

## Do Not Do

- Do not mark tasks Done based on docs alone if app/source/config changed.
- Do not hit live Stripe, WhatsApp, OpenClaw, or Postiz in E2E.
- Do not skip negative tests for voting, payments, or approvals.
