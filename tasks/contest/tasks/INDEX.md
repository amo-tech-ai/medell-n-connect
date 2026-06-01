---
title: Contest Task Index
status: Draft
date: 2026-05-25
scope: Future contest vertical
docs:
  - ../docs/MVP-SCOPE.md
  - ../docs/01-mermaid-diagrams.md
  - ../docs/02-github-repos-use.md
  - ../docs/03-screens-wireframes.md
---

# Contest Task Index

This is the core task pack for the Miss Medellin Beauty Contest vertical. It is intentionally MVP-first and approval-gated.

## Task Order

**Phase 2+ only** — `/contests` frozen in Phase 1 ([`tasks/INDEX.md`](../../INDEX.md)). **Spec /100** = spec readiness, not shipped.

| Order | ID | Task | Status | Spec | Depends On | Primary skill | Proof |
|---:|---|---|---:|---|---|---|---|
| 0 | [CTEST-000](./CTEST-000-diagrams-repo-decisions.md) | Diagrams, repo decisions, and scope gate | Draft | 82 | Existing docs | mermaid-diagrams | Mermaid + scope gate |
| 1 | [CTEST-001](./CTEST-001-supabase-contest-core-schema.md) | Supabase contest core schema | Draft | 86 | CTEST-000 | mde-supabase | SQL/RLS proof |
| 2 | [CTEST-002](./CTEST-002-voting-scoring-ledgers.md) | Voting and judge scoring ledgers | Draft | 85 | CTEST-001 | mde-supabase | Ledger/RPC/negative tests |
| 3 | [CTEST-003](./CTEST-003-ticket-paid-vote-schema.md) | Tickets and paid-vote payment-derived schema | Draft | 87 | CTEST-001, CTEST-002 | mde-supabase, mde-stripe | Stripe fixture + SQL proof |
| 4 | [CTEST-004](./CTEST-004-copilotkit-contest-workspace.md) | CopilotKit contest workspace and approval cards | Draft | 83 | CTEST-001 | copilotkit, copilotkit-agui | Route + AG-UI card proof |
| 5 | [CTEST-005](./CTEST-005-mastra-gemini-workflows.md) | Mastra + Gemini contest workflows | Draft | 82 | CTEST-002, CTEST-004 | mastra, gemini | Workflow replay + ai_runs proof |
| 6 | [CTEST-006](./CTEST-006-screens-wireframes.md) | Contest screens and wireframes | Draft | 78 | CTEST-001, CTEST-004 | shadcn, wireframe docs | Browser route proof |
| 7 | [CTEST-007](./CTEST-007-playwright-proof-gates.md) | Playwright proof gates | Draft | 88 | CTEST-002, CTEST-003, CTEST-006 | testing, playwright-cli | E2E pass + evidence files |

**Pack average:** 84/100

## MVP Cut Line

| Included | Deferred |
|---|---|
| Contest setup, contestants, voting, paid votes, tickets, QR check-in, judge scoring, sponsor proposal drafts, WhatsApp share/reminder links | OpenClaw daily scraping, Postiz automated publishing, livestream overlays, influencer automation, autonomous outreach |

## Required Screens

| Path | Task | Persona |
|---|---|---|
| `/host/contests/new` | CTEST-006 | Roberto |
| `/host/contests` | CTEST-006 | Roberto |
| `/contests/[slug]` | CTEST-006 | Fan / contestant |
| `/contests/[slug]/contestants/[id]` | CTEST-006 | Fan |
| `/contests/[slug]/vote` | CTEST-006 | Fan |
| `/admin/contests` | CTEST-006 | Patricia |
| `/admin/contests/[id]/votes` | CTEST-006 | Patricia |
| `/admin/contests/[id]/scores` | CTEST-006 | Judge / Patricia |
| `/sponsors` | CTEST-006 | Patricia |
| `/sponsors/proposals/[id]` | CTEST-006 | Patricia |

## Done Rule

No task moves to `Done` without route/API/SQL/browser proof matching its surface. Docs-only tasks may mark runtime proof N/A only when they touch zero source/config/hook files and record that fact in evidence.
