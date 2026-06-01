---
title: mdeai domain playbooks — Mastra + CopilotKit
project: mdeapp
updated: 2026-05-21
---

# Domain playbooks — index

Vertical **user journeys** tying Mastra agents, tools, workflows, CopilotKit UI, and Maps to mdeai personas. Complements [`../00-index.md`](../00-index.md) and [`../../04-user-stories.md`](../../04-user-stories.md).

| Domain | Doc | Persona | Agent(s) | Surface |
|--------|-----|---------|----------|---------|
| **Real estate / rentals** | [01-real-estate-rentals](01-real-estate-rentals.md) | Camila | `rentalAgent`, `conciergeAgent` | `/rentals`, `/chat` |
| **Events / hosting** | [02-events-hosting](02-events-hosting.md) | Roberto, Andrés | `hostEventAgent`, `eventAgent` | `/host/event/new`, checkout |
| **Restaurants / tourist** | [03-restaurants-tourist](03-restaurants-tourist.md) | Tourist | `conciergeAgent` | `/chat` |
| **Contests** | [04-contests-deferred](04-contests-deferred.md) | — | TBD | **Deferred** post-MVP |
| **Google Maps** | [05-google-maps](05-google-maps.md) | Camila, Tourist | tools + MAP-* | map + chat |

## Suggested additional playbooks (backlog)

| Topic | Why | Suggested doc |
|-------|-----|----------------|
| **Ticket checkout** | Andrés / Miguel Stripe | `06-tickets-stripe.md` |
| **Sponsors / marketplace** | PRD Advanced — frozen | `07-sponsors-deferred.md` |
| **Admin / leads CRM** | Patricia | `08-admin-patricia.md` |
| **Evaluation / quality** | `evaluationAgent` rerank | `09-search-quality.md` |
| **i18n Spanish** | Phase 2 W7+ | `10-i18n-es.md` |

## Cross-cutting docs

| Topic | Path |
|-------|------|
| Memory schema | [../09-working-memory-schema.md](../09-working-memory-schema.md) |
| Memory / storage features | [../features/00-index.md](../features/00-index.md) |
| Workflows + streaming | [../workflows/00-index.md](../workflows/00-index.md) · [../streaming/00-index.md](../streaming/00-index.md) |
| MCP / Maps | [../mcp/01-overview.md](../mcp/01-overview.md) · [05-google-maps](05-google-maps.md) |
| Host policy RAG | [../rag/00-index.md](../rag/00-index.md) · [02-events-hosting](02-events-hosting.md) |
| Maps strategy | [`../../../maps/notes.md`](../../../maps/notes.md) |
| CopilotKit MAP wiring | [`../../../copilotkit/INDEX.md`](../../../copilotkit/INDEX.md) |
