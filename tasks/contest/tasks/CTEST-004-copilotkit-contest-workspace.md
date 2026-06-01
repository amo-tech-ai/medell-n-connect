---
id: CTEST-004
title: CopilotKit contest workspace and approval cards
status: Draft
priority: P0
phase: Contest AI UI
effort: 1-2d
depends_on:
  - CTEST-001
skill:
  - copilotkit
  - copilotkit-agui
  - copilotkit-develop
  - copilotkit-integrations
docs:
  - ../docs/01-mermaid-diagrams.md
  - ../docs/03-screens-wireframes.md
  - /home/sk/mdeai/.claude/skills/copilotkit-integrations/references/integrations/mastra.md
---

# CTEST-004 — CopilotKit Contest Workspace And Approval Cards

## Goal

Create the contest AI workspace using the mdeapp-approved CopilotKit Pattern 1 in-process Mastra architecture.

## mdeapp CopilotKit Rule

Use CopilotKit `1.55.2` Phase 1 APIs:

| Need | Use |
|---|---|
| Shared agent state | `useCoAgent` |
| Frontend/action card rendering | `useCopilotAction` |
| Tool render card | `useCopilotAction({ available: "disabled", render })` |
| HITL approval | `renderAndWaitForResponse` |
| Runtime | `/api/copilotkit` with `MastraAgent.getLocalAgents({ mastra })` |

Do not mix v2 APIs into the same surface.

## Workspace Cards

| Card | Purpose |
|---|---|
| ContestDraftCard | Shows contest basics, rounds, venue, voting windows. |
| ContestantReadinessCard | Shows missing contestant profile/media/compliance fields. |
| VotingIntegrityCard | Shows read-only anomaly summaries. |
| SponsorProposalCard | Shows draft package and proposal copy. |
| PublishApprovalCard | Requires Patricia/Roberto approval before publish. |
| WinnerSnapshotCard | Displays locked SQL snapshot; no AI winner control. |

## Screens

- `/host/contests/new`
- `/host/contests`
- `/admin/contests`
- `/sponsors`

## Acceptance Criteria

- [ ] Contest workspace route renders.
- [ ] CopilotKit provider uses relative `/api/copilotkit`.
- [ ] Tool/card names match Mastra tool ids.
- [ ] Publish card requires explicit approval.
- [ ] Voting/winner cards are display-only from deterministic data.

## Tests / Proof

- [ ] Route proof for `/host/contests/new`.
- [ ] API proof for `POST /api/copilotkit` expected response.
- [ ] Browser proof for approval card render.
- [ ] Negative proof: no card writes vote/payment/winner truth directly.

## Do Not Do

- Do not self-host CopilotKit for MVP.
- Do not add custom AG-UI backend unless Pattern 1 cannot support the workflow.
- Do not import v2 CopilotKit hooks in mdeapp Phase 1 surfaces.
