You can use the **ADK “Coding with AI” tutorial** as a setup guide to make Cursor better at building ADK agents correctly.

## What it gives you

|Feature|What it does|How it helps mdeai|
|---|---|---|
|**Agents CLI**|Scaffolds, evaluates, deploys ADK agents|Quickly create a Google grounding service|
|**ADK Dev Skills**|Gives Cursor ADK-specific knowledge|Less hallucinated ADK code|
|**ADK Docs MCP Server**|Lets Cursor query official ADK docs|Better implementation accuracy|
|**ADK Docs Index**|Machine-readable docs for AI coding tools|Better context for Cursor|
|**Eval command**|Runs ADK agent evaluations|Test search/maps agent quality|
|**Deploy command**|Deploys to Agent Runtime, Cloud Run, or GKE|Future production path|

Google’s guide says ADK coding assistants can be improved by installing ADK development skills or connecting to ADK docs through MCP. It also lists `agents-cli scaffold create`, `agents-cli eval`, and `agents-cli deploy` as core commands. ([Agent Development Kit](https://adk.dev/tutorials/coding-with-ai/?utm_source=chatgpt.com "Code with AI - Agent Development Kit (ADK)"))

## Best use for mdeai

Use it to create a small ADK grounding service:

```text
adk-grounding-service
├── search_grounded_events
├── search_grounded_places
├── maps_grounded_nearby
├── neighborhood_context
└── itinerary_builder
```

Then Mastra calls it as a tool.

## Recommended architecture

```text
CopilotKit UI
→ Mastra routerAgent
→ Mastra tool: googleGroundingTool()
→ ADK service
→ Gemini + Google Search/Maps grounding
→ structured JSON
→ Supabase cache
→ CopilotKit cards + map pins
```

## Real-world examples

|User asks|ADK service returns|
|---|---|
|“Events tonight near Provenza”|grounded event list + venue context|
|“Quiet cafés near Laureles”|real places, hours, ratings, map URLs|
|“What’s near this apartment?”|cafés, gyms, coworking, nightlife|
|“Plan my Saturday in Medellín”|route-aware itinerary|
|“Find a venue for 150 people”|venue options + why they fit|

## Best Cursor prompt

```markdown
Review the ADK Coding with AI tutorial and set up our project so Cursor can build ADK agents correctly.

Goals:
1. Install or document ADK Dev Skills / ADK Docs MCP for Cursor.
2. Create a small ADK grounding service for mdeai.
3. Add tools:
   - search_grounded_places
   - search_grounded_events
   - search_nearby_context
   - explain_neighborhood
   - build_grounded_itinerary
4. Use Gemini + Google Search/Maps grounding.
5. Return strict JSON for Mastra:
   - title
   - category
   - address
   - lat
   - lng
   - rating
   - hours
   - maps_url
   - source_urls
   - why_recommended
6. Do not let ADK write directly to Supabase.
7. Mastra remains the main orchestrator.
8. Supabase remains the source of truth and cache.
9. Add tests/evals for grounded output quality.
10. Produce a short implementation report with files changed, commands used, and risks.
```

## Final answer

Use the tutorial to make **Cursor ADK-aware**, then build **one ADK grounding microservice**.  
Do not replace Mastra; let Mastra call ADK only when Google Search/Maps grounding is needed.