---
doc_id: EVENTS-MVP-HUB
title: Events MVP — hub + review of draft plans
version: 1.1.0
date: 2026-05-17
status: Active
full_plan: ./docs/EVENTS-MVP-PLAN.md
drafts_reviewed:
  - ./docs/01-mvp.md
  - ./docs/02-mvp.md
progress: ./events-progress.md
gate: ../todo.md §1 (G1–G5)
---

# Events MVP — hub

**Full spec:** [`docs/EVENTS-MVP-PLAN.md`](./docs/EVENTS-MVP-PLAN.md)  
**Live status:** [`events-progress.md`](./events-progress.md) (5/72 EVT signed off · **NO-GO** on mdeai.co until G1–G5)  
**Platform MVP filter:** [`../mvp.md`](../mvp.md) (events + rentals + chat)

---

## Review: `docs/01-mvp.md`

| Suggestion | Verdict | Repo truth |
|------------|---------|------------|
| Core loop: checkout → webhook → QR → scan → host dashboard | **Correct** | Matches [`prd.md`](../../prd.md) §2.2 and G1–G5 |
| Defer contests, OpenClaw, Hermes, advanced Maps | **Correct** | [`mvp.md`](../mvp.md), [`EVENTS-ADVANCED-PLAN.md`](./docs/EVENTS-ADVANCED-PLAN.md) |
| Required routes list | **Correct targets** | Several **not wired** in `src/App.tsx` yet (see below) |
| Supabase owns money/tickets; edges for webhook | **Correct** | [`CLAUDE.md`](../../CLAUDE.md), migration `20260503011925_event_phase1.sql` |
| Mastra/Gemini propose-only | **Correct** | EVT-049, `ai-interaction-patterns` |
| Acceptance criteria (&lt;2s checkout, no oversell, Lighthouse ≥90) | **Correct** | = G4, G5, events PRD KPIs |
| Implementation order (schema → edges → wallet → scanner → host → E2E) | **Correct** | Aligns EVT-012–038 spine |
| “Schema, wizard, PWA scanner **marked built**” | **Wrong** | Edges + buyer UI **proved locally**; **no** `/host/event/*` or `/staff/*` in `App.tsx` |
| Nice-to-have: **Places autocomplete** | **Wrong for MVP** | Defer to EVT-039+ ([`EVENTS-MVP-PLAN`](./docs/EVENTS-MVP-PLAN.md) §10). MVP = text venue + optional `venue_id` |
| Edge name `staff-link` | **Rename** | Ship as **`event-staff-link-generator`** (exists in repo) |
| Edge `event-create-update` | **Optional** | Host wizard can use Supabase client + RLS; not required if publish rules stay in DB |
| ppl-ai S3 citation links | **Drop** | Use repo paths only in canonical plan |

**Verdict:** ~85% right on product intent; **overstates UI completeness** and **slips Maps into MVP**.

---

## Review: `docs/02-mvp.md`

| Suggestion | Verdict | Repo truth |
|------------|---------|------------|
| Blocker is **QA + prod proof**, not greenfield architecture | **Correct** | [`37-mvp-audit.md`](../audit/37-mvp-audit.md), [`events-progress.md`](./events-progress.md) |
| MVP = one real event flow (publish → pay → QR → scan → dashboard) | **Correct** | Same as G1–G2 |
| Defer list (contests, Hermes, OpenClaw, sponsor marketplace, venue ERP) | **Correct** | [`advanced.md`](../advanced.md) |
| DB spine tables | **Correct** | Phase 1 migration applied |
| `/events`, `/events/:id` exist | **Correct** | `App.tsx` L146–147 |
| Mastra must not mutate tickets/Stripe | **Correct** | Architecture rules |
| Edge fns: checkout, webhook, validate, staff-link-generator | **Correct** | Under `supabase/functions/` |
| “PRD v2: **missing** ticket-checkout / webhook / validate” | **Outdated** | Functions **exist**; gap is **prod webhook + UI routes + gates** |
| “host dashboards **partially implemented**” | **Misleading** | **Interim:** `/admin/events` only; host routes = EVT-027–030 **Open** |
| Maps KEEP: **autocomplete**, nearby context | **Wrong for events MVP** | Pins/chat OK platform-wide; **event venue autocomplete** = Advanced (EVT-039) |
| Mixing **rentals + leads** into events MVP doc | **OK for platform** | For **events-only** scope, see table below |
| Journey 4 rental lead | **Platform MVP** | Not required to close **Events** G1–G5 |

**Verdict:** Strong on strategy and deferrals; fix **edge “missing”** claim and **Maps autocomplete in MVP**.

---

## Consolidated truth (repo-verified 2026-05-17)

### Routes (`src/App.tsx`)

| Route | Status |
|-------|--------|
| `/events`, `/events/:id` | ✅ Shipped |
| `/me/tickets`, `/me/tickets/:id` | ✅ Shipped (EVT-033–034 local proof) |
| `/host/event/new`, `/host/event/:id` | ❌ **Not in router** — EVT-027–030 |
| `/staff/check-in/:event` | ❌ **Not in router** — EVT-036–037 |
| `/admin/events` | ✅ Interim organizer surface |

### Edge functions (`supabase/functions/`)

| Function | Status |
|----------|--------|
| `ticket-checkout` | ✅ In repo |
| `ticket-payment-webhook` | ✅ In repo |
| `ticket-validate` | ✅ In repo |
| `event-staff-link-generator` | ✅ In repo (not `staff-link`) |

### Phase 1 gate ([`todo.md`](../todo.md) §1)

| Gate | What |
|------|------|
| **G1** | Live buy + email + QR on mdeai.co |
| **G2** | Scan + `ALREADY_USED` |
| **G3** | Staff link revoke &lt;60s |
| **G4** | 50 buyers / 30 seats, zero oversell |
| **G5** | Lighthouse a11y ≥90 (4 screens) |

**Do not start contests / OpenClaw outbound until all five are green.**

---

## Events MVP scope (narrow)

**In**

- Ticket loop + host dashboard + scanner (routes above)
- Basic venue **text** (and `venue_id` FK if already on row)
- Chat **event discovery** only (`ai-chat` / optional Mastra) — no checkout tool
- Optional sponsor **logo** on event page if &lt;2h and column exists

**Out**

- `vote.*` / Contest OS  
- OpenClaw WhatsApp blasts  
- Places autocomplete / venue intelligence (EVT-039+)  
- Sponsor marketplace campaigns  
- Promo codes, IVA UI, refund UI (manual Stripe Dashboard for first events)

---

## Implementation order (corrected)

1. Verify remote schema = migrations  
2. **Permanent Stripe webhook** → production URL  
3. **Buyer** — Vercel smoke on mdeai.co (G1)  
4. **Host** — `/host/event/new` + `/host/event/:id` (or signed `/admin/events` workaround for first event)  
5. **Staff** — `/staff/check-in/:event` + wire `ticket-validate` (G2–G3)  
6. RLS negative tests (EVT-011)  
7. G4 load + G5 Lighthouse  
8. `npm run floor` green → first live event  

**Tasks:** EVT-001–026 core → EVT-027–038 MVP UI — [`V2-tasks/README.md`](./V2-tasks/README.md)

---

## MVP checklist (events only)

- [ ] Prod Stripe webhook configured and firing  
- [ ] `/events/:id` → Stripe → `/me/tickets` on **https://www.mdeai.co**  
- [ ] `/host/event/new` + `/host/event/:id` **or** documented admin-only first event  
- [ ] `/staff/check-in/:event` + G2 + G3  
- [ ] G4 zero oversell  
- [ ] G5 Lighthouse ≥90  
- [ ] `npm run floor` green  
- [ ] No doc claims “scanner/host built” without route proof in `App.tsx`  

---

## Doc map

| File | Use |
|------|-----|
| **`mvp-events.md`** (this file) | Review + repo truth + checklist |
| [`docs/EVENTS-MVP-PLAN.md`](./docs/EVENTS-MVP-PLAN.md) | Full 16-section implementation spec |
| [`docs/01-mvp.md`](./docs/01-mvp.md) | Draft — see review table above |
| [`docs/02-mvp.md`](./docs/02-mvp.md) | Draft — see review table above; fix outdated “missing edges” |
| [`docs/EVENTS-ADVANCED-PLAN.md`](./docs/EVENTS-ADVANCED-PLAN.md) | After gate |
