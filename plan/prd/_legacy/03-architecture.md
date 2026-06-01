---
title: PRD Part III — Architecture Layers
parent: ../prd.md
sections: 10–21
---

# PART III — Architecture Layers

> [← Part II](./02-users-flows.md) · [Index](../prd.md) · [Next: Part IV — Product Surfaces →](./04-product-surfaces.md)

## 10. Maps architecture

| Layer | Library | mdeai use |
|---|---|---|
| React Map + AdvancedMarker | `@vis.gl/react-google-maps` | All map views |
| Clustering | `@googlemaps/js-markerclusterer` | Apartments, events, dense pins |
| Place card UI | `@googlemaps/extended-component-library` (`<gmp-place-overview>`) | Venue and rental detail cards |
| Place autocomplete + lookup | `@googlemaps/google-maps-services-js` | Edge function Places calls |
| Maps caching | existing `places_search_cache` + `place_details_cache` (33 rows live, RLS-tight, 4 policies each) | Cost-control + cold-start latency |

**Rules (preserved from legacy, enforced by hooks):**
1. **Single map loader per route.** No double `<APIProvider>`.
2. **`mapId` required on `<Map>`** for `<AdvancedMarker>` to render.
3. **`X-Goog-FieldMask` on every Places API call.** Enforced by hook.
4. **One `setPins` writer.** Lint rule blocks any other module from calling it.

## 11. Google Places + Grounding Lite strategy

| Need | Tool |
|---|---|
| Place autocomplete (Roberto types venue name) | `googlemaps/google-maps-services-js` Places SDK |
| Grounded conversational discovery (*"cafés tranquilos cerca de Parque Lleras"*) | `grounding-lite-mcp-sample-app` pattern → Mastra tool `searchGroundedPlaces` |
| Cache | `places_search_cache` + `place_details_cache` (existing) |
| Cost ledger | new `grounding_call_log(trace_id, tool_name, query_hash, cost_estimate, status)` |

**Cost discipline:** Grounding Lite ~$0.0014/call; Places enriched ~$0.017/call. Mastra tool checks cache first; logs every call to `agent_tool_calls`.

## 12. CopilotKit architecture

| Primitive | Where used | mdeai mapping |
|---|---|---|
| `<CopilotKit runtimeUrl agent>` | `src/app/layout.tsx` | Mount once, agent = `pingAgent` (W1) → `conciergeAgent` (W6) |
| `<CopilotSidebar>` | All AI-routes | Spanish labels |
| `useCoAgent<EventDraftState>` | `/host/event/new` | Bidirectional state for Roberto's flow |
| `useCoAgentState<MapState>` | `/chat`, `/rentals` | Read-only — agent never writes pins |
| `useCopilotAction({ parameters: z.object, handler })` | Form-fill actions | `set_event_basics`, `set_venue`, `add_ticket_tier` |
| `useCopilotAction({ render })` | All cards | RentalCard, VenueCard, EventDraftCard, GroundedPlaceCard |
| `useCopilotAction({ renderAndWaitForResponse })` | HITL approval | Aprobar / Editar / Rechazar |
| `useCopilotReadable` | Auth role context | From `showcases/banking` pattern |
| `CopilotRuntime` + `MastraAgent.getLocalAgents` | `/api/copilotkit/route.ts` | Server endpoint |

**Pinned version: `1.55.2` exactly.** Matches `examples/integrations/mastra/package.json`.

> ⚠️ **API generation — explicit decision.** Two parallel CopilotKit API generations exist:
>
> | Generation | Packages | Provider | Agent | Action hook | Endpoint |
> |---|---|---|---|---|---|
> | **v1.55.2 (Mastra path — our pick)** | `@copilotkit/react-core`, `@copilotkit/react-ui`, `@copilotkit/runtime` (1.55.2) | `<CopilotKit runtimeUrl agent>` | `MastraAgent.getLocalAgents` via `@ag-ui/mastra` | `useCopilotAction` | `copilotRuntimeNextJSAppRouterEndpoint` |
> | **v2 (BuiltInAgent — non-Mastra)** | `@copilotkit/react`, `@copilotkit/core`, `@copilotkit/runtime`, `@copilotkit/agent` (latest) | `<CopilotKitProvider runtimeUrl>` | `BuiltInAgent({ model })` | `useFrontendTool` | `createCopilotEndpoint` (Hono) |
>
> The `copilotkit-setup` and `copilotkit-develop` skills describe **v2**. We use **v1** because it is the only CopilotKit + Mastra documented path (`copilotkit-integrations/.../mastra.md`). Migrate to v2 in Phase 2 only when Mastra integration ships on v2. **Do not mix v1 and v2 imports in the same project.**

## 13. Mastra agent architecture

| Agent | Role | Phase 1 use |
|---|---|---|
| `pingAgent` (NEW, W1) | Echo proof-of-life | Day-1 sandbox |
| `hostEventAgent` (NEW, W3) | Parse Roberto's Spanish → fill form | `/host/event/new` |
| `conciergeAgent` (reused) | General mdeai Q&A + concierge | `/chat` |
| `rentalAgent` (reused) | Rental search + comparison | `/rentals` + `/chat` rentals path |
| `eventAgent` (reused) | Event discovery | `/chat` events path |
| `routerAgent` (reused) | Intent classification — dispatches to specialist agents | Replaces legacy `useIntentRouter.ts` |
| `evaluation` (reused) | Scorer | Background |
| ~~`weather-agent`~~ | (demo only — deleted in F02) | Was example demo; not part of mdeai production |

**Agent shape (from `canvas/mastra/src/mastra/agents/index.ts`):**

```ts
new Agent({
  id: "host-event-agent",
  name: "hostEventAgent",
  model: google("gemini-3.5-flash"),
  tools: { /* mdeai tools */ },
  instructions: "<Spanish prompt + 20 event-planning templates from event-planner-os>",
  memory: new Memory({
    storage: new LibSQLStore({ id: "host-event-memory", url: "file::memory:" }),
    options: { workingMemory: { enabled: true, schema: EventDraftState, scope: "thread" } },
  }),
});
```

## 14. Supabase architecture

Same project (`zkwcbyxiwklihegjhuql`). 122 tables. Live findings via MCP this session:

| Table family | Purpose | Status |
|---|---|---|
| `apartments` (44) + `rentals` (20) + `listing_embeddings` (44, pgvector) | Rental discovery + semantic search | RLS on |
| `events` (11 RLS policies) + `event_tickets` + `event_orders` + `ticket_validations` | Phase 1 hero | RLS on |
| `approval_requests` + `approval_decisions` + `decide_approval()` RPC | HITL backend | RLS on, live |
| `agent_runs.correlation_id` + `agent_tool_calls` + `chat_events` | Observability | RLS on |
| `mastra_ai_spans` (932) + `mastra_workflow_snapshot` (18) + `mastra_messages` + `mastra_threads` + `mastra_resources` + `mastra_scorers` | Mastra telemetry | all RLS on |
| `places_search_cache` (4 policies, 33 rows) + `place_details_cache` (4 policies) | Maps cache | RLS on |
| `leads` + `lead_replies` | Rental + event leads | existing |
| `landlord_profiles` + `host_profiles` | Roles | existing |
| `restaurants` (6 policies) + `attractions` | Concierge data | RLS on |
| Stripe: `event_orders` + `ticket_payments` | Payment spine | existing |
| `outbox_events` (verify) | Reliable side-effects | W1 verify |

**Aggregate Supabase readiness: 84/100.** Gap is edge fn inventory + drift, not schema.

## 15. Database strategy

- **Declarative schema** (`supabase/schemas/*.sql`) per existing rule
- **All migrations** go through `supabase db diff -f <name>`
- **No new tables in Phase 1** unless required by approval flow or grounding ledger
- **New Phase 1 migrations (minimal):**
  - `grounding_call_log(trace_id, tool_name, query_hash, cost_estimate_usd numeric, status, created_at)`
  - `map_render_drift_log` (verify if exists in legacy first)
  - `correlation_id` standardization on `agent_runs` (column already exists per live MCP)
- **Existing approval RPCs reused:** `decide_approval()`, `fn_apply_approval_decision`

## 16. Edge function strategy

| Bucket | Count | Phase 1 action |
|---|---:|---|
| In repo, score ≥ 80% | 8 | Tighten tests + CI proof |
| In repo, score 70–80% | 8 | Add Vitest contract tests |
| Live, deploy-only, actively called | est. 8 | **Forensic W5 — port source into new repo** |
| Live, deploy-only, unused | est. 12 | **Forensic W5 — retire (30-day soft delete)** |
| Sponsor + contest fns | 12 | Defer to Phase 3 |
| OpenClaw + Postiz + WhatsApp | 5 | Defer to Phase 2 forensic |

**Target end of Phase 1:** ≥ 28 source-in-repo, ≤ 4 unaudited, 100% CI inventory guard.

**New edge functions (Phase 1):**
- `approval-commit` — wraps `decide_approval()` for strict transition guards
- `searchGroundedPlaces` (deployable later as standalone fn or stays inside Mastra tool)

**Vercel runtime:** Fluid Compute (Node 24 LTS default). Functions deploy timeout 300s. Use `vercel.ts` (not `vercel.json`) for config.

## 17. Human approval architecture

Pattern (Mastra-native, recommended in `02-official-docs-verified-corrections.md` C3):

```text
1. Mastra agent calls tool with `suspend()` for high-stakes write
2. Frontend `renderAndWaitForResponse` renders <ApprovalPanel>
3. User taps Aprobar / Editar / Rechazar
4. Frontend POSTs to /api/approval-commit Next.js API route (Phase 1; may promote to Supabase edge fn in Phase 2)
5. Route handler calls decide_approval(trace_id, decision) → fn_apply_approval_decision
6. RPC writes events + event_tickets in single transaction
7. Mastra tool resumes; toast shows
```

**Strict state machine:** PENDING → APPROVED → COMMITTED | REJECTED | EDIT.

## 18. Shared state architecture

Two tiers:

| Tier | Hook | Direction | mdeai use |
|---|---|---|---|
| Bidirectional | `useCoAgent<T>` | Frontend reads + writes, agent reads + writes | `EventDraftState` (Roberto fills form) |
| Read-only | `useCoAgentState<T>` | Frontend reads, agent reads only (frontend writes via separate action) | `MapState` (pins are tools-only, RUNTIME-008) |

**RUNTIME-008 enforcement:** lint rule blocks any module except `src/lib/maps/setPins.ts` from mutating pin state.

## 19. Tool/action architecture

| Action | Type | Where | Schema |
|---|---|---|---|
| `set_event_basics` | frontend (`handler`) | `/host/event/new` | `z.object({ title, date, description })` |
| `set_venue` | frontend (`handler`) | `/host/event/new` | `z.object({ venueName, venuePlaceId })` |
| `add_ticket_tier` | frontend (`handler`) | `/host/event/new` | `z.object({ name, priceCop })` |
| `preview_and_publish` | HITL (`renderAndWaitForResponse`) | `/host/event/new` | `z.object({ draft: EventDraft })` |
| `search_rentals` | Mastra tool (server) | All routes | `z.object({ filter })` |
| `search_events` | Mastra tool (server) | All routes | `z.object({ filter })` |
| `search_grounded_places` | Mastra tool (server) | `/chat` | `z.object({ query, viewport })` |
| `render_rental_card` | frontend (`render`) | `/rentals`, `/chat` | `z.array(RentalRecommendation)` |
| `render_event_card` | frontend (`render`) | `/chat`, `/events` | `z.array(EventRecommendation)` |
| `render_grounded_place_card` | frontend (`render`) | `/chat` | `z.array(GroundedPlace)` |

**Single Zod source of truth:** `packages/types/`. Mastra tool schemas import from same file (week 4).

## 20. Generative UI architecture

All cards are **composition of shadcn primitives + CopilotKit `useCopilotAction({ render })`**.

| Card | Source pattern | mdeai file |
|---|---|---|
| RentalCard | `showcases/generative-ui/components/weather-card.tsx` | `src/components/cards/RentalCard.tsx` |
| VenueCard | `extended-component-library` `<gmp-place-overview>` + shadcn shell | `src/components/cards/VenueCard.tsx` |
| EventDraftCard | `canvas/mastra/src/components/canvas/CardRenderer.tsx` | `src/components/cards/EventDraftCard.tsx` |
| GroundedPlaceCard | `grounding-lite-mcp-sample-app` UX | `src/components/cards/GroundedPlaceCard.tsx` |
| ApprovalPanel | `renderAndWaitForResponse` HITL pattern | `src/components/approvals/ApprovalPanel.tsx` |

**~150 LoC each** × 4 cards = ~600 LoC of card chrome (Paisa brand, Spanish labels).

## 21. Event system architecture

```mermaid
flowchart TB
    HOST[Roberto] --> NEW[/host/event/new]
    NEW --> HEA[hostEventAgent]
    HEA --> ACT[useCopilotAction set_*]
    ACT --> STATE[useCoAgent EventDraftState]
    STATE --> PREV[ApprovalPanel renderAndWaitForResponse]
    PREV --> AC[approval-commit edge fn]
    AC --> DA[decide_approval RPC]
    DA --> FN[fn_apply_approval_decision]
    FN --> EVT[(events table)]
    FN --> TIX[(event_tickets table)]
    EVT --> PUB[/events/:id public page]
    PUB --> BUY[Camila buys]
    BUY --> CHK[ticket-checkout edge fn]
    CHK --> STR[Stripe Checkout]
    STR --> WH[ticket-payment-webhook]
    WH --> ORD[(event_orders status=paid)]
    ORD --> QR[/me/tickets/:id]
    QR --> SCN[Phase 1.5 — staff PWA scan]
```

> [← Part II](./02-users-flows.md) · [Index](../prd.md) · [Next: Part IV — Product Surfaces →](./04-product-surfaces.md)
