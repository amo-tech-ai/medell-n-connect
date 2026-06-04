---
doc: 05-events-ticketing
purpose: Host wizard, HITL publish, Stripe ticketing
depends_on: 03-runtime-orchestration.md, 07-contracts-schemas.md, 09-operations-security.md
replaces: plan/events/events-prd.md (MVP slice; full matrix in appendix)
audience: events engineers
complexity: L
generates_tasks: F33–F38, F44–F45, EVT-* edges
---

# 05 — Events + ticketing

> [← Maps](./04-maps-grounding.md) · [Deep spec: events-prd.md](../events/events-prd.md)

## Document spec

| Field | Value |
|-------|-------|
| **Deep appendix** | [`plan/events/events-prd.md`](../events/events-prd.md) |
| **Implementation impact** | Revenue proof O1 + O2 |
| **Tasks** | F33–F38, F44, ticket edge ports |

---

## 1. MVP outcomes

| Persona | Proof |
|---------|-------|
| **Roberto** | 1 `events` row after HITL approve |
| **Andrés** | 1 `event_orders.status = paid` + QR in wallet |

---

## 2. Host flow (Roberto)

```text
/host/event/new → hostEventAgent → useCoAgent<EventDraftState>
  → tools: set_event_basics, set_venue, add_ticket_tier
  → renderAndWaitForResponse(ApprovalPanel)
  → edge approval-commit → events + event_tickets
```

**Not MVP:** Vendor agent, Marketing agent, Activations agent, Analytics agent.

---

## 3. Agent simplification

| Ship | Defer |
|------|-------|
| `hostEventAgent` | Coordinator, Vendor, Budget, Marketing |
| `venue-discovery` workflow | Multi-agent fan-out |
| `event_discovery` tool on router | Separate `eventAgent` until needed |

---

## 4. Ticketing (edge-only LLM)

| Function | Role |
|----------|------|
| `ticket-checkout` | Create Stripe session |
| `ticket-payment-webhook` | Idempotent paid status |
| `ticket-validate` | Door scan |
| `event-staff-link-generator` | Staff PWA links |

**Port from:** `/home/sk/mde/supabase/functions/` → `mdeapp/supabase/functions/`.

**MVP proof:** Stripe test card → paid row → `/me/tickets/:id` shows QR.

---

## 5. Tables (existing Supabase)

`events`, `event_tickets`, `event_orders`, `ticket_validations`, `approval_requests`, `approval_decisions`.

RLS already live — do not weaken for convenience.

---

## 6. HITL

- UI: CopilotKit `renderAndWaitForResponse`  
- Backend: `decide_approval()` RPC  
- Rule: **no live event without approval row**

---

## 7. Repo truth

| Built | Missing |
|-------|---------|
| `/host/event/new` page stub | `hostEventAgent`, HITL, edges in mdeapp |

---

## 8. PR alignment

- **PR-3:** host + HITL  
- **PR-4:** ticketing port  

**Blocked by:** PR-1 if map venue picker needed on wizard (optional stub without map).
