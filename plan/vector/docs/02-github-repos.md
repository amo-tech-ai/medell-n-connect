Below is a practical shortlist built from the repos and products you shared, filtered for **AI-first geo discovery, semantic search, recommendation engines, map intelligence, and local enrichment**. I’ve scored these for how much production value they can add to mdeai, not just how cool they look.github+5

## Executive summary

The most valuable stack pieces for mdeai are **pgvector, Gorse, HNSWLib, TREK, TripSage, and OpenClaw** because they cover semantic search, recommendation ranking, collaborative trip UX, and browser-based enrichment.github+5  
If I had to pick only three technical primitives, they would be **pgvector for canonical semantic storage, Gorse for recommendation ranking, and OpenClaw for data acquisition/enrichment**.github+2  
If I had to pick only three product patterns, they would be **Mindtrip-style multimodal trip intake, Yelp-style grounded Q&A, and Foursquare-style local intelligence**.foursquare+2

## Top GitHub repos

|Repo|URL|Stars|Stack|Score /100|Best features|Useful for mdeai?|MVP or advanced?|What to steal/adapt|Risk|
|---|---|---|---|---|---|---|---|---|---|
|pgvector|[https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)|High|Postgres vector extension. github+1|99|Native vector similarity in Postgres, ideal for embeddings + geo entities. [github](https://github.com/pgvector/pgvector)|Yes|Core|Use for vibes, intents, entity dedupe, and recommendation search.|Low|
|gorse|[https://github.com/gorse-io/gorse](https://github.com/gorse-io/gorse)|High|Go recommender engine, Redis, MySQL/Postgres/ClickHouse. github+1|97|Universal recommender, implicit feedback, distributed prediction. pkg.go+1|Yes|Advanced|Use as ranking/recs layer for places, cafés, events, tours.|Medium|
|HNSWLib|[https://github.com/nmslib/hnswlib](https://github.com/nmslib/hnswlib)|High|ANN search library. [github](https://github.com/bli25/hnsw)|95|Fast approximate nearest-neighbor search. [github](https://github.com/bli25/hnsw)|Yes|Core/advanced|Great for fast candidate generation before rerank.|Low-medium|
|OpenClaw|[https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)|High|Browser automation/agent platform. github+1|98|Browser-controlled research, enrichment, workflow automation. openclaw+1|Yes|Core|Crawl websites, IG, map pages, menus, local SEO signals.|Medium-high|
|TREK|[https://github.com/mauriceboe/TREK](https://github.com/mauriceboe/TREK)|Medium|Self-hosted travel planner with maps and AI. github+1|91|Collaborative planning, map UX, budgets, packing, AI. [github](https://github.com/mauriceboe/TREK)|Yes|Advanced|Shared trip boards, map-centric planning, collaboration.|Medium|
|TripSage|[https://github.com/BjornMelin/tripsage-ai](https://github.com/BjornMelin/tripsage-ai)|Medium|Supabase + pgvector + LangGraph + Next.js. [aibase](https://www.aibase.com/zh/repos/project/tripsage-ai)|90|Budget-aware personalized travel recommendation system. [aibase](https://www.aibase.com/zh/repos/project/tripsage-ai)|Yes|Advanced|Good reference for architecture and recommender flow.|Medium|
|ai-docs-vector-db-hybrid-scraper|[https://github.com/BjornMelin/ai-docs-vector-db-hybrid-scraper](https://github.com/BjornMelin/ai-docs-vector-db-hybrid-scraper)|Medium|Hybrid scraper + vector DB. [aibase](https://www.aibase.com/zh/repos/project/tripsage-ai)|88|Retrieval and scraping pipeline pattern. [aibase](https://www.aibase.com/zh/repos/project/tripsage-ai)|Yes|Core|Web ingestion into vector store.|Medium|
|Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store|[https://github.com/jonathanscholtes/Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store](https://github.com/jonathanscholtes/Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store)|Medium|React, FastAPI, Cosmos DB vector store.|84|End-to-end travel agent architecture.|Yes|Advanced|UI-to-backend agent flow.|Medium|
|travel-planner-with-RAG|[https://github.com/shashank29-p/travel-planner-with-RAG](https://github.com/shashank29-p/travel-planner-with-RAG)|Medium|RAG travel planner.|80|Simple RAG itinerary generation.|Yes|MVP|Use as baseline prompt/retrieval pattern.|Low|
|hybrid-retrieval-system|[https://github.com/Arnavadi19/hybrid-retrieval-system](https://github.com/Arnavadi19/hybrid-retrieval-system)|Medium|Hybrid retrieval.|79|Search fusion patterns.|Yes|Core|Combine semantic + lexical + geo filters.|Low|

## Top startups

|Startup|URL|Score /100|Best feature|Why it matters for mdeai|
|---|---|---|---|---|
|Mindtrip|[https://mindtrip.ai](https://mindtrip.ai/)|98|Multimodal travel planning, nearby discovery, collections, map-centric UX. phocuswire+2|Best consumer model for AI city discovery.|
|Yelp AI|[https://www.yelp.com](https://www.yelp.com/)|93|Grounded local Q&A, booking, review intelligence. techcrunch+1|Strong restaurant/café intelligence pattern.|
|Foursquare|[https://foursquare.com](https://foursquare.com/)|95|Location intelligence platform, local data, AI/location grounding. foursquare+2|Best model for local graph and trust signals.|
|GuideGeek|[https://brands.guidegeek.com](https://brands.guidegeek.com/)|87|Destination-specific conversational assistant. venturebeat+2|Good model for WhatsApp/IG-first travel concierge.|
|Wanderlog|[https://wanderlog.com](https://wanderlog.com/)|85|Collaborative itinerary planning. ycombinator+2|Good shared-trip UX, less AI-native.|
|Atlas Obscura|[https://www.atlasobscura.com](https://www.atlasobscura.com/)|82|Hidden-gems storytelling and map discovery. atlasobscura+1|Great for “unique Medellín” discovery layers.|
|Booking.com AI features|[https://news.booking.com/bookingcom-enhances-travel-planning-with-new-ai-powered-features--for-easier-smarter-decisions/](https://news.booking.com/bookingcom-enhances-travel-planning-with-new-ai-powered-features--for-easier-smarter-decisions/)|91|Review summaries and smarter travel decisions. [news.booking](https://news.booking.com/bookingcom-enhances-travel-planning-with-new-ai-powered-features--for-easier-smarter-decisions/)|Best trust + conversion model.|
|Time Out|[https://www.timeout.com](https://www.timeout.com/)|73|Editorial curation at city scale.|Good content model, weaker AI.|
|Spotted by Locals|[https://www.spottedbylocals.com](https://www.spottedbylocals.com/)|78|Local expert curation.|Great creator-local authority pattern.|
|Google Maps / Places|[https://www.google.com/maps](https://www.google.com/maps)|99|Place grounding, routing, reviews, map UX.|Source of truth for mdeai.|

## Top 10 ways to use these features

|Way to use|Real-world example|Score /100|Core or advanced?|Why it matters|Stack|
|---|---|---|---|---|---|
|Vibe-based café search|“quiet laptop cafés in Laureles”|98|Core|Matches human intent better than category filters.|pgvector + CopilotKit + Maps|
|Local discovery ranking|“best brunch near El Poblado with outdoor seating”|96|Core|Ranks by taste, proximity, and trust.|gorse + pgvector + Places|
|Hidden-gems detection|find underrated coffee spots in Santa Elena|94|Advanced|Surfaces long-tail, non-obvious venues.|OpenClaw + embeddings|
|Creator-driven maps|convert IG stories into a Medellín café map|95|Advanced|Captures social discovery where it starts.|OpenClaw + browser automation|
|Review summarization|“good for dates, noisy, expensive”|93|Core|Converts review clutter into usable decisions.|LLM + review corpus|
|Trip board collaboration|shared Medellín weekend plan|90|Advanced|Increases retention and sharing.|TREK-style UX + Supabase|
|Semantic geo-search|“within 15 min of Provenza”|97|Core|Combines map intelligence with natural language.|pgvector + HNSW + Maps|
|Local trend monitoring|new cafés opening in Manila|92|Advanced|Helps you stay current and own freshness.|OpenClaw + scheduled crawls|
|Trust scoring|rank by freshness, corroboration, and review consistency|95|Advanced|Prevents SEO spam from dominating.|gorse + heuristic scoring|
|Concierge explanations|“why this place fits you”|99|Core|Makes recommendations feel intelligent and trustworthy.|CopilotKit + LLM + retriever|

## Top 10 GitHub repos to use

|Repo|Why use it|Score /100|
|---|---|---|
|[https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)|Canonical vector layer for mdeai.|99|
|[https://github.com/gorse-io/gorse](https://github.com/gorse-io/gorse)|Recommendation engine for ranking and personalization.|97|
|[https://github.com/nmslib/hnswlib](https://github.com/nmslib/hnswlib)|Fast ANN search for candidate generation.|95|
|[https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)|Browser automation for enrichment and research.|98|
|[https://github.com/mauriceboe/TREK](https://github.com/mauriceboe/TREK)|Best collaborative travel-planning UX reference.|91|
|[https://github.com/BjornMelin/tripsage-ai](https://github.com/BjornMelin/tripsage-ai)|Strong modern AI travel stack pattern.|90|
|[https://github.com/BjornMelin/ai-docs-vector-db-hybrid-scraper](https://github.com/BjornMelin/ai-docs-vector-db-hybrid-scraper)|Practical scrape-to-vector pipeline.|88|
|[https://github.com/jonathanscholtes/Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store](https://github.com/jonathanscholtes/Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store)|End-to-end agent app architecture.|84|
|[https://github.com/shashank29-p/travel-planner-with-RAG](https://github.com/shashank29-p/travel-planner-with-RAG)|Lightweight RAG travel planner baseline.|80|
|[https://github.com/Arnavadi19/hybrid-retrieval-system](https://github.com/Arnavadi19/hybrid-retrieval-system)|Hybrid search patterns worth borrowing.|79|

## Best OpenClaw use cases

|Use case|Real-world example|Business value|Stack integration|Difficulty|Core or advanced?|Score /100|Risks|
|---|---|---|---|---|---|---|---|
|Café enrichment crawler|crawl café sites in El Poblado and Laureles|Better café discovery database|OpenClaw + Places + Supabase|Medium|Core|97|site changes|
|Restaurant menu extraction|get menus, hours, pricing|better “best dish” search|OpenClaw + Gemini + pgvector|Medium|Core|95|OCR errors|
|Instagram place discovery|discover venues from tags and geolocations|creator-driven discovery moat|OpenClaw + social crawl + vector DB|High|Advanced|94|TOS risk|
|Hidden gem finder|detect repeated mentions in blogs/IG|surfaces non-obvious spots|OpenClaw + embeddings|High|Advanced|93|SEO noise|
|Review summarizer|synthesize common themes from reviews|trust and decision support|OpenClaw + LLM + review store|Medium|Core|92|hallucination if uncited|
|Local SEO monitoring|watch competitor city pages|content strategy and gap analysis|OpenClaw + scheduler|Medium|Advanced|88|maintenance|
|Event intelligence|detect recurring nightlife and events|fresh city intelligence|OpenClaw + Places + calendar|Medium|Core|89|freshness|
|Sponsor prospecting|find businesses ready for partnerships|revenue growth|OpenClaw + CRM|Medium|Advanced|87|outreach quality|
|Neighborhood trend tracking|monitor emerging hotspots|Medellín moat|OpenClaw + time-series + embeddings|High|Core|96|dedupe complexity|
|Trust verification|cross-check businesses from multiple sources|reduces spam and bad recs|OpenClaw + source scoring|High|Advanced|94|needs rules|

## Top local marketing automations

|Automation|Business value|Flow|Difficulty|Score /100|
|---|---|---|---|---|
|Local SEO content gap detection|identify pages mdeai should own|crawl competitors → extract topics → compare coverage|Medium|92|
|City trend monitoring|catch rising venues, barrios, and themes|crawl web/IG → cluster terms → alert|High|94|
|Creator outreach scoring|find local curators to partner with|find creators → score fit → draft outreach|High|90|
|Sponsor prospecting|monetize local discovery|identify high-fit businesses → enrich → prioritize|Medium|88|
|Event monitoring|keep nightlife and event inventory fresh|detect venues/posts → normalize → publish|Medium|89|
|Instagram café extraction|grow hidden-gems coverage|crawl geotagged posts → map places|High|93|
|Review sentiment alerts|detect quality shifts|monitor review themes → alert on drops/spikes|Medium|87|
|Competitor mapping|understand market positioning|crawl portals → compare map/list UX|Medium|86|
|Partnership lead generation|local business BD|crawl official sites/socials → qualify leads|Medium|85|
|Freshness re-crawls|prevent stale entries|schedule periodic refreshes|Low|91|

## Architecture recommendations

OpenClaw should sit in the **acquisition layer**, not the product layer. That means it pulls from websites, Instagram, menus, directories, and social signals, then hands structured evidence to your normalization pipeline.github+3

## Best-fit architecture

- **CopilotKit**: chat UI and conversational controls.
    
- **Mastra / ADK**: agent routing and task decomposition.
    
- **OpenClaw**: browser-based research, scrape, enrichment, monitoring.
    
- **Grounding Lite MCP + Places API**: location truth and map grounding.
    
- **Supabase**: canonical data graph, auth, storage, analytics.
    
- **pgvector**: semantic similarity, vibe clustering, preference memory.
    
- **gorse**: ranking and recommendation engine.
    
- **HNSWLib**: fast candidate generation if you need additional ANN layers.github+4
    

## Architecture diagram

```
flowchart LR
U[User in CopilotKit] --> Q[Intent + vibe query]
Q --> A[Mastra / ADK agents]
A --> P[Places + Google Maps grounding]
A --> O[OpenClaw browser workflows]
O --> X[Web, IG, menus, blogs, reviews]
P --> N[Normalization]
X --> N
N --> S[Supabase canonical graph]
S --> V[pgvector embeddings]
S --> G[gorse ranking]
V --> R[Hybrid ranker]
G --> R
R --> U
R --> M[Map cards, list, routes, explanations]
```

## What to steal now

## Core MVP

1. Semantic café and restaurant search.
    
2. Map-first results with explainable ranking.
    
3. Review and menu summarization.
    
4. OpenClaw-powered freshness and enrichment.
    
5. Trust scoring with source provenance.
    
6. Creator-driven hidden-gem collections.
    

## Advanced later

1. Personal taste vectors.
    
2. Dynamic neighborhood intelligence.
    
3. Shared trip/city boards.
    
4. Automated partnership leads.
    
5. Trend detection and anomaly alerts.
    
6. Multi-agent itinerary and discovery planning.
    

## Medellín moat analysis

Your moat is **local intelligence density**, not content volume. A competitor can copy a page template, but it cannot easily copy a living graph of Medellín cafés, restaurants, rentals, creators, coffee tours, events, and neighborhoods that is constantly refreshed.

The hardest-to-replicate signals are:

- creator and local-expert curation.
    
- multi-source corroboration.
    
- neighborhood change over time.
    
- bilingual nuance.
    
- trust/freshness scoring.
    
- semantic taste memory.
    

The strongest retention loop is: users search, save, share, and return because the system remembers their vibe and keeps learning the city. The strongest virality loop is shareable collections and trip boards. The strongest trust loop is source-backed explanations and freshness checks.

## Final strategic direction

For mdeai, do not build a generic travel assistant. Build **Medellín’s intelligent local graph** with OpenClaw as the crawler/enricher, pgvector as the semantic brain, gorse as the recommender, and CopilotKit as the interface. That combination gives you the best shot at AI-first city discovery with real local utility.

If you want, I can next turn this into a **clean CSV-ready benchmark table** with 50 repos and 50 feature ideas, or into a **priority roadmap with core vs advanced implementation phases**.