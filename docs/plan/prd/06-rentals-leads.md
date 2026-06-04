---
doc: 06-rentals-leads
purpose: Rental search, listings, leads, showings (MVP)
depends_on: 04-maps-grounding.md, 07-contracts-schemas.md
replaces: prd-real-estateV2 (MVP slice)
audience: RE engineers
complexity: M
generates_tasks: F17, F41, RE-001+, rental-search workflow
---

# 06 — Rentals + leads

> [← Events](./05-events-ticketing.md) · [Deep spec: prd-real-estateV2.md](../real-estate/draft/prd-real-estateV2.md)

## Document spec

| Field | Value |
|-------|-------|
| **Deep appendix** | [`prd-real-estateV2.md`](../real-estate/draft/prd-real-estateV2.md) |
| **Implementation impact** | O3 Camila proof |
| **Tasks** | F17, F41, RE workflows |

---

## 1. MVP outcome (Camila)

```text
/chat → router → rental-search workflow → ≤5 RentalCards + rental pins → lead capture → leads row
```

**Not MVP:** Stripe Connect booking, lease AI agent, scam ML pipeline, WhatsApp prod.

---

## 2. Data

| Table | Use |
|-------|-----|
| `apartments` / `rentals` | 25 curated listings MVP |
| `leads` | Chat capture |
| `listing_embeddings` | Post-MVP semantic search |

Search MVP: keyword + filters + PostGIS if already in RPC — not pgvector first.

---

## 3. Orchestration

| Component | Role |
|-----------|------|
| `rental-search` workflow | Query → rank → `ToolResponse` |
| `search_rentals` tool | Supabase read + Zod |
| `routerAgent` | Intent `rental_search` |

**Not MVP:** `landlordAgent`, `leaseReviewAgent` — HITL + edge for legal copy later.

---

## 4. UI

| Surface | Components |
|---------|------------|
| `/rentals` | list + map (optional W5) |
| `/chat` | RentalCard via `useCopilotAction` |

Cards use shared [07-contracts](./07-contracts-schemas.md).

---

## 5. Leads

- Capture: explicit CTA on card → `POST /api/leads` or edge  
- Source tag: `mdeai-app`  
- Patricia: `/admin/leads` light table Post-MVP  

---

## 6. Showings (Post-MVP)

`suspend/resume` workflow for showing approval — after MVP exit.

---

## 7. Repo truth

| Built | Missing |
|-------|---------|
| — | Listings seed, workflow, cards, leads API |

---

## 8. PR alignment

**PR-5** after PR-1 (pins) green.
