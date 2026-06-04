---
id: RE-014
phase: MVP
implementation_order: 14
implementation_predecessor: "RE-013"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "rental-search-workflow ≤5 cards + pins"
skill:
  - mastra-routing
  - mde-maps
priority: P0
status: Open
owner: Full-stack
dependencies: [RE-013]
blocks: [RE-015]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Mastra

## Scope

Workflow returns ≤5 cards; map pins; smoke green.

## Global implementation sequence

- **implementation_order:** 14 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-013` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
