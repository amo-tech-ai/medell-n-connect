---
id: RE-017
phase: MVP
implementation_order: 17
implementation_predecessor: "RE-016"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Stripe rental webhook + idempotency"
skill:
  - mde-stripe
  - mde-supabase
priority: P0
status: Open
owner: Backend
dependencies: [RE-016]
blocks: [RE-018]
estimated_effort: L
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Payments

## Scope

Webhook + ledger; no double booking.

## Global implementation sequence

- **implementation_order:** 17 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-016` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
