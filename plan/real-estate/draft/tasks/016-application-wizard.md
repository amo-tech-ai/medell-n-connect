---
id: RE-016
phase: MVP
implementation_order: 16
implementation_predecessor: "RE-015"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Application wizard + landlord summary"
skill:
  - mde-real-estate
  - gemini
priority: P0
status: Open
owner: Full-stack
dependencies: [RE-015]
blocks: [RE-017]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

CRM

## Scope

4-step application; AI summary for landlord (propose).

## Global implementation sequence

- **implementation_order:** 16 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-015` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
