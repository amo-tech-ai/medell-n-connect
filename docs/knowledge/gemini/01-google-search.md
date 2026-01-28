# Grounding with Google Search

> Connect Gemini to real-time web content for factual accuracy and citations.

**Source:** [Google AI Docs](https://ai.google.dev/gemini-api/docs/grounding)

---

## Overview

Grounding with Google Search allows Gemini to:
- **Increase factual accuracy** — Reduce hallucinations by basing responses on real-world information
- **Access real-time information** — Answer questions about recent events
- **Provide citations** — Build user trust with verifiable sources

---

## Quick Start

### JavaScript (Edge Function)

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const groundingTool = {
  googleSearch: {},
};

const config = {
  tools: [groundingTool],
};

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Who won the euro 2024?",
  config,
});

console.log(response.text);
```

### Python

```python
from google import genai
from google.genai import types

client = genai.Client()

grounding_tool = types.Tool(
    google_search=types.GoogleSearch()
)

config = types.GenerateContentConfig(
    tools=[grounding_tool]
)

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Who won the euro 2024?",
    config=config,
)

print(response.text)
```

### REST / cURL

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {"text": "Who won the euro 2024?"}
        ]
      }
    ],
    "tools": [
      {
        "google_search": {}
      }
    ]
  }'
```

---

## How It Works

1. **User Prompt** — Application sends prompt with `google_search` tool enabled
2. **Prompt Analysis** — Model determines if search can improve the answer
3. **Google Search** — Model generates and executes search queries
4. **Results Processing** — Model synthesizes information and formulates response
5. **Grounded Response** — Returns text + `groundingMetadata` with citations

---

## Response Structure

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Spain won Euro 2024, defeating England 2-1 in the final."
          }
        ],
        "role": "model"
      },
      "groundingMetadata": {
        "webSearchQueries": [
          "UEFA Euro 2024 winner",
          "who won euro 2024"
        ],
        "searchEntryPoint": {
          "renderedContent": "<!-- HTML for search widget -->"
        },
        "groundingChunks": [
          {"web": {"uri": "https://...", "title": "aljazeera.com"}},
          {"web": {"uri": "https://...", "title": "uefa.com"}}
        ],
        "groundingSupports": [
          {
            "segment": {"startIndex": 0, "endIndex": 85, "text": "Spain won..."},
            "groundingChunkIndices": [0]
          }
        ]
      }
    }
  ]
}
```

### Key Fields

| Field | Description |
|-------|-------------|
| `webSearchQueries` | Search queries used by the model |
| `searchEntryPoint` | HTML/CSS for search widget |
| `groundingChunks` | Array of web sources (uri, title) |
| `groundingSupports` | Maps text segments to sources |

---

## Inline Citations

```typescript
function addCitations(response) {
  let text = response.text;
  const supports = response.candidates[0]?.groundingMetadata?.groundingSupports;
  const chunks = response.candidates[0]?.groundingMetadata?.groundingChunks;

  // Sort by end_index descending to avoid shifting
  const sortedSupports = [...supports].sort(
    (a, b) => (b.segment?.endIndex ?? 0) - (a.segment?.endIndex ?? 0),
  );

  for (const support of sortedSupports) {
    const endIndex = support.segment?.endIndex;
    if (endIndex === undefined || !support.groundingChunkIndices?.length) {
      continue;
    }

    const citationLinks = support.groundingChunkIndices
      .map(i => {
        const uri = chunks[i]?.web?.uri;
        if (uri) return `[${i + 1}](${uri})`;
        return null;
      })
      .filter(Boolean);

    if (citationLinks.length > 0) {
      const citationString = citationLinks.join(", ");
      text = text.slice(0, endIndex) + citationString + text.slice(endIndex);
    }
  }

  return text;
}
```

---

## Supported Models

| Model | Google Search |
|-------|---------------|
| Gemini 3 Flash | ✅ |
| Gemini 3 Pro | ✅ |
| Gemini 2.5 Pro | ✅ |
| Gemini 2.5 Flash | ✅ |
| Gemini 2.5 Flash-Lite | ✅ |

---

## Pricing

- **Gemini 3:** Billed per search query executed (not per prompt)
- **Gemini 2.5 and older:** Billed per prompt
- Multiple queries in one call = multiple charges

---

## Combining with Other Tools

Can be used with:
- [URL Context](./03-url-context.md) — Ground in both web data and specific URLs
- Code Execution — Run code with search-grounded data

---

## Related

- [Maps Grounding](./02-maps-grounding.md)
- [URL Context](./03-url-context.md)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
