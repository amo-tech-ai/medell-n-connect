---
id: 08K
diagram_id: MERM-04
prd_section: "8. Multi-channel — AI providers"
title: OpenClaw AI provider strategy — transport-only (Gemini via Supabase edges, not OpenClaw provider)
skills:
  - open-claw  # verify provider config is empty / minimal
  - gemini     # all LLM calls go through Supabase Gemini edges
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
> **What:** Decide and document the AI provider strategy for WhatsApp: transport-only (OpenClaw = channels only; all LLM calls via Supabase Gemini edges)
> **Why:** OpenClaw ships with its own provider config — if both OpenClaw and Supabase edges call an LLM, users get two contradictory AI replies to the same message (split brain). The chosen pattern must be documented and enforced so 08B is built correctly.
> **Tools:** `open-claw` (verify provider config stays empty) · `gemini` (all WA AI goes through Supabase Gemini edges)
> **Workflow:** **Goal:** Provider routing strategy decided — no two models answering same user turn. → **Workflow:** Document transport-only decision → clear OpenClaw provider config → update 08B. → **Proof:** One WA message = one AI reply from Supabase edge; OpenClaw provider config is empty.
> **Success Criteria:**
> - `tasks/openclaw/provider-strategy.md` documents transport-only decision with owner sign-off
> - OpenClaw `openclaw.json` has no active LLM provider config (or is explicitly empty)
> - 08B adapter built on transport-only pattern (no OpenClaw-native LLM calls)
> - Single WA message produces exactly one AI reply
> **ADVANCED · P1 · Open · Effort: S**

# E8-010: AI Provider Strategy Decision

## Overview

mdeai.co has two places where AI could be invoked for WhatsApp:
1. **Supabase edge functions** (ai-router, ai-chat) using Gemini 1.5 Flash — the existing, tested AI pipeline
2. **OpenClaw's own provider config** — a separate LLM connection that OpenClaw can use natively

If both are active on the same WA channel, a single user message triggers two separate AI models. The user gets two replies, or worse, one is swallowed and they get inconsistent answers across sessions.

**Decision: Transport-Only Pattern**

OpenClaw handles WhatsApp transport (Baileys session, message delivery, conversation session state) and nothing more. All intelligence comes from Supabase edges.

## The Decision Document

Create `tasks/openclaw/provider-strategy.md`:

```markdown
# OpenClaw AI Provider Strategy — Decision Record

**Date:** 2026-05-08  
**Decision:** Transport-Only  
**Owner:** sk  
**Status:** Active — governs 08B implementation

## Chosen Pattern: Transport-Only

OpenClaw = WhatsApp transport + conversation session.  
All LLM calls = Supabase edge functions (ai-router, ai-chat) using Gemini 1.5 Flash.  
OpenClaw provider config = empty (no active LLM connection in openclaw.json).

## How It Works

1. WA message arrives at OpenClaw (Baileys)
2. OpenClaw applies mde-rental-concierge skill (domain context, not LLM call)
3. OpenClaw (via paperclip plugin or HTTP tool) POSTs to Supabase whatsapp-webhook edge
4. Edge calls ai-router → ai-chat (Gemini via Google AI)
5. Edge replies back to OpenClaw REST API: POST /api/messages
6. OpenClaw sends reply via Baileys

OpenClaw never calls an LLM directly for user-facing responses.

## Why Not Hybrid?

Hybrid pattern (OpenClaw handles small talk, edges handle listings) requires:
- Explicit handoff rules to prevent overlap
- Two prompt formats
- Two cost tracking systems
- Risk: edge cases where both fire on same message

Transport-only is simpler, cheaper to debug, and consistent.

## Failover

If Supabase edges are down:
- OpenClaw sends: "Nuestro servicio esta experimentando problemas. Intentalo en unos minutos."
- Do NOT fall back to OpenClaw's own LLM (creates inconsistency)

## Cost Model

All AI costs accounted for in Supabase/Google billing.
OpenClaw = zero LLM cost (no provider license needed).

## Tools Profile

Per the transport-only pattern, OpenClaw tools are limited to:
- HTTP client (to call Supabase edges)
- WhatsApp message formatter
- Session state manager
- paperclip plugin (for issue creation and approval delegation)

Tools to disable or not configure in OpenClaw:
- Any native code execution tools (exec, shell)
- Direct database tools (OpenClaw should not have DB credentials)
- Direct LLM provider API tools (Anthropic, OpenAI, Google — all handled by edges)
```

## Workflow 1: Verify OpenClaw Provider Config is Empty

```bash
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242

# Check current provider config in openclaw.json
cat /docker/openclaw-vmjg/data/.openclaw/openclaw.json | jq '.providers'

# Expected (transport-only — providers empty or not set):
# null
# or
# {}

# If you see any provider configured (openai, anthropic, google):
# That is the split-brain risk — remove it
# Edit openclaw.json and remove the 'providers' section
# Then: docker restart openclaw-vmjg-openclaw-1
```

## Workflow 2: Verify Single Reply Per WA Message

```bash
# Send one test WA message from allowlisted number
# "Busco apartamento en Laureles"

# Count replies received on test device (must be exactly 1)
# If you receive 2 replies:
#   → OpenClaw provider is active AND edge function is replying
#   → Check openclaw.json for any active provider config
#   → Remove the provider config and restart

# Check ai_runs for duplicate entries for same message
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "https://zkwcbyxiwklihegjhuql.supabase.co/rest/v1/ai_runs?agent_name=eq.whatsapp-ai&order=created_at.desc&limit=5" \
  | jq '.[].created_at'

# If you see two ai_runs records within 1 second of each other for same phone:
# → Duplicate replies — remove OpenClaw provider config
```

## Workflow 3: Update 08B to Reflect Transport-Only

In 08B (`08B-openclaw-whatsapp-adapter.md`), the build section must explicitly reference this decision:

```
Building on transport-only pattern (08K):
- OpenClaw = Baileys transport + session state ONLY
- All LLM calls: Supabase edges (ai-router, ai-chat)
- OpenClaw provider config: intentionally empty (see tasks/openclaw/provider-strategy.md)
- If edge is unreachable: send static fallback message, do NOT use OpenClaw LLM
```

## Workflow 4: Configure OpenClaw Tools Profile (Minimal)

Minimal tool profile prevents OpenClaw from gaining unexpected capabilities:

```json
// openclaw.json tools section
{
  "tools": {
    "enabled": ["http_client", "session_state", "message_format"],
    "disabled": ["exec", "shell", "database", "file_write", "code_eval"],
    "http_client": {
      "allowedDomains": [
        "zkwcbyxiwklihegjhuql.supabase.co",
        "paperclip-dy8r.srv1641664.hstgr.cloud"
      ]
    }
  }
}
```

This restricts HTTP calls from OpenClaw to only Supabase and Paperclip — preventing SSRF or unexpected outbound calls.

## User Stories

| As a... | I want to... | So that... |
|---------|-------------|------------|
| sk | Have one AI responding to each WA message | Users do not get two contradictory answers |
| Developer | Know definitively which system handles WA AI | I build 08B without guessing or re-investigating |
| CTO agent | Have all AI costs in one billing dashboard | I do not need to track both Supabase and OpenClaw AI spend |
| Security team | Have OpenClaw's tools restricted to minimum needed | There are fewer SSRF and exec attack surfaces |

## The Build

1. **Check openclaw.json**: SSH to VPS → `cat openclaw.json | jq '.providers'` → must be null/empty
2. **If provider found**: remove it, restart container, verify with single WA message test
3. **Single reply test**: Workflow 2 — confirm exactly one WA reply per message
4. **Write decision doc**: `tasks/openclaw/provider-strategy.md` (Workflow 1 content)
5. **Configure tools profile**: Add minimal tools config (Workflow 4) to openclaw.json
6. **Update 08B**: Add transport-only reference in 08B build section
7. **Sign off**: sk reviews and adds date to provider-strategy.md

## Acceptance Criteria

- [ ] `tasks/openclaw/provider-strategy.md` exists with transport-only decision and owner sign-off date
- [ ] `openclaw.json` has no active LLM provider config (verified with `jq '.providers'`)
- [ ] Single WA message = exactly one AI reply (verified with allowlisted test number)
- [ ] OpenClaw tools profile restricts `http_client.allowedDomains` to Supabase + Paperclip only
- [ ] 08B implementation notes reference transport-only pattern (no OpenClaw native LLM calls)
- [ ] All WA AI costs tracked in Supabase/Google billing (zero OpenClaw LLM cost)

## Feature Success

| Layer | Intent |
|-------|--------|
| **Goal** | Provider routing strategy decided — no split-brain, no two models on same user turn. |
| **Workflow** | Verify empty provider config → test single reply → document decision → update 08B. |
| **Proof** | One WA message = one AI reply; OpenClaw provider config is empty. |
| **Gates** | Blocks full 08B — must be decided before implementing WA AI chain. |
| **Rollout** | Document + sk sign-off before 08B build starts. |

**Next:** [`08B-openclaw-whatsapp-adapter.md`](08B-openclaw-whatsapp-adapter.md) (builds on this decision), [`05M-openclaw-gateway-health-stub.md`](05M-openclaw-gateway-health-stub.md) (security audit includes provider config check)
