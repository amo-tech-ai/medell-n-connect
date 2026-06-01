---
title: mdeai — Master execution plan (consolidated)
updated: 2026-05-30
owner: sanjiovani
canonical_index: tasks/INDEX.md
mvp_exit: tasks/MVP-REQUIRED.md
progress_tracker: tasks/progres.md
checklist: checklist.md
strategy: prd.md
roadmap: roadmap.md
advanced: advanced.md
mvp_execution: tasks/MVP-EXECUTION.md
---

# mdeai — Master execution plan

## At a glance (2026-05-30 audit)

**What this is:** One ordered backlog from “already shipped” (Tier 0) through MVP exit, UX fixes, and post-MVP depth. Follow rows top-to-bottom; only `‖` rows may run in parallel.

| Question | Answer in plain English |
|----------|-------------------------|
| **Are we done?** | **No — MVP exit is not closed.** Platform tests are green; **commerce proofs and prod UX** are not. |
| **What works today?** | Camila gets **rentals + cafés on `/`**, map pins, and **lead capture (G2)**. Code ships at `8c99ded`; **www.mdeai.co returns 200**. |
| **What’s broken for exit?** | Andrés **paid ticket proof (G1)**, **webhook secret split (EVP-003)**, **event cards in chat (EVP-013)**, Roberto **publish proof (G3)**, then **EVP-001 ledger**. |
| **What else is P0?** | **UX pack** — price parser, visible errors, loading state, prod monitor (‖ prod sign-off F32 / AUTH-011 / maps prod). |
| **MVP readiness score** | **72/100** (forensic) — see [`tasks/progres.md`](tasks/progres.md) · success criteria [`checklist.md`](checklist.md) |
| **Floor today** | `lint` + **313** Vitest + `build` + `floor` → **exit 0** @ `8c99ded` |

### Do this next (operator order)

See [`tasks/MVP-EXECUTION.md`](tasks/MVP-EXECUTION.md) — module-based P0 queue.

```text
1. PAY-001 paid ticket on prod          (Payments / SAN-178)
2. PAY-003 webhook secrets             (Payments / SAN-116)
3. EVT-013 event-card e2e              (Events / SAN-117)
4. EVT-002 host publish SQL proof      (Events / SAN-366)
5. EVT-001 ledger                      (Events / SAN-115)
   then in parallel:
6. OPS-002 ‖ AUTH-011 ‖ MAP-002B ‖ MAP-008B   (after EVT-001 for AUTH/OPS)
7. UX-003 → UX-002+005 → UX-009 → UX-006+007 → UX-008
```

Full dashboard: [`tasks/MVP-EXECUTION.md`](tasks/MVP-EXECUTION.md)

**Live queue:** [`todo.md`](todo.md) · **Forensic table:** [`tasks/progres.md`](tasks/progres.md)

---

> **This file is the single execution order** for all remaining work.  
> **MVP queue (module-based):** [`tasks/MVP-EXECUTION.md`](tasks/MVP-EXECUTION.md) · [`tasks/linear/mvp-queue.json`](tasks/linear/mvp-queue.json)  
> **MVP exit definition** (what “done” means): [`tasks/MVP-REQUIRED.md`](tasks/MVP-REQUIRED.md)  
> **Slim router + track indexes:** [`tasks/INDEX.md`](tasks/INDEX.md)  
> **Strategy / PRD:** [`prd.md`](prd.md) · [`plan/prd/README.md`](plan/prd/README.md)  
> **Now/Next/Later narrative:** [`roadmap.md`](roadmap.md) · **Post-MVP depth:** [`advanced.md`](advanced.md)

| Dot | Meaning |
|-----|---------|
| 🟢 | Complete |
| 🟡 | In progress |
| 🔴 | Blocked / failed |
| ⚪ | Not started |

**North star:** Camila on `/` · Andrés paid ticket · Roberto host publish @ https://www.mdeai.co

---

## How to read this plan

| Tier | Purpose | When to run | Phase tag |
|------|---------|-------------|-----------|
| **0** | Already built — reference only, don’t redo | Already shipped — do not re-execute | CORE / MVP |
| **1–1C** | **Ship MVP + fix prod chat UX** — Andrés pays, Roberto publishes, Tourist never sees silent failures | **Now** — MVP exit + UX remediation (‖ where marked) | MVP / CORE |
| **2** | **MVP polish** — host list, login UX, map panel | After Tier 1 + 1C P0 rows 🟢 | MVP |
| **3–4** | **Smarter chat + real venue data** — Camila gets clarify + seeded cafés | After MVP exit — data + intelligence CORE | CORE / MVP |
| **5–9** | **Full product depth** — venues app, maps, trips, events discovery | Post-MVP product tracks | MVP / ADV |
| **10** | **Automation & Phase 2** — OpenClaw, admin, hardening | Phase 2+ automation | ADV |

**Parallel rules:** Only rows marked `‖` may run together. **IMP** numbers match [`tasks/linear/core-mvp-order.json`](tasks/linear/core-mvp-order.json).

---

## Tier 0 — Shipped 🟢

| Track | Purpose | Scope | Index |
|-------|---------|-------|-------|
| Foundation | App boots, deploys, and agents run — the platform Camila/Roberto build on | F01–F06, F07–F13, F18–F19 | [`tasks/archive/core/`](tasks/archive/core/README.md) |
| CopilotKit / chat shell | `/chat` concierge UI wired to Mastra — where Camila talks to the agent | F48–F50b | [`tasks/archive/copilot-A/`](tasks/archive/copilot-A/README.md) |
| Maps platform | Map column, pins, and Places — Tourist sees rentals/cafés on the map | MAP-001–004, 007–009, 002D/E, 030/031… | [`tasks/archive/maps-A/`](tasks/archive/maps-A/README.md) |
| Mastra / ADK / grounding | Agent tools + Google grounding — answers backed by real places, not guesses | MASTRA-*, CR-00–06, GS-001–004 | archives under `tasks/archive/` |
| Events core code | Host wizard, tickets, Stripe hooks — Roberto creates events Andrés can buy | EVP-002, 004–012, 017 | [`tasks/archive/events-A/`](tasks/archive/events-A/README.md) |
| Rentals backend | Search API + pins — Camila gets apartment cards from chat | F17, F46, F47 | [`tasks/archive/real-estate-A/`](tasks/archive/real-estate-A/README.md) |
| Auth batch | Sign-in, sessions, RLS — users only see their own data | AUTH-001–004, 006–008, 010 | [`tasks/archive/data-A/`](tasks/archive/data-A/README.md) |
| Screens + café UI | Layout + café cards/detail — Tourist gets rich café results, not link blobs | SCREEN-001–016, 019–020, **SCREEN-021 / CAF-A5** | [`tasks/screens/`](tasks/screens/INDEX.md) · [`tasks/venues/cafes/`](tasks/venues/cafes/INDEX.md) |
| IMP ledger | Historical record of shipped slices — Sofía’s audit trail | IMP-001–078 | [`tasks/archive/README.md`](tasks/archive/README.md) |

---

## Tier 1 — P0 MVP exit (strict order) 🔴🟡

Execute **top to bottom**. Sequence B only after **EVP-001** (row 5) is unblocked.

### Sequence A — Commerce + host proof

| IMP | ID | Purpose | % | Status | Spec |
|----:|----|---------|--:|:------:|------|
| 079 | OPS-ANDRES-G1 | **Andrés pays for a real ticket on prod** — proves Stripe checkout works | 80 | 🟡 | [`todo.md`](todo.md) |
| 080 | EVP-003-core | **Separate ticket vs sponsor webhook secrets** — forged webhooks can’t steal payments | 60 | 🔴 | [`tasks/events/EVP-003-core-stripe-webhook-secret-audit.md`](tasks/events/EVP-003-core-stripe-webhook-secret-audit.md) |
| 081 | EVP-013-core | **Event cards in chat** — Andrés sees ticketed events, not raw JSON | 45 | 🔴 | [`tasks/events/EVP-013-core-event-card-component.md`](tasks/events/EVP-013-core-event-card-component.md) |
| 082 | G3-core-host-publish-proof | **Roberto publishes an event on prod** — host wizard → live event page | 90 | 🟡 | [`tasks/events/G3-core-host-publish-proof.md`](tasks/events/G3-core-host-publish-proof.md) |
| 083 | EVP-001-core | **Events MVP exit gates on production** — all P0 proofs green before sign-off | 0 | 🔴 | [`tasks/events/EVP-001-core-production-proof-gates.md`](tasks/events/EVP-001-core-production-proof-gates.md) |

```text
079 → 080 → 081 → 082 → 083
```

### Sequence B — Prod sign-off (‖ after 083)

| IMP | ID | Purpose | % | Status | Spec |
|----:|----|---------|--:|:------:|------|
| 084 | F32 | **Full prod smoke pass** — key routes/APIs healthy on mdeai.co | 0 | ⚪ | [`tasks/core/F32-production-smoke.md`](tasks/core/F32-production-smoke.md) |
| 085 | AUTH-011 | **Login/signup works on prod** — Camila and Roberto can authenticate safely | 40 | 🟡 | [`tasks/data/tasks/AUTH-011-production-auth-checklist.md`](tasks/data/tasks/AUTH-011-production-auth-checklist.md) |
| 091 | MAP-002B | **Deploy grounding service to prod** — concierge places search works in production | 0 | ⚪ | [`tasks/maps/MAP-002B-prod-adk-deploy.md`](tasks/maps/MAP-002B-prod-adk-deploy.md) |
| 092 | MAP-008B | **Verify Maps mapId on Vercel** — pins render on prod, not blank/broken map | 0 | ⚪ | [`tasks/maps/MAP-008B-vercel-map-id-verify.md`](tasks/maps/MAP-008B-vercel-map-id-verify.md) |

```text
084 ‖ 085 ‖ 091 ‖ 092
```

---

## Tier 1C — UX prod remediation (P0 priority) 🟡⚪

**Camila/Tourist on `/` must never hit silent `RUN_ERROR`, wrong rental prices, or duplicate result surfaces.** Full pack: [`tasks/ux/INDEX.md`](tasks/ux/INDEX.md) · audit: [`tasks/ux/audit/audit-ux-tasks.md`](tasks/ux/audit/audit-ux-tasks.md)

**Run in parallel with Sequence B** (084–092) — do not wait for EVP-001. **UX-010** is architecture (separate PRs after C-012 merges).

### Sequence C — Live-site fixes (corrected 2026-05-29)

| IMP | ID | Purpose | % | Status | Spec |
|----:|----|---------|--:|:------:|------|
| 093 | UX-003 | **Fix “$500 a night” rental parser** — Camila’s budget filter matches natural language | 0 | ⚪ | [`tasks/ux/UX-003-deploy-price-wording-parser-fix.md`](tasks/ux/UX-003-deploy-price-wording-parser-fix.md) |
| 094 | UX-002 | **Show retryable error on agent timeout** — Tourist sees failure, not blank chat | 0 | ⚪ | [`tasks/ux/UX-002-render-user-facing-error-on-run-error.md`](tasks/ux/UX-002-render-user-facing-error-on-run-error.md) |
| 095 | UX-005 | **Visible “thinking” during concierge runs** — pairs with UX-002 (same PR) | 0 | ⚪ | [`tasks/ux/UX-005-add-concierge-loading-indicator.md`](tasks/ux/UX-005-add-concierge-loading-indicator.md) |
| 096 | UX-004 | **Gate Events/Food chips while concierge down** — *optional; skip if concierge stays green* | 0 | ⚪ | [`tasks/ux/UX-004-disable-events-food-chips-while-concierge-down.md`](tasks/ux/UX-004-disable-events-food-chips-while-concierge-down.md) |
| 097 | UX-001 | **Restore conciergeAgent on prod** — same-origin `/api/copilotkit` (PR #13) | 100 | 🟢 | [`tasks/ux/UX-001-restore-concierge-agent-prod.md`](tasks/ux/UX-001-restore-concierge-agent-prod.md) |
| 098 | UX-006 | **“New chat” clears thread + map pins** — Camila starts fresh without stale state | 0 | ⚪ | [`tasks/ux/UX-006-new-chat-reset-thread-and-map.md`](tasks/ux/UX-006-new-chat-reset-thread-and-map.md) |
| 099 | UX-007 | **Clear stale AdvancedMarkers** — empty search leaves zero ghost pins | 0 | ⚪ | [`tasks/ux/UX-007-clear-stale-advanced-markers.md`](tasks/ux/UX-007-clear-stale-advanced-markers.md) |
| 100 | UX-008 | **Fix Save tooltip copy** — remove internal “SCREEN-011” string | 0 | ⚪ | [`tasks/ux/UX-008-fix-save-tooltip-copy.md`](tasks/ux/UX-008-fix-save-tooltip-copy.md) |
| 101 | UX-009 | **Prod synthetic concierge monitor** — Sofía catches regressions before Tourists do | 0 | ⚪ | [`tasks/ux/UX-009-prod-synthetic-concierge-monitor.md`](tasks/ux/UX-009-prod-synthetic-concierge-monitor.md) |
| 102 | UX-010 | **Unified result cards** — one search hit = one rich card + one pin (M0→M5) | 15 | 🟡 | [`tasks/ux/UX-010-unified-result-card-architecture.md`](tasks/ux/UX-010-unified-result-card-architecture.md) |

```text
093 → 094+095 (same PR) → 101 → 098+099 → 100
097 🟢 (shipped PR #13)
096 optional (skip if concierge green)
102 after C-012 merge — separate branch/PRs (M0→M5); audit: tasks/ux/audit/10-audit-cards.md
```

**Parallel:** `093…101 ‖ 084…092` (same staffing window as MVP prod sign-off).

---

## Tier 2 — P1 MVP polish (after Tier 1 all 🟢)

| IMP | ID | Purpose | % | Status | Spec |
|----:|----|---------|--:|:------:|------|
| 086 | EVP-014-core | **Roberto’s “My events” list** — manage drafts and published events | 0 | ⚪ | [`tasks/events/EVP-014-core-host-events-list-page.md`](tasks/events/EVP-014-core-host-events-list-page.md) |
| 087 | SCREEN-017 | **Polish login/signup screens** — less friction for new hosts and renters | 0 | ⚪ | [`tasks/screens/017-scr-login-signup-polish.md`](tasks/screens/017-scr-login-signup-polish.md) |
| 088 | SCREEN-010 | **Map exploration panel UX** — Tourist browses pins without losing chat context | 0 | ⚪ | [`tasks/maps/wireframes/011-scr-map-exploration-panel.md`](tasks/maps/wireframes/011-scr-map-exploration-panel.md) |
| 089 | MAP-010 | **Venue autocomplete for hosts** — Roberto picks a real place when setting event location | 0 | ⚪ | [`tasks/maps/MAP-010-place-autocomplete-venue.md`](tasks/maps/MAP-010-place-autocomplete-venue.md) — conditional |
| 090 | AUTH-005 | **Automated auth e2e tests** — catch login regressions before Camila hits them | 0 | ⚪ | [`tasks/data/tasks/AUTH-005-playwright-auth-e2e.md`](tasks/data/tasks/AUTH-005-playwright-auth-e2e.md) — quality, not exit alone |

---

## Tier 3 — Intelligence CORE (parallel with Tier 4 early steps) ⚪

**Unblocks smart chat for all verticals.** Full table: [`tasks/intelligence/tasks/INDEX.md`](tasks/intelligence/tasks/INDEX.md)

```text
INT-001 → INT-002 → INT-003 → INT-004 → INT-005
```

| Order | ID | Purpose | P | Implements (rental) |
|------:|----|---------|---|---------------------|
| 1 | INT-001 | **Remember budget/neighborhood across turns** — Camila doesn’t repeat herself | P0 | Shared intent slots |
| 2 | INT-002 | **Parse “2BR under $80 in Laureles”** — structured filters from natural language | P0 | [RE-017](tasks/real-estate/tasks/RE-017-rental-parser-intelligence.md) |
| 3 | INT-003 | **Ask smart clarifying questions** — agent fills gaps instead of wrong search | P0 | [RE-018](tasks/real-estate/tasks/RE-018-gemini-rental-clarify-routing.md) |
| 4 | INT-004 | **No fake canned replies** — every clarify goes through the real agent | P0 | No canned clarify bypass |
| 5 | INT-005 | **Lock in rental clarify behavior** — tests so regressions get caught | P0 | Regression tests |

**Run in parallel with MVP exit** when possible — Camila rental clarify is P0 for `/chat`.

---

## Tier 4 — Data foundation (after data-001 🟡, ideally after MVP exit) ⚪

**Index:** [`tasks/data/tasks-data/INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md)

### 4A — Venues + commerce schema (P0)

```text
data-001 → data-002 → data-009 (M1 booking + M2 venue_anchors)
  → data-035 (café listings seed: IG, web, vibe, metadata)
  → data-003 (café sign-off + golden queries)
  → data-004 ‖ data-005 (restaurant ‖ nightclub seeds)
  → data-006 → data-007 → data-008 (golden queries → cache → backfill)
```

| Step | ID | Purpose | Notes |
|------|-----|---------|-------|
| 1 | DATA-001 | **Know what tables exist today** — baseline before adding venue data | Inventory 🟡 |
| 2 | DATA-002 | **One schema for cafés, restaurants, clubs** — shared `metadata` shape | Three-kind contract + `metadata` v1 |
| 2b | DATA-009 | **Booking requests + map anchors** — Tourist can request a visit; pins link to DB rows | `venue_booking_requests` + `venue_anchors` |
| 3b | **DATA-035** | **Seed real café listings** — curated catalog instead of Places-only results | **Listings → café seed** — [`tasks/venues/tasks/listings/`](tasks/venues/tasks/listings/) |
| 3 | DATA-003 | **Sign off café data quality** — golden queries pass after seed | Sign-off after DATA-035 |
| 4–5 | DATA-004/005 | **Seed restaurants and nightclubs** — same pattern as cafés | Restaurant / nightclub |
| 6–8 | DATA-006/007/008 | **Measure search quality + cache Places** — cheaper, faster repeat lookups | Eval + Places cache |

### 4B — Rentals data (Camila CRM)

```text
data-019 → data-020 → data-021 → data-023
```

### 4C — Trips data

```text
data-026 → data-027 → data-029 → data-028 → data-030
```

### 4D — Events / maps / hardening

| Track | Purpose | Order |
|-------|---------|-------|
| Events schema | **Ticket/order tables Roberto & Andrés rely on** | data-012 → 013/016/018 → 014/015/017 |
| Maps geo | **Routes + geospatial cache** — directions and map-heavy features | data-034 ‖ MAP-005 · data-033 (route_cache) |
| Security | **RLS + audit hardening** — Patricia’s ops data stays locked down | data-010 · data-011 |
| Vectors | **Embeddings for semantic search** — “find places like this” later | VEC-001 (before INT-016) |

---

## Tier 5 — Venues MVP (VEN-009 … VEN-051) ⚪

**Purpose:** Full **café/restaurant/nightclub product** — booking, WhatsApp, admin — beyond today’s chat cards (C-012).

**Index:** [`tasks/venues/tasks/mvp/mvp-index.md`](tasks/venues/tasks/mvp/mvp-index.md)  
**Intelligence crosswalk:** [`tasks/venues/CROSSWALK-INT.md`](tasks/venues/CROSSWALK-INT.md)

**Prerequisite:** DATA-002, DATA-009; **DATA-035** for seeded café catalog.

```text
DATA (4A cafe path) → VEN-009…013 (UI) → VEN-014 (places cache)
  → VEN-015…024 (booking/WA/admin) → VEN-025…030 (hardening) → VEN-031 (E2E)
  → VEN-032…043 (coffee tours, optional ‖)
  → post-mvp VEN-025…034 (agent polish — different folder!)
  → VEN-044…051 (tour post-MVP)
```

**INT gates:** INT-001 before **VEN-012**; **INT-008** after VEN-012.

**Note:** `mvp/025` (RLS) ≠ `post-mvp/025` (concierge) — same VEN number, different folders.

---

## Tier 6 — Intelligence MVP → ADV ⚪

```text
MVP:     INT-006 → INT-007 → INT-008 → INT-009 → INT-010
POST:    INT-011 → INT-012 → INT-013 → INT-014 → INT-015
ADV:     INT-016 → INT-017 → INT-018 → INT-019 → INT-020  (needs VEC-001…003)
```

| ID | Purpose | Ties to |
|----|---------|---------|
| INT-008 | **Smarter café/venue ranking in chat** | VEN-012, SCREEN-021 cafés |
| INT-010 | **Remember preferences across sessions** | post-mvp VEN-028 working memory |
| INT-016 | **Personalized tour suggestions** | VEN-044 tour embeddings vs user memory |

---

## Tier 7 — Maps depth (ADV) ⚪

**Purpose:** **Production-grade maps** — routes, clustering, ADK proxy — after basic pins work on prod.

**After MAP-005 proxy.** [`tasks/maps/INDEX.md`](tasks/maps/INDEX.md)

```text
MAP-005 → MAP-006 → MAP-012A → MAP-012 → MAP-010
  → data-033 → MAP-011A → MAP-011 → MAP-023
MAP-034 ‖ data-034 ‖ data-007 (after MAP-005)
```

---

## Tier 8 — Real estate + Trips apps (ADV) ⚪

| Track | Purpose | Order | Index |
|-------|---------|-------|-------|
| **RE app** | **Full rentals product for Camila** — search, leads, CRM, smarter chat | RE-001 → 003…010 → 015/016; **RE-017…020** = INT rental impl | [`tasks/real-estate/tasks/INDEX.md`](tasks/real-estate/tasks/INDEX.md) |
| **Trips** | **Day-trip itineraries for Tourist** — plan Medellín stays in one thread | TRIP-001 → TRIP-012 after data-026…029 | [`tasks/trips/tasks/INDEX.md`](tasks/trips/tasks/INDEX.md) |

---

## Tier 9 — Events ADV + vector + grounding ⚪

| Track | Purpose | Order | Index |
|-------|---------|-------|-------|
| Events discovery | **Find events beyond host wizard** — browse, filter, recommend | EVP-015 → EVP-028 | [`tasks/events/tasks/INDEX.md`](tasks/events/tasks/INDEX.md) |
| Vector | **Semantic search infrastructure** — similar venues/events by meaning | VEC-001 → VEC-005 | [`tasks/vector/INDEX.md`](tasks/vector/INDEX.md) |
| Grounding | **Better Google-backed answers** — richer Places + web grounding | GS-005 → GS-009 | [`tasks/grounding-search/tasks/INDEX.md`](tasks/grounding-search/tasks/INDEX.md) |
| CopilotKit gaps | **Close CK v1 gaps before Phase 2 upgrade** | CK-001 → CK-008 | [`tasks/copilotkit/INDEX.md`](tasks/copilotkit/INDEX.md) |

---

## Tier 10 — Core post-MVP + Phase 2+ ⚪

| Track | Purpose | IDs | Index |
|-------|---------|-----|-------|
| Core platform | **Observability, i18n, admin** — Patricia dashboards, Phase 2 polish | F20, F21A, F22, F26, F30 | [`tasks/core/README.md`](tasks/core/README.md) |
| OpenClaw | **Background enrichment on VPS** — auto-fill venue data off the hot path | OCL-001…042 | [`tasks/openclaw/index-ocl.md`](tasks/openclaw/index-ocl.md) |
| Contest | **Hackathon / demo flows** — one-off event tooling | CTEST-* | [`tasks/contest/INDEX.md`](tasks/contest/INDEX.md) |
| Auth hardening | **Extra auth security** — beyond MVP login checklist | AUTH-009 | [`tasks/data/auth/INDEX.md`](tasks/data/auth/INDEX.md) |

---

## Task correctness audit (2026-05-28)

| Issue | Verdict | Fix |
|-------|---------|-----|
| Venues `ven-01–24` in old docs | **Retired** | Use **VEN-009…051** + [`VEN-MIGRATION`](tasks/venues/tasks/VEN-MIGRATION-2026-05-28.md) |
| `CTI-*` prefix | **Retired** | Coffee tours = **VEN-032…051** |
| `tasks/venues/tasks-intelligent/` | **Never existed** | Use `tasks/venues/tasks/mvp/` |
| `cafes/listings/` path | **Wrong** | Canonical: `tasks/venues/tasks/listings/` |
| Café seed only in DATA-003 | **Incomplete** | **DATA-035** owns listings ETL |
| Duplicate venues rows in INDEX | **Fixed** | One row → [`venues/tasks/INDEX.md`](tasks/venues/tasks/INDEX.md) |
| roadmap “current state” May 24 | **Stale** | Use this plan + [`todo.md`](todo.md) for live queue |
| IMP-079–092 | **Correct** | Matches MVP-REQUIRED P0 |
| IMP-093–102 (UX) | **Added 2026-05-29** | P0 priority — [`tasks/ux/INDEX.md`](tasks/ux/INDEX.md); UX-001 🟢; UX-010 blocked on C-012 merge |

**Specs are ~88% execution-ready** after 2026-05-28 venues renumber + DATA-035; **MVP exit still 🔴** until Tier 1 complete. **UX P0 (093–095, 101)** should ship ‖ Tier 1B — prod chat quality is not deferrable.

---

## Doc map (one place per concern)

| Need | File |
|------|------|
| **Execution order (this file)** | [`plan.md`](plan.md) |
| **MVP exit gates** | [`tasks/MVP-REQUIRED.md`](tasks/MVP-REQUIRED.md) |
| **Task router + indexes** | [`tasks/INDEX.md`](tasks/INDEX.md) |
| **MVP pointer** | [`mvp.md`](mvp.md) |
| **Strategy PRD index** | [`prd.md`](prd.md) |
| **Now/Next/Later** | [`roadmap.md`](roadmap.md) |
| **Post-MVP / Phase 2** | [`advanced.md`](advanced.md) |
| **Live operator queue** | [`todo.md`](todo.md) |
| **Linear machine queue** | [`tasks/linear/core-mvp-order.json`](tasks/linear/core-mvp-order.json) |

*Last reviewed: 2026-05-30 — full progress-tracker audit; floor 313 tests; MVP **No-Go** until Tier 1 + 1C P0*
