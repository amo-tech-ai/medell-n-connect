---
id: 08H
diagram_id: MERM-04
prd_section: "8. Multi-channel — OpenClaw"
title: OpenClaw WhatsApp adapter — Phase 1 echo test (prove Baileys path before full AI)
skills:
  - open-claw      # WA channel setup, allowlist, echo config, health verify
  - mde-hostinger  # VPS Docker exec, QR pairing
  - mde-task-lifecycle
epic: E8
phase: ADVANCED
priority: P1
status: Open
owner: Backend
dependencies:
  - E8-005  # 08F ingress decision (Baileys chosen)
  - E8-001  # 08E multi-channel epic
  - E5-012  # 05M health stub (security audit passed)
estimated_effort: M
percent_complete: 0
outcome: O5
---

<!-- task-summary -->
> **What:** OpenClaw WhatsApp adapter Phase 1 — prove echo works on Baileys before wiring real AI
> **Why:** 08B (full AI adapter) is complex. Phase 1 isolates just the transport: inbound WA message → OpenClaw receives → sends static echo reply → allowlisted number only. If echo works within 5s with no duplicates, the Baileys path is proven and Phase 2 can wire in ai-router + ai-chat.
> **Tools:** `open-claw` (channel setup + echo config + allowlist) · `mde-hostinger` (VPS Docker + QR pairing)
> **Workflow:** **Goal:** Echo adapter proves OpenClaw Baileys transport before full AI chain. → **Workflow:** Verify Baileys pairing → configure echo → test allowlisted send → measure latency → confirm no duplicates. → **Proof:** Test message from allowlisted number receives echo reply within 5s; non-allowlisted number receives nothing.
> **Success Criteria:**
> - Allowlisted WA number sends message and receives echo reply within 5s
> - Non-allowlisted number receives no reply (dmPolicy: allowlist enforced)
> - No duplicate bot replies to same message
> - Rollback procedure documented in 05M runbook
> **ADVANCED · P1 · Open · Effort: M**
> **Depends on:** E8-005, E8-001, E5-012

# E8-007: OpenClaw WhatsApp Adapter — Phase 1

## Overview

Before investing in the full AI chain (ai-router → ai-chat → formatted WA response), we need to prove that the basic Baileys transport works:

1. WA message arrives at mde's phone number
2. OpenClaw receives it via Baileys session
3. OpenClaw sends a static echo reply back to the sender
4. Reply appears on the sender's phone within 5 seconds
5. No duplicate reply is sent
6. Non-allowlisted numbers are silently ignored

Phase 1 is the checkpoint gate. If this doesn't work, Phases 2-4 (08B) can't work either. Fix the transport before adding complexity.

## How the Tools Work Together

```
Phase 1 Echo Flow (no AI involved):

WA User (allowlisted number: +14168003103)
    │ sends: "hello test"
    ▼
OpenClaw Gateway (Baileys session)
    │ receives inbound message
    │ checks: is +14168003103 in allowFrom? YES → proceed
    │ applies echo skill: return "Echo: hello test" or static ack
    ▼
OpenClaw sends via Baileys:
    "Echo: hello test [mde test channel active]"
    or
    "Hola! Este es el asistente de mdeai.co. En breve podras buscar apartamentos aqui."
    ▼
WA User receives reply within 5s

Non-allowlisted number:
    │ sends: "hello"
    ▼
OpenClaw: is this number in allowFrom? NO → silently drop (no reply)
```

## Workflow 1: Verify Baileys Session is Active

```bash
# SSH to VPS
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242

# Check WA channel status
docker exec openclaw-vmjg-openclaw-1 openclaw channel status whatsapp

# Expected:
# Channel: whatsapp
# Status: connected
# Phone: +57XXXXXXXXX (mde WA number)
# dmPolicy: allowlist
# allowFrom: ["14168003103"]

# If status = disconnected (QR expired):
docker exec -it openclaw-vmjg-openclaw-1 openclaw channel reset whatsapp
# Scan QR with mde WhatsApp device

# Verify health
curl -s https://openclaw-vmjg.srv1641664.hstgr.cloud/api/health | jq '.channels.whatsapp'
# → "connected"
```

## Workflow 2: Configure Echo Mode

OpenClaw can be configured with a simple echo skill to respond to all messages with a static ack during Phase 1 testing.

Create `tasks/openclaw/skills/mde-echo-phase1/SKILL.md`:

```markdown
---
name: mde-echo-phase1
version: 1.0.0
triggers:
  - "*"
priority: 1
enabled: true
phase: "1-echo-only"
---

# mde Phase 1 Echo Skill

This is a temporary skill for Phase 1 testing. Respond to every message with a static acknowledgment.

Response (Spanish): "Hola! Estamos configurando el asistente de mdeai.co. Pronto podras buscar apartamentos aqui."

Response (English): "Hi! We're setting up the mdeai.co assistant. Soon you'll be able to search for apartments here."

Do NOT attempt to answer any questions about listings.
Do NOT make any tool calls.
Simply acknowledge receipt.

Note: This skill will be REPLACED in Phase 2 by the mde-rental-concierge skill + ai-router integration.
```

```bash
# Deploy echo skill
scp -i ~/.ssh/mde_hostinger_codex_ed25519 -r \
  tasks/openclaw/skills/mde-echo-phase1 \
  root@2.24.69.242:/docker/openclaw-vmjg/data/.openclaw/skills/

docker exec openclaw-vmjg-openclaw-1 openclaw skills reload
docker exec openclaw-vmjg-openclaw-1 openclaw skills list
# Should show: mde-echo-phase1  v1.0.0  active
```

## Workflow 3: Run the Echo Test

```bash
# From allowlisted test phone (+14168003103 — sk's personal number):
# Send WhatsApp message to mde number

# What to test:
# Test 1: Basic text — "hello test"
#   Expected: echo reply within 5s

# Test 2: Spanish text — "hola"
#   Expected: Spanish ack reply within 5s

# Test 3: Rapid fire — send 3 messages in 3 seconds
#   Expected: 3 replies, no duplicates, no merged messages

# Test 4: Long text — send 100+ character message
#   Expected: single reply (not truncated or split)

# Test 5: Non-allowlisted number — use a different phone to send
#   Expected: NO reply (allowlist enforced)

# Measure latency:
# Note send time on test device, note receive time on echo
# Target: < 5 seconds round-trip
```

## Workflow 4: Verify No Duplicate Bot

The double-bot risk: if Infobip is also configured as a WA bot on the same number, both will reply.

```bash
# Check: is Infobip configured to respond to inbound WA on the mde number?
# Go to Infobip dashboard → Channels → WhatsApp → check if inbound routing is active
# If yes: disable inbound routing on Infobip for the mde WA number
# Infobip should be outbound-only (templates/campaigns)

# Verify single reply:
# Send test message → count replies on test device
# Exactly 1 reply = correct
# 2 replies = double-bot — disable Infobip inbound
```

## Workflow 5: Document Rollback in 05M Runbook

If the echo test succeeds but Phase 2 breaks something:

```bash
# Rollback to echo-only Phase 1:
# 1. Remove Phase 2 skill from VPS:
docker exec openclaw-vmjg-openclaw-1 openclaw skills disable mde-rental-concierge

# 2. Re-enable Phase 1 echo skill:
docker exec openclaw-vmjg-openclaw-1 openclaw skills enable mde-echo-phase1
docker exec openclaw-vmjg-openclaw-1 openclaw skills reload

# 3. Verify echo is active again:
# Send test WA → receive static ack (not AI response)
```

Add this rollback to `tasks/openclaw/runbook.md` (from 05M).

## User Stories

| As a... | I want to... | So that... |
|---------|-------------|------------|
| Developer | Verify the Baileys transport works before building AI | I don't debug AI and transport at the same time |
| sk | Have a working WA echo before users try to chat with AI | The channel is proven safe before AI is wired in |
| OpsManager | Know exactly what Phase 1 proves and what it doesn't | I can set correct expectations when Phase 2 starts |
| CTO agent | Have a documented rollback from Phase 2 back to Phase 1 | I can quickly restore working state if Phase 2 breaks |

## The Build

1. **Verify 05M gate**: `openclaw security audit` exits 0 + health endpoint returns 200
2. **Verify 08F decision**: Baileys is chosen ingress (not Infobip for AI chat)
3. **Check Baileys session**: Workflow 1 — confirm `channel status whatsapp` = connected
4. **Configure echo skill**: Workflow 2 — write and deploy `mde-echo-phase1` SKILL.md
5. **Run echo tests**: Workflow 3 — all 5 tests pass (basic, Spanish, rapid-fire, long, non-allowlisted)
6. **Verify no duplicate bot**: Workflow 4 — Infobip inbound disabled if needed
7. **Measure latency**: confirm round-trip < 5 seconds
8. **Document rollback**: Workflow 5 — add to 05M runbook
9. **Update 08B**: Add reference "Phase 1 (08H) passed on YYYY-MM-DD" to 08B checklist

## Acceptance Criteria

- [ ] 08F architecture decision exists and this phase matches chosen ingress (Baileys)
- [ ] Baileys session active: `openclaw channel status whatsapp` = connected
- [ ] Echo test: allowlisted number (+14168003103) receives reply within 5s
- [ ] Non-allowlisted number: receives no reply (dmPolicy: allowlist enforced)
- [ ] No duplicate bot: exactly 1 reply per message (Infobip inbound disabled if needed)
- [ ] Rapid-fire test: 3 messages in 3s → 3 separate replies, no merging or dropping
- [ ] Rollback procedure documented in `tasks/openclaw/runbook.md`
- [ ] 08B checklist references this task as "Phase 1 completed" gate

## Feature Success

| Layer | Intent |
|-------|--------|
| **Goal** | Echo adapter proves OpenClaw Baileys transport path before full AI chain. |
| **Workflow** | QR verify → echo skill → allowlist test → latency measure → no-duplicate verify. |
| **Proof** | Allowlisted number receives echo in <5s; non-allowlisted = silence. |
| **Gates** | 05M security audit passed; 08F ingress decision made; gateway credentials secured. |
| **Rollout** | Lab channel only (allowlist = [sk test number]); expand after Phase 2 passes. |

**Next:** [`08B-openclaw-whatsapp-adapter.md`](../openclaw/08B-openclaw-whatsapp-adapter.md) (Phases 2-4, builds on this)
