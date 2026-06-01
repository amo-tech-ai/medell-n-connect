---
doc_id: MDEAI-COMPETITOR-BLUEPRINT
title: mdeai — Competitive Synthesis & Product/Design Blueprint
version: 1.0
date: 2026-05-31
status: Draft (strategy input — not execution authority)
authority_note: This is a strategy/synthesis doc. Execution authority stays with docs/roadmap.md + tasks/INDEX.md.
companions:
  - plan/competitors/01-mindtrip.md … 05-booking.md (Mindtrip teardown)
  - plan/competitors/10-tripAI.md (multi-agent travel AI)
  - plan/competitors/11-openclaw.md (local-intelligence / enrichment moat)
covers_here: GuideGeek, Layla family, Airbnb, Google Maps, Chatwoot, WhatsApp-native, Medellín local platforms
---

# mdeai — Competitive Synthesis & Product/Design Blueprint

> **What this is:** a single synthesis across the WhatsApp-first / concierge / booking / rental / nightlife landscape, turned into concrete recommendations for mdeai — sitemap, homepage wireframe, page hierarchy, components, design system, and an implementation-priority roadmap.
>
> **What this is NOT:** new execution authority. Sequencing still obeys [`docs/roadmap.md`](../../docs/roadmap.md) and [`tasks/INDEX.md`](../../tasks/INDEX.md). Where this doc's ambition exceeds the current plan, it's tagged **Post-MVP** or **Advanced** so nobody pulls scope forward.

---

## 0. Reality check (read before acting)

Three project constraints override anything in this doc. They are deliberate, and the recommendations below respect them:

| Constraint | Source | Impact on this doc |
|---|---|---|
| **WhatsApp prod is deferred** to Post-MVP/Advanced ("no WhatsApp prod blast") | [`roadmap.md`](../../docs/roadmap.md) §Post-MVP, §What to cut | WhatsApp-first is treated as a **vision track + Phase-2 wedge**, not MVP. The MVP front door is the `/chat` 3-panel web canvas. |
| **English-only Phase 1** | `CLAUDE.md` | All copy below is English. Spanish/`Lingui` is Phase 2. |
| **MVP = O1+O2+O3+O4** (ticket + host publish + rental map + unified `/chat`); platform rule = Supabase data · Mastra orchestration · CK UI · Maps spatial · Gemini explains (tool-backed only) | [`roadmap.md`](../../docs/roadmap.md) | Every "sticky / revenue / AI" idea is sorted into MVP / Post-MVP / Advanced against this. |

**The honest tension:** the brief asks for a *WhatsApp-first* product; the live plan is *web-`/chat`-first* with WhatsApp as a later channel. Resolution → **build the concierge brain once (Mastra router + tools + grounded cards), expose it on web now, and re-skin the same brain onto WhatsApp in Phase 2.** WhatsApp becomes a *transport*, not a rewrite. This is the only WhatsApp posture that doesn't blow the MVP.

---

## 1. Competitor teardowns (the ones not yet covered in 01–11)

Scores are qualitative (UX usefulness *to mdeai*, /100), not endorsements.

### 1.1 GuideGeek — the WhatsApp-native benchmark

| Aspect | What they do | Score | mdeai takeaway |
|---|---|---|---|
| Front door | No app. You message a number on WhatsApp/IG/Messenger; conversation *is* the product | 92 | The Phase-2 WhatsApp wedge: zero install, instant value |
| Onboarding | First reply asks destination + travel dates conversationally; no forms | 90 | Mirror in `/chat`: greet → 1 question → results, never a form wall |
| Search UX | Plain-language Q&A; replies are short, chunked, emoji-light, with 1–3 concrete picks | 88 | WhatsApp answers must be **scannable on a phone** — 3 picks max per bubble |
| Results | Text + a maps link + occasional image; no rich card grid (channel limit) | 70 | On WhatsApp, degrade gracefully: name + 1-line why + maps link + "see more on web" deep link |
| Trust | Backed by **Matador Network** (travel media brand) + press; "real-time, sourced live, 1,000+ travel integrations"; **50+ languages** (message in your own) | 80 | Our equivalent = **grounding attribution** ("from Google Maps") — already on the MVP path; LatAm needs the same Spanish/English fluidity |
| Monetization | **In-conversation booking** (transact inside the thread, no app handoff) + affiliate commissions + white-label "GuideGeek for Brands/DMOs"; free to consumer, rides Meta distribution for free | 85 | Two revenue motions to copy: **in-thread/affiliate booking** + **white-label city concierge** for tourism boards/hotels |

**The single most stealable thing:** the *handoff-to-channel* model. mdeai's brain shouldn't care whether the user is on web or WhatsApp — same router, same tools, different renderer.

### 1.2 Layla / Wonderplan / iPlan / Stardrift / SmartTrippy — the AI-itinerary cluster

These rhyme; analyzing as a family with notable deltas.

| Product | Signature pattern | Score | Watch-out |
|---|---|---|---|
| **Layla.ai** | Chat → full multi-day itinerary; flight+hotel search inline; inspiration feed; talking persona. **Clearest consumer paywall in the set: ~$49/yr premium** | 84 | Heavy upfront generation can feel slow (masked with streaming + persona). The $49/yr proves a direct-subscription motion *can* work — but our wedge is transactions (tickets/leads), not a planning subscription |
| **Wonderplan** | Form-ish intake (destination, days, budget, pace) → generated day-by-day plan with map | 78 | Intake is form-heavy — *the anti-pattern* vs GuideGeek's conversational intake |
| **iPlan.ai** | Fast itinerary from minimal input; tight mobile UX; paywall after first plan | 76 | Aggressive paywall kills trust before value is felt |
| **Stardrift** | Aesthetic, magazine-style discovery; vibe-led browsing | 74 | Beautiful but thin on booking/transaction depth |
| **SmartTrippy** | Budget + optimization framing; route/day optimization | 72 | Optimizer framing is niche; not our wedge |

**Cluster lessons for mdeai:**
1. **Streaming "visible thinking"** is table stakes — already validated for us (see UX-005 loading indicator + `04-chat.md`).
2. **Itinerary = the retention object.** A one-shot answer is forgettable; a saved, editable plan brings users back. For mdeai this maps to **Saved / Trip** (Post-MVP `trips`).
3. **Don't out-form GuideGeek.** Wonderplan/iPlan's intake forms are the thing to *avoid*. Conversational intake wins.
4. **Persona/voice** (Layla's character) raises engagement — mdeai can have a light "Medellín local" voice without a mascot.

### 1.3 Airbnb — the rental/booking + trust standard

| Pattern | Detail | mdeai takeaway |
|---|---|---|
| Split map+list | Desktop = list left, sticky map right; mobile = list with "Map" toggle FAB | Directly informs our 3-panel → mobile collapse |
| Card anatomy | Photo carousel · superhost badge · ★rating(count) · price *with total* · save heart | Our `RentalCard` spec; show **total**, not nightly-only (Camila comparison) |
| Map pins = price | Pins show **price**, not generic dots; selected pin lifts/recolors | Adopt **price pins** for rentals; category glyphs for food/nightlife |
| Trust stack | Reviews, verified ID, Superhost, cancellation policy, "rare find" scarcity | Our trust stack = grounding + verified listing + scam-filter (Post-MVP `considered_but_rejected`) |
| Booking flow | Date/guests → price breakdown → reserve → pay; minimal surprises | Our MVP money path is **events ticketing**; rentals = **lead capture**, native Stripe is Advanced |
| Filters | Pills + "more filters" modal; instant map re-query | Pills (vibe, price, beds, neighborhood) over a filter wall |

### 1.4 Google Maps — spatial truth + grounding

| Pattern | mdeai takeaway |
|---|---|
| Bottom sheet on mobile (peek → half → full) | **The** mobile pattern for our map+cards (already flagged as ECL bottom sheet, Post-MVP) |
| Place sheet: photos, hours, reviews, "Popular times", directions, save | Our Place card on-open; **photos/hours fetched on open only** (cost) |
| List ↔ pin bidirectional highlight | Hover/tap card → pin bounces; tap pin → card scrolls into view. Core interaction. |
| Source of truth | We **never invent** place_id/coords/hours — Maps/Places grounds everything (hard rule) |
| Lists/saved | "Want to go / Favorites / Starred" = our **Saved Places** retention object |

### 1.5 Chatwoot — the ops/inbox + WhatsApp Business model

| Pattern | mdeai takeaway |
|---|---|
| Omnichannel agent inbox (WhatsApp, web widget, IG in one queue) | The **Patricia admin** shape for Phase 2: one inbox for AI + human handoff |
| AI-assist + human takeover | **HITL on outreach** — AI drafts, human sends. Matches our approval-gate philosophy |
| Canned responses, labels, assignment, SLAs | Lead CRM primitives for `/admin` (leads, status, assignment) |
| Contact + conversation history | Per-contact memory → our Supabase `leads` + thread memory |
| Open-source, self-hostable | Reference architecture for a future ops console; don't rebuild from scratch |

**Use Chatwoot as the mental model for the eventual ops/admin + WhatsApp human-handoff layer — not a Phase-1 build.**

### 1.6 WhatsApp-native concierge experiences (pattern, not one product)

| Pattern | Detail | mdeai takeaway |
|---|---|---|
| Conversational, no forms | Everything is a message; structure via **quick-reply buttons + list messages** | Use WA interactive messages for chips ("Rentals / Events / Food / Nightlife") |
| Templated + session messages | 24h session window; templates to re-open | Notifications (price drop, event reminder) = **template messages** |
| Rich but constrained | Images, location pins, buttons, lists — no arbitrary HTML | Cards degrade to **list messages**; "open full view" deep-links to web |
| Catalog / product messages | Commerce via WA catalog | Events tickets could surface as WA products (Advanced) |
| Voice notes | Huge in LatAm; users send voice | **Voice intake** (Gemini transcription) is a real Medellín differentiator (Post-MVP) |

### 1.7 Medellín rental + nightlife platforms (local landscape)

| Segment | Today's reality | mdeai wedge |
|---|---|---|
| Rentals | WhatsApp groups, Facebook Marketplace, Airbnb, fragmented local sites; **scam-heavy**, no trust layer | **Verified, grounded, map-native listings + lead capture** beats WhatsApp chaos |
| Nightlife | Instagram-driven (clubs/promoters post stories), guest-list via DMs, no aggregation | **Aggregated nightlife discovery** (Provenza/Poblado) + event tickets + "tonight" intent |
| Restaurants/cafés | Google Maps + Instagram; no laptop/vibe/"best dish" intelligence | **Vibe + best-for + laptop-friendly** semantic search (the OpenClaw moat, doc 11) |
| Events | Eventbrite-ish + IG; weak local curation, payment friction | **AI host-publish (Roberto) + safe ticketing (Andrés)** — our O1/O2 |

**Net:** competitors are global and broad; **none own Medellín's neighborhood + creator + Spanish/English nuance.** That's the moat (consistent with doc 11).

---

## 2. Cross-cutting patterns (what recurs everywhere)

| # | Pattern | Seen in | mdeai verdict |
|---|---|---|---|
| 1 | Conversation replaces forms | GuideGeek, Layla | **Adopt** — `/chat` intake, never a form wall |
| 2 | Visible streaming "thinking" | Layla, Mindtrip, us | **Have it** (UX-005) — keep it |
| 3 | Map ↔ card bidirectional sync | Maps, Airbnb, Mindtrip | **Core** — MAP-007 / UX-010 |
| 4 | Price/glyph pins, not dots | Airbnb, Maps | **Adopt** for rentals/food/nightlife |
| 5 | The retained object (trip/collection/saved) | Mindtrip, Maps, Layla | **Post-MVP `trips`/Saved** — biggest retention lever |
| 6 | Grounding / "sourced live" trust framing | GuideGeek, Yelp AI | **On MVP path** (MAP-003 attribution) |
| 7 | Channel-agnostic brain, multi renderer | GuideGeek, Chatwoot | **Architect for it now**, ship WA later |
| 8 | HITL on money/outreach | Chatwoot, us | **Have the philosophy** — approval gate |
| 9 | Mobile bottom sheet for map+list | Maps, Airbnb | **Post-MVP** ECL sheet |
| 10 | Affiliate/white-label monetization | GuideGeek | **Revenue track** — city concierge SaaS later |
| 11 | Multiple cold-start ramps; deferred account creation | Mindtrip, GuideGeek, Layla | **Adopt** — chips/browse now; Google-Maps-pin import + quiz Post-MVP; never ask for signup first |

---

## 3. The 20 recommendations

### 1) Best homepage sections (in order)
1. **Hero**: one-line promise + live chat input (the search bar *is* the concierge).
2. **Try-it chips**: "Find a rental in Laureles", "What's on this weekend?", "Best cafés to work from", "Nightlife in Provenza tonight" — each seeds `/chat`.
3. **Live map teaser**: small map with a few real pins ("we know the city").
4. **Verticals strip**: Rentals · Events · Restaurants · Nightlife (4 cards → vertical entry).
5. **Trust band**: "Grounded in Google Maps · Verified listings · No scams" + counts.
6. **For hosts** (Roberto): "Publish your event in 30 seconds" → `/host/event/new`.
7. **How it works** (3 steps): Ask → See on the map → Save/Book.
8. **Social proof / Medellín-local voice** (creator picks, neighborhood guides — Post-MVP).
9. **Footer**: About, verticals, host, legal, WhatsApp link (Phase 2).

### 2) Hero section ideas
- **Primary (recommended):** *"Ask anything about Medellín. Get answers on the map."* with a focused chat input + 3 rotating example prompts. CTA = type or tap a chip → routes into `/chat`.
- Alt A: split hero — left promise/chips, right live mini-map with pins.
- Alt B (Phase 2): "Chat with us on WhatsApp" QR + number alongside web input.
- Keep it **one screen, one input, zero forms.** No carousel of marketing fluff above the fold.

### 3) AI concierge UX
- **3-panel canvas** (the product shape): left = workspace/saved/threads · center = conversation + generative cards · right = persistent map. (Matches Mindtrip teardown + MAP-007.)
- **Router-first**: one Mastra router classifies intent → rental / event / food / nightlife / general; dispatches to a workflow. (Not 20 agents.)
- **Visible thinking** between handoff and results (have it).
- **Every recommendation is a card**, every card has a **pin**, every grounded fact shows **attribution**.
- **Multi-intent**: "cheap rental near good coffee" → rentals + cafés on one map without overwriting (UX-010 unified card architecture + MAP merge).
- **Memory**: remembers preferred neighborhoods/budget within a thread (working memory now; durable Post-MVP).
- **Multiple cold-start ramps** (Mindtrip pattern): never a blank prompt box. Offer (a) chips, (b) browse a few real picks, and (c) Post-MVP — **import your Google Maps saved pins** to seed taste instantly. Account creation is deferred, never the first ask (GuideGeek/Layla lesson).

### 4) WhatsApp-first workflows (Phase 2 — architected now)
- Same router/tools; **renderer swap**: web cards → WA list/button messages.
- Flows: (a) discovery Q&A → 3 picks + maps links + "open full view"; (b) event reminder + ticket link (template message); (c) rental alert ("3 new in Laureles under $1.5M"); (d) voice-note intake → Gemini transcribe → same pipeline.
- **Human handoff** (Chatwoot-style) for hot leads → Patricia inbox.
- HITL stays: AI drafts outreach, human approves before send.

### 5) Restaurant / rental / nightlife flows
- **Restaurant**: "best cafés to work from in Laureles" → vibe/laptop/best-dish ranked cards + pins → open = photos/hours/reviews (on-open fetch) → Save.
- **Rental**: query → ≤5 ranked cards (price *total*, beds, neighborhood, "10 min from metro") + price pins → open = details + "Request a viewing" → **lead capture** (native booking = Advanced).
- **Nightlife**: "Provenza tonight" → venues/events with tonight-relevance + vibe + cover + map → ticket (if event) or save → reminder.

### 6) About page structure
- Mission (Medellín's intelligent local layer) → the problem (scam chaos, fragmented info) → how it works (grounded AI + map) → trust/safety stance → team/local credibility → for hosts/partners → contact + WhatsApp. Keep it persona-led, not corporate.

### 7) Additional high-value pages
`/rentals`, `/events`, `/restaurants`, `/nightlife` (vertical landing + SEO), `/neighborhoods/[name]` (Laureles vs Poblado intelligence — Post-MVP moat + SEO gold), `/host/*`, `/me/tickets/[id]` (wallet), `/saved` (retention), `/about`, `/partners` (white-label/sponsor), `/legal/*`.

### 8) Dashboard / admin ideas (Patricia — Post-MVP)
- **Leads inbox** (Chatwoot model): status, assignment, conversation history, notes.
- **Approvals queue**: events to publish, outreach to send (HITL).
- **Listings moderation**: verify / flag scam (`considered_but_rejected`).
- **Observability**: `ai_runs`, grounding quota, Places spend, cache-hit.
- **Host dashboard** (Roberto): my events, ticket sales, payouts.

### 9) Mobile UI patterns
- **Bottom sheet** for map+cards (peek/half/full — Google Maps model).
- Map full-bleed behind sheet; chat input docked bottom.
- Chips as horizontal scroll row; cards as vertical scroll in sheet.
- Single FAB to toggle Map ↔ List. Thumb-reachable primary actions.

### 10) Best layout structure
- **Desktop:** 3-panel (left rail collapsible · center chat+cards · right map).
- **Tablet:** 2-panel (chat+cards · map), left rail → drawer.
- **Mobile:** map + bottom sheet + docked input.
- One layout primitive that collapses by breakpoint — not three separate builds.

### 11) Best map/card interaction patterns
- Bidirectional highlight (hover card ↔ bounce pin; tap pin ↔ scroll card).
- Price pins (rentals) / category glyph pins (food, nightlife, events).
- Clustering at zoom-out (MAP-009); selected pin lifts + opens mini-card.
- Map never blank: empty state = city overview with neighborhood labels.
- New results **augment**, never silently wipe prior pins (UX-007 clear-stale is explicit, not accidental).

### 12) Sticky features that improve retention
- **Saved Places / collections** (Post-MVP) — the #1 lever.
- **Trips/itinerary** object (Advanced) — turns answers into plans.
- **Alerts** (new rentals, event reminders, "tonight") — push reason to return (WA templates Phase 2).
- **Neighborhood intelligence** pages — compounding content moat.
- **Memory** of preferences across sessions.

### 13) Marketplace trust features
- **Grounding attribution** on every grounded fact (MVP).
- **Verified listing** badge + scam-filter (Post-MVP).
- **Review synthesis** ("what people actually say", themes — grounded, labeled AI).
- **Source freshness** ("checked 2 days ago").
- Host verification + transparent cancellation/refund (events).

### 14) Revenue-driving UX ideas
- **Event ticketing** (MVP O1) — primary money path; clean checkout + QR wallet.
- **Rental lead capture** (MVP O3) → landlord lead fees / commission (booking Advanced).
- **Affiliate handoff** (GuideGeek model) for stays/tours.
- **Sponsored placements** clearly labeled (Post-MVP) — never break grounding trust.
- **White-label city concierge** for hotels/DMOs (Advanced, highest ceiling).

### 15) AI workflow opportunities
- Router → vertical workflows (rental/event/food/nightlife) — current plan.
- **OpenClaw enrichment loop** (doc 11): crawl → normalize → Supabase graph → pgvector → grounded cards. **Sandbox Post-MVP, draft-only.**
- **Vibe/semantic search** (pgvector): "quiet, bright, laptop-friendly."
- **Review/menu summarization** → best-dish, best-for.
- **Hidden-gems** ("not obvious from Maps") with confidence scoring.

### 16) Booking and transaction UX
- Events (MVP): browse → checkout (Stripe test→paid) → webhook → `paid` order → **QR wallet** at `/me/tickets/[id]`; idempotent webhook isolation.
- Rentals (MVP): → "Request viewing" → `leads` + (light HITL) `showings`. Native Stripe rental booking + 12% commission = **Advanced**.
- Always show **total price**, clear refund/cancellation, no dark patterns.

### 17) Local intelligence features
- Neighborhood profiles (Laureles vs Poblado: safety, walkability, nomad score, vibe).
- "10 min from metro" commute/route previews (MAP-011).
- Nightlife heatmaps (Provenza activity).
- Creator food maps / local-expert picks.
- Living neighborhood graph (cafés↔coworking↔nightlife↔rentals) — the compounding moat.

### 18) Features competitors are missing
- **Medellín-specific** neighborhood + creator + Spanish/English nuance (global players don't).
- **Cross-vertical** in one chat (rentals + food + nightlife + events) — most are travel-only.
- **Trust/anti-scam** layer for LatAm rentals (Airbnb-grade trust where none exists locally).
- **Voice-note intake** (huge in LatAm WhatsApp).
- **Host self-publish + safe ticketing** in 30s (Roberto) — most discovery apps don't do supply-side.

### 19) What should make mdeai unique
> **The one-line wedge: "Medellín's intelligent local layer — ask anything, see it on the map, trust it, and act — on web today, WhatsApp tomorrow."**
- Hyperlocal + bilingual + creator-aware + map-native + grounded.
- One concierge brain across rentals/food/nightlife/events.
- Supply + demand (hosts publish; seekers discover) — a marketplace, not a directory.

### 20) MVP vs advanced (summary — full table §6.5)
- **MVP:** `/chat` 3-panel, router, grounded map+cards, event ticketing, rental lead, host publish (O1–O4), trust attribution.
- **Post-MVP:** Saved/collections, neighborhood pages, OpenClaw sandbox enrichment, vibe/semantic search, alerts, admin/leads, WhatsApp **sandbox**.
- **Advanced:** trips/itinerary, native rental Stripe booking, WhatsApp prod blast, white-label city concierge, voice intake at scale, sponsor marketplace.

---

## 4. Design direction (the 9 design asks)

### Dark/light direction
- **Default dark, offer light.** A map-heavy concierge looks premium dark; Medellín nightlife/energy reads well dark. Light mode mandatory for daytime rental/host tasks. Use CSS variables + Tailwind v4 tokens; `prefers-color-scheme` default, user toggle persisted.

### Typography
- One geometric-humanist sans for UI (e.g. **Inter / Geist**), one slightly warmer display weight for hero/headers. Tight scale: 12/14/16 body, 20/24/32/40 headers. High legibility on cards; numerals tabular for prices.

### Spacing / layout system
- 4px base grid (4/8/12/16/24/32/48). Card = 16 padding, 12 radius. Consistent gutters; 3-panel widths ~ `280 / fluid / 40%`. Tailwind spacing scale already aligns.

### Animations / microinteractions
- Streaming text reveal (have it). Pin bounce on hover. Card lift on focus. Sheet spring on mobile. Skeleton loaders for cards/map. **Subtle, <200ms, never block input.** Respect `prefers-reduced-motion`.

### Navigation structure
- Top: logo · verticals · Saved · host CTA · profile. The chat input is global (persistent). Mobile: bottom tab (Chat · Map · Saved · Profile) + docked input.

### Sidebar / tab patterns
- Left rail = workspace (Threads · Saved · Verticals · Profile), collapsible to icons. Right panel tabs (Post-MVP): Map · Saved · (Trip). Center is always the conversation.

### AI assistant placement
- **The assistant is not a bubble — it's the center panel** (the product). On marketing pages, a docked input/launcher routes into `/chat`. (CopilotKit `<CopilotSidebar>` for ancillary surfaces only.)

### WhatsApp conversation UX (Phase 2)
- Short bubbles, ≤3 picks each, interactive buttons/lists for chips, location pins, "open full view" deep-links, template messages for alerts, voice-note intake. Mirror the web brain; never paste web HTML.

### Responsive mobile-first layouts
- Build mobile sheet first, expand to 3-panel. One layout primitive, breakpoint-driven. Test at 390px (already a verify target).

---

## 5. Returns

### 5.1 Sitemap

```text
/                         Home (hero + chat input + verticals + trust + host CTA)
/chat                     3-panel concierge (THE product)  ← MVP core
/rentals                  Rental vertical landing + search
/events                   Events vertical landing + discovery
/restaurants              Food/café vertical landing
/nightlife                Nightlife vertical landing
/neighborhoods/[name]     Neighborhood intelligence (Post-MVP, SEO)
/saved                    Saved places / collections (Post-MVP)
/host
  /host/event/new         Roberto AI publish wizard + HITL   ← MVP (O2)
  /host/events            Host dashboard (my events, sales)
/me
  /me/tickets/[id]        Ticket wallet + QR                 ← MVP (O1)
/admin                    Patricia ops (leads, approvals, moderation, obs)  Post-MVP
  /admin/leads
  /admin/approvals
  /admin/listings
/about                    Mission + trust + local credibility
/partners                 White-label / sponsor (Advanced)
/login                    Auth
/legal/*                  Terms, privacy, refunds
WhatsApp (number/QR)      Phase 2 transport onto same brain
```

### 5.2 Homepage wireframe (desktop)

```text
┌───────────────────────────────────────────────────────────────┐
│  mdeai      Rentals  Events  Food  Nightlife    Saved  [Host]  ◑│  nav + theme toggle
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│        Ask anything about Medellín.                             │
│        Get answers on the map.                                  │
│                                                                 │
│   ┌─────────────────────────────────────────────┐  [→]         │  global chat input
│   │  Find a rental in Laureles under $1.5M…       │             │
│   └─────────────────────────────────────────────┘              │
│   [ Rentals in Laureles ] [ This weekend ] [ Cafés to work ]    │  try-it chips
│   [ Nightlife in Provenza tonight ]                             │
│                                                                 │
│   ┌───────── live mini-map w/ a few real pins ─────────┐        │
│   └────────────────────────────────────────────────────┘       │
├───────────────────────────────────────────────────────────────┤
│  [Rentals]   [Events]   [Restaurants]   [Nightlife]             │  verticals strip
├───────────────────────────────────────────────────────────────┤
│  Grounded in Google Maps · Verified listings · No scams         │  trust band
├───────────────────────────────────────────────────────────────┤
│  Hosting an event?  Publish in 30 seconds →  [Get started]      │  Roberto CTA
├───────────────────────────────────────────────────────────────┤
│  How it works:  1 Ask   2 See on the map   3 Save / Book        │
└───────────────────────────────────────────────────────────────┘
```

### 5.3 `/chat` wireframe (desktop, the product)

```text
┌──────────┬───────────────────────────────┬──────────────────────┐
│ LEFT     │ CENTER  (conversation + cards) │ RIGHT  (map)         │
│ rail     │                                │                      │
│ • Threads│  user: cafés to work, Laureles │   ┌──────────────┐   │
│ • Saved  │  ─ handing off to food agent…  │   │   ● ● price   │   │
│ • Rentals│  ─ scanning 40 cafés…          │   │  ● glyph pins │   │
│ • Events │  ┌── card ──┐ ┌── card ──┐      │   │     ●         │   │
│ • Food   │  │ photo    │ │ photo    │  ◀──┼──▶│ hover=bounce │   │
│ • Night  │  │ ★ vibe   │ │ ★ vibe   │      │   └──────────────┘   │
│ • Profile│  │ [Save]   │ │ [Save]   │      │   attribution: Google│
│          │  └──────────┘ └──────────┘      │                      │
│          │  [ type a message…        ] →   │   [Map][Saved] tabs  │
└──────────┴───────────────────────────────┴──────────────────────┘
mobile → center stacks; map becomes bottom sheet (peek/half/full)
```

### 5.4 Component ideas (build once in `src/platform/`)

| Component | Notes | Phase |
|---|---|---|
| `ConciergeInput` | global chat input (home + docked) | MVP |
| `ResultCard` (variants: Rental, Event, Place, Nightlife) | unified card arch (UX-010) | MVP |
| `MapCanvas` + `MapPin` (price / glyph) | vis.gl, mapId, clustering | MVP |
| `GroundingAttribution` | "from Google Maps" | MVP |
| `ThinkingTrace` | streaming handoff steps | MVP (have) |
| `Chips` | intent seeds | MVP |
| `SaveButton` / `Collection` | retention | Post-MVP |
| `BottomSheet` | mobile map+list | Post-MVP |
| `NeighborhoodCard` / `CommuteCard` | local intel | Post-MVP |
| `LeadInbox` / `ApprovalQueue` | admin | Post-MVP |
| `WAMessageRenderer` | card→WA list/button map | Phase 2 |

### 5.5 Feature prioritization

| Feature | Phase | Tie to roadmap |
|---|---|---|
| `/chat` 3-panel + router | **MVP** | MAP-007, F18/F43 |
| Grounded map + cards + attribution | **MVP** | MAP-001–003 |
| Event publish (Roberto) + HITL | **MVP** | F33–F38 (O2) |
| Ticketing + QR wallet | **MVP** | EVT edges (O1) |
| Rental search + pins + lead | **MVP** | F17/F41, RE-001 (O3) |
| Restaurant/nightlife DB search | **MVP→**near | F19/F26 |
| Saved / collections | Post-MVP | new |
| Neighborhood intelligence | Post-MVP | MAP-012 |
| OpenClaw enrichment (sandbox) | Post-MVP | doc 11 |
| Vibe/semantic (pgvector) search | Post-MVP | vector track |
| Admin/leads/approvals | Post-MVP | F32 + new |
| WhatsApp **sandbox** | Post-MVP | RE P4 |
| Trips/itinerary | Advanced | `trips` |
| Native rental Stripe booking | Advanced | RE money path |
| WhatsApp **prod** + voice intake | Advanced | Phase 2 transport |
| White-label city concierge | Advanced | revenue ceiling |

### 5.6 UX recommendations (top 10, prioritized)
1. Keep the front door **conversational** — no form walls (beat Wonderplan/iPlan).
2. **Map ↔ card bidirectional** highlight is non-negotiable polish.
3. **Price/glyph pins**, never anonymous dots.
4. **Total price** on rental cards (Camila comparison).
5. **Grounding attribution** visible = trust currency.
6. **Visible thinking** during handoff (keep).
7. **Save** everything → retention (Post-MVP, but design hooks now).
8. **Mobile = bottom sheet**, build mobile-first.
9. **Multi-intent without pin wipe** (augment, don't overwrite).
10. **Deep-link parity** so web and (future) WhatsApp share URLs/objects.

### 5.7 Design inspiration references
| For | Look at |
|---|---|
| 3-panel concierge | Mindtrip (docs 01–05) |
| WhatsApp-native flow | GuideGeek |
| Card + trust + price pins | Airbnb |
| Map sheet + place sheet | Google Maps |
| Ops inbox + handoff | Chatwoot |
| Itinerary as retention | Layla, Wonderplan |
| Local enrichment moat | OpenClaw (doc 11), Foursquare |

### 5.8 Implementation priority roadmap (this doc → existing plan)

```text
NOW (MVP, already sequenced)
  platform/contracts → MAP-001 → MAP-003 (attribution)
  → MAP-007 /chat 3-panel  →  ┬ Roberto publish + HITL + ticketing (O1,O2)
                              └ rental search + pins + lead (O3)
  → restaurant/nightlife DB search (O4 unified)
  Design now: ResultCard unify (UX-010), price/glyph pins, dark/light tokens

POST-MVP (moat + retention)
  Saved/collections · neighborhood pages · OpenClaw sandbox enrichment
  · vibe/semantic search · admin/leads · WhatsApp SANDBOX renderer
  · mobile bottom sheet

ADVANCED (bets)
  trips/itinerary · native rental Stripe · WhatsApp PROD + voice
  · white-label city concierge · sponsor marketplace
```

---

## 6. Doc plan (what to write next)

This blueprint is input; turn the load-bearing parts into owned docs/tasks:

| # | Doc / artifact | Path | Why | Priority |
|---|---|---|---|---|
| 1 | This file | `plan/competitors/12-mdeai-blueprint.md` | synthesis (done) | — |
| 2 | Homepage + marketing IA spec | `tasks/ux/UX-011-homepage-ia.md` | hero + chips + verticals; today there's no real marketing home | High |
| 3 | Design system tokens | `plan/diagrams/` or `mdeapp/docs/design-system.md` | dark/light, type, spacing, motion → consistent build | High |
| 4 | WhatsApp transport design (Phase 2) | `plan/real-estate/draft/` or new `plan/whatsapp/` | proves brain-once/renderer-many; keeps WA out of MVP scope | Medium |
| 5 | Saved/collections retention spec | `tasks/ux/` | the #1 retention lever | Medium (Post-MVP) |
| 6 | Neighborhood intelligence content model | `plan/data/` | SEO + moat | Medium (Post-MVP) |
| 7 | Admin/ops (Chatwoot-model) spec | `tasks/` | Patricia leads/approvals | Low (Post-MVP) |

> **Next engineering bet is unchanged:** MAP-001 + `platform/contracts`, then Roberto + rentals in parallel. This doc's job is to make sure the *UI shell, cards, pins, trust, and homepage* built on top of that pipeline match the best patterns in the market — and that WhatsApp is architected-for, not built-now.
