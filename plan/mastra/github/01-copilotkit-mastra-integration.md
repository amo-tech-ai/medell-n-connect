---
title: GitHub — CopilotKit × Mastra (vendored)
repo: https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra
score: 98
traffic: green
journeys: [J1, J2, J5]
personas: [Sofía, Camila, Roberto]
---

# CopilotKit + Mastra integration (vendored)

## At a glance

| | |
|---|---|
| **What it is** | Official CopilotKit example: Next.js + `CopilotRuntime` + in-process `Mastra` + AG-UI. |
| **Purpose** | **Production Pattern 1** for mdeai — the repo you copy from, not ui-dojo’s split server. |
| **Goals** | `useCoAgent`, `useCopilotAction`, `renderAndWaitForResponse`, runtime route. |
| **What it does** | Sidebar chat, generative tool UI, shared state, HITL publish flow. |
| **Benefits** | Roberto’s approve-to-publish and Camila’s tool cards already proven in upstream. |
| **Local path** | [`../../../CopilotKit/examples/integrations/mastra/`](../../../CopilotKit/examples/integrations/mastra/) |
| **mdeai path** | `mdeapp/src/app/api/copilotkit/route.ts` · `mdeapp/src/mastra/` |

**Catalog:** J1/J2/J5 in [`../04-user-stories.md`](../04-user-stories.md) — not duplicated here.

---

## Score: 98/100 🟢

| Factor | Pts | Note |
|--------|-----|------|
| Revenue | 35 | Directly powers `/`, `/rentals`, `/host/event/new` |
| CK Pattern 1 | 25 | Exact stack |
| Gemini path | 18 | Swap model id only |
| Ready | 10 | Vendored in workspace |
| Breadth | 10 | All personas |

---

## Learn → adapt for mdeai

| Upstream pattern | mdeai file |
|------------------|------------|
| `getLocalAgents({ mastra })` | `logging-mastra-agent.ts` wrapper |
| `useCopilotAction({ available: "disabled", render })` | W5 `search-rentals` card |
| `renderAndWaitForResponse` | Roberto `preview_and_publish` |
| `useCoAgent<MdeState>({ name: "pingAgent" })` | Homepage → later `hostEventAgent` |

Also see canvas examples in `04-user-stories` § Real-world examples.

---

## Domain use cases

| Domain | Steal |
|--------|-------|
| Rentals | Tool rendering for listing cards |
| Events | HITL + `useCoAgent<EventDraftState>` |
| Restaurants | Same sidebar + tool pattern as rentals |
| Maps | Optional canvas/map state render |
| Contests | — |

---

## User stories

**Sofía:** As Sofía, I diff `mdeapp` against vendored example before every CopilotKit bump.

**Roberto:** As Roberto, publish approval uses the same HITL tool pattern as upstream `renderAndWaitForResponse`.

**Camila:** As Camila, rental search cards mirror disabled-action + agent tool name alignment.

---

## Journey — J5 publish (Roberto)

1. `hostEventAgent` calls publish tool with `renderAndWaitForResponse`.
2. UI shows preview card; Roberto taps Approve.
3. `respond({ approved: true })` unblocks agent.
4. Supabase write via tool — not Mastra `suspend()` in Phase 1.

---

## Do not copy

- GraphQL CopilotKit v1 runtime.
- OpenAI model strings from old forks.

**Index:** [`index-github.md`](index-github.md)
