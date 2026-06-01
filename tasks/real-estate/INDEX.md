---
title: Real estate tasks index
canonical_prd: ./real-estate-prd.md
canonical_roadmap: ./real-estate-roadmap.md
parent_index: ../INDEX.md
archived_done: ../archive/real-estate-A/README.md
persona: Camila
---

# Real estate tasks — INDEX

**PRD:** [`real-estate-prd.md`](./real-estate-prd.md) · **Roadmap:** [`real-estate-roadmap.md`](./real-estate-roadmap.md)  
**Implementation tasks:** [`tasks/INDEX.md`](./tasks/INDEX.md) (RE-001–016)

**Done backend** → [`../archive/real-estate-A/`](../archive/real-estate-A/README.md) (F17, F46, F47).

| ID | Title | Status | Notes |
|----|-------|--------|-------|
| RE-001–016 | See [tasks/INDEX.md](./tasks/INDEX.md) | Not Started / In Progress | Canonical backlog |
| [F24](./tasks/F24-rental-card-component.md) | RentalCard component | **Superseded** | → RE-004 / SCREEN-005 |
| [F41](./tasks/F41-rentals-page-map.md) | `/rentals` + map | Not Started | → RE-011 POST-MVP |
| F17, F46, F47 | Agent + workflow + leads | **Done** | archive |

## Screen specs (shipped — stay here)

| scr | wire | SCREEN | Status |
|-----|------|--------|--------|
| [009-scr-rental-card-polish](./wireframes/009-scr-rental-card-polish.md) | [009-wire-rental-search](./wireframes/009-wire-rental-search.md) | SCREEN-005 | In Progress → RE-004 |
| [017-scr-schedule-viewing-modal](./wireframes/017-scr-schedule-viewing-modal.md) | — | SCREEN-008 | In Progress → RE-006 |
| — | [009-wire-rentals-browse](./wireframes/009-wire-rentals-browse.md) | — | Frozen → RE-011 |

**Rule:** [MAP-001](../maps/MAP-001-platform-map-pipeline.md) before F41.

## Supabase / data dependencies

Schema work lives in [`../data/tasks-data/`](../data/tasks-data/) — not in this folder.

| Priority | Task | Unblocks |
|----------|------|----------|
| P0 | [data-019](../data/tasks-data/data-019-rentals-data-inventory.md) | Rental schema map |
| P1 | [data-020](../data/tasks-data/data-020-leads-rental-fk-columns.md) | `leads.apartment_id` — landlord CRM |
| P1 | [data-021](../data/tasks-data/data-021-showings-lead-bridge.md) | Schedule viewing → `showings` |
| P1 | [data-023](../data/tasks-data/data-023-rental-golden-queries.md) | RE-027 eval SQL |
| P1 | [data-009 M3](../data/tasks-data/data-009-schema-migrations-m1-m3.md) | `price_daily` indexes |
| P2 | [data-022](../data/tasks-data/data-022-apartments-neighborhood-fk.md) | Hood intelligence FK |
| P2 | [data-024](../data/tasks-data/data-024-rental-booking-commerce-prep.md) | RE-014 booking/Stripe |
| P2 | [data-025](../data/tasks-data/data-025-hermes-rental-analytics-tables.md) | Hermes batch analytics |

**Index:** [`../data/tasks-data/INDEX-data.md`](../data/tasks-data/INDEX-data.md)
