---
title: GitHub — Apify Mastra MCP agent
repo: https://github.com/apify/actor-mastra-mcp-agent
score: 58
traffic: yellow
phase: 2 VPS
personas: [Sofía, Patricia]
domains: [rentals]
---

# Apify actor-mastra-mcp-agent

## At a glance

| | |
|---|---|
| **What it is** | Mastra agent on Apify platform calling **Apify MCP Server** → Actors (TikTok scraper, RAG web browser, etc.). |
| **Purpose** | Pattern for **external web data** into agent tools — enrichment, not primary search. |
| **Goals** | Understand dynamic MCP tool list from Actor catalog. |
| **What it does** | OpenAI model + SSE MCP + dataset output per run. |
| **Benefits** | Off-platform signals when Supabase inventory is thin — **VPS/cron only**. |
| **mdeai** | Camila’s cards stay **`search-rentals`** (RLS Postgres). Apify is Phase 2 **lead enrichment**. |

---

## Score: 58/100 🟡

Useful for ops; **not** prod hot path (ToS, latency, no RLS).

---

## Suggested Apify actors for mdeai (rentals)

| Actor (concept) | Use for Camila | Caveat |
|-----------------|----------------|--------|
| **Airbnb listing scraper** (Apify Store) | Compare price bands in Laureles/El Poblado | Do not replace licensed inventory; merge as **hint** only |
| **Facebook Groups scraper** | “Apartamento Laureles” group posts → leads | ToS + PII; human review before CRM |
| **Google Maps scraper** | Fallback if Places quota — prefer official Places API | Field masks required |
| `apify/rag-web-browser` | Competitor landing pages | Patricia research |

Wire as **VPS OpenClaw job** → write to `staging_rental_leads` table with RLS — never direct to chat without review.

---

## Learn → adapt

```text
Apify Actor run → dataset rows → edge fn normalize → Supabase
                                    ↓
              (optional) conciergeAgent tool "get_enrichment_hints"
                                    ↓
              Camila still sees primary cards from search-rentals
```

| Copy | Skip |
|------|------|
| MCP SSE client config | OpenAI default model |
| Actor allowlist in env | Apify on Vercel synchronous path |
| Pay-per-event cost model | TikTok demo for mdeai |

---

## User stories

**Patricia:** As Patricia, I schedule an Apify Actor to ingest 20 Facebook group posts/week into a review queue — not auto-chat to Camila.

**Sofía:** As Sofía, I prototype `MCPClient` with a **read-only** enrichment tool gated by feature flag.

**Camila:** As Camila, I only see vetted listings from Supabase — enrichment never overrides `search-rentals` sort order without human merge.

---

## Journey — enrichment (Phase 2)

1. Cron on VPS runs Apify Actor (Airbnb + FB groups).
2. Normalize to JSON → Supabase `external_leads`.
3. Patricia approves rows in `/admin`.
4. Approved rows gain `sourceUrl` on existing rental records.

**Maps:** Official path remains [`../examples/domains/05-google-maps.md`](../examples/domains/05-google-maps.md).

**MCP doc:** [`../examples/mcp/01-overview.md`](../examples/mcp/01-overview.md).
