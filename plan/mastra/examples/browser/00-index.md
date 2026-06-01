---
title: Mastra Browser — index (mdeai)
project: mdeapp
phase: 2+
updated: 2026-05-21
---

# Mastra Browser — index

**Docs:** [Browser overview](https://mastra.ai/docs/browser/overview) · [AgentBrowser](https://mastra.ai/docs/browser/agent-browser) · [BrowserViewer](https://mastra.ai/docs/browser/browser-viewer)

Phase 1 mdeai **does not** ship browser agents in `mdeapp`. Listings, events, and restaurants use **Supabase + Places/Grounding APIs**, not Playwright in the hot path.

| Doc | Source | Persona | Phase |
|-----|--------|---------|-------|
| [01-overview](01-overview.md) | [overview](https://mastra.ai/docs/browser/overview) | Sofía, Lucía | 2+ |
| [02-agent-browser](02-agent-browser.md) | [agent-browser](https://mastra.ai/docs/browser/agent-browser) | Lucía | 2+ |
| [03-browser-viewer](03-browser-viewer.md) | [browser-viewer](https://mastra.ai/docs/browser/browser-viewer) | Sofía | 2+ (workspace) |

## mdeai alternative (Phase 1)

| Need | Use instead of browser |
|------|-------------------------|
| Restaurant/place data | MAP-002 Grounding MCP + `search-restaurants` |
| Rental listings | `search-rentals` → Postgres |
| Events | `search-events` → Supabase |
| E2E UI proof | Playwright on `/chat`, `/rentals` (Lucía) — not Mastra AgentBrowser |
| Maps QA | chrome-devtools MCP / Playwright + `mapId` checks |

## Domain playbooks (vertical journeys)

| Domain | Doc |
|--------|-----|
| Rentals | [../domains/01-real-estate-rentals.md](../domains/01-real-estate-rentals.md) |
| Events | [../domains/02-events-hosting.md](../domains/02-events-hosting.md) |
| Restaurants | [../domains/03-restaurants-tourist.md](../domains/03-restaurants-tourist.md) |
| Contests | [../domains/04-contests-deferred.md](../domains/04-contests-deferred.md) |
| Google Maps | [../domains/05-google-maps.md](../domains/05-google-maps.md) |
