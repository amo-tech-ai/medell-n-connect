---
title: Domain — Events & hosting (Roberto)
journeys: [J3, J5, J11]
tools: [search-events, set_event_basics, preview_and_publish]
workflows: [event-discovery-workflow]
phase: 1-W3+
---

# Events & hosting — mdeai

**Persona:** Roberto — event host. Andrés/Miguel — ticket buyers (minimal Mastra).  
**Surfaces:** `/host/event/new`, `/host/events`, public event pages, Stripe checkout.

---

## Mastra + CopilotKit stack

| Layer | W1 | W3+ |
|-------|----|-----|
| Agent | `eventAgent` (discover) | `hostEventAgent` (wizard) |
| Tools | `search-events` | `set_event_basics`, `set_venue`, `add_ticket_tier`, `preview_and_publish` |
| Memory | `EventDraftState` Zod | Same + [shared state write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write) |
| HITL | — | `renderAndWaitForResponse` publish ([J5](../../04-user-stories.md)) |
| RAG | — | J11 host policy PDFs (Phase 2) |
| Vision | — | [04-image-analysis](../04-image-analysis.md) flyer upload |

---

## User stories

1. **Discover** — As Camila browsing events, `search-events` returns weekend cards (J3).
2. **Create** — As Roberto, I describe my salsa night; wizard fields fill from agent tools (J5).
3. **Publish gate** — As Roberto, I must approve publish before `events` row is written (HITL).
4. **Tickets** — As Andrés, checkout is Stripe + edge fn — **not** CopilotKit (isolation).

---

## Journey — Roberto host (J5)

1. `/host/event/new` → `hostEventAgent`.
2. Natural language → tools update `EventDraftState`.
3. Frontend tools adjust date/image pickers.
4. `preview_and_publish` → approval UI → `respond({ approved: true })`.
5. Server action / edge writes Supabase with service role (not browser).

**Acceptance:** Triple schema sync; no inventory mutation from chat alone.

---

## Workflow path (router)

`routerAgent` → `event-discovery-workflow` for “events this weekend” headless quality (J6).

**Related:** [02-system-prompt](../02-system-prompt.md) · [domains/04-contests](04-contests-deferred.md) (separate vertical later)
