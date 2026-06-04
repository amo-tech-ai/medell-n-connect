---
title: PRD Part VII — Reuse Strategy
parent: ../prd.md
sections: 43–48
---

# PART VII — Reuse Strategy

> [← Part VI](./06-operations.md) · [Index](../prd.md) · [Next: Part VIII — Delivery →](./08-delivery.md)

## 43. Repo/component reuse matrix

| Layer | Source | Score | Reuse % |
|---|---|---:|---:|
| AI runtime | `CopilotKit/examples/integrations/mastra` | 99/100 | 95% |
| Working-memory pattern | `CopilotKit/examples/canvas/mastra` | 96/100 | 90% |
| Multi-state workflow | `CopilotKit/examples/canvas/mastra-pm` | 93/100 | 70% |
| Approvals + roles | `CopilotKit/examples/showcases/banking` | 91/100 | 70% |
| Form-fill conversation | `CopilotKit/examples/v1/form-filling` | 90/100 | 80% |
| Card render shells | `CopilotKit/examples/showcases/generative-ui` | 90/100 | 70% |
| Data Q&A chat | `CopilotKit/examples/v1/chat-with-your-data` | 88/100 | 70% |
| Map render | `@vis.gl/react-google-maps` | 96/100 | 100% |
| Clustering | `@googlemaps/js-markerclusterer` | 94/100 | 100% |
| Place cards | `@googlemaps/extended-component-library` | 88/100 | 100% |
| Places SDK | `@googlemaps/google-maps-services-js` | 84/100 | 100% |
| Grounded search | `grounding-lite-mcp-sample-app` | 88/100 | 60% port |
| Gemini patterns | `google-gemini/cookbook` | 82/100 | reference only |
| Ticketing patterns | `Hi.Events` (AGPL) | 80/100 | reference only |

## 44. Top repos to use (and WHY)

See [`/home/sk/mdeai/plan/02-repo-plan.md`](../02-repo-plan.md) §3 for full Top-20 with grades. Top 5:

1. **`integrations/mastra`** — only Mastra-shaped CopilotKit example. Foundation.
2. **`@vis.gl/react-google-maps`** — already a mdeai dep. Stays.
3. **`@googlemaps/js-markerclusterer`** — already a mdeai dep. Stays.
4. **`@googlemaps/extended-component-library`** — install fresh week 4. Replaces ~150 LoC custom chrome.
5. **`grounding-lite-mcp-sample-app`** — pattern source for `searchGroundedPlaces` Mastra tool.

## 45. Exact components to copy/adapt

| Component | From | To |
|---|---|---|
| `route.ts` | `integrations/mastra/src/app/api/copilotkit/route.ts` | `src/app/api/copilotkit/route.ts` |
| Mastra `index.ts` | `integrations/mastra/src/mastra/index.ts` | `src/mastra/index.ts` |
| `<CopilotKit>` mount | `integrations/mastra/src/app/layout.tsx` | `src/app/layout.tsx` |
| Working-memory agent shape | `canvas/mastra/src/mastra/agents/index.ts` | `src/mastra/agents/host-event.ts` |
| State type shape | `canvas/mastra/src/lib/canvas/state.ts` | `packages/types/src/event-draft.ts` |
| Card render pattern | `showcases/generative-ui/components/weather-card.tsx` | `src/components/cards/RentalCard.tsx` |
| Role-based context | `showcases/banking/src/lib/copilot-context.tsx` | `src/lib/auth/role-context.tsx` |
| Form-fill flow | `v1/form-filling/src/app/page.tsx` | `src/app/host/event/new/page.tsx` |
| Data-query chat | `v1/chat-with-your-data/src/app/page.tsx` | `src/app/rentals/page.tsx` |

## 46. What NOT to custom build

| Don't custom | Use this |
|---|---|
| Custom SSE | `@ag-ui/mastra` |
| Tool output normalizer | `useCopilotAction({ parameters: z.object() })` |
| Action queue | AG-UI event stream |
| Approval modal | `renderAndWaitForResponse` |
| State sync | `useCoAgent` / `useCoAgentState` |
| Intent router | Mastra `router` agent |
| Sidebar shell | `<CopilotSidebar>` |
| Marker clustering | `@googlemaps/js-markerclusterer` |
| Map wrapper | `@vis.gl/react-google-maps` |
| Place card chrome | `@googlemaps/extended-component-library` |
| Place autocomplete | `@googlemaps/google-maps-services-js` |
| i18n machinery | Lingui |
| Auth | Supabase Auth |
| Data layer | Supabase + RLS |
| Stripe checkout | existing `ticket-checkout` edge fn |
| Background job queue | Vercel **Queues** (Phase 2) |
| AI provider abstraction | Vercel **AI Gateway** (optional, Phase 2) |
| Bot detection | Vercel **BotID** |
| Multi-tenant infra | Vercel **for Platforms** (if ever needed) |

## 47. What custom code IS still necessary

~700 LoC irreducible:

| File | Purpose | ~LoC |
|---|---|---:|
| `hostEventAgent.ts` | Spanish prompt + 20 event templates from `event-planner-os` | 80 |
| 4 cards (RentalCard, VenueCard, EventDraftCard, GroundedPlaceCard) | Brand shells around shadcn + Maps primitives | 600 |
| ApprovalPanel | Spanish copy + `decide_approval` wiring | 80 |
| Typed CoAgent hooks (3) | `useHostEventCoAgent`, `useRentalsCoAgent`, `useConciergeCoAgent` | 90 |
| `setPins.ts` | Single writer (RUNTIME-008) | 30 |
| Lingui catalogs | ~200 ES/EN strings | 200 (text) |
| Page compositions | `/host/event/new`, `/rentals`, `/chat` | 300 |

## 48. Technical debt prevention plan

| Rule | Enforced by |
|---|---|
| One Zod source per shape | `packages/types/` workspace + lint rule banning duplicate type defs |
| One `setPins` writer | Lint rule: only `src/lib/maps/setPins.ts` may import + call |
| No new edge fn without source-in-repo | CI inventory check |
| No service role in `src/**` | Hook `no-service-role-in-src` |
| Every Places call has `X-Goog-FieldMask` | Hook `places-api-field-mask` |
| Every `<AdvancedMarker>` has `mapId` | Hook `advanced-marker-needs-mapid` |
| Every PR has tests added or N/A justified | PR template |
| Every approval write goes through `decide_approval()` | Lint rule banning direct `events` insert from `src/**` |
| `vercel.ts` typed config required (no raw `vercel.json`) | CI check |
| No secrets literally in code | Hook `scan-secrets` |

> [← Part VI](./06-operations.md) · [Index](../prd.md) · [Next: Part VIII — Delivery →](./08-delivery.md)
