---
id: RE-039
phase: ADVANCED
implementation_order: 39
implementation_predecessor: "RE-038"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Concurrent lead / checkout load test"
skill:
  - mde-testing
priority: P1
status: Open
owner: Full-stack
dependencies: [RE-038]
blocks: [RE-040]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Perf

## Scope

Load test checkout path; document limits.

## Global implementation sequence

- **implementation_order:** 39 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-038` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
