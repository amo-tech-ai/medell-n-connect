---
title: Core MVP Event Discovery AI — Medellín build plan
version: 1.1
date: 2026-05-27
status: draft
audience: Sofía, Patricia, Roberto (host path separate)
app: /home/sk/mdeai/mdeapp
related:
  - ../../../tasks/events/docs/41-event-links.md
  - ../../../tasks/events/EVP-018-mvp-event-web-discovery-task-pack.md
  - ../../../mdeapp/src/lib/events/trusted-event-sources.ts
  - 01-event-discovery-repos.md
  - 02-event-discovery.md
  - 05-event-discovery.md
  - 06-OpenClaw-for-event-discovery.md
  - 06a-openclaw-events-discovery.md
  - 07-openclaw-trip-planning.md
  - 07-review.md
  - ../../../tasks/events/docs/event-discovery-skill-routing.md
openclaw_refs:
  - https://github.com/yhyatt/ClawEvents
  - https://clawhub.ai/yhyatt/clawevents
personas: Camila (discover), Tourist, Roberto (host — out of scope for discovery ingest)
---

# Core MVP Event Discovery AI — Medellín

> **One sentence:** Camila asks “what’s on this weekend?” — the system shows **real** events from **scraped + approved Supabase rows**, enriched with **Google Places pins**, ranked by **rules + light AI**, never invented by Gemini.

---

## 0. Where mdeai is today (do not re-plan this)

| Layer | Shipped? | What it does |
|-------|----------|--------------|
| `public.events` + `search-events` | ✅ | SQL search; cards + map pins on `/` |
| Local clarify + Music fast path | ✅ | No agent turn for generic “list events” |
| `trusted-event-sources.ts` | ✅ | URLs in **prompt only** — not crawled |
| Web citations (PR #4) | 🟡 | “From the web” when grounding runs — not source crawl |
| Roberto `/host/event/new` | ✅ | Host-created events — **different pipeline** |
| Stripe ticket checkout | ✅ | Andrés path — link `ticket_url` for discovery MVP |

**Gap this plan closes:** daily ingest → normalize → dedupe → Places → rank → same cards Camila already sees.

---

## 1. Executive Summary

**Best strategy for mdeai:** Treat event discovery as a **data product with an AI shell**, not an AI product that guesses events.

1. **Ingest** — Scrape or API-pull 3–5 Medellín sources on a schedule (Eventbrite CO, RA.co, one official calendar). Store raw JSON in Supabase.
2. **Normalize** — Map to one `events` shape (title, `starts_at` Bogotá TZ, venue, `source_url`, category).
3. **Dedupe** — Fuzzy match title + date + venue; never show duplicates to Camila.
4. **Enrich** — Google Places New (`place_id`, `maps_url`, lat/lng) for map pins; optional Grounding Lite only for **freshness blurbs**, not as primary inventory.
5. **Rank** — SQL filters first (date, category, neighborhood); Gemini writes **one-line summaries** only on approved rows.
6. **Serve** — Existing `searchEventsTool` + fast path + CopilotKit cards + map pins.

**What not to do in MVP:** 20 agents, autonomous “browse the web” per chat turn, or Gemini inventing events (see [eventpulse-ai](https://github.com/Harjotsingh00/eventpulse-ai) anti-pattern).

**Revenue:** Discovery drives **ticket clicks** (commission) and **host onboarding** (Roberto publishes after seeing demand). Stripe internal checkout is **advanced**.

**OpenClaw / ClawEvents (Phase 2 worker):** Use [ClawEvents](https://github.com/yhyatt/ClawEvents) as the **reference fetcher engine** (parallel sources → filter → dedupe → rank → JSON). Run on the mdeai VPS as an **operator**, not as Camila’s chat brain — see [§17](#17-openclaw--clawevents-integration).

---

## 2. /100 Scorecard

| Dimension | Score | Notes |
|-----------|------:|-------|
| Strategy fit (data-first + chat) | **92** | Matches shipped CopilotKit + Mastra + Supabase |
| MVP feasibility (8–10 weeks phased) | **78** | 3 scrapers + dedupe is realistic; 15 sources is not |
| Technical risk | **65** | Scraping breakage, TZ, duplicates |
| Production readiness (with tests) | **70** | Needs `event_runs` audit + RLS on new tables |
| Revenue potential | **85** | Tickets + host SaaS; discovery is top of funnel |
| Medellín relevance | **90** | 41-event-links + tuboleta/latiquetera matter locally |
| AI usefulness | **75** | AI for summarize/rank/explain — not for invent |
| Maps usefulness | **88** | Pins already work; Places enrichment is core |
| Scraping complexity | **60** | RA/Eventbrite/IG differ; start with 3 |
| Long-term moat | **80** | Freshness + neighborhood trust + host graph |

**Overall MVP recommendation:** **GO** — build ingest pipeline before more agent prompts.

---

## 3. Top 10 GitHub Repos Table

| # | Name | URL | Score | What it does | Best feature to copy | Risk / red flag | How mdeai uses it |
|---|------|-----|------:|--------------|---------------------|-----------------|-------------------|
| 1 | discovery-event-platform | [datorresb/discovery-event-platform](https://github.com/datorresb/discovery-event-platform) | **92** | Scrape Eventbrite + AllEvents + open data; dedupe; AI city scrapers | **Pipeline:** raw → dedupe → rank → API | Demo repo; LLM-generated scrapers fragile | **Template** for `scrapeEventsWorkflow` + job tables |
| 2 | **ClawEvents** | [yhyatt/ClawEvents](https://github.com/yhyatt/ClawEvents) · [ClawHub skill](https://clawhub.ai/yhyatt/clawevents) | **94** | Multi-city **fetcher engine**: parallel API/scrape → filter (type/age/time/free) → dedupe → rank → CLI/JSON | **`BaseFetcher` + `city_registry`** — add `medellin` declaratively; Bucharest already has **RA GraphQL + Eventbrite** | No Medellín yet; ClawHub skills need **audit**; not Supabase-native | **Fork/vend** fetchers into Mastra adapters **or** VPS cron runs `clawevents search --format json` → ingest API |
| 3 | local-event-discovery-chatbot | [VascoAmaral9/local-event-discovery-chatbot](https://github.com/VascoAmaral9/local-event-discovery-chatbot) | **90** | Eventbrite scrape → SQLite → FastAPI agent | **ETL + agent tools** over DB | Lisbon-focused; OpenAI not Gemini | Copy **scraper layout** + “agent only queries DB” |
| 4 | automated-event-tracker | [Balick-ai/automated-event-tracker](https://github.com/Balick-ai/automated-event-tracker) | **86** | Live music discovery + Google Calendar sync | Music-vertical focus + calendar export | Not Medellín; small codebase | UX pattern for **music/nightlife** category |
| 5 | eventfinder | [commune-ai/eventfinder](https://github.com/commune-ai/eventfinder) | **85** | World events + Mapbox map search | **Map-first discovery** UI | Python backend; not Medellín | Pin clustering + viewport filter ideas for map panel |
| 6 | events-mcp | [himanshusaleria/events-mcp](https://github.com/himanshusaleria/events-mcp) | **84** | MCP `search_events` over cached feed | **Structured agent tool** boundary | Cities = BLR/SF not Medellín | Pattern for future **`mde-events-mcp`** over Supabase (not hiddenevents feed) |
| 7 | iEventer | [mikeylim/iEventer](https://github.com/mikeylim/iEventer) | **82** | Gemini + Eventbrite/Luma/Ticketmaster | Multi-aggregator intent | Likely thin maintenance | Source list alignment with 41-event-links |
| 8 | EventHive | [sandeep-kumar-21/EventHive](https://github.com/sandeep-kumar-21/EventHive) | **78** | MERN event platform + AI marketing | Host + discover UX | Generic SaaS; not scrape-first | **Later** — organizer features, not MVP ingest |
| 9 | event-map | [andrew-miroiu/event-map](https://github.com/andrew-miroiu/event-map) | **80** | Map-centric event UI | Spatial browse | Unknown data source | Map interaction patterns only |
| 10 | Tech-Events-Scraper | [Aarav261/Tech-Events-Scraper](https://github.com/Aarav261/Tech-Events-Scraper) | **76** | Tech event scraping utilities | Category-specific scrapers | Narrow vertical | **Meetup/Luma** tech lane scraper reference |
| — | eventpulse-ai | [Harjotsingh00/eventpulse-ai](https://github.com/Harjotsingh00/eventpulse-ai) | **45** | Gemini chat + Calendar; **no real ingest** | Calendar intent JSON in reply | **Hallucinated events** | **Anti-pattern** — do not copy |

**Honorable mentions (lower fit for MVP core):**

| Repo | URL | Score | Note |
|------|-----|------:|------|
| GlobeVista AI | [palakuriyuvaraj48-star/GlobeVista-AI-...](https://github.com/palakuriyuvaraj48-star/GlobeVista-AI-Intelligent-Travel-Discovery-Smart-Trip-Planning-Platform) | 55 | Travel planner; static `destinations.js` — not event ingest |
| Event-Voyage | [noboKumar/Event-Voyage](https://github.com/noboKumar/Event-Voyage) | 50 | Firebase demo; manual event CRUD |
| event-iq | [0xfarben/event-iq](https://github.com/0xfarben/event-iq) | 58 | Tech-event recommendations; not Medellín scrape |
| GeoDiscovery-AI | [shivanitammisetti/GeoDiscovery-AI](https://github.com/shivanitammisetti/GeoDiscovery-AI) | 52 | NASA EONET — wrong domain |

**Automation reference (not a repo):** [n8n workflow 5222 — Bright Data event discovery](https://n8n.io/workflows/5222-automated-event-discovery-with-bright-data-and-n8n/) — use **ideas** for schedule + enrich steps; implement in Mastra + Supabase cron first.

---

## 4. Top 10 Core Features Table

| # | Feature | Description | Medellín example | Stack | Priority | MVP / Advanced |
|---|---------|-------------|------------------|-------|----------|----------------|
| 1 | Daily event ingest | Cron pulls new events from 3 sources | Sunday job picks up new RA listings | Firecrawl/Playwright + Supabase Edge/cron | P0 | **MVP** |
| 2 | Normalize + dedupe | One schema; fuzzy dedupe | “Boiler Room” on Eventbrite + IG → one card | SQL + thefuzz logic in TS | P0 | **MVP** |
| 3 | Places venue enrich | `place_id`, lat/lng, `maps_url` | “Parque Norte” gets pin in Envigado | Places API New + field mask | P0 | **MVP** |
| 4 | SQL event search | Category, date window, neighborhood | Music + this weekend + Poblado | Existing `search-events` | P0 | **MVP** (exists) |
| 5 | Chat cards + map pins | Same UI as today | Camila: Music chip → 10 cards | CopilotKit + map | P0 | **MVP** (exists) |
| 6 | Source URL on every card | Trust + compliance | “Source: tuboleta.com” link | `source_url` column | P0 | **MVP** |
| 7 | AI one-line blurb | Gemini summarizes **existing** row | “Outdoor reggaeton rooftop, 18+” | Gemini on approved row only | P1 | **MVP** |
| 8 | Human approval queue | Patricia approves scraped rows before `is_active` | Stale festival poster rejected | Admin `/admin/events/review` | P1 | **MVP** |
| 9 | Web freshness citations | Sidecar when SQL weak | “Verify on web” after agent turn | ADK + C-004 path | P2 | **MVP** (partial) |
| 10 | pgvector “similar events” | Semantic neighbors | “More like this salsa night” | pgvector + embeddings | P3 | **Advanced** |

---

## 5. Top 10 Use Cases Table

| # | User | Query example | System response | Business value | Required data |
|---|------|---------------|-----------------|----------------|---------------|
| 1 | Camila | “What’s happening tonight near Laureles?” | 5 cards + pins filtered `tonight` + proximity | Engagement → ticket clicks | `starts_at`, lat/lng, category |
| 2 | Tourist | “Best techno events this weekend” | Ranked nightlife; map fit bounds | Commission on tickets | category=nightlife, date_window |
| 3 | Nomad | “Startup networking events in Medellín” | Meetup/Luma-sourced rows | Host B2B leads | source=meetup, tags |
| 4 | Family | “Family-friendly events this Sunday” | culture/festival; free filter | Broader MAU | tags, price=0 |
| 5 | Camila (rental) | “Events near this apartment” (Laureles) | Pins within 2 km of rental pin | Cross-sell rentals + events | geo + rentals map |
| 6 | Tourist | “Free events in centro” | SQL `price=0` + official sources | Trust / SEO | source tier official |
| 7 | Camila | “Is this event still on?” | Freshness: last_scraped + web citation | Reduces bad UX | `event_runs`, grounding |
| 8 | Roberto | (host) N/A discovery | Discovery separate from host wizard | Supply side | host `events` table |
| 9 | Andrés | “Buy tickets” on card | External `ticket_url` or Stripe sheet | Revenue | `ticket_url`, Stripe |
| 10 | Patricia | “What failed last night?” | `event_scrape_jobs` dashboard | Ops | audit tables |

---

## 6. Recommended Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│  DAILY (06:00 America/Bogota)                                      │
│  Supabase cron OR Vercel cron → Mastra scrapeEventsWorkflow      │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  SCRAPE (per source adapter)                                     │
│  Eventbrite CO · RA.co Medellín · medellin.travel calendar        │
│  → raw_events (jsonb payload, source_id, scraped_at)               │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  NORMALIZE → events_candidate                                      │
│  title, starts_at (Bogota), venue_text, category, ticket_url,      │
│  source_url, external_id                                         │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  DEDUPE (fuzzy title+date+venue) → merge or skip                   │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  ENRICH (enrichVenueWorkflow)                                    │
│  Places Text Search → place_id, lat, lng, maps_url               │
│  Optional: Gemini 1-line summary (approved rows only)            │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  QUALITY + HUMAN APPROVAL → public.events (is_active=false until)│
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  RUNTIME (existing)                                              │
│  searchEventsTool /api/events/search → CopilotKit cards + pins   │
│  Optional: searchWebGroundedEventsTool (freshness only)          │
└─────────────────────────────────────────────────────────────────┘

Optional worker branch (Phase 2 — see §17):

┌─────────────────────────────────────────────────────────────────┐
│  OpenClaw gateway (VPS) + ClawEvents / Apify plugin               │
│  clawevents search --city medellin --format json --days 7         │
│  → POST /api/internal/ingest/raw_events (scoped token)            │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
                    (joins normalize pipeline above)
```

### Core services

| Service | Role |
|---------|------|
| **Supabase** | Source of truth: `raw_events`, `events`, venues, jobs, embeddings (later) |
| **Mastra workflows** | Deterministic scrape, dedupe, enrich, rank steps |
| **Edge function or cron** | Trigger daily pipeline; no keys in Next.js client |
| **CopilotKit** | Camila UI only — never scrapes |
| **Google Places** | Venue geo + `maps_url` — field mask on every call |
| **ADK sidecar** | Optional freshness / citations — not inventory |
| **Gemini** | Summaries, tags, ranking explanations — input = DB rows only |
| **Stripe** | Ticket checkout for **hosted** events; discovery links out MVP |
| **OpenClaw + ClawEvents** (P2) | Scheduled fetcher runs, Patricia alerts, hard-source retries — **not** chat truth |

### Key APIs (existing + new)

| API | Purpose |
|-----|---------|
| `POST /api/events/search` | Fast path (keep) |
| `searchEventsTool` | Agent path (keep) |
| `POST /api/admin/events/scrape-run` | Manual trigger (new, service-role) |
| `GET /api/events/[id]/public` | Detail page (keep) |
| `POST /api/internal/ingest/raw_events` | ClawEvents / OpenClaw worker writes (new, scoped JWT) |

---

## 7. Supabase Schema Plan

> All new tables: **RLS on**; service-role for scrape jobs; public read only `events` where `is_active = true`.

### `event_sources`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| slug | text unique | `eventbrite_med`, `ra_co`, `medellin_travel` |
| name | text | |
| base_url | text | |
| tier | enum | official, ticketing, nightlife, … |
| trust_score | smallint | 0–100 |
| scrape_adapter | text | `eventbrite_jsonld`, `firecrawl`, … |
| is_enabled | boolean | |

### `raw_events`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| source_id | uuid FK | |
| external_id | text | source-native id |
| payload | jsonb | raw scrape |
| scraped_at | timestamptz | |
| scrape_job_id | uuid FK | |

### `events` (extend existing `public.events`)

| Field | Type | Notes |
|-------|------|-------|
| … existing … | | title, times, prices, images |
| source_id | uuid FK | nullable for Roberto-created |
| source_url | text | **required** for discovered |
| external_id | text | dedupe key |
| discovery_status | enum | candidate, approved, rejected |
| last_scraped_at | timestamptz | |
| place_id | text | Google |
| maps_url | text | |
| ai_summary | text | optional 1-liner |
| quality_score | numeric | 0–1 |

### `event_venues`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| name | text | |
| neighborhood | text | |
| place_id | text unique | |
| lat, lng | float | |
| maps_url | text | |

### `event_tags` / `event_event_tags`

| Field | Type | Notes |
|-------|------|-------|
| slug | text | `family-friendly`, `free`, `18+` |
| event_id | uuid | M2M |

### `event_embeddings` (advanced)

| Field | Type | Notes |
|-------|------|-------|
| event_id | uuid PK | |
| embedding | vector(768) | title+summary+tags |
| model | text | |

### `event_scrape_jobs` / `event_runs`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | |
| source_id | uuid | |
| status | enum | running, success, failed |
| rows_in, rows_new, rows_deduped | int | |
| error | text | |
| started_at, finished_at | timestamptz | |

### `event_tickets` (advanced — Stripe)

| Field | Type | Notes |
|-------|------|-------|
| event_id | uuid | |
| stripe_price_id | text | |
| ticket_url | text | external MVP |

---

## 8. Mastra Agent + Workflow Plan

**Principle:** 1 router agent, 4 workflows, 2 tools — no agent zoo.

### Agents

| Agent | Role | MVP? |
|-------|------|------|
| `conciergeAgent` | Routes to event search; clarify gate (exists) | ✅ |
| `eventRouterAgent` | **Optional later** — only if concierge overloads; else skip | ❌ MVP |

Use **concierge** for chat; **workflows** for batch jobs.

### Workflows

| Workflow | Steps | Trigger |
|----------|-------|---------|
| `scrapeEventsWorkflow` | per source adapter → `raw_events` | Daily cron |
| `normalizeEventsWorkflow` | raw → candidates | After scrape |
| `dedupeEventsWorkflow` | fuzzy merge | After normalize |
| `enrichVenueWorkflow` | Places lookup + lat/lng | After dedupe |
| `rankEventsWorkflow` | quality_score rules + optional Gemini | Before approval |
| `eventDiscoveryWorkflow` | orchestrates above end-to-end | Cron parent |

### Tools (runtime chat)

| Tool | Role | MVP? |
|------|------|------|
| `searchEventsTool` | Supabase SQL (exists) | ✅ |
| `searchWebGroundedEventsTool` | Freshness only (exists) | ✅ limited |
| `eventRecommendationTool` | **Advanced** — pgvector neighbors | ❌ |

### Working memory (exists)

`lastEventQuery`, `lastEventResults` — keep; add `discovery_provenance: 'supabase' | 'web'` later.

---

## 9. Scraping + Automation Plan

| Tool | MVP use | Why |
|------|---------|-----|
| **Firecrawl** | Eventbrite, medellin.travel, static calendars | JS render, markdown/JSON extract; fits `mde-firecrawl` skill |
| **Playwright** | RA.co, tough SPAs | When Firecrawl fails; run in Edge or GitHub Action |
| **Apify** | **Advanced** | Paid actors for Eventbrite at scale |
| **Bright Data + n8n** | **Advanced** | Reference [n8n 5222](https://n8n.io/workflows/5222-automated-event-discovery-with-bright-data-and-n8n/) — ops team |
| **Supabase pg_cron** | Trigger Edge `scrape-daily` | Simple, colocated with DB |
| **Vercel cron** | Call Mastra workflow HTTP | If workflows hosted on Vercel |
| **Trigger.dev** | **Advanced** | Durable retries, visual ops — Phase 2 |
| **ClawEvents (OpenClaw skill)** | **P2 worker** | Reuse [parallel fetcher + dedupe engine](https://github.com/yhyatt/ClawEvents); fork `medellin` in `city_registry` |
| **OpenClaw + Apify plugin** | **P2 ops** | Patricia “run ingest now”; failure alerts — see [06a](./06a-openclaw-events-discovery.md) |

**MVP pick:** **Firecrawl + 1 Playwright adapter** for RA; **Supabase cron** daily; logs in `event_scrape_jobs`.

**Phase 2 pick:** Port ClawEvents fetcher patterns (especially **RA GraphQL** + **Eventbrite API**) into Mastra **or** run `clawevents` on VPS and ingest JSON — do **not** block MVP on OpenClaw install.

**Rules:**

- Scrape in **Edge/service-role** only — never from CopilotKit route.
- Rate limit per source; respect robots.txt where possible.
- Store **raw** always — replay normalize when mapping changes.

---

## 10. Event Source Strategy

| Source | Trust | Difficulty | Categories | Scrape strategy | MVP priority |
|--------|------:|-----------|------------|-----------------|--------------|
| [medellin.travel calendar](https://www.medellin.travel/calendario-eventos/) | 95 | Medium | culture, festival | Firecrawl crawl | **P0** |
| [Eventbrite Medellín](https://www.eventbrite.com/d/colombia--medell%C3%ADn/events/) | 85 | Low | all | JSON-LD / Firecrawl | **P0** |
| [RA.co Medellín](https://ra.co/events/co/medellin) | 80 | High | nightlife, music | Playwright | **P0** |
| [Plaza Mayor](https://plazamayor.com.co/eventos-pm/) | 90 | Medium | culture, tech | Firecrawl | **P1** |
| [Tuboleta](https://www.tuboleta.com/) | 88 | Medium | music, sport | Firecrawl | **P1** |
| [La Tiquetera](https://latiquetera.com/events/search?search=medellin) | 85 | Medium | music | Firecrawl | **P1** |
| [Luma Medellín](https://luma.com/medellin) | 82 | Medium | tech, networking | Firecrawl/API | **P1** |
| [Meetup](https://www.meetup.com/find/?location=co--medellin) | 75 | Medium | tech | API/scrape | **P2** |
| [Songkick](https://www.songkick.com/es/metro-areas/28331-colombia-medellin) | 78 | Medium | music | Scrape | **P2** |
| [Fever](https://feverup.com/en/medellin) | 80 | Medium | culture | Firecrawl | **P2** |
| Instagram venues | 60 | High | nightlife | **Advanced** — brittle | **P3** |

Aligns with [`41-event-links.md`](../../../tasks/events/docs/41-event-links.md) and [`trusted-event-sources.ts`](../../../mdeapp/src/lib/events/trusted-event-sources.ts).

---

## 11. Google Maps / ADK / Grounding Strategy

### Places (MVP — inventory geo)

| Step | Action |
|------|--------|
| 1 | Venue string from scrape → Places Text Search (Medellín bias) |
| 2 | Store `place_id`, `location`, `googleMapsUri` / `placeUri` |
| 3 | Parent `<Map mapId=…>` + `AdvancedMarker` (existing rule) |
| 4 | Field mask on every Places call (cost) |

**Camila sees:** pin at real venue, not geocoded guess.

### Grounding Lite + ADK (MVP — freshness only)

| Use | Do not use |
|-----|------------|
| “this weekend verify on web” after SQL | Primary event list |
| Citation chips (C-004) | Replace tuboleta scrape |

Sidecar: existing `/api/grounding/event-web` + `searchWebGroundedEventsTool`.

Reference: [Google Maps agentic grounding blog](https://mapsplatform.google.com/resources/blog/powering-the-next-era-of-agentic-experiences-announcing-new-grounding-capabilities/).

### Nearby cafés/restaurants (advanced)

After event pin → `searchRestaurantsTool` near lat/lng — W6 concierge, not discovery MVP.

---

## 12. pgvector Strategy

### Embed (later)

Concatenate: `title | ai_summary | category | neighborhood | tags | venue_name`

### MVP

- **SQL only:** `category`, `date_window`, `neighborhood`, `price`, `is_active`
- **Full-text:** Postgres `tsvector` on title+summary (cheap win)

### Advanced

- Similar events: `embedding <=> query`
- “More like this vibe” for Camila

---

## 13. Stripe / Ticketing Strategy

| Phase | Behavior |
|-------|----------|
| **MVP discovery** | `ticket_url` → Tuboleta / Eventbrite / host Stripe checkout |
| **MVP hosted** | Existing Stripe sheet for Roberto’s events (Andrés) |
| **Advanced** | Internal checkout + `event_orders` + webhooks |
| **Advanced** | [Google Wallet event tickets](https://developers.google.com/wallet/tickets/events) — save pass |

**Rule:** Discovery must not require Stripe to **list** an event.

---

## 14. Task Breakdown

### Core MVP Tasks

| Task | Description | Files / area | Acceptance criteria | Priority |
|------|-------------|--------------|---------------------|----------|
| EVD-01 Schema | `event_sources`, `raw_events`, extend `events`, jobs | `supabase/migrations/` | RLS on; migration applies | P0 |
| EVD-02 Seed sources | Insert rows from trusted registry | seed SQL | 5 sources enabled | P0 |
| EVD-03 Eventbrite adapter | Scrape → raw_events | `mdeapp/src/mastra/workflows/scrape/` | ≥10 real events in raw table | P0 |
| EVD-04 Normalize | raw → candidate shape | workflow step | Valid Bogota `starts_at` | P0 |
| EVD-05 Dedupe | fuzzy merge | workflow + tests | 0 duplicate titles same night | P0 |
| EVD-06 Places enrich | place_id + lat/lng | `enrich-venue` | ≥80% pins geocode | P0 |
| EVD-07 Approval UI | Patricia queue | `/admin/events/review` | approve → `is_active=true` | P1 |
| EVD-08 Daily cron | 06:00 Bogota | Edge or Vercel cron | job row success 3 days | P0 |
| EVD-09 Wire search | Approved rows in `search-events` | existing tool | Music chip still &lt;5s | P0 |
| EVD-10 Tests | dedupe, TZ, normalize | vitest | CI green | P0 |
| EVD-11 AI summary | Gemini 1-liner on approved | agent step | no invent; summary cites fields | P1 |
| EVD-12 Metrics | `event_runs` dashboard | admin | Patricia sees failures | P1 |

**Task execution:** [event-discovery-skill-routing.md](../../../tasks/events/docs/event-discovery-skill-routing.md) maps EVD-* → EVP-* + skills. Parent pack: [EVP-018-mvp](../../../tasks/events/EVP-018-mvp-event-web-discovery-task-pack.md) — **do not duplicate** specs in new files.

### Advanced Tasks

| Task | Description | Priority |
|------|-------------|----------|
| EVD-A1 pgvector similarity | Semantic “more like this” | P3 |
| EVD-A2 WhatsApp alerts | “Events tonight in Poblado” | P3 |
| EVD-A3 OpenClaw + ClawEvents worker | VPS cron + `clawevents` JSON ingest; OC-EVD-01..10 | P2 |
| EVD-A3b Fork ClawEvents `medellin` | `MedellinTravelFetcher`, `RAFetcher`, `EventbriteFetcher`, `TuboletaFetcher` | P2 |
| EVD-A3c WhatsApp ops bot | Patricia approval + “run scraper now” | P3 |
| EVD-A4 Sponsor matching | B2B leads near events | P4 |
| EVD-A5 Trend detection | Rising categories by barrio | P3 |
| EVD-A6 10+ sources | Full 41-event-links coverage | P2 |
| EVD-A7 Internal Stripe + Wallet | Full Andrés loop | P2 |

---

## 15. Red Flags / Failure Points

| Red flag | Mitigation |
|----------|------------|
| **Hallucinated events** | Agent may only call `searchEventsTool`; never “list from memory” (see eventpulse-ai) |
| **Duplicate events** | `external_id` + fuzzy dedupe; show one card |
| **Stale events** | `last_scraped_at`; auto `is_active=false` if past end |
| **Scraping blocked** | Rotate adapters; manual upload fallback |
| **Missing lat/lng** | Skip pin or neighborhood centroid with badge “approximate” |
| **Bad timezone** | **America/Bogota** in `search-events` (already) — same in ingest |
| **No source_url** | Reject candidate in normalize step |
| **Over-agents** | Workflows batch; chat uses 2 tools max |
| **No tests** | Dedupe + TZ unit tests required for Done |
| **Scrape in chat path** | Forbidden — cron only |
| **Service role in Next** | Scrape Edge only |
| **Unaudited ClawHub skills** | Allowlist only; pin `clawevents` version; no arbitrary `npx` skills on prod VPS |
| **OpenClaw publishes events** | Worker → `raw_events` only; Patricia approves |

---

## 17. OpenClaw + ClawEvents Integration

> Sibling docs: [06-OpenClaw-for-event-discovery.md](./06-OpenClaw-for-event-discovery.md) (feature matrix), [06a-openclaw-events-discovery.md](./06a-openclaw-events-discovery.md) (verdict + OC-EVD tasks), [07-review.md](./07-review.md) (plan grade 88/100). Trip-planning cron skills in [07-openclaw-trip-planning.md](./07-openclaw-trip-planning.md) are **out of scope** for discovery MVP (itinerary/packing = Phase 3).

### Role split (non-negotiable)

| Layer | Owner | Camila sees |
|-------|--------|-------------|
| Truth | **Supabase** `events` | Cards after `is_active=true` |
| Orchestration | **Mastra** workflows | Fast path + `search-events` |
| UI | **CopilotKit** | Chat + map pins |
| Geo | **Google Places** | Pins, neighborhoods |
| Summaries | **Gemini** | One-liners on approved rows |
| **Collect / operate** | **OpenClaw + ClawEvents** | Nothing directly — ops only |

Verdict from [06a](./06a-openclaw-events-discovery.md): OpenClaw fit **86/100** as automation worker; **92/100** with approval gates.

### What ClawEvents gives mdeai

[ClawEvents](https://github.com/yhyatt/ClawEvents) ([ClawHub: clawevents](https://clawhub.ai/yhyatt/clawevents)) is the closest **production-shaped** open-source match to our ingest layer:

```text
ClawEventsEngine
├── city_registry.py          # declarative per-city fetcher list
├── Parallel fetchers         # ThreadPoolExecutor
│   ├── API     Eventbrite · Ticketmaster · RA GraphQL · city open data
│   ├── Scrape  iaBilet · Songkick · medellin.travel (to add)
│   └── Browser Playwright opt-in (Fever, editorial)
├── Filter   type · age · time-of-day · date · free
├── Dedup    title + start time across sources
└── Rank     chronological (no-time last)
```

**Copy for Medellín MVP adapters (TypeScript in Mastra):**

| ClawEvents pattern | mdeai equivalent |
|--------------------|------------------|
| `EventbriteFetcher` + `EVENTBRITE_TOKEN` | EVD-03 Eventbrite adapter |
| `RAFetcher` (GraphQL, area id per city) | EVD-03b RA.co — verify Medellín area id before prod |
| `*OpenDataFetcher` / municipality API | medellin.travel / official calendar |
| `iaBilet.ro` HTML scrape | Tuboleta / La Tiquetera pattern |
| `--type nightlife --time evening --free` | SQL filters + chips on `/` |
| `--format json` | Ingest payload to `raw_events.payload` |

**CLI example (operator / cron on VPS):**

```bash
# After fork adds medellin:
python3 -m clawevents search --city medellin --type music --days 7 --format json --limit 50
openclaw skills install clawevents   # audit SKILL.md first
```

### Medellín city fork (proposed `city_registry` entry)

```python
# Target: clawevents/city_registry.py (fork or upstream PR)
"medellin": CityConfig(
    name="Medellín",
    slug="medellin",
    aliases=["medellin", "mdel", "medellín"],
    country="CO",
    timezone="America/Bogota",
    event_fetchers=[
        "eventbrite",      # EVENTBRITE_TOKEN — free platform API
        "ra",              # GraphQL; confirm area id for co/medellin
        "medellin_travel", # Firecrawl/HTML fetcher (new)
        "tuboleta",        # scrape (new; mirror iaBilet fetcher)
    ],
    reservation_platforms=[],  # defer; concierge restaurants = W6
)
```

**Fetcher priority for fork:**

| Fetcher | Source | MVP |
|---------|--------|-----|
| `eventbrite` | [Eventbrite Medellín](https://www.eventbrite.com/d/colombia--medell%C3%ADn/events/) | P0 — reuse upstream |
| `ra` | [RA.co Medellín](https://ra.co/events/co/medellin) | P0 — reuse Bucharest RA fetcher |
| `medellin_travel` | [medellin.travel calendar](https://www.medellin.travel/calendario-eventos/) | P0 — new `BaseFetcher` |
| `luma` | [luma.com/medellin](https://luma.com/medellin) | P1 |
| `tuboleta` | tuboleta.com | P1 |
| `meetup` | Meetup CO | P2 |

Ticketmaster Discovery API is **low priority** for Medellín (ClawEvents uses it for BCN/NYC; limited CO coverage).

### Two integration paths

| Path | When | Flow |
|------|------|------|
| **A — Port fetchers to Mastra (recommended MVP)** | EVD-03..05 | Reimplement ClawEvents logic in TS; same dedupe rules; no VPS dependency |
| **B — ClawEvents on VPS (recommended P2)** | EVD-A3 | Cron → `clawevents search` → `POST /api/internal/ingest/raw_events` → Mastra normalize |

Path A ships Camila faster; Path B helps Patricia ops (WhatsApp “run ingest”, failure alerts) per [06a](./06a-openclaw-events-discovery.md).

### OpenClaw ops workflow (from 06a)

```text
06:00 America/Bogota — Supabase cron starts eventDiscoveryWorkflow
  → (P2) OpenClaw runs allowlisted clawevents / Apify jobs
  → raw_events
  → normalize + dedupe (Mastra)
  → Places enrich
  → Gemini summary/tags
  → WhatsApp Patricia: “N events need approval”
  → approved → Camila cards + pins
```

**Operator commands (Patricia, not Camila):**

| Command | Result |
|---------|--------|
| Run Medellín event ingest now | All enabled fetchers |
| Check failed event sources | `event_scrape_jobs` failures |
| Show new events needing approval | Review queue deep link |
| Verify this event link | Browser worker 404 check |

### OC-EVD tasks (OpenClaw layer)

| Task | Description | Priority |
|------|-------------|----------|
| OC-EVD-01 | Sandbox OpenClaw gateway on Hostinger VPS | P0 (P2 phase) |
| OC-EVD-02 | Apify OpenClaw plugin (optional alongside ClawEvents) | P1 |
| OC-EVD-03 | Allowlist skills only (`clawevents` pinned) | P0 |
| OC-EVD-04 | Scoped ingest API → `raw_events` | P0 |
| OC-EVD-05 | Daily ingest cron invoking ClawEvents or Mastra | P0 |
| OC-EVD-06 | Failure alert → Patricia (WhatsApp/Telegram) | P1 |
| OC-EVD-07 | Manual “run scraper now” | P1 |
| OC-EVD-08 | Source freshness report | P1 |
| OC-EVD-09 | Ticket URL verifier | P1 |
| OC-EVD-10 | Audit log every worker action | P0 |
| CLAW-01 | Fork ClawEvents; add `medellin` + `MedellinTravelFetcher` | P2 |
| CLAW-02 | PR upstream or vend in `github/clawevents-medellin` | P2 |
| CLAW-03 | Map ClawEvents `Event` model → `raw_events.payload` schema | P2 |

### Security (ClawHub + OpenClaw)

| Rule | Why |
|------|-----|
| Audit [clawevents SKILL.md](https://clawhub.ai/yhyatt/clawevents) before install | ClawHub ecosystem has had malicious skills |
| No service-role key in OpenClaw env | Use scoped ingest JWT |
| OpenClaw never sets `is_active=true` | Human approval |
| Pin dependency versions | Reproducible scrapes |
| Rate-limit per source | Avoid bans on RA/Eventbrite |

### ClawEvents vs events-mcp

| | ClawEvents | events-mcp |
|---|------------|------------|
| Data | Live fetch per run | Cached hiddenevents.online feed |
| Cities | TLV, BCN, NYC, Bucharest (+ fork MED) | 9 global tech hubs |
| Fit mdeai | **Ingest worker** | Inspiration for **read-only MCP** over Supabase later |

Do not depend on events-mcp for Medellín inventory — build **mde** ingest.

### Scorecard addendum (OpenClaw path)

| Dimension | Score | Note |
|-----------|------:|------|
| ClawEvents code reuse | **94** | Best open fetcher architecture found |
| OpenClaw ops fit | **86** | Strong for cron/alerts; weak for product brain |
| Medellín fork effort | **72** | 3–4 new fetchers + RA area id verification |
| Security overhead | **68** | Requires allowlist + audit discipline |

---

## 16. Final Recommendation — Build Order

| Step | What | Verify |
|------|------|--------|
| 1 | **Normalized schema** + RLS | migration + advisors clean |
| 2 | **3 source scrapers** (Eventbrite, RA, medellin.travel) | `raw_events` count &gt; 0 |
| 3 | **Dedupe** | duplicate rate &lt; 5% in sample |
| 4 | **Places enrichment** | map pins align with venue |
| 5 | **Approval queue** | Patricia approves 10 test rows |
| 6 | **search-events** reads approved only | Camila Music chip 10 cards |
| 7 | **CopilotKit cards** (no change) | E2E clarify → Music |
| 8 | **Map pins** (no change) | 10 pins on map |
| 9 | **AI summaries** | blurbs match source fields |
| 10 | **Daily automation** | 3 consecutive cron successes |
| 11 | **pgvector** | defer until SQL path boring |
| 12 | **ClawEvents fork + OpenClaw worker** (optional) | OC-EVD + CLAW tasks; JSON ingest ≥50 rows/run |

**Merge gates:** PR #4 (citations) → then EVD-01..10 before claiming “discovery MVP done.” OpenClaw is **not** a merge gate for MVP.

**Recommended split:** EVD-01..10 on **Mastra + Firecrawl** first; parallel track **CLAW-01..03** when Patricia needs ops automation ([06a](./06a-openclaw-events-discovery.md)).

**Do not mark Done without:** scrape job log + SQL event count + browser smoke + `npm run floor`.

---

## Appendix A — Persona one-liners

| Persona | Discovery need |
|---------|----------------|
| **Camila** | “Music this weekend” → fast, real, map + tickets |
| **Tourist** | Trust + source links + English summary |
| **Roberto** | Uses host wizard — **not** scrape pipeline |
| **Patricia** | Approves scraped rows; monitors failed jobs |
| **Sofía** | `npm run floor` + scrape integration tests |

---

## Appendix B — Related links

- [Google Wallet — event tickets](https://developers.google.com/wallet/tickets/events)
- [Google Event Discovery (TicketSpice help)](https://help.ticketspice.com/en/articles/8949710-use-google-event-discovery-to-increase-visibility-of-your-event)
- [n8n — Bright Data event discovery](https://n8n.io/workflows/5222-automated-event-discovery-with-bright-data-and-n8n/)
- [ClawEvents — GitHub](https://github.com/yhyatt/ClawEvents)
- [ClawEvents — ClawHub skill](https://clawhub.ai/yhyatt/clawevents)
- Prior audit: [02-event-discovery.md](./02-event-discovery.md)

## Appendix C — Sibling plan docs

| Doc | Purpose |
|-----|---------|
| [05-event-discovery.md](./05-event-discovery.md) | Alternate full 16-section draft (Apify-first automation) |
| [06-OpenClaw-for-event-discovery.md](./06-OpenClaw-for-event-discovery.md) | OpenClaw feature/use-case matrix |
| [06a-openclaw-events-discovery.md](./06a-openclaw-events-discovery.md) | **Authoritative** OpenClaw verdict + OC-EVD tasks |
| [07-openclaw-trip-planning.md](./07-openclaw-trip-planning.md) | Travel cron skills (itinerary/packing) — Phase 3+ |
| [07-review.md](./07-review.md) | Plan review grade 88/100 + hardening notes |
| [11-openclaw-event-discovery.md](./11-openclaw-event-discovery.md) | **Dedicated** OpenClaw + ClawEvents automation plan (reference links, OC-EVD, top 5 use cases) |

---

*Plan author: architecture pass 2026-05-27 (v1.1 + ClawEvents/OpenClaw). Align tasks in `tasks/events/EVP-*` before implementation; no status flips without verifier evidence.*
