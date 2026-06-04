You are a world-class AI product architect, CTO, systems designer, growth strategist, and event-tech specialist.

Your task is to generate a COMPLETE production-grade PRD and architecture roadmap for an AI-powered Contest + Event + Sponsorship + Marketing platform.

The platform combines:

- CopilotKit
- Mastra
- Google ADK
- Google Gemini
- Google Maps Platform
- Supabase
- PostgreSQL + pgvector
- Stripe
- Postiz
- OpenClaw
- Next.js
- AG-UI
- MCP tools
- Realtime systems

The platform focuses on:

- Beauty contests
- Fashion contests
- Photography contests
- Talent competitions
- Events
- Sponsorships
- Ticketing
- Influencer marketing
- Audience growth
- Experiential marketing

Use BEAUTY CONTESTS as the primary real-world example throughout the PRD.

The platform must feel like:

"AI operating system for contests, events, creators, and sponsorship ecosystems."

IMPORTANT:
The PRD must be:
- production-grade
- realistic
- architecture-first
- MVP-focused
- scalable
- security-aware
- AI-enhanced but deterministic where required
- extremely detailed
- deeply practical
- startup + enterprise ready

--------------------------------------------------
SECTION 1 — EXECUTIVE SUMMARY
--------------------------------------------------

Generate:

- product vision
- mission
- positioning
- biggest differentiators
- market opportunity
- why AI changes contests/events
- why this platform is different from:
  - Choicely
  - Eventbrite
  - Hi.Events
  - photography contest apps
  - pageant management systems

Explain:

How CopilotKit + Mastra + ADK + Gemini + Supabase create:
- AI-native contest platform
- AI-native sponsorship platform
- AI-native marketing platform

--------------------------------------------------
SECTION 2 — CORE PRODUCT MODULES
--------------------------------------------------

Generate detailed modules for:

1. Contest Module
2. Event Module
3. Ticketing Module
4. Sponsorship Module
5. Marketing Module
6. Influencer Module
7. Contestant Module
8. Voting Module
9. Judge Module
10. Fan Engagement Module
11. Geo/Maps Module
12. AI Coaching Module
13. Analytics + ROI Module
14. Admin + Moderation Module
15. Automation Module

For EACH module include:
- purpose
- business value
- core features
- advanced AI features
- workflows
- monetization opportunities
- real-world use cases

--------------------------------------------------
SECTION 3 — AI ARCHITECTURE
--------------------------------------------------

Generate complete architecture for:

- CopilotKit
- Mastra
- Google ADK
- Gemini
- Supabase
- pgvector
- Stripe
- Postiz
- OpenClaw

Explain EXACTLY what each layer owns.

MANDATORY RULES:

- Supabase owns deterministic truth
- Stripe owns payments
- AI never controls voting authority
- AI never controls money
- AI proposes, humans approve
- Mastra orchestrates
- CopilotKit renders UI
- ADK provides grounded geo intelligence
- OpenClaw only executes approved automations

Generate:
- architecture tables
- service ownership tables
- routing flows
- orchestration diagrams
- security boundaries

--------------------------------------------------
SECTION 4 — COPILOTKIT FEATURES
--------------------------------------------------

Generate detailed usage of CopilotKit for:

- AI dashboards
- conversational workflows
- sponsor proposal cards
- event setup assistants
- contestant onboarding
- AI voting experiences
- interactive sponsor activations
- live event cards
- real-time leaderboards
- AI-generated campaign workspaces
- approval interfaces
- HITL systems

Include:
- generative UI examples
- card examples
- AI workspace examples
- dashboard concepts
- real-world UI flows

--------------------------------------------------
SECTION 5 — MASTRA WORKFLOWS
--------------------------------------------------

Generate detailed Mastra workflows for:

- contest creation
- event creation
- sponsor onboarding
- AI proposal generation
- influencer outreach
- voting moderation
- contestant onboarding
- AI marketing campaigns
- AI coaching
- geo campaign generation
- social campaign orchestration
- audience segmentation
- sponsor ROI analysis
- fraud detection
- judge scoring
- ticket workflows
- QR validation
- check-in workflows

For EACH workflow include:
- trigger
- steps
- tools used
- approvals
- automations
- database writes
- notifications
- failure handling

Generate workflow diagrams.

--------------------------------------------------
SECTION 6 — GOOGLE ADK + MAPS
--------------------------------------------------

Generate detailed architecture for:

- Google ADK
- Maps Grounding
- Places API
- Routes API
- Nearby Search
- venue intelligence
- geo marketing
- tourism integrations
- nightlife targeting
- sponsor geo intelligence
- localized campaigns

Include real-world Medellín examples:
- Provenza
- Laureles
- Poblado
- Plaza Mayor
- Comuna 13
- nightlife districts

Generate:
- geo workflows
- maps workflows
- nearby business discovery
- activation planning
- geo-targeted sponsorships

--------------------------------------------------
SECTION 7 — PGVECTOR + AI SEARCH
--------------------------------------------------

Generate detailed vector-search architecture for:

- contestant recommendations
- sponsor matching
- event recommendations
- influencer discovery
- audience segmentation
- semantic search
- AI memory
- engagement intelligence

Include:
- embeddings strategy
- metadata strategy
- retrieval flows
- hybrid SQL + vector search
- semantic recommendation engine

Explain:
- when pgvector should be used
- when deterministic SQL should be used
- when AI should NOT be used

--------------------------------------------------
SECTION 8 — VOTING SYSTEM
--------------------------------------------------

Generate complete voting architecture.

Include:
- public voting
- paid voting
- judge scoring
- weighted voting
- fraud detection
- anti-spam systems
- audit logs
- deterministic scoring
- transparency
- moderation

IMPORTANT:
Voting must remain deterministic.

AI may:
- detect anomalies
- recommend moderation
- summarize trends

AI must NEVER:
- determine winners
- directly modify vote truth
- override judges

Generate:
- Stripe voting flows
- anti-fraud workflows
- audit architecture
- vote ledger architecture

--------------------------------------------------
SECTION 9 — STRIPE + TICKETING
--------------------------------------------------

Generate:
- Stripe architecture
- checkout workflows
- webhook systems
- QR tickets
- scanner PWA
- refunds
- sponsorship billing
- paid votes
- subscriptions
- vendor payouts
- sponsor packages

Generate:
- payment diagrams
- event check-in workflows
- ticket lifecycle diagrams

--------------------------------------------------
SECTION 10 — POSTIZ + OPENCLAW
--------------------------------------------------

Generate advanced AI marketing architecture for:

POSTIZ:
- social publishing
- AI scheduling
- campaign orchestration
- multi-platform publishing
- analytics

OPENCLAW:
- outreach automation
- influencer prospecting
- sponsor prospecting
- browser automation
- event distribution
- lead generation

IMPORTANT:
OpenClaw must:
- require approvals
- operate in sandboxed environments
- log all actions
- never autonomously execute sensitive workflows

Generate:
- automation diagrams
- outreach pipelines
- campaign workflows
- safety architecture

--------------------------------------------------
SECTION 11 — TYPES OF AGENTS
--------------------------------------------------

Generate detailed agent system.

Include:
- routerAgent
- contestHostAgent
- contestantCoachAgent
- sponsorAgent
- marketingAgent
- venueAgent
- moderationAgent
- votingIntegrityAgent
- influencerAgent
- conciergeAgent
- analyticsAgent
- supportAgent

For EACH agent include:
- responsibilities
- tools
- workflows
- memory
- prompts
- allowed actions
- forbidden actions

--------------------------------------------------
SECTION 12 — USER JOURNEYS
--------------------------------------------------

Generate detailed journeys for:

1. Contestant
2. Organizer
3. Judge
4. Sponsor
5. Influencer
6. Fan
7. Event Staff
8. Admin

Use real-world examples.

Example:
- Camila joins Miss Medellín
- Roberto creates finals event
- Sponsor launches beauty activation
- Fans vote live
- Influencer promotes contest
- Staff scans tickets

Generate:
- multi-step flows
- conversational UX
- approval journeys
- automation journeys

--------------------------------------------------
SECTION 13 — MARKETING ENGINE
--------------------------------------------------

Generate:
- AI campaign generation
- AI reels generation
- AI influencer workflows
- AI geo campaigns
- AI sponsor activations
- AI engagement systems
- AI retention systems
- AI viral mechanics
- AI personalization

Include:
- Instagram workflows
- TikTok workflows
- WhatsApp workflows
- Email workflows
- creator economy integrations

--------------------------------------------------
SECTION 14 — ROADMAP
--------------------------------------------------

Generate complete roadmap:

1. CORE
2. MVP
3. POST-MVP
4. ADVANCED
5. ENTERPRISE

For EACH phase include:
- goals
- features
- dependencies
- engineering effort
- infrastructure
- monetization
- AI maturity
- risks
- technical debt

--------------------------------------------------
SECTION 15 — SECURITY + GOVERNANCE
--------------------------------------------------

Generate:
- AI safety architecture
- moderation systems
- fraud prevention
- approval systems
- role permissions
- audit logging
- privacy architecture
- PII protections
- payment protections
- anti-abuse systems

Include:
- AI governance
- OpenClaw governance
- sponsor governance
- voting governance

--------------------------------------------------
SECTION 16 — MERMAID DIAGRAMS
--------------------------------------------------

Generate MANY Mermaid diagrams including:

- architecture diagrams
- workflow diagrams
- sponsorship flows
- contest flows
- voting systems
- onboarding systems
- AI orchestration
- event lifecycles
- geo intelligence
- social automation
- Stripe flows
- ticketing flows
- OpenClaw automation
- Postiz pipelines
- agent communication
- CopilotKit UI flows

--------------------------------------------------
SECTION 17 — FINAL STRATEGY
--------------------------------------------------

Generate:

- biggest competitive advantages
- moat analysis
- what to build first
- what NOT to build early
- realistic risks
- best MVP strategy
- scaling strategy
- investor narrative
- AI differentiation
- long-term platform vision

IMPORTANT FINAL RULES:

- prioritize MVP realism
- avoid AI hype
- deterministic systems must own:
  - money
  - votes
  - rankings
  - audit truth
- AI enhances workflows and engagement
- human approval remains critical
- architecture must scale
- architecture must remain maintainable
- architecture must be modular
- architecture must be production-ready

OUTPUT FORMAT:
- massive structured markdown document
- tables everywhere
- mermaid diagrams
- architecture diagrams
- implementation notes
- real-world examples
- technical explanations
- startup strategy
- product strategy
- operational strategy