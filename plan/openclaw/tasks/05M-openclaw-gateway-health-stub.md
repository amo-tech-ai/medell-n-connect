---
id: 05M
diagram_id: MERM-07
prd_section: "5. AI agent architecture — Adapter layer"
title: OpenClaw Gateway — health check, idempotency stub & security audit gate
skills:
  - open-claw      # health endpoint + security audit commands + channel status
  - mde-paperclip  # create issue on gateway unhealthy; set up health monitor routine
  - mde-hostinger  # VPS Docker exec commands
  - mde-task-lifecycle
epic: E5
phase: MVP
priority: P1
status: Open
owner: Backend
dependencies:
  - E5-001
  - E5-002
estimated_effort: S
percent_complete: 0
outcome: O8
---

<!-- task-summary -->
> **What:** OpenClaw Gateway — verify health endpoint, test idempotency, run security audit gate
> **Why:** Without a verified health endpoint and security audit, any production traffic through OpenClaw risks duplicate WhatsApp messages (no idempotency) and RCE exposure (CVE-2026-25253 in plugins < v1.1.4). This stub must pass before 05H (adapter) ships to production.
> **Tools:** `open-claw` (health + audit commands) · `mde-paperclip` (alert on gateway down) · `mde-hostinger` (VPS Docker exec)
> **Workflow:** **Goal:** Gateway health stub enables safe 05H rollout and monitoring. → **Workflow:** Health probe → idempotency test → security audit → alert setup. → **Proof:** `/api/health` returns 200; `openclaw security audit` exits 0; same Idempotency-Key sent twice = one WA message.
> **Success Criteria:**
> - `GET /api/health` returns HTTP 200 with `{"status":"ok"}`
> - `openclaw security audit` exits 0 with zero critical findings
> - Idempotency test: same key sent twice = one delivery, not two
> - Paperclip routine alerts within 5 min when gateway health fails
> **MVP · P1 · Open · Effort: S**
> **Depends on:** E5-001, E5-002

# E5-012: OpenClaw Gateway Health Stub

## Overview

Before any production traffic routes through OpenClaw, three things must be confirmed:

1. **Health** — the gateway responds to a probe so monitors can detect outages before users experience silence
2. **Idempotency** — every message send carries a unique key so Paperclip agent retries don't double-send WhatsApp messages
3. **Security audit** — `openclaw security audit` passes (guards against CVE-2026-25253 plugin RCE)

This task delivers the verification steps, the runbook, and the Paperclip monitoring routine. It is a required gate before 05H (openclaw_gateway adapter) and 08H (WhatsApp echo adapter) ship to production.

## How the Tools Work Together

```
Paperclip Routine (every 5 min)
  │ GET https://openclaw-vmjg.srv1641664.hstgr.cloud/api/health
  │
  ├── 200 OK {"status":"ok","channels":{"whatsapp":"connected"}}
  │     → nothing to do
  │
  └── 5xx / timeout / "whatsapp":"disconnected"
        ▼
      Paperclip API: create issue
        title: "OpenClaw Gateway Alert: [status]"
        priority: high
        assignee: CEO agent → CTO escalation
        ▼
      sk / CTO receives notification → SSH to VPS → reconnect

Release Gate (any openclaw-touching PR):
  docker exec openclaw-vmjg-openclaw-1 openclaw security audit
  exit 0 → green → allow merge
  exit 1 → block → fix finding first
```

## Workflow 1: Verify Health Endpoint

```bash
# Check health from local machine
curl -s \
  https://openclaw-vmjg.srv1641664.hstgr.cloud/api/health \
  | jq '.'

# Expected response:
# {
#   "status": "ok",
#   "version": "1.x.x",
#   "channels": {
#     "whatsapp": "connected"
#   },
#   "uptime": 12345
# }

# Check from inside VPS container
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242
docker exec openclaw-vmjg-openclaw-1 openclaw status
docker exec openclaw-vmjg-openclaw-1 openclaw channel status whatsapp
```

**Response interpretation:**
| Response | Action |
|----------|--------|
| `"status":"ok"` + `"whatsapp":"connected"` | All good — no action |
| `"whatsapp":"disconnected"` | Run Workflow 4 (QR reconnect) |
| Connection refused | Container down — run Workflow 5 (restart) |
| 401/403 | Token mismatch — check `OPENCLAW_GATEWAY_TOKEN` in Infisical |

## Workflow 2: Run Security Audit Gate

```bash
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242

# Run security audit (must exit 0 before any prod traffic)
docker exec openclaw-vmjg-openclaw-1 openclaw security audit

# Expected clean output:
# OK  No ClawHub plugins with unverified hashes
# OK  dmPolicy: allowlist enforced
# OK  No plaintext secrets in openclaw.json
# OK  Hooks token distinct from gateway token
# OK  TLS active on gateway domain
# Exit code: 0

# If findings:
# CRITICAL: plugin 'x' loaded from ClawHub without hash pin
# WARNING:  dmPolicy set to 'open' — any number can message AI
# Exit code: 1 — do NOT ship 05H or 08H until fixed
```

**Add to PR template for any openclaw-touching change:**
```
## OpenClaw Release Checklist
- [ ] `openclaw security audit` exit code 0 (paste output here)
- [ ] `dmPolicy` still set to `allowlist` (check openclaw.json diff)
- [ ] No new ClawHub plugin installs without security review (see 19C)
```

## Workflow 3: Verify Idempotency

```bash
# Every message send must carry Idempotency-Key to prevent double-sends
OPENCLAW_TOKEN=$(infisical secrets get OPENCLAW_GATEWAY_TOKEN --path /openclaw --projectId 82d12c1d --plain)
KEY="idempotency-test-$(uuidgen)"

# Send once
curl -s -X POST \
  -H "Authorization: Bearer $OPENCLAW_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -d '{"channel":"whatsapp","to":"+14168003103","text":"Idempotency test 1"}' \
  https://openclaw-vmjg.srv1641664.hstgr.cloud/api/messages

# Send again with same key — must NOT produce second WA message
curl -s -X POST \
  -H "Authorization: Bearer $OPENCLAW_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -d '{"channel":"whatsapp","to":"+14168003103","text":"This must NOT be delivered"}' \
  https://openclaw-vmjg.srv1641664.hstgr.cloud/api/messages

# Expected: same messageId returned; only one WA message received on test device
```

**Idempotency-Key format rules:**
- Pattern: `{source}-{action}-{record_id}` → e.g. `paperclip-g7-{lead_uuid}`
- Same key = OpenClaw deduplicates (no second send)
- Always unique per action — never reuse across different messages

## Workflow 4: Reconnect WhatsApp Session (QR Expired)

When health shows `"whatsapp":"disconnected"`:

```bash
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242

# Reset and get new QR
docker exec -it openclaw-vmjg-openclaw-1 openclaw channel reset whatsapp
# → QR displayed in terminal — scan with mde WhatsApp device

# Verify reconnection
curl -s https://openclaw-vmjg.srv1641664.hstgr.cloud/api/health | jq '.channels.whatsapp'
# → "connected"
```

## Workflow 5: Restart Gateway Container

When gateway is completely unresponsive:

```bash
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242

# Check container status
docker ps | grep openclaw

# Restart
docker restart openclaw-vmjg-openclaw-1

# Wait for startup then verify
sleep 10
curl -s https://openclaw-vmjg.srv1641664.hstgr.cloud/api/health | jq '.status'
# → "ok"
```

## Workflow 6: Set Up Paperclip Health Monitor

```bash
# Create a Paperclip routine to poll health every 5 min
curl -s -X POST \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Paperclip-Run-Id: setup-openclaw-health-monitor-001" \
  -d '{
    "name": "openclaw-health-monitor",
    "schedule": "*/5 * * * *",
    "agentId": "03378f28-71ad-499e-8125-af6980f6d76b",
    "task": "Check https://openclaw-vmjg.srv1641664.hstgr.cloud/api/health. If status != ok or channels.whatsapp != connected, create a high-priority Paperclip issue titled: OpenClaw Alert: [status detail]. Assign to board.",
    "concurrencyPolicy": "skip_if_active",
    "catchUpPolicy": "skip_missed"
  }' \
  https://paperclip-dy8r.srv1641664.hstgr.cloud/api/companies/55141faa-8b30-4731-bfd0-c344eb448713/routines

# Verify routine created
curl -s \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  https://paperclip-dy8r.srv1641664.hstgr.cloud/api/companies/55141faa-8b30-4731-bfd0-c344eb448713/routines \
  | jq '.[] | select(.name == "openclaw-health-monitor")'
```

## User Stories

| As a... | I want to... | So that... |
|---------|-------------|------------|
| sk | Know within 5 min when OpenClaw WA session drops | Users do not get silence instead of AI replies |
| CTO agent | Have a documented reconnect runbook | I can restore WA service without asking sk |
| Paperclip CEO | Send messages without risk of duplicates | G7 nudges do not annoy renters with double pings |
| Developer | Have `openclaw security audit` as a release gate | No plugin vulnerability ships to production |

## The Build

1. **Verify health endpoint**: `curl -s .../api/health` → document schema in runbook
2. **Run security audit**: SSH to VPS → `docker exec ... openclaw security audit` → fix any critical findings
3. **Write runbook**: `tasks/openclaw/runbook.md` covering health check, QR reconnect, restart
4. **Idempotency test**: Send same message with same key twice → confirm single WA delivery
5. **Set up Paperclip monitor**: POST health-check routine (Workflow 6) → confirm issue created on simulated failure
6. **Add release checklist**: Update PR template with security audit requirement
7. **Document in progress tracker**: `tasks/notes/progress-tracker.md` — "OpenClaw health stub verified YYYY-MM-DD"

## Acceptance Criteria

- [ ] `GET /api/health` returns HTTP 200 with `{"status":"ok"}` (or document actual endpoint path if different)
- [ ] `openclaw security audit` exits 0 — zero critical findings documented with paste of output
- [ ] `tasks/openclaw/runbook.md` exists covering: health probe, QR reconnect, container restart
- [ ] Idempotency test: same `Idempotency-Key` sent twice → only one WA message delivered (confirmed on device)
- [ ] Paperclip health-monitor routine active — creates issue within 5 min of simulated gateway outage
- [ ] PR template updated with `openclaw security audit` gate
- [ ] `tasks/openclaw/links.md` updated with official Gateway + health endpoint docs

## Feature Success

| Layer | Intent |
|-------|--------|
| **Goal** | Gateway health stub enables safe 05H rollout and continuous monitoring. |
| **Workflow** | Health probe → idempotency test → security audit → Paperclip alert routine. |
| **Proof** | `/api/health` returns 200; `openclaw security audit` exits 0; one key = one WA message. |
| **Gates** | Secrets not in response body; no ClawHub installs without hash pin. |
| **Rollout** | Complete before increasing OpenClaw traffic; required blocker for 05H and 08H merge. |

**Next:** [`05H-openclaw-gateway-adapter.md`](05H-openclaw-gateway-adapter.md) (depends on this), [`08H-openclaw-wa-adapter-phase1.md`](../whatsapp/08H-openclaw-wa-adapter-phase1.md)
