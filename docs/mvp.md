---
title: mdeai — MVP definition (pointer)
date: 2026-05-30
status: Active
canonical_plan: plan.md
canonical_exit: tasks/MVP-REQUIRED.md
strategy: roadmap.md
---

# MVP definition

**Do not duplicate task order here.** Use:

| Doc | Role |
|-----|------|
| [`plan.md`](./plan.md) | **Master execution order** (Tier 0 shipped → P0 exit → CORE/MVP/ADV) |
| [`tasks/MVP-REQUIRED.md`](./tasks/MVP-REQUIRED.md) | **MVP exit gates** (G1, G2, G3, floor bundle) |
| [`tasks/INDEX.md`](./tasks/INDEX.md) | Slim router + track indexes |
| [`todo.md`](./todo.md) | Live operator queue |
| [`roadmap.md`](./roadmap.md) | Now/Next/Later narrative |

## MVP exit (personas on https://www.mdeai.co)

| Persona | Surface | Exit criterion |
|---------|---------|----------------|
| **Camila** | `/` | Chat → rental **or** café cards + map pins + lead (**G2** 🟢) |
| **Andrés** | checkout → `/me/tickets` | Paid Stripe row + QR (**G1** 🟡) |
| **Roberto** | `/host/event/new` | NL wizard → HITL publish → `events` row (**G3** 🟡) |

**Platform sign-off (after G1+G3 ledger):** F32 ‖ AUTH-011 ‖ MAP-002B ‖ MAP-008B

**Out of MVP:** native rental booking, WhatsApp prod, Hermes hot-path, contests, sponsors, Lingui (English only Phase 1), full VEN booking pipeline, INT-006+ café intelligence.

## Status (2026-05-30 audit)

| Metric | Value |
|--------|------:|
| MVP readiness | **72/100** 🟡 |
| Floor | 🟢 313 Vitest @ `8c99ded` |
| MVP exit | **No-Go** — G1, EVP-003/013, G3, EVP-001 + UX P0 open |

Tracker: [`tasks/progres.md`](./tasks/progres.md) · Summary: [`plan.md` § At a glance](./plan.md)

## P0 now (summary)

```text
G1 → EVP-003 → EVP-013 → G3 → EVP-001  →  F32 ‖ AUTH-011 ‖ MAP-002B ‖ MAP-008B
UX: 003 → 002+005 → 009 → 006+007 → 008   (‖ sign-off; 001 🟢)
```

Detail: [`plan.md` § Tier 1](./plan.md) · [`tasks/MVP-REQUIRED.md`](./tasks/MVP-REQUIRED.md)

## After MVP

Post-MVP and Phase 2 scope: [`advanced.md`](./advanced.md) · PRD strategy: [`plan/prd/01-executive-strategy.md`](./plan/prd/01-executive-strategy.md)

**Done gates:** code + test + localhost + evidence + `npm run floor` — [`prd.md` § Definition of Done](./prd.md#definition-of-done)
