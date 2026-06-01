---
doc_id: EVENTS-ROADMAP
title: Events vertical — roadmap (Now · Core MVP · Post-MVP · Advanced)
version: 1.3
date: 2026-05-17
status: Active — sequencing companion to PRD v2 (outcomes, not a Gantt)
strategy_prd: ./events-prd-v2-mastra-maps-automation.md
execution_index: ./V2-tasks/README.md
horizontal_index: ./index-events.md
---

# Events roadmap

**Hub:** [`README.md`](./README.md)  
**Ticket status (live):** [`events-progress.md`](./events-progress.md) — **5/72 EVT** signed off; buyer path proved locally; **NO-GO** for live monetization until G1–G5 + staff UI.  
**Ticket queue:** [`V2-tasks/README.md`](./V2-tasks/README.md) (`EVT-001`–`072`) — **not** `tasks/events/tasks/` (deleted).  
**Contests / sponsors / venues queue:** [`index-events.md`](./index-events.md) — blocked on [`tasks/todo.md`](../todo.md) §1 for contests.  
**Strategy + audit:** [`events-prd-v2-mastra-maps-automation.md`](./events-prd-v2-mastra-maps-automation.md)  
**Diagrams:** [`V2-tasks/events-prd-v2-diagrams.md`](./V2-tasks/events-prd-v2-diagrams.md) · [`docs/events-diagram-index.md`](./docs/events-diagram-index.md) · [`docs/events-milestones.md`](./docs/events-milestones.md)  
**Navigator:** [`index-events.md`](./index-events.md)

This file is the **short sequencing contract**: what ships first, what is frozen, and what “verified” must mean. Daily task picking uses **V2-tasks** + **events-progress**, not this file alone.

**Document health:** sequencing **~88/100**; implementation proof **~65%** backend · **~7%** EVT YAML closed — see events-progress.

---

## 0. Layered stack (how horizons map to systems)

PRD v2 **§1.1** documents the evolution from “AI-first ideas” to **deterministic commerce + layered intelligence**. Same stack, reading top to bottom:

```text
(1) Supabase + Stripe + ticket edge fns     ← Core MVP — must run with zero LLM
(2) Maps + Places + routes + grounding      ← Post-MVP — venue / discovery intelligence
(3) Mastra (router, tools, workflows)       ← Post-MVP — orchestration; not payment authority
(4) Gemini                                  ← proposals / structured outputs; Zod + Apply
(5) Sponsors + campaigns (+ Postiz)        ← Post-MVP tail — after spine + maps proof
(6) OpenClaw                                ← Advanced — approved jobs only
(7) Hermes · Paperclip                       ← Advanced — read-side scoring · governance records
```

**Mastra task IDs (cross-walk):** **EVT-103** + implementers = layer **(1)**. Maps layer **(2):** **066 ✅** + **073 ✅** (per task YAML); then **068 → 074 → 067 → 049 → 048**; **075**, **078**. **MASTRA-041** then **MASTRA-007** (+ **005 / 011 / 018 / 019 / 012–015** per [`../mastra/tasks/000-index.md`](../mastra/tasks/000-index.md)) = layer **(3)**. **042 → 063 → 064** = sponsor/Gemini train in **(4)/(5)** — parallel, does not unblock **(1)** (**042** helper-only exception — PRD §13). **067–070** = **(6)**.

---

## 1. North-star outcome (Core MVP)

One measured path on **staging then production**:

```text
buyer → Stripe checkout → webhook → order finalize → attendee → QR
→ scanner validate → audit log → realtime
```

**Repo (2026-05-17):** `ticket-checkout`, `ticket-payment-webhook`, `ticket-validate`, `event-staff-link-generator` **exist** under `supabase/functions/`. Buyer UI path **proved locally** (EVT-032–034). **Still missing:** production webhook smoke, staff scanner UI (EVT-036–037), G1–G5 gate sign-off — so Phase 1 is **not a sellable product on live domain** yet.

---

## 2. Hard freeze (capacity is zero-sum)

No new engineering in these areas until Core MVP (§3) is **green on staging**:

| Area | Why |
|------|-----|
| Sponsor campaigns at scale | No revenue multiplier without inventory truth |
| OpenClaw outbound | Spam/legal/account risk without enforced approvals + audit |
| Hermes production scoring | Intelligence on top of sand |
| Postiz publish automation | Same governance surface as campaigns |
| “Production-ready” language | Blocked on remote parity + floor + ticket edges |

**Freeze exception (shared infra):** **MASTRA-042** may merge **helper-only** (`_shared/gemini` + Deno tests, **no** new sponsor HTTP handlers) during Core MVP — same rule as PRD v2 §13. Anything that creates **new outbound or sponsor surfaces** stays frozen.

Paperclip / governance UX that depends on **`paperclipai`**: **block** until **`npm audit --omit=dev --high`** is clean or the dependency is removed — see PRD §15–§17.

---

## 3. Now — truth & gates

| # | Outcome | Status (2026-05-17) |
|---|---------|---------------------|
| 1 | Routes match reality | 🟡 `/events`, `/me/tickets` yes; `/host/events`, `/staff/scan` **missing** |
| 2 | Edge tree in repo | 🟢 Ticket edges present; sign-off via EVT-012–021 YAML |
| 3 | Migrations = remote | 🟡 EVT-068 open — prove with MCP/SQL |
| 4 | **`npm run floor`** | 🟡 Tests/build green; prod `npm audit --high` may fail |
| 5 | Task drift | 🟡 Align `prd.md` contest “Done” rows with repo; use events-progress |

**Phase 1 product gates:** [`tasks/todo.md`](../todo.md) §1 **G1–G5** — track in [`events-progress.md`](./events-progress.md).

### Launch-blocking EVT (front-loaded)

| Gate | Task | Notes |
|------|------|--------|
| RLS / security negatives | EVT-011, EVT-010 | Before public scale |
| Staff scanner | EVT-036–037 | G2 Roberto E2E |
| Load test | EVT-026 | G4 |
| Staff revoke | EVT-024 | G3 |
| Remote parity | EVT-068 | Before prod smoke |
| Mitigate drift / edges | EVT-057, EVT-059 | Production folder — reconcile with code that already landed |
| Paperclip audit | EVT-064 | Before governance automation |

---

## 4. Core MVP — deterministic ticketing

**Canonical order:** [`V2-tasks/README.md`](./V2-tasks/README.md) (`EVT-001`–`026` core, `027`–`038` mvp). Archive prompts [`tasks/archive/001–034`](../archive/) = narrative reference only.

1. **EVT-012–016** — checkout, webhook, idempotency (edges **in repo**; close YAML + tests)
2. **EVT-017–019** — finalize order, attendee, QR
3. **EVT-021–022** — validate + ALREADY_USED
4. **EVT-023–024** — staff link + revoke
5. **EVT-032–034** — buyer UI (**Completed** locally)
6. **EVT-036–038** — staff PWA + a11y (**next**)
7. **EVT-026** — 50-buyer load test

**Verification bar:** Permanent Stripe Dashboard webhook + live `mdeai.co` smoke; not Stripe CLI alone — see events-progress proof table.

---

## 5. Post-MVP — maps foundation → Mastra → sponsors

**Only after** §4 green.

| Track | Sequence / focus |
|-------|-------------------|
| **Maps** | **066 ✅ · 073 ✅**; remaining **068 → 074 → 067 → 049 → 048** (then **075/078**). Advanced Markers require **Map ID** ([migration](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration), [Map ID](https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over), [start](https://developers.google.com/maps/documentation/javascript/advanced-markers/start)); attribution + quota logging **proven** on staging |
| **Venue UX** | `035` picker, Places cache, routes on EventDetail — per `maps-prd-v2.md` |
| **Mastra (events)** | **MASTRA-041** first (real `search-events` from `public.events`), then **MASTRA-007** (`depends_on: EVT-103, MASTRA-041, …`) — [`../mastra/tasks/mvp/007-mastra-events-mvp-runtime.md`](../mastra/tasks/mvp/007-mastra-events-mvp-runtime.md) |
| **Sponsors / campaigns / Postiz** | **042 → 063 → 064**; README env blockers; **042** helper-only allowed under freeze (no new sponsor endpoints); Postiz last |

---

## 6. Advanced — OpenClaw · Hermes · Paperclip

**Only after** (a) Core MVP + (b) Post-MVP maps/Mastra stable + (c) **security audit clean** for governance deps.

| System | Gate |
|--------|------|
| **OpenClaw** | Approvals + audit + quotas + rate limits **implemented and tested** — not policy-only |
| **Hermes** | Read-only features from Postgres; no autonomous sends |
| **Paperclip** | No production reliance until dependency story is safe |

---

## 7. Failure points (severity)

| Failure | Severity |
|---------|----------|
| Ticket edges unproven (YAML/tests/prod webhook) | **Critical** — code in repo; G1 + EVT-012–021 not closed |
| Webhook without idempotency / oversell races | **Critical** |
| `verify_jwt=false` without per-handler justification | **Critical** |
| OpenClaw outbound without enforced approvals | **Critical** |
| Governance on vulnerable `paperclipai` tree | **High** |
| Maps quota / missing attribution | **High** |
| Stale task ↔ repo drift | **High** |
| Frontend route assumptions | **Medium** |

---

## 8. Scorecard (two lenses)

| Lens | Composite | Note |
|------|-----------:|------|
| **Strategy / architecture** | ~88 | Layer cake + V2 spine documented |
| **Implementation + production proof** | ~65 | Backend + local buyer path; **NO-GO** live until G1–G5 + staff UI |

---

## 9. Official references (no `utm` noise)

- **Maps (Advanced Markers + Map ID):** [Migration](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration), [Map ID](https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over), [Advanced markers start](https://developers.google.com/maps/documentation/javascript/advanced-markers/start)
- **Gemini, Stripe, Supabase Edge:** canonical URL table — **PRD v2 Appendix C** in [`events-prd-v2-mastra-maps-automation.md`](./events-prd-v2-mastra-maps-automation.md) (avoid duplicating long lists in two files).

Skill used for structure: [`.claude/skills/mde-roadmap/SKILL.md`](../../.claude/skills/mde-roadmap/SKILL.md) (outcomes + dependencies + capacity; not sprint task breakdown).
