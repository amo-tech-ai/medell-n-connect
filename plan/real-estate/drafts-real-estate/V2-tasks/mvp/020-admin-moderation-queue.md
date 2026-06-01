---
id: RE-020
phase: MVP
implementation_order: 20
implementation_predecessor: "RE-019"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Admin listing moderation queue"
skill:
  - mde-supabase
priority: P0
status: Open
owner: Full-stack
dependencies: [RE-019]
blocks: [RE-021]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Admin

## Scope

Moderation queue + verification badge.

## Global implementation sequence

- **implementation_order:** 20 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-019` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
