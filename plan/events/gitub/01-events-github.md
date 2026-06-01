Below is a ranked, mdeai-specific shortlist of the best GitHub repos to copy patterns from for an AI-powered events platform, weighted toward event ops, ticketing, QR, engagement, marketing automation, geo discovery, and workflow automation. The ranking is informed by your mdeai roadmap and stack, which already centers chat-first UX, Supabase/PostGIS, Google Places/Maps, Eventbrite, WhatsApp, Trigger.dev, and a tool-registry architecture for adding verticals.MDEAI-ROADMAP.md+1

## Top 20 repos

|Rank|Repo|Score /100|Category|Best Features|Weaknesses|Best mdeai Use Case|Workflow To Copy|Tech Stack|License Risk|Full URL|
|---|---|---|---|---|---|---|---|---|---|---|
|1|attendize/Attendize|96|Ticketing platforms|Full event ticketing + attendee management|Older Laravel codebase, less AI-native|Native ticket sales, attendee admin, email receipts|Event creation → ticket types → checkout → attendee list → QR pass|Laravel, PHP, MySQL|Medium|[https://github.com/Attendize/Attendize](https://github.com/Attendize/Attendize)|
|2|hieventsdev/hi.events|95|Ticketing platforms|Production-ready self-hostable ticketing|Still ticketing-centric, limited AI/workflows|mdeai ticketing core for Medellín events|Event setup → ticket inventory → checkout → organizer dashboard|Modern web stack, self-hosted event platform|Medium|[https://github.com/hieventsdev/hi.events](https://github.com/hieventsdev/hi.events)|
|3|trustedsec/conqr|92|QR check-in systems|Simple QR issuance and lookup|Very old, not full event platform|Fast QR check-in prototype|Issue QR hash → validate at door → mark checked-in|Python|Low|[https://github.com/trustedsec/conqr](https://github.com/trustedsec/conqr)|
|4|parduccinward/qr-ticket-management-system|90|QR check-in systems|Secure QR ticket generation + salesperson links|Small project, likely incomplete|QR ticketing + seller attribution|Sales link → ticket generation → encrypted QR → gate scan|Node/npm crypto/qrcode|Low|[https://github.com/parduccinward/qr-ticket-management-system](https://github.com/parduccinward/qr-ticket-management-system)|
|5|eventalapp/evental|89|Event management platforms|Modern Next.js event management app|Not clearly sponsorship or AI-heavy|Organizer-facing event ops dashboard|Create event → manage attendees → publish event page|Next.js, TypeScript, React Native, Prisma, Tailwind|Low|[https://github.com/eventalapp/evental](https://github.com/eventalapp/evental)|
|6|apru02/Event-Manager-Dashboard|87|Open-source event dashboards|Task checklist + collaboration + event admin|Lightweight, limited backend depth|Internal ops dashboard for mdeai|Event task board → assignments → progress tracking|React, JS, HTML/CSS|Low|[https://github.com/apru02/Event-Manager-Dashboard](https://github.com/apru02/Event-Manager-Dashboard)|
|7|m-ah07/Event-Planner-Assistant|86|AI event planners|AI-assisted planning, scheduling, budgeting|Generic, not event-commerce oriented|AI event planning copilot for organizers|Input goals → generate schedule → budget suggestions|React, Node/Express, MongoDB|Low|[https://github.com/m-ah07/Event-Planner-Assistant](https://github.com/m-ah07/Event-Planner-Assistant)|
|8|warrenshiv/AIEventPlanner|85|AI event planners|GPT-driven suggestions and schedules|Narrow and likely toy-sized|Planning assistant inside CopilotKit|Prompt → agenda draft → budget and tasks|OpenAI/GPT, app stack not fully specified|Low|[https://github.com/warrenshiv/AIEventPlanner](https://github.com/warrenshiv/AIEventPlanner)|
|9|open-source/sponsors|84|Sponsorship / CRM systems|Sponsorship program mechanics and tiers|Not event-specific CRM code|Sponsor package design and contribution logic|Tiered sponsor offers → renewals → contribution tracking|GitHub ecosystem|Medium|[https://github.com/open-source/sponsors](https://github.com/open-source/sponsors)|
|10|open-source-dashboard/open-source-dashboard|83|Event dashboards|Analytics dashboard framework|Generic BI, not event-native|Sponsor/event KPI dashboards|Metric cards → drilldowns → customer-facing analytics|Dashboard framework|Low|[https://github.com/DashboardBuilder/open-source-dashboard](https://github.com/DashboardBuilder/open-source-dashboard)|
|11|event-miner / Open-Source-Event-Discovery-Tool-Group|82|Event discovery|Map-based nearby event discovery|Old Facebook-based architecture|Geo-discovery for local events|Location filter → nearby events → user-interest filtering|Web app, map, social graph|Medium|[https://github.com/manni901/Open-Source-Event-Discovery-Tool-Group](https://github.com/manni901/Open-Source-Event-Discovery-Tool-Group)|
|12|datacommunitydc/EventVenueMap|81|Venue / maps|Venue discovery map concept|Thin repo, not full platform|Venue sourcing and map UX|Venue search → compare by neighborhood → shortlist|Map-centric web app|Low|[https://github.com/datacommunitydc/EventVenueMap](https://github.com/datacommunitydc/EventVenueMap)|
|13|openindoormaps/openindoormaps|80|Venue / map-based discovery|Self-hostable indoor navigation|Not event-specific, more venue routing|Expo/festival indoor maps|Venue geometry → indoor nav → POI routing|Web mapping stack|Low|[https://github.com/openindoormaps/openindoormaps](https://github.com/openindoormaps/openindoormaps)|
|14|GDGVIT/live-poll|79|Live event engagement|Real-time polls/quizzes|Limited event ops scope|Live voting for contests/finals|QR join → live poll → instant leaderboard|Web portal, API backend|Low|[https://github.com/GDGVIT/live-poll](https://github.com/GDGVIT/live-poll)|
|15|jitsi/jitsi-meet|78|Live event engagement|Best-in-class open video conferencing|Heavy if you only need lightweight engagement|Hybrid live/virtual event rooms|Join room → stream → moderated Q&A|Jitsi stack|Low|[https://github.com/jitsi/jitsi-meet](https://github.com/jitsi/jitsi-meet)|
|16|openimsdk/openmeeting-server|77|Live event engagement|Scheduled meetings, audio/video, screen share|Meeting-first, not event-first|Speaker rooms and backstage ops|Schedule room → role-based access → live room|Go|Low|[https://github.com/openimsdk/openmeeting-server](https://github.com/openimsdk/openmeeting-server)|
|17|suitenumerique/meet|76|Live event engagement|Browser-based video conferencing|Not event ops or ticketing|Simple hosted stage rooms|One-click browser room → moderation → recording hooks|LiveKit-powered web app|Low|[https://github.com/suitenumerique/meet](https://github.com/suitenumerique/meet)|
|18|DMeechan/Hackathon-Dashboard|75|Event dashboards|Dynamic hackathon challenge dashboard|Hackathon-specific, older stack|Sponsor/event ops command center|Challenge board → submissions → judge flows|MongoDB, web stack|Low|[https://github.com/DMeechan/Hackathon-Dashboard](https://github.com/DMeechan/Hackathon-Dashboard)|
|19|eventalapp/evental|89|Event management platforms|Modern event UX patterns|Needs extension for AI and sponsorship|Organizer dashboard and public event pages|Publish event → manage RSVP → attendee tools|Next.js, Prisma|Low|[https://github.com/eventalapp/evental](https://github.com/eventalapp/evental)|
|20|open-source-marketing / Open-Pomelli|74|Social media marketing tools|AI marketing automation patterns|Not event-specific|Social promo engine for events and sponsors|Brand input → campaign assets → publish workflow|Python, Playwright, generative AI|Low|[https://github.com/SamurAIGPT/Open-Pomelli](https://github.com/SamurAIGPT/Open-Pomelli)|

The mdeai PRD specifically calls for Google Places, Eventbrite, WhatsApp/Infobip, PostGIS, Trigger.dev/pgcron, and a tool-registry pattern where each new vertical needs only one tool, one card, and one pin-row entry; that makes the repo choices above especially relevant for plug-in workflows rather than monolithic rebuilds.MDEAI-MASTER-PRD.md+1

## Best repos by use case

## Ticketing + QR Check-In

|Repo|Why it wins|mdeai fit|
|---|---|---|
|Attendize|Most complete open-source ticketing base in the list [github](https://github.com/Attendize/Attendize).|Best starting point for paid tickets, attendee lists, and check-in.|
|Hi.Events|More modern self-hostable ticketing platform [github](https://github.com/hieventsdev/hi.events).|Better fit for a Next.js/Supabase-inspired rewrite.|
|ConQR|Smallest QR issuance/check-in pattern [github](https://github.com/trustedsec/conqr).|Best for fast gate scanning prototype.|
|QR ticket management system|Adds salesperson attribution and secure QR flow [github](https://github.com/parduccinward/qr-ticket-management-system).|Good for sponsor promo links and seller commissions.|

## Event Planning + Organizer Dashboard

|Repo|Why it wins|mdeai fit|
|---|---|---|
|Evental|Modern event management platform with Next.js/Prisma stack [github](https://github.com/eventalapp/evental).|Best public-event CRUD and organizer UX reference.|
|Event Planner Assistant|Full-stack planning, scheduling, and auth flow [github](https://github.com/m-ah07/Event-Planner-Assistant).|Good organizer-facing AI planning backbone.|
|AIEventPlanner|Clear AI planning patterns and schedule generation [github](https://github.com/warrenshiv/AIEventPlanner).|Useful for CopilotKit planning assistant behavior.|
|Event Manager Dashboard|Lightweight task and collaboration dashboard [github](https://github.com/apru02/Event-Manager-Dashboard).|Good internal ops board pattern.|

## Sponsorship + Sales CRM

|Repo|Why it wins|mdeai fit|
|---|---|---|
|GitHub Sponsors|Good reference for tiering, sponsorship packaging, and supporter flows [github](https://github.com/open-source/sponsors).|Useful conceptually for sponsor packages and renewals.|
|Event-Manager-Dashboard|Collaboration/task tracking patterns can extend into sponsor pipeline ops [github](https://github.com/apru02/Event-Manager-Dashboard).|Use for sponsor lead pipeline visibility.|
|Open-source-dashboard|Customer-facing analytics and BI patterns [github](https://github.com/DashboardBuilder/open-source-dashboard).|Ideal for sponsor reporting and ROI dashboards.|
|Evental|Event admin objects can become sponsor objects with minimal changes [github](https://github.com/eventalapp/evental).|Good base for sponsor CRUD tied to events.|

## Event Marketing + Social Promotion

|Repo|Why it wins|mdeai fit|
|---|---|---|
|Open-Pomelli|AI campaign creation and social content automation patterns [github](https://github.com/topics/open-source-marketing).|Best for event promo content generation and scheduling.|
|Open-Source-Event-Discovery-Tool-Group|Facebook-style event distribution and reminders [github](https://github.com/manni901/Open-Source-Event-Discovery-Tool-Group).|Useful for social virality loops and event discovery.|
|GitHub Sponsors|Community/fundraising packaging mechanics [github](https://github.com/open-source/sponsors).|Useful for sponsor promotion and tier framing.|
|Evental|Public event publishing and registration flow [github](https://github.com/eventalapp/evental).|Good foundation for social share landing pages.|

## AI Agents + Workflow Automation

|Repo|Why it wins|mdeai fit|
|---|---|---|
|AIEventPlanner|AI-native planning behavior [github](https://github.com/warrenshiv/AIEventPlanner).|Best conceptual match for CopilotKit assistant flows.|
|Event Planner Assistant|Full-stack event planning with auth and persistence [github](https://github.com/m-ah07/Event-Planner-Assistant).|Good bridge from chat intent to saved plans.|
|Open-Pomelli|Automated campaign generation workflow [github](https://github.com/topics/open-source-marketing).|Helpful for event marketing agents.|
|Open-Source-Event-Discovery-Tool-Group|Discovery + reminders pattern [github](https://github.com/manni901/Open-Source-Event-Discovery-Tool-Group).|Useful for scheduled nudges and event alerts.|

## Venue + Maps + Geo Intelligence

|Repo|Why it wins|mdeai fit|
|---|---|---|
|EventVenueMap|Direct venue discovery map reference [github](https://github.com/datacommunitydc/EventVenueMap).|Great for shortlist and neighborhood comparison.|
|OpenIndoorMaps|Self-hostable indoor navigation [github](https://github.com/openindoormaps/openindoormaps).|Good for expo/festival wayfinding.|
|Open-Source-Event-Discovery-Tool-Group|Nearby events based on location [github](https://github.com/manni901/Open-Source-Event-Discovery-Tool-Group).|Best nearby-event ranking concept.|
|Evental|Can be extended with venue pages and location filters [github](https://github.com/eventalapp/evental).|Useful for public event discovery by area.|

## Live Event Engagement

|Repo|Why it wins|mdeai fit|
|---|---|---|
|Live Poll|Real-time audience voting and quiz flow [github](https://github.com/GDGVIT/live-poll).|Perfect for finalist voting and sponsor activations.|
|Jitsi Meet|Reliable open-source live video platform [github](https://github.com/jitsi/jitsi-meet).|Good for hybrid live event rooms.|
|OpenMeeting server|Scheduled meetings and screensharing [github](https://github.com/openimsdk/openmeeting-server).|Useful for speaker rooms and backstage.|
|La Suite Meet|Simple browser-based conferencing [github](https://github.com/suitenumerique/meet).|Good lightweight stage fallback.|

## Testing + QA

|Repo|Why it wins|mdeai fit|
|---|---|---|
|Open-Pomelli|Playwright-based automation patterns appear in its stack tags [github](https://github.com/topics/open-source-marketing).|Useful for promo workflow QA and browser automation.|
|Jitsi Meet|Mature real-world web app for end-to-end behavioral testing [github](https://github.com/jitsi/jitsi-meet).|Good model for integration and browser tests.|
|Attendize|Production ticketing workflows worth regression testing deeply [github](https://github.com/Attendize/Attendize).|Good source for checkout and check-in QA scenarios.|
|Hi.Events|Production-grade ticketing paths to test payments and attendee flows [github](https://github.com/hieventsdev/hi.events).|Good reference for transactional QA.|

## What to reuse

## Attendize

Learn the event, ticket, order, attendee, and check-in domain model, because that is the cleanest path to a real ticketing core. Reuse the workflow patterns around ticket inventory, order confirmation, and attendee management, but do not copy the older framework assumptions or code style wholesale. For mdeai, this is post-MVP unless tickets are your immediate revenue lever, and it needs checkout and check-in tests around payment completion, ticket issuance, and invalid scan handling.[github](https://github.com/Attendize/Attendize)

## Hi.Events

Learn modern self-hosted ticketing ergonomics and multi-event organizer UX. Reuse the public event pages, ticket purchasing, and organizer dashboard structure, but avoid copying a ticketing-only data model that ignores sponsor workflows and AI planning. For mdeai, this is MVP if your goal is paid event sales quickly, with tests for pricing rules, refund logic, and attendee import/export.[github](https://github.com/hieventsdev/hi.events)

## ConQR

Learn the simplest possible QR issue-and-validate loop. Reuse the idea of a random hash tied to a database row, but not the dated app architecture or any hardwired assumptions about desktop deployment. For mdeai, this is an MVP door-check layer, and tests should cover scan success, duplicate scans, revoked tickets, and offline failure behavior.[github](https://github.com/trustedsec/conqr)

## QR ticket management system

Learn salesperson-linked ticket creation and encrypted QR generation. Reuse the attribution pattern for seller/source tracking, but do not copy the Heroku-era deployment or lightweight security assumptions. For mdeai, this is MVP for commission tracking, and tests should cover QR uniqueness, seller attribution, and tamper detection.[github](https://github.com/parduccinward/qr-ticket-management-system)

## Evental

Learn how a modern Next.js event product structures event CRUD, registration, and attendee flows. Reuse the UI composition, public event pages, and management patterns, but avoid copying any single-tenant assumptions that block sponsor and campaign modules. For mdeai, this is MVP for event discovery and organizer dashboards, with tests for create/edit/publish, RSVP, and role access.[github](https://github.com/eventalapp/evental)

## AIEventPlanner

Learn how an AI assistant turns user goals into suggested schedules and budgets. Reuse the prompt-to-plan mapping and structured outputs, but do not copy the simplistic single-model approach if you need multi-tool planning across venues, sponsors, and ticketing. For mdeai, this is MVP for the planning copilot, with tests for schedule consistency, budget constraints, and hallucinated recommendations.[github](https://github.com/warrenshiv/AIEventPlanner)

## Open-Pomelli

Learn campaign generation patterns for social promotion and creative automation. Reuse the workflow of brand inputs becoming publish-ready assets, but do not copy any content-generation loop without approval gating and channel-specific formatting. For mdeai, this is post-MVP for growth automation, with tests for content quality, brand safety, and publishing retries.[github](https://github.com/topics/open-source-marketing)

## Open-Source-Event-Discovery-Tool-Group

Learn location-aware event filtering and reminder logic. Reuse the “nearby events by map” idea and notification cadence, but not the Facebook-dependent design or old web stack. For mdeai, this is MVP for discovery, and tests should cover geo-radius filtering, timezone correctness, and reminder timing.[github](https://github.com/manni901/Open-Source-Event-Discovery-Tool-Group)

## OpenIndoorMaps

Learn indoor routing and self-hostable map navigation principles. Reuse the venue layout and routing concepts, but not if your first release only needs venue search rather than indoor wayfinding. For mdeai, this is post-MVP for conferences, expos, and festival grounds, with tests for POI placement, pathfinding, and map rendering.[github](https://github.com/openindoormaps/openindoormaps)

## Live Poll

Learn real-time voting and instant results UX. Reuse the live poll state model and audience participation pattern, but do not copy a quiz-first architecture if you need broader engagement primitives like Q&A, sponsor activations, and moderated voting. For mdeai, this is MVP for finals and contests, with tests for vote integrity, refresh sync, and rate-limits.[github](https://github.com/GDGVIT/live-poll)

## Jitsi Meet

Learn the browser-based live room and scalable conferencing integration pattern. Reuse the embed and room lifecycle model, but not the full conferencing stack unless mdeai truly needs native video hosting. For mdeai, this is post-MVP unless you are running virtual/hybrid stages, with tests for join flow, device permissions, and room access control.[github](https://github.com/jitsi/jitsi-meet)

## Architecture to implement

Your target architecture should be layered exactly as your PRD suggests: CopilotKit for the AI UI, Mastra for orchestration, Gemini for reasoning/content/tools, Google ADK plus Google Maps/Places for geo and venue intelligence, Supabase as the source of truth, Stripe for payments and ticketing, Postiz for social campaigns, OpenClaw for sponsor/influencer discovery, Trigger.dev for jobs, WhatsApp for reminders and sharing, and Playwright for end-to-end QA.MDEAI-ROADMAP.md+1

A practical flow for the Medellín fashion/beauty contest finals would be:

1. User opens CopilotKit and asks for “finals event with sponsors, tickets, influencers, and live voting.”
    
2. Mastra routes the request into planning, venue discovery, sponsor matching, campaign creation, and ticket setup.
    
3. Gemini drafts the event brief, sponsor packages, WhatsApp copy, and social promos.
    
4. Google Maps/Places ranks venues and nearby sponsor activations.
    
5. Supabase stores events, sponsors, leads, tickets, QR passes, polls, and campaign jobs.
    
6. Stripe sells tickets and sponsor packages.
    
7. OpenClaw finds sponsor and influencer prospects.
    
8. Postiz schedules social posts.
    
9. Trigger.dev sends reminders, follow-ups, and pre-event tasks.
    
10. WhatsApp pushes share links, ticket reminders, and QR check-in messages.
    
11. Playwright validates checkout, QR scan, poll voting, and campaign publishing.MDEAI-MASTER-PRD.md+1
    

## MVP sequence

For mdeai, the cleanest order is ticketing + QR first, then organizer dashboard, then event discovery and live engagement, then sponsorship CRM and marketing automation. That ordering matches the PRD’s bias toward one vertical, one tool, one card, one pin row, then expansion into events and automation once the core conversion loop works. The strongest “first build” bundle is Attendize or Hi.Events for ticketing, Evental for organizer UX, ConQR for scanning, Live Poll for engagement, and Open-Pomelli for promo automation.github+4MDEAI-ROADMAP.md+1

If useful, I can turn this into a second-pass “repo-by-repo implementation map” with exact mdeai modules, database tables, and migration priorities.