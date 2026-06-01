---
title: mdeai — TODO
updated: 2026-05-30
mvp_canonical: tasks/MVP-REQUIRED.md
plan: plan.md
progress: tasks/progres.md
checklist: checklist.md
---

# TODO — mdeai

> **Order:** [`plan.md`](plan.md) § At a glance · **Tracker:** [`tasks/progres.md`](tasks/progres.md) · **Proof rules:** [`checklist.md`](checklist.md)

**Floor (2026-05-30):** `cd mdeapp && npm run lint && npm run test && npm run build && npm run floor` → exit 0 · **313** tests · HEAD **`8c99ded`**

---

## P0 — Must fix before MVP exit

### Sequence A — commerce + host (strict order)

- [ ] **IMP-079 G1** — Andrés live Stripe → `paid` + wallet QR — proof: `tasks/notes/*g1*` + prod `/me/tickets`
- [ ] **IMP-080 EVP-003** — rotate distinct sponsor webhook secret — proof: Stripe dashboard + re-audit env
- [ ] **IMP-081 EVP-013** — event cards in chat — proof: `PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-006-event-card.spec.ts` **green** (currently **fails** 120s on `event-card`)
- [ ] **IMP-082 G3** — Roberto HITL publish → Supabase row — proof: [`G3-core-host-publish-proof.md`](tasks/events/G3-core-host-publish-proof.md)
- [ ] **IMP-083 EVP-001** — consolidated G1+G2+G3 ledger — proof: `tasks/notes/EVP-001-*` (blocked until A rows above)

### Sequence B — prod sign-off (parallel after EVP-001)

- [ ] **IMP-084 F32** — prod smoke matrix @ www.mdeai.co — proof: `tasks/notes/F32-prod-smoke-*.md`
- [ ] **IMP-085 AUTH-011** — prod auth + Vercel env checklist — proof: completed checklist in spec
- [ ] **IMP-091 MAP-002B** — `ADK_GROUNDING_URL` on Vercel — proof: grounded café turn on prod
- [ ] **IMP-092 MAP-008B** — `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` on prod — proof: AdvancedMarker screenshot

### Sequence C — UX prod (parallel with B — do not defer)

- [x] **IMP-097 UX-001** — concierge on prod — proof: PR #13 🟢
- [ ] **IMP-093 UX-003** — deploy “$500 a night” rental parser — proof: prod rental query, not event hijack
- [ ] **IMP-094+095 UX-002+005** — error bubble + thinking indicator — proof: forced RUN_ERROR shows UI (same PR)
- [ ] **IMP-101 UX-009** — synthetic concierge monitor — proof: scheduled probe log/alert
- [ ] **IMP-098+099 UX-006+007** — new chat reset + clear stale markers — proof: browser evidence localhost + prod
- [ ] **IMP-100 UX-008** — Save tooltip copy — proof: screenshot prod (no “SCREEN-011” string)
- [ ] **IMP-102 UX-010** — unified result cards M0→M5 — proof: after C-012 merge; separate PRs

---

## P1 — Polish after all P0 🟢

- [ ] **IMP-086 EVP-014** — `/host/events` list — proof: route 200 + host sees drafts
- [ ] **IMP-087 SCREEN-017** — login/signup polish — proof: visual/a11y pass
- [ ] **IMP-088 SCREEN-010** — map exploration panel — proof: optional e2e
- [ ] **IMP-089 MAP-010** — venue autocomplete (if Roberto blocked) — proof: wizard place pick
- [ ] **IMP-090 AUTH-005** — Playwright auth e2e — proof: `e2e/auth-*.spec.ts` green (parallel OK)

---

## P2 — Post-MVP (deferred — why)

- [ ] **MAP-005→023** — Places proxy, routes, hood intel — needs MVP exit first
- [ ] **data-001…035** — venue/rental/trips schema spine — [`INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md)
- [ ] **VEC-001…005** — pgvector cleanup + eval before scale — duplicate HNSW indexes today
- [ ] **VEN-009…051** — full venues product (booking, WA) — after DATA-035 seed
- [ ] **INT-001…020** — rental clarify + memory — [`intelligence/tasks/INDEX.md`](tasks/intelligence/tasks/INDEX.md)
- [ ] **RE / TRIP apps** — Camila rentals app + Tourist trips — ADV tracks

---

## Do not start yet

- OpenClaw automation without **OCL-003** approval gates + **OCL-005** kill switch
- WhatsApp auto-send without human handoff spec
- Sponsor marketplace before **EVP-003** webhook isolation
- Advanced RAG / vector rerank before **VEC-001** inventory + **VEC-005** eval
- Multi-agent CopilotKit canvas (Phase 2 examples)
- Patricia **`/admin/*`** until W8 (F20+)

---

## Gate status

| Gate | Status |
|------|--------|
| G2 Camila lead | 🟢 |
| G1 Andrés paid | 🟡 |
| G3 Roberto publish | 🟡 |
| Floor CI | 🟢 313 tests |
| MVP exit | 🟥 **No-Go** |
