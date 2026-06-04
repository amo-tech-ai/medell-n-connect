---
task_id: 15G
title: WhatsApp Outreach Engine — Personalized Approved Outreach + Auto-Reply
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 3 days
area: ai-agents
skill:
  - mde-paperclip
edge_function: create-outreach-draft, send-approved-message, check-suppression
schema_tables:
  - marketing.outreach_messages
  - marketing.contacts
  - marketing.suppression_list
depends_on:
  - 15D
  - 15F
tools:
  - whatsapp
"":
---

<!-- task-summary -->
> **What:** WhatsApp Outreach Engine — Personalized Approved Outreach + Auto-Reply
> **Why:** Outreach today is nonexistent or fully manual. When a lead is discovered, someone has to manually write a message, send it from their phone, and remember to follow up. Nothing is tracked.…
> **Tools:** `whatsapp`
> **Delivers:** `create-outreach-draft, send-approved-message, check-suppression` edge fn + migrations: `marketing.outreach_messages`, `marketing.contacts`, `marketing.suppression_list`
> **Success Criteria:**
> - Paperclip routine `qualify-leads` runs daily at 09:00
> - Hermes drafts personalized message for each lead — references their actual post text
> - Draft saved to `outreach_messages` with `status='pending_approval'`
> - Paperclip approval request created, one per lead
> **HIGH · P1 · Not Started · Effort: 3 days**
> **Depends on:** 15D, 15F

| Aspect | Details |
|--------|---------|
| **System** | Paperclip approval → OpenClaw → WhatsApp → Hermes reply handler |
| **Features** | Personalized message drafting, double approval gate, WhatsApp send, AI auto-reply, multi-touch sequences |
| **Edge Functions** | create-outreach-draft, send-approved-message, check-suppression |
| **Tables** | marketing.outreach_messages, marketing.contacts, marketing.suppression_list |
| **Real-World** | "A lead scores 88 on the apartment search. Hermes drafts a personalized WhatsApp message referencing their exact situation. Board approves. OpenClaw sends it. Lead replies — Hermes handles the conversation automatically." |

## Description

**The situation:** Outreach today is nonexistent or fully manual. When a lead is discovered, someone has to manually write a message, send it from their phone, and remember to follow up. Nothing is tracked. Personalization is impossible at scale.

**Why it matters:** WhatsApp has the highest conversion rate of any channel (~35% reply rate for personalized messages vs <2% for email). The key is personalization + timing + not spamming. Sending 10 highly personalized messages beats sending 200 generic ones.

**What already exists:** OpenClaw connected to Paperclip, WhatsApp plugin enabled, contacts table with scored leads (from 15F), `send-approved-message` edge function (from 15D).

**The build:**
1. Create Paperclip routine `qualify-leads` — fires daily at 09:00, picks top 5 score≥85 leads not yet contacted
2. Hermes drafts personalized message for each lead using their bio/caption as context
3. Message saved to `outreach_messages` status='pending_approval', Paperclip approval request created
4. Board approves (or edits + approves) each message individually
5. On approval: `send-approved-message` fires → checks suppression → sends via OpenClaw WhatsApp
6. Lead replies → OpenClaw webhook fires → Hermes analyzes intent → auto-replies OR escalates
7. Multi-touch: Day 2 follow-up if no reply, Day 4 helpful content, Day 7 final CTA

**Personalization Formula:**
```
Context: [their exact post/bio text]
What we noticed: "We saw you're looking for a 2BR in Laureles..."
Value prop: specific to their situation (apartment search / event / restaurant / sponsor)
CTA: gentle, specific, low-friction ("Want me to send you 3 options?")
```

**Critical rules:**
- NEVER send to same contact twice in 48 hours
- NEVER send if they're in suppression_list
- NEVER send >50 WhatsApp messages/day
- ALWAYS have board approval for each individual message
- "STOP" / "unsubscribe" → immediately add to suppression_list + stop all sequences

**Example (Good message):**
```
Hey — saw your post about looking for a furnished apartment in El Poblado.
I'm on the mdeAI team — we built an AI search that scans Airbnb + local listings 
and filters out the overpriced and scammy ones.
Want me to send you 3 options matching your budget? Just reply with your range 🏘
```

## Rationale
**Problem:** Manual outreach doesn't scale. Generic mass messages get flagged and ignored.
**Solution:** AI personalization at human-approved scale. 10 perfect messages > 200 generic ones.
**Impact:** 15%+ reply rate, full audit trail, zero ban risk (low volume, high quality).

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Board member | approve each message before it sends | nothing goes out without my review |
| Lead | receive a message that shows you read my post | I actually respond instead of ignoring it |
| Hermes agent | know the conversation history | I can reply appropriately when they respond |

## Goals

1. **Primary:** 5 approved messages sent per day; 1+ reply received per day
2. **Quality:** 0 messages sent without approval; 0 suppressed contacts messaged

## Acceptance Criteria

- [ ] Paperclip routine `qualify-leads` runs daily at 09:00
- [ ] Hermes drafts personalized message for each lead — references their actual post text
- [ ] Draft saved to `outreach_messages` with `status='pending_approval'`
- [ ] Paperclip approval request created, one per lead
- [ ] On approval: suppression check → rate limit check → OpenClaw sends via WhatsApp
- [ ] Message delivery receipt saved to `outreach_messages.delivered_at`
- [ ] Reply handler: OpenClaw receives reply → Hermes analyzes → auto-replies or escalates
- [ ] "STOP" / "unsubscribe" detection: immediately adds to `suppression_list`, halts sequence
- [ ] Multi-touch: Day 2 follow-up created as separate Paperclip issue if no reply
- [ ] Daily cap enforced: >50 WhatsApp sends → 429 from `send-approved-message`
- [ ] Test: send message to test WhatsApp (+14168003103 or designated test number)

## Multi-Touch Sequence

```
Day 1: Personalized intro (score ≥85 leads)
  → If reply: Hermes handles conversation → qualify → book
  → If no reply after 24h:

Day 2: Follow-up (add value, not push)
  "Thought this might be helpful — [specific resource for their situation]"
  
Day 4: Helpful content (no direct ask)
  "One more thing — [neighborhood guide / event recommendation]"
  
Day 7: Gentle final CTA
  "If the timing's not right, no worries — we're here when you're ready 🙏"
  
Day 8: Mark as 'cold', pause sequence
```

## Auto-Reply Logic (Hermes)

```
Lead replies: "Yes please! Budget is $1200-1500"
→ Hermes detects: intent=apartment_search, budget_specified=true
→ Queries Supabase: SELECT * FROM apartments WHERE price BETWEEN 1200 AND 1500
→ Returns top 3 with photos + prices + neighborhood
→ Follows up: "Here are 3 options — which neighborhood do you prefer?"

Lead replies: "STOP"
→ Immediate: add to suppression_list channel='whatsapp'
→ Reply: "Got it — you won't hear from us again 🙏"
→ All pending sequence tasks cancelled

Lead replies: "Are you human?"
→ Escalate flag: create Paperclip task for human response
→ Hold sequence until human responds
```

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Paperclip routine | API | Create `qualify-leads` routine |
| Hermes prompt | `/docker/hermes-agent-ifsj/data/` | Outreach personalization prompt |
| Edge Function | `send-approved-message/index.ts` | From 15D |
| OpenClaw skill | `.openclaw/skills/whatsapp-outreach/SKILL.md` | Create outreach skill |
| Supabase | `marketing.outreach_messages` | Track all message state |
| Webhook | OpenClaw → Edge Function | Reply handler |

## Outcomes

| Before | After |
|--------|-------|
| 0 systematic outreach | 5 personalized messages/day, board-approved |
| Generic copy-paste messages | Every message references lead's actual situation |
| No reply tracking | Full conversation history in outreach_messages |
| Manual opt-out handling | "STOP" → instant suppression, sequence cancelled |
| No follow-up system | 4-touch sequence with 7-day cadence |
| WhatsApp phone calls only | Structured AI concierge handles qualification |
