---
title: Mastra platform features — index (mdeai)
project: mdeapp
copilotkit: 1.55.2
updated: 2026-05-21
---

# Mastra platform features — index

Official Mastra **docs** (not v0 examples) mapped to **mdeai personas**, **CopilotKit Pattern 1**, and journeys. **Grades & build order:** [`../../index-mastra.md`](../../index-mastra.md). Journeys: [`../../04-user-stories.md`](../../04-user-stories.md) — these files add **vertical depth** without duplicating every table.

**Production path:** `POST /api/copilotkit` → `getLocalAgentsWithLogging({ mastra })` · Gemini `gemini-3.5-flash` only.

## Memory & storage

| Doc | Source | Journey | Persona | Phase |
|-----|--------|---------|---------|-------|
| [07-message-history](07-message-history.md) | [message-history](https://mastra.ai/docs/memory/message-history) | J2, J10 | Camila, Sofía | 1 partial → F13 |
| [08-storage](08-storage.md) | [storage](https://mastra.ai/docs/memory/storage) | J10 | Sofía, Patricia | F13 |
| [06-memory-processors](06-memory-processors.md) | [memory-processors](https://mastra.ai/docs/memory/memory-processors) | J4 | Patricia, Sofía | 2 |
| [09-semantic-recall](09-semantic-recall.md) | [semantic-recall](https://mastra.ai/docs/memory/semantic-recall) | J4, J11 | Tourist, Roberto | 2 (VDB-02) |
| [10-multi-user-threads](10-multi-user-threads.md) | [multi-user-threads](https://mastra.ai/docs/memory/multi-user-threads) | J5+ | Roberto, co-host | 2+ |
| [11-observational-memory](11-observational-memory.md) | [observational-memory](https://mastra.ai/docs/memory/observational-memory) | J2, J4 | Camila, Tourist | 2 (post-F13 PG) |
| WM schema | [../09-working-memory-schema.md](../09-working-memory-schema.md) | J2–J5 | Camila, Roberto | 1 ✅ |
| WM template | [../08-working-memory-template.md](../08-working-memory-template.md) | — | Patricia | 2 optional |

## Agents & orchestration

| Doc | Source | Journey | Persona | Phase |
|-----|--------|---------|---------|-------|
| [01-background-tasks](01-background-tasks.md) | [background-tasks](https://mastra.ai/docs/agents/background-tasks) | J2, J6 | Camila, Sofía | 2 |
| [02-a2a](02-a2a.md) | [a2a](https://mastra.ai/docs/agents/a2a) | — | Patricia | 3+ |
| [03-acp](03-acp.md) | [acp](https://mastra.ai/docs/agents/acp) | — | Sofía | dev-only |
| [04-signals](04-signals.md) | [signals](https://mastra.ai/docs/agents/signals) | Phase 2 channels | Camila | 2+ (alpha) |
| Supervisor | [../03-supervisor-agent.md](../03-supervisor-agent.md) | J6 | Sofía | 1 partial |

## Workspace & browser

| Doc | Source | Journey | Persona | Phase |
|-----|--------|---------|---------|-------|
| [workspace/](../workspace/00-index.md) | [overview](https://mastra.ai/docs/workspace/overview) + filesystem, sandbox, LSP, skills, search | — | Sofía, Patricia | 2+ / VPS |
| Browser | [../browser/00-index.md](../browser/00-index.md) | J8 | Lucía | 2+ |

## RAG (Phase 2 — host docs)

| Doc | Source | Journey | Persona |
|-----|--------|---------|---------|
| [rag/](../rag/00-index.md) | [overview](https://mastra.ai/docs/rag/overview) + chunking, PgVector, retrieval, GraphRAG | J11 | Roberto, Sofía |

## Evals & quality (W2+)

| Doc | Source | Journey | Persona |
|-----|--------|---------|---------|
| [evals/](../evals/00-index.md) | [overview](https://mastra.ai/docs/evals/overview) + built-in, custom, CI, memory, datasets, experiments | J8, J12 | Lucía, Sofía |

## Domain verticals

| Doc | Domain |
|-----|--------|
| [../domains/00-index.md](../domains/00-index.md) | Rentals, events, restaurants, contests, Maps |

## Suggested additional feature docs (backlog)

| Topic | mdeai why | Suggested file |
|-------|-----------|----------------|
| **Request context** | Tier, `hostId`, locale on `/api/copilotkit` | `12-request-context.md` (see [05-runtime-context](../05-runtime-context.md)) |
| **Guardrails / processors** | PII, injection on concierge | `13-agent-processors.md` |
| **Evals / scorers** | `evaluationAgent` regression | [`../evals/00-index.md`](../evals/00-index.md) ✅ |
| **Workflows** | See [../workflows/00-index.md](../workflows/00-index.md) |
| **Streaming / MCP / Editor** | See [../streaming](../streaming/00-index.md), [../mcp](../mcp/00-index.md), [../editor](../editor/00-index.md) |

## Repo references

| Need | Path |
|------|------|
| Thread memory factory | `mdeapp/src/mastra/lib/agent-memory.ts` |
| Mastra instance storage | `mdeapp/src/mastra/index.ts` |
| CopilotKit runtime | `mdeapp/src/app/api/copilotkit/route.ts` |
| Types ↔ WM sync | `mdeapp/src/lib/types.ts` |
