---
id: RE-004
phase: CORE
implementation_order: 4
implementation_predecessor: "RE-003"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Rentals edge + UI API contract sync"
skill:
  - mde-supabase
  - gemini
priority: P0
status: Open
owner: Full-stack
dependencies: [RE-003]
blocks: [RE-005]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

API

## Scope

Align rentals edge FilterJson with RentalsIntakeWizard and search results.

## Global implementation sequence

- **implementation_order:** 4 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-003` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
