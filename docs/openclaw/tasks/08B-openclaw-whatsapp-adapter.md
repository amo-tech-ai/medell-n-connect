---
id: 08B
diagram_id: MERM-04
prd_section: "5. AI agent architecture — OpenClaw channels"
title: Wire OpenClaw WhatsApp channel adapter — full AI chain (Phases 2-4)
skills:
  - open-claw      # WA channel config, session management, message formatting
  - mde-paperclip  # Paperclip delegation for approvals
  - mde-supabase   # ai-router and ai-chat edge functions, ai_runs logging
  - mde-task-lifecycle
epic: E8
phase: ADVANCED
priority: P2
status: Open
owner: Backend
dependencies:
  - E5-007  # 05H outbound adapter
  - E8-001  # 08E multi-channel epic
  - E8-005  # 08F ingress architecture decision
  - E8-010  # 08K provider strategy (transport-only confirmed)
  - E8-007  # 08H Phase 1 echo must pass first
estimated_effort: L
percent_complete: 0
outcome: O5
---

<!-- task-summary -->
> **What:** Full WhatsApp AI adapter — inbound WA message → ai-router → ai-chat → formatted WA reply (Phases 2-4)
> **Why:** Phase 1 (08H) proves echo works. This task wires in the real AI chain: intent classification, Gemini response with listing data, WhatsApp-formatted output (text + quick replies), conversation state per phone number, and language detection for Spanish/English. Without this, WA users get echo bot, not AI.
> **Tools:** `open-claw` (WA channel + message format) · `mde-supabase` (ai-router, ai-chat edges, ai_runs) · `mde-paperclip` (approval delegations)
> **Workflow:** **Goal:** OpenClaw drives WhatsApp AI routing with escalation and cost tracking. → **Workflow:** Inbound WA → intent classify → ai-chat → format → reply; conversation state per phone. → **Proof:** Spanish "Busco apartamento" returns 3 listings in WA format within 5s; handoff to human works.
> **Success Criteria:**
> - WA messages route through OpenClaw to ai-router and ai-chat
> - Responses formatted for WhatsApp (text + quick reply buttons)
> - Conversation state maintained per phone number
> - Language detection works (Spanish first, English when user uses English)
> **ADVANCED · P2 · Open · Effort: L**
> **Depends on:** E5-007, E8-001, E8-005, E8-010, E8-007

# E8-002: Wire OpenClaw WhatsApp Channel Adapter (Phases 2-4)

## Overview

This task wires the full AI chain to the WhatsApp channel. Phase 1 (08H) proved the Baileys transport works — this task adds the intelligence.

**Four phases total:**
| Phase | Scope | Task |
|-------|-------|------|
| 1 | Echo + allowlist | 08H (completed first) |
| 2 | Intent routing → ai-router → ai-chat | This task, section A |
| 3 | Rich messages: listing cards, quick replies | This task, section B |
| 4 | Paperclip delegation (approval gates) | This task, section C |

**Provider strategy (from 08K):** Transport-only. OpenClaw = WA transport + session. All LLM calls go to Supabase edges (Gemini). No provider config in OpenClaw.

## How the Tools Work Together

```
Phase 2: Intent Classification + AI Response

WA User: "Busco apartamento en Laureles, 3 millones"
    │
    ▼
OpenClaw (Baileys session)
    │ mde-rental-concierge skill: domain context applied
    │ paperclip plugin: create audit issue
    │
    ├── HTTP tool call → Supabase: whatsapp-webhook edge function
    │     Headers: x-correlation-id, x-wa-phone: "+573..."
    │
    ├── ai-router: { intent: "RENTAL_SEARCH", language: "es", confidence: 0.94 }
    │
    ├── ai-chat (Gemini 1.5 Flash):
    │     tool: search_apartments({ area:"Laureles", budget_cop:3000000 })
    │     → 3 listings returned
    │     → response formatted with listing names, prices, availability
    │     → logs to ai_runs { agent_name:"whatsapp-ai", correlation_id }
    │
    └── Supabase edge → POST /api/messages back to OpenClaw
          Idempotency-Key: edge-reply-{correlation_id}
          { channel:"whatsapp", to:phone, text: formatted_response }

Phase 3: Rich Formatting

Supabase edge builds WA-safe response:
  "Encontre 3 en Laureles para ~$3M/mes:\n\n"
  "1. Apto Laureles Centro\n2 hab | Amoblado | $2.8M\n"
  "Ver: mdeai.co/l/abc123\n\n"
  "2. Studio Avenida El Palo\n1 hab | Wifi | $2.5M\n"
  "[quick reply: Ver #1] [Ver #2] [Agendar visita]"

Phase 4: Paperclip Approval Gate

WA user: "Quiero reservar" (BOOK intent)
  → ai-chat confidence: 0.85 on booking intent
  → G2 gate: outbound booking action > requires human approval
  → OpenClaw paperclip plugin → create Paperclip approval item
  → WA reply: "Te estamos conectando con alguien del equipo para confirmar tu reserva"
  → sk or OpsManager approves in Paperclip → booking created
```

## Workflow 1: Wire Phase 2 (Intent Routing)

The `whatsapp-webhook` edge function must handle inbound WA messages from OpenClaw.

```typescript
// supabase/functions/whatsapp-webhook/index.ts (key parts)
import { createClient } from '@supabase/supabase-js';

const corsHeaders = { 'Access-Control-Allow-Origin': '*' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // 1. Auth: verify request is from OpenClaw (check token or IP)
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (token !== Deno.env.get('OPENCLAW_HOOKS_TOKEN')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 2. Generate correlation ID for tracing
  const correlationId = crypto.randomUUID();
  
  // 3. Parse WA message from OpenClaw
  const body = await req.json();
  const { from, text, messageId } = body; // phone number + message text

  // 4. Classify intent
  const routerResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-router`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      'Content-Type': 'application/json',
      'x-correlation-id': correlationId,
    },
    body: JSON.stringify({ message: text, channel: 'whatsapp', language: 'auto' }),
  });
  const { intent, language, confidence } = await routerResponse.json();

  // 5. If confidence < 0.3 → escalate
  if (confidence < 0.3) {
    await escalateToHuman(from, text, correlationId);
    return sendWAReply(from, 'Te conecto con alguien del equipo para ayudarte mejor.', correlationId);
  }

  // 6. Get AI response
  const chatResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      'Content-Type': 'application/json',
      'x-correlation-id': correlationId,
    },
    body: JSON.stringify({ message: text, intent, language, channel: 'whatsapp', from }),
  });
  const { reply, listings } = await chatResponse.json();

  // 7. Format for WhatsApp and send back via OpenClaw
  const formatted = formatForWhatsApp(reply, listings, language);
  return await sendWAReply(from, formatted, correlationId);
});
```

## Workflow 2: Wire Phase 3 (WhatsApp Formatting)

```typescript
// Format AI response for WhatsApp constraints
function formatForWhatsApp(reply: string, listings: Listing[], lang: string): string {
  const lines: string[] = [];
  
  // Main response text (WA max: 4096 chars; aim for <500)
  lines.push(reply);
  
  if (listings && listings.length > 0) {
    lines.push('');
    listings.slice(0, 3).forEach((l, i) => {
      const price = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(l.price_cop);
      lines.push(`${i + 1}. ${l.title}`);
      lines.push(`   ${l.bedrooms} hab | ${l.furnished ? 'Amoblado' : 'Sin amoblar'} | ${price}/mes`);
      lines.push(`   Ver: mdeai.co/l/${l.slug}`);
    });
  }
  
  // Quick reply buttons (WA supports up to 3 quick reply buttons)
  // These go in the 'buttons' field of the OpenClaw message payload
  return lines.join('\n');
}

// Send reply via OpenClaw REST API
async function sendWAReply(to: string, text: string, correlationId: string): Promise<Response> {
  const ocResponse = await fetch(
    `${Deno.env.get('OPENCLAW_GATEWAY_URL')}/api/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENCLAW_GATEWAY_TOKEN')}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `edge-reply-${correlationId}`,
      },
      body: JSON.stringify({
        channel: 'whatsapp',
        to,
        text,
        buttons: [
          { text: 'Ver mas opciones' },
          { text: 'Agendar visita' },
          { text: 'Hablar con alguien' },
        ],
      }),
    }
  );
  return new Response(JSON.stringify({ success: true, correlationId }), { status: 200 });
}
```

## Workflow 3: Test the Full Chain

```bash
# 1. Send test WA message from allowlisted number
# (manually, or via OpenClaw test tool)

# 2. Check ai_runs for the interaction
curl -s \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  https://zkwcbyxiwklihegjhuql.supabase.co/rest/v1/ai_runs?agent_name=eq.whatsapp-ai&order=created_at.desc&limit=3 \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY"

# Expected: records with agent_name, correlation_id, input_tokens, duration_ms, status

# 3. Verify correlation ID matches across gateway log and ai_runs
# From VPS: docker logs openclaw-vmjg-openclaw-1 | grep <correlation_id>
# From Supabase: SELECT metadata->>'correlation_id' FROM ai_runs WHERE agent_name = 'whatsapp-ai'
```

## User Stories

| As a... | I want to... | So that... |
|---------|-------------|------------|
| Renter (Colombia) | Ask about Laureles apartments in Spanish via WA | I get relevant listings without opening the website |
| Renter | See listing prices and quick-reply buttons in WA | I can shortlist without clicking links |
| Host Maria | Know WA queries about her listing are tracked | She can follow up with interested renters |
| sk | Monitor WA AI response quality via ai_runs | I can tune prompts based on actual conversations |
| Developer | Have conversation state per phone number | The AI remembers context within a conversation |

## The Build

**Phase 2 steps:**
1. Wire `whatsapp-webhook` edge function (Workflow 1) — handle inbound from OpenClaw
2. Connect to ai-router + ai-chat edges, passing `x-correlation-id`
3. Handle low-confidence (< 0.3) escalation path
4. Send reply back via OpenClaw REST API with `Idempotency-Key`

**Phase 3 steps:**
5. Implement `formatForWhatsApp()` function — listings list, COP prices, mdeai.co links
6. Add quick-reply buttons (Ver mas / Agendar visita / Hablar con alguien)
7. Test Spanish and English responses

**Phase 4 steps:**
8. BOOK intent → create Paperclip approval item via `paperclip` plugin
9. Reply to user: "Connecting you with our team to confirm booking"
10. After Paperclip approval → OpsManager creates booking in Supabase

## Acceptance Criteria

- [ ] WA messages route through OpenClaw to ai-router and ai-chat
- [ ] Spanish "Busco apartamento en Laureles" → 3 matching listings returned in WA format within 5s
- [ ] English message → English response (language detection works)
- [ ] Conversation state maintained per phone number (AI remembers context within session)
- [ ] Quick reply buttons rendered (Ver mas / Agendar / Hablar con alguien)
- [ ] Low confidence (< 0.3) → escalation message + Paperclip issue created
- [ ] BOOK intent → Paperclip approval item created before booking
- [ ] `ai_runs` logged for every WA interaction with `correlation_id`
- [ ] `Idempotency-Key` on every reply (no duplicate WA sends on retry)
- [ ] `npm run build` passes (no TypeScript errors in edge functions)

## Feature Success

| Layer | Intent |
|-------|--------|
| **Goal** | OpenClaw drives WhatsApp AI routing with escalation and cost tracking. |
| **Workflow** | Inbound WA → intent classify → ai-chat → WA-format → reply. |
| **Proof** | Spanish apartment query returns listings in 5s; handoff creates Paperclip issue. |
| **Gates** | 08F/08K/05M/08H decisions applied; transport-only (no OpenClaw provider). |
| **Rollout** | Expand allowlist after Phase 2 test; Phases 3-4 on top. |

**Next:** [`08G-openclaw-correlation-observability.md`](08G-openclaw-correlation-observability.md), [`08D-human-handover-escalation.md`](../whatsapp/08D-human-handover-escalation.md)
