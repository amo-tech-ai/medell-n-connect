---
title: Example — WhatsApp Chat Bot (mdeai)
source: https://mastra.ai/examples/v0/agents/whatsapp-chat-bot
journeys: []
personas: [Camila]
phase: 2+
---

# WhatsApp Chat Bot — mdeai

**Official:** [WhatsApp Chat Bot](https://mastra.ai/examples/v0/agents/whatsapp-chat-bot)

Mastra **server** exposes `registerApiRoute("/whatsapp")` for Meta webhooks; a **workflow** chains `chatAgent` → `textMessageAgent` (structured 5–8 short messages) → `sendWhatsAppMessage`.

---

## Feature summary

| Official piece | mdeai Phase 1 | Phase 2+ |
|----------------|---------------|----------|
| WhatsApp webhook on Mastra Hono | **No** | OpenClaw / Hostinger or dedicated service |
| `chatWorkflow` multi-step | Similar to `concierge-routing-workflow` | WhatsApp-specific |
| Anthropic models in example | **Forbidden** in mdeapp | Gemini only |
| Memory per user phone | Map `resource` = phone hash | After F13 |

**PRD:** WhatsApp-dominant Colombia market — **deferred** past W6 English web chat ([`../04-user-stories.md`](../04-user-stories.md) out of scope).

---

## User stories

**Camila — future channel**  
As Camila, I message Medellín AI on WhatsApp in Spanish (Phase 2 i18n) and get the same rental cards as `/chat`, with messages split into short bubbles like the [official workflow](https://mastra.ai/examples/v0/agents/whatsapp-chat-bot).

**Sofía — architecture**  
As Sofía, I do **not** put WhatsApp webhooks on `mdeapp` Vercel serverless alone — long workflow + outbound Graph API may need edge fn or VPS ([`CLAUDE.md`](../../../CLAUDE.md) OpenClaw path).

**Patricia**  
As Patricia, WhatsApp leads still land in Supabase CRM; agent is assistive, not source of truth for payments (Andrés stays on Stripe web).

---

## Real-world mdeai examples

| Concern | mdeapp web (Phase 1) | WhatsApp (Phase 2+) |
|---------|----------------------|---------------------|
| Ingress | `POST /api/copilotkit` | `POST /whatsapp` (edge or Mastra server) |
| Agent | `conciergeAgent` | Reuse same Mastra agents + memory |
| UI | CopilotKit sidebar | No CopilotKit — plain text bubbles |
| Split long replies | Streaming tokens | `textMessageAgent` structured split (official) |
| Auth | Supabase session | Phone number → `resource` id |

```text
Official:  Meta webhook → Mastra registerApiRoute → chatWorkflow → WhatsApp API
mdeai:     Phase 1 = Camila uses /chat in browser only
           Phase 2 = bridge conciergeAgent to channel adapter (not duplicate brain)
```

---

## Journey — Phase 2 (sketch)

1. User messages business WhatsApp number.
2. Webhook verifies token (official GET handler pattern).
3. Workflow runs `conciergeAgent` with `search-rentals` / grounding tools.
4. `textMessageAgent` splits reply; send with rate limits.
5. Thread `resource` = stable phone id; memory in Postgres (J10).

**Acceptance**

- [ ] Gemini-only models
- [ ] Listing URLs from tools only (same as web concierge)
- [ ] CopilotKit not required for channel
- [ ] No WhatsApp payment flows in agent prose

---

## CopilotKit note

WhatsApp is **Mastra + workflows + custom routes**, not CopilotKit. One **brain** (`conciergeAgent` in `mastra/index.ts`); multiple **faces** (web = CopilotKit, WhatsApp = webhook). Do not register WhatsApp as a CopilotKit runtime.

**Related:** Out of scope in [`../04-user-stories.md`](../04-user-stories.md) · [custom API routes](https://mastra.ai/docs/v0/server-db/custom-api-routes) vs Next routes
