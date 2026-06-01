---
id: 08F
diagram_id: MERM-04
prd_section: "8. Multi-channel — WhatsApp ingress decision"
title: WhatsApp ingress ADR — OpenClaw Baileys for AI chat; Infobip for templates only
skills:
  - open-claw      # Baileys channel config, dmPolicy allowlist, QR pairing
  - mde-hostinger  # VPS verify Baileys is active
  - mde-task-lifecycle
epic: E8
phase: ADVANCED
priority: P1
status: Open
owner: Backend
dependencies: []
estimated_effort: S
percent_complete: 0
outcome: O5
---

<!-- task-summary -->
> **What:** Architecture Decision Record — choose one primary WhatsApp ingress and document it so 08B and 08H can build without contradictory assumptions
> **Why:** mdeai.co has two WA stacks: Infobip Cloud API (official, per-message fee) and OpenClaw Baileys (QR-paired, free). If both are active as AI responders on the same WA number, users get two contradictory bot replies. This ADR freezes the decision before any Phase 1 or Phase 2 build begins.
> **Tools:** `open-claw` (Baileys channel + dmPolicy) · `mde-hostinger` (verify Baileys session on VPS)
> **Workflow:** **Goal:** One primary WA ingress chosen and documented — no double-bot risk. → **Workflow:** Compare options → decide → write ADR → update 08B/08H → verify no duplicate bot. → **Proof:** Single WA message produces exactly one reply; no Infobip bot active on same number.
> **Success Criteria:**
> - `tasks/openclaw/ingress-architecture.md` exists with Option B chosen, owner sign-off date
> - 08B and 08H reference this ADR (no contradictory Infobip vs Baileys assumptions)
> - Single WA message → exactly one reply (verified on allowlisted test number)
> - `dmPolicy: allowlist` confirmed in OpenClaw config
> **ADVANCED · P1 · Open · Effort: S**

# E8-005: WhatsApp Ingress Architecture Decision

## Overview

Two WhatsApp stacks can receive and reply to messages for mdeai.co:

| Stack | How | Cost | Status |
|-------|-----|------|--------|
| **Infobip Cloud API** | Official Meta Business API, webhooks to Supabase edge | Per-message fee (~$0.05-0.12 per conversation) | Configured for outbound templates |
| **OpenClaw Baileys** | QR-paired companion device, no Meta API | Free (no per-message charge) | Active on Hostinger VPS |

**The risk:** If both are configured as inbound AI responders on the same WA number, every user message triggers two bot replies. This destroys trust and confuses users.

**The decision eliminates this risk by choosing one primary ingress.**

## Decision: Option B — OpenClaw Owns Baileys for Conversational AI

Infobip = outbound template messages only (booking confirmations, promotional campaigns).  
OpenClaw (Baileys) = all conversational AI (inbound queries, apartment search, lead capture).

## Decision Rationale

| Option | Pattern | Verdict |
|--------|---------|---------|
| **A — Infobip primary** | Infobip webhook → Supabase edge → forward to OpenClaw | Rejected: adds latency hop; Baileys already deployed and QR-paired; per-message fees for AI chat |
| **B — OpenClaw owns Baileys** | OpenClaw Baileys for inbound AI; Infobip for outbound templates | **CHOSEN** |
| **C — Infobip-only (no OpenClaw)** | Edge + ai-chat only; defer 05H and 08B | Rejected: abandons existing OpenClaw investment; Infobip AI chat costs too high at scale |

## How the Tools Work Together

```
INBOUND CONVERSATIONAL AI (all goes through OpenClaw):

WA User sends message
    │
    ▼
OpenClaw (Baileys QR session on Hostinger VPS)
    │ mde-rental-concierge skill: domain context
    │ paperclip plugin: audit trail issue
    │ dmPolicy: allowlist (only allowFrom numbers get AI replies)
    │
    ▼
Supabase edge: whatsapp-webhook
    │ intent classification (ai-router)
    │ AI response (ai-chat → Gemini)
    │
    ▼
OpenClaw REST API: POST /api/messages
    │ Idempotency-Key: edge-reply-{correlation_id}
    ▼
WA User receives AI reply

OUTBOUND TEMPLATE MESSAGES (Infobip only):

Supabase edge / Paperclip CEO
    │ event: booking confirmed, showing reminder, campaign
    ▼
Infobip Cloud API: POST /omni/1/messages
    │ WhatsApp template message (pre-approved by Meta)
    │ recipient: host or renter phone
    ▼
WA User receives template message
(No AI involved — template is fixed text with variables)
```

## Workflow 1: Verify Baileys is the Only WA AI Responder

```bash
# Step 1: Check OpenClaw WA channel is active
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242
docker exec openclaw-vmjg-openclaw-1 openclaw channel status whatsapp

# Expected:
# Status: connected
# Phone: +57XXXXXXXXX (mde number)
# dmPolicy: allowlist
# allowFrom: ["14168003103"]

# Step 2: Verify Infobip is NOT configured as AI bot on same number
# Go to Infobip dashboard → Channels → WhatsApp
# Confirm: no inbound webhook that runs AI responses
# Inbound should be: none OR forward to unrelated system (NOT Supabase ai-chat)

# Step 3: Send test WA from allowlisted number → count replies
# Expected: exactly 1 reply (from OpenClaw)
# If 2 replies: disable Infobip inbound webhook immediately
```

## Workflow 2: Confirm dmPolicy is Allowlist

```bash
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242

# Read current config
cat /docker/openclaw-vmjg/data/.openclaw/openclaw.json | jq '.channels.whatsapp.dmPolicy'
# Expected: "allowlist"

# If "open" (dangerous — any number gets AI):
# Edit openclaw.json to set dmPolicy: "allowlist"
# Add allowFrom: ["14168003103"]  ← sk test number
# docker restart openclaw-vmjg-openclaw-1

# Verify change took effect
docker exec openclaw-vmjg-openclaw-1 openclaw channel status whatsapp | grep dmPolicy
```

## Workflow 3: Write the ADR Document

Create `tasks/openclaw/ingress-architecture.md`:

```markdown
# WhatsApp Ingress Architecture Decision Record

**Date:** 2026-05-08
**Decision:** Option B — OpenClaw (Baileys) for conversational AI
**Owner:** sk
**Status:** Active

## Decision
OpenClaw (Baileys QR-paired) is the single primary ingress for all inbound
WhatsApp conversations. Infobip is restricted to outbound template messages only.

## Rationale
- Zero per-message fees for AI chat
- Baileys already deployed and QR-paired on Hostinger VPS
- Single orchestrator eliminates double-bot risk
- Infobip templates still needed for booking confirmations (official channel)

## Security Constraints
- Baileys = unofficial WA client; Meta could block; monitor for API changes
- No official BSP status = cannot send first-message template to new users
- dmPolicy: allowlist = required before any non-test numbers added

## What This Means for 08B and 08H
Both tasks implement Baileys path (OpenClaw), NOT Infobip for conversational AI.
Infobip integration in 08B is outbound-only (for template replies if needed).

## Latency Target
WA message → AI reply: < 5 seconds
Chain: Baileys receive → whatsapp-webhook edge → ai-router → ai-chat → OpenClaw send
If > 5s: optimize ai-chat response (caching, smaller context window)
```

## Workflow 4: Update 08B and 08H

Both tasks must explicitly state this decision in their "Read first" or "Architecture" sections:

Add to `08B-openclaw-whatsapp-adapter.md`:
```
Architecture: Baileys (OpenClaw) for inbound AI — per 08F decision 2026-05-08.
Infobip: outbound templates only. See tasks/openclaw/ingress-architecture.md.
```

Add to `08H-openclaw-wa-adapter-phase1.md`:
```
Ingress: OpenClaw Baileys — per 08F decision. Phase 1 echo uses Baileys only.
```

## User Stories

| As a... | I want to... | So that... |
|---------|-------------|------------|
| Developer (08B/08H) | Have a clear architecture decision before building | I don't build Infobip integration that conflicts with Baileys |
| sk | Know which WA stack handles AI chat | I debug in one place, not two |
| Renter (Colombia) | Send a WA message and get ONE AI reply | I am not confused by two bots |
| OpsManager | Know whether to use `openclaw_gateway` or Infobip SDK for notifications | I use the right path (OpenClaw for AI chat; Infobip for confirmed templates) |

## The Build

1. **Verify Baileys active**: SSH to VPS → `openclaw channel status whatsapp` = connected
2. **Verify dmPolicy: allowlist**: Read openclaw.json → `dmPolicy` must not be `"open"`
3. **Verify Infobip not active as AI bot**: Check Infobip dashboard — no inbound AI webhook on mde number
4. **Double-send test**: Send WA from allowlisted number → exactly 1 reply (no double-bot)
5. **Write ADR**: `tasks/openclaw/ingress-architecture.md` (Workflow 3)
6. **Update 08B**: Add ingress decision reference
7. **Update 08H**: Add ingress decision reference
8. **Sign off**: sk adds date to ADR document

## Acceptance Criteria

- [ ] `tasks/openclaw/ingress-architecture.md` exists with Option B chosen, date, and sk sign-off
- [ ] `dmPolicy: allowlist` confirmed in OpenClaw config (not "open")
- [ ] Infobip confirmed as outbound-template-only (no inbound AI bot on mde WA number)
- [ ] Double-send test: one WA message → exactly one reply
- [ ] 08B references this ADR decision (no contradictory Infobip ingress assumption)
- [ ] 08H references this ADR decision (builds on Baileys path)

## Feature Success

| Layer | Intent |
|-------|--------|
| **Goal** | One WA ingress chosen; no double-bot risk; 08B and 08H can build on clear foundation. |
| **Workflow** | Verify Baileys active → confirm no Infobip bot → write ADR → update dependent tasks. |
| **Proof** | One WA message = one reply; no Infobip conflict on same number. |
| **Gates** | Blocks 08B and 08H from starting without this decision signed off. |
| **Rollout** | ADR review before sharing mde WA number publicly. |

**Next:** [`08H-openclaw-wa-adapter-phase1.md`](08H-openclaw-wa-adapter-phase1.md) (Phase 1 echo, depends on this), [`08B-openclaw-whatsapp-adapter.md`](../openclaw/08B-openclaw-whatsapp-adapter.md) (full adapter)
