# MDE AI — Revenue Strategy Index

> Quick-navigation index across the revenue strategy doc set. For the full analysis and reasoning behind each entry, follow the links to the companion docs.
>
> **Companion docs:** [`task-backlog.md`](task-backlog.md) · [`strategic-audit.md`](strategic-audit.md) · [`revenue-strategy-v2.md`](revenue-strategy-v2.md) · [`revenue-engine-prd.md`](revenue-engine-prd.md) · [`../competitors/ai-travel-platforms-competitive-analysis.md`](../competitors/ai-travel-platforms-competitive-analysis.md)
>
> **Date:** 2026-06 · **Overall score:** 57/100 (Technical 80 · Revenue 45 · Marketplace 30) · **Gap:** 9/10 discovery engine, 4/10 revenue system.
>
> **Gate:** All revenue tasks are **post-MVP**. Tier 1 MVP exit (PAY-001 + EVT-001 + MAP-002B + AUTH-011) must close first. Track MVP progress: [Linear MVP view](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a) · `tasks/INDEX.md`

---

## Linear Project Map

All revenue tasks live in existing Linear projects. No new projects needed for CORE phase.

| Linear Project | URL | Revenue Tasks |
|---|---|---|
| **Commerce Platform** | [link](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8) | C2, C3, C4, C10, C11, C12, C15, M1, M3, M4, M10, A1 |
| **AI & Intelligence** | [link](https://linear.app/sanjiovani/project/ai-and-intelligence-fe206edb90b2) | C6, C7, C8, C13, M5, A2, A5, A6, A7 |
| **Growth & Operations** | [link](https://linear.app/sanjiovani/project/growth-and-operations-2effa6c5b651) | C1, C5, C7, C14, M2, M6, M8, M9, M11, A8, A10 |
| **Venues** | [link](https://linear.app/sanjiovani/project/venues-b003fe68b767) | C9, C10, M7 |
| **Real Estate** | [link](https://linear.app/sanjiovani/project/real-estate-43bea599dc09) | C4, C8, M10 |
| **Trips** | [link](https://linear.app/sanjiovani/project/trips-14c2b4268402) | M12, A1, A2 |
| **Discovery Platform** | [link](https://linear.app/sanjiovani/project/discovery-platform-23d24b177348) | A3 |

> **Label convention (follow `linear.md`):** new revenue issues should carry `phase:mvp` (CORE tasks) or `phase:launch` (none — launch phase is done), plus a stack label (`stack:stripe`, `stack:mastra`, `stack:supabase`) and track label (`track:commerce`, `track:ai`, `track:growth`).

---

## Implementation Order

Revenue tasks slot into the existing tier system in `tasks/INDEX.md` **after** the current Tier 1 MVP exit is complete.

### TIER R1 — First revenue sprint (immediately post-MVP-exit, week 1–2)
> Theme: zero-infra cash and internal cleanup. No new tables, no new agents yet.

| Order | ID | Task | Linear Project | Effort | Why first |
|---|---|---|---|---|---|
| 1 | C13 | Remove `pingAgent`, collapse `routerAgent`, park `evaluationAgent` | AI & Intelligence | 3–5 days | Cuts complexity + COGS before adding agents |
| 2 | C1 | Productize the AI Marketing Agency | Growth & Operations | 2–3 wk | Fastest cash; 80–95% margin; no infra required; bills in week 3 |
| 3 | C11 | Extend wallets (Apple/Google Pay) to all checkouts | Commerce Platform | 1 wk | S effort; +20–50% mobile conversion; reuses existing wallet route |
| 4 | C2 | `create_checkout` Mastra tool + checkout widget | Commerce Platform | 3–4 wk | Unblocks all transaction revenue; depends on ticket edge (done) |

### TIER R2 — Revenue infrastructure (weeks 3–7, after C2 ships)
> Theme: add the billing rails so discovery flows can close.

| Order | ID | Task | Linear Project | Effort | Depends on |
|---|---|---|---|---|---|
| 5 | C3 | Stripe Billing + `subscriptions` table | Commerce Platform | 2–4 wk | C1 (first clients need recurring billing) |
| 6 | C12 | `platform_fees` ledger + reconciliation | Commerce Platform | 1–2 wk | C2 (webhook must exist first) |
| 7 | C6 | Sales Agent (upsell / bundle / convert) | AI & Intelligence | 2–3 wk | C2 (`create_checkout` tool must exist) |
| 8 | C15 | Promo/discount codes on tickets | Commerce Platform | 1 wk | C2 |
| 9 | C9 | Restaurant/venue marketing retainer + featured | Venues | 2 wk | C3, C5 |
| 10 | C10 | Nightlife VIP booking + deposit | Commerce Platform + Venues | 2–3 wk | C2, C6 |

### TIER R3 — Lead monetization + WhatsApp wire (weeks 6–12)
> Theme: bill the leads already captured; wire the outbox already built.

| Order | ID | Task | Linear Project | Effort | Depends on |
|---|---|---|---|---|---|
| 11 | C4 | Metered rental-lead billing (`lead_billing`) | Commerce Platform + Real Estate | 2 wk | C3 (Billing must exist) |
| 12 | C5 | `/advertise` self-serve over `sponsor.*` | Growth & Operations | 3–4 wk | none (activates dormant schema) |
| 13 | C7 | Marketing Agent + WhatsApp automation | AI & Intelligence + Growth & Operations | 3 wk | C1 (agency delivers via this) |
| 14 | C8 | Lead Agent (qualify / enrich / route) | AI & Intelligence + Real Estate | 2–3 wk | C4 |
| 15 | C14 | Abandoned-cart / lead WhatsApp recovery | Growth & Operations | 1–2 wk | C7 |

### TIER R4 — Marketplace rail (months 3–6, parallel tracks)
> Theme: add Connect + business portal so transactions scale.

| Order | ID | Task | Linear Project | Effort | Depends on |
|---|---|---|---|---|---|
| 16 | M1 | Stripe Connect Express + destination charges | Commerce Platform | 6–10 wk | C2, C12 |
| 17 | M4 | Business subscription tiers (all verticals) | Commerce Platform | 3–4 wk | C3 |
| 18 | M5 | Sponsor Agent (match / proposal / invoice) | AI & Intelligence | 3 wk | C5 |
| 19 | M6 | `opportunities` CRM pipeline | Growth & Operations | 2–3 wk | C8 |
| 20 | M7 | Restaurant reservation management + confirm loop | Venues | 3 wk | C7 |
| 21 | M8 | `campaigns` / `audiences` / `automations` + engine | Growth & Operations | 3–4 wk | C7 |
| 22 | M2 | `/business` portal (onboarding + dashboard) | Growth & Operations | 4–6 wk | C3, C8 |
| 23 | M9 | Organizer/venue analytics dashboards | Growth & Operations | 3 wk | M2 |
| 24 | M11 | `/partners` operator onboarding | Growth & Operations | 2–3 wk | M1 |
| 25 | M3 | Tourism experience checkout + operator subscriptions | Commerce Platform | 4–6 wk | M1, C2 |
| 26 | M10 | Rental deposit/booking via Connect | Real Estate | 4 wk | M1 |
| 27 | M12 | Consumer Pro/VIP (trips perks) | Trips | 2–3 wk | C3 |

### TIER R5 — Advanced / Phase 2 (months 6–18)
> Theme: marketplace scale, AI OS, multi-operator monetization.

| Order | ID | Task | Linear Project | Effort | Depends on |
|---|---|---|---|---|---|
| 28 | A5 | Personalization (`user_preferences` / `recommendation_signals`) | AI & Intelligence | 4–6 wk | — |
| 29 | A6 | Neighborhood Agent (safety / walkability / lifestyle) | AI & Intelligence | 3 wk | — |
| 30 | A10 | Reputation/review automation | Growth & Operations | 3 wk | C7 |
| 31 | A8 | OpenClaw compliant discovery engine | Growth & Operations (OCL-*) | 4–6 wk | C8 |
| 32 | A2 | Trip Agent (itinerary / budget / bundle) | AI & Intelligence + Trips | 4 wk | A1 |
| 33 | A1 | Trip bundles (separate charges & transfers) | Commerce Platform + Trips | 6–8 wk | M1, A2 |
| 34 | A3 | Full tourism marketplace | Discovery Platform | 8 wk+ | M1, M3 |
| 35 | A7 | "AI operating system" — cross-vertical orchestration | AI & Intelligence | 8 wk+ | A1, A2 |
| 36 | A4 | Fashion marketplace + Colombiamoda | (new project) | 8 wk+ | M1, C5 |
| 37 | A9 | Multi-city expansion framework | (new project) | 8 wk+ | A3 |

---

## Revenue MRR Gate Checklist

| Gate | Tasks required | Target |
|---|---|---|
| First cash | C1 (agency), C3 (billing) | **week 3 post-MVP** |
| $5k MRR | C1 + C3 + C9 + C4 | **month 1** |
| $10k MRR | C-series complete (C1–C15) | **month 3** |
| $25k MRR | M1 + M2 + M4 + partial M-series | **month 6** |
| $50k MRR | Full M-series + A1 + A5 | **month 12** |
| $100k MRR | Full A-series + marketplace GMV | **month 18** |

---

## Task Names by Phase (post-MVP)

> **Gate:** Requires Tier 1 MVP exit (PAY-001 + EVT-001 + MAP-002B + AUTH-011). Track: [Linear MVP view](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a)
>
> Tables sorted by **implementation order** (`#`). `Score` = priority score from `task-backlog.md`. `Prefix` = suggested spec prefix for new Linear issues.

### CORE — 0–3 Months · Target $10k MRR

| # | ID | Task Name | Linear Project | Prefix | Score | Complexity | Effort | Rev |
|---|---|---|---|---|---|---|---|---|
| 1 | C13 | Remove `pingAgent`, collapse `routerAgent`, park `evaluationAgent` | AI & Intelligence | AGENT | 80 | S | 3–5 days | ⭐ |
| 2 | C1 | Productize the AI Marketing Agency | Growth & Operations | GRW | 98 | M | 2–3 wk | ⭐⭐⭐⭐⭐ |
| 3 | C11 | Extend wallets (Apple/Google Pay) to all checkouts | Commerce Platform | REV | 84 | S | 1 wk | ⭐⭐⭐ |
| 4 | C2 | `create_checkout` Mastra tool + checkout widget | Commerce Platform | REV | 96 | M | 3–4 wk | ⭐⭐⭐⭐⭐ |
| 5 | C3 | Stripe Billing + `subscriptions` table | Commerce Platform | REV | 95 | M | 2–4 wk | ⭐⭐⭐⭐⭐ |
| 6 | C12 | `platform_fees` ledger + reconciliation | Commerce Platform | REV | 82 | S–M | 1–2 wk | ⭐⭐ |
| 7 | C6 | Sales Agent (upsell / bundle / convert) | AI & Intelligence | AGENT | 90 | M | 2–3 wk | ⭐⭐⭐⭐⭐ |
| 8 | C15 | Promo/discount codes on tickets | Commerce Platform | REV | 76 | S | 1 wk | ⭐⭐ |
| 9 | C9 | Restaurant/venue marketing retainer + featured | Venues | VEN | 87 | S–M | 2 wk | ⭐⭐⭐⭐ |
| 10 | C10 | Nightlife VIP booking + deposit | Venues | VEN | 85 | M | 2–3 wk | ⭐⭐⭐⭐ |
| 11 | C4 | Metered rental-lead billing (`lead_billing`) | Real Estate | RENT | 94 | S–M | 2 wk | ⭐⭐⭐⭐ |
| 12 | C5 | `/advertise` self-serve over `sponsor.*` | Growth & Operations | GRW | 92 | M | 3–4 wk | ⭐⭐⭐⭐ |
| 13 | C7 | Marketing Agent + WhatsApp automation | AI & Intelligence | AGENT | 89 | M | 3 wk | ⭐⭐⭐⭐ |
| 14 | C8 | Lead Agent (qualify / enrich / route) | AI & Intelligence | AGENT | 88 | M | 2–3 wk | ⭐⭐⭐⭐ |
| 15 | C14 | Abandoned-cart / lead WhatsApp recovery | Growth & Operations | GRW | 78 | S–M | 1–2 wk | ⭐⭐⭐ |

### MVP — 3–6 Months · Target $25k MRR

| # | ID | Task Name | Linear Project | Prefix | Score | Complexity | Effort | Rev |
|---|---|---|---|---|---|---|---|---|
| 16 | M1 | Stripe Connect Express + destination charges | Commerce Platform | REV | 90 | XL | 6–10 wk | ⭐⭐⭐⭐ |
| 17 | M4 | Business subscription tiers (all verticals) | Commerce Platform | REV | 86 | M | 3–4 wk | ⭐⭐⭐⭐ |
| 18 | M5 | Sponsor Agent (match / proposal / invoice) | AI & Intelligence | AGENT | 84 | M | 3 wk | ⭐⭐⭐⭐ |
| 19 | M6 | `opportunities` CRM pipeline | Growth & Operations | GRW | 82 | M | 2–3 wk | ⭐⭐⭐ |
| 20 | M7 | Restaurant reservation management + confirm loop | Venues | VEN | 80 | M | 3 wk | ⭐⭐⭐ |
| 21 | M8 | `campaigns` / `audiences` / `automations` tables + engine | Growth & Operations | GRW | 79 | M | 3–4 wk | ⭐⭐⭐ |
| 22 | M2 | `/business` portal (onboarding + dashboard) | Growth & Operations | GRW | 88 | L | 4–6 wk | ⭐⭐⭐⭐ |
| 23 | M9 | Organizer/venue analytics dashboards | Growth & Operations | GRW | 78 | M | 3 wk | ⭐⭐⭐ |
| 24 | M11 | `/partners` operator onboarding | Growth & Operations | GRW | 75 | M | 2–3 wk | ⭐⭐⭐ |
| 25 | M3 | Tourism experience checkout + operator subscriptions | Commerce Platform | REV | 87 | L | 4–6 wk | ⭐⭐⭐⭐ |
| 26 | M10 | Rental deposit/booking via Connect | Real Estate | RENT | 77 | L | 4 wk | ⭐⭐⭐ |
| 27 | M12 | Consumer Pro/VIP (trips perks) | Trips | TRP | 72 | M | 2–3 wk | ⭐⭐ |

### ADVANCED — 6–18 Months · Target $50–100k MRR

| # | ID | Task Name | Linear Project | Prefix | Score | Complexity | Effort | Rev |
|---|---|---|---|---|---|---|---|---|
| 28 | A5 | Personalization (`user_preferences` / `recommendation_signals`) | AI & Intelligence | AGENT | 78 | L | 4–6 wk | ⭐⭐⭐ |
| 29 | A6 | Neighborhood Agent (safety / walkability / lifestyle) | AI & Intelligence | AGENT | 70 | M | 3 wk | ⭐⭐ |
| 30 | A10 | Reputation/review automation | Growth & Operations | GRW | 66 | M | 3 wk | ⭐⭐ |
| 31 | A8 | OpenClaw compliant discovery engine | Growth & Operations | GRW | 73 | L | 4–6 wk | ⭐⭐⭐ |
| 32 | A2 | Trip Agent (itinerary / budget / bundle) | Trips | TRP | 82 | L | 4 wk | ⭐⭐⭐ |
| 33 | A1 | Trip bundles (separate charges & transfers) | Commerce Platform | REV | 85 | XL | 6–8 wk | ⭐⭐⭐⭐ |
| 34 | A3 | Full tourism marketplace | Discovery Platform | DISC | 80 | XL | 8 wk+ | ⭐⭐⭐⭐ |
| 35 | A7 | "AI operating system" — cross-vertical orchestration | AI & Intelligence | AGENT | 74 | XL | 8 wk+ | ⭐⭐⭐ |
| 36 | A4 | Fashion marketplace + Colombiamoda | (new project) | NEW | 76 | XL | 8 wk+ | ⭐⭐⭐ |
| 37 | A9 | Multi-city expansion framework | (new project) | NEW | 68 | XL | 8 wk+ | ⭐⭐⭐ |

---

## Tech Stack by Task

| ID | Task | Mastra | Stripe | Supabase | Next.js | WhatsApp | Other |
|---|---|---|---|---|---|---|---|
| C1 | AI Agency | Marketing Agent · `gen_content`, `wa_campaign`, `schedule_post` tools | — | `subscriptions` (new) | `/advertise`, landing pages | WhatsApp Business API (send loop) | — |
| C2 | `create_checkout` tool | New transact tool on all agents · Sales Agent wiring | Checkout API · `payment_intent` · webhook extension | — | Checkout widget (React) | — | Extends `ticket-payment-webhook` edge |
| C3 | Stripe Billing | — | Billing API · products/prices/subscriptions · dunning | `subscriptions` migration (new) | Billing status UI | — | Webhook edge (subscription events) |
| C4 | Lead billing | Lead Agent calls `meter_lead_billing` tool | Billing metered API | `lead_billing` migration (new) | — | — | `lead-billing-meter` edge function |
| C5 | `/advertise` sponsor | Sponsor Agent (later, M5) | Checkout API | `sponsor.*` (activate) | `/advertise` page (new) | — | `MapContext.mergePins` for featured pins |
| C6 | Sales Agent | **Sales Agent** (new) · `create_checkout`, `apply_promo`, `bundle_builder` tools | — | — | Upsell UI components | — | Depends C2 |
| C7 | Marketing Agent + WhatsApp | **Marketing Agent** (new) · `gen_content`, `wa_campaign`, `schedule_post` tools | — | `wa_outbox` · `whatsapp_*` | — | WhatsApp Business API (official, opt-in, approved templates) | — |
| C8 | Lead Agent | **Lead Agent** (new) · `qualify_lead`, `enrich_contact`, `meter_lead_billing` tools | — | `leads` · `landlord_inbox` · `lead_billing` | — | — | Depends C4 |
| C9 | Restaurant retainer | — | Billing API (subscription) | `subscriptions` · `sponsor.placements` | Featured listing UI | — | Depends C3, C5 |
| C10 | Nightlife VIP deposit | Sales Agent (C6) | Checkout API (deposit hold) | `bookings` · `venue_booking_requests` | VIP booking flow | — | 10–15% commission logic |
| C11 | Wallets everywhere | — | Payment Element (Apple/Google Pay) | — | Checkout widget extension | — | Extends `api/tickets/wallet` route |
| C12 | `platform_fees` ledger | — | Webhook (balance transactions) | `platform_fees` migration (new) · `payouts` | — | — | Nightly reconciliation edge |
| C13 | Agent cleanup | Remove `pingAgent` · park `evaluationAgent` · collapse `routerAgent` | — | — | — | — | Edit `src/mastra/agents/index.ts` only |
| C14 | WhatsApp recovery | Abandoned-cart trigger (Marketing Agent / automation) | — | `wa_outbox` | — | WhatsApp Business API | Triggered by incomplete checkout webhook |
| C15 | Promo codes | `apply_promo` tool | Discount codes / promotion codes | `event_taxes_and_fees` extension | Promo field at checkout | — | Depends C2 |
| M1 | Stripe Connect | — | Connect Express · destination charges · `application_fee_amount` | `connect_accounts` migration (new) | `/partners` onboarding | — | Connect onboarding webhook |
| M2 | `/business` portal | Lead/Sales Agent wiring | Billing (sub status) | `subscriptions` · `leads` · `roi_daily` · `analytics_events_daily` | `/business` page (new) · dashboard components | — | Depends C3, C8 |
| M3 | Tourism checkout | Sales Agent + `create_checkout` | Connect destination charges | `bookings` | Tourism checkout flow | — | Depends M1, C2 |
| M4 | Business subscription tiers | — | Billing (products/prices — all verticals) | `subscriptions` | Pricing/upgrade UI | — | Depends C3 |
| M5 | Sponsor Agent | **Sponsor Agent** (new) · `match_sponsor`, `gen_proposal`, `create_invoice` tools | Checkout or invoicing | `sponsor.*` | Sponsor dashboard | — | Activates dormant subsystem |
| M6 | `opportunities` CRM | Lead Agent feeds pipeline | — | `opportunities` migration (new) | CRM pipeline UI | — | Depends C8 |
| M7 | Reservation management | Marketing Agent (WhatsApp confirm) | — | `venue_booking_requests` | Venue inbox/calendar | WhatsApp Business API (reservation confirms) | Depends C7 |
| M8 | Campaigns engine | Marketing Agent (`wa_campaign`) | — | `campaigns` · `audiences` · `automations` migrations (new) | Campaign console | WhatsApp Business API | Depends C7 |
| M9 | Organizer analytics | — | — | `roi_daily` · `analytics_events_daily` · `outbound_clicks` | `/analytics` or `/business` sub-page | — | Depends M2 |
| M10 | Rental deposit | Sales Agent + `create_checkout` | Connect destination charges | `bookings` (deposit type) | Rental deposit UI | — | Depends M1 |
| M11 | `/partners` onboarding | — | Connect Express onboarding flow | `connect_accounts` | `/partners` page (new) | — | Depends M1 |
| M12 | Consumer Pro/VIP | conciergeAgent (perks unlock) | Billing (consumer tier) | `trips` · `subscriptions` | `/me` perks UI | — | Depends C3 |
| A1 | Trip bundles | **Trip Agent** · `bundle_builder`, `build_itinerary` tools | Separate charges & transfers | `trip_items` · `bookings` | Trip builder UX | — | Depends M1, A2 |
| A2 | Trip Agent | **Trip Agent** (new) · `build_itinerary`, `bundle_builder`, `budget_plan` tools | — | `trips` · `trip_items` · `budget_tracking` | Trip itinerary UI | — | Depends A1 |
| A3 | Tourism marketplace | Sales Agent + `create_checkout` | Connect (full catalog) | Operator catalog tables | `/marketplace` | — | Depends M1, M3 |
| A4 | Fashion marketplace | Sponsor Agent (sponsorship) | Connect · `sponsor.*` | Fashion tables (new) | Fashion pages | — | Depends M1, C5 |
| A5 | Personalization | Ranking tools (new) | — | `user_preferences` · `recommendation_signals` migrations (new) | Card ranking UI | — | pgvector extension |
| A6 | Neighborhood Agent | **Neighborhood Agent** (new) · `score_neighborhood` tool | — | `neighborhood_profiles` | `/neighborhoods` page | — | — |
| A7 | AI OS / orchestration | Multi-agent Mastra workflows | — | — | — | — | Depends A1, A2 |
| A8 | OpenClaw discovery | External API tools (new) | — | Compliance opt-in tables | — | — | Official discovery APIs, opt-in guard |
| A9 | Multi-city | Config tools | — | City-scoped data + config | Platform-wide | — | Depends A3 |
| A10 | Reputation automation | Marketing Agent / review agent | — | Post-visit triggers | — | WhatsApp Business API | Depends C7 |

---

## Revenue Rail Summary

| Rail | Tasks | What's missing today |
|---|---|---|
| **Stripe Checkout** (one-time) | C2, C10, C11, M3, M10 | `create_checkout` Mastra tool; checkout widget reusable across verticals |
| **Stripe Billing** (recurring) | C3, C4, M4, M12 | `subscriptions` table; metered billing for leads |
| **Stripe Connect Express** (marketplace) | M1, M3, M10, M11, A1, A3 | No Connect, no `application_fee`, no operator payouts |
| **Mastra transact tools** | C2, C6, C8, C15 | All 11 existing tools are read-only; zero transact tools |
| **Agency/services** | C1, C7, C9 | No productized packages, pricing page, or delivery pipeline |
| **WhatsApp automation** | C7, C14, M7, A10 | `wa_outbox` exists; no live send loop, no Business API wiring |
| **Sponsor self-serve** | C5, M5 | `sponsor.*` schema exists; no sell-side UI or agent |
| **Lead billing** | C4, C8 | `leads` captured; `lead_billing` table absent; no qualify gate |

---

## New Supabase Tables Required

| Table | Depends on | Task |
|---|---|---|
| `subscriptions` | Stripe Billing | C3 |
| `lead_billing` | C3 | C4 |
| `platform_fees` | C2 webhook | C12 |
| `opportunities` | C8 | M6 |
| `connect_accounts` | M1 | M1 |
| `campaigns` · `audiences` · `automations` | C7 | M8 |
| `featured_placements` | `sponsor.placements` | C5 |
| `user_preferences` · `recommendation_signals` | pgvector | A5 |

---

## New Mastra Agents Required

| Agent | Key tools | Revenue role | Core task |
|---|---|---|---|
| **Sales Agent** | `create_checkout`, `apply_promo`, `bundle_builder` | Closes every discovery flow | C6 |
| **Marketing Agent** | `gen_content`, `wa_campaign`, `schedule_post` | Powers the AI agency (fastest cash) | C7 |
| **Lead Agent** | `qualify_lead`, `enrich_contact`, `meter_lead_billing` | Bills qualified leads | C8 |
| **Sponsor Agent** | `match_sponsor`, `gen_proposal`, `create_invoice` | Activates dormant `sponsor.*` | M5 |
| **Trip Agent** | `build_itinerary`, `bundle_builder`, `budget_plan` | Multi-operator bundle checkout | A2 |
| **Neighborhood Agent** | `score_neighborhood` | Premium rental content | A6 |

---

## New Next.js Pages Required

| Page | Task | ROI |
|---|---|---|
| `/advertise` | C5 | ⭐⭐⭐⭐⭐ |
| `/business` | M2 | ⭐⭐⭐⭐⭐ |
| `/partners` | M11 | ⭐⭐⭐⭐ |
| `/analytics` | M9 | ⭐⭐⭐⭐ |
| `/sponsors` | M5 | ⭐⭐⭐ |
| `/neighborhoods` | A6 | ⭐⭐⭐ |
| `/marketplace` | A3 | ⭐⭐ |

---

> _Revenue Index v1 — pairs with [`task-backlog.md`](task-backlog.md) (execution order + scores) and [`strategic-audit.md`](strategic-audit.md) (gap analysis). Re-audit quarterly._
