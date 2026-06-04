---
doc_id: MAPS-PRD-V2
title: MDE Maps AI System — Production PRD v2 (Corrected + Extended)
version: 2.1
date: 2026-05-13
status: Active — supersedes maps-prd.md v1.0
area: maps / mastra / gemini / frontend
skill: [mde-task-lifecycle, mde-supabase, mastra, gemini, mde-maps]
supersedes: tasks/prompts/mastra/maps/maps-prd.md
delta_source: tasks/prompts/mastra/notes/29-notes.md + 2026-05-12 doc audit + places-api-new-audit (v2.1)
audit_report: tasks/maps/places-api-new-audit.md
---

# MDE Maps AI System — Production PRD v2

> **Core principle (unchanged):** Supabase owns data. Gemini enriches meaning. Mastra orchestrates. Frontend renders. Google Maps displays spatial truth.
> Cards and map pins are always deterministic — never hallucinated by the LLM.

### 1.1 Supabase table naming (attractions vs POIs)

The product copy still says **“attractions”** for things to do (museums, parks, landmarks). In Postgres the canonical table is **`public.tourist_destinations`** — there is **no** `attractions` table. Mastra tool filenames may stay `search-attractions.ts` for routing; **all migrations, `.from()`, and enrichment scripts must use `tourist_destinations`**. Task specs: **PLACES-005-010**, **PLACES-015**, **PLAN-001**; audit: `supabase/docs/04-supabase-audit.md`.

---

## Why v2 is better than v1

v1 was written before cross-referencing the official Google Maps API docs against every claim in the plan. That audit (2026-05-12) found **10 concrete errors** that would cause silent failures at implementation time. This version corrects all of them.

| # | What v1 got wrong | What v2 says |
|---|-------------------|--------------|
| 1 | `compute_routes` `duration` is numeric | It's a Duration string `"3.5s"` — must be parsed |
| 2 | `maps_url` constructed manually from CID | Use `places.googleMapsLinks.placeUri` — Google provides the URL |
| 3 | `generativeSummary` from Places API for neighborhoods | US-only, unavailable in Colombia. Use offline Gemini synthesis instead |
| 4 | `neighborhoodSummary` (Area Summaries) in Phase 4 | US-only, unavailable in Colombia. Removed from roadmap |
| 5 | Grounding Lite described as "experimental/beta" | GA as of 2025. Defined pricing. 300 QPM limit. Remove experimental caveats |
| 6 | No attribution requirements documented | Legal requirement: Roboto 400, 12–16sp, 4.5:1 contrast, `translate="no"` |
| 7 | `lookup_weather` parameter `units_system` | Correct camelCase: `unitsSystem` |
| 8 | No `pageSize` cap on `search_places` MCP calls | Add `pageSize: 5` default to bound cost per call |
| 9 | Contextual View planned for Phase 3 | Pre-GA, may break. Defer until GA. Don't render the widget yet |
| 10 | Maps Imagery Grounding in Phase 4 | Private preview, invite-only. Remove from roadmap. Not planned |

---

## 1. Executive Summary

MDE is a chat-first AI concierge for Medellín. The map is the primary way users evaluate spatial relevance of rentals, events, restaurants, and attractions. The current system has a critical gap: Mastra tools return structured results but the action payload is sometimes lost in the prose path — users get plain text with no pins.

**v2 fixes the full stack from action schema → pin merge → Places enrichment → live grounding → attribution.**

Production readiness score (current): **52/100**  
After MASTRA-046 → 049 + 066–070 + **073–074 (Places layer spine)**: **~83/100** (see `tasks/maps/places-api-new-audit.md` — **Places API (New) fit: 78/100**).

---

## 2. What changed in the full Google Maps Platform AI picture

### 2.1 Grounding Lite is production-ready (not beta)

Google Maps Grounding Lite (`mapstools.googleapis.com/mcp`) is a GA service. Three tools:
- `search_places` — find places by text + optional `locationBias`/`locationRestriction`
- `compute_routes` — driving/walking route between two locations
- `lookup_weather` — current/forecast weather at a location

All three are available in Mastra via `StreamableHTTPClientTransport` + `X-Goog-Api-Key`. The API key must **never** be in `VITE_*` env vars — server-side only.

### 2.2 Place Summaries and Area Summaries are US-only

`generativeSummary` and `neighborhoodSummary` fields in Places API (New) are only populated for US locations. For Medellín they return empty. **All AI-written descriptions and neighborhood summaries must come from offline Gemini scripts** (the `cache-ai-summaries.ts` approach in PLACES-005-010 is correct — the Places API field mask approach is not).

### 2.3 `googleMapsLinks.placeUri` is the authoritative maps URL

Instead of constructing `https://maps.google.com/?cid=...` strings, request `places.googleMapsLinks` in the Text Search field mask. Google returns a valid `placeUri` directly. This is simpler, more reliable, and does not require the starts-with validation hack.

### 2.4 Attribution is a legal Terms of Service requirement

Grounding Lite results must be displayed with Google attribution meeting these exact specs:
- Font: Roboto 400 weight (sans-serif fallback acceptable)
- Size: 12–16 scaled pixels
- Contrast ratio: 4.5:1 minimum
- HTML attribute: `translate="no"` on the attribution element
- Text: "Google Maps" — unmodified, no abbreviation

A shared `GroundingAttribution` component (MASTRA-066) must be used on **every** grounded result card before Phase 3 ships. This is not optional.

### 2.5 Map IDs are required for AdvancedMarkerElement in production

`AdvancedMarkerElement` (the component used by `MdeMarker.tsx`) requires a Map ID. In development, `"DEMO_MAP_ID"` works. In production, a real Map ID must be created in Google Cloud Console and wired through `VITE_GOOGLE_MAPS_MAP_ID`. MASTRA-068 covers this.

### 2.6 Contextual View is pre-GA — do not ship widgets

`gmp-place-contextual` web component and the `googleMapsWidgetContextToken` field require `enableWidget: true` in the Gemini `googleMaps` tool config. The widget itself is pre-GA and may break incompatibly. The `googleMapsWidgetContextToken` can still be _stored_ from grounding responses (it costs nothing to receive), but the rendering widget must not be shipped until Google marks it GA. MASTRA-070 tracks this.

---

## 3. Recommended Services Table (v2 — corrected)

| Service                                    | Use in mdeai                                                                                       | MVP Priority | Notes                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------- |
| **Dynamic Maps JS API**                    | Right-panel map, markers, clustering                                                               | **Must**     | Already wired. Use `AdvancedMarkerElement` for all pins                         |
| **Map IDs**                                | Required for AdvancedMarkerElement in prod                                                         | **Must**     | `DEMO_MAP_ID` in dev; real ID before prod (MASTRA-068)                          |
| **Places Text Search (New)**               | `enrich-places.ts` — resolve `place_id`, `placeUri`, coordinates for restaurants + **`tourist_destinations`** (+ events venue rows) | **Must**     | **Core mask:** `places.id,places.displayName,places.googleMapsLinks,places.location`. **Optional:** `places.photos` (returns **photo resource names only**; image bytes via **Place Photos (New)** — separate SKU/call). **Do not rely on** `places.generativeSummary` **in Colombia** (US-heavy; usually empty — use offline Gemini `ai_summary`). Always `X-Goog-FieldMask`. |
| **Places Nearby Search (New)**             | Rental/event cards **“Show nearby”**; density probes for neighborhood profiles (Phase 5)          | **Should**   | `places:searchNearby`; `locationRestriction` + `includedTypes` / rankPreference; field mask required. **PLACES-016.** |
| **Place Details (New)**                    | Refresh/enrich when `place_id` known; opening hours, phone, website                                  | **Should**   | Cheaper than Text Search for same `place_id`. Details mask **without** `places.` prefix on `getPlace`. **PLACES-011.** |
| **Place Photos (New)**                     | Card thumbnails after `places.photos` refs from Search/Details                                     | **Should**   | **Not** inline image bytes in Search/Details — call **Place Photos** media endpoint with `maxHeightPx` / `maxWidthPx` + skip HTTP referrer on server fetch. **PLACES-012.** |
| **Place Autocomplete (New)**               | Host wizard / event venue / sponsor address entry                                                  | **Should**   | Session token + field mask; server-side key only. **PLACES-018.**               |
| **Maps Links (`googleMapsLinks`)**         | `maps_url` for cards — use `placeUri`                                                              | **Must**     | PLACES-004 updates field mask in enrich script                                  |
| **Place Summaries (`generativeSummary`)**  | AI neighborhood text                                                                               | **Remove**   | US-only. Use offline Gemini `ai_summary` column instead                         |
| **Area Summaries (`neighborhoodSummary`)** | Neighborhood profiles                                                                              | **Remove**   | US-only. Removed from roadmap                                                   |
| **Routes API / polylines**                 | Route overlay on map (MASTRA-062)                                                                  | **Should**   | Via Grounding Lite `compute_routes`; duration is string `"3.5s"` — parse it     |
| **Grounding Lite `search_places`**         | Live place search via Mastra tool                                                                  | **Should**   | Phase 3 (GROUNDING-001); `pageSize: 5` default; 300 QPM server limit               |
| **Grounding Lite `compute_routes`**        | Route planning via Mastra tool                                                                     | **Should**   | Phase 3 / MASTRA-062; parse duration string                                     |
| **Grounding Lite `lookup_weather`**        | Event weather forecast                                                                             | **Later**    | MASTRA-072; `unitsSystem` (camelCase); cache results                            |
| **Maps Grounding (Gemini API)**            | Real-time AI place intelligence                                                                    | **Should**   | Phase 3 — adds `enableWidget: true` only after Contextual View GA               |
| **Contextual View widget**                 | Interactive place map card                                                                         | **Defer**    | Pre-GA, may break. MASTRA-070 tracks GA release                                 |
| **Maps Imagery Grounding**                 | Visual neighborhood/venue scoring                                                                  | **Remove**   | Private preview, invite-only. Not planned                                       |
| **Maps Code Assist MCP**                   | Claude Code grounding vs Maps docs                                                                 | **Dev-only** | Never import into production; use in `.mcp.json` only                           |

### 3.2 Places API (New) — feature matrix (production)

Canonical field-mask and endpoint notes: `.claude/skills/mde-maps/references/places-api-new.md`. Forensic audit + scoring: **`tasks/maps/places-api-new-audit.md`**.

| Feature | What it does | mdeai use | MVP | Example | Endpoint / tool | Required field mask (summary) | Cache / TTL | Security | Cost risk | Task |
|--------|----------------|-----------|-----|---------|-----------------|--------------------------------|-------------|----------|------------|------|
| **Text Search (New)** | Natural-language + name search | Offline enrichment; geocode-ish fallback when no `place_id` | **Must** | “Carmen Restaurant Laureles Medellín” | `POST …/places:searchText` | `places.id,places.displayName,places.googleMapsLinks,places.location` (+ optional photos / avoid relying on `generativeSummary` in CO) | Write-through to Supabase columns; **no** per-chat call | Server `GOOGLE_PLACES_API_KEY` IP-restricted | Per-request + field SKUs | **048**, **073** |
| **Nearby Search (New)** | POIs in radius around a point | Rental card “nearby cafés/gyms”; event “dinner near venue” | **Should** | Gyms within 800 m of listing pin | `POST …/places:searchNearby` | Minimal: `places.id,places.displayName,places.googleMapsLinks,places.location` | Short TTL server cache (e.g. 24–72 h) + quota log | Same server key; never browser | Many results × radius = spend | **075** |
| **Place Details (New)** | Rich fields for one `place_id` | Deep card; sponsor “premium venue” checks | **Should** | Hours + website for a resolved venue | `GET places/{id}` | `id,displayName,googleMapsLinks,location,…` (mask per need) | Supabase snapshot after first fetch | Server key | Preferred/Atmosphere SKUs if requested | **076** |
| **Place Photos (New)** | JPEG/PNG bytes from photo ref | Card hero / list thumb | **Should** | Thumbnail 400px wide | `GET …/{photo}/media` | N/A (photo resource name from Search/Details) | Cache **URL or media** in Storage/CDN with attribution; TTL 7–30 d | Fetch server-side; **do not** expose Places key to client | Per-photo SKU | **077** |
| **Place Autocomplete (New)** | Typeahead place suggestions | Host event venue, sponsor HQ | **Should** | “Parque …” → list picks | `POST …/places:autocomplete` | Response field mask per docs | Session token per form; debounce | Server proxy only | Per-session billing | **078** |
| **Place types** | `includedTypes` / filters | Nearby + MCP `search_places` alignment | **Must** | `cafe`, `gym`, `restaurant` | Search/Nearby/MCP params | N/A (request shape) | N/A | N/A | Wrong type = wasted calls | **073**, **075** |
| **Data fields / field masks** | Billing + payload control | Every Places (New) call | **Must** | Omit unused fields | `X-Goog-FieldMask` header | Smallest mask per use case | N/A | Prevents over-fetch | High if mask too wide | **073** |
| **Maps Links** | Canonical URLs | “Open in Google Maps” | **Must** | User opens venue in Maps app | Returned in `googleMapsLinks` | Include `places.googleMapsLinks` in mask | Store `placeUri` in DB | Never hand-build `maps.google.com/?q=` for production cards | Low | **067** |
| **Geocoding API** | Address ↔ lat/lng | Free-form Colombian addresses; autocomplete fallback | **Should** | Cra 43 #12-100 → coords | Geocoding HTTP | `address` param + region bias CO | Cache positive geocodes 30–90 d | Server key IP-restricted | Lower than Text Search for pure coords | **079** |
| **Dynamic Maps** | Interactive map tiles | Right-panel map | **Must** | User pans map | Maps JavaScript API | N/A | Client tile cache (Google-managed) | **Browser** key: `VITE_GOOGLE_MAPS_API_KEY` referrer-only | Dynamic Maps SKU | **068** |
| **Map IDs** | Advanced markers + cloud styling | Production pins | **Must** | `mapId` in `Map` options | Cloud Console Map ID | N/A | N/A | Not a secret; still restrict key | N/A | **068** |

### 3.3 Real-world mdeai use cases (Places + Mastra + Supabase)

| Vertical | User prompt / job | Deterministic layer | Places / Maps layer | Gemini role |
|----------|-------------------|---------------------|----------------------|-------------|
| **Rentals** | “Show cafés, gyms, coworking near this apartment” | Listing `lat`/`lng` from Supabase | **Nearby Search (New)** or Grounding Lite `search_places` with `locationBias` | Rank + explain hours/distance; **never invent** `place_id` |
| **Restaurants** | “Best brunch near Provenza” | `search-restaurants` rows + neighborhood filter | Text Search / MCP for gaps or “open now” | Compare options; cite Google attribution on grounded cards |
| **Events** | “Dinner options near this venue” | Event venue coordinates + `events` row | Nearby Search around venue; Details for top picks | Summarize tradeoffs (price, distance) |
| **Attractions / POI** | “Plan first weekend in Medellín” | `tourist_destinations` + curated collections | MCP/Text for ad-hoc POIs not in DB | Itinerary narrative; pins from DB first |
| **Real estate** | “Compare Laureles vs Envigado amenities” | Phase 5 `neighborhood_profiles` + cached POI counts | `search_places` / Nearby for **density probes** (offline job) | Read structured profile rows; no Area Summaries |
| **Sponsors** | “Premium venues near luxury hotels” | Sponsor tier + hotel `place_id` from CRM | Nearby + Details for `lodging` / `restaurant` types | Qualitative fit; enforce quota |
| **Trip planning** | “Route with cafés, attractions, nightlife” | `trips` / `trip_items` in Supabase | `compute_routes` (MCP) + selective Nearby | Order stops; parse duration strings (**046/062**) |

---

## 4. Architecture (unchanged from v1, label corrections only)

```
User chat message
      │
      ▼
useChat.sendMessage()           [normalizeToolOutput — MASTRA-046]
      │
      ▼
POST /api/chat  →  Mastra Concierge Agent
      │
      ├─ Tier 1 tools (Supabase-backed, deterministic)
      │    search-rentals / search-events
      │    search-restaurants / search-attractions (DB: tourist_destinations)
      │    → rows with lat/lng, image, id, maps_link_uri
      │
      ├─ Tier 2 tools (Maps Grounding Lite MCP, Phase 3)
      │    search-grounded-places (GROUNDING-001)
      │    → search_places @ mapstools.googleapis.com/mcp
      │    → enrich from Supabase by place_id
      │    → quota-gated via grounding_quota_log (MASTRA-057)
      │
      └─ Gemini reasoning
           → prose summary + ranking reason
           → __mdeai_actions__ sidecar (version: 1)

SSE stream → useChat
      │
      ├─ text-delta → ChatMessageList
      └─ tool-output-available → normalizeToolOutput
              │
              ├─ OPEN_RENTALS_RESULTS → rental pins (per-category merge, MASTRA-047)
              ├─ OPEN_RESTAURANTS_RESULTS → restaurant pins
              ├─ OPEN_EVENTS_RESULTS → event pins
              ├─ OPEN_GROUNDED_RESULTS → gray/silver 'grounded' pins (MASTRA-056)
              └─ OPEN_ROUTE_RESULTS → route overlay (MASTRA-062)
```

### 4.2 Architecture confirmation — who owns truth

| Layer | Owns | Must never |
|-------|------|------------|
| **Supabase / PostGIS** | Internal listings, events, restaurants, `tourist_destinations`, user trips, cached enrichments | Block Google-only flows without fallback rows |
| **Places API (New)** | External POI truth: `place_id`, `placeUri`, coords, photos, hours | Run from browser or leak server keys |
| **Gemini** | Natural language, ranking rationale, structured summaries from **allowed** inputs | Invent `place_id`, coordinates, `placeUri`, photo URLs, or opening hours |
| **Mastra** | Tool routing, quotas, merging tool outputs into actions | Skip `normalizeToolOutput` (MASTRA-046) |
| **React + Maps JS** | Cards, pins, `AdvancedMarkerElement`, attribution UI | Construct Maps URLs when `placeUri` exists |
| **Grounding Lite MCP** | Live `search_places`, `compute_routes`, `lookup_weather` | Replace Supabase as primary search for rentals/events |

### 4.3 Places API New — implementation layer (Phases 2A–2E)

These phases **nest inside** Phase 2 (enrichment) and **PLACES-005-010**; they are ordered for **billing safety** and **schema clarity**, not for marketing milestones.

| Sub-phase | Scope | Tasks (indicative order) |
|-----------|--------|--------------------------|
| **2A** | Text Search enrichment + mask audit | **PLACES-002** → **066 → 068 → 067** → script work in **048** |
| **2B** | Nearby Search around rentals/events | **PLACES-016** (tool + UI hook); depends on **073**, **047** |
| **2C** | Place Details + Place Photos on cards | **PLACES-011**, **PLACES-012**; depends on **074**, **073** |
| **2D** | Autocomplete + Geocoding for submitted addresses | **PLACES-018**, **PLACES-017** |
| **2E** | Cache, quota, billing, security hardening | **PLACES-003** (cache schema/TTL), **PLACES-022**, **PLACES-021**; aligns with **057**, **071**, **069** |

**Non-blockers:** Contextual View, Maps Imagery Grounding — see §2.6 / “Not planned”.

---

## 5. Phased Roadmap (v2 — corrected sequence)

### Phase 1 — Fix the action pipeline (unblocks all downstream)
**Tasks: MASTRA-046, 047, 050, 053, 054**

| Task | What it does | Why first |
|------|-------------|-----------|
| MASTRA-046 | `normalizeToolOutput` — Zod validation before any `ChatAction` dispatch | Silent failures without this; blocks 047 |
| MASTRA-047 | Per-category pin merge; functional `setPins` updater | Pins overwrite each other without this |
| MASTRA-050 | Canonical model constants in `models.ts` | Model name drift across tools |
| PLACES-014 | Wire `search-restaurants` to real Supabase rows | Currently mock data |
| PLACES-015 | Wire `search-attractions` to real Supabase rows | Currently mock data |

**Gate:** Restaurant and attraction pins appear correctly in the right-panel map without overwriting rental pins.

---

### Phase 2 — Places enrichment (compliance → field masks → cache → offline bulk write)

**Task order (mandatory):** **`PLACES-002 → MASTRA-066 → MASTRA-068 → PLACES-004 → PLACES-003 → PLACES-005-010`** — see §4.3 and §9. **073** locks field-mask and SKU assumptions before code churn; **074** adds explicit **places response cache** tables/TTLs where needed; **048** consumes masks + cache policy.

| Task | What it does |
|------|-------------|
| **PLACES-002** | Field masks + cost tiers audit (Text, Nearby, Details, Photos, Autocomplete) — signed checklist in repo |
| **MASTRA-066** | `GroundingAttribution` component — Roboto 400, 12–16sp, 4.5:1 contrast, `translate="no"` |
| **MASTRA-068** | Real Map ID in Cloud + `VITE_GOOGLE_MAPS_MAP_ID` wiring for AdvancedMarkerElement |
| **PLACES-004** | Field mask update — `places.googleMapsLinks` → store `placeUri` as canonical `maps_url` / `maps_link_uri` |
| **PLACES-003** | Places cache schema + TTL strategy (Supabase tables or Storage refs for photo media metadata) |
| **PLACES-005-010** | Offline `enrich-places.ts` script: Text Search → `place_id`, `placeUri`, coords; **`ai_summary` via offline Gemini**, not Places generative fields for CO |
| **PLACES-016–081** | See §6 — Nearby tool, Details/Photos cards, Autocomplete, Geocoding fallback, security/quota, test fixtures |

**What users see:** Restaurant and tourist-POI cards show real photos and a "View on Google Maps" link. Map pins use AdvancedMarkerElement with a production Map ID.

**Gate:** ≥ 80% of `restaurants` + **`tourist_destinations`** rows have non-null `place_id` and canonical maps link after enrichment.

---

### Phase 3 — Live Grounding Lite (proximity + open-now queries)
**Tasks: MASTRA-056, MASTRA-057, MASTRA-059, GROUNDING-001, MASTRA-066, MASTRA-065, MASTRA-069**

| Task | What it does |
|------|-------------|
| MASTRA-056 | Add `'grounded'` to `MapPinCategory` union; gray/silver pin styling |
| MASTRA-057 | `grounding_quota_log` migration (atomic increment, daily limit gate) |
| MASTRA-059 | Google Search grounding on concierge agent (real-time neighborhood context) |
| **MASTRA-066** | `GroundingAttribution` component — Roboto 400, 12–16sp, 4.5:1 contrast, `translate="no"` (**legal requirement**) |
| GROUNDING-001 | `searchGroundedPlacesTool` in concierge agent; calls `search_places` MCP; `pageSize: 5`; fallback to Supabase |
| MASTRA-065 | "Show nearby" on rental cards — user-triggered, grounded pins around selected rental |
| MASTRA-069 | `pageSize: 5` enforced on all Grounding Lite calls; truncation logged to `ai_runs` |

**Critical ordering:** MASTRA-066 must be merged before GROUNDING-001 or MASTRA-065. Attribution is a ToS requirement — grounded results cannot ship without it.

**What users see:** "What's open near Provenza?" returns live results with operating hours and distance. Rental cards have an optional "Show nearby cafés/gyms" button. All grounded results show a Google Maps attribution badge.

**Gate:** Grounded call writes to `grounding_quota_log`. At-limit → silent fallback to Supabase. 200 grounded calls/day default cap.

---

### Phase 4 — Route display + weather
**Tasks: MASTRA-062, MASTRA-072**

| Task | What it does |
|------|-------------|
| MASTRA-062 | `OPEN_ROUTE_RESULTS` ChatAction → `RouteDisplay` component on map; `duration` parsed from `"3.5s"` string |
| MASTRA-072 | `lookup_weather` MCP tool for event cards; `unitsSystem` (camelCase); weather cache table |

**Gate:** "Route from El Poblado to Santa Fe mall" renders a polyline + travel time on the map. Event cards show weather forecast for the event date/location.

---

### Phase 5 — Neighborhood intelligence (offline Gemini synthesis)
**No Places API features — replaces the v1 "Area Summaries" approach**

Neighborhood comparison is possible without `neighborhoodSummary` (US-only). The approach:
1. `search_places` MCP: POI density query per neighborhood (cafés, coworking, gyms)
2. `compute_routes` MCP: travel times between key landmarks
3. Offline Gemini script: synthesize a neighborhood profile stored in `neighborhood_profiles` Supabase table
4. Chat query "Compare Laureles vs Envigado for remote workers" → Gemini reads `neighborhood_profiles` rows → structured comparison card

This approach is more reliable, cacheable, and doesn't depend on API availability per query.

---

### Phase 6 — Contextual View (BLOCKED on Google GA)
**Task: MASTRA-070 (deferred)**

`gmp-place-contextual` web component is pre-GA. Block diagram stays in the plan; the `googleMapsWidgetContextToken` can be stored from grounding responses at no cost. Render only after Google marks the widget GA.

---

### Not planned
- **Maps Imagery Grounding** — Private preview, invite-only. No delivery date. Remove from all plans.
- **User location tracking** — Out of scope. The Medellín center fallback (6.2442, -75.5812) is sufficient.
- **Real-time Maps streaming** — Not needed for the current chat architecture.

---

## 6. New tasks added by v2 (+ v2.1 Places layer)

| Task ID | Title | Priority | Depends on |
|---------|-------|----------|-----------|
| MASTRA-066 | `GroundingAttribution` React component (Roboto, 4.5:1, translate="no") | **P1 Must** | MASTRA-046, MASTRA-047 |
| PLACES-004 | Update `enrich-places.ts` field mask → `places.googleMapsLinks.placeUri` | **P1 Must** | MASTRA-066, MASTRA-068 |
| MASTRA-068 | Map ID setup: Cloud Console + `mapId` in JS init + `VITE_GOOGLE_MAPS_MAP_ID` | **P1 Must** | — |
| MASTRA-069 | `pageSize: 5` default + truncation logging on all Grounding Lite calls | **P1 Must** | GROUNDING-001 |
| MASTRA-070 | Defer Contextual View widget until GA; add note to maps-prd; store token only | **P2 Should** | — |
| MASTRA-071 | IP restriction for `GOOGLE_PLACES_API_KEY` in Google Cloud Console | **P1 Should** | — |
| MASTRA-072 | `lookup_weather` MCP tool + weather cache table + event card forecast | **P2 Later** | GROUNDING-001 |
| **PLACES-002** | **Places API (New) field masks + cost tiers audit** | **P1 Must** | — |
| **PLACES-003** | **Places cache schema + TTL strategy (Supabase)** | **P1 Must** | PLACES-002 |
| **PLACES-016** | **Nearby Search (New) tool — rental/event “Show nearby”** | **P2 Should** | PLACES-002, MASTRA-047 |
| **PLACES-011** | **Place Details cache + deep venue enrichment** | **P2 Should** | PLACES-002, PLACES-003 |
| **PLACES-012** | **Place Photos integration for cards** | **P2 Should** | PLACES-002, PLACES-011 |
| **PLACES-018** | **Place Autocomplete — host/event venue input** | **P2 Should** | PLACES-002 |
| **PLACES-017** | **Geocoding API fallback for submitted addresses** | **P2 Should** | PLACES-002 |
| **PLACES-022** | **Places API security + quota controls (runtime)** | **P1 Must** | PLACES-002, MASTRA-057 |
| **PLACES-021** | **Places API (New) test fixtures + mocked responses** | **P2 Should** | PLACES-002 |

---

## 7. Supabase schema (v2 additions)

### 7.1 Column additions to existing tables

```sql
-- restaurants, tourist_destinations (and events if venue-level link needed):
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS maps_link_uri text;
ALTER TABLE tourist_destinations ADD COLUMN IF NOT EXISTS maps_link_uri text;
-- Optional: ALTER TABLE events ADD COLUMN IF NOT EXISTS maps_link_uri text;
-- Populated by enrich-places.ts from googleMapsLinks.placeUri (PLACES-004)
-- Keep maps_url for backward compat; populate maps_link_uri going forward
```

### 7.2 New tables

```sql
-- grounding_quota_log (MASTRA-057 — already planned, shown for completeness)
CREATE TABLE grounding_quota_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  tool text NOT NULL,          -- 'search_places' | 'compute_routes' | 'lookup_weather'
  call_count integer NOT NULL DEFAULT 0,
  UNIQUE (date, tool)
);
-- Increment: INSERT … ON CONFLICT (date, tool) DO UPDATE SET call_count = call_count + 1

-- weather_cache (MASTRA-072 — new)
CREATE TABLE weather_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id text NOT NULL,
  forecast_date date NOT NULL,
  data jsonb NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '3 hours',
  UNIQUE (place_id, forecast_date)
);
CREATE INDEX ON weather_cache (place_id, forecast_date);

-- neighborhood_profiles (Phase 5)
CREATE TABLE neighborhood_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood text NOT NULL UNIQUE,
  poi_density jsonb,           -- { cafes: 12, coworking: 3, gyms: 5, ... }
  route_times jsonb,           -- { to_el_centro: "18 min", to_aeropuerto: "25 min" }
  ai_summary text,             -- offline Gemini synthesis
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### 7.3 RLS notes

All new tables follow standard RLS: public SELECT, no anonymous INSERT/UPDATE. `grounding_quota_log` and `weather_cache` are written by edge functions / Mastra tools using service role only.

---

## 8. Security checklist (v2 additions)

| Item | Status | Task |
|------|--------|------|
| `VITE_GOOGLE_MAPS_API_KEY` — HTTP referrer restriction to `mdeai.co/*` | Must verify | MASTRA-068 |
| `GOOGLE_PLACES_API_KEY` — **IP address restriction** to Vercel/Mastra server IPs | **New in v2** | MASTRA-071 |
| `GOOGLE_MAPS_API_KEY` (server routes) — IP restriction | **New in v2** | MASTRA-071 |
| No Maps API keys in `VITE_*` except `VITE_GOOGLE_MAPS_API_KEY` (browser Maps JS only) | Existing rule | — |
| `maps_url` validation: must start with `https://maps.google.com` or `https://goo.gl/maps` | Replace with placeUri | PLACES-004 |

---

## 9. Task execution order (revised)

```
Phase 1 (ship now — fix action pipeline):
  046 → 047 → 050 → 053 → 054

Phase 2 (Places enrichment + Places layer):
  073 → 066 → 068 → 067 → 074 → 048
  (parallel after 073: 075/078/079 spec work; 076→077 chain; 080 hardens runtime; 081 test kit)

Phase 3 (Grounding Lite):
  056 → 057 → 059 → 066* → 049 → 069 → 065
  (* 066 must ship BEFORE 049 and 065)

Phase 4 (routes + weather):
  062 → 072

Phase 5 (neighborhood intelligence):
  new tasks TBD from offline Gemini synthesis approach

Phase 6 (Contextual View):
  070 tracks — blocked on Google GA
```

---

## 10. What does NOT change from v1

- Architecture: Supabase owns data, Mastra orchestrates, Gemini reasons, React renders
- `searchGroundedPlacesTool` MCP approach (GROUNDING-001) — correct
- `@modelcontextprotocol/sdk` + `StreamableHTTPClientTransport` — correct
- Dual-format response parsing (`structuredContent?.places` || `content[0].text`) — correct
- `places/ChIJ...` prefix stripping before Supabase lookup — correct
- `grounding_quota_log` atomic `ON CONFLICT` increment — correct
- `normalizeToolOutput` Zod schema (MASTRA-046) — correct
- Per-category pin merge pattern (MASTRA-047) — correct
- `@googlemaps/markerclusterer` already installed — correct
- Offline Gemini `cache-ai-summaries.ts` for `ai_summary` column — correct (now the only summary path)

---

## 11. References

| Resource | URL | Used in |
|----------|-----|---------|
| Grounding Lite MCP overview | https://developers.google.com/maps/ai/grounding-lite | 049, 065, 066 |
| Grounding Lite MCP reference | https://developers.google.com/maps/ai/grounding-lite/reference/mcp | 049 |
| `search_places` tool | https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places | 049, 065, 069 |
| `compute_routes` tool | https://developers.google.com/maps/ai/grounding-lite/reference/mcp/compute_routes | 062 |
| `lookup_weather` tool | https://developers.google.com/maps/ai/grounding-lite/reference/mcp/lookup_weather | 072 |
| Attribution requirements | https://developers.google.com/maps/ai/grounding-lite/attribution | 066 |
| Places offline exports (full text) | `.claude/skills/mde-maps/references/places-official/README.md` | 073–081, 048 |
| Places API (New) overview | https://developers.google.com/maps/documentation/places/web-service/op-overview | 073, 048 |
| Places API (New) Text Search | https://developers.google.com/maps/documentation/places/web-service/text-search | 048, 067, 073 |
| Nearby Search (New) | https://developers.google.com/maps/documentation/places/web-service/nearby-search | 075, 073 |
| Place Details (New) | https://developers.google.com/maps/documentation/places/web-service/place-details | 076, 073 |
| Place Photos (New) | https://developers.google.com/maps/documentation/places/web-service/place-photos | 077, 073 |
| Place Autocomplete (New) | https://developers.google.com/maps/documentation/places/web-service/place-autocomplete | 078, 073 |
| Place types | https://developers.google.com/maps/documentation/places/web-service/place-types | 075, 073 |
| Data fields (field masks) | https://developers.google.com/maps/documentation/places/web-service/data-fields | 073, 067 |
| Maps Links (`googleMapsLinks`) | https://developers.google.com/maps/documentation/places/web-service/maps-links | 067 |
| Geocoding API | https://developers.google.com/maps/documentation/geocoding/overview | 079 |
| Maps optimization guide | https://developers.google.com/maps/optimization | 080, 074 |
| `.claude/skills/mde-maps/references/google-offline/` | local mirrors (tertiary) | 073, 080 |
| Map IDs overview | https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over | 068 |
| API Security Best Practices | https://developers.google.com/maps/api-security-best-practices | 068, 071, 080 |
| Gemini Maps Grounding | https://ai.google.dev/gemini-api/docs/maps-grounding | 049 |
| Contextual View (pre-GA) | https://developers.google.com/maps/documentation/javascript/maps-contextual-view | 070 |
| Dynamic Maps | https://mapsplatform.google.com/maps-products/dynamic-maps/ | 068 |
| `github/grounding-lite-mcp-sample-app` | local: `/home/sk/mde/github/grounding-lite-mcp-sample-app` | 049 |
| `@googlemaps/extended-component-library` | install for Phase 2 | 048 |
| mde-maps skill | `.claude/skills/mde-maps/SKILL.md` | all maps tasks |
| mastra skill | `.claude/skills/mastra/SKILL.md` | all mastra tasks |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-13 | §1.1 DB naming (`tourist_destinations`); Phase 2 rewritten to **066 → 068 → 067 → 048**; architecture + services table wording; task files live under `tasks/mastra/tasks/`. |
| 2026-05-13 | **v2.1:** §3.2 feature matrix; §3.3 use cases; §4.2–4.3 Places implementation layer **2A–2E**; Text Search / Place Photos / Autocomplete rows corrected; §7.1 `tourist_destinations`; **PLACES-002–081**; Phase 2 order **073 → … → 074 → 048**; `tasks/maps/places-api-new-audit.md`; **048** `depends_on` adds **073**, **074**. |

## Correctness Score

| Area | Score | Notes |
| --- | --- | --- |
| Architecture Alignment | 78/100 | Heuristic from path + `CLAUDE.md` boundaries — **Unverified** manual architecture review. |
| Dependency Accuracy | 70/100 | Parsed YAML `depends_on` vs `tasks/mastra/tasks/000-index.md` — **Unverified** full graph walk. |
| Official Docs Compliance | 55/100 | Weighted on `verified_docs` presence — MCP doc checks **Unverified** unless run. |
| Production Readiness | 56/100 | From YAML `status` + task type — evidence-based re-score in PR. |
| Testing Coverage | 48/100 | From automation presence inferred only — **Unverified** line/branch coverage. |

### Overall

62/100 — Incomplete or high-risk until migrations, RLS, and automated tests land.

## Testing Strategy

### Verification Commands

```bash
npm run verify:mastra
npm run floor
```

**Unverified:** Commands assume repo root `/home/sk/mde` per `package.json` scripts — re-run locally after edits.

### Task-Specific Tests

* **Unit:** Align with existing Vitest under `src/` or `my-mastra-app/` for code this task touches — **Unverified** file list until scoped in implementation.
* **Integration:** Prefer Supabase local + `supabase` CLI patterns from `.claude/skills/mde-supabase/SKILL.md` — **Unverified** per environment.
* **Edge Function:** If this task names `supabase/functions/*`, add `npm run verify:edge` and Deno checks from `supabase-edge-functions` skill — else N/A.
* **Realtime:** If task touches channels/presence, add concurrent subscriber tests — else N/A.
* **Maps/Gemini:** Use `.claude/skills/mde-maps/SKILL.md` + MCP **user-google-maps-code-assist** / **user-gemini-api-docs-mcp** for field masks, attribution, Map ID, quotas — **Unverified** per session.
* **RLS:** If task adds tables, require RLS policies + negative tests per `.claude/rules/supabase-rls-policies.md` — **Unverified** until migrations exist.
* **E2E:** Playwright config exists; suite may be empty — treat as **Unverified** unless task cites a spec path.
* **Maps hardening:** Places API (New) **field mask** checklist, **Grounding Lite attribution** UI checks, **Map ID** (`VITE_GOOGLE_MAPS_MAP_ID` / AdvancedMarker) verification, **quota/cost** logging — **Unverified** until implemented.

### Success Criteria

* [ ] All **Acceptance criteria** in this file are satisfied.
* [ ] `npm run verify:mastra` passes after changes touching `tasks/mastra/`, `my-mastra-app/`, `src/`, or `supabase/`.
* [ ] `npm run floor` passes before merge when shipped surfaces change (`CLAUDE.md`).
* [ ] Any **§ Verification** commands already in this file pass unchanged (or are updated in the same PR).

### Failure Risks

* Drift between task YAML `status` and code reality (see `scripts/verify-task-status-drift.mjs`).
* Missing RLS or service-role misuse on new tables.
* Secrets in Vite bundle or logged payloads (see **MASTRA-024**).

### Official references (MCP + repo)

* **Mastra:** MCP `user-mastra` (`searchMastraDocs`, `mastraDocs`) + `.claude/skills/mastra/SKILL.md` — **Unverified** unless invoked for this change.
* **Supabase:** MCP `user-supabase` + `.claude/skills/mde-supabase/SKILL.md` — **Unverified** per session.
* **Maps / Places / Grounding:** `.claude/skills/mde-maps/SKILL.md` + MCP `user-google-maps-code-assist` — **Unverified** per session.
* **Gemini API:** MCP `user-gemini-api-docs-mcp` + `.claude/skills/gemini/SKILL.md` — **Unverified** per session.
