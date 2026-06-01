---
id: 05H
diagram_id: MERM-07
prd_section: "5. AI agent architecture — Adapter layer"
title: Wire openclaw_gateway adapter — Paperclip agents send WhatsApp messages via OpenClaw
skills:
  - mde-paperclip  # PATCH company adapter config + test via agent delegation
  - open-claw      # REST API POST /api/messages + Idempotency-Key
  - mde-task-lifecycle
epic: E5
phase: MVP
priority: P2
status: Open
owner: Backend
dependencies:
  - E5-012  # 05M health stub must pass first
estimated_effort: L
percent_complete: 0
outcome: O8
---

<!-- task-summary -->
> **What:** Wire openclaw_gateway adapter — Paperclip agents can send WhatsApp messages via OpenClaw REST API
> **Why:** Without this adapter, Paperclip CEO/CMO/OpsManager agents have no outbound WhatsApp channel. G7 stale-lead nudges, G1 payment alerts, and host reminders all require a working outbound path. This connects Paperclip's agent system to OpenClaw's Baileys WA delivery.
> **Tools:** `mde-paperclip` (PATCH adapter config + agent delegation) · `open-claw` (REST API /api/messages + Idempotency-Key)
> **Workflow:** **Goal:** OpenClaw gateway adapter routes tasks with health and idempotency. → **Workflow:** Register adapter → test direct send → test Paperclip delegation → verify idempotency. → **Proof:** Duplicate Idempotency-Key does not produce duplicate WA message; Paperclip issue triggers WA within 10s.
> **Success Criteria:**
> - `openclaw_gateway` adapter registered in Paperclip company config
> - Direct API test: WA message received on allowlisted number within 10s
> - Same `Idempotency-Key` sent twice = one WA message (not two)
> - Adapter failure when OpenClaw is down creates Paperclip issue (no silent failure)
> **MVP · P2 · Open · Effort: L**
> **Depends on:** E5-012

# E5-007: Wire openclaw_gateway Adapter

## Overview

The `openclaw_gateway` adapter is registered in Paperclip company configuration so any agent — CEO, CMO, OpsManager — can send WhatsApp messages by delegating to OpenClaw.

**How it works:** When the CEO agent triggers G7 (lead untouched >24h), it does not send the WA message directly. It creates a delegation: `{ adapter: "openclaw_gateway", channel: "whatsapp", to: renter_phone, message: "..." }`. Paperclip calls the adapter, which POSTs to OpenClaw's REST API, which delivers via Baileys (the QR-paired WhatsApp session on the VPS).

**Prerequisite:** 05M health stub must pass — `openclaw security audit` clean, `GET /api/health` returns 200, idempotency behavior verified.

## How the Tools Work Together

```
Paperclip Agent (CEO / CMO / OpsManager)
  │ G7: lead untouched >24h
  │ G1: payment >$500 awaiting approval
  │ OpsManager: listing stale >7 days
  │
  ▼
Paperclip openclaw_gateway Adapter
  │ Registered in company config
  │ baseUrl: https://openclaw-vmjg.srv1641664.hstgr.cloud
  │ token: OPENCLAW_GATEWAY_TOKEN (from Infisical /openclaw)
  │
  ├── POST /api/messages
  │   Authorization: Bearer {token}
  │   Idempotency-Key: paperclip-{run_id}-{gate}-{record_id}
  │   { channel: "whatsapp", to: "+573...", text: "..." }
  │
  ├── OpenClaw receives → Baileys → WhatsApp delivery
  │
  ├── Response: { status: "delivered", messageId: "..." }
  │
  ├── Log to ai_runs: { agent_name: "openclaw_gateway", status: "success" }
  │
  └── If OpenClaw down (5xx / timeout):
        → Log to ai_runs (status: "error")
        → Create Paperclip issue "openclaw_gateway failure: [reason]"
        → Do NOT retry blindly
```

## Workflow 1: Register the Adapter in Paperclip

```bash
# Step 1: View existing adapters in the mde company config
curl -s \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  https://paperclip-dy8r.srv1641664.hstgr.cloud/api/companies/55141faa-8b30-4731-bfd0-c344eb448713 \
  | jq '.adapters'

# Step 2: Register openclaw_gateway adapter
curl -s -X PATCH \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Paperclip-Run-Id: register-openclaw-gateway-adapter-001" \
  -d '{
    "adapters": {
      "openclaw_gateway": {
        "type": "http",
        "baseUrl": "https://openclaw-vmjg.srv1641664.hstgr.cloud",
        "authHeader": "Authorization",
        "authValue": "Bearer {{OPENCLAW_GATEWAY_TOKEN}}",
        "endpoints": {
          "send_message": { "method": "POST", "path": "/api/messages" },
          "health": { "method": "GET", "path": "/api/health" }
        },
        "idempotencyHeader": "Idempotency-Key",
        "timeoutMs": 10000,
        "retries": 2,
        "fallback": "create_issue"
      }
    }
  }' \
  https://paperclip-dy8r.srv1641664.hstgr.cloud/api/companies/55141faa-8b30-4731-bfd0-c344eb448713

# Step 3: Verify adapter registered
curl -s \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  https://paperclip-dy8r.srv1641664.hstgr.cloud/api/companies/55141faa-8b30-4731-bfd0-c344eb448713 \
  | jq '.adapters.openclaw_gateway'
```

## Workflow 2: Direct API Test (Verify OpenClaw Receives)

```bash
# Get token from Infisical first
OPENCLAW_TOKEN=$(infisical secrets get OPENCLAW_GATEWAY_TOKEN --path /openclaw --projectId 82d12c1d --plain)

# Send test message to allowlisted number
IDEMPOTENCY_KEY="test-adapter-$(uuidgen)"

curl -s -X POST \
  -H "Authorization: Bearer $OPENCLAW_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "channel": "whatsapp",
    "to": "+14168003103",
    "text": "openclaw_gateway adapter test — if you see this, the Paperclip → OpenClaw chain works!"
  }' \
  https://openclaw-vmjg.srv1641664.hstgr.cloud/api/messages

# Expected: { "status": "delivered", "messageId": "..." }

# Test idempotency: same key, same body — must NOT send a second WA message
curl -s -X POST \
  -H "Authorization: Bearer $OPENCLAW_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "channel": "whatsapp",
    "to": "+14168003103",
    "text": "This MUST NOT be delivered — same idempotency key"
  }' \
  https://openclaw-vmjg.srv1641664.hstgr.cloud/api/messages

# Expected: same messageId returned, zero additional WA message received
```

## Workflow 3: Test Paperclip Agent Delegation

```bash
# Create a test issue that includes openclaw_gateway metadata
# The CEO agent reads this and delegates to the adapter
curl -s -X POST \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Paperclip-Run-Id: ceo-g7-test-delegation-001" \
  -d '{
    "title": "G7 TEST: Send WhatsApp nudge to lead Maria",
    "description": "Lead +14168003103 untouched 26h. Send WA: Hola! Seguiste buscando apartamento? Tenemos 2 nuevas opciones.",
    "assigneeAgentId": "03378f28-71ad-499e-8125-af6980f6d76b",
    "status": "open",
    "metadata": {
      "adapter": "openclaw_gateway",
      "channel": "whatsapp",
      "to": "+14168003103",
      "gate": "G7",
      "lead_id": "test-lead-uuid"
    }
  }' \
  https://paperclip-dy8r.srv1641664.hstgr.cloud/api/companies/55141faa-8b30-4731-bfd0-c344eb448713/issues

# Verify: check that WA message was received on test phone
# Verify: check ai_runs table for { agent_name: "openclaw_gateway", status: "success" }
```

## Workflow 4: Add Adapter Instructions to CEO Agent

Append to CEO agent instructions via PATCH (see 05A):

```markdown
## openclaw_gateway Adapter — Usage Rules

Use the openclaw_gateway adapter for all outbound WhatsApp messages. Always:
- Include Idempotency-Key: paperclip-{run_id}-{gate}-{record_id}
  Example: paperclip-heartbeat-20260508-g7-{lead_uuid}
- Channel: "whatsapp" for phone numbers (add web SSE in Phase 2 if needed)
- On adapter error: create Paperclip issue "openclaw_gateway failure: [error details]"
  Do NOT retry blindly — log and escalate
- Log every adapter call to ai_runs: { agent_name: "openclaw_gateway", input: phone, status }

When to use:
- G7: stale lead nudge → to: renter phone
- G1: payment approval → to: sk phone (+14168003103)
- OpsManager: listing freshness reminder → to: host phone
- CMO: approved promotional message → to: lead phone (requires human gate first)
```

## User Stories

| As a... | I want to... | So that... |
|---------|-------------|------------|
| CEO agent | Send G7 stale-lead WA nudge via openclaw_gateway | Leads re-engage without sk manually messaging them |
| CMO agent | Delegate WA message to openclaw_gateway after human approval | Promotional messages go through the approval gate |
| OpsManager | Notify host Maria via WA when her listing is stale | Host updates listing before it drops in search |
| sk | Know immediately when the adapter fails | I can investigate without wondering why WA messages stopped |
| Developer | Have idempotency built into the adapter | Paperclip retries do not create duplicate WA messages |

## The Build

1. **Verify 05M gate**: `openclaw security audit` exits 0 + `/api/health` returns 200
2. **Get token**: `infisical secrets get OPENCLAW_GATEWAY_TOKEN --path /openclaw --projectId 82d12c1d`
3. **Register adapter**: PATCH company config (Workflow 1)
4. **Verify registration**: GET company → confirm `.adapters.openclaw_gateway` present
5. **Direct API test**: Workflow 2 — send test WA to allowlisted number; confirm receipt
6. **Idempotency test**: Workflow 2 — send same key twice; confirm only one WA message
7. **CEO delegation test**: Workflow 3 — create Paperclip issue with adapter metadata
8. **Update CEO instructions**: Add adapter usage section (Workflow 4) via PATCH
9. **Verify ai_runs log**: Supabase query confirms `agent_name: openclaw_gateway` records
10. **Simulate failure**: Temporarily block OpenClaw URL → confirm Paperclip issue created

## Acceptance Criteria

- [ ] `openclaw_gateway` adapter registered in Paperclip company config (GET confirms `.adapters.openclaw_gateway`)
- [ ] Direct API test: WA message received on allowlisted number within 10s
- [ ] Idempotency test: same `Idempotency-Key` does not produce duplicate WA message
- [ ] CEO delegation: Paperclip issue with adapter metadata triggers WA send
- [ ] Adapter failure: when OpenClaw is down, Paperclip issue created (not silent failure)
- [ ] `ai_runs` record logged for every adapter call (status: success or error)
- [ ] `OPENCLAW_GATEWAY_TOKEN` sourced from Infisical — not hardcoded anywhere

## Feature Success

| Layer | Intent |
|-------|--------|
| **Goal** | OpenClaw gateway adapter routes Paperclip tasks to WhatsApp with health and idempotency. |
| **Workflow** | Register adapter → direct test → CEO delegation → idempotency verify. |
| **Proof** | Same Idempotency-Key twice = one WA message; Paperclip issue triggers WA within 10s. |
| **Gates** | 05M health + security audit before prod; token from Infisical only. |
| **Rollout** | Test with sk personal number first; expand allowlist after successful test. |

**Next:** [`08H-openclaw-wa-adapter-phase1.md`](../whatsapp/08H-openclaw-wa-adapter-phase1.md) (inbound WA → AI), [`08B-openclaw-whatsapp-adapter.md`](08B-openclaw-whatsapp-adapter.md) (full adapter Phases 2-4)
