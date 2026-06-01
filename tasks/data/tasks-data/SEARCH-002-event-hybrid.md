---
task_id: SEARCH-002
title: Hybrid search events + event_signals
layer: APP
phase: intel-1b
priority: P0
status: Not Started
estimated_effort: 4h
depends_on: [DATA-042, DATA-047, VEC-004, SEARCH-003]
unblocks: [DATA-046]
blocks: []
skills: [mastra, mde-supabase, testing]
related:
  - ../../intelligence/intelligence-plan.md
description: Wire search-events to hybrid_search_events RPC + event_signals; web grounding remains fallback only.
---

# SEARCH-002 — Hybrid event search

## At a glance

| | |
|---|---|
| **For** | Andrés · Tourist (salsa, fashion, live music) |
| **Why now** | Phase 1b after rentals hybrid |
| **Rule** | Supabase events first; `search-web-grounded-events` only when thin results |

## What we're building

1. `intelligence-event-search.ts` (new) — date window, vibe, neighborhood slots
2. Extend `search-events.ts` — hybrid RPC + event_signals (hype, fashion, live_music, …)
3. `writeSearchLog` on hybrid path
4. Keep existing web-grounding attach for time-sensitive verify

## Golden queries

| Prompt | Expected |
|--------|----------|
| Salsa this weekend near Provenza | event_signals + date filter |
| Fashion events tonight Poblado | fashion_score boost |
| Live music this weekend | live_music / nightlife signals |

## Done gate

| Check | Evidence |
|-------|----------|
| Hybrid RPC | search_logs hybrid_used |
| Web fallback | only when <3 Supabase rows |
| Cards + pins | EventCard unchanged contract |
| Tests | search-events-logic + new hybrid tests |

## Out of scope

- Real-time event ingest (EVP)
- LLM event invention

## Verify

```bash
cd mdeapp && npm run test -- search-events
```
