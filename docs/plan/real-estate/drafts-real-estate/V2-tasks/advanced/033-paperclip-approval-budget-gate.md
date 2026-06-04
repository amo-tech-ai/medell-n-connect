---
id: RE-033
phase: ADVANCED
implementation_order: 33
implementation_predecessor: "RE-032"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Paperclip approval + budget gate"
skill:
  - mde-paperclip
priority: P1
status: Open
owner: Full-stack
dependencies: [RE-032]
blocks: [RE-034]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Governance

## Scope

Approval before landlord-forward; daily budgets.

## Global implementation sequence

- **implementation_order:** 33 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-032` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
