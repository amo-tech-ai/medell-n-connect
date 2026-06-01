---
doc_id: PRD-AUDIT-2026-05-20
title: mdeai PRD Audit Report
date: 2026-05-20
status: Accepted — doc updates applied
planning_quality: 82/100
implementation_readiness: 48/100
production_ready: false
---

# mdeai PRD Audit Report

## Verdict

**Not 100% correct yet.**  
**Not production-ready.**

The PRD stack is **strong strategically** (architecture rule, MVP outcomes, advanced freeze) but **not implementation-complete**. Planning quality and repo reality must stay visibly separated so tasks do not flip to Done on prose alone.

| Lens | Score | Meaning |
|------|------:|---------|
| **Planning / strategy** | **82/100** | Architecture, MVP clarity, execution order, risk control |
| **Implementation readiness (`mdeapp`)** | **48/100** | `pingAgent` + CK runtime only; no `/chat`, map, Roberto, ticketing in new app |
| **Production-ready** | **No** | Do not market or cut over until MVP exit + PR track below |

**Canonical repo truth:** [`prd.md` § Repo truth](../../prd.md#repo-truth-mdeapp-2026-05-20) · [`roadmap.md` § Current state](real-estate/draft/roadmap.md#current-state-2026-05-20)

---

## Assessment: are the suggestions correct?

| Suggestion | Correct? | Action taken |
|------------|----------|--------------|
| Architecture rule (Supabase / Mastra / CK / Maps / Gemini) | ✅ Yes | Already in `prd.md`; reinforced in module PRDs |
| MVP = 4 measurable outcomes | ✅ Yes | `mvp.md` + `roadmap.md` |
| Advanced correctly frozen | ✅ Yes | `advanced.md` |
| Too much plan, not enough repo proof | ✅ Yes | **Repo truth** sections added; scores labeled “planning vs code” |
| Agent sprawl risk — router + workflows | ✅ Yes | Mandatory in `prd.md`; events PRD needs reader warning |
| MAP-001 is the blocker | ✅ Yes | PR-1 + `roadmap.md` Now row |
| `src/platform/` not monorepo yet | ✅ Yes | Already in `prd.md` |
| Hard Done rules (tests + localhost + floor) | ✅ Yes | **Definition of Done** in `prd.md` + `roadmap.md` |
| PR-1…5 repo-first order | ✅ Yes | **`roadmap.md` § Repo-first PR track** |
| Cut Lingui, OpenClaw prod, Hermes hot, etc. from MVP | ✅ Yes | Already listed; duplicated in audit checklist |
| Do not call docs “production-ready” | ✅ Yes | Status fields updated |

**Minor nuance:** PR-2 splits grounding from MAP-001; maps-prd bundles MAP-001→003. PR track aligns with MAP IDs — PR-1 = contracts + MAP-001, PR-2 = MAP-002–003.

---

## What is correct

### 1. Architecture rule

```text
Supabase owns data · Mastra owns orchestration · CopilotKit owns UI
· Google Maps owns spatial display · Gemini explains (never invents geo facts)
```

### 2. MVP definition

1. Roberto — one AI-assisted published event (HITL)  
2. One paid ticket (`event_orders.status = paid`)  
3. Camila — rental chat → map pins (≤5) + `leads` row  
4. `/chat` three-panel + MAP-001–003 + `npm run floor` green  

### 3. Advanced scope frozen

OpenClaw prod, Hermes hot-path, contests, sponsors, native rental booking, CK v2, multi-agent fan-out — **out of MVP** ([`advanced.md`](../../advanced.md)).

```text
Automate coordination, not trust.
```

---

## Main problems (unchanged until code lands)

### 1. Plan ahead of repo

| Built in `mdeapp/` | Missing |
|--------------------|---------|
| CopilotKit + Mastra + `pingAgent` | `routerAgent`, `/chat`, `MapContext` |
| shadcn, auth, `ai_runs` (F13) | `hostEventAgent`, Roberto wizard |
| Vitest smoke (4 tests) | Ticketing edges in `mdeapp/supabase/` |
| Vercel deploy | `src/platform/*`, MAP-001–012 |

### 2. Agent sprawl in module PRDs

**Ship:**

```text
routerAgent + conciergeAgent (thin) + hostEventAgent + rentalAgent (thin)
+ workflows/tools (rental-search, venue-discovery, nearby-intel, searchGroundedPlaces)
```

**Do not ship:** 20 nominal agents from events/real-estate draft matrices.

### 3. MAP-001 blocks the product shape

```text
chat → Mastra tool → Zod → MapContext.mergePinsByCategory → visible pins
```

No UI polish, no extra agents, no advanced automation until this path is green.

---

## Repo-first PR track (authoritative)

| PR | Scope | Success proof |
|----|--------|---------------|
| **PR-1** | `src/platform/contracts/` + `src/platform/maps/` + MAP-001 | Vitest schemas pass; one tool response → pins; Playwright pin count |
| **PR-2** | `searchGroundedPlaces`, `GroundingAttribution`, `grounding_quota_log` | “quiet cafés near Parque Lleras” → cards + attribution + grounded pins |
| **PR-3** | `/host/event/new`, `hostEventAgent`, `EventDraftState`, HITL, `approval-commit` | Approve → `events` + `event_tickets` rows |
| **PR-4** | `ticket-checkout`, `ticket-payment-webhook`, `/me/tickets/:id` | Stripe test → `paid` + QR |
| **PR-5** | 25 listings, `rental-search`, `RentalCard`, pins, lead capture | ≤5 cards; map pins; `leads` row |

**Do not start PR-3/4 until PR-1 is green** (optional parallel: PR-1 + PR-3 only if MAP-001 already proven on `/chat` stub).

Detail: [`roadmap.md` § Repo-first PR track](real-estate/draft/roadmap.md#repo-first-pr-track)

---

## Definition of Done (anti-fake-done)

A task or PR is **Done** only when **all** apply:

| # | Gate |
|---|------|
| 1 | Code merged in `mdeapp/` (not legacy `/home/sk/mde/` unless P0 security) |
| 2 | Automated test passes (Vitest and/or Playwright as specified in task) |
| 3 | **Localhost proof:** `cd mdeapp && npm run dev` — relevant surface responds |
| 4 | **Evidence:** screenshot, `curl` output, or SQL query in task notes |
| 5 | `npm run floor` exits 0 (when repo has floor wired for touched paths) |

**Not Done:** “PRD written”, “agent registered”, “types defined”, “plan approved”.

Ref: [`.claude/skills/task-verifier/references/anti-fake-done-checklist.md`](../../.claude/skills/task-verifier/references/anti-fake-done-checklist.md)

---

## Final scorecard

| Area | Score |
|------|------:|
| Strategy | 92 |
| Architecture | 86 |
| MVP clarity | 88 |
| **Repo readiness** | **48** |
| Risk control | 84 |
| Execution order | 90 |
| **Overall planning** | **82** |

---

## Final recommendation

Build first:

```text
src/platform/contracts + src/platform/maps + MAP-001 + /chat three-panel + visible pins
```

Then:

```text
Roberto publish → ticket payment → rental cards + lead
```

Do **not** build advanced automation until MVP exit checklist in [`mvp.md`](../../mvp.md) is green.

---

## Doc changes from this audit (2026-05-20 → v7 2026-05-21)

| File | Change |
|------|--------|
| [`plan/prd/`](../prd/README.md) | **v7 system** — 10 canonical docs + forensic |
| [`prd.md`](../../prd.md) | Index → v7; repo truth; Done rules |
| [`roadmap.md`](real-estate/draft/roadmap.md) | Repo-first PR track; “not production-ready” |
| [`mvp.md`](../../mvp.md) | Done gates pointer |
| [`plan/maps/maps-prd.md`](../maps/maps-prd.md) | Repo truth block |
| [`plan/events/events-prd.md`](../events/events-prd.md) | Repo truth + agent simplification |
| [`plan/real-estate/draft/prd-real-estateV2.md`](../real-estate/draft/prd-real-estateV2.md) | Repo truth + agent simplification |
| [`plan/docs/prd-docs.md`](./prd-docs.md) | Status banner + link here |

---

*Re-run this audit when MVP exit checklist is green or after any claim of “production-ready”.*
