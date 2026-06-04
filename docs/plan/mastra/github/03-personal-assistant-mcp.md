---
title: GitHub — Mastra personal assistant + MCP
repo: https://github.com/mastra-ai/personal-assistant-example
score: 52
traffic: yellow
phase: 2+
personas: [Patricia, Sofía]
---

# personal-assistant-example

## At a glance

| | |
|---|---|
| **What it is** | Personal assistant with **multiple MCP servers** (Zapier, GitHub, HN), memory, daily workflow, Telegram bot. |
| **Purpose** | Reference for **MCPClient** wiring and multi-tool agents — not Camila’s rental path. |
| **Goals** | See how Mastra merges MCP tools into one agent. |
| **What it does** | GPT-4o + Telegram + filesystem notes. |
| **Benefits** | Pattern for Patricia ops bot or WhatsApp Phase 2 — **not** `/api/copilotkit`. |
| **mdeai** | Product MCP = Google Grounding on `conciergeAgent`, not Zapier email. |

---

## Score: 52/100 🟡

Wrong default model and channel for Phase 1; valuable for MCP architecture study.

---

## Learn → adapt

| Pattern | mdeai mapping |
|---------|---------------|
| `MCPClient` tool merge | `conciergeAgent` + MAP-002 Grounding |
| Daily workflow | VPS cron digest for Patricia (Phase 2) |
| Notes on disk | OpenClaw workspace — not Vercel |
| Telegram | [`../examples/07-whatsapp-chat-bot.md`](../examples/07-whatsapp-chat-bot.md) deferred |

---

## Domain use cases

| Domain | Fit |
|--------|-----|
| Rentals | 🔴 — use Supabase tools |
| Events | 🟡 — host notifications workflow |
| Restaurants | 🟡 — external MCP for rare enrich |
| Maps | 🟡 — not a substitute for Grounding |
| Contests | — |

---

## User stories

**Patricia:** As Patricia, a future ops agent could run a “daily briefing” workflow like the template — on VPS, not user-facing chat.

**Sofía:** As Sofía, I study MCP connection lifecycle before adding a second MCP besides Grounding Lite.

---

## Journey — ops digest (Phase 2 sketch)

1. Scheduled workflow on VPS.
2. MCP GitHub + Supabase metrics tools.
3. Summary to Slack/email — no CopilotKit UI.

**Do not** put Telegram token on Vercel `mdeapp`.
