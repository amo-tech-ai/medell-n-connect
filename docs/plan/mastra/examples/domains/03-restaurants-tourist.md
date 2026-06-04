---
title: Domain — Restaurants & tourist concierge
journeys: [J4, J9]
tools: [search-restaurants, search-attractions]
phase: 1-W6
---

# Restaurants & tourist — mdeai

**Persona:** Tourist (and locals using concierge for “things to do”).  
**Surface:** `/chat` — default `conciergeAgent` (W6).

---

## Mastra + CopilotKit stack

| Layer | Implementation |
|-------|----------------|
| Agent | `conciergeAgent` — 4 tools, intent scoring in instructions |
| Tools | `search-restaurants`, `search-attractions` (Supabase + fallbacks) |
| Phase 2 | Grounding Lite MCP (J9 / MAP-002) |
| Maps | Restaurant/attraction pins — `placeId`, field mask |
| Memory | `lastIntent`, `lastRestaurantResults` in Zod schema |
| Processors | `PromptInjectionDetector`, `TokenLimiter(8192)` |

---

## User stories

1. **Restaurants** — As a Tourist, I ask for romantic dinner near Poblado; cards show names/URLs from `search-restaurants`, not hallucinations.
2. **Attractions** — As a Tourist, I ask for walking tours; `search-attractions` returns structured cards.
3. **Intent stickiness** — Follow-up “cheaper?” stays in restaurant context (`lastIntent`).
4. **Grounding** — As a Tourist (J9), live Places data via MCP when MAP-002 lands.
5. **vs rentals** — Concierge must not call `search-rentals` when I only asked about food.

---

## Journey (J4)

1. `/chat` with `conciergeAgent`.
2. Classify message → restaurant tool.
3. AG-UI tool stream → generative cards.
4. Optional map pins (MAP-001).
5. CopilotKit [agent-app-context](https://docs.copilotkit.ai/mastra/agent-app-context) `tourist` mode (future).

**Acceptance:** `X-Goog-FieldMask` on every Places/Grounding call; English Phase 1 UI.

---

## CopilotKit vs Mastra browser

Prefer **MCP + SQL** over [AgentBrowser](../browser/02-agent-browser.md) for menu/venue data. Browser only as Phase 2 fallback for odd SPAs.

**Related:** [05-google-maps](05-google-maps.md) · [`tasks/maps/notes.md`](../../../maps/notes.md)
