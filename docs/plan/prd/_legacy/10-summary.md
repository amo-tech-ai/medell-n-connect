---
title: PRD Part X — Final Summary
parent: ../prd.md
sections: closing
---

# PART X — Final Summary

> [← Part IX](./09-openclaw.md) · [Index](../prd.md)

## How the new mdeai is architected so OpenClaw can be added later without rewriting

The Phase-1 PRD makes 5 architectural choices that make OpenClaw a **drop-in addition** later, not a rewrite:

| Choice | Why OpenClaw needs it |
|---|---|
| `approval_requests` + `decide_approval()` reused at Phase 1 | OpenClaw queues approvals through the same gate |
| `correlation_id` standardized end-to-end | OpenClaw tasks trace cross-system effects |
| `agent_tool_calls` per-call ledger | OpenClaw replays tool calls deterministically |
| Outbox pattern from day 1 | OpenClaw consumes reliable side-effect queue |
| `packages/types/` shared Zod schemas | OpenClaw tasks share types with Phase-1 frontend |

When Phase 2 begins, OpenClaw is added as a **separate Vercel Function** (Fluid Compute, or a separate Node process if scale demands) that:

1. Reads jobs from `outbox_events` or Vercel **Queues**
2. Calls existing Mastra workflows
3. Writes `approval_requests` for any external effect
4. Surfaces in `/admin/approvals` (same UI Phase 1 ships)

**No frontend rewrite. No Supabase rewrite. No Mastra rewrite. Just a new worker.**

---

## The one-paragraph PRD

> Build the new mdeai at `/home/sk/mdeai/mdeapp/` by copying `CopilotKit/examples/integrations/mastra/`, replacing its weather demo with a Gemini-based `pingAgent`, and pointing it at the same Supabase project as legacy mde. Ship Roberto's host-event pilot in weeks 3–4 (`v1/form-filling` patterns + Mastra HITL). Ship Camila's rentals + chat in weeks 5–7 (`v1/chat-with-your-data` patterns + `vis.gl` + `extended-component-library`). Run an edge-function forensic in week 5 (32 deploy-only → ≤ 4 unaudited). Cut over at week 10 via Vercel Rolling Releases + 7-day soak. Defer OpenClaw, contests, sponsor marketplace, native rental booking to Phase 2–5 — but ship the 5 architectural seams (approval, correlation_id, tool ledger, outbox, shared types) that let them land later without rewriting anything. Total custom code: ~700 LoC. Custom AI glue retired: ~2,400 LoC. Phase-1 platform readiness target: 88/100.

---

## The 12 platform updates baked into v6.0 (vs. legacy v5.1)

| # | Update | Why it matters |
|---|---|---|
| 1 | Foundation: `examples/integrations/mastra/` copy | Replaces ~2,400 LoC of custom AI glue |
| 2 | Pin CopilotKit `1.55.2` exactly | Predictable, tested by maintainers |
| 3 | Next.js 16 App Router (not Vite) | Matches example natively |
| 4 | Vercel Fluid Compute (Node 24 LTS) | Default; no edge-runtime constraint; 300s timeout |
| 5 | `vercel.ts` typed config (replaces `vercel.json`) | Type-safe deploys |
| 6 | Vercel Rolling Releases for W10 cutover | Gradual 10/50/100% rollout |
| 7 | Vercel BotID on checkout + leads | Free bot defense |
| 8 | Vercel Queues (Phase 2) for OpenClaw | At-least-once delivery built-in |
| 9 | `@googlemaps/extended-component-library` for place cards | Replaces ~150 LoC custom card chrome |
| 10 | `@googlemaps/google-maps-services-js` in edge fns | Typed Places SDK |
| 11 | Lingui ES/EN i18n (Hi.Events pattern) | Spanish first, English toggle |
| 12 | `packages/types/` workspace | Single Zod source — eliminates FP-1 drift |

---

## Decisions waiting on user

1. **Repo path:** `/home/sk/mdeai/mdeapp/` confirmed?
2. **`/home/sk/mdeai-app/`** (half-built earlier): move / delete / keep as scratch?
3. **GitHub repo:** `mdeai/mdeai-app` private?
4. **Vercel:** new project or share existing?
5. **Legacy hard-freeze date:** end of week 1?
6. **`clawg-ui` + `clawpilot`** (user-supplied): clone-and-review before next plan, or defer?

Once answered → execute tasks 1–10 (week 1) per [Part VIII §51](./08-delivery.md#51-first-20-implementation-tasks-exact-order).

---

## Read order recap

| Part | What it answers |
|---|---|
| [I — Foundation](./01-foundation.md) | "What's the strategy and why?" |
| [II — Users + Flows](./02-users-flows.md) | "What do Camila, Miguel, Roberto see?" |
| [III — Architecture](./03-architecture.md) | "How are Maps, CopilotKit, Mastra, Supabase wired?" |
| [IV — Product Surfaces](./04-product-surfaces.md) | "What ships per vertical (rentals, events, ticketing)?" |
| [V — Code Organization](./05-code.md) | "Where do files live?" |
| [VI — Operations](./06-operations.md) | "Security, RLS, deploy, scale" |
| [VII — Reuse Strategy](./07-reuse.md) | "What to copy vs. build vs. never custom" |
| [VIII — Delivery](./08-delivery.md) | "Risks, roadmap, first 20 tasks" |
| [IX — OpenClaw Advanced](./09-openclaw.md) | "How Phase 2+ automation lands without rewrite" |
| **X — Summary** *(this)* | "Decisions + recap" |

> [← Part IX](./09-openclaw.md) · [Index](../prd.md)
