# 05 — Ticket purchase (Stripe sequence)

> Buyer (Andrés or Camila) on `/events/:id`. **Webhook updates DB only** — user redirect comes from Checkout **success_url**. Canon: [`plan/prd/05-events-ticketing.md`](../prd/05-events-ticketing.md).

```mermaid
sequenceDiagram
    actor Buyer
    participant EVT as /events/:id
    participant CHK as ticket-checkout edge
    participant STR as Stripe Checkout
    participant WH as ticket-payment-webhook
    participant SB as Supabase
    participant WAL as /me/tickets/:id

    Buyer->>EVT: select tier + Buy
    EVT->>CHK: POST tier qty
    CHK->>SB: reserve pending event_order idempotent
    CHK->>STR: create session + success_url
    STR-->>Buyer: payment UI
    Buyer->>STR: pay card / PSE / Nequi
    par User redirect
        STR-->>Buyer: redirect success_url
        Buyer->>WAL: ticket wallet page
    and Async settlement
        STR->>WH: signed webhook
        WH->>SB: event_orders.status = paid idempotent
    end
    WAL-->>Buyer: QR visible when paid row exists
```
