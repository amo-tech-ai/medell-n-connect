---
title: OpenClaw + ClawEvents — Medellín event automation plan
version: 1.0
date: 2026-05-27
status: draft
audience: Patricia (ops), Sofía (infra), Camila (consumer — indirect)
phase: P2 (after EVD-01..10 core ingest in mdeapp)
parent_plan: ./10-event-discover-plan.md
execution_map: ../../../tasks/events/docs/event-discovery-skill-routing.md
related:
  - ./06-OpenClaw-for-event-discovery.md
  - ./06a-openclaw-events-discovery.md
  - ./07-openclaw-trip-planning.md
  - ./07-review.md
  - ../../../tasks/events/docs/41-event-links.md
  - ../../../tasks/events/EVP-018-mvp-event-web-discovery-task-pack.md
hosting: mdeai.co Hostinger VPS (OpenClaw gateway) — see mde-hostinger (Phase 2+)
personas: Patricia (approval + alerts), Camila (reads Supabase via app only)
---

# OpenClaw + ClawEvents — Medellín Event Automation Plan

> **One sentence:** OpenClaw and [ClawEvents](https://github.com/yhyatt/ClawEvents) are the **hands and cron** that scrape, retry, and notify — Supabase remains truth; Camila never talks to OpenClaw directly.

---

## 0. How this doc fits the stack

| Document | Role |
|----------|------|
| [10-event-discover-plan.md](./10-event-discover-plan.md) | **Master** Medellín discovery MVP (schema, Mastra, maps, Camila UI) |
| **This doc (11)** | **OpenClaw + ClawEvents** automation layer only |
| [06-OpenClaw-for-event-discovery.md](./06-OpenClaw-for-event-discovery.md) | Feature matrix + browser automation scores |
| [06a-openclaw-events-discovery.md](./06a-openclaw-events-discovery.md) | Verdict, OC-EVD tasks, safety rules |
| [07-openclaw-trip-planning.md](./07-openclaw-trip-planning.md) | Travel cron skills — **Phase 3+**, not discovery ingest |

**Prerequisite:** EVD-01..10 (Mastra ingest + approval + `search-events`) should run **without** OpenClaw before turning on VPS automation.

---

## 1. Executive summary

[ClawEvents](https://github.com/yhyatt/ClawEvents) proves the **fetcher pattern** mdeai needs: parallel sources → filter → dedupe → rank → JSON. [OpenClaw](https://github.com/openclaw/openclaw) proves the **operator pattern**: scheduled jobs, retries, WhatsApp/Telegram, human approval.

**Correct split:**

```text
Supabase     = truth
Mastra       = orchestration (normalize, dedupe, enrich, rank rules)
Google Maps  = geo intelligence
CopilotKit   = Camila’s experience (cards + pins)
OpenClaw     = automation worker (scrape, retry, notify, verify)
ClawEvents   = fetcher engine (CLI / Python — port or run on VPS)
Gemini       = summaries on approved rows only — never inventory
```

**Wrong split:** ClawEvents or OpenClaw as primary discovery brain → hallucinations and stale cards.

---

## 2. Overall scorecard

### ClawEvents + OpenClaw (combined automation layer)

| Area | Score /100 | Notes |
|------|----------:|-------|
| OpenClaw integration | **92** | Gateway + channels + cron — strong ops fit |
| Automation potential | **94** | Daily ingest, retries, digests |
| Event operations workflows | **88** | Patricia commands, health reports |
| Production readiness | **70** | Needs sandbox, audit logs, ingest API |
| Security posture | **62** | ClawHub risk — allowlist + pin versions |
| mdeai compatibility | **90** | Aligns with Supabase-first architecture |
| AI usefulness | **84** | Ops assistant OK; not for listing events |
| Real-world practicality (Medellín) | **86** | WhatsApp + morning ingest fits LATAM ops |
| Scalability | **78** | VPS-bound; move heavy scrape to Apify later |
| **Overall** | **84** | **92** when used only as automation layer |

### Strategic grades

| Strategy | Score /100 |
|----------|----------:|
| ClawEvents as **main platform** | **68** |
| ClawEvents as **automation / fetcher layer** | **92** |
| ClawEvents + Mastra + Maps + Supabase | **95** |

Cross-check: [06a](./06a-openclaw-events-discovery.md) rates OpenClaw **86/100** alone, **92/100** with approval gates.

---

## 3. What ClawEvents is good at (and what it is not)

ClawEvents demonstrates:

```text
parallel fetchers + filters + dedupe + rank + CLI/JSON
```

**Good for mdeai:**

- Event **ingest** patterns (Eventbrite API, RA GraphQL — already in repo for Bucharest)
- Operator **CLI** (`clawevents search --format json`)
- City registry extension (`medellin` fork)

**Not a substitute for:**

- `public.events` in Supabase
- CopilotKit cards on `/`
- Google Places enrichment in mdeapp
- Patricia’s admin approval UI

OpenClaw adds:

```text
agents + channels + cron + skills + messaging
```

**Good for:** scheduling, retries, notifications, browser verification, digests.

**Not for:** ranking Camila’s results, Stripe, or setting `is_active=true` without Patricia.

---

## 4. Reference links (use when implementing)

### ClawEvents

| Resource | URL | Use |
|----------|-----|-----|
| **ClawEvents GitHub** | https://github.com/yhyatt/ClawEvents | Fork, fetchers, tests |
| **ClawHub skill** | https://clawhub.ai/yhyatt/clawevents | `openclaw skills install clawevents` — **audit SKILL.md first** |
| Install (ClawHub) | `openclaw skills install clawevents` | VPS only after audit |
| Eventbrite API | https://www.eventbrite.com/platform/api | `EVENTBRITE_TOKEN` — all cities in ClawEvents |
| RA.co (Medellín listings) | https://ra.co/events/co/medellin | GraphQL fetcher — verify area id in fork |

### OpenClaw core

| Resource | URL | Use |
|----------|-----|-----|
| **OpenClaw GitHub** | https://github.com/openclaw/openclaw | Gateway on Hostinger VPS |
| **OpenClaw docs** | https://docs.openclaw.ai/ | Channels, cron, skills |
| OpenClaw site | https://openclaw.ai/ | Product overview |

### Scraping via OpenClaw

| Resource | URL | Use |
|----------|-----|-----|
| **Apify OpenClaw plugin** | https://github.com/apify/apify-openclaw-plugin | Eventbrite/Meetup actors |
| Apify integration docs | https://docs.apify.com/platform/integrations/openclaw | Setup |
| Apify marketplace | https://apify.com/integrations/openclaw | Install flow |
| Browser Use + OpenClaw | https://docs.browser-use.com/cloud/tutorials/integrations/openclaw | Hard pages (RA, IG) |

### Patterns & security

| Resource | URL | Use |
|----------|-----|-----|
| Awesome OpenClaw | https://github.com/rohitg00/awesome-openclaw | Workflow ideas |
| Awesome OpenClaw use cases | https://github.com/hesamsheikh/awesome-openclaw-usecases | Guest confirm, outreach |
| ClawHub security context | https://www.theverge.com/news/874011/openclaw-ai-skill-clawhub-extensions-security-nightmare | Why allowlist matters |
| Skills index (audit only) | https://clawskills.sh/openclaw/integrations/github | Discovery — do not blind-install |

### mdeai internal

| Resource | Path |
|----------|------|
| Trusted source URLs | [41-event-links.md](../../../tasks/events/docs/41-event-links.md) |
| Prompt registry | `mdeapp/src/lib/events/trusted-event-sources.ts` |
| Master discovery plan | [10-event-discover-plan.md](./10-event-discover-plan.md) §17 |
| EVP task pack | [EVP-018](../../../tasks/events/EVP-018-mvp-event-web-discovery-task-pack.md) |

### Medellín sources (P0 for automation)

| Source | URL |
|--------|-----|
| Eventbrite Medellín | https://www.eventbrite.com/d/colombia--medell%C3%ADn/events/ |
| RA.co Medellín | https://ra.co/events/co/medellin |
| Medellín Travel calendar | https://www.medellin.travel/calendario-eventos/ |
| Plaza Mayor | https://plazamayor.com.co/eventos-pm/ |
| Luma Medellín | https://luma.com/medellin |

---

## 5. Top 5 ways to use ClawEvents + OpenClaw in mdeai

| # | Use case | Score | Core / Advanced | Owner |
|---|----------|------:|-----------------|-------|
| 1 | **Automated daily event discovery jobs** | **96** | Core | Cron + ClawEvents/Apify → `raw_events` |
| 2 | **Event operations assistant** | **92** | Core | Patricia via OpenClaw commands |
| 3 | **WhatsApp / Telegram notifications** | **90** | Advanced | LATAM engagement — post-MVP |
| 4 | **Venue + organizer coordination** | **88** | Advanced | Verify stale events |
| 5 | **Automated digest + marketing** | **86** | Advanced | Postiz weekend post |

---

### 5.1 Automated daily event discovery jobs (best use)

**Every morning (06:00 America/Bogota):**

```text
→ scrape Eventbrite (API or Apify)
→ scrape RA.co (ClawEvents RA fetcher or Playwright)
→ scrape Medellín Travel (Firecrawl / new fetcher)
→ write Supabase raw_events
→ Mastra: normalize → dedupe → Places enrich
→ Gemini: summaries on candidates only
→ notify Patricia (approval count)
```

**Real-world example:**

```text
06:00 Bogotá
→ ingest completes
→ 34 new raw rows
→ 8 duplicates merged
→ 5 flagged for manual approval
→ Patricia WhatsApp: “5 events need review — open /admin/events/review”
```

**Architecture:**

```text
Supabase cron OR Vercel cron
  → Mastra eventDiscoveryWorkflow (orchestrator)
  → OpenClaw invokes ClawEvents CLI / Apify plugin
  → POST /api/internal/ingest/raw_events
  → Mastra normalize + dedupe
  → Places enrichment (mdeapp)
  → approval queue
  → is_active=true → Camila cards + pins
```

---

### 5.2 Event operations assistant

Patricia (or Sofía) uses natural-language **operator** commands — not Camila’s product chat.

**Example:** “Check failed event sources”

**Returns:**

- failed scraper name
- last successful `event_scrape_jobs` row
- retry suggestion (Playwright fallback)
- missing field counts

**Real-world example:**

```text
RA.co scraper failed (HTTP 403)
→ OpenClaw retries with Playwright profile
→ still fails → alert Patricia with scrape_job id
→ no new rows promoted to events
```

See [06a — Best OpenClaw Commands](./06a-openclaw-events-discovery.md).

---

### 5.3 WhatsApp / Telegram event notifications (advanced)

**LATAM-native** distribution after approval.

**User message example:**

```text
Top 3 nightlife events near Provenza tonight:
• Rooftop reggaeton — [source link]
• Techno warehouse — [source link]
• Salsa social — [source link]
```

**Flow:**

```text
approved events (is_active=true)
  → SQL filters (neighborhood, category, tonight)
  → optional personalization (later)
  → OpenClaw notification workflow
  → WhatsApp delivery (opt-in users only)
```

**Rule:** Same rows as CopilotKit — never a separate hallucinated list.

---

### 5.4 Venue + organizer coordination (advanced)

Automate **verification**, not publishing.

**Example:** “Confirm this Friday event is still active.”

OpenClaw may:

- open `source_url` (browser skill)
- draft email/WhatsApp to organizer (human approves send)
- set `discovery_status = needs_verification` in Supabase
- flag stale if 404 or sold out

---

### 5.5 Automated event digest + marketing (advanced)

**Generate** from **approved** rows only:

- weekend digest
- nightlife summary
- startup / Luma-style list
- tourism picks (medellin.travel overlap)

**Real-world example:**

```text
Friday 16:00 Bogotá
→ query top 10 approved events (Fri–Sun, quality_score)
→ Gemini draft “Top 10 Medellín Events This Weekend” (grounded)
→ Patricia approves copy
→ Postiz → Instagram / Facebook / WhatsApp channel
```

---

## 6. Core features table (OpenClaw automation)

| Feature | What it does | Real Medellín example | Priority |
|---------|--------------|----------------------|----------|
| Daily scrape automation | Runs discovery jobs | Morning ingest pipeline | **P0** |
| Retry failed scrapers | Self-healing | RA.co → Playwright fallback | **P0** |
| Approval notifications | Alerts Patricia | “12 events need review” | **P0** |
| Audit logs | Every worker action | Debug `event_scrape_jobs` | **P0** |
| Scheduled automation | Cron orchestration | 06:00 `America/Bogota` | **P0** |
| Event freshness monitoring | Stale source detection | “Eventbrite: 0 rows 3 days” | **P1** |
| Manual command execution | Operator triggers | “Run scraper now” | **P1** |
| Source health dashboard | Pipeline status | Admin metrics | **P1** |
| Event summary generation | Weekend digest draft | Top nightlife | **P1** |
| Ticket URL validation | 404 / sold-out check | Broken Eventbrite link | **P1** |

From [06a Core Features](./06a-openclaw-events-discovery.md) — OpenClaw **role** column maps 1:1 here.

---

## 7. Advanced features table

| Feature | Real-world example | Priority |
|---------|-------------------|----------|
| WhatsApp concierge | “Events near Laureles tonight” | **P2** |
| Personalized alerts | Tech events for founders | **P2** |
| Organizer verification workflows | Confirm Friday salsa night | **P2** |
| Auto social posting | Weekend digest via Postiz | **P2** |
| Calendar sync | “Remind me Saturday” | **P2** |
| AI operational assistant | “Why did RA scraper fail?” | **P2** |
| Social listening | Instagram popup parties | **P3** |
| Sponsor matching | Liquor × nightlife | **P3** |
| AI itinerary | Dinner → club → afterparty | **P3** — see [07 trip planning](./07-openclaw-trip-planning.md) |
| Event trend analysis | “Afro-house rising in Laureles” | **P3** |

---

## 8. Best mdeai workflow (end-to-end)

```text
┌─────────────────────────────────────────────────────────────┐
│ 06:00 America/Bogota                                         │
│ Supabase pg_cron OR Vercel cron → Mastra eventDiscoveryWorkflow│
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ OpenClaw worker (VPS)                                        │
│ • clawevents search --city medellin --format json  OR        │
│ • Apify OpenClaw plugin (Eventbrite actor)                   │
│ • Playwright fallback for RA.co                              │
└────────────────────────────┬────────────────────────────────┘
                             ▼
              POST /api/internal/ingest/raw_events
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Supabase raw_events → Mastra normalize → dedupe              │
│ → enrichVenueWorkflow (Places) → quality_score               │
│ → Gemini ai_summary (approved path only)                     │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Patricia approval → events.is_active = true                  │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Camila: searchEventsTool / fast path → CopilotKit + map pins │
│ (optional P2) WhatsApp digest from same SQL rows             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. ClawEvents on VPS — install & run

### 9.1 Audit before install

1. Read [ClawHub clawevents](https://clawhub.ai/yhyatt/clawevents) SKILL.md
2. Diff against [GitHub ClawEvents](https://github.com/yhyatt/ClawEvents) `main`
3. Pin version in allowlist (no floating `latest` on prod)

### 9.2 Install (operator)

```bash
# On Hostinger VPS (OpenClaw already running per mde-hostinger runbook)
openclaw skills install clawevents

cd /path/to/ClawEvents   # fork with medellin city
pip3 install -r requirements.txt
# Optional browser fetchers:
pip3 install -e ".[browser]"
playwright install chromium

export EVENTBRITE_TOKEN="..."   # free: eventbrite.com/platform/api
# RA fetcher: no key; verify Medellín area id in fork
```

### 9.3 Cron invoke (after `medellin` fork)

```bash
python3 -m clawevents search \
  --city medellin \
  --days 7 \
  --format json \
  --limit 100 \
  > /tmp/medellin-events.json

# Worker script POSTs each batch to mdeapp ingest API (scoped JWT)
curl -X POST https://mdeapp.../api/internal/ingest/raw_events \
  -H "Authorization: Bearer $MDE_INGEST_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/medellin-events.json
```

### 9.4 Medellín fork (CLAW tasks)

| Task | Description | Priority |
|------|-------------|----------|
| CLAW-01 | Fork [ClawEvents](https://github.com/yhyatt/ClawEvents); add `medellin` to `city_registry.py` | P2 |
| CLAW-02 | Implement `MedellinTravelFetcher` (`BaseFetcher`) | P2 |
| CLAW-03 | Wire `tuboleta` fetcher (mirror iaBilet scrape pattern) | P2 |
| CLAW-04 | Verify RA GraphQL area id for `co/medellin` | P2 |
| CLAW-05 | Map ClawEvents `Event` → `raw_events.payload` JSON schema | P2 |
| CLAW-06 | Upstream PR or vend under `github/clawevents-medellin` | P3 |

Proposed registry entry: [10-event-discover-plan.md §17](./10-event-discover-plan.md).

---

## 10. OpenClaw operator commands (Patricia)

| Command | Result |
|---------|--------|
| Run Medellín event ingest now | All enabled fetchers / actors |
| Check failed event sources | Failed `event_scrape_jobs` + reason |
| Show new events needing approval | Link to `/admin/events/review` |
| Verify this event link | Browser check `source_url` |
| Find missing venue pins | Trigger Places enrich retry |
| Create weekend event digest | Draft from approved rows |
| Send me top tech events Friday | Filtered WhatsApp brief (P2) |

Full list: [06a](./06a-openclaw-events-discovery.md).

---

## 11. Implementation tasks (OC-EVD)

| Task | Description | Priority | Depends on |
|------|-------------|----------|------------|
| OC-EVD-01 | Sandbox OpenClaw gateway on VPS | P0 | Hostinger access |
| OC-EVD-02 | Install Apify OpenClaw plugin | P0 | OC-EVD-01 |
| OC-EVD-03 | Allowlist skills only (`clawevents` pinned) | P0 | Security review |
| OC-EVD-04 | `POST /api/internal/ingest/raw_events` + scoped JWT | P0 | EVD-01 schema |
| OC-EVD-05 | Daily ingest command / cron hook | P0 | EVD-08 |
| OC-EVD-06 | Failure alert → Patricia (WhatsApp/Telegram) | P1 | Channels configured |
| OC-EVD-07 | Manual “run scraper now” | P1 | OC-EVD-05 |
| OC-EVD-08 | Source freshness report | P1 | `event_scrape_jobs` |
| OC-EVD-09 | Ticket URL verifier skill | P1 | Browser skill |
| OC-EVD-10 | Audit log every OpenClaw action | P0 | OC-EVD-01 |

**Not a blocker for Camila MVP** — start after EVD-09 (search wired to approved rows).

---

## 12. What NOT to use OpenClaw / ClawEvents for

| Bad use | Why |
|---------|-----|
| Primary ranking engine | SQL + `quality_score` in Mastra |
| Source of truth | Supabase `events` |
| Direct Stripe operations | Andrés path stays in mdeapp only |
| Autonomous publishing | `is_active` requires Patricia |
| AI-only discovery | eventpulse-ai anti-pattern |
| Replacing Google Maps | Places owns pins |
| Camila’s main chat runtime | CopilotKit + Mastra on Vercel |
| Service-role Supabase key in OpenClaw env | Use ingest JWT |

---

## 13. Risks and mitigations

| Risk | Fix |
|------|-----|
| Over-automation | Human approval before `is_active=true` |
| ClawHub / skill malware | Allowlist + pin + audit SKILL.md |
| AI hallucinations in listings | DB-only serve via `search-events` |
| Broken scrapers | Retry + Playwright + Patricia alert |
| Duplicate events | Mastra dedupe + `external_id` |
| Too many workflows | OC-EVD-01..10 only for P2 |
| Direct DB access from VPS | Ingest API only |
| Notification spam | Opt-in + rate limits (P2) |
| ClawEvents ≠ Medellín yet | Fork required (CLAW-01..05) |
| Timezone bugs | `America/Bogota` everywhere |

---

## 14. Build order (OpenClaw track)

| Step | Action | Verify |
|------|--------|--------|
| 1 | Complete [10-plan](./10-event-discover-plan.md) EVD-01..10 without OpenClaw | Camila Music chip + DB rows |
| 2 | OC-EVD-04 ingest API + RLS | Test POST → `raw_events` |
| 3 | OC-EVD-01..03 VPS sandbox + allowlist | `openclaw` health |
| 4 | CLAW-01..05 Medellín fork OR port fetchers to Mastra (Path A) | ≥30 raw rows/run |
| 5 | OC-EVD-05 daily cron wired to Mastra workflow | 3 green `event_scrape_jobs` |
| 6 | OC-EVD-06 Patricia alerts | WhatsApp test message |
| 7 | OC-EVD-07..09 ops commands | Manual retry works |
| 8 | P2 WhatsApp user digests | Opt-in only |
| 9 | P3 digests + Postiz + trip skills ([07](./07-openclaw-trip-planning.md)) | Separate phase |

---

## 15. Final recommendation

**Best role for ClawEvents + OpenClaw:**

```text
Event automation layer
NOT
event intelligence layer
```

| Use for | Keep in mdeapp / Supabase |
|---------|---------------------------|
| Scraping automation | `events` truth |
| Retries & fallbacks | Mastra workflows |
| Patricia notifications | CopilotKit UI |
| Operator commands | Google Places geo |
| Messaging digests (P2) | Gemini summarize-only |
| Ticket link checks | Stripe (Andrés) |

**Strategic grade:** **95/100** when ClawEvents + OpenClaw sit **under** Mastra + Supabase + Maps — **68/100** if treated as the main platform.

---

## Appendix A — OpenClaw feature scores (from 06)

| Feature | Score | MVP? |
|---------|------:|------|
| Browser automation | 98 | Core |
| Scheduled background tasks | 97 | Core |
| Channel gateway | 96 | Core (ops); Advanced (user WA) |
| Human-in-the-loop | 95 | Core |
| Cloud browser profiles | 94 | Advanced |
| Browser screenshots | 92 | Core |
| Multi-channel delivery | 91 | Advanced |
| Agent stream / debug | 90 | Advanced |
| Webhook triggers | 89 | Advanced |
| Skill catalog patterns | 88 | Advanced |

---

## Appendix B — Trip planning (out of scope here)

[07-openclaw-trip-planning.md](./07-openclaw-trip-planning.md) covers itinerary, flight/hotel monitoring, packing lists, and document reminders. Reuse **only after** event inventory is trustworthy:

- “Events Saturday → dinner → nightlife” itinerary
- Do **not** merge trip cron with discovery cron in v1

---

*Author: consolidated from ClawEvents review + [06](./06-OpenClaw-for-event-discovery.md) + [06a](./06a-openclaw-events-discovery.md). Implementation gates: task-verifier + `npm run floor` for any mdeapp API touched by OC-EVD-04.*
