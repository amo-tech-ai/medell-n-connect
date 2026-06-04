---
id: RE-011
phase: CORE
implementation_order: 11
implementation_predecessor: "RE-010"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Intake FilterJson ↔ DB query parity"
skill:
  - testing
  - mde-real-estate
priority: P0
status: Open
owner: Full-stack
dependencies: [RE-010]
blocks: [RE-012]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Search

## Scope

Vitest proving filter_json maps to SQL/vector query.

## Global implementation sequence

- **implementation_order:** 11 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-010` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
