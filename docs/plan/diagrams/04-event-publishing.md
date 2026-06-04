# 04 — Event publishing pipeline

> End-to-end lifecycle: Roberto → HITL → `events` + tiers → public page → buyer checkout → paid order → wallet QR → (Phase 1.5) staff scan. Canon: [`plan/prd/05-events-ticketing.md`](../prd/05-events-ticketing.md).

```mermaid
flowchart TB
    HOST[Roberto] --> NEW[/host/event/new/]
    NEW --> HEA[hostEventAgent]
    HEA --> ACT[useCopilotAction set_*]
    ACT --> STATE[useCoAgent EventDraftState]
    STATE --> PREV[ApprovalPanel renderAndWaitForResponse]
    PREV --> AC[approval-commit edge fn]
    AC --> DA[decide_approval RPC]
    DA --> FN[fn_apply_approval_decision]
    FN --> EVT[(events table)]
    FN --> TIX[(event_tickets table)]
    EVT --> PUB[/events/:id/ public page]
    PUB --> BUY[Buyer Andrés / Camila]
    BUY --> CHK[ticket-checkout edge fn]
    CHK --> STR[Stripe Checkout]
    STR --> WH[ticket-payment-webhook]
    WH --> ORD[(event_orders status=paid)]
    ORD --> QR[/me/tickets/:id/ buyer wallet]
    QR --> SCN[Phase 1.5 — staff PWA scan]

    classDef approval fill:#fff9c4,stroke:#f57f17
    classDef purchase fill:#e1f5fe,stroke:#0277bd
    classDef defer fill:#f5f5f5,stroke:#9e9e9e,stroke-dasharray:5 5
    class PREV,AC,DA,FN approval
    class BUY,CHK,STR,WH,ORD,QR purchase
    class SCN defer
```
