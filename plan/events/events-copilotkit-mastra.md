---
title: Best CopilotKit Examples for mdeai Events Module
date: 2026-05-21
base: /home/sk/mdeai/CopilotKit/examples
stack_lock: CopilotKit 1.55.2 + Mastra + AG-UI + Gemini + Supabase (mdeapp/)
related:
  - plan/02-repo-plan.md §3 Top-20
  - tasks/events/F33–F38 (Roberto hero)
  - github/events/lists/events-report.md
scoring: Product fit 25 · Mastra/CK alignment 25 · GenUI/HITL 20 · Workflow/maps 15 · Copy effort 15
---

# Best CopilotKit Examples — Events + Tickets (mdeai)

> **Core monorepo:** [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit)  
> **Local path:** `/home/sk/mdeai/CopilotKit/examples/`  
> **Rule:** Only **`integrations/mastra`** is the runtime foundation. Everything else is a **pattern** to read and port into `mdeapp/` — never a second orchestrator (LangGraph CoAgents, DeepAgents Python, v2 BuiltInAgent).

---

## Executive summary

| Need | Best example(s) | mdeai task |
|------|-----------------|------------|
| Runtime + streaming + tools | `integrations/mastra` | F01 ✅ · F13 logging ✅ |
| Roberto wizard (form-fill) | `v1/form-filling` + `canvas/mastra-pm` step-3 | F36 |
| Event draft shared state | `canvas/mastra` + `canvas/mastra-pm` | F33 · F34 |
| EventCard / venue cards in chat | `showcases/generative-ui` | F25 · F37 |
| Publish / refund HITL | `showcases/banking` + `integrations/mastra` HITL | F37 · F38 |
| Discovery list in one chat | `v1/chat-with-your-data` (UI only) | F19 + F24/F25 |
| Map + search progress | `v1/travel` (pattern only · LangGraph) | F16 · `/rentals` |
| Sponsor deep research | `showcases/research-canvas` | Phase 3 |
| Interactive venue picker | `integrations/mcp-apps` | Phase 2 |
| Multi-step publish pipeline | `v1/state-machine` | Phase 2 (optional) |

**v2 (`examples/v2/`):** No Mastra integration in tree — **do not use for Phase 1 events.** Migrate only in Phase 2 when CK v2 + Mastra ships.

---

## Scoring rubric (100)

| Dimension | Pts | Question |
|-----------|----:|----------|
| **Mastra / CK 1.55.2 alignment** | 25 | Same bridge (`@ag-ui/mastra`), `useCoAgent`, no v2-only APIs? |
| **Events module fit** | 25 | Host wizard, tickets, venue, concierge, sponsors, admin? |
| **Generative UI + HITL** | 20 | `useCopilotAction({ render })`, `renderAndWaitForResponse`? |
| **Workflow + maps** | 15 | Multi-step state, map pins, search progress? |
| **Copy effort** | 15 | How much porting vs read-only inspiration? |

Flags: `⚠️ LangGraph` · `⚠️ OpenAI-only` · `⚠️ v2` · `✅ Mastra`

---

## FINAL RANKING (events-focused)

| Rank | Example | Path | Score | Why for mdeai |
|-----:|---------|------|------:|---------------|
| 1 | **integrations/mastra** | `examples/integrations/mastra` | **99** | Only Mastra+CK foundation; `getLocalAgentsWithLogging`, sidebar, HITL, tools — **mdeapp already here** |
| 2 | **canvas/mastra-pm** | `examples/canvas/mastra-pm` | **96** | Best **event-as-project** workflow: Zod state, kanban/tasks, step-3 production UI → Roberto wizard |
| 3 | **v1/form-filling** | `examples/v1/form-filling` | **95** | **PRIMARY** for `/host/event/new`: conversational fill, shadcn, validation |
| 4 | **showcases/generative-ui** | `examples/showcases/generative-ui` | **94** | EventCard, VenueCard, ticket tier cards via `render` — not text blobs |
| 5 | **canvas/mastra** | `examples/canvas/mastra` | **93** | `useCoAgent` + working memory + 4-card canvas + **HITL interrupts** |
| 6 | **showcases/banking** | `examples/showcases/banking` | **91** | Role context + multi-op approvals → publish ticket refunds sponsor payouts |
| 7 | **v1/chat-with-your-data** | `examples/v1/chat-with-your-data` | **88** | Search results UI in chat; ⚠️ `OpenAIAdapter` not Mastra — **UI pattern only** |
| 8 | **v1/travel** | `examples/v1/travel` | **85** | Map + `search_progress` + place search; ⚠️ LangGraph agent — maps/concierge UX only |
| 9 | **v1/state-machine** | `examples/v1/state-machine` | **76** | Draft→venue→tickets→published stages; useful **later**, not W3 MVP |
| 10 | **showcases/deep-agents-job-search** | `examples/showcases/deep-agents-job-search` | **74** | Stream tool results → result table; ⚠️ LangGraph HTTP — steal **JobsResults** UX for event lists |
| 11 | **integrations/mcp-apps** | `examples/integrations/mcp-apps` | **72** | Phase 2 venue/3D picker; not events MVP |
| 12 | **showcases/research-canvas** | `examples/showcases/research-canvas` | **68** | Tavily sponsor research; ⚠️ LangGraph — **Phase 3** only |
| 13 | **showcases/multi-agent-canvas** | `examples/showcases/multi-agent-canvas` | **65** | Multi-agent tabs; ⚠️ LangGraph + Copilot Cloud — wrong stack |
| 14 | **showcases/generative-ui-playground** | `examples/showcases/generative-ui-playground` | **70** | Card layout lab — reference when polishing F25 |
| 15 | **examples/v2/** | `examples/v2/react/demo` etc. | **—** | **Defer** — no Mastra path in Phase 1 |

*Scores adjusted vs informal list: `chat-with-your-data` and `state-machine` lowered for non-Mastra runtime; `banking` raised to match plan/02-repo-plan (91).*

---

## Feature × example matrix

| Capability | mastra | mastra-pm | form-filling | generative-ui | canvas/mastra | banking | chat-data | travel |
|------------|:------:|:---------:|:------------:|:-------------:|:-------------:|:-------:|:---------:|:------:|
| Host event wizard | ◐ | ✅ | ✅ | ◐ | ◐ | — | — | — |
| Tickets / checkout UI | ◐ | — | ◐ | ✅ | — | ◐ | — | — |
| Host dashboard AI | — | ✅ | — | ◐ | ✅ | ◐ | ✅ | — |
| Venue planning | ◐ | ✅ | ✅ | ✅ | ✅ | — | — | ✅ |
| AI concierge (one chat) | ✅ | ◐ | — | ✅ | ✅ | — | ✅ | ◐ |
| Multi-agent (backend) | ✅ | ✅ | — | — | ◐ | — | — | ⚠️ LG |
| Maps + recommendations | — | — | — | ◐ | — | — | — | ✅ |
| Sponsor workflows | — | ◐ | — | ✅ | — | ◐ | — | — |
| Human approvals | ✅ | ◐ | ◐ | ◐ | ✅ | ✅ | — | ◐ |
| Generative UI cards | ✅ | ◐ | ◐ | ✅ | ✅ | ✅ | ✅ | ◐ |
| Shared `useCoAgent` state | ✅ | ✅ | ◐ | — | ✅ | — | — | ✅ |
| CopilotKit 1.55.2 + Mastra | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |

---

## Top 8 — detailed (why + what to copy)

### 1. integrations/mastra — 99/100 ✅ FOUNDATION

| | |
|---|---|
| **Path** | [`examples/integrations/mastra`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) |
| **Stack** | Next 16 · CK 1.55.2 · `@ag-ui/mastra` · Mastra dev · LibSQL memory |
| **Agents** | Demo `weatherAgent` → mdeapp `pingAgent` / `hostEventAgent` / `conciergeAgent` |
| **Why #1** | Only example that matches **Pattern 1** (`CopilotRuntime` + in-process Mastra). F13 proved prod `ai_runs`. |

**Copy directly:** `src/app/api/copilotkit/route.ts`, `layout.tsx` `<CopilotKit agent=…>`, `CopilotSidebar`, `useCoAgent`, `renderAndWaitForResponse` in foundation `page.tsx`.

**Roberto flow:**

```text
/host/event/layout.tsx → agent="hostEventAgent"
/api/copilotkit → getLocalAgentsWithLogging({ mastra })
```

---

### 2. canvas/mastra-pm — 96/100

| | |
|---|---|
| **Path** | [`examples/canvas/mastra-pm`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) |
| **Stack** | Mastra ✅ · AG-UI workshop (steps 1–3 branches) · Zod `state.ts` |
| **UI** | `ProjectContainer`, `KanbanBoard`, `ProjectHeader`, team modals |

**mdeai mapping**

| mastra-pm | mdeai |
|-----------|-------|
| Project | Event draft |
| Tasks | Ops checklist (staff, vendors, timeline) |
| Team | Door staff / sponsors |
| Step 3 UI | `/host/event/new` multi-section wizard |

**Why:** Closest CopilotKit sample to **“AI event workspace”** — not a static admin form.

**Read:** `src/lib/state.ts`, `src/mastra/agents/systemPrompt.ts`, `src/app/components/ProjectContainer.tsx`, F36 spec cites step-3.

---

### 3. v1/form-filling — 95/100

| | |
|---|---|
| **Path** | [`examples/v1/form-filling`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/form-filling) |
| **Live** | [copilotkit.ai/examples/form-filling-copilot](https://copilotkit.ai/examples/form-filling-copilot) |
| **Stack** | Next 15 · shadcn · CK actions with `parameters` |

**Why:** PRD §45 **PRIMARY** for F36. Roberto says one sentence → fields populate → human fixes → approve (F37).

**Must copy:** `useCopilotAction({ parameters: z.object({...}), handler })` shape for `set_event_basics`, `set_venue`, `set_pricing`.

---

### 4. showcases/generative-ui — 94/100

| | |
|---|---|
| **Path** | [`examples/showcases/generative-ui`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/generative-ui) |
| **Focus** | Controlled GenUI (AG-UI) — agent triggers known React components |

**mdeai cards (F24/F25/F26/F37):**

```tsx
useCopilotAction({
  name: "show_event_card",
  available: "disabled",
  render: ({ args }) => <EventCard {...args} />,
});
```

**Why:** Tourist sees **EventCard** in the **same** concierge thread — matches “one chat, search all.”

---

### 5. canvas/mastra — 93/100

| | |
|---|---|
| **Path** | [`examples/canvas/mastra`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) |
| **Features** | 4 card types · plan progress · **HITL** · JSON/raw state toggle · `Memory.workingMemory` Zod |

**Why:** `EventDraftState` (F33) mirrors `src/lib/canvas/state.ts` pattern. Returning Roberto sees prior venue/ticket draft.

**Pair with:** form-filling (chat) + mastra-pm (layout), not instead of.

---

### 6. showcases/banking — 91/100

| | |
|---|---|
| **Path** | [`examples/showcases/banking`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/banking) |
| **Not about banking** | `copilot-context.tsx` — `useCopilotReadable` for role/dept; generative approval cards |

**mdeai**

| Banking pattern | mdeai use |
|-----------------|-----------|
| Role-based readable | Patricia admin vs Roberto host vs door staff |
| Approve / reject / edit | F37 `ApprovalPanel` + `renderAndWaitForResponse` |
| Op-gated actions | Refund ticket, publish event, sponsor payout |

**Why:** Ticket money and publish are **never** fully autonomous — same HITL as Andrés checkout risk.

---

### 7. v1/chat-with-your-data — 88/100 (UI only)

| | |
|---|---|
| **Path** | [`examples/v1/chat-with-your-data`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/chat-with-your-data) |
| **⚠️** | `OpenAIAdapter` + optional Tavily — **not** Mastra |

**Use for:** Rendering **lists/charts** when `eventAgent` returns rows; Patricia asks “which events sold best in Laureles?”

**Do not use for:** Runtime wiring — keep Mastra tools hitting Supabase.

---

### 8. v1/travel — 85/100 (maps pattern only)

| | |
|---|---|
| **Path** | [`examples/v1/travel`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1/travel) |
| **⚠️** | LangGraph Python agent |

**Copy:** `useCoAgentStateRender` for `search_progress` while `search_events` runs; map pin ingress (plan diagram 03-camila-chat-flow).

**Medellín:** “Events near Parque Lleras this weekend” → progress UI → EventCards + map pins.

---

## Examples to skip or defer (honest)

| Example | Score | Why skip for events MVP |
|---------|------:|-------------------------|
| [deep-agents-job-search](https://github.com/CopilotKit/deep-agents-job-search-assistant) (archived → `showcases/deep-agents-job-search`) | 74 | LangGraph + Tavily jobs; UI borrow only |
| [research-canvas](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/research-canvas) | 68 | Perplexity-style; contradicts Supabase-first catalog |
| [multi-agent-canvas](https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/multi-agent-canvas) | 65 | LangGraph + Copilot Cloud required |
| All `integrations/langgraph-*` | &lt;50 | Wrong orchestrator |
| `examples/v2/*` | N/A | Phase 2 CK migration only |
| [Perplexity clone blog](https://www.copilotkit.ai/blog/build-a-perplexity-clone-with-copilotkit) | N/A | LangGraph CoAgents tutorial — UX ideas only |

---

## Best combination stack (locked for mdeai events)

```text
┌─────────────────────────────────────────────────────────┐
│  integrations/mastra     ← runtime, AG-UI, F13 logging   │
├─────────────────────────────────────────────────────────┤
│  v1/form-filling         ← F36 wizard chat fill          │
│  canvas/mastra-pm        ← F36 layout + EventDraftState  │
│  canvas/mastra           ← memory + HITL + card grid     │
│  showcases/generative-ui ← F25 EventCard in thread       │
│  showcases/banking       ← F37 approval + roles        │
├─────────────────────────────────────────────────────────┤
│  v1/chat-with-your-data  ← list/chart render (UI only)   │
│  v1/travel               ← map progress (UI only)      │
├─────────────────────────────────────────────────────────┤
│  Legacy my-mastra-app    ← F14–F19 tools (port, not CK)  │
│  Supabase + Stripe       ← tickets (not a CK example)    │
└─────────────────────────────────────────────────────────┘
```

---

## Recommended mdeai event architecture (CopilotKit layer)

```text
CopilotKit 1.55.2 (single mount; host subtree switches agent)
        │
        ▼
/api/copilotkit → getLocalAgentsWithLogging({ mastra })
        │
        ├── pingAgent          (/)           W1 ✅
        ├── hostEventAgent     (/host/event/*)  F34–F36
        └── conciergeAgent     (/chat)       F19 — ONE chat
                │
                ├── tools: search-events, search-restaurants, …
                ├── useCopilotAction render → EventCard / RentalCard
                └── renderAndWaitForResponse → ApprovalPanel (F37)
        │
        ▼
Supabase events + event_tickets + Stripe edge fns
```

**Not** eight separate CopilotKit products — **one discovery chat** + **one host wizard agent**.

---

## Map to mdeai tasks (W3–W4 hero)

| Task | Primary CK example | Secondary |
|------|-------------------|-----------|
| F33 EventDraftState Zod | `canvas/mastra` state + `mastra-pm` `state.ts` | F09 types |
| F34 hostEventAgent | `integrations/mastra` agents | legacy port |
| F36 `/host/event/new` | **`v1/form-filling`** | `mastra-pm` step-3 UI |
| F37 ApprovalPanel | **`integrations/mastra` HITL** + **`banking`** | PRD §17 |
| F38 approval-commit | `banking` (server commit after approve) | edge fn pattern |
| F25 EventCard | **`generative-ui`** | shadcn F07 |

---

## Perplexity / web-search blog vs mdeai

The [Build a Perplexity Clone](https://www.copilotkit.ai/blog/build-a-perplexity-clone-with-copilotkit) post teaches **LangGraph + Tavily + CoAgents** — same class as `research-canvas`.

| Blog teaches | mdeai Phase 1 instead |
|--------------|----------------------|
| Multi-step web research | `search-events` on `public.events` |
| Tavily internet | Supabase + optional Grounding Lite (F16) |
| Remote Python agent | In-process Mastra |
| Citation streaming | EventCard list + `ai_runs` observability |

Use blog for **“Searching…” progress copy** only — implement with Mastra tool + `useCoAgentStateRender` (`v1/travel` pattern).

---

## 30-day read order (Sofía / implementer)

| Day | Read (2–4h) | Implement |
|-----|-------------|-----------|
| 1–2 | `integrations/mastra` (done) | — |
| 3 | `v1/form-filling` + F36 spec | Wizard route shell |
| 4 | `canvas/mastra-pm` step-3 + `state.ts` | `EventDraftState` |
| 5 | `canvas/mastra` HITL section | Interrupt tests |
| 6 | `showcases/generative-ui` + `banking` | F37 panel |
| 7 | `generative-ui` + F25 | EventCard render |
| 8+ | `v1/travel` hooks README | Map progress (W5–W6) |

---

## Medellín persona quick map

| Persona | CK examples to study |
|---------|---------------------|
| **Roberto** | form-filling · mastra-pm · banking HITL |
| **Tourist / Camila** | generative-ui · chat-with-your-data (render) · travel (map) |
| **Andrés** | banking (payment-like approvals) — checkout is Stripe not CK |
| **Patricia** | chat-with-your-data · mastra-pm dashboard shape |
| **Lucía** | integrations/mastra tests · floor gates |

---

## Related docs

- GitHub event repos (non-CK): [`events-report.md`](events-report.md)
- Repo plan Top-20: [`plan/02-repo-plan.md`](../../plan/02-repo-plan.md)
- Hi.Events ticketing patterns: [`plan/08-hi-events-decision.md`](../../plan/08-hi-events-decision.md)

---

*Your draft ranking was ~90% right. Main corrections: lower `chat-with-your-data` and `state-machine` for non-Mastra runtime; raise `banking`; add `v1/travel` for maps; flag v2 and LangGraph showcases as Phase 2/3.*
