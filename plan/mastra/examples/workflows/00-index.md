---
title: Mastra workflows — index (mdeai)
project: mdeapp
updated: 2026-05-21
---

# Workflows — index

Official [workflow docs](https://mastra.ai/docs/workflows/overview) mapped to **mdeai** agents, CopilotKit, and journeys. Catalog summary: [`../../04-user-stories.md`](../../04-user-stories.md) § Feature catalog — Mastra workflows.

**Registered today:** `rental-search-workflow`, `event-discovery-workflow`, `concierge-routing-workflow` in `mdeapp/src/mastra/workflows/`.

| Doc | Source | Journey | Persona | Phase |
|-----|--------|---------|---------|-------|
| [01-control-flow](01-control-flow.md) | [control-flow](https://mastra.ai/docs/workflows/control-flow) | J2, J6 | Sofía, Camila | 1 ✅ |
| [02-agents-and-tools](02-agents-and-tools.md) | [agents-and-tools](https://mastra.ai/docs/workflows/agents-and-tools) | J2, J6 | Sofía | 1 ✅ |
| [03-snapshots](03-snapshots.md) | [snapshots](https://mastra.ai/docs/workflows/snapshots) | J5, J10 | Roberto, Sofía | F13 |
| [04-suspend-and-resume](04-suspend-and-resume.md) | [suspend-and-resume](https://mastra.ai/docs/workflows/suspend-and-resume) | J5 | Roberto | 1 CK / 2 Mastra |
| [05-human-in-the-loop](05-human-in-the-loop.md) | [human-in-the-loop](https://mastra.ai/docs/workflows/human-in-the-loop) | J5 | Roberto | 1 ✅ CK |
| [06-time-travel](06-time-travel.md) | [time-travel](https://mastra.ai/docs/workflows/time-travel) | J6 | Sofía | 2 |
| [07-error-handling](07-error-handling.md) | [error-handling](https://mastra.ai/docs/workflows/error-handling) | J6, J7 | Sofía, Patricia | 1 partial |
| [08-scheduled-workflows](08-scheduled-workflows.md) | [scheduled-workflows](https://mastra.ai/docs/workflows/scheduled-workflows) | — | Patricia | 2+ VPS |

## CopilotKit vs Mastra workflows

| User action | What runs |
|-------------|-----------|
| Camila types in `/chat` | `conciergeAgent` or `routerAgent` → may **invoke** workflow |
| Roberto publishes event | **CopilotKit** `renderAndWaitForResponse` (Phase 1) |
| Sofía runs pipeline in Studio | `workflow.createRun().stream()` |

Product chat does **not** call `workflow.resume()` from the browser — server routes only.

## Domain playbooks

| Vertical | Doc |
|----------|-----|
| Rentals | [../domains/01-real-estate-rentals.md](../domains/01-real-estate-rentals.md) |
| Events / HITL | [../domains/02-events-hosting.md](../domains/02-events-hosting.md) |

## Backlog docs

| Topic | File |
|-------|------|
| Workflow state / progress UI | `09-workflow-state.md` |
| Nested workflows | `10-nested-workflows.md` |
