---
title: Streaming — Events (mdeai)
source: https://mastra.ai/docs/streaming/events
journeys: [J2, J4, J8]
personas: [Lucía, Camila]
phase: 1
---

# Streaming events — mdeai

**Official:** [Streaming events](https://mastra.ai/docs/streaming/events)

Agent stream chunk types: `start`, `text-delta`, `tool-call`, `tool-result`, `step-finish`, `finish`. Workflow: `workflow-start`, `workflow-step-start`, `workflow-step-progress`, etc.

---

## mdeai + CopilotKit

| Event | Camila sees | Lucía checks |
|-------|-------------|--------------|
| `text-delta` | Streaming reply text | — |
| `tool-call` / `tool-result` | Generative UI cards mount | Tool name = `search-rentals` |
| `finish` | Stream ends, usage logged | No console error after finish |

**Rule:** Listing addresses and prices come from **`tool-result` payload** → React card — not from `text-delta` alone ([mdeai-concierge](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering)).

---

## User stories

**Camila (J4)**  
As a Tourist, when the concierge calls `search-restaurants` then `search-attractions`, I see two card batches — each tied to a `tool-result`, not mixed in one markdown blob.

**Lucía (J8)**  
As Lucía, Playwright fails if `tool-call` for `search-rentals` never fires when Camila asks for Laureles apartments.

**Sofía**  
As Sofía, Studio workflow stream shows `workflow-step-progress` during `.foreach()` batch jobs (future enrichment).

---

## Journey — J2 tool card stream

1. User: “2BR Laureles under $80.”
2. Stream: `tool-call` `search-rentals`.
3. Stream: `tool-result` with `cards[]`.
4. CopilotKit renders `<RentalCard />` per item.
5. `text-delta` may add short intro — must not invent listing URLs.

**Related:** [03-workflow-streaming](03-workflow-streaming.md) · [../workflows/01-control-flow.md](../workflows/01-control-flow.md)
