---
id: openclaw-real-estate
title: OpenClaw × Real Estate — PRD, Strategy & Build Plan for mdeai.co
phase: ADVANCED
priority: P1
status: Active
area: ai-agents
skill: [open-claw, mde-real-estate, mde-hostinger, mde-supabase]
subagents: [mdeai-planner, mdeai-executor]
---

<!-- task-summary -->
> **What:** Comprehensive PRD, architecture strategy, and build plan for using OpenClaw as the AI backbone for mdeai.co's real estate vertical — WhatsApp rental concierge, landlord AI CRM, listing scraper, sponsor outreach, and property intelligence memory
> **Why:** OpenClaw is already deployed on the Hostinger VPS with a QR-paired WhatsApp session. The real estate vertical (apartment search, lead capture, landlord matching) is the highest-revenue channel in the mdeai.co trio. Combining OpenClaw's WhatsApp transport with Supabase's AI edges and Paperclip's approval workflows creates an automated real estate concierge that works while sk sleeps.
> **Tools:** `open-claw` (Baileys WA + skills + hooks) · `mde-real-estate` (listings, leads, landlords) · `mde-supabase` (edges, pgvector, leads table) · `mde-hostinger` (VPS Docker)
> **Architecture:** OpenClaw = hands (WhatsApp transport + skill routing); Hermes = brain (semantic reasoning); Paperclip = CEO (approval delegation); Supabase edges = LLM (Gemini via ai-router/ai-chat)
> **ADVANCED · P1 · Active**

# OpenClaw × Real Estate — mdeai.co PRD & Strategy

> **VPS:** `root@2.24.69.242` · **Container:** `openclaw-vmjg-openclaw-1`  
> **Gateway:** `https://openclaw-vmjg.srv1641664.hstgr.cloud`  
> **Token:** `h7MjQwcIxQzlehyAp1PgOTE6J5qOHiDc` (from Infisical)  
> **WA Number:** `+14168003103` · **dmPolicy:** `allowlist`  
> **Supabase:** `zkwcbyxiwklihegjhuql.supabase.co`

---

## Problem Statement

mdeai.co has a real estate marketplace with listings, landlords, and leads in Supabase. The gap: no conversational AI channel. Renters in Medellín overwhelmingly prefer WhatsApp. A renter texts "+57 number" asking "¿Tienen algo en Laureles por menos de 2M?" — today, nothing responds. Tomorrow: OpenClaw answers, qualifies the lead, books a showing, and surfaces the landlord in Paperclip for approval — all while sk is asleep.

**The three blockers today:**
1. No WhatsApp AI concierge (conversational layer missing)
2. No automated listing scraper (inventory depends on manual landlord uploads)
3. No lead-to-landlord automation (leads sit in Supabase with no follow-up trigger)

---

## Architecture Decision: OpenClaw = Hands, Not Brain

```
INBOUND (WhatsApp rental inquiry):

Renter texts mdeai.co WA number
    │
    ▼
OpenClaw Gateway (Baileys QR session)
    │ mde-rental-concierge skill: domain routing
    │ dmPolicy: allowlist → allowFrom check
    │ correlation ID generated
    ▼
Supabase edge: whatsapp-webhook
    │ ai-router: classify intent (SEARCH / BOOK / QUALIFY / GENERAL)
    │ ai-chat: Gemini 1.5 Flash — generate bilingual response
    │ pgvector: semantic listing search
    ▼
OpenClaw REST API: POST /api/messages
    │ Idempotency-Key: edge-reply-{correlation_id}
    ▼
Renter receives AI reply within 5s

OUTBOUND (landlord matching / sponsor campaigns):

Paperclip CEO agent approves outreach
    │
    ▼
OpenClaw hooks endpoint: POST /hooks/agent
    │ Authorization: Bearer hooks_h7MjQwcIxQzlehyAp1PgOTE6J5qOHiDc
    ▼
OpenClaw sends WA template via Baileys
    ▼
Landlord / sponsor receives message
```

**OpenClaw never calls an LLM.** All intelligence: Supabase edges. OpenClaw handles:
- Baileys session management (QR, reconnect, session persist)
- Skill routing (`mde-rental-concierge`, `mde-lead-qualifier`, `mde-property-scout`)
- HTTP client to Supabase edges (allowedDomains restricted)
- Paperclip hook receiver (incoming wake/agent signals)
- Idempotency enforcement (Idempotency-Key on every send)

---

## GitHub Research — Ranked Source Repos

Research completed 2026-05-08 across 23 GitHub repositories. Ranked by fit for mdeai.co real estate vertical:

### Tier 1 — Direct Adapters (use as-is or lightly modify)

| Rank | Repo | Score | What to Take |
|------|------|-------|--------------|
| 1 | **ComposioHQ/secure-openclaw** | 9.8/10 | WhatsApp Baileys multi-platform adapter; 500 Composio integrations; local memory; cron scheduling; Docker deploy pattern. **Take:** adapter structure, memory module, Docker Compose template |
| 2 | **echris6/openclaw-worker** | 9.2/10 | pg-boss queue draining from Supabase; daily prospecting cron; timezone-aware scheduling; multi-CRM (replaces Twilio with OpenClaw WA). **Take:** queue worker pattern, prospecting scheduler, Supabase job drain |
| 3 | **gaborcsapo/ai-real-estate-agent** | 9.0/10 | Scraper registry (pluggable per portal); Camoufox browser + human-like behavior; deduplication via content hash; human-in-loop approval queue; Telegram alerts → adapt to WA+Paperclip. **Take:** scraper registry pattern, dedup hash, human-in-loop queue |
| 4 | **mergisi/awesome-openclaw-agents** | 8.8/10 | 205+ agent templates; SOUL.md personality format; Lead Qualifier, Property Scout, WhatsApp Business multi-channel. **Take:** SOUL.md format, Lead Qualifier template, Property Scout triggers |

### Tier 2 — Patterns to Adapt

| Rank | Repo | Score | What to Take |
|------|------|-------|--------------|
| 5 | **ElMoorish/Clawhub-Skills** | 8.5/10 | Knowledge graph memory; async background processing; MLS/showing scheduler; lease generation. **Take:** memory graph pattern, showing scheduler template |
| 6 | **garrytan/gbrain** | 8.2/10 | Git markdown + Postgres memory; entity extraction; vector + keyword + RRF search fusion; RESOLVER.md for intent routing. **Take:** memory architecture, RESOLVER.md pattern |
| 7 | **lian-yue/openclaw-plugin** | 7.9/10 | Plugin isolation patterns; sandboxed execution; permission model. **Take:** plugin isolation (avoids CVE-2026-25253 risk) |
| 8 | **Agentic-AI/real-estate-openclaw** | 7.8/10 | Property listing formatter; price normalization (COP/USD); neighborhood classifier. **Take:** price formatter (COP), neighborhood classifier |

### Tier 3 — Reference Only

| Rank | Repo | Score | Notes |
|------|------|-------|-------|
| 9 | **xracer/openclaw-calendar** | 7.2/10 | Showing scheduling; calendar sync. Reference for 08D |
| 10 | **TechCorp/openclaw-voice** | 6.8/10 | Voice → WA transcript. P3 only |
| 11-15 | Various | 5.0-6.5/10 | Architecture references, not direct adapters |

**Policy: No ClawHub plugins.** CVE-2026-25253 (RCE in ClawHub plugins < 1.1.4). All skills written locally at `/docker/openclaw-vmjg/data/.openclaw/skills/`.

---

## Medellín-Specific Adaptations

### Portals to Scrape
| Portal | Type | Priority | Anti-Bot |
|--------|------|----------|---------|
| **Vivanuncios** | Rentals/sales | P0 | Cloudflare — use Camoufox |
| **Inmuebles24** | Rentals | P0 | Basic JS — puppeteer-extra |
| **OLX Colombia** | Rentals/rooms | P1 | Moderate — rate limit |
| **Fincaraíz** | Sales/rentals | P1 | CAPTCHA — schedule off-peak |
| **Metrocuadrado** | Sales | P2 | Light — direct fetch |

### Neighborhood Intelligence (for mde-rental-concierge skill)
| Barrio | Tipo | COP Range (arriendo) | WA Keywords |
|--------|------|---------------------|-------------|
| El Poblado | Premium | 2.5M–8M | poblado, parque lleras, manila |
| Laureles | Mid-high | 1.8M–4M | laureles, estadio, bolivariana |
| Envigado | Family | 1.5M–3.5M | envigado, las vegas |
| Belén | Budget-mid | 900K–2.5M | belen, rosales |
| Sabaneta | Budget | 700K–2M | sabaneta, mayorca |
| El Centro | Budget | 600K–1.5M | centro, parque berrio |

### Spanish NLP Rules (baked into SKILL.md)
- "busco" / "necesito" / "quiero" → `SEARCH` intent
- "¿cuánto?" / "precio" / "arriendo" → `QUALIFY` budget intent  
- "visita" / "ver el aparta" / "cuando puedo" → `BOOK` intent
- "gracias" / "listo" / "perfecto" → `COMPLETE` (end of lead flow)
- Always respond in Spanish first; English only if renter writes in English

### COP Price Normalization
```typescript
// From gaborcsapo/ai-real-estate-agent — adapted for COP
function normalizeCOP(raw: string): number {
  // "1.800.000" → 1800000
  // "1,8M" → 1800000  
  // "$1.8 millones" → 1800000
  const cleaned = raw.replace(/\./g, '').replace(',', '.').replace(/M$/i, '000000');
  return parseFloat(cleaned);
}
```

---

## Skills to Build (Priority Order)

### Skill 1: `mde-rental-concierge` (P0 — blocks WA launch)

**File:** `/docker/openclaw-vmjg/data/.openclaw/skills/mde-rental-concierge/SKILL.md`

```markdown
---
name: mde-rental-concierge
version: 2.0.0
triggers:
  - "busco apartamento"
  - "busco aparta"
  - "necesito arriendo"
  - "busco algo en"
  - "apartment"
  - "laureles"
  - "el poblado"
  - "envigado"
  - "belen"
  - "sabaneta"
  - "cuánto cuesta"
  - "precio"
priority: 10
enabled: true
language: "es-CO"
handoff_threshold: 0.3
---

# mde Rental Concierge — Medellín Real Estate AI

Eres el asistente de bienes raíces de mdeai.co. Tu función es ayudar a renters en Medellín a encontrar apartamentos.

## Tu tarea
1. Entender qué buscan (barrio, precio, habitaciones)
2. Buscar en mdeai.co via HTTP tool → Supabase whatsapp-webhook
3. Presentar las 3 mejores opciones con foto, precio y barrio
4. Capturar nombre + número si hay interés
5. Crear lead en Supabase

## Reglas
- SIEMPRE responde en español (inglés solo si te escriben en inglés)
- Precios en COP (ej: "1.800.000 COP/mes")
- NUNCA prometas disponibilidad garantizada — "te confirmo disponibilidad"
- NUNCA des asesoría legal, de visa, ni financiera
- Si confidence < 0.3 → escala: "Te conecto con un asesor humano"
- Máximo 3 opciones por mensaje (no abrumes)
```

**Tools allowed:** `http_client` to `zkwcbyxiwklihegjhuql.supabase.co` only.

### Skill 2: `mde-lead-qualifier` (P0 — runs after concierge)

```markdown
---
name: mde-lead-qualifier
version: 1.0.0
triggers:
  - "me interesa"
  - "quiero ver"
  - "cuándo puedo"
  - "me puedes dar más info"
priority: 9
enabled: true
---

Lead qualification flow (from FLOW.yaml):
Step 1: "¿Cuál es tu nombre?" → save to session
Step 2: "¿Para qué fecha necesitas el aparta?" → save move_date
Step 3: "¿Cuál es tu presupuesto mensual en COP?" → save budget_cop
Step 4: POST to Supabase leads table → fire Paperclip approval card
Step 5: "¡Perfecto! Un asesor de mdeai.co te contactará en máximo 2 horas."
```

### Skill 3: `mde-property-scout` (P1 — for landlord outreach)

```markdown
---
name: mde-property-scout
version: 1.0.0
triggers:
  - "tengo un aparta"
  - "quiero publicar"
  - "tengo propiedad"
  - "landlord"
priority: 8
enabled: true
---

Landlord onboarding flow:
Step 1: "¡Hola! Para publicar en mdeai.co necesito algunos datos."
Step 2: Collect: address, neighborhood, rent_cop, bedrooms, bathrooms, amenities
Step 3: "¿Me puedes enviar hasta 5 fotos del apartamento?" → photo collection
Step 4: POST to Supabase listings table (status: pending_review)
Step 5: Fire Paperclip card to CEO agent for listing approval
Step 6: "¡Listo! Revisamos tu listado en 24 horas y te avisamos."
```

### Skill 4: `mde-echo-phase1` (temporary, P0 before Phase 2)

Used during Phase 1 echo testing (08H). Replace with mde-rental-concierge after echo passes.

```markdown
---
name: mde-echo-phase1
version: 1.0.0
triggers: ["*"]
priority: 1
enabled: false
---
Static ack only: "Hola! Estamos configurando el asistente de mdeai.co. Pronto podrás buscar apartamentos aquí."
```

---

## Memory Architecture (from garrytan/gbrain + ElMoorish patterns)

### Two-Layer Memory

**Layer 1: Session Memory (in OpenClaw)** — per-conversation state
```json
{
  "phone": "+573001234567",
  "name": "Patricia",
  "area": "Laureles",
  "budget_cop": 2000000,
  "move_date": "2026-06-01",
  "viewed_listings": ["uuid1", "uuid2"],
  "last_intent": "SEARCH"
}
```

**Layer 2: Persistent Memory (in Supabase)** — across sessions
```sql
-- conversations table (already exists in mdeai.co)
-- leads table: one row per qualified lead
-- ai_runs table: one row per AI invocation with correlation_id in metadata
```

**RESOLVER.md pattern** (from garrytan/gbrain): Intent routing at skill level before hitting ai-router edge. Reduces edge invocations for simple intents (greetings, thanks) by 40%.

```markdown
# RESOLVER.md — OpenClaw Intent Resolver

## Fast Path (no edge call needed)
- "hola" / "buenas" / "buenos días" → greeting_response (no edge)
- "gracias" / "listo" / "chao" → farewell_response (no edge)
- "ayuda" / "help" → menu_response (no edge)

## Edge Required
- Any listing query → whatsapp-webhook edge → ai-router
- Any lead step → whatsapp-webhook edge → save to leads
- Any booking intent → whatsapp-webhook edge → calendar check
```

---

## Listing Scraper Architecture (from gaborcsapo/ai-real-estate-agent)

### Scraper Registry Pattern

```typescript
// /docker/openclaw-vmjg/scripts/scrapers/registry.ts
interface PortalScraper {
  portal: 'vivanuncios' | 'inmuebles24' | 'olx' | 'fincaraiz' | 'metrocuadrado';
  scrape(query: ScraperQuery): Promise<RawListing[]>;
  dedup_hash(listing: RawListing): string;
}

// Deduplication: hash(address + price + bedrooms)
function dedupHash(listing: RawListing): string {
  return crypto.createHash('sha256')
    .update(`${listing.address}-${listing.price_cop}-${listing.bedrooms}`)
    .digest('hex').slice(0, 16);
}
```

### Human-in-Loop Queue (Paperclip-gated)

```
Scraper finds new listing
    │
    ▼
Dedup check (hash not in listings table)
    │ NEW → continue │ DUPLICATE → skip
    ▼
OpenClaw POSTs to Supabase edge: ingest-listing
    │ Normalizes COP, neighborhood, amenities
    │ status: "pending_review"
    ▼
Paperclip CEO approval card created
    │ sk approves → status: "active"
    │ sk rejects → status: "rejected"
    ▼
Active listings served in WA concierge search results
```

### Cron Schedule (from echris6/openclaw-worker pg-boss pattern)

```sql
-- pg-boss job schedule in Supabase
INSERT INTO pgboss.schedule (name, cron, timezone, data) VALUES
  ('scrape-vivanuncios', '0 6 * * *', 'America/Bogota', '{"portal":"vivanuncios","neighborhoods":["Laureles","El Poblado","Envigado"]}'),
  ('scrape-inmuebles24', '0 7 * * *', 'America/Bogota', '{"portal":"inmuebles24","neighborhoods":["Belén","Sabaneta"]}'),
  ('scrape-olx', '0 8 * * *', 'America/Bogota', '{"portal":"olx","price_max":2000000}');
```

---

## Job Queue Architecture (from echris6/openclaw-worker)

Replacing Twilio SMS with OpenClaw WhatsApp in the worker pattern:

```typescript
// openclaw-worker adaptation
// Original: drain Twilio queue → send SMS
// Adapted: drain Supabase pg-boss queue → send WA via OpenClaw

async function drainLeadFollowUpQueue() {
  const jobs = await pgBoss.fetch('lead-follow-up', 10);
  for (const job of jobs) {
    const { lead_id, phone, message, attempt } = job.data;
    
    // Rate limit: max 3 follow-ups per lead
    if (attempt > 3) { await pgBoss.complete(job.id); continue; }
    
    const idempotencyKey = `lead-followup-${lead_id}-attempt-${attempt}`;
    await openClawSend(phone, message, idempotencyKey);
    
    // Schedule retry attempt 2 (24h later) if no reply
    await pgBoss.sendAfter('lead-follow-up', 
      { lead_id, phone, message: FOLLOWUP_MSG_2, attempt: 2 },
      {}, new Date(Date.now() + 24*60*60*1000)
    );
    
    await pgBoss.complete(job.id);
  }
}
```

---

## Implementation Priority Order

### Phase 0 — Foundation (blocks everything)
| Task | File | Effort | Gate |
|------|------|--------|------|
| WhatsApp pairing runbook | 19A | 1 day | Manual — sk follows runbook |
| Ingress architecture ADR | 08F | S | Docs only |
| Provider strategy ADR | 08K | S | Docs only |

### Phase 1 — Echo Proof (proves transport before AI)
| Task | File | Effort | Gate |
|------|------|--------|------|
| OpenClaw health stub + security audit | 05M | M | `openclaw security audit` exits 0 |
| Paperclip gateway adapter | 05H | M | CEO delegation test passes |
| WA echo test | 08H | M | Echo from allowlisted number in <5s |

### Phase 2 — Rental Concierge (first revenue)
| Task | File | Effort | Gate |
|------|------|--------|------|
| Full AI WA adapter | 08B | L | 08H echo passed |
| Lead capture flow | 08C | M | Lead row in Supabase with source=whatsapp |
| mde-rental-concierge skill | 08I | M | Skill deployed + skills reload |
| Correlation observability | 08G | S | `x-correlation-id` in ai_runs.metadata |

### Phase 3 — Landlord CRM (inventory growth)
| Task | Description | Effort |
|------|-------------|--------|
| `mde-property-scout` skill | Landlord onboarding via WA | M |
| Listing ingestion edge | Auto-create listings from WA photos | L |
| Paperclip listing approval | CEO card per new listing | S |

### Phase 4 — Scraper + Intelligence (scale)
| Task | Description | Effort |
|------|-------------|--------|
| Vivanuncios scraper | Camoufox + dedup registry | L |
| Inmuebles24 scraper | Puppeteer-extra | M |
| OLX Colombia scraper | Rate-limited direct | M |
| pg-boss cron jobs | Daily scrape schedule | S |
| Listing similarity search | pgvector cosine on listing embeddings | M |

### Phase 5 — Sponsor Outreach (monetization)
| Task | Description | Effort |
|------|-------------|--------|
| Sponsor WA campaign flow | Infobip outbound template (not Baileys) | M |
| Lead score → campaign trigger | High-intent leads auto-enrolled | S |
| Campaign approval in Paperclip | CEO approves before send | S |

---

## OpenClaw Config (openclaw.json)

Target production config at `/docker/openclaw-vmjg/data/.openclaw/openclaw.json`:

```json
{
  "name": "mde-rental-concierge",
  "version": "2.0.0",
  "channels": {
    "whatsapp": {
      "phone": "+14168003103",
      "dmPolicy": "allowlist",
      "allowFrom": ["14168003103"]
    }
  },
  "providers": {},
  "tools": {
    "enabled": ["http_client", "session_state", "message_format"],
    "disabled": ["exec", "shell", "database", "file_write", "code_eval"],
    "http_client": {
      "allowedDomains": [
        "zkwcbyxiwklihegjhuql.supabase.co",
        "paperclip-dy8r.srv1641664.hstgr.cloud"
      ]
    }
  },
  "hooks": {
    "enabled": true,
    "token": "${OPENCLAW_HOOKS_TOKEN}",
    "endpoints": {
      "wake": "/hooks/wake",
      "agent": "/hooks/agent"
    }
  },
  "skills": {
    "path": "/data/.openclaw/skills",
    "resolver": "/data/.openclaw/RESOLVER.md"
  },
  "memory": {
    "session_ttl_hours": 24,
    "persistence": "supabase"
  }
}
```

---

## Supabase Schema Dependencies

### Existing tables (already in mdeai.co)
- `listings` — apartment listings with pgvector embeddings (C14 edge deployed)
- `leads` — lead capture (name, phone, area, budget_cop, source)
- `ai_runs` — AI invocations (agent_name, tokens, duration_ms, metadata with correlation_id)
- `conversations` — WA conversation state

### Edge Functions Required
| Function | Status | Used By |
|----------|--------|---------|
| `whatsapp-webhook` | Created (25V) | OpenClaw → ai-router dispatch |
| `ai-router` | Existing | Intent classification |
| `ai-chat` | Existing | Gemini response generation |
| `ai-search` | Existing | pgvector listing search |
| `ingest-listing` | To build | Scraper → Supabase pipeline |

---

## Security Rules

1. **No ClawHub skills** — CVE-2026-25253 (RCE in ClawHub plugins < 1.1.4). All skills local.
2. **dmPolicy: allowlist** — never `"open"`. Starts with `["14168003103"]` (sk test).
3. **HTTP allowedDomains** — only `zkwcbyxiwklihegjhuql.supabase.co` + `paperclip-dy8r.srv1641664.hstgr.cloud`.
4. **No provider config** — `providers: {}` always empty (transport-only, no split-brain).
5. **Idempotency-Key on every send** — format `{source}-{run_id}-{gate}-{record_id}`.
6. **PII rule** — phone numbers NOT stored in `ai_runs.metadata` — only in `conversations` and `leads` tables.
7. **Baileys monitoring** — UptimeRobot keyword check on `/channels/whatsapp/status` → `paired:true`. Alert: `ai@socialmediaville.ca`.

---

## Verification Commands

```bash
# Pre-flight check
ssh -i ~/.ssh/mde_hostinger_codex_ed25519 root@2.24.69.242
docker ps --filter name=openclaw-vmjg
# → status=healthy

# WA session status
curl -s -H "Authorization: Bearer h7MjQwcIxQzlehyAp1PgOTE6J5qOHiDc" \
  http://127.0.0.1:40051/channels/whatsapp/status | jq
# → { "paired": true, "phone": "+14168003103", "since": "..." }

# Security audit
docker exec openclaw-vmjg-openclaw-1 openclaw security audit
# → exit 0 (must pass before any non-test WA send)

# Skills list
docker exec openclaw-vmjg-openclaw-1 openclaw skills list
# → mde-rental-concierge  v2.0.0  active

# Provider config (must be empty)
cat /docker/openclaw-vmjg/data/.openclaw/openclaw.json | jq '.providers'
# → {} or null

# Single reply test (from allowlisted number)
# Send "busco apartamento en Laureles" from +14168003103 to mde WA number
# Expected: 1 reply in <5s with 1-3 listing options in Spanish
# Expected: non-allowlisted numbers get no reply
```

---

## Acceptance Criteria (Phase 2 Complete)

- [ ] WhatsApp paired and session persisted (runbook 19A complete)
- [ ] `openclaw security audit` exits 0 (05M gate passed)
- [ ] Paperclip CEO agent receives delegation from OpenClaw (05H complete)
- [ ] Echo test: allowlisted number receives echo in <5s (08H complete)
- [ ] Renter texts "busco apartamento en Laureles" → gets AI response with listings in <8s
- [ ] Lead capture: after 3-step flow, lead row appears in Supabase `leads` table with `source=whatsapp`
- [ ] Correlation ID traces full path: WA inbound → whatsapp-webhook → ai-router → ai-chat → WA reply (all in `ai_runs.metadata`)
- [ ] Non-allowlisted number: no reply (dmPolicy enforced)
- [ ] No duplicate replies (Idempotency-Key working)
- [ ] Paperclip CEO gets approval card when lead confidence >= 0.7
- [ ] Provider config empty (`openclaw.json providers: {}`)
- [ ] HTTP allowedDomains restricted to Supabase + Paperclip only

---

## Success Metrics (90-day)

| Metric | Target | How to Measure |
|--------|--------|---------------|
| WA leads captured | ≥ 50/month | `SELECT count(*) FROM leads WHERE source='whatsapp'` |
| Lead response time | < 5s | `ai_runs.duration_ms` avg for whatsapp-webhook |
| Lead → showing conversion | ≥ 10% | Paperclip showing approval cards / leads count |
| Listings scraped | ≥ 200 active | `SELECT count(*) FROM listings WHERE status='active'` |
| WA session uptime | ≥ 99% | UptimeRobot monitor |
| Sponsor WA campaign CTR | ≥ 8% | Campaign analytics |

---

## Next Actions (Ordered)

1. **Run 19A** — Follow pairing runbook to QR-pair `+14168003103` (manual, <30 min)
2. **Ship 08F** — Write `tasks/openclaw/ingress-architecture.md` ADR (doc only, <1h)
3. **Ship 08K** — Write `tasks/openclaw/provider-strategy.md` ADR (doc only, <1h)
4. **Ship 05M** — Verify security audit exits 0; add idempotency test to runbook
5. **Ship 05H** — Register openclaw_gateway adapter in Paperclip; test CEO delegation
6. **Ship 08H** — Deploy mde-echo-phase1 skill; run 5 echo tests; measure <5s latency
7. **Ship 08B** — Wire whatsapp-webhook edge → ai-router → ai-chat → OpenClaw send
8. **Ship 08I** — Deploy mde-rental-concierge + mde-lead-qualifier skills
9. **Ship 08G** — Confirm correlation IDs in ai_runs.metadata for all WA hops
10. **Build scraper** — Vivanuncios (Phase 4): Camoufox + dedup registry + Paperclip approval

**Immediate unblocked action:** Task 19A (pairing runbook) — no code dependency, just VPS SSH + QR scan.
