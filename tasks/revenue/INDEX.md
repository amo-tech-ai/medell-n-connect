---
title: Revenue Tasks Index
updated: 2026-06-04
owner: sanjiovani
strategy: ../../docs/strategy/index-revenue.md
backlog: ../../docs/strategy/task-backlog.md
---

# Revenue Tasks

> **Gate:** All revenue tasks require MVP exit (PAY-001 + EVT-001 + MAP-002B + AUTH-011). Track: [Linear MVP view](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a)
>
> **Strategy:** [`docs/strategy/index-revenue.md`](../../docs/strategy/index-revenue.md) · [`docs/strategy/task-backlog.md`](../../docs/strategy/task-backlog.md)
>
> **Skills routing** (per `index-skills.md`): Stripe tasks → `mde-stripe` + `mde-supabase` · Agent tasks → `mastra` + `copilotkit-integrations` · UI tasks → `copilotkitV1` + `shadcn` · All tasks → `mde-task-lifecycle` → `task-verifier`

## TIER R1 — First revenue sprint (post-MVP-exit, week 1–2)

> Theme: zero-infra cash + internal cleanup. No new tables, no new agents yet.

| # | Task ID | File | Linear Project | Effort | Status |
|---|---------|------|----------------|--------|--------|
| 1 | C13 | [C13-agent-cleanup.md](C13-agent-cleanup.md) | AI & Intelligence | 3–5 days | ⚪ Not Started |
| 2 | C1 | [C1-ai-marketing-agency.md](C1-ai-marketing-agency.md) | Growth & Operations | 2–3 wk | ⚪ Not Started |
| 3 | C11 | [C11-wallets-everywhere.md](C11-wallets-everywhere.md) | Commerce Platform | 1 wk | ⚪ Not Started |
| 4 | C2 | [C2-create-checkout-tool.md](C2-create-checkout-tool.md) | Commerce Platform | 3–4 wk | ⚪ Not Started |

## TIER R2 — Revenue infrastructure (weeks 3–7, after C2 ships)

> Theme: billing rails + Sales Agent so every discovery flow can close.

| # | Task ID | File | Linear Project | Effort | Status |
|---|---------|------|----------------|--------|--------|
| 5 | C3 | [C3-stripe-billing.md](C3-stripe-billing.md) | Commerce Platform | 2–4 wk | ⚪ Not Started |
| 6 | C12 | [C12-platform-fees-ledger.md](C12-platform-fees-ledger.md) | Commerce Platform | 1–2 wk | ⚪ Not Started |
| 7 | C6 | [C6-sales-agent.md](C6-sales-agent.md) | AI & Intelligence | 2–3 wk | ⚪ Not Started |
| 8 | C15 | [C15-promo-codes.md](C15-promo-codes.md) | Commerce Platform | 1 wk | ⚪ Not Started |
| 9 | C9 | [C9-restaurant-venue-retainer.md](C9-restaurant-venue-retainer.md) | Venues | 2 wk | ⚪ Not Started |
| 10 | C10 | [C10-nightlife-vip-deposit.md](C10-nightlife-vip-deposit.md) | Venues | 2–3 wk | ⚪ Not Started |

## TIER R3-A — Independent (weeks 6–12, no Chatwoot required)

> Theme: bill the leads already captured; activate dormant sponsor schema; qualify leads with AI.

| # | Task ID | File | Linear Project | Effort | Depends on | Status |
|---|---------|------|----------------|--------|------------|--------|
| 11 | C4 | [C4-metered-rental-lead-billing.md](C4-metered-rental-lead-billing.md) | Commerce Platform + Real Estate | 2 wk | C3 | ⚪ Not Started |
| 12 | C5 | [C5-advertise-self-serve.md](C5-advertise-self-serve.md) | Growth & Operations | 3–4 wk | C2 | ⚪ Not Started |
| 14 | C8 | [C8-lead-agent.md](C8-lead-agent.md) | AI & Intelligence + Real Estate | 2–3 wk | C4 | ⚪ Not Started |

## TIER CW — Chatwoot prerequisite infra track (run in parallel with R2, before R3-B)

> **Why this track exists:** C7, C14, M7, M8 all require a live WhatsApp send/receive loop. `wa_outbox` exists but is a dead stub — no Business API wiring. This track builds the channel + bridge layer. See `docs/prd/chatwoot-integration-plan.md` for the full architecture.
>
> **Implementation order is strict:** CW-1 → CW-2 → CW-3 → CW-4 → CW-5. Only after CW-3 ships can C7 start. CW-4 and CW-5 can overlap with early C7 work.

| # | Task ID | File | Description | Depends on | Status |
|---|---------|------|-------------|------------|--------|
| 8.1 | CW-1 | [CW-1-deploy-chatwoot.md](../venues/tasks/chatwoot/CW-1-deploy-chatwoot.md) | Deploy Chatwoot on Hetzner via Coolify | MVP-exit | ⚪ Not Started |
| 8.2 | CW-2 | [CW-2-whatsapp-cloud-api-inbox.md](../venues/tasks/chatwoot/CW-2-whatsapp-cloud-api-inbox.md) | WhatsApp Cloud API inbox + WABA verification + templates | CW-1 | ⚪ Not Started |
| 8.3 | CW-3 | [CW-3-chatwoot-bridge.md](../venues/tasks/chatwoot/CW-3-chatwoot-bridge.md) | `/api/chatwoot-bridge` — Chatwoot webhook → Mastra pipeline | CW-2 | ⚪ Not Started |
| 8.4 | CW-4 | [CW-4-contact-conversation-mirror.md](../venues/tasks/chatwoot/CW-4-contact-conversation-mirror.md) | Mirror contacts + conversations to Supabase | CW-3 | ⚪ Not Started |
| 8.5 | CW-5 | [CW-5-g2-lead-capture-hook.md](../venues/tasks/chatwoot/CW-5-g2-lead-capture-hook.md) | G2 lead capture from WhatsApp → Supabase `leads` table | CW-4 | ⚪ Not Started |

## TIER R3-B — Chatwoot-dependent (hold until CW-3 ships)

> **Gate:** CW-3 (`/api/chatwoot-bridge`) must be live before C7 can start. C14 depends on C7. M7 and M8 depend on C7.

| # | Task ID | File | Linear Project | Effort | Depends on | Status |
|---|---------|------|----------------|--------|------------|--------|
| 13 | C7 | [C7-marketing-agent-whatsapp.md](C7-marketing-agent-whatsapp.md) | AI & Intelligence | 3 wk | C1, CW-3 | 🔴 Blocked on CW-3 |
| 15 | C14 | [C14-abandoned-cart-whatsapp-recovery.md](C14-abandoned-cart-whatsapp-recovery.md) | Growth & Operations | 1–2 wk | C7 | 🔴 Blocked on C7 |

## TIER R4 — Connect, portals, and CRM (months 3–6, after R3 ships)

> Theme: Stripe Connect Express payouts, B2B operator portal, CRM pipeline, marketing automation, and consumer monetization.
>
> **Hard gate:** All M-series tasks require `MVP-exit`. M1 (Connect) must ship before M3, M10, M11. C7 (Chatwoot-dependent) must ship before M7, M8.
>
> **Implementation order:** M1 → M4 → M5 → M6 → M7 → M8 → M2 → M9 → M11 → M3 → M10 → M12

| # | Task ID | File | Linear Project | Effort | Depends on | Status |
|---|---------|------|----------------|--------|------------|--------|
| 16 | M1 | [M1-stripe-connect-express.md](M1-stripe-connect-express.md) | Revenue | 6–10 wk | C2, C12 | ⚪ Not Started |
| 17 | M4 | [M4-business-subscription-tiers.md](M4-business-subscription-tiers.md) | Commerce Platform | 3–4 wk | C3 | ⚪ Not Started |
| 18 | M5 | [M5-sponsor-agent.md](M5-sponsor-agent.md) | AI & Intelligence | 3 wk | C5 | ⚪ Not Started |
| 19 | M6 | [M6-opportunities-crm.md](M6-opportunities-crm.md) | Growth & Operations | 2–3 wk | C8 | ⚪ Not Started |
| 20 | M7 | [M7-restaurant-reservation-management.md](M7-restaurant-reservation-management.md) | Venues | 3 wk | C7 | 🔴 Blocked on C7 |
| 21 | M8 | [M8-campaigns-automations.md](M8-campaigns-automations.md) | Growth & Operations | 3–4 wk | C7 | 🔴 Blocked on C7 |
| 22 | M2 | [M2-business-portal.md](M2-business-portal.md) | Growth & Operations | 4–6 wk | C3, C8 | ⚪ Not Started |
| 23 | M9 | [M9-analytics-dashboards.md](M9-analytics-dashboards.md) | Growth & Operations | 3 wk | M2 | ⚪ Not Started |
| 24 | M11 | [M11-partners-onboarding.md](M11-partners-onboarding.md) | Growth & Operations | 2–3 wk | M1, M2 | ⚪ Not Started |
| 25 | M3 | [M3-tourism-experience-checkout.md](M3-tourism-experience-checkout.md) | Revenue | 4–6 wk | M1, C2 | ⚪ Not Started |
| 26 | M10 | [M10-rental-deposit-connect.md](M10-rental-deposit-connect.md) | Revenue | 4 wk | M1, C2 | ⚪ Not Started |
| 27 | M12 | [M12-consumer-pro-subscription.md](M12-consumer-pro-subscription.md) | Revenue | 2–3 wk | C3 | ⚪ Not Started |

## TIER R5 — AI monetization (months 6–18, after R4 ships)

See [`docs/strategy/index-revenue.md`](../../docs/strategy/index-revenue.md) §Implementation Order for the full A1–A10 backlog.
