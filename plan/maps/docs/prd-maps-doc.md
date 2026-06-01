# Google Maps V2 Plan for mdeai

## 1. Core Rule

**Google Maps displays spatial truth. Mastra decides what to search. Supabase stores truth. CopilotKit renders the AI UI. Gemini explains results.**

Do not let the LLM invent:

* coordinates
* place IDs
* Google Maps URLs
* opening hours
* distances

Use Google Maps / Places tools for that.

---

## 2. Recommended Stack

| Layer         | Tool                          | Use                                    |
| ------------- | ----------------------------- | -------------------------------------- |
| React Maps    | `@vis.gl/react-google-maps`   | Main React map wrapper                 |
| Map rendering | Google Maps JS API            | Base map                               |
| Markers       | Advanced Markers              | Rental/event/restaurant pins           |
| Clustering    | `@googlemaps/markerclusterer` | Many pins                              |
| Places data   | Places API New                | Place IDs, details, photos, URLs       |
| AI geo search | Maps Grounding Lite MCP       | Grounded place search, routes, weather |
| AI docs       | `googlemaps/platform-ai`      | Cursor/Claude Maps doc grounding       |
| UI helpers    | Extended Component Library    | Place picker, place overview, overlays |
| Orchestration | Mastra                        | Agents/tools/workflows                 |
| AI frontend   | CopilotKit                    | Cards, actions, approvals              |
| Data          | Supabase                      | Listings, cache, leads, logs           |

Grounding Lite gives AI apps MCP access to Google Maps places, weather, and routes. ([Google for Developers][1])
`vis.gl/react-google-maps` is the React component library for the Google Maps JavaScript API. ([VisGl][2])

---

## 3. GitHub Repos to Use

| Repo                                                                                                                                       | Score | Use                                           | Action         |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ----: | --------------------------------------------- | -------------- |
| [https://github.com/visgl/react-google-maps](https://github.com/visgl/react-google-maps)                                                   |    96 | React map foundation                          | Install        |
| [https://github.com/googlemaps/js-api-samples](https://github.com/googlemaps/js-api-samples)                                               |    95 | Official marker, routes, Places examples      | Reference      |
| [https://github.com/googlemaps/js-markerclusterer](https://github.com/googlemaps/js-markerclusterer)                                       |    94 | Cluster apartment/event pins                  | Install        |
| [https://github.com/googlemaps/extended-component-library](https://github.com/googlemaps/extended-component-library)                       |    90 | Place picker, place overview, mobile overlays | Install later  |
| [https://github.com/googlemaps/platform-ai](https://github.com/googlemaps/platform-ai)                                                     |    95 | Maps Code Assist MCP for Cursor               | Use dev-time   |
| [https://github.com/googlemaps-samples/grounding-lite-mcp-sample-app](https://github.com/googlemaps-samples/grounding-lite-mcp-sample-app) |    93 | Grounding Lite MCP patterns                   | Port patterns  |
| [https://github.com/Greyisheep/ag-ui-adk-grounding-app](https://github.com/Greyisheep/ag-ui-adk-grounding-app)                             |    78 | AG-UI grounded UX ideas                       | Reference only |
| [https://github.com/google-gemini/cookbook](https://github.com/google-gemini/cookbook)                                                     |    82 | Gemini tool/structured output patterns        | Reference      |
| [https://github.com/cablate/mcp-google-map](https://github.com/cablate/mcp-google-map)                                                     |    70 | Extra MCP ideas                               | Research only  |

Google’s `platform-ai` repo provides an MCP server that grounds coding assistants in official Google Maps docs and samples. ([GitHub][3])

---

## 4. Core Features

### Rentals Map

Show:

* apartment pins
* price badges
* Wi-Fi score
* rating
* neighborhood
* selected pin state
* card preview on click

Example:

> “Show me 1BR apartments in Laureles under $1,500 near coworking.”

Flow:

```text
CopilotKit chat
→ Mastra rental-discovery workflow
→ Supabase apartment rows
→ Places nearby coworking search
→ Hermes ranking
→ Rental cards + map pins
```

---

### Nearby Intelligence

For each rental, show:

* cafés nearby
* coworking nearby
* gyms nearby
* metro distance
* nightlife distance
* quietness score

Use:

* Places API New Nearby Search
* Place Details
* Routes API
* cached Supabase results

---

### Grounded Place Search

Example:

> “quiet cafés near Parque Lleras”

Flow:

```text
User prompt
→ Mastra searchGroundedPlaces tool
→ Maps Grounding Lite MCP
→ GroundedPlaceResult[]
→ CopilotKit renders cards
→ MapContext adds pins
```

Every grounded card must show Google attribution. Your docs require grounded results to use attribution and not rely on hallucinated map data. 

---

## 5. Advanced Features

| Feature                  | Description                              |
| ------------------------ | ---------------------------------------- |
| Digital Nomad Score      | Wi-Fi, coworking, cafés, safety, commute |
| Neighborhood Profiles    | Laureles vs Poblado vs Envigado          |
| Commute Score            | Time to coworking, metro, event venues   |
| Lifestyle Match          | “quiet remote work” vs “nightlife”       |
| Venue Intelligence       | Best event venues near target audience   |
| Route Preview            | apartment → coworking → event route      |
| Place Photo Cards        | real venue/restaurant photos             |
| Map Itinerary            | day-by-day map plan                      |
| Grounded Recommendations | AI answers backed by Google Maps         |

---

## 6. Mastra Agents

| Agent                  | Job                           |
| ---------------------- | ----------------------------- |
| Maps Router Agent      | Decide maps intent            |
| Rental Discovery Agent | Search listings + map results |
| Grounded Places Agent  | Use Maps Grounding Lite MCP   |
| Neighborhood Agent     | Compare areas                 |
| Venue Agent            | Find event venues             |
| Nearby Agent           | Find cafés, gyms, restaurants |
| Route Agent            | Compute commute and routes    |
| Evaluation Agent       | Check result quality          |

---

## 7. Core Workflows

### Workflow 1: Rental Search

```text
User asks for apartment
→ parse budget/neighborhood
→ query Supabase apartments
→ enrich with Places nearby data
→ rank with Hermes
→ render cards + pins
```

### Workflow 2: Show Nearby

```text
User clicks “Show nearby”
→ get rental lat/lng
→ Nearby Search cafés/gyms/coworking
→ cache in Supabase
→ render nearby cards + pins
```

### Workflow 3: Grounded AI Search

```text
User asks open-ended place question
→ searchGroundedPlaces
→ Maps Grounding Lite MCP
→ validate with Zod
→ show attribution
→ render pins
```

### Workflow 4: Venue Discovery

```text
Host describes event
→ venue search
→ Places Autocomplete / Text Search
→ venue cards
→ map pins
→ user approves venue
```

---

## 8. Phased Roadmap

### Core

* MapContext single pin truth
* Google Maps JS API stable loader
* Supabase `place_id`, `maps_url`, `lat/lng`
* Advanced Markers with Map ID
* Basic rental/event pins

### MVP

* `@vis.gl/react-google-maps`
* rental pins + cards
* nearby cafés/coworking
* `searchGroundedPlaces` Mastra tool
* Google attribution
* Places API New field masks
* Supabase cache tables

### Post-MVP

* marker clustering
* place photos
* autocomplete for venues
* route previews
* neighborhood profiles
* digital nomad score

### Advanced

* map-based itinerary planner
* Gemini grounded trip planning
* OpenClaw WhatsApp map workflows
* sponsor/venue intelligence
* predictive neighborhood scoring
* multi-city expansion

---

## 9. Implementation Order

```text
1. Prove chat → Mastra → action → MapContext → pins
2. Add searchGroundedPlaces Mastra tool
3. Add GroundingAttribution component
4. Build Places API New server client with field masks
5. Add Supabase places cache
6. Add Nearby Search
7. Migrate map UI to vis.gl/react-google-maps
8. Add Advanced Markers
9. Add marker clustering
10. Add Place Autocomplete
11. Add Route previews
12. Add neighborhood intelligence
```

---

## 10. Tests Required

| Test                     | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| Vitest map action test   | tool output becomes map pins              |
| Playwright chat-map test | user prompt creates visible pins          |
| Field mask test          | no Places call without `X-Goog-FieldMask` |
| Attribution test         | grounded cards show Google attribution    |
| Map ID test              | Advanced Markers have real Map ID         |
| Cache test               | repeat Places queries hit Supabase        |
| RLS test                 | users cannot write cache tables           |
| Mobile map test          | 390px layout works                        |
| Floor gate               | `npm run floor` green                     |

---

## 11. What NOT to Build Now

Avoid:

* 3D maps
* heatmaps
* fleet tracking
* navigation SDK
* Android/iOS SDKs
* autonomous map agents
* scraping Google Maps
* user location tracking
* Contextual View until stable
* Maps as the decision layer

Your docs already warn that Maps should render, not orchestrate; Mastra owns workflow decisions. 

---

## 12. Final Recommendation

Start with this stack:

```bash
npm install @vis.gl/react-google-maps
npm install @googlemaps/markerclusterer
npm install @googlemaps/extended-component-library
npm install -D @googlemaps/jest-mocks
```

Build first:

```text
Rental cards + map pins
→ Nearby coworking/cafés
→ Grounded place search
→ Places cache
→ vis.gl migration
→ clustering
```

Best strategic move: **make Maps the real-world proof layer for the AI concierge.**
When the AI says “this apartment is good for remote work,” the map should prove it with cafés, coworking, commute time, and real Google place data.

[1]: https://developers.google.com/maps/ai/grounding-lite?utm_source=chatgpt.com "Maps Grounding Lite | Google Maps Platform"
[2]: https://visgl.github.io/react-google-maps/?utm_source=chatgpt.com "Home | React Google Maps"
[3]: https://github.com/googlemaps/platform-ai?utm_source=chatgpt.com "googlemaps/platform-ai"
