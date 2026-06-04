---
id: RE-034
phase: ADVANCED
implementation_order: 34
implementation_predecessor: "RE-033"
prd_section: "Real estate PRD v2 (`V2-real-estate.md/prd-real-estateV2.md`) + `roadmap.md`"
title: "OpenClaw sandbox WhatsApp intake"
skill:
  - open-claw
  - mde-real-estate
priority: P1
status: Open
owner: Full-stack
dependencies: [RE-033]
blocks: [RE-035]
estimated_effort: M
percent_complete: 0
mcp_verification:
  - supabase
---

## Objective

OpenClaw

## Scope

Sandbox only; creates lead rows; no auto-send.

## Global implementation sequence

- **implementation_order:** 34 / 40 (see `V2-real-estate.md/000-index.md`).
**Global predecessor:** `RE-033` (must be complete first).

## Acceptance Criteria

- Task requirements met with evidence in PR (tests, SQL, or screenshot per CLAUDE.md Step 5b where UI applies).
- YAML `status` set to Done only with reviewer-visible evidence.

## Verification Commands

- `npm run lint`
- `npm run build`
- `npm run test`

## Evidence Required Before Completion

- Paste test output / row IDs / screenshot into PR or task comment.
