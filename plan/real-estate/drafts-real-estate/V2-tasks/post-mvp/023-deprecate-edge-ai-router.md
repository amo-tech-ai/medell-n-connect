---
id: RE-023
phase: POST_MVP
implementation_order: 23
implementation_predecessor: "RE-022"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Deprecate edge ai-router (rentals)"
skill:
  - mastra-routing
priority: P1
status: Open
owner: Backend
dependencies: [RE-022]
blocks: [RE-024]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Mastra

## Scope

Shadow compare then disable edge router for rental intents.

## Global implementation sequence

- **implementation_order:** 23 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-022` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
