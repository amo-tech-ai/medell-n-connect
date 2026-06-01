---
id: RE-029
phase: POST_MVP
implementation_order: 29
implementation_predecessor: "RE-028"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Hermes offline ranking job"
skill:
  - mde-real-estate
priority: P1
status: Open
owner: Full-stack
dependencies: [RE-028]
blocks: [RE-030]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Hermes

## Scope

Batch rank job; read-only Postgres.

## Global implementation sequence

- **implementation_order:** 29 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-028` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
