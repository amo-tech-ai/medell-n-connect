---
id: RE-015
phase: MVP
implementation_order: 15
implementation_predecessor: "RE-014"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Showing scheduler E2E"
skill:
  - mde-real-estate
  - mde-supabase
priority: P0
status: Open
owner: Full-stack
dependencies: [RE-014]
blocks: [RE-016]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

CRM

## Scope

Schedule showing; notify host; showings row.

## Global implementation sequence

- **implementation_order:** 15 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-014` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
