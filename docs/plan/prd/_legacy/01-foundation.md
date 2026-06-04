---
title: PRD Part I — Foundation
parent: ../prd.md
sections: 1–7
---

# PART I — Foundation

> [← Index](../prd.md) · [Next: Part II — Users + Flows →](./02-users-flows.md)

## 1. Executive summary

mdeai.co is an **AI-first, chat-first, map-first** discovery and ticketing platform for Medellín. The current production app (`/home/sk/mde/`) works but carries ~2,400 LoC of custom AI plumbing (`ChatCanvas.tsx` 622 LoC, `ChatMap.tsx` 739 LoC, `useChat`, `useIntentRouter`, `normalize-tool-output`, `pendingActions`) that CopilotKit replaces for free. This PRD replaces that plumbing in a brand-new repo while preserving every backend asset.

| What changes | What stays |
|---|---|
| AI chat shell (CopilotKit replaces custom) | Supabase data + RLS (122 tables) |
| Routing structure (Next.js 16 App Router) | Mastra agents (7) + tools (8) |
| Frontend code (clean Next.js + shadcn) | Stripe + Infisical + Vercel + DNS |
| Tests (0 → 90+ in mdeapp by end of Phase 1) | Maps API key + Maps quota |
| Edge-function inventory (32 → ≤ 4 deploy-only) | Personas + revenue model from v5.1 |

**Aggregate platform readiness today: 58/100. Phase 1 target: 88/100.** (See `docs/100-AUDIT-FORENSIC-ARCHITECTURE-2026-05-19.md` §11.)

---

## 2. Vision

> *Camila in Laureles types "rooftops with salsa Friday under $50" — she sees pins, prices, and one tap to buy a ticket. Roberto, a host in Provenza, says "salsa night at Café Le Gris Friday, 3 tiers $20–$80 COP" — the form fills in front of him and he taps "Aprobar". Same chat. Same map. Same login. Spanish first, English available.*

mdeai is the **single conversational interface for Medellín discovery + transactions** — rentals, events, nightlife, food, and (later) contests + sponsorships. The map is always visible. The agent never writes anything without human approval.

---

## 3. Product goals

| # | Goal | Measurable |
|---|---|---|
| 1 | First Stripe ticket sold on the new app | row in `event_orders` with status `paid` |
| 2 | First rental lead captured from chat | row in `leads` with source = `mdeai-app` |
| 3 | Host creates event in ≤ 30 seconds via AI | timing in `agent_runs.duration_ms` |
| 4 | Comparative chat latency < 1 second ("el más barato?") | p95 in `agent_runs` |
| 5 | Bundle delta on `/chat` chunk ≤ 80 KB gzipped | Next.js build report |
| 6 | Test count ≥ 90 in the new repo by end of Phase 1 (new repo starts at 0; legacy has 222/222 on main, 21 on feat/maps-see-all-001 — neither is the baseline for this app) | `npm test` count in `/home/sk/mdeai/mdeapp/` |
| 7 | Edge functions source-in-repo ≥ 28 of 48 | inventory CI check |
| 8 | Zero P0 Sentry regressions over 7-day production soak | Sentry dashboard |

---

## 4. Simplified architecture strategy

**One foundation, many references.** The new app composes proven, off-the-shelf primitives instead of building from scratch.

```text
CopilotKit 1.55.2   ← AI UI (sidebar, actions, HITL, shared state)
+ Mastra            ← agent orchestration (existing 7 agents reused)
+ Supabase          ← data, auth, RLS, RPCs (same project as legacy)
+ vis.gl react-google-maps + js-markerclusterer + extended-component-library
+ Gemini 3.5 Flash  ← LLM (via @ai-sdk/google)
+ Stripe            ← payments (same edge fns)
+ shadcn/ui + Tailwind 4 + Lingui (ES/EN)
```

**Zero custom orchestrators.** No second runtime. No custom SSE. No custom intent router. No custom approval modal.

---

## 5. Why the old architecture was too complex

Audit findings from `100-AUDIT-FORENSIC-ARCHITECTURE-2026-05-19.md`:

| Liability | Severity | Evidence |
|---|---|---|
| `ChatCanvas.tsx` god-component (622 LoC) | 🔴 P0 | `src/components/chat/ChatCanvas.tsx` — every chat feature touches it |
| `ChatMap.tsx` god-component (739 LoC) | 🔴 P0 | Coupled to ChatCanvas; duplicates MapContext concerns |
| Custom SSE in `useChat.ts` | 🔴 P0 | `@ag-ui/mastra` replaces it for free |
| `normalize-tool-output.ts` drift surface | 🔴 P0 | `useCopilotAction({ render })` replaces it |
| `pendingActions.ts` custom queue | 🔴 P0 | AG-UI event stream replaces it |
| 32 of 48 edge functions deploy-only | 🔴 P0 | `tasks/mvp-proofs/supabase/011-edge-functions-score-table.md` |
| 21 tests over 346 src files (~6%) | 🔴 P0 | Regression detection by luck |
| 1,139 markdown files in `tasks/` | 🟡 P1 | Information overload |
| 9× `setPins` bypass in Concierge | 🟡 P1 | RUNTIME-008 ownership rule violated |

**Net debt:** ~2,400 LoC of custom AI glue that does what CopilotKit + AG-UI already do.

---

## 6. What is being removed or deferred

### Removed in Phase 1

| Removed | Replaced by |
|---|---|
| `ChatCanvas.tsx`, `ChatMap.tsx` | `src/app/chat/page.tsx` composition |
| `useChat.ts` | `useCopilotChat` from CopilotKit |
| `useIntentRouter.ts` | Mastra `router` agent (already exists) |
| `normalize-tool-output.ts` | `useCopilotAction({ parameters: z.object() })` typed at compile |
| `pendingActions.ts` | AG-UI event stream |
| Custom approval modals | `useCopilotAction({ renderAndWaitForResponse })` |
| Custom intent classification | Mastra agent prompt + router |

### Deferred to Phase 2+

| Deferred | Phase | Reason |
|---|---|---|
| OpenClaw runtime | Phase 3+ | Operational layer, not MVP |
| Contests + voting | Phase 3 | Closer to fintech (anti-fraud, identity, legal) |
| Sponsor marketplace | Phase 3 | No sponsors yet |
| Native rental booking | Phase 5 | Currently affiliate-only |
| Hermes ranking | Phase 3 | 7-factor pgvector ranking |
| WhatsApp outbound | Phase 2 | `whatsapp-webhook` needs forensic |
| MCP Apps (3D/iframe) | Phase 2 | Post-MVP exploration |
| A2UI / multi-agent canvas | Phase 3 | Experimental |
| Browser-control agents | Phase 3 | Operational research |

---

## 7. MVP definition

**MVP = first ticket sold on new app + first rental lead captured + Roberto's first AI-assisted event published.**

### MVP scope (in)

- Roberto creates event in `/host/event/new` in ≤ 30 seconds via AI form-fill
- Roberto approves the preview; row in `events` + `event_tickets` (live, RLS-tight)
- Camila lands on `/rentals`, sees 44 apartments + map; types a query; pins update
- Camila lands on `/chat`, asks comparative questions; map syncs read-only via `useCoAgentState`
- Camila buys a ticket; Stripe webhook fires; `event_orders.status = paid`; QR visible
- One landlord submits a rental lead via chat; row in `leads`
- Spanish UI throughout; English toggle live; 0 P0 Sentry events for 7 days

### MVP scope (out)

- Door scanner check-in (port `event-staff-link-generator` in Phase 1.5)
- Refunds (manual via Stripe dashboard)
- Voting, sponsor onboarding, contestant pages
- Native rental booking
- WhatsApp outbound, OpenClaw, Paperclip, Hermes
- Multi-event simultaneous load testing beyond 50 buyers

> [← Index](../prd.md) · [Next: Part II — Users + Flows →](./02-users-flows.md)
