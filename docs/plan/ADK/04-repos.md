You can use that ADK travel repo as a **prototype/reference for mdeai’s Google Maps intelligence**, not as your main app foundation.

## What the repo gives you

|Feature|What it does|mdeai use|
|---|---|---|
|Travel recommendation agent|Suggests attractions/restaurants near an origin|Tourist concierge|
|Google Maps MCP server|Gives agent Maps tools through MCP|Grounded place search|
|Attractions search|Finds things to do nearby|Medellín tourism|
|Restaurant search|Finds food near user/location|Restaurant cards|
|Origin-based planning|Starts from a hotel/apartment/address|“What’s near this rental?”|
|ADK agent structure|Shows specialist agent pattern|Maps specialist under Mastra|
|User preference handling|Can tune recommendations|Digital nomad preferences|
|Improved travel flow|More complete travel UX|Itinerary planner|
|MCP tool pattern|External tool server pattern|Maps grounding service|
|Local testing loop|Fast prototype|Validate before porting|

Source note: the repo describes an improved travel recommendation agent using a Google Maps MCP server and newer ADK features; earlier versions warned directions/distance may be wrong, so verify before production. ([GitHub](https://github.com/Neutrollized/adk-examples?utm_source=chatgpt.com "Agent Development Kit (ADK) examples"))

## Best way to use it

```text
CopilotKit UI
→ Mastra routerAgent
→ Mastra calls “mapsGroundingTool”
→ ADK travel/Maps service handles Google Maps reasoning
→ Return structured JSON
→ Supabase caches results
→ CopilotKit renders cards + map pins
```

## mdeai features to build from it

|mdeai feature|Real-world example|Priority|
|---|---|--:|
|Nearby restaurants|“Quiet cafés near Laureles open now”|10/10|
|Tourist attractions|“Best things to do near El Poblado”|9/10|
|Apartment lifestyle context|“What’s near this rental?”|10/10|
|Event venue discovery|“Venues for 150-person fashion event”|9/10|
|Itinerary planner|“Plan Saturday in Medellín”|9/10|
|Neighborhood comparison|“Laureles vs Manila for remote work”|10/10|

## What to copy

|Copy|Why|
|---|---|
|Google Maps MCP tool pattern|Fastest path to Maps tools|
|Agent/tool structure|Clean specialist architecture|
|Travel recommendation prompts|Adapt to Medellín concierge|
|Origin-based nearby search|Perfect for rentals|
|Local test setup|Validate quickly|

## What not to copy

|Avoid|Why|
|---|---|
|Replacing Mastra|Adds second main brain|
|Trusting distance blindly|Repo itself notes earlier distance issues|
|Letting ADK write to Supabase|Mastra/Supabase should control business writes|
|Full itinerary system in MVP|Nice, but not first revenue blocker|

## Best first task

Build one tool:

```text
searchNearbyMedellinPlaces({
  origin,
  category,
  userIntent,
  radiusKm
})
```

Return:

```text
name
category
address
rating
hours
lat
lng
mapsUrl
whyRecommended
source
```

Then use it for:

- rental nearby enrichment
    
- restaurants
    
- attractions
    
- venue discovery
    
- tourist chat
    

Final recommendation: **use the repo to build your Maps grounding specialist, then wrap it inside Mastra.**