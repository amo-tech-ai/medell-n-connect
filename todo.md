---
title: mdeai — TODO
updated: 2026-06-04
mvp_dashboard: tasks/MVP-EXECUTION.md
mvp_canonical: tasks/MVP-REQUIRED.md
plan: plan.md
progress: tasks/progres.md
checklist: checklist.md
---

# TODO — mdeai

> **Primary dashboard:** [`MVP-EXECUTION.md`](tasks/MVP-EXECUTION.md) · **Tracker:** [`tasks/progres.md`](tasks/progres.md) · **Proof:** [`checklist.md`](checklist.md)

**Floor (2026-06-04):** `main` @ **`57adf17`** · Vitest **485/486** (1 smoke fail) · prod **`bf40ef9`**

### Discovery Beta — active (rows 1–50)

- [ ] **SAN-462** — Stable Beta soak **1/3** scheduled prod synthetics (need 2 more nights)
- [x] **AUTH-011** [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) — prod auth 🟢 [PR #56](https://github.com/amo-tech-ai/mdeapp/pull/56)
- [x] **MAP-008B** [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) — Map ID prod 🟢 [PR #57](https://github.com/amo-tech-ai/mdeapp/pull/57)
- [ ] **MAP-002B** [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) — ADK grounding Vercel env + prod café proof
- [ ] **PR-16** [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) — branch protection admin
- [ ] **F13** [SAN-548](https://linear.app/sanjiovani/issue/SAN-548) — thread persistence across cold-start
- [ ] **DATA-EMBED** [SAN-545](https://linear.app/sanjiovani/issue/SAN-545) — rental embed 403 fix
- [ ] **OPS-JOURNEY** [SAN-546](https://linear.app/sanjiovani/issue/SAN-546) — prod J05–J20 matrix
- [ ] **AUTH-009** [SAN-547](https://linear.app/sanjiovani/issue/SAN-547) — JWT → Mastra (blocks VEN-019 HITL)

> **Naming frozen:** PAY-*, EVT-*, UX-*, MAP-*, AUTH-*, OPS-* — no IMP-*, no EVP-* in titles.  
> **Views:** [MVP `phase:mvp`](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a) · [UX](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) `label:track:ux`

---

## P0 — Must fix before MVP exit

### Sequence A — commerce + host (strict order)

- [ ] **PAY-001** [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) — live Stripe → `paid` + wallet QR — proof: `tasks/notes/*g1*` + prod `/me/tickets`
- [ ] **PAY-003** [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) — distinct sponsor webhook secret — proof: Stripe dashboard + re-audit env
- [x] **EVT-013** [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) — event cards in chat — proof: `tasks/testing/evidence/EVT-013-event-cards-screen006.md` · SCREEN-006 3/3 🟢 · fast-path panel merged PR #14
- [ ] **EVT-002** [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) — host HITL publish → Supabase row — proof: [`G3-core-host-publish-proof.md`](tasks/events/tasks/G3-core-host-publish-proof.md)
- [ ] **EVT-001** [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) — MVP ledger (G1+G2+G3) — proof: `tasks/notes/EVP-001-*` — **blocked until A rows above**

### Sequence B — prod sign-off (after EVT-001)

- [x] **OPS-002** [SAN-100](https://linear.app/sanjiovani/issue/SAN-100) — prod smoke matrix — **UX-034** [#37](https://github.com/amo-tech-ai/mdeapp/pull/37) on `main`; soak **1/3** on SAN-462
- [x] **AUTH-011** [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) — prod auth + Vercel env 🟢 PR #56
- [x] **MAP-008B** [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) — Maps pins on prod 🟢 PR #57
- [ ] **MAP-002B** [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) — grounded search on prod

### Sequence C — UX prod (parallel — do not defer)

- [x] **UX-001** [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) — concierge on prod 🟢
- [x] **UX-003** [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) — rental price parser — `\bnight(?:ly)?\b` fix merged PR #15 · 5 regression tests · floor 318/318 🟢
- [x] **UX-002 + UX-005** [SAN-320](https://linear.app/sanjiovani/issue/SAN-320)/[SAN-319](https://linear.app/sanjiovani/issue/SAN-319) — error bubble + thinking 🟢 (archived UX-015)
- [x] **UX-009** [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) — prod synthetic monitor 🟢 via **UX-034** [#37](https://github.com/amo-tech-ai/mdeapp/pull/37)
- [x] **UX-006** [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) — new chat reset 🟢 via **UX-032** [#36](https://github.com/amo-tech-ai/mdeapp/pull/36)
- [ ] **UX-007** [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) — clear stale pins → [`UX-033`](tasks/PR/ux/UX-033-clear-stale-advanced-markers.md)
- [x] **UX-008** [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) — Save tooltip 🟢 (UX-027 archived)
- [x] **UX-010 / SAN-318** [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) — G2c + G2d 🟢 Done on prod
- ~~UX-004 [SAN-317](https://linear.app/sanjiovani/issue/SAN-317)~~ — **CANCELED**

---

## P1 — Polish after all P0 🟢

- [ ] **EVT-014** [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) — `/host/events` list
- [ ] **UX-012** [SAN-112](https://linear.app/sanjiovani/issue/SAN-112) — login/signup polish
- [ ] **UX-011** [SAN-111](https://linear.app/sanjiovani/issue/SAN-111) — map exploration panel
- [ ] **MAP-010** [SAN-104](https://linear.app/sanjiovani/issue/SAN-104) — venue autocomplete (after MAP-005)
- [ ] **AUTH-005** — Playwright auth e2e

---

## P1 — PR remediation (process — before new feature branches)

> **Linear:** [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues) · `label:track:pr` · [`tasks/PR/LINEAR.md`](tasks/PR/LINEAR.md)

- [x] **PR-13** [SAN-447](https://linear.app/sanjiovani/issue/SAN-447) — triage Done
- [x] **PR-14** [SAN-448](https://linear.app/sanjiovani/issue/SAN-448) — worktrees Done
- [ ] **PR stack** — [#40](https://github.com/amo-tech-ai/mdeapp/pull/40) C1 → [#42–44](https://github.com/amo-tech-ai/mdeapp/pull/42) C2–C4 · [#41](https://github.com/amo-tech-ai/mdeapp/pull/41) PR-02/03
- [ ] **PR-09** — close #23 after stack merges (comment posted)
- [x] **PR-01** [SAN-451](https://linear.app/sanjiovani/issue/SAN-451) — Done via GitHub #34

## P2 — Post-MVP

- [ ] **MAP-005 → MAP-006 → MAP-010** — Places proxy chain
- [ ] **DATA-001…035** — [`INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md)
- [ ] **VEC-001…005** · **VEN-*** · **INT-*** · **RE / TRIP** apps
- [ ] **UX polish** — UX-020, 023, 024, 029, 033 — [`tasks/ux/tasks/INDEX.md`](tasks/ux/tasks/INDEX.md)

---

## Do not start yet

- Sponsor marketplace before **PAY-003** webhook isolation
- OpenClaw / WhatsApp / admin / vector RAG — see [`MVP-EXECUTION.md`](tasks/MVP-EXECUTION.md) tiers

---

## Gate status

| Gate | Status |
|------|--------|
| G2 lead capture | 🟢 |
| Discovery Beta soak (SAN-462) | 🟡 **1/3** |
| AUTH-011 prod auth | 🟢 |
| MAP-008B prod pins | 🟢 |
| MAP-002B ADK prod | 🟡 |
| PAY-001 paid ticket | ⏸ deferred |
| EVT-002 host publish | ⏸ deferred |
| Floor CI | 🟡 **485/486** tests @ `57adf17` |
| Discovery Beta exit | 🟡 **No-Go** (soak + ADK + booking HITL) |
| Full MVP exit (EVT-001) | ⏸ **Deferred** |
