---
id: RE-001
phase: CORE
implementation_order: 1
implementation_predecessor: null
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "Seed 25 verified listings"
skill:
  - mde-supabase
  - mde-real-estate
priority: P0
status: Open
owner: Full-stack
dependencies: []
blocks: [RE-002]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

mde-supabase

## Scope

Seed ≥25 `apartments` with photos, pricing, neighborhoods; admin moderation queue ready.

## Global implementation sequence

- **implementation_order:** 1 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** none — first task in spine.

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
