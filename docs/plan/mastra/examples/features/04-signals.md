---
title: Feature — Signals (mdeai)
source: https://mastra.ai/docs/agents/signals
journeys: [Phase 2 channels]
personas: [Camila, Roberto]
phase: 2+ (alpha API)
---

# Signals — mdeai

**Official:** [Signals](https://mastra.ai/docs/agents/signals) (**experimental / alpha**)

Push context into a **thread** without starting a new `agent.stream()` — wake idle threads or inject into a running loop (webhooks, email, PR comments).

---

## mdeai today vs target

| Item | Today | Target |
|------|-------|--------|
| `sendSignal` / `subscribeToThread` | **Not used** | WhatsApp inbound, Stripe `checkout.session.completed` |
| CopilotKit `/chat` | User messages only via POST | Server injects `system-reminder` signals |
| Multi-tab | One thread per session | `ifIdle.behavior: 'persist'` for batched notifications |

---

## Features & use cases

| Capability | mdeai use case |
|------------|----------------|
| `type: 'user-message'` | Continue Camila’s thread from mobile web without resending history |
| `type: 'system-reminder'` | “Andrés completed checkout for event X” while Roberto’s host thread is idle |
| `ifActive.behavior: 'deliver'` | Stripe webhook adds context mid–event-wizard stream |
| `attributes` | Slack-style `{ name, from: 'whatsapp' }` when multi-channel Phase 2 |
| `subscribeToThread` | Admin dashboard watches agent stream (Patricia) |

---

## User stories

**Roberto (J5)**  
As Roberto, when Andrés buys a ticket, a **signal** appends “1 VIP sold” to my host thread without me refreshing — the publish wizard agent sees it on the next turn.

**Camila (Phase 2 WhatsApp)**  
As Camila, my WhatsApp reply is wrapped as a signal on the same `resourceId` thread as `/chat` — Mastra loads history from storage; the client sends **only the new line** ([07-message-history](07-message-history.md)).

**Sofía**  
As Sofía, I use `ifIdle.behavior: 'persist'` in tests so three webhooks queue before Camila opens the app — then one `wake` processes them in order.

---

## Journey — ticket sold signal

1. Stripe webhook → Next route validates signature → `conciergeAgent` not used.
2. `hostEventAgent` thread `host-${eventId}`, resource `roberto-user-id`.
3. `sendSignal({ type: 'system-reminder', contents: 'Ticket tier GA: +1 sale', attributes: { source: 'stripe' } })`.
4. Roberto’s CopilotKit session subscribed → sidebar shows reminder; agent offers “View sales summary.”

**CopilotKit:** Requires server-side bridge that maps CopilotKit `threadId` ↔ Mastra `thread` — same IDs as F13.

**Related:** [../07-whatsapp-chat-bot.md](../07-whatsapp-chat-bot.md) · [../domains/02-events-hosting.md](../domains/02-events-hosting.md)
