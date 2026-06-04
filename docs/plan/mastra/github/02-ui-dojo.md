---
title: GitHub — Mastra UI Dojo
repo: https://github.com/mastra-ai/ui-dojo
demo: https://ui-dojo.mastra.ai/
score: 78
traffic: yellow
journeys: [J2, J4, J5, J6]
personas: [Sofía, Lucía]
---

# ui-dojo — Mastra + UI frameworks

## At a glance

| | |
|---|---|
| **What it is** | Side-by-side demos: **AI SDK**, **Assistant UI**, **CopilotKit** + workflows, generative UI, agent networks. |
| **Purpose** | Compare UI frameworks before committing — **not** mdeai’s deploy architecture. |
| **Goals** | Pick generative UI patterns; see workflow suspend/resume in AI SDK pages. |
| **What it does** | Vite + separate Mastra server (`pnpm dev` → ~`:4750`). |
| **Benefits** | [`src/pages/copilot-kit/`](https://github.com/mastra-ai/ui-dojo/tree/main/src/pages/copilot-kit) validates CK chat against AI SDK equivalents. |
| **mdeai** | Read CopilotKit page only; prod stays Next 16 Pattern 1. |

---

## Score: 78/100 🟡

| Factor | Pts |
|--------|-----|
| Revenue | 22 — UI comparison, not data |
| CK fit | 18 — CK page relevant; rest is AI SDK |
| Gemini | 12 — examples use OpenAI |
| Copy cost | 16 — high integration mismatch |
| Breadth | 10 |

---

## Learn → adapt

| Dojo page | mdeai use |
|-----------|-----------|
| `copilot-kit/index.tsx` | Sidebar + runtime URL patterns |
| `ai-sdk/generative-user-interfaces.tsx` | Card layout ideas for Camila |
| `ai-sdk/workflow-suspend-resume.tsx` | Phase 2 Roberto server resume reference |
| `ai-sdk/network.tsx` | Inspiration for `routerAgent` — not copy-paste |

**Do not** deploy Dojo’s dual-server layout to Vercel prod.

---

## Domain matrix

| Domain | Helpful? |
|--------|----------|
| Rentals | 🟡 Generative card UX |
| Events | 🟡 Workflow + HITL pages |
| Restaurants | 🟡 Chat comparison |
| Maps | — |
| Contests | — |

---

## User stories

**Sofía:** As Sofía, I open [ui-dojo.mastra.ai](https://ui-dojo.mastra.ai/) CopilotKit tab to sanity-check AG-UI events before wiring `search-rentals` render.

**Lucía:** As Lucía, I compare `tool-call` streaming across three frameworks to write Playwright assertions.

---

## Journey — design review (no prod)

1. Clone repo locally (optional).
2. Run `pnpm dev` — Mastra + Vite.
3. Screenshot CK tool UI → Paisa card spec for designer.
4. Implement only in `mdeapp` via vendored CK example.

**Journeys:** J2, J4, J5 — see [`../04-user-stories.md`](../04-user-stories.md).
