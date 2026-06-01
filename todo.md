---
title: mdeai — TODO
updated: 2026-05-31
mvp_dashboard: tasks/MVP-EXECUTION.md
mvp_canonical: tasks/MVP-REQUIRED.md
plan: plan.md
progress: tasks/progres.md
checklist: checklist.md
---

# TODO — mdeai

> **Primary dashboard:** [`MVP-EXECUTION.md`](tasks/MVP-EXECUTION.md) · **Tracker:** [`tasks/progres.md`](tasks/progres.md) · **Proof:** [`checklist.md`](checklist.md)

**Floor (2026-05-30):** `cd mdeapp && npm run floor` → exit 0 · **318** tests · **PR #14 ✅ MERGED** · **PR #15 ✅ MERGED**

> **Naming frozen:** PAY-*, EVT-*, UX-*, MAP-*, AUTH-*, OPS-* — no IMP-*, no EVP-* in titles.  
> **Views:** [MVP](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) `label:phase:launch` · [UX](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) `label:track:ux`

---

## P0 — Must fix before MVP exit

### Sequence A — commerce + host (strict order)

- [ ] **PAY-001** [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) — live Stripe → `paid` + wallet QR — proof: `tasks/notes/*g1*` + prod `/me/tickets`
- [ ] **PAY-003** [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) — distinct sponsor webhook secret — proof: Stripe dashboard + re-audit env
- [x] **EVT-013** [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) — event cards in chat — proof: `tasks/testing/evidence/EVT-013-event-cards-screen006.md` · SCREEN-006 3/3 🟢 · fast-path panel merged PR #14
- [ ] **EVT-002** [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) — host HITL publish → Supabase row — proof: [`G3-core-host-publish-proof.md`](tasks/events/tasks/G3-core-host-publish-proof.md)
- [ ] **EVT-001** [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) — MVP ledger (G1+G2+G3) — proof: `tasks/notes/EVP-001-*` — **blocked until A rows above**

### Sequence B — prod sign-off (after EVT-001)

- [ ] **OPS-002** [SAN-100](https://linear.app/sanjiovani/issue/SAN-100) — prod smoke matrix @ www.mdeai.co
- [ ] **AUTH-011** [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) — prod auth + Vercel env
- [ ] **MAP-002B** [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) — grounded search on prod
- [ ] **MAP-008B** [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) — Maps pins on prod

### Sequence C — UX prod (parallel — do not defer)

- [x] **UX-001** [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) — concierge on prod 🟢
- [x] **UX-003** [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) — rental price parser — `\bnight(?:ly)?\b` fix merged PR #15 · 5 regression tests · floor 318/318 🟢
- [ ] **UX-002 + UX-005** [SAN-320](https://linear.app/sanjiovani/issue/SAN-320)/[SAN-319](https://linear.app/sanjiovani/issue/SAN-319) — error bubble + thinking (same PR)
- [ ] **UX-009** [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) — prod chat health monitor
- [ ] **UX-006 + UX-007** [SAN-321](https://linear.app/sanjiovani/issue/SAN-321)/[SAN-323](https://linear.app/sanjiovani/issue/SAN-323) — new chat reset + clear stale pins
- [ ] **UX-008** [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) — Save tooltip copy
- [ ] **UX-010** [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) — unified result cards — unblocked (PR #14 merged)
- ~~UX-004 [SAN-317](https://linear.app/sanjiovani/issue/SAN-317)~~ — **CANCELED**

---

## P1 — Polish after all P0 🟢

- [ ] **EVT-014** [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) — `/host/events` list
- [ ] **UX-012** [SAN-112](https://linear.app/sanjiovani/issue/SAN-112) — login/signup polish
- [ ] **UX-011** [SAN-111](https://linear.app/sanjiovani/issue/SAN-111) — map exploration panel
- [ ] **MAP-010** [SAN-104](https://linear.app/sanjiovani/issue/SAN-104) — venue autocomplete (after MAP-005)
- [ ] **AUTH-005** — Playwright auth e2e

---

## P2 — Post-MVP

- [ ] **MAP-005 → MAP-006 → MAP-010** — Places proxy chain
- [ ] **DATA-001…035** — [`INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md)
- [ ] **VEC-001…005** · **VEN-*** · **INT-*** · **RE / TRIP** apps

---

## Do not start yet

- Sponsor marketplace before **PAY-003** webhook isolation
- OpenClaw / WhatsApp / admin / vector RAG — see [`MVP-EXECUTION.md`](tasks/MVP-EXECUTION.md) tiers

---

## Gate status

| Gate | Status |
|------|--------|
| G2 lead capture | 🟢 |
| PAY-001 paid ticket | 🟡 |
| EVT-002 host publish | 🟡 |
| Floor CI | 🟢 318 tests |
| MVP exit (EVT-001) | 🟥 **No-Go** |
