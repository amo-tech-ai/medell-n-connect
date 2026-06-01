---
title: plan/docs — PRD draft bundle (reference)
date: 2026-05-21
status: Reference only — not canonical for execution
canonical: ../prd/README.md
audit: ./AUDIT-vs-prd-v7-2026-05-21.md
task_lifecycle: .claude/skills/mde-task-lifecycle/planning.md
---

# plan/docs — PRD draft bundle

> **Not 100% correct for execution.** These three files are **expanded narrative drafts** (docs 01–10). **Canonical system:** [`plan/prd/`](../prd/README.md) v7 + [`prd.md`](../../prd.md) + [`roadmap.md`](real-estate/draft/roadmap.md).

## File map

| Draft file | Documents inside | Canonical v7 replacement |
|------------|------------------|---------------------------|
| [`01-prd-plan.md`](./01-prd-plan.md) | 01 Foundation, 02 User flows, 03 Core arch | [`01-executive`](../prd/01-executive-strategy.md), [`02-core`](../prd/02-core-architecture.md), [`03-runtime`](../prd/03-runtime-orchestration.md) |
| [`02-prd-plan.md`](./02-prd-plan.md) | 04 Maps, 05 Events, 06 Rentals | [`04-maps`](../prd/04-maps-grounding.md), [`05-events`](../prd/05-events-ticketing.md), [`06-rentals`](../prd/06-rentals-leads.md) |
| [`03-prd-pland.md`](./03-prd-pland.md) | 07 Contracts, 08 Repo, 09 Ops, 10 Delivery | [`07`–`10`](../prd/07-contracts-schemas.md) |
| [`prd-docs.md`](./prd-docs.md) | Unified synthesis (archived) | [`00-forensic`](../prd/00-forensic-audit.md) |
| [`prd-audit-report.md`](./prd-audit-report.md) | Audit snapshot | [`00-forensic`](../prd/00-forensic-audit.md) |

## Verdict (2026-05-21)

| Lens | Score | Notes |
|------|------:|-------|
| **Strategic alignment** | **88/100** | Philosophy matches v7 (lanes, HITL, map-native) |
| **Execution correctness** | **72/100** | Wrong paths, phases, observability names |
| **Task-lifecycle readiness** | **65/100** | Missing PR-1–5, MAP-001, repo truth, prompt links |
| **Safe to implement from alone?** | **No** | Use `plan/prd/` + `tasks/INDEX.md` |

Full gap list: [`AUDIT-vs-prd-v7-2026-05-21.md`](./AUDIT-vs-prd-v7-2026-05-21.md)

## mde-task-lifecycle (how to use these docs)

| Phase | Use `plan/docs`? | Use instead |
|-------|------------------|-------------|
| **1 Plan** | Background only | `plan/prd/10` + persona + proof in prompt |
| **2 Research** | Pattern ideas | `index.md`, `github/*`, CopilotKit examples |
| **3 Implement** | **Do not** | `plan/prd/07` contracts + module PRD appendix |
| **4 Test** | Done rules in doc 10 §14 | task-verifier anti-fake-done |
| **5 Ship** | — | localhost proof + `npm run floor` |

Prompts must cite **`plan/prd/<nn>-*.md`** section, not `plan/docs/01-prd-plan.md` line numbers.

## What’s missing in `plan/docs` (add via v7, not by expanding drafts)

- [`index.md`](../../index.md) repo grades + when to use CopilotKit/github clones  
- [`plan/diagrams/`](../diagrams/README.md) audited Mermaid (2026-05-21)  
- **PR-1→5** track and **MAP-001** as explicit blocker  
- **`mdeapp/src/platform/contracts/`** not `packages/types/` for Phase 1  
- **`ai_runs`** not `agent_runs` in mdeapp  
- **English UI** Phase 1; Lingui deferred  
- **Repo truth** block (pingAgent only today)  
- Link to [`tasks/INDEX.md`](../../tasks/INDEX.md) F* / MAP-*

## Maintenance

- **Edit for execution:** `plan/prd/01`–`10` only  
- **Edit for narrative/ideas:** `plan/docs/*` optional  
- On conflict, **v7 wins**
