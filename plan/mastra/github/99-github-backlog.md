---
title: GitHub references — backlog
updated: 2026-05-21
---

# GitHub / product backlog

Repos and integrations **not yet** given full playbooks. Score when prioritized.

| Dot | Score | Candidate | mdeai angle | Suggested doc |
|-----|------:|-----------|-------------|---------------|
| 🟡 | 50 | `CopilotKit/examples/canvas/mastra` | Roberto canvas preview | link in `04-user-stories` only |
| 🟡 | 50 | `CopilotKit/examples/canvas/mastra-pm` | Patricia kanban | Phase 3 |
| 🟡 | 45 | `github/events/EventFlow-AI` | Legacy event ops | [`../../../github/events/README.md`](../../../github/events/README.md) |
| 🟡 | 40 | Apify **Facebook Marketplace** actor | Rental leads | extend [05-apify-mcp](05-apify-mcp-agent.md) |
| 🟡 | 40 | Apify **Airbnb** detail scraper | Price comps | VPS + Patricia review |
| 🔴 | 25 | `create-mastra@latest` weather template | W1 obsolete | — |
| 🔴 | 20 | WhatsApp channel bots | Phase 2 Colombia | [`../examples/07-whatsapp-chat-bot.md`](../examples/07-whatsapp-chat-bot.md) |
| 🔴 | 15 | Contests gamification repos | Deferred | [`../examples/domains/04-contests-deferred.md`](../examples/domains/04-contests-deferred.md) |
| 🟢 | 82 | [mastra-system-check](14-mastra-system-check.md) | Promoted from backlog |
| 🔴 | 38 | [AgentStack](15-agentstack.md) | Promoted from backlog |

---

## Domain gaps to document later

| Doc | Persona |
|-----|---------|
| `14-tickets-stripe-github.md` | Andrés/Miguel — Stripe samples |
| `15-admin-patricia-github.md` | CRM dashboards from `github/events` |
| `16-sponsors-marketplace.md` | PRD advanced |

---

## Apify + social rental enrichment (summary)

See [05-apify-mcp-agent.md](05-apify-mcp-agent.md):

- Airbnb actor → **price comparables** for Camila cards footer.
- Facebook Groups actor → **lead ingestion** queue, not chat output.
- Always: RLS table + human approval + separate from `search-rentals` ranking.

**Index:** [`index-github.md`](index-github.md)
