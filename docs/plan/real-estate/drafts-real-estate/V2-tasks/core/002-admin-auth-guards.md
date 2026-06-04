---
id: RE-002
phase: CORE
implementation_order: 2
implementation_predecessor: "RE-001"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Admin auth guards on /admin/*"
skill:
  - mde-supabase
  - testing
priority: P0
status: Open
owner: Full-stack
dependencies: [RE-001]
blocks: [RE-003]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

Security

## Scope

Audit and fix useAdminAuth on all admin routes.

## Global implementation sequence

- **implementation_order:** 2 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-001` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
