---
id: RE-005
phase: CORE
implementation_order: 5
implementation_predecessor: "RE-004"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Commerce RLS review"
skill:
  - mde-supabase
  - testing
priority: P0
status: Open
owner: Backend
dependencies: [RE-004]
blocks: [RE-006]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

RLS

## Scope

Review RLS on leads, showings, rental_applications, payments.

## Global implementation sequence

- **implementation_order:** 5 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-004` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
