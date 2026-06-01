---
id: RE-040
phase: ADVANCED
implementation_order: 40
implementation_predecessor: "RE-039"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Multi-city expansion playbook"
skill:
  - mde-roadmap
priority: P1
status: Open
owner: Full-stack
dependencies: [RE-039]
blocks: []
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Strategy

## Scope

Doc-only: export Medellín playbook.

## Global implementation sequence

- **implementation_order:** 40 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-039` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
