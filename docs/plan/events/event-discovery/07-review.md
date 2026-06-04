# Review Verdict

Yes — the plan is **mostly correct and production-minded**.

**Grade: 88/100**

It follows the right principle: **real scraped data first, AI second**. The plan says events should come from “scraped + approved Supabase rows,” enriched with Google Places, ranked by rules/light AI, and never invented by Gemini. That is the correct architecture.

# Scorecard

|Area|Score|Review|
|---|--:|---|
|Strategy|94|Data-first, not AI hallucination-first|
|MVP scope|86|Good, but 8–10 weeks may be too broad|
|Architecture|91|Correct pipeline: ingest → normalize → dedupe → enrich → serve|
|Google Maps usage|93|Places enrichment is correctly core|
|AI usage|88|Good: summarize/rank only, not invent|
|Automation|82|Daily cron is right; needs stronger retry/dead-letter plan|
|Supabase schema|86|Good, needs stricter unique constraints|
|Testing plan|80|Good direction, needs exact test commands|
|Production readiness|78|Needs observability, admin approval, and source compliance|
|Overall|**88**|Strong plan, needs hardening|

# What is Correct

|Plan Item|Verdict|Why|
|---|---|---|
|Data-first event discovery|Correct|Prevents fake AI events|
|Raw events table|Correct|Lets you replay normalization|
|Dedupe before publishing|Correct|Avoids duplicate cards|
|Google Places enrichment|Correct|Needed for pins and venue trust|
|Gemini summaries only|Correct|Safe AI use|
|Existing event cards/pins reuse|Correct|Avoids rebuilding UI|
|Source URL required|Correct|Trust + verification|
|Human approval queue|Correct|Critical for early MVP quality|
|SQL first, pgvector later|Correct|Avoids premature complexity|
|Stripe external links first|Correct|Keeps discovery MVP simple|

# Web Verification

Your Google Maps strategy is aligned with current Google direction. Google describes Maps Grounding Lite as an MCP-supported way to ground AI apps with trusted places, weather, and routes, and says it helps reduce hallucinations by anchoring agents to Maps data. ([Google Maps Platform](https://mapsplatform.google.com/maps-products/grounding/?utm_source=chatgpt.com "Maps Grounding | Google Maps Platform"))

Your Places enrichment requirement is also correct: Places API New requires field masks; omitting them can return an error, so every Places call should explicitly request only needed fields. ([Google for Developers](https://developers.google.com/maps/documentation/places/web-service/place-details?utm_source=chatgpt.com "Place Details (New) | Places API"))

Your workflow approach is correct for Mastra. Mastra docs support using workflows for ordered steps and tools/agents inside those steps; this matches your deterministic scrape → normalize → enrich pipeline. ([mastra.ai](https://mastra.ai/docs/workflows/agents-and-tools?utm_source=chatgpt.com "Agents and tools | Workflows | Mastra Docs"))

Supabase Cron is a valid fit for scheduled daily scraping because it supports recurring jobs using cron syntax and lets jobs be managed/monitored inside Postgres. ([Supabase](https://supabase.com/modules/cron?utm_source=chatgpt.com "Supabase Cron | Schedule Recurring Jobs in Postgres"))

# Biggest Improvements Needed

## 1. Reduce MVP scope

Current MVP is slightly too big.

Better MVP:

|Keep in MVP|Move Later|
|---|---|
|Eventbrite|Instagram|
|Medellín Travel|Meetup|
|RA.co|Songkick|
|Places enrichment|pgvector|
|Human approval|WhatsApp|
|Event cards + pins|sponsor intelligence|

Start with **3 sources only**:

1. Eventbrite Medellín
    
2. Medellín Travel
    
3. RA.co Medellín
    

# 2. Add strict database constraints

Add:

|Constraint|Why|
|---|---|
|unique `(source_id, external_id)`|stops duplicate imports|
|unique normalized hash|catches duplicate title/date/venue|
|`source_url NOT NULL` for discovered events|trust requirement|
|`starts_at NOT NULL`|no unusable events|
|`timezone = America/Bogota`|avoids date bugs|
|`place_id` nullable but tracked|not every event geocodes|

# 3. Add event freshness rules

|Rule|Action|
|---|---|
|Event date passed|auto-hide|
|Source missing for 7 days|mark stale|
|Venue not found|approve manually|
|No source URL|reject|
|Duplicate confidence > 0.85|merge|
|Scrape failed 3 times|alert Patricia|

# 4. Add quality score formula

Use a simple formula:

|Signal|Weight|
|---|--:|
|trusted source|25|
|complete date/time|20|
|venue geocoded|20|
|ticket/free info|10|
|image available|10|
|category/tags|10|
|English/tourist-friendly|5|

# 5. Add exact test gates

Before calling it done:

```bash
npm run lint
npm run build
npm run test
npm run floor
```

Add tests for:

|Test|Pass condition|
|---|---|
|Normalize Eventbrite row|valid `events` candidate|
|Normalize RA row|valid Bogotá datetime|
|Dedupe same event|one event only|
|Places enrichment|returns lat/lng/place_id|
|Past event hiding|not shown in search|
|Search events|max 10 approved rows|
|Source URL required|candidate rejected if missing|

# Final Recommended Grade

|Version|Score|
|---|--:|
|Current plan|**88/100**|
|With constraints + freshness + tests|**94/100**|
|With live cron proof + 3-day scrape logs|**97/100**|

# Best Next Step

Build this as **EVD-01 to EVD-06 only first**:

|Task|Goal|
|---|---|
|EVD-01|Schema + RLS + constraints|
|EVD-02|Seed 3 trusted sources|
|EVD-03|Eventbrite scraper|
|EVD-04|Normalize + dedupe|
|EVD-05|Places enrichment|
|EVD-06|Approved events show in existing cards + pins|

Do **not** add pgvector, WhatsApp, sponsor matching, or 10+ scrapers until the first 3-source pipeline works for 7 days.