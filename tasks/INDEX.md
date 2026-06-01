---
title: mdeai Task Index (slim)
updated: 2026-05-31
owner: sanjiovani
plan: ../plan.md
todo: ../todo.md
mvp_required: ./MVP-REQUIRED.md
mvp_execution: ./MVP-EXECUTION.md
mvp_queue: ./linear/mvp-queue.json
linear_plan: ./linear/07-mvp.md
---

# mdeai — Task Index

> **Live P0 queue:** [`MVP-EXECUTION.md`](MVP-EXECUTION.md) · [`../todo.md`](../todo.md)  
> **Strategy:** [`../prd.md`](../prd.md) · **Now/Next/Later:** [`../roadmap.md`](../roadmap.md) · **Post-MVP depth:** [`../advanced.md`](../advanced.md)

**North star:** Camila on `/` (cards + pins) · Andrés paid ticket · Roberto host publish @ https://www.mdeai.co

> **Progress audit (2026-05-30):** [`../progress/may30.md`](../progress/may30.md) · **72%** MVP · floor **313** tests · **Skills:** [`../index-skills.md`](../index-skills.md) · **Done criteria:** [`../checklist.md`](../checklist.md)
>
> **MVP dashboard (frozen):** [`MVP-EXECUTION.md`](MVP-EXECUTION.md) · [`linear/mvp-queue.json`](linear/mvp-queue.json) · [`linear/NAMING-CLEANUP-REPORT.md`](linear/NAMING-CLEANUP-REPORT.md)  
> **Linear titles:** PAY-*, EVT-*, UX-*, MAP-*, AUTH-*, OPS-* — IMP/EVP/SCREEN deprecated  
> **Views:** [MVP](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) `label:phase:launch` · [UX](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) `label:track:ux`

| Dot | Status |
|-----|--------|
| 🟢 | Complete |
| 🟡 | In progress |
| 🔴 | Failed / blocked |
| ⚪ | Not started |

---

## Master implementation order (remaining work)

Execute **top to bottom** within each tier. **`‖`** = parallel OK. Full detail: [`../plan.md`](../plan.md).

```text
TIER 0 — Shipped 🟢
  IMP-001–078 · archives under tasks/archive/

TIER 1 — P0 MVP exit (strict)
  079 G1 → 080 EVP-003 → 081 EVP-013 → 082 G3 → 083 EVP-001
  084 F32 ‖ 085 AUTH-011 ‖ 091 MAP-002B ‖ 092 MAP-008B

TIER 1C — UX prod remediation (P0 priority, ‖ Tier 1B)
  093 UX-003 → 094 UX-002+095 UX-005 → 101 UX-009 → 098 UX-006+099 UX-007 → 100 UX-008
  097 UX-001 🟢 · 096 UX-004 🚫 Canceled · 102 UX-010 (after PR #14 merges)
  Index: tasks/ux/INDEX.md

TIER 2 — P1 MVP polish (after Tier 1 all 🟢)
  086 EVP-014 → 087 SCREEN-017 → 088 SCREEN-010 → 089 MAP-010 (conditional)
  090 AUTH-005 (quality — parallel OK)

TIER 3 — Intelligence CORE (‖ Tier 1 when staffed)
  INT-001 → INT-002 → INT-003 → INT-004 → INT-005
  Index: tasks/intelligence/intelligence-plan.md (MIS roadmap)
  INT specs: tasks/intelligence/tasks/INDEX.md

TIER 4 — Data foundation
  4A venues: data-001 → 002 → 009 → 035 → 003 → 004‖005 → 006 → 007 → 008
  4B rentals: data-019 → 020 → 021 → 023
  4C trips: data-026 → 027 → 029 → 028 → 030
  4D events/maps/security: data-012…018 · data-034‖MAP-005 · data-010/011 · VEC-001
  Index: tasks/data/tasks-data/INDEX-data.md

TIER 5 — Venues MVP (VEN-009…051)
  DATA-002+009 (+ DATA-035 for café seed) → VEN-009…013 → 014 → 015…024 → 025…030 → 031
  → VEN-032…043 (tours, optional ‖) → post-mvp VEN-025…034 → VEN-044…051
  Index: tasks/venues/tasks/mvp/mvp-index.md · crosswalk: tasks/venues/CROSSWALK-INT.md

TIER 6 — Intelligence MVP → ADV
  INT-006…010 (MVP) → INT-011…015 (POST) → INT-016…020 (ADV, needs VEC-001…003)

TIER 7 — Maps depth (ADV, after MAP-005)
  MAP-005 → 006 → 012A → 012 → 010 → data-033 → 011A → 011 → 023 · MAP-034

TIER 8 — Real estate + Trips apps (ADV)
  RE-001…020 (RE-017…020 = INT rental impl) · TRIP-001…019 after data-026…029

TIER 9 — Events ADV + vector + grounding + CK gaps
  EVP-015…047 · VEC-001…005 · GS-005…009 · CK-001…008

TIER 10 — Core post-MVP + Phase 2+
  F20, F21A, F22, F26, F30 · OCL-* · CTEST-* · AUTH-009
```

**Retired IDs (do not use in new specs):** `ven-01–24` · `CTI-*` · `tasks/venues/tasks-intelligent/` · `cafes/listings/` (use `tasks/venues/tasks/listings/`). Migration: [`venues/tasks/VEN-MIGRATION-2026-05-28.md`](venues/tasks/VEN-MIGRATION-2026-05-28.md).

---

## Metrics (2026-05-31)

| Metric | Value | Status |
|--------|------:|:------:|
| Overall MVP readiness | **72%** | 🟡 |
| Shipped foundation (IMP-001–078) | 78 tasks | 🟢 |
| **Active P0 open** | **9 MVP + 8 UX** (UX-001 🟢; UX-004 🚫 Canceled) | 🟡 |
| **Active P1 open** | **5** | ⚪ |
| Post-MVP tracks catalogued | 22 indexes | ⚪ |
| Tests / floor | **318/318** Vitest · floor exit 0 @ `a9fffe8` | 🟢 |
| Prod | https://www.mdeai.co HTTP **200** | 🟢 |
| PR #14 + #15 | ✅ MERGED → main (`a9fffe8`) | 🟢 |
| MVP exit (G1+G3+EVP-001 ledger) | **not closed** | 🟥 |
| Progress tracker | [`progres.md`](progres.md) · [`../checklist.md`](../checklist.md) | 🟢 |

**Verification (2026-05-30):** lint · test **318** · build · floor · `verify:maps` — exit 0. SCREEN-006 🟢 3/3 (PR #14 merged). EVT-013 ✅ · UX-003 ✅. Full audit: [`progres.md`](progres.md) · [`../plan.md`](../plan.md) § At a glance.

---

## Active queue — P0 MVP exit

> **Linear milestone:** 🚨 Launch Critical · **View:** [MVP view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) · Machine queue: [`linear/mvp-queue.json`](linear/mvp-queue.json)

| IMP | Spec ID | SAN | Phase | % | Status | Spec |
|----:|---------|-----|:-----:|--:|:------:|------|
| 079 | G1 | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) | MVP | 80 | 🟡 | [`../todo.md`](../todo.md) |
| 080 | EVP-003-core | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | MVP | 60 | 🔴 | [`events/EVP-003-core-stripe-webhook-secret-audit.md`](events/EVP-003-core-stripe-webhook-secret-audit.md) |
| 081 | EVP-013-core | [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) | MVP | 45 | 🔴 | [`events/EVP-013-core-event-card-component.md`](events/EVP-013-core-event-card-component.md) |
| 082 | G3-core | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | MVP | 90 | 🟡 | [`events/G3-core-host-publish-proof.md`](events/G3-core-host-publish-proof.md) |
| 083 | EVP-001-core | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | MVP | 0 | 🔴 | [`events/EVP-001-core-production-proof-gates.md`](events/EVP-001-core-production-proof-gates.md) |
| 084 | F32 | [SAN-100](https://linear.app/sanjiovani/issue/SAN-100) | CORE | 0 | ⚪ | [`core/F32-production-smoke.md`](core/F32-production-smoke.md) |
| 085 | AUTH-011 | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | MVP | 40 | 🟡 | [`data/tasks/AUTH-011-production-auth-checklist.md`](data/tasks/AUTH-011-production-auth-checklist.md) |
| 091 | MAP-002B | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | CORE | 0 | ⚪ | [`maps/MAP-002B-prod-adk-deploy.md`](maps/MAP-002B-prod-adk-deploy.md) |
| 092 | MAP-008B | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | CORE | 0 | ⚪ | [`maps/MAP-008B-vercel-map-id-verify.md`](maps/MAP-008B-vercel-map-id-verify.md) |

---

## Active queue — UX prod remediation (P0 priority)

**Parallel with MVP exit** — do not defer. Full order: [`ux/INDEX.md`](ux/INDEX.md) · [`../plan.md`](../plan.md) Tier 1C.
**View:** [UX Tasks](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) — filter: `label:track:ux`

| IMP | Spec ID | SAN | Purpose | % | Status | Spec |
|----:|---------|-----|---------|--:|:------:|------|
| 097 | UX-001 | [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) | Restore conciergeAgent on prod (PR #13) | 100 | 🟢 | [`ux/UX-001-restore-concierge-agent-prod.md`](ux/UX-001-restore-concierge-agent-prod.md) |
| 093 | UX-003 | [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) | Fix “$500 a night” rental price parser | 0 | ⚪ | [`ux/UX-003-deploy-price-wording-parser-fix.md`](ux/UX-003-deploy-price-wording-parser-fix.md) |
| 094 | UX-002 | [SAN-320](https://linear.app/sanjiovani/issue/SAN-320) | User-facing error on `RUN_ERROR`/timeout | 0 | ⚪ | [`ux/UX-002-render-user-facing-error-on-run-error.md`](ux/UX-002-render-user-facing-error-on-run-error.md) |
| 095 | UX-005 | [SAN-319](https://linear.app/sanjiovani/issue/SAN-319) | Concierge “thinking” indicator (same PR as UX-002) | 0 | ⚪ | [`ux/UX-005-add-concierge-loading-indicator.md`](ux/UX-005-add-concierge-loading-indicator.md) |
| 101 | UX-009 | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | Prod synthetic concierge monitor | 0 | ⚪ | [`ux/UX-009-prod-synthetic-concierge-monitor.md`](ux/UX-009-prod-synthetic-concierge-monitor.md) |
| 098 | UX-006 | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | “New chat” resets thread + map | 0 | ⚪ | [`ux/UX-006-new-chat-reset-thread-and-map.md`](ux/UX-006-new-chat-reset-thread-and-map.md) |
| 099 | UX-007 | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Clear stale AdvancedMarkers | 0 | ⚪ | [`ux/UX-007-clear-stale-advanced-markers.md`](ux/UX-007-clear-stale-advanced-markers.md) |
| 100 | UX-008 | [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) | Fix Save tooltip copy | 0 | ⚪ | [`ux/UX-008-fix-save-tooltip-copy.md`](ux/UX-008-fix-save-tooltip-copy.md) |
| 102 | UX-010 | [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) | Unified result-card arch (M0→M5) — **blocked: PR #14 must merge first** | 15 | 🟡 | [`ux/UX-010-unified-result-card-architecture.md`](ux/UX-010-unified-result-card-architecture.md) |
| 096 | UX-004 | [SAN-317](https://linear.app/sanjiovani/issue/SAN-317) | ~~Disable Events/Food chips~~ — concierge restored | — | 🚫 Canceled | — |

Audit: [`ux/audit/03-ux-audit.md`](ux/audit/03-ux-audit.md) · cards: [`ux/audit/10-audit-cards.md`](ux/audit/10-audit-cards.md)

---

## Active queue — P1 polish

| IMP | ID | % | Status | Spec |
|----:|----|--:|:------:|------|
| 086 | EVP-014-core | 0 | ⚪ | [`events/EVP-014-core-host-events-list-page.md`](events/EVP-014-core-host-events-list-page.md) |
| 087 | SCREEN-017 | 0 | ⚪ | [`screens/017-scr-login-signup-polish.md`](screens/017-scr-login-signup-polish.md) |
| 088 | SCREEN-010 | 0 | ⚪ | [`maps/wireframes/011-scr-map-exploration-panel.md`](maps/wireframes/011-scr-map-exploration-panel.md) |
| 089 | MAP-010 | 0 | ⚪ | [`maps/MAP-010-place-autocomplete-venue.md`](maps/MAP-010-place-autocomplete-venue.md) |
| 090 | AUTH-005 | 0 | ⚪ | [`data/tasks/AUTH-005-playwright-auth-e2e.md`](data/tasks/AUTH-005-playwright-auth-e2e.md) |

---

## Post-MVP catalog (by track)

| Track | Phase | Open scope | Index |
|-------|:-----:|------------|-------|
| **Intelligence (MIS)** | Phase 0→4 | DATA-040+, SEARCH-*, AI-*, INT-001…022 | [`intelligence/intelligence-plan.md`](intelligence/intelligence-plan.md) · [`intelligence/tasks/INDEX.md`](intelligence/tasks/INDEX.md) |
| **Data** | ADV | data-001…035 (001 🟡; **035** café seed) | [`data/tasks-data/INDEX-data.md`](data/tasks-data/INDEX-data.md) |
| **Venues (VEN)** | MVP→ADV | **VEN-009…051**; SCREEN-021 🟢; DATA-035 seed | [`venues/tasks/mvp/mvp-index.md`](venues/tasks/mvp/mvp-index.md) · [`venues/INDEX.md`](venues/INDEX.md) |
| **Maps depth** | ADV | MAP-005…023, 034, 002A | [`maps/INDEX.md`](maps/INDEX.md) |
| **Real estate** | ADV | RE-001…020 | [`real-estate/tasks/INDEX.md`](real-estate/tasks/INDEX.md) |
| **Trips** | ADV | TRIP-001…019 + data-026…030 | [`trips/tasks/INDEX.md`](trips/tasks/INDEX.md) |
| **Events (EVP)** | P0–ADV | EVP-001…047 | [`events/tasks/INDEX.md`](events/tasks/INDEX.md) |
| **Vector** | ADV | VEC-001…005 | [`vector/INDEX.md`](vector/INDEX.md) |
| **Grounding** | ADV | GS-005…009 | [`grounding-search/tasks/INDEX.md`](grounding-search/tasks/INDEX.md) |
| **CopilotKit gaps** | ADV | CK-001…008 | [`copilotkit/INDEX.md`](copilotkit/INDEX.md) |
| **Core platform** | ADV | F20, F21A, F22, F26, F30 | [`core/README.md`](core/README.md) |
| **Auth** | P0/P2 | AUTH-011 🟡, AUTH-005, AUTH-009 | [`data/auth/INDEX.md`](data/auth/INDEX.md) |
| **ADK ops** | ADV | CR-07, CR-08 | [`ADK/INDEX.md`](ADK/INDEX.md) |
| **OpenClaw** | Phase 2+ | OCL-001…042 | [`openclaw/index-ocl.md`](openclaw/index-ocl.md) |
| **Contest** | Phase 2+ | CTEST-* | [`contest/INDEX.md`](contest/INDEX.md) |
| **UX (prod chat)** | **P0** | UX-001…010; **093–102** in plan | [`ux/INDEX.md`](ux/INDEX.md) |
| **Screens** | MVP+ | SCREEN-* registry | [`screens/INDEX.md`](screens/INDEX.md) |
| **Archives (Done)** | 🟢 | IMP-001–078 | [`archive/README.md`](archive/README.md) |

**Venues audit / order proof:** [`venues/tasks/audit/01-venues-audit.md`](venues/tasks/audit/01-venues-audit.md) · [`venues/tasks/audit/02-implementation-order-plan.md`](venues/tasks/audit/02-implementation-order-plan.md)

---

## Skills + docs (agent routing)

| Work | Load (≤5) | Path |
|------|-----------|------|
| Task lifecycle / Done | `mde-task-lifecycle` → `task-verifier` | `.claude/skills/` |
| CopilotKit + Mastra | `copilotkit` → `copilotkit-integrations` | not `copilotkit-develop` alone (v2) |
| Agents / tools | `mastra` → `gemini` | `gemini-3.5-flash` in `mdeapp` |
| Maps | `mde-maps` | MCP: google-maps-code-assist |
| DB / edge | `mde-supabase` | MCP: user-supabase |
| UI | `shadcn`, `tailwind-best-practices` | screen specs in `tasks/screens/` |

Full matrix: [`../index-skills.md`](../index-skills.md)

---

## Quick links

| Area | Index |
|------|-------|
| **Plan / todo / MVP exit** | [`../plan.md`](../plan.md) · [`../todo.md`](../todo.md) · [`MVP-REQUIRED.md`](MVP-REQUIRED.md) |
| **Progress audit** | [`../progress/may30.md`](../progress/may30.md) · [`progres.md`](progres.md) |
| Events | [`events/tasks/INDEX.md`](events/tasks/INDEX.md) |
| Maps | [`maps/INDEX.md`](maps/INDEX.md) |
| Screens | [`screens/INDEX.md`](screens/INDEX.md) |
| Core | [`core/README.md`](core/README.md) |
| Data | [`data/tasks-data/INDEX-data.md`](data/tasks-data/INDEX-data.md) |
| Venues | [`venues/tasks/mvp/mvp-index.md`](venues/tasks/mvp/mvp-index.md) |
| Intelligence | [`intelligence/tasks/INDEX.md`](intelligence/tasks/INDEX.md) |
| **UX / prod chat** | [`ux/INDEX.md`](ux/INDEX.md) |
| Linear / IMP | [`linear/core-mvp-order.json`](linear/core-mvp-order.json) |

*Last reviewed: 2026-05-30 — testing audit tracker in [`progres.md`](progres.md); floor 313 tests @ `8c99ded`*
