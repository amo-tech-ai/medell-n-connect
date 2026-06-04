---
doc: 10-delivery-roadmap
purpose: PR track, weeks, Done gates, risks, task generation
depends_on: 01-executive-strategy.md, all 02-09
replaces: _legacy/08-delivery, supplements ../../roadmap.md
audience: PM, eng leads
complexity: M
generates_tasks: all F* and MAP* in tasks/INDEX.md
---

# 10 — Delivery roadmap + execution

> [← Operations](./09-operations-security.md) · [Living roadmap: roadmap.md](real-estate/draft/roadmap.md)

## Document spec

| Field | Value |
|-------|-------|
| **Task index** | [`tasks/INDEX.md`](../../tasks/INDEX.md) |
| **Horizon** | 12–14 weeks Phase 1 |

---

## 1. Definition of Done

| # | Gate |
|---|------|
| 1 | Code merged in `mdeapp/` |
| 2 | Test pass (Vitest / Playwright per task) |
| 3 | `npm run dev` — surface responds |
| 4 | Evidence: screenshot / curl / SQL |
| 5 | `npm run floor` green when applicable |

**Spec complete ≠ Done.**

---

## 2. Repo-first PR track (authoritative)

| PR | Scope | Proof | Blocks |
|----|-------|-------|--------|
| **PR-1** | `platform/contracts` + `platform/maps` + MAP-001 + `/chat` shell | Pin count test; schema Vitest | all |
| **PR-2** | Grounding + attribution + quota log | Grounded query + badge | — |
| **PR-3** | Roberto wizard + HITL | `events` row | PR-1 |
| **PR-4** | Ticket edges + wallet | `paid` + QR | PR-3 optional parallel |
| **PR-5** | Rentals + lead | cards + pins + `leads` | PR-1 |

---

## 3. Week map (realistic)

| Weeks | Theme | PR / tasks |
|-------|-------|------------|
| W1–2 | Foundation | F01–F13 ✅ |
| W3–4 | PR-1 + PR-2 | MAP-001–003, contracts |
| W4–6 | PR-3 + PR-4 | F33–F38, EVT port |
| W6–8 | PR-5 + MAP-007 | F17, F41, `/chat` polish |
| W8–10 | Hardening | F11, e2e, admin light |
| W10–14 | Soak + cutover | rolling traffic |

---

## 4. MVP exit checklist

- [ ] O1 paid ticket  
- [ ] O2 Roberto event live  
- [ ] O3 Camila pins + lead  
- [ ] O4 `/chat` + MAP-001–003  
- [ ] O5 attribution + floor green  

---

## 5. Testing strategy

| Layer | What |
|-------|------|
| Unit | Zod contracts, normalize, tool golden JSON |
| Integration | copilotkit POST, approval-commit |
| E2E | maps-pins, host-publish, ticket-checkout |
| Manual | localhost proof per task |

Target: **≥30 meaningful tests** by MVP exit (not 90 vanity).

---

## 6. Top risks + mitigations

| Risk | Mitigation |
|------|------------|
| MAP-001 slip | PR-1 only focus |
| Ticket port bugs | Idempotency tests + Stripe CLI |
| Agent name mismatch | CI check |
| Scope creep | [01 §7](./01-executive-strategy.md) |

---

## 7. Task generation map

| PR | Doc section | Task families |
|----|-------------|---------------|
| PR-1 | [07](./07-contracts-schemas.md), [04](./04-maps-grounding.md) | MAP-001–003, platform/contracts, F16, F43 |
| PR-2 | [04](./04-maps-grounding.md) | MAP-002–003, grounding quota |
| PR-3 | [05](./05-events-ticketing.md) | F33–F38 |
| PR-4 | [05](./05-events-ticketing.md) | F11, F44, EVT checkout/webhook |
| PR-5 | [06](./06-rentals-leads.md) | F17, F41, RE-* |
| — | [03](./03-runtime-orchestration.md) | F18, F02 |
| — | [09](./09-operations-security.md) | F11–F13 |

**Lifecycle:** prompts per [`.claude/skills/mde-task-lifecycle/planning.md`](../../.claude/skills/mde-task-lifecycle/planning.md) — cite `plan/prd/XX` + proof command, not `plan/docs/`.

---

## 8. Recommended implementation sequence (single list)

1. Read [00-forensic-audit](./00-forensic-audit.md)  
2. Implement [07-contracts](./07-contracts-schemas.md)  
3. [04 MAP-001](./04-maps-grounding.md) + `/chat` shell  
4. [04 MAP-002–003](./04-maps-grounding.md)  
5. [05 Roberto](./05-events-ticketing.md)  
6. [05 Ticketing](./05-events-ticketing.md)  
7. [06 Rentals](./06-rentals-leads.md)  
8. Floor + MVP exit checklist  
9. Post-MVP → [`advanced.md`](../../advanced.md)  

---

## 9. Anti-fake-done for agents

When generating tasks from this doc:

- Every task lists **persona + proof command**  
- Every task links **one v7 doc section**  
- No task references deprecated `_legacy/` paths as canonical  

---

*Sync with [`roadmap.md`](real-estate/draft/roadmap.md) on conflict — **PR track in both must match** (this doc wins for sequencing).*
