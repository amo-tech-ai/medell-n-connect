# OpenClaw PRD — mdeai.co WhatsApp AI Gateway

> **Last updated:** 2026-05-08  
> **Status:** Active — Phase 1 underway (08H echo adapter)  
> **Owner:** Backend / sk

---

## 1. What Is OpenClaw?

OpenClaw is a self-hosted, MIT-licensed AI gateway that:
- Connects messaging platforms (WhatsApp via Baileys QR) to AI agents without WhatsApp Business API fees
- Manages conversation sessions, skills, and plugins in one runtime
- Exposes a REST API so external systems (Paperclip, Supabase edges) can send messages or trigger flows

**mdeai.co instance:**
```
Gateway URL:   https://openclaw-vmjg.srv1641664.hstgr.cloud
Gateway token: h7MjQwcIxQzlehyAp1PgOTE6J5qOHiDc
Hooks token:   hooks_h7MjQwcIxQzlehyAp1PgOTE6J5qOHiDc
Container:     openclaw-vmjg-openclaw-1 (Docker on Hostinger VPS)
Config:        /docker/openclaw-vmjg/data/.openclaw/openclaw.json
VPS IP:        2.24.69.242
SSH key:       ~/.ssh/mde_hostinger_codex_ed25519
```

---

## 2. Purpose & Goals

| Goal | Detail |
|------|--------|
| **Conversational WhatsApp AI** | Renters ask about apartments, availability, prices in WhatsApp — AI responds with listings, images, booking links |
| **Zero API fees for chat** | Baileys QR-paired device = no per-message charge (vs Infobip/Meta API) |
| **Paperclip delegation channel** | CEO/CMO agents send messages to hosts/renters via OpenClaw REST API |
| **Approval gate notifications** | G1 payments, G7 stale leads → WhatsApp notification to sk or ops team |
| **Lead capture on WhatsApp** | New WA inquiry → lead record in Supabase + CMO notified |
| **Social lead discovery** | Apify plugin scrapes Instagram/Facebook Groups for Medellin renters |

---

## 3. Architecture Decision: Transport-Only Pattern

OpenClaw is the **transport layer** for WhatsApp. All AI reasoning runs in Supabase edge functions.

```
WA User
  │
  ▼
OpenClaw (Baileys WA pairing)
  │ message received
  ├── mde-rental-concierge skill → domain context applied
  ├── paperclip plugin hook → Paperclip audit issue created
  │
  ▼
Supabase edge: whatsapp-webhook
  │ x-correlation-id generated here
  │
  ├── ai-router edge fn → intent classification (RENTAL_SEARCH / BOOK / GENERAL)
  │
  ├── ai-chat edge fn → Gemini response generation + tool calls
  │      Tools: search_apartments, check_availability, get_directions
  │      Logs to: ai_runs (agent_name, tokens, duration, correlation_id)
  │
  ▼
OpenClaw REST API: POST /api/messages
  │ Idempotency-Key: edge-reply-{correlation_id}
  │ (reply sent back via Baileys)
  ▼
WA User receives AI reply
```

**Why Transport-Only?**  
OpenClaw with its own LLM provider creates split-brain: two models answering the same user turn. All LLM calls go through Supabase edges (Gemini). OpenClaw provider config stays empty.

**WhatsApp ingress: Option B — OpenClaw owns Baileys**
- Infobip = promotional broadcasts + approved template messages only
- OpenClaw = all conversational AI via QR-paired device
- One WA number, one responder — no double-bot

---

## 4. Features We Are Using

### 4.1 WhatsApp Channel (Baileys)
Baileys links as a companion device (QR scan). No Meta Business API or per-message fees.

**Setup:** `openclaw channel add whatsapp` → QR code → scan with mde WhatsApp number

**Handles:**
- Inbound text messages
- Inbound media (photos from renters viewing apartments)
- Outbound text, images, quick reply buttons
- Session state per phone number

**Allowlist (dmPolicy: allowlist):**
- Only numbers in `allowFrom` receive AI replies
- Start with `["14168003103"]` (sk test number)
- Expand after echo test + `openclaw security audit` passes

### 4.2 Automation: Hooks (INCOMING triggers)
OpenClaw hooks are **incoming only** — external systems POST to OpenClaw to wake it up.

| Hook | URL | When to use |
|------|-----|-------------|
| `wake` | `POST /hooks/wake` + `Authorization: Bearer hooks_...` | Paperclip CEO heartbeat checks WA session health |
| `agent` | `POST /hooks/agent` | Paperclip delegates a messaging task (e.g., send host reminder) |

**Important:** OpenClaw cannot natively POST to an external URL when a WA message arrives. The `paperclip` plugin's `pluginHooks.messageReceived` is the bridge that fires on inbound messages.

### 4.3 Automation: Task Flow (Multi-step Conversations)

| Flow | Trigger | Steps |
|------|---------|-------|
| `lead-capture` | New WA contact (not in DB) | Ask name → area interest → budget → create Supabase lead |
| `showing-schedule` | "quiero ver" / "I want to see" | Confirm listing → pick time → create showing in DB |
| `stale-lead-nudge` | CMO G7 delegation | Send WA to renter after 24h silence |

### 4.4 Automation: Heartbeat (~30min)
Keeps WA session alive and reports health:
1. Check Baileys connection status
2. If disconnected → paperclip plugin → Paperclip issue "WA Session Down"
3. Log to `ai_runs` with `agent_name: openclaw-heartbeat`

### 4.5 Gateway REST API (Outbound Messaging)
How Paperclip agents send WA messages:

```bash
curl -s -X POST \
  -H "Authorization: Bearer h7MjQwcIxQzlehyAp1PgOTE6J5qOHiDc" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: paperclip-g7-{lead_uuid}" \
  -d '{
    "channel": "whatsapp",
    "to": "+573001234567",
    "text": "Hola! Tu listado no ha sido actualizado en 7 dias. Lo revisamos?"
  }' \
  https://openclaw-vmjg.srv1641664.hstgr.cloud/api/messages
```

### 4.6 Skills (Domain Knowledge Files)
Skills are markdown files with YAML frontmatter that guide OpenClaw's response style.

**We write our own — NOT from ClawHub** (CVE-2026-25253 RCE risk — see 19C).

---

## 5. Plugins

### 5.1 Installed Plugins

| Plugin | Purpose | Status |
|--------|---------|--------|
| `paperclip` | `pluginHooks.messageReceived` fires on inbound WA → creates Paperclip issue; CEO can delegate via `/hooks/agent` | Installed |
| `browser-automation` | Internal market data scraping, NOT for user-facing flows | Installed |

### 5.2 Adding: Apify Plugin (Task 15C)
`@apify/apify-openclaw-plugin` — structured social scraping for lead discovery. Hermes asks OpenClaw to run scraper actors for Instagram, Facebook Groups, LinkedIn, Google Maps.

### 5.3 Do NOT Install from ClawHub
ClawHub is the public plugin registry. **Security:** ClawHavoc campaign + CVE-2026-25253 (RCE in plugins < v1.1.4). Policy: no ClawHub plugins until security audit confirms version is patched. All approved third-party skills pinned by git hash, not floating versions. See 19C.

---

## 6. Skills Strategy

### 6.1 Custom Skill: mde-rental-concierge

**Location:** `/docker/openclaw-vmjg/data/.openclaw/skills/mde-rental-concierge/SKILL.md`

```yaml
---
name: mde-rental-concierge
version: 1.0.0
triggers:
  - apartment
  - apartamento
  - Laureles
  - El Poblado
  - Envigado
  - cuanto cuesta
  - how much
  - stay
  - alquiler
---
```

**Skill content covers:**
1. **Domain vocab** — Medellin neighborhoods (El Poblado, Laureles, Envigado, Belen, Sabaneta), furnished vs long-term, COP vs USD conversion caution
2. **Forbidden claims** — No legal advice, no visa guarantees, no official government statements without source
3. **Handoff rules** — Escalate when: confidence < 0.3, user mentions "contract/lawsuit/refund/visa", user frustrated 2+ turns, payment >$500
4. **Tool calls** — Prefer Supabase edge invocations for listing data; never hallucinate listing IDs or addresses
5. **Bilingual** — Default Spanish first; switch to English when user writes English

### 6.2 Additional Skills Needed (Gaps)

| Skill | Purpose | Task |
|-------|---------|------|
| `mde-rental-concierge` | Core domain behavior | 08I |
| `mde-lead-capture-flow` | Task flow YAML for new contact intake | 08I extension |
| `mde-showing-scheduler` | Task flow YAML for showing booking | 08B scope |

---

## 7. How All Tools Work Together

```
INBOUND (User → AI → Reply):

WhatsApp User (Colombia)
    │ "Busco apartamento en Laureles"
    ▼
OpenClaw (Baileys session on Hostinger VPS)
    │ Skill: mde-rental-concierge (domain context)
    │ Plugin: paperclip → Paperclip issue (audit trail)
    │
    ▼
Supabase edge: whatsapp-webhook
    │ generates x-correlation-id
    │
    ├── ai-router: RENTAL_SEARCH, language: es
    │
    ├── ai-chat (Gemini 1.5 Flash):
    │     tool: search_apartments({ area:"Laureles" })
    │     → 3 listings returned
    │     logs: ai_runs { agent_name, tokens, correlation_id }
    │
    ▼
OpenClaw REST: POST /api/messages
    │ Idempotency-Key: edge-reply-{uuid}
    ▼
WA User receives:
  "Encontre 3 en Laureles
   [Apt 1] $2.8M/mes - 2 hab
   [Apt 2] $3.1M/mes - 3 hab
   Ver detalles de alguno?"

OUTBOUND (Paperclip → WA notification):

Paperclip CEO (G7: lead untouched 24h)
    │ delegates to openclaw_gateway adapter
    ▼
POST /hooks/agent
    │ { task: "send_wa_message", to: renter_phone, text: "..." }
    ▼
OpenClaw → Baileys → WA User

LEAD DISCOVERY (Apify scraping):

Paperclip heartbeat → Hermes → OpenClaw Apify plugin
    │ run: facebook-groups-scraper("Medellin Rentals group")
    ▼
50 structured leads → Supabase marketing.contacts
    │ scored by Hermes → top leads → CMO outreach queue
```

---

## 8. User Stories

| As a... | I want to... | So that... |
|---------|-------------|------------|
| Renter (Colombia) | Ask about apartments in Spanish via WhatsApp | I can search without downloading an app |
| Renter | Get listing cards and quick-reply buttons in WA | I can see options without clicking links |
| Host (Maria) | Receive WhatsApp reminders about upcoming showings | I do not miss appointments |
| sk | Have CEO send WA notifications for G1 payments >$500 | I am alerted immediately without checking Paperclip |
| CMO agent | Send G7 stale-lead nudges via WhatsApp after 24h | Leads re-engage before they go cold |
| OpsManager | Know when WA session disconnects | I can reconnect before users hit silence |
| Developer | See all WA messages correlated with `ai_runs` | I can debug why AI said something for any conversation |

---

## 9. Workflows

### Workflow 1: New Renter Inquiry (Most Common)
1. Renter texts mde WA number
2. OpenClaw receives via Baileys, applies `mde-rental-concierge` skill
3. `paperclip` plugin creates Paperclip issue (audit trail)
4. OpenClaw tool call → Supabase `whatsapp-webhook` edge
5. Edge generates `x-correlation-id`, classifies intent (RENTAL_SEARCH)
6. `ai-chat` calls `search_apartments` → Supabase listings query
7. AI formats response with listings + COP prices
8. Edge POSTs back to OpenClaw `/api/messages` with `Idempotency-Key`
9. OpenClaw sends via Baileys; `ai_runs` logged

### Workflow 2: CEO G1 Payment Alert via WA
1. CEO heartbeat: `SELECT id, amount FROM payments WHERE status='pending' AND amount > 500`
2. Match found → G1 gate triggered
3. CEO delegates to `openclaw_gateway` adapter: `POST /hooks/agent`
4. OpenClaw sends WA to sk: "Payment approval needed: $750 for listing 42"
5. sk replies "approve" → incoming WA
6. `paperclip` plugin → Paperclip: resolve G1 approval item

### Workflow 3: Lead Capture Task Flow (New WA Contact)
1. Unknown WA contact messages
2. OpenClaw: no lead record → trigger `lead-capture` task flow
3. Flow asks: name → neighborhood → budget (3 steps)
4. Supabase edge: `INSERT INTO leads` with captured data
5. CMO notified via Paperclip issue → approval card to reach out

### Workflow 4: Social Lead Discovery (Weekly)
1. Paperclip Monday heartbeat → Hermes receives "discover leads" task
2. Hermes asks OpenClaw Apify plugin to scrape Facebook Groups ("Medellin Rentals")
3. Apify returns 50+ structured posts: name, text, timestamp
4. Hermes scores each: location signals, budget hints, move-in timeline
5. Top 10 leads saved to `marketing.contacts` with `source_actor: facebook-groups-scraper`

---

## 10. Task Coverage Map

| Task File | ID | Priority | What It Does |
|-----------|-----|----------|-------------|
| `openclaw/prd-open-claw.md` | — | — | This PRD (strategy + decisions) |
| `openclaw/05H-openclaw-gateway-adapter.md` | E5-007 | P2 | Wire `openclaw_gateway` Paperclip adapter — outbound messaging |
| `openclaw/05M-openclaw-gateway-health-stub.md` | E5-012 | P1 | Health check, idempotency, security audit gate |
| `openclaw/08B-openclaw-whatsapp-adapter.md` | E8-002 | P2 | Full WhatsApp AI adapter — Phases 2-4 |
| `openclaw/08G-openclaw-correlation-observability.md` | E8-006 | P1 | Correlation IDs end-to-end: WA → edge → `ai_runs` |
| `openclaw/08I-openclaw-mde-skills.md` | E8-008 | P2 | Write `mde-rental-concierge` skill pack |
| `openclaw/08K-openclaw-provider-strategy.md` | E8-010 | P1 | Provider strategy decision (transport-only confirmed) |
| `openclaw/15C-apify-openclaw-integration.md` | 15C | P1 | Apify plugin for social lead scraping |
| `openclaw/19C-clawhub-skill-safety-review.md` | 19C | P0 | CVE-2026-25253 allowlist + audit gate |
| `whatsapp/08E-multi-channel.md` | E8-001 | P2 | Epic coordination: web SSE + WA channels |
| `whatsapp/08F-whatsapp-ingress-architecture.md` | E8-005 | P1 | ADR: Baileys vs Infobip — one primary path |
| `whatsapp/08H-openclaw-wa-adapter-phase1.md` | E8-007 | P1 | Phase 1 echo adapter — prove path before AI chain |
| `whatsapp/15G-whatsapp-outreach-engine.md` | 15G | P1 | Automated WA outreach campaigns |
| `whatsapp/19A-openclaw-whatsapp-pairing-runbook.md` | 19A | P0 | QR pairing + session management runbook |

**Dependency order:**
```
19C (security gate)
  ↓
08F (ingress decision) → 08K (provider strategy) → 05M (health stub)
                                                         ↓
                                                    08H (Phase 1 echo) → 08B (Phases 2-4)
                                                    05H (outbound adapter)
                                                    08I (custom skills) → 08B
                                                    08G (correlation IDs)
```

### Are the whatsapp/ Tasks OpenClaw?

| File | OpenClaw? | Why |
|------|-----------|-----|
| `08E-multi-channel.md` | Partly | Epic index for all channels (web + WA); OpenClaw is the WA piece |
| `08F-whatsapp-ingress-architecture.md` | Yes | Directly decides Baileys vs Infobip |
| `08H-openclaw-wa-adapter-phase1.md` | Yes | Phase 1 of OpenClaw WA adapter |
| `08D-human-handover-escalation.md` | No | Supabase edge + frontend; not OpenClaw |
| `15G-whatsapp-outreach-engine.md` | Yes | WA outreach uses OpenClaw for delivery |
| `19A-openclaw-whatsapp-pairing-runbook.md` | Yes | QR pairing is OpenClaw Baileys setup |

---

## 11. Success Criteria

- [ ] WA message from test number receives AI apartment listing response within 5s
- [ ] `ai_runs` record exists for every WA AI interaction with `agent_name: whatsapp-ai`
- [ ] `x-correlation-id` traces from inbound WA hook through `ai_runs.metadata`
- [ ] `openclaw security audit` passes before mde WA number shared with users
- [ ] `mde-rental-concierge` skill active; responses never hallucinate listing IDs
- [ ] Paperclip CEO sends G7 stale-lead WA nudge via `openclaw_gateway` adapter
- [ ] WA session disconnect triggers Paperclip issue within 5 minutes
- [ ] Same `Idempotency-Key` twice = one WA message (not two)
- [ ] Lead capture task flow creates `leads` record with name + area + budget
- [ ] No WA replies to non-allowlisted numbers

---

## 12. Security Rules

1. **No ClawHub skills** — write all skills locally; pin 3rd-party by git hash (see 19C)
2. **dmPolicy: allowlist** — only `allowFrom` numbers get AI replies
3. **`openclaw security audit` before every production rollout**
4. **Tokens in Infisical** — path `/openclaw`, keys: `OPENCLAW_GATEWAY_TOKEN`, `OPENCLAW_HOOKS_TOKEN`
5. **No LLM provider config in OpenClaw** — all AI calls through Supabase edges
6. **`Idempotency-Key` on all message sends** — prevents duplicate WA sends on retry

---

## 13. Environment & Infrastructure

| Resource | Value |
|----------|-------|
| Gateway URL | `https://openclaw-vmjg.srv1641664.hstgr.cloud` |
| VPS IP | `2.24.69.242` |
| Container | `openclaw-vmjg-openclaw-1` |
| Config file | `/docker/openclaw-vmjg/data/.openclaw/openclaw.json` |
| Skills path | `/docker/openclaw-vmjg/data/.openclaw/skills/` |
| Infisical project | `82d12c1d` path `/openclaw` |
| SSH key | `~/.ssh/mde_hostinger_codex_ed25519` |

**VPS quick commands:**
```bash
# Check gateway health
curl -s https://openclaw-vmjg.srv1641664.hstgr.cloud/api/health | jq '.'

# Security audit
docker exec openclaw-vmjg-openclaw-1 openclaw security audit

# WA session status
docker exec openclaw-vmjg-openclaw-1 openclaw channel status whatsapp

# Gateway logs
docker logs openclaw-vmjg-openclaw-1 --tail 100 -f

# Restart gateway
docker restart openclaw-vmjg-openclaw-1
```
