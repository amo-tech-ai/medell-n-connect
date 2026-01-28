# URL Context Tool

> Provide additional context to Gemini by including specific URLs.

**Source:** [Google AI Docs](https://ai.google.dev/gemini-api/docs/url-context)

---

## Overview

The URL Context tool allows Gemini to access content from URLs you provide, enabling:
- **Extract Data** — Pull specific info like prices, names, key findings
- **Compare Documents** — Analyze multiple reports, articles, or PDFs
- **Synthesize Content** — Combine information from sources to generate summaries
- **Analyze Code & Docs** — Point to GitHub repos or documentation

---

## Quick Start

### JavaScript

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      "Compare the ingredients and cooking times from the recipes at https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592 and https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/",
    ],
    config: {
      tools: [{ urlContext: {} }],
    },
  });
  
  console.log(response.text);

  // Verify which URLs were retrieved
  console.log(response.candidates[0].urlContextMetadata);
}
```

### Python

```python
from google import genai
from google.genai.types import Tool, GenerateContentConfig

client = genai.Client()
model_id = "gemini-3-flash-preview"

tools = [{"url_context": {}}]

url1 = "https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592"
url2 = "https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/"

response = client.models.generate_content(
    model=model_id,
    contents=f"Compare the ingredients and cooking times from the recipes at {url1} and {url2}",
    config=GenerateContentConfig(tools=tools)
)

for each in response.candidates[0].content.parts:
    print(each.text)

print(response.candidates[0].url_context_metadata)
```

---

## How It Works

The URL Context tool uses a two-step retrieval process:

1. **Index Cache** — First attempts to fetch from internal cache (fast, optimized)
2. **Live Fetch** — Falls back to real-time fetch for new or uncached pages

---

## Combining with Google Search

URL Context + Google Search enables powerful workflows:

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    "Give me a three-day events schedule based on https://example.com/events. Also let me know about weather and commute.",
  ],
  config: {
    tools: [
      { urlContext: {} },
      { googleSearch: {} }
    ],
  },
});
```

This allows the model to:
1. Extract event data from the specific URL
2. Search the web for weather and commute information
3. Combine both into a comprehensive response

---

## Response Structure

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {"text": "..."}
        ],
        "role": "model"
      },
      "url_context_metadata": {
        "url_metadata": [
          {
            "retrieved_url": "https://www.foodnetwork.com/recipes/...",
            "url_retrieval_status": "URL_RETRIEVAL_STATUS_SUCCESS"
          },
          {
            "retrieved_url": "https://www.allrecipes.com/recipe/...",
            "url_retrieval_status": "URL_RETRIEVAL_STATUS_SUCCESS"
          }
        ]
      }
    }
  ]
}
```

### Status Codes

| Status | Meaning |
|--------|---------|
| `URL_RETRIEVAL_STATUS_SUCCESS` | Content retrieved successfully |
| `URL_RETRIEVAL_STATUS_UNSAFE` | Content failed safety check |

---

## Supported Models

- gemini-3-flash
- gemini-3-pro
- gemini-2.5-pro
- gemini-2.5-flash
- gemini-2.5-flash-lite

---

## Limits & Constraints

| Constraint | Limit |
|------------|-------|
| URLs per request | 20 |
| Content size per URL | 34MB |
| Accessibility | Public URLs only |

### Supported Content Types

✅ **Supported:**
- Text: `text/html`, `application/json`, `text/plain`, `text/xml`, `text/css`, `text/javascript`, `text/csv`, `text/rtf`
- Images: `image/png`, `image/jpeg`, `image/bmp`, `image/webp`
- Documents: `application/pdf`

❌ **Not Supported:**
- Paywalled content
- YouTube videos (use [video understanding](https://ai.google.dev/gemini-api/docs/video-understanding) instead)
- Google Workspace files (Docs, Sheets)
- Video and audio files

---

## Best Practices

1. **Provide specific URLs** — Direct links, not pages with nested links
2. **Check accessibility** — No login or paywall required
3. **Use complete URLs** — Include protocol (`https://`)

---

## ILM Use Cases

### Compare Listings

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    `Compare these two apartments and tell me which is better for a digital nomad:
    ${apartmentUrl1}
    ${apartmentUrl2}`
  ],
  config: {
    tools: [{ urlContext: {} }],
  },
});
```

### Analyze Event Details

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    `Extract the date, time, location, and ticket prices from: ${eventUrl}`
  ],
  config: {
    tools: [{ urlContext: {} }],
  },
});
```

### Research Neighborhoods

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    `Based on these articles, summarize the pros and cons of living in El Poblado vs Laureles:
    ${articleUrl1}
    ${articleUrl2}`
  ],
  config: {
    tools: [{ urlContext: {}, googleSearch: {} }],
  },
});
```

---

## Token Counting

URL content counts toward input tokens:

```json
{
  "usage_metadata": {
    "prompt_token_count": 27,
    "tool_use_prompt_token_count": 10309,
    "total_token_count": 10412
  }
}
```

---

## Related

- [Google Search Grounding](./01-google-search.md)
- [Maps Grounding](./02-maps-grounding.md)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
