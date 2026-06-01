# Real estate V2 — task spine

**Roadmap:** [`../V2-real-estate.md/roadmap.md`](../V2-real-estate.md/roadmap.md)  
**Build order:** [`../V2-real-estate.md/000-index.md`](../V2-real-estate.md/000-index.md)  
**PRD v2:** [`../V2-real-estate.md/prd-real-estateV2.md`](../V2-real-estate.md/prd-real-estateV2.md)  
**Milestones · progress:** [`milestones.md`](../V2-real-estate.md/milestones.md) · [`progress.md`](../V2-real-estate.md/progress.md)

**Naming:** `NNN-<slug>.md`; YAML `id` = `RE-NNN`; numeric prefix = global implementation order.

**Process:** Plan/ship with [`mde-task-lifecycle`](../../../.claude/skills/mde-task-lifecycle/SKILL.md); resequence with [`mde-roadmap`](../../../.claude/skills/mde-roadmap/SKILL.md).

---

## CORE (`001`–`012`) — [`core/`](./core/)

Inventory, CRM spine, Places infra, Mastra wire.

| # | ID | Title | File |
|---|-----|-------|------|
| 001 | RE-001 | Seed 25 verified listings | [001-seed-verified-listings.md](./core/001-seed-verified-listings.md) |
| 002 | RE-002 | Admin auth guards on `/admin/*` | [002-admin-auth-guards.md](./core/002-admin-auth-guards.md) |
| 003 | RE-003 | Public contact → landlord inbox / lead | [003-landlord-inbox-contact-loop.md](./core/003-landlord-inbox-contact-loop.md) |
| 004 | RE-004 | Rentals edge + UI API contract sync | [004-rentals-api-contract-sync.md](./core/004-rentals-api-contract-sync.md) |
| 005 | RE-005 | Commerce RLS review | [005-commerce-rls-review.md](./core/005-commerce-rls-review.md) |
| 006 | RE-006 | Unified lead-capture edge | [006-lead-capture-unify.md](./core/006-lead-capture-unify.md) |
| 007 | RE-007 | Places proxy + field-mask registry | [007-places-proxy-field-masks.md](./core/007-places-proxy-field-masks.md) |
| 008 | RE-008 | places_cache migration + TTL | [008-places-cache-migration.md](./core/008-places-cache-migration.md) |
| 009 | RE-009 | Showings / applications schema verify | [009-showings-schema-verify.md](./core/009-showings-schema-verify.md) |
| 010 | RE-010 | Mastra storage + Supabase auth wire | [010-mastra-storage-auth-wire.md](./core/010-mastra-storage-auth-wire.md) |
| 011 | RE-011 | Intake FilterJson ↔ DB query parity | [011-intake-filter-db-parity.md](./core/011-intake-filter-db-parity.md) |
| 012 | RE-012 | Rental filter + RLS negative tests | [012-rental-rls-negative-tests.md](./core/012-rental-rls-negative-tests.md) |

---

## MVP (`013`–`022`) — [`mvp/`](./mvp/)

Mastra concierge path + first paid booking.

| # | ID | Title | File |
|---|-----|-------|------|
| 013 | RE-013 | Concierge / rentals → Mastra SSE | [013-mastra-concierge-production-route.md](./mvp/013-mastra-concierge-production-route.md) |
| 014 | RE-014 | rental-search-workflow ≤5 cards + pins | [014-rental-search-workflow-cards.md](./mvp/014-rental-search-workflow-cards.md) |
| 015 | RE-015 | Showing scheduler E2E | [015-showing-scheduler-e2e.md](./mvp/015-showing-scheduler-e2e.md) |
| 016 | RE-016 | Application wizard + landlord summary | [016-application-wizard.md](./mvp/016-application-wizard.md) |
| 017 | RE-017 | Stripe rental webhook + idempotency | [017-stripe-rental-webhook.md](./mvp/017-stripe-rental-webhook.md) |
| 018 | RE-018 | booking-create edge | [018-booking-create-edge.md](./mvp/018-booking-create-edge.md) |
| 019 | RE-019 | Landlord dashboard MVP | [019-landlord-dashboard-mvp.md](./mvp/019-landlord-dashboard-mvp.md) |
| 020 | RE-020 | Admin listing moderation queue | [020-admin-moderation-queue.md](./mvp/020-admin-moderation-queue.md) |
| 021 | RE-021 | Renter→landlord smoke E2E | [021-renter-landlord-smoke-e2e.md](./mvp/021-renter-landlord-smoke-e2e.md) |
| 022 | RE-022 | First paid booking gate | [022-first-paid-booking-gate.md](./mvp/022-first-paid-booking-gate.md) |

---

## POST-MVP (`023`–`032`) — [`post-mvp/`](./post-mvp/)

Maps intelligence, router cutover, evals, Hermes batch.

| # | ID | Title | File |
|---|-----|-------|------|
| 023 | RE-023 | Deprecate edge ai-router (rentals) | [023-deprecate-edge-ai-router.md](./post-mvp/023-deprecate-edge-ai-router.md) |
| 024 | RE-024 | rental-search Places enrich step | [024-rental-search-places-enrich.md](./post-mvp/024-rental-search-places-enrich.md) |
| 025 | RE-025 | neighborhood-intelligence workflow | [025-neighborhood-intelligence-workflow.md](./post-mvp/025-neighborhood-intelligence-workflow.md) |
| 026 | RE-026 | Maps attribution on listing cards | [026-maps-attribution-ui.md](./post-mvp/026-maps-attribution-ui.md) |
| 027 | RE-027 | Rental eval golden set (50 queries) | [027-rental-eval-golden-set.md](./post-mvp/027-rental-eval-golden-set.md) |
| 028 | RE-028 | Mastra memory field audit | [028-mastra-memory-audit.md](./post-mvp/028-mastra-memory-audit.md) |
| 029 | RE-029 | Hermes offline ranking job | [029-hermes-ranking-offline.md](./post-mvp/029-hermes-ranking-offline.md) |
| 030 | RE-030 | Lease review workflow (propose-only) | [030-lease-review-workflow.md](./post-mvp/030-lease-review-workflow.md) |
| 031 | RE-031 | Lifestyle scores persist on listings | [031-lifestyle-scores-persist.md](./post-mvp/031-lifestyle-scores-persist.md) |
| 032 | RE-032 | Bilingual lease disclaimer UX | [032-lease-disclaimer-ux.md](./post-mvp/032-lease-disclaimer-ux.md) |

---

## ADVANCED (`033`–`040`) — [`advanced/`](./advanced/)

OpenClaw, Paperclip, production gates, scale proof.

| # | ID | Title | File |
|---|-----|-------|------|
| 033 | RE-033 | Paperclip approval + budget gate | [033-paperclip-approval-budget-gate.md](./advanced/033-paperclip-approval-budget-gate.md) |
| 034 | RE-034 | OpenClaw sandbox WhatsApp intake | [034-openclaw-sandbox-intake.md](./advanced/034-openclaw-sandbox-intake.md) |
| 035 | RE-035 | OpenClaw approved template sends | [035-openclaw-approved-sends.md](./advanced/035-openclaw-approved-sends.md) |
| 036 | RE-036 | Hermes weekly market snapshot | [036-hermes-market-snapshot.md](./advanced/036-hermes-market-snapshot.md) |
| 037 | RE-037 | Postiz listing promotion pilot | [037-postiz-listing-pilot.md](./advanced/037-postiz-listing-pilot.md) |
| 038 | RE-038 | Rentals scope in `npm run floor` | [038-floor-rentals-scope.md](./advanced/038-floor-rentals-scope.md) |
| 039 | RE-039 | Concurrent lead / checkout load test | [039-concurrent-load-test.md](./advanced/039-concurrent-load-test.md) |
| 040 | RE-040 | Multi-city expansion playbook | [040-multi-city-playbook.md](./advanced/040-multi-city-playbook.md) |

---

**Last updated:** 2026-05-15 · **40** tasks · start **RE-001**
