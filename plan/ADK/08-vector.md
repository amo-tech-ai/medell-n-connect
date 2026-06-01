A vector DB + research helps **when mdeai needs memory and trusted knowledge**, not just live Google results.

## Simple difference

|Tool|Best for|
|---|---|
|**Google Search**|Current web info|
|**Maps Grounding**|Real places, locations, routes, hours|
|**Vector DB / RAG**|Your saved knowledge, documents, policies, past research, user preferences|

## How it helps mdeai

|Use case|Benefit|
|---|---|
|**Neighborhood guides**|Store your best Medellín research: safety, vibe, prices, coworking, nightlife|
|**Rental intelligence**|Remember apartment notes, lease risks, Wi-Fi quality, host reliability|
|**Event planning**|Store venue docs, sponsor packages, event checklists, past event lessons|
|**Restaurant/tourism**|Keep curated “best of Medellín” recommendations, not just generic Maps results|
|**User memory**|“Show me places like the cafés I liked last week”|
|**Policy/document Q&A**|Host rules, refund policies, ticket rules, rental contract summaries|
|**AI quality**|More consistent answers because it uses your curated knowledge|

## Real example

User asks:

```text
“Should I stay in Laureles or El Poblado for 2 months?”
```

Best answer uses all 3:

```text
Maps Grounding → real cafés, gyms, coworking, commute
Google Search → current events/safety/news
Vector DB → your curated mdeai neighborhood research + past user feedback
```

## Biggest benefit

Vector DB turns mdeai from:

```text
AI that searches each time
```

into:

```text
AI that learns and remembers what matters for Medellín
```

## Best approach

Use **Supabase pgvector** first.

Do not add a separate vector DB yet.

Start with:

|Phase|What to store|
|---|---|
|MVP|Skip or minimal only|
|Phase 2|neighborhood research, venue notes, restaurant notes|
|Phase 3|user preferences, rental reviews, event history|
|Advanced|personalized recommendations + long-term memory|

## Rule of thumb

Use vector DB for:

```text
stored knowledge + memory + research
```

Use Maps/Search for:

```text
live places + current facts
```

Best setup:

```text
Mastra + CopilotKit
→ Google Search/Maps grounding
→ Supabase pgvector memory/research
→ Supabase SQL source of truth
```