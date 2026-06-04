# OpenClaw for mdeai Events — Plan Report

## Summary

OpenClaw should be used as **mdeai’s execution layer** for events: browser automation, event discovery, WhatsApp reminders, sponsor outreach, venue research, ticketing ops, and post-event reporting.

mdeai already has an events-first roadmap with event creation, ticket checkout, QR validation, staff check-in, buyer ticket pages, and chatbot event creation. OpenClaw fits best as the “hands” that performs actions across external tools, while Supabase remains the source of truth and Hermes/Paperclip handle reasoning and governance.

**Strategy alignment (supersedes section ordering in this file):** Canonical sequencing is [`tasks/events/events-roadmap.md`](../../events/events-roadmap.md) (Now → Core MVP → Post-MVP → Advanced) plus [`tasks/events/events-prd-v2-mastra-maps-automation.md`](../../events/events/events-prd-v2-mastra-maps-automation.md). **§6 below** describes OpenClaw *capabilities* and a historical “execution layer first” sketch — it is **not** the shipping order. **OpenClaw outbound** (WhatsApp blasts, sponsor sends, scrapers) stays in the **Advanced** horizon until deterministic ticketing (Stripe → webhook → QR → `ticket-validate`) is green on staging **and** approvals/audit/quotas are implemented, not policy-only. **Mastra** event runtime (**MASTRA-007**) already encodes the same gate: no Events MVP agents until ticket edge functions are reconciled.

---

# 1. Best OpenClaw Event Use Cases for mdeai

|Area|How OpenClaw helps|Score|
|---|---|--:|
|Event planning|Creates checklists, timelines, run sheets, task plans|95|
|Event management|Sends reminders, coordinates staff, tracks tasks|94|
|Event discovery|Scrapes Luma, Eventbrite, local sites, Google results|92|
|Ticketing|Sends ticket reminders, QR links, calendar invites|90|
|Sponsorship|Finds sponsors, writes outreach, follows up|96|
|Venue ops|Finds venues, compares pricing/capacity/location|91|
|Marketing|WhatsApp, email, Discord, social campaign workflows|95|
|Post-event reports|Builds sponsor ROI recap, attendance report, renewal pitch|93|

OpenClaw is especially strong because it works through chat apps like WhatsApp, Telegram, Discord, Slack, and Teams, and connects those channels to AI agents running on your own infrastructure. ([OpenClaw](https://docs.openclaw.ai/?utm_source=chatgpt.com "OpenClaw - OpenClaw"))

---

# 2. Top Repos / Skills to Research and Use

|Rank|Repo / Source|URL|Score|Use for mdeai|
|--:|---|---|--:|---|
|1|OpenClaw Core|[https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)|97|Main execution runtime|
|2|OpenClaw Skills Registry|[https://github.com/openclaw/skills](https://github.com/openclaw/skills)|96|Skill examples + reusable workflows|
|3|AfrexAI Event Management|[https://github.com/openclaw/skills/blob/main/skills/1kalin/afrexai-event-management/SKILL.md](https://github.com/openclaw/skills/blob/main/skills/1kalin/afrexai-event-management/SKILL.md)|95|Sponsorship, run sheets, no-show reduction, ROI|
|4|AfrexAI Event Planner|[https://github.com/openclaw/skills/blob/main/skills/1kalin/afrexai-event-planner/SKILL.md](https://github.com/openclaw/skills/blob/main/skills/1kalin/afrexai-event-planner/SKILL.md)|94|Full event planning templates|
|5|Luma Event Manager|[https://github.com/openclaw/skills/blob/main/skills/mariovallereyes/luma-event-manager/SKILL.md](https://github.com/openclaw/skills/blob/main/skills/mariovallereyes/luma-event-manager/SKILL.md)|93|Discover events, RSVP, sync to Google Calendar|
|6|Luma Skill|[https://github.com/echennells/luma-skill](https://github.com/echennells/luma-skill)|91|Luma event scraping/sync|
|7|Event Planner OS|[https://github.com/chris-openclaw/event-planner-os](https://github.com/chris-openclaw/event-planner-os)|90|Full event ops system|
|8|Event Skill for OpenClaw|[https://github.com/stockii/event-skill-for-openclaw](https://github.com/stockii/event-skill-for-openclaw)|88|Starter event skill patterns|
|9|OpenClaw Build Event|[https://github.com/Sumedh-6504/OpenClaw_Build_Event](https://github.com/Sumedh-6504/OpenClaw_Build_Event)|86|Event creation assistant|
|10|OpenClaw Event|[https://github.com/testbot-01/openclaw_event](https://github.com/testbot-01/openclaw_event)|82|Basic event workflow reference|
|11|OpenClaw Search IT Events|[https://github.com/FrankyJo/openclaw_skill_serach_it_events](https://github.com/FrankyJo/openclaw_skill_serach_it_events)|81|Event search patterns|
|12|Remote55 OpenClaw|[https://github.com/Remote55/openclaw](https://github.com/Remote55/openclaw)|80|Possible fork/reference|
|13|Awesome OpenClaw Skills|[https://github.com/VoltAgent/awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills)|89|Skill discovery; claims 5,400+ categorized skills ([GitHub](https://github.com/VoltAgent/awesome-openclaw-skills?utm_source=chatgpt.com "VoltAgent/awesome-openclaw-skills"))|
|14|OpenClaw Playbook|[https://github.com/Jbapckfan/openclaw-playbook](https://github.com/Jbapckfan/openclaw-playbook)|84|Sponsor/newsletter automation patterns|
|15|Security Skills Category|[https://github.com/VoltAgent/awesome-openclaw-skills/blob/main/categories/coding-agents-and-ides.md](https://github.com/VoltAgent/awesome-openclaw-skills/blob/main/categories/coding-agents-and-ides.md)|92|Skill scanning/security tools|

Important: third-party OpenClaw skills must be audited before use. Security reporting has found malicious or risky OpenClaw skills, including data-exfiltration and infostealer risks. ([The Verge](https://www.theverge.com/news/874011/openclaw-ai-skill-clawhub-extensions-security-nightmare?utm_source=chatgpt.com "OpenClaw's AI 'skill' extensions are a security nightmare"))

---

# 3. Best mdeai Agent System

|Agent|Job|Tools|
|---|---|---|
|Event Planner Agent|Creates event plan, budget, timeline, run sheet|OpenClaw + Supabase|
|Event Discovery Agent|Finds Medellín events from Luma/Eventbrite/local sites|OpenClaw browser + Firecrawl|
|Sponsor Outreach Agent|Finds brands, writes pitch, follows up|OpenClaw + Gmail/WhatsApp|
|Venue Research Agent|Searches venues, compares capacity/pricing/location|Browser + Google Maps|
|Ticket Ops Agent|Sends confirmations, QR reminders, check-in alerts|Supabase + WhatsApp|
|Attendee Reminder Agent|Reduces no-shows with WhatsApp/email reminders|Infobip/Twilio + SendGrid|
|Competitor Tracker Agent|Tracks competing events, sponsors, pricing|Browser + scraping|
|Post-Event Report Agent|Builds sponsor ROI report + renewal pitch|Supabase + Gemini|
|Staff Scheduling Agent|Sends staff schedule, check-in links, day-of reminders|Calendar + WhatsApp|

---

# 4. Core Workflows

## A. Create Event from Chat

```text
Organizer says:
“Create a fashion networking event next Friday in Medellín.”

Flow:
Chat → ai-chat → OpenClaw Event Planner Agent
→ draft event in Supabase
→ suggest venue options
→ create ticket tiers
→ suggest sponsors
→ generate event copy
→ human review
→ publish
```

Best for: event organizers, fashion events, pageants, networking nights.

---

## B. Sponsor Outreach Automation

```text
Find local brands
→ enrich company/contact info
→ generate sponsor pitch
→ send email/WhatsApp
→ follow up after 2 days
→ track replies
→ create sponsor opportunity
→ send package/payment link
```

Revenue impact: very high. This supports mdeai’s sponsor marketplace and ROI dashboard model.

---

## C. Ticket Reminder Automation

```text
Ticket purchased
→ email confirmation
→ WhatsApp reminder 24h before
→ WhatsApp reminder 3h before
→ QR ticket link
→ staff check-in scan
→ post-event thank you
```

Best for: reducing no-shows, improving event experience, increasing repeat attendance.

---

## D. Venue Research Automation

```text
Search venues in Medellín
→ compare capacity, location, price, amenities
→ estimate fit for event type
→ contact venue
→ collect quote
→ save shortlist
```

Best for: pageants, fashion shows, sponsor activations, nightlife events.

---

## E. Competitor Tracker

```text
Monitor local events weekly
→ extract ticket price, venue, sponsors, attendance signals
→ detect trends
→ recommend better timing/pricing/sponsors
```

Best for: strategic moat.

---

## F. Sponsor ROI Report

```text
Collect ticket sales, attendance, clicks, impressions
→ generate sponsor recap
→ export PDF
→ recommend renewal package
→ send follow-up
```

Best for: sponsor retention.

---

# 5. Recommended Integrations

|Integration|Priority|Why|
|---|---|---|
|Supabase|Critical|Source of truth for events, tickets, sponsors|
|WhatsApp / Infobip / Twilio|Critical|Medellín/LATAM communication channel|
|Stripe|Critical|Tickets + sponsor payments|
|Google Calendar|High|Event reminders and staff schedules|
|Luma|High|Event discovery and social event data|
|Eventbrite|High|Ticket/event aggregation|
|Google Maps|High|Venue search and location scoring|
|Firecrawl|High|Scrape venue/event pages|
|Apify|Medium|Harder scraping jobs|
|SendGrid / Resend|Medium|Email confirmations and sponsor outreach|
|PostHog|Medium|Funnel and sponsor analytics|
|Sentry|Medium|Error monitoring|
|Paperclip|High later|Governance, approvals, budgets|
|Hermes|High later|Ranking, reasoning, sponsor matching|

---

# 6. Phased mdeai Implementation Plan

## Phase 1 — MVP Execution Layer

Build first:

- WhatsApp ticket reminders
    
- sponsor outreach list builder
    
- venue research assistant
    
- basic event discovery
    
- post-event report draft
    

Success criteria:

- 1 event supported end-to-end
    
- 50 sponsor leads collected
    
- reminders sent without manual work
    
- first sponsor report generated
    

Difficulty: Medium  
Business value: High

---

## Phase 2 — Event Automation

Build:

- OpenClaw Event Planner Agent
    
- Luma/Eventbrite event sync
    
- Google Calendar integration
    
- sponsor follow-up automation
    
- staff schedule/reminder workflow
    

Success criteria:

- organizer creates event in under 10 minutes
    
- sponsor outreach runs semi-automatically
    
- attendees receive ticket reminders
    
- staff check-in process works
    

Difficulty: Medium-high  
Business value: Very high

---

## Phase 3 — Intelligence

Build:

- competitor event tracker
    
- sponsor matching
    
- venue scoring
    
- pricing suggestions
    
- ROI reporting
    

Success criteria:

- weekly competitor report
    
- top 20 sponsor recommendations per event
    
- venue scorecard generated
    
- sponsor dashboard has useful insights
    

Difficulty: High  
Business value: Very high

---

## Phase 4 — Governed Multi-Agent System

Build:

- Hermes reasoning layer
    
- Paperclip approval gates
    
- OpenClaw multi-agent execution
    
- budget controls
    
- audit logs
    

Success criteria:

- no unsafe autonomous sends
    
- every sponsor/payment action logged
    
- human approval for risky actions
    
- agent budget limits enforced
    

Difficulty: High  
Business value: Strategic

---

# 7. What to Build First

|Priority|Action|Why|
|--:|---|---|
|1|Install/audit OpenClaw core|Foundation|
|2|Build WhatsApp reminder workflow|Fastest real value|
|3|Build sponsor outreach workflow|Fastest revenue|
|4|Build venue research workflow|Helps organizers immediately|
|5|Add Luma/Eventbrite discovery|Better event data|
|6|Add post-event sponsor report|Retention + renewals|
|7|Add competitor tracker|Strategic moat|
|8|Add Paperclip approvals|Needed before autonomy|

---

# 8. What to Avoid

Avoid for now:

- fully autonomous sponsor sending without approval
    
- unvetted ClawHub skills
    
- giving OpenClaw unrestricted shell/file access
    
- scraping LinkedIn aggressively
    
- complex venue booking marketplace before basic venue research works
    
- trying to build white-label SaaS before Medellín events work
    

Security note: OpenClaw’s power comes from broad access to files, messages, browsers, and tools, but that same access creates risks. Use isolated VPS/container execution, allowlisted skills, secret vaulting, logging, and human approval for outbound messages/payments. ([TechRadar](https://www.techradar.com/pro/here-are-the-openclaw-security-risks-you-should-know-about?utm_source=chatgpt.com "Here are the OpenClaw security risks you should know about"))

---

# 9. Final Recommendation

Use OpenClaw for **actions**, not final decision-making.

Best architecture:

```text
mdeai Chat
→ Supabase ai-chat
→ Hermes for reasoning/ranking
→ OpenClaw for execution
→ Paperclip for approvals/governance
→ Supabase for source of truth
```

Best first business move:

```text
Sponsor Outreach Agent + WhatsApp Ticket Reminder Agent + Venue Research Agent
```

These three give mdeai the fastest path to:

- more event revenue
    
- less manual work
    
- better organizer experience
    
- stronger sponsor relationships
    
- a real Medellín event intelligence moat.