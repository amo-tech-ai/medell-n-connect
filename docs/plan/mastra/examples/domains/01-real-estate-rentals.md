---
title: Domain — Real estate / rentals (Camila)
journeys: [J2, J10]
tools: [search-rentals]
workflows: [rental-search-workflow]
phase: 1
---

# Real estate & rentals — mdeai

**Persona:** Camila — apartment seeker in Medellín.  
**Surfaces:** `/rentals` (grid + chat), `/chat` via `conciergeAgent`.

---

## Mastra + CopilotKit stack

| Layer | Implementation |
|-------|----------------|
| Agent | `rentalAgent` (specialist) or `conciergeAgent` (multi-intent) |
| Tool | `search-rentals` — Postgres / mock; output schema = card fields |
| Workflow | `rental-search-workflow` — search → format → rerank |
| Memory | [09-working-memory-schema](../09-working-memory-schema.md) — `lastResults`, `selectedListingId` |
| UI | [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) `search-rentals` |
| Maps | [05-google-maps](05-google-maps.md) — pin per listing `lat`/`lng` |

---

## User stories

1. **Search** — As Camila, I describe neighborhood, budget, and BR count; I see ≤5 cards with real URLs from the tool, not invented links.
2. **Follow-up** — As Camila, I ask “when can I view #2?” and the agent keeps rental context ([working memory schema](../09-working-memory-schema.md)).
3. **Map** — As Camila, pins on the map match tool output IDs ([`tasks/maps/notes.md`](../../../maps/notes.md)).
4. **Redeploy** — As Camila, my thread survives Vercel cold start (J10 / F13).

---

## Journey (J2)

1. Open `/rentals` → `CopilotSidebar` (`rentalAgent` or `conciergeAgent`).
2. Message → `POST /api/copilotkit` → `search-rentals` tool-call.
3. Cards render from `tool-output-available`.
4. MapContext merges pins (MAP-001).
5. Follow-up uses working memory + optional `lastMessages: 20`.

**Acceptance:** No Zillow URLs from model prose; RLS-safe DB path; `gemini-3.5-flash`.

---

## What not to use

| Feature | Why |
|---------|-----|
| RAG on listings | SQL search is source of truth |
| Mastra browser | Scrape Zillow — out of scope / ToS |
| Mastra networks | Router + workflow enough |

**Related:** [03-supervisor-agent](../03-supervisor-agent.md) · [`../../04-user-stories.md`](../../04-user-stories.md) J2
