---
title: Streaming — Overview (mdeai)
source: https://mastra.ai/docs/streaming/overview
journeys: [J1, J2]
personas: [Camila, Sofía]
phase: 1
---

# Streaming overview — mdeai

**Official:** [Streaming overview](https://mastra.ai/docs/streaming/overview)

`agent.stream()` emits incremental text; `run.stream()` emits workflow lifecycle events. CopilotKit bridges agent streams to the sidebar over AG-UI.

---

## mdeai paths

| Who | API | Surface |
|-----|-----|---------|
| **Camila** | CopilotKit runtime (internal `.stream`) | `/`, `/chat` |
| **Sofía** | `agent.stream()` / `run.stream()` | Studio, smoke scripts |
| **Lucía** | Same + Playwright | E2E console checks |

**Do not** use `streamLegacy()` — Phase 1 is AI SDK v5+ / Gemini via `@ai-sdk/google`.

**Background tasks:** use `streamUntilIdle()` only when bg tools enabled ([features/01-background-tasks](../features/01-background-tasks.md)).

---

## User stories

**Camila (J2)**  
As Camila, the concierge reply types out live — I know the agent is working before rental cards appear.

**Sofía (J1)**  
As Sofía, `pingAgent` streaming over CopilotKit proves Pattern 1 before we ship `/rentals`.

**Patricia**  
As Patricia, I read `stream.usage` in traces (`mastra_ai_spans`) when a host complains about slow wizard — not in the UI.

---

## Journey — J1 smoke stream

1. `npm run dev` → open `/`.
2. Send “ping” in CopilotSidebar.
3. AG-UI `text-delta` chunks render in UI.
4. Sofía verifies `POST /api/copilotkit` 200 in Network tab.

**Related:** [02-events](02-events.md) · [CopilotKit AG-UI](https://docs.copilotkit.ai/mastra/ag-ui)
