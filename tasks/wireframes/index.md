---
title: mdeai Wireframes — Master Index & Progress Tracker
updated: 2026-06-02
owner: sanjiovani
---

# mdeai — Wireframes Master Index

> **Status legend:** 🟢 Completed · 🟡 In Progress · ⚫ Not Started · 🟥 Blocked

---

## Sitemap

```
PUBLIC / CONSUMER
  /                       Home + concierge entry         → SCREEN-001   page.tsx ✅
  /chat                   3-panel AI concierge (product)  → SCREEN-002/003  page.tsx ⚠️ shell
  /rentals                Rental browse + map             → SCREEN-005   page.tsx ⚠️ shell
  /events/[slug]          Event detail + checkout         → SCREEN-014   page.tsx ✅
  /me/tickets             Ticket wallet list              → SCREEN-015   page.tsx ✅
  /me/tickets/[id]        Ticket QR detail                → SCREEN-015   page.tsx ✅
  /saved                  Saved collections               → SCREEN-011   page.tsx ✅
  /trips                  Trips dashboard                 → SCREEN-012   page.tsx ✅
  /trips/[id]             Trip workspace                  → SCREEN-013   page.tsx ✅
  /login                  Login                           → SCREEN-017   page.tsx ✅
  /signup                 Signup                          → SCREEN-017   page.tsx ✅

  [MISSING PAGES — no page.tsx]
  /restaurants            Restaurant listings + map       → SCREEN-023   ❌ no page
  /nightlife              Nightlife + clubs               → SCREEN-022   ❌ no page
  /host/events            Host dashboard (Roberto)        —              ❌ no page
  /broker                 Broker/venue dashboard          —              ❌ no page
  /admin                  Patricia ops                    —              ❌ no page

HOST / SUPPLY
  /host/event/new         Roberto AI publish wizard       → SCREEN-016   page.tsx ✅

API ROUTES (all implemented)
  /api/copilotkit/[...path]   CopilotKit runtime
  /api/events/[id]/public     Public event fetch
  /api/events/search          Event search
  /api/grounded/search        Grounded places search
  /api/grounding/event-web    Web event grounding
  /api/leads/schedule-viewing Camila lead capture
  /api/places/detail          Places API detail
  /api/places/photo           Places photo proxy
  /api/rentals/search         Rental search
  /api/restaurants/search     Restaurant search
  /api/tickets/checkout       Stripe checkout session
  /api/tickets/wallet         Wallet lookup
  /api/approval-commit        HITL approval commit
```

---

## Screen Progress Tracker

**Summary: 11 Done · 2 In Review · 6 In Progress · 4 Not Started · 0 Blocked — 23 screens total (~78% MVP)**

| Screen | Title | Route | Priority | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|--------|-------|-------|----------|--------|---|-------------|----------------------|----------------|
| SCREEN-001 | Home Chat Chrome | `/` | P0 | 🟢 Completed | 100% | Evidence 2026-05-24; Playwright pass | — | None |
| SCREEN-002 | Chat Nav Rail + Thread List | `/chat` | P0 | 🟢 Completed | 100% | Evidence 2026-06-02; Playwright spec; 445/445 ✅ | — | None |
| SCREEN-003 | Chat Query Bar + Filter Chips | `/chat` | P0 | 🟢 Completed | 100% | Evidence 2026-05-24 | — | None |
| SCREEN-004 | Workflow Progress Strip | `/host/event/new` | P0 | 🟢 Completed | 100% | Evidence 2026-05-24 | — | None |
| SCREEN-005 | Rental Card Polish + CTAs | `/rentals` | P0 | 🟡 In Progress | 40% | Component exists (`rental-card.tsx`) | Rentals not displaying on localhost (reverted 2026-05-27) | Fix rental search → cards; re-run smoke:pin-sync |
| SCREEN-006 | Event Card In-Thread Polish | `/chat` | P0 | 🟢 Completed | 100% | Evidence 2026-05-24; `event-card.tsx` | — | None |
| SCREEN-007 | Venue / Listing Detail Sheet | overlay on `/` | P0 | 🟢 Completed | 100% | Evidence 2026-05-24; `venue-detail-sheet.tsx` | — | None |
| SCREEN-008 | Schedule Viewing Modal (HITL) | overlay on `/rentals` | P0 | 🟢 Completed | 100% | Evidence 2026-05-24; `schedule-viewing-modal.tsx`; leads row confirmed | — | None |
| SCREEN-009 | Booking Checkout Modal + Stripe | overlay on `/events/[slug]` | P0 | 🟡 In Progress | 60% | `booking-checkout-modal.tsx`; Stripe session URL works; smoke:ticket-checkout ✅ | EVT-01 webhook finalize not shipped; `event_orders.status=paid` not confirmed | Ship F11 (Stripe secret separation) → EVT-01 webhook |
| SCREEN-010 | Map Exploration Right Panel | `/chat` right panel | P1 | ⚫ Not Started | 0% | — | No right-panel component for map exploration | After MAP-015 pin sync; add `MapExplorationPanel` |
| SCREEN-011 | Saved Collections Page | `/saved` | P1 | 🟢 Completed | 100% | Evidence 2026-05-20; `saved/page.tsx` 78 lines | — | None |
| SCREEN-012 | Trips Dashboard | `/trips` | P1 | 🟡 In Progress | 55% | `trips/page.tsx` 78 lines; `trip-workspace-view.tsx` exists | Evidence 2026-05-20 (pre-auth); full Playwright gate missing | Add SCREEN-012 Playwright spec + evidence |
| SCREEN-013 | Itinerary Panel | `/trips/[id]` | P1 | 🟡 In Progress | 55% | `trips/[id]/page.tsx` 54 lines; evidence 2026-05-20 | Full itinerary tab interactions not Playwright-tested | Add SCREEN-013 Playwright spec + evidence |
| SCREEN-014 | Event Detail Page | `/events/[slug]` | P0 | 🟢 Completed | 100% | Evidence 2026-05-24; Playwright 5/5; slug + UUID lookup | — | None |
| SCREEN-015 | My Tickets + QR Wallet | `/me/tickets`, `/me/tickets/[id]` | P0 | 🟡 In Progress | 65% | `my-tickets-list.tsx`; `ticket-qr-display.tsx`; pages exist | Checkout→wallet redirect not end-to-end tested; SCREEN-009 Stripe finalize blocks full flow | Complete EVT-01 → retest full Andrés flow |
| SCREEN-016 | Host Event Wizard (Roberto) | `/host/event/new` | P0 | 🟢 Completed | 100% | Evidence 2026-05-24; Playwright 2/2; `HostEventShell`; HITL approval panel | — | None |
| SCREEN-017 | Login / Signup Polish | `/login`, `/signup` | P1 | ⏭️ In Review | 100% | Spec complete 2026-06-02; login/signup pages exist | No Playwright spec; no evidence file; no visual polish in code | Run SCREEN-017 Playwright spec → evidence file → mark Done |
| SCREEN-018 | Mobile Responsive 3-Panel Shell | `/chat` mobile | P0 | ⚫ Not Started | 0% | — | No mobile bottom-sheet or responsive 3-panel; blocks mobile UX entirely | Implement mobile shell: bottom-sheet + peek/half/full |
| SCREEN-019 | Loading / Error / Empty States | global | P1 | 🟢 Completed | 100% | Evidence 2026-05-20 | — | None |
| SCREEN-020 | Accessibility Pass (MVP surfaces) | global | P1 | 🟢 Completed | 100% | Evidence 2026-05-20 | — | None |
| SCREEN-021 | Café Listings + Map + Booking | `/` café mode | P1 | 🟡 In Progress | 70% | Phase A.5 Done (evidence 2026-05-27); café cards + map pins working | Phase B (booking request flow) + Phase C (intelligence ranking) pending | Ship Phase B: booking-request form → edge |
| SCREEN-022 | Nightlife Listings + Map | `/nightlife` | P1 | ⚫ Not Started | 0% | Wire spec exists (`007-wire-nightlife-listings-map.md`) | No page.tsx; no nightlife route; no listings component | Create `/nightlife/page.tsx`; reuse café card pattern |
| SCREEN-023 | Restaurant Listings + Map | `/restaurants` (chat mode) | P1 | ⏭️ In Review | 100% | Spec complete 2026-06-02; `api/restaurants/search` live; wire done | `RestaurantResultCard` + `RestaurantDetailPanel` not built; no page.tsx | Implement Phase A: RestaurantResultCard + page route + map pins |

---

## Wireframe Coverage

| Wire ID | Title | Paired Screen | Build Status | Spec File |
|---------|-------|---------------|-------------|-----------|
| WIRE-001 | Home / Concierge Chat | SCREEN-001 | 🟢 Done | `screens/001-wire-home-chat.md` |
| WIRE-002 | Rental Search (in-thread) | SCREEN-005 | 🟡 Partial | `real-estate/009-wire-rental-search.md` |
| WIRE-003 | Event Discovery (in-thread) | SCREEN-006 | 🟢 Done | `events/003-wire-event-discovery.md` |
| WIRE-004 | Venue / Listing Detail (sheet) | SCREEN-007 | 🟢 Done | `venues/006-wire-venue-detail.md` |
| WIRE-005 | Itinerary Tab | SCREEN-013 | 🟢 Done | `trips/013-wire-itinerary-planner.md` |
| WIRE-006 | Booking Checkout (modal) | SCREEN-009 | 🟢 Done | `trips/010-wire-booking-checkout.md` |
| WIRE-007 | Saved Collections | SCREEN-011 | 🟢 Done | `trips/014-wire-saved-collections.md` |
| WIRE-010 | Nightlife Listings + Map | SCREEN-022 | 🟢 Done | `venues/007-wire-nightlife-listings-map.md` |
| WIRE-011 | Creator Dashboard | — | ⚫ Frozen | `trips/019-wire-creator-dashboard.md` |
| WIRE-013 | Mindtrip Observed Patterns | reference | ⚫ Reference | `screens/020-wire-mindtrip-patterns.md` |
| WIRE-014 | Chat Chrome (nav, filters, workflow) | SCREEN-002/003 | 🟡 Mixed | `screens/002-wire-chat-chrome.md` |
| WIRE-015 | Rentals Browse (catalog) | SCREEN-005 | ⚫ Frozen | `real-estate/009-wire-rentals-browse.md` |
| WIRE-016 | Explore Unified | — | ⚫ Frozen | `trips/016-wire-explore-unified.md` |
| WIRE-017 | Trips Dashboard | SCREEN-012 | 🟢 Done | `trips/012-wire-trips-dashboard.md` |
| WIRE-018 | Trip Workspace (full tabs) | SCREEN-013 | 🟢 Done | `trips/012-wire-trip-workspace.md` |
| WIRE-019 | Event Detail Page | SCREEN-014 | 🟢 Done | `events/003-wire-event-detail-page.md` |
| WIRE-020 | My Tickets + QR | SCREEN-015 | 🟢 Done | `015-wire-my-tickets-qr.md` |
| WIRE-021 | Bookings Inbox | — | ⚫ Frozen | `trips/010-wire-bookings-inbox.md` |
| WIRE-022 | Host Event Wizard | SCREEN-016 | 🟢 Done | `events/004-wire-host-event-wizard.md` |
| WIRE-023 | Onboarding Wizard | — | ⚫ Deferred | `trips/023-wire-onboarding-wizard.md` |
| WIRE-024 | Login / Signup | SCREEN-017 | 🟢 Done | `screens/024-wire-auth-login-signup.md` |
| WIRE-025 | Notifications | — | ⚫ Deferred | `screens/025-wire-notifications.md` |
| WIRE-026 | Café Listings + Map + Booking | SCREEN-021 | 🟢 Done | `venues/005-wire-cafe-listings-map-booking.md` |
| WIRE-027 | Restaurant Listings + Map | SCREEN-023 | 🟢 Done | `venues/008-wire-restaurant-listings-map.md` |
| WIRE-028 | Host Events List (Roberto) | EVP-014-core | 🟢 Done | `events/wireframes/EVP-014-wire-host-events-list.md` |

---

## App Routes vs Wireframe Coverage

| Route | page.tsx | Lines | Wireframe | Screen | Status |
|-------|----------|-------|-----------|--------|--------|
| `/` | ✅ | 24 | WIRE-001 | SCREEN-001 | 🟢 Done |
| `/chat` | ✅ | 6 (shell) | WIRE-014 | SCREEN-002/003 | 🟡 Shell only |
| `/rentals` | ✅ | 9 (shell) | WIRE-002/015 | SCREEN-005 | 🟡 Broken display |
| `/events/[slug]` | ✅ | 39 | WIRE-019 | SCREEN-014 | 🟢 Done |
| `/host/event/new` | ✅ | 12 | WIRE-022 | SCREEN-016 | 🟢 Done |
| `/login` | ✅ | 30 | WIRE-024 | SCREEN-017 | ⏭️ Spec In Review |
| `/signup` | ✅ | 28 | WIRE-024 | SCREEN-017 | ⏭️ Spec In Review |
| `/me/tickets` | ✅ | 27 | WIRE-020 | SCREEN-015 | 🟡 Partial |
| `/me/tickets/[id]` | ✅ | ~15 | WIRE-020 | SCREEN-015 | 🟡 Partial |
| `/saved` | ✅ | 78 | WIRE-007 | SCREEN-011 | 🟢 Done |
| `/trips` | ✅ | 78 | WIRE-017 | SCREEN-012 | 🟡 Partial |
| `/trips/[id]` | ✅ | 54 | WIRE-018 | SCREEN-013 | 🟡 Partial |
| `/restaurants` | ❌ missing | — | WIRE-027 | SCREEN-023 | ⏭️ Spec In Review (Wave 1) |
| `/nightlife` | ❌ missing | — | WIRE-010 | SCREEN-022 | ⚫ No page |
| `/host/events` | ❌ missing | — | WIRE-028 | EVP-014-core | ⚫ Wire done; implement Wave 7 |
| `/broker` | ❌ missing | — | — | — | ⚫ No page |
| `/admin` | ❌ missing | — | — | — | ⚫ Post-MVP |

---

## Missing Pages — Gap List

| Gap | Impact | Blocks |
|-----|--------|--------|
| No `/restaurants/page.tsx` (spec In Review — implement next) | Tourist can't browse restaurants | SCREEN-023 |
| No `/nightlife/page.tsx` | Andrés / Tourist can't browse nightlife | SCREEN-022 |
| `/chat` is a 6-line shell — nav rail not implemented | Camila's primary surface is non-functional | SCREEN-002 |
| `/rentals` shows nothing — rental cards broken since 2026-05-27 | Camila can't see rentals | SCREEN-005 |
| Stripe webhook finalize not shipped | Andrés can't complete ticket purchase | SCREEN-009/015 |
| No mobile bottom-sheet (SCREEN-018) | Entire mobile UX broken | All mobile users |
| No `/host/events` dashboard (wire done — EVP-014 Wave 7) | Roberto has no post-publish view | EVP-014-core |
| No `/broker` or `/admin` | Patricia / operators have no surface | Post-MVP |

---

## Implementation Order

> **Rule:** execute within each wave top-to-bottom; `‖` = safe to run in parallel.
> Ordering logic: (1) unblock the three MVP hero flows (Camila · Andrés · Roberto), (2) fill discovery gaps, (3) polish.

---

### Wave 0 — Already Done ✅ (skip, confirm evidence only)

| Screen | Title | Evidence |
|--------|-------|----------|
| SCREEN-001 | Home Chat Chrome | 2026-05-24 |
| SCREEN-003 | Chat Query Bar + Filter Chips | 2026-05-24 |
| SCREEN-004 | Workflow Progress Strip | 2026-05-24 |
| SCREEN-006 | Event Card In-Thread Polish | 2026-05-24 |
| SCREEN-007 | Venue / Listing Detail Sheet | 2026-05-24 |
| SCREEN-008 | Schedule Viewing Modal | 2026-05-24 |
| SCREEN-011 | Saved Collections Page | 2026-05-20 |
| SCREEN-014 | Event Detail Page | 2026-05-24 |
| SCREEN-016 | Host Event Wizard | 2026-05-24 |
| SCREEN-019 | Loading / Error / Empty States | 2026-05-20 |
| SCREEN-020 | Accessibility Pass | 2026-05-20 |

---

### Wave 1 — Spec In Review → implement (start now) ‖

Both specs are complete (In Review 2026-06-02). Implement from the spec + DESIGN.MD.

```
1. SCREEN-017  Login / Signup Polish         /login + /signup   ⏭️ Spec In Review
   Why:  Spec done. Pages exist (30/28 lines). Zero backend. Unblocks auth e2e tests.
   Work: shadcn form polish · error states · data-testid · Playwright spec · evidence file
   Spec: tasks/wireframes/screens/017-scr-login-signup-polish.md

2. SCREEN-023  Restaurant Listings + Map     /restaurants        ⏭️ Spec In Review
   Why:  Spec done. /api/restaurants/search already live. page.tsx + RestaurantResultCard + map needed.
   Work: create page.tsx · RestaurantResultCard · RestaurantDetailPanel · map pins · Playwright spec
   Spec: tasks/venues/tasks/mvp/wireframes/008-scr-restaurant-listings-map.md
```

---

### Wave 2 — Camila's rental flow (G2) — needs backend F49/F50/F24 first

```
Backend prereqs (ship before SCREEN-005):
  F49  rental search API fix (correct columns/filters returned)
  F50  pin sync — rental card ↔ map pin highlight
  F24  rental data present in Supabase

3. SCREEN-005  Rental Card Polish + CTAs     /rentals
   Why:  Camila's primary browse path shows nothing since 2026-05-27 revert.
         Blocks: nothing new (007/008/011 already Done); but G2 is proven only
         when a rental card is visible AND Schedule Viewing modal fires.
   Depends on: F49 · F50 · F24 · SCREEN-004 ✅
   Work: fix rental query → cards render · smoke:pin-sync green · Playwright spec
```

---

### Wave 3 — Andrés money flow (G1) — needs F11 before EVT-01

These must run in order (F11 → EVT-01 → SCREEN-009 → SCREEN-015).

```
Backend prereq:
  F11   Stripe webhook secret audit — separate keys per environment
  EVT-01 Stripe webhook handler → sets event_orders.status = paid

4. SCREEN-009  Booking Checkout Modal + Stripe   overlay on /events/[slug]
   Why:  Stripe session URL works but order is never finalized. Andrés
         cannot complete a purchase until EVT-01 ships.
   Depends on: SCREEN-006 ✅ · SCREEN-014 ✅ · F11 · EVT-01
   Blocks:     SCREEN-015
   Work: wire webhook → test full Stripe → orders.status=paid confirmed via SQL

5. SCREEN-015  My Tickets + QR Wallet           /me/tickets · /me/tickets/[id]
   Why:  Pages + QR component exist but checkout→wallet redirect is untested.
         This is the final step of the Andrés flow — without it the loop is open.
   Depends on: SCREEN-009 (must be Done first)
   Work: run full Andrés E2E (buy → redirect → wallet → QR shows) · Playwright spec
```

---

### Wave 4 — Shell infrastructure (needs F48 + MAP-007B backend)

Both SCREEN-002 and SCREEN-018 are gated on the same backend task (F48 thread hydration). Ship F48 + MAP-007B, then do them in parallel.

```
Backend prereqs:
  F48     mastra_threads + CopilotKit thread-id hydration (enables nav rail)
  MAP-007B  mobile map mount de-duplication (single map instance on mobile)

6. SCREEN-002  Chat Nav Rail + Thread List    /chat  ‖  SCREEN-018
   Why:  /chat is a 6-line stub. Thread list requires F48 (CopilotKit thread
         hydration is backend-heavy — spec flagged deferred until F48 ships).
   Depends on: SCREEN-001 ✅ · F48
   Work: ChatNavRail component · thread list · active thread highlight

7. SCREEN-018  Mobile Responsive 3-Panel Shell   /chat mobile  ‖  SCREEN-002
   Why:  Zero mobile shell = every mobile user hits the desktop layout.
         Biggest surface-area gap affecting all personas on phones.
   Depends on: SCREEN-001 ✅ · F48 · MAP-007B
   Work: bottom-sheet (peek/half/full) · responsive breakpoints · mobile Playwright
```

---

### Wave 5 — Remaining discovery pages (Tourist) ‖

Can start as soon as Wave 3 clears dev bandwidth — no hard dependency on Waves 3–4.

```
8. SCREEN-022  Nightlife Listings + Map    /nightlife   (NEW PAGE)
   Why:  Wire spec done. Tourist + Andrés have no nightlife browse surface.
         Reuses grounded/search API (same as restaurants).
   Work: create /nightlife/page.tsx · wire to /api/grounded/search · map

9. SCREEN-021  Café Listings Phase B       / (café mode)
   Why:  Phase A.5 Done (cards + pins). Phase B = booking-request form
         submitted → /api/leads/schedule-viewing (same edge as SCREEN-008).
   Work: wire booking form submit · edge call · confirmation state
```

---

### Wave 6 — P1 map polish (after MAP-015 pin sync)

```
10. SCREEN-010  Map Exploration Right Panel   /chat right panel
    Why:  Clicking a pin should open a detail panel in the right column.
          Currently pins are orphaned — tap does nothing.
    Depends on: MAP-015 (restaurant/grounded card ↔ pin sync)
    Work: MapExplorationPanel component · pin click → panel slide-in
```

---

### Wave 7 — Post-MVP completions

These have pages + partial code. Need Playwright specs + full evidence to be called Done.

```
11. SCREEN-012  Trips Dashboard      /trips
    Work: add SCREEN-012 Playwright spec · auth-gated test · evidence file

12. SCREEN-013  Itinerary Panel      /trips/[id]
    Work: add SCREEN-013 Playwright spec · itinerary tab interactions · evidence

13. EVP-014     Host Events List     /host/events   (NEW PAGE)
    Why:  Roberto has no post-publish view — can't see his own events.
    Work: create page · list published events from DB · link from wizard
```

---

### Summary queue (all 13 remaining items)

```
WAVE 1 (now, parallel)    SCREEN-017  ‖  SCREEN-023
WAVE 2 (after F49/F50)    SCREEN-005
WAVE 3 (after F11/EVT-01) SCREEN-009 → SCREEN-015
WAVE 4 (after F48/MAP-007B, parallel) SCREEN-002 ‖ SCREEN-018
WAVE 5 (parallel, open)   SCREEN-022  ‖  SCREEN-021
WAVE 6 (after MAP-015)    SCREEN-010
WAVE 7 (post-MVP)         SCREEN-012  ·  SCREEN-013  ·  EVP-014
```

---

## Spec File Index

| File | Covers |
|------|--------|
| [`00-foundations.md`](00-foundations.md) | Design system, reusable components, map patterns |
| [`01-marketing.md`](01-marketing.md) | Homepage, AI concierge landing |
| [`02-discovery.md`](02-discovery.md) | Restaurant, rental, nightlife discovery |
| [`03-chat-maps-workspace.md`](03-chat-maps-workspace.md) | Conversational search, maps+cards, trip workspace |
| [`04-detail-booking.md`](events/04-detail-booking.md) | Restaurant detail, rental detail, booking workflow |
| [`05-whatsapp-mobile.md`](05-whatsapp-mobile.md) | WhatsApp onboarding + mobile UI (Phase 2 / deferred) |
| [`06-user-operator-dashboards.md`](06-user-operator-dashboards.md) | Saved/dashboard, AI memory, broker/venue, admin ops |
| [`screens/`](screens/INDEX.md) | Platform shell: 001, 002, 003, 004, 017–020 |
| [`events/`](events/003-events-README.md) | Event discovery (003), host wizard (004) |
| [`real-estate/`](real-estate/009-wire-rentals-browse.md) | Rental browse (009), schedule viewing (017) |
| [`trips/`](trips/012-wire-trips-dashboard.md) | Checkout (010), trips dashboard (012), itinerary (013), saved (014) |
| [`015-wire-my-tickets-qr.md`](015-wire-my-tickets-qr.md) | My Tickets + QR (SCREEN-015) |

*Domain folder canonical specs: `tasks/venues/tasks/mvp/wireframes/` (005–008) · `tasks/maps/wireframes/` (011) · `tasks/archive/events-A/wireframes/` (SCREEN-006, 014, 015, 016)*
