## Executive summary

Best direction for **mdeai.co**: build a **Medellín AI city concierge**, not a directory. The winning pattern is:

```text
Chat intent → grounded search → map/listing cards → AI score → save/compare/book
```

Top products to study: **Mindtrip, Layla, GuideGeek, Tripadvisor Trips, Google Maps AI, Yelp AI, Foursquare, Zest Maps**. Top OSS ideas: **CopilotKit trip planner, Geo Explorer, NaLaMap, Google Maps MCP, TREK, pgvector**.

---

## Top startup/product examples

| Product               | URL                                                                                                                                                                                | Score /100 | Best features to adapt                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------: | ------------------------------------------------------------------------------ |
| Mindtrip              | [https://mindtrip.ai/](https://mindtrip.ai/)                                                                                                                                       |         96 | Personalized recommendations, maps, photos, reviews, favorites, group planning |
| Google Maps AI        | [https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/](https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/) |         95 | Ask Maps, immersive navigation, location-aware answers                         |
| Tripadvisor Trips AI  | [https://www.tripadvisor.com/Trips](https://www.tripadvisor.com/Trips)                                                                                                             |         91 | AI itinerary builder, save/edit/share, collaboration                           |
| Layla                 | [https://layla.ai/](https://layla.ai/)                                                                                                                                             |         89 | Conversational trip planning, creator video inspiration, taste learning        |
| GuideGeek             | [https://guidegeek.com/](https://guidegeek.com/)                                                                                                                                   |         87 | WhatsApp/Instagram travel assistant, real-time travel info                     |
| Yelp AI               | [https://blog.yelp.com/news/end-of-year-product-release-2024/](https://blog.yelp.com/news/end-of-year-product-release-2024/)                                                       |         86 | AI review insights, business discovery, sentiment summaries                    |
| Foursquare Places API | [https://foursquare.com/products/places-api/](https://foursquare.com/products/places-api/)                                                                                         |         84 | 100M+ POIs, autocomplete, venue intelligence                                   |
| Zest Maps             | [https://www.wired.com/story/zest-maps-is-the-second-coming-of-foursquare](https://www.wired.com/story/zest-maps-is-the-second-coming-of-foursquare)                               |         82 | AI food discovery from real visit behavior, friend/social signals              |

Sources: Mindtrip shows personalized recommendations, maps, reviews, favorites, and group trip planning. ([Mindtrip][1]) Google Maps is adding Gemini-powered Ask Maps and Immersive Navigation. ([blog.google][2]) Tripadvisor Trips supports AI recommendations, saving, editing, sharing, and collaboration. ([Tripadvisor][3]) Yelp uses AI review insights and discovery features. ([Yelp Blog][4])

---

## Top GitHub / OSS repos

| Repo                       | URL                                                                                                                                                                  | Score /100 | Best use for mdeai                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------: | --------------------------------------------- |
| CopilotKit AI Trip Planner | [https://dev.to/copilotkit/the-ai-powered-trip-planner-you-cant-live-without-2pk6](https://dev.to/copilotkit/the-ai-powered-trip-planner-you-cant-live-without-2pk6) |         94 | CopilotKit travel UX pattern                  |
| pgvector                   | [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)                                                                                         |         94 | Core semantic search for listings             |
| NaLaMap                    | [https://github.com/nalamap/nalamap](https://github.com/nalamap/nalamap)                                                                                             |         91 | Natural-language map creation                 |
| Google Maps MCP            | [https://github.com/cablate/mcp-google-map](https://github.com/cablate/mcp-google-map)                                                                               |         88 | Agent-to-Google-Maps tooling                  |
| TREK                       | [https://github.com/mauriceboe/TREK](https://github.com/mauriceboe/TREK)                                                                                             |         87 | Self-hosted trip planner, maps, collaboration |
| Geo Explorer               | [https://github.com/topics/travel-planner](https://github.com/topics/travel-planner)                                                                                 |         84 | Gemini + Google Search/Maps grounding idea    |
| AI Travel Agent LangGraph  | [https://github.com/nirbar1985/ai-travel-agent](https://github.com/nirbar1985/ai-travel-agent)                                                                       |         78 | Multi-step travel agent workflow              |
| LLM Maps Assistant         | [https://github.com/dehyabi/llm-maps-assistant](https://github.com/dehyabi/llm-maps-assistant)                                                                       |         76 | Chat-based maps/directions UI                 |

pgvector supports vector similarity search directly inside Postgres, including approximate search and multiple distance types. ([GitHub][5]) TREK is a self-hosted travel planner with collaboration, interactive maps, PWA, SSO, budgets, and packing lists. ([GitHub][6]) NaLaMap focuses on creating/analyzing web maps using natural language. ([GitHub][7])

---

## Best features mdeai should adapt

| Feature                   | Use in mdeai                                      | Stack               |
| ------------------------- | ------------------------------------------------- | ------------------- |
| AI “Ask the city” search  | “Find quiet cafés near Laureles open now”         | CopilotKit + Mastra |
| Map-first answer cards    | Results appear as cards + pins                    | CopilotKit + vis.gl |
| Explainable ranking       | “Why recommended: quiet, high rating, close”      | Mastra + Supabase   |
| Vibe search               | “romantic”, “local”, “work-friendly”, “authentic” | pgvector            |
| Review insight summaries  | Summarize reviews into vibe/trust tags            | Gemini + Places     |
| Group planning            | Shared trip / saved list for friends              | Supabase            |
| Social proof              | Friends saved / visited / liked                   | Supabase later      |
| Dynamic itinerary editing | Drag, swap, add nearby                            | CopilotKit          |
| Location-aware chat       | Use viewport + neighborhood + distance            | Maps + ADK          |
| Trust badges              | Verified by Places, sources, reviews              | Supabase scoring    |

---

## Best architecture pattern

```text
CopilotKit
→ chat UI, cards, actions, generative UI

Mastra
→ router, workflows, scoring, user intent

Google ADK / MCP
→ grounded Maps/Search tools

Places API New
→ factual place data

Supabase
→ source of truth, cache, user saves

pgvector
→ semantic matching and vibe search
```

Use **hybrid search**: structured filters for facts, pgvector for meaning. Timescale’s pgvector guidance recommends combining full-text search with semantic search for better relevance. ([TigerData][8])

---

## Final recommendation

Build mdeai as:

```text
Mindtrip-style AI planner
+ Google Maps-style local grounding
+ Yelp-style review insights
+ Foursquare-style POI intelligence
+ Medellín-only data moat
```

MVP priority:

1. AI city chat
2. Cards + map pins
3. Café / coffee tour intelligence
4. Saved lists
5. Explainable score /100
6. pgvector vibe search
7. User intent chips

Advanced later: friend activity, auto-itineraries, WhatsApp concierge, neighborhood heatmaps, sponsor/local business dashboard.

[1]: https://mindtrip.ai/?utm_source=chatgpt.com "Mindtrip: AI-powered travel, personalized to you."
[2]: https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/?utm_source=chatgpt.com "How we're reimagining Maps with Gemini"
[3]: https://www.tripadvisor.com/Trips?utm_source=chatgpt.com "Free Trip Planner & AI Itinerary Builder"
[4]: https://blog.yelp.com/news/end-of-year-product-release-2024/?utm_source=chatgpt.com "Yelp releases new AI-powered discovery and connection ..."
[5]: https://github.com/pgvector/pgvector?utm_source=chatgpt.com "pgvector/pgvector: Open-source vector similarity search for ..."
[6]: https://github.com/topics/travel-app?utm_source=chatgpt.com "travel-app · GitHub Topics"
[7]: https://github.com/nalamap/nalamap?utm_source=chatgpt.com "NaLaMap is an open-source application to create ..."
[8]: https://www.tigerdata.com/blog/combining-semantic-search-and-full-text-search-in-postgresql-with-cohere-pgvector-and-pgai?utm_source=chatgpt.com "Combining Semantic Search and Full-Text Search"
