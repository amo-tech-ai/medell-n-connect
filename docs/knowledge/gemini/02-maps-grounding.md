# Grounding with Google Maps

> Connect Gemini to Google Maps for location-aware, factual responses.

**Source:** [Google AI Docs](https://ai.google.dev/gemini-api/docs/grounding)

---

## Overview

Grounding with Google Maps enables:
- **Accurate, location-aware responses** — Leverage Google Maps' extensive data
- **Enhanced personalization** — Tailor recommendations by location
- **Contextual widgets** — Render interactive Google Maps alongside content

⚠️ **Note:** Grounding with Google Maps is NOT available with Gemini 3. Use Gemini 2.5 models.

---

## Quick Start

### JavaScript

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function generateContentWithMapsGrounding() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What are the best Italian restaurants within a 15-minute walk from here?",
    config: {
      // Turn on grounding with Google Maps
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          // Provide location context (Los Angeles example)
          latLng: {
            latitude: 34.050481,
            longitude: -118.248526,
          },
        },
      },
    },
  });

  console.log("Generated Response:");
  console.log(response.text);

  const grounding = response.candidates[0]?.groundingMetadata;
  if (grounding?.groundingChunks) {
    console.log("-".repeat(40));
    console.log("Sources:");
    for (const chunk of grounding.groundingChunks) {
      if (chunk.maps) {
        console.log(`- [${chunk.maps.title}](${chunk.maps.uri})`);
      }
    }
  }
}
```

### Python

```python
from google import genai
from google.genai import types

client = genai.Client()

prompt = "What are the best Italian restaurants within a 15-minute walk from here?"

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=prompt,
    config=types.GenerateContentConfig(
        tools=[types.Tool(google_maps=types.GoogleMaps())],
        tool_config=types.ToolConfig(retrieval_config=types.RetrievalConfig(
            lat_lng=types.LatLng(
                latitude=34.050481, longitude=-118.248526))),
    ),
)

print("Generated Response:")
print(response.text)

if grounding := response.candidates[0].grounding_metadata:
    if grounding.grounding_chunks:
        print('-' * 40)
        print("Sources:")
        for chunk in grounding.grounding_chunks:
            print(f'- [{chunk.maps.title}]({chunk.maps.uri})')
```

---

## How It Works

1. **User Query** — User submits query with geographical context
2. **Tool Invocation** — Gemini recognizes geographical intent, invokes Maps tool
3. **Data Retrieval** — Queries Google Maps for places, reviews, hours, etc.
4. **Grounded Generation** — Retrieved data informs the response
5. **Response + Widget Token** — Returns text with citations and optional widget token

---

## API Parameters

### Basic Request

```json
{
  "contents": [{
    "parts": [
      {"text": "Restaurants near Times Square."}
    ]
  }],
  "tools": { "googleMaps": {} }
}
```

### With Widget Enabled

```json
{
  "contents": [{
    "parts": [
      {"text": "Restaurants near Times Square."}
    ]
  }],
  "tools": { "googleMaps": { "enableWidget": true } }
}
```

### With Location Context

```json
{
  "contents": [{
    "parts": [
      {"text": "Restaurants near here."}
    ]
  }],
  "tools": { "googleMaps": {} },
  "toolConfig": {
    "retrievalConfig": {
      "latLng": {
        "latitude": 40.758896,
        "longitude": -73.985130
      }
    }
  }
}
```

---

## Response Structure

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "CanteenM is an American restaurant with..."
          }
        ],
        "role": "model"
      },
      "groundingMetadata": {
        "groundingChunks": [
          {
            "maps": {
              "uri": "https://maps.google.com/?cid=13100894621228039586",
              "title": "Heaven on 7th Marketplace",
              "placeId": "places/ChIJ0-zA1vBZwokRon0fGj-6z7U"
            }
          }
        ],
        "groundingSupports": [
          {
            "segment": {
              "startIndex": 0,
              "endIndex": 79,
              "text": "CanteenM is an American restaurant..."
            },
            "groundingChunkIndices": [0]
          }
        ],
        "googleMapsWidgetContextToken": "widgetcontent/..."
      }
    }
  ]
}
```

### Key Fields

| Field | Description |
|-------|-------------|
| `groundingChunks` | Maps sources with `uri`, `placeId`, `title` |
| `groundingSupports` | Links text segments to sources |
| `googleMapsWidgetContextToken` | Token for rendering Places widget |

---

## Use Cases

### Place-Specific Questions
```typescript
const prompt = "Is there a cafe near the corner of 1st and Main that has outdoor seating?";
```

### Location-Based Personalization
```typescript
const prompt = "Which family-friendly restaurants near here have the best playground reviews?";
```

### Itinerary Planning
```typescript
const prompt = "I'm visiting Tokyo for 3 days. Can you plan a day-by-day itinerary?";
// Enable widget for interactive map
config.tools = [{ googleMaps: { enableWidget: true } }];
```

---

## Displaying the Widget

To render the `googleMapsWidgetContextToken`:

1. Load Google Maps JavaScript API
2. Use the `<gmp-places-contextual>` component

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places"></script>
<gmp-places-contextual context-token="widgetcontent/..."></gmp-places-contextual>
```

---

## ILM Integration

For I Love Medellín, Maps grounding is ideal for:
- **Restaurant discovery** — "Best Italian restaurants in El Poblado"
- **Trip planning** — "Things to do near Parque Lleras"
- **Local recommendations** — "Coffee shops with outdoor seating in Laureles"

### Edge Function Pattern

```typescript
// supabase/functions/ai-local-search/index.ts
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: userQuery,
  config: {
    tools: [{ googleMaps: {} }],
    toolConfig: {
      retrievalConfig: {
        latLng: {
          latitude: 6.2476, // Medellín
          longitude: -75.5658,
        },
      },
    },
  },
});
```

---

## Model Compatibility

| Model | Maps Grounding |
|-------|----------------|
| Gemini 3 | ❌ Not available |
| Gemini 2.5 Pro | ✅ |
| Gemini 2.5 Flash | ✅ |

---

## Related

- [Google Search Grounding](./01-google-search.md)
- [URL Context](./03-url-context.md)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
