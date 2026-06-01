---
id: RE-018
phase: MVP
implementation_order: 18
implementation_predecessor: "RE-017"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "booking-create edge"
skill:
  - mde-supabase
  - mde-stripe
priority: P0
status: Open
owner: Backend
dependencies: [RE-017]
blocks: [RE-019]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Payments

## Scope

Create booking from paid application.

## Global implementation sequence

- **implementation_order:** 18 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-017` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
