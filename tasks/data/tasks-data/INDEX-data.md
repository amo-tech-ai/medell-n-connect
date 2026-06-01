---
title: Data + Auth task index & progress tracker
date: 2026-05-30
parent: tasks/data/supabase-plan.md
canonical_folder: tasks/data/tasks-data/
verified: Supabase MCP zkwcbyxiwklihegjhuql + disk evidence 2026-05-30
---

# Data layer — INDEX & Progress Tracker

**Role:** Expert project analyst / detective reviewer · systems architect view of the DATA + Auth pack.

**Canonical folder:** [`tasks/data/tasks-data/`](./) · **Plan:** [`../supabase-plan.md`](../supabase-plan.md) · **Live log:** [`../evidence/IMPLEMENTATION-STATUS.md`](../evidence/IMPLEMENTATION-STATUS.md)

**Real-estate PRD:** [`../../real-estate/real-estate-prd.md`](../../real-estate/real-estate-prd.md) · **Trips app:** [`../../trips/tasks/`](../../trips/tasks/) · **Maps app:** [`../../maps/INDEX.md`](../../maps/INDEX.md)

---

## Pack summary (verified 2026-05-30 · live re-audit 2026-05-31)

> **Live re-audit 2026-05-31 (claude):** all "Done" DATA tasks verified present + correct on `zkwcbyxiwklihegjhuql` (live DB **98%** accurate). Corrections below: restaurants **44** (not 43), edge functions **40** (not 39), `function_search_path_mutable` now **1** (`trigger_set_timestamps`), canonical `supabase/migrations/` was symlinked to an empty dir (**restored**), and migration version-prefix drift exists (11 local-only / 15 remote-only). Full report: [`../audit/DATA-PACK-LIVE-AUDIT-2026-05-31.md`](../audit/DATA-PACK-LIVE-AUDIT-2026-05-31.md).

| Scope | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|-------|-------------|--------|------------|--------------|----------------------|----------------|
| **DATA pack (35 tasks)** | Supabase schema, seeds, golden queries, security | 🟡 In Progress | **57%** (20/35 Done) | 20 tasks incl. DATA-021 | 15 open; Layer B eval harness (MSV-012) | **DATA-028** trip_items sync |
| **P0 venue foundation** | Inventories → M1–M3 → café/restaurant/nightclub seeds | 🟢 Completed | **100%** | 17 café + 13 nightclub anchors live; **44/44** restaurants w/ place_id (live 2026-05-31) | — | None |
| **P0 trips DDL** | RPC + `trip_id` linkage + golden SQL | 🟢 Completed | **100%** | `insert_trip_item_for_user`; cols on 3 tables | **DATA-028** app sync not started | **DATA-028** after **DATA-021** |
| **P1 security** | search_path + edge matrix | 🟢 Completed | **100%** | DATA-010 + **DATA-010b**; DATA-011 matrix (**40** ACTIVE fns live 2026-05-31) | Phase 2 DEFINER EXECUTE backlog (113 warns); `trigger_set_timestamps` search_path open | **DATA-028** trip_items sync |
| **Auth open (3)** | E2E, JWT context, prod checklist | 🟡 In Progress | **~25%** | F08 + AUTH-001–010 archived | AUTH-005/009/011 open | **AUTH-005** Playwright |

**Live Supabase spot-check:** `venue_anchors` cafe **17** · nightclub **13** · `insert_trip_item_for_user` **exists** · project `zkwcbyxiwklihegjhuql`.

---

## Progress tracker — DATA tasks (implementation order)

**Legend:** 🟢 Completed · 🟡 In Progress · ⚪ Not Started · 🟥 Blocked

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|----------------------|----------------|
| [DATA-001](data-001-inventory.md) | Venues inventory baseline | 🟢 Completed | 100% | [`evidence/data-001`](../evidence/data-001-inventory.md) | — | None |
| [DATA-012](data-012-events-data-inventory.md) | Events schema inventory | 🟢 Completed | 100% | [`evidence/data-012`](../evidence/data-012-events-inventory.md) | — | None |
| [DATA-019](data-019-rentals-data-inventory.md) | Rentals schema inventory | 🟢 Completed | 100% | [`evidence/data-019`](../evidence/data-019-rentals-inventory.md) | — | None |
| [DATA-026](data-026-trips-data-inventory.md) | Trips schema inventory | 🟢 Completed | 100% | [`evidence/data-026`](../evidence/data-026-trips-inventory.md) | — | None |
| [DATA-034](data-034-maps-geo-inventory.md) | Maps geo / place_id matrix | 🟢 Completed | 100% | [`evidence/data-034`](../evidence/data-034-maps-geo-inventory.md) | — | None |
| [DATA-002](data-002-catalog-contract.md) | Three-kind catalog contract | 🟢 Completed | 100% | [`evidence/data-002`](../evidence/data-002-three-kind-contract.md) | — | None |
| [DATA-009](data-009-schema-migrations-m1-m3.md) | M1 booking + M2 anchors + M3 rental indexes | 🟢 Completed | 100% | Live DDL + [`evidence/data-009`](../evidence/data-009-migrations.md) | — | None |
| [DATA-035](data-035-cafe-listings-venue-anchor-seed.md) | Café → `venue_anchors` seed | 🟢 Completed | 100% | **17** café rows; Places log DATA-035 | — | None |
| [DATA-004](data-004-restaurant-seed.md) | Restaurant verify-only | 🟢 Completed | 100% | **44/44** `google_place_id` + neighborhood, 44 distinct (live 2026-05-31); [`evidence/data-004`](../evidence/data-004-restaurant-verify.md) | Count label was stale (43) — now 44, no dupes | None |
| [DATA-003](data-003-cafe-seed.md) | Café sign-off + golden map | 🟢 Completed | 100% | 7 café queries; [`evidence/data-003`](../evidence/data-003-cafe-signoff.md) | — | None |
| [DATA-005](data-005-nightclub-seed.md) | Nightclub/bar anchor seed | 🟢 Completed | 100% | **13** nightclub rows; [`evidence/data-005`](../evidence/data-005-nightclub-seed.md) | — | None |
| [DATA-006](data-006-golden-queries.md) | Golden eval queries (3 kinds) | 🟢 Completed (Layer A) | **100%** | 19 queries + SQL; [`evidence/data-006`](../evidence/data-006-venue-golden-queries.md) 26/26 pass | Layer B MSV-012 harness open (app) | None for DATA track |
| [DATA-007](data-007-cache-audit.md) | `place_details_cache` audit | 🟥 Blocked | 0% | Spec + depends_on | **MAP-005** proxy not verified | Unblock MAP-005 then audit |
| [DATA-008](data-008-places-backfill-cron.md) | Places backfill cron | 🟥 Blocked | 0% | Spec | Blocked by DATA-007 | After DATA-007 |
| [DATA-010](data-010-postgres-search-path-hardening.md) | Postgres `search_path` batch | 🟢 Completed | 100% | 10 fns hardened; [`evidence/data-010`](../evidence/data-010-search-path.md); migration `20260530012233` | — | None |
| [DATA-010b](data-010b-postgres-migration-hygiene.md) | Migration history hygiene | 🟢 Completed | 100% | DATA-010 file aligned (`20260530012233`); [`evidence/data-010b`](../evidence/data-010b-migration-hygiene.md) | Narrow scope met. **Broader drift** (pre-existing, outside this task): canonical dir was symlinked empty (restored 2026-05-31) + 11 local / 15 remote version-prefix mismatches → see **DATA-048** | File DATA-048 repair task |
| [DATA-011](data-011-edge-hardening-evidence.md) | Edge freeze matrix + guest-lead audit | 🟢 Completed | 100% | **40 ACTIVE** fns (live 2026-05-31, +`approval-commit`); [`evidence/data-011`](../evidence/data-011-edge-matrix.md) | Phase 2 DEFINER EXECUTE (43/68) | None |
| [DATA-013](data-013-event-qa-schema.md) | `event_qa` schema | ⚪ Not Started | 0% | Inventory done | No DDL | P1 when EVP-034 ready |
| [DATA-016](data-016-events-ai-content-approval-columns.md) | AI approval columns on `events` | ⚪ Not Started | 0% | — | No DDL | P1 backlog |
| [DATA-018](data-018-event-admin-ops-views.md) | Admin ops SQL views | ⚪ Not Started | 0% | — | No views | P1 backlog |
| [DATA-014](data-014-event-live-updates-schema.md) | `event_live_updates` | ⚪ Not Started | 0% | — | P2 deferred | Phase 2 |
| [DATA-015](data-015-event-attendee-social-schema.md) | Attendee social schema | ⚪ Not Started | 0% | — | P2 deferred | Phase 2 |
| [DATA-017](data-017-discovered-events-pipeline-schema.md) | Discovery pipeline schema | ⚪ Not Started | 0% | — | P2 deferred | Phase 2 |
| [DATA-020](data-020-leads-rental-fk-columns.md) | `leads.apartment_id` + showing time | 🟢 Completed | 100% | Live cols; edge v17 writes cols | — | None |
| [DATA-023](data-023-rental-golden-queries.md) | Rental golden SQL pack | 🟢 Completed | 100% | SQL + JSON evidence | — | None |
| [DATA-021](data-021-showings-lead-bridge.md) | Lead → `showings` bridge | 🟢 Completed | 100% | Edge v17; [`evidence/data-021`](../evidence/data-021-showings-bridge.md) | Landlord RLS smoke (app) | **DATA-028** |
| [DATA-022](data-022-apartments-neighborhood-fk.md) | `apartments.neighborhood_id` FK | ⚪ Not Started | 0% | — | P2 | Deferred |
| [DATA-024](data-024-rental-booking-commerce-prep.md) | Rental booking / Stripe prep | ⚪ Not Started | 0% | — | P2 | Deferred |
| [DATA-025](data-025-hermes-rental-analytics-tables.md) | Hermes analytics tables | ⚪ Not Started | 0% | — | P2 / Phase 2 | Deferred |
| [DATA-027](data-027-trip-items-insert-rpc.md) | `trip_items` CHECK + insert RPC | 🟢 Completed | 100% | RPC live; [`evidence/data-027`](../evidence/data-027-trip-items-rpc.md) | — | None |
| [DATA-029](data-029-commerce-trip-id-linkage.md) | `trip_id` on commerce tables | 🟢 Completed | 100% | [`evidence/data-029`](../evidence/data-029-commerce-trip-id.md) | Checkout not passing `tripId` | App follow-up |
| [DATA-030](data-030-trips-golden-queries.md) | Trips golden SQL pack | 🟢 Completed | 100% | [`evidence/data-030`](../evidence/data-030-trips-golden-queries.md) | — | None |
| [DATA-028](data-028-booking-trip-item-sync.md) | Orders/showings → `trip_items` sync | 🟥 Blocked | 0% | DATA-021 bridge live | Webhook + app not wired | Implement webhook upsert |
| [DATA-031](data-031-trip-items-itinerary-index.md) | Itinerary covering index | ⚪ Not Started | 0% | — | P2 scale | Deferred |
| [DATA-032](data-032-mastra-threads-trip-metadata-index.md) | Thread `trip_id` index | ⚪ Not Started | 0% | — | P2 | Deferred |
| [DATA-033](data-033-route-cache-schema.md) | `route_cache` schema | ⚪ Not Started | 0% | — | P2 / MAP-011 | After DATA-034 |
| [VEC-001](../../vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md) | pgvector HNSW cleanup | 🟢 Completed | 100% | verify:mis-phase1 | — | None |
| [DATA-039](DATA-039-restaurants-schema-patch.md) | Restaurants neighborhood patch | 🟢 Completed | 100% | **44/44** neighborhood (live 2026-05-31) | — | None |
| [DATA-040](DATA-040-embedding-jobs.md) | embedding_jobs queue | 🟢 Completed | 100% | table live | — | None |
| [DATA-041](DATA-041-venue-signals.md) | venue_signals + seed | 🟡 In Review | 90% | 30 rows live | Human QA top 30 | [`evidence/DATA-041-venue-signals-human-qa.md`](../evidence/DATA-041-venue-signals-human-qa.md) |
| DATA-042 | event_signals + seed | 🟢 Completed | 100% | 49 rows MCP | — | None |
| DATA-043 | rental_signals + seed | 🟢 Completed | 100% | 44 rows MCP | — | None |
| DATA-044 | neighborhood_profiles + Astorga | 🟢 Completed | 100% | 8 profiles | — | None |
| DATA-045 | Evidence tables | 🟢 Completed | 100% | 20 evidence rows | — | None |
| [DATA-047](DATA-047-search-logs.md) | search_logs observability | 🟢 Completed | 100% | 8+ rows; hybrid writes | — | None |
| [SEARCH-003](SEARCH-003-restaurant-hybrid.md) | Hybrid restaurants app | 🟢 Completed | 100% | commit `b7265b9`, smoke PASS | Patricia QA ☐ | Linear SAN-388 Done |
| [SEARCH-001](SEARCH-001-rental-hybrid.md) | Hybrid rentals app | ⚪ Not Started | 0% | Spec on disk | Phase 1b | Linear SAN-386 |
| [SEARCH-002](SEARCH-002-event-hybrid.md) | Hybrid events app | ⚪ Not Started | 0% | Spec on disk | Phase 1b | Linear SAN-387 |
| [AI-003](AI-003-signal-enrichment.md) | Signal enrichment batch | ⚪ Not Started | 0% | Spec on disk | Phase 1b | Linear SAN-395 |
| [AI-004](AI-004-grounding-verify.md) | Grounding verification | ⚪ Not Started | 0% | Spec on disk | Phase 1b | Linear SAN-396 |
| [DATA-046](DATA-046-golden-queries-v2.md) | Golden queries v2 | ⚪ Not Started | 0% | Spec on disk | Phase 1b | Linear SAN-384 |
| [DATA-048](DATA-048-migration-version-prefix-realign.md) | Realign migration prefixes repo↔remote | 🟡 In Progress | 90% | History reconciled (76 rows, no one-sided); B2 ordering fixed; [`evidence/DATA-048`](../evidence/DATA-048-migration-realign.md) | `db diff` empty blocked by B1 → DATA-050 | Commit on correct DATA branch |
| [DATA-050](DATA-050-out-of-band-base-table-migrations.md) | Backfill migrations for out-of-band prod base tables | ⚪ Not Started | 0% | Replay failure points captured (DATA-048 §4/§4b) | B1: `landlord_inbox`, `landlord_profiles`, `analytics_events_daily`, `event_media_assets`, likely more — never migration-tracked | **Gated:** enumerate via shadow replay → `db pull` + `migration repair` (human-approved) |

**Intelligence roadmap:** [`../../intelligence/intelligence-plan.md`](../../intelligence/intelligence-plan.md) · **Mastra routing:** [`../../mastra/MASTRA-MIS-001-routing-canonical.md`](../../mastra/MASTRA-MIS-001-routing-canonical.md) · **MIS task index:** [`../../mastra/MIS-TASKS-INDEX.md`](../../mastra/MIS-TASKS-INDEX.md)

---

## Progress tracker — Auth tasks (merged from former `INDEX.md`)

**Done specs archived:** [`../../archive/data-A/`](../../archive/data-A/README.md) · **F08 login:** [`../../core/F08-supabase-auth-login-page.md`](../../core/F08-supabase-auth-login-page.md) (Done)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing / Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|----------------------|----------------|
| AUTH-001–004, 006–008, 010 | OAuth, middleware, RLS, Studio doc | 🟢 Completed | 100% | Archive + [`evidence/AUTH-*`](../../evidence/) | — | None |
| F08 | Magic link + SSR login | 🟢 Completed | 100% | Core task Done | — | None |
| [AUTH-005](AUTH-005-playwright-auth-e2e.md) | Playwright auth smoke | ⚪ Not Started | 0% | Spec Ready | No e2e evidence | Run manual Google flow test |
| [AUTH-009](AUTH-009-jwt-request-context.md) | JWT in Mastra RequestContext | ⚪ Not Started | 0% | Spec Ready | Tools lack user context | Implement per spec |
| [AUTH-011](AUTH-011-production-auth-checklist.md) | Production auth checklist | 🟡 In Progress | **40%** | Partial [`AUTH-011-evidence`](../../evidence/AUTH-011-evidence.md) | Checklist not closed; **`auth_leaked_password_protection` OFF** (live advisor 2026-05-31) | Enable HaveIBeenPwned password check + complete prod evidence |

**Auth verification note:** [`VERIFICATION.md`](VERIFICATION.md) — pack not 100% until AUTH-005/009/011 close.

---

## Critical path (what matters for MVP)

```text
DONE ── DATA-001→006 Layer A + DATA-010/010b/011 + DATA-021 (showings bridge)
NEXT ── DATA-028 (trip_items sync from showings/orders)
APP  ── MSV-012 CopilotKit harness (Layer B)
BLOCKED ── DATA-007/008 until MAP-005 places proxy verified
PARALLEL ── MIS Phase 1 FROZEN: VEC-001 → DATA-039…047 → SEARCH-003 (see intelligence-queue.json)
INTEL    ── Linear: node scripts/linear-import-intelligence-tasks.mjs · view: 11-intelligence-views.md
P2   ── chat-lead-capture auth user rate limit
```

**Linear:** [Data view](https://linear.app/sanjiovani/view/data-54425dec37b9) · filter `project:MDEAPP label:track:data` · SAN-325…359 map 1:1 to DATA-001…033 via [`import-log.json`](../../linear/import-log.json) · **Title format:** `DATA-### — readable name` (not `SYS-021` — prefix-catalog rename reverted by `linear-import-data-tasks.mjs`) · resync: `node scripts/linear-restore-track-labels.mjs && node scripts/linear-import-data-tasks.mjs`

---

## Task index by domain (quick links)

### Venue + schema (P0) — all Done

| Order | ID | Title |
|------:|-----|-------|
| 1 | DATA-001 | Venues inventory |
| 2 | DATA-002 | Three-kind contract |
| 7 | DATA-009 | M1–M3 migrations |
| 8 | DATA-035 | Café seed |
| 9 | DATA-004 | Restaurant verify |
| 10 | DATA-003 | Café sign-off |
| 11 | DATA-005 | Nightclub seed |

### Cache + eval

| Order | ID | Title | Status |
|------:|-----|-------|--------|
| 12 | DATA-006 | Golden queries (Layer A) | 🟢 Done |
| 13 | DATA-007 | Cache audit | 🟥 blocked |
| 14 | DATA-008 | Places backfill | 🟥 blocked |

### Security (P1) — Done

| Order | ID | Title | Status |
|------:|-----|-------|--------|
| 15 | DATA-010 | search_path hardening | 🟢 Done |
| 16 | DATA-011 | Edge hardening evidence | 🟢 Done |

### Events data

| ID | Title | Priority |
|----|-------|----------|
| DATA-012 | Events inventory | P0 Done |
| DATA-013, 016, 018 | Q&A, AI cols, admin views | P1 open |
| DATA-014, 015, 017 | Live updates, social, discovery | P2 deferred |

**CORE events commerce:** no new tables.

### Rentals (Camila / Andrés)

| ID | Title | Status |
|----|-------|--------|
| DATA-019 | Inventory | Done |
| DATA-020 | `leads.apartment_id` | Done |
| DATA-023 | Golden SQL | Done |
| DATA-021 | Showings bridge | **Done** |
| DATA-022, 024, 025 | P2 prep / Hermes | Deferred |

### Trips (Camila)

| ID | Title | Status |
|----|-------|--------|
| DATA-026, 027, 029, 030 | Inventory + DDL + golden SQL | Done |
| DATA-028 | Booking → `trip_items` sync | Blocked (app) |
| DATA-031, 032 | P2 indexes | Deferred |

### Maps

| ID | Title | Status |
|----|-------|--------|
| DATA-034 | Geo inventory | Done |
| DATA-033 | `route_cache` | P2 open |

---

## Cross-track (app — not DATA DDL)

| Track | Task | Notes |
|-------|------|-------|
| Events | [EVP-003](../../events/tasks/EVP-003-core-stripe-webhook-secret-audit.md) | Webhook secrets |
| Rentals | [017-scr-schedule-viewing](../../real-estate/017-scr-schedule-viewing-modal.md) | Needs app write to DATA-020 cols |
| Auth | AUTH-005/009/011 | See tracker above |
| Trips | [TRIP-001](../../trips/tasks/TRIP-001-trips-supabase-audit-evidence.md) … | App on top of DATA-027/029 |

---

## Evidence & docs

| Doc | Purpose |
|-----|---------|
| [`../evidence/IMPLEMENTATION-STATUS.md`](../evidence/IMPLEMENTATION-STATUS.md) | Execution log |
| [`../audit-supabase.md`](../audit-supabase.md) | Live MCP audit |
| [`../supabase-plan.md`](../supabase-plan.md) | Migrations + mermaid |
| [`../plan/23-audit.md`](../plan/23-audit.md) | Plan verdict |
| [`../../../supabase/seeds/`](../../../supabase/seeds/) | Seed JSON, CSV (sources); SQL in `supabase/migrations/` |
| [`VERIFICATION.md`](VERIFICATION.md) | Auth forensic report |

---

## Verification methodology (this tracker)

1. **Examine** — task spec `status` + `tasks/data/evidence/*`
2. **Verify** — Supabase MCP SQL on `zkwcbyxiwklihegjhuql` (2026-05-30)
3. **Validate** — Places verify logs under `tasks/testing/evidence/DATA-*`
4. **Measure** — Done = 100%; partial deliverables = 40–70%; blocked = 0% until dependency clears
5. **Identify** — 🟥 = hard dependency or app layer gap with no DDL left

**Percent formula (DATA pack):** `Done tasks / 35` = **20/35 ≈ 57%**. P0 venue slice = **12/12 = 100%**. P1 security = **2/2 = 100%**.
