---
title: Feature — Memory processors (mdeai)
source: https://mastra.ai/docs/memory/memory-processors
journeys: [J4]
personas: [Patricia, Sofía, Camila]
phase: 2
---

# Memory processors — mdeai

**Official:** [Memory processors](https://mastra.ai/docs/memory/memory-processors)

When `Memory` is enabled, Mastra auto-adds `MessageHistory`, optional `SemanticRecall`, and `WorkingMemory` processors. Custom processors trim or guard **before/after** the LLM.

**Catalog summary:** [`../../04-user-stories.md`](../../04-user-stories.md) § Feature catalog — Mastra memory → Memory processors.

---

## mdeai today vs target

| Processor | Phase 1 | Target |
|-----------|---------|--------|
| `MessageHistory` | Auto via `lastMessages: 20` | Same on Postgres ([08-storage](08-storage.md)) |
| `WorkingMemory` | Auto via `createThreadMemory` | Same |
| `SemanticRecall` | **Off** | [09-semantic-recall](09-semantic-recall.md) |
| `TokenLimiter` on Memory | **Off** | Trim recalled tool JSON on `/chat` |
| `ToolCallFilter` | **Off** | Drop `search-rentals` blob from history; keep WM IDs |
| Output guardrails | concierge `TokenLimiter` 8192 | Runs **before** memory save per docs |

**Execution order (official):** memory processors run **first** on input; your guardrails **after**. On output: your processors **first**, then memory persistence — abort = nothing saved.

---

## Features & use cases

| Use case | Processor / config |
|----------|-------------------|
| Cost control on long `/chat` | `TokenLimiter` on Memory input |
| Hide 50 listing JSON rows from LLM | `ToolCallFilter` exclude `search-rentals` output |
| PII in recalled turns | Custom processor strip phone/email |
| Manual ordering | Duplicate `MessageHistory` in `inputProcessors` — disables auto-add |
| Injection defense | `PromptInjectionDetector` on **agent** input (concierge today) — not memory |

---

## User stories

**Patricia**  
As Patricia, when Camila’s thread has 20 turns of verbose tool output, `ToolCallFilter` removes old `search-rentals` payloads so Gemini cost stays flat — Camila still has `selectedListingId` in **working memory** ([09-working-memory-schema](../09-working-memory-schema.md)).

**Sofía**  
As Sofía, I add a custom output guardrail that `abort()`s on policy violations **before** `MessageHistory` persists — so toxic turns never land in `mastra_messages`.

**Camila**  
As Camila, I don’t notice processors — I just see coherent answers; Sofía ensures turn 15 doesn’t confuse the model with turn 3’s full JSON.

---

## Journey — trim without losing intent (J4)

1. Tourist asks restaurants → `search-restaurants` fills history.
2. Follow-up: “cheaper than last time” — `SemanticRecall` (Phase 2) + WM `lastRestaurantResults`.
3. `ToolCallFilter` drops turn 1 tool body; WM keeps place IDs.
4. Concierge calls `search-restaurants` again with structured filters.

**CopilotKit:** Client sends **only the new user message** — Mastra processors fetch history ([07-message-history](07-message-history.md)).

**Acceptance**

- [ ] No mutation of input `messages` array in custom processors (official warning)
- [ ] Output guardrail abort → verify empty persistence in Studio

**Related:** [09-semantic-recall](09-semantic-recall.md) · [11-observational-memory](11-observational-memory.md)
