> **Review (2026-05-17):** See [`../mvp-events.md`](../mvp-events.md). Canonical: [`EVENTS-MVP-PLAN.md`](./EVENTS-MVP-PLAN.md). **Fix:** ticket edges are **in repo** (not “missing”); host/scanner routes **not** in `App.tsx`; event **Places autocomplete** = advanced, not MVP.

# Events MVP Plan — Simple, Production-Ready, Not Overbuilt

## 1. Executive Summary

The correct MVP is already defined across the repo:

> “MVP = first ticket sold on production + first rental lead captured.” 

The platform already has:

* event schema
* ticket tables
* chat
* maps
* Mastra concierge
* Stripe architecture
* scanner architecture
* QR flow architecture
* Supabase realtime
* host dashboards partially implemented

The real blocker is NOT architecture anymore.

The blocker is:

1. deterministic ticketing proof
2. QA
3. production verification
4. missing edge-function hardening
5. deployment parity

The repo repeatedly confirms:

* “do not over-engineer”
* “Mastra proposes only”
* “Supabase owns commerce”
* “OpenClaw is future”
* “Hermes is future”
* “Contests are deferred”  

---

# WHAT SHIPS NOW (MVP)

## Core MVP

### Events

* `/events`
* `/events/:id`
* ticket purchase
* Stripe checkout
* QR generation
* scanner PWA
* attendee wallet
* host dashboard
* realtime KPIs

### Rentals

* AI chat
* rental cards
* Google Maps pins
* lead capture

### AI

* event discovery only
* proposal-only copy generation
* no autonomous execution

---

# WHAT DOES NOT SHIP NOW

## Deferred

### Phase 3+

* contests
* sponsor marketplace
* Hermes ranking
* OpenClaw automation
* WhatsApp orchestration
* autonomous agents
* advanced memory
* AI workflows
* multi-agent orchestration
* dynamic pricing
* CRM
* pgvector-heavy personalization
* advanced venue ERP
* marketing automation

This separation is explicitly enforced in:

* `mvp.md`
* `advanced.md`
* Events PRD v2   

---

# 2. MVP Goal

The MVP goal is NOT:

* “AI event operating system”
* “autonomous event agents”
* “contest platform”
* “sponsor intelligence network”

The MVP goal is:

## ONE REAL EVENT FLOW

```text
Organizer publishes event
↓
Buyer purchases ticket
↓
Stripe webhook succeeds
↓
QR generated
↓
Wallet works
↓
Scanner validates
↓
Dashboard updates
↓
No oversell
```

That is success.

---

# 3. Current State Audit

## What EXISTS

### Database spine exists

Already implemented:

* `events`
* `event_tickets`
* `event_orders`
* `event_attendees`
* `event_check_ins`
* `event_venues`

Confirmed in Events PRD v2. 

---

## Frontend exists

### Public routes

* `/events`
* `/events/:id`

Already confirmed in:

* `App.tsx`
* Events PRD v2 

---

## Chat + Mastra exists

Current working architecture:

* event cards
* map pins
* AI concierge
* search tools
* structured outputs
* map context
* reasoning traces

Confirmed in:

* Chat PRD
* Master PRD
* Mastra audits  

---

## Maps infrastructure exists

Current:

* Google Maps
* Places API direction
* map pins
* MapContext
* event cards
* Places enrichment planning

Confirmed in:

* Events PRD v2
* mde-maps skill references  

---

# WHAT IS MISSING

## Critical missing pieces

### 1. Production-proof ticketing flow

Still not fully verified.

### 2. Permanent Stripe webhook verification

Still blocker.

### 3. Scanner production proof

Still blocker.

### 4. 50-concurrent-buyer proof

Still blocker.

### 5. Lead capture merged to production

Still incomplete.

### 6. Edge-function reconciliation

**Updated (2026-05-17):** `ticket-checkout`, `ticket-payment-webhook`, `ticket-validate`, and `event-staff-link-generator` **exist** under `supabase/functions/`. Remaining gaps: **production webhook**, **host/scanner routes** (EVT-027–037), and **G1–G5** QA — see [`events-progress.md`](../events-progress.md).



---

# 4. MVP User Journeys

---

## Journey 1 — Organizer publishes event

Example:
“Sofía creates Reina de Antioquia Finals.”

Flow:

```text
/host/event/new
→ create event
→ add tickets
→ publish
→ event appears publicly
```

Must succeed on mobile.

---

## Journey 2 — Buyer purchases ticket

Example:
“Camila buys a ticket.”

Flow:

```text
/events/:id
→ Buy Ticket
→ Stripe Checkout
→ payment success
→ QR email
→ wallet
```

---

## Journey 3 — Staff scans attendee

Example:
“Roberto scans 240 attendees.”

Flow:

```text
/staff/check-in/:event
→ scan QR
→ validate
→ green success
→ realtime dashboard updates
```

---

## Journey 4 — Rental lead captured

Example:
“Miguel asks for a Laureles apartment.”

Flow:

```text
chat
→ rental cards
→ maps
→ lead capture
→ leads table
```

---

# 5. MVP Features

## KEEP

### Events

* event creation wizard
* event publish
* ticket tiers
* Stripe checkout
* webhook
* QR wallet
* scanner
* host dashboard
* realtime tiles

### Rentals

* AI search
* cards
* maps
* lead capture

### Maps

* venue pin
* directions
* autocomplete
* place_id

### Mastra

* discovery
* structured responses
* event recommendations

---

# REMOVE / DEFER

## NOT MVP

### AI

* autonomous agents
* memory systems
* orchestration networks
* OpenClaw execution
* Hermes ranking

### Commerce

* dynamic pricing
* resale marketplace
* waitlists
* group buy

### Sponsors

* marketplace
* ROI dashboards
* activation automation

### Contests

* voting
* hybrid scoring
* anti-fraud systems

### Venue ERP

* staffing systems
* contracts
* advanced scheduling

---

# 6. MVP Supabase Plan

## Core tables

### Required now

* `events`
* `event_tickets`
* `event_orders`
* `event_attendees`
* `event_check_ins`
* `event_venues`
* `leads`
* `profiles`

---

## Required policies

### RLS

* organizer owns event
* attendees see only own tickets
* staff links scoped to event
* admin override policies
* realtime channels scoped

---

## Required indexes

### Critical

* `event_id`
* `user_id`
* `status`
* `ticket_id`
* `qr_token_hash`

---

## Realtime channels

### Required

* host dashboard
* check-ins
* attendee counts
* ticket sales

---

# 7. MVP Edge Functions

## Required now

### `ticket-checkout`

Purpose:

* create Stripe Checkout session

Must:

* enforce inventory lock
* prevent oversell
* validate auth

---

### `ticket-payment-webhook`

Purpose:

* Stripe fulfillment

Must:

* verify Stripe signature
* generate QR
* create attendee row
* remain idempotent

---

### `ticket-validate`

Purpose:

* validate QR

Must:

* single-use enforcement
* atomic update
* offline-safe sync

---

### `event-staff-link-generator`

Purpose:

* generate scanner access

Must:

* revoke access
* expire links
* rotate secrets

---

# 8. MVP Frontend Pages

## Required pages

| Route                    | Purpose           |
| ------------------------ | ----------------- |
| `/events`                | discover events   |
| `/events/:id`            | buy tickets       |
| `/host/event/new`        | organizer create  |
| `/host/event/:id`        | dashboard         |
| `/me/tickets`            | ticket wallet     |
| `/staff/check-in/:event` | scanner           |
| `/chat`                  | rentals discovery |

---

# 9. MVP Mastra Role

## Mastra SHOULD do

### Allowed

* event discovery
* rental discovery
* event summaries
* AI copy proposals
* recommendations
* structured cards

---

## Mastra MUST NOT do

### Forbidden

* ticket purchases
* Stripe mutations
* attendee creation
* QR validation
* DB authority

This is explicitly enforced in:

* CLAUDE.md
* Events PRD v2
* MVP simplification guide   

---

# 10. MVP Google Maps Role

## Keep minimal

### Required now (platform / chat)

* map pins (chat + listings)
* venue **text** on event row
* directions link when lat/lng exists

### Defer for **events** MVP (EVT-039+)

* Places **autocomplete** on host wizard
* `place_id` persistence pipeline
* nearby restaurants / attractions cards

---

## NOT NOW

* venue intelligence
* traffic analytics
* heatmaps
* sponsor foot traffic
* grounding-heavy orchestration

---

# 11. MVP Gemini Role

## Allowed

* summaries
* event descriptions
* moderation proposals
* structured outputs
* lead extraction

---

## Forbidden

* autonomous publishing
* autonomous moderation
* payment logic
* event mutations without approval

---

# 12. MVP Testing Plan

## Critical tests

### Commerce

* Stripe checkout
* webhook replay protection
* oversell prevention

### Scanner

* valid QR
* invalid QR
* reused QR
* offline queue

### Frontend

* mobile responsiveness
* Lighthouse ≥90

### Infrastructure

* `npm run floor`
* edge verification
* realtime verification

---

# 13. MVP Acceptance Criteria

## Hard launch gates

### Commerce

* first real Stripe payment succeeds
* webhook fulfills attendee
* QR delivered <2 min

### Scanner

* QR validates <1s
* duplicate scans blocked

### Reliability

* zero oversell with 50 buyers

### UX

* Lighthouse ≥90

### Production

* floor green
* no critical audit failures

---

# 14. MVP Implementation Order

## Correct order

### Phase 1

1. reconcile edge functions
2. verify Stripe webhook
3. verify QR generation
4. verify scanner
5. run 50-buyer test

### Phase 2

6. deploy production smoke
7. verify realtime dashboard
8. verify rental lead capture

### Phase 3

9. launch first real event
10. capture first real rental lead

---

# 15. MVP Risks

## Biggest risks

### Commerce

* Stripe webhook failures
* duplicate fulfillment
* oversell race conditions

### Scanner

* bad Wi-Fi
* duplicate scans
* revoked links not invalidating

### Security

* weak RLS
* auth gaps
* exposed edge endpoints

### Product

* overengineering
* AI distractions
* premature automation

---

# 16. Final MVP Recommendation

## DO THIS NOW

### Focus only on:

1. Stripe production proof
2. scanner proof
3. oversell proof
4. realtime proof
5. rental lead capture proof

---

# DO NOT BUILD YET

## Deferred systems

* OpenClaw
* Hermes
* contest engine
* sponsor marketplace
* AI orchestration
* autonomous workflows
* dynamic pricing
* enterprise venue management

Those belong AFTER:

* first event
* first ticket revenue
* first real users

---

# Key Source Files Reviewed

* `100-events-prd.md` 
* `prd-real-estate.md` 
* `MDEAI-MASTER-PRD.md` 
* `CHAT-CENTRAL-PLAN.md` 
* `prd.md` v5.1 
* `CLAUDE.md` 
* `index-skills.md` 
* `events-prd-v2-mastra-maps-automation.md` 
* `mvp.md` simplification guide 
* `advanced.md` future systems guide 
