---
title: Evals — Evals with memory (mdeai)
source: https://mastra.ai/docs/evals/evals-with-memory
journeys: [J10, J12]
personas: [Sofía]
phase: 2
---

# Evals with memory — mdeai

## At a glance

| | |
|---|---|
| **What it is** | Agents with **thread-scoped memory** (or observational memory) need `memory: { thread, resource }` when evals call `generate`. |
| **Purpose** | Test recall (“what was my budget?”) and multi-turn concierge behavior in CI — not single-shot only. |
| **Goals** | Avoid `ObservationalMemory requires threadId` failures; mirror production F13 thread/resource wiring. |
| **What it does** | `runEvals` + `targetOptions.memory`; per-item threads; or dataset `metadata` + inline `task`. |
| **Benefits** | Validates J10 persistence; reproduces Camila multi-turn scripts in evals. |
| **mdeai** | After F13 Postgres + optional OM on `conciergeAgent`. |

**Official:** [Evals with memory](https://mastra.ai/docs/evals/evals-with-memory)

---

## Three patterns (mdeai)

| Pattern | When |
|---------|------|
| **Shared thread** | One conversation across all items in a single `runEvals` call |
| **Per-item thread** | Loop `runEvals` with `randomUUID()` thread per item (common CI) |
| **Dataset + inline task** | `metadata.threadId` passed to `agent.generate` in experiment |

**Anti-pattern:** Putting memory only in `RequestContext` — thread must be in `args.memory`.

---

## User stories

**Sofía (J10)**  
As Sofía, eval “turn 1: budget $80” / “turn 2: show #2 again” uses the **same** `thread` + `resource` so observational memory can pass recall tests.

**Camila**  
As Camila, production `/chat` passes `thread` + `resource` from CopilotKit session — evals must do the same or they lie about prod behavior.

**Lucía**  
As Lucía, per-item threads in CI avoid order-dependent flakes when tests run in parallel.

---

## Journey — multi-turn recall eval

```typescript
const threadId = 'eval-recall-thread'
const resourceId = 'ci-user'
await memory.createThread({ threadId, resourceId })

const result = await runEvals({
  target: conciergeAgent,
  scorers: [recallScorer],
  targetOptions: { memory: { thread: threadId, resource: resourceId } },
  data: [
    { input: '2BR Laureles under $80' },
    { input: 'What was my max budget?', groundTruth: '80' },
  ],
})
```

**CopilotKit:** Runtime must forward same IDs from Supabase user + session — eval proves the contract.

**Related:** [../features/07-message-history.md](../features/07-message-history.md) · [../features/11-observational-memory.md](../features/11-observational-memory.md)
