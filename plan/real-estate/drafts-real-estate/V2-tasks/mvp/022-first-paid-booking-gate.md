---
id: RE-022
phase: MVP
implementation_order: 22
implementation_predecessor: "RE-021"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "First paid booking gate"
skill:
  - mde-stripe
  - mde-task-lifecycle
priority: P0
status: Open
owner: Full-stack
dependencies: [RE-021]
blocks: [RE-023]
estimated_effort: L
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Revenue

## Scope

One production/staging booking; 12% commission evidence.

## Global implementation sequence

- **implementation_order:** 22 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-021` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
