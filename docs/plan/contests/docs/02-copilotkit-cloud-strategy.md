---
title: CopilotKit Cloud Strategy
status: Strategic appendix
date: 2026-05-24
related:
  - ./prd-event-contest.md
  - ./architecture.md
---

# CopilotKit Cloud Strategy

The MVP should prefer **CopilotKit Cloud + local Mastra orchestration**. This gives mdeai a fast AI workspace for Roberto and Patricia without forcing early self-hosted AI infrastructure.

## Recommendation

| Stage | CopilotKit posture | Mastra posture | Why |
|---|---|---|---|
| MVP | CopilotKit Cloud | Local in `mdeapp/` | Fastest path to AI cards, assistant state, and iteration. |
| Post-MVP | CopilotKit Cloud plus stronger telemetry/export | Local/server-side Mastra | Keep speed while adding sponsor and voting observability. |
| Enterprise pilot | Evaluate self-hosted CopilotKit options | Private Mastra deployment or controlled server runtime | Compliance, customer network, and tenant isolation. |
| Enterprise scale | Self-hosted or hybrid | Dedicated orchestration per enterprise/region if needed | Procurement and private infrastructure requirements. |

## When To Use Each Option

| Option | Use when | Avoid when |
|---|---|---|
| CopilotKit Cloud | MVP, fast iteration, small team, lower ops burden | Enterprise forbids hosted AI control plane |
| Self-hosted CopilotKit | Enterprise compliance, private network, custom security posture | Pre-revenue MVP |
| Local Copilot Runtime | Always for the app bridge to Mastra and business tools | Never as a replacement for DB truth |
| Local Mastra orchestration | All MVP workflows | Never bypass policy/approval gates |

## MVP Deployment Architecture

```mermaid
flowchart LR
  User[Roberto Patricia Contestant Fan] --> Web[Next.js mdeapp]
  Web --> CKCloud[CopilotKit Cloud]
  Web --> Runtime[/api/copilotkit]
  Runtime --> Mastra[Mastra local orchestration]
  Mastra --> Gemini[Gemini]
  Mastra --> DB[(Supabase)]
  Mastra --> ADK[ADK geo sidecar]
  Runtime --> DB
  Web --> Stripe[Stripe Checkout]
```

## Scaling Considerations

| Concern | MVP answer | Enterprise answer |
|---|---|---|
| AI UI state | Use CopilotKit Cloud and app-side state sync | Dedicated tenant/project or self-hosted deployment |
| Workflow scale | Mastra workflows plus job tables | Queue workers and region-aware orchestration |
| DB scale | Supabase Postgres + Realtime | Read replicas, warehouse, partitioned ledgers if needed |
| Live event bursts | Cache public reads, derive leaderboards from snapshots | Dedicated realtime/load-tested event paths |
| Tenant isolation | Org ids + RLS | Tenant-specific infrastructure if required |

## Privacy Considerations

| Data | Cloud MVP handling |
|---|---|
| Votes | Do not send raw vote ledgers to AI unless summarizing aggregate anomaly signals. |
| Payments | Stripe ids/status only; no card data. |
| Contestant PII | Minimize in AI prompts; use profile-safe summaries. |
| Sponsor CRM | Source-backed summaries; avoid unnecessary contact data in model prompts. |
| WhatsApp | Template text and segment metadata only where possible. |

## Cost and Complexity

| Path | Cost | Ops complexity | Recommendation |
|---|---:|---:|---|
| CopilotKit Cloud MVP | Low to variable | Low | Default |
| Self-hosted CopilotKit early | Medium to high | High | Avoid unless forced |
| Local runtime + Mastra | Low | Medium | Required app pattern |
| Full private enterprise | High | High | Sell only after MVP proof |

## Migration Path

1. Build MVP with CopilotKit Cloud and local `/api/copilotkit`.
2. Keep all business truth in Supabase and all sensitive commits behind Edge/API routes.
3. Keep Mastra tools provider-agnostic and approval-driven.
4. Add telemetry export and audit mapping.
5. For enterprise, move CopilotKit Intelligence/self-hosted components only after the product boundaries are proven.

