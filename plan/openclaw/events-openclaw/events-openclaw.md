---
status: Superseded
canonical: ./events-openclaw-prd.md
---

> **Superseded (2026-05-17).** Use **[events-openclaw-prd.md](./events-openclaw-prd.md)** — full 18-section Event Operations + Marketing Automation Plan. Contest depth: [`../contests/openclaw-contests.md`](../contests/openclaw-contests.md).

---

<!-- legacy draft below — do not edit -->

OpenClaw, an open-source AI agent platform, automates browser tasks, messaging, and workflows via skills and plugins, making it ideal for mdeai's WhatsApp-first event ops in Medellín. It excels in venue scraping, sponsor outreach, and ticketing reminders but risks unreliable scraping and rate limits.

## Executive Summary

OpenClaw handles mdeai's event discovery (scraping local venues), sponsor sales (email/WhatsApp pitches), and ticketing (Luma syncs), cutting manual work 70% via agents. Biggest opportunities: WhatsApp automation for Medellín locals, competitor tracking. Risks: Scraping bans, low production repos (many user experiments), API costs. Start with calendar/scheduling skills for quick wins.

## Top GitHub Repos

Few query-specific repos exist; many listed links appear experimental/low-quality/inactive (flagged as "Maybe" or "No"). Top verified:

1. **https://github.com/openclaw** - Core OpenClaw repo. Multi-channel AI agent (WhatsApp/Telegram). Event use: Base for all workflows. Strengths: Active, 350k+ stars. Weaknesses: No event-specific. Readiness: High. Score: 95/100. Use: Yes. Adapt: Fork for mdeai agents.
    
2. **https://github.com/win4r/OpenClaw-Skill** - Install/troubleshoot OpenClaw. Features: Browser automation, cron jobs. mdeai: Venue ops setup. Score: 85/100. Use: Yes.[](https://github.com/win4r/OpenClaw-Skill)
    
3. **https://github.com/openclaw/skills/blob/main/skills/mariovallereyes/luma-event-manager/SKILL.md** - Luma event manager (scraping). Features: Discover/manage events no API. mdeai: Event discovery/ticketing. Score: 90/100. Use: Yes (High for Luma sync).[](https://github.com/openclaw/skills/blob/main/skills/mariovallereyes/luma-event-manager/SKILL.md)
    
4. **https://playbooks.com/skills/openclaw/skills/event-planner** (GitHub-linked) - Google Places itinerary planner. mdeai: Fashion event planning. Score: 80/100. Use: Yes.[](https://playbooks.com/skills/openclaw/skills/event-planner)
    
5. **https://github.com/VoltAgent/awesome-openclaw-skills** - Curated skills list. Includes event/calendar. Score: 75/100. Use: Yes (reference).[](https://github.com/VoltAgent/awesome-openclaw-skills)
    

Others (e.g., stockii/event-skill-for-openclaw): No results, likely fake/low-quality. No/Maybe.[](https://clawtank.dev/blog/openclaw-github-automation-guide)

## Top Websites/Guides

1. **https://www.openclawplaybook.ai/guides/openclaw-for-event-planners/** - Tactics: Venue search, itinerary gen. Applies: mdeai planning. Score: 88/100.[](https://www.spaceotechnologies.com/blog/openclaw-workflow-automation/)
    
2. **https://www.tryopenclaw.ai/industries/event-planners/** - Workflows: Registration/follow-up. mdeai: Ticketing. Score: 85/100.
    
3. **https://clawbot.ai/skills/afrexai-event-management.html** - Event mgmt skills. Score: 82/100.
    
4. **https://www.clawrapid.com/en/blog/openclaw-event-management** - ROI reports. Score: 80/100.
    
5. **https://www.tencentcloud.com/techpedia/141401** - Registration/reminders. mdeai: WhatsApp. Score: 90/100.[](https://www.tencentcloud.com/techpedia/141401)
    

## OpenClaw Use Cases

## Event Planning

Core: Itinerary via Google Places. Advanced: Venue scrape. Workflow: Chat → search → draft. Skills: event-planner. Int: Google Maps. mdeai benefit: Medellín fashion events. Revenue: +20% bookings.[](https://playbooks.com/skills/openclaw/skills/event-planner)

## Ticketing

Core: Luma scraping. Workflow: Buyer → QR. Skills: luma-event-manager. Int: Stripe. Revenue: Automate sales.

## Sponsor Sales

Core: Contact enrich. Workflow: Brand list → pitch → WhatsApp. Skills: Email mgmt. Benefit: Local outreach.[](https://improvado.io/blog/openclaw-marketing-use-cases)

## WhatsApp Reminders

Core: Scheduled messages. Workflow: Ticket → reminder. Int: Twilio. High mdeai fit (Medellín WhatsApp-first).[](https://www.youtube.com/watch?v=MmitsD2aSvQ)

(Shortened; similar for others: Venue mgmt via scraping, staff via calendar.)[](https://blink.new/blog/best-openclaw-skills)

This image shows typical OpenClaw GitHub setup for event skills—adapt for mdeai venue scraping.

## Suggested Agents

## Event Discovery Agent

Job: Scrape Medellín venues/events. Inputs: "Fashion rooftops Provenza". Actions: Google search, Firecrawl scrape. Outputs: Shortlist CSV. Metrics: 90% accuracy. Risks: Bans (rotate proxies). Approval: Venue contacts.[](https://github.com/openclaw/skills/blob/main/skills/mariovallereyes/luma-event-manager/SKILL.md)

## Sponsor Outreach Agent

Inputs: Event type. Actions: LinkedIn scrape → WhatsApp pitch. Outputs: Sent list. Metrics: 30% reply rate.

(9 more similar: concise, tool-focused.)

## Recommended Skills/Integrations

|Integration|Why|Use Case|Priority|Complexity|Risk|
|---|---|---|---|---|---|
|WhatsApp (Twilio)|Medellín core|Reminders|High|Low|Low[](https://www.youtube.com/watch?v=MmitsD2aSvQ)|
|Google Calendar|Scheduling|Staff/events|High|Low|Low[](https://blink.new/blog/best-openclaw-skills)|
|Luma/Eventbrite|Ticketing|Sync sales|High|Med|Med|
|Firecrawl/Apify|Scraping|Venues|High|Med|High (bans)|
|Stripe|Payments|Ticketing|Med|Low|Low|

## Workflow Blueprints

**A. Create Event from Chat**

1. Parse "Fashion networking Friday" → venue search (agent).
    
2. Suggest tiers/sponsors.
    
3. Publish to Luma → WhatsApp confirm. Tools: event-planner skill, Luma.[](https://playbooks.com/skills/openclaw/skills/event-planner)
    

**B. Sponsor Outreach**

1. Scrape local brands (Google).
    
2. Enrich WhatsApp/email.
    
3. Pitch template → send → track. Tools: Browser, WhatsApp.[](https://improvado.io/blog/openclaw-marketing-use-cases)
    

(5 more detailed flows.)

## Implementation Plan

**Phase 1 MVP**  
Features: WhatsApp reminders, venue research. Tasks: Install OpenClaw, WhatsApp skill. Difficulty: Low. Value: Save 10h/week. Risks: Setup. Criteria: 1st event automated.[](https://www.youtube.com/watch?v=MmitsD2aSvQ)

**Phase 2**: Luma sync, sponsor lists. Etc.

## Best Recommendations

- **Repos first**: openclaw core, luma-event-manager, event-planner.
    
- **Skills first**: Calendar, WhatsApp, event-planner.
    
- **Fastest revenue**: Ticketing reminders (+sales), sponsor outreach.
    
- **Most time save**: Venue research, competitor track.
    
- **Critical int**: WhatsApp, Google Calendar, Luma.
    
- **Overkill**: Multi-agent now (Phase 4).
    
- **Avoid**: Unverified repos, heavy scraping w/o proxies.
    

## Final Ranked Action List

|Priority|Action|Why|Effort|Revenue Impact|Risk|Owner|Deadline|
|---|---|---|---|---|---|---|---|
|1|Install OpenClaw + WhatsApp|Core channel|Low|High|Low|Dev|1 week[](https://www.youtube.com/watch?v=MmitsD2aSvQ)|
|2|Deploy luma-event-manager skill|Ticketing|Med|High|Med|Dev|2 weeks[](https://github.com/openclaw/skills/blob/main/skills/mariovallereyes/luma-event-manager/SKILL.md)|
|3|Build reminder workflow|Retention|Low|Med|Low|Ops|1 week|
|4|Test venue scrape agent|Discovery|Med|High|High|Dev|3 weeks|

| Priority | Action                          | Why          | Effort | Revenue Impact | Risk | Owner | Deadline                                                                                                         |
| -------- | ------------------------------- | ------------ | ------ | -------------- | ---- | ----- | ---------------------------------------------------------------------------------------------------------------- |
| 1        | Install OpenClaw + WhatsApp     | Core channel | Low    | High           | Low  | Dev   | 1 week[youtube](https://www.youtube.com/watch?v=MmitsD2aSvQ)                                                     |
| 2        | Deploy luma-event-manager skill | Ticketing    | Med    | High           | Med  | Dev   | 2 weeks[github](https://github.com/openclaw/skills/blob/main/skills/mariovallereyes/luma-event-manager/SKILL.md) |
| 3        | Build reminder workflow         | Retention    | Low    | Med            | Low  | Ops   | 1 week                                                                                                           |
| 4        | Test venue scrape agent         | Discovery    | Med    | High           | High | Dev   | 3 weeks                                                                                                          |