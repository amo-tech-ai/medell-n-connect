---
doc: 01-executive-strategy
purpose: Vision, personas, revenue, MVP boundaries, scope cuts
depends_on: 00-forensic-audit.md
replaces: _legacy/01-foundation, _legacy/02-users-flows, plan/docs/prd-docs §1–4
audience: founders, product, investors
complexity: M
generates_tasks: F33–F45 scope, MVP proofs, business metrics
---

# 01 — Executive strategy

> [← README](./README.md) · [Next: Core architecture →](./02-core-architecture.md)

## Document spec

| Field | Value |
|-------|-------|
| **Filename** | `01-executive-strategy.md` |
| **Implementation impact** | Defines what ships in Phase 1; gates all task specs |
| **Tasks** | MVP exit proofs, O1–O5 in roadmap |

---

## 1. What mdeai is

**Medellín’s structured AI concierge** — one chat, one map, one approval gate — for:

- **Rentals** (medium-term furnished — Camila)  
- **Events** (host + ticket — Roberto, Andrés)  
- **Concierge** (food, attractions — Tourist)  

**Not:** global travel app, crypto tickets, AI-as-executor, 15 agents per vertical.

---

## 2. Platform rule

```text
Supabase owns data · Mastra owns orchestration · CopilotKit owns UI
· Google Maps owns spatial display · Gemini explains (tool-backed only)
```

---

## 3. Personas (Phase 1)

| Persona | Surface | Success signal |
|---------|---------|----------------|
| **Roberto** | `/host/event/new` | 1 published event after HITL |
| **Andrés** | event checkout | 1 `event_orders.status = paid` |
| **Camila** | `/chat`, `/rentals` | ≤5 rental pins + 1 `leads` row |
| **Tourist** | `/chat` | grounded restaurant/attraction cards |
| **Patricia** | `/admin/*` (light) | approvals + quota visibility |
| **Sofía** | CI | `npm run floor` green |

---

## 4. Revenue (Phase 1)

| Stream | Mechanism | MVP proof |
|--------|-----------|-----------|
| Event tickets | Stripe + commission | 1 paid order |
| Rental leads | Affiliate / manual nurture | 1 lead row |
| Sponsors / contests | — | **Out** — Advanced |

---

## 5. MVP exit (only four outcomes)

Canonical pointer: [`mvp.md`](../../mvp.md).

1. Roberto — AI-assisted event + HITL → `events` row  
2. Andrés — one paid ticket  
3. Camila — chat → pins → lead  
4. Platform — `/chat` 3-panel + MAP-001–003 + floor green  

**Calendar:** **12–14 weeks** realistic.

---

## 6. MVP enforcement rules

| Rule | Enforcement |
|------|-------------|
| No feature without persona + metric | Task spec must name both |
| No “Done” without code proof | [10-delivery-roadmap.md](./10-delivery-roadmap.md) |
| English UI only | No Lingui in W1–W14 |
| One orchestrator | Reject LangGraph/CrewAI tasks |
| Geo from tools only | Reject LLM lat/lng in acceptance criteria |

---

## 7. Anti-scope-creep rules

**If not required for MVP exit → do not build.**

| Reject in Phase 1 | Where it lives |
|-------------------|----------------|
| OpenClaw production outbound | [`advanced.md`](../../advanced.md) |
| Hermes live rerank | Advanced |
| Contests, sponsor marketplace | Advanced |
| Native rental Stripe booking | Post-MVP |
| CopilotKit v2 | Phase 2 |
| Lingui / Spanish-first UI | Phase 2 |
| 12+ event agents | [05-events-ticketing.md](./05-events-ticketing.md) — workflows only |
| pgvector before keyword path works | [06-rentals-leads.md](./06-rentals-leads.md) |

**Allowed:** `places-proxy` read infra, shadow logging, manual Postiz.

---

## 8. Strategic cuts (why old app was heavy)

Legacy `/home/sk/mde/`: ~2,400 LoC custom chat glue. Greenfield replaces with CK primitives + ~700 LoC platform code. **Do not port** `ChatCanvas`, custom SSE, `pendingActions`.

---

## 9. Repo truth (executive)

| Planning | Code (`mdeapp`) |
|----------|-----------------|
| 82/100 | 48/100 |
| Not production-ready | Foundation + `pingAgent` only |

Detail: [00-forensic-audit.md](./00-forensic-audit.md).

---

## 10. Decisions waiting

1. Confirm `mdeapp/` as sole app path  
2. Vercel project strategy  
3. Legacy freeze enforcement date  
4. `clawg-ui` / `clawpilot` — defer  

---

*Engineering starts at [07-contracts-schemas.md](./07-contracts-schemas.md), not here.*
