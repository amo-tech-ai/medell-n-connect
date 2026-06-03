---
title: mdeai — Sitemap
updated: 2026-06-02
app: mdeapp/ (Next.js App Router)
prod: https://www.mdeai.co
---

# mdeai Sitemap

## Legend

```
✅  LIVE     route exists + functional (page.tsx / route.ts shipped, tested)
⚠️  SHELL    route exists but barely implemented — broken or stub only
🔵  MVP      planned for MVP launch (P0 = blocks launch · P1 = polish)
⚫  POST     planned post-MVP (Phase 1 W6–W10)
💫  PHASE 2  advanced / WhatsApp / Phase 2+
```

---

## Consumer — public-facing pages

```
/                                    ✅ LIVE    Home — hero + concierge entry + verticals
│
├── /chat                            ⚠️ SHELL   3-panel concierge (6-line stub — nav rail missing)
│   ├── [overlay] venue-detail-sheet ✅ LIVE    Venue / rental / event detail slides over chat
│   └── [overlay] schedule-viewing  ✅ LIVE    Camila books a rental viewing (HITL lead capture)
│
├── /rentals                         ⚠️ SHELL   Rental browse + map (display broken since 2026-05-27)
│   └── /rentals/[id]                🔵 MVP P1  Rental detail page (full sheet on mobile)
│
├── /events/[slug]                   ✅ LIVE    Event detail — ticket tiers + Buy CTA
│   └── [overlay] booking-checkout  ⚠️ SHELL   Stripe checkout (session works; webhook finalize missing)
│
├── /restaurants                     🔵 MVP P1  Restaurant browse + filters (PR pending prod deploy)
│   └── /restaurants/[slug]          ⚫ POST    Restaurant detail page
│
├── /cafes                           ⚠️ SHELL   Café browse placeholder — chat + SCREEN-021 in-chat live
│
├── /nightlife                       ⚠️ SHELL   Nightlife browse placeholder — chat panels live (VEN-013)
│   └── /nightlife/[slug]            ⚫ POST    Nightlife venue / event detail
│
├── /saved                           ✅ LIVE    Saved places + collections
│
├── /trips                           ⚠️ SHELL   Trips dashboard (page exists, incomplete)
│   └── /trips/[id]                  ⚠️ SHELL   Trip workspace + itinerary panel
│
├── /me
│   ├── /me/tickets                  ✅ LIVE    Ticket wallet — all purchases (Andrés)
│   │   └── /me/tickets/[id]         ✅ LIVE    Single ticket + QR code (scan at door)
│   └── /me/profile                  ⚫ POST    AI memory & personalization — view / edit / delete
│
├── /notifications                   💫 PHASE 2 In-app notification centre
├── /onboarding                      ⚫ POST    Post-signup wizard (preferences + neighborhood)
│
├── /login                           ✅ LIVE    Login (functional, visual polish pending)
├── /signup                          ✅ LIVE    Signup (functional, visual polish pending)
│
├── /about                           ⚫ POST    Marketing — about mdeai
├── /partners                        ⚫ POST    Partner / venue onboarding landing
└── /legal
    ├── /legal/privacy               ⚫ POST    Privacy policy
    └── /legal/terms                 ⚫ POST    Terms of service
```

---

## Supply — host & broker

```
/host
├── /host/event/new                  ✅ LIVE    Roberto's AI publish wizard (HITL, CopilotKit)
│   └── [overlay] approval-panel    ✅ LIVE    Roberto approves AI-drafted event before publish
└── /host/events                     🔵 MVP P1  Host event list — Roberto sees his events + sales

/broker                              ⚫ POST    Broker / venue operator dashboard
├── /broker/leads                    ⚫ POST    Lead inbox (AI-drafted replies, HITL approve/send)
├── /broker/listings                 ⚫ POST    Manage rental / venue listings
└── /broker/payouts                  ⚫ POST    Commission + payout accounting
```

---

## Ops — internal / admin

```
/admin                               ⚫ POST    Patricia: ops command centre (W8)
├── /admin/leads                     ⚫ POST    Leads CRM — pipeline (New → Contacted → Won/Lost)
├── /admin/listings                  ⚫ POST    Listing approval queue (verify before going live)
├── /admin/events                    ⚫ POST    Event moderation queue
├── /admin/users                     ⚫ POST    User directory + AI memory viewer
└── /admin/cost                      ⚫ POST    Gemini + Places spend panel (FieldMask / cost levers)
```

---

## Auth (internal — no UI page)

```
/auth
├── /auth/callback                   ✅ LIVE    Supabase OAuth callback handler
└── /auth/signout                    ✅ LIVE    Sign-out + session clear
```

---

## API routes

```
/api

  ── AI runtime ──────────────────────────────────────────────────────────────────
  /api/copilotkit/[[...path]]        ✅ LIVE    CopilotKit → Mastra bridge (all agent turns)
  /api/approval-commit               ✅ LIVE    Roberto HITL — commit approved event draft

  ── Events ──────────────────────────────────────────────────────────────────────
  /api/events/[id]/public            ✅ LIVE    Fetch a published event by ID (RLS public)
  /api/events/search                 ✅ LIVE    In-thread event search (Mastra tool)
  /api/grounding/event-web           ✅ LIVE    Web-grounded event discovery (Gemini + Places)

  ── Places / map ────────────────────────────────────────────────────────────────
  /api/grounded/search               ✅ LIVE    Grounded place search (restaurants, cafés, nightlife)
  /api/places/detail                 ✅ LIVE    Single place detail (Places API New, FieldMask-gated)
  /api/places/photo                  ✅ LIVE    Photo proxy — avoids CORS on client

  ── Rentals ─────────────────────────────────────────────────────────────────────
  /api/rentals/search                ✅ LIVE    Rental search (Mastra tool → Supabase)

  ── Restaurants ─────────────────────────────────────────────────────────────────
  /api/restaurants/search            ✅ LIVE    Restaurant search + browse page (deploy pending)

  ── Tickets / payments ──────────────────────────────────────────────────────────
  /api/tickets/checkout              ✅ LIVE    Create Stripe checkout session → returns sessionUrl
  /api/tickets/wallet                ✅ LIVE    List buyer's purchased tickets
  /api/tickets/webhook               🔵 MVP P0  Stripe webhook → finalize order (EVP-003, blocked 🚨)

  ── Leads ───────────────────────────────────────────────────────────────────────
  /api/leads/schedule-viewing        ✅ LIVE    Camila submits a viewing request → leads table

  ── Admin / broker (proposed) ───────────────────────────────────────────────────
  /api/admin/approve-listing         ⚫ POST    Patricia approves a listing
  /api/broker/leads                  ⚫ POST    Broker lead management

  ── Phase 2 ─────────────────────────────────────────────────────────────────────
  /api/whatsapp/webhook              💫 PHASE 2 WhatsApp Business API inbound handler
  /api/ai/memory                     💫 PHASE 2 Read / update Camila's AI preference profile
```

---

## Phase 2 — WhatsApp transport

```
WhatsApp Business (+57 XXX)          💫 PHASE 2 Same Mastra brain, WhatsApp renderer
  ├── Onboarding flow (interactive buttons)
  ├── Rental / event / restaurant cards (≤3 picks per bubble — GuideGeek pattern)
  ├── Location pins
  ├── Voice note intake
  └── Human handoff → Chatwoot (hot leads / payments)

/whatsapp                            💫 PHASE 2 Web landing — scan QR or click to open WA chat
```

---

## Summary counts

| Category | ✅ LIVE | ⚠️ SHELL | 🔵 MVP | ⚫ POST | 💫 P2 | Total |
|----------|:------:|:-------:|:-----:|:------:|:-----:|------:|
| Consumer pages | 7 | 4 | 3 | 7 | 2 | 23 |
| Supply pages | 2 | — | 1 | 3 | — | 6 |
| Ops pages | — | — | — | 5 | — | 5 |
| Auth routes | 2 | — | — | — | — | 2 |
| API routes | 12 | — | 1 | 2 | 2 | 17 |
| **Total** | **23** | **4** | **5** | **17** | **4** | **53** |

---

## Critical gaps — MVP launch blockers

| Route / surface | Gap | Priority |
|-----------------|-----|----------|
| `/api/tickets/webhook` | Stripe order finalize not shipped — Andrés can't complete a ticket purchase | 🚨 P0 |
| `/chat` nav rail | Primary product surface is a 6-line stub — thread list + nav rail not implemented | 🚨 P0 |
| Mobile bottom-sheet | No responsive shell — all mobile users hit the desktop layout unmodified | 🚨 P0 |
| `/rentals` display | Rental cards broken since 2026-05-27 revert — Camila's main browse path shows nothing | P0 |
| `/restaurants` | Browse page in PR — prod 404 until deploy | P1 |
| `/cafes` | Placeholder only — full catalog browse not shipped | P1 |
| `/nightlife` | Placeholder only — full catalog browse blocked on VEN-013 | P1 |
| `/host/events` | Roberto has no view after publishing — can't see his own event list | P1 |
| `/rentals/[id]` | Rental detail page doesn't exist — cards link nowhere | P1 |
