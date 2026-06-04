---
title: plan/docs vs plan/prd v7 — verification audit
date: 2026-05-21
verdict: plan/docs NOT 100% correct; plan/prd v7 ~92% correct (implementation lag documented)
---

# Verification audit: `plan/docs` vs `plan/prd` v7

## Executive verdict

| Corpus | 100% correct? | Planning quality | Safe for implementation? |
|--------|---------------|------------------|---------------------------|
| **`plan/docs/01–03`** | **No (~74%)** | Strong philosophy, weak execution binding | **No** — use as reference |
| **`plan/prd/01–10` v7** | **No (~92%)** | Aligned with repo + cuts | **Yes** — with repo truth headers |
| **Together** | Complementary | Docs = depth; prd = canon | **prd + roadmap + tasks only** |

---

## Scorecard: `plan/prd` v7 (canonical)

| Doc | Correct? | Gaps |
|-----|----------|------|
| 00-forensic | ✅ | — |
| 01-executive | ✅ | — |
| 02-core-architecture | ✅ | — |
| 03-runtime | ✅ | Could add `evaluationAgent` = offline only (1 line) |
| 04-maps | ✅ | Deep detail in `maps-prd.md` |
| 05-events | ✅ | Deep detail in `events-prd.md` |
| 06-rentals | ✅ | pgvector defer explicit |
| 07-contracts | ✅ | `platform/contracts` path clear |
| 08-repo | ✅ | Links `index.md` |
| 09-ops | ✅ | MCP in legacy skills ref — optional link |
| 10-delivery | ✅ | PR-1–5; could add F* crosswalk table |

**v7 missing (minor):** explicit **task-lifecycle** prompt template link; **MAP-000** task stub pointer; bilingual copy examples in 01 (optional).

---

## Scorecard: `plan/docs` by document

### `01-prd-plan.md` (docs 01–03)

| Section | Match v7? | Issue |
|---------|-----------|-------|
| Platform rule | ✅ | — |
| OpenClaw in core table | ⚠️ | OK as future; must not read as MVP |
| Doc 02 user flows | ✅ | Personas align |
| Doc 03 agents table | ❌ | Lists **6 agents** incl. `eventAgent`, `rentalAgent`, `evaluationAgent` — v7 MVP **≤4** + workflows |
| Doc 03 | ❌ | No **CK 1.55.2** pin; no **AG-UI** explicit |
| Doc 03 | ❌ | No **`/chat` 3-panel** |
| Observability § | ❌ | `agent_runs` — mdeapp uses **`ai_runs`** |
| Repo § packages/ | ❌ | **`packages/types/`** — v7 defers; use **`mdeapp/src/platform/contracts/`** |

### `02-prd-plan.md` (docs 04–06)

| Section | Match v7? | Issue |
|---------|-----------|-------|
| Maps stack | ⚠️ | **ECL in core stack** — Post-MVP in v7 |
| MapState / setPins | ✅ | Aligns with MapContext direction |
| Doc 05 event agents | ⚠️ | `eventAgent` + `evaluationAgent` — trim to **hostEventAgent + workflow** |
| Doc 06 rentals | ❌ | **`rentalAgent` + `conciergeAgent`** comparative path — v7 **`router` + `rental-search` workflow** |
| Doc 06 | ❌ | Implies **pgvector** path without MVP deferral |

### `03-prd-pland.md` (docs 07–10)

| Section | Match v7? | Issue |
|---------|-----------|-------|
| Doc 07 canonical path | ❌ | **`packages/types/`** — wrong for Phase 1 |
| Doc 08 structure | ⚠️ | Shows **`packages/`** monorepo — v7 uses **`src/platform/`** |
| Doc 09 telemetry | ❌ | **`agent_runs`** — should be **`ai_runs`** + planned quota logs |
| Doc 10 phases | ❌ | **Phase 1–7** order ≠ **PR-1–5**; **Phase 4 chat after Phase 3 rentals** — v7 **MAP-001 + `/chat` before or with rentals (PR-1)** |
| Doc 10 Phase 3 | ❌ | **pgvector queries** in rentals MVP — v7 **keyword/filters** |
| Doc 10 Done | ✅ | Aligns with anti-fake-done (tests, floor, UI) |
| Doc 10 | ⚠️ | Missing **localhost proof** explicit curl |
| Doc 10 | ⚠️ | MVP checklist has **7 items** vs v7 **4 outcomes** — extra items OK but blur exit |

### `prd-docs.md`

| Issue | Status |
|-------|--------|
| Superseded banner | ✅ Added |
| §20 production 86/100 | ✅ Fixed to planning vs code split |
| Agent roster “concierge main orchestrator” | ❌ Still in body — historical |

---

## Contradiction matrix (resolved ruling = v7)

| Topic | plan/docs says | **Ruling (`plan/prd`)** |
|-------|----------------|-------------------------|
| Schema home | `packages/types/` | `mdeapp/src/platform/contracts/` |
| Rental search MVP | pgvector | keyword + 25 listings |
| Chat vs rentals order | Phase 4 after Phase 3 | **PR-1** map + `/chat` first |
| Agent count | 5–6 named agents | router + host + thin concierge + workflows |
| Telemetry table | agent_runs | ai_runs (F13) |
| i18n | Not always explicit | English Phase 1 |
| Production ready | Implied in older synthesis | **Not** until MVP exit |

---

## mde-task-lifecycle compliance

| Checklist item ([planning.md](../../.claude/skills/mde-task-lifecycle/planning.md)) | plan/docs | plan/prd v7 |
|-------------------------------------------------------------------------------------|-----------|-------------|
| Persona in acceptance criteria | ✅ Personas in doc 02 | ✅ 01-executive |
| Verifiable proof commands | ⚠️ Generic | ✅ 10-delivery + prd.md Done |
| PRD section link in prompt | ❌ No stable § IDs | ✅ `doc: 07-contracts` frontmatter |
| Dependency on MAP-001 | ❌ | ✅ 04, 10, roadmap |
| Anti-fake-done | ✅ doc 10 §14 | ✅ 10 §1 |
| INDEX.md / F* task IDs | ❌ | ✅ 10 §7 |

**Task prompts should cite:** `plan/prd/XX-*.md` + `tasks/{core,events,real-estate,maps}/` specs — **not** `plan/docs/01-prd-plan.md`.

---

## What to improve (priority)

### P0 — do not implement from `plan/docs` without v7 cross-check

1. Replace mental model `packages/types` → [`07-contracts-schemas.md`](../prd/07-contracts-schemas.md)  
2. Replace phase order with [`10-delivery-roadmap.md`](../prd/10-delivery-roadmap.md) PR-1–5  
3. Replace agent armies with [`03-runtime-orchestration.md`](../prd/03-runtime-orchestration.md)  

### P1 — optional doc patches (banners + 3 fixes applied 2026-05-21)

- Banners on 01, 02, 03 → canonical pointer  
- 03: packages/types deferral note; ai_runs; pgvector defer  

### P2 — `plan/prd` small additions (recommended)

- [ ] `10-delivery`: table mapping PR-1–5 → F33, MAP-001, F17  
- [ ] `03-runtime`: one line — `evaluationAgent` offline only, not MVP register  
- [ ] `README`: link `plan/docs` as **extended reference**

---

## Is `plan/prd` 100% correct?

**No — and that is intentional.** v7 is **planning-correct** (~92/100) with explicit **repo truth** (48% implementation). It is not claiming production readiness.

| Correct | Intentionally incomplete |
|---------|---------------------------|
| Lanes, cuts, PR order | Every SQL column / edge fn body |
| Agent/workflow model | Full OpenAPI for all routes |
| Done gates | Every Playwright spec written |

**100% correct** would require generated specs from live `mdeapp/` + Supabase MCP — out of scope for PRD docs.

---

*Re-verify when PR-1 merges or MVP exit checklist flips.*
