# mdeai progress — May 30, 2026

## At a glance (easy summary)

**What we checked:** Full forensic audit per [`tasks/prompts/progress-tracker.md`](../tasks/prompts/progress-tracker.md) — commands run on real code, not task status fields in markdown.

| Question | Short answer |
|----------|--------------|
| **Can we call MVP done?** | **No.** CI is green; **three persona proofs** and **prod UX** are not. |
| **MVP score** | **72 / 100** — strong platform, weak commerce + chat polish on prod |
| **Code on disk** | `mdeapp` @ **`8c99ded`** · prod site **up** (https://www.mdeai.co → 200) |
| **Tests today** | **313** Vitest pass · lint · build · floor all **exit 0** |

### What already works (personas)

| Persona | What they can do today | Proof |
|---------|------------------------|-------|
| **Camila** | Chat on `/` → rental or café cards, map pins, save a lead | **G2** 🟢 |
| **Andrés** | Checkout flow exists in code | **G1** 🟡 — needs one **real paid** ticket on prod |
| **Roberto** | Host wizard at `/host/event/new` | **G3** 🟡 — needs one **published** event row on prod |
| **Sofía (dev)** | `npm run floor` passes before merge | 🟢 313 tests |

### What’s still blocking MVP exit

1. **Money & events** — live Stripe payment proof, separate webhook secrets, **event cards in chat** (Playwright fails today), publish proof, then one **EVP-001** ledger file.
2. **Prod sign-off** — smoke checklist on www, auth/env on Vercel, ADK URL + Map ID on prod.
3. **Chat UX** — fix “$500 a night” parser, show errors when the agent times out, loading indicator, then monitor + map reset polish.

### Do this next (in order)

```text
079 G1 paid  →  080 webhooks  →  081 event cards  →  082 G3 publish  →  083 EVP-001 ledger
then in parallel:  F32 ‖ AUTH-011 ‖ MAP-002B ‖ MAP-008B  and  UX-003 → UX-002+005 → …
```

**Best next dev task:** **IMP-081** — event query must render `[data-testid="event-card"]` (SCREEN-006 e2e failed 2026-05-30).

**Canonical docs:** [`plan.md`](../plan.md) (top summary) · [`todo.md`](../todo.md) (checkbox queue) · [`tasks/progres.md`](../tasks/progres.md) (full table) · [`checklist.md`](../checklist.md) (done criteria)

| Dot | Meaning |
|-----|---------|
| 🟢 | Done — verified |
| 🟡 | Partly done |
| 🟥 | Blocked / failing |
| ⚪ | Not started |

---

## Audit complete (detailed notes)

Forensic pass on **2026-05-30** — docs updated; nothing marked complete without command proof.

## Files updated

| File | Change |
|------|--------|
| [`tasks/progres.md`](tasks/progres.md) | Full testing audit tracker + executive scores |
| [`checklist.md`](checklist.md) | Production-ready **success criteria** (was empty) |
| [`tasks/INDEX.md`](tasks/INDEX.md) | Metrics **72%** MVP, **313** tests, verification block |
| [`todo.md`](todo.md) | P0 A/B + **UX Tier 1C** with proof columns |
| [`changelog`](changelog) | § 2026-05-30 entry |

## Test results

| Command | Result | Notes |
|---------|:------:|-------|
| `npm run lint` | 🟢 | exit 0 |
| `npm run test` | 🟢 | **313/313** (was 278 in older docs) |
| `npm run build` | 🟢 | exit 0 |
| `npm run floor` | 🟢 | exit 0 |
| `npm run verify:mastra` | — | **not in package.json** |
| `curl https://www.mdeai.co/` | 🟢 | 200 |
| `POST …/api/copilotkit` | 🟢 | 415 (runtime up) |

**Git:** `mdeapp` @ **`8c99ded`** (ahead of `f37291d` in older todo — confirm Vercel prod SHA matches).

---

## Progress tracker (summary)

| Task Name | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|:------:|--:|--------------|---------------------|----------------|
| Core app + floor | Next.js 16, lint/test/build/floor | 🟢 | 100% | 313 Vitest, build routes | — | None |
| CopilotKit runtime | AG-UI `/api/copilotkit` | 🟢 | 95% | route + prod 415 | Full AG-UI POST smoke | Body-valid curl |
| Mastra agents (7) | Gemini 3.5-flash agents + tools | 🟢 | 88% | `index.ts` registry | Prod RUN_ERROR UX | UX-002/005 |
| Mastra workflows (3) | rental / event / concierge routing | 🟢 | 85% | registered | Prod traces | Studio on prod turn |
| Maps + vis.gl | mapId, markers, Places masks | 🟢 | 85% | tests + hooks | MAP-008B prod | IMP-092 |
| ADK grounding | Cloud Run client in Mastra | 🟡 | 75% | code + Vitest | Prod `ADK_GROUNDING_URL` | MAP-002B |
| Events commerce | checkout + webhooks | 🟡 | 70% | edge fns exist | EVP-003 secrets | IMP-080 |
| G1 Andrés paid | Stripe → paid + QR | 🟡 | 80% | checkout code | Live payment proof | IMP-079 |
| G3 Roberto publish | host wizard HITL | 🟡 | 90% | SCREEN-016 e2e | Prod SQL row | IMP-082 |
| G2 Camila lead | lead modal → Supabase | 🟢 | 100% | prod proven | — | None |
| EventCard E2E | SCREEN-006 | 🟥 | 45% | spec on disk | Playwright timeout | IMP-081 |
| EVP-001 ledger | G1+G2+G3 bundle | 🟥 | 0% | — | blocked on 079–082 | IMP-083 |
| UX prod pack | UX-001…010 | 🟡 | 15% | UX-001 🟢 | 003–009 ⚪ | UX-003 → 002+005 |
| pgvector | embeddings + RPCs | 🟡 | 40% | DB tables exist | VEC-001 cleanup | Post-MVP |
| OpenClaw / WhatsApp | VPS automations | ⚪ | 5% | specs only | no OCL shipped | Phase 2+ |
| Patricia admin | `/admin/*` | ⚪ | 0% | — | no routes | W8+ |
| F32 prod smoke | www matrix | ⚪ | 0% | — | no evidence file | IMP-084 |

Full table: [`tasks/progres.md`](tasks/progres.md) · gates: [`checklist.md`](checklist.md)

---

## Biggest blockers

1. **MVP commerce exit** — G1 manual paid proof, EVP-003 webhook isolation, EVP-013 EventCard e2e, EVP-001 ledger (IMP-079→083).
2. **Prod platform sign-off** — F32 smoke, AUTH-011 checklist, MAP-002B ADK URL, MAP-008B Map ID (IMP-084–092).
3. **UX P0** — price parser deploy, visible errors/loading, synthetic monitor, chat reset, stale markers (IMP-093–101); prod chat readiness was **48/100** in May 28 QA.

---

## MVP exit recommendation

| | |
|--|--|
| **Go / No-Go** | **No-Go** |
| **Reason** | Platform floor is green; **persona gates G1/G3/EVP-001** and **6 UX P0 tasks** are not closed with prod evidence. Prior “98% MVP” was planning optimism — forensic score **72%** with proof. |

---

## Production readiness by layer

| Layer | Score | Dot |
|-------|------:|:---:|
| CI / Vitest / build | 82 | 🟢 |
| AI (Mastra + Gemini 3.5 + tools) | 88 | 🟢 |
| Maps code | 74 | 🟡 |
| Supabase + edge | 76 | 🟡 |
| Commerce + UX on prod | 68 | 🟡 |
| pgvector productization | 35 | ⚪ |
| OpenClaw / ADK product | 5–10 | ⚪ |

**Next Cursor task:** IMP-079 Andrés G1 — live Stripe payment → `paid` row + wallet QR evidence file under `tasks/notes/` or `tasks/testing/evidence/2026-05-30/`.