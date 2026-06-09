---
title: "AI Model Reference"
description: "Mastra uses `\"provider/model-name\"` strings. No extra packages needed — Mastra reads the relevant API key from `.env` automatically."
category: "root"
updated: 2026-05-10
sources:
  - https://ai.google.dev/gemini-api/docs/models
  - https://mastra.ai/models/providers
  - https://platform.openai.com/docs/models
---

# AI Model Reference

## How models are specified in Mastra

Mastra uses `"provider/model-name"` strings. No extra packages needed — Mastra reads the relevant API key from `.env` automatically.

```typescript
// Google → reads GOOGLE_GENERATIVE_AI_API_KEY
model: 'google/gemini-3.1-flash-lite'

// OpenAI → reads OPENAI_API_KEY
model: 'openai/gpt-5.4-mini'

// Fallback chain
model: [
  { model: 'google/gemini-3.1-pro-preview', maxRetries: 2 },
  { model: 'google/gemini-3.1-flash-lite',  maxRetries: 2 },
]
```

---

## Google Gemini models (verified 2026-05-10)

| Model | Mastra string | Context | Status | Best for |
|-------|--------------|---------|--------|----------|
| Gemini 3.1 Pro Preview | `google/gemini-3.1-pro-preview` | 1M in / 65k out | Preview | Complex reasoning, long context |
| Gemini 3 Flash Preview | `google/gemini-3-flash-preview` | 1M in / 65k out | Preview | Balanced speed + quality |
| Gemini 3.1 Flash-Lite | `google/gemini-3.1-flash-lite` | 1M in / 65k out | **Stable** | Fast, cost-efficient, high volume |
| Gemini 3.1 Flash-Lite Preview | `google/gemini-3.1-flash-lite-preview` | 1M in / 65k out | Preview | Fast, cost-efficient preview |

**Env var:** `GOOGLE_GENERATIVE_AI_API_KEY`

---

## OpenAI models (verified 2026-05-10)

| Model | Mastra string | Context | Status | Best for |
|-------|--------------|---------|--------|----------|
| GPT-5.4 mini | `openai/gpt-5.4-mini` | 400k | Current | Fast inference, lower cost |
| GPT-5.5 | `openai/gpt-5.5` | 400k | Current | Most capable OpenAI model |
| GPT-4o mini | `openai/gpt-4o-mini` | 128k | Stable | Budget fallback |

**Env var:** `OPENAI_API_KEY`

---

## mdeAI Mastra agent assignments

| Agent | Model | Why |
|-------|-------|-----|
| `concierge-agent` | `google/gemini-3.1-flash-lite` | Fast routing + clarification gate |
| `rental-agent` | `google/gemini-3.1-pro-preview` | Card formatting + nuanced search |
| `event-agent` | `google/gemini-3-flash-preview` | Balanced speed for event discovery |
| `router-agent` | `google/gemini-3.1-flash-lite` | Intent classification — latency-critical |
| `evaluation-agent` | `google/gemini-3.1-flash-lite` | Scoring, no heavy reasoning needed |
| `weather-agent` | `google/gemini-3.1-flash-lite` | Simple tool call wrapper |
| `ping-agent` | `google/gemini-3.1-flash-lite` | Health check — cheapest model |

**Project rule:** Production edge functions use Gemini via `GEMINI_API_KEY` (Supabase secret).
Mastra runtime uses Gemini via `GOOGLE_GENERATIVE_AI_API_KEY` (Mastra `.env`).
These are the same Google account key — just named differently per runtime.

---

## Why NOT OpenAI for mdeAI Mastra agents

- Project standard (CLAUDE.md): all AI is Google Gemini
- `GOOGLE_GENERATIVE_AI_API_KEY` is set; `OPENAI_API_KEY` exists but is not the primary billing account
- Gemini 3.1 Flash-Lite is cheaper and faster than gpt-5.4-mini for high-volume classification
- Avoids vendor split: Supabase edge fns + Mastra both on Gemini = one provider to monitor
