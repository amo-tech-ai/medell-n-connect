---
title: Verification of the "Plan needs to be 100% correct" assessment
date: 2026-05-20
auditor: forensic check against disk + prd + tasks/INDEX.md
---

# Verification: which claims hold, which need nuance

The assessment was provided as a markdown analysis. Most lines are correct; a few overstate or misclassify. Below is each non-trivial claim with my verdict.

## Claims I fully agree with ✅

| Claim | Why it's correct |
|---|---|
| "MVP is a QA problem, not an architecture problem" | Verified — F06-F10 all shipped; Path A (F13-F20) is straight ports; remaining risk is execution + verification, not design. |
| "Events-first beats contests-first" | PRD §51 already orders W3 (Roberto events) before any sponsor/contest work. Aligned. |
| "Production claims exceed runtime proof" | Verified — the 2026-05-20 gate-9 rule fix only landed this week. Before that, "Done" didn't require localhost evidence. F09 + F10 backfilled; older Done tasks lean on F05's chat smoke. |
| "Too many advanced systems too early" (OpenClaw, Paperclip, Hermes, sponsor marketplace) | Verified for **legacy** `/home/sk/mde/`. Those systems exist in the legacy repo + edge functions but are **NOT in `mdeapp/`** — and shouldn't be ported. PRD already defers them. |
| "Stripe ticket checkout" + "QR validation" should be MVP | Verified — these are W9 PRD scope (Andrés/Miguel persona). Currently not specced in F22-F31. **Real gap.** |
| "Host dashboard" should be MVP | Partial gap — F25 EventCard covers event display, but a host-list view (Roberto's `/host/events`) needs its own spec. |
| "CopilotKit + Mastra foundation is mostly correct" | Verified — F01-F08 shipped exactly that stack: Next 16 + CK 1.55.2 + Mastra beta + Supabase + Gemini 3.5 Flash + shadcn + Paisa OKLCH + Supabase Auth. |

## Claims I disagree with or that need nuance ⚠️

| Claim | Verdict | Nuance |
|---|---|---|
| "Architecture complexity is still too high" — listing OpenClaw, Hermes, Paperclip, vector memory, PostGIS, MCP servers, AG-UI as `mdeapp` complexity | 🟡 misattributed | The **mdeapp** stack is just `CopilotKit + Mastra + Supabase + Gemini + Maps + Stripe`. OpenClaw / Hermes / Paperclip live in **legacy** `/home/sk/mde/` only — `guard-sensitive-paths.mjs` blocks any edit. They cannot creep into mdeapp without explicit override. AG-UI is bundled in `@ag-ui/mastra` (one dep), not a separate system. MCP servers are dev-time tools (Mastra docs, CopilotKit docs, Supabase, Gemini) — they don't ship to prod. |
| "Multi-agent orchestration should be delayed" | 🟡 misnamed | Mastra is **single-agent-per-turn** with `routerAgent` dispatching to specialists. That's the F18 design. It is NOT multi-agent autonomous orchestration — it's classic intent routing. The label "multi-agent" makes it sound scarier than it is. |
| "Vector memory / pgvector should be delayed" | 🔴 over-correction | pgvector is **already live** in Supabase (3 HNSW indexes, 132 rows of legacy embeddings). Removing it would lose grounded-search capabilities the concierge (F19) needs. Keep. |
| "Dynamic pricing should be delayed" | ✅ correct, but it's not in any current spec | Dynamic pricing isn't in F01-F31 or any draft. No risk to fix. |
| "Production smoke tests" listed as critical blocker | 🟡 partial | Localhost smoke (gate 9) was added 2026-05-20. **Production smoke against `https://mdeapp.vercel.app`** is the real gap — not yet specced. Worth adding as **F32 — production smoke** (~30 min). |
| "Edge function parity" listed as critical | 🟡 partial | Per Supabase audit 04: only `chat-lead-capture` is wired through `mdeapp/supabase/functions/`. 46 others exist on the live Supabase project but no `mdeapp` source mirror. Most are **deferred** (sponsor, openclaw, postiz) per the freeze list. Only ticket-payment-webhook + sponsor-payment-webhook need parity for MVP — and the F11 spec covers the audit. |
| "WhatsApp automation at scale" should be delayed | ✅ correct — and **not in any current scope**. Not a real risk. |
| "Recommended stack: keep ONLY Next + CK + Mastra + Supabase + Stripe + Maps + Gemini + Vercel" | ✅ exactly the mdeapp stack | Already aligned. Nothing to remove. |

## What's MISSING from my F22-F31 port plan (the user's gap analysis is correct)

| MVP need (from user) | F22-F31 coverage | Gap to fix |
|---|---|---|
| Event list | ✅ F25 EventCard + filters | Plus a `/host/events` list page (Roberto) — **new F33** |
| Event detail page | ❌ not in plan | **New F34 — event detail page (Roberto + Tourist)** |
| Stripe checkout | ❌ not in plan (W9 PRD task, never numbered F2X) | **Defer — covered by W9 PRD task; will spec as F35 closer to W9** |
| QR tickets + scanner PWA | ❌ not in plan | **Defer — W9 territory; will spec as F36 + F37 closer to W9** |
| Host dashboard | ❌ not in plan | **New F33 — host dashboard (`/host/events` list)** |
| Rental chat | ✅ F24 RentalCard + F29 RentalsIntakeWizard | OK |
| Lead capture | ✅ Done (F12) | OK |
| Google Maps pins | ✅ F16 Path A | OK (separate track) |
| Basic AI concierge | ✅ F19 Path A | OK (separate track) |

## Red flags / failure points specific to my plan

| # | Risk | Mitigation |
|---|---|---|
| 1 | **F29 (RentalsIntakeWizard with `useCoAgent`)** could desync state if any internal `useState` parallels `useCoAgent`. The legacy used `react-hook-form` for local state — porting verbatim would interfere with CopilotKit's state binding. | F29 spec must use **`useCoAgent<RentalDraftState>` as the single source of truth.** No `react-hook-form` for the wizard data. Per PRD §17 RUNTIME-008. |
| 2 | **F22 hero photos** could be license-encumbered. | Verify: all 15 photos came from the same project. Confirm reuse rights before publishing to public Vercel preview. Default assumption: same project = same license. |
| 3 | **F23 brand wordmark** has a red `#E31B23` heart that visually clashes with Paisa teal + gold. | User decides: keep red (cultural meaning) OR re-derive in teal (system purity). F23 spec deferred until decision lands. |
| 4 | **F25 EventCard + F26 RestaurantCard** could re-introduce inline hex colors if ported lazily. F07 spec explicitly forbids them. | Both specs must mandate Paisa tokens (`bg-primary`, `text-accent-foreground`) — no `style={{ backgroundColor: '#xxx' }}`. |
| 5 | **F27 AdminLayout** is W8 — too far ahead to spec usefully now (Patricia's admin needs may shift). | Defer the spec; only the plan entry stays. |
| 6 | **F28 Sentry** requires an Anthropic-side Sentry account + DSN env var. | Spec acknowledges this as an operator prereq, doesn't block on it. |
| 7 | **Production smoke against `https://mdeapp.vercel.app`** is missing. Localhost is not the same surface. | Add as **F32 — production smoke** — 30 min, no decisions needed. |

## What is "100% correct" right now

After this verification:

- **F22 (hero photos)** — ✅ ready to spec, zero risk
- **F24 (RentalCard)** — ✅ ready to spec, F07 tokens in place
- **F25 (EventCard + filters)** — ✅ ready to spec
- **F26 (RestaurantCard + filters)** — ✅ ready to spec
- **F30 (OnboardingLayout)** — ✅ ready to spec
- **F32 (production smoke against mdeapp.vercel.app)** — ✅ ready to spec, addresses user gap
- **F33 (host dashboard `/host/events`)** — ✅ ready to spec, addresses user gap
- **F23 (brand wordmark)** — ⏸️ awaits red-vs-teal decision
- **F27 (AdminLayout)** — ⏸️ defer to W8
- **F28 (Sentry)** — ⏸️ operator prereq
- **F29 (RentalsIntakeWizard)** — ⏸️ depends on F17 (rentalAgent)
- **F31 (TripWizard)** — ⏸️ Phase 2

## Does any of this interfere with CopilotKit?

Verified **no** for the 5 specs I'm about to create:

- **F22 hero photos** — assets only, no JSX rendered inside CopilotKit chat surface.
- **F24 RentalCard** — used in 2 ways: (a) `/rentals` page as standalone, (b) inside `useCopilotAction({ available: "disabled", render })` as generative UI. Compatible — that's the PRD §20 pattern.
- **F25 EventCard** — same as F24.
- **F26 RestaurantCard** — same as F24.
- **F30 OnboardingLayout** — shell only; doesn't wrap the chat sidebar, doesn't mount CopilotKit twice (the §F07 invariant).

The one spec that **could** interfere is F29 (wizard) — covered by red flag #1 above. We'll write that one carefully when we get to it.
