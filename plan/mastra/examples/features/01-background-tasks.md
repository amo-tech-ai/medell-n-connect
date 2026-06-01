---
title: Feature — Background tasks (mdeai)
source: https://mastra.ai/docs/agents/background-tasks
journeys: [J2, J6]
personas: [Camila, Sofía, Patricia]
phase: 2
requires: F13 Postgres storage on Mastra instance
---

# Background tasks — mdeai

**Official:** [Background tasks](https://mastra.ai/docs/agents/background-tasks) (`@mastra/core@1.29.0+`)

Long-running tool calls return immediately; the LLM keeps talking; results land in memory when done. Use `streamUntilIdle()` when the UI should wait for completion in one SSE session.

---

## mdeai today vs target

| Item | Today | Target |
|------|-------|--------|
| `backgroundTasks.enabled` on `Mastra` | **Off** | On after F13 `PostgresStore` |
| Slow tools | `search-rentals`, `search-events` block stream | Opt-in `backgroundTasks` on tool or `routerAgent` |
| CopilotKit | User sees spinner until tool returns | “Searching…” + optional progress chunks |
| HITL publish | CopilotKit `renderAndWaitForResponse` | Phase 2: bg task + `suspend()` for approval |

**Blocker:** Background tasks require **durable** `Mastra({ storage })` — not `:memory:` LibSQL on the main instance ([storage](08-storage.md)).

---

## Features & use cases

| Capability | mdeai use case |
|------------|----------------|
| Tool-level `backgroundTasks.enabled` | `search-rentals` across 122 Supabase rows + rerank |
| Agent-level `backgroundTasks.tools` | `routerAgent` runs `rental-search-workflow` in background |
| `streamUntilIdle()` | Studio smoke / internal admin panel — not default `/chat` |
| Subagent in background | Future: delegate `evaluationAgent` rerank without blocking concierge reply |
| `suspend()` / `resume()` | Roberto publish approval after ticket webhook (with F13 snapshots) |

---

## User stories

**Camila (J2)**  
As Camila, when I ask for “everything in Laureles under $70,” the concierge replies in under 2s with “I’m searching…” while `search-rentals` runs in the background, then cards appear when the task completes — I don’t stare at a frozen sidebar.

**Sofía (J6)**  
As Sofía, I enable `backgroundTasks` in staging with `globalConcurrency: 10` so three concurrent Playwright smoke tests don’t deadlock the worker pool.

**Patricia**  
As Patricia, when sponsor lead enrichment (Phase 2 OpenClaw) takes minutes, the ops agent acknowledges the request and Patricia gets a thread notification when `onTaskComplete` fires — same pattern as Mastra’s research-tool example.

---

## Journey — J2 background search

1. Camila on `/chat`: “2BR Laureles, furnished, parking.”
2. `conciergeAgent` calls `search-rentals` with `_background: { enabled: true }` (tool opted in).
3. Stream emits `background-task-started` → UI shows status line (CopilotKit generative UI or sidebar text).
4. Agent answers with budget tips while task runs.
5. `background-task-completed` → result in memory → CopilotKit tool card renders listings from **tool output**, not model prose.
6. Camila: “schedule visit for #2” — working memory still has IDs ([09-working-memory-schema](../09-working-memory-schema.md)).

**Acceptance**

- [ ] `Mastra({ storage: PostgresStore })` + `backgroundTasks.enabled: true`
- [ ] Tool opted in at agent or tool layer (not LLM-only `_background`)
- [ ] CopilotKit route does not buffer full history client-side ([07-message-history](07-message-history.md))

---

## CopilotKit notes

- Pattern 1: progress chunks need a **frontend listener** on the AG-UI stream (or stay with synchronous tools until W5 ships bg UX).
- Do **not** use `streamUntilIdle()` on Vercel serverless for 5+ minute jobs without Fluid/queue — prefer Supabase job row + signal ([04-signals](04-signals.md)) for true async.

**Related:** [`../../04-user-stories.md`](../../04-user-stories.md) streaming catalog · [../03-supervisor-agent.md](../03-supervisor-agent.md) · [../domains/01-real-estate-rentals.md](../domains/01-real-estate-rentals.md)
