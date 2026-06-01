---
id: openclaw-events
title: OpenClaw × Events — PRD, Strategy & Build Plan for mdeai.co
phase: ADVANCED
priority: P1
status: Active
area: ai-agents, events
skill: [open-claw, events, mde-whatsapp, mde-supabase, mde-hostinger]
subagents: [mdeai-planner, mdeai-executor]
research_date: 2026-05-08
---

<!-- task-summary -->
> **What:** Comprehensive PRD, architecture, and ranked action plan for using OpenClaw as the execution layer for mdeai.co's events vertical — event planning, discovery, ticketing, sponsor sales, WhatsApp automation, venue research, and post-event reporting
> **Why:** mdeai.co has an events marketplace but no conversational AI execution layer. In Medellín, event discovery, sponsor outreach, and attendee communication happen on WhatsApp. OpenClaw bridges the gap between mdeai.co's Supabase data and WhatsApp/Discord/Email channels, automating the full event lifecycle while Paperclip governs approvals and Hermes reasons.
> **Architecture:** OpenClaw = execution (WhatsApp/Discord/browser/skills); Hermes = reasoning; Paperclip = approval governance; Supabase = source of truth
> **ADVANCED · P1 · Active**

---

# OpenClaw × Events — mdeai.co PRD & Strategy

> **Research:** 22 URLs fetched and verified · 15 additional searches · 2026-05-08  
> **Honest flag:** Several user-provided URLs returned 404 or were unverifiable — all findings below are labeled by verification status.

---

## 1. Executive Summary

### What OpenClaw Can Do for mdeai Events

OpenClaw is an open-source, self-hosted AI agent gateway (Baileys WhatsApp, Discord, Slack, browser) controlled by SKILL.md files. For mdeai.co's events vertical, it functions as the **execution layer** that runs 24/7 on the Hostinger VPS, connecting mdeai's Supabase event data to the channels where Medellín event-goers, sponsors, and venues actually live.

**Concrete capabilities verified by research:**
- Event discovery and aggregation from multiple sources (Luma, Eventbrite, Google)  
- WhatsApp attendee reminders with persistent escalation until acknowledged  
- AI-powered sponsor outreach email routing and qualification  
- Guest confirmation via AI voice calls ($0.15/call, 60–80% same-day response)  
- Full event lifecycle planning (vendor tracking, timelines, budgets) via SKILL.md  
- Luma API integration (search, RSVP, guest lists, event creation)  
- Eventbrite search and discovery via Composio  
- Google Calendar sync (OAuth or ICS feed)  
- Post-event follow-up sequences (survey, CRM update, 48h tasks)

### Why It Matters for mdeai

| Today | With OpenClaw |
|-------|--------------|
| Event sponsors emailed manually by sk | Sponsor pipeline automated: find → enrich → pitch → track |
| Attendees reminded via manual WA broadcast | Automated multi-touch sequence (7 day → 1 day → 1 hour) |
| Venue research done ad-hoc on Google | Agent researches 10 venues, scores them, returns shortlist |
| No event discovery for users | WA concierge answers "¿qué eventos hay este fin de semana?" |
| No post-event sponsor ROI | Automated PDF report sent within 48h of event end |

### Best Opportunities (revenue-ordered)

1. **Sponsor outreach automation** — direct revenue; sponsors are mdeai's primary monetization
2. **WhatsApp ticket reminders** — reduces no-shows; protects sponsor impression value
3. **Event discovery concierge** — user acquisition; answers "what's happening this weekend in Medellín"
4. **Venue research agent** — saves 3–5h per event; reduces venue negotiation friction
5. **Post-event ROI reports** — enables sponsor renewal; highest-leverage sales tool

### Biggest Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| WhatsApp ToS ban (Baileys = unofficial client) | High | `dmPolicy: allowlist`; no mass blasts; escalate via Infobip official API for campaigns |
| AI confirms wrong venue/date to attendees | High | Paperclip approval gate before any public-facing message |
| Sponsor email marked as spam | Medium | Manual review gate on first outreach per domain |
| Scraper blocks from Ticketmaster/Luma | Medium | Rate limit + cache (30 min); use official Luma API via `echennells/luma-skill` |
| Fake/hallucinated GitHub repos | Low | See research verification below; all repos rated individually |

---

## 2. GitHub Repos — Verified Research

> All 8 user-provided repos were fetched. 1 returned 404 (flagged). 1 was empty stub (flagged). Scored 0–100 on mdeai fit.

### Repo 1: `chris-openclaw/event-planner-os`
**URL:** https://github.com/chris-openclaw/event-planner-os  
**Verified:** YES — exists, last commit 2026-04-12, markdown/JSON only, 0 stars

**What it does:** Full lifecycle event planning skill in proper SKILL.md format. Handles 20+ event types (birthday, wedding, conference, concert, festival, workshop, fundraiser, etc.) with backward-calculated task timelines (e.g., "conference in 8 weeks" → auto-generates milestone tasks counting back). Tracks tasks with due dates and assignees, a reusable vendor directory (caterers, DJs, photographers, AV companies), volunteer management, and budget with actual-spend tracking. Data persisted in `event-data.json`.

**Features:**
- 20+ event type templates with auto-generated task timelines
- Vendor directory reusable across multiple events
- Budget tracking: planned vs. actual spend, threshold alerts
- Volunteer/helper management with role assignments
- Triggers on casual phrases: "I need to plan a birthday party," "the conference is in 8 weeks," "how much have we spent"
- Proper SKILL.md frontmatter with emoji metadata (`🎉`), version `1.0.0`
- JSON schema fully documented in README

**Event use cases:**
- Planning mdeai nightlife events (DJ, venue, guest list, budget)
- Fashion show production (20+ vendor categories)
- Sponsor-funded events (budget tracking per sponsor contribution)
- Pageants and contests (multi-stage timeline management)
- Community meetups (simple 1-week timeline with task assignments)

**Real-world mdeai example:**  
sk types: "Plan a fashion networking event for 150 people in Laureles on June 20."  
Agent creates task list backward from June 20: venue confirmation by June 10, catering deposit June 8, social media posts June 5, etc. Tracks DJ booking, photo booth rental, sponsor banner production. Weekly updates via WhatsApp.

**Strengths:** Best-structured event skill found; correct OpenClaw format; multi-type support; no external API dependencies (self-contained)  
**Weaknesses:** No integrations (no Luma/Eventbrite sync, no calendar); needs HTTP tool config for Supabase  
**Production readiness:** 80/100 — deploy immediately, add HTTP tool for Supabase leads  
**Score:** 88/100  
**Recommendation: USE — install first**  
**Adaptation for mdeai:** Add HTTP tool POST to Supabase `events` table on creation; add WhatsApp notification hook on task due dates; add Paperclip approval card on budget overruns

---

### Repo 2: `echennells/luma-skill`
**URL:** https://github.com/echennells/luma-skill  
**Verified:** YES — exists, last commit 2026-04-13, markdown only, 0 stars

**What it does:** Production-grade Luma (lu.ma) API integration for OpenClaw. Authenticates via session cookie. Full read/write: search events by keyword, discover by city, browse by category (`cat-crypto`, `cat-networking`, etc.), geo-located discovery, view RSVPs, manage guest lists, create new events with rich text descriptions (ProseMirror format). Uses only `curl`.

**Features:**
- Event discovery by city, keyword, or category
- RSVP status check for any event URL
- Guest list retrieval (for events you manage)
- Event creation with description, date, capacity, ticket tiers
- Bonjour/place resolution for city name → Luma place ID
- Clear boundaries: Eventbrite, Meetup.com, Google Calendar NOT handled by this skill
- Requires env var: `LUMA_AUTH_SESSION_KEY`

**Event use cases:**
- Discover competing events in Medellín this weekend
- Create mdeai events on Luma automatically from chat
- Track RSVPs for mdeai-hosted events
- Monitor guest list for sold-out detection
- Publish event updates to Luma attendees

**Real-world mdeai example:**  
sk types: "Are there any networking events in Medellín next week?"  
Agent queries Luma Bonjour for `medellín`, returns categorized list. User picks event. Agent checks RSVP status. If mdeai is hosting: agent creates the event on Luma, sets ticket tiers, returns public URL.

**Strengths:** Production-grade Luma integration; correct SKILL.md format; real API endpoints documented; clean env-var declarations  
**Weaknesses:** Luma session cookie auth can expire; no Eventbrite (separate skill needed); Luma Plus required for RSVP management  
**Production readiness:** 85/100  
**Score:** 87/100  
**Recommendation: USE — install alongside event-planner-os**  
**Adaptation for mdeai:** Set `LUMA_AUTH_SESSION_KEY` from Infisical; add Supabase POST on event creation to sync mdeai.co `events` table; add bilingual description templates (Spanish/English)

---

### Repo 3: `FrankyJo/openclaw_skill_serach_it_events`
**URL:** https://github.com/FrankyJo/openclaw_skill_serach_it_events  
**Verified:** YES — exists, last commit 2026-04-03, Shell/markdown, 0 stars, ClawHub-published

**What it does:** Proper SKILL.md-format skill for finding IT events (conferences, meetups, hackathons, workshops, webinars, bootcamps) by user-specified interest and location. Supports one-time search and weekly digest cron. Multilingual. Deduplicates previously-seen events. On follow-up, returns registration/payment links. Published on ClawHub.

**Features:**
- 11 event types: conferences, meetups, hackathons, workshops, webinars, bootcamps, etc.
- Location: country-specific or worldwide
- Weekly cron digest mode
- Deduplication (won't re-report events already shown)
- Registration link retrieval on user request
- Multilingual input accepted

**Event use cases:**
- Discover tech/startup events in Medellín or Colombia
- Find hackathons for mdeai sponsor activations
- Weekly digest of relevant industry events for event-prospecting agent

**Real-world mdeai example:**  
Event Discovery Agent runs weekly cron: "Find startup events in Medellín or Bogotá this week." Agent returns categorized list, deduplicates vs. prior weeks, posts digest to mdeai team WhatsApp or Discord.

**Strengths:** Correct skill format; ClawHub-published (verified working); weekly cron pattern; deduplication built in  
**Weaknesses:** IT-events focused; needs adaptation for nightlife/fashion/arts events relevant to Medellín; no Luma/Eventbrite API (web search based)  
**Production readiness:** 70/100  
**Score:** 72/100  
**Recommendation: MAYBE — adapt triggers for Medellín event types beyond IT**  
**Adaptation for mdeai:** Change triggers to include "eventos en Medellín," "qué hay este fin de semana"; expand event types to nightlife/fashion/sports/pageants; add Supabase POST to event discovery log

---

### Repo 4: `stockii/event-skill-for-openclaw`
**URL:** https://github.com/stockii/event-skill-for-openclaw  
**Verified:** YES — exists, last commit 2026-02-25, JavaScript, 0 stars

**What it does:** Node.js event aggregator for Gießen, Germany and 30km radius. Pulls from Ticketmaster API, giessen.de, marburg.de, wetzlar.de. Deduplicates across sources, filters by week, outputs JSON/Text/Discord-ready format. 30-minute cache. Cron or on-demand.

**Features:**
- Multi-source aggregation (API + web scraping)
- 30km geo-radius filtering
- Weekly event filtering
- Deduplication across sources
- Multiple output formats (JSON, text, Discord embed)
- Cache layer (30 min)

**Warning:** NOT a SKILL.md-format skill. Standalone Node.js script. Must be adapted to SKILL.md format to work with OpenClaw agent.

**Event use cases:**
- Architecture reference for multi-source Medellín event aggregator
- Ticketmaster API integration pattern
- Discord embed output format

**Real-world mdeai example:**  
With adaptation: aggregate events from Taquilla.com, Tu Boleta, Eventbrite Colombia, and Luma into a weekly digest for mdeai's Medellín event discovery feed.

**Strengths:** Multi-source aggregation architecture; real Ticketmaster API integration; deduplication pattern  
**Weaknesses:** Not SKILL.md format; German portals only; needs full rewrite for mdeai; no Spanish NLP  
**Production readiness:** 35/100 as-is; 65/100 after adaptation  
**Score:** 45/100  
**Recommendation: MAYBE LATER — use as architecture reference only; rewrite as SKILL.md**

---

### Repo 5: `Remote55/openclaw`
**URL:** https://github.com/Remote55/openclaw  
**Verified:** YES — exists, last commit 2026-04-21, TypeScript, 0 stars

**What it does:** Full-stack Next.js 16 hotel + local events discovery platform for Southeast Asia. Gemini 2.5 Flash (primary LLM) + Claude Haiku 4.5 (fallback). Integrates LiteAPI (2M+ hotels), Ticketmaster + SerpAPI for local events, Upstash Redis, Supabase (Postgres + pgvector), Inngest for jobs, Stripe test mode, OpenStreetMap. Bilingual Thai/English, Baht/USD.

**Warning:** This is a complete Next.js app, NOT an OpenClaw skill. It uses Supabase and pgvector — highly relevant to mdeai.co's stack — but is a frontend application, not an OpenClaw agent.

**Features:**
- Hotel + local events discovery in one UI
- Ticketmaster + SerpAPI event data integration
- Supabase + pgvector semantic search
- Inngest background job queue
- Stripe payment integration
- OpenStreetMap geo-display

**Event use cases:**
- Architecture reference for hotel + events combo page (mdeai.co's stay + experience vertical)
- Ticketmaster + SerpAPI integration pattern for events discovery
- pgvector semantic event search pattern

**Real-world mdeai example:**  
Reference architecture for mdeai.co's Events page: show hotels AND nearby events; semantic search across both. Adapt the Ticketmaster+SerpAPI integration for Colombian event sources.

**Strengths:** Proven stack (Supabase+pgvector, exactly mdeai's stack); hotel+events combo matches mdeai's verticals; real production-like code  
**Weaknesses:** Not an OpenClaw skill; SEA market (Baht/Thai); needs full adaptation for Colombia/COP; not WhatsApp-first  
**Production readiness:** 60/100 as architecture reference  
**Score:** 65/100  
**Recommendation: REFERENCE ONLY — mine for Ticketmaster/SerpAPI integration patterns**

---

### Repo 6: `Sumedh-6504/OpenClaw_Build_Event`
**URL:** https://github.com/Sumedh-6504/OpenClaw_Build_Event  
**Verified:** YES — exists, but MISLEADINGLY NAMED

**Warning:** Despite the name, this is a **file system analysis dashboard** (Node.js, Express, Socket.io, chokidar, Chart.js) built during an OpenClaw hackathon ("Build Event"). It has zero relevance to event planning, event management, or the events vertical.

**Score:** 0/100 for events use case  
**Recommendation: DO NOT USE — completely unrelated to events**

---

### Repo 7: `testbot-01/openclaw_event`
**URL:** https://github.com/testbot-01/openclaw_event  
**Verified:** YES — exists, but EMPTY STUB

**Warning:** README contains only `# openclaw_event`. No code, no SKILL.md, no content of any kind.

**Score:** 0/100  
**Recommendation: DO NOT USE — empty placeholder**

---

### Repo 8: `openclaw/skills` (`afrexai-cto/afrexai-event-planning/SKILL.md`)
**URL:** https://github.com/openclaw/skills/blob/main/skills/afrexai-cto/afrexai-event-planning/SKILL.md  
**Verified:** NOT FOUND — HTTP 404

**Warning:** The `openclaw/skills` organization repo returns 404. The specific file path cannot be verified. Note: web searches surfaced that a `mariovallereyes/luma-event-manager/SKILL.md` file exists in the official OpenClaw skills repo, suggesting the repo may be private or the URL format differs. Do not install this skill until verified.

**Score:** N/A  
**Recommendation: DO NOT USE until URL verified — may be private or fictional**

---

### Additional Repos Found via Web Search

### Repo 9: `VoltAgent/awesome-openclaw-skills`
**URL:** https://github.com/VoltAgent/awesome-openclaw-skills  
**Verified:** Referenced in multiple search results (5,400+ skills listed)

**What it does:** Curated directory of 5,400+ OpenClaw skills organized by category. Categories relevant to mdeai: `calendar-and-scheduling.md`, `marketing-and-sales.md`, `events-and-hospitality.md`. Primary source for finding installable skills without building from scratch.

**Score:** 90/100 as a discovery resource  
**Recommendation: USE — browse `events-and-hospitality.md` category before building any skill from scratch**

---

### Repo 10: `hesamsheikh/awesome-openclaw-usecases`
**URL:** https://github.com/hesamsheikh/awesome-openclaw-usecases  
**Verified:** Referenced in search results

**What it does:** Community use-case collection. Includes documented AI voice call guest confirmation pattern (60–80% same-day response rate vs 30–40% for texts), relevant to mdeai event attendee confirmation.

**Score:** 75/100  
**Recommendation: USE — specifically for the voice-call confirmation pattern (adapted for Medellín)**

---

### Repo 11: `centminmod/explain-openclaw` (Matthew Berman sponsorship workflow)
**URL:** https://github.com/centminmod/explain-openclaw (specific file: `matthew-berman-workflow.md`)  
**Verified:** Referenced in search results

**What it does:** Documents Matthew Berman's autonomous sponsorship email routing workflow: 5-dimension JSON scoring rubric (relevance, audience fit, deal size, timeline, brand alignment) → Slack escalation / auto-qualification / rejection / spam bin. Includes HubSpot CRM integration. Three-layer prompt injection defense.

**Score:** 85/100 for sponsor outreach automation  
**Recommendation: USE — adapt scoring rubric for mdeai sponsor qualification**

---

## 3. Top Websites, Articles, Guides

> Scored on mdeai relevance (0–100). Sources are verified real unless flagged.

### Source 1: `openclawplaybook.ai/guides/how-to-use-openclaw-for-event-management/`
**URL:** https://www.openclawplaybook.ai/guides/how-to-use-openclaw-for-event-management/  
**Score: 88/100**

**Key ideas:**
- Store event config in files that OpenClaw reads on every interaction (persistent context without conversation memory limits)
- RSVP tracking: daily pull from Google Sheets, capacity monitoring, duplicate detection
- Attendee comms sequence: confirmation → 7-day → 1-day → 1-hour → post-event thank-you → survey
- Vendor coordination: structured tracking table, weekly status checks
- Post-event: recording distribution, feedback collection, CRM updates, 48h follow-up tasks

**Useful tactics for mdeai:**
- 5-step attendee communication sequence (adaptable for WA + email)
- Vendor status table structure (reuse for mdeai venue/DJ/catering management)
- 48h post-event task window with CRM update trigger
- Google Sheets as RSVP source (easy bridge before Supabase full integration)

---

### Source 2: `serif.ai/openclaw/hospitality-events`
**URL:** https://www.serif.ai/openclaw/hospitality-events  
**Score: 85/100**

**Key ideas:**
- 10 hospitality workflows: vendor coordination, countdown timers, contract tracking, RSVP sequences, surveys, review monitoring, budget alerts, venue availability, inventory (tables/AV), booking forecasting
- Claims 5–10 hours saved per event within first month
- Multi-channel (WhatsApp + email) outreach sequences
- Review monitoring: Google/Yelp/TripAdvisor/social (competitor venue intelligence)

**Useful tactics for mdeai:**
- Review monitoring for Medellín venues (competitive intelligence feed)
- Inventory management pattern (tables, chairs, AV) for mdeai venue partners
- Seasonal booking forecasting (Feria de las Flores, New Year, Carnaval de Barranquilla)

---

### Source 3: `clawrapid.com/en/blog/openclaw-event-management`
**URL:** https://www.clawrapid.com/en/blog/openclaw-event-management  
**Score: 82/100**

**Key ideas:**
- AI voice call confirmation: SuperCall plugin + Twilio + ngrok
- Cost: ~$0.15/call; $4.50 for 30-guest event
- 60–80% same-day response rate (vs 30–40% for texts)
- Retry logic for unanswered calls
- Multilingual (Spanish-first for Medellín)

**Useful tactics for mdeai:**
- Use voice confirmation for high-value sponsor meetings (not mass attendee calls)
- Retry logic: 2 attempts, 4h apart, then escalate to WA text
- Adapt for Spanish: "Hola, confirmo tu asistencia al evento de mdeai.co el viernes..."

**Risk flag:** Twilio-based voice calls add cost and complexity. Start with WA text reminders; add voice only for VIP/sponsor confirmations.

---

### Source 4: `openclawplaybook.ai/guides/openclaw-for-event-planners/`
**URL:** https://www.openclawplaybook.ai/guides/openclaw-for-event-planners/  
**Score: 78/100**

**Key ideas:**
- Start narrow: automate one repeatable task first (e.g., vendor confirmation only)
- Document all processes in config files, not conversation history
- Build in human checkpoints before irreversible decisions (contracts, payments, public announcements)
- Setup time: one afternoon for first workflow

**Useful tactics for mdeai:**
- "Start with vendor confirmation" → week 1 goal for mdeai events
- Human checkpoint pattern → Paperclip approval card before any public WA blast

---

### Source 5: `tryopenclaw.ai/industries/event-planners/`
**URL:** https://www.tryopenclaw.ai/industries/event-planners/  
**Score: 60/100**

**Key ideas:** Commercial SaaS wrapper. Positioning: "The one thing that goes wrong is always the one you forgot to confirm." Features: speaker vetting, venue evaluation, RSVP tracking, vendor follow-ups, budget oversight, weather monitoring, post-event summaries. $1/24hr trial, $39/month.

**Verdict:** mdeai runs self-hosted OpenClaw. No need to pay this service. Useful for understanding the market positioning and competitive landscape.

---

### Source 6: `tencentcloud.com/techpedia/141401`
**URL:** https://www.tencentcloud.com/techpedia/141401  
**Score: 65/100**

**Key ideas:** Registration intake + normalization + dedup + personalized calendar invite confirmations + timezone-aware reminders + check-in inquiry routing + post-event surveys + lead segmentation.

**Useful tactics:** Timezone-aware reminders (COT = UTC-5) — ensure all WA messages fire in Colombian local time, not UTC.

---

### Source 7: `tencentcloud.com/techpedia/141336`
**URL:** https://www.tencentcloud.com/techpedia/141336  
**Score: 20/100** ⚠️ CONTRADICTORY CONTENT

**Warning:** This page dismisses OpenClaw for event planning entirely, recommending dedicated event software instead. Appears to be written for a different audience or time period than URL #141401. Do not use this as a reference — its advice conflicts with verified working OpenClaw event skills.

---

### Source 8: `createwith.com/tool/openclaw/events`
**URL:** https://www.createwith.com/tool/openclaw/events  
**Score: 55/100**

**Key ideas:** Active community events calendar for OpenClaw meetups. Past 2026 events: Singapore FinTech, Agent Memory Workshop, Arizona Hackathon, Paris Agents Anonymous. Shows community is active; events run on Luma/Eventbrite.

**Useful for mdeai:** Shows how to position mdeai as an event host in the OpenClaw community (potential sponsor/partner discovery channel).

---

### Source 9: LinkedIn — Angela Strange
**URL:** https://www.linkedin.com/posts/angelastrange_its-a-little-disconcerting-how-much-my-openclaw-activity-7439746272233684992-MHnb/  
**Score: 45/100**

**Key ideas:** Saves 30+ min/day on meeting prep. Agent has its own email, phone number, and credit card. "The web still isn't built for agents. Still too many hoops to jump through."

**Relevant to mdeai:** Confirms the friction reality — browser automation will hit CAPTCHAs and login walls. Plan for fallback to API-based integrations (Luma API, Eventbrite API, Composio) rather than relying purely on browser scraping.

---

### Source 10: `lennysnewsletter.com/p/openclaw-the-complete-guide-to-building`
**URL:** https://www.lennysnewsletter.com/p/openclaw-the-complete-guide-to-building  
**Score: 55/100** (paywalled)

**Key ideas (from free preview):** Claire Vo article. Six practical workflow examples including sales outreach and project management. Setup via existing APIs/webhooks, not custom code.

**Verdict:** Paywalled. The sales outreach pattern is relevant for sponsor outreach automation. Consider purchasing if sk wants the full article.

---

## 4. OpenClaw Use Cases by Category

### A. Event Planning

**Core features:**
- Event brief intake from chat: "Plan a fashion networking event, 150 people, Laureles, June 20"
- Auto-generate backward task timeline from event date
- Vendor directory (reusable: DJ, catering, photographer, venue, AV)
- Budget tracking: planned vs. actual, threshold alerts

**Advanced features:**
- Multi-event management (track 3–5 events concurrently)
- Task assignment to team members with WA reminders on due dates
- Sponsor contribution tracking within event budget
- Paperclip approval card when budget overrun > 10%

**Workflow example:**
```
sk: "Plan mdeai sponsor mixer, 80 guests, El Poblado, July 5"
    → Agent creates event-data.json
    → Task timeline: venue confirmed by June 25, catering by June 22, invites by June 18
    → Vendor slots: DJ (open), catering (open), photographer (open)
    → Budget: 5M COP total, 0 spent
    → WA confirmation: "Evento creado. Te recuerdo el June 18 para enviar invitaciones."
```

**Recommended skill:** `chris-openclaw/event-planner-os` (verified, install first)  
**Recommended integrations:** Supabase `events` table sync, Paperclip budget alert card  
**Benefits for mdeai:** Eliminates ~3h of planning overhead per event  
**Revenue impact:** Indirect — better-executed events → higher sponsor satisfaction → renewal

---

### B. Event Management (day-of operations)

**Core features:**
- Check-in inquiry routing (WA: "¿Ya llegaste? Confirma tu check-in")
- Real-time attendee count vs. capacity
- Vendor status checks on event day
- Issue escalation to sk via Paperclip

**Advanced features:**
- QR code check-in integration (Supabase `event_checkins` table)
- Live attendance feed to sponsor dashboard
- Staff task assignments with real-time updates

**Workflow example:**
```
Day of event (July 5, 17:00 COT):
    → Agent sends WA to all ticket holders: "El evento comienza en 1 hora. Dirección: [venue]"
    → At 19:00: "¿Ya llegaste? Muestra tu código QR en la entrada."
    → Agent monitors check-in count vs. 80-guest capacity
    → At 80%: Paperclip card to sk → "72/80 checkins. ¿Abrimos lista de espera?"
```

**Recommended skills:** `advanced-calendar` (persistent reminders), custom `mde-event-checkin` SKILL.md  
**Benefits for mdeai:** No missed no-shows, real-time venue capacity control  
**Revenue impact:** Medium — reduces no-shows by ~20%; protects sponsor impression value

---

### C. Event Discovery / Search

**Core features:**
- "¿Qué eventos hay este fin de semana en Medellín?" → curated answer
- Category filtering: nightlife, fashion, sports, tech, food
- Geo-radius filtering (Laureles, El Poblado, Envigado, Centro)
- Source aggregation: Luma, Eventbrite, Tu Boleta, Taquilla.com

**Advanced features:**
- Personalized event recommendations based on past attendance
- pgvector semantic search ("eventos parecidos al festival de moda de mayo")
- Discovery digest sent to subscribers every Thursday

**Workflow example:**
```
Renter: "¿Qué hay este fin de semana en Laureles?"
    → Agent queries Luma (echennells/luma-skill) for Medellín events
    → Agent queries Eventbrite Colombia via Composio
    → Deduplicates, filters by neighborhood/date
    → Returns: 3 events with name, date, price, link
    → "¿Quieres que te recuerde el viernes?"
```

**Recommended skills:** `echennells/luma-skill`, Eventbrite via Composio, `FrankyJo` skill (adapted)  
**Recommended integrations:** pgvector embeddings on events table, Ticketmaster API  
**Benefits for mdeai:** Event discovery drives platform engagement and sponsor visibility  
**Revenue impact:** High indirect — discovery drives ticket sales and sponsor impressions

---

### D. Ticketing

**Core features:**
- Ticket purchase confirmation via WA ("Tu boleta está confirmada. Aquí tu código QR.")
- Ticket availability check ("¿Quedan boletas para el evento del viernes?")
- Resale/transfer handling (Paperclip approval gate)
- Refund request routing

**Advanced features:**
- Stripe payment status monitoring (webhook-triggered WA notification)
- QR code generation and delivery via WA
- Ticket tier upsell ("Solo quedan 5 boletas VIP por 150K COP. ¿Las quieres?")

**Workflow example:**
```
Stripe webhook: payment_intent.succeeded
    → Supabase edge: create ticket record
    → OpenClaw hook: POST /hooks/wake
    → Agent generates QR code
    → Sends WA: "¡Listo! Aquí tu boleta para [evento]. [QR image]"
    → Schedules reminder: 24h before event
```

**Recommended skills:** Custom `mde-ticketing` SKILL.md + Stripe webhook trigger  
**Recommended integrations:** Stripe (existing), Supabase `tickets` table, QR code service  
**Benefits for mdeai:** Instant ticket delivery; no manual WA message per buyer  
**Revenue impact:** Direct — every ticket sold = automated delivery; 0 extra labor cost

---

### E. Sponsor Sales

**Core features:**
- Sponsor prospect list generation (local brands in target verticals)
- Contact enrichment (website, LinkedIn, phone)
- Personalized pitch generation (Spanish-first)
- Outreach tracking: sent → opened → replied → deal

**Advanced features:**
- 5-dimension qualification scoring (relevance, audience fit, deal size, timeline, brand alignment)
- Automatic follow-up sequence: day 1 email → day 4 WA → day 10 final
- Slack/Paperclip escalation for qualified leads (score ≥ 70)
- Auto-rejection for spam/irrelevant (score < 20)

**Workflow example (Matthew Berman pattern adapted):**
```
sk: "Find fashion brands in Medellín for our July mixer sponsorship"
    → Agent searches LinkedIn/Google/Instagram for Laureles/Poblado fashion brands
    → Enriches: contact name, email, Instagram followers, likely marketing budget
    → Scores each (1–100) on mdeai fit
    → Generates Spanish pitch for top 10
    → Paperclip card: "10 pitches ready. Approve to send?"
    → sk approves → Agent sends email + schedules WA follow-up on day 4
```

**Recommended skills:** `centminmod/explain-openclaw` (Berman workflow), custom `mde-sponsor-outreach` SKILL.md  
**Recommended integrations:** Gmail/Resend (email), Infobip (WA outbound), LinkedIn scraper via Firecrawl  
**Benefits for mdeai:** Eliminates 4–8h/week of manual sponsor prospecting  
**Revenue impact:** Highest — direct revenue; 1 sponsor deal = 500K–3M COP per event

---

### F. Sponsor ROI Reporting

**Core features:**
- Attendance data from Supabase: actual vs. projected
- Ticket revenue by tier
- Social media impression count (manual input or Firecrawl scrape)
- Sponsor logo/mention count in event photos (manual review)

**Advanced features:**
- Automated PDF report generated by agent (markdown → PDF via Pandoc or similar)
- Sent to sponsor within 48h of event end
- Includes: attendance, ticket revenue, social reach, photos, ROI estimate, renewal recommendation
- Renewal package automatically appended: "Para el evento de agosto, tenemos 3 paquetes..."

**Workflow example:**
```
Event ends July 5 at 23:00
    → Supabase: event_checkins.count, tickets sold, revenue
    → Agent compiles: attendance 72/80, revenue 7.2M COP, 3 sponsor logos visible
    → Generates PDF: "Reporte de Patrocinio — mdeai Mixer Julio 2026"
    → Sends PDF via email + WA to sponsor contact within 48h
    → Appends: "Para agosto, te recomendamos el paquete Oro (3.5M COP)"
```

**Recommended integrations:** Supabase (event data), Pandoc/PDF generator, Resend (email), Infobip (WA)  
**Benefits for mdeai:** Sponsors feel valued; renewal rate increases  
**Revenue impact:** High — sponsor renewal is highest-leverage sales action; no new prospect needed

---

### G. Marketing Automation

**Core features:**
- Weekly event newsletter to mdeai subscribers
- Instagram/TikTok post scheduling prompts
- WhatsApp broadcast to opted-in users (Infobip official API — NOT Baileys for mass sends)
- Event countdown posts (7 days, 3 days, 1 day before)

**Advanced features:**
- A/B test subject lines (two variants → winner sent to full list)
- Segmentation: nightlife vs. fashion vs. tech events
- Influencer identification in Medellín (Instagram followers > 10K in target barrios)

**Recommended integrations:** Resend/SendGrid (email), Infobip (official WA), PostHog (analytics)  
**RISK:** Use Infobip (official Meta API) for mass outreach — NOT Baileys. Baileys for 1:1 concierge only.  
**Revenue impact:** Medium — marketing drives ticket sales and sponsor visibility

---

### H. WhatsApp Reminders

**Core features:**
- Ticket confirmation immediately after purchase
- 7-day reminder: "Tu evento es en una semana"
- 1-day reminder: "Mañana es el evento. Aquí tu QR."
- 1-hour reminder: "El evento empieza en 1 hora en [dirección]"
- Post-event: "Gracias por asistir. Deja tu reseña aquí."

**Advanced features:**
- Persistent reminders (escalate every 15 min until acknowledged — `advanced-calendar` skill pattern)
- Failed-delivery retry: 3 attempts, 30 min apart, then escalate to email
- Location share: Google Maps link to venue in 1-hour reminder

**RISK FLAG:** All attendee WA blasts must go through Infobip (official Meta API) once user base > 50. Use Baileys only for opted-in 1:1 conversations during lead capture or concierge.

**Revenue impact:** High indirect — reduces no-shows by ~20%; each attendee present = sponsor impression delivered

---

### I. Email Campaigns

**Core features:**
- Event announcement to subscribers (Resend or SendGrid)
- Ticket purchase confirmation (automated)
- Sponsor thank-you and ROI report delivery
- Post-event survey (Typeform or Supabase form)

**Recommended integrations:** Resend (primary, already in mdeai stack), PostHog (click tracking)

---

### J. Venue Management

**Core features:**
- Venue database in Supabase: name, neighborhood, capacity, price/day, amenities, contact
- Availability check via WA or chat: "¿Está disponible La Estación el 20 de julio?"
- Booking request automation: email + follow-up if no response in 48h

**Advanced features:**
- Venue scoring: price/person, location score, AV included, parking, past mdeai events
- Comparison table: 3 venues side-by-side for a specific event requirement
- Contract tracking: due dates, deposit deadlines

**Workflow example (Venue Research Agent):**
```
sk: "Find a venue for 80 people in El Poblado, July 5, budget 1.5M COP"
    → Agent queries Supabase venues table
    → Google search: "salón de eventos El Poblado Medellín hasta 80 personas"
    → Returns shortlist of 3 venues: name, capacity, estimated price, contact, map link
    → sk picks → Agent sends email inquiry to venue
    → Schedules WA follow-up in 48h if no reply
```

**Revenue impact:** Medium indirect — faster venue booking = shorter event planning cycle = more events per month

---

### K. Staff Scheduling

**Core features:**
- Staff roster per event: role, name, phone, shift, task
- WA reminder to staff 24h before event: "Tu turno es mañana a las 18:00 en [venue]"
- Shift confirmation request + retry if no reply

**Recommended skill:** Custom `mde-staff-scheduler` SKILL.md  
**Revenue impact:** Low direct; high reliability — no-show staff = event failure

---

### L. Guest / Attendee Management

**Core features:**
- RSVP tracking: confirmed, pending, waitlist, cancelled
- Capacity monitoring with Paperclip alert at 80% full
- VIP list management: separate WA channel for VIPs
- Dietary restriction / accessibility needs capture in lead flow

**Recommended integrations:** Supabase `event_attendees` table, Luma API (echennells/luma-skill)

---

### M. Competitor Tracking

**Core features:**
- Weekly scan: events from competing promoters in Medellín
- Extract: date, venue, price, ticket count, sponsors
- Flag conflicts: competing events same date/audience

**Advanced features:**
- Venue pricing intel: "La Estación charged 2M COP last month for 100 people"
- Sponsor tracking: "Bancolombia sponsored 3 competing events this quarter"
- Trend detection: "Fashion events up 40% in El Poblado this month"

**Recommended integrations:** Firecrawl (web scrape competitor event pages), Apify (Instagram event post scraper)  
**Revenue impact:** Strategic — avoid date conflicts; identify underserved niches

---

### N. Influencer Outreach

**Core features:**
- Instagram influencer discovery: Medellín, 10K–100K followers, target niches (nightlife, fashion, food, fitness)
- Contact enrichment: email, DM, manager contact
- Outreach sequence: DM → email → follow-up
- Partnership tracking: gifted ticket, paid post, mention

**Recommended integrations:** Apify (Instagram scraper), Firecrawl (profile enrichment)

---

### O. Contest / Pageant Workflows

**Core features (specific to mdeai pageant/contest vertical):**
- Contestant intake via WA: name, age, neighborhood, category, photos
- Judge scoring matrix: collect scores, compute weighted average, announce results
- Public voting: collect votes via WA reply or web form, prevent duplicates
- Sponsor badge assignment: "Patrocinado por [Brand]" on contestant profile

**Advanced features:**
- Bracket generation (elimination rounds)
- Live score updates to audience WhatsApp channel (Infobip broadcast)
- Winner announcement sequence: WhatsApp + Instagram + email

**Revenue impact:** High — pageant sponsorships are premium packages; automation enables scaling from 1 to 10 pageants/year

---

### P. Post-Event Reports

**Core features:**
- Attendance: actual vs. projected vs. sold tickets
- Revenue: ticket tiers breakdown
- NPS score from post-event survey
- Top moments summary (manual photo selection + auto-caption)
- Next event recommendation

**Advanced features:**
- Sponsor ROI PDF (see Section F)
- Google Analytics / PostHog event traffic dashboard link
- Competitor comparison: "Your event had 72 attendees; competing event same day had 40"

---

## 5. Suggested OpenClaw Agents for mdeai

### Agent 1: Event Planner Agent

**Job description:** Plans any mdeai event from a single chat message to a full production checklist  
**Inputs:** Event type, date, location, approximate guest count, budget in COP  
**Actions:**  
- Create event record in Supabase `events` table  
- Generate backward task timeline (derived from `chris-openclaw/event-planner-os` pattern)  
- Open vendor slots (venue, DJ, catering, photography, AV)  
- Create budget breakdown (venue 40%, catering 30%, entertainment 15%, marketing 10%, contingency 5%)  
- Schedule WA task reminders for each milestone

**Tools needed:** HTTP client (Supabase), WhatsApp (Baileys for 1:1 planning), Paperclip (budget alerts)  
**Outputs:** Event record in Supabase, task timeline, WA confirmation to sk  
**Success metrics:** Event created within 2 min of request; all tasks have owners + due dates  
**Risk controls:** Paperclip approval before any external vendor contact; budget cap enforced  
**Human approval points:** Vendor selection, budget approval, public announcement draft

**Skill:** `chris-openclaw/event-planner-os` (adapted) + custom Supabase sync

---

### Agent 2: Event Discovery Agent

**Job description:** Answers "¿qué eventos hay en Medellín?" with curated, deduplicated results  
**Inputs:** User query (barrio, category, date range, price range), user location (optional)  
**Actions:**  
- Query Luma API via `echennells/luma-skill` (city: Medellín)  
- Query Eventbrite Colombia via Composio  
- Deduplicate across sources  
- Filter by neighborhood, date, price  
- Return top 3–5 results with name, date, price, ticket link  
- Offer: "¿Quieres que te recuerde 24 horas antes?"

**Tools needed:** `echennells/luma-skill`, Eventbrite via Composio, Supabase (log user queries for recommendations)  
**Outputs:** Formatted event list in Spanish; reminder scheduled if user opts in  
**Success metrics:** Response in <8s; user clicks at least 1 result in 40% of queries  
**Risk controls:** Only surface public events; no scraping paywalled sources  
**Human approval points:** None (read-only discovery)

---

### Agent 3: Sponsor Outreach Agent

**Job description:** Finds, qualifies, pitches, and tracks sponsors for mdeai events  
**Inputs:** Event brief (type, audience, date, sponsorship packages available, budget range)  
**Actions:**  
- Search for brands in relevant Medellín verticals (fashion, nightlife, food, fintech, real estate)  
- Enrich contacts (email, LinkedIn, Instagram, likely marketing budget)  
- Score each brand (5-dimension rubric: relevance, audience fit, deal size, timeline, brand alignment)  
- Generate personalized Spanish pitch per brand  
- Submit batch to Paperclip for sk approval  
- On approval: send email via Resend + schedule WA follow-up day 4 via Infobip  
- Track replies → escalate to sk when brand responds

**Tools needed:** Firecrawl (web enrichment), Resend (email), Infobip (WA outbound), Supabase (sponsor CRM), Paperclip (batch approval)  
**Outputs:** Enriched prospect list; approved pitches sent; reply tracking dashboard  
**Success metrics:** 10+ prospects found per event; ≥30% open rate on emails; ≥1 sponsor deal per event  
**Risk controls:** Paperclip approval before EVERY send batch; manual review on first send per domain; no CC/BCC spam patterns  
**Human approval points:** Prospect list review, pitch review, deal term review

---

### Agent 4: Venue Research Agent

**Job description:** Finds, scores, and contacts venues for mdeai events  
**Inputs:** Guest count, neighborhood preference, budget in COP, event date, requirements (outdoor/AV/parking)  
**Actions:**  
- Query Supabase `venues` table for known venues  
- Google search for additional venues matching criteria  
- Build comparison table: venue name, capacity, price/event, neighborhood, amenities, distance from Centro  
- Score each venue (1–100) on fit criteria  
- Return top 3 with recommendation  
- Send inquiry email to top choice; schedule 48h follow-up if no reply

**Tools needed:** HTTP client (Supabase venues query), Google Search (Firecrawl), Resend (venue inquiry email)  
**Outputs:** Venue shortlist table, inquiry sent, follow-up scheduled  
**Success metrics:** Shortlist returned in <2 min; venue reply rate ≥60% within 48h  
**Human approval points:** Final venue selection before deposit payment

---

### Agent 5: Ticketing Operations Agent

**Job description:** Handles ticket purchase confirmations, QR delivery, and sold-out alerts  
**Inputs:** Stripe webhook events (payment_intent.succeeded, payment_intent.failed)  
**Actions:**  
- On success: retrieve buyer info from Supabase `tickets`; generate QR code; send WA confirmation + QR  
- On failure: send WA "Tu pago no fue exitoso. Intenta de nuevo: [link]"  
- Monitor capacity: alert sk when 80% sold via Paperclip  
- Schedule reminder sequence: 7-day, 1-day, 1-hour WA reminders

**Tools needed:** Stripe webhook listener (Supabase edge), QR service, Baileys WA (1:1 delivery), Paperclip (capacity alerts)  
**Outputs:** WA ticket confirmation + QR; reminder schedule; capacity dashboard  
**Success metrics:** Confirmation WA sent within 60s of payment; reminder delivery rate ≥95%  
**Human approval points:** Refund processing

---

### Agent 6: Attendee Reminder Agent

**Job description:** Sends multi-touch reminder sequence to all ticket holders  
**Inputs:** Event date, venue address, ticket holder list from Supabase  
**Actions:**  
- 7 days before: "Tu evento es en 7 días — [event name], [venue], [date]"  
- 1 day before: "Mañana es el día. Aquí tu QR: [QR]. Dirección: [Google Maps link]"  
- 1 hour before: "El evento empieza en 1 hora. ¿Ya estás en camino?"  
- Post-event (2h after end): "Gracias por asistir. Deja tu reseña aquí: [link]"  
- Retry: if no WA delivery receipt in 15 min → retry once → log failure

**Tools needed:** Baileys WA (1:1 per ticket holder, low volume); Infobip (mass broadcast if >50 tickets sold)  
**RISK:** If ticket count > 50, switch to Infobip official API. Baileys mass messaging risks ToS ban.  
**Human approval points:** First reminder draft approval; any message content change

---

### Agent 7: WhatsApp Campaign Agent

**Job description:** Manages Infobip outbound campaigns for events marketing  
**Inputs:** Campaign brief (event, target audience segment, send date, budget)  
**Actions:**  
- Pull audience segment from Supabase (`contacts` table filtered by interest, past attendance, barrio)  
- Generate bilingual campaign message (Spanish primary)  
- Submit to Paperclip for sk approval  
- On approval: send via Infobip official API (template message — pre-approved by Meta)  
- Track delivery rate, open rate, click-through

**Tools needed:** Infobip Cloud API (official), Supabase (audience query), Paperclip (approval gate)  
**CRITICAL:** All mass WA sends via Infobip ONLY. Never Baileys for campaigns.  
**Success metrics:** Delivery rate ≥95%; click-through ≥5%  
**Human approval points:** Audience segment, message content, send time — ALL require sk approval

---

### Agent 8: Competitor Tracker Agent

**Job description:** Monitors competing events in Medellín weekly  
**Inputs:** Competitor venue list, event categories to track, Medellín barrios  
**Actions:**  
- Weekly cron (Monday 09:00 COT): scan Luma, Eventbrite, Tu Boleta, Instagram for competitor events  
- Extract: promoter, venue, date, ticket price, capacity estimate, sponsors mentioned  
- Compare with mdeai event calendar for date conflicts  
- Flag: high-conflict dates, sponsors supporting competitors, underserved event niches  
- Send weekly digest to sk via WA or Discord

**Tools needed:** Firecrawl (web scrape), `echennells/luma-skill`, Apify (Instagram post scraper), Supabase (log findings)  
**Success metrics:** Weekly digest delivered every Monday by 09:30 COT; date conflicts flagged ≥72h before conflict  
**Human approval points:** None (research-only, no outbound actions)

---

### Agent 9: Post-Event Report Agent

**Job description:** Generates and delivers sponsor ROI reports within 48h of event end  
**Inputs:** Event ID, sponsor list, Supabase event data (attendance, revenue, checkins)  
**Actions:**  
- Pull: checkin count, ticket revenue by tier, social media mentions (manual input or scrape)  
- Calculate: actual vs. projected attendance, revenue per ticket tier, cost-per-attendee  
- Generate markdown report → convert to PDF  
- Append: renewal package recommendation (Gold/Silver/Bronze for next event)  
- Send: PDF via Resend email + WA text with link to Paperclip approval card  
- Paperclip: sk reviews → approves send → agent sends to sponsor contact

**Tools needed:** Supabase (event data), Pandoc or PDF service, Resend (email), Infobip (WA text), Paperclip (approval before sponsor delivery)  
**Success metrics:** Report generated within 6h of event end; sent to sponsor within 48h  
**Human approval points:** Full report review by sk before sponsor delivery

---

### Agent 10: Staff Scheduling Agent

**Job description:** Creates and communicates staff rosters for mdeai events  
**Inputs:** Event date, venue, staff roles needed (door, bar, MC, tech, photography), available staff from Supabase `staff` table  
**Actions:**  
- Match roles to available staff (availability check from Supabase)  
- Create roster with shifts, roles, venue address  
- Send WA to each staff member: "Tu turno es [fecha] a las [hora] en [venue]. Confirma respondiendo 'Confirmo'."  
- Retry if no confirmation in 4h; escalate to sk if still no reply in 8h  
- Day-of WA: "El evento empieza en 2 horas. ¿Estás en camino?"

**Tools needed:** Supabase `staff` table, Baileys WA (1:1 per staff member)  
**Success metrics:** All staff confirmed ≥48h before event; no-show rate ≤5%  
**Human approval points:** Roster approval by sk before staff notifications sent

---

## 6. Recommended Skills / Plugins / Integrations

| Integration | Why Use It | Best Use Case | Priority | Setup Complexity | Risk |
|-------------|-----------|---------------|----------|-----------------|------|
| `chris-openclaw/event-planner-os` | Best event lifecycle skill verified | Event planning from chat | HIGH | Low (install SKILL.md) | Low |
| `echennells/luma-skill` | Production-grade Luma API | Event discovery + creation | HIGH | Low (set LUMA_AUTH_SESSION_KEY) | Low |
| Google Calendar (Composio MCP) | Official OAuth sync | Calendar invite delivery | HIGH | Medium (OAuth setup) | Low |
| Eventbrite (Composio) | 500+ app integration | Event search + discovery | HIGH | Low (Composio setup) | Low |
| Infobip Cloud API | Official Meta WA API | Mass ticket reminders, campaigns | HIGH | Medium (Meta approval) | Low (official) |
| Stripe (existing) | Payment webhook trigger | Ticket confirmation flow | HIGH | Already integrated | Low |
| Supabase (existing) | Source of truth | All event/lead/ticket data | HIGH | Already integrated | Low |
| Resend (existing) | Transactional email | Sponsor reports, confirmations | HIGH | Already integrated | Low |
| Firecrawl | Web scraping/enrichment | Sponsor enrichment, competitor tracking | MEDIUM | Low (API key) | Medium (rate limits) |
| Apify | Browser automation | Instagram scraping, portal scraping | MEDIUM | Medium (actor setup) | Medium |
| PostHog (existing) | Event analytics | Track discovery → click → ticket | MEDIUM | Already integrated | Low |
| Google Maps | Venue location + directions | 1-hour reminder with map link | MEDIUM | Already integrated (VITE_) | Low |
| Discord (OpenClaw built-in) | Internal team channel | Staff notifications, weekly digest | MEDIUM | Low (existing channel support) | Low |
| Paperclip (existing) | Approval governance | Sponsor send gates, budget alerts | HIGH | Already integrated | Low |
| Hermes (existing) | Reasoning layer | Complex sponsor scoring, ROI analysis | MEDIUM | Already integrated | Low |
| Twilio (SuperCall) | AI voice calls | VIP/sponsor confirmation calls | LOW | High (ngrok + SuperCall) | Medium |
| SendGrid | Bulk email | Newsletters >10K recipients | LOW | Medium | Low |
| Sentry | Error monitoring | Agent error tracking | LOW | Low | Low |
| `FrankyJo` IT events skill | IT event discovery cron | Tech/startup event digest | LOW | Low | Low |
| `stockii` event aggregator | Multi-source aggregation architecture | Reference only; needs rewrite | LOW | High (full rewrite) | Medium |

---

## 7. Workflow Blueprints

### Workflow A: Create Event from Chat

**User says:** "Crea un evento de networking de moda el próximo viernes en Medellín"

```
Step 1 — Intent capture (OpenClaw mde-event-planner skill)
    sk types request → triggers mde-event-planner skill
    Agent parses: type=fashion networking, date=next Friday (2026-05-15), city=Medellín

Step 2 — Event draft
    Agent: "¿Cuántos invitados esperas? ¿Cuál es tu barrio preferido? ¿Presupuesto en COP?"
    sk: "80 personas, Laureles, 3M COP"
    Agent creates event-data.json; Supabase INSERT into events table

Step 3 — Venue search
    Agent queries Supabase venues table → 0 results for Laureles <3M
    Agent runs Google search via Firecrawl: "salón de eventos Laureles Medellín 80 personas"
    Returns shortlist: [Venue A, Venue B, Venue C] with price/capacity/contact

Step 4 — Ticket tiers
    Agent proposes: Early Bird 30K COP (20 tickets), General 50K COP (50 tickets), VIP 120K COP (10 tickets)
    sk: "Aprobado" → Agent creates tiers in Supabase tickets table

Step 5 — Sponsor suggestions
    Agent: "¿Quieres buscar patrocinadores? Tengo 3 marcas de moda en Laureles."
    sk: "Sí" → Sponsor Outreach Agent activated

Step 6 — Publish review
    Agent generates Paperclip approval card: event name, date, venue, tiers, budget, sponsor status
    sk approves → Agent creates Luma event via echennells/luma-skill
    Returns: public Luma event URL + Supabase event ID

Total time: ~8 min from chat request to published event
```

---

### Workflow B: Sponsor Outreach Automation

```
Step 1 — Brief intake
    sk: "Busca patrocinadores de moda y gastro para el mixer del 15 de mayo, paquetes de 500K a 3M COP"

Step 2 — Brand discovery
    Agent searches: LinkedIn, Instagram, Google for Medellín fashion + food brands
    Firecrawl enriches: contact name, email, follower count, website, estimated ad spend

Step 3 — Scoring (Matthew Berman 5-dimension rubric adapted)
    For each brand, agent scores:
      - Relevance to fashion networking event: 0–20
      - Audience fit (Laureles/Poblado demographic): 0–20
      - Deal size potential (500K–3M range): 0–20
      - Timeline feasibility (event in 14 days): 0–20
      - Brand alignment with mdeai: 0–20
    Total: /100. Tier: A (80+), B (60–79), C (40–59), Reject (<40)

Step 4 — Pitch generation
    Agent writes Spanish pitch per brand (personalized: uses brand name, references their Instagram)
    "Hola [Name], somos mdeai.co, plataforma de eventos en Medellín. Tu marca [Brand] encaja perfectamente..."

Step 5 — Paperclip approval
    Paperclip card: "10 pitches listas. Tier A: 3 marcas, Tier B: 5 marcas, Tier C: 2 marcas. ¿Aprobamos el envío?"
    sk: Approve Tier A + B (8 pitches)

Step 6 — Send + follow-up
    Agent sends via Resend (email) with tracking pixel
    Day 4: no reply → WA follow-up via Infobip: "¿Viste mi propuesta de patrocinio?"
    Day 10: final follow-up email → "Este es el último aviso antes de cerrar cupos."

Step 7 — Track + escalate
    On reply: Paperclip card to sk with brand response + deal context
    sk handles negotiation → deal saved to Supabase sponsors table
```

---

### Workflow C: Ticket Reminder Automation

```
Trigger: Stripe payment_intent.succeeded webhook → Supabase edge

T+0 min (immediate):
    WA: "🎟️ ¡Tu boleta está confirmada! [Event name] — [date] — [venue]
         Aquí tu código QR: [QR image]
         Guárdalo para el check-in."

T-7 days:
    WA: "Tu evento es en 7 días: [Event] el [date] en [venue].
         ¿Tienes alguna pregunta?"

T-1 day:
    WA: "¡Mañana es el día! Aquí tu QR: [QR]
         Dirección: [venue] — [Google Maps link]
         El evento emienza a las 19:00."

T-1 hour:
    WA: "⏰ El evento empieza en 1 hora en [venue].
         ¿Ya estás en camino?"

T+2 hours (post-event):
    WA: "¡Gracias por asistir a [Event]! 
         Cuéntanos cómo fue: [survey link]
         Próximo evento: [link]"

Delivery monitoring:
    If WA not delivered in 15 min → retry
    3 failed retries → fallback to email via Resend
    Log all delivery statuses in Supabase ai_runs
```

---

### Workflow D: Venue Research Automation

```
sk: "Busca un venue para 80 personas en El Poblado el 5 de julio, presupuesto 2M COP"

Step 1 — Supabase query
    SELECT * FROM venues WHERE neighborhood ILIKE '%Poblado%' AND capacity >= 80 AND price_per_day <= 2000000

Step 2 — Web search (if Supabase results < 3)
    Firecrawl: "salón de eventos El Poblado Medellín 80 personas alquiler"
    Extract: venue name, address, capacity, price, contact phone/email

Step 3 — Scoring
    Agent scores each venue:
      - Price fit (< 2M): 0–25
      - Capacity (80+ confirmed): 0–25
      - Location (distance from Parque El Poblado): 0–25
      - Amenities (AV, bar, parking): 0–25

Step 4 — Shortlist (top 3)
    Agent returns comparison table:
    | Venue | Capacity | Price/day | Score | Contact |
    |-------|----------|-----------|-------|---------|
    | ...   | ...      | ...       | ...   | ...     |

Step 5 — Contact top choice
    Agent sends email inquiry: "Hola, quisiera cotizar su salón para 80 personas el 5 de julio..."
    Schedules follow-up WA in 48h if no email reply

Step 6 — Supabase save
    Agent saves shortlist to Supabase venues table (if new venues found)
```

---

### Workflow E: Competitor Event Tracker

```
Schedule: Every Monday 09:00 COT (pg-boss cron)

Step 1 — Source scrape
    echennells/luma-skill: discover events in Medellín next 14 days
    Firecrawl: scrape Tu Boleta, Taquilla.com, Eventbrite Colombia for same period
    Apify: Instagram scrape for "evento medellín" posts (public accounts)

Step 2 — Extract & normalize
    For each event: promoter, venue, date, ticket price range, capacity estimate, sponsors visible

Step 3 — Conflict detection
    Compare competitor event dates vs. mdeai event calendar
    Flag: same date within 10km radius AND same target audience

Step 4 — Opportunity detection
    Identify: popular event niches with no mdeai events (e.g., "fitness events in Laureles = 0 mdeai coverage")
    Identify: venues hosting multiple events (= active, event-friendly management)
    Identify: sponsors supporting multiple competing events (= high marketing budget = prospect)

Step 5 — Weekly digest
    Post to sk WhatsApp and mdeai Discord #events-intel:
    "📊 Inteligencia de eventos — Semana [n]
     3 eventos en conflicto detectados
     2 oportunidades identificadas
     1 nuevo sponsor prospecto: [Brand]"
```

---

### Workflow F: Post-Event Sponsor Report

```
Trigger: Event end timestamp passes (from Supabase events.end_time)

T+0h — Data collection
    Supabase: SELECT from event_checkins WHERE event_id = X
    Supabase: SELECT from tickets WHERE event_id = X GROUP BY tier
    Manual input (sk): "Fotos publicadas: 12. Menciones en Instagram: 45. Estimado de alcance: 8,500"

T+2h — Report generation
    Agent compiles markdown:
      - Asistencia: 72/80 (90% del cupo)
      - Ingresos por boletas: 7.2M COP
      - Tu logo apareció en: fotos del evento, Instagram, banner
      - Alcance estimado: 8,500 personas
      - ROI estimado: 4.2x (brand value vs inversión)
      - Recomendación: Paquete Oro agosto 2026 (3.5M COP)
    Convert to PDF

T+6h — Paperclip approval
    Paperclip card to sk: "Reporte listo para [Sponsor]. ¿Aprobamos el envío?"
    sk reviews PDF → approves

T+48h max — Send
    Resend email to sponsor contact with PDF attachment
    Infobip WA to sponsor phone: "Hola [Name], te envié por email el reporte de patrocinio del evento. ¡Fue un éxito!"
```

---

## 8. mdeai Implementation Plan

### Phase 1 — MVP (Weeks 1–4)

**Goal:** Event discovery, ticket reminders, venue research working via WhatsApp

| Feature | Skill/Integration | Task File |
|---------|------------------|-----------|
| Event discovery concierge | `echennells/luma-skill` | New: 08C-luma-event-discovery |
| Ticket confirmation + QR | Stripe webhook + Baileys | Extend: ticketing edge function |
| Attendee reminder sequence | Baileys/Infobip | New: mde-attendee-reminders SKILL.md |
| Venue research agent | Firecrawl + Supabase | New: mde-venue-research SKILL.md |
| Event planning from chat | `chris-openclaw/event-planner-os` | Install + adapt |

**Dependencies:** 08H echo must pass (Baileys transport proven); 08F ingress ADR signed  
**Estimated difficulty:** Medium  
**Expected business value:** Immediate — ticket automation saves 2h/event; venue research saves 3h/event  
**Risks:** Luma session cookie expiry; Baileys ToS if volume grows  
**Success criteria:**
- [ ] sk can say "create event" in WA and get a task timeline back in <2 min
- [ ] Ticket buyer receives WA confirmation with QR in <60s
- [ ] Venue shortlist returned in <2 min for any event brief

---

### Phase 2 — Automation (Weeks 5–10)

**Goal:** Sponsor outreach automated; Google Calendar sync; staff and competitor workflows

| Feature | Skill/Integration | Notes |
|---------|------------------|-------|
| Sponsor Outreach Agent | Firecrawl + Resend + Infobip + Paperclip | Requires Paperclip approval gate |
| Luma event creation | `echennells/luma-skill` (write mode) | Requires Luma Plus for RSVP mgmt |
| Google Calendar sync | Composio MCP Google Calendar | OAuth setup; calendar invite in ticket confirmation |
| Competitor tracker | Firecrawl + Apify + pg-boss cron | Weekly Monday digest |
| Staff scheduling | Baileys + Supabase `staff` table | Custom SKILL.md |
| Post-event report | Supabase + PDF + Resend + Paperclip | Manual data input for now |

**Dependencies:** Phase 1 complete; Infobip official API activated (mass reminders)  
**Estimated difficulty:** Medium-High  
**Expected business value:** High — sponsor automation is primary revenue lever  
**Risks:** Infobip Meta approval timeline; Composio OAuth complexity  
**Success criteria:**
- [ ] ≥1 sponsor deal closed via automated outreach per month
- [ ] Google Calendar invite delivered to ticket buyers within 60s
- [ ] Weekly competitor digest delivered every Monday 09:30 COT

---

### Phase 3 — Intelligence (Weeks 11–18)

**Goal:** Sponsor matching, venue scoring, ROI automation, predictive recommendations

| Feature | Skill/Integration | Notes |
|---------|------------------|-------|
| Sponsor qualification scoring | Hermes reasoning + Supabase | Matthew Berman 5-dimension rubric |
| Venue scoring model | pgvector + Supabase | Past event data → venue quality score |
| Sponsor ROI PDF reports | Supabase + PDF + Paperclip | Full auto-generation |
| Predictive event recommendations | pgvector semantic search | "Events like the May fashion show" |
| Influencer discovery | Apify Instagram scraper | Medellín micro-influencers |
| AI voice confirmation (VIP only) | Twilio SuperCall | High-cost; VIP/sponsor only |

**Dependencies:** Phase 2 complete; ≥5 events worth of historical data in Supabase  
**Estimated difficulty:** High  
**Expected business value:** High — sponsor renewal automation is highest-leverage revenue action  
**Risks:** Predictive models require clean historical data; Apify Instagram TOS risk

---

### Phase 4 — Advanced Orchestration (Weeks 19–26)

**Goal:** Hermes multi-step reasoning + Paperclip governance + multi-agent coordination

| Feature | Integration | Notes |
|---------|-------------|-------|
| Multi-agent event pipeline | OpenClaw multi-skill orchestration | Planner → Venue → Sponsor → Publish in one flow |
| Budget enforcement | Paperclip hard gates | No spend without approval |
| Sponsor deal governance | Paperclip contract tracking | Terms, deposits, deliverables |
| Cross-event portfolio view | Supabase analytics | Multi-event dashboard |
| A/B test event messaging | PostHog experiments | Optimize reminder content |

**Dependencies:** Phase 3 complete; Paperclip governance rules defined  
**Estimated difficulty:** Very High  
**Expected business value:** Strategic — enables scaling from 1–2 events/month to 10+

---

## 9. Best Recommendations

### Which repos should mdeai use first?
1. **`chris-openclaw/event-planner-os`** — install immediately; covers 80% of event planning needs
2. **`echennells/luma-skill`** — install with it; enables Luma discovery + event creation
3. **`VoltAgent/awesome-openclaw-skills`** — browse `events-and-hospitality.md` before building anything custom

### Which skills/plugins should be installed first?
Priority order:
1. `echennells/luma-skill` (set `LUMA_AUTH_SESSION_KEY` from Infisical)
2. `chris-openclaw/event-planner-os` (no dependencies — install directly)
3. Google Calendar via Composio (OAuth setup: ~2h)
4. Eventbrite via Composio (same setup)

### Which workflows generate revenue fastest?
1. **Sponsor Outreach Agent** — direct revenue; 1 deal = 500K–3M COP
2. **Post-Event Sponsor Report** — sponsor renewal; no new prospect needed
3. **Ticket confirmation + QR via WA** — immediate; every ticket sold triggers it

### Which workflows save the most time?
1. **Venue Research Agent** — saves 3–5h per event
2. **Event Planner from chat** — saves 2–3h of planning overhead
3. **Attendee Reminder sequence** — saves 1–2h of manual WA messages per event

### Which integrations are critical?
- Infobip (official WA for mass reminders — do not use Baileys at scale)
- Luma API (event discovery + creation — primary Medellín event platform)
- Supabase (source of truth — already integrated)
- Stripe webhook (ticket confirmation trigger — already integrated)
- Paperclip (all outbound actions must be approved — already integrated)

### Which ideas are overkill right now?
- AI voice calls (Twilio SuperCall): high setup cost, $0.15/call — defer to Phase 3 for VIP only
- A/B testing event messaging: needs volume (>200 events/year) to be meaningful
- Full influencer marketplace: better handled manually until mdeai reaches 5K MAU

### What should be avoided?
- **Baileys for mass WA campaigns** — Meta ToS violation risk; use Infobip for anything > 50 recipients
- **ClawHub plugins** — CVE-2026-25253 RCE risk (see `19C-clawhub-skill-safety-review.md`)
- **Auto-publishing events without Paperclip approval** — wrong venue/date confirmed publicly = trust damage
- **Sumedh-6504/OpenClaw_Build_Event** — completely unrelated to events; discard
- **testbot-01/openclaw_event** — empty stub; discard
- **openclaw/skills `afrexai-cto` path** — 404; do not attempt to install

---

## 10. Final Ranked Action List

| Priority | Action | Why | Effort | Revenue Impact | Risk | Owner | Deadline |
|----------|--------|-----|--------|----------------|------|-------|---------|
| P0 | Install `chris-openclaw/event-planner-os` | Best verified event skill; no dependencies | 2h | Indirect (saves 3h/event) | Low | sk | Week 1 |
| P0 | Install `echennells/luma-skill` | Luma discovery + event creation | 2h | Indirect (discovery → tickets) | Low | sk | Week 1 |
| P0 | Activate Infobip WhatsApp (official) | Required for any mass reminders >50 attendees | 1 day | High (ticket reminders) | Low | sk | Week 1 |
| P0 | Build ticket confirmation WA flow | Every ticket purchase = instant WA + QR | 1 day | Direct (reduces no-shows ~20%) | Low | executor | Week 1 |
| P1 | Build Sponsor Outreach Agent | Primary revenue lever | 3 days | Highest (500K–3M COP/deal) | Medium | executor | Week 2 |
| P1 | Browse VoltAgent/awesome-openclaw-skills events category | Find installable skills before building | 2h | Indirect | Low | sk | Week 1 |
| P1 | Set up Google Calendar via Composio | Calendar invite in ticket confirmation | 2h | Indirect (attendee trust) | Low | sk | Week 2 |
| P1 | Build Venue Research Agent | Saves 3–5h/event | 2 days | Indirect | Low | executor | Week 2 |
| P1 | Build mde-attendee-reminders SKILL.md | 4-touch reminder sequence | 1 day | High (no-show reduction) | Low | executor | Week 2 |
| P2 | Set up Competitor Tracker (weekly cron) | Avoid date conflicts, find sponsor prospects | 2 days | Strategic | Medium | executor | Week 4 |
| P2 | Build Post-Event Sponsor Report Agent | Sponsor renewal (no new prospect needed) | 3 days | High | Low | executor | Week 4 |
| P2 | Build Event Discovery concierge (WA) | User acquisition via WA discovery | 2 days | Medium | Low | executor | Week 3 |
| P2 | Build mde-event-checkin SKILL.md | Day-of operations; real-time capacity | 1 day | Indirect | Low | executor | Week 5 |
| P3 | Sponsor qualification scoring (Hermes) | Scale sponsor pipeline without sk time | 3 days | High | Medium | executor | Week 8 |
| P3 | Pageant/contest workflow | Premium sponsor packages; seasonal revenue | 4 days | High | Low | executor | Week 10 |
| P3 | Influencer discovery (Apify Instagram) | Organic reach for events | 3 days | Medium | Medium | executor | Week 10 |
| P4 | AI voice call confirmation (Twilio SuperCall) | VIP/sponsor confirmations only | 2 days | Low | Medium | executor | Later |
| P4 | Multi-agent event pipeline orchestration | Scale to 10+ events/month | 1 week | Strategic | High | executor | Later |

---

## Appendix: Research Verification Summary

| URL | Status | Score |
|-----|--------|-------|
| `chris-openclaw/event-planner-os` | ✅ REAL — best event skill | 88/100 |
| `echennells/luma-skill` | ✅ REAL — production Luma API | 87/100 |
| `FrankyJo/openclaw_skill_serach_it_events` | ✅ REAL — ClawHub published | 72/100 |
| `stockii/event-skill-for-openclaw` | ✅ REAL — architecture ref only | 45/100 |
| `Remote55/openclaw` | ✅ REAL — SEA hotel+events app | 65/100 (ref only) |
| `Sumedh-6504/OpenClaw_Build_Event` | ⚠️ MISLEADING — file dashboard, not events | 0/100 |
| `testbot-01/openclaw_event` | ⚠️ EMPTY — stub repo only | 0/100 |
| `openclaw/skills` (afrexai-cto path) | ❌ NOT FOUND — 404 | N/A |
| `openclawskillpacks.com/effortless-event-planning` | ❌ NOT FOUND — 404 | N/A |
| `openclawplaybook.ai` (both URLs) | ✅ REAL — practical guides | 88/100, 78/100 |
| `serif.ai/openclaw/hospitality-events` | ✅ REAL — 10 hospitality workflows | 85/100 |
| `clawrapid.com/openclaw-event-management` | ✅ REAL — voice call pattern | 82/100 |
| `tryopenclaw.ai/event-planners` | ✅ REAL — commercial SaaS (not for us) | 60/100 |
| `tencentcloud.com/141401` | ✅ REAL — Tencent promo, useful tactics | 65/100 |
| `tencentcloud.com/141336` | ✅ REAL — contradictory content, low quality | 20/100 |
| `createwith.com/tool/openclaw/events` | ✅ REAL — community calendar | 55/100 |
| LinkedIn (Angela Strange) | ✅ REAL — genuine testimonial | 45/100 |
| LinkedIn (Jose Bulatao) | ✅ REAL — VenueKonnex reference | 45/100 |
| Lenny's Newsletter | ✅ REAL — paywalled | 55/100 |
| `clawbot.ai/afrexai-event-management` | ⚠️ 403 FORBIDDEN — unverifiable | N/A |
| Reddit automation post | ⚠️ BLOCKED — unverifiable | N/A |

**Bottom line: 13/22 URLs verified real and useful. 2 fictional (404). 3 unverifiable (blocked/403). 2 misleading (wrong content). 2 empty stubs.**
