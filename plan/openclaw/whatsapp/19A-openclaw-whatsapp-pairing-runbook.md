---
task_id: 19A
title: OpenClaw WhatsApp Pairing Runbook — +14168003103
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 1 day
area: ai-agents
skill: [open-claw, mde-whatsapp,\1mde-hostinger\2
subagents: [mdeai-executor]
schema_tables: []
depends_on: [15A]
figma_prompt: null
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** OpenClaw WhatsApp Pairing Runbook — step-by-step QR pair, session recovery, and monitoring for +14168003103
> **Why:** Pairing the WhatsApp number +14168003103 is a hard prerequisite for the WhatsApp concierge launch. The channel is configured in openclaw.json but no session recovery procedure exists. Session expiry = unknown-length outage because nobody has documented how to re-pair without losing the inbox. This runbook bounds MTTR to <15 min.
> **Tools:** `open-claw` (Baileys QR pair + channel status) · `mde-hostinger` (VPS SSH + Docker exec)
> **Workflow:** **Goal:** Anyone with SSH access pairs +14168003103 in <30 min following the runbook. → **Workflow:** Pre-flight → snapshot session → open pair URL → scan QR → verify → UptimeRobot monitor. → **Proof:** Fresh container paired in staging in <30 min; recovery from session loss in <15 min.
> **Success Criteria:**
> - Runbook lives at `/docker/openclaw-vmjg/runbooks/whatsapp-pairing.md`
> - Pre-flight checklist: VPS reachable, container healthy, `dmPolicy: "pairing"` set
> - QR scan procedure documented with exact commands and expected output
> - Recovery from session loss in <15 min without inbox wipe
> **CRITICAL · P0 · Not Started · Effort: 1 day**
> **Depends on:** 15A

| Aspect | Details |
|--------|---------|
| **System** | OpenClaw gateway WhatsApp adapter; phone `+14168003103`; session stored in `/docker/openclaw-vmjg/data/sessions/whatsapp/` |
| **Features** | Step-by-step pairing, token storage, recovery from session loss, monitoring, rollback |
| **Edge Functions** | None (operational runbook) |
| **Tables** | None |
| **Agents** | OpenClaw gateway; concierge agent (post-pair) |
| **Real-World** | "OpenClaw's WhatsApp session expires Sunday; el runbook lo trae de vuelta en 15 minutos sin perder el inbox." |

## Description

**The situation:** Per [14-openclaw §3 actions #2](../../trio/14-openclaw-production-plan.md), pairing the WhatsApp number `+14168003103` is a hard prerequisite for the WhatsApp concierge launch on June 30, 2026. Today, the channel is configured in `openclaw.json` but no session exists. WhatsApp pairing (whether via Baileys QR or Cloud API) is finicky, sessions expire, and nobody on the team has documented how to re-pair without losing inbox state.

**Why it matters:** WhatsApp is the highest-revenue channel in the trio (per [14-openclaw §19 Phase 1](../../trio/14-openclaw-production-plan.md), the concierge is "the highest immediate revenue action"). A 15-minute outage is fine; a 4-hour outage because someone is googling "openclaw qr pair" while the session is dead is not. This runbook is the difference between "session expired Sunday → live Sunday" and "session expired Sunday → debug Monday".

**What already exists:** OpenClaw gateway running on `:40051`; `openclaw.json` with WhatsApp adapter config; `dmPolicy: "pairing"` per [14-openclaw §13](../../trio/14-openclaw-production-plan.md); `hostinger-tools` skill for Docker ops; SSH access to VPS `2.24.69.242`.

**The build:**
1. Numbered runbook: pre-flight, pair, verify, store token, monitor, rollback
2. Screenshot placeholders for each step (gateway URL, QR display, success state)
3. Recovery procedure for session loss (re-pair without inbox wipe)
4. Health-check command + UptimeRobot monitor URL
5. Document rollback path (revert to `dmPolicy: "off"` if pairing destabilizes other adapters)

**Example:** Sunday 14:00 COT — concierge stops responding; OpenClaw logs show `whatsapp: session_expired`. sk SSHs in, follows runbook → 15 minutes later concierge is live again, no inbox lost.

## Rationale
**Problem:** WhatsApp pairing is undocumented; session expiry is an unknown-time outage.
**Solution:** Authoritative numbered runbook with monitoring, recovery, and rollback steps.
**Impact:** Pairing time bounded to <30 min; expiry MTTR bounded to <15 min.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| sk (solo founder) | follow numbered steps when WhatsApp dies on Sunday night | I get the concierge live again without context-switching |
| Sofía (board operator) | confirm the concierge is paired before approving outreach | I don't approve messages that won't send |
| OpenClaw gateway | persist the session token across container restarts | a deploy doesn't kill the inbox |
| Andrés B. (sponsor) | trust the WhatsApp channel is always live | my campaign actually delivers |

## Goals

1. **Primary:** Anyone with SSH access can pair `+14168003103` in <30 minutes by following the runbook.
2. **Quality:** Recovery from session loss in <15 minutes without inbox wipe.

## Acceptance Criteria

- [ ] Runbook lives at `/docker/openclaw-vmjg/runbooks/whatsapp-pairing.md` and in this prompt
- [ ] Pre-flight checklist: VPS reachable, container healthy, `dmPolicy: "pairing"` set
- [ ] Step-by-step pairing with QR (Baileys) — exact commands and expected output
- [ ] Token storage location documented: `/docker/openclaw-vmjg/data/sessions/whatsapp/creds.json`
- [ ] Backup command: snapshot session dir before any reattempt
- [ ] Health-check: `curl -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" http://127.0.0.1:40051/channels/whatsapp/status` returns `{ paired: true }`
- [ ] UptimeRobot monitor URL configured, alerts to ai@socialmediaville.ca on status change
- [ ] Recovery procedure: re-pair without losing existing conversations
- [ ] Rollback: revert to `dmPolicy: "off"` if pairing crashes other adapters
- [ ] Test run: pair a fresh container in staging; verify inbox sees a test message in <5 min
- [ ] Screenshot placeholders for: pre-flight, QR scan, paired state, monitor

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Runbook | `/docker/openclaw-vmjg/runbooks/whatsapp-pairing.md` | Create |
| Config | `/docker/openclaw-vmjg/openclaw.json` | Verify `dmPolicy: "pairing"` |
| Backup | `/docker/openclaw-vmjg/scripts/snapshot-wa-session.sh` | Create |
| Health-check | `/docker/openclaw-vmjg/scripts/wa-status.sh` | Create |
| Monitor | UptimeRobot dashboard | Add HTTP keyword check |
| Skill | `.claude/skills/mde-whatsapp/` | Reference from runbook |

## Runbook (numbered)

### 0. Pre-flight

```bash
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242
docker ps --filter name=openclaw-vmjg
# expect: status=healthy
```

Confirm `openclaw.json` has:
```json
"channels": { "whatsapp": { "phone": "+14168003103", "dmPolicy": "pairing" } }
```

[Screenshot: pre-flight container ps output]

### 1. Snapshot existing session

```bash
bash /docker/openclaw-vmjg/scripts/snapshot-wa-session.sh
# writes: /docker/openclaw-vmjg/backups/wa-session-<ts>.tar.gz
```

### 2. Open pairing URL

Browser → `https://openclaw-vmjg.srv1641664.hstgr.cloud/channels/whatsapp/pair`

Provide gateway token in `Authorization: Bearer <OPENCLAW_GATEWAY_TOKEN>` header.

[Screenshot: QR rendering]

### 3. Scan QR with WhatsApp app

In WhatsApp on a paired device: Settings → Linked Devices → Link a Device → scan QR.

[Screenshot: paired notification]

### 4. Verify pair

```bash
curl -s -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" \
  http://127.0.0.1:40051/channels/whatsapp/status | jq
# expect: { "paired": true, "phone": "+14168003103", "since": "..." }
```

### 5. Send test message

From a teammate's phone → message `+14168003103` → "test ping". Concierge agent should auto-reply within 60s.

### 6. Configure UptimeRobot monitor

URL: `https://openclaw-vmjg.srv1641664.hstgr.cloud/channels/whatsapp/status` keyword `paired:true`. Alerts → email ai@socialmediaville.ca + Paperclip approval card.

### Recovery (session expired)

1. Run `wa-status.sh` → confirms `paired: false`
2. Snapshot existing session (do not delete)
3. Repeat steps 2–5 above
4. If concierge still silent after pair → restart container: `docker restart openclaw-vmjg_openclaw_1`

### Rollback

If pairing destabilizes the gateway:
```bash
# Set dmPolicy: "off" in openclaw.json
# docker restart openclaw-vmjg_openclaw_1
# Restore session from /docker/openclaw-vmjg/backups/wa-session-<ts>.tar.gz
```

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| WhatsApp main account logged out (linked-devices revoked) | Re-pair; existing session is lost; document inbox-loss expectation |
| QR scan times out (90s) | Refresh page; QRs rotate every 60s — must scan within window |
| Container restart mid-pair | Session may be partially written; restore from snapshot before retry |
| Gateway token rotated between pre-flight and verify | Use new token from Infisical; re-export `OPENCLAW_GATEWAY_TOKEN` |
| Phone `+14168003103` ToS-flagged for spam | Pause outreach; only run inbound concierge; review per [14-openclaw §18](../../trio/14-openclaw-production-plan.md) |

## Real-World Examples

**Scenario 1 — Sunday-night session loss:** Sunday 14:00 COT — concierge stops responding to a Patricia rental inquiry. UptimeRobot alerts sk. **With this implementation,** sk follows the runbook from his phone via SSH: snapshot, re-pair via QR, verify, test ping. Concierge live again at 14:13. The original Patricia inquiry replies at 14:14 — 14 minutes late, not lost.

**Scenario 2 — Cold-start on staging:** sk wants to test a concierge change in a staging container before promoting. **With this implementation,** the runbook works on a fresh container — pre-flight, pair, verify — without needing to dig into Baileys docs. The change merges to prod 30 minutes later.

## Outcomes

| Before | After |
|--------|-------|
| Pairing tribal knowledge in sk's head only | Numbered runbook anyone with SSH can follow |
| Session expiry MTTR unbounded | <15 min recovery procedure |
| No monitoring on pair status | UptimeRobot keyword check + email + Paperclip card |
| Rollback path undefined | Documented `dmPolicy: "off"` fallback + session restore |
| Inbox wiped on every re-pair | Snapshot-first procedure preserves history |
