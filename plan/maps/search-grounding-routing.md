---
title: Search vs Maps vs Supabase routing
status: active
date: 2026-05-23
related: ../../tasks/maps/MAP-002-grounding-attribution.md
phase: MVP (Maps via ADK) · Search after MAP-002A
canonical_for: ex-MAIC-008
---

# Search vs Maps vs Supabase — routing matrix

> **Canonical plan for Search Grounding** (ex-MAIC-008). **MVP:** MapsAgent + Grounding Lite only; **no** production Search calls without explicit product flag. Enable SearchAgent in ADK after **MAP-002A** stable.

## Decision matrix

| User intent | Primary source | Fallback | Phase |
|-------------|----------------|----------|-------|
| Static venue / address | Places API (New) Details | `venue_intelligence` cache | MVP |
| Geo discovery (“cafés near X”) | ADK → Grounding Lite MCP | Places Nearby Search | MVP |
| Ticketed / hosted events | Supabase `events` | — | MVP |
| Time-sensitive promos / “this Friday” | — (disclaimer) | Supabase partial | MVP |
| Time-sensitive promos / web | Google Search Grounding | ADK `search_grounded_events` | **Phase 2** |
| Neighborhood compare (static) | Curated JSON + `neighborhood_intelligence` | Places density sample | MVP |
| Neighborhood reviews / news | Search Grounding | — | Phase 2 |
| Rental nearby amenities | Places Nearby + cache | — | Post-MVP (MAIC-010) |

## Citation UI

- **Maps / Places:** `GroundingAttribution` + Google Maps required attribution (MAIC-009).
- **Search (Phase 2):** inline citations + “web” badge; never mix with SQL event rows without `source` field.

## Orchestration invariant

```text
CopilotKit → Mastra (router) → Supabase tools | HTTP ADK sidecar (JSON)
ADK → Grounding Lite MCP + Search Grounding (when enabled)
ADK does NOT write Supabase; Mastra persists cache (MAIC-014).
```

## MVP scope gate (W5–W6)

| Allowed | Blocked without flag |
|---------|----------------------|
| ADK MapsAgent → Grounding Lite `search_places` | Google Search Grounding in prod |
| Supabase `events` SQL for ticketed events | Web-scraped promos as facts |
| Places API (New) via **MAP-004** (server) | Mixing Search citations into SQL rows without `source` |

**Tourist example:** *"Rooftop events in Poblado this Friday?"* — MVP: partial Supabase `events` + disclaimer; Phase 2: ADK `search_grounded_events` + merge.

## Phase 2 — ADK Search tools (inform MAIC-016 / sidecar)

| ADK tool | Mastra consumer | When |
|----------|-----------------|------|
| `search_grounded_events` | `search-events` workflow / concierge | Time-sensitive promos |
| `search_grounded_places` | Already MapsAgent MVP | Geo NL |
| Neighborhood reviews | MAP-012 compare | Static curated first |

## Risks & policy

| Area | Note |
|------|------|
| **Liability** | Search may return unvetted third-party content — moderation policy before enable |
| **Cost** | Search grounding billed per query — rate cap in ADK sidecar + Mastra quota |
| **Failure** | Premature Search in MVP → citation gaps + spend spike |

## Plan acceptance (ex-MAIC-008 Done)

- [ ] Matrix reviewed with Patricia (cost) + product (liability)
- [ ] MVP code paths use Maps + SQL only (`rg search_grounded` in mdeapp → 0 until flag)
- [ ] **MAP-002** SearchAgent stub returns `reason: search_disabled` when called
- [ ] Linked from [`MAP-002`](../../tasks/maps/MAP-002-grounding-attribution.md) § Search routing

## References

- [`plan/ADK/adk-roadmap.md`](../ADK/adk-roadmap.md)
- [`plan/ADK/sidecar-api-contract.md`](../ADK/sidecar-api-contract.md)
- [`tasks/maps/MAP-002-grounding-attribution.md`](../../tasks/maps/MAP-002-grounding-attribution.md)
- [`tasks/core/F49-copilotkit-generative-search-ui.md`](../../tasks/core/F49-copilotkit-generative-search-ui.md) — citation UI for cards
