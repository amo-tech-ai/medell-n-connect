---
title: Streaming — Background task streaming (mdeai)
source: https://mastra.ai/docs/streaming/background-task-streaming
journeys: [J2]
personas: [Camila, Patricia]
phase: 2
---

# Background task streaming — mdeai

**Official:** [Background task streaming](https://mastra.ai/docs/streaming/background-task-streaming)

`backgroundTaskManager.stream()` emits `background-task-running`, `completed`, `failed`, etc. `streamUntilIdle()` merges agent + manager chunks.

---

## mdeai use cases

| Stream | Who |
|--------|-----|
| `streamUntilIdle()` on concierge | Phase 2 — wait for slow `search-rentals` then second model turn |
| `bgManager.stream({ threadId })` | Patricia dashboard — all bg tasks for support thread |
| Agent-only stream (today) | Camila `/chat` — synchronous tools |

---

## User stories

**Camila**  
As Camila, I see “Searching…” then the answer updates when the background `search-rentals` task completes — one CopilotKit session via `streamUntilIdle()` on the server.

**Patricia**  
As Patricia, I subscribe to `background-task-failed` for ops alerts when Supabase is down.

---

## Journey

1. Concierge enables bg `search-rentals`.
2. First tokens: “Let me check Laureles…”
3. `background-task-started` → UI spinner.
4. `background-task-completed` → tool result → cards.
5. Model second turn summarizes — stream closes.

**CopilotKit:** Server must use `streamUntilIdle` in route bridge — not default today.

**Related:** [../features/01-background-tasks.md](../features/01-background-tasks.md) · [01-overview](01-overview.md)
