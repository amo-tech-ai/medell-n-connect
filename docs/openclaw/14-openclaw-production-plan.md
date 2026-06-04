# OpenClaw × mdeai — Production Architecture Plan

**Author:** AI Automation Architect
**Date:** 2026-05-07 · **Revised:** 2026-05-07 (v1.1 — verified corrections from 14.1 review)
**Status:** Active — ready for Phase 0 execution
**Research basis:** Live URL verification (80+ sources), official docs, GitHub repos, community listings, security advisories
**Companion docs:** `13-paperclip-mdeai-plan.md`, `100-trio.md`, `02-openclaw-strategy.md`, `14.1-openclaw.md`

> **v1.1 corrections applied:** ClawHub risk upgraded CRITICAL (ClawHavoc campaign, 800+ malicious skills, CVE-2026-25253); Paperclip bug #744 documented; Postiz `upload` step added to Workflows 5/7; Lobster integration added (Section 20); ChatGPT subscription auth added (Section 13); 8 additional use cases added (Section 21); model names `gpt-5.5-thinking` / `gpt-4.1-mini` confirmed invalid — removed from all configs.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What OpenClaw Is](#2-what-openclaw-is)
3. [Verified Features](#3-verified-features)
4. [Best Use Cases for mdeai](#4-best-use-cases-for-mdeai)
5. [OpenClaw Role in mdeai](#5-openclaw-role-in-mdeai)
6. [OpenClaw Features Table](#6-openclaw-features-table)
7. [Recommended Skills / Plugins](#7-recommended-skills--plugins)
8. [Real-World Workflows](#8-real-world-workflows)
9. [Recommended Architecture](#9-recommended-architecture)
10. [Agents to Create](#10-agents-to-create)
11. [Supabase Tables Needed](#11-supabase-tables-needed)
12. [Hostinger Deployment Plan](#12-hostinger-deployment-plan)
13. [OpenAI Configuration](#13-openai-configuration)
14. [Step-by-Step Setup Tasks](#14-step-by-step-setup-tasks)
15. [Testing Plan](#15-testing-plan)
16. [Production Readiness Checklist](#16-production-readiness-checklist)
17. [Success Criteria](#17-success-criteria)
18. [Risks and Red Flags](#18-risks-and-red-flags)
19. [Final Recommendation](#19-final-recommendation)

---

## 1. Executive Summary

OpenClaw is the execution engine mdeai needs — it is the "hands" that reach into the real world
via WhatsApp, Telegram, browser automation, and 24/7 skill execution. It is NOT a governance
tool (that is Paperclip) and NOT a reasoning engine (that is Hermes). OpenClaw turns approved
instructions into real-world actions.

**What this plan delivers:**
- 5 specialized OpenClaw agents (concierge, outreach, discovery, events, content)
- 9 real-world automation workflows connected to Supabase, Paperclip, Hermes, and Postiz
- Full production deployment on the existing Hostinger VPS (Docker project `openclaw-vmjg`)
- WhatsApp rental concierge answering leads 24/7 in under 60 seconds
- Human-approved daily outreach pipeline (50 qualified contacts → 5–10 engaged leads/day)
- Postiz social publishing triggered by board-approved Paperclip routines

**Key constraint:** Use OpenClaw **only after Paperclip approval gates are active** (15A done).
Every outbound message — WhatsApp, Telegram, or social — must flow through Paperclip's board
before OpenClaw executes it. This is the single most important safety rule.

**Three immediate actions before going live:**
1. Complete `tasks/prompts/advanced/15A-paperclip-security-foundation.md` (fix bypass flags)
2. Pair WhatsApp +14168003103 to OpenClaw (QR scan via VPS dashboard)
3. Rotate gateway token `h7MjQwcIxQzlehyAp1PgOTE6J5qOHiDc` → new secret stored in Infisical

---

## 2. What OpenClaw Is

### Verified Definition

OpenClaw is an **open-source, MIT-licensed, self-hosted AI agent gateway** that connects
26 messaging channels to AI model providers through a persistent Node.js process (gateway)
running on your own hardware.

- **GitHub:** github.com/openclaw/openclaw — 369k stars, 76k forks, 600+ contributors
- **Creator:** Peter Steinberger (founder of PSPDFKit)
- **Runtime:** Node 24 required (Bun is explicitly incompatible for WhatsApp/Telegram)
- **License:** MIT
- **Sponsors:** OpenAI, GitHub, NVIDIA, Vercel, Blacksmith, Convex

### What it is NOT

| Misconception | Reality |
|---|---|
| A chatbot platform | A gateway that connects channels to AI agents |
| A WhatsApp Business API client | Uses Baileys (unofficial WA Web reverse-engineer) |
| A workflow orchestrator | That is Paperclip/Lobster — OpenClaw executes, not plans |
| A multi-tenant SaaS | Designed for one trusted operator per gateway |
| The same org as Postiz | Separate companies; integration via `postiz-agent` CLI |

### Architecture mental model

```
[Channels: WhatsApp, Telegram, Slack, Discord, Signal…]
          ↓
[Gateway: Node 24, port 18789 (internal), 40051 (VPS Docker)]
          ↓
[Agents: skill context + tools + model provider]
          ↓
[Providers: OpenAI, Anthropic, Google, OpenRouter, Ollama…]
          ↓
[Tools: exec, browser, web_search, file_system, canvas, cron…]
          ↓
[Skills: SKILL.md context files from ClawHub / local]
```

---

## 3. Verified Features

> All features below confirmed from official `docs.openclaw.ai` (live fetch, 2026-05-07).
> Features marked ⚠️ are community-claimed but not verified in official docs.

### Channels (26 official)

| Channel | Status | mdeai Use |
|---------|--------|-----------|
| WhatsApp | ✅ Official — Baileys | Concierge, lead follow-up, outreach |
| Telegram | ✅ Official — BotFather | Internal ops, admin alerts, backup channel |
| Slack | ✅ Official — Socket/HTTP mode | Team notifications |
| Discord | ✅ Official — privileged intents | Community management |
| Signal | ✅ Official — signal-cli JSON-RPC | Secure internal comms |
| iMessage | ✅ Official — BlueBubbles | macOS only; skip for VPS |
| IRC | ✅ Official | Legacy; skip |
| Matrix | ✅ Official | Open-source alternative to Slack |
| Mattermost | ✅ Official | Team chat |
| Microsoft Teams | ✅ Official (bundled plugin) | Enterprise clients |
| Nostr | ✅ Official | Web3 comms; skip |
| LINE | ✅ Official | Asian market; skip |
| WeChat | ✅ Official | Chinese market; skip |
| Zalo | ✅ Official | Vietnamese market; skip |
| Instagram DM | ❌ NOT official — `channels/instagram` = 404 | Use postiz-agent for posting |
| LinkedIn DM | ❌ NOT official | Skip for direct outreach |
| TikTok | ❌ NOT official | Use postiz-agent for posting |

### Tool Profiles

| Profile | Tools included | mdeai use |
|---------|----------------|-----------|
| `full` | All tools | Development/testing only |
| `coding` | filesystem, runtime, web, sessions, media | Hermes-facing agents |
| `messaging` | channel messaging + session status | WhatsApp concierge agent |
| `minimal` | session status only | Monitoring agents |

### Tools available (verified)

- **exec** — shell command execution (critical for calling Supabase CLI, postiz-agent CLI)
- **browser** — headless browser (Playwright-backed) for form-filling, scraping, screenshots
- **web_search** — search engine queries
- **web_fetch** — HTTP requests to external APIs
- **file_system** — read/write local files (for session memory, skill context)
- **canvas** — agent-editable UI rendered at `/__openclaw__/canvas/`
- **cron** — built-in task scheduling (alternative to external cron)
- **media** — image/audio processing, transcription, TTS

### Skills system

- Install: `openclaw skills install <slug>`
- Source: ClawHub registry (52.7k tools, 180k users, 12M downloads)
- Format: `SKILL.md` markdown files injected as context at agent start
- Priority: workspace → project → personal → managed → bundled
- No restart needed for skills (hot-load); plugins require restart

### Plugins system

- Install: `openclaw plugins install clawhub:<name>` or `npm:<pkg>` or `git:<repo>`
- Format: native code extensions (new channels, tools, providers)
- Require gateway restart after install

### Providers (40+)

OpenAI, Anthropic, Google, OpenRouter, Ollama, Azure OpenAI, Mistral, Cohere, Groq,
Together AI, Replicate, Fireworks, and 30+ more — all configured under `agents.defaults.model`
in `openclaw.json`.

### Gateway API

The gateway exposes an **OpenAI-compatible REST API**:
- `POST /v1/chat/completions`
- `GET /v1/models`
- `POST /v1/embeddings`
- `POST /v1/responses`

This means external tools can use OpenClaw's gateway as an OpenAI-compatible endpoint.

---

## 4. Best Use Cases for mdeai

> Ranked by revenue impact and implementation safety.

| # | Use Case | Revenue Impact | Safety | Ready Now? |
|---|----------|----------------|--------|------------|
| 1 | WhatsApp rental concierge (respond to leads < 60s) | HIGH | MEDIUM | After WhatsApp pairing |
| 2 | Approved WhatsApp outreach (5–10 msgs/day, human approved) | HIGH | HIGH | After 15A + pairing |
| 3 | Event promotion via Telegram announcements | MEDIUM | HIGH | After Telegram bot setup |
| 4 | Social post scheduling trigger → Postiz | MEDIUM | HIGH | After Postiz API test |
| 5 | Browser-based lead discovery (public LinkedIn/FB pages) | MEDIUM | MEDIUM | After install actionbook |
| 6 | Supabase CRM sync (write delivery confirmations) | MEDIUM | HIGH | After supabase skill |
| 7 | Sponsor outreach (personalized email/WA, 3/day max) | HIGH | MEDIUM | After 15A + Paperclip gate |
| 8 | No-show recovery (WA reminder 24h before event) | MEDIUM | HIGH | After WhatsApp pairing |
| 9 | Instagram signal collection (read-only scrape of public posts) | LOW | MEDIUM | After actionbook + review |

---

## 5. OpenClaw Role in mdeai

### Role matrix

| System | Role | Owns | Must NOT own |
|--------|------|------|--------------|
| **Paperclip** | Manager/Governance | Task lifecycle, approvals, budgets, heartbeats, audit log | Direct user messaging, raw social posting |
| **Hermes** | Intelligence/Research | Reasoning, scoring, memory, search, delegation | Final DB writes without Edge Fn guardrail |
| **OpenClaw** | Execution/Actions | WhatsApp/Telegram execution, browser automation, skill execution, approved outreach | Reasoning about what to send; governance; DB source of truth |
| **Postiz** | Publishing | Scheduled social posts, 28+ platform OAuth, analytics | Outreach, scraping, CRM, WhatsApp |
| **Supabase** | Source of Truth | Canonical data, auth, RLS, edge functions, realtime | Autonomous reasoning, long-running agents |
| **OpenAI** | Model Provider | Language models, embeddings, image gen, TTS | Business logic, data storage |

### What OpenClaw executes (and who approves it)

```
Approved by Paperclip board ──→ OpenClaw executes
Scored by Hermes ────────────→ OpenClaw personalizes
Written to Supabase ─────────→ OpenClaw reads job queue
Done by OpenClaw ────────────→ Supabase logs result
```

### Integration contract

OpenClaw receives jobs via **HMAC-signed webhook** from Supabase edge functions. It never:
- Initiates outreach without an approved Paperclip task
- Writes directly to Supabase without going through an edge function
- Holds canonical data — all state lives in Supabase

---

## 6. OpenClaw Features Table

| Feature | Description | mdeai Use Case | Priority | Risk | Score /100 |
|---------|-------------|----------------|----------|------|------------|
| WhatsApp channel (Baileys) | Bidirectional WA messaging via QR-paired number | Rental concierge, lead follow-up, event reminders | P0 | HIGH — ToS violation, ban risk | 82 |
| Telegram channel | Official bot API — safe, fast, no ban risk | Admin alerts, ops notifications, backup concierge | P0 | LOW | 95 |
| Browser automation | Playwright-backed headless browser for scraping, forms | Lead discovery from public pages, sponsor research | P1 | MEDIUM — site ToS | 78 |
| exec tool | Shell commands on VPS host | Run postiz-agent CLI, Supabase CLI, scripts | P0 | LOW (sandboxed) | 92 |
| web_fetch tool | HTTP calls to external APIs | Hit Supabase REST API, Postiz API, Hermes API | P0 | LOW | 94 |
| Skills system | SKILL.md context injection | Domain-specific behavior (real estate, Medellín) | P0 | LOW | 90 |
| Cron tool | Built-in scheduling | Daily lead discovery trigger, 7-day follow-up | P1 | LOW | 88 |
| OpenAI-compatible API | Gateway exposes /v1/chat/completions | Hermes can use OpenClaw gateway as endpoint | P2 | LOW | 75 |
| Multi-agent support | Multiple isolated agent sessions | Parallel: concierge + discovery + events agents | P1 | LOW | 85 |
| Canvas UI | Agent-editable web UI at /canvas/ | Admin dashboard for reviewing agent outputs | P2 | LOW | 70 |
| Plugin system | Code extensions for new channels/tools | Custom Supabase webhook plugin | P1 | MEDIUM (unaudited) | 72 |
| Session memory | Persistent Markdown files per conversation | Remember tenant preferences across weeks | P1 | LOW | 88 |
| Tool profiles | Restrict agent tool access | messaging profile for WA agent (no exec) | P0 | LOW | 95 |
| Hot config reload | Update config without gateway restart | Change dmPolicy, model, tools live | P1 | LOW | 80 |
| Paperclip adapter | Native OpenClaw ↔ Paperclip governance integration | Board approval before every outbound message | P0 | LOW | 96 |
| OpenRouter provider | Use any model via OpenRouter (Anthropic, Google, Meta…) | Cost optimization, fallback model | P1 | LOW | 88 |
| postiz-agent (via exec) | CLI to schedule posts to 28+ social platforms | Postiz publishing triggered by Paperclip approval | P1 | LOW | 90 |
| signal-cli channel | Signal messaging (secure) | Encrypted internal ops channel | P3 | LOW | 60 |
| media tool | Transcription, TTS, image processing | Voice note transcription from WA messages | P2 | LOW | 72 |
| Slack channel | Team notifications via Socket mode | Internal team alerts for new high-score leads | P2 | LOW | 74 |

---

## 7. Recommended Skills / Plugins

> Top 20 ranked by mdeai impact. Verified from ClawHub, awesome-openclaw-skills, clawskills.sh.

### Top 20 Skills/Plugins

| Rank | Name | Source | What it does | mdeai Need | Priority | Safety |
|------|------|--------|--------------|------------|----------|--------|
| 1 | `supabase` | stopmoclay/clawhub | DB ops, vector search, storage via Supabase REST API | CRM writes, lead storage | P0 | ✅ LOW |
| 2 | `firecrawl` | installed ✅ | Web scraping with markdown extraction | Competitor/event research | P0 | ✅ LOW |
| 3 | `super-browser` | installed ✅ | Full browser automation with Playwright | Form filling, public page scraping | P0 | MEDIUM |
| 4 | `actionbook` | clawhub | Browser automation, screenshots, form actions | Lead discovery from LinkedIn/FB public pages | P1 | MEDIUM |
| 5 | `apollo-io` | installed ✅ | Apollo.io contact enrichment API | Sponsor contact data | P1 | ✅ LOW |
| 6 | `crawl4ai` | installed ✅ | AI-powered web crawling | Competitor and venue research | P1 | ✅ LOW |
| 7 | `mrscraper` | installed ✅ | Scheduled web scraping | Recurring public data harvest | P1 | MEDIUM |
| 8 | `postiz-agent` (npm) | gitroomhq/postiz-agent | CLI: schedule posts to 28+ platforms | Trigger Postiz from Paperclip approval | P0 | ✅ LOW |
| 9 | `deploy-kit` | hugosbl/clawhub | Deploy to Vercel, Railway, Supabase via CLI | Agent-driven deploys | P2 | ✅ LOW |
| 10 | `stack-scaffold` | guifav/clawhub | Full-stack scaffolding — Next.js, Supabase, Vercel | Project scaffolding tasks | P3 | ✅ LOW |
| 11 | `vercel-cli-skill` | leonaaardob/clawhub | Vercel project management and deployment | Auto-deploy on approval | P2 | ✅ LOW |
| 12 | `crabbox` | openclaw/crabbox (native plugin) | Remote testbox runner for cloud CI | Offload heavy compute tasks to cloud | P2 | ✅ LOW |
| 13 | `academic-research` | clawhub | Research via OpenAlex API | Market research, event discovery | P3 | ✅ LOW |
| 14 | WhatsApp skills bundle | clawskills.sh/openclaw/integrations/whatsapp (34 skills) | WA-specific skill extensions | Lead qualification scripts | P1 | MEDIUM |
| 15 | OpenAI skills bundle | clawskills.sh/openclaw/integrations/openai (193 skills) | OpenAI tool extensions | Enhanced reasoning, image gen | P1 | ✅ LOW |
| 16 | `mdeai-concierge` (custom) | local skill | Real estate + events domain knowledge for Medellín | Branded concierge persona | P0 | ✅ LOW |
| 17 | `mdeai-outreach` (custom) | local skill | Compliance rules, suppression checks, tone guide | Safe outreach governance | P0 | ✅ LOW |
| 18 | `mdeai-neighborhoods` (custom) | local skill | El Poblado, Laureles, Sabaneta pricing, vibe | Hyper-local concierge context | P1 | ✅ LOW |
| 19 | Instagram read-only (community) | clawskills.sh/openclaw/integrations/instagram (78 skills) | Public post scraping via Graph API or community tools | Signal collection only — NO posting | P2 | MEDIUM |
| 20 | `apify-ultimate-scraper` | lobehub/skills | Apify integration for enterprise scraping | Large-scale public data harvest | P2 | MEDIUM |

### Install commands

```bash
# Already installed (verify with: openclaw skills list)
# firecrawl, super-browser, crawl4ai, mrscraper, apollo-io

# Install immediately (Phase 1)
openclaw skills install supabase
openclaw skills install actionbook
npm install -g postiz-agent  # separate CLI, not ClawHub skill

# Install Phase 2
openclaw plugins install clawhub:crabbox

# Create local skills (Phase 1)
mkdir -p ~/.openclaw/skills/mdeai-concierge
cat > ~/.openclaw/skills/mdeai-concierge/SKILL.md << 'EOF'
# mdeai Concierge

You are the mdeai AI concierge for Medellín, Colombia...
# (see Section 10 for full skill content)
EOF
```

---

## 8. Real-World Workflows

### Workflow 1: Daily Contact Discovery

**Goal:** Find 50 new qualified rental leads and sponsor contacts per day.
**Trigger:** Paperclip routine `discover-leads` at 08:00 COT (13:00 UTC).
**Human approval:** Yes — Paperclip board must approve before any contact is stored or messaged.

```
08:00 → Paperclip fires routine `discover-leads`
    ↓
OpenClaw agent `discovery` wakes:
  1. Runs `supabase` skill → reads marketing.campaigns (active ones)
  2. Calls Hermes API → gets current scoring weights
  3. Uses firecrawl skill → scrapes public event pages (Eventbrite COL, MDE events FB group)
  4. Uses actionbook → reads public LinkedIn company pages (venue operators)
  5. Uses apollo-io → enriches company contacts with email/phone
  6. Uses web_fetch → calls Hermes scoring endpoint with each contact
  7. Filters: score ≥ 70 → POST to Supabase edge fn `discovery-ingest`
    ↓
Supabase `discovery-ingest` edge fn:
  - Deduplicates against marketing.contacts (email + phone)
  - Checks suppression_list
  - Inserts with status='pending_review'
  - Creates Paperclip task for each new contact (via Paperclip API)
    ↓
Paperclip board notification → human reviews batch → approves/rejects
    ↓ (approved contacts)
Status updated to 'approved' → eligible for outreach workflow
```

**Output:** 20–50 new contacts/day in Supabase, 10–20 board-approved for outreach.

---

### Workflow 2: Instagram Signal Collection

**Goal:** Monitor public Instagram posts mentioning Medellín events, venues, and apartments.
**Method:** Read-only scraping of PUBLIC posts only via Graph API or community skill.
**Trigger:** Every 6 hours.
**Human approval:** No approval needed for read-only collection. Approval required before contacting anyone found.

```
Every 6h → OpenClaw agent `signal-collector`:
  1. Uses Instagram community skill → searches public posts:
     - hashtags: #medellín #apartamentosmedellin #eventsmedellin #poblado
     - public venue/event accounts (no auth required for public data)
  2. Extracts: account handle, follower count, post type, engagement, bio link
  3. Filters: followers > 500, engagement > 2%, profile is business or creator
  4. POST → Supabase edge fn `signal-ingest`:
     - Creates marketing.social_profiles record (if new)
     - Links to marketing.contacts if email found in bio
     - Sets signal_source='instagram_public'
  5. Hermes scores new profiles → score ≥ 65 → creates Paperclip discovery task
```

**Output:** 10–30 qualified Instagram accounts/day for human review.
**Safety rule:** Zero DMs sent from this workflow. Reading public data only.

---

### Workflow 3: WhatsApp Lead Response (Concierge)

**Goal:** Respond to inbound WhatsApp rental inquiries within 60 seconds, 24/7.
**Trigger:** Inbound WhatsApp message on +14168003103.
**Human approval:** No approval for responses (reactive, not proactive). Escalation gates for bookings.

```
Tenant sends WA message → OpenClaw gateway receives it
    ↓
Agent `concierge` activates (tool profile: messaging):
  1. mdeai-concierge SKILL.md injected (Medellín context, pricing, neighborhoods)
  2. mdeai-outreach SKILL.md injected (compliance rules, tone)
  3. web_fetch → Supabase REST API: GET /marketing/contacts?phone=<sender>
     - If existing contact: load prior conversation context from whatsapp_threads table
     - If new: create lead record, status='inbound_wa'
  4. web_fetch → Hermes scoring API: score this lead (budget signals from message)
  5. web_fetch → Supabase REST API: GET apartments matching criteria
  6. Compose reply: top 3 matches with photos, prices, neighborhoods
  7. Send WA reply (text + media links)
  8. web_fetch → Supabase edge fn `wa-delivery-log`:
     - Logs message sent, timestamp, thread_id, score
  9. If tenant says "book" or "visit" → create Paperclip task for human follow-up
```

**Output:** < 60s response time, 24/7. Lead record created in Supabase. Human notified via Paperclip for booking intent.

---

### Workflow 4: Sponsor Outreach

**Goal:** Send personalized first-touch outreach to board-approved sponsor prospects.
**Trigger:** Paperclip routine `qualify-sponsors` at 10:00 COT (15:00 UTC).
**Human approval:** DOUBLE approval required — once for prospect list, once for each individual message.

```
10:00 → Paperclip routine fires
    ↓
OpenClaw agent `outreach`:
  1. GET → Supabase: marketing.contacts WHERE status='approved' AND type='sponsor'
     AND last_contacted IS NULL AND in_suppression_list=false
  2. Load → Paperclip task list: any task with label 'sponsor-outreach-approved'
  3. For each approved contact (max 3/day):
    a. web_fetch → Hermes: personalize message template using contact's:
       - Company name, industry, event history, social following
       - mdeai event ROI data from previous sponsors
    b. POST draft to Paperclip comment: "DRAFT MESSAGE FOR [company]:" + message
    c. Wait for board approval (DM_POLICY: pairing, operator must approve)
    d. On approval: send WhatsApp (if phone) OR trigger email edge fn
    e. Log to Supabase: outreach_messages (contact_id, channel, sent_at, message_hash)
    f. Paperclip task → status: 'outreach_sent'
  4. Update contact: last_contacted=now(), status='outreach_sent'
```

**Output:** 3 personalized sponsor messages/day, 100% board-approved, fully logged.

---

### Workflow 5: Event Promotion

**Goal:** Announce new mdeai events via WhatsApp broadcast and trigger Postiz social posts.
**Trigger:** Host publishes event via wizard → Supabase webhook → Paperclip task created.
**Human approval:** Yes — Paperclip board approves the announcement content before send.

```
Host publishes event → Supabase realtime fires → Edge fn `event-promote-trigger`:
  1. Creates Paperclip task: "Promote event [event_name]" with event data
  2. Agent `content` reads task via heartbeat
    ↓
Agent `content`:
  1. web_fetch → Supabase: GET event details (name, date, venue, ticket link, image)
  2. Calls Hermes: "Draft 3 social posts + 1 WhatsApp announcement for this event"
  3. POSTs drafts to Paperclip as task comments
    ↓
Paperclip board approves → OpenClaw receives approval signal:
  1. Download event image from Supabase Storage to /tmp/event-image.jpg
     exec → `postiz upload /tmp/event-image.jpg` → returns media_id
     ⚠️ Required: Instagram + TikTok reject external URLs — must upload first
  2. exec → `postiz-agent posts:create` for each approved social post using media_id
     (IG, FB, TikTok, LinkedIn via Postiz connections)
  2. WhatsApp broadcast to opted-in contacts (allowlist only):
     "🎉 New event: [name] — [date] — [venue] — 🎟️ [link]"
  3. Telegram channel post (no approval needed for own channel)
  4. Log to Supabase: postiz_jobs + social_posts tables
```

**Output:** Event live on 4+ social platforms + WhatsApp broadcast to opted-in list.

---

### Workflow 6: Rental Lead Follow-up

**Goal:** Follow up on leads who expressed interest but didn't book within 24 hours.
**Trigger:** Supabase cron or Paperclip routine `follow-up-stale-leads` at 09:00 COT.
**Human approval:** Message templates pre-approved; individual sends auto-approved if template used exactly.

```
09:00 → Paperclip routine fires
    ↓
Agent `outreach`:
  1. GET → Supabase: marketing.contacts WHERE:
     - status = 'inbound_wa' AND created_at < now() - INTERVAL '24 hours'
     - AND follow_up_count < 2 AND in_suppression_list = false
  2. For each (max 10/day):
    a. Load conversation context from whatsapp_threads (what they asked about)
    b. Hermes: generate personalized follow-up (references their original request)
    c. Check: does personalized message match pre-approved template? If not → Paperclip approval
    d. Send WA: "Hi [name]! Still looking for [neighborhood] apartment? Here's an offer..."
    e. Log: outreach_messages, increment follow_up_count
  3. After 2 follow-ups: status → 'cold' (no more outreach)
```

**Output:** 10 follow-ups/day, < 2 per lead, full suppression enforcement.

---

### Workflow 7: Postiz Publishing

**Goal:** Schedule board-approved social content to 4+ platforms via Postiz.
**Trigger:** Paperclip routine `generate-content` at 07:00 COT. Postiz queues posts for optimal times.
**Human approval:** Full Paperclip board approval before any post is scheduled.

```
07:00 → Paperclip routine `generate-content`
    ↓
Agent `content`:
  1. GET → Supabase: marketing.campaigns WHERE status='active' AND type='social'
  2. Hermes: "Draft 3 social posts for today" (IG captions, FB text, LinkedIn professional, TikTok hook)
  3. POST drafts to Paperclip as comments (structured as: platform, copy, hashtags, visual_brief)
    ↓
Board approves (or edits in Paperclip) → approval event fires
    ↓
Agent `content` receives approval:
  1. For each approved post with media:
    # Step 1: Download image from Supabase Storage (Instagram/TikTok require uploaded media)
    exec → curl -o /tmp/post-image.jpg "[supabase storage URL]"
    exec → MEDIA_ID=$(postiz upload /tmp/post-image.jpg)
    # Step 2: Create scheduled post using returned media_id
    exec → postiz-agent posts:create \
      --platform instagram \
      --content "[approved copy]" \
      --schedule "18:00" \
      --media-id "$MEDIA_ID"
    # ⚠️ External image URLs are rejected by Instagram and TikTok — always upload first
  2. Postiz returns job_id → log to postiz_jobs table
  3. Later: postiz-agent analytics:post <job_id> → fetch reach + engagement → update social_posts
```

**Output:** 3 posts/day across 4 platforms. All scheduled. All logged. All board-approved.

---

### Workflow 8: Supabase CRM Sync

**Goal:** Every OpenClaw action (send, receive, fail) is logged in Supabase within 5 seconds.
**Trigger:** Every outbound/inbound event in OpenClaw.
**Human approval:** None — this is observability, not action.

```
OpenClaw agent executes any action →
  1. web_fetch → Supabase edge fn `openclaw-delivery-webhook`:
     POST {
       agent_id, action_type, contact_id, channel, status,
       message_hash, timestamp, metadata
     }
     Headers: X-OpenClaw-Signature: HMAC-SHA256(body, OPENCLAW_WEBHOOK_SECRET)
    ↓
Edge fn `openclaw-delivery-webhook`:
  1. Verify HMAC signature (reject if invalid)
  2. Upsert → agent_runs table (idempotent on message_hash)
  3. Update → contacts table (last_contacted, status, delivery_status)
  4. If status='failed': create Paperclip error task
  5. If status='reply_received': trigger Paperclip task for human review
```

**Output:** Real-time CRM. Every action traceable. No data loss.

---

### Workflow 9: Paperclip Approval Gate

**Goal:** Nothing leaves OpenClaw without human approval via Paperclip board.
**This is not a separate workflow — it wraps every other workflow.**

```
Agent drafts outbound action →
  1. POST → Paperclip API:
     /api/companies/{company_id}/issues (create task)
     {
       title: "APPROVE: [action description]",
       description: "[full draft content]",
       labels: ["needs-approval", "openclaw-action"],
       assignee: "CEO agent"
     }
  2. Agent enters waiting state (checks Paperclip task status every 30s)
    ↓
Human reviews in Paperclip dashboard → approves or rejects
    ↓
Approved: Paperclip task status → 'in_progress' / 'done'
    ↓
Agent detects approval via Paperclip heartbeat or webhook:
  3. Executes the approved action
  4. Updates Paperclip task → 'closed'
  5. Logs to Supabase

Rejected: Agent logs rejection → contact status='rejected' → no outreach
```

**Approval SLA:** Human response expected within 30 minutes. After 4 hours without approval → task escalates. After 24 hours → auto-reject (contact moves to 'approval_timeout' status).

---

## 9. Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  DATA SOURCES                                                            │
│  Instagram public posts · LinkedIn public pages · Eventbrite COL        │
│  Facebook public groups · Google Maps listings · Apollo.io              │
└──────────────────────────┬──────────────────────────────────────────────┘
                           ↓ firecrawl / actionbook / apollo-io
┌──────────────────────────▼──────────────────────────────────────────────┐
│  EXECUTION LAYER — OpenClaw VPS (openclaw-vmjg)                         │
│  Port 40051 (Docker) · Node 24 · 5 agents                               │
│  Skills: supabase, firecrawl, super-browser, actionbook, apollo-io      │
│  Tools: exec, web_fetch, browser, cron, media                           │
└──────┬───────────────────┬───────────────────────────────────────────── ┘
       ↓ scores contacts   ↓ web_fetch + exec
┌──────▼──────┐   ┌────────▼──────────────────────────────────────────────┐
│   HERMES    │   │  SUPABASE (zkwcbyxiwklihegjhuql)                      │
│  Scoring +  │   │  marketing.* tables · edge functions                  │
│  Reasoning  │   │  openclaw-delivery-webhook · discovery-ingest         │
└──────┬──────┘   └────────┬──────────────────────────────────────────────┘
       ↓ scored results    ↓ approved job queue
┌──────▼──────────────────▼──────────────────────────────────────────────┐
│  GOVERNANCE LAYER — Paperclip (paperclip-dy8r)                         │
│  Board approvals · budgets · heartbeats · audit log                    │
│  Routines: discover-leads · generate-content · qualify-sponsors        │
└──────────────────┬────────────────────────────────────────────────────┘
                   ↓ approved
         ┌─────────┴──────────┐
         ↓                    ↓
┌────────▼──────┐    ┌────────▼──────────────────┐
│  OPENCLAW     │    │  POSTIZ (postiz-6buz)      │
│  WhatsApp     │    │  IG · FB · TikTok         │
│  Telegram     │    │  LinkedIn · 25+ more       │
│  Browser      │    │  (postiz-agent CLI)        │
└────────┬──────┘    └───────────────────────────┘
         ↓
┌────────▼──────────────────────────────────────────────────────────────┐
│  REAL WORLD                                                            │
│  Tenants · Sponsors · Hosts · Event attendees                         │
│  WhatsApp +14168003103 · Telegram bot · Social platforms              │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 10. Agents to Create

### Agent 1: Concierge

| Property | Value |
|----------|-------|
| **Name** | `mdeai-concierge` |
| **Purpose** | Respond to inbound WA/Telegram rental inquiries 24/7 |
| **Trigger** | Inbound WhatsApp message on +14168003103 |
| **Tools** | web_fetch (Supabase REST), media (transcription), session memory |
| **Tool profile** | `messaging` |
| **Skills** | mdeai-concierge, mdeai-neighborhoods, supabase |
| **Approval needed?** | No — reactive responses; yes for booking actions |
| **Output** | WA reply with top 3 apartments + photos, lead logged to Supabase |
| **Success metric** | < 60s response time, > 80% lead qualification rate |
| **Model** | `openai/gpt-5.4-mini` (speed) |

**SKILL.md excerpt:**
```markdown
# mdeai Concierge

You are the friendly AI concierge for mdeai.co — Medellín's premier rental and events platform.
You help tenants find apartments in El Poblado, Laureles, Sabaneta, and El Centro.

## Your personality
Warm, helpful, bilingual (English + Spanish). Address locals in Spanish, expats in English.

## Pricing guide
- Studios: $700–$1,200/month USD
- 1BR: $1,000–$2,000/month USD
- 2BR: $1,500–$3,500/month USD
- Furnished premium: add 20–40%

## Neighborhoods
- El Poblado: upscale, expat-friendly, bar scene, coworking spaces
- Laureles: local, quieter, family-friendly, great food scene
- Sabaneta: suburban, newer buildings, best price/quality ratio
- El Centro: authentic, cheapest, best public transit

## Rules
- NEVER quote prices without checking current listings via Supabase API
- NEVER promise availability — always say "subject to availability"
- NEVER collect payment — always link to mdeai.co booking page
- If asked about illegal activities → politely decline and end conversation
- If tenant is aggressive or abusive → escalate to human via Paperclip task
```

---

### Agent 2: Discovery

| Property | Value |
|----------|-------|
| **Name** | `mdeai-discovery` |
| **Purpose** | Find new leads and sponsor contacts from public sources |
| **Trigger** | Paperclip routine `discover-leads` at 08:00 COT |
| **Tools** | browser, web_fetch, exec (firecrawl, actionbook, apollo-io skills) |
| **Tool profile** | `coding` |
| **Skills** | firecrawl, super-browser, actionbook, apollo-io, mrscraper, supabase |
| **Approval needed?** | Yes — Paperclip board approves contact list before outreach |
| **Output** | 20–50 contacts/day in Supabase with score, source, enrichment data |
| **Success metric** | 20+ qualified contacts/day, < 5% duplicate rate |
| **Model** | `openai/gpt-5.5` (research quality) |

---

### Agent 3: Outreach

| Property | Value |
|----------|-------|
| **Name** | `mdeai-outreach` |
| **Purpose** | Execute board-approved WhatsApp/email outreach to leads and sponsors |
| **Trigger** | Paperclip approval event OR routine `qualify-leads` at 09:00 COT |
| **Tools** | web_fetch (Supabase, Hermes, Paperclip API), exec (postiz-agent) |
| **Tool profile** | `messaging` |
| **Skills** | mdeai-outreach, supabase, mdeai-concierge |
| **Approval needed?** | YES — mandatory double approval for outbound messages |
| **Output** | 3–10 WhatsApp messages/day sent, 100% logged, 0 unsuppressed sends |
| **Success metric** | > 20% reply rate, 0 suppression violations, 0 ban events |
| **Model** | `openai/gpt-5.5` (personalization quality) |

**SKILL.md excerpt:**
```markdown
# mdeai Outreach Compliance

## Hard rules — NEVER violate
- NEVER send to a number on the suppression list
- NEVER send more than 1 message per contact per 48 hours
- NEVER send after 9pm or before 8am Medellín time (COT = UTC-5)
- NEVER use WhatsApp broadcast — always individual messages
- ALWAYS include "Reply STOP to unsubscribe" on first message to new contacts
- STOP keyword received → immediately add to suppression_list → log to Supabase
- NEVER send without a verified Paperclip approval task ID

## Tone
Professional, warm, bilingual. Personalized to their business/interests.
Short messages — 3 sentences max for first touch. Ask one clear question.
```

---

### Agent 4: Events

| Property | Value |
|----------|-------|
| **Name** | `mdeai-events` |
| **Purpose** | Promote new events via WhatsApp broadcast, Telegram, and Postiz social |
| **Trigger** | Supabase webhook when event is published (status='active') |
| **Tools** | web_fetch, exec (postiz-agent), media |
| **Tool profile** | `coding` |
| **Skills** | supabase, mdeai-concierge, postiz-agent (via exec) |
| **Approval needed?** | Yes — Paperclip approves announcement content before send |
| **Output** | Event live on 4+ social platforms + WA opt-in broadcast |
| **Success metric** | Event announced within 2h of publish, 4+ platforms hit |
| **Model** | `openai/gpt-5.5` (content quality) |

---

### Agent 5: Content

| Property | Value |
|----------|-------|
| **Name** | `mdeai-content` |
| **Purpose** | Draft daily social content → board approval → Postiz scheduling |
| **Trigger** | Paperclip routine `generate-content` at 07:00 COT |
| **Tools** | web_fetch, exec (postiz-agent), media (image gen) |
| **Tool profile** | `coding` |
| **Skills** | supabase, mdeai-concierge, mdeai-neighborhoods |
| **Approval needed?** | Yes — Paperclip board approves each post before Postiz scheduling |
| **Output** | 3 posts/day scheduled across IG, FB, LinkedIn, TikTok |
| **Success metric** | > 5% engagement rate, 0 posts without approval |
| **Model** | `openai/gpt-5.5` + `openai/gpt-image-2` for images |

---

## 11. Supabase Tables Needed

> Migration: `20260507000100_marketing_schema.sql`
> All tables in `marketing` schema with RLS enabled.

```sql
-- Enable marketing schema
CREATE SCHEMA IF NOT EXISTS marketing;

-- 1. contacts — master contact ledger
CREATE TABLE marketing.contacts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  -- identity
  full_name         text,
  email             text UNIQUE,
  phone             text UNIQUE,   -- E.164 format
  wa_phone          text,          -- WhatsApp number (may differ)
  -- classification
  type              text NOT NULL CHECK (type IN ('lead','sponsor','influencer','venue','media')),
  status            text NOT NULL DEFAULT 'discovered'
                    CHECK (status IN ('discovered','pending_review','approved','outreach_sent',
                                      'replied','qualified','converted','rejected','cold',
                                      'suppressed','approval_timeout')),
  -- scoring
  score             integer CHECK (score BETWEEN 0 AND 100),
  score_breakdown   jsonb,         -- {budget:25, neighborhood:20, ...}
  -- tracking
  follow_up_count   integer DEFAULT 0,
  last_contacted_at timestamptz,
  last_reply_at     timestamptz,
  -- metadata
  source            text,          -- 'instagram_public','apollo','firecrawl','manual'
  source_url        text,
  company_name      text,
  industry          text,
  social_handles    jsonb,         -- {instagram:'@handle', linkedin:'url'}
  notes             text,
  paperclip_task_id text,          -- Paperclip issue ID for approval tracking
  CONSTRAINT no_orphan CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- 2. contact_sources — where each contact was discovered
CREATE TABLE marketing.contact_sources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id  uuid NOT NULL REFERENCES marketing.contacts(id) ON DELETE CASCADE,
  source_type text NOT NULL,       -- 'instagram','linkedin','apollo','firecrawl','manual','wa_inbound'
  source_url  text,
  raw_data    jsonb,               -- original scraped payload
  confidence  numeric(3,2),        -- 0.00 – 1.00
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 3. lead_scores — score history (for Hermes optimization loop)
CREATE TABLE marketing.lead_scores (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id      uuid NOT NULL REFERENCES marketing.contacts(id) ON DELETE CASCADE,
  scored_at       timestamptz NOT NULL DEFAULT now(),
  model_version   text NOT NULL,   -- 'hermes-v1.0', 'hermes-v1.1'
  total_score     integer NOT NULL,
  breakdown       jsonb NOT NULL,  -- per-factor scores
  reasoning       text             -- Hermes explanation
);

-- 4. campaigns — marketing campaigns
CREATE TABLE marketing.campaigns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  name            text NOT NULL,
  type            text NOT NULL CHECK (type IN ('social','whatsapp','email','event','sponsor')),
  status          text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','pending_approval','active','paused','completed','cancelled')),
  target_audience jsonb,           -- Hermes-computed audience criteria
  budget_usd      numeric(10,2),
  paperclip_task_id text,
  start_at        timestamptz,
  end_at          timestamptz,
  metrics         jsonb            -- updated by analytics routine
);

-- 5. outreach_messages — every outbound message sent
CREATE TABLE marketing.outreach_messages (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  contact_id          uuid REFERENCES marketing.contacts(id),
  campaign_id         uuid REFERENCES marketing.campaigns(id),
  channel             text NOT NULL CHECK (channel IN ('whatsapp','telegram','email','instagram_dm')),
  direction           text NOT NULL CHECK (direction IN ('outbound','inbound')),
  status              text NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','approved','sent','delivered','failed','replied')),
  content_hash        text NOT NULL,   -- SHA256 of message content (dedup)
  content_preview     text,            -- first 200 chars
  sent_at             timestamptz,
  delivered_at        timestamptz,
  replied_at          timestamptz,
  openclaw_run_id     text,            -- X-OpenClaw-Run-Id header
  paperclip_task_id   text,
  UNIQUE (content_hash, contact_id, channel)
);

-- 6. whatsapp_threads — conversation state per contact
CREATE TABLE marketing.whatsapp_threads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id      uuid REFERENCES marketing.contacts(id),
  wa_number       text NOT NULL,       -- E.164 of contact
  thread_key      text UNIQUE NOT NULL, -- openclaw session ID
  status          text NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active','human_takeover','closed','blocked')),
  context_summary text,                -- Hermes-generated summary of conversation
  message_count   integer DEFAULT 0,
  last_message_at timestamptz,
  human_assigned_to text               -- staff email if escalated
);

-- 7. social_profiles — Instagram/LinkedIn/TikTok profile records
CREATE TABLE marketing.social_profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id      uuid REFERENCES marketing.contacts(id),
  platform        text NOT NULL CHECK (platform IN ('instagram','linkedin','tiktok','facebook','twitter')),
  handle          text NOT NULL,
  profile_url     text,
  follower_count  integer,
  engagement_rate numeric(5,4),
  bio             text,
  is_business     boolean DEFAULT false,
  last_scraped_at timestamptz,
  UNIQUE (platform, handle)
);

-- 8. social_posts — Postiz-scheduled posts
CREATE TABLE marketing.social_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     uuid REFERENCES marketing.campaigns(id),
  platform        text NOT NULL,
  status          text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','approved','scheduled','published','failed')),
  content         text NOT NULL,
  hashtags        text[],
  media_urls      text[],
  scheduled_at    timestamptz,
  published_at    timestamptz,
  postiz_job_id   text,             -- from postiz-agent posts:create
  -- analytics (fetched post-publish)
  reach           integer,
  impressions     integer,
  engagement      integer,
  clicks          integer
);

-- 9. postiz_jobs — Postiz job queue and status tracking
CREATE TABLE marketing.postiz_jobs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  social_post_id  uuid REFERENCES marketing.social_posts(id),
  postiz_job_id   text UNIQUE NOT NULL,
  platform        text NOT NULL,
  status          text NOT NULL DEFAULT 'queued',
  scheduled_at    timestamptz,
  published_at    timestamptz,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 10. agent_runs — every OpenClaw agent execution logged
CREATE TABLE marketing.agent_runs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz,
  agent_name      text NOT NULL,     -- 'mdeai-concierge','mdeai-discovery', etc.
  trigger_type    text NOT NULL,     -- 'inbound_wa','paperclip_routine','webhook'
  status          text NOT NULL DEFAULT 'running'
                  CHECK (status IN ('running','completed','failed','cancelled')),
  openclaw_run_id text UNIQUE,
  paperclip_task_id text,
  input_summary   text,
  output_summary  text,
  actions_taken   jsonb,             -- array of {type, target, result}
  error_message   text,
  duration_ms     integer,
  model           text,
  tokens_used     integer,
  cost_usd        numeric(10,6)
);

-- 11. approvals — Paperclip approval events
CREATE TABLE marketing.approvals (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  approved_at       timestamptz,
  rejected_at       timestamptz,
  paperclip_task_id text UNIQUE NOT NULL,
  action_type       text NOT NULL,   -- 'outreach','social_post','campaign_launch','broadcast'
  subject_id        uuid,            -- contact_id or campaign_id
  subject_type      text,
  draft_content     text,
  approved_by       text,            -- Paperclip board member email
  rejection_reason  text,
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected','expired'))
);

-- 12. errors — agent error log
CREATE TABLE marketing.errors (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  agent_run_id    uuid REFERENCES marketing.agent_runs(id),
  error_type      text NOT NULL,
  error_message   text NOT NULL,
  stack_trace     text,
  context         jsonb,
  resolved        boolean DEFAULT false,
  resolved_at     timestamptz
);

-- 13. suppression_list — contacts who opted out or were banned
CREATE TABLE marketing.suppression_list (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  phone           text,
  email           text,
  wa_number       text,
  reason          text NOT NULL CHECK (reason IN ('stop_keyword','user_request','bounce',
                                                    'spam_complaint','admin_block','ban_risk')),
  channel         text,             -- 'whatsapp','email','all'
  added_by        text,             -- 'openclaw_auto','human:[email]'
  notes           text,
  CONSTRAINT suppression_identity CHECK (phone IS NOT NULL OR email IS NOT NULL OR wa_number IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_contacts_status ON marketing.contacts(status);
CREATE INDEX idx_contacts_type ON marketing.contacts(type);
CREATE INDEX idx_contacts_phone ON marketing.contacts(phone);
CREATE INDEX idx_contacts_score ON marketing.contacts(score DESC);
CREATE INDEX idx_outreach_contact ON marketing.outreach_messages(contact_id, created_at DESC);
CREATE INDEX idx_outreach_hash ON marketing.outreach_messages(content_hash);
CREATE INDEX idx_agent_runs_agent ON marketing.agent_runs(agent_name, started_at DESC);
CREATE INDEX idx_suppression_phone ON marketing.suppression_list(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_suppression_wa ON marketing.suppression_list(wa_number) WHERE wa_number IS NOT NULL;

-- RLS
ALTER TABLE marketing.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing.outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing.suppression_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing.approvals ENABLE ROW LEVEL SECURITY;

-- Service role only for all marketing tables (agents write via edge functions, never directly)
CREATE POLICY "service_role_only" ON marketing.contacts
  USING ((SELECT auth.role()) = 'service_role');
-- (apply same pattern to all marketing.* tables)
```

---

## 12. Hostinger Deployment Plan

### Current state (verified 2026-05-05)

| Property | Value |
|----------|-------|
| VPS | Hostinger KVM2 · `srv1641664.hstgr.cloud` · 2.24.69.242 |
| Resources | 2 vCPU / 8 GB RAM / 96 GB NVMe |
| OpenClaw Docker project | `openclaw-vmjg` |
| Public URL | `https://openclaw-vmjg.srv1641664.hstgr.cloud` |
| Internal port | 40051 |
| Gateway token | `h7MjQwcIxQzlehyAp1PgOTE6J5qOHiDc` ⚠️ ROTATE NOW |

### Docker Compose spec (`/docker/openclaw-vmjg/docker-compose.yml`)

```yaml
version: '3.9'

services:
  openclaw:
    image: node:24-slim
    container_name: openclaw-gateway
    restart: unless-stopped
    working_dir: /app
    command: >
      sh -c "npm install -g openclaw@latest &&
             openclaw gateway install --no-daemon &&
             openclaw gateway start"
    environment:
      NODE_ENV: production
      OPENCLAW_GATEWAY_PORT: "18789"
      OPENCLAW_GATEWAY_TOKEN: "${OPENCLAW_GATEWAY_TOKEN}"
      OPENCLAW_STATE_DIR: /data/state
      OPENCLAW_HOME: /data/home
      # Model providers
      OPENAI_API_KEY: "${OPENAI_API_KEY}"
      OPENAI_ORG_ID: "${OPENAI_ORG_ID}"
      OPENROUTER_API_KEY: "${OPENROUTER_API_KEY}"
      GEMINI_API_KEY: "${GEMINI_API_KEY}"
      # Tool providers
      FIRECRAWL_API_KEY: "${FIRECRAWL_API_KEY}"
      OXYLABS_USERNAME: "${OXYLABS_USERNAME}"
      OXYLABS_PASSWORD: "${OXYLABS_PASSWORD}"
      APOLLO_API_KEY: "${APOLLO_API_KEY}"
      # Integration secrets
      SUPABASE_URL: "${SUPABASE_URL}"
      SUPABASE_SERVICE_ROLE_KEY: "${SUPABASE_SERVICE_ROLE_KEY}"
      OPENCLAW_WEBHOOK_SECRET: "${OPENCLAW_WEBHOOK_SECRET}"
      PAPERCLIP_API_KEY: "${PAPERCLIP_API_KEY}"
      PAPERCLIP_COMPANY_ID: "${PAPERCLIP_COMPANY_ID}"
      POSTIZ_API_KEY: "${POSTIZ_API_KEY}"
      POSTIZ_API_URL: "https://postiz-6buz.srv1641664.hstgr.cloud"
      HERMES_API_URL: "https://hermes-agent-ifsj.srv1641664.hstgr.cloud"
    ports:
      - "40051:18789"   # external:internal
    volumes:
      - openclaw_data:/data/state
      - openclaw_home:/data/home
      - openclaw_skills:/data/home/.openclaw/skills
      - ./openclaw.json:/data/home/.openclaw/openclaw.json:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:18789/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
    networks:
      - openclaw_net
      - paperclip_bridge   # cross-container comms

  # Backup sidecar
  backup:
    image: alpine:3.19
    container_name: openclaw-backup
    restart: unless-stopped
    environment:
      SUPABASE_URL: "${SUPABASE_URL}"
      SUPABASE_SERVICE_ROLE_KEY: "${SUPABASE_SERVICE_ROLE_KEY}"
    volumes:
      - openclaw_data:/data/state:ro
      - ./scripts/backup.sh:/backup.sh:ro
    command: crond -f -d 8
    networks:
      - openclaw_net

volumes:
  openclaw_data:
  openclaw_home:
  openclaw_skills:

networks:
  openclaw_net:
    driver: bridge
  paperclip_bridge:
    external: true   # shared bridge with Paperclip, Hermes, Postiz containers
```

### Environment variables (`.env`)

```bash
# Gateway auth
OPENCLAW_GATEWAY_TOKEN=<rotate — generate with: openssl rand -hex 32>
OPENCLAW_WEBHOOK_SECRET=<generate with: openssl rand -hex 32>

# Model providers
OPENAI_API_KEY=sk-proj-ej0C_...
OPENAI_ORG_ID=org-...
OPENROUTER_API_KEY=sk-or-...
GEMINI_API_KEY=AIzaSyCA2VvZVf9...

# Tool providers
FIRECRAWL_API_KEY=fc-...
OXYLABS_USERNAME=t7GGpO25...
OXYLABS_PASSWORD=...
APOLLO_API_KEY=...

# Integration
SUPABASE_URL=https://zkwcbyxiwklihegjhuql.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
PAPERCLIP_API_KEY=pcp_88397210...
PAPERCLIP_COMPANY_ID=55141faa-8b30-4731-bfd0-c344eb448713
POSTIZ_API_KEY=<from Postiz dashboard>
HERMES_API_URL=https://hermes-agent-ifsj.srv1641664.hstgr.cloud
```

### openclaw.json (production config)

```json5
{
  gateway: {
    port: 18789,
    bind: "all",           // Docker handles external exposure
    auth: {
      token: { source: "env", id: "OPENCLAW_GATEWAY_TOKEN" }
    },
    configHotReload: "hybrid",
    logLevel: "info"
  },
  agents: {
    defaults: {
      model: {
        primary: "openai/gpt-5.5",
        fallback: "openrouter/anthropic/claude-sonnet-4-6"
      },
      imageGenerationModel: {
        primary: "openai/gpt-image-2"
      }
    }
  },
  channels: {
    whatsapp: {
      enabled: true,
      dmPolicy: "pairing",           // require STOP keyword support; use allowlist for outreach
      allowFrom: "+14168003103",      // our dedicated number
      maxMessageLength: 4000,
      groups: {
        "*": { requireMention: true } // safe for group contexts
      }
    },
    telegram: {
      enabled: true,
      botToken: { source: "env", id: "TELEGRAM_BOT_TOKEN" },
      dmPolicy: "allowlist",
      allowFrom: ["<admin telegram IDs>"]
    }
  },
  hooks: {
    enabled: true,
    token: { source: "env", id: "OPENCLAW_GATEWAY_TOKEN" }
  }
}
```

### Backup strategy

```bash
#!/bin/bash
# /docker/openclaw-vmjg/scripts/backup.sh — runs daily at 02:00 COT
set -e
BACKUP_FILE="/tmp/openclaw-backup-$(date +%Y%m%d%H%M).tar.gz"
tar -czf $BACKUP_FILE /data/state /data/home/.openclaw
# Upload to Supabase Storage
curl -X POST "$SUPABASE_URL/storage/v1/object/backups/openclaw/$(basename $BACKUP_FILE)" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/gzip" \
  --data-binary @$BACKUP_FILE
rm $BACKUP_FILE
echo "Backup complete: $(basename $BACKUP_FILE)"
```

### Health monitoring

```bash
# UptimeRobot config (add at uptimerobot.com)
# Monitor 1: OpenClaw gateway
URL: https://openclaw-vmjg.srv1641664.hstgr.cloud/healthz
Interval: 5 minutes
Alert: email ai@socialmediaville.ca + Telegram bot

# Monitor 2: WhatsApp session alive (custom check)
URL: https://openclaw-vmjg.srv1641664.hstgr.cloud/v1/models
Interval: 15 minutes
Expected: 200 OK
```

---

## 13. OpenAI Configuration

### Verified setup (from docs.openclaw.ai/providers/openai + github.com/openclaw/openclaw/blob/main/docs/providers/openai.md)

> ✅ **Valid model IDs confirmed:** `openai/gpt-5.5`, `openai/gpt-5.4-mini`, `openai/gpt-image-2`
> ❌ **Invalid model IDs — do not use:** `gpt-5.5-thinking` (does not exist in OpenClaw docs), `gpt-4.1-mini` (does not exist — correct name is `gpt-5.4-mini`)

**Route 1 — API key (recommended for production high-volume):**
```bash
export OPENAI_API_KEY="sk-proj-ej0C_..."

# Configure in openclaw.json
agents:
  defaults:
    model:
      primary: "openai/gpt-5.5"
      fallback: "openai/gpt-5.4-mini"
```

**Route 2 — ChatGPT subscription (personal/dev use, no API key needed):**

OpenAI announced ChatGPT account holders (Plus/Pro/Business) can sign into OpenClaw
directly with their ChatGPT credentials and use their subscription allocation for
OpenClaw agent runs.

```json5
// openclaw.json — ChatGPT subscription auth
{
  agents: {
    defaults: {
      model: { primary: "openai/gpt-5.5" },
      agentRuntime: { id: "codex" }   // uses Codex OAuth via ChatGPT account
    }
  }
}
```
Authenticate via: `openclaw onboard --auth-choice openai-codex-oauth`

> **mdeai recommendation:** Use API key (Route 1) for production — better rate limits,
> predictable costs, no subscription sharing. ChatGPT subscription is fine for dev/testing.
```

### Model recommendations by agent

| Agent | Primary Model | Fallback | Reason |
|-------|---------------|----------|--------|
| concierge | `openai/gpt-5.4-mini` | `openrouter/google/gemini-flash` | Speed > quality for real-time replies |
| discovery | `openai/gpt-5.5` | `openai/gpt-5.4-mini` | Research quality matters |
| outreach | `openai/gpt-5.5` | `openrouter/anthropic/claude-sonnet-4-6` | Personalization quality |
| events | `openai/gpt-5.5` | `openai/gpt-5.4-mini` | Content quality |
| content | `openai/gpt-5.5` + `openai/gpt-image-2` | text fallback only | Full creative quality |

### Cost control

```json5
// In openclaw.json — per-agent budget limits
agents: {
  "mdeai-concierge": {
    model: { primary: "openai/gpt-5.4-mini" },   // cheapest for high-volume
    maxTokensPerRun: 4000,
    maxRunsPerHour: 60
  },
  "mdeai-discovery": {
    model: { primary: "openai/gpt-5.5" },
    maxTokensPerRun: 16000,
    maxRunsPerHour: 5
  }
}
```

### Rate limits

| Model | RPM | TPM | Safe daily budget |
|-------|-----|-----|------------------|
| gpt-5.5 | 500 | 800k | $15–40/day |
| gpt-5.4-mini | 5000 | 4M | $2–5/day |
| gpt-image-2 | 50 images | — | $5–10/day |

**Set Paperclip budget caps:** $50/month concierge agent, $100/month discovery, $75/month outreach.

### Fallback provider (OpenRouter)

```bash
# If OpenAI is down, OpenClaw falls back to OpenRouter automatically
export OPENROUTER_API_KEY="sk-or-..."

# In openclaw.json:
agents:
  defaults:
    model:
      primary: "openai/gpt-5.5"
      fallback: "openrouter/anthropic/claude-sonnet-4-6"
```

### Logging

Every agent run → log to `marketing.agent_runs` via `openclaw-delivery-webhook` edge function:
- model used, tokens_used, cost_usd, duration_ms, status

---

## 14. Step-by-Step Setup Tasks

### Phase 0: Audit Current OpenClaw (Day 1 — 2 hours)

```bash
# SSH to VPS
ssh root@2.24.69.242

# Check OpenClaw version and status
docker exec openclaw-gateway openclaw --version
docker exec openclaw-gateway openclaw gateway status

# List installed skills
docker exec openclaw-gateway openclaw skills list

# Check installed channels
docker exec openclaw-gateway openclaw channels list

# Check WA pairing status
docker exec openclaw-gateway openclaw channels status whatsapp

# Verify gateway token is set
docker exec openclaw-gateway env | grep OPENCLAW_GATEWAY_TOKEN

# Check logs
docker logs openclaw-gateway --tail 100

# Rotate gateway token
NEW_TOKEN=$(openssl rand -hex 32)
# Update in /docker/openclaw-vmjg/.env
# Update in Infisical prod
# Restart: docker compose restart openclaw
```

**Exit criteria:** Version confirmed, skills list checked, logs clean, token rotated.

---

### Phase 1: Install Core Skills (Day 1–2, 3 hours)

```bash
# Install supabase skill (most critical)
docker exec openclaw-gateway openclaw skills install supabase

# Install actionbook (browser automation)
docker exec openclaw-gateway openclaw skills install actionbook

# Install postiz-agent CLI (separate from skills)
docker exec openclaw-gateway npm install -g postiz-agent
docker exec openclaw-gateway postiz-agent --version

# Create local mdeai skills
mkdir -p /docker/openclaw-vmjg/skills/mdeai-concierge
mkdir -p /docker/openclaw-vmjg/skills/mdeai-outreach
mkdir -p /docker/openclaw-vmjg/skills/mdeai-neighborhoods

# Write skill files (content from Section 10)
# Mount skills dir in docker-compose volumes:
# - /docker/openclaw-vmjg/skills:/data/home/.openclaw/skills/local

# Verify skills loaded
docker exec openclaw-gateway openclaw skills list
```

**Exit criteria:** 9 skills active (5 existing + supabase + actionbook + 3 mdeai custom).

---

### Phase 2: Connect Paperclip (Day 2, 2 hours)

> ⚠️ **Paperclip bug #744 (open, unresolved):** When creating a Paperclip agent with
> `adapterType: "openclaw_gateway"`, the `x-openclaw-token` field is NOT shown in the
> create form — only in the edit form. This causes `unauthorized: gateway token missing`
> WebSocket failures. **After rotating the gateway token, go to Paperclip → Agents →
> agent `02141a2f` → Edit → confirm `x-openclaw-token` field is populated.**

```bash
# Paperclip connection already done (agent ID 02141a2f)
# Verify it still works:
curl -H "Authorization: Bearer pcp_88397210..." \
  https://paperclip-dy8r.srv1641664.hstgr.cloud/api/companies/55141faa-8b30-4731-bfd0-c344eb448713/issues

# Fix dangerouslyBypassApprovalsAndSandbox (15A — CRITICAL)
# Go to Paperclip dashboard → Agents → CEO agent → Configuration
# Set dangerouslyBypassApprovalsAndSandbox: false
# Set budget: $150/month

# Create Paperclip routines:
# - discover-leads at 08:00 COT (13:00 UTC)
# - generate-content at 07:00 COT (12:00 UTC)
# - qualify-leads at 09:00 COT (14:00 UTC)
# - qualify-sponsors at 10:00 COT (15:00 UTC)
# - follow-up-stale-leads at 09:00 COT (14:00 UTC)

# Test approval gate:
# Send a test task from OpenClaw agent → verify it appears in Paperclip board
# Approve it → verify OpenClaw detects approval
```

**Exit criteria:** Approval gate working end-to-end. Bypass flags off.

---

### Phase 3: Connect Supabase (Day 2–3, 3 hours)

```bash
# Deploy marketing schema migration
supabase db push --project-ref zkwcbyxiwklihegjhuql \
  supabase/migrations/20260507000100_marketing_schema.sql

# Deploy edge functions
supabase functions deploy openclaw-delivery-webhook --project-ref zkwcbyxiwklihegjhuql
supabase functions deploy discovery-ingest --project-ref zkwcbyxiwklihegjhuql

# Set edge function secrets
supabase secrets set \
  OPENCLAW_WEBHOOK_SECRET="<same value as env var>" \
  --project-ref zkwcbyxiwklihegjhuql

# Test webhook from OpenClaw to Supabase:
curl -X POST https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/openclaw-delivery-webhook \
  -H "Authorization: Bearer <anon key>" \
  -H "X-OpenClaw-Signature: <computed>" \
  -d '{"agent_name":"test","action_type":"test","status":"completed"}'

# Verify row appears in marketing.agent_runs
```

**Exit criteria:** Webhook responds 200, rows in Supabase, HMAC verified.

---

### Phase 4: Connect Postiz (Day 3, 2 hours)

```bash
# Test postiz-agent CLI
docker exec openclaw-gateway postiz-agent integrations:list

# Verify API key works (raw key, NO Bearer prefix)
curl -X GET https://postiz-6buz.srv1641664.hstgr.cloud/api/posts \
  -H "X-POSTIZ-API-KEY: <raw key>"

# Create test post (do not publish — use schedule far future)
docker exec openclaw-gateway postiz-agent posts:create \
  --platform instagram \
  --content "Test post from mdeai OpenClaw agent 🧪" \
  --schedule "2099-01-01T00:00:00Z"

# Verify in Postiz dashboard
```

**Exit criteria:** Test post appears in Postiz queue. API key confirmed.

---

### Phase 5: Build Daily Content Machine (Day 4–5, 4 hours)

1. Create `mdeai-content` agent config in `openclaw.json`
2. Create Paperclip routine `generate-content` at 07:00 UTC
3. Test: trigger routine manually → agent drafts 3 posts → appears in Paperclip board
4. Approve in Paperclip → verify postiz-agent schedules posts
5. Verify posts appear in Postiz queue with correct platform + time

**Exit criteria:** 3 posts/day flowing through: Hermes draft → Paperclip approval → Postiz schedule.

---

### Phase 6: Build Compliant Outreach Machine (Day 5–7, 6 hours)

1. Pair WhatsApp +14168003103 to OpenClaw (QR scan via dashboard)
2. Test inbound message → concierge responds
3. Create outreach agent with suppression check
4. Seed `marketing.suppression_list` with any known opt-outs
5. Test outreach workflow with internal phone number
6. Verify: suppression check works, approval gate fires, Supabase log created
7. Start with 1 message/day limit → increase to 5 → 10 over 2 weeks

**Exit criteria:** End-to-end: discovery → score → Paperclip approve → WhatsApp send → Supabase log.

---

### Phase 7: Production Hardening (Week 2, 3 hours)

```bash
# Rotate all secrets
openssl rand -hex 32  # for each: OPENCLAW_GATEWAY_TOKEN, OPENCLAW_WEBHOOK_SECRET
# Store new values in Infisical prod

# Set up UptimeRobot monitoring (5 monitors: OpenClaw, Paperclip, Hermes, Postiz, Supabase)

# Configure Docker log rotation (already in compose: max-size 100m, max-file 5)

# Set up daily backup cron
echo "0 7 * * * /docker/openclaw-vmjg/scripts/backup.sh" | crontab -

# Enable Paperclip budget alerts (80% threshold)
# OpenClaw agent budgets: concierge $50/mo, discovery $100/mo, outreach $75/mo

# Document WhatsApp number as "dedicated bot number" — not linked to personal identity
# Keep a second phone ready as replacement if +14168003103 gets banned
```

**Exit criteria:** All 5 services monitored, daily backups verified, secrets rotated, budgets set.

---

## 15. Testing Plan

### Tier 1: Unit / Smoke Tests (Phase 0–1)

| Test | Command | Pass criteria |
|------|---------|---------------|
| OpenClaw version | `openclaw --version` | Returns semver |
| Gateway health | `curl http://localhost:18789/healthz` | 200 OK |
| Skills list | `openclaw skills list` | 9 skills listed |
| supabase skill | `openclaw skills show supabase` | Skill metadata returned |
| OpenAI provider | Agent sends: "Say hello" | Response in < 5s |
| OpenRouter fallback | Set invalid OpenAI key → send message | Uses OpenRouter fallback |
| postiz-agent | `postiz-agent integrations:list` | Lists connected Postiz accounts |

### Tier 2: Gateway / Integration Tests (Phase 2–3)

| Test | Steps | Pass criteria |
|------|-------|---------------|
| Paperclip gateway | OpenClaw agent → POST Paperclip task | Task appears in board |
| Approval gate | Post task → approve in Paperclip → agent detects | Agent proceeds after approval |
| Supabase webhook | OpenClaw fires webhook | 200, row in agent_runs |
| HMAC verification | Send webhook with wrong signature | 401 rejected |
| Suppression check | Add test number to suppression_list → attempt outreach | Outreach blocked |
| Rate limit | Fire 11 messages in 1 minute | 11th message queued/blocked |

### Tier 3: WhatsApp Tests (Phase 5–6)

| Test | Steps | Pass criteria |
|------|-------|---------------|
| QR pairing | Run `openclaw channels login --channel whatsapp` | QR scanned, session active |
| Inbound WA | Send message to +14168003103 | Concierge responds in < 60s |
| Outbound WA | Trigger outreach workflow (internal test number) | Message received |
| STOP keyword | Reply "STOP" to outreach | Number added to suppression_list |
| WA session recovery | Restart gateway | Session reconnects automatically |
| 4000-char limit | Send very long reply | Truncated at 4000 chars or split |

### Tier 4: Instagram / Social Read-only Tests (Phase 4)

| Test | Steps | Pass criteria |
|------|-------|---------------|
| Public IG scrape | Use actionbook to read public profile | Data returned, no login required |
| Postiz schedule | `postiz-agent posts:create --schedule far-future` | Job created in Postiz |
| Postiz analytics | `postiz-agent analytics:post <job_id>` | Returns engagement metrics |
| Content pipeline | Trigger generate-content → approve → schedule | 3 posts in Postiz queue |

### Tier 5: Security Tests (Phase 7)

| Test | Steps | Pass criteria |
|------|-------|---------------|
| Gateway auth | Hit `/v1/models` without token | 401 Unauthorized |
| Webhook HMAC | Wrong signature | 401 |
| Suppression bypass | Remove from list manually → immediate re-check | Cannot send |
| Budget cap | Exceed agent token budget | Agent pauses, Paperclip alert |
| Log completeness | Run 10 agent actions | All 10 in marketing.agent_runs |
| Secret exposure | `grep -r "sk-proj\|pcp_" /docker` | No hardcoded secrets |

### Tier 6: Failure / Retry Tests

| Test | Steps | Pass criteria |
|------|-------|---------------|
| OpenAI outage | Kill OPENAI_API_KEY → send message | Falls back to OpenRouter |
| Supabase outage | Invalid SUPABASE_URL → agent run | Error logged, no data loss |
| WA number ban | Simulate (use test env) | Alert fires, fallback to Telegram |
| Approval timeout | Create task, wait 24h | Task auto-rejected, contact status='approval_timeout' |
| Duplicate outreach | Same contact, same hash | Second outreach blocked by content_hash dedup |

---

## 16. Production Readiness Checklist

### Security

- [ ] `OPENCLAW_GATEWAY_TOKEN` rotated from default → new value in Infisical
- [ ] `OPENCLAW_WEBHOOK_SECRET` set and used for HMAC verification in all edge fns
- [ ] `PAPERCLIP_API_KEY` stored in Infisical prod (not hardcoded in any file)
- [ ] No `OPENAI_API_KEY` hardcoded in `openclaw.json` — uses `env:` reference
- [ ] `docker inspect openclaw-gateway` → no secrets in `Env` array exposed
- [ ] VPS firewall: port 40051 only accessible via Hostinger reverse proxy (not public direct)
- [ ] Webhook endpoint validates HMAC before any DB write
- [ ] `dangerouslyBypassApprovalsAndSandbox: false` on ALL Paperclip agents

### Compliance (Colombia Ley 1581/2012 + WhatsApp ToS)

- [ ] Suppression list seeded and checked before EVERY outbound message
- [ ] "Reply STOP to unsubscribe" on all first-touch WhatsApp messages
- [ ] STOP keyword handling: auto-adds to suppression_list within 5 seconds
- [ ] No messages after 9pm or before 8am COT
- [ ] Max 1 message per contact per 48 hours enforced
- [ ] WhatsApp number +14168003103 is NOT a personal number
- [ ] Second phone number ready as WA failover (in case of ban)
- [ ] No bulk broadcast via WhatsApp (individual messages only)
- [ ] All social scraping: public data only (no login, no cookies, no session)
- [ ] Data retention policy: contacts deleted after 90 days of inactivity (add to runbook)

### Approvals & Governance

- [ ] Paperclip board approval required for ALL outbound messages
- [ ] Approval SLA: 30 min target, 4h escalation, 24h auto-reject
- [ ] Human can reject any task at any point in the pipeline
- [ ] All Paperclip tasks linked to Supabase records by `paperclip_task_id`
- [ ] Budget caps set: concierge $50/mo, discovery $100/mo, outreach $75/mo

### Monitoring & Reliability

- [ ] UptimeRobot on all 5 services (OpenClaw, Paperclip, Hermes, Postiz, Supabase)
- [ ] Docker log rotation: max 100MB × 5 files per container
- [ ] Daily backup at 02:00 COT → Supabase Storage (verified restore test done)
- [ ] Paperclip budget alerts at 80% threshold
- [ ] `marketing.errors` table monitored (alert if > 5 errors in 1 hour)
- [ ] WA session health check every 15 minutes (restart on failure)

### Operational

- [ ] Runbook created for: WA ban recovery, Paperclip restart, Supabase migration
- [ ] Secrets rotation schedule: every 90 days
- [ ] WhatsApp backup number documented and tested
- [ ] postiz-agent version pinned in Dockerfile
- [ ] OpenClaw version pinned in Dockerfile

---

## 17. Success Criteria

| KPI | Baseline | Week 4 Target | Month 3 Target |
|-----|----------|---------------|----------------|
| Contacts discovered/day | 0 | 20 | 50 |
| Leads scored ≥70/day | 0 | 8 | 20 |
| Outreach messages approved/day | 0 | 3 | 10 |
| WhatsApp reply rate | 0% | 15% | 25% |
| Booked apartment viewings/week | 0 | 3 | 10 |
| Social posts scheduled/day | 0 | 3 | 5 |
| Agent failure rate | — | < 5% | < 2% |
| Cost per lead (USD) | — | < $8 | < $4 |
| Social account ban rate | 0% | 0% | 0% |
| WhatsApp number ban events | 0 | 0 | 0 |
| Human time saved/week | 0h | 5h | 20h |
| Paperclip approval rate | — | > 70% | > 85% |
| Concierge response time | — | < 60s | < 30s |
| Suppression compliance | 100% | 100% | 100% |

---

## 18. Risks and Red Flags

### 🔴 CRITICAL RISKS

**1. WhatsApp number ban (Baileys is unofficial)**

- **Risk:** WhatsApp actively bans Baileys-based sessions. A single ban can immediately halt all concierge and outreach operations.
- **Probability:** MEDIUM-HIGH with volume. LOW with < 20 msgs/day to known contacts.
- **Mitigation:** Dedicated number not linked to personal identity. Start with 3–5 msgs/day. Never use bulk broadcast. Pause immediately if ban warning received. Keep a backup number ready.

**2. `dangerouslyBypassApprovalsAndSandbox: true` is currently active**

- **Risk:** All Paperclip approval gates are bypassed right now. Any agent could send messages without human review.
- **Probability:** CERTAIN until 15A is completed.
- **Mitigation:** Complete 15A BEFORE any other E15 work. This is a blocker.

**3. Runaway AI costs without budget caps**

- **Risk:** OpenAI budget is currently $0 (unlimited) in Paperclip. A misconfigured agent loop could generate $1,000+ in AI calls in hours.
- **Probability:** LOW with correct budgets; CRITICAL without them.
- **Mitigation:** Set Paperclip budget caps first thing in 15A. Set `maxRunsPerHour` in openclaw.json.

### 🟡 HIGH RISKS

**4. Instagram/LinkedIn automation bans**

- **Risk:** Any scraping or automation on Instagram or LinkedIn violates their ToS. Accounts can be restricted or banned.
- **Mitigation:** Read-only public data only. No login. No DMs via OpenClaw (use Postiz's official API for posting). Rate limit public scrapes to 1 request/10 seconds. Use firecrawl/actionbook with rotation.

**5. Duplicate outreach**

- **Risk:** Agent runs in parallel or retries → same contact receives same message twice. Serious reputation risk.
- **Mitigation:** `content_hash` dedup in `marketing.outreach_messages`. Check hash before every send. Idempotency key on every Paperclip task.

**6. Hallucinated lead data**

- **Risk:** OpenAI invents contacts or contact details that don't exist. Outreach fails or hits wrong people.
- **Mitigation:** Never store AI-generated contact data without verification against source. Apollo.io enrichment is ground truth. Hermes scoring requires verified email or phone.

**7. Bun runtime incompatibility**

- **Risk:** The mdeai repo has `bun.lockb`. If OpenClaw is run with Bun on the VPS, WhatsApp and Telegram will break unpredictably.
- **Mitigation:** OpenClaw Docker image uses `node:24-slim`. Never use Bun runtime for OpenClaw.

### 🟢 LOW RISKS (managed with current controls)

**8. Approval SLA breach**

- **Risk:** Human doesn't approve in time → lead goes cold.
- **Mitigation:** 30 min target SLA. Telegram admin alert at 1h. Auto-reject at 24h (documented in runbook).

**9. ClawHub malicious skills — "ClawHavoc" campaign** ⬆️ UPGRADED TO CRITICAL

- **Risk:** The **ClawHavoc** campaign placed **800+ malicious skills** (~20% of the ClawHub registry) in the wild. They deliver **Atomic macOS Stealer (AMOS)** by instructing users to run terminal commands as "prerequisites." Data exfiltrated: API keys, SSH keys, browser passwords, crypto wallets. Named malicious categories: Polymarket bots, YouTube utilities, auto-updaters (`auto-updater-agent`, `update`, `updater`), Yahoo Finance tools, Google Workspace fakes, Bitcoin/Ethereum tools, ClawHub typosquats (`clawhub1`, `clawhubb`, `cllawhub`).
- **Probability:** HIGH — 20% of registry is affected; the campaign is active and ongoing.
- **Mitigation:**
  - **Never run any terminal command** suggested by a skill's install notes (other than `openclaw skills install <slug>`)
  - **Read the SKILL.md source on GitHub** before installing any ClawHub skill — the attack vector is instructions in SKILL.md, not executable code
  - Only install skills from publishers with a real GitHub org, commit history > 6 months, and verifiable identity
  - **Verified safe (from their publisher's official org):** `firecrawl` (Firecrawl), `crawl4ai` (Unclewed), `apollo-io` (Apollo.io)
  - **Verify before use:** `super-browser`, `mrscraper`, `actionbook`, `supabase` — read their SKILL.md source files first
  - **The three custom local mdeai skills are 100% safe** — written locally, not from ClawHub
  - Skip any skill in these categories: crypto, auto-updater, finance bots, YouTube tools

**10. CVE-2026-25253 — Gateway RCE vulnerability** 🔴 NEW CRITICAL

- **Risk:** A remote code execution vulnerability exists in OpenClaw's gateway. Censys/Bitsight found 30,000+ exposed instances. If the VPS port 40051 is reachable directly from the internet, it is at risk.
- **Probability:** HIGH if firewall misconfigured; LOW if Hostinger reverse proxy correctly gates port 40051.
- **Mitigation:**
  - **Pin OpenClaw to a specific version** — do NOT use `openclaw@latest` in Dockerfile without verifying the current release patches this CVE. Check the release notes at github.com/openclaw/openclaw/releases.
  - Confirm VPS firewall blocks direct access to port 40051 from internet — only Hostinger's reverse proxy should reach it
  - Run `docker inspect openclaw-gateway | grep -A5 Ports` to confirm external binding

**11. VPS storage exhaustion**

- **Risk:** Docker logs + conversation state files fill 96 GB NVMe over months.
- **Mitigation:** Docker log rotation (100MB × 5 files). Daily backup with pruning. State files: archive after 90 days.

---

## 19. Final Recommendation

### Install first (Week 1)

1. **`supabase` skill** — most critical; every workflow depends on Supabase CRM sync
2. **`actionbook`** — unlocks browser-based lead discovery
3. **`postiz-agent` CLI** — unlocks social publishing from OpenClaw
4. **Three custom mdeai skills** — branded concierge behavior; write before any agent goes live
5. **Pair WhatsApp +14168003103** — concierge can't launch without this

### What to avoid

| Avoid | Why |
|-------|-----|
| WhatsApp bulk broadcast | Violates ToS, triggers instant ban |
| Instagram DMs via OpenClaw | Not an official channel; too risky |
| LinkedIn automation at scale | ToS violation; account restriction common |
| Running any agent before 15A is done | Approval bypass means zero governance |
| Using Bun runtime for gateway | Breaks WhatsApp and Telegram |
| Storing OpenAI key in openclaw.json plaintext | Use `env:` reference instead |
| Sending outreach without Hermes scoring | Wastes capacity on unqualified leads |
| Installing ClawHub skills without reading GitHub source | ClawHavoc: 800+ malicious skills active |
| Using `openclaw@latest` in Dockerfile | CVE-2026-25253 — pin to a verified patched release |
| Using `gpt-5.5-thinking` or `gpt-4.1-mini` as model IDs | These model names do not exist in OpenClaw |
| Passing Supabase Storage URLs directly to Postiz | Instagram/TikTok reject external URLs — use `postiz upload` |

### What to build first for revenue

**Phase 1 (Week 1–2): WhatsApp Concierge**
This is the highest immediate revenue action. Rental leads who don't get a response within 1 hour go to competitors. A 24/7 concierge responding in < 60 seconds converts dramatically better than any marketing campaign. Build this first.

**Phase 2 (Week 2–3): Content Machine → Postiz**
3 posts/day on IG/FB/TikTok/LinkedIn with zero manual work. Compounds brand awareness. Safe, low-risk, immediate.

**Phase 3 (Week 3–4): Approved WhatsApp Outreach**
Once the concierge is running and Paperclip approval gates are tested, start outreach at 3 messages/day. Increase to 10/day after 2 weeks with zero ban events.

**Phase 4 (Month 2): Full Growth Machine**
With all workflows running and data in Supabase, Hermes can start self-optimizing scoring weights using actual conversion data.

### Should OpenClaw be used now, later, or only after approvals?

**The answer: ONLY after Paperclip approval gates (15A) are active.**

OpenClaw is already connected to Paperclip (agent `02141a2f`). But `dangerouslyBypassApprovalsAndSandbox: true` means every agent action currently bypasses all safety checks. Using OpenClaw to send ANY outbound message in this state is dangerous — messages will go out without human review.

The decision tree:
```
15A complete? → NO → Do 15A first. Nothing else matters.
               → YES → WhatsApp paired? → NO → Pair it (30 min task).
                                        → YES → Run concierge first (no outbound risk).
                                               → Then add content machine.
                                               → Then add approved outreach (3/day).
```

OpenClaw is production-ready as an inbound concierge right now (reactive, not proactive).
OpenClaw is production-ready for outbound only after 15A + WhatsApp pairing + 2 weeks of inbound testing.

---

---

## 20. Lobster Integration

> **Source verified:** `github.com/openclaw/lobster` — 200 OK, 1.2k stars, last release April 2026.
> **Relationship:** Lobster lives under the `openclaw` GitHub org and is purpose-built for OpenClaw.
> It is NOT a separate unrelated project.

### What Lobster Is

Lobster is an **OpenClaw-native TypeScript workflow engine** — a typed, JSON-first macro engine
for multi-step pipelines, jobs, and approval gates inside OpenClaw. Think of it as replacing
the polling loop in Workflow 9 (Paperclip approval gate) with a deterministic, typed alternative.

```
Current plan (polling):
  Agent drafts → POST to Paperclip → poll every 30s → detect approval → execute

With Lobster:
  Agent drafts → Lobster pipeline triggers → approval step waits for signed event → execute
```

### When to use Lobster (Phase 2 optional enhancement)

| Scenario | Without Lobster | With Lobster |
|----------|----------------|--------------|
| Approval gate | Agent polls Paperclip every 30s | Lobster `approval` step blocks until approved |
| Multi-step outreach | Agent re-plans after each step (token waste) | Single `pipeline` call, steps share typed JSON |
| Parallel discovery + scoring | Separate agent runs | `pipeline` with parallel branches |
| Error handling | Custom try/catch in agent instructions | Typed error handling per step type |

### Lobster step types

```typescript
// Lobster pipeline example for mdeai outreach approval
{
  name: "mdeai-outreach-approval",
  steps: [
    {
      type: "run",
      id: "draft",
      command: "hermes score-and-draft",
      input: { contact_id: "$contact_id" }
    },
    {
      type: "approval",   // hard checkpoint — pipeline pauses here
      id: "board-approve",
      identity: { paperclip_task: "$task_id" },
      timeout_hours: 24
    },
    {
      type: "run",
      id: "send",
      command: "openclaw send-whatsapp",
      input: { contact_id: "$contact_id", message: "$draft.output" }
    },
    {
      type: "pipeline",   // nested: log to Supabase
      id: "log",
      steps: [/* supabase write steps */]
    }
  ]
}
```

### mdeai adoption plan

- **Phase 0–2:** Use current polling approach (simpler, already designed)
- **Phase 2+ (after first successful outreach run):** Evaluate Lobster for the outreach approval gate
- **Priority:** LOW — Lobster is an optimization, not a requirement. The polling approach works fine.

### Are we using Lobster now?

**No.** The current plan uses polling. The existing trio docs (`01-open-claw.md`) mentioned Lobster
as a workflow engine alongside Paperclip — that framing is accurate (Lobster = typed workflow layer).
The decision is to adopt it in Phase 2 only if the polling approach proves unreliable or too token-heavy.

---

## 21. Additional Use Cases for mdeai

> Verified additional use cases beyond the 9 workflows — specific to real estate, events, marketing, social media, lead gen, and sponsors.

### Real Estate

| # | Use Case | OpenClaw Role | Trigger | Revenue |
|---|----------|---------------|---------|---------|
| R1 | **Rental price intelligence** | Scrape public Airbnb/booking listings in Poblado weekly → update market snapshot in Supabase → Hermes adjusts Sabaneta scoring weight | Paperclip routine Mon 06:00 | Better lead scoring → higher conversion |
| R2 | **Move-in checklist delivery** | On booking confirmed → send WhatsApp checklist (Wi-Fi password, key collection, emergency contacts, local tips) | Supabase booking webhook | Tenant satisfaction → repeat bookings |
| R3 | **Lease expiry reminders** | 60/30/14 days before lease end → WA message: "Renew with mdeai? We'll find your next place in 48h" | Paperclip scheduled routine | Renewal bookings |
| R4 | **Neighborhood guide delivery** | New tenant books → OpenClaw sends WhatsApp PDF (neighborhood guide, restaurant recs, metro map) | Booking confirmed event | Brand loyalty |
| R5 | **Landlord performance nudges** | If a listing has < 3 photos or missing price → WA message to landlord: "Your listing gets 60% fewer views — add photos now" | Weekly Paperclip audit routine | Better listing quality → higher conversion |
| R6 | **Virtual tour requests** | Tenant asks for tour via WA → OpenClaw creates Paperclip task → schedules Zoom with landlord | WA message with "tour" keyword | Faster booking cycle |

### Events

| # | Use Case | OpenClaw Role | Trigger | Revenue |
|---|----------|---------------|---------|---------|
| E1 | **Ticket urgency alerts** | When event is 80% sold → WA to waitlisted contacts: "Only 30 tickets left! Early bird ends tonight" | Supabase rule: capacity threshold | Ticket velocity |
| E2 | **Post-event follow-up** | 2 days after event → WA to all attendees: "How was it? Rate your experience + early access to next event" | Event completed webhook | Repeat attendance |
| E3 | **Sponsor recognition** | After event → WA/Telegram to sponsor: "Your brand reached 450 attendees tonight — full ROI report attached" | Post-event Paperclip routine | Sponsor retention |
| E4 | **Influencer event invitations** | For high-score Instagram creators (score ≥80) → personalized WA invite: "We'd love to host you at [event] as our content partner" | Weekly discovery batch | Organic social reach |
| E5 | **Contest vote reminders** | 24h before voting closes → WA to registered contestants + voters: "Last chance to vote! Leader: [name] with [X] votes 🏆" | Supabase cron near deadline | Contest engagement |

### Marketing / Social Media

| # | Use Case | OpenClaw Role | Trigger | Revenue |
|---|----------|---------------|---------|---------|
| M1 | **Trending hashtag injection** | Weekly: OpenClaw scrapes top 20 #medellín hashtags → Hermes updates content calendar → next week's posts use trending tags | Mon weekly routine | Better social reach |
| M2 | **Competitor content monitoring** | Daily: scan 5 competitor social accounts (public only) → Hermes summarizes: "competitors posting about [X] — mdeai should respond with [Y]" | Daily Paperclip routine | Content differentiation |
| M3 | **UGC (User-Generated Content) repost pipeline** | Monitor #mdeai mentions on public IG → when tagged → Hermes verifies quality → Paperclip approves → Postiz reposts with credit | Instagram public tag scan | Social proof |
| M4 | **Bilingual A/B content** | Hermes drafts both Spanish + English versions of each post → Paperclip approves both → Postiz schedules: Spanish on weekdays, English on weekends | Content routine | Wider audience |
| M5 | **Google Business profile posts** | Weekly: Postiz posts event announcements to Google Business profile (Postiz supports GBP) | Content machine | Local SEO |

### Lead Generation

| # | Use Case | OpenClaw Role | Trigger | Revenue |
|---|----------|---------------|---------|---------|
| L1 | **Facebook Group monitor** | OpenClaw reads public "Expats in Medellín" FB group (public only) → extracts posts asking "looking for apartment" → Hermes scores → creates discovery task | Every 4h public scrape | Warm inbound leads |
| L2 | **Eventbrite attendee discovery** | Scrape public attendee lists on Eventbrite COL events (when public) → find attendees with "looking to move" in bio → add to discovery queue | Weekly routine | Event-adjacent leads |
| L3 | **Digital nomad community monitor** | Public Nomad List, r/digitalnomad (public posts), Slow Travel Medellín FB group → extract "moving to MDE" signals → score and add to queue | Daily routine | High-intent leads |
| L4 | **WhatsApp word-of-mouth capture** | When existing tenant sends contact to bot: "My friend Carlos is looking" → OpenClaw creates referral lead → logs referrer → bonus for referrer | Inbound WA keyword | Referral network |

### Sponsor Development

| # | Use Case | OpenClaw Role | Trigger | Revenue |
|---|----------|---------------|---------|---------|
| S1 | **Post-event sponsor ROI delivery** | Within 24h of event end → Hermes compiles: attendee count, ticket revenue, social reach → OpenClaw sends PDF ROI report via WA to sponsor | Event completed webhook | Sponsor renewal |
| S2 | **Lapsed sponsor reactivation** | Sponsors whose last contract ended 90+ days ago → personalized WA: "New events coming — your audience is still here" | Paperclip 90-day routine | Revenue recovery |
| S3 | **Inbound sponsor inquiry handling** | Sponsor DMs on WA: "how do we sponsor?" → concierge explains packages, shares pricing deck link, creates Paperclip task for human follow-up | Inbound WA keyword match | Deal pipeline |
| S4 | **Competitor sponsor poaching** | Scrape public event pages of Medellín competitors → identify their sponsors → Hermes scores fit → create outreach task | Monthly discovery routine | New sponsor acquisition |
| S5 | **Sponsor content co-creation** | After sponsor signs → OpenClaw helps draft co-branded post (sponsor logo + mdeai messaging) → board approval → Postiz publishes | Sponsor contract signed | Sponsor satisfaction + upsell |

---

## 22. Validation: 14.1 Suggestions — What's Correct vs Corrected

> This table documents which claims from `14.1-openclaw.md` were verified, corrected, or superseded.

| Claim | Source | Status | Correction |
|-------|--------|--------|------------|
| `gpt-5.5` is valid model ID | OpenClaw OpenAI provider docs | ✅ VERIFIED | — |
| `gpt-5.5-thinking` is valid | — | ❌ INVALID | Not in any OpenClaw docs. Remove from configs. |
| `gpt-4.1-mini` is valid | — | ❌ INVALID | Correct name: `openai/gpt-5.4-mini` |
| `npm install -g postiz` = Postiz CLI | docs.postiz.com | ✅ VERIFIED | Human-facing CLI |
| `npm install -g postiz-agent` = agent CLI | gitroomhq/postiz-agent | ✅ VERIFIED | Agent-facing CLI for OpenClaw exec |
| `npx skills add gitroomhq/postiz-agent` | — | ⚠️ UNVERIFIED | Not in SKILL.md or official docs. Use `npm install -g postiz-agent` |
| `github.com/openclaw/lobster` = OpenClaw | openclaw/lobster README | ✅ VERIFIED | TypeScript workflow engine, OpenClaw org |
| ChatGPT subscription works in OpenClaw | Storyboard18 + OpenClaw docs | ✅ VERIFIED | Via Codex OAuth, `agentRuntime.id: "codex"` |
| ClawHub = "security nightmare" | Security advisories | ✅ VERIFIED | ClawHavoc: 800+ malicious skills, AMOS stealer, CVE-2026-25253 |
| Paperclip bug #744 = open | github.com/paperclipai/paperclip/issues/744 | ✅ VERIFIED | OPEN, unresolved. Must manually verify x-openclaw-token in edit form after token rotation |
| Postiz: all commands fail without auth | gitroomhq/postiz-agent SKILL.md | ✅ VERIFIED | Run `postiz auth:login` or set `POSTIZ_API_KEY` |
| `crawlkit` = OpenClaw project | github.com/openclaw/crawlkit | ❌ INCORRECT | crawlkit is a Go library by vincentkoc — unrelated to OpenClaw |
| Risk 9 (ClawHub) = LOW | This plan v1.0 | ❌ WRONG RATING | Upgraded to CRITICAL in v1.1 |
| No Docker-specific install page | 14-plan research | ✅ CONFIRMED | /platforms/docker = 404; must use custom Dockerfile |

---

*Research basis: 80+ live URL fetches — docs.openclaw.ai, github.com/openclaw/*, clawskills.sh, clawhub.ai, github.com/gitroomhq, openrouter.ai, security advisories (CVE-2026-25253, ClawHavoc), Storyboard18, Postiz docs — 2026-05-07 v1.1*
*Companion: [`14-openclaw-user-stories.md`](14-openclaw-user-stories.md) · [`14.1-openclaw.md`](14.1-openclaw.md)*
