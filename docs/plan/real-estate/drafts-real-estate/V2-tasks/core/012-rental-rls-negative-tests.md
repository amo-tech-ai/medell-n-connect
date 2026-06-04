---
id: RE-012
phase: CORE
implementation_order: 12
implementation_predecessor: "RE-011"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Rental filter + RLS negative tests"
skill:
  - mde-supabase
  - testing
priority: P0
status: Open
owner: Backend
dependencies: [RE-011]
blocks: [RE-013]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Testing

## Scope

Cross-user denial tests for commerce tables.

## Global implementation sequence

- **implementation_order:** 12 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-011` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
