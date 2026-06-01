# mdeai.co — MVP Definition & Simplification Guide

> **Purpose:** This document is the canonical MVP filter. When in doubt whether to build something, check this doc first. If it's not in §2–4, it doesn't ship before the MVP gates pass.
>
> **Audience:** Founder + one developer shipping fast.
> **Last updated:** 2026-05-20
> **Status:** Active — supersedes any roadmap item that contradicts it

> **⚠️ Greenfield truth (2026-05-20):** This doc mixes **legacy `/home/sk/mde/`** maturity with **new `mdeapp/`** reality. For **what exists in mdeapp today**, use [`prd.md` § Repo truth](../prd.md#repo-truth-mdeapp-2026-05-20) and [`roadmap.md` § Current state](real-estate/draft/roadmap.md#current-state-2026-05-20). **MVP exit outcomes** (4 bullets): [`mvp.md`](../mvp.md) at repo root. **PR build order:** [`roadmap.md` § Repo-first PR track](real-estate/draft/roadmap.md#repo-first-pr-track). **Audit:** [`plan/docs/prd-audit-report.md`](./docs/prd-audit-report.md).

---

## 1. Executive Summary

### What mdeai.co actually is

A **local discovery and ticketing platform for Medellín** with an AI chat layer.

- Someone types "find me a 2BR in Laureles under $80/night" → rental cards + a map
- Someone finds an event, buys a ticket with Stripe → QR code → scans in at the door
- That's the product. Everything else is future.

### What the MVP really is

**MVP = first ticket sold on mdeai.co production + first rental lead captured.**

The core is already built. The 5 QA gate items (G1–G5) are the only thing blocking Phase 1 done. The MVP is not an architecture problem — it's a QA problem.

### What success means for MVP

1. First Stripe payment received for a real ticket → `event_orders` row in production
2. Buyer sees ticket + QR in wallet after payment (`/me/tickets/:id`)
3. At least one rental lead captured from the chat → `leads` table in production

**Post-MVP / event-ops (not MVP closure):** door scanner check-in, staff PWA, staff link revocation QA, organizer self-serve publish without dev help, 50-buyer load test, first-event uptime soak. Track in `tasks/mvp-proofs/003-scanner-checkin-proof.md` and Phase 1.5 hardening.

### What is NOT part of MVP

| Not MVP | Why |
|---------|-----|
| Contests / voting | **Phase 3** — closer to fintech/elections than "event voting" (anti-fraud, legal, identity, dispute, regional compliance) |
| Sponsor marketplace | Phase 3 — no sponsors yet, premature to build the marketplace |
| Hermes ranking (7-factor composite) | Phase 3 — needs real user data to train on first |
| OpenClaw VPS execution | Phase 4 — no autonomous workflows to govern yet |
| Paperclip governance | Phase 4 — no multi-agent system to govern |
| WhatsApp broadcast | Phase 4 — needs VPS, Infobip integration |
| Scam detection pipeline (6-signal ML) | Phase 3 — manual curation is fine for 28 apartments |
| Stripe Connect rental bookings (12%) | Phase 5 — affiliate links work fine for MVP |
| Landlord SaaS ($29–99/mo) | Phase 5 |
| pgvector semantic search on apartments | Phase 3 — keyword + PostGIS search is enough for MVP |
| Hermes taste vectors (1536-dim per user) | Phase 3 — no user data to train on |
| Firecrawl / Apify rental scraping | Phase 3 |
| Trip planner | Post-MVP |
| Mastra eval harness, multi-agent, memory, orchestration | Phase 3 — premature before first real users |

---

## 1A. Current Verified Reality (single source of truth for "what actually exists")

> **Why this section exists:** Older docs called systems "✅ built" when they had only **prototype code**. That created fake-ready planning. Every critical system below carries a 4-tier status. **Replan whenever a row moves up a tier.**
>
> **Status legend:**
>
> | Status | Meaning |
> |--------|---------|
> | **Prototype** | Code exists locally. May not run end-to-end. |
> | **Integrated** | Wired across frontend ↔ edge fn ↔ DB. Works on localhost. |
> | **Production-ready** | Deployed to mdeai.co; smoke passed on production URL. |
> | **Live-verified** | A real (non-developer) user completed the flow on production. |

| System | Prototype | Integrated | Production-ready | Live-verified | Last checked |
|--------|:---:|:---:|:---:|:---:|--------------|
| `ticket-checkout` edge fn | ✅ | ✅ | ⚠️ smoke localhost + Stripe CLI only | ❌ | 2026-05-17 |
| `ticket-payment-webhook` | ✅ | ✅ | ⚠️ **no permanent Stripe Dashboard webhook yet** | ❌ | 2026-05-17 |
| `ticket-validate` (QR JWT) | ✅ | ✅ | ⚠️ not exercised on prod URL | ❌ | 2026-05-17 |
| `event-staff-link-generator` | ✅ | ✅ | ⚠️ | ❌ | 2026-05-17 |
| Scanner PWA `/staff/check-in/:event` | ✅ | ✅ | ⚠️ no Android device test logged | ❌ | 2026-05-17 |
| QR code email delivery (Infobip) | ✅ | ⚠️ unverified | ❌ | ❌ | 2026-05-17 |
| Host dashboard `/host/event/:id` | ✅ | ✅ | ⚠️ no organizer self-serve test | ❌ | 2026-05-17 |
| Lead capture (`chat-lead-capture` + C03) | ✅ | ✅ local | ❌ **not merged to main** | ❌ | 2026-05-17 |
| Mastra concierge + 4 search tools | ✅ | ✅ | ✅ live on `my-mastra-app-beta` | ⚠️ no map-pin live proof | 2026-05-17 |
| Map pin pipeline (lat/lng → pins) | ✅ | ✅ | ❌ **6 commits ahead of `origin/main`** | ❌ | 2026-05-17 |
| `enrich-places.ts` (maps_url) | ✅ | ⚠️ not run | ❌ | ❌ | 2026-05-17 |
| Inline rental cards (C01) | ✅ | ✅ local | ❌ not merged | ❌ | 2026-05-17 |
| Reasoning trace (C02) | ✅ | ✅ local | ❌ not merged | ❌ | 2026-05-17 |
| Hybrid FTS + pgvector (VDB-01) | ✅ | ✅ | ✅ `ai-search` v47 | ⚠️ no real user query logged | 2026-05-10 |
| Stripe permanent webhook in Dashboard | — | — | ❌ **blocker for G1** | ❌ | — |
| Vercel buyer smoke on `https://www.mdeai.co` | — | — | ❌ **blocker for G1** | ❌ | — |
| `npm audit --omit=dev --audit-level=high` | — | — | ❌ fails on production advisories | — | 2026-05-17 |

**Rule:** never write "✅ built" anywhere else in this repo without updating a row here.

---

## 2. True MVP Definition

The smallest product that proves the business:

```
┌─────────────────────────────────────────────────────┐
│  TRUE MVP  ·  all of this is already built           │
│                                                      │
│  1. Event discovery  →  /events, /events/:id         │
│  2. Ticket purchase  →  Stripe Checkout  →  QR email │
│  3. Ticket wallet    →  /me/tickets/:id              │
│  4. Host dashboard   →  publish + revenue tiles      │
│  5. Rental search    →  chat → cards + map           │
│  6. Lead capture     →  chat → leads table           │
│                                                      │
│  POST-MVP: scanner PWA /staff/check-in/:event        │
│                                                      │
│  THAT IS IT.                                         │
└─────────────────────────────────────────────────────┘
```

**Before building anything new, pass the 3 MVP production proofs** (`tasks/mvp-proofs/`):

| Proof | What to test | Doc |
|------|-------------|-----|
| 001 — Stripe ticket purchase | Buy on production → `event_orders.status=paid` | `001-stripe-ticket-purchase-proof.md` |
| 002 — QR + wallet | Paid order → `/me/tickets/:id` shows QR | `002-qr-wallet-proof.md` |
| 004 — Rental lead | Chat contact-host → row in `leads` | `004-rental-lead-proof.md` |

**Deferred post-MVP:** G2 scanner, G3 staff revocation, G4 load test, G5 scanner screen in Lighthouse — see `003-scanner-checkin-proof.md`.

---

## 3. MVP Product Pillars

### Pillar 1 — Events + Tickets (built, needs QA)

**Include in MVP:**
- Event list (`/events`) + detail page (`/events/:id`)
- Stripe Checkout via `ticket-checkout` edge function
- `ticket-payment-webhook` → QR JWT → email with PDF + .ics
- Ticket wallet (`/me/tickets`, `/me/tickets/:id`) — fullscreen QR
- Scanner PWA (`/staff/check-in/:event`) — **post-MVP** (see `tasks/mvp-proofs/003-scanner-checkin-proof.md`)
- Host dashboard — 4 KPI tiles, attendee list, CSV export, real-time via Supabase Realtime
- Staff magic link generator + revocation

**Exclude from MVP:**
- Promo codes — useful but not blocking revenue
- Order refunds — handle manually via Stripe dashboard for first events
- Taxes / IVA 19% — add after first revenue
- Photo moderation for event cover images — manual review is fine
- AI-generated event descriptions — nice-to-have, not blocking
- Event media assets schema — post-MVP

---

### Pillar 2 — Rentals Discovery (built, minor gaps)

**Include in MVP:**
- Chat: "find me a 2BR in Laureles under $80/night" → rental cards
- Cards: title, price, bedrooms, wifi speed, rating, source link
- Google Map with color-coded pins
- "View listing" → external listing page (affiliate link)
- Lead capture when user says "contact the host" → `leads` table

**Exclude from MVP:**
- Hermes 7-factor ranking — use existing DB sort by price/rating
- pgvector semantic search on apartments — keyword + PostGIS is enough for 28 listings
- Scam detection pipeline — manually flag listings as needed
- Firecrawl / Apify scraping — 28 curated apartments is enough to prove the concept
- Landlord dashboard — just capture leads, no portal needed yet
- Rental booking / 12% commission — affiliate links only
- Trip planner, showings CRM — not needed before first rental lead validates

#### Pillar 2A — Rental Inventory Strategy (MVP)

> **One sentence:** 28 hand-curated apartments in Postgres, affiliate links out, weekly manual freshness pass. No scraping, no host uploads, no external APIs.

| Question | MVP answer |
|----------|-----------|
| **Where do listings come from?** | Manual curation — founder + assistant copy from public sources (Airbnb URL, building owner) into `apartments` table |
| **Who owns the data?** | Postgres `apartments` table is the **only** source of truth. No remote API at request time. |
| **How is freshness handled?** | Weekly manual review. Stale listings get `is_active = false`. No auto-expiry. |
| **Are there duplicates?** | Manual de-dupe on insert. No fuzzy matching needed at 28 rows. |
| **How does a host get listed?** | They email the founder. Founder adds the row. No self-serve. (Self-serve is Phase 5 landlord SaaS.) |
| **What about photos?** | Image URLs in `apartments.photos` — referenced from external CDN (Airbnb, owner Drive). No upload pipeline. |
| **Affiliate link target** | Direct URL to Airbnb / owner contact / WhatsApp. mdeai.co is **discovery**, not booking. |
| **Out-of-scope for MVP** | Scraping (Firecrawl/Apify) · iCal sync · price tracking · review aggregation · neighborhood pages |

**Why this is enough:** the question MVP answers is *"will users find apartments and contact hosts through this surface?"* — not *"can we host 10K listings?"*. Validate before scaling inventory ops.

#### Pillar 2B — Rental Lead Flow (MVP)

Exact path from chat to host:

```
User types in /chat
   ↓
Mastra search_rentals tool → Postgres apartments query
   ↓
Inline rental cards rendered (C01)
   ↓
User clicks "View listing" → opens affiliate URL in new tab
   ↓                       ↓
   ↓                       Path A: WhatsApp / Airbnb / email link on listing
   ↓
User types "contact the host" / "I want to see #2" / similar intent
   ↓
chat-lead-capture edge fn (C03) → INSERT into leads {user, listing, intent, contact}
   ↓
Founder sees lead in /admin/leads (manual outreach for first 20 leads)
   ↓
First validation pass: did any lead convert to a real conversation?
```

**MVP decisions (deliberately simple):**
- **No CRM** — `leads` table + admin view is enough until 100 leads/mo
- **No notifications to host** — founder triages manually
- **No in-app messaging** — affiliate link is the bridge
- **No WhatsApp bot reply** — Phase 4
- **No lead scoring / routing** — Phase 3
- **No automated follow-up email** — Phase 2

**Success measure:** 1 confirmed lead → real conversation between renter and host in first 30 days. That's it.

---

### Pillar 3 — Chat Concierge (working via Mastra)

**Include in MVP:**
- Natural language queries for rentals, events, restaurants, attractions
- Structured result cards with inline display
- Map pins for all result types
- Multi-turn refinement ("show me cheaper ones", "in El Poblado instead")
- Anonymous limit at 3 messages → email gate → signup

**Exclude from MVP:**
- Autonomous agents that take actions — "propose only" rule stays
- Complex memory / personalization (taste vectors, episodic memory) — Phase 3
- Multi-agent orchestration (Paperclip → OpenClaw → Hermes) — Phase 4
- WhatsApp continuity — Phase 4
- Real-time Grounding Lite search — billing complexity, 10 RPD limit is unworkable
- Trip planner integration — post-MVP

---

## 4. MVP Tech Stack

### Required now — keep as-is

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | Vite 5 + React 18 + TypeScript + shadcn/Tailwind | ✅ Working |
| Hosting | Vercel (auto-deploy from main) | ✅ Working |
| Database | Supabase Postgres + RLS | ✅ Working |
| Auth | Supabase Auth (email + Google OAuth) | ✅ Working |
| AI inference | Google Gemini via Mastra | ✅ Working |
| Payments | Stripe (ticket-checkout, ticket-payment-webhook) | ✅ Working |
| Maps | Google Maps + Map ID | ✅ Working |

**5 critical edge functions for MVP:**

| Function | Why |
|----------|-----|
| `ticket-checkout` | Initiates Stripe payment |
| `ticket-payment-webhook` | Mints QR JWT, sends email |
| `ticket-validate` | Scans QR at door |
| `event-staff-link-generator` | Creates scanner access |
| `ai-chat` or Mastra concierge | Discovery chat |

### Defer — do not build yet

| Technology | When to add |
|-----------|------------|
| `ai-trip-planner` edge function | Post-MVP |
| `ai-optimize-route` edge function | Post-MVP |
| `sponsor-roi-explain`, `ai-creative-gen`, `ai-audience-match` | Phase 3 |
| Postiz (social scheduling) | Phase 2/3 |
| Infobip WhatsApp | Phase 4 |
| Cloudflare Turnstile | Phase 2 (contests) |
| Firecrawl / Apify | Phase 3 |
| OpenClaw VPS | Phase 4 |
| Hermes ranker | Phase 3 |
| Paperclip governance | Phase 4 |
| pgvector on apartments | Phase 3 |
| Scam detection | Phase 3 |

---

## 5. Mastra MVP Strategy

### What Mastra does — keep this

1. User sends a message
2. Mastra routes to the correct tool (search_rentals / search_events / search_restaurants / search_attractions)
3. Tool queries Supabase, returns structured results
4. Results rendered as inline cards + map pins

**The concierge routing workflow is correct. Keep it.**

Keep:
- `concierge-routing-workflow.ts`
- `search-rentals.ts`, `search-events.ts`, `search-restaurants.ts`, `search-attractions.ts`
- `lib/models.ts` — model constants (gemini-2.5-flash / gemini-2.5-pro)
- SSE streaming to the frontend

### What's overbuilt for MVP

| Component | Decision |
|-----------|---------|
| GROUNDING-001 (Grounding Lite real-time search) | Defer — billing complexity, 10 RPD limit |
| `searchGroundedPlacesTool` | Defer — expensive, complex, not proven users need it |
| Nearby Search tool (MASTRA-075) | Phase 2 |
| Mastra memory + RAG (MASTRA-010) | Phase 3 |
| Editor prompt architecture (MASTRA-031–035) | Archive — no content editors using the product |
| More MASTRA tasks beyond 048 | Stop — Phase 1 QA first |

**Mastra MVP rule:** The concierge does **exactly one thing**:

```
user message → router → tool call → structured response
```

That's it. Until first real users hit it on production, do **not** add:
- Eval harnesses — wait for real queries to evaluate against
- Memory / RAG — wait for repeat users
- Multi-agent routing — single agent handles 4 tools fine
- Observability beyond `ai_runs` table — wait for real cost signal
- Workflow orchestration — Mastra workflows are tempting but adds debugging cost

**Stop adding Mastra tasks until Phase 1 gate is passed.**

---

## 6. Google Maps MVP Strategy

### Keep for MVP — these are high leverage

| Feature | Why in MVP |
|---------|-----------|
| Map display with correct Map ID | ✅ Fixed (MASTRA-068) |
| Rental / event / restaurant / attraction pins | ✅ Fixed (lat/lng pipeline pending push) |
| Color-coded pins by category | ✅ Working |
| **`place_id` on every venue** | Stable identity — survives renames, dedupes hosts |
| **`maps_url` on every card** | "Open in Google Maps" link is a 1-click conversion to host's preferred channel |
| **Directions link** (`https://www.google.com/maps/dir/?api=1&destination=...`) | URL-only, free, no API quota |
| **Nearby context** (5 nearest restaurants when looking at a rental) | High user value — one Postgres `ST_DWithin` query against existing restaurants table, no Places API call |
| **Venue normalization** (one row per real-world place) | Prevents 3 "Pueblito Paisa" duplicates |
| **Venue autocomplete in event wizard** | Organizer picks from existing venues — prevents typo'd geo |

### Defer — orchestration, not data

| Feature | Why deferred |
|---------|-------------|
| **Grounding Lite live geo agent** | 10 RPD free limit; deferred orchestration, not deferred data |
| **Live Places API on every request** | Quota + cost — use one-time `enrich-places.ts` instead |
| **Complex geo agent workflows** (GROUNDING-001+) | Phase 2 once enrichment volume justifies |
| **Real-time nearby with live API** | Use Postgres `ST_DWithin` on already-enriched coords; live API only when DB miss |
| **Offline map tiles in scanner** | Only if scanner runs outdoors with no wifi |
| **Custom map styling beyond Map ID** | Already covered by Map ID |

**Maps MVP rule:** **Enrich once, query forever.** Run `enrich-places.ts` to populate `place_id` + `maps_url` + lat/lng. After that, every map feature (pins, directions links, nearby) is a free Postgres query against the cache. No live API call per user request.

---

## 7. AI Strategy for MVP

### What AI should do

| Use case | Status |
|---------|--------|
| Parse "2BR Laureles under $80" → structured params → SQL | ✅ Working |
| Return rental / event / restaurant / attraction cards | ✅ Working |
| Anonymous limit → email gate | ✅ Working |
| Event description draft — propose only, user must accept | ✅ Already correct |

### What AI must NOT do in MVP

| Action | Why |
|--------|-----|
| Auto-send WhatsApp messages | Phase 4 |
| Auto-book or auto-confirm showings | Propose only — user confirms |
| Auto-publish events | User clicks Publish |
| Auto-moderate listings (suppress without human review) | Propose only |
| Auto-score or auto-select sponsors | Phase 3 |

**AI rule:** AI searches, summarizes, and drafts. Humans confirm, publish, and transact. The current "propose, don't apply" architecture is correct. Do not break it.

---

## 8. Real-World User Flows

### Flow 1 — Tourist buys an event ticket
1. Opens `mdeai.co/events` → sees list of events
2. Clicks an event → price, date, venue, ticket tiers
3. Clicks "Buy Ticket" → Stripe Checkout opens (< 2 seconds)
4. Pays → gets email within 2 minutes (PDF + .ics)
5. Opens `/me/tickets` on phone → fullscreen QR
6. Roberto scans at the door → green screen + name → 1 second
**This flow is built. G1 and G2 test it. Ship.**

### Flow 2 — Organizer publishes an event
1. Opens `mdeai.co/host/event/new`
2. Completes 4-step wizard (details → tiers → venue → review)
3. Gemini drafts a description — organizer accepts or edits (propose only)
4. Clicks Publish → event live within 30 seconds
5. Shares the URL → buyers find the event
6. Monitors `/host/event/:id` — live ticket count + revenue
7. Sends Roberto a staff magic link before the event
**This flow is built. Test it with a real organizer.**

### Flow 3 — Nomad finds an apartment
1. Opens `mdeai.co/chat`
2. Types "2BR apartment in El Poblado, fast wifi, under $1200/month"
3. Gets 3–5 rental cards with map pins
4. Types "show me cheaper ones" → refined results
5. Types "I want to contact the host" → lead captured in `leads` table
**This flow is built. Push the lat/lng fix (`git push`).**

### Flow 4 — Roberto scans QR at the door
1. Gets staff magic link from organizer
2. Opens on Android → installs as PWA
3. Scans QR → green screen + name in 1 second
4. Scans same QR again → red screen + ALREADY_USED
5. Wi-Fi drops → offline queue → reconnects → all synced
**This is built. G2 and G3 test it.**

---

## 9. MVP Roadmap

### NOW — Pass Phase 1 gate (9 hours of work)

| Task | Time |
|------|------|
| `git push origin main` — deploy lat/lng + model ID fix | 5 min |
| MVP Proof 001 — Stripe ticket on production | 3 hrs |
| MVP Proof 002 — QR wallet on production | 2 hrs |
| MVP Proof 004 — Rental lead on production | 2 hrs |
| Post-MVP: scanner + revocation + load + Lighthouse scanner screen | backlog |
| Merge C01 (inline rental cards) | 30 min |
| Merge C02 (reasoning trace) | 30 min |
| Merge C03 (lead capture) | 30 min |
| Run `enrich-places.ts` (maps_url) | 30 min |

### Phase 1.5 — After first real event (2 weeks)

| Task | Why now |
|------|---------|
| Stripe permanent webhook in Dashboard | Required for production (not just Stripe CLI) |
| Fix CORS wildcard on 7 legacy edge functions | Security |
| Admin RBAC on admin routes | Security |
| Promo codes schema | First organizers will ask for this |
| Email delivery monitoring | Verify tickets aren't going to spam |

### Phase 2 — Events hardening + first 5 real events (4 weeks after Phase 1 closes)

Only after the first real ticket sale on production.

- Stripe permanent webhook in Dashboard (if not done in Phase 1.5)
- Promo codes schema + checkout apply flow
- Manual refund button in host dashboard
- Lighthouse a11y on host wizard
- Postiz auto-publish to Instagram (single integration, gated)
- Places enrichment (`enrich-places.ts` cron) — fills `place_id`, `maps_url`

### Phase 3 — Contests + Sponsor Marketplace (after 5 real events)

> **Reclassified from Phase 2.** Contests are closer to **fintech / elections / gaming** than "event voting." They demand:
>
> - Anti-fraud (bot vote rejection, IP-throttling, behavioral signals)
> - Legal compliance (Colombian Ley 1581/2012 + Ley 643/2001 sign-off)
> - Phone OTP identity + dispute flow
> - Moderation pipeline for contestant photos
> - Realtime leaderboard load (1K+ concurrent voters)
> - Audit log for vote disputes
>
> That's a 3-month vertical, not a 2-week feature. Do not start until events platform is operationally stable AND a real contest partner has signed an LOI.

Phase 3 contains:
- Contests vertical (Miss Elegance) — see [`events/contests/`](./events/contests/) + [`advanced.md`](./advanced.md) §10 risk register
- Sponsor marketplace — only after a real contest signs the first sponsor

### Post-MVP — Do not build yet

- Hermes 7-factor ranking
- Paperclip governance + OpenClaw VPS
- WhatsApp broadcast
- Firecrawl / Apify scraping
- Landlord SaaS subscription
- Stripe Connect rental bookings (12%)
- Scam detection pipeline

---

## 10. Over-Engineering Audit

### Freeze these immediately

| System | Tasks | Why it's post-MVP |
|--------|-------|-----------------|
| **Paperclip CEO agent** | 05A–05N (14 tasks) | Governs autonomous AI agents that don't exist yet |
| **OpenClaw VPS** | 08B, 08E–08K (7 tasks) | Execution environment for jobs that don't exist yet |
| **Hermes ranking** | E6 (5 tasks) | Personalization needs 1,000+ user interactions first |
| **Trio integration** | 14 task files | Three separate systems on a VPS, for 0 users |
| **Postiz scheduling** | 16B–16F (5 tasks) | No audience to post to yet |
| **WhatsApp broadcast** | 08B, 08E–08H | Phase 4 |
| **Scam detection** | Phase 3 | 28 curated apartments, manual is fine |
| **Lead discovery engine** | 15F | Needs sponsors to discover first |
| **Sponsor AI matching** | Phase 3 | No sponsors to match |
| **GROUNDING-001+** | Grounding Lite | Billing complexity, 10 RPD limit |
| **Editor prompt architecture** | MASTRA-031–035 | No content editors using the product |

### Keep — these are not over-engineering

| Component | Why it stays |
|-----------|-------------|
| RLS on all tables | Security is not over-engineering |
| `ai_runs` logging | Already built, cheap, visibility into costs |
| Stripe least-privilege keys | Security best practice |
| Mastra concierge + 4 search tools | Already working, delivers real user value |
| `ticket-validate` JWT verification | Non-negotiable for QR scanning |
| Offline IndexedDB queue in scanner | Roberto has bad Wi-Fi — this is not premature |
| Hybrid FTS + pgvector on events/restaurants | VDB-01 shipped and working |

---

## 11. Success Criteria

| Criterion | Target | How measured |
|-----------|--------|-------------|
| First Stripe payment | 1 confirmed order | `event_orders` row in production |
| Zero oversell | 0 orders > capacity | Load test: 50 buyers, 30 seats |
| QR validation | 100% valid QRs show green | `ticket-validate` on Android |
| Organizer self-service | Publish in ≤ 25 min | Time a real organizer doing it |
| Scanner PWA offline | 0 data loss on reconnect | IndexedDB queue test |
| First rental lead | 1 confirmed lead | `leads` table row from chat |
| Uptime during first event | 0 downtime at peak | Monitor during event |
| Lighthouse a11y | ≥ 90 | 4 key screens |

Success is **real users doing real things**, not architecture completion.

---

## 11A. Operational Simplification Rules (MVP)

> **Why this section exists:** One developer + four product pillars + payments + scanning + AI + maps + hosts + support is already a lot. Every MVP "yes" implies an ops "yes" too. These rules say what the platform **deliberately does manually** to keep ops tractable.

| Concern | MVP rule | Why |
|---------|----------|-----|
| **Refunds** | Manual — founder issues via Stripe Dashboard | No refund logic in product until 10 events shipped |
| **Moderation** | Manual review of new event listings + apartments | 28 apartments + <10 events/wk fits one human |
| **Disputes** | Email founder → manual resolution | No dispute UI until volume justifies |
| **Host messaging** | Affiliate link only — no in-app messaging | Avoids spam / scam / moderation surface |
| **Social graph** | None | No "friends" / "follow" — out of scope |
| **AI touching money** | Never — AI proposes, user confirms checkout | "Propose, don't apply" is a permanent rule |
| **Auto-publish** | Never — organizer clicks Publish | One human approval per public listing |
| **Auto-reply (email/WhatsApp)** | Never in MVP | Reply-handling is a deferred WhatsApp scope |
| **Notifications** | Email-only via Supabase Auth — no SMS, no push | Lower ops surface; push is Phase 4 |
| **Lead routing** | None — single inbox in `/admin/leads` | One human triages first 100 leads |
| **Backups** | Supabase automated daily — no manual snapshots | Use the platform's default |
| **Monitoring** | Vercel logs + Supabase logs + 1 PostHog dashboard | No Datadog / Sentry / etc. until paid users |
| **Customer support** | Single founder email | No ticketing system, no on-call rotation |

**The rule:** if an operational decision can be deferred to "we'll do it manually for the first N," **defer it**. Build the product surface for users, not for the ops team that doesn't exist yet.

---

## 11B. MVP Analytics

> **One PostHog project. Six events. Nothing else.**

| Event | Why we track |
|-------|-------------|
| `ticket_purchase_completed` | Revenue truth |
| `checkout_started` minus `ticket_purchase_completed` | Checkout abandonment funnel |
| `ticket_scanned` (success vs `ALREADY_USED`) | Event-day flow worked |
| `lead_captured` | Rental side validation |
| `map_pin_clicked` | Geo surface is being used |
| `chat_message_sent` | Concierge demand signal |

**Don't add for MVP:**
- Cohort dashboards / retention charts
- Funnel builders beyond the one funnel above
- ML / behavioral analytics
- Self-serve BI tooling
- Heatmaps / session replay (privacy + cost burden)
- Per-user feature flags (use a single `is_internal` boolean for now)

**Storage:** PostHog Cloud free tier handles ≤1M events/mo — plenty for MVP. Self-host only if privacy law forces it.

---

## 11C. MVP Security Non-Negotiables

> **The product handles money + QR tickets + public scanners. Any of these missing = a real incident.**

| Layer | Non-negotiable | Status |
|-------|---------------|:------:|
| **RLS on every table** | No exceptions | ✅ Already enforced via stop hook |
| **Signed QR JWT** | HS256 over `attendee_id + event_id + iat + jti`; 24h expiry; `jti` recorded server-side on first scan | ✅ Built |
| **Stripe webhook signature verification** | `STRIPE_WEBHOOK_SECRET` required on every call to `ticket-payment-webhook` | ✅ Built — needs permanent Dashboard webhook |
| **Webhook replay protection** | Reject events with `timestamp` > 5 min old; idempotency via Stripe `event.id` recorded in `webhook_events` | ⚠️ Verify in G1 |
| **Magic link scanner expiry** | Staff links expire 24h after event end; revocable instantly | ✅ Built |
| **Edge function rate limits** | AI 10 req/min/user · search 30 req/min/user · checkout 5 req/min/user | ⚠️ Audit before launch |
| **Admin RBAC** | `/admin/*` checks `profiles.role = 'admin'` server-side, not client-side | ⚠️ `useAdminAuth` hook audit pending |
| **Audit log** | `ai_runs` for AI, `webhook_events` for Stripe, `event_attendees.checked_in_at` + `scanner_user_id` for scans | ✅ Built |
| **Secrets** | Infisical → Supabase — no `.env` in repo, no `VITE_` for anything sensitive | ✅ Enforced |
| **CORS allowlist** | Production: `https://www.mdeai.co` + `https://my-mastra-app-beta.vercel.app` only | ⚠️ 7 legacy edge fns still wildcard |
| **npm audit (high)** | Zero high-severity production advisories before launch | ❌ Currently failing |

**Pre-G1 checklist (security):** Stripe Dashboard webhook live · CORS allowlist locked · admin RBAC audited · npm audit clean. Anything red = G1 cannot ship.

---

## 11D. Single Source of Truth (SSoT) Rules

> **Why this section exists:** The architecture has 5+ places that could theoretically hold "the answer." When two disagree, we lose money or trust. These rules say which one wins.

| Concern | Source of truth | Never source of truth |
|---------|----------------|-----------------------|
| **Ticket validity** | `event_attendees.checked_in_at` (Postgres) + signed QR JWT | Email PDF, browser cache, scanner local DB |
| **Ticket inventory / capacity** | `event_ticket_tiers.seats_total` − `event_orders.seats_sold` (Postgres) | Stripe metadata, client state |
| **Rental inventory** | `apartments` (Postgres) | Mastra response, AI cache, external listing |
| **Event status** (draft/published/cancelled) | `events.status` (Postgres) | Stripe product, frontend state |
| **Prices** | `event_ticket_tiers.price_cents` (Postgres) | Stripe price object, AI quote, listing copy |
| **Map coordinates** | `apartments.location` / `events.venue_id → venues.location` (Postgres, PostGIS) | Mastra tool output, Google Places live |
| **Scanner state** | Postgres + signed QR (verified server-side every scan) | Scanner localStorage / IndexedDB (queue only, never truth) |
| **User identity** | `auth.users` + `profiles` (Supabase) | Cookies, AI memory, magic link token |
| **Lead intent** | `leads` (Postgres) | Chat transcript, AI summary |
| **AI output** | **Never source of truth.** | Anywhere that takes money or grants access |

**Rule of thumb:** if AI says X and Postgres says Y, **Postgres wins** and AI gets corrected. Never the other way around.

---

## 12. Final Recommendations

### The one sentence version

> **Phase 1 is done. You just haven't run the QA yet. Run the QA. Ship it. Add everything else after the first real event.**

### Simplified stack for MVP

```
User browser
     ↓
Vercel (React/Vite)  — mdeai.co
     ↓
Mastra (my-mastra-app-beta.vercel.app)  ← 4 search tools + chat
     ↓
Supabase
  · Postgres (source of truth)
  · Auth (JWT)
  · 5 critical edge functions
  · Realtime (host dashboard, scanner)
     ↓
Stripe (tickets)   Google Gemini (AI)   Google Maps (display)
```

No VPS. No OpenClaw. No Paperclip. No Hermes. No WhatsApp. That's the MVP.

### Top 5 risks

| Risk | What to do |
|------|-----------|
| QA gates keep getting deferred | Block time. 9 hours of work. Do them this week. |
| New features added before Phase 1 closes | Use this doc as the filter. Not in mvp.md → defer. |
| Paperclip/Hermes/Trio work creeping in | These tasks are frozen until Phase 3. |
| Mastra complexity grows beyond the 4 tools | No new Mastra tasks until Phase 1 gate passes. |
| Stripe permanent webhook not set up | 30-minute task. Do it before G1 test or G1 will fail. |

### Priority order for next 30 days

```
Days 1–3:    git push → G1 Camila E2E → G2 Roberto scan
Days 4–5:    G3 revocation → G4 load test → G5 Lighthouse
Days 6–7:    Merge C01/C02/C03 → run enrich-places.ts → Phase 1 CLOSED
Days 8–14:   Phase 1.5 security fixes + first real event
Days 15–30:  Iterate on real user feedback → plan Phase 2
```

---

## Appendix — Existing components (status spectrum, do not rebuild)

> Status uses §1A spectrum: **Prototype** (code exists) · **Integrated** (wired end-to-end) · **Production-ready** (smoke passed on prod URL) · **Live-verified** (real user completed flow).

| Component | Location | Status |
|-----------|----------|--------|
| Event list + detail pages | `src/pages/Events.tsx`, `EventDetail.tsx` | Production-ready |
| Ticket checkout | `supabase/functions/ticket-checkout/` | Integrated (localhost + Stripe CLI) |
| Payment webhook + QR mint | `supabase/functions/ticket-payment-webhook/` | Integrated — **needs permanent Stripe Dashboard webhook to reach Production-ready** |
| Ticket wallet | `src/pages/MyTickets.tsx`, `TicketDetail.tsx` | Integrated |
| Scanner PWA | `/staff/check-in/:event` | Prototype — no Android device test logged |
| Host dashboard | `/host/event/:id` | Integrated — no organizer self-serve test logged |
| Staff link generation + revocation | `supabase/functions/event-staff-link-generator/` | Integrated |
| Chat canvas + Mastra concierge | `src/components/chat/ChatCanvas.tsx` | Production-ready (live on Mastra beta) |
| 4 Mastra search tools | `my-mastra-app/src/mastra/tools/` | Production-ready |
| Map with color-coded pins | ChatMap component | Integrated — **push pending to reach Production-ready** |
| Inline rental cards in chat | C01 | Integrated — **not merged to main** |
| Reasoning trace in chat | C02 | Integrated — **not merged to main** |
| Lead capture from chat | C03 + `chat-lead-capture` | Integrated — **not merged to main** |
| Hybrid FTS + pgvector search | `ai-search` v47, VDB-01 | Production-ready |
| Google OAuth + email auth | Supabase Auth | Production-ready |
| Anonymous 3-message limit | `ai-chat` edge function | Production-ready |
| Email gate modal | `EmailGateModal` component | Production-ready |
| 222 / 222 Vitest tests | `npm run test` | ✅ Passing |
| TypeScript clean | `npm run typecheck` | ✅ Clean |
| Production build | `npm run build` | ✅ Clean |

**Note:** No row above is yet **Live-verified**. The whole G1–G5 gate exists to move at least the green-shaded rows (Stripe / scanner / lead capture / map pins) into Live-verified.
