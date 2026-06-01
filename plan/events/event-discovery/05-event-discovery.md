Below is a practical **CORE MVP build plan** for Medellín event discovery that keeps the system small, deterministic, and production-oriented. The right sequence is: **scrape real events, normalize them, dedupe them, enrich venues with Google Maps, rank with simple AI, and render them as chat cards plus map pins**.mapsplatform.google+5

## 1. Executive Summary

Build a **daily event intelligence pipeline** instead of a generic event app. The MVP should ingest a small set of trusted Medellín sources, normalize events into one schema, enrich venues with Google Maps/Places, summarize and tag them with Gemini, and expose them through CopilotKit cards and map pins.cloud.google+6

The best strategy is to use **deterministic scraping + AI enrichment**, not autonomous browsing. OpenClaw, Playwright, Firecrawl, or n8n can collect source data; Supabase owns the data; Mastra owns the workflows; Google Maps owns geo truth; Gemini only summarizes, tags, and explains; Stripe only handles payment handoff later.mapsplatform.google+4

## 2. /100 Scorecard

|Dimension|Score|Why|
|---|---|---|
|Strategy fit|98|Matches mdeai’s chat + map + local intelligence model.|
|MVP feasibility|92|Can launch with 3–5 sources and simple schema.|
|Technical risk|72|Main risks are scraping fragility and event freshness.|
|Production readiness|86|Strong if you keep scope tight and add tests.|
|Revenue potential|84|Event traffic can drive affiliate, sponsorship, and ticket handoff.|
|Medellín relevance|99|Medellín has clear local, nightlife, startup, and cultural event demand. eventbrite+3|
|AI usefulness|88|AI is valuable for summarization, tags, and ranking, not for truth creation.|
|Maps usefulness|96|Events are inherently spatial and neighborhood-driven. mapsplatform.google+2|
|Scraping complexity|74|Social and ticket sites can be blocked or inconsistent.|
|Long-term moat|91|Fresh Medellín event graph + trust scoring compounds over time.|

## 3. Top 10 GitHub Repos

|Name|Full URL|Score /100|What it does|Best feature to copy|Risk / red flag|How mdeai should use it|
|---|---|---|---|---|---|---|
|local-event-discovery-chatbot|[https://github.com/VascoAmaral9/local-event-discovery-chatbot](https://github.com/VascoAmaral9/local-event-discovery-chatbot)|94|Chatbot for local event discovery.|Conversational search over nearby events.|Likely demo-level maturity.|Use as the primary UX pattern reference.|
|discovery-event-platform|[https://github.com/datorresb/discovery-event-platform](https://github.com/datorresb/discovery-event-platform)|90|Event discovery platform.|Discovery flow and event surfacing.|May be generic.|Borrow listing/card structure ideas.|
|EventHive|[https://github.com/sandeep-kumar-21/EventHive](https://github.com/sandeep-kumar-21/EventHive)|88|Event platform with discovery/management.|Event organization UX.|Could be organizer-heavy, not discovery-heavy.|Use for event metadata patterns.|
|events-mcp|[https://github.com/himanshusaleria/events-mcp](https://github.com/himanshusaleria/events-mcp)|93|MCP interface for event tools.|Structured tool access for agents.|Dependency on tool schema quality.|Use for agent-safe event querying.|
|Tech-Events-Scraper|[https://github.com/Aarav261/Tech-Events-Scraper](https://github.com/Aarav261/Tech-Events-Scraper)|87|Scrapes tech events.|Scrape-to-structured-data pipeline.|Narrow source coverage.|Reuse ingestion patterns for Medellín tech events.|
|automated-event-tracker|[https://github.com/Balick-ai/automated-event-tracker](https://github.com/Balick-ai/automated-event-tracker)|89|Tracks events automatically.|Continuous freshness monitoring.|Might lack robust dedupe.|Use for periodic re-crawl logic.|
|event-map|[https://github.com/andrew-miroiu/event-map](https://github.com/andrew-miroiu/event-map)|91|Map-based event discovery.|Map pins + spatial browsing.|Might be UI-only.|Copy the map/list interaction model.|
|GeoDiscovery-AI|[https://github.com/shivanitammisetti/GeoDiscovery-AI](https://github.com/shivanitammisetti/GeoDiscovery-AI)|86|Geo-discovery concept.|Location-first discovery logic.|Unknown production quality.|Use for geo-ranking inspiration.|
|AI-Travel-Manager|[https://github.com/thekaailashsharma/AI-Travel-Manager](https://github.com/thekaailashsharma/AI-Travel-Manager)|84|Travel planning with AI.|Travel/context planning around activities.|Not event-native.|Use for itinerary integration after events.|
|event-iq|[https://github.com/0xfarben/event-iq](https://github.com/0xfarben/event-iq)|89|Event intelligence concept.|Event intelligence framing.|Unknown maturity.|Use as naming/positioning inspiration.|

## 4. Top 10 Core Features

|Feature|Description|Real-world Medellín example|Required stack|Priority|MVP or advanced|
|---|---|---|---|---|---|
|Conversational event search|User asks in natural language and gets ranked events.|“What’s happening tonight near Laureles?”|CopilotKit, Mastra, Supabase|P0|MVP|
|Map-first event cards|Cards tied to pins and neighborhood context.|Jazz in El Poblado, salsa in Laureles.|Google Maps, CopilotKit|P0|MVP|
|Daily event ingestion|Scheduled scraper pipeline pulls real upcoming events.|Eventbrite + Plaza Mayor + Luma. eventbrite+2|cron, Playwright/Firecrawl, Supabase|P0|MVP|
|Venue enrichment|Attach venue place_id, geo, hours, and nearby places.|Event at Plaza Mayor with nearby cafés. [medellin](https://www.medellin.gov.co/es/secretaria-privada/conglomerado-publico/entidades-del-conglomerado/plaza-mayor/)|Google Places, Grounding Lite|P0|MVP|
|Deduplication|Merge same event across multiple sources.|Same meetup on Eventbrite and Luma.|Supabase, hashing, fuzzy match|P0|MVP|
|AI summaries|Explain what the event is and who it’s for.|“Startup networking, English-friendly.”|Gemini, source text|P1|MVP|
|Event tagging|Add category, vibe, audience, price, language tags.|family-friendly Sunday fair.|Gemini + rules|P1|MVP|
|Quality ranking|Rank by freshness, source trust, venue confidence.|prefer Plaza Mayor over stale reposts. plazamayor+1|scoring tables, SQL|P1|MVP|
|Save/share collections|Users can save event lists or trips.|“Weekend plans in Medellín.”|Supabase, CopilotKit|P1|MVP|
|Ticket handoff|Send user to ticket_url or later purchase flow.|Eventbrite or TuTicket redirect.|Stripe later, outbound links|P2|Advanced|

## 5. Top 10 Use Cases

|User type|Query example|System response|Business value|Required data|
|---|---|---|---|---|
|New resident|“What’s happening tonight near Laureles?”|8 ranked events with map pins and 2 summaries.|Daily active use.|location, time, venue, tags|
|Nightlife seeker|“Best techno events this weekend”|Filtered, ranked weekend nightlife list.|High intent traffic.|category, date, venue, price|
|Startup worker|“Startup networking events in Medellín”|tech/startup events with relevance explanation.|B2B audience growth.|topic tags, organizer, language|
|Family planner|“Family-friendly events this Sunday”|safe, daytime, low-cost events.|Broader city utility.|audience tags, hours, venue|
|Apartment shopper|“Find events near this apartment”|map-based nearby event matches.|Cross-sell from rentals.|geolocation, event coords|
|Tourist|“What can I do near Plaza Mayor?”|nearby events plus transit context.|Tourism conversion.|venue context, route data|
|Creator|“Best photo-friendly events this month”|scenic, photogenic event shortlist.|Shareability.|image metadata, tags|
|Foodie|“Food and music events”|culinary events and markets.|Better intent matching.|category, venue, ticket_url|
|Local culture explorer|“Traditional events in Medellín”|heritage, art, and neighborhood events.|Retention via culture.|category, description|
|Deal seeker|“Free events this weekend”|free/low-cost ranked list.|High volume query.|price, RSVP, source|

## 6. Recommended Architecture

```
flowchart LR
A[Daily scrapers] --> B[raw_events]
B --> C[normalize + validate]
C --> D[dedupe]
D --> E[event_venues + Google Places enrichment]
E --> F[AI summaries + tags]
F --> G[event_quality_scores]
G --> H[events canonical table in Supabase]
H --> I[Mastra workflows]
I --> J[CopilotKit event cards]
H --> K[Google Map pins]
H --> L[searchEventsTool / recommendationTool]
```

## Core services

- **Supabase**: source of truth for event data, venues, runs, and quality scores.
    
- **Mastra**: orchestration for daily scraping, enrichment, dedupe, ranking.
    
- **CopilotKit**: chat UI, generative cards, save/share actions.
    
- **Google Maps / Places**: venue grounding, place IDs, neighborhood, routing.
    
- **Gemini**: summaries, tags, intent inference, explanation text.
    
- **Stripe**: future ticket checkout / sponsorship / paid boosts.
    
- **Schedulers**: Supabase cron or Trigger.dev for recurring jobs.
    

## 7. Supabase Schema Plan

## event_sources

- id
    
- name
    
- source_type
    
- base_url
    
- trust_score
    
- scrape_strategy
    
- active
    

## raw_events

- id
    
- source_id
    
- source_url
    
- raw_payload
    
- scraped_at
    
- hash
    
- status
    

## event_venues

- id
    
- name
    
- address
    
- neighborhood
    
- lat
    
- lng
    
- place_id
    
- google_maps_url
    
- source_confidence
    

## events

- id
    
- canonical_name
    
- summary
    
- description
    
- start_at
    
- end_at
    
- timezone
    
- venue_id
    
- category
    
- vibe
    
- language
    
- price_min
    
- price_max
    
- ticket_url
    
- image_url
    
- source_count
    
- quality_score
    
- status
    

## event_tags

- id
    
- event_id
    
- tag
    
- tag_type
    

## event_embeddings

- event_id
    
- embedding vector
    
- model
    
- updated_at
    

## event_runs

- id
    
- run_type
    
- started_at
    
- finished_at
    
- status
    
- notes
    

## event_scrape_jobs

- id
    
- source_id
    
- scheduled_for
    
- started_at
    
- status
    
- error
    

## event_quality_scores

- event_id
    
- freshness_score
    
- trust_score
    
- dedupe_score
    
- venue_score
    
- ai_score
    
- final_score
    

## event_tickets

- id
    
- event_id
    
- provider
    
- ticket_url
    
- currency
    
- price
    
- inventory_status
    

## 8. Mastra Agent + Workflow Plan

Keep this small.

## Agents

- **eventRouterAgent**: interprets user intent and routes to search or planning.
    
- **eventSummarizerAgent**: turns source text into short grounded summaries.
    
- **eventRankerAgent**: only if needed for explanation; not for truth creation.
    

## Workflows

- **eventDiscoveryWorkflow**: end-to-end daily pipeline.
    
- **scrapeEventsWorkflow**: fetch source pages and store raw rows.
    
- **enrichVenueWorkflow**: place lookup, place_id, geo, nearby context.
    
- **dedupeEventsWorkflow**: merge duplicate events.
    
- **rankEventsWorkflow**: compute quality and relevance scores.
    

## Tools

- **searchEventsTool**: query events by time, neighborhood, vibe, category.
    
- **eventRecommendationTool**: explain why an event is recommended.
    

## 9. Scraping + Automation Plan

|Tool|Best use|MVP fit|Why|
|---|---|---|---|
|Apify|source-specific scraping actors|High|Fastest to launch for structured scrapers.|
|Playwright|fallback for difficult pages|Medium|Most flexible, but heavier to maintain.|
|Firecrawl|article/blog/event page extraction|High|Great for structured page text.|
|Bright Data|blocked/social-heavy sources|Low initially|Powerful but costly and more operational overhead.|
|n8n|glue + alert workflows|High|Great for event discovery automation and alerts.|
|Supabase cron|simple scheduled jobs|High|Good enough for MVP.|
|Trigger.dev|more robust job orchestration|Medium|Better when jobs become complex.|

## MVP recommendation

Use **Supabase cron + Apify + Firecrawl** first. Add Playwright only for sources that break, and defer Bright Data until you have a proven revenue reason.[apify](https://apify.com/crawlerbros/meetup-luma-scraper/input-schema)

## 10. Event Source Strategy

|Source|Trust score|Difficulty|Coverage|Scrape/API strategy|MVP priority|
|---|---|---|---|---|---|
|Eventbrite|88|Medium|broad events|scrape pages / listings|High|
|RA.co|84|Medium|music/nightlife|scrape pages|High|
|Luma|82|Medium|tech/startup/community|scrape calendar pages|High|
|Meetup|85|Medium|community/tech|scrape or actor|High|
|Medellín Travel|90|Low|city tourism/culture|crawl curated pages|High|
|Plaza Mayor|92|Low|major conventions/fairs|official site crawl|High|
|Fever|86|Medium|consumer entertainment|scrape listing pages|Medium|
|Songkick|83|Medium|concerts|API/scrape pages|Medium|
|Bandsintown|83|Medium|concerts|API/scrape pages|Medium|
|Tuboleta|81|Medium|ticketed events|scrape with care|Medium|
|TuTicket|80|Medium|ticketed events|scrape with care|Medium|
|Instagram venue pages|70|High|nightlife/cafés/creator posts|manual/automation hybrid|Medium|

## Suggested MVP source set

Start with **Eventbrite, Luma, Plaza Mayor, and Medellín Travel**. They give enough variety to validate the product without exploding scraping complexity.eventbrite+3

## 11. Google Maps / ADK / Grounding Strategy

Use Google Maps/Places as the geo source of truth. For each event venue, try to resolve a `place_id`, `google_maps_url`, and if possible a stable `googleMapsUri`/`placeUri` equivalent in your internal schema.developers.google+3

## How to use it

- **Venue lookup**: resolve venue names to a canonical place.
    
- **Nearby cafés/restaurants**: enrich event cards with nearby options.
    
- **Route intelligence**: estimate travel time from neighborhoods like El Poblado, Laureles, and Envigado.
    
- **Neighborhood context**: add area/vibe labels like cultural, nightlife, startup, or tourist.
    
- **Grounding Lite**: use it to keep summaries factual and current.
    
- **ADK sidecar**: only if you need a separate agent orchestration surface; otherwise Mastra is enough.
    

## Rule

Do not let AI invent venue location. If there is no groundable place match, mark the venue as unverified.

## 12. pgvector Strategy

Embed:

- event title
    
- summary
    
- tags
    
- venue name
    
- neighborhood
    
- vibe text
    
- category
    
- organizer text
    

## MVP

Use SQL filters first:

- date range
    
- neighborhood
    
- category
    
- free/paid
    
- family-friendly / nightlife / tech
    

## Later

Add semantic search:

- “romantic live music”
    
- “quiet startup networking”
    
- “family-friendly Sunday outing”
    
- “best nightlife near Provenza”
    

That lets you rank by meaning, not just fields.

## 13. Stripe / Ticketing Strategy

For MVP, **do not build ticket checkout**. Just link out to ticket URLs and log outbound clicks.developers.googleblog+1

Later:

- add **event_orders**
    
- add **event_attendees**
    
- add **Google Wallet ticket passes**
    
- add **QR scanning**
    
- potentially integrate checkout for sponsored / owned events
    

This keeps the MVP simple and avoids payment complexity before demand is proven.

## 14. Task Breakdown

## Core MVP Tasks

|Task|Description|Files likely touched|Acceptance criteria|Priority|
|---|---|---|---|---|
|Event schema design|Create canonical event tables in Supabase.|SQL migrations, types, RPCs|Tables created, indexes in place, seeded tests pass.|P0|
|Source ingestion v1|Add 3–4 source scrapers.|edge functions, cron jobs, adapters|Raw events stored with source URL and scrape timestamp.|P0|
|Normalization pipeline|Convert raw rows into canonical events.|workflow, mapper, validators|Events normalize consistently across sources.|P0|
|Deduplication|Merge duplicates across sources.|dedupe service, matching rules|Duplicate event pairs merge in tests.|P0|
|Places enrichment|Resolve venues and attach place IDs.|enrichment service, maps adapter|Venue rows have canonical geo when found.|P0|
|Search API/tool|Build `searchEventsTool`.|API, tool registry, SQL|Can query by time, neighborhood, category.|P0|
|CopilotKit cards|Render event cards in chat.|UI components|Cards show summary, venue, time, CTA.|P1|
|Map pins|Sync event pins to map.|map layer, pin state|Pins update with search results.|P1|
|AI summaries|Generate short grounded summaries.|Gemini prompt, summary job|Summary references source text only.|P1|
|Quality scoring|Score freshness, trust, and venue confidence.|scoring job|Low-quality/stale events rank lower.|P1|

## Advanced Tasks

|Task|Description|Files likely touched|Acceptance criteria|Priority|
|---|---|---|---|---|
|Personalization|Taste-based ranking.|pgvector, user profiles|Saved actions improve ranking.|P2|
|WhatsApp alerts|Message event picks to users.|WhatsApp integration, notifications|Daily/weekly alerts delivered.|P2|
|Sponsor matching|Pair events with sponsors.|CRM, scoring, outreach|Sponsor leads generated from events.|P2|
|Trend detection|Detect rising neighborhoods/categories.|analytics, time series|Alerts on meaningful spikes.|P2|
|OpenClaw automation|Enrich social and hard-to-scrape sources.|OpenClaw skills/workflows|New venue/event signals captured.|P2|
|Semantic similarity|Similar-event recommendations.|embeddings, ranker|“More like this” works reliably.|P2|

## 15. Red Flags / Failure Points

- Hallucinated events: never publish an event without a source URL.
    
- Duplicate events: use source hashing and fuzzy matching.
    
- Stale events: schedule refreshes and expiration rules.
    
- Scraping blocked: keep fallback sources and source-specific adapters.
    
- Missing venue locations: mark uncertain, do not guess.
    
- Timezone bugs: all event times must be stored in America/Bogota.
    
- No dedupe: users will see repeated listings and lose trust.
    
- Overusing agents: keep truth in code and DB, not in agent memory.
    
- No tests: every scraper and merger needs fixture tests.
    
- Weak provenance: store source URL, scrape time, and parser version for every record.
    

## 16. Final Recommendation

Build it in this order:

1. Build normalized schema.
    
2. Add 3 source scrapers.
    
3. Add dedupe.
    
4. Add Places enrichment.
    
5. Add event search API/tool.
    
6. Add CopilotKit event cards.
    
7. Add map pins.
    
8. Add AI summaries.
    
9. Add daily automation.
    
10. Add pgvector later.developers.googleblog+3
    

The best MVP is small, deterministic, and boring in the right places. Make Supabase the source of truth, Mastra the workflow engine, CopilotKit the interface, Google Maps the geo layer, and Gemini the summarizer—not the source of truth. That is the safest path to a production Medellín event intelligence system.