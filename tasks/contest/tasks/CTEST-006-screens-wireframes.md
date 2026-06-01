---
id: CTEST-006
title: Contest screens, routes, and wireframes
status: Draft
priority: P0
phase: Contest UI
effort: 2-4d
depends_on:
  - CTEST-001
  - CTEST-004
skill:
  - mde-wireframe
  - copilotkit
docs:
  - ../docs/03-screens-wireframes.md
---

# CTEST-006 — Contest Screens, Routes, And Wireframes

## Goal

Turn the contest MVP into a route-by-route screen plan before production UI implementation.

## Required Screens

| Path | Persona | Build purpose |
|---|---|---|
| `/host/contests/new` | Roberto | Contest creation wizard with CopilotKit assistant. |
| `/host/contests` | Roberto | Organizer list and status. |
| `/contests/[slug]` | Fan/Contestant | Public contest hub. |
| `/contests/[slug]/contestants/[id]` | Fan | Contestant profile, vote/share CTAs. |
| `/contests/[slug]/vote` | Fan | Free/paid vote entry and receipt. |
| `/admin/contests` | Patricia | Admin overview table. |
| `/admin/contests/[id]/votes` | Patricia | Vote audit and review. |
| `/admin/contests/[id]/scores` | Judge/Patricia | Judge score entry and score lock. |
| `/sponsors` | Patricia | Sponsor CRM and proposal queue. |
| `/sponsors/proposals/[id]` | Patricia | Sponsor proposal preview and approval. |

## Component Inventory

| Component | Use |
|---|---|
| ContestWizard | Roberto setup flow. |
| ContestDraftCard | CopilotKit-generated draft preview. |
| ContestantProfileCard | Public profile and vote/share CTA. |
| VoteReceiptPanel | Shows receipt hash and status. |
| AdminContestTable | TanStack admin table. |
| VoteAuditTable | Fraud/review table. |
| JudgeScoreGrid | Score entry/lock surface. |
| SponsorPipelineTable | CRM pipeline. |
| SponsorProposalPreview | AI draft + approval controls. |

## Acceptance Criteria

- [ ] Every route has a wireframe state in `03-screens-wireframes.md`.
- [ ] Every route has loading, empty, error, and success state requirements.
- [ ] Mobile behavior is documented.
- [ ] Public pages do not expose private contestant docs.
- [ ] Admin pages require auth/role gates.

## Tests / Proof

- [ ] Route smoke plan for every path.
- [ ] Browser proof plan for primary Roberto, fan, Patricia, and judge flows.
- [ ] Component test plan for critical cards/tables.

## Do Not Do

- Do not implement production React in this task unless explicitly promoted.
- Do not add Spanish UI strings in Phase 1.
- Do not build live overlays in MVP routes.
