---
title: GitHub — TanStack Start + Mastra travel assistant
repo: https://github.com/ataschz/tanstack-start-mastra-example
score: 48
traffic: yellow
personas: [Tourist, Sofía]
---

# tanstack-start-mastra-example (travel)

## At a glance

| | |
|---|---|
| **What it is** | AI **travel assistant**: Mastra + TanStack Start + AI SDK — agent networks, streaming, dynamic tool UI. |
| **Purpose** | Reference for **multi-agent routing** and rich stream UI — stack differs from mdeai (Next 16 + CK). |
| **Goals** | Steal network routing ideas for `routerAgent` / `concierge-routing-workflow`. |
| **What it does** | Trip planning, tool calls with custom React stream components. |
| **Benefits** | Tourist-style multi-intent chat UX patterns. |
| **mdeai** | Medellín rentals/events, not generic travel — re-skin concepts only. |

---

## Score: 48/100 🟡

Good streaming/network ideas; wrong framework for Phase 1 ship.

---

## Learn → adapt

| Feature | mdeai |
|---------|-------|
| Agent network | `routerAgent` → rental vs event vs concierge workflows |
| Dynamic tool UI | CopilotKit `useCopilotAction` renders |
| TanStack Start SSR | **Do not migrate** — stay Next App Router |

---

## Domain matrix

| Domain | Travel repo → mdeai |
|--------|---------------------|
| Rentals | “Find stay in X” → Camila neighborhood search |
| Events | “What’s on this week” → `search-events` |
| Restaurants | “Dinner near hotel” → Tourist concierge |
| Maps | Itinerary map → [`../examples/domains/05-google-maps.md`](../examples/domains/05-google-maps.md) |

---

## User stories

**Tourist:** As a Tourist, multi-step “events then restaurant near venue” mirrors network handoff — implemented via `conciergeAgent` + router, not TanStack.

**Sofía:** As Sofía, I read stream component code for AG-UI event ordering tests.

---

## Journey — multi-intent (J6 sketch)

1. User: “Show events Saturday, then dinner in Poblado.”
2. `routerAgent` classifies → `event-discovery-workflow` then concierge tools.
3. CopilotKit streams two tool UIs in one thread (J10 memory).

**Compare:** [`../examples/03-supervisor-agent.md`](../examples/03-supervisor-agent.md).
