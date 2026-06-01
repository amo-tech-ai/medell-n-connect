# 06 — OpenClaw integration with CopilotKit + Mastra (Phase 2+)

> **Not MVP** — [`advanced.md`](../../advanced.md). Background automation drops in without replacing CK+Mastra. OpenClaw never bypasses `approval_requests`. `outbox_events` = planned seam (may not exist in DB yet).

```mermaid
flowchart LR
    subgraph FE["Frontend (Phase 1 — CopilotKit + Mastra)"]
      CHAT["/chat — user interactive"]
      ADMIN["/admin/approvals — operator queue"]
    end
    subgraph OPS["OpenClaw (Phase 2+)"]
      Q["Job Queue (Vercel Queues)"]
      W["Workers (Fluid Compute)"]
      SCH["Scheduler (Vercel crons + event-driven)"]
      OBS["Operator dashboard"]
    end
    subgraph CORE["Shared core (Phase 1 — reused)"]
      MAS["Mastra workflows + tools"]
      APR["approval_requests + decide_approval"]
      OUT["outbox_events"]
    end
    subgraph SB[Supabase + External]
      DB[(events / leads / sponsor_*)]
      EXT[Stripe / WhatsApp / Postiz / Google Maps]
    end
    CHAT --> MAS
    SCH --> Q
    Q --> W
    W --> MAS
    MAS --> APR
    APR --> ADMIN
    ADMIN -->|on approve| OUT
    OUT --> EXT
    OUT --> DB
    W -->|writes| DB
    OBS -.observes.-> W

    classDef phase1 fill:#c8e6c9,stroke:#2e7d32
    classDef phase2 fill:#fff9c4,stroke:#f57f17
    class CHAT,ADMIN,MAS,APR,OUT,SB,DB,EXT phase1
    class Q,W,SCH,OBS,OPS phase2
```
