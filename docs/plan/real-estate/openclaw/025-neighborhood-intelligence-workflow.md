---
id: RE-025
phase: POST_MVP
implementation_order: 25
implementation_predecessor: "RE-024"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "neighborhood-intelligence workflow"
skill:
  - mde-maps
  - mastra
priority: P1
status: Open
owner: Full-stack
dependencies: [RE-024]
blocks: [RE-026]
estimated_effort: L
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Maps

## Scope

New workflow: scores + narrative.

## Global implementation sequence

- **implementation_order:** 25 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-024` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
