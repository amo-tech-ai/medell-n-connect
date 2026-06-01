---
doc_id: MDEAI-MASTER-INDEX
title: mdeai.co — Repo-first master index
version: 1.0
date: 2026-05-21
status: Active
production_app: mdeapp/
planning: plan/prd/README.md
---

# mdeai.co — Repo-first master index

> **Rule:** Ship code in [`mdeapp/`](./mdeapp/). Everything below is **read-only reference** unless a task explicitly says “port pattern.”  
> **Planning canon:** [`plan/prd/`](./plan/prd/) (v7, 10 docs) · [`prd.md`](./prd.md) · [`roadmap.md`](./roadmap.md) · [`mvp.md`](./mvp.md)

**Grading rubric**

| Score | Meaning |
|------:|---------|
| **90–100** | Foundation — copy/install for `mdeapp` |
| **80–89** | Strong pattern — read before implementing feature |
| **70–79** | Useful reference — search when stuck |
| **50–69** | Weak fit — do not build on |
| **&lt;50** | Avoid — wrong stack or archived |

**When to use**

| Label | Action |
|-------|--------|
| **FOUNDATION** | Bootstrap or extend `mdeapp` from this path |
| **PATTERN** | Copy ideas only; reimplement in CK 1.55.2 + Mastra |
| **REFERENCE** | Look up API usage; no copy-paste into prod |
| **AVOID** | Do not use for Phase 1 |

---

## 1. Planning system (canonical — not a git clone)

| Path | Score | When to use | Audience |
|------|------:|-------------|----------|
| [`plan/prd/README.md`](./plan/prd/README.md) | **95** | Start any task; maps doc → PR/task | Everyone |
| [`plan/prd/00-forensic-audit.md`](./plan/prd/00-forensic-audit.md) | **92** | Scores, risks, cuts, contradictions | CTO, leads |
| [`plan/prd/07-contracts-schemas.md`](./plan/prd/07-contracts-schemas.md) | **94** | **PR-1** — Zod contracts first | All engineers |
| [`plan/prd/10-delivery-roadmap.md`](./plan/prd/10-delivery-roadmap.md) | **93** | PR-1→5, Done gates, weeks | PM, eng |
| [`plan/prd/04-maps-grounding.md`](./plan/prd/04-maps-grounding.md) | **90** | MAP-001–012 summary | Maps + chat |
| [`plan/prd/05-events-ticketing.md`](./plan/prd/05-events-ticketing.md) | **88** | Roberto + Stripe | Events |
| [`plan/prd/06-rentals-leads.md`](./plan/prd/06-rentals-leads.md) | **87** | Camila + leads | RE |
| [`plan/maps/maps-prd.md`](./plan/maps/maps-prd.md) | **88** | Deep MAP spec (appendix to §04) | Maps engineers |
| [`plan/events/events-prd.md`](./plan/events/events-prd.md) | **85** | Deep events spec (appendix to §05) | Events |
| [`plan/02-repo-plan.md`](./plan/02-repo-plan.md) | **82** | Extended top-20 narrative (superseded by this index for paths) | Historical |
| [`plan/prd/_legacy/`](./plan/prd/_legacy/) | **40** | v6 chunks — **do not use** for new work | Archive only |

---

## 2. Production target

| Path | Score | When to use |
|------|------:|-------------|
| [`mdeapp/`](./mdeapp/) | **48** *(implementation today)* | **Only** tree that ships to Vercel |
| [`CopilotKit/examples/integrations/mastra/`](./CopilotKit/examples/integrations/mastra/) | **99** | W1 bootstrap — **FOUNDATION** |
| [`/home/sk/mde/`](../../home/sk/mde/) | **55** | **Frozen** — port edge/map patterns only (P0 security) |

---

## 3. CopilotKit examples (`CopilotKit/examples/`)

Local monorepo clone. **Phase 1 = v1 + integrations/mastra + canvas/mastra* + showcases — not v2.**

### 3.1 `integrations/` — agent runtime wiring

| Path | Score | When to use | Action |
|------|------:|-------------|--------|
| [**`integrations/mastra/`**](./CopilotKit/examples/integrations/mastra/) | **99** | Every AI route; copilotkit API; agent registration | **FOUNDATION** |
| `integrations/mcp-apps/` | **78** | Phase 2 interactive venue / 3D MCP | DEFER |
| `integrations/langgraph-*`, `crewai-*`, `adk/`, `agno/`, `pydantic-ai/`, `strands-python/`, `llamaindex/`, `ms-agent-framework-*`, `agent-spec/`, `a2a-*` | **&lt;40** | Wrong orchestrator for mdeai | **AVOID** |

### 3.2 `canvas/` — working memory + multi-field state

| Path | Score | When to use | Action |
|------|------:|-------------|--------|
| [**`canvas/mastra/`**](./CopilotKit/examples/canvas/mastra/) | **96** | `useCoAgent` + Zod working memory (Roberto draft) | **PATTERN** W3–4 |
| [**`canvas/mastra-pm/`**](./CopilotKit/examples/canvas/mastra-pm/) | **93** | Multi-entity state (event + tiers + venue fields) | **PATTERN** W3–4 |
| `canvas/gemini/` | **35** | LangGraph + Python — name is misleading | **AVOID** |
| `canvas/pydantic-ai/`, `canvas/langgraph-python/`, `canvas/llamaindex*` | **&lt;40** | Wrong stack | **AVOID** |

### 3.3 `showcases/` — HITL, GenUI, roles

| Path | Score | When to use | Action |
|------|------:|-------------|--------|
| [**`showcases/banking/`**](./CopilotKit/examples/showcases/banking/) | **91** | Roles, `useCopilotReadable`, approval flows | **PATTERN** W4 |
| [**`showcases/generative-ui/`**](./CopilotKit/examples/showcases/generative-ui/) | **90** | `useCopilotAction({ render })` card shells | **PATTERN** W4–5 |
| `showcases/generative-ui-playground/` | **78** | Card layout ideas | REFERENCE |
| `showcases/research-canvas/`, `showcases/multi-agent-canvas/`, `showcases/a2a-travel/`, `showcases/deep-agents*` | **55–70** | LangGraph / research — not Mastra MVP | DEFER / AVOID |

### 3.4 `v1/` — Next.js + shadcn product patterns

| Path | Score | When to use | Action |
|------|------:|-------------|--------|
| [**`v1/form-filling/`**](./CopilotKit/examples/v1/form-filling/) | **90** | `/host/event/new` AI form-fill | **PATTERN** PR-3 |
| [**`v1/chat-with-your-data/`**](./CopilotKit/examples/v1/chat-with-your-data/) | **88** | Rental Q&A + dashboard chat | **PATTERN** PR-5 |
| `v1/state-machine/` | **74** | Complex multi-step flows | REFERENCE Phase 2 |
| [**`v1/travel/`**](./CopilotKit/examples/v1/travel/) | **65** | Search progress + split layout — ⚠️ LangGraph + **OSM map** (use vis.gl for pins) | **PATTERN** PR-1/5 · [MAP-007B](./tasks/archive/maps/MAP-007-chat-three-panel-polish.md) |
| `v1/research-canvas/` | **65** | Partial overlap with concierge | REFERENCE |
| `v1/_legacy/`, `v1/next-openai/`, `v1/node-*` | **&lt;50** | Deprecated CK APIs | **AVOID** |

### 3.5 `v2/` — experimental (no Mastra path)

| Path | Score | When to use | Action |
|------|------:|-------------|--------|
| `v2/react/`, `v2/vue/`, `v2/runtime/*` | **45** | BuiltInAgent / Hono — **no Mastra bridge** | **AVOID** Phase 1 |
| `v2/*` (entire tree) | **40** | CK v2 migration | Phase 2+ only if official Mastra v2 ships |

> CopilotKit catalog: [`CopilotKit/examples/README.md`](./CopilotKit/examples/README.md)

---

## 4. Google Maps clones (`github/maps/`)

| Local path | Upstream | Score | When to use | Action |
|------------|----------|------:|-------------|--------|
| [`react-google-maps/`](./github/maps/react-google-maps/) | visgl/react-google-maps | **98** | All map UI — AdvancedMarker, Map, hooks | **FOUNDATION** (npm) |
| [`grounding-lite-mcp-sample-app/`](./github/maps/grounding-lite-mcp-sample-app/) | googlemaps-samples | **96** | `searchGroundedPlaces` Mastra tool transport | **PATTERN** PR-2 |
| [`js-api-samples/`](./github/maps/js-api-samples/) | googlemaps/js-api-samples | **94** | Official API snippets, field masks | **REFERENCE** |
| [`js-markerclusterer/`](./github/maps/js-markerclusterer/) | googlemaps/js-markerclusterer | **92** | Dense rental/event pins | **FOUNDATION** (npm) |
| [`codelab-maps-platform-101-react-js/`](./github/maps/codelab-maps-platform-101-react-js/) | googlemaps codelab | **91** | vis.gl + clusterer together | **PATTERN** PR-1 |
| [`google-maps-services-js/`](./github/maps/google-maps-services-js/) | googlemaps | **90** | Edge Places/Routes from Node | **PATTERN** PR-2+ |
| [`extended-component-library/`](./github/maps/extended-component-library/) | googlemaps | **88** | `<gmp-place-overview>` cards | **PATTERN** Post-MVP |
| [`platform-ai/`](./github/maps/platform-ai/) | googlemaps | **85** | Dev-time Maps Code Assist MCP | **DEV TOOL** |
| [`ag-ui-adk-grounding-app/`](./github/maps/ag-ui-adk-grounding-app/) | Greyisheep | **75** | Grounded card UX — ADK not Mastra | REFERENCE only |
| [`react-wrapper/`](./github/maps/react-wrapper/) | googlemaps | **52** | Archived → vis.gl | **AVOID** |

Deep MAP IDs: [`plan/maps/maps-prd.md`](./plan/maps/maps-prd.md) · v7 [`plan/prd/04-maps-grounding.md`](./plan/prd/04-maps-grounding.md)

---

## 5. Events reference clones (`github/events/`)

| Local path | Score | When to use | Action |
|------------|------:|-------------|--------|
| [`Hi.Events/`](./github/events/Hi.Events/) | **80** | Ticket tiers, QR, organizer UX (AGPL) | **PATTERN** — no code copy |
| [`event-planner-os/`](./github/events/event-planner-os/) | **82** | Roberto checklist / host templates | **PATTERN** PR-3 prompts |
| [`spec-to-agents/`](./github/events/spec-to-agents/) | **76** | HITL coordinator ideas — simplify to 1 router | REFERENCE |
| [`events-planner-agents/`](./github/events/events-planner-agents/) | **74** | Router/search/rank — ignore WebSurfer | REFERENCE |
| [`Gatherly/`](./github/events/Gatherly/) | **73** | Next + Supabase discovery UI | REFERENCE |
| [`venue-concierge/`](./github/events/venue-concierge/) | **72** | Venue quotes + evals | REFERENCE |
| [`Eventflow.ai/`](./github/events/Eventflow.ai/) | **70** | Wizard constraints | REFERENCE |
| [`Gather-Up-AI/`](./github/events/Gather-Up-AI/) | **68** | Places + RAG venue | Post-MVP |
| [`EventFlow-AI/`](./github/events/EventFlow-AI/) | **65** | Ops workflows (Patricia) | Post-MVP |
| [`eventforge-ai/`](./github/events/eventforge-ai/) | **55** | Multi-agent sponsor/speaker — LangGraph-ish | **AVOID** MVP |
| [`eventraa/`](./github/events/eventraa/) | **30** | CRA + Mongo | **AVOID** |

Catalog: [`github/events/README.md`](./github/events/README.md) · v7 [`plan/prd/05-events-ticketing.md`](./plan/prd/05-events-ticketing.md)

---

## 6. Other `github/` clones

| Path | Score | When to use | Action |
|------|------:|-------------|--------|
| [`github/copilotkit/`](./github/copilotkit/) | **55** | Standalone CK samples (Agent Spec, ADK grounding) | REFERENCE — prefer `CopilotKit/examples/` |
| [`github/mastra/`](./github/mastra/) | **70** | Upstream Mastra monorepo docs/samples | REFERENCE for workflows API |
| [`github/mastra-react/`](./github/mastra-react/) | **45** | Empty Vite template | **AVOID** |
| [`github/Sol_Mastra_AI_Demo_Google_Gemini/`](./github/Sol_Mastra_AI_Demo_Google_Gemini/) | **60** | Gemini + Mastra demo | REFERENCE only |
| [`github/e2e/`](./github/e2e/) | **65** | External e2e ideas | REFERENCE |

---

## 7. Repo-first implementation order

Aligns with [`plan/prd/10-delivery-roadmap.md`](./plan/prd/10-delivery-roadmap.md) and [`roadmap.md#repo-first-pr-track`](./roadmap.md#repo-first-pr-track).

| PR | Read first (repos + plans) | Build in `mdeapp/` |
|----|---------------------------|-------------------|
| **PR-1** | `integrations/mastra`, `canvas/mastra`, `github/maps/react-google-maps`, `codelab-maps-platform-101-react-js`, [`07-contracts`](./plan/prd/07-contracts-schemas.md), [`04-maps`](./plan/prd/04-maps-grounding.md) | `src/platform/*`, MAP-001, `/chat` shell |
| **PR-2** | `github/maps/grounding-lite-mcp-sample-app`, [`04-maps`](./plan/prd/04-maps-grounding.md) | Grounding tool + attribution |
| **PR-3** | `v1/form-filling`, `canvas/mastra-pm`, `showcases/banking`, `github/events/event-planner-os`, [`05-events`](./plan/prd/05-events-ticketing.md) | `hostEventAgent`, HITL |
| **PR-4** | `github/events/Hi.Events` (patterns), legacy `/home/sk/mde/supabase/functions/` | Ticket edges port |
| **PR-5** | `v1/chat-with-your-data`, `showcases/generative-ui`, [`06-rentals`](./plan/prd/06-rentals-leads.md) | Rental workflow + lead |

---

## 8. Quick “what do I open?”

| Task | Open |
|------|------|
| Bootstrap CK + Mastra | `CopilotKit/examples/integrations/mastra/` |
| Map pins | `github/maps/react-google-maps` + `plan/prd/04` + `plan/maps/maps-prd` |
| Host wizard | `v1/form-filling` + `canvas/mastra-pm` + `plan/prd/05` |
| HITL approve | `showcases/banking` + `plan/prd/09` |
| Ticket Stripe | `github/events/Hi.Events` (UX only) + legacy edge fns |
| Task spec | `tasks/INDEX.md` MVP track + `plan/prd/10` |
| Architecture diagrams | `plan/diagrams/` + [`AUDIT-2026-05-21`](./plan/diagrams/AUDIT-2026-05-21.md) |
| Scope check | `mvp.md` + `advanced.md` |

---

## 9. Maintenance

```bash
# Refresh a shallow clone (example)
git -C github/maps/grounding-lite-mcp-sample-app pull --ff-only

# CopilotKit examples track upstream monorepo — pull in CopilotKit/ root
cd CopilotKit && git pull
```

**Do not** `npm install` inside reference clones into `mdeapp` — copy patterns only.

---

*Scores reflect **fit for mdeai Phase 1** (CK 1.55.2 + Mastra + Supabase + vis.gl), not generic repo quality.*
