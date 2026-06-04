---
doc_id: UNIFIED-EXEC-REVIEW
title: mdeai — Unified Architecture & Execution Review (CTO Forensic)
date: 2026-05-20
status: Active
audience: founders, principal engineers, Cursor agents
sources:
  - plan/maps/maps-prd.md
  - plan/real-estate/real-estate-prd.md
  - plan/real-estate/draft/prd-real-estateV2.md
  - plan/events/events-prd.md
  - plan/prd/01–10 (v6.0 chunks)
  - plan/01-copilotkit-plan.md
  - plan/02-repo-plan.md
  - plan/03-repo-plan.md
  - docs/CHAT-CENTRAL-PLAN.md
  - mdeapp/ (disk truth 2026-05-20)
---

# mdeai — Unified Execution Review

> **Superseded for new work (2026-05-21):** Content merged into [`plan/prd/00-forensic-audit.md`](./prd/00-forensic-audit.md) + v7 docs [`plan/prd/README.md`](./prd/README.md). Keep this file as a pointer for old links.

> **Verdict:** The **vision is coherent** and the **stack choices are correct**. Execution is **ahead on planning**, **behind on shared runtime** in `mdeapp/`. **Simplify to one router, four workflows, one map, one approval gate.**

**Canonical PRD system:** [`plan/prd/`](./prd/)

---

## 1. Unified architecture vision

One **structured AI operating system** for Medellín — not four products glued together.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  USER (Camila · Roberto · Tourist · Patricia)                              │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────────┐
│  COPILOTKIT 1.55.2 — UI orchestration (one sidebar / one /chat canvas)   │
│  · useCoAgent<T> working memory                                          │
│  · useCopilotAction render + renderAndWaitForResponse (HITL)             │
│  · Generative cards (rental · event · place · neighborhood · commute)    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ AG-UI
┌───────────────────────────────▼─────────────────────────────────────────┐
│  MASTRA — sole orchestrator (no LangGraph · no CrewAI · no ADK runtime)   │
│  · routerAgent → intent (rental | event | food | attraction | general)   │
│  · 3–4 workflows (not 15 agents): rental-search · venue-discovery ·      │
│    nearby-intel · grounded-search                                        │
│  · Tools: Supabase reads + places-proxy + grounding MCP (Zod out)        │
└───────────────┬─────────────────────────────┬─────────────────────────────┘
                │                             │
┌───────────────▼──────────────┐   ┌──────────▼────────────────────────────┐
│  SUPABASE (SoT)               │   │  GOOGLE MAPS PLATFORM (spatial truth)  │
│  · inventory + commerce       │   │  · vis.gl render only                 │
│  · RLS + approvals + ai_runs  │   │  · Places New (server + masks)         │
│  · places_cache               │   │  · Grounding Lite MCP (live POI)       │
│  · leads · tickets · events   │   │  · MapContext = pin writer             │
└───────────────┬──────────────┘   └────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────────────────┐
│  BATCH / OPS (Phase 2+) — never hot-path orchestration                    │
│  · Hermes scoring offline · OpenClaw delivery · Paperclip approvals       │
└──────────────────────────────────────────────────────────────────────────┘
```

### Vertical modules (same platform, not separate apps)

| Module | Revenue | Primary surface | Mastra entry | Map pins |
|--------|---------|---------------|--------------|----------|
| **Real estate** | 12% booking fee | `/rentals`, `/chat` | `rental_search` workflow | `rental`, `grounded` |
| **Events** | Ticket commission | `/host/event/new`, `/events`, `/chat` | `venue_discovery`, `event_discovery` | `event`, `grounded` |
| **Restaurants** | Concierge → lead | `/chat` | `search_restaurants` tool | `restaurant` |
| **Attractions** | Concierge → trip | `/chat` | `search_attractions` → `tourist_destinations` | `attraction` |
| **Ticketing** | Stripe | checkout (no LLM) | edge only | optional venue pin |
| **AI Concierge** | Cross-sell | `/chat` three-panel | `routerAgent` | all categories |

**Gemini** explains and ranks; **never** writes geo facts. **OpenClaw** sends messages; **never** owns lead state. **Hermes** reranks offline; **never** on p95 chat path for MVP.

---

## 2. PRD consistency review

### 2.1 Logically consistent ✅ (with fixes)

| Decision | Where aligned | Notes |
|----------|---------------|-------|
| CopilotKit 1.55.2 + Mastra only | prd §12, 01/02/03 plans, all module PRDs | **Hold line** — no v2 mix |
| Supabase SoT | All PRDs | Same project `zkwcbyxiwklihegjhuql` |
| Maps = display | maps-prd, prd §10, CHAT-CENTRAL | Strong |
| HITL before money/publish | events, real-estate, prd §15 | `decide_approval()` + CK HITL |
| Hi.Events reference-only | events-prd, 02-repo-plan | No AGPL copy |
| Colombia Places rules | maps-prd, maps-prd-v2 draft | No US `generativeSummary` |

### 2.2 Conflicts to resolve (P0 doc fixes)

| Conflict | Doc A | Doc B | **Ruling** |
|----------|-------|-------|------------|
| **Language** | prd §2 vision: "Spanish first" | CLAUDE.md + prd scope note: **Phase 1 English only** | **English UI W1–W6**; Spanish copy Phase 2 — update prd §2 vision footnote |
| **Agent count** | prd §13: 7 agents "reused" | mdeapp disk: **`pingAgent` only** | Plan for 7; **ship 2** (router + specialist) in MVP |
| **Events agent army** | events-prd: 12+ named agents | Platform rule: workflows > agents | **3 event tools + 1 host workflow**; defer Coordinator/Vendor/Budget agents |
| **Real estate agent army** | real-estate-prd §7: 8 agents | Same | **router + rental workflow + lead tool**; Hermes offline |
| **Maps agent roster** | maps-prd §6.6: 8 roles | Same simplification | **Tools on router** until MAP-012 |
| **Clustering phase** | prd-maps-doc: Post-MVP | maps-prd: MVP step 9 | **MVP** once ≥25 listings on map |
| **ECL timing** | 03-repo-plan: install week 4 | maps-prd: Post-MVP | **Post-MVP** — one loader rule wins |
| **Chat route** | CHAT-CENTRAL: `/` canvas | mdeapp: `/` sidebar only, **no `/chat`** | **MAP-007** adds `/chat` three-panel; redirect `/` later |
| **Lingui i18n** | prd §4, §50 W7 | Phase 1 English | **Defer Lingui** to Phase 2 |
| **my-mastra-app vs mdeapp** | Older maps tasks cite `my-mastra-app/` | CLAUDE.md: `mdeapp/` only | **All new code in mdeapp/** |

### 2.3 Production realistic? ⚠️ Partially

| Area | Realistic? | Why |
|------|------------|-----|
| W1 ping + copilotkit | ✅ | Shipped in mdeapp |
| W3 Roberto event wizard | ⚠️ | PRD ready; **not coded** |
| W5 rentals + map | ⚠️ | Legacy map exists; **mdeapp empty** |
| W6 grounded chat | ⚠️ | Depends MAP-001–003 |
| W9 Stripe ticket E2E | ⚠️ | Edge fns in **legacy**, not mdeapp tree |
| W10 cutover | ❌ | Too aggressive unless W3–W6 slip right |

**Revised honest MVP:** (1) Roberto publishes one event with HITL, (2) Camila gets rental pins on `/chat`, (3) one paid ticket, (4) one lead — in **12–14 weeks**, not 10, unless scope cut.

### 2.4 Implementation ready? ⚠️

| Ready | Not ready |
|-------|-----------|
| CopilotKit runtime pattern | `packages/types/` workspace |
| Zod action shapes (specified) | `MapContext` in mdeapp |
| Maps PRD MAP-001–012 order | `places-proxy` in mdeapp |
| RE-001–040 task spine (RE) | Most Mastra tools/workflows |
| Events edge fn **specs** | mdeapp `supabase/functions/` |

### 2.5 Too complex? **Yes — in agent naming**

| Overengineered | Simplify to |
|----------------|-------------|
| 12 event agents | `hostEventAgent` + `eventDiscovery` workflow + ticketing edges |
| 8 RE agents | `rentalAgent` + `rental-search` workflow |
| 8 map agents | Mastra **tools** + 4 workflows |
| Dual orchestrator (edge ai-router + Mastra) | **Mastra only**; edge = webhooks + places-proxy |
| Custom SSE / normalize-tool-output | AG-UI + Zod (retire in new app) |
| `packages/` monorepo day 1 | `src/lib/types.ts` + `src/mastra/schemas/` until 3 consumers |

### 2.6 Duplication across documents

| Topic | Copies | **Canonical doc** |
|-------|--------|-------------------|
| Maps V2 | maps-prd, drafts/maps-prd-v2, prd §10–11, RE §5, events §9 | **`plan/maps/maps-prd.md`** |
| CopilotKit base | 01, 02, 03, prd §12, module PRDs | **`plan/01-copilotkit-plan.md`** + example |
| Real estate | real-estate-prd, prd-real-estateV2, docs/prd-realestate | **`plan/real-estate/draft/prd-real-estateV2.md`** (product) + **real-estate-prd** (examples) |
| Events | events-prd, prd §22–24 | **`plan/events/events-prd.md`** |
| Repo top-20 | 02, 03, 07-reuse | **`plan/02-repo-plan.md`** |
| Chat canvas | CHAT-CENTRAL, copilotkit structured OS | **`docs/CHAT-CENTRAL-PLAN.md`** + **maps-prd §6** |

### 2.7 Missing critical architecture

| Gap | Priority |
|-----|----------|
| **`packages/types` or single `src/lib/contracts/`** for EventDraft, MapPin, ToolResponse | P0 |
| **Runtime action pipeline** spec wired to AG-UI (not legacy SSE) | P0 |
| **Feature flags** (`VITE_ENABLE_MAP`, `VITE_ENABLE_GROUNDING`) | P1 |
| **Idempotency keys** on Stripe webhooks in mdeapp | P0 events |
| **`grounding_quota_log` + `places_request_log`** | P1 cost |
| **English-only gate** in prd index | P0 doc |
| **Anti-fake-done** evidence template per MAP/RE/EVT task | P1 ops |

### 2.8 Missing testing / security

| Missing | Mitigation |
|---------|------------|
| Maps e2e in mdeapp | MAP-001 adds Playwright |
| RLS tests for new tables | Supabase skill + CI |
| `verify_jwt` per edge fn matrix | events-prd §10 — port with auth |
| Service role only in edge | CLAUDE.md rule — audit mdeapp |
| Prompt injection on tool args | Zod max lengths + allowlists |
| Rate limit 10 req/min/user | Enforce in copilotkit route middleware |

### 2.9 Missing shared abstractions

See §4 — **`src/platform/`** pattern recommended.

### 2.10 Missing operational workflows

| Workflow | Owner | Doc |
|----------|-------|-----|
| Deploy + Rolling Release | Vercel | prd §41 |
| Maps quota alert | Patricia | maps-prd §9 |
| Stripe webhook replay | Andrés path | events-prd |
| Legacy freeze enforcement | hook | CLAUDE.md |
| MCP-down fallback | engineering | prd/00-skills-reference |

---

## 3. Phase improvements (Core · MVP · Post-MVP · Advanced)

### 3.1 Core (W1–W2) — **narrow further**

| Keep | Cut / defer |
|------|-------------|
| `integrations/mastra` runtime | shadcn full design system |
| `pingAgent` → **`routerAgent` stub** (classify only) | 7 agents registered empty |
| `ai_runs` logging (F13) | Maps npm installs until W3 |
| Supabase auth shell | Lingui |
| `src/lib/contracts/` Zod (not monorepo yet) | `/host/*` routes |
| `npm run floor` smoke | Playwright suite |

**Core exit:** `npm run dev` clean; router classifies; one typed `SET_MAP_PINS` test passes (mock map).

### 3.2 MVP (W3–W8) — **sequenced by revenue**

| Priority | Deliverable | Proof |
|----------|-------------|-------|
| **P0** | MAP-001–003 + `/chat` shell | 3 grounded pins + attribution |
| **P0** | Roberto `/host/event/new` + HITL publish | 1 `events` row |
| **P0** | Ticket checkout webhook in mdeapp edge | 1 paid `event_orders` |
| **P1** | Rental search workflow + 25 listings | 5 pins + cards |
| **P1** | `search_restaurants` / `tourist_destinations` DB tools | pins without overwrite |
| **P2** | Lead capture unified | 1 `leads` row from chat |
| **P2** | Places cache + nearby | cache hit SQL |

**MVP cut:** Marketing agent, Vendor agent, Activations, multi-city, native rental Stripe, WhatsApp prod, Hermes live rerank.

### 3.3 Post-MVP (W9–W14)

- Marker clustering polish, ECL mobile sheet, route previews  
- Hermes batch rerank, neighborhood profiles (offline Gemini)  
- OpenClaw sandbox WhatsApp, Paperclip on landlord forward  
- Lingui ES/CO, scam filter ingest (CHAT-CENTRAL moat)  
- CopilotKit v2 evaluation **only after** Mastra ships v2 bridge  

### 3.4 Advanced (W15+)

- Map itinerary (`trips`), sponsor geo, influencer scoring  
- OpenClaw prod outbound, predictive leads  
- Multi-city scaffold, MCP Apps venue picker  
- **Never:** Maps as orchestrator, second AI runtime, scraping Maps  

---

## 4. Shared platform recommendations

### 4.1 Repo structure (`mdeapp/`)

```text
mdeapp/
  src/
    app/
      layout.tsx              # single CopilotKit provider
      page.tsx                # marketing or redirect → /chat
      chat/page.tsx           # THREE-PANEL (CHAT-CENTRAL)
      rentals/page.tsx
      host/event/new/page.tsx
      api/copilotkit/route.ts
    platform/                 # ← NEW: cross-vertical shared
      contracts/
        map-pin.ts            # MapPinSchema, SetMapPinsAction
        tool-response.ts      # ToolResponse + considered_but_rejected
        event-draft.ts
        approval.ts
      maps/
        MapContext.tsx
        merge-pins.ts
        normalize-tool-output.ts
      cards/
        RentalCard.tsx
        EventCard.tsx
        PlaceInfoCard.tsx
        GroundingAttribution.tsx
      copilot/
        actions-registry.ts   # name → render component
      places/
        field-masks.ts
        places-client.ts        # server-only
    mastra/
      agents/
        router.ts
        host-event.ts
        rental.ts               # thin; heavy work in workflows
      workflows/
        rental-search.ts
        venue-discovery.ts
        nearby-intel.ts
      tools/
        search-grounded-places.ts
        search-rentals.ts
        search-events.ts
        search-restaurants.ts
        search-attractions.ts
    components/ui/              # shadcn
  supabase/
    functions/
      places-proxy/
      ticket-checkout/
      ticket-payment-webhook/
      lead-capture/
  tests/
    unit/platform/
    e2e/maps-*.spec.ts
```

**Optional later:** `packages/types/` when edge + mastra + app triple-import same Zod.

### 4.2 Shared packages strategy

| Phase | Approach |
|-------|----------|
| MVP | `src/platform/contracts/*` — single import path `@/platform/contracts` |
| Post-MVP | Extract `packages/contracts` if edge functions duplicate schemas |

### 4.3 Shared schema strategy

| Schema | Locations (must match) |
|--------|------------------------|
| `EventDraftState` | agent memory, `useCoAgent`, form UI |
| `MapPin` / `SetMapPinsAction` | tools, normalize, MapContext |
| `ToolResponse<T>` | Mastra tool return, card renderer |
| `ApprovalPayload` | HITL respond(), `approval_requests` |

**Rule:** one file per schema; importers never redefine.

### 4.4 Shared tool architecture

```typescript
// Pattern: every search tool
export const searchXTool = createTool({
  inputSchema: z.object({ ... }),
  execute: async (input) => {
    const rows = await supabase...;           // Tier 1: DB
    const enriched = await placesProxy(...);  // Tier 2: masked Places
    return ToolResponseSchema.parse({         // Tier 3: optional grounding
      type: 'rentals',
      listings: rows,
      filters_applied: input,
    });
  },
});
```

**No tool** calls Stripe checkout. **No tool** writes without `propose_*` + HITL or user click.

### 4.5 Shared map architecture

- **Writer:** `MapContext.mergePinsByCategory` only  
- **Reader:** `useCoAgent` / props — read-only  
- **Categories:** `rental | event | restaurant | attraction | grounded`  
- **Attribution:** `GroundingAttribution` on every `grounded` card  
- **Loader:** one `APIProvider` at `app/chat/layout.tsx`  

### 4.6 Shared card system

| `type` in ToolResponse | Component | CopilotKit |
|------------------------|-----------|------------|
| `rentals` | `RentalCard` | `useCopilotAction` render |
| `events` | `EventCard` | same |
| `restaurants` | `PlaceInfoCard` | same |
| `attractions` | `PlaceInfoCard` | same |
| `grounded` | `PlaceInfoCard` + attribution | same |

Polymorphic renderer: `CardByType.tsx` switch — **not** separate SSE parsers.

### 4.7 Shared workflow pattern

- **Router** classifies → `runWorkflow(name, input)` — no agent-to-agent chat  
- **Suspend/resume** only for showing + publish HITL  
- **Memory:** thread scope; working memory schema per surface (`EventDraft` vs `RentalIntent`)

### 4.8 Shared approval architecture

```text
PROPOSED (tool/UI) → renderAndWaitForResponse OR ApprovalPanel
  → decide_approval() RPC / edge approval-commit
  → COMMITTED (deterministic insert)
```

OpenClaw/Paperclip **enqueue** `approval_requests` — same table, same UI.

### 4.9 Shared search architecture

| Tier | Source | When |
|------|--------|------|
| 1 | Supabase + pgvector | rentals, events, restaurants, tourist_destinations |
| 2 | Places New (cached) | enrich, nearby, photos |
| 3 | Grounding Lite MCP | open-ended POI, gaps |

### 4.10 Shared Places API architecture

- Single **`places-proxy`** edge: masks, cache, logging  
- Registry: `platform/places/field-masks.ts`  
- Hook: `.claude/hooks/places-api-field-mask.mjs`  
- **Never** browser Places key  

### 4.11 Shared cache architecture

| Table | TTL | Key |
|-------|-----|-----|
| `places_cache` / `place_details_cache` | 7–30d | `place_id` |
| `places_search_cache` | 24–72h | query hash + bias |
| `grounding_quota_log` | daily cap | user/session |

### 4.12 Shared observability

| Signal | Table / tool |
|--------|----------------|
| Agent runs | `ai_runs` (shipped F13) |
| Tool calls | `agent_tool_calls` or span attrs |
| Pins emitted | `ai_runs.pins_emitted` (add column) |
| Places cost | `places_request_log` |
| Map drift | optional `map_render_drift_log` |

---

## 5. Google Maps strategy verification

| Decision | Correct? | Notes |
|----------|----------|-------|
| vis.gl/react-google-maps | ✅ | Primary React layer |
| Grounding Lite MCP | ✅ | `searchGroundedPlaces`; server key; pageSize 5 |
| Places API New | ✅ | All server; masks mandatory |
| Field mask enforcement | ✅ | Hook + registry — **wire in mdeapp** |
| Map ID strategy | ✅ | `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`; no prod DEMO |
| Clustering | ✅ | MVP after density |
| Advanced Markers | ✅ | mapId parent required |
| Places cache | ✅ | Supabase TTL tables |
| Grounding attribution | ✅ | Legal gate MAP-003 |
| Routes API | ✅ | Parse duration string; Post-MVP polyline |
| ECL | ⚠️ | Post-MVP only; **no** `<gmpx-api-loader>` |
| Maps + CopilotKit | ✅ | Tool → Zod → MapContext; not map-driven AI |

---

## 6. CopilotKit strategy verification

| Decision | Correct? | Notes |
|----------|----------|-------|
| integrations/mastra base | ✅ | mdeapp matches |
| No CopilotKit v2 yet | ✅ | Do not mix imports |
| AG-UI | ✅ | `@ag-ui/mastra` bridge |
| useCoAgent | ✅ | Event + map read state |
| useCopilotAction | ✅ | All cards |
| renderAndWaitForResponse | ✅ | Publish, showing, outreach |
| One sidebar architecture | ⚠️ | Need **one `/chat` layout** policy |
| One chat architecture | ⚠️ | CHAT-CENTRAL ≠ current `/` only |
| Typed actions | ✅ | Zod at boundary |
| Generative UI cards | ✅ | generative-ui + form-filling patterns |

---

## 7. Mastra strategy verification

| Decision | Correct? | Notes |
|----------|----------|-------|
| router agent | ✅ | Replace legacy useIntentRouter |
| concierge agent | ✅ | General Q&A — **defer tools until MAP ready** |
| workflows vs agents | ⚠️ | Docs say workflows; PRDs list many agents — **workflows win** |
| memory strategy | ✅ | LibSQL dev; Postgres prod (F13 path) |
| workingMemory schemas | ✅ | Sync 3 places: agent, types.ts, useCoAgent |
| observability | ✅ | ai_runs started |
| tool orchestration | ✅ | No second orchestrator |
| suspend/resume | ✅ | Showing + publish |
| evaluation agents | ⚠️ | Offline only for MVP |
| tool-only geo truth | ✅ | Enforced in maps-prd |

---

## 8. Unification score: events + rentals + maps

| Dimension | Unified? | Gap |
|-----------|----------|-----|
| One conversational platform | ⚠️ | Spec unified; **mdeapp not** |
| One map system | ❌ | Legacy only |
| One approval system | ⚠️ | DB exists; UI not in mdeapp |
| One workflow system | ⚠️ | Designed; not implemented |
| One card system | ⚠️ | Stubs only |
| One agent architecture | ❌ | Three PRDs = three agent armies |

**Fix:** Module PRDs become **appendices** to platform contracts — not separate agent trees.

---

## 9. Scores (/100)

| Dimension | Score | Rationale |
|-----------|------:|-----------|
| **Architecture** | **82** | Clear lanes; agent sprawl in module PRDs lowers score |
| **Implementation readiness** | **48** | Plans 90+, mdeapp runtime 25 |
| **Scalability** | **74** | Supabase + cache + clusterer path sound; quota gaps |
| **Complexity** | **38** | High doc/agent count; **lower is worse** — target 55 by cutting agents |
| **Maintainability** | **70** | Greenfield helps; needs `platform/` folder + one canonical doc per topic |
| **AI architecture** | **85** | CK+Mastra+Zod+HITL correct; legacy SSE debt isolated |
| **Maps architecture** | **88** | maps-prd excellent; execution lag |
| **Operational readiness** | **52** | ai_runs started; no maps e2e, no quota dashboards in app |

**Weighted platform today:** **~58/100** (matches prd §1). **Target after MVP slice:** **78/100**.

**Planning-only score (docs):** **82/100** — see [`plan/docs/prd-audit-report.md`](./docs/prd-audit-report.md). **Not production-ready** until PR-1–5 exit proofs land.

---

## 10. Detected issues

### Overengineering
- 20+ named agents across module PRDs  
- `packages/` monorepo before second consumer  
- Gemini Maps + Grounding Lite + Places on same turn (pick one live path)  
- ECL + custom pinContent simultaneously  

### Duplicate workflows
- Rental search described in RE PRD, maps-prd, CHAT-CENTRAL, prd §9 — **one `rental-search` workflow**  
- Venue discovery in events + maps — **one `venue-discovery` workflow**  
- “Show nearby” in maps + RE — **one `nearby-intel` workflow**  

### Unnecessary agents (cut to tools)
- Event: Vendor, Budget, Marketing, Activations, Analytics (batch later)  
- RE: Landlord Assistant, Lease Review (edge + HITL, not agent)  
- Maps: Route Agent, Evaluation Agent (library + CI)  

### Conflicting roadmap
- 10-week cutover vs MAP-001 not started  
- Spanish W7 vs English Phase 1  
- 7 agents reused vs pingAgent only  

### Weak testing
- mdeapp: 1 smoke test  
- No maps Playwright  
- No webhook idempotency tests in new tree  

### Missing monitoring
- `places_request_log`, `pins_emitted`, grounding daily cap alerts  

### Dangerous technical debt
- Stripe webhooks only in legacy deploy path  
- `verify_jwt=false` on some edges (events PRD flags)  
- Dual maintenance legacy + mdeapp past W1  

### Hidden scaling risks
- Grounding Lite 300 QPM shared  
- Places mask drift = bill shock  
- MapContext functional updater bug (legacy lesson)  

---

## 11. Best implementation order

### Core (now)
1. `src/platform/contracts/*` (MapPin, ToolResponse, EventDraft)  
2. `routerAgent` + classify tool (no DB)  
3. MAP-001 mock pipeline test  
4. Auth + floor  

### MVP (ordered)
1. MAP-001 → MAP-003 (pins + grounding + attribution)  
2. `/chat` three-panel + MapContext port  
3. `hostEventAgent` + `/host/event/new` + HITL (Roberto)  
4. Ticket edges port + one paid order  
5. MAP-004 → MAP-006 (places client, cache, nearby)  
6. `rental-search` workflow + `/rentals`  
7. DB tools: restaurants, attractions, events discovery  
8. MAP-007 → MAP-009 (vis.gl, markers, cluster)  
9. Lead capture edge  
10. MAP-010 autocomplete (venue)  

### Post-MVP
- Routes, neighborhood batch, ECL sheet, Hermes rerank, OpenClaw sandbox  

### Advanced
- Itinerary, sponsors, multi-city, WhatsApp map static links  

---

## 12. Final recommended architecture (by module)

### Maps V2
Execute **`plan/maps/maps-prd.md` MAP-001–012** only. Single `platform/maps/*`. No map-side agents.

### Events module
**`hostEventAgent` + `venue-discovery` workflow + 4 edge fns** (checkout, webhook, validate, approval-commit). Reference Hi.Events; no fork. Ticketing **never** in LLM tools.

### Real estate module
**`rentalAgent` + `rental-search` + `nearby-intel` workflows** + landlord inbox (no AI). Hermes **offline**. WhatsApp **P4**.

### Unified chat
**`/chat`** = nav | `CopilotSidebar` | `MdeMap`. `routerAgent` dispatches workflows. `ToolResponse` envelope for all verticals. **English** Phase 1.

### Shared AI
One `CopilotRuntime`. One `Mastra` instance. Zod at every tool boundary. HITL for commit. `ai_runs` for every turn.

---

## 13. Repo & pattern recommendations

### Use first
1. `CopilotKit/examples/integrations/mastra`  
2. `github/maps/grounding-lite-mcp-sample-app`  
3. `github/maps/react-google-maps` + `codelab-maps-platform-101-react-js`  
4. `CopilotKit/examples/v1/form-filling` (Roberto)  
5. `CopilotKit/examples/v1/chat-with-your-data` (Camila data UI)  
6. `CopilotKit/examples/showcases/generative-ui` + `banking` (cards + HITL)  

### Never custom-build
- SSE chat protocol  
- Intent router in React  
- Places HTTP client without masks  
- Map URL builder from lat/lng  
- Second agent orchestrator  
- Scraping Maps / Facebook for supply MVP  

### Simplify
- Agent count → router + 2 specialists + workflows  
- Docs → one platform PRD + 3 module appendices  
- i18n → English until MVP revenue proof  
- ECL → flag off until mobile sheet sprint  

---

## 14. Highest ROI first

| ROI | Item | Why |
|-----|------|-----|
| 1 | MAP-001 runtime pipeline | Unblocks all verticals |
| 2 | Roberto publish + 1 ticket | Revenue proof |
| 3 | MAP-003 attribution | Legal + trust |
| 4 | Rental pins + 25 listings | Camila demo |
| 5 | `places-proxy` + cache | Cost control |
| 6 | Unified `ToolResponse` | Kills normalize-tool-output class bugs |

---

## 15. Risks + mitigations (top 8)

| Risk | Mitigation |
|------|------------|
| Plans ≠ code | MAP-001 evidence gate; no Done without localhost pins |
| Agent sprawl | Router + workflows policy in CLAUDE.md |
| Doc conflicts | This review + prd.md index update |
| Maps bill shock | Masks + cache + logging |
| Dual app maintenance | Legacy freeze; P0 only |
| Stripe in legacy only | Port 3 fns to mdeapp week MVP |
| CK #3426 state sync | MapContext write only from client renderer |
| Scope 10-week slip | Publish 12–14 week internal target |

---

## 16. What to cut (executive)

- 15+ nominal agents → **5 runtime names max** for Phase 1  
- Lingui in W7  
- CopilotKit v2 exploration in Phase 1  
- Events marketing/vendor/budget agents  
- RE OpenClaw prod before first booking  
- Maps ECL + Gemini Maps dual path  
- `packages/` monorepo until week 8  

---

*Next action for Sofía: MAP-001 on `/chat` with port of `MapContext` from legacy → 3 grounded pins + screenshot → then Roberto path.*
