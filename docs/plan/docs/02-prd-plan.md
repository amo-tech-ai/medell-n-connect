---
status: reference-draft
canonical: ../prd/04-maps-grounding.md
audit: ./AUDIT-vs-prd-v7-2026-05-21.md
---

> **⚠️ Not canonical.** Execute from [`plan/prd/`](../prd/README.md) v7. ECL = Post-MVP; MAP-001 = PR-1 blocker.

# Document 04 — Maps V2 & Grounding Architecture

`04-maps-grounding-architecture.md`

# 1. Maps V2 Mission

Maps are the platform’s:

* spatial truth layer
* trust layer
* discovery layer
* recommendation layer

Maps are NOT:

* the orchestration layer
* the AI reasoning layer
* the source of truth database

---

# 2. Core Maps Philosophy

```text
AI explains
Maps prove
```

Every recommendation should be:

* visually grounded
* geographically explainable
* route-aware
* nearby-aware

---

# 3. Maps Stack

| Area            | Tool                             |
| --------------- | -------------------------------- |
| React rendering | `@vis.gl/react-google-maps`      |
| Base maps       | Google Maps JS API               |
| Markers         | Advanced Markers                 |
| Clustering      | `@googlemaps/js-markerclusterer` |
| Places          | Places API New                   |
| Nearby search   | Places Nearby Search             |
| Photos          | Place Photos                     |
| Routing         | Routes API                       |
| Grounded AI     | Grounding Lite MCP               |
| UI primitives   | Extended Component Library       |

---

# 4. Locked Maps Rules

| Rule                             | Why                      |
| -------------------------------- | ------------------------ |
| One map loader                   | Prevent runtime drift    |
| One `setPins()` writer           | Prevent state corruption |
| `mapId` mandatory                | AdvancedMarker support   |
| All Places calls use field masks | Cost control             |
| Grounded attribution mandatory   | Compliance               |
| AI never invents geo facts       | Trust                    |
| Place IDs only from APIs         | Consistency              |

---

# 5. Map State Architecture

## Shared State

```ts
type MapState = {
  pins: Pin[]
  selectedPinId?: string
  viewport?: Bounds
  filters?: SearchFilters
}
```

---

## Ownership

| Layer        | Responsibility  |
| ------------ | --------------- |
| Frontend     | renders         |
| Mastra tools | retrieve places |
| Supabase     | caches          |
| Gemini       | explains        |
| CopilotKit   | synchronizes UI |

---

# 6. Pin System

## Pin Types

| Pin        | Purpose             |
| ---------- | ------------------- |
| rental     | apartments          |
| venue      | events              |
| restaurant | dining              |
| attraction | tourism             |
| grounded   | AI-grounded results |
| selected   | active focus        |

---

## Marker Rules

Every marker must:

* have stable ID
* use typed schema
* support clustering
* support selection state
* support mobile tap interactions

---

# 7. Nearby Intelligence

## Nearby Categories

| Category   | Use         |
| ---------- | ----------- |
| coworking  | nomads      |
| cafés      | lifestyle   |
| gyms       | wellness    |
| metro      | commute     |
| nightlife  | events      |
| pharmacies | convenience |

---

## Example

```text
“Show apartments near coworking”
```

Flow:

```text
Rental query
→ apartments
→ nearby coworking search
→ commute scoring
→ ranked cards
→ map pins
```

---

# 8. Grounding Lite Strategy

## Use Cases

Grounding Lite should ONLY handle:

* ambiguous discovery
* conversational geo search
* recommendation grounding

NOT:

* primary DB search
* rental truth
* inventory truth

---

## Example

```text
“quiet cafés near Parque Lleras”
```

Flow:

```text
Mastra grounded-search workflow
→ Grounding Lite MCP
→ Place Details enrich
→ attribution
→ cards + pins
```

---

# 9. Maps Caching Strategy

## Cache Tables

| Table               | Purpose         |
| ------------------- | --------------- |
| places_search_cache | search caching  |
| place_details_cache | details caching |
| grounding_call_log  | cost tracking   |

---

## Cache Rules

| Rule          | Why         |
| ------------- | ----------- |
| Cache first   | reduce cost |
| TTL required  | freshness   |
| Query hashing | dedupe      |
| Cost logging  | monitoring  |

---

# 10. Places API Rules

## Required

Every request:

* uses field masks
* uses server proxy
* validates schemas
* logs costs
* uses typed responses

---

## Forbidden

Never:

* expose raw API key
* call directly from client
* request unused fields
* trust AI-generated place data

---

# 11. Maps UX

## Desktop Layout

```text
Cards
+ Live map
+ Conversational sidebar
```

---

## Mobile Layout

```text
Bottom sheet
+ Fullscreen map
+ Swipeable cards
```

---

# 12. Core Map Features

## MVP

* rental pins
* event pins
* grounded places
* clustering
* nearby search
* map/card sync
* selected pin state

---

## Post-MVP

* route previews
* commute scoring
* digital nomad score
* neighborhood intelligence
* lifestyle overlays

---

# 13. AI + Maps UX Rules

AI responses must:

* reference visible map context
* compare visible results
* explain rankings
* avoid hallucinated claims

---

# 14. Maps Testing Strategy

## Required Tests

| Test              | Purpose              |
| ----------------- | -------------------- |
| pin count tests   | render validation    |
| map drift tests   | emitted vs rendered  |
| field mask tests  | cost enforcement     |
| attribution tests | grounding compliance |
| mobile tests      | UX stability         |
| clustering tests  | dense maps           |

---

# 15. Biggest Risks

| Risk               | Severity |
| ------------------ | -------- |
| API cost explosion | High     |
| duplicated loaders | High     |
| pin drift          | High     |
| hallucinated geo   | High     |
| bad mobile UX      | High     |

---

# 16. Final Maps Principle

The map must feel:

```text
fast
grounded
visual
trustworthy
contextual
```

not:

* cluttered
* gimmicky
* AI-generated
* disconnected from chat

---

---

# Document 05 — Events & Ticketing Architecture

`05-events-ticketing.md`

# 1. Events Mission

The event system enables:

* conversational event creation
* conversational discovery
* ticketing
* approvals
* QR validation
* host workflows

---

# 2. Core Event Philosophy

```text
conversation
→ structure
→ approval
→ publish
→ payment
```

---

# 3. Event Creation UX

## Roberto Flow

```text
/host/event/new
→ AI fills draft
→ approval
→ publish
```

---

## Example

```text
“Afrohouse rooftop Friday with VIP and GA tickets”
```

AI fills:

* title
* description
* venue
* date
* ticket tiers

---

# 4. Event State Architecture

## EventDraftState

```ts
type EventDraftState = {
  title: string
  venuePlaceId?: string
  date?: string
  description: string
  ticketTiers: TicketTier[]
}
```

---

# 5. Event Agents

| Agent           | Purpose   |
| --------------- | --------- |
| hostEventAgent  | form-fill |
| eventAgent      | discovery |
| routerAgent     | dispatch  |
| evaluationAgent | ranking   |

---

# 6. Event Workflows

## create-event

```text
parse
→ venue lookup
→ tier suggestion
→ approval
→ commit
```

---

## discover-events

```text
query
→ event search
→ ranking
→ cards + pins
```

---

# 7. Ticketing Architecture

## Flow

```text
event page
→ checkout
→ Stripe
→ webhook
→ QR ticket
```

---

## Core Components

| Component        | Purpose          |
| ---------------- | ---------------- |
| ticket-checkout  | create checkout  |
| payment-webhook  | verify payment   |
| ticket wallet    | QR display       |
| ticket validator | entry validation |

---

# 8. Ticket Types

## MVP

* GA
* VIP
* Early Bird

---

## Post-MVP

* bundles
* timed entry
* waitlists
* promo codes
* referral links

---

# 9. Event Cards

## EventCard must show

* image
* venue
* date
* price
* map preview
* CTA
* ticket availability

---

# 10. Venue Intelligence

## Venue Features

* grounded venue lookup
* nearby nightlife
* route previews
* neighborhood scoring
* venue photos

---

# 11. Event Discovery UX

## Conversational Discovery

Example:

```text
“rooftops with salsa this weekend”
```

Results:

* event cards
* venue pins
* price filters
* map synchronization

---

# 12. Approval Architecture

Publishing requires:

* preview
* approval
* commit RPC

No direct AI publishing allowed.

---

# 13. QR Validation

## Staff Flow

```text
scan QR
→ validate
→ mark entry
→ success/failure
```

---

# 14. Admin Operations

## Admin Surfaces

| Route              | Purpose         |
| ------------------ | --------------- |
| `/admin/events`    | moderation      |
| `/admin/approvals` | approval queue  |
| `/admin/leads`     | lead management |

---

# 15. Ticketing Security

## Required

* signed webhooks
* idempotent checkouts
* replay protection
* QR token validation
* approval-gated refunds

---

# 16. Event Metrics

## Track

* ticket sales
* conversion
* event CTR
* checkout dropoff
* venue performance
* repeat buyers

---

# 17. Event Scaling Plan

## Phase 1

* single-city Medellín
* ≤200 buyers/event

---

## Future

* multi-city
* sponsor systems
* contest systems
* creator analytics

---

# 18. Biggest Risks

| Risk                    | Severity |
| ----------------------- | -------- |
| webhook drift           | High     |
| duplicate ticket writes | High     |
| refund abuse            | Medium   |
| overselling             | High     |
| QR fraud                | Medium   |

---

# 19. Final Events Principle

The event system should feel:

```text
fast
social
visual
conversational
trustworthy
```

not:

* enterprise-heavy
* form-heavy
* admin-heavy

---

---

# Document 06 — Rentals & Lead Architecture

`06-rentals-leads.md`

# 1. Rentals Mission

The rentals system helps users:

* discover apartments conversationally
* compare neighborhoods
* understand lifestyle fit
* contact landlords quickly

---

# 2. Core Rentals Philosophy

```text
lifestyle-first
not spreadsheet-first
```

Users care about:

* Wi-Fi
* cafés
* commute
* safety
* vibe
* nightlife
* coworking

before:

* raw specs

---

# 3. Rental Discovery UX

## Example

```text
“quiet Laureles apartment near coworking under $1200”
```

Results:

* cards
* map pins
* nearby cafés
* commute insights
* lead capture

---

# 4. Rentals Architecture

## Search Stack

| Layer          | Purpose                  |
| -------------- | ------------------------ |
| pgvector       | semantic search          |
| filters        | deterministic filters    |
| Places API     | nearby enrichment        |
| Grounding Lite | conversational discovery |

---

# 5. Rental Agents

| Agent             | Purpose             |
| ----------------- | ------------------- |
| rentalAgent       | apartment discovery |
| conciergeAgent    | comparative Q&A     |
| neighborhoodAgent | area intelligence   |
| evaluationAgent   | ranking             |

---

# 6. Rental Workflows

## discover-rentals

```text
query
→ filters
→ embeddings
→ nearby enrich
→ ranking
→ cards + pins
```

---

## capture-lead

```text
user intent
→ lead form
→ Supabase insert
→ landlord notification
```

---

# 7. Rental Cards

## Must show

* price
* neighborhood
* bedrooms
* Wi-Fi
* nearby cafés
* map preview
* CTA
* lifestyle highlights

---

# 8. Lifestyle Intelligence

## Categories

| Category    | Example               |
| ----------- | --------------------- |
| remote work | coworking nearby      |
| nightlife   | bars/clubs            |
| quietness   | low nightlife density |
| wellness    | gyms/parks            |
| convenience | metro/pharmacy        |

---

# 9. Neighborhood Intelligence

## MVP neighborhoods

* Laureles
* Poblado
* Envigado
* Sabaneta
* Manila

---

## Each profile includes

* vibe
* pricing
* commute
* safety
* nightlife
* cafés
* remote-work fit

---

# 10. Lead Capture

## Lead flow

```text
rental selected
→ inquiry
→ lead insert
→ landlord receives
→ follow-up begins
```

---

# 11. Rental Detail Pages

## Must include

* grounded map
* nearby places
* photo gallery
* amenities
* lifestyle summary
* lead form

---

# 12. Landlord Workflows

## Phase 1

* receive leads
* view inquiries
* approve showings manually

---

## Future

* scheduling
* analytics
* lead scoring
* automated reminders

---

# 13. Search UX Rules

Search must support:

* conversational language
* vague intent
* lifestyle language
* budget
* neighborhoods
* commute

---

# 14. Ranking Strategy

## Rank by

* price fit
* neighborhood fit
* nearby quality
* remote-work quality
* landlord responsiveness

---

# 15. Rentals Metrics

Track:

* lead conversion
* rental CTR
* map engagement
* inquiry completion
* repeat searches

---

# 16. Security & Trust

## Required

* verified listings
* RLS
* spam protection
* approval-gated outreach
* anti-fraud monitoring

---

# 17. Biggest Risks

| Risk                   | Severity |
| ---------------------- | -------- |
| stale listings         | High     |
| fake listings          | High     |
| spam leads             | High     |
| poor map sync          | Medium   |
| weak lifestyle scoring | Medium   |

---

# 18. Future Roadmap

## Post-MVP

* showing scheduling
* WhatsApp workflows
* landlord dashboards
* rental analytics

---

## Advanced

* native booking
* Stripe Connect
* lease workflows
* AI negotiation
* OpenClaw enrichment

---

# 19. Final Rentals Principle

The rental experience should feel:

```text
local
trustworthy
map-aware
lifestyle-aware
conversational
```

not:

* generic
* spreadsheet-like
* listing-dump oriented
