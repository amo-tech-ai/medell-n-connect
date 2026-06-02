# Venues — canonical implementation order

**Supersedes** the flat table in [`../INDEX.md`](../INDEX.md) for **execution priority and dependencies**. Use this file when deciding what to build next.

**Drill-down:** [`mvp/mvp-index.md`](mvp/mvp-index.md) · [`event-booking/INDEX.md`](event-booking/INDEX.md) · **Audit:** [`audit/03-venues-tasks-audit.md`](audit/03-venues-tasks-audit.md) · **Verify:** [`evidence/VEN-VERIFY-MATRIX.md`](evidence/VEN-VERIFY-MATRIX.md)

**Principle:** Do not mix **table booking** (`venue_booking_requests`), **nightlife routing**, and **private event proposals** (VEB) in one sprint. Data → UI shell → routing fix → cache → **persist** → approval UX → hardening → E2E → VEB.

---

## Status legend

| Symbol | Meaning |
|--------|---------|
| 🟢 | Done / live |
| 🟡 | Partial on disk |
| ⚪ | Not started |
| 🟥 | Blocked (dep, API, schema) |
| 🔥 | **Critical blocker** — wrong product behavior until fixed |

**Grade** from forensic audit 2026-06-02. Probe disk before marking Done.

---

## Phase map (top level)

```text
PHASE 0  Data foundation
PHASE 1  UI foundation (café + venue sheet shell)
PHASE 2  Restaurant + nightlife (VEN-012 = 🔥 routing)
PHASE 3  Places cache optimization
PHASE 4  Booking persistence core
PHASE 5  Booking approval + HITL + status UI
PHASE 6  Production hardening
PHASE 7  E2E verification
PHASE 8  Event venue booking (VEB) — separate product layer
PHASE 9  Post-MVP intelligence + automation (deferred)
```

---

## PHASE 0 — Data foundation

Everything downstream depends on clean venue types, schema, seeds, and Places cache.

| Order | ID | Task | Status | Depends on | Notes |
|------:|----|------|--------|------------|-------|
| 01 | [DATA-001](../../data/tasks-data/data-001-inventory.md) | Venue data inventory | 🟡 | — | Align with DATA-002 |
| 02 | [DATA-002](../../data/tasks-data/data-002-catalog-contract.md) | Three-kind catalog contract | ⚪ | DATA-001 | café · restaurant · nightclub |
| 03 | [DATA-009](../../data/archive/data-009-schema-migrations-m1-m3.md) | Schema M1–M3 | 🟢 | DATA-002 | `venue_booking_requests`, anchors |
| 04 | [DATA-035](../../data/archive/data-035-cafe-listings-venue-anchor-seed.md) | Café anchors (17) | 🟢 | DATA-009 | SAN-332 |
| 05 | [DATA-003](../../data/archive/data-003-cafe-seed.md) | Café seed sign-off | 🟢 | DATA-035 | |
| 06 | [DATA-004](../../data/archive/data-004-restaurant-seed.md) | Restaurant seed (44) | 🟢 | DATA-002 | |
| 07 | [DATA-005](../../data/archive/data-005-nightclub-seed.md) | Nightclub seed (13) | 🟢 | DATA-002 | `kind=nightclub` |
| 08 | [DATA-006](../../data/archive/data-006-golden-queries.md) | Golden queries JSON | 🟢 | DATA-003–005 | |
| 09 | [DATA-007](../../data/tasks-data/data-007-cache-audit.md) | Places cache audit | 🟢 | DATA-001+ | 2.7% hit baseline |
| 10 | [DATA-008](../../data/tasks-data/data-008-places-backfill-cron.md) | Places backfill | 🟥 | DATA-007 | API 403 — cache layer OK |

**Without Phase 0:** nightlife routing, cards, pins, and booking `venue_kind` mapping all drift.

---

## PHASE 1 — UI foundation

Map shell, card pattern, detail architecture — before nightlife-specific panels and booking polish.

| Order | ID | Task | Status | Depends on | Notes |
|------:|----|------|--------|------------|-------|
| 11 | [ARCH-005](../archive/005-scr-cafe-listings-map-booking.md) | SCREEN-021 café listings + map | 🟢 | DATA-035 | Live Vercel |
| 12 | [ARCH-006](../archive/006-scr-venue-detail-sheet.md) | SCREEN-007 rental/event sheet | 🟢 | — | Not café/restaurant panel |

---

## PHASE 2 — Restaurant + nightlife

**Dependency logic matters more than numeric IDs here.**

| Order | ID | Task | Status | Depends on | Priority | Notes |
|------:|----|------|--------|------------|----------|-------|
| 13 | [VEN-009](mvp/009-ven-restaurant-result-card.md) | Restaurant result card | 🟡 | DATA-004 | P0 | Card shell, chips, CTAs — **pattern for all venue cards** |
| 14 | [VEN-010](mvp/010-ven-restaurant-detail-panel.md) | Restaurant detail panel | 🟡 | VEN-009 | P0 | Slide panel + booking CTA pattern |
| 15 | [VEN-011](mvp/011-ven-nightlife-grounding-intent.md) | Nightlife grounding intent | 🟡 | DATA-005 | P0 | Tool query normalization — **before nightlife UI** |
| 16 | [VEN-012](mvp/012-ven-grounded-kind-split.md) | Grounded café vs nightlife split | 🟡 | VEN-011 | **🔥 P0** | **Core routing bug** — was `kind: "cafe"` for all grounded rows; code shipped 2026-06-02, e2e pending |
| 17 | [VEN-013](mvp/013-ven-nightlife-detail-panel.md) | Nightlife detail panel | 🟡 | VEN-012 | P0 | **Only after** kind split; SCREEN-022 |

### 🔥 VEN-012 — critical blocker (infrastructure)

Not a normal feature task. Until kind split is **Done-gated**:

- Nightlife queries open café tabs / wrong `data-result-kind`
- Wrong icons, pins meta, booking `venue_kind`
- INT-008 and SCREEN-022 are meaningless

**Parallel gate:** [INT-001…008](../../intelligence/tasks/INDEX.md) — **INT-008 after VEN-012 Done**.

---

## PHASE 3 — Places cache

After cards/panels exist; optimizes cost/latency — **not** before UI.

| Order | ID | Task | Status | Depends on | Notes |
|------:|----|------|--------|------------|-------|
| 18 | [VEN-014](mvp/014-ven-places-cache-field-mask.md) | Places cache + field mask | 🟡 | DATA-007–008, VEN-010, VEN-013 | `/api/places/detail`; wire all panels |

---

## PHASE 4 — Booking persistence core

**Persist before approval UX.** Avoid fake pending states without DB writes.

| Order | ID | Task | Status | Depends on | Notes |
|------:|----|------|--------|------------|-------|
| 19 | [VEN-015](mvp/015-ven-booking-requests-schema.md) | Booking schema + RLS | 🟡 | DATA-009 | Foundation for all booking |
| 20 | [VEN-016](mvp/016-ven-request-venue-booking-tool.md) | `requestVenueBooking` tool | 🟢 | VEN-015 | AI → booking bridge |
| 21 | [VEN-017](mvp/017-ven-booking-sheet.md) | Shared booking sheet / form | 🟡 | VEN-016 | café · restaurant · nightlife |
| 22 | [VEN-018](mvp/018-ven-mastra-tool-action-names.md) | Mastra ↔ CopilotKit registry | 🟢 | VEN-016 | |
| 23 | [VEN-021](mvp/021-ven-booking-sheet-persist.md) | Sheet → DB persist | 🟡 | VEN-016, VEN-017 | **`POST /api/venue-booking/request`** — must be stable before HITL/chips |

**Anti-pattern (old order):** VEN-019 HITL / VEN-020 status chips **before** VEN-021 → fake-ready trap.

---

## PHASE 5 — Booking approval + visual states

Only after Phase 4 persist is proven (signed-in insert).

| Order | ID | Task | Status | Depends on | Notes |
|------:|----|------|--------|------------|-------|
| 24 | [VEN-019](mvp/019-ven-booking-copilot-action.md) | Booking HITL (`renderAndWaitForResponse`) | ⚪ | VEN-016, VEN-017, VEN-018, **VEN-021** | CopilotKit mirror of tool |
| 25 | [VEN-020](mvp/020-ven-booking-status-chips.md) | Booking status chips | ⚪ | **VEN-021** | DB-driven pending/confirmed on detail panels |
| 26 | [VEN-022](mvp/022-ven-draft-venue-whatsapp.md) | `draftVenueWhatsApp` | ⚪ | VEN-016 | Draft only |
| 27 | [VEN-023](mvp/023-ven-wa-approval-outbox.md) | Patricia WA outbox | ⚪ | VEN-022, VEN-027 | |
| 28 | [VEN-024](mvp/024-ven-admin-booking-queue.md) | Admin booking queue | ⚪ | VEN-015 | `/admin/bookings` |

---

## PHASE 6 — Production hardening

| Order | ID | Task | Status | Depends on | Notes |
|------:|----|------|--------|------------|-------|
| 29 | [VEN-025](mvp/025-ven-rls-penetration-tests.md) | RLS penetration tests | ⚪ | VEN-015, VEN-016, VEN-021 | |
| 30 | [VEN-026](mvp/026-ven-booking-idempotency-duplicates.md) | Idempotency + duplicate UX | 🟡 | VEN-015–021 | |
| 31 | [VEN-027](mvp/027-ven-whatsapp-consent-suppression.md) | WhatsApp consent | ⚪ | VEN-022 | Before VEN-023 prod |
| 32 | [VEN-028](mvp/028-ven-booking-retry-error-recovery.md) | Retry + recovery | ⚪ | VEN-021, VEN-026 | No fake success chip |
| 33 | [VEN-029](mvp/029-ven-tool-action-registry-ci.md) | Registry CI | 🟡 | VEN-016, VEN-018 | |
| 34 | [VEN-030](mvp/030-ven-admin-audit-log.md) | Admin audit log | ⚪ | VEN-023, VEN-024 | |

Sequence: **security → duplicates → consent → recovery → CI → admin visibility**.

---

## PHASE 7 — E2E verification

After hardening — tests assert real persistence and recovery.

| Order | ID | Task | Status | Depends on | Notes |
|------:|----|------|--------|------------|-------|
| 35 | [VEN-031](mvp/031-ven-playwright-venue-screens.md) | Playwright SCREEN-021/022/023 | 🟡 | VEN-010, VEN-013, **VEN-021+** | Agent flake; needs signed-in booking proof |

**Do not treat VEN-031 as “early QA”.** It is the **release gate** after booking spine + routing fix.

---

## PHASE 8 — Event venue booking (VEB)

**Separate product layer** — Roberto/Carlos **private event** proposals, not dinner `venue_booking_requests` alone.

**Hub:** [`event-booking/INDEX.md`](event-booking/INDEX.md) · [`../docs/venues-booking.md`](../docs/venues-booking.md)

### Hard gate — do not start VEB MVP until:

```text
VEN-021 Done (persist + signed-in e2e)
VEN-031 green (SCREEN-021/022/023)
VEN-012 Done (nightlife routing)
```

Otherwise you duplicate unfinished booking forms, queues, and moderation.

| Order | ID | Task | Status | Depends on |
|------:|----|------|--------|------------|
| 48 | [VEB-001](event-booking/VEB-001-core-event-venue-offerings-schema.md) | Event offerings schema | 🟥 | DATA-009, VEN-015 |
| 49–59 | VEB-002…012 | Event booking MVP chain | 🟥 | See event-booking INDEX |

---

## PHASE 9 — Optional / deferred

| Block | When | Tasks |
|-------|------|-------|
| Coffee tours | After venue MVP | VEN-032…043, post-mvp 044…051 |
| Post-MVP agent polish | After VEN-031 | `post-mvp/` VEN-025…034 (different paths — see duplicate ID table) |
| Intelligence reranking | After VEN-012 Done | INT-001…008 |
| WhatsApp automation prod | After VEN-027 + VEN-023 | VEN-022/023 |

---

## Duplicate VEN ID warning

| ID | `mvp/` | `post-mvp/` |
|----|--------|-------------|
| VEN-025 | RLS penetration | Concierge instructions |
| VEN-026 | Idempotency | normalizeToolOutput |
| VEN-027 | WA consent | Unified detail types |
| VEN-028 | Retry UX | Working memory |
| VEN-029 | Registry CI | Filter chips |
| VEN-030 | Admin audit | Booking workflow |
| VEN-031 | Playwright screens | Vitest card renders |

Always use **full path** in commits and PRs.

---

## Release stop condition (venues MVP)

Production-safe when **all** are true:

1. **VEN-012** Done — nightlife ≠ café routing (e2e SCREEN-022)
2. **DATA-008** backfill unblocked OR documented N/A with cache-only path
3. **VEN-021** Done — signed-in booking insert proof
4. **VEN-019/020** only if 021 is Done (no fake approval UX)
5. **VEN-025, 027, 028, 029, 030** evidence attached
6. **VEN-031** — SCREEN-021/022/023 green on CI or documented flake budget

**VEB:** not required for venues MVP stop — separate launch criteria in VEB INDEX.

---

## Audit verdict (user review 2026-06-02)

| Area | Verdict |
|------|---------|
| Data sequencing | ✅ Correct |
| UI foundation sequencing | ✅ Correct |
| Nightlife sequencing | ✅ Correct — **elevate VEN-012 to 🔥** |
| Booking sequencing | ✅ **Fixed** — persist (021) before HITL (019) and chips (020) |
| Hardening sequencing | ✅ Strong |
| VEB separation | ✅ Correct — gate on 021 + 031 |
| Automation timing | ✅ Correctly deferred |

Overall: **architecture order ~90%**; this index applies the **execution priority** refinements.

*Updated: 2026-06-02 — canonical order; supersedes flat booking order in `../INDEX.md`*
