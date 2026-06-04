---
id: 08G
diagram_id: MERM-04
prd_section: "8. Multi-channel — Observability"
title: Correlation IDs — WhatsApp → OpenClaw → Supabase ai_runs (end-to-end tracing)
skills:
  - open-claw                       # gateway logs include correlation_id
  - mde-supabase                    # ai_runs.metadata stores correlation_id
  - mde-task-lifecycle
epic: E8
phase: ADVANCED
priority: P1
status: Open
owner: Backend
dependencies:
  - E8-001
estimated_effort: M
percent_complete: 0
outcome: O5
---

<!-- task-summary -->
> **What:** Propagate `x-correlation-id` from inbound WA message through all edges to `ai_runs.metadata` so any conversation can be traced end-to-end
> **Why:** When a user gets a wrong answer on WhatsApp, there is currently no way to find which `ai_runs` record caused it. `ai_runs` (Supabase), OpenClaw Gateway logs, and future `agent_audit_log` (09E) are completely separate namespaces. A single correlation ID flowing through every hop fixes this.
> **Tools:** `open-claw` (gateway logs) · `mde-supabase` (ai_runs.metadata + edge functions accept/propagate header)
> **Workflow:** **Goal:** Correlation IDs across WA → edge → logs for incident investigation. → **Workflow:** Generate UUID on first inbound → propagate via header → store in ai_runs.metadata → query by ID. → **Proof:** One test WA message produces ai_runs record with matching correlation_id; same ID in gateway log.
> **Success Criteria:**
> - `ai_runs.metadata` contains `correlation_id` for every WA interaction
> - Edge functions accept and propagate `x-correlation-id` header
> - One documented trace: inbound WA → gateway log line → ai_runs record, all sharing same ID
> - SQL query to find all logs for one WA conversation by correlation_id
> **ADVANCED · P1 · Open · Effort: M**
> **Depends on:** E8-001

# E8-006: Unified Observability — Correlation IDs

## Overview

When something goes wrong in a WhatsApp conversation — wrong answer, duplicate send, dropped message — there is no current way to trace the path. The OpenClaw gateway logs one thing. The Supabase `ai_runs` table logs another. These are unlinked.

This task adds a `correlation_id` (UUID) generated at the first inbound event and propagated through every hop: OpenClaw → whatsapp-webhook edge → ai-router → ai-chat → `ai_runs.metadata`. One ID, traceable end-to-end.

**PII consideration:** Correlation IDs must never contain or directly expose phone numbers or names. The WA phone number is only stored in `conversations` (or `leads`) — correlation IDs link logs without duplicating PII.

## How the Tools Work Together

```
WA User sends message
    │
    ▼
OpenClaw (Baileys)
    │ generates or receives: x-correlation-id: "abc-123-uuid"
    │ logs: { correlation_id: "abc-123-uuid", direction: "inbound", channel: "whatsapp" }
    │
    ▼
Supabase: whatsapp-webhook edge
    │ receives x-correlation-id from OpenClaw
    │ OR generates UUID if not present (first-hop policy)
    │
    ├── ai-router edge
    │     headers: { x-correlation-id: "abc-123-uuid" }
    │
    ├── ai-chat edge
    │     headers: { x-correlation-id: "abc-123-uuid" }
    │     logs to ai_runs:
    │       { agent_name: "whatsapp-ai",
    │         metadata: { correlation_id: "abc-123-uuid", wa_session_id: "...", intent: "RENTAL_SEARCH" },
    │         status: "success" }
    │
    ▼
OpenClaw: POST /api/messages (reply)
    │ Idempotency-Key: edge-reply-abc-123-uuid
    │ logs: { correlation_id: "abc-123-uuid", direction: "outbound" }
    ▼
WA User receives reply

Trace query:
  SELECT * FROM ai_runs WHERE metadata->>'correlation_id' = 'abc-123-uuid';
  docker logs openclaw-vmjg-openclaw-1 | grep "abc-123-uuid"
```

## Workflow 1: Update whatsapp-webhook to Generate and Propagate

```typescript
// supabase/functions/whatsapp-webhook/index.ts
// Key addition: generate correlationId and pass it through every downstream call

Deno.serve(async (req) => {
  // Generate correlation ID at first hop (or receive from OpenClaw if it sends one)
  const incomingCorrelationId = req.headers.get('x-correlation-id');
  const correlationId = incomingCorrelationId ?? crypto.randomUUID();

  // All downstream calls include this header
  const traceHeaders = {
    'x-correlation-id': correlationId,
    'x-wa-phone': req.headers.get('x-wa-phone') ?? 'unknown',  // redacted in logs
  };

  // Call ai-router with trace header
  const routerRes = await fetch(`${SUPABASE_URL}/functions/v1/ai-router`, {
    method: 'POST',
    headers: { ...traceHeaders, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
    body: JSON.stringify({ message: text, channel: 'whatsapp' }),
  });

  // Call ai-chat with trace header
  const chatRes = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
    method: 'POST',
    headers: { ...traceHeaders, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
    body: JSON.stringify({ message: text, intent, channel: 'whatsapp' }),
  });

  // Reply to OpenClaw using correlation ID as part of idempotency key
  const reply = await fetch(`${OPENCLAW_GATEWAY_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENCLAW_GATEWAY_TOKEN}`,
      'Idempotency-Key': `edge-reply-${correlationId}`,
    },
    body: JSON.stringify({ channel: 'whatsapp', to: phone, text: formatted }),
  });

  return new Response(JSON.stringify({ correlationId }), { status: 200 });
});
```

## Workflow 2: Update ai-chat to Store Correlation ID in ai_runs

```typescript
// supabase/functions/ai-chat/index.ts
// Add correlation_id to the ai_runs log entry

const correlationId = req.headers.get('x-correlation-id');

// After generating AI response, log to ai_runs
await supabase.from('ai_runs').insert({
  agent_name: 'whatsapp-ai',
  input_tokens: usage.input_tokens,
  output_tokens: usage.output_tokens,
  duration_ms: Date.now() - startTime,
  status: 'success',
  metadata: {
    correlation_id: correlationId,
    channel: 'whatsapp',
    intent: routedIntent,
    language: detectedLanguage,
    // Do NOT store phone number here — stored in conversations table only
  },
});
```

## Workflow 3: Verify End-to-End Trace

```bash
# Step 1: Send a test WA message from allowlisted number
# Step 2: Note the time (HH:MM:SS)

# Step 3: Get correlation_id from whatsapp-webhook logs
# Option A: add response logging to webhook (correlation_id in response)
# Option B: grep Supabase edge function logs

# Step 4: Find ai_runs record
CORRELATION_ID="the-uuid-from-step-3"

curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "https://zkwcbyxiwklihegjhuql.supabase.co/rest/v1/ai_runs?metadata->>correlation_id=eq.$CORRELATION_ID" \
  | jq '.'

# Expected:
# [{
#   "agent_name": "whatsapp-ai",
#   "status": "success",
#   "duration_ms": 1243,
#   "metadata": {
#     "correlation_id": "the-uuid",
#     "channel": "whatsapp",
#     "intent": "RENTAL_SEARCH"
#   }
# }]

# Step 5: Find same ID in OpenClaw gateway logs
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242
docker logs openclaw-vmjg-openclaw-1 | grep "$CORRELATION_ID"

# Expected: inbound log line + outbound log line both containing the same UUID
```

## Workflow 4: Document the Trace Query Reference

Create `tasks/openclaw/observability.md`:

```markdown
# OpenClaw Observability — Trace Queries

## Find all ai_runs for one WA conversation
SELECT * FROM ai_runs 
WHERE metadata->>'correlation_id' = 'YOUR-UUID-HERE'
ORDER BY created_at ASC;

## Find correlation_id for a specific time window
SELECT metadata->>'correlation_id', created_at, status, duration_ms
FROM ai_runs
WHERE agent_name = 'whatsapp-ai'
  AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

## Gateway logs for a correlation ID (run on VPS):
docker logs openclaw-vmjg-openclaw-1 | grep "YOUR-UUID-HERE"

## Find slow WA interactions (> 5s)
SELECT metadata->>'correlation_id', duration_ms, status
FROM ai_runs
WHERE agent_name = 'whatsapp-ai'
  AND duration_ms > 5000
ORDER BY created_at DESC;
```

## User Stories

| As a... | I want to... | So that... |
|---------|-------------|------------|
| sk | Find the `ai_runs` record for any WA conversation | I can debug "why did AI say X" without guessing |
| Developer | Trace a WA message from gateway log to Supabase record | I can pinpoint which hop caused a failure |
| CTO agent | Know when a WA AI response took >5s | I can alert on latency spikes before users complain |
| sk | Have PII-safe logging | Phone numbers stay in `conversations` table, not scattered in logs |

## The Build

1. **Update whatsapp-webhook**: generate `correlationId` at first hop, pass via `x-correlation-id` header to all downstream calls (Workflow 1)
2. **Update ai-chat**: read `x-correlation-id` header, store in `ai_runs.metadata` (Workflow 2)
3. **Update ai-router**: propagate `x-correlation-id` header in any sub-calls
4. **Update OpenClaw reply**: use `edge-reply-{correlationId}` as Idempotency-Key
5. **Test trace**: send test WA, get correlationId from webhook response, query ai_runs + gateway logs (Workflow 3)
6. **Document trace queries**: create `tasks/openclaw/observability.md` (Workflow 4)
7. **Update 08B acceptance criteria**: require correlation on all OpenClaw → edge calls

## Acceptance Criteria

- [ ] `ai_runs.metadata` contains `correlation_id` for every WA interaction
- [ ] All edge functions touched by E8 accept and forward `x-correlation-id` header
- [ ] One documented trace: inbound WA → OpenClaw gateway log → ai_runs record, all matching same UUID
- [ ] SQL query documented to retrieve all ai_runs by correlation_id
- [ ] PII: phone number not stored in ai_runs.metadata (stored only in conversations/leads tables)
- [ ] `tasks/openclaw/observability.md` created with reference queries
- [ ] 08B acceptance criteria updated to require correlation propagation

## Feature Success

| Layer | Intent |
|-------|--------|
| **Goal** | Correlation IDs across WA → edge → logs for incident investigation. |
| **Workflow** | Generate UUID at first hop → propagate header → store in ai_runs.metadata. |
| **Proof** | One test WA message: same UUID in gateway log + ai_runs record. |
| **Gates** | PII minimization — no phone numbers in correlation log fields. |
| **Rollout** | Enable in staging first; verify no PII leaks in log output. |

**Next:** Once correlation IDs are live, [`09E-production-readiness.md`](09E-production-readiness.md) can link `agent_audit_log` entries to the same ID.
