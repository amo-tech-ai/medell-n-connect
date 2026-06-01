---
id: CTEST-000
title: Contest diagrams, GitHub repo decisions, and scope gate
status: Draft
priority: P0
phase: Contest planning
effort: 2-4h
depends_on: []
skill:
  - mermaid-diagrams
  - mde-task-lifecycle
docs:
  - ../docs/01-mermaid-diagrams.md
  - ../docs/02-github-repos-use.md
  - ../docs/00-docs-review.md
---

# CTEST-000 — Contest Diagrams, Repo Decisions, And Scope Gate

## Goal

Create the implementation starting point for the contest vertical before any database or UI work.

## Build Scope

- Confirm `tasks/contest/docs/01-mermaid-diagrams.md` covers architecture, task sequence, vote flow, Stripe flow, CopilotKit/Mastra approval flow, screens, and post-MVP boundaries.
- Confirm `tasks/contest/docs/02-github-repos-use.md` says which GitHub repos are foundation, reference, post-MVP, or avoid.
- Confirm `tasks/contest/docs/00-docs-review.md` identifies doc correctness and red flags.

## GitHub Repo Decisions

| Repo | Use |
|---|---|
| CopilotKit Mastra starter | Foundation for `mdeapp` Pattern 1 in-process runtime. |
| Helios | Voting integrity concepts only. |
| Hi.Events | Ticket/check-in concepts only; AGPL no copy. |
| OpenStreamPoll | Post-MVP live/OBS overlay reference. |
| TanStack Table | Admin tables. |
| React Email | Sponsor/ticket email templates. |
| Playwright | Proof gates. |
| OpenClaw/Postiz/Trigger.dev/React Scan | Post-MVP only. |

## Acceptance Criteria

- [ ] Diagrams doc exists and has valid Mermaid fences.
- [ ] GitHub repo use plan exists.
- [ ] Docs review exists and records task-side doc gaps.
- [ ] Task index links all core tasks.

## Tests / Proof

- [ ] Static markdown fence check.
- [ ] Local link check for `tasks/contest/docs` and `tasks/contest/tasks`.
- [ ] Evidence file records docs-only runtime N/A.

## Do Not Do

- Do not write app code.
- Do not clone or copy external apps into `mdeapp`.
- Do not move OpenClaw/Postiz/livestream into MVP.
