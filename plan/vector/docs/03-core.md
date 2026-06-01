### The Core Architectural Mapping

To successfully architect **mdeai.co** into a hyper-localized city super-app for Medellín, we must eliminate generic templates and instead combine specialized, purpose-built tools.

```
       +-------------------------------------------------------+
       |                  COGNITIVE INTERFACE                  |
       |  CopilotKit (Embedded Chat UI) & Mastra (Agent State) |
       +----------------------------+--------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
          v                                                   v
+-------------------------+                         +-------------------------+
|     SPATIAL GROUNDING   |                         |  SEMANTIC GRAPH ENGINE  |
| Google Places API New / |                         |  Supabase + pgvector &  |
| Grounding Lite MCP      |                         |  Gorse (Personalization)|
+-------------------------+                         +-------------------------+
```

- **The Interface** uses **CopilotKit** for embedded chat interfaces and **Mastra** for advanced multi-agent orchestrations.
    
- **The Foundation** grounds these conversations using **Google Places API (New)** and the **Grounding Lite Model Context Protocol (MCP)** to verify location data.
    
- **The Memory and Ranking Engine** handles deep recommendations through **Supabase + pgvector**, bolstered by specialized open-source discovery subsystems.
    

### Part 1: Top 10 GitHub Repositories for mdeai.co Architecture

The open-source components below are scored and selected for their ability to integrate directly into the mdeai.co development stack:

#### 1. pgvector / pgvector

- **Full URL:** [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)
    
- **Tech Stack:** C, PostgreSQL extension (Native to Supabase)
    
- **What it does:** Enables vector similarity searches natively inside your relational database.
    
- **Why it is essential for mdeai.co:** It acts as the core memory bank for the city's vibe-matching engine. Instead of searching rigidly for the text tag `"laptop-friendly"`, you can query review embeddings for semantic expressions like `"great place to work remotely for a few hours with reliable internet"` using a simple SQL statement.
    
- **Score:** **99/100** (Core Foundation)
    

#### 2. BjornMelin / tripsage-ai

- **Full URL:** [https://github.com/BjornMelin/tripsage-ai](https://github.com/BjornMelin/tripsage-ai)
    
- **Tech Stack:** Next.js, React, TypeScript, Vercel AI SDK v6, Supabase, pgvector, Upstash Redis/QStash, Cohere Rerank.
    
- **What it does:** An advanced, production-ready AI travel planner utilizing multi-agent orchestration, hybrid RAG, and automated budget balancing.
    
- **Why it is essential for mdeai.co:** This repository provides an excellent blueprint for managing agent states in a travel app. It includes pre-built TypeScript tools for handling real-time accommodation searches, multi-source RAG pipelines, and responsive data streaming.
    
- **Score:** **96/100** (Highly Reusable UI/Agent Patterns)
    

#### 3. gorse-io / gorse (or zhenghaoz/gorse)

- **Full URL:** [https://github.com/gorse-io/gorse](https://github.com/gorse-io/gorse)
    
- **Tech Stack:** Go, gRPC, Collaborative Filtering / Factorization Machines, Redis, PostgreSQL.
    
- **What it does:** A specialized, high-performance open-source recommendation system engine designed to ingest user interaction metrics (clicks, shares, bookmarks, ignores) and dynamically train personalized feeds.
    
- **Why it is essential for mdeai.co:** While LLMs handle conversational logic well, they cannot build complex collaborative filtering profiles at scale. Gorse can track implicit signals—like a digital nomad bookmarking three specialty cafes in Laureles—and instantly bubble up similar neighborhood micro-gems to their home feed.
    
- **Score:** **94/100** (Discovery Engine Backbone)
    

#### 4. jonathanscholtes / Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store

- **Full URL:** [https://github.com/jonathanscholtes/Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store](https://github.com/jonathanscholtes/Travel-AI-Agent-React-FastAPI-and-Cosmos-DB-Vector-Store)
    
- **Tech Stack:** React, FastAPI, Python, LangChain, Vector Store Indexing.
    
- **What it does:** Demonstrates an end-to-end multi-agent framework tailored to parse incoming natural language strings into distinct geographical search intents.
    
- **Why it is essential for mdeai.co:** The FastAPI route routing structures can be adapted directly into Mastra tools, allowing mdeai.co to parse complex multi-destination input prompts into structured JSON coordinates.
    
- **Score:** **88/100** (Solid API Structure)
    

#### 5. talk2dharun / The-Multi-Modal-Agentic-Workflow

- **Full URL:** [https://github.com/talk2dharun/The-Multi-Modal-Agentic-Workflow](https://github.com/talk2dharun/The-Multi-Modal-Agentic-Workflow)
    
- **Tech Stack:** Python, Multi-Modal Vision LLMs, LangGraph, RAG Tools.
    
- **What it does:** Orchestrates agent workflows that process both textual inputs and multi-modal image contexts.
    
- **Why it is essential for mdeai.co:** Perfect for building features where a user uploads a screenshot of an un-tagged Instagram Reel showing an hidden rooftop bar in El Poblado. The multi-modal agent processes the visual data, queries the database, and matches it to a real location pin.
    
- **Score:** **87/100** (Vision-Discovery Integration)
    

#### 6. nmslib / hnswlib

- **Full URL:** [https://github.com/nmslib/hnswlib](https://github.com/nmslib/hnswlib)
    
- **Tech Stack:** C++ header-only library for Hierarchical Navigable Small World graphs.
    
- **What it does:** The reference standard implementation for lightning-fast approximate nearest neighbor vector searches.
    
- **Why it is essential for mdeai.co:** Deeply informative for learning how vector index configurations handle rapid mathematical vector matching behind the scenes. In production, this algorithm can be implemented using Supabase’s internal `pgvector` HNSW indexes (`IndexType.hnsw`).
    
- **Score:** **85/100** (Invaluable Optimization Reference)
    

#### 7. Agentic-AI-Travel-Planner / AI-Smart-Travel-Planner-AgenticAI-Project

- **Full URL:** [https://github.com/Agentic-AI-Travel-Planner/AI-Smart-Travel-Planner-AgenticAI-Project](https://github.com/Agentic-AI-Travel-Planner/AI-Smart-Travel-Planner-AgenticAI-Project)
    
- **Tech Stack:** Python, CrewAI/LangGraph, Google Gemini API, Streamlit.
    
- **What it does:** Implements agent coordination loops where a dedicated researcher agent compiles data, a logistics agent builds routes, and a supervisor agent audits the output for structural errors.
    
- **Why it is essential for mdeai.co:** Can be adapted straight into Mastra workflow workflows to prevent conversational drift when building complex multi-day itineraries for exploring Medellín.
    
- **Score:** **84/100** (Clean Logic Framework)
    

#### 8. BjornMelin / ai-docs-vector-db-hybrid-scraper

- **Full URL:** [https://github.com/BjornMelin/ai-docs-vector-db-hybrid-scraper](https://github.com/BjornMelin/ai-docs-vector-db-hybrid-scraper)
    
- **Tech Stack:** Python, Playwright, BeautifulSoup, Vector DB ingestion pipelines.
    
- **What it does:** A scraping pipeline that aggregates raw web documents, parses messy layouts, extracts semantic entities, and structures them into vectorized payloads.
    
- **Why it is essential for mdeai.co:** Use this to scrape, parse, and clean unstructured data from local Medellín event directories, expat forums, and Telegram channel schedules before saving them directly into Supabase.
    
- **Score:** **83/100** (Data Ingestion Utility)
    

#### 9. shashank29-p/travel-planner-with-RAG

- **Full URL:** [https://github.com/shashank29-p/travel-planner-with-RAG](https://github.com/shashank29-p/travel-planner-with-RAG)
    
- **Tech Stack:** Python, LlamaIndex, ChromaDB, OpenAI.
    
- **What it does:** A clean, lightweight Retrieval-Augmented Generation implementation focused on surfacing curated text blocks from contextual travel handbooks.
    
- **Why it is essential for mdeai.co:** Demonstrates how to build clear explanations for why a place is being recommended ("Surfaced because three independent blogs highlighted its outdoor patio layout").
    
- **Score:** **81/100** (Reference for Basic RAG)
    

#### 10. mauriceboe / TREK

- **Full URL:** [https://github.com/mauriceboe/TREK](https://github.com/mauriceboe/TREK)
    
- **Tech Stack:** Python, Spatial Trajectory Data Mining Frameworks.
    
- **What it does:** Focuses on optimizing spatial data pathways and mining common patterns from user trajectories across geographic networks.
    
- **Why it is essential for mdeai.co:** Provides valuable models for calculating route efficiencies, helping ensure itineraries naturally group nearby places instead of making users crisscross the city uncomfortably.
    
- **Score:** **80/100** (Mathematical Route Optimization)
    

### Part 2: Top 10 Core vs. Advanced Real-World Use Cases

The matrix below shows exactly how these engineering tools can be converted into human experiences for mdeai.co users.

|**Feature Use Case**|**Type**|**Human-Understandable Real World Example**|**Tech Stack Execution Model**|**Core Implementation Blueprint**|
|---|---|---|---|---|
|**1. Dynamic Interactive Map Anchoring**|**Core (MVP)**|A nomad texts: _"Show me specialty cafes in Laureles."_ The app sidebar replies with a brief breakdown, while the map canvas automatically pans, draws a clean neighborhood border, and highlights three specific café pins instantly.|`CopilotKit` coordinates the active state management across both the chat text thread and the `Google ADK/Maps` instance viewports.|As the LLM returns structured JSON tokens for location results, `CopilotKit` catches the payload hook and triggers a frontend re-render on the map canvas layer.|
|**2. Dynamic "Activity Swapping" Canvas**|**Core (MVP)**|While reviewing an itinerary for Tuesday afternoon, the user decides they don't want to go to a museum. They click a small "Swap" button on that card. The app opens a small text box suggesting three nearby, open alternatives that match the rest of their afternoon's vibe.|`CopilotKit` renders responsive, context-aware action components inside the message thread, while `Mastra` handles the replacement query.|When the user triggers the swap event, `Mastra` uses the location's lat/long to query `pgvector` for nearby alternatives, then updates the user's active session array in Supabase.|
|**3. High-Fidelity Multi-Agent Validation**|**Core (MVP)**|A traveler asks to book a guided coffee tour in Santa Elena for next Monday. The app quickly double-checks everything, warning them: _"The farm is open, but Monday is a Colombian holiday, meaning the Metrocable line will have long lines. Let's move this to Tuesday morning instead."_|`Mastra` coordinates two sub-agents: one querying live operating metrics via the `Places API New`, and a second checking a local holiday calendar.|`Mastra` runs these validation checks in parallel. If any conditional errors are found, the layout prompts `Gemini` to generate a helpful alternative message for the user.|
|**4. Explanatory "AI Justification" Cards**|**Core (MVP)**|Below a hotel suggestion card, the UI explicitly displays a short notice: _"Recommended because you specified a need for a quiet workspace; 12 recent remote-worker reviews note its reliable fiber internet and minimal street noise."_|`Gemini` reviews text chunks fetched from `Supabase`, extracts the matching reasons, and formats them into a clean, easy-to-read layout.|The system extracts metadata tags along with the vector results, using a structured JSON schema to populate a dedicated `"justification"` field on the frontend card.|
|**5. Digital Nomad "Workability" Index**|**Core (MVP)**|A remote worker searches for a workspace. The app instantly filters out standard bakeries, highlighting spaces that feature validated high-speed Wi-Fi network records, accessible power outlets, and comfortable seating.|`Supabase` stores crowdsourced technical details and uses `pgvector` to identify remote-work keywords across user reviews.|The app applies an explicit SQL filter (`wifi_speed > 50`) directly alongside the semantic search query to ensure every result is functionally practical.|
|**6. Micro-Neighborhood Vibe Polygons**|**Advanced**|A user asks for a trendy, walkable street corner with an artistic flair. Instead of highlighting the entire massive El Poblado district, the map draws a precise, accurate boundary around the sub-neighborhood of Manila.|`Supabase` utilizes spatial boundary data (`PostGIS` extensions) paired with review embeddings grouped by geographic clusters.|The system uses database spatial functions to group high-density vector pin clusters, drawing a customized, translucent polygon overlay directly on the `Google Maps` canvas.|
|**7. Real-Time Weather-Adaptive Rerouting**|**Advanced**|It starts pouring rain while a user is walking around Comuna 13. The app sends a proactive alert: _"Heavy rain has started over San Javier. I've paused your outdoor tour; walk 3 minutes over to this indoor gallery and cafe until it clears up."_|`Mastra` hooks into live local weather data feeds, using conditional logic parameters to update the active itinerary context.|A background worker routinely monitors the user's location against local weather alerts. If rain is detected, it triggers a specialized prompt to generate a helpful rerouting message.|
|**8. Multi-Modal Vision Discovery**|**Advanced**|A user uploads an un-tagged screenshot from an Instagram reel showing a beautiful, hidden jungle patio. The app analyzes the image, identifies the unique architecture, and says: _"That's the hidden courtyard at Café Krema in Envigado. I've saved the location on your map."_|`The Multi-Modal Agentic Workflow` pattern uses vision-capable models to extract key visual features, which are then compared against image assets in the database.|The vision pipeline extracts notable landmarks or descriptive visual elements from the image, converting them into textual descriptions to match against place profiles.|
|**9. Hyperlocal Event Scraping & Indexing**|**Advanced**|A user asks: _"What's happening tonight?"_ The app displays an interactive map pinpointing an underground salsa social and a language exchange happening down the street, both scraped from a local community forum earlier that morning.|`ai-docs-vector-db-hybrid-scraper` routines scan local community boards, while `Gemini` parses the messy text into clean, structured event database entries.|A scheduled background script pulls unstructured updates from target web locations, cleans the text using an LLM to identify dates and times, and saves the verified entries into `Supabase`.|
|**10. Deep Collaborative Filtering Engine**|**Advanced**|When a user opens the app home screen, it automatically surfaces a list of lesser-known spots tailored precisely to their tastes, without them needing to type a single word into the chat.|`gorse` acts as a background recommendation system, evaluating user interaction metrics like clicks, favorites, and trip saves.|The system feeds user activity updates directly into the `Gorse` API. Every night, the engine updates its collaborative filtering models to generate personalized recommendation lists for each user.|

### Part 3: Step-by-Step Practical Implementation Blueprint

Here is how you can practically implement **Use Case #1 (Dynamic Interactive Map Anchoring)** using your specific development stack:

#### 1. The Mastra Backend Agent Tool

Define a custom tool inside **Mastra** that allows **Gemini** to search for venues and return structured geospatial coordinates.

TypeScript

```
// backend/agents/travelAgent.ts
import { Tool } from 'mastra';
import { supabase } from '../db';

export const venueSearchTool = new Tool({
  id: 'venue-search-tool',
  description: 'Searches for venues in Medellín by semantic vibe and neighborhood.',
  inputSchema: {
    type: 'object',
    properties: {
      vibePrompt: { type: 'string', description: 'The semantic vibe, e.g., cozy, quiet, laptop-friendly' },
      neighborhood: { type: 'string', description: 'Specific neighborhood like Laureles or Poblado' }
    },
    required: ['vibePrompt', 'neighborhood']
  },
  execute: async ({ input }) => {
    // 1. Generate an embedding vector for the incoming user prompt string
    const embeddingResponse = await openAI.embeddings.create({
      model: "text-embedding-3-small",
      input: input.vibePrompt,
    });
    const [{ embedding }] = embeddingResponse.data;

    // 2. Query Supabase using pgvector matching logic
    const { data: venues, error } = await supabase.rpc('hybrid_search_venues', {
      query_embedding: embedding,
      match_threshold: 0.70,
      target_neighborhood: input.neighborhood
    });

    // 3. Return a clean, structured JSON payload that the client application can read
    return {
      message: `Found the top matching spots in ${input.neighborhood}`,
      mapFocus: {
        neighborhood: input.neighborhood,
        zoomLevel: 14
      },
      pins: venues.map((v: any) => ({
        id: v.id,
        name: v.name,
        latitude: v.latitude,
        longitude: v.longitude,
        vibeSummary: v.short_description
      }))
    };
  }
});
```

#### 2. The Frontend CopilotKit Connection

Use **CopilotKit** on the frontend to listen for the tool's execution data, allowing it to seamlessly update the interactive map without requiring a full page refresh.

TypeScript

```
// frontend/components/CityPortal.tsx
import React, { useState } from 'react';
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { GoogleMap, MarkerF } from '@react-google-maps/api';

export default function CityPortal() {
  const [mapCenter, setMapCenter] = useState({ lat: 6.2442, lng: -75.5812 }); // Default Medellín view
  const [activePins, setActivePins] = useState([]);

  // Provide contextual portal data back to CopilotKit's internal memory
  useCopilotReadable({
    description: "The user's current view state on the map canvas.",
    value: { mapCenter, activePinsCount: activePins.length }
  });

  // Register a frontend action hook that triggers automatically when the backend agent executes its search tool
  useCopilotAction({
    name: "updateMapCanvasState",
    description: "Updates the map viewport coordinates and pin locations based on the agent's discoveries.",
    parameters: [
      { name: "centerLat", type: "number" },
      { name: "centerLng", type: "number" },
      { name: "pins", type: "object" }
    ],
    handler: async ({ centerLat, centerLng, pins }) => {
      setMapCenter({ lat: centerLat, lng: centerLng });
      setActivePins(pins);
    },
  });

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={14}
        >
          {activePins.map((pin: any) => (
            <MarkerF 
              key={pin.id} 
              position={{ lat: pin.latitude, lng: pin.longitude }}
              title={pin.name}
              icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />
          ))}
        </GoogleMap>
      </div>
      
      {/* Dynamic Conversational Sidebar Frame */}
      <CopilotSidebar
        instructions={"You are the expert local concierge agent for mdeai.co in Medellín. Help users discover the absolute best places in town."}
        defaultOpen={true}
      />
    </div>
  );
}
```