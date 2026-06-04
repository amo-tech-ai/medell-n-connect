---
title: Streaming — Workflow streaming (mdeai)
source: https://mastra.ai/docs/streaming/workflow-streaming
journeys: [J6]
personas: [Sofía, Camila]
phase: 1 Studio / 2 product UX
---

# Workflow streaming — mdeai

**Official:** [Workflow streaming](https://mastra.ai/docs/streaming/workflow-streaming)

Steps receive `writer` in `execute()` to push custom progress events; agent `textStream` can pipe into `writer`.

---

## mdeai today

| Usage | Status |
|-------|--------|
| Studio `run.stream()` on `rental-search-workflow` | Sofía debug |
| `writer` in search step | **Not yet** — cards appear once at end |
| Pipe `rentalAgent.stream()` into step | Defer |

**Phase 2 UX:** While `search-rentals` runs, stream `{ type: 'custom-event', status: 'searching' }` → CopilotKit status line (“Searching Laureles…”).

---

## User stories

**Sofía (J6)**  
As Sofía, I watch `workflow-step-start` / `step-finish` in Studio for each of the three rental steps before blaming the router.

**Camila (Phase 2)**  
As Camila, I see progress when workflow search takes >3s — `writer` events bridged to sidebar (with [background tasks](../features/01-background-tasks.md)).

---

## Journey — writer in search step (sketch)

```typescript
await writer?.write({ type: 'search-status', neighborhood: 'Laureles' });
const listings = await searchRentals(...);
await writer?.write({ type: 'search-done', count: listings.length });
```

**CopilotKit:** Requires runtime to forward custom workflow events — default Pattern 1 may only expose agent-level stream; validate before shipping.

**Related:** [../workflows/02-agents-and-tools.md](../workflows/02-agents-and-tools.md)
