---
id: 08I
diagram_id: MERM-07
prd_section: "8. Multi-channel — Skills"
title: Write mde-rental-concierge skill — domain knowledge, tone, handoff rules for OpenClaw WA
skills:
  - open-claw      # skill file format, VPS deployment, workspace load
  - mde-task-lifecycle
epic: E8
phase: ADVANCED
priority: P2
status: Open
owner: Backend
dependencies:
  - E8-007  # 08H Phase 1 echo must work before skills matter
estimated_effort: S
percent_complete: 0
outcome: O5
---

<!-- task-summary -->
> **What:** Write and deploy `mde-rental-concierge` skill — guides OpenClaw WA AI to speak like a Medellin rental expert, know neighborhoods, avoid legal claims, and escalate correctly
> **Why:** Without this skill, OpenClaw has no mde domain knowledge — it might hallucinate Medellin neighborhood names, quote wrong prices, give legal advice about visas, or forget to escalate uncertain situations. The skill grounds every WA conversation in verified product behavior.
> **Tools:** `open-claw` (skill YAML frontmatter + VPS deploy + workspace load verification)
> **Workflow:** **Goal:** mde domain skills in OpenClaw match product language (rentals, neighborhoods). → **Workflow:** Author SKILL.md → deploy to VPS skills path → verify loaded in gateway → test trigger phrases. → **Proof:** Skill responses grounded in DB or say "I don't know"; no hallucinated listing addresses.
> **Success Criteria:**
> - `mde-rental-concierge/SKILL.md` deployed to VPS `/docker/openclaw-vmjg/data/.openclaw/skills/`
> - Trigger phrases activate skill (test: "Busco apartamento en Laureles")
> - Skill never claims legal/visa advice; always defers to human on confidence < 0.3
> - All listing data comes from tool calls, not hallucinated addresses
> **ADVANCED · P2 · Open · Effort: S**
> **Depends on:** E8-007

# E8-008: mde OpenClaw Skills Pack

## Overview

OpenClaw skills are markdown files with YAML frontmatter that load into the gateway's context for every conversation where a trigger phrase matches. Without mde-specific skills, OpenClaw gives generic AI responses — it doesn't know Laureles from El Poblado, doesn't know COP vs USD pitfalls, and has no rules about when to hand off to a human.

**Security note:** We write all skills locally. ClawHub (the public skill registry) is a security risk — CVE-2026-25253 (RCE in plugins < v1.1.4). Policy: no ClawHub skills until 19C audit passes.

**Skills to create in this task:**
1. `mde-rental-concierge` — core domain skill (required)
2. `mde-lead-capture-flow` — task flow YAML for new contact intake (can be in same PR)

## How the Tools Work Together

```
Developer writes skill files locally:
  tasks/openclaw/skills/mde-rental-concierge/SKILL.md
  tasks/openclaw/skills/mde-lead-capture-flow/FLOW.yaml

  │ git commit → PR review → merge
  │
  ▼
VPS deployment:
  scp skills to /docker/openclaw-vmjg/data/.openclaw/skills/
  docker exec openclaw-vmjg-openclaw-1 openclaw skills reload
  
  │
  ▼
OpenClaw Gateway
  │ on inbound WA message: scan for trigger phrases
  │ "Busco apartamento" → load mde-rental-concierge context
  │ skill context prepended to AI prompt
  │ (AI is Gemini via Supabase edge, not OpenClaw provider)
  │
  ▼
WA User gets response grounded in mde domain knowledge
  "En Laureles tenemos opciones de 1-3 habitaciones..."
  (not: "In Medellin, Colombia's second city, there are...")
```

## Workflow 1: Write mde-rental-concierge SKILL.md

Create file at `tasks/openclaw/skills/mde-rental-concierge/SKILL.md`:

```markdown
---
name: mde-rental-concierge
version: 1.0.0
author: mdeai.co
triggers:
  - apartment
  - apartamento
  - Laureles
  - El Poblado
  - Envigado
  - Belen
  - Sabaneta
  - alquiler
  - arriendo
  - stay
  - cuanto cuesta
  - how much
  - furnished
  - amoblado
  - habitacion
  - bedroom
priority: 10
language: bilingual
---

# mde Rental Concierge

You are the rental concierge for mdeai.co — an AI marketplace for stays, coffee
experiences, and events in Medellin, Colombia.

## How to Respond

**Language:** Default to Spanish when the user writes in Spanish. Switch to English
when the user writes in English. Never mix both languages in a single reply.

**Tone:** Friendly, knowledgeable, and local. You know Medellin neighborhoods well.

**Format for WhatsApp:** Keep replies under 300 words. Use numbered lists for
multiple listings. Include mdeai.co/l/{slug} links for each listing.

## Medellin Neighborhoods You Know

| Barrio | Character | Typical rental range (COP/month) |
|--------|-----------|----------------------------------|
| El Poblado | Upscale, expat-heavy, nightlife | $2.5M - $8M |
| Laureles | Residential, families, safe | $1.8M - $5M |
| Envigado | Quieter, local feel, good value | $1.5M - $3.5M |
| Belen | Authentic local, affordable | $1.0M - $2.5M |
| Sabaneta | South suburb, great food scene | $1.2M - $2.8M |
| Centro | Budget, central, noisy | $0.8M - $2.0M |

## What You NEVER Do

- Give legal advice about lease agreements ("consult a lawyer")
- Make guarantees about visa requirements or immigration status
- Quote official government policies without citing a source
- Claim a listing is available without checking via tool
- Make up listing addresses or details — all data comes from tool calls
- Discuss competitor platforms or prices
- Share sensitive user data between conversations

## When to Escalate to a Human

Escalate immediately when:
- Your confidence in the answer is below 30%
- User mentions: "contract", "lawsuit", "refund dispute", "visa",
  "deportacion", "contrato", "demanda", "reembolso"
- User has expressed frustration in 2 or more consecutive messages
- Any payment or reservation >$500 USD requires confirmation
- Request involves something clearly outside the rental domain

Escalation response:
- Spanish: "Voy a conectarte con alguien de nuestro equipo para ayudarte mejor."
- English: "Let me connect you with our team for better assistance."

## Tool Usage Rules

1. ALWAYS use search_apartments tool for listing data — never make up listings
2. Use check_availability before confirming a showing
3. For pricing questions: say "around X to Y million COP per month depending on
   size and furnishing" — never guarantee a specific price without a tool call
4. If tool call fails: say "Let me check on that for you" and escalate

## Example Good Response

User: "Busco algo en Laureles para 2 personas, presupuesto 3 millones"

Response:
"Perfecto, Laureles es excelente para parejas — tranquilo, seguro, y con buena
vida de barrio.

Con $3M/mes tienes buenas opciones:
1. Apto Laureles Centro — 2 hab, amoblado, $2.8M/mes
   Ver: mdeai.co/l/laureles-centro-2hab
2. Studio Avenida El Palo — 1 hab, moderno, wifi, $2.5M/mes
   Ver: mdeai.co/l/el-palo-studio

¿Quieres ver fotos o agendar una visita para alguno de estos?"
```

## Workflow 2: Write mde-lead-capture-flow FLOW.yaml

Create file at `tasks/openclaw/skills/mde-lead-capture-flow/FLOW.yaml`:

```yaml
name: mde-lead-capture-flow
version: 1.0.0
trigger:
  type: first_contact
  condition: no_lead_record_for_phone
steps:
  - id: greeting
    message:
      es: "Hola! Soy la asistente de mdeai.co. En que te puedo ayudar hoy?"
      en: "Hi! I'm the mdeai.co assistant. How can I help you today?"
    wait_for: user_reply
    
  - id: ask_name
    message:
      es: "Me puedes dar tu nombre?"
      en: "What's your name?"
    wait_for: user_reply
    save_as: lead.name
    
  - id: ask_area
    message:
      es: "Que barrio te interesa? (El Poblado, Laureles, Envigado...)"
      en: "Which neighborhood are you interested in? (El Poblado, Laureles, Envigado...)"
    wait_for: user_reply
    save_as: lead.area_interest
    
  - id: ask_budget
    message:
      es: "Cual es tu presupuesto mensual aproximado en millones de pesos?"
      en: "What's your approximate monthly budget in Colombian pesos (millions)?"
    wait_for: user_reply
    save_as: lead.budget_hint
    
  - id: save_lead
    action: supabase_insert
    table: leads
    fields:
      name: "{{lead.name}}"
      phone: "{{session.phone}}"
      area_interest: "{{lead.area_interest}}"
      budget_hint: "{{lead.budget_hint}}"
      source: "whatsapp_inbound"
      status: "new"
    
  - id: complete
    message:
      es: "Perfecto! Te voy a mostrar algunas opciones en {{lead.area_interest}}."
      en: "Great! Let me show you some options in {{lead.area_interest}}."
    next: search_apartments
```

## Workflow 3: Deploy Skills to VPS

```bash
# Step 1: Copy skill files to VPS
scp -i ~/.ssh/mde_hostinger_codex_ed25519 -r \
  tasks/openclaw/skills/mde-rental-concierge \
  root@2.24.69.242:/docker/openclaw-vmjg/data/.openclaw/skills/

scp -i ~/.ssh/mde_hostinger_codex_ed25519 -r \
  tasks/openclaw/skills/mde-lead-capture-flow \
  root@2.24.69.242:/docker/openclaw-vmjg/data/.openclaw/skills/

# Step 2: Reload skills in gateway
docker exec openclaw-vmjg-openclaw-1 openclaw skills reload

# Step 3: Verify skills loaded
docker exec openclaw-vmjg-openclaw-1 openclaw skills list

# Expected output includes:
# mde-rental-concierge  v1.0.0  active  triggers: apartment, apartamento, Laureles...
# mde-lead-capture-flow v1.0.0  active  trigger: first_contact
```

## Workflow 4: Test Skill Activation

```bash
# Send a trigger phrase via test WA message from allowlisted number:
# "Busco apartamento en Laureles, presupuesto 3 millones"

# Verify in gateway logs that skill was loaded:
docker logs openclaw-vmjg-openclaw-1 | grep "mde-rental-concierge"
# Expected: "Skill mde-rental-concierge loaded for session ..."

# Verify response is grounded (mentions listing from DB, not hallucinated address):
# Check ai_runs for the interaction — intent should be RENTAL_SEARCH
# Verify response contains mdeai.co/l/ links, not invented addresses
```

## User Stories

| As a... | I want to... | So that... |
|---------|-------------|------------|
| Renter (Colombia) | Get AI responses that know Medellin neighborhoods | I trust the assistant knows what it is talking about |
| sk | Have the AI never give legal or visa advice | I avoid liability for incorrect government guidance |
| CMO | Have the AI capture lead data (name, area, budget) for new contacts | New WA contacts become trackable leads automatically |
| Developer | Have skills version-controlled and deployed from git | I can audit changes and roll back if a skill breaks something |

## The Build

1. **Write SKILL.md**: Create `tasks/openclaw/skills/mde-rental-concierge/SKILL.md` (Workflow 1)
2. **Write FLOW.yaml**: Create `tasks/openclaw/skills/mde-lead-capture-flow/FLOW.yaml` (Workflow 2)
3. **Security review**: Confirm skill files contain no secrets, no hardcoded phone numbers, no external URLs except mdeai.co
4. **Deploy to VPS**: scp both skills to VPS, run `openclaw skills reload` (Workflow 3)
5. **Verify loaded**: `openclaw skills list` shows both active with correct versions
6. **Test trigger phrase**: Send WA "Busco apartamento en Laureles" → confirm skill activated in logs
7. **Test lead capture**: Send WA from new number → confirm lead flow starts, lead created in Supabase
8. **Update links**: Add skill paths to `tasks/openclaw/links.md`
9. **Update 08B**: Reference skill in OpenClaw workspace config setup notes

## Acceptance Criteria

- [ ] `mde-rental-concierge/SKILL.md` deployed to VPS and shows in `openclaw skills list`
- [ ] Trigger phrase "Busco apartamento en Laureles" activates skill (confirmed in gateway logs)
- [ ] Skill response never includes visa/legal claims (tested with "What visa do I need?")
- [ ] Skill escalates on confidence < 0.3 (tested with off-domain question)
- [ ] `mde-lead-capture-flow/FLOW.yaml` deployed; new WA contact goes through flow and creates leads record
- [ ] Skills are version-tagged in git (no floating `@latest`)
- [ ] No secrets embedded in skill files
- [ ] `tasks/openclaw/links.md` updated with skill file paths

## Feature Success

| Layer | Intent |
|-------|--------|
| **Goal** | mde domain skills in OpenClaw match product language and enforce safety rules. |
| **Workflow** | Author SKILL.md → deploy to VPS → verify loaded → test trigger → test escalation. |
| **Proof** | Skill activates on "Busco apartamento"; responses grounded in DB; no visa advice given. |
| **Gates** | Version skills with git tag; no ClawHub installs. |
| **Rollout** | Staging gateway first; prod after trigger test passes. |

**Next:** [`08B-openclaw-whatsapp-adapter.md`](08B-openclaw-whatsapp-adapter.md) (skill referenced in WA adapter setup notes)
