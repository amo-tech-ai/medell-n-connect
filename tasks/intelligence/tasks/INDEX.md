---
title: Agent Intelligence & Shared Memory — Task Program
program: INT-001…022
updated: 2026-05-30
linear_sync: SAN-404…SAN-425 (import via linear-import-intelligence-tasks.mjs)
plan: ../agent-plan.md
architecture: ../00-shared-intelligence-architecture.md
---

# Agent Intelligence & Shared Memory — Task Index

**Golden rule:** Mastra orchestrates · Gemini reasons · code searches · Supabase remembers · CopilotKit mirrors UI · pgvector recalls later.

**Do not:** one giant super-agent. **Do:** shared intelligence + vertical specialists + deterministic search.

## Implementation order (strict)

```text
CORE:    INT-001 → INT-002 → INT-003 → INT-004 → INT-005
MVP:     INT-006 → INT-007 → INT-008 → INT-009 → INT-010
POST-MVP: INT-011 → INT-012 → INT-013 → INT-014 → INT-015
ADVANCED: INT-016 → INT-017 → INT-018 → INT-019 → INT-020
```

Parallel platform work (do not block CORE): **VEC-001…003** before INT-016.

## Summary by phase

| Phase | Tasks | Priority | Outcome |
|-------|-------|----------|---------|
| **CORE** | INT-001…005 | P0 | Gemini reasons on turn 1; no canned bypass; regression green |
| **MVP** | INT-006…010 | P0–P1 | Date filters; event/café wrappers; CK readable state |
| **POST-MVP** | INT-011…015 | P1–P2 | Durable prefs; retrieval; ranking boost; evidence |
| **ADVANCED** | INT-016…020 | P2 | pgvector; embeddings; cross-domain; settings UI; observational |

## Master table

| Order | ID | Title | Phase | P | Status | Depends | Owner | RE alias | VEC alias |
|------:|----|-------|-------|---|--------|---------|-------|----------|-----------|
| 1 | [INT-001](./INT-001-shared-intent-slot-schema.md) | Shared intent + slot schema | CORE | P0 | Not Started | — | Mastra, Gemini | — | — |
| 2 | [INT-002](./INT-002-rental-parser-monthly-date-city.md) | Rental parser monthly/date/city | CORE | P0 | Not Started | INT-001 | Gemini, App | [RE-017](../../real-estate/tasks/RE-017-rental-parser-intelligence.md) | — |
| 3 | [INT-003](./INT-003-gemini-smart-clarify-routing.md) | Gemini smart clarify routing | CORE | P0 | Not Started | INT-001, INT-002 | Mastra, Gemini | [RE-018](../../real-estate/tasks/RE-018-gemini-rental-clarify-routing.md) | — |
| 4 | [INT-004](./INT-004-no-canned-clarify-bypass.md) | No canned clarify bypass | CORE | P0 | Not Started | INT-003 | CopilotKit, App | (part of RE-018) | — |
| 5 | [INT-005](./INT-005-intelligence-regression-tests.md) | Intelligence regression tests | CORE | P0 | Not Started | INT-002, INT-003, INT-004 | Testing | — | — |
| 6 | [INT-006](./INT-006-rental-availability-date-filters.md) | Rental availability date filters | MVP | P1 | Not Started | INT-002 | Supabase, Mastra | [RE-019](../../real-estate/tasks/RE-019-rental-availability-search.md) | — |
| 7 | [INT-007](./INT-007-event-intelligence-wrapper.md) | Event intelligence wrapper | MVP | P1 | Not Started | INT-001, INT-005 | Mastra, Gemini | — | — |
| 8 | [INT-008](./INT-008-cafe-intelligence-wrapper.md) | Café intelligence wrapper | MVP | P1 | Not Started | INT-001, INT-005 | Mastra, Maps | — | — |
| 9 | [INT-009](./INT-009-copilot-readable-ui-state.md) | CopilotKit readable UI state | MVP | P1 | Not Started | INT-003 | CopilotKit | — | — |
| 10 | [INT-010](./INT-010-working-memory-schema-update.md) | Working memory schema update | MVP | P1 | Not Started | INT-001 | Mastra, CopilotKit | — | — |
| 11 | [INT-011](./INT-011-user-preferences-schema.md) | user_preferences schema + RLS | POST-MVP | P1 | Not Started | INT-005 | Supabase | — | VEC-002 |
| 12 | [INT-012](./INT-012-user-interactions-schema.md) | user_interactions schema | POST-MVP | P1 | Not Started | INT-011 | Supabase | — | — |
| 13 | [INT-013](./INT-013-retrieve-preferences-before-search.md) | Retrieve prefs before search | POST-MVP | P1 | Not Started | INT-011, INT-012 | Mastra | — | — |
| 14 | [INT-014](./INT-014-ranking-boost-from-memory.md) | Ranking boost from memory | POST-MVP | P2 | Not Started | INT-013 | App | — | — |
| 15 | [INT-015](./INT-015-memory-evidence-tests.md) | Memory evidence tests | POST-MVP | P2 | Not Started | INT-013, INT-014 | Testing | — | — |
| 16 | [INT-016](./INT-016-pgvector-semantic-memory.md) | pgvector semantic memory | ADVANCED | P2 | Not Started | VEC-001, VEC-002, INT-011 | pgvector, Supabase | [RE-020](../../real-estate/tasks/RE-020-rental-preference-memory.md) | VEC-001…002 |
| 17 | [INT-017](./INT-017-gemini-embeddings-memory.md) | Gemini embeddings for memory | ADVANCED | P2 | Not Started | VEC-003, INT-016 | Gemini | — | VEC-003 |
| 18 | [INT-018](./INT-018-cross-domain-personalization.md) | Cross-domain personalization | ADVANCED | P2 | Not Started | INT-016, INT-007, INT-008 | Mastra | — | — |
| 19 | [INT-019](./INT-019-memory-settings-ui.md) | Memory settings UI | ADVANCED | P2 | Not Started | INT-011, INT-016 | CopilotKit, App | — | — |
| 20 | [INT-020](./INT-020-observational-memory-learning.md) | Observational memory learning | ADVANCED | P2 | Not Started | INT-012, INT-016 | Mastra, Gemini | — | — |

### Additive (post-audit 2026-05-28)

Added after the program audit closed gaps the 00-program-report flagged. Not part of the strict INT-001→020 CORE/MVP chain; sequence by their `depends_on`.

| Order | ID | Title | Phase | P | Status | Depends | Owner | Note |
|------:|----|-------|-------|---|--------|---------|-------|------|
| 21 | [INT-021](./INT-021-restaurant-venue-intelligence-wrapper.md) | Restaurant & venue intelligence wrapper | MVP | P1 | Not Started | INT-001, INT-005 | Mastra, Gemini, Maps | Closes the restaurant/venue gap (report scored 80%); supersedes root `INT-005-restaurant-venue-intelligence.md` per MIGRATION.md |
| 22 | [INT-022](./INT-022-routing-confidence-instrumentation.md) | Routing & confidence instrumentation | MVP | P2 | Not Started | INT-002 | Mastra, App, Testing | Telemetry to tune the 0.85/0.50 bands; distinct from INT-005 (tests) and UX-009 (uptime monitor) |

## Real-world examples by phase

| Phase | Vertical | Example prompt | Expected |
|-------|----------|------------------|----------|
| CORE | Rental | `list rentals in june 1 to 30 $1000 medellin` | Medellín monthly clarify OR search; not generic budget/dates re-ask |
| MVP | Event | `salsa events this weekend near Provenza` | vibe + dateRange + neighborhood slots; event search or focused clarify |
| MVP | Café | `quiet café in Laureles for remote work tomorrow` | cafe_search + needs; Places or clarify WiFi vs outdoor |
| POST-MVP | Rental | Repeat Camila visit | Laureles boost from `user_preferences` |
| ADVANCED | Restaurant | `romantic dinner in El Poblado under $80` | slots + future semantic recall |
| ADVANCED | Venue | `birthday venue for 20 people with music` | capacity + vibe slots (INT-005 scope later) |

## Superseded task files (do not use for new work)

Root-level `tasks/intelligence/INT-00x-*.md` (2026-05-28) → replaced by this folder. See [MIGRATION.md](./MIGRATION.md).

## Linear sync (2026-05-30)

| INT | Linear | Real-world title |
|-----|--------|------------------|
| INT-001 | [SAN-404](https://linear.app/sanjiovani/issue/SAN-404) | Turn-1 chat routing — one intent schema |
| INT-002 | SAN-405 | Parse monthly rental budget + June dates |
| … | … | … |
| INT-022 | [SAN-425](https://linear.app/sanjiovani/issue/SAN-425) | Routing confidence telemetry |

Full map: [`intelligence-canonical-titles.json`](../../linear/intelligence-canonical-titles.json) · Re-import: `node scripts/linear-import-intelligence-tasks.mjs`

**View filter:** `project:MDEAPP label:track:intelligence` — sort by `int-seq:01`…`22` for INT; `intel-order:01`…`18` for MIS.

## Related programs (not duplicated)

| Program | Index | Relationship |
|---------|-------|----------------|
| Real estate implementation | [`../../real-estate/tasks/INDEX.md`](../../real-estate/tasks/INDEX.md) | RE-017…020 implement INT-002…006 rental slices |
| Vector platform | [`../../vector/INDEX.md`](../../vector/INDEX.md) | VEC-001…007 before INT-016/017 |
| Master plan | [`../agent-plan.md`](../agent-plan.md) | PRD, mermaid, confidence bands |

## Next recommended PR

**PR-A (CORE):** INT-001 + INT-002 + INT-003 + INT-004 in one branch (≤400 lines) or split INT-001 then INT-002–004.

Ledger: C-016 (INT-001), C-013 (INT-002/RE-017), C-014 (INT-003–004/RE-018).
