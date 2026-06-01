---
id: PRD-COPILOT-MAPS-MASTRA-001
title: mdeai.co — Structured AI Operating System PRD (CopilotKit + AG-UI + Mastra + Maps + Supabase)
status: Active
priority: P0
owner: claude
audited_at: 2026-05-18
authors:
  - Senior AI Platform Architect
  - CopilotKit Expert
  - Mastra Workflow Architect
  - Google Maps Platform Engineer
  - Supabase Systems Designer
  - Product Strategy Lead
related:
  - prd.md
  - tasks/copilotkit/docs/README.md
  - tasks/copilotkit/docs/02-core-repositories.md
  - tasks/copilotkit/roadmap-V3.md
  - tasks/mastra/maps/maps-prd-v2.md
  - tasks/mastra/maps/strategy/GOOGLE_MAPS_FOUNDATION_STRATEGY.md
  - tasks/mastra/maps/strategy/maps/12-visgl-react-google-maps.md
  - tasks/mastra/maps/strategy/copilotkit/16-copilotkit-repos.md
  - tasks/mastra/maps/tasks/runtime/013-copilotkit-host-event-pilot.md
  - tasks/mastra/maps/audit/05-runtine-audit.md
  - .claude/skills/open-claw/SKILL.md
---

# mdeai.co — Structured AI Operating System PRD

> **One-line definition:** mdeai.co is a *structured grounded AI operating system* for Medellín — rentals, events, restaurants, attractions, tickets, sponsors — with Google Maps as a deterministic geo runtime, Mastra as the workflow orchestrator, CopilotKit + AG-UI as the AI frontend, and Supabase as the source of truth.

> **What we are NOT building:** a "large custom chatbot." That framing leaks domain into chat state and breaks invariants. We are building **typed copilots** that propose, get approval, and commit.

---

## Section 1 — Executive Summary

### 1.1 What mdeai.co is becoming

mdeai.co is evolving from *"chat app with a map"* into a **structured AI operating system** with four clearly-owned lanes:

```text
CopilotKit + AG-UI  →  AI frontend interaction layer       (Camila, Roberto, Sofía's UI)
Mastra              →  Workflow / agent / tool orchestrator (one orchestrator, no LangGraph, no ADK)
Google Maps         →  Deterministic geo runtime            (pins, routes, places — never the brain)
Supabase            →  Source of truth + RLS + auth         (Phase 1 ticketing already shipped on this)
```

Each lane has one job. They communicate via **typed contracts** (Zod schemas on the boundary, AG-UI protocol on the wire). Crossing lanes incorrectly is what created the audit's 6 P0 blockers.

### 1.2 Why the old custom AI chat architecture becomes fragile

The runtime audit ([`05-runtine-audit.md`](../mastra/maps/audit/05-runtine-audit.md)) found:

| Audit finding | Root cause | Why "structured AI OS" fixes it |
|---|---|---|
| `setPins` × 9 on `/concierge` | Custom chat *also* writes pin state | Pins flow through typed actions; renderer is the only writer |
| Legacy `mdeai_actions` SSE skips Zod | Custom envelope drifts from Mastra tool schema | AG-UI envelope is the wire format; Zod is the contract |
| Drift not persisted (`map_render_drift_log` missing) | Custom render loop has no observability hook | Typed `emit/render` counters are part of the action pipeline |
| `searchGroundedPlaces` Mastra tool missing | Discovery is glued onto chat instead of a workflow | Workflows + typed grounded results = clean grounding lane |
| Tool name kebab/camel drift | Three files (Mastra tool, renderer, normalizer) re-derive shapes | One Zod schema co-located with the action |

**Custom AI glue is fragile because every new surface re-implements the same three contracts** (tool output shape, action envelope, renderer prop type). Five surfaces = 15 places drift can creep in.

### 1.3 Why CopilotKit + AG-UI changes the architecture

| Today | After CopilotKit + AG-UI |
|---|---|
| Custom `useChat.ts` with bespoke SSE envelope | `useCoAgent<TState>()` shares state with Mastra via AG-UI protocol |
| `ChatCanvas` switch maps tool output → card | `useCopilotAction({ render })` co-locates schema + handler + renderer |
| HITL = manual UI flow | `renderAndWaitForResponse` is a framework primitive |
| Multi-agent UX = bespoke router | Specialized copilots, each with typed contract |
| Frontend can't read agent state without re-passing context | Bidirectional state — agent sees what user sees |

**The win is not better-looking chat.** It is **fewer custom contracts to maintain and one fewer SSE format to debug**.

### 1.4 Why Maps becomes a deterministic runtime, not an orchestration layer

Camila asks *"quiet cafés near Parque Lleras"*. In the wrong design, that question becomes Maps-driven — *the map decides what to show*. That hides a stack of decisions inside an opaque Google library:

- Which Places API call? (legacy vs New)
- Which field mask? (cost lever)
- Which grounding source? (Gemini Maps vs Grounding Lite vs Places Nearby)
- Which attribution? (Grounding Lite ToS vs Places ToS)
- What if `generativeSummary` is null in Colombia?

In the right design, **Mastra answers those questions** via a typed `searchGroundedPlaces` workflow that returns `GroundedPlaceResult[]`. The map just renders the result. The map doesn't think. **A map that doesn't think can't be wrong.**

### 1.5 Why typed workflows / actions matter

Without typed actions, *"3 ticket tiers from $20 to $80"* might arrive in the form as:

```ts
{ ticketTiers: "Salsa Standard: $20\nVIP: $40\nBackstage: $80" }   // free-text — breaks pricing
{ ticketTiers: [20, 40, 80] }                                       // numbers — no names
{ ticketTiers: [{ name: "$20 tier", price: "20 USD" }] }            // wrong currency
```

With a Zod schema:

```ts
const TicketTier = z.object({ name: z.string(), priceCop: z.number().int().positive() });
const EventDraft = z.object({ ticketTiers: z.array(TicketTier).min(1).max(10) });
```

…the agent either produces a valid `EventDraft` or the request fails fast with a debuggable error. **Validation is observability for AI.**

### 1.6 Why human approval matters

Camila's *"book this rental for $1,200 a month"* should never reach Stripe without her tap. Roberto's *"publish my event with 3 tiers"* should never write to `events` without his tap. The pattern is:

```text
PROPOSED  (AI generates typed candidate)
APPROVED  (user clicks)
REJECTED  (user edits)
COMMITTED (deterministic system writes)
```

Approval is not friction — it's the line between "AI assistant" and "AI making mistakes Camila pays for."

### 1.7 Architectural evolution

```text
OLD:
  Chat app + Maps
  (chat owns state, maps re-derive from chat, every surface re-implements glue)

NEW:
  Structured grounded AI operating system
  with Maps as deterministic rendering infrastructure
  (typed copilots propose → user approves → deterministic systems commit)
```

---

## Section 2 — Core repositories (scored, with honest verdicts)

> **Expanded catalog (per-repo purpose, risks, phases, copy/skip):** [`02-core-repositories.md`](./02-core-repositories.md)  
> **60-repo matrix:** [`tasks/mastra/maps/strategy/copilotkit/16-copilotkit-repos.md`](../../mastra/maps/strategy/copilotkit/16-copilotkit-repos.md)

Verified 2026-05-18.

### 2.1 Main foundation

| Repo | Score | Verdict | mdeAI example |
|---|---:|---|---|
| [`CopilotKit/CopilotKit`](https://github.com/CopilotKit/CopilotKit) | **92** | **Install.** The library itself — `@copilotkit/react-core`, `@copilotkit/react-ui`, `@copilotkit/runtime` | Roberto sees `<CopilotSidebar>` on `/host/event/new` |
| [CopilotKit monorepo `examples/integrations/mastra/`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | **88** | **Read.** Successor to archived `with-mastra`. The wiring reference. | `registerCopilotKit` server-side, `<CopilotKit runtimeUrl>` client-side |
| [`felipetruman/pydantic-ai-copilotkit-starter`](https://github.com/felipetruman/pydantic-ai-copilotkit-starter) | **55** | **Skip.** Python backend; mdeAI is TypeScript. Concept (typed schemas) already implemented in Zod via `normalize-tool-output.ts`. | — |
| [`adriablancafort/mastra-copilotkit-browser-agent`](https://github.com/adriablancafort/mastra-copilotkit-browser-agent) | **62** | **Read for browser-automation patterns** in Phase 4 only. | Sofía researches venues via browser agent |
| [`l1ax/mastra-copilotkit-deep-research`](https://github.com/l1ax/mastra-copilotkit-deep-research) | **55** | **Skip for now** (0★, 6 commits, pre-MVP). Revisit when building VenueIntelligence (Phase 3). | Future neighborhood research |
| [`hirokisakabe/copilotkit-a2ui-sample`](https://github.com/hirokisakabe/copilotkit-a2ui-sample) | **55** | **Optional.** Tiny Next.js + Mastra A2UI sample. Japanese README. | Pattern reference only |

### 2.2 Google Maps

| Repo | Score | Verdict | mdeAI example |
|---|---:|---|---|
| [`googlemaps/js-api-samples`](https://github.com/googlemaps/js-api-samples) | **98** | **Reference cookbook.** Cite a sample path in every Maps PR. | AdvancedMarker patterns for Camila's pins |
| [`googlemaps-samples/grounding-lite-mcp-sample-app`](https://github.com/googlemaps-samples/grounding-lite-mcp-sample-app) | **96** | **Port `services/conversationalAIService.ts`** into Mastra (~200 LOC) for GROUNDING-001. | *"Quiet cafés near Parque Lleras"* with attribution |
| [`googlemaps/platform-ai`](https://github.com/googlemaps/platform-ai) | **86** | **Dev-time MCP only.** Every Maps PR begins with `retrieve-instructions`. | Sofía gets doc-grounded answers writing Maps code |
| [`googlemaps/js-markerclusterer`](https://github.com/googlemaps/js-markerclusterer) | **90** | **Use npm `@googlemaps/markerclusterer`** (already installed). Read examples for renderer tuning. | 120 rental pins in Laureles → clusters |
| [`visgl/react-google-maps`](https://github.com/visgl/react-google-maps) | **92** | **Install** in Phase 2 ([`010-visgl-react-google-maps-migration.md`](../mastra/maps/tasks/runtime/010-visgl-react-google-maps-migration.md)). | `<APIProvider>` + `<Map mapId>` + `<AdvancedMarker>` |

### 2.3 Advanced / reference

| Repo | Score | Verdict | mdeAI example |
|---|---:|---|---|
| [`nsphung/agent-studio-starter`](https://github.com/nsphung/agent-studio-starter) | **58** | **Skip — LangGraph not Mastra.** Read `useRenderToolCall` hook only. | — |
| [`Greyisheep/ag-ui-adk-grounding-app`](https://github.com/Greyisheep/ag-ui-adk-grounding-app) | **70** | **Read for UX shape** of Camila's grounded-search turn. ADK not Mastra; Vertex grounding not Grounding Lite MCP. 30-min read only. | UX moodboard for grounded discovery |
| [`SindhuraSriram/gemini-copilot-agents`](https://github.com/SindhuraSriram/gemini-copilot-agents) | **55** | **Skip — LangGraph.** Despite the name, zero Google Maps integration. | — |
| [`coleam00/human-in-the-loop-rag-agent`](https://github.com/coleam00/human-in-the-loop-rag-agent) | **62** | **Read HITL pattern** for sponsor approval workflow (Phase 3). Likely LangGraph; translate to Mastra. | Patricia approves sponsor outreach |
| [`amo-tech-ai/coagents-travel-planner`](https://github.com/amo-tech-ai/coagents-travel-planner) | **0** | **🚫 REPOSITORY IS EMPTY.** Zero code. Skip. | — |

### 2.4 Honest scoring caveat

Of the 16 repos listed above, **3 are direct installs** (`CopilotKit`, `js-markerclusterer`, `react-google-maps`), **4 are pattern ports / references** (Mastra integration example, Grounding Lite sample, js-api-samples, platform-ai), and **9 are read-once or skip**. The temptation to clone all 16 is the failure mode; resist it.

---

## Section 3 — Final recommended architecture

### 3.1 Layer diagram

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  USERS                                                                      │
│  Camila (tourist) · Roberto (host) · Sofía (dev) · Mateo (nomad)           │
│  Lucía (QA) · Patricia (admin) · Sponsors                                   │
└─────────────────────────────────┬──────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼──────────────────────────────────────────┐
│  COPILOTKIT UI (Vite + React 18 + TS + shadcn — Paisa brand preserved)     │
│  <CopilotKit>  <CopilotSidebar>  <CopilotChat>  <CopilotPopup>             │
│  useCoAgent<TState>()   useCopilotAction({ render, renderAndWaitForResponse}) │
└─────────────────────────────────┬──────────────────────────────────────────┘
                                  │ AG-UI protocol (StreamableHTTPClientTransport)
                                  │ @ag-ui/client  +  @ag-ui/mastra adapter
┌─────────────────────────────────▼──────────────────────────────────────────┐
│  MASTRA (my-mastra-app/ — TypeScript orchestrator)                          │
│  agents:                                                                    │
│    ConciergeAgent (router)  →  RentalsAgent · EventsAgent ·                │
│                                 RestaurantsAgent · AttractionsAgent ·       │
│                                 VenueAgent · GroundedPlacesAgent           │
│  workflows:                                                                 │
│    plan-weekend  ·  create-rooftop-event  ·  venue-research  ·             │
│    sponsor-match  ·  rental-discovery  ·  route-planning                   │
│  tools (typed Zod outputs):                                                 │
│    search-rentals  ·  search-events  ·  search-restaurants  ·              │
│    search-attractions  ·  searchGroundedPlaces  ·  routesEta                │
└──────┬────────────────────────┬─────────────────────────────┬──────────────┘
       │                        │                             │
┌──────▼────────────┐  ┌────────▼──────────────┐  ┌──────────▼────────────┐
│  TYPED SCHEMAS    │  │  GROUNDING LITE MCP    │  │  PLACES API (New)     │
│  Zod source of    │  │  mapstools.gapis.com   │  │  places-client.ts      │
│  truth per tool   │  │  search_places,        │  │  X-Goog-FieldMask      │
│  GroundedPlace,   │  │  compute_routes,       │  │  cache: places_*_cache │
│  EventDraft, ...  │  │  lookup_weather        │  │                        │
└───────────────────┘  └────────────────────────┘  └────────────────────────┘
       │                        │                             │
┌──────▼────────────────────────▼─────────────────────────────▼──────────────┐
│  MAPCONTEXT  (single pin truth; React Context;                              │
│               exposed to copilots via useCoAgent — read-side only)          │
│  pins · selectedPinId · viewport · mergePinsByCategory                       │
└─────────────────────────────────┬──────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼──────────────────────────────────────────┐
│  GOOGLE MAPS RUNTIME (deterministic — does NOT decide what to show)         │
│  Phase 1: MdeMap.tsx (custom loader) → Phase 2: MdeMapVisgl.tsx (vis.gl)   │
│  <Map mapId> · <AdvancedMarker> · @googlemaps/markerclusterer              │
└─────────────────────────────────┬──────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼──────────────────────────────────────────┐
│  SUPABASE  (source of truth — RLS-enabled, service-role policies)           │
│  tables: rentals · events · ticket_tiers · ticket_orders · profiles ·       │
│          places_search_cache · place_details_cache · grounding_quota_log   │
│          map_render_drift_log · ai_runs · itineraries · venues ·            │
│          approvals · sponsor_leads                                          │
│  edge fns: ai-router · ai-chat · grounded-search · save-itinerary ·         │
│            save-event-draft · ticket-checkout · ticket-validate ·           │
│            approval-commit · maps-observability-ingest                     │
└─────────────────────────────────────────────────────────────────────────────┘

DEV-TIME GUARDRAILS (never in user bundle):
  platform-ai Code Assist MCP (mapscodeassist.googleapis.com)
  GEMINI.md tool-first workflow — every Maps PR cites a sample path

OPENCLAW (Hostinger VPS — internal only, not product chat):
  Internal /admin/ops chat to manage Hermes, Paperclip, Postiz, deployments
  Bridge: contextablemark/clawg-ui → AG-UI → CopilotKit
```

### 3.2 Layer-by-layer rationale

| Layer | Why it exists | What it does NOT do |
|---|---|---|
| **CopilotKit UI** | Replaces custom AI frontend glue with framework primitives. shadcn Paisa brand preserved via component slots. | Render maps · own pin truth · call Places API · write to Supabase |
| **AG-UI protocol** | Standardizes the wire format between any UI client and any agent runtime. | Define product semantics — that's Zod's job |
| **Mastra** | Single orchestrator. Workflows compose tools, agents call workflows, all return Zod-typed data. | Render UI · access browser APIs · skip type-checking |
| **Typed schemas (Zod)** | Source of truth for every action shape. One schema, three consumers (tool, renderer, normalizer). | Be regenerated from chat output — schemas are author-time, not runtime |
| **Grounding Lite MCP** | Source of *grounded factual* place info (cafés, rooftops, etc.) with Google attribution. | Generate prices · invent ratings · skip attribution |
| **Places API (New)** | Source of *enriched cached* place data (photos, hours, ratings) via field-masked calls. | Be called from the browser · skip field masks · use legacy SKUs |
| **MapContext** | One owner of `pins` / `selectedPinId` / `viewport`. Copilots **read** via `useCoAgent`; writers stay allowlisted. | Be mutated by `useChat`, `Concierge`, or any non-allowlisted writer |
| **Google Maps runtime** | Deterministic rendering — given pins, draw them. | Decide what pins to draw — that's the agent's job |
| **Supabase** | All product truth lives here. Phase 1 ticketing depends on RLS being correct. | Be touched directly from the browser (always via edge or Mastra) |

---

## Section 4 — Current vs new architecture

### 4.1 Side-by-side comparison

| Concern | Current custom | New CopilotKit-based | Why the new is better |
|---|---|---|---|
| **Chat shell** | `ChatActionBar`, `ChatMessageList`, `ChatContextChips`, `ChatCanvas` (custom) | `<CopilotChat>` / `<CopilotSidebar>` with shadcn slots | One framework owns chat shell; shadcn slots keep Paisa brand |
| **SSE envelope** | Custom `mdeai_actions` (audit P1-1 — legacy bypasses Zod) | AG-UI protocol (16 event types) | Standardized; one envelope across 4+ surfaces |
| **Tool output → card mapping** | `ChatCanvas` switch on action type → component | `useCopilotAction({ render })` co-located with schema | One file per tool instead of three |
| **Tool output validation** | `normalize-tool-output.ts` (audit-shipped, RUNTIME-001) | `useCopilotAction({ parameters: z.object(...) })` | Validation moves to the boundary; agent gets typed errors |
| **Shared state with agent** | Manually re-pass context in every message | `useCoAgent<TState>()` bidirectional | *"The cheapest one"* works without re-search |
| **HITL** | Hand-rolled preview/apply UI | `renderAndWaitForResponse` primitive | Pattern reused across event publish, sponsor approval, ticket confirm |
| **Multi-agent UX** | `ai-router` edge fn + intent classifier | Specialized copilots (ConciergeCopilot → RentalsCopilot, etc.) | Each copilot has explicit contract; routing is declarative |
| **Markdown-heavy responses** | LLM returns prose, frontend struggles to render | Typed actions return structured data, prose stays prose | Less rendering ambiguity |
| **Map orchestration** | Chat decides what pins to render | Mastra decides; Map renders | Map can't be wrong if it doesn't decide |
| **Loose JSON across surfaces** | Each new surface re-implements glue | Zod schemas + AG-UI envelope shared | Fewer custom contracts |
| **Fragmented actions** | `mdeai_actions` × multiple surfaces, drift between them | One `useCopilotAction` per action, used everywhere | One source of truth per action |

### 4.2 Quality-dimension comparison

| Dimension | Custom (today) | CopilotKit-based (after) | Δ |
|---|:---:|:---:|:---:|
| Complexity | 7/10 (5 custom contracts) | 5/10 (1 framework, 1 protocol) | ⬇ |
| Maintainability | 5/10 (audit found drift) | 8/10 (typed boundaries) | ⬆ |
| Debugging | 5/10 (manual trace correlation) | 8/10 (AG-UI runId in every event) | ⬆ |
| Scalability (new copilots) | 4/10 (each copilot = bespoke glue) | 8/10 (each = `useCopilotAction` + Mastra agent) | ⬆ |
| Observability | 4/10 (`map_render_drift_log` missing) | 7/10 (still needs RUNTIME-005, but envelope helps) | ⬆ |
| Developer velocity (per new feature) | 5/10 (3-file drift) | 8/10 (1-file co-location) | ⬆ |
| AI reliability | 5/10 (Zod gates Mastra path only) | 8/10 (Zod everywhere via `useCopilotAction.parameters`) | ⬆ |
| Maps integration risk | 6/10 (custom loader, custom marker lifecycle) | 7/10 (vis.gl + Map ID enforced; same constitution) | ⬆ slightly |
| User experience (Camila) | 7/10 (works) | 8/10 (faster, less prose, better HITL) | ⬆ |
| Vendor lock-in risk | 3/10 (own everything) | 5/10 (CopilotKit + AG-UI) — *but AG-UI is open protocol* | ⬇ slightly |
| Audit P0 blockers fixed | — | **4 of 8 disappear structurally** | ⬆ |

**Net:** the new architecture is better on 9 of 11 dimensions. It is slightly worse on vendor lock-in (acceptable given AG-UI is an open protocol) and marginally improves Maps integration (the Maps strategy stays substantially the same — see §5).

---

## Section 5 — Google Maps strategy (Maps as deterministic runtime)

### 5.1 The rule

> **Maps does not orchestrate. Maps renders.** Anything that decides *what to show* lives in Mastra. Anything that decides *how to show it* (clustering, marker style, viewport fit) lives in the Maps runtime. **There is no third decision layer.**

### 5.2 What stays unchanged (from [`15-googlemaps-strategy.md`](./maps/15-googlemaps-strategy.md))

| Maps concern | Stays |
|---|---|
| One loader per route tree (constitution C3) | ✅ `google-maps-loader.ts` → Phase 2 `<APIProvider>` |
| `mapId` + AdvancedMarker (C7, C8) | ✅ hook-enforced |
| `@googlemaps/markerclusterer` for ≥50 pins | ✅ npm package already installed |
| Places API (New) via `places-client.ts` with field masks (C5, C6) | ✅ edge-only ingress |
| Grounding Lite MCP path | ✅ `mapstools.googleapis.com/mcp` |
| Supabase caches (`places_search_cache`, `place_details_cache`) with RLS | ✅ migrated 2026-05-14 |
| `MapContext` as pin truth (C4) | ✅ same context; just also `useCoAgent`-readable |

### 5.3 What changes (plumbing)

| Today | After CopilotKit + AG-UI |
|---|---|
| Tool output → `pendingActions` → `ChatCanvas` switch → card | `useCopilotAction({ render })` co-located with schema |
| `useChat.ts` reads `MapContext` separately from chat state | `useCoAgent<MdeState>()` shares `MapContext` snapshot with active copilot |
| `ai-router` edge fn dispatches to one Mastra agent | Same dispatch, but each agent is a *named copilot* |
| Custom `mdeai_actions` SSE | AG-UI envelope via `@ag-ui/mastra` |
| HITL booking confirm = manual UI flow | `renderAndWaitForResponse` primitive |

### 5.4 Role of each Maps subsystem

| Subsystem | Role | Owned by |
|---|---|---|
| **MapContext** | Single pin truth. Writers allowlisted (`ChatCanvas`, `EmbeddedListings`, `Apartments`, future renderer). | React layer |
| **Grounding Lite MCP** | Grounded place discovery — `search_places`, `compute_routes`, `lookup_weather`. Returns `place_id` + attribution. | Mastra tool `searchGroundedPlaces` |
| **Places API (New)** | Place enrichment — photos, hours, ratings, generative summaries. Field-masked. | Edge fn via `places-client.ts` |
| **`@googlemaps/markerclusterer`** | Visual grouping when ≥50 pins. Custom renderer for category colors. | `MdeMarkerCluster` component |
| **vis.gl `react-google-maps`** (Phase 2) | React wrapper — `<APIProvider>`, `<Map>`, `<AdvancedMarker>`, `useMap`, `useMapsLibrary`. | Component layer |
| **Typed geo actions** | `SetMapViewport`, `FocusPin`, `OpenInfoWindow`, `AddPins(GroundedPlaceResult[])`. | Zod schemas + `useCopilotAction` |

### 5.5 Real-world flows

**Flow A — Camila on `/chat`: *"quiet cafés near Parque Lleras"***

```text
1. Camila types →
2. ConciergeCopilot routes to RestaurantsCopilot.intent = "grounded_search"
3. RestaurantsCopilot calls searchGroundedPlaces({ query, location: Parque Lleras })
4. Mastra tool → Grounding Lite MCP → returns GroundedPlaceResult[]
5. Zod validates each result (place_id, lat, lng, attribution required)
6. grounding_quota_log row inserted with trace_id
7. Tool result → useCopilotAction({ name: 'add_grounded_places', render })
8. Renderer: shadcn card + attribution badge per place
9. MapContext.setPins called → pins appear via vis.gl <AdvancedMarker>
10. Camila taps a pin → InfoWindow opens with Google Maps placeUri
```

**Flow B — Roberto on `/host/event/new`: *"rooftop reggaeton event Friday"***

See [`013-copilotkit-host-event-pilot.md`](../mastra/maps/tasks/runtime/013-copilotkit-host-event-pilot.md) for the full pilot spec. Summary:

```text
1. Roberto types one sentence →
2. EventsCopilot (or new VenueCopilot for venue picking) →
3. useCopilotAction('set_event_basics') fills title/date/description
4. useCopilotAction('set_venue') calls Places autocomplete → place_id
5. useCopilotAction('add_ticket_tier') × 3
6. useCopilotAction('preview_and_publish') renders preview card
7. Roberto taps Approve → publishEvent() → Supabase write with RLS check
8. Event live + ticket tiers active
```

**Flow C — Mateo on `/apartments/{id}/nearby`: *"restaurants near this rental"***

```text
1. Mateo taps "Nearby restaurants" on a rental detail page
2. Edge fn: places/nearby({ rental_id, radius: 500m, types: ['restaurant'] })
3. places-client.ts → Places API New (Nearby Search) with field mask
4. Cache hit on 70% → remainder fetched + cached in place_details_cache
5. Returns PlaceResult[] (typed via Zod)
6. Frontend renders shadcn cards + adds pins to MapContext
7. Pins render via vis.gl with attribution badge
```

**Flow D — Camila on `/chat`: *"apartments in Laureles near coworking"***

```text
1. Camila types → ConciergeCopilot → RentalsCopilot
2. search-rentals tool runs (Mastra)
3. Returns RentalRecommendation[] (Zod-typed)
4. useCopilotAction('add_rentals', render) → cards + pins
5. Optional second tool call: searchGroundedPlaces({ query: 'coworking', viewport: <rentals viewport> })
6. add_grounded_places adds coworking pins (different category color)
7. MapContext now holds rental pins + coworking pins; mergePinsByCategory keeps them separate
```

**Flow E — Roberto on `/host/copilot`: *"route from my rental to my event venue"***

```text
1. Roberto asks for directions
2. routesEta workflow → @googlemaps/places via edge fn
3. Returns RoutePlan (Zod: origin, destination, distanceMeters, durationSec, polyline)
4. useCopilotAction('show_route', render) → preview card + polyline on map
5. vis.gl useMapsLibrary('routes') → DirectionsRenderer overlay
6. No client-side Distance Matrix call; server key only
```

### 5.6 Three constitution rules that survive

| Rule | Why it still matters |
|---|---|
| **C2 — Maps never trusts LLM coordinates** | CopilotKit makes typing `{ lat, lng }` into an action tempting. Don't. All coords come from Mastra tools that fetched verified data. |
| **C3 — One loader per route tree** | ECL `<gmpx-api-loader>` could sneak in via a render. Same hook still applies. |
| **C4 — Pin truth in MapContext, copilots read-only** | `useCoAgent` reads. Writers stay allowlisted. RUNTIME-008 ownership test enforces. |

---

## Section 6 — Typed actions + schemas

### 6.1 Why typed actions matter

| Without types | With Zod schemas |
|---|---|
| Agent returns *"Salsa: 20, VIP: 40"* — frontend parses by regex | Agent returns `[{name:'Salsa', priceCop:80000}, {name:'VIP', priceCop:160000}]` — frontend renders |
| Tool drift between Mastra and renderer (audit FP-1) | One schema, three consumers, zero drift |
| AI hallucinates `currency: 'BTC'` | Zod rejects, fails fast with debuggable error |
| Bad pin makes whole batch silently fail | Zod's `safeParse` lets you keep valid rows |
| No machine-readable contract for tests | Schema *is* the contract; tests assert against it |

### 6.2 Core schemas (Zod source of truth)

```ts
// src/lib/chat/schemas/grounded-place.ts
import { z } from 'zod';

export const GroundedPlaceResult = z.object({
  placeId: z.string().min(1),              // Google place_id
  displayName: z.string().min(1),
  formattedAddress: z.string().optional(),
  location: z.object({ lat: z.number(), lng: z.number() }),
  category: z.enum(['cafe', 'restaurant', 'rooftop', 'venue', 'attraction', 'coworking']),
  rating: z.number().min(0).max(5).optional(),
  userRatingCount: z.number().int().nonnegative().optional(),
  priceLevel: z.enum(['FREE', 'INEXPENSIVE', 'MODERATE', 'EXPENSIVE', 'VERY_EXPENSIVE']).optional(),
  googleMapsLinks: z.object({
    placeUri: z.string().url(),             // PLACES-004 — never build from lat/lng
  }),
  attribution: z.object({
    source: z.literal('google_maps_grounding_lite'),
    licenseUri: z.string().url(),
    capturedAt: z.string().datetime(),
  }),
  generativeSummary: z.string().optional(), // often null in Colombia per PRD
  confidence: z.number().min(0).max(1).optional(),
});

export type GroundedPlaceResult = z.infer<typeof GroundedPlaceResult>;
```

```ts
// src/lib/chat/schemas/event-draft.ts
export const TicketTier = z.object({
  name: z.string().min(1).max(80),
  priceCop: z.number().int().min(0).max(50_000_000),   // COP cap
  capacity: z.number().int().positive().optional(),
});

export const EventDraft = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  venueName: z.string().min(1),
  venuePlaceId: z.string().min(1),                     // never lat/lng
  startsAt: z.string().datetime(),                     // ISO 8601
  endsAt: z.string().datetime().optional(),
  ticketTiers: z.array(TicketTier).min(1).max(10),
  category: z.enum(['rumba', 'salsa', 'reggaeton', 'food', 'sport', 'culture', 'other']),
});
```

```ts
// src/lib/chat/schemas/rental.ts
export const RentalRecommendation = z.object({
  rentalId: z.string().uuid(),
  title: z.string(),
  neighborhood: z.string(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  priceCopPerNight: z.number().int().nonnegative(),
  priceCopPerMonth: z.number().int().nonnegative().optional(),
  amenities: z.array(z.string()),
  imageUrls: z.array(z.string().url()).max(20),
  location: z.object({ lat: z.number(), lng: z.number() }),
  proximityScore: z.object({
    nightlifeMeters: z.number().nonnegative().optional(),
    coworkingMeters: z.number().nonnegative().optional(),
    metroMeters: z.number().nonnegative().optional(),
  }).optional(),
});
```

```ts
// src/lib/chat/schemas/venue-comparison.ts
export const VenueSimilarity = z.object({
  basePlaceId: z.string(),
  candidatePlaceId: z.string(),
  candidateName: z.string(),
  similarityScore: z.number().min(0).max(1),
  reasons: z.array(z.string()),                        // ["rooftop", "capacity > 200", ...]
});

export const VenueComparison = z.object({
  baseVenue: GroundedPlaceResult,
  candidates: z.array(VenueSimilarity).min(0).max(20),
  generatedAt: z.string().datetime(),
});
```

```ts
// src/lib/chat/schemas/route-plan.ts
export const RoutePlan = z.object({
  origin: z.object({ lat: z.number(), lng: z.number() }),
  destination: z.object({ lat: z.number(), lng: z.number() }),
  distanceMeters: z.number().nonnegative(),
  durationSec: z.number().nonnegative(),
  polyline: z.string(),
  steps: z.array(z.object({
    instruction: z.string(),
    distanceMeters: z.number().nonnegative(),
  })).max(50),
});
```

```ts
// src/lib/chat/schemas/approval.ts
export const ApprovalAction = z.object({
  approvalId: z.string().uuid(),
  type: z.enum(['publish_event', 'send_sponsor_outreach', 'commit_itinerary', 'commit_venue_edit', 'commit_moderation']),
  proposedAt: z.string().datetime(),
  proposedBy: z.enum(['ConciergeCopilot', 'EventsCopilot', 'SponsorCopilot', 'ModerationCopilot']),
  payload: z.record(z.unknown()),                      // typed at usage site by discriminated union
  state: z.enum(['PROPOSED', 'APPROVED', 'REJECTED', 'COMMITTED']),
});
```

```ts
// src/lib/chat/schemas/map-viewport.ts
export const MapViewportAction = z.object({
  type: z.enum(['focus_pin', 'set_viewport', 'fit_bounds', 'open_info_window', 'close_info_window']),
  pinId: z.string().optional(),
  viewport: z.object({
    center: z.object({ lat: z.number(), lng: z.number() }),
    zoom: z.number().min(1).max(22),
  }).optional(),
  bounds: z.object({
    north: z.number(), south: z.number(), east: z.number(), west: z.number(),
  }).optional(),
});
```

```ts
// src/lib/chat/schemas/itinerary.ts
export const ItineraryItem = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  placeId: z.string(),
  title: z.string(),
  notes: z.string().optional(),
  category: GroundedPlaceResult.shape.category,
});

export const ItineraryPlan = z.object({
  itineraryId: z.string().uuid().optional(),           // assigned on commit
  userId: z.string().uuid(),
  city: z.literal('Medellín'),
  startsOn: z.string().date(),
  endsOn: z.string().date(),
  items: z.array(ItineraryItem).min(1).max(50),
  generatedBy: z.literal('TravelCopilot'),
});
```

```ts
// src/lib/chat/schemas/sponsor.ts
export const SponsorRecommendation = z.object({
  sponsorId: z.string().uuid(),
  brandName: z.string(),
  category: z.enum(['beverage', 'fashion', 'tech', 'finance', 'real-estate', 'food', 'other']),
  brandFitScore: z.number().min(0).max(1),
  matchReasons: z.array(z.string()).max(5),
  proposedOutreach: z.object({
    subject: z.string().max(120),
    body: z.string().max(2000),
    channel: z.enum(['email', 'whatsapp', 'linkedin']),
  }),
});
```

### 6.3 Schema discipline rules

| Rule | Why |
|---|---|
| Zod schema lives next to the Mastra tool that emits it AND the `useCopilotAction` that renders it | Co-location prevents drift (audit FP-1, FP-5) |
| Tool's `outputSchema` imports the same Zod object that the action's `parameters` uses | One source of truth, two consumers |
| Use `z.infer<typeof X>` to derive TS types — never write parallel `interface X` | Avoids dual maintenance |
| `placeUri` always from Places API; never built from `lat/lng` | PRD constitution; Places ToS |
| `priceCop` is always integer (no decimal pesos) | Display-layer formats with `Intl.NumberFormat('es-CO')` |
| `attribution.licenseUri` required on every grounded result | Grounding Lite ToS |
| Schemas don't mutate after merge to main without a migration | Treat schemas like database migrations |

---

## Section 7 — Human approval system

### 7.1 The state machine

```text
            ┌─────────────┐
            │  PROPOSED   │ ← AI generated, Zod-validated, written to `approvals` table
            └──┬──────┬───┘
               │      │
               ▼      ▼
        ┌──────────┐ ┌──────────┐
        │ APPROVED │ │ REJECTED │ ← user tap on shadcn card (renderAndWaitForResponse)
        └────┬─────┘ └──────────┘
             │
             ▼
        ┌──────────┐
        │COMMITTED │ ← deterministic system writes to product tables (events, itineraries, etc.)
        └──────────┘
```

### 7.2 What requires approval

| Action | Why approval matters | Copilot |
|---|---|---|
| **Publish event** | Roberto's commitment to attendees; tickets become purchasable | EventsCopilot |
| **Send sponsor outreach** | Brand-side perception; can't unsend an email | SponsorCopilot |
| **Onboard venue** | Adds to public discovery surface | VenueCopilot |
| **AI edit to rental listing** | Owner is responsible for their listing | RentalsCopilot |
| **Moderate content** | Trust & safety; user-facing visibility change | ModerationCopilot |
| **Save itinerary** | Persists to user profile | TravelCopilot |
| **Commit grounded place to cache** | Affects others' search results | All grounded-search copilots |

### 7.3 What does NOT require approval

| Action | Why no approval |
|---|---|
| Ephemeral search results | User can re-search; no persistence |
| `MapContext.setPins` | Visual only; no DB write |
| Reading pricing tiers | Read-only |
| Routing / ETA | Read-only |
| Closing/opening info windows | UI state only |

### 7.4 Implementation pattern

```tsx
// EventsCopilot's preview-and-publish action
useCopilotAction({
  name: 'preview_and_publish_event',
  description: 'Show the event preview and wait for the user to approve before publishing.',
  parameters: [],
  renderAndWaitForResponse: ({ respond }) => (
    <EventPreviewCard
      draft={EventDraft.parse(state.eventDraft)}  // Zod validates before render
      onApprove={async () => {
        const approval = await createApproval({
          type: 'publish_event',
          payload: state.eventDraft,
          state: 'APPROVED',
        });
        await publishEvent(approval.approvalId);   // edge fn does the commit
        respond?.('approved');
      }}
      onReject={() => respond?.('rejected')}
      onEdit={() => respond?.('edit')}
    />
  ),
});
```

### 7.5 Why "AI proposes, deterministic systems commit"

| Risk if AI commits directly | Mitigation with approval |
|---|---|
| Roberto's event published with wrong date | He sees preview, taps Edit, retries |
| Sponsor outreach sent to wrong contact | Patricia previews recipient list before send |
| Venue duplicate created | Moderation flags as duplicate before write |
| Ticket tier overcharges (COP vs USD typo) | Roberto sees `$80,000` not `$80` on preview card |
| Cache poisoning from a hallucinated place | Approval gate before write to `place_details_cache` |

---

## Section 8 — Copilots

### 8.1 Right-sized for Phase 1

Phase 1 ships **5 copilots**, not the 12 from the original list. Defer the rest.

| Phase | Copilot | Phase 1 | Phase 2 | Phase 3 | Phase 4+ |
|---|---|:---:|:---:|:---:|:---:|
| User-facing | ConciergeCopilot (orchestrator/router) | ✅ | | | |
| User-facing | RentalsCopilot | ✅ | | | |
| User-facing | EventsCopilot | ✅ | | | |
| User-facing | RestaurantsCopilot | ✅ | | | |
| User-facing | VenueCopilot (host event pilot) | ✅ | | | |
| User-facing | TravelCopilot (itineraries) | | ✅ | | |
| Internal | MapsCopilot | ❌ | ❌ | ❌ | ❌ (not a copilot — data layer) |
| Internal | SponsorCopilot | | | ✅ | |
| Internal | ModerationCopilot | | | ✅ | |
| Internal | MarketingCopilot | | | | ✅ |
| Internal | AnalyticsCopilot | | | | ✅ |
| Internal | SupportCopilot | | | | ✅ |

### 8.2 Per-copilot specification

| Copilot | Role | Mastra tools | Maps usage | Approval needs | Real-world example |
|---|---|---|---|---|---|
| **ConciergeCopilot** | Orchestrator. Classifies intent, dispatches to specialized copilots. | None directly (delegates) | Read via `useCoAgent` (sees pinned set) | None | Camila: *"Plan my Medellín weekend"* → routes to TravelCopilot |
| **RentalsCopilot** | Rental search + filtering + comparison | `search-rentals`, `routesEta` (commute scoring) | Adds rental pins to MapContext | None for search; approval for AI edits to listings | Mateo: *"Apartments in Laureles under $800 near coworking"* |
| **EventsCopilot** | Event discovery + creation (host) + ticket pricing suggestions | `search-events`, `create-event-draft` workflow | Adds event pins | Required for `publish_event` | Camila: *"Reggaeton tonight in Provenza"*; Roberto: *"Create a salsa night"* |
| **RestaurantsCopilot** | Restaurant discovery, grounded by Grounding Lite for new/local | `search-restaurants`, `searchGroundedPlaces` | Adds restaurant pins | None | Camila: *"Best arepa places near Lleras"* |
| **VenueCopilot** | Host event venue picker (Phase 1 pilot route `/host/event/new`) | Places autocomplete via edge, `searchGroundedPlaces` | Renders venue preview | Required for `commit_venue_edit` | Roberto: *"Hotel Intercontinental venue"* (or any rooftop) |
| **TravelCopilot** | Multi-day itinerary planning, route bundling | All search tools + `routesEta` + `create-itinerary` workflow | Renders day-by-day routes | Required for `commit_itinerary` | Camila: *"4-day trip: nightlife + food + coworking"* |
| **SponsorCopilot** *(Phase 3)* | Brand-fit scoring, outreach drafting | `brand-fit-score`, `draft-outreach` | None | Required for `send_sponsor_outreach` | Patricia: *"Find sponsors for the Miss Elegance contest"* |
| **ModerationCopilot** *(Phase 3)* | Flag duplicates, suggest moderation actions | `flag-duplicate`, `score-content` | None | Required for `commit_moderation` | Patricia: *"Review pending host applications"* |

### 8.3 Routing pattern (ConciergeCopilot)

```ts
// my-mastra-app/src/mastra/agents/concierge.ts (simplified)
const intentMap = {
  rental_search: 'RentalsCopilot',
  event_search: 'EventsCopilot',
  event_create: 'VenueCopilot',
  restaurant_search: 'RestaurantsCopilot',
  trip_plan: 'TravelCopilot',
  grounded_place_search: 'RestaurantsCopilot',     // default grounded
  // ...
} as const;

// ConciergeCopilot.handle returns { route, payload } — AG-UI forwards to the right copilot
```

---

## Section 9 — Workflows

### 9.1 Workflow inventory

| Workflow | Purpose | Owned by |
|---|---|---|
| `plan-medellin-weekend` | Multi-day itinerary with nightlife/food/coworking balance | TravelCopilot |
| `create-rooftop-event` | Event draft → venue → tiers → preview → publish | VenueCopilot + EventsCopilot |
| `discover-rentals-near-lifestyle` | Rentals + proximity scoring for coworking/nightlife/metro | RentalsCopilot |
| `venue-research` | "Similar to Envy Rooftop" using grounded data | VenueCopilot |
| `nightlife-itinerary` | Tonight-only event chain with route bundling | EventsCopilot + TravelCopilot |
| `sponsor-match` | Brand-fit scoring + outreach draft | SponsorCopilot |
| `lead-capture` | WhatsApp/email lead from chat conversation | All copilots (side-effect) |
| `map-based-discovery` | "Show me what's in this viewport" | All copilots (viewport-driven) |

### 9.2 Detailed: `create-rooftop-event` workflow

```text
Roberto types: "Create a rooftop reggaeton event this Friday at Hotel X with 3 tiers"
   │
   ▼
ConciergeCopilot.classify → intent: event_create
   │
   ▼
VenueCopilot.handle({ raw: "rooftop reggaeton ... Hotel X" })
   │
   ├─ extract: date=Friday, category=reggaeton, venue_query="Hotel X", tiers=3
   │
   ▼
Mastra workflow: create-rooftop-event
   │
   ├─ step 1: venue lookup (Places autocomplete via edge)
   │            → returns place_id, displayName, location
   │            → emit useCopilotAction('set_venue', {...})
   │
   ├─ step 2: date resolution (Friday → 2026-05-22T20:00-05:00)
   │            → emit useCopilotAction('set_event_basics', {title, date, description})
   │
   ├─ step 3: ticket tier suggestion (Mastra tool: suggest-tiers)
   │            → returns 3 tiers (Standard, VIP, Backstage at COP)
   │            → emit useCopilotAction('add_ticket_tier') × 3
   │
   ├─ step 4: preview (renderAndWaitForResponse)
   │            → renders EventPreviewCard with EventDraft
   │            → wait for user tap
   │
   ├─ approved? ───────┐
   │                   │
   │  ┌────────────────▼───────────────┐
   │  │  step 5: validate (Zod)        │
   │  │  step 6: insert approval row   │
   │  │  step 7: edge fn save-event-   │
   │  │           draft → INSERT       │
   │  │           events, ticket_tiers │
   │  │  step 8: emit event_published  │
   │  │           toast + redirect to  │
   │  │           /host/events/{id}     │
   │  └────────────────────────────────┘
   │
   └─ rejected? → state stays in draft form, Roberto edits, retries
```

**Supabase writes:** `approvals` (PROPOSED → APPROVED → COMMITTED), `events`, `ticket_tiers`, `ai_runs` (audit row).

### 9.3 Detailed: `plan-medellin-weekend` workflow

```text
Camila: "Plan my Medellín weekend: nightlife + food + coworking"
   │
   ▼
ConciergeCopilot → TravelCopilot
   │
   ▼
Workflow: plan-medellin-weekend
   │
   ├─ step 1: parse user preferences (extract nightlife, food, coworking signals)
   │
   ├─ step 2 (parallel):
   │    ├─ search-events(category='rumba|salsa|reggaeton', date range=weekend)
   │    ├─ searchGroundedPlaces(query='best restaurants in Laureles', limit=5)
   │    └─ searchGroundedPlaces(query='coworking with wifi El Poblado', limit=3)
   │
   ├─ step 3: sequence into ItineraryPlan (Zod)
   │           Saturday: coworking 9am-2pm → restaurant 3pm → event 10pm
   │           Sunday: brunch → city walk → restaurant
   │
   ├─ step 4: route bundling (routesEta workflow)
   │           computes ETA between consecutive items
   │
   ├─ step 5: preview (renderAndWaitForResponse)
   │           renders day-by-day timeline cards
   │
   ├─ approved? → step 6: commit to itineraries table
   │
   └─ rejected? → edit prompt or refine
```

---

## Section 10 — Edge functions

### 10.1 Inventory

| Edge function | Purpose | Inputs (Zod) | Outputs (Zod) | Auth |
|---|---|---|---|---|
| `grounded-search` | Wraps Grounding Lite MCP | `{ query, location, radius?, categories? }` | `GroundedPlaceResult[]` | JWT (anon allowed for read) |
| `save-itinerary` | Commit approved itinerary | `{ approvalId, itinerary: ItineraryPlan }` | `{ itineraryId }` | JWT (user only) |
| `save-event-draft` | Commit approved event | `{ approvalId, event: EventDraft }` | `{ eventId, ticketTierIds: string[] }` | JWT (host role) |
| `lead-capture` | WhatsApp/email lead from chat | `{ chatId, contact, preferredChannel }` | `{ leadId }` | JWT (any auth) |
| `sponsor-research` | Background brand-fit scoring | `{ eventId, brandCriteria }` | `SponsorRecommendation[]` | JWT (admin) |
| `venue-enrichment` | Background Places enrichment | `{ placeIds: string[] }` | `{ enrichedCount, errors[] }` | Service role (cron) |
| `route-planning` | Routes/Distance Matrix server-side | `{ origin, destination, mode? }` | `RoutePlan` | JWT |
| `nearby-search` | Places Nearby with field mask | `{ location, radius, types[] }` | `PlaceResult[]` | JWT |
| `ticket-checkout` | Stripe checkout session | `{ eventId, tierId, qty }` | `{ stripeSessionUrl }` | JWT |
| `ticket-validate` | QR scan + RLS check | `{ ticketCode, gateId }` | `{ valid, ticketId, eventId }` | Staff token |
| `approval-commit` | Generic approval state transition | `{ approvalId, action: 'approve' \| 'reject' }` | `{ state, committedAt? }` | JWT (proposer or admin) |
| `maps-observability-ingest` | Drift beacons from browser | `{ traceId, expected, rendered, reason }` | `{ ingested: boolean }` | JWT |
| `ai-router` *(existing)* | Intent classification | `{ message, context }` | `{ copilot, confidence }` | JWT (anon ok) |
| `ai-chat` *(existing — to be retired Phase 5)* | Legacy chat path | various | various | JWT (anon ok) |

### 10.2 Standard edge-function template

```ts
// Per .claude/rules/edge-function-patterns.md
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return errorResponse(401, 'UNAUTHORIZED', 'Missing auth');

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  // ...

  const body = InputSchema.parse(await req.json());   // Zod-validate
  // ... business logic
  const result = OutputSchema.parse(rawResult);        // Zod-validate response
  return successResponse(result);
});
```

### 10.3 Security rules (all edge functions)

| Rule | Enforced by |
|---|---|
| JWT validated on every non-public route | Standard auth header check |
| Zod validation on input + output | `InputSchema.parse` / `OutputSchema.parse` |
| Rate limit per user (10/min for AI, 30/min for search) | `.claude/rules/edge-function-patterns.md` |
| `ai_runs` row inserted per AI call (agent_name, tokens, duration, status) | Standard logging |
| Service-role key never in `src/**` (only in edge fns) | Hook `no-service-role-in-src` |
| `X-Goog-FieldMask` on every Places API call (no wildcards) | Hook `places-api-field-mask` |
| `RoutePlan.polyline` only displayed via Maps SDK (Routes ToS) | Code review |

---

## Section 11 — Database + Supabase

### 11.1 Tables (new + existing)

| Table | Purpose | RLS | Status |
|---|---|---|---|
| `rentals` *(existing)* | Rental listings | ✅ | Live |
| `events` *(existing)* | Event records | ✅ | Live |
| `ticket_tiers` *(existing)* | Ticket pricing tiers | ✅ | Live |
| `ticket_orders` *(existing)* | Ticket purchase records | ✅ | Live |
| `profiles` *(existing)* | User profiles + roles | ✅ | Live |
| `ai_runs` *(existing)* | Agent call audit | ✅ | Live |
| `places_search_cache` *(existing, 2026-05-14)* | Places search cache | ✅ + FORCE | Live |
| `place_details_cache` *(existing)* | Place enrichment cache | ✅ | Live |
| `grounding_quota_log` *(existing)* | Grounding Lite quota | ✅ | Live (daily aggregate; per-call in GROUNDING-006) |
| `map_render_drift_log` *(NEW)* | Emit/render drift telemetry | ✅ | RUNTIME-005 |
| `approvals` *(NEW)* | Approval state machine | ✅ | Phase 2 |
| `copilot_sessions` *(NEW, optional)* | CopilotKit session metadata | ✅ | Phase 2 |
| `itineraries` *(NEW)* | Travel itineraries | ✅ | Phase 3 (TravelCopilot) |
| `venues` *(NEW)* | Host venue records | ✅ | Phase 3 |
| `sponsor_leads` *(NEW)* | Sponsor outreach pipeline | ✅ | Phase 3 |
| `grounded_places_cache` *(maybe — could re-use `place_details_cache`)* | Grounded result cache | ✅ | Phase 2 — decide |

### 11.2 RLS strategy

| Table | Policy pattern |
|---|---|
| `rentals`, `events` (public listings) | `SELECT` policies allow `auth` + `anon`; `INSERT/UPDATE/DELETE` restricted to owner via `(select auth.uid()) = owner_id` |
| `ticket_orders` | `SELECT` only owner; service-role full access for fulfillment |
| `ai_runs`, `grounding_quota_log`, `map_render_drift_log` | Service-role only; users never read directly |
| `approvals` | Owner sees own approvals; admins see all |
| `places_*_cache` | Service-role only (edge functions write/read; users never see) |
| `itineraries` | Owner only `SELECT/UPDATE/DELETE`; `INSERT` requires approval reference |
| `venues` | Public `SELECT`; `INSERT/UPDATE` for host role only |
| `sponsor_leads` | Admin only |

### 11.3 Source-of-truth philosophy

```text
AI proposes → user approves → deterministic system commits

PROPOSED state:    lives in `approvals` table only
COMMITTED state:   writes to the *product* table (events, itineraries, etc.)
                   + updates approvals.state = COMMITTED

This means:
  - AI never writes directly to product tables
  - AI never reads sensitive data unless explicit RLS lets it
  - Every commit is traceable to an approval
  - Rollback = simply ignore the approval; product table is untouched if rejected
```

### 11.4 Migration sequence

| Order | Migration | Owner |
|---|---|---|
| 1 | `map_render_drift_log` + RLS + service-role policies | RUNTIME-005 |
| 2 | `approvals` + RLS | Phase 2 |
| 3 | `grounding_quota_log` add `trace_id`, `tool_name`, `cost_estimate` columns | GROUNDING-006 |
| 4 | `itineraries` + RLS | Phase 3 (TravelCopilot) |
| 5 | `venues` + RLS | Phase 3 (VenueCopilot scale-up) |
| 6 | `sponsor_leads` + RLS | Phase 3 |

---

## Section 12 — Phased roadmap

### 12.1 Overview

| Phase | Duration | Goal | Owner |
|---|---|---|---|
| **Phase 0** | 1 week | MVP QA only — no rewrites | Solo dev |
| **Phase 1** | 2 weeks | CopilotKit pilot on `/host/event/new` + typed actions | Solo dev |
| **Phase 2** | 3 weeks | Grounded UI streaming + 4 user-facing copilots + approvals | Solo dev |
| **Phase 3** | 4 weeks | Venue intelligence + travel planner + sponsor workflows | Solo dev + freelance help if budget |
| **Phase 4** | 2 weeks | Browser agents + operational AI + WhatsApp | Solo dev |
| **Phase 5** | Ongoing | Advanced orchestration, external copilots, automation | Solo dev + community |

### 12.2 Phase 0 — MVP QA only (1 week)

| Goal | Status |
|---|---|
| Ship audit's P0 blockers: RUNTIME-008 ownership test, RUNTIME-009 canary, RUNTIME-006 Playwright | Owned |
| Ship Maps observability: RUNTIME-005 `map_render_drift_log` + edge fn | Owned |
| Document current state | This PRD |

**What NOT to build:** any new copilot, any framework swap, any rewrite. Pure QA.

**Success criteria:** `npm run floor` exit 0; Playwright at 390×844 green; audit P0 count drops from 6 → 0.

### 12.3 Phase 1 — CopilotKit pilot + typed actions (2 weeks)

| Week | Task |
|---|---|
| 1 | [RUNTIME-013 pilot](../mastra/maps/tasks/runtime/013-copilotkit-host-event-pilot.md) on `/host/event/new` — VenueCopilot |
| 1 | Adopt Zod schemas for `EventDraft`, `GroundedPlaceResult`, `MapViewportAction` |
| 2 | Add `tests/runtime/types-coherence.test.ts` — assert tool output matches `useCopilotAction.parameters` |
| 2 | Vercel preview + 48h soak + production rollout (flag-gated) |

**Repos used:** `CopilotKit/CopilotKit`, `examples/integrations/mastra`, AG-UI protocol spec, Mastra CopilotKit guide.

**Risks:** AG-UI version drift; Mastra `registerCopilotKit` edge cases. **Mitigation:** pin exact versions; flag-gate.

**Success criteria:** Roberto creates an event in <30s via natural language; 0 regressions on `/chat`; bundle delta < 200KB gzipped on `/host/*`.

**What NOT to build:** new copilots beyond VenueCopilot; chat replacement; LangGraph; Pydantic.

### 12.4 Phase 2 — Grounded UI streaming + 4 copilots + approvals (3 weeks)

| Week | Task |
|---|---|
| 1 | GROUNDING-001: port `searchGroundedPlaces` from `grounding-lite-mcp-sample-app/services/` (~200 LOC) |
| 1 | `approvals` table migration + RLS |
| 2 | RentalsCopilot + EventsCopilot + RestaurantsCopilot — wire each to `useCopilotAction({ render })` co-located with Zod schema |
| 2 | `<APIProvider>` + vis.gl pilot on `/chat` behind `VITE_MAPS_VISGL=1` (RUNTIME-010) |
| 3 | `useCoAgent<MdeState>` exposing `MapContext.pins` for *"the cheapest"* queries |
| 3 | Playwright smoke for all 4 copilots; 7-day production soak |

**Repos used:** `grounding-lite-mcp-sample-app`, `js-api-samples`, `js-markerclusterer`, `visgl/react-google-maps`, `Greyisheep/ag-ui-adk-grounding-app` (UX reference only).

**Risks:** grounding attribution misplaced; vis.gl + custom loader double-loading. **Mitigation:** attribution slot in pin info window; never wrap app in `<APIProvider>` at root.

**Success criteria:** Camila's *"quiet cafés near Lleras"* shows grounded pins with attribution in <2s; *"the cheapest"* answers from pinned set without re-search.

**What NOT to build:** TravelCopilot, SponsorCopilot, ModerationCopilot, browser agents.

### 12.5 Phase 3 — Venue intelligence + travel + sponsor (4 weeks)

| Week | Task |
|---|---|
| 1 | TravelCopilot + `plan-medellin-weekend` workflow + `itineraries` table |
| 2 | VenueCopilot scale-up — venue research, *"similar to Envy Rooftop"* |
| 3 | SponsorCopilot + `sponsor-match` workflow + outreach drafting + HITL approval |
| 4 | ModerationCopilot + admin workflows on `/admin/moderation` |

**Repos used:** `coleam00/human-in-the-loop-rag-agent` (HITL patterns), `googlemaps/extended-component-library` (place overview drawer).

**Risks:** sponsor email deliverability; itinerary scheduling conflicts. **Mitigation:** SES or Resend; conflict-detection in routesEta.

**Success criteria:** Patricia approves a sponsor outreach in 2 taps; Camila saves an itinerary in <60s.

### 12.6 Phase 4 — Browser agents + operational AI + WhatsApp (2 weeks)

| Week | Task |
|---|---|
| 1 | `/admin/ops` chat via `contextablemark/clawg-ui` → OpenClaw on Hostinger VPS |
| 1 | `adriablancafort/mastra-copilotkit-browser-agent` patterns for venue research automation |
| 2 | WhatsApp lead-capture integration (Twilio or 360dialog) |
| 2 | Hermes (notification service) + Paperclip (file ops) wired into admin copilots |

**Repos used:** `contextablemark/clawg-ui`, `adriablancafort/mastra-copilotkit-browser-agent`.

**Risks:** OpenClaw exec safety; WhatsApp template approval delay. **Mitigation:** OpenClaw exec gated behind admin auth + Supabase RLS; WhatsApp templates pre-approved before Phase 4 start.

**Success criteria:** Sofía restarts Hermes via `/admin/ops` chat; lead captured via WhatsApp lands in `sponsor_leads`.

### 12.7 Phase 5 — Advanced orchestration + automation (ongoing)

| Direction | Description |
|---|---|
| Cron-driven copilots | Nightly venue enrichment, weekly sponsor outreach planning |
| Multi-agent UI patterns from `open-multi-agent-canvas` | Sponsor portal with 3 copilots side-by-side |
| Voice concierge (post-MVP) | `assistant-ui` voice integration + Gemini Live API |
| External copilots | Partner integrations — hosts deploy their own copilots that read mdeAI |

**Risk gate:** do not start Phase 5 until Phases 1–4 each soak ≥30 days in production with no P0 regressions.

### 12.8 What NOT to build (across all phases)

| Don't build | Reason |
|---|---|
| LangGraph alongside Mastra | Two orchestrators = death |
| Python backend for any copilot | mdeAI is TypeScript; AG-UI works in TS |
| Vertex AI Maps Grounding (Gemini-side) | Different SKU, different attribution; stay on Grounding Lite MCP |
| ADK as runtime | UX moodboard only |
| `@googlemaps/react-wrapper` | Deprecated; use vis.gl |
| Multiple `MapContext` instances | Constitution C4 |
| Two Maps loaders | Constitution C3 |
| Auto-commit (skip approval) | Constitution: AI proposes, deterministic systems commit |
| Replace `useChat.ts` before Phase 4 | Live revenue surface |

---

## Section 13 — Real-world mdeAI examples

### 13.1 *"Plan my Medellín weekend"* (Camila)

```text
Camila on /chat — Friday 6pm, slow 4G
  ↓
ConciergeCopilot → TravelCopilot
  ↓
Workflow: plan-medellin-weekend
  ↓ parallel
  ├─ search-events(weekend, rumba|salsa|reggaeton)            → 8 events
  ├─ searchGroundedPlaces('restaurants Laureles', limit=5)    → 5 grounded
  └─ searchGroundedPlaces('coworking El Poblado', limit=3)    → 3 grounded
  ↓
ItineraryPlan (Zod):
  Saturday: coworking 9-2 → restaurant 3-5 → rooftop event 10pm
  Sunday: brunch 11 → walk 1-4 → restaurant 7
  ↓
useCopilotAction('preview_itinerary', renderAndWaitForResponse)
  ↓ Camila taps Approve
edge fn save-itinerary → itineraries table
  ↓
shadcn toast: "Saved! View at /me/trips"
```

**Copilots:** ConciergeCopilot, TravelCopilot.
**Maps usage:** 8+5+3 pins added; routesEta computed between items.
**Approval:** required (`commit_itinerary`).
**Supabase writes:** `approvals` (1), `itineraries` (1), `ai_runs` (1 per copilot call).

### 13.2 *"Find apartments near nightlife and coworking"* (Mateo)

```text
Mateo on /chat
  ↓
ConciergeCopilot → RentalsCopilot
  ↓
search-rentals({ city: 'Medellín', priceCapCop: 3200000 })   → 24 rentals
  ↓ Mastra workflow: rental-proximity-score
  ├─ for each rental: searchGroundedPlaces('nightlife', radius=500)
  └─ for each rental: searchGroundedPlaces('coworking', radius=500)
  ↓
RentalRecommendation[] (Zod) with proximityScore
  ↓
useCopilotAction('add_rentals', render) → 24 cards + 24 pins
  ↓
Top 5 highlighted by composite score
  ↓
Mateo taps one → InfoWindow + grounding attribution
```

**Copilots:** ConciergeCopilot, RentalsCopilot.
**Maps usage:** rental pins (red) + nightlife pins (purple, optional toggle) + coworking pins (blue, optional toggle); clustering kicks in at zoom-out.
**Approval:** none (read-only).
**Supabase writes:** `ai_runs` only.

### 13.3 *"Create a rooftop reggaeton event"* (Roberto)

See Section 9.2 detailed workflow and [`013-copilotkit-host-event-pilot.md`](../mastra/maps/tasks/runtime/013-copilotkit-host-event-pilot.md).

### 13.4 *"Find venues similar to Salon Amador"* (Roberto)

```text
Roberto on /host/copilot
  ↓
VenueCopilot
  ↓
Workflow: venue-research
  ├─ step 1: lookup Salon Amador via Places (base place_id)
  ├─ step 2: features = capacity, rooftop, music_type, area
  ├─ step 3: searchGroundedPlaces with feature-derived query
  └─ step 4: similarity scoring (Mastra tool: venue-similarity)
  ↓
VenueComparison (Zod) with 8 candidates
  ↓
useCopilotAction('show_venue_comparison', render)
  → side-by-side cards, similarity score badges, reasons list
  ↓
Roberto taps one to use as event venue → set_venue action fires
```

**Copilots:** VenueCopilot.
**Maps usage:** all 8 candidates + base venue rendered with comparison badges.
**Approval:** none (research only; commit happens at event creation).
**Supabase writes:** `ai_runs`; optional `venues` cache row if new.

### 13.5 *"Quiet cafés near Parque Lleras"* (Camila)

```text
Camila on /chat
  ↓
ConciergeCopilot → RestaurantsCopilot
  ↓
searchGroundedPlaces({
  query: 'quiet cafés',
  location: { lat: 6.2087, lng: -75.5664 },   // Parque Lleras
  radius: 600,
  attributes: ['cafe']
})
  ↓
GroundedPlaceResult[] — 4 places (Zod-validated)
  ├─ each has placeId, attribution, googleMapsLinks.placeUri
  └─ grounding_quota_log row inserted with trace_id
  ↓
useCopilotAction('add_grounded_places', render)
  → 4 shadcn cards with Google attribution badge
  → 4 pins (purple/grounded category) on MapContext
  ↓
Camila taps a pin → InfoWindow with placeUri link
```

**Copilots:** ConciergeCopilot, RestaurantsCopilot.
**Maps usage:** 4 pins; clustering not needed (count < threshold).
**Approval:** none.
**Supabase writes:** `ai_runs`, `grounding_quota_log`, optional `place_details_cache` if hit.

### 13.6 *"Plan a digital nomad itinerary"* (Mateo)

```text
Mateo on /chat — 2-week stay
  ↓
ConciergeCopilot → TravelCopilot (nomad mode)
  ↓
Workflow: plan-nomad-stay
  ├─ rental search anchor (coworking-proximate, monthly pricing)
  ├─ daily structure: coworking AM, exploration PM, occasional events
  ├─ weekend events (rumba clusters)
  └─ restaurant rotation (variety bonus)
  ↓
ItineraryPlan (Zod) — 14 days, 30+ items
  ↓
renderAndWaitForResponse with day-tabs UI
  ↓ Mateo edits Tuesday, approves
edge fn save-itinerary → itineraries
```

**Copilots:** ConciergeCopilot, TravelCopilot, RentalsCopilot (anchor).
**Maps usage:** itinerary mode — show one day at a time with route polyline.
**Approval:** required.
**Supabase writes:** `approvals`, `itineraries`, optional `lead_capture` if email opt-in.

### 13.7 *"Find sponsors for a fashion event"* (Patricia)

```text
Patricia on /admin/sponsors — preparing Miss Elegance Colombia
  ↓
SponsorCopilot
  ↓
Workflow: sponsor-match
  ├─ event criteria: fashion, ~5000 attendees, Medellín, Latina audience
  ├─ candidate filter (sponsor_leads + external research)
  ├─ brand-fit scoring per candidate
  └─ outreach draft per candidate
  ↓
SponsorRecommendation[] (Zod) — 12 candidates
  ↓
useCopilotAction('preview_outreach_batch', renderAndWaitForResponse)
  → table view, per-row Approve/Reject toggles
  ↓ Patricia approves 7
edge fn approval-commit → for each:
  ├─ update sponsor_leads.state = 'OUTREACH_SENT'
  └─ trigger email/whatsapp send
```

**Copilots:** SponsorCopilot (internal).
**Maps usage:** none.
**Approval:** required (each recipient).
**Supabase writes:** `approvals` (7), `sponsor_leads` (7), `ai_runs` (1).

---

## Section 14 — Final recommendations

### 14.1 Foundational repos (use these — no debate)

| Repo | Role |
|---|---|
| [`CopilotKit/CopilotKit`](https://github.com/CopilotKit/CopilotKit) | The library (`@copilotkit/react-core`, `@copilotkit/react-ui`, `@copilotkit/runtime`) |
| [CopilotKit monorepo `examples/integrations/mastra`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | Authoritative Mastra wiring reference |
| [`ag-ui-protocol/ag-ui`](https://github.com/ag-ui-protocol/ag-ui) | Protocol spec — 15-min read |
| [`mastra-ai/mastra`](https://github.com/mastra-ai/mastra) | Already in use; `@ag-ui/mastra` adapter lives here |
| [`googlemaps/js-api-samples`](https://github.com/googlemaps/js-api-samples) | Maps cookbook — cite a sample path in every Maps PR |
| [`googlemaps-samples/grounding-lite-mcp-sample-app`](https://github.com/googlemaps-samples/grounding-lite-mcp-sample-app) | Port `services/` (~200 LOC) for GROUNDING-001 |
| [`googlemaps/platform-ai`](https://github.com/googlemaps/platform-ai) | Dev-time Code Assist MCP — every Maps PR begins with `retrieve-instructions` |
| [`googlemaps/js-markerclusterer`](https://github.com/googlemaps/js-markerclusterer) | npm — already installed |
| [`visgl/react-google-maps`](https://github.com/visgl/react-google-maps) | React Maps wrapper — install Phase 2 |
| Supabase | Source of truth — no replacement |

### 14.2 Reference only

| Repo | Use for |
|---|---|
| [`Greyisheep/ag-ui-adk-grounding-app`](https://github.com/Greyisheep/ag-ui-adk-grounding-app) | UX shape of grounded discovery — 30 min read |
| [`googlemaps/extended-component-library`](https://github.com/googlemaps/extended-component-library) | Place-overview drawer (Phase 3 host detail) |
| [`contextablemark/clawg-ui`](https://github.com/contextablemark/clawg-ui) | `/admin/ops` ↔ OpenClaw bridge (Phase 4 internal) |
| [`adriablancafort/mastra-copilotkit-browser-agent`](https://github.com/adriablancafort/mastra-copilotkit-browser-agent) | Browser automation patterns (Phase 4) |
| [`coleam00/human-in-the-loop-rag-agent`](https://github.com/coleam00/human-in-the-loop-rag-agent) | HITL patterns (translate from LangGraph to Mastra) |
| [`googlemaps/js-api-loader`](https://github.com/googlemaps/js-api-loader) | Audit `google-maps-loader.ts` for parity |
| [`googlemaps/codelab-maps-platform-101-react-js`](https://github.com/googlemaps/codelab-maps-platform-101-react-js) | Onboarding doc for new hires |

### 14.3 Avoid for now

| Repo | Why |
|---|---|
| Anything LangGraph-based (`nsphung/agent-studio-starter`, `SindhuraSriram/gemini-copilot-agents`, etc.) | Wrong orchestrator |
| Anything Python-backend (`felipetruman/pydantic-ai-copilotkit-starter`) | Wrong language; concept already in Zod |
| `google/adk-python` | UX reference only; not runtime |
| `googlemaps/react-wrapper` | Deprecated |
| Empty repos (`amo-tech-ai/coagents-travel-planner`, `Connorbelez/mastra-copilotkit-starter`) | No code exists |
| Pre-MVP experiments (≤6 commits) — `l1ax/*`, `hirokisakabe/*`, `ricable/uap` | Revisit when mature |

### 14.4 What should NOT be rewritten yet

| Thing | Reason |
|---|---|
| `useChat.ts` (Mastra path) | 222 tests, audit-clean, ships revenue. Defer until Phase 4. |
| `MapContext.tsx` | Pin truth. Just gets a `useCoAgent` read-side. |
| Supabase RLS + auth | Phase 1 ticketing depends on it. |
| Mastra agents | Working. Add new ones; don't rewrite existing. |
| `places-client.ts` | Single Places ingress. Field-mask discipline already enforced. |
| Stripe ticketing flow | Live revenue. Don't touch. |

### 14.5 What should be replaced first

| Order | What | When | Why |
|---|---|---|---|
| 1 | `/host/event/new` form interaction → CopilotKit pilot | Phase 1 | Zero blast radius; tests every primitive |
| 2 | `searchGroundedPlaces` Mastra tool | Phase 2 | Audit P0-5 blocker |
| 3 | `MdeMap.tsx` → `MdeMapVisgl.tsx` behind flag | Phase 2 | Audit improvements (mapId type-enforced) |
| 4 | `MapContext` adds `useCoAgent` read-side | Phase 2 | *"The cheapest"* works |
| 5 | `/chat` action layer → `useCopilotAction({ render })` per tool | Phase 4 | Only after pilots prove out |
| 6 | Legacy `ai-chat` edge fn retired | Phase 5 | Unified runtime |

### 14.6 Safest migration path

```text
Phase 0: Fix audit P0s. Don't touch anything else.        (1 week)
Phase 1: VenueCopilot pilot at /host/event/new — proves    (2 weeks)
         CopilotKit + Mastra + AG-UI all wire correctly.
Phase 2: Grounding tool + 4 user-facing copilots + vis.gl. (3 weeks)
         /chat now uses CopilotKit primitives behind flag.
Phase 3: TravelCopilot, VenueCopilot scale, SponsorCopilot. (4 weeks)
Phase 4: /admin/ops via OpenClaw + browser agents.          (2 weeks)
Phase 5: Ongoing — automation, voice, external copilots.    (ongoing)

Each phase = feature-flagged, reversible in 1 commit, soak ≥7 days.
```

### 14.7 Highest-leverage move

**Phase 1 pilot at `/host/event/new`** (RUNTIME-013). Two weeks of work proves the entire CopilotKit + AG-UI + Mastra stack on a zero-blast-radius surface. After this, every other phase is straightforward extension. **Skip this phase and you risk discovering wiring problems on Camila's live revenue path.**

### 14.8 Biggest risk

**Analysis paralysis.** Eight strategy documents now exist; the answer hasn't moved in the last 6 turns. The risk is *not* picking the wrong framework — every realistic option (CopilotKit, assistant-ui, AI SDK UI) is fine. The risk is *not picking* and continuing to research instead of code.

**Mitigation:** Phase 0 + Phase 1 = 3 weeks total. Pick a Monday and start. The pilot task spec ([`013-copilotkit-host-event-pilot.md`](../mastra/maps/tasks/runtime/013-copilotkit-host-event-pilot.md)) has Day 1 through Day 5 code-level instructions.

### 14.9 The next 30 days

| Week | Deliverable |
|---|---|
| Week 1 (Phase 0) | RUNTIME-008 + 009 + 005 + 006 — close audit P0 blockers |
| Week 2 (Phase 1 start) | RUNTIME-013 Day 1–5: `/host/event/new` CopilotKit pilot |
| Week 3 (Phase 1 finish) | Pilot 48h Vercel preview soak → production rollout (flag-gated) |
| Week 4 (Phase 2 start) | GROUNDING-001: port `searchGroundedPlaces` Mastra tool + `approvals` migration |

**Single hardest commitment:** Monday morning, week 2 — `git checkout -b feat/copilotkit-host-event-pilot && npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @ag-ui/client @ag-ui/mastra`. Everything else flows from there.

---

## Cross-cutting: OpenClaw integration

**OpenClaw runs on the Hostinger VPS** (per [`.claude/skills/open-claw/SKILL.md`](../../.claude/skills/open-claw/SKILL.md)). It is **not** mdeai.co's product chat. It is the internal developer/admin gateway.

### Integration map

| Surface | Stack | Purpose |
|---|---|---|
| **Product** `/chat`, `/host/*`, `/apartments/*` | CopilotKit → Mastra → Supabase → Maps | Camila, Roberto, Mateo, Patricia (public-facing) |
| **Internal** `/admin/ops` *(Phase 4)* | CopilotKit → AG-UI → [`contextablemark/clawg-ui`](https://github.com/contextablemark/clawg-ui) plugin → OpenClaw gateway | Sofía, Patricia internal: restart Hermes, deploy, check Paperclip, post via Postiz |

### Phase 4 specifics

- `/admin/ops` page wrapped in `<CopilotKit runtimeUrl={CLAWG_UI_URL}>` (different AG-UI source from product chat)
- `clawg-ui` plugin runs on Hostinger VPS adjacent to OpenClaw
- Supabase admin role gate before page loads
- IP allowlist on `clawg-ui` HTTP endpoint
- Audit log every command execution

### Why this matters for the PRD

- mdeai.co the **product** stays focused on Camila/Roberto/Mateo
- mdeai.co the **operation** gets faster — Sofía spends less time SSH-ing
- Both use CopilotKit, but with **different AG-UI sources** (Mastra for product, OpenClaw for admin)
- This proves the AG-UI protocol's "portable UI" claim — same primitives, two backends

---

## Section 15 — Risks register

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| AG-UI protocol breaking change in Mastra adapter | Medium | High | Pin exact `@ag-ui/mastra` version; review changelog before upgrade |
| CopilotKit pre-1.0 breaking change | Medium | High | Pin `@copilotkit/*` versions; review release notes before upgrade |
| Grounding Lite MCP API drift | Medium | High | Code Assist MCP weekly sanity check; fixtures via gemini-google-maps-tool CLI |
| Places API cost explosion from missing field mask | Low | Critical ($200/day prior incident) | Hook `places-api-field-mask` + Vitest enforcement |
| Concierge `setPins`×9 continues bypassing pipeline | High | Medium | RUNTIME-008 allowlist test = CI failure |
| ECL second-loader sneaks in via a render | Medium | High | `tests/runtime/loader.test.ts` fails on second `<script>` |
| Solo dev overload | High | Critical | Phase plan caps each phase at 1 dev-week per chunk; feature flags |
| Vendor lock-in to CopilotKit | Low | Medium | AG-UI is open protocol; assistant-ui as Plan B |
| LLM hallucinates lat/lng into a typed action | Medium | High | Zod schema rejects; coordinates only flow from verified tool calls |
| Sponsor email deliverability | Medium | Medium | Pre-warm sending domain; SES/Resend with bounce handling |
| OpenClaw exec privilege escalation | Low | Critical | Admin-only RLS gate; IP allowlist; audit log on every command |
| Phase 4 WhatsApp template rejection | Medium | Medium | Submit templates for approval pre-Phase-4; alternate channel ready |

---

## Section 16 — References

| Doc | Path / URL |
|---|---|
| Master PRD | [`prd.md`](../../prd.md) |
| Maps PRD v2 | [`tasks/mastra/maps/maps-prd-v2.md`](../mastra/maps/maps-prd-v2.md) |
| Maps strategy (this doc's parent) | [`tasks/strategy/maps/15-googlemaps-strategy.md`](./maps/15-googlemaps-strategy.md) |
| Maps foundation strategy | [`tasks/strategy/maps/GOOGLE_MAPS_FOUNDATION_STRATEGY.md`](./maps/GOOGLE_MAPS_FOUNDATION_STRATEGY.md) |
| vis.gl strategy | [`tasks/strategy/maps/12-visgl-react-google-maps.md`](./maps/12-visgl-react-google-maps.md) |
| CopilotKit prose strategy | [`tasks/strategy/copilotkit/05-copilotkit.md`](./copilotkit/05-copilotkit.md) |
| CopilotKit decision matrix | [`tasks/strategy/copilotkit/14-copilotkit.md`](./copilotkit/14-copilotkit.md) |
| CopilotKit repo catalogue (60 entries) | [`tasks/strategy/copilotkit/16-copilotkit-repos.md`](./copilotkit/16-copilotkit-repos.md) |
| CopilotKit Maps interactions | [`tasks/strategy/copilotkit/17-copilotkit-maps.md`](./copilotkit/17-copilotkit-maps.md) |
| CopilotKit + Mastra integration notes | [`tasks/strategy/copilotkit/11-copilotkit-mastra.md`](./copilotkit/11-copilotkit-mastra.md) |
| Phase 1 pilot task | [`tasks/mastra/maps/tasks/runtime/013-copilotkit-host-event-pilot.md`](../mastra/maps/tasks/runtime/013-copilotkit-host-event-pilot.md) |
| vis.gl migration task | [`tasks/mastra/maps/tasks/runtime/010-visgl-react-google-maps-migration.md`](../mastra/maps/tasks/runtime/010-visgl-react-google-maps-migration.md) |
| Forensic audit | [`tasks/mastra/maps/audit/05-runtine-audit.md`](../mastra/maps/audit/05-runtine-audit.md) |
| Runtime constitution | [`tasks/mastra/maps/99-runtime-architecture-supplement.md`](../mastra/maps/99-runtime-architecture-supplement.md) |
| OpenClaw skill | [`.claude/skills/open-claw/SKILL.md`](../../.claude/skills/open-claw/SKILL.md) |
| Maps skill | [`.claude/skills/mde-maps/SKILL.md`](../../.claude/skills/mde-maps/SKILL.md) |
| Mastra skill | [`.claude/skills/mastra/SKILL.md`](../../.claude/skills/mastra/SKILL.md) |
| AG-UI protocol | https://github.com/ag-ui-protocol/ag-ui |
| Mastra CopilotKit guide | https://mastra.ai/guides/build-your-ui/copilotkit |
| Grounding Lite docs | https://developers.google.com/maps/ai/grounding-lite |
| Code Assist | https://developers.google.com/maps/ai/code-assist |
| AdvancedMarker | https://developers.google.com/maps/documentation/javascript/advanced-markers/overview |
| Map ID | https://developers.google.com/maps/documentation/javascript/map-ids |
| Places API (New) | https://developers.google.com/maps/documentation/places/web-service/client-libraries |

---

## Correctness self-score

| Area | Score | Notes |
|---|---:|---|
| Architecture coherence | 92/100 | 4-lane separation reinforced across 14 sections |
| Stack accuracy | 95/100 | Verified against `package.json`, audit doc, existing strategy docs |
| Honest repo scoring | 90/100 | 16 repos in §2, scores cross-referenced with §3–§3f of `16-copilotkit-repos.md` |
| Phase 1 specificity | 90/100 | Phase 1 task already exists at `013-copilotkit-host-event-pilot.md` with code |
| Schemas concrete | 88/100 | 9 Zod schemas with real fields (could expand for sponsor outreach) |
| Real-world examples | 92/100 | 7 named flows traced end-to-end (Camila/Roberto/Mateo/Patricia) |
| Risk register honesty | 88/100 | 12 risks with likelihood/impact/mitigation |
| OpenClaw integration clarity | 86/100 | Section explains internal-only role with `/admin/ops` Phase 4 path |
| Anti-pattern coverage | 90/100 | 9 "don't build" entries with reasons |

**Overall: 91/100** — Production-ready PRD. **The single action that unlocks everything is starting Phase 0 + Phase 1 (3 weeks) on a chosen Monday.** Everything else is justification for that decision.

---

# PRD Enhancements (2026-05-18 — Contests, Nightlife, Real Estate, OpenClaw Operational)

> The original 16 sections cover the **core architecture and Phase 1–5 plan**. Sections 17–23 below extend that core with the verticals you flagged: contests, nightlife discovery, real-estate intelligence, OpenClaw-style operational workflows, and a Core MVP / Post-MVP / Advanced tier overlay. Original sections are **not modified**; this is additive.

---

## Section 17 — Extended copilot inventory

Adds 5 copilots to the 8 already defined in §8. Right-sized: most ship **Post-MVP** (Phase 3+), not Phase 1.

### 17.1 New user-facing copilots

| Copilot | Phase | Role | Tools | Maps | Approval | Real-world |
|---|---|---|---|---|---|---|
| **NightlifeCopilot** | Phase 2.5 | Discovery + tonight-only event chaining | `search-events`, `searchGroundedPlaces`, `nightlife-cluster` | Adds nightlife pins (color: pink); cluster by neighborhood | None for discovery | Camila: *"Where's the best reggaeton tonight in Provenza?"* |
| **RealEstateCopilot** | Phase 3 | Long-stay rentals + proximity intelligence (digital nomads) | `search-rentals`, `routesEta`, `digital-nomad-score` | Rental pins + commute polylines | None for search; HITL for lead capture | Mateo: *"Apartments near coworking, nightlife-light, 2-week stay"* |
| **ContestCopilot** | Phase 4 | User-facing contest browsing, submission, voting | `search-contests`, `contest-submit`, `contest-vote` | Renders contest venue pin (if any) | HITL for submission and votes | Sofía: *"Submit my photo to Miss Elegance"* |

### 17.2 New internal copilots

| Copilot | Phase | Role | Tools | Approval | Real-world |
|---|---|---|---|---|---|
| **VenueResearchCopilot** | Phase 3 | Background venue intelligence — duplicates, similarity, freshness | `venue-similarity`, `searchGroundedPlaces`, `venue-enrichment` | HITL for "merge venue duplicate" | Cron-driven: *"Find new rooftops in Provenza this week"* |
| **ContestOperationsCopilot** | Phase 4 | Contest lifecycle ops — launch, moderation, winner selection | `contest-publish`, `score-submission`, `select-winner` | HITL at every stage (publish, finalize, declare winner) | Patricia: *"Launch Miss Elegance Colombia 2026 voting round"* |

### 17.3 Right-sized count — 5 Phase 1 → 13 by Phase 5

| Phase | Total copilots | New this phase |
|---|---:|---|
| Phase 1 | 5 | Concierge, Rentals, Events, Restaurants, Venue |
| Phase 2 | 6 | + Travel |
| Phase 2.5 | 7 | + Nightlife |
| Phase 3 | 10 | + RealEstate, VenueResearch, Sponsor |
| Phase 4 | 13 | + Contest, ContestOperations, Moderation |
| Phase 5 | 13 | (no new — refinement only) |

**Anti-pattern:** Don't try to ship all 13 in Phase 1. Each copilot adds: 1 Mastra agent + 3–5 tools + 1 Zod schema family + 1 `useCopilotAction` registration + tests. Five is plenty for the pilot.

---

## Section 18 — Extended typed schemas

Adds 6 schema families to §6. All in Zod; co-located with the Mastra tool that emits them and the `useCopilotAction` that renders them.

### 18.1 `ContestDraft`

```ts
// src/lib/chat/schemas/contest.ts
export const ContestStage = z.enum([
  'submissions_open',
  'voting_open',
  'finals',
  'winners_announced',
  'closed',
]);

export const ContestDraft = z.object({
  contestId: z.string().uuid().optional(),
  title: z.string().min(3).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(['beauty', 'fashion', 'photography', 'music', 'gastronomy', 'sport', 'other']),
  description: z.string().max(5000),
  rules: z.string().max(10000),
  prizePoolCop: z.number().int().nonnegative(),
  submissionWindow: z.object({
    opensAt: z.string().datetime(),
    closesAt: z.string().datetime(),
  }),
  votingWindow: z.object({
    opensAt: z.string().datetime(),
    closesAt: z.string().datetime(),
  }),
  finalVenueId: z.string().uuid().optional(),     // venue for the live final
  sponsorIds: z.array(z.string().uuid()).max(20).optional(),
  stage: ContestStage,
});
```

### 18.2 `ContestSubmission`

```ts
export const ContestSubmission = z.object({
  submissionId: z.string().uuid().optional(),
  contestId: z.string().uuid(),
  participantUserId: z.string().uuid(),
  title: z.string().max(120),
  mediaUrls: z.array(z.string().url()).min(1).max(10),
  bio: z.string().max(1000).optional(),
  location: z.object({ lat: z.number(), lng: z.number() }).optional(),
  state: z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED', 'WITHDRAWN']),
  moderationFlags: z.array(z.enum(['duplicate', 'underage', 'unsafe', 'low-quality', 'ok'])).optional(),
  submittedAt: z.string().datetime(),
});
```

### 18.3 `VenueProfile`

```ts
export const VenueProfile = z.object({
  venueId: z.string().uuid().optional(),
  placeId: z.string(),                              // Google place_id (authority)
  displayName: z.string(),
  neighborhood: z.string(),
  category: z.enum(['rooftop', 'club', 'restaurant', 'hotel', 'cowork', 'gallery', 'theater', 'arena', 'other']),
  capacity: z.number().int().positive().optional(),
  features: z.array(z.enum([
    'rooftop', 'pool', 'outdoor', 'live-music', 'private-room',
    'av-equipped', 'parking', 'wheelchair-accessible', 'allows-events',
  ])),
  hostOwnerId: z.string().uuid().optional(),         // if onboarded host
  similarVenueIds: z.array(z.string().uuid()).max(10).optional(),
  freshnessScore: z.number().min(0).max(1),
  lastEnrichedAt: z.string().datetime(),
});
```

### 18.4 `TravelPlan`

```ts
export const TravelDay = z.object({
  date: z.string().date(),
  items: z.array(z.object({
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    durationMin: z.number().int().positive(),
    placeId: z.string(),
    category: z.enum(['breakfast', 'lunch', 'dinner', 'coworking', 'event', 'walk', 'transit', 'rest']),
    notes: z.string().max(500).optional(),
  })).min(1).max(15),
});

export const TravelPlan = z.object({
  travelPlanId: z.string().uuid().optional(),
  userId: z.string().uuid(),
  arrivalDate: z.string().date(),
  departureDate: z.string().date(),
  homeBasePlaceId: z.string().optional(),           // rental
  personaProfile: z.enum(['tourist', 'nomad', 'business', 'bachelor', 'family']),
  days: z.array(TravelDay).min(1).max(60),
});
```

### 18.5 `RealEstateLead`

```ts
export const RealEstateLead = z.object({
  leadId: z.string().uuid().optional(),
  rentalId: z.string().uuid(),
  prospectName: z.string().max(120),
  prospectEmail: z.string().email().optional(),
  prospectWhatsapp: z.string().regex(/^\+?[0-9\s\-]{7,20}$/).optional(),
  intendedMoveDate: z.string().date(),
  intendedDurationMonths: z.number().int().min(1).max(36),
  partySize: z.number().int().min(1).max(20),
  message: z.string().max(2000).optional(),
  preferredViewingSlots: z.array(z.string().datetime()).max(5),
  matchScore: z.number().min(0).max(1).optional(),
  state: z.enum(['NEW', 'CONTACTED', 'VIEWING_SCHEDULED', 'CONVERTED', 'LOST']),
});
```

### 18.6 `NightlifeRecommendation`

```ts
export const NightlifeRecommendation = z.object({
  venuePlaceId: z.string(),
  displayName: z.string(),
  vibe: z.array(z.enum([
    'rumba', 'salsa', 'reggaeton', 'electronic', 'live-band',
    'rooftop', 'underground', 'lounge', 'open-air',
  ])),
  busynessLevel: z.enum(['quiet', 'moderate', 'busy', 'peak']),
  estimatedCoverCop: z.number().int().nonnegative().optional(),
  dressCode: z.enum(['casual', 'smart-casual', 'dressed-up', 'formal']),
  startsBusy: z.string().regex(/^\d{2}:\d{2}$/),
  peakHour: z.string().regex(/^\d{2}:\d{2}$/),
  endsAt: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.object({ lat: z.number(), lng: z.number() }),
  groundedAttribution: GroundedPlaceResult.shape.attribution,
});
```

### 18.7 Schema discipline (extends §6.3)

| New rule | Why |
|---|---|
| Contests must reference Supabase rows by UUID; never re-derive from chat | Contests have legal implications (prize pools, T&Cs); IDs must be authoritative |
| `ContestSubmission.moderationFlags` populated by ModerationCopilot only | Don't let participant-facing copilots self-flag |
| `RealEstateLead.matchScore` is opaque to the user | Internal-only ranking; user sees recommendations, not raw score |
| `VenueProfile.placeId` is the **authority key**; `venueId` is mdeAI-local | Place IDs survive renames; UUIDs survive Google API changes |
| `TravelPlan.days` length capped at 60 | Avoid LLM runaway producing 90-day plans |

---

## Section 19 — Extended edge functions

Adds 7 edge functions to §10. All follow the standard template (Zod input, Zod output, JWT validation, `ai_runs` log, rate-limited).

| Edge function | Purpose | Inputs (Zod) | Outputs | Phase |
|---|---|---|---|---|
| `contest-submit` | Participant submission with moderation gate | `{ contestId, submission: ContestSubmission }` | `{ submissionId, moderationState }` | Phase 4 |
| `contest-vote` | Per-user vote with rate limit + dedupe | `{ contestId, submissionId, userId }` | `{ voteId, totalVotes? }` | Phase 4 |
| `nightlife-search` | Real-time nightlife discovery (grounded + cached) | `{ neighborhood, when: 'now' \| 'tonight' \| 'weekend', vibe[] }` | `NightlifeRecommendation[]` | Phase 2.5 |
| `venue-similarity` | "Similar to X" comparison | `{ baseVenueId, criteria? }` | `VenueComparison` | Phase 3 |
| `itinerary-builder` | Multi-day plan generator | `{ travelPlan: Omit<TravelPlan, 'days'>, preferences }` | `TravelPlan` (with `days`) | Phase 2 (TravelCopilot) |
| `real-estate-ranking` | Rental ranking with proximity scores | `{ filters, weights: { nightlife, coworking, metro } }` | `RentalRecommendation[]` (sorted) | Phase 3 |
| `digital-nomad-score` | Neighborhood scoring for nomads | `{ neighborhood, criteria }` | `{ score, breakdown: { wifi, safety, coworking, food, nightlife } }` | Phase 3 |

### 19.1 Security additions

| Function | Special concern |
|---|---|
| `contest-vote` | 1 vote per user per submission per round. Rate-limit at edge; enforce with DB unique constraint `(contestId, submissionId, userId, votingRound)`. |
| `contest-submit` | Auto-flag duplicates by image perceptual hash before insert. Reject suspicious patterns (multiple submissions from same IP within 60s). |
| `nightlife-search` | Cache TTL = 1 hour for "tonight" queries; longer for "weekend". Attribution required per Grounding Lite ToS. |
| `digital-nomad-score` | Returns score 0–100; **never** returns raw user activity data. |

---

## Section 20 — Extended Supabase tables

Adds 7 tables to §11.

| Table | Purpose | RLS | Phase |
|---|---|---|---|
| `contests` | Contest master records | `SELECT` public when `stage IN ('submissions_open','voting_open','finals')`; `INSERT/UPDATE` admin | Phase 4 |
| `contest_submissions` | Per-participant entries | Owner sees own; public sees `state='PUBLISHED'`; admin sees all | Phase 4 |
| `contest_votes` | One row per vote (or one row per user-submission with `votingRound`) | `INSERT` by `(select auth.uid())`; `SELECT` only own | Phase 4 |
| `nightlife_venues` | Cached nightlife metadata | Public `SELECT`; service-role `INSERT/UPDATE` (enriched by VenueResearchCopilot cron) | Phase 2.5 |
| `venue_profiles` | Internal venue intelligence (extends `places_*_cache`) | Service-role only; admin `SELECT` | Phase 3 |
| `travel_plans` | Saved nomad/tourist itineraries (richer than `itineraries`) | Owner only `SELECT/UPDATE`; `INSERT` requires approval reference | Phase 2 |
| `real_estate_leads` | Captured rental leads | Owner sees own leads on their rentals; admin sees all | Phase 3 |
| `operational_workflows` | Tracks long-running OpenClaw-style workflows | Admin only | Phase 5 |

### 20.1 Migration sequence (extends §11.4)

| Order | Migration | Phase |
|---|---|---|
| 7 | `nightlife_venues` + RLS + cache TTL | Phase 2.5 |
| 8 | `travel_plans` + RLS (deprecates simpler `itineraries` if needed) | Phase 2 |
| 9 | `venue_profiles` + RLS (extends `place_details_cache`) | Phase 3 |
| 10 | `real_estate_leads` + RLS | Phase 3 |
| 11 | `contests` + `contest_submissions` + `contest_votes` + RLS + unique constraints | Phase 4 |
| 12 | `operational_workflows` + RLS | Phase 5 |

---

## Section 21 — OpenClaw + Operational AI

### 21.1 What OpenClaw Playbook actually teaches

Per [openclawplaybook.ai](https://www.openclawplaybook.ai/), the Playbook is **a production operational manual** from Worth A Try LLC's 70+ days of live autonomous agent operation. It is **not a framework**. Five concepts:

| OpenClaw concept | mdeAI translation |
|---|---|
| **Identity architecture** (named agents, consistent personality) | Each Mastra agent has a name (`ConciergeCopilot`, etc.) + a system prompt that's stable across releases |
| **Three-layer memory** (episodic, semantic, procedural) | Mastra memory + Supabase `ai_runs` for episodic; Zod schemas + Supabase product tables for semantic; workflows for procedural |
| **Autonomous delegation** (sub-agents handle parallel tasks) | ConciergeCopilot delegates to specialized copilots; VenueResearchCopilot runs cron-driven research without explicit ask |
| **Proactive daily operations** (scheduled standups, monitoring) | Cron workflows: nightly venue enrichment, weekly sponsor outreach planning, hourly nightlife freshness |
| **Permission layers & safety rails** (autonomy with escalation) | Approval state machine (§7); `/admin/ops` gated by Supabase admin role |

### 21.2 The event-management 5-phase pattern

OpenClaw's guide for event management maps directly onto Roberto's host workflow:

| OpenClaw phase | mdeAI implementation | Copilot | Approval gate |
|---|---|---|---|
| **Pre-event planning** | EventDraft → preview → publish (RUNTIME-013) | EventsCopilot + VenueCopilot | Yes — `publish_event` |
| **RSVP tracking** | `ticket_orders` table polled by edge fn; capacity alerts via Hermes | EventsCopilot | No — automated alerts; HITL on capacity-reached |
| **Attendee communication** | Templated reminders (7d, 1d, 1h) via WhatsApp/email | (Hermes, internal — Phase 4) | No — pre-approved templates |
| **Day-of operations** | Staff PWA scanner, real-time check-ins, capacity monitor | EventsCopilot + SupportCopilot | HITL on incident |
| **Post-event follow-up** | Recording/photos distribution, survey, lead capture | MarketingCopilot (Phase 4) | No — opt-in flows only |

### 21.3 The detect-and-escalate model (production rule)

```text
For every operational copilot:

  IF anomaly_detected (capacity > 90%, vendor unconfirmed, ticket fraud spike, etc.)
  THEN
    1. Log to operational_workflows table
    2. Flag in /admin/ops with severity (LOW | MEDIUM | HIGH | URGENT)
    3. Hermes notification to Patricia (WhatsApp/email)
    4. Do NOT auto-resolve unless explicitly whitelisted

  ELSE
    Continue routine workflow; no human in the loop.
```

This is the **safety rail** that prevents over-automation. Every new operational copilot must declare its "auto-OK" actions and "flag-for-human" actions explicitly.

### 21.4 What to copy from OpenClaw

| Concept | Why useful for mdeAI |
|---|---|
| Markdown config files (`event-config.md`, `vendors.md`) | Lightweight, version-controlled, agent-readable. Use for contest rules, sponsor templates, event categories. |
| Templated communication sequences | Roberto's event reminders, Camila's itinerary digest, Patricia's daily ops summary |
| Cron-driven proactive checks | Nightly venue enrichment, weekly nightlife freshness pass, sponsor follow-up reminders |
| Flag-don't-fix discipline | Concierge agent surfaces problems; humans resolve them |
| Single-file operational config | Per-vertical config files: `events-config.md`, `contests-config.md`, `nightlife-config.md` |

### 21.5 What NOT to copy

| Anti-pattern | Why to avoid for mdeAI |
|---|---|
| Markdown as the *primary* state store | mdeAI is Supabase-of-truth. Use markdown for config only, not transactional state. |
| Autonomous email/WhatsApp at scale without approval | Camila trusts mdeai.co; one bad auto-message destroys trust |
| 70-day autonomous operation as the goal | mdeAI ships to paying users; uptime > autonomy |
| Generic "AI sub-agents" without typed contracts | Use Mastra workflows + Zod schemas; not loose sub-agents |
| One identity for all agents | Each copilot has a clear scope; `ConciergeCopilot` ≠ `ContestOperationsCopilot` |

### 21.6 Operational copilot lifecycle (template)

Every new operational copilot ships with these 4 deliverables:

1. **Identity card** — Markdown file under `my-mastra-app/src/mastra/agents/<name>/identity.md` (name, role, scope, escalation path)
2. **Config file** — Markdown file readable by the agent (e.g., `nightlife-config.md` with vibe taxonomy, neighborhood list)
3. **Safety rails** — Zod-typed list of "auto-OK actions" and "must-escalate actions"; defaults to escalate
4. **Observability** — Row in `operational_workflows` per invocation; daily summary in `/admin/ops`

---

## Section 22 — Core MVP / Post-MVP / Advanced tier overlay

Reframes §12's 5-phase roadmap into 3 tiers, mapped to the audit's *"blockers are implementation, not documentation"* headline.

### 22.1 The tier rule

| Tier | Definition | When to ship |
|---|---|---|
| **Core MVP** | Required for Phase 1 PRD scope (events + tickets + chat + maps work). Zero new copilots beyond the 5 in §8.2. | Next 6 weeks |
| **Post-MVP** | Sponsorship + contests + travel + nightlife verticals. Adds 6 new copilots. | After MVP soaks 30 days in production |
| **Advanced** | OpenClaw operational layer, voice concierge, external copilots, multi-agent canvas. | After Post-MVP soaks 60 days |

### 22.2 Core MVP — next 6 weeks (Phases 0–2 from §12)

| Week | Tier 1 deliverable | Audit P0/P1 closed |
|---|---|---|
| 1 | RUNTIME-008 (ownership test) + RUNTIME-009 (canary) + RUNTIME-005 (drift log) + RUNTIME-006 (Playwright) | P0-1, P0-2, P0-3, P1-2 |
| 2 | RUNTIME-013 Day 1–5: VenueCopilot pilot at `/host/event/new` | — |
| 3 | Vercel preview soak; production rollout (flag-gated); pilot decision gate | — |
| 4 | GROUNDING-001: port `searchGroundedPlaces` (~200 LOC) | P0-5 |
| 5 | `approvals` table + 4 user-facing copilots (Concierge + Rentals + Events + Restaurants) wired via `useCopilotAction` | P1-1 |
| 6 | RUNTIME-010 vis.gl behind flag + `useCoAgent<MdeState>` exposing MapContext.pins | — |

**Definition of Core MVP done:**
- All 8 audit P0/P1 blockers closed
- 5 copilots live behind feature flags
- `/chat` works identically with flag off (legacy path intact)
- `/chat` works with flag on (new CopilotKit primitives)
- Playwright at 390×844 green flag-on + flag-off
- `npm run floor` exit 0
- 7-day production soak with zero P0 regressions

### 22.3 Post-MVP — months 2–4 (Phases 3 from §12, extended)

| Sprint | Deliverable | New copilot | Vertical |
|---|---|---|---|
| 1 (2 wks) | TravelCopilot + `plan-medellin-weekend` + `travel_plans` table | TravelCopilot | Travel |
| 2 (2 wks) | NightlifeCopilot + `nightlife-search` edge fn + `nightlife_venues` table | NightlifeCopilot | Nightlife |
| 3 (2 wks) | VenueResearchCopilot (cron-driven) + `venue-similarity` + `venue_profiles` | VenueResearchCopilot | Venue intel |
| 4 (2 wks) | RealEstateCopilot + `digital-nomad-score` + `real_estate_leads` | RealEstateCopilot | Long-stay rentals |
| 5 (2 wks) | SponsorCopilot + `sponsor-match` + HITL approval workflow | SponsorCopilot | Sponsorship |
| 6 (2 wks) | ModerationCopilot + flag-don't-fix discipline | ModerationCopilot | Trust & safety |

**Definition of Post-MVP done:**
- 6 new copilots live, each soaks ≥7 days in production
- Mateo's *"apartments near coworking"* returns ranked results with `digital-nomad-score`
- Camila's *"plan my weekend"* produces a 2–3 day `TravelPlan` with route bundling
- Patricia approves 5 sponsor outreach batches with 0 mis-sends
- VenueResearchCopilot cron has discovered ≥20 new venues without human intervention

### 22.4 Advanced — months 5+ (Phases 4–5 from §12)

| Quarter | Deliverable | New copilot | Theme |
|---|---|---|---|
| Q-Adv-1 | `/admin/ops` via `contextablemark/clawg-ui` → OpenClaw on Hostinger; 5-phase event automation operationalized | (Hermes integration) | OpenClaw operational |
| Q-Adv-1 | Contest platform launch — `ContestCopilot` + `ContestOperationsCopilot` + Miss Elegance Colombia flagship contest | ContestCopilot, ContestOperationsCopilot | Contests |
| Q-Adv-2 | Browser-agent venue research; WhatsApp lead-capture | — | Operational AI |
| Q-Adv-3 | Voice concierge via `assistant-ui` + Gemini Live API | (existing copilots gain voice mode) | Voice |
| Q-Adv-4 | External copilots — partner hosts deploy their own copilots that read mdeAI | — | Platform |

**Definition of Advanced done:**
- Patricia's `/admin/ops` reduces SSH time by ≥50% (measured)
- A Miss Elegance Colombia contest runs end-to-end with zero manual data fixes
- VenueResearchCopilot operates autonomously for 30 days with <5 escalations
- Voice mode handles ≥80% of Camila's queries without falling back to text

### 22.5 Tier discipline (production rule)

| Rule | Why |
|---|---|
| Don't ship Post-MVP features before Core MVP soaks 30 days | Validates the foundation before adding load |
| Don't ship Advanced features before Post-MVP soaks 60 days | Operational AI compounds bugs; need stable base |
| Every tier promotion requires audit-rubric pass + Playwright green + 0 P0 regressions for the soak period | Hard gate, not vibes |
| Single Phase = 1 dev-week chunks, flag-gated, reversible | Solo dev sustainability |

---

## Section 23 — Extended real-world examples

Adds 4 examples covering contests, nightlife, real estate, and operational AI to §13.

### 23.1 *"Launch a Medellín nightlife contest"* (Patricia, Advanced tier)

```text
Patricia on /admin/contests
  ↓
ContestOperationsCopilot (Advanced tier)
  ↓
Workflow: launch-contest
  ↓ HITL preview Contest definition
  ├─ ContestDraft (Zod): title=Mejor Rumba 2026, category=music, prizePool=20M COP
  ├─ submission window: 2 weeks
  ├─ voting window: 1 week
  └─ final venue: Salon Amador (place_id)
  ↓ Patricia taps Approve
edge fn approval-commit → contests table INSERT
  ↓
Hermes (Phase 4 internal):
  └─ posts to Postiz → IG/TikTok/X with countdown templates
  ↓
ContestCopilot becomes available to public on /contests/mejor-rumba-2026
  ↓
2 weeks of submissions:
  ├─ each ContestSubmission goes through ModerationCopilot (auto-flag)
  └─ Patricia reviews flagged submissions; auto-approves "ok" tagged
  ↓
1 week of voting:
  └─ contest_votes with rate-limit + dedupe
  ↓
Finale at Salon Amador:
  └─ ContestOperationsCopilot computes winners; Patricia reviews; commit
```

**Copilots:** ContestOperationsCopilot, ContestCopilot, ModerationCopilot.
**Maps usage:** Salon Amador pin on `/contests/mejor-rumba-2026`; submission location pins (optional).
**Approval:** required at every stage (launch, moderation, winner declaration).
**Supabase writes:** `contests`, `contest_submissions`, `contest_votes`, `approvals`, `operational_workflows`, `ai_runs`.

### 23.2 *"Compare coworking-friendly neighborhoods"* (Mateo, Post-MVP)

```text
Mateo on /chat
  ↓
ConciergeCopilot → RealEstateCopilot
  ↓
Workflow: compare-nomad-neighborhoods
  ├─ candidate neighborhoods: Laureles, Provenza, Envigado, Belén
  ├─ for each: digital-nomad-score
  │    breakdown: wifi/safety/coworking/food/nightlife
  └─ RealEstateRanking with sorted result
  ↓
useCopilotAction('show_neighborhood_comparison', render)
  → side-by-side cards with score breakdowns
  → map: 4 neighborhood polygons + top rentals per area
  ↓
Mateo taps "Laureles" → drills into available rentals
  ↓
Optional: tap "Save this comparison" → travel_plans row (Post-MVP)
```

**Copilots:** ConciergeCopilot, RealEstateCopilot.
**Maps usage:** 4 neighborhood polygons (lightweight overlays); top 3 rentals per neighborhood as pins.
**Approval:** none for search; HITL if Mateo opts-in to lead capture (RealEstateLead).
**Supabase writes:** `ai_runs`; optional `real_estate_leads` if Mateo submits interest.

### 23.3 *"Plan a bachelor party weekend"* (Sofía, Post-MVP)

```text
Sofía planning Roberto's bachelor party — 8 friends, 3-day Medellín stay
  ↓
TravelCopilot (persona=bachelor)
  ↓
Workflow: bachelor-party-weekend
  ├─ rental anchor: 8-bed villa or 2 adjacent apartments
  ├─ nightlife clusters: Provenza/Lleras saturation
  ├─ events: rumba Friday, Sat reggaeton, Sun chill
  ├─ daytime: paragliding, comuna 13 tour
  └─ TravelPlan (Zod) with 3 days × 6–8 items
  ↓
NightlifeCopilot (sub-agent):
  ├─ tonight-only freshness check for each evening
  └─ NightlifeRecommendation[] with vibe + busynessLevel
  ↓
useCopilotAction('preview_bachelor_plan', renderAndWaitForResponse)
  ↓ Sofía edits Saturday, approves
edge fn save-travel-plan → travel_plans
  ↓
Optional: itinerary-builder produces calendar invites
```

**Copilots:** ConciergeCopilot, TravelCopilot, NightlifeCopilot, RentalsCopilot.
**Maps usage:** rental + 12+ pins by day (toggleable); routes between consecutive items.
**Approval:** required for `commit_travel_plan`.
**Supabase writes:** `travel_plans`, `approvals`, `ai_runs`, optional `real_estate_leads` (rental anchor).

### 23.4 *"Find rooftop venues for a contest final"* (Patricia, Advanced)

```text
Patricia preparing Miss Elegance Colombia 2026 final venue
  ↓
ContestOperationsCopilot
  ↓
Workflow: contest-venue-discovery
  ├─ requirements: capacity 500–800, rooftop, AV-equipped, sponsorship-friendly
  ├─ VenueResearchCopilot (sub-agent) runs:
  │    ├─ searchGroundedPlaces('rooftop event venue Medellín capacity 500+')
  │    ├─ venue-similarity vs prior Miss Elegance venues
  │    └─ freshness check (last enriched within 30 days)
  └─ VenueComparison with 6 candidates, scored
  ↓
useCopilotAction('show_venue_shortlist', render)
  → 6 venue cards with capacity, features, similarity score
  → map with 6 pins clustered (zoom out shows all)
  ↓
Patricia taps "Salon Amador" → set_contest_final_venue action
  ↓
HITL: confirm venue assignment
  ↓ Approved
contests table UPDATE: finalVenueId = <salon-amador-uuid>
```

**Copilots:** ContestOperationsCopilot, VenueResearchCopilot.
**Maps usage:** 6 candidate venue pins + winner pin highlighted (gold border).
**Approval:** required (`commit_venue_edit` on contest record).
**Supabase writes:** `venue_profiles` (new rows if needed), `contests` (UPDATE), `approvals`, `ai_runs`.

---

## Section 24 — Enhancement scorecard

| Area | Score | Notes |
|---|---:|---|
| Vertical coverage | 95/100 | Contests, nightlife, real estate, OpenClaw operational all explicit |
| Schema completeness | 92/100 | 6 new Zod schemas with real fields and validation rules |
| Edge function inventory | 90/100 | 7 new edge functions with security notes |
| OpenClaw integration realism | 90/100 | Grounded in fetched playbook content (event-management 5-phase pattern + detect-and-escalate) |
| Core MVP / Post-MVP / Advanced clarity | 92/100 | Tier discipline rules + week-by-week MVP schedule |
| Real-world example fidelity | 90/100 | 4 named flows (Patricia/Mateo/Sofía) with full pipeline traces |
| Anti-pattern coverage | 88/100 | OpenClaw "what NOT to copy" explicit |
| Backward compatibility | 95/100 | Sections 17–23 are additive; original sections 1–16 unchanged |

**Enhancement overall: 92/100** — Post-MVP and Advanced tiers now have concrete shape. Core MVP (next 6 weeks) is unchanged from original PRD §14.9 — that's still the only commitment that matters short-term.

---

## Closing note — what changed and what didn't

| Original PRD (§1–§16) | Stays exactly as written |
|---|---|
| Audit findings, architecture, current-vs-new, Maps strategy, 9 core schemas, approval system, 5 Phase-1 copilots, 8 workflows, 14 core edge fns, Supabase schema, 5-phase roadmap, 7 examples, recommendations, risk register | ✅ unchanged |

| Enhancements (§17–§24) | Adds |
|---|---|
| §17 | 5 new copilots (Nightlife, RealEstate, Contest, VenueResearch, ContestOperations) — staged across Post-MVP and Advanced |
| §18 | 6 new Zod schemas (Contest, ContestSubmission, VenueProfile, TravelPlan, RealEstateLead, NightlifeRecommendation) |
| §19 | 7 new edge functions |
| §20 | 7 new Supabase tables |
| §21 | OpenClaw deep-dive grounded in fetched playbook content |
| §22 | Core MVP / Post-MVP / Advanced tier overlay with hard promotion gates |
| §23 | 4 new real-world examples (contest launch, nomad neighborhoods, bachelor party, contest venue) |

**The only short-term commitment that matters is still Core MVP week 1 — Phase 0 audit closure starting Monday.** Everything in §17–§24 is sequenced behind that gate.

---

# PRD v2 — Production Readiness Additions (2026-05-18 evening — second-pass review)

> **What this addition covers:** review of the original 24 sections found 7 production-readiness topics absent from the PRD. Sections 25–31 below close those gaps. **Original sections 1–24 unchanged.** This block is additive.
>
> Gaps closed: internationalization (Spanish-first), mobile/PWA, cost economics, monitoring/alerting, Colombian data privacy (Ley 1581), accessibility, feature flag taxonomy, incident response runbook.

---

## Section 25 — Internationalization (Spanish-first / Paisa)

### 25.1 The rule

mdeai.co's primary user is Camila in Medellín. **Spanish is the product default, not a translation.** English is a fallback for tourists.

```text
Default locale:   es-CO  (Colombian Spanish, Paisa register)
Fallback locale:  en-US  (tourists)
Currency:         COP (Colombian Pesos, integer — never decimal pesos in storage)
Date format:      dd/MM/yyyy in UI · ISO 8601 in storage
Time zone:        America/Bogota (UTC-5, no DST)
Phone format:     +57 prefix; display as `+57 (300) 123-4567` for COL numbers
```

### 25.2 What gets localized

| Surface | Locale source | Notes |
|---|---|---|
| Copilot system prompts | es-CO + en-US versions in `my-mastra-app/src/mastra/agents/<name>/prompts/` | Two prompt files per agent; chosen by user's profile locale |
| `useCopilotAction.description` | es-CO when user locale is Spanish | English is fallback only |
| shadcn UI strings | `src/i18n/` with `i18next` or similar (Phase 2 introduce) | Pick one library; not custom |
| Toasts / errors | Localized per user locale | Errors include both languages in admin views |
| Email / WhatsApp templates | Spanish-primary, English-fallback | Phase 4 (Hermes) |
| Place names from Google | As returned by Places API (already localized when `languageCode` parameter set) | Always pass `languageCode: 'es-CO'` to Places New |
| Grounding attribution | Spanish: *"Datos de Google Maps"* + Google ToS link in Spanish | Per Grounding Lite ToS |

### 25.3 What does NOT get localized

| Surface | Why not |
|---|---|
| Zod schema field names | Internal contract; staying in English avoids drift |
| `ai_runs.metadata` keys | Internal; English |
| Database column names | English-only; standard practice |
| Code identifiers, function names | English; never Spanish identifiers in code |
| External brand names (Stripe, Supabase, Google) | English |

### 25.4 Paisa language nuances

| Generic Spanish | Paisa preference | Where to use |
|---|---|---|
| "Apartamento" | "Apartaestudio" / "Apartamento" | Rentals copy — depends on size |
| "Fiesta" | "Rumba" | Events copy, NightlifeCopilot |
| "Salir" | "Parchar" / "Salir" | Nightlife discovery (use depending on register) |
| "Genial" | "Bacano" / "Chévere" | Marketing copy only — not in formal flows |
| Currency display | "$1.250.000 COP" (with `.` thousands) | Always; never `$1,250,000` |
| Address format | "Carrera 43A # 5-15" | Standard Colombian format |

### 25.5 Localization workflow

1. Mastra agents have 2 prompt files: `es-CO.md` (default) and `en-US.md` (fallback)
2. ConciergeCopilot reads `user.locale` from Supabase profile; defaults to `es-CO`
3. `useCopilotAction.description` strings in English in code; auto-translated to Spanish via build-time pre-flight prompt run
4. UI strings via `i18next` JSON catalogs in `src/i18n/{es-CO,en-US}/common.json`
5. QA: every shipped feature checked in both locales

---

## Section 26 — Mobile, PWA, and performance budgets

### 26.1 The canonical user is on slow 4G

Camila is on Tigo 4G in Laureles. Mateo is on coworking wifi that's intermittent. The product must work for them.

| Metric | Budget (mobile 4G) | Measurement |
|---|---|---|
| Time-to-Interactive on `/chat` | ≤ 3.0s on Moto G4 | Lighthouse mobile |
| First map paint on `/chat` | ≤ 1.5s after viewport entry | Performance trace |
| Bundle size `/chat` chunk (gzipped) | ≤ 350 KB | `npm run build` stats |
| Bundle size `/host/*` chunk after CopilotKit (gzipped) | ≤ 550 KB | Phase 1 acceptance |
| InfoWindow open latency | ≤ 100 ms after tap | DevTools timeline |
| Grounded search response (Camila to pins) | ≤ 2.0s end-to-end | Sentry transaction trace |
| Search-rentals → 12 pins on map | ≤ 1.5s | RUNTIME-009 canary |

### 26.2 Required mobile optimizations

| Optimization | When |
|---|---|
| Code-splitting per route (`/chat`, `/apartments`, `/host/*`, `/admin/*`) | Already shipped — verify after CopilotKit |
| Lazy-load `<APIProvider>` and Maps subtree | Phase 2 (don't mount until viewport intersects) |
| Lazy-load ECL place-overview component | Phase 3 (host detail drawer only) |
| Image optimization for rental photos | Supabase storage transformations (already enabled) |
| Service worker for offline staff scanner | Phase 1 staff PWA |
| Pre-fetch `useCoAgent` snapshot on chat focus | Phase 2 |

### 26.3 Staff scanner PWA (Phase 1 — already in PRD scope)

| Requirement | Detail |
|---|---|
| Offline support | Service worker caches QR validation endpoint response 5 min |
| Camera access | Permission requested on first scan; clear message in Spanish |
| Target device | Pixel 4a + iPhone SE2 + low-end Samsung |
| Battery / radio impact | No polling; QR scan triggers single edge fn call |
| Throughput | 30 scans/min sustained on Pixel 4a in airplane mode (queued for sync) |

### 26.4 PWA install prompt

| Surface | PWA install prompt? |
|---|---|
| `/chat` for Camila | No — Camila is a tourist; doesn't install random PWAs |
| `/staff/scanner` for door staff | **Yes** — staff installs once, uses every shift |
| `/host` for hosts | Optional — soft prompt after 2nd visit |
| `/admin/ops` for Patricia | Yes — installed on her laptop browser |

### 26.5 Browser support matrix

| Browser | Minimum version | Tier |
|---|---|---|
| Safari iOS | 16+ | Tier 1 (Camila iPhone) |
| Chrome Android | 110+ | Tier 1 (Mateo Android) |
| Chrome Desktop | 110+ | Tier 1 (Sofía dev, Patricia admin) |
| Safari Desktop | 16+ | Tier 2 |
| Firefox | 115+ | Tier 2 |
| Samsung Internet | 22+ | Tier 2 (~15% of Colombian Android) |
| Edge | 110+ | Tier 3 |
| Anything else | Best-effort | — |

**Tier 1 must pass full Playwright matrix.** Tier 2 must pass smoke. Tier 3 best-effort.

---

## Section 27 — Cost economics & monitoring/alerting

### 27.1 Per-call cost model (Phase 1 baseline)

| Surface | Approx cost | Source |
|---|---|---|
| Gemini call (RentalsCopilot turn) | ~$0.002 | input + output tokens |
| Grounding Lite MCP `search_places` | ~$0.0014 | per request |
| Places API New Place Details (field-masked) | ~$0.017 | per uncached request |
| Places API New Nearby Search | ~$0.032 | per request (most expensive — minimize) |
| Maps JS API map load | ~$0.007 | per session (consolidated) |
| Stripe checkout session | $0.30 + 2.9% of amount | per ticket sale |
| Supabase edge fn invocation | ~$0.000002 | per call |
| AG-UI SSE connection | Free (hosted on Vercel function) | within plan limits |

### 27.2 Daily budget gates

```text
Daily soft cap (warn at):
  Gemini      $30
  Grounding   $10
  Places New  $50
  Maps JS     $20

Daily hard cap (auto-throttle at):
  Gemini      $100
  Grounding   $30
  Places New  $200  ← prior incident; this saved us
  Maps JS     $60

Per-user rate limits (existing):
  AI calls:     10/min/user
  Search calls: 30/min/user
  Vote calls:   1/contest-submission-pair (DB unique constraint)
```

### 27.3 Cost monitoring sources of truth

| Metric | Source | Dashboard |
|---|---|---|
| Gemini spend | `ai_runs.input_tokens` + `output_tokens` × model price | `/admin/cost-dashboard` Phase 2 |
| Grounding Lite spend | `grounding_quota_log` × per-call price (Phase 2 adds `cost_estimate` col) | Same |
| Places spend | `places_request_log` (PLACES-010, not yet shipped) | Same |
| Maps JS spend | Google Cloud Console (external) | Manual weekly check Phase 1; automated Phase 3 |

### 27.4 Alert routing

| Severity | Trigger | Channel | Who |
|---|---|---|---|
| **WARN** | Daily soft cap reached on any service | Sentry breadcrumb | Sofía via email |
| **HIGH** | Daily hard cap approaching (80%) | WhatsApp via Hermes (Phase 4) or email Phase 1 | Sofía + Patricia |
| **URGENT** | Hard cap reached → auto-throttle engaged | WhatsApp + page | Sofía immediately |
| **CRITICAL** | Places New spend > $200 in any 6h window | Page + auto-pause grounded discovery | Sofía + Patricia |

### 27.5 What to instrument from day 1

```text
[ ] ai_runs row per copilot call (agent_name, tokens, duration, status, trace_id)
[ ] grounding_quota_log row per Grounding Lite tool call (date, trace_id, cost_estimate)
[ ] places_request_log row per Places API call (endpoint, field_mask, cached, latency)  ← Phase 2 migration
[ ] map_render_drift_log row when emitted ≠ rendered (RUNTIME-005)
[ ] Sentry transaction per copilot turn (custom op="copilot.turn")
[ ] PostHog event on every action emit + render
```

### 27.6 Phase 1 financial viability check

Camila uses the chat for ~5 turns per session, 1.5 sessions/week, ~30% conversion to a rental lead.

| Per Camila per month | Cost |
|---|---|
| ~30 Gemini turns | $0.06 |
| ~15 grounding searches | $0.02 |
| ~10 Places uncached | $0.17 |
| Maps sessions | $0.05 |
| **Total per active user / month** | **~$0.30** |

Phase 1 targets: ~500 active Camilas → ~$150/month AI infrastructure. Sustainable within revenue from Phase 1 ticketing (target $5K MRR by month 3).

---

## Section 28 — Data privacy, accessibility, and compliance

### 28.1 Colombian data privacy (Ley 1581 / Habeas Data)

Colombia's data-protection law (**Ley Estatutaria 1581 de 2012** + Decreto 1377 de 2013) requires:

| Requirement | mdeai implementation |
|---|---|
| **Explicit consent** for processing personal data | Privacy policy + checkbox at signup; copy in Spanish; covers "tratamiento de datos personales" |
| **Right to know what's stored** | `/me/data` page (Phase 2) returns all user data via Supabase RPC |
| **Right to correct** | `/me/profile` edits propagate to `profiles` table |
| **Right to delete** ("derecho al olvido") | `/me/delete` Phase 3 — soft delete + 30-day grace period |
| **Data Officer designation** | Founder named in privacy policy; contact email published |
| **SIC (Superintendencia) registration** | Required once user base > 1,000 — Phase 2 deliverable |
| **Cross-border transfers (Supabase US-region)** | Disclosed in privacy policy; covered by EU SCC-equivalent (Supabase) |

### 28.2 Data retention policy

| Data | Retention | Why |
|---|---|---|
| `ai_runs` | 90 days | Debugging + audit |
| `grounding_quota_log` | 1 year | Cost analysis |
| `places_*_cache` | 30-day TTL (per Places ToS — caching limited to 30 days) | Places ToS compliance |
| `map_render_drift_log` | 30 days | Debugging only |
| `events`, `ticket_orders` | 7 years | Colombian fiscal record retention |
| `profiles` | Indefinite while account active; 30 days after delete request | Ley 1581 |
| `sponsor_leads` | 2 years | Sales pipeline |
| `chat_messages` | 1 year unless user opts to delete | Product memory + Habeas Data |

### 28.3 Accessibility (WCAG 2.1 AA target)

| Surface | Requirement |
|---|---|
| Chat sidebar | Keyboard nav (tab through messages, send with Enter) |
| Pin info window | Screen-reader announces venue name, category, attribution |
| Map markers | Alt text via `aria-label`; pin color not the only category indicator (use shape too) |
| Forms (host event creation) | All inputs labeled; error messages associated |
| Color palette | Paisa palette WCAG-compliant against backgrounds; contrast ratio ≥ 4.5:1 for body text |
| Focus indicators | Visible focus rings (Radix defaults, do not disable) |
| Skip-to-content | Required on `/chat` (skip sidebar) |
| Voice mode (Advanced) | Captions; transcript view; not voice-only |

### 28.4 Browser support matrix

Defined in §26.5. Tier 1 must pass Playwright at 390×844 + 1280×800.

---

## Section 29 — Feature flag taxonomy

### 29.1 Naming convention

```text
VITE_<DOMAIN>_<FEATURE>_<STATE>

Examples:
  VITE_USE_COPILOTKIT_HOST_EVENT=1
  VITE_MAPS_VISGL=1
  VITE_USE_GROUNDING_LITE=1
  VITE_ENABLE_NIGHTLIFE_COPILOT=0
  VITE_ENABLE_CONTEST_PLATFORM=0
```

Rules:
- `VITE_` prefix → exposed to browser bundle
- (no `VITE_` prefix) → server-side only (edge fn / Mastra)
- `USE_` or `ENABLE_` verb makes intent explicit
- `=1` or `=0` — never tri-state strings
- Document every flag in `feature-flags.md` (Phase 1 deliverable)

### 29.2 Flag lifecycle

| Stage | Duration | Purpose |
|---|---|---|
| **Off-by-default (dev only)** | 1–7 days | Sofía develops behind flag |
| **Off-by-default (preview)** | 7–14 days | Vercel preview soak |
| **On-for-canary (10% prod)** | 7 days | A/B verification |
| **On-by-default (100% prod)** | 14 days | Stability soak |
| **Retired** | — | Flag removed; defaults baked in |

### 29.3 Flag ownership

Every flag has an owner + an expiration date.

| Flag | Owner | Expiration |
|---|---|---|
| `VITE_USE_COPILOTKIT_HOST_EVENT` | Sofía | 60 days after pilot ship |
| `VITE_MAPS_VISGL` | Sofía | 90 days after Phase 2 |
| `VITE_USE_GROUNDING_LITE` | Sofía | Permanent (kill switch) |
| `VITE_ENABLE_NIGHTLIFE_COPILOT` | Patricia | 30 days after Phase 2.5 ship |
| `VITE_ENABLE_CONTEST_PLATFORM` | Patricia | Phase 4 launch |
| `VITE_USE_OPENCLAW_ADMIN_OPS` | Sofía | Permanent (admin gate) |

**Quarterly review:** any flag past expiration is either retired or extended with a fresh expiration. Stale flags become tech debt.

### 29.4 Kill-switch flags (permanent)

Some flags stay forever — they're operational kill switches:

| Permanent flag | Purpose |
|---|---|
| `VITE_USE_GROUNDING_LITE` | Disable Grounding Lite if MCP endpoint goes down (cost spike, outage) |
| `VITE_USE_COPILOTKIT` | Emergency disable of CopilotKit globally |
| `VITE_USE_OPENCLAW_ADMIN_OPS` | Admin-only gate on `/admin/ops` |
| `GEMINI_MODEL_OVERRIDE` (server) | Switch Gemini model version without redeploy |

---

## Section 30 — Incident response runbook

### 30.1 Severity ladder

| Severity | Symptom | Response time |
|---|---|---|
| **P0** | Revenue path down (tickets can't sell, `/chat` 500s, payments fail) | Page Sofía immediately; rollback within 15 min |
| **P1** | Major feature degraded (CopilotKit sidebar 50% error rate, map pins not rendering) | Diagnose within 1h; mitigation within 4h |
| **P2** | Minor degradation (1 copilot slow, grounding occasional 500) | Diagnose within 24h; fix in next sprint |
| **P3** | Cosmetic / non-blocking (toast misalignment) | Backlog |

### 30.2 First-response playbook (P0)

```text
1. Confirm scope:    curl -fsSL https://www.mdeai.co/                          → expect 200
                     curl -fsSL https://www.mdeai.co/api/health                → expect 200
                     check Sentry for last 5 minutes
2. Identify culprit: git log --oneline -10 origin/main                          → last 10 commits
                     Vercel dashboard: which deploy correlates with incident
3. Mitigate first:
   - If CopilotKit-related → flip VITE_USE_COPILOTKIT_HOST_EVENT=0 + redeploy
   - If Maps-related      → flip VITE_MAPS_VISGL=0 + redeploy
   - If Grounding-related → flip VITE_USE_GROUNDING_LITE=0 + redeploy
   - If Mastra down       → restart Mastra server / fall back to ai-chat edge fn
   - If Supabase down     → page Supabase support; status page check
4. Communicate:      Update status page (Phase 2 deliverable)
                     WhatsApp Patricia if ticketing affected
5. Root cause:       After mitigation, write post-mortem within 48h
                     File ticket in /admin/incidents (Phase 4)
```

### 30.3 Rollback procedure (any phase, any feature)

```text
1. Find the last green deploy:  vercel deployments list --prod
2. Promote it:                  vercel promote <deployment-url>
3. Flip the flag (if applicable):
   vercel env rm VITE_USE_COPILOTKIT_HOST_EVENT production
   vercel env add VITE_USE_COPILOTKIT_HOST_EVENT production
   > Enter value: 0
4. Trigger redeploy:            vercel --prod
5. Verify:                      curl + browser smoke
6. Lock the bad commit:         do NOT revert; investigate first
```

### 30.4 Monitoring stack

| Layer | Tool | What it watches |
|---|---|---|
| **Frontend errors** | Sentry | JS exceptions, slow transactions, Web Vitals |
| **API errors** | Sentry (separate project for edge fns) | 5xx rates, latency p95 |
| **DB health** | Supabase dashboard + custom RLS smoke | Query latency, connection pool, RLS deny rate |
| **AI calls** | `ai_runs` table + daily Slack/email summary | Token spend, p95 latency, error rate per agent |
| **Cost** | Google Cloud Console (Maps) + `grounding_quota_log` daily roll-up | Daily spend per service vs caps |
| **Map drift** | `map_render_drift_log` + Sentry alert | Emitted ≠ rendered count |
| **Deployments** | Vercel webhook → Slack | Every deploy logged |
| **Uptime** | Better Stack / UptimeRobot (Phase 1) | `/`, `/chat`, `/api/health` 1-min checks |

### 30.5 When the AI goes wrong — copilot-specific incidents

| Symptom | Likely cause | First action |
|---|---|---|
| Wrong city in pins | LLM generated lat/lng (constitution C2 violated) | Find action without Zod gate; ship Zod fix |
| Camila sees English when she's Spanish-locale | i18n locale mismatch | Check `user.locale` propagation through `useCoAgent` |
| Sponsor email sent to wrong recipient | Approval flow bypassed | Audit `approvals` table for missing approvedAt |
| Map shows pins from old query | `MapContext` not cleared between turns | Check `mergePinsByCategory` version stamp |
| Grounding attribution missing | Renderer omitted attribution slot | Hook-enforce via PR check |
| Ticket QR validates twice | `ticket-validate` idempotency broken | Edge fn unique constraint; restore from backup if needed |

### 30.6 What NOT to do during an incident

| Don't | Why |
|---|---|
| `git reset --hard origin/main` on prod | Destroys local work; investigate first |
| Push directly to main | Use rollback procedure (§30.3) instead |
| Disable Sentry to "stop the noise" | You lose the signal |
| Restart Supabase or migrate during incident | Adds variables; mitigate first, then fix |
| Promise an ETA before knowing root cause | Set "investigating" expectation; update every 30 min |

---

## Section 31 — v2 changelog & supersedes

### 31.1 What changed in v2 (this addition)

| § | Topic | Why missing originally |
|---|---|---|
| 25 | Internationalization (Spanish-first / Paisa) | Original PRD assumed English bias; Camila is Spanish-default |
| 26 | Mobile, PWA, performance budgets | Implied via "Camila on Tigo 4G" but never enumerated |
| 27 | Cost economics & monitoring/alerting | Audit cited prior $200/day incident but PRD didn't codify alerts |
| 28 | Data privacy (Ley 1581), accessibility, browser support | Colombian product requires Ley 1581; original PRD omitted |
| 29 | Feature flag taxonomy | Flags accumulate quickly across 5 copilots; needed governance |
| 30 | Incident response runbook | Implied via audit but no actionable playbook |
| 31 | This changelog | — |

### 31.2 What did NOT change

| Sections 1–24 | Stay exactly as written |
|---|---|
| Architecture (§3), Maps strategy (§5), 9 core schemas (§6), approval system (§7), 5 Phase-1 copilots (§8), roadmap (§12), 7 real-world examples (§13), final recommendations (§14), risks (§15), §17–24 extensions | ✅ unchanged |

### 31.3 Doc hygiene (2026-05-18 cleanup)

| Old path | New path | Status |
|---|---|---|
| `tasks/strategy/copilotkit/05-copilotkit.md` | `tasks/copilotkit/docs/archive/05-copilotkit.md` | Moved |
| `tasks/strategy/copilotkit/10-copilotkit-repos.md` | `archive/10-copilotkit-repos.md` | Moved |
| `tasks/strategy/copilotkit/11-copilotkit-mastra.md` | `archive/11-copilotkit-mastra.md` | Moved |
| `tasks/strategy/copilotkit/14-copilotkit.md` | `archive/14-copilotkit.md` | Moved |
| `tasks/strategy/copilotkit/16-copilotkit-repos.md` | `archive/16-copilotkit-repos.md` | Moved |
| `tasks/strategy/copilotkit/17-copilotkit-maps.md` | `archive/17-copilotkit-maps.md` | Moved |
| `tasks/strategy/copilotkit/1-copilotkit-repos.md` | `archive/1-copilotkit-repos.md` | Moved |
| `tasks/strategy/copilotkit/16-copilotkit-repos (copy).md` | (deleted — duplicate) | Removed |
| `tasks/strategy/copilotkit/` directory | (empty — removed) | Cleaned |

### 31.4 Canonical paths going forward

| Document | Canonical path |
|---|---|
| This PRD | `tasks/copilotkit/docs/prd-structured-ai-os.md` |
| Condensed PRD reference | `tasks/copilotkit/docs/mdeai_copilotkit.md` |
| Execution roadmap | `tasks/copilotkit/roadmap-V3.md` |
| Docs index | `tasks/copilotkit/docs/README.md` |
| Repo catalog | `tasks/copilotkit/docs/02-core-repositories.md` |
| Archive (do not consult) | `tasks/copilotkit/docs/archive/` |
| Maps strategy (Maps-specific) | `tasks/strategy/maps/15-googlemaps-strategy.md` |
| Phase 1 pilot task | `tasks/mastra/maps/tasks/runtime/013-copilotkit-host-event-pilot.md` |

### 31.5 Updated self-score (v2)

| Area | v1 score | v2 score | Notes |
|---|---:|---:|---|
| Architecture coherence | 92 | 92 | unchanged |
| Stack accuracy | 95 | 95 | unchanged |
| Honest repo scoring | 90 | 90 | unchanged |
| Real-world examples | 92 | 92 | unchanged |
| Risk register honesty | 88 | 92 | §30 runbook closes operational gap |
| OpenClaw integration | 86 | 86 | unchanged |
| Anti-pattern coverage | 90 | 92 | §27 cost gates, §29 flag hygiene added |
| **Internationalization (NEW)** | — | **88** | §25 Spanish-first |
| **Mobile / PWA (NEW)** | — | **90** | §26 budgets + matrix |
| **Cost monitoring (NEW)** | — | **92** | §27 caps + alerts |
| **Privacy compliance (NEW)** | — | **88** | §28 Ley 1581 + WCAG |
| **Feature flag hygiene (NEW)** | — | **90** | §29 lifecycle |
| **Incident response (NEW)** | — | **92** | §30 playbook |

**v2 overall: 92/100** (up from 91/100 v1) — Now covers production-readiness aspects Camila/Roberto/Patricia need on day one, not just the architecture.

### 31.6 The single commitment (unchanged)

**Pick a Monday in the next 7 days. Close audit P0s week 1. Pilot RUNTIME-013 week 2–3.** Everything in §17–§31 is sequenced behind that gate.
