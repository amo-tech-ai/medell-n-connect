---
title: Contest Vertical Index
status: Draft
date: 2026-05-25
scope: Future contest/voting/event vertical
---

# Contest Vertical Index

This folder contains the execution docs and task specs for the future Miss Medellin Beauty Contest vertical.

## Read First

| Doc | Purpose |
|---|---|
| [docs/MVP-SCOPE.md](./docs/MVP-SCOPE.md) | Small MVP boundary and Done standard. |
| [docs/00-docs-review.md](./docs/00-docs-review.md) | Review of task-side docs and current red flags. |
| [docs/01-mermaid-diagrams.md](./docs/01-mermaid-diagrams.md) | Mermaid-first architecture, vote, payment, AI, and screen diagrams. |
| [docs/02-github-repos-use.md](./docs/02-github-repos-use.md) | Which GitHub repos to use and how. |
| [docs/03-screens-wireframes.md](./docs/03-screens-wireframes.md) | Required screens and low-fi wireframes. |

## Tasks

**Phase 2+** · Master index: [`tasks/INDEX.md`](../INDEX.md) · **Avg spec:** 84/100

| Order | Task | Spec | Purpose |
|---:|---|-----:|---|
| 0 | [CTEST-000](./tasks/CTEST-000-diagrams-repo-decisions.md) | 82 | Diagrams and repo decisions. |
| 1 | [CTEST-001](./tasks/CTEST-001-supabase-contest-core-schema.md) | 86 | Supabase core schema and RLS. |
| 2 | [CTEST-002](./tasks/CTEST-002-voting-scoring-ledgers.md) | 85 | Vote and judge scoring ledgers. |
| 3 | [CTEST-003](./tasks/CTEST-003-ticket-paid-vote-schema.md) | 87 | Ticket and paid-vote payment-derived state. |
| 4 | [CTEST-004](./tasks/CTEST-004-copilotkit-contest-workspace.md) | 83 | CopilotKit workspace and approval cards. |
| 5 | [CTEST-005](./tasks/CTEST-005-mastra-gemini-workflows.md) | 82 | Mastra + Gemini workflows. |
| 6 | [CTEST-006](./tasks/CTEST-006-screens-wireframes.md) | 78 | Screens and wireframes. |
| 7 | [CTEST-007](./tasks/CTEST-007-playwright-proof-gates.md) | 88 | Playwright proof gates. |

## Boundaries

- Supabase owns contests, contestants, votes, scores, approvals, and audit truth.
- Stripe owns money; Supabase stores webhook-derived payment state.
- AI drafts and recommends; it does not control votes, money, winners, contracts, or bans.
- OpenClaw, Postiz, livestream overlays, and influencer automation are post-MVP.
