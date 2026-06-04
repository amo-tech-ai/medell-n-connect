# OpenClaw Real Estate Execution Report - mdeai / ILM

Date: 2026-05-07

Scope: OpenClaw as the execution/actions/channels layer for a Medellin-focused, rentals-first real-estate marketplace covering renters, buyers, sellers, landlords, property managers, agents, CRM, WhatsApp, showings, listings, follow-ups, marketing, paperwork, and sales lifecycle operations.

Recommended architecture:

```text
Supabase = source of truth
Hermes = reasoning / ranking / memory
OpenClaw = execution / actions / channels
Postiz = social growth / listing promotion
Paperclip = governance / approvals / budgets / audit
```

## 1. Executive Summary

OpenClaw is a self-hosted AI assistant gateway. Official docs and GitHub describe it as a local-first Gateway that connects AI agents to messaging channels such as WhatsApp, Telegram, Slack, Discord, Signal, Microsoft Teams, Google Chat, iMessage, WebChat, and more. It also exposes skills, plugins, browser/actions, tools, sessions, multi-agent routing, cron/tasks, and a dashboard/control UI.

The problem it solves for real estate is execution: real estate work lives inside WhatsApp, email, portals, calendars, CRMs, spreadsheets, documents, and browser tabs. Hermes can reason about a lead or property, but OpenClaw is the layer that can message, collect data, update tools, schedule, monitor, and trigger workflows.

Real estate is a strong use case because the lifecycle is repetitive and communication-heavy:

- new lead intake
- preference collection
- follow-up reminders
- CRM updates
- showing coordination
- listing description and photo checklist
- seller intake
- purchase/lease deadlines
- renewal and post-move reminders

Recommendation for mdeai: use OpenClaw, but not as the first production dependency. Launch the basic rentals loop first in Supabase. Add Postiz for listing promotion and Hermes for ranking/summaries. Then use OpenClaw for a single, narrow workflow: WhatsApp renter lead intake -> qualified lead -> Supabase lead row -> human/operator review before any outbound non-template message.

Do not start with autonomous scraping, cold outreach, payment actions, contract signing, or broad CRM write access.

## 2. Evidence Quality

| Source type | Confidence | Notes |
|---|---:|---|
| Official OpenClaw docs | High | Best source for channels, WhatsApp, config, security, skills, ClawHub, install/setup. |
| OpenClaw GitHub | High | Confirms self-hosted gateway, supported channels, Node requirements, security defaults, source structure. |
| ClawHub skill pages | Medium-high | Useful for real-estate skill inventory and install metadata. Quality varies; install only after code review. |
| Skills.sh pages | Medium | Useful skill discovery and SKILL.md content. Not all skills are relevant to Medellin or OpenClaw directly. |
| Reddit/community posts | Low-medium | Useful for real-world caution: security, production maturity, CRM edge cases. Not reliable product proof. |
| Vendor/agency blogs | Low-medium | Good workflow inspiration. Claims about adoption, cost, or ROI need verification. |
| Security/press sources | Medium | Useful risk signal for marketplace/skill security. Verify against current OpenClaw release before making claims. |

## 3. Verified Facts vs Assumptions

### Verified Facts

- OpenClaw is a self-hosted gateway for AI agents across messaging channels.
- Official docs list WhatsApp, Telegram, Slack, Discord, Signal, Teams, Google Chat, iMessage, Matrix, LINE, Zalo, WebChat, and more.
- WhatsApp support is Web/Baileys-based, QR-paired, and has allowlist/pairing/group policy controls.
- OpenClaw supports skills stored as folders containing `SKILL.md` plus optional supporting files.
- ClawHub is the public registry for OpenClaw skills/plugins and supports search, install, update, versioning, stars, comments, and moderation.
- OpenClaw configuration includes channel policies, tool profiles, skills, plugins, browser, cron, Gmail integration, secrets, logging, and security controls.
- Official security docs state OpenClaw is built for a personal/single trust-boundary assistant model, not hostile multi-tenant isolation.
- Official security docs recommend pairing/allowlists, strict group behavior, least-privilege tools, sandboxing, and security audit commands.

### Assumptions for mdeai

- OpenClaw can execute mdeai workflows if mdeai exposes controlled tools/API endpoints for lead creation, listing lookup, showing creation, and message logging.
- OpenClaw should not hold canonical marketplace state; Supabase should.
- OpenClaw should operate behind Paperclip approval gates once it can send messages, publish, scrape, or trigger payment-adjacent workflows.
- Real-estate ClawHub/Skills.sh skills can accelerate prompt/instruction design, but should not be trusted as production code without inspection.

### Needs Verification

- Current OpenClaw release compatibility with each desired plugin/skill.
- Whether official or community CRM/email/calendar plugins cover mdeai's exact providers.
- WhatsApp account-ban risk under Colombia/Meta policies for OpenClaw Web automation.
- Browser action stability on real listing sites and Facebook groups.
- Legal/TOS status for scraping each target source.
- ClawHub skill security claims, especially for any skill with scripts, credentials, or network calls.

## 4. Core Features

### Channels

OpenClaw's strongest product surface is multi-channel routing through one Gateway. Official docs list WhatsApp, Telegram, Slack, Discord, Signal, Google Chat, Teams, LINE, Matrix, Zalo, WebChat, and more. For mdeai, this means one execution layer can receive or send through the communication channels that renters, landlords, and agents already use.

Best first channel for Colombia/mdeai: WhatsApp, with a dedicated number, strict allowlist/pairing, and human-approved outbound templates.

### WhatsApp / Telegram / Email / Chat

WhatsApp is production-ready in docs via WhatsApp Web/Baileys, but it is not the same as the official WhatsApp Business Cloud API. That matters: Web automation can carry account-ban and ToS risk. Telegram is simpler to configure and safer for internal operator testing. Email support appears through tools/integrations rather than a single real-estate-native channel.

Recommended setup:

- Telegram first for internal smoke tests.
- WhatsApp dedicated number for controlled renter/landlord workflows.
- Email only for draft/review workflows until compliance and deliverability are known.

### Skills

Skills teach the agent how to use tools or follow a domain workflow. OpenClaw loads bundled, managed, personal, project, and workspace skills with precedence rules. It supports per-agent skill allowlists, which is important for real estate. A showing scheduler agent should not automatically inherit a payment/refund or filesystem skill.

For mdeai, build narrow skills:

- `mde-renter-intake`
- `mde-landlord-followup`
- `mde-showing-scheduler`
- `mde-listing-quality-check`
- `mde-safe-whatsapp-reply`
- `mde-crm-update`

### ClawHub Plugins

ClawHub is the public skill/plugin registry. It is useful for discovery, but it is not a trusted app store. Install only after source review, dependency inspection, and least-privilege runtime setup. Any skill that requests credentials, scripts, browser automation, or broad filesystem access should be treated as production code.

### Browser Actions

OpenClaw can be paired with browser/control tools. For mdeai, browser actions are useful for operator-assisted tasks:

- checking public listing pages
- confirming visible availability
- collecting missing public details
- monitoring price changes

Do not use browser actions for unapproved scraping of MLS/closed portals, account logins, payments, or personal-document handling.

### API / Tool Execution

OpenClaw should call mdeai's own backend APIs, not write directly to Supabase with broad service-role keys. Expose narrow endpoints:

- `POST /ai/lead-intake`
- `POST /ai/showing-request`
- `POST /ai/message-log`
- `POST /ai/listing-quality-note`
- `POST /ai/followup-draft`

Each endpoint should validate input, enforce idempotency, and write canonical state to Supabase.

### Task Automation

OpenClaw supports scheduled/background task patterns. In mdeai, use this for:

- stale lead reminders
- renewal reminders
- listing freshness checks
- missing-photo task creation
- daily operator summaries

Prefer pg_cron/Trigger.dev for critical scheduled jobs, with OpenClaw as the action worker when a human-readable message or cross-tool task is needed.

### CRM Workflows

OpenClaw is well matched to CRM hygiene: extracting preferences, logging WhatsApp messages, moving stages, setting follow-up dates, and summarizing thread history. The risk is CRM corruption. Only allow it to write through constrained APIs and stage machines.

### Memory / Context

OpenClaw sessions and skills can carry context, but mdeai's durable memory should live in Supabase/Hermes. OpenClaw memory should be operational and disposable. Do not store legal IDs, payment data, lease documents, or full client dossiers in local OpenClaw memory unless retention and access controls are explicit.

### MCP / Tool Integration

OpenClaw's tool and plugin model can connect to external services. For mdeai, MCP/tool integration should be subordinate to Supabase APIs and Paperclip approvals. Avoid letting the agent discover and use arbitrary tools in production.

### Deployment / Setup

Official setup path:

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
openclaw gateway status
openclaw dashboard
```

Docs also mention install scripts, Docker/source setup, and remote/Tailscale patterns. For mdeai, use a dedicated VPS/container, a dedicated WhatsApp number, and separate gateways per trust boundary.

### Security Considerations

OpenClaw touches real channels and real tools. Treat it as a privileged execution surface:

- strict allowlists
- dedicated accounts
- no personal browser profiles
- sandbox non-main sessions
- no service-role Supabase keys in agent env
- no public gateway without auth/firewall
- no unreviewed ClawHub scripts
- no open inbound DMs for production
- run `openclaw security audit` regularly

## 5. Real Estate Lifecycle Use Cases

### A. Lead Generation

Use cases:

- monitor public listing sources where allowed
- monitor Facebook groups only where ToS and consent allow it
- extract owner/agent contact details from user-submitted or permitted public sources
- draft first-touch messages
- qualify inbound leads

Recommended for mdeai now:

- inbound lead capture and permitted public listing monitoring.

Defer:

- cold outbound, mass DM, unauthorized Facebook scraping, MLS scraping.

### B. Lead Qualification

OpenClaw can ask and normalize:

- renter/buyer role
- budget
- neighborhood
- property type
- bedrooms/bathrooms
- move-in date
- purchase timeline
- financing status
- pets
- furnished/unfurnished
- documents available
- urgency score

Write results to Supabase through a lead-intake endpoint.

### C. CRM Management

Use cases:

- create/update contacts
- stage lead: new, qualified, showing_requested, showing_scheduled, applied, lost
- schedule follow-ups
- trigger reminder tasks
- log message summaries

Guardrail: OpenClaw proposes state changes; backend validates allowed transitions.

### D. Search and Matching

OpenClaw can collect user intent and call Hermes/Supabase for matching:

- search listings
- compare properties
- collect missing criteria
- explain fit in user-friendly language
- flag possible scams for review

Hermes should rank; OpenClaw should deliver and coordinate.

### E. Showing Scheduling

Use cases:

- propose times
- check operator/landlord calendar
- contact landlord/agent
- create calendar invite
- send reminders
- collect post-showing feedback

Start with draft-only outbound messages and internal calendar suggestions. Auto-send only for approved templates.

### F. Offer / Purchase Workflow

Use cases:

- draft offer checklist
- collect required docs checklist
- coordinate inspection reminders
- track financing and appraisal deadlines
- remind buyer/seller/agent of dates

Do not automate offers, legal advice, contract signing, or money movement.

### G. Seller Workflow

Use cases:

- seller intake
- missing data/photo checklist
- pricing research task
- listing description draft
- marketing plan
- handoff to Postiz campaign

OpenClaw should collect and fill gaps; Hermes should reason/prioritize; Postiz should distribute; Paperclip should approve public claims.

### H. Post-Close / Post-Move

Use cases:

- move-in checklist
- maintenance request intake
- renewal reminder 30/60/90 days before lease end
- referral follow-up
- landlord satisfaction check

This is a good later-phase workflow because it is high-touch but lower legal risk than payments/contracts.

## 6. User-Based Use Cases

| User | Best OpenClaw role | Practical workflows |
|---|---|---|
| Renters | Intake and coordination | WhatsApp preference collection, showing request, reminders, document checklist. |
| Buyers | Concierge coordination | Collect budget/financing/timeline, deliver Hermes-ranked shortlist, schedule viewings. |
| Sellers | Intake assistant | Property data collection, photo checklist, draft listing copy, marketing handoff. |
| Landlords | Ops assistant | New lead notifications, showing coordination, follow-up drafts, renewal reminders. |
| Property managers | Workflow operator | Bulk listing checks, tenant messages, maintenance triage, lease renewal reminders. |
| Agents | CRM/admin assistant | Follow-up drafts, call notes, stage updates, showing coordination, campaign drafts. |
| Internal mdeai operators | Primary early user | Daily queue, stale leads, risky messages, missing listing data, operator summaries. |

## 7. OpenClaw Skills Review

| Skill | URL | What it does | mdeai fit | Quality / risk notes | Score |
|---|---|---|---|---|---:|
| Real Estate | https://clawhub.ai/ivangdavila/real-estate-skill | Broad decision guidance for buyers, sellers, landlords, tenants, investors, agents; includes role/jurisdiction/stage prompts and compliance disclaimers. | Good base skill for safe real-estate conversation structure. | Broad but sane. Good compliance reminders. Too generic for Medellin workflows. | 82 |
| Real Estate Agent | https://clawhub.ai/ivangdavila/real-estate-agent | Personal real-estate agent skill with client memory, tracked properties, saved searches, alerts, listing optimization. | Good inspiration for mdeai lead preference memory and alerts. | Local memory model is not production CRM. Needs Supabase rewrite. | 80 |
| Real Estate Intelligence / Camino | https://clawhub.ai/james-southendsolutions/camino-real-estate | Address/location evaluation using Camino API for schools, transit, groceries, parks, restaurants, walkability. | Useful for neighborhood fit and property detail pages if Camino covers Colombia. | Requires `CAMINO_API_KEY`; Colombia coverage needs verification. External API cost/privacy risk. | 72 |
| Real Estate Engine | https://clawhub.ai/1kalin/afrexai-real-estate-engine | Broad investment/operations system: deal sourcing, market analysis, calculators, stress testing, portfolio ops. | Useful for future investor/buyer purchase workflows. | Very broad; likely overkill for rentals MVP. Must verify formulas/local assumptions. | 70 |
| Real Estate Investing | https://clawhub.ai/ivangdavila/real-estate-investing | Investment underwriting, financing stress tests, diligence gates, local memory. | Good later for buyer/investor workflows and rental-yield analysis. | No external services by default; strong risk caveats. Not for renter flows. | 78 |
| Korean Real Estate Search | https://skills.sh/nomadamas/k-skill/real-estate-search | Korean MOLIT real transaction/rent data through proxy endpoints. | Not directly useful for Medellin. Useful as design reference for structured property-data tools. | Region-specific. Do not install for mdeai except as pattern reference. | 38 |
| Real Estate Expert | https://skills.sh/personamanagmentlayer/pcl/real-estate-expert | Broad PropTech/MLS/CRM/listing/showing system guidance, with code examples. | Useful as architecture reference. | Generic and US-centric; not an execution skill. | 55 |
| Real Estate Analyzer | https://skills.sh/travisjneuman/.claude/real-estate-analyzer | Listed skill but page says no SKILL.md available. | Do not use until content is available. | Needs verification; insufficient inspectable content. | 20 |
| Lease Abstraction Specialist | https://skills.sh/reggiechan74/vp-real-estate/lease-abstraction-specialist | Extracts critical lease terms, dates, rent, options, red flags. | Useful for lease-review summaries and renewal reminders. | Commercial-office/industrial biased; human/legal review required. | 76 |
| Rental Property | https://skills.sh/openaccountant/skills/rental-property | Rental-property financial metrics: NOI, cap rate, cash-on-cash, ROI, expenses. | Useful for landlord/investor dashboard later. | Accounting/tax scope; avoid licensed advice. Depends on Wilson tools for full workflow. | 64 |

Best skills to test first:

1. `real-estate-skill` for safe conversation routing.
2. `real-estate-agent` as a memory/alerts design reference.
3. `lease-abstraction-specialist` for document-summary structure, not legal conclusions.
4. `camino-real-estate` only if Colombia/Medellin coverage is verified.

## 8. Real-World Examples

### WhatsApp Renter Intake

```text
Renter WhatsApps mdeai number
OpenClaw receives message
OpenClaw asks budget/location/move-in/furnished/pets questions
OpenClaw calls mdeai lead-intake API
Supabase creates lead + CRM state
Hermes can rank matches
Human/operator approves outbound next step if needed
```

### Buyer Laureles Search

```text
Buyer: "Laureles apartment under $180k"
OpenClaw collects must-haves and financing status
Hermes ranks matching Supabase listings
OpenClaw presents shortlist
OpenClaw drafts showing request
Operator approves send
```

### Seller Property Intake

```text
Seller submits property
OpenClaw detects missing details/photos
OpenClaw asks follow-up questions
Supabase listing draft updated
Hermes drafts listing description
Paperclip approves public claims
Postiz schedules campaign
```

### Facebook Group Monitoring

```text
OpenClaw/browser monitors approved public sources
Extracts possible rental opportunities
Supabase stores candidate listing
Hermes assigns scam-risk score
Human reviews before publishing
```

Only do this where source terms permit monitoring.

### CRM Update After WhatsApp

```text
OpenClaw summarizes thread
Extracts budget, dates, objections, next action
Calls constrained CRM update endpoint
Supabase validates stage transition
Follow-up date created
```

### Listing Agent Showing Confirmation

```text
OpenClaw drafts email/WhatsApp to listing agent
Operator approves
OpenClaw sends message
Reply updates showing request
Calendar invite created after confirmation
```

### Lease Renewal Reminder

```text
pg_cron detects lease ending in 30 days
Paperclip/OpenClaw task created
OpenClaw drafts renewal reminder
Human approves if terms/pricing included
Message sent and logged
```

## 9. Setup Plan

### Step 1 - Install OpenClaw

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
openclaw gateway status
openclaw dashboard
```

Use Node 24 where possible. Use a dedicated OS user/container/VPS for mdeai automation.

### Step 2 - Configure Channels

Start with:

1. WebChat/dashboard for local testing.
2. Telegram for internal operator smoke tests.
3. WhatsApp dedicated number for real renter/landlord pilot.

### Step 3 - Configure WhatsApp

```bash
openclaw plugins install @openclaw/whatsapp
openclaw channels login --channel whatsapp --account rentals
openclaw gateway
```

Policy baseline:

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "allowlist",
      "allowFrom": ["+57..."],
      "groupPolicy": "allowlist",
      "groups": { "*": { "requireMention": true } },
      "textChunkLimit": 4000,
      "mediaMaxMb": 50
    }
  },
  "session": { "dmScope": "per-channel-peer" },
  "tools": {
    "profile": "messaging",
    "exec": { "security": "deny", "ask": "always" },
    "elevated": { "enabled": false }
  }
}
```

### Step 4 - Install/Test Real Estate Skills

Do not install every skill. Start in a sandbox workspace:

```bash
openclaw skills install real-estate-skill
openclaw skills install real-estate-agent
openclaw skills install real-estate-investing
```

Inspect all files before enabling scripts or credentials.

### Step 5 - Connect Supabase

Do not give OpenClaw `SUPABASE_SERVICE_ROLE_KEY` directly. Create narrow mdeai API endpoints with:

- auth token scoped to AI worker
- idempotency key
- row-level validation
- audit insert
- stage transition enforcement

### Step 6 - Connect CRM

If CRM is Supabase-native, avoid a separate CRM at first. If external CRM is added later, expose only controlled create/update endpoints. Avoid direct arbitrary CRM API writes from OpenClaw.

### Step 7 - Connect Calendar

Start with Google Calendar read/suggest only:

- read availability
- propose slots
- create tentative showing only after confirmation
- never include sensitive lockbox details in AI context unless necessary

### Step 8 - Connect Email

Start with draft-only mode:

- OpenClaw drafts email
- operator reviews
- deterministic service sends/logs

### Step 9 - Connect Postiz

Use OpenClaw only to prepare campaign tasks or call a backend worker after approval. Postiz should publish approved assets, not raw AI drafts.

### Step 10 - Connect Hermes

OpenClaw should pass normalized inputs to Hermes for:

- ranking
- lead summaries
- scam reasoning
- lease summaries
- buyer/renter preference memory

Hermes returns recommendations. OpenClaw executes only approved actions.

### Step 11 - Add Paperclip Later

Add Paperclip when OpenClaw can:

- send external messages
- publish campaigns
- create tasks for other agents
- trigger payment/refund-adjacent workflows
- spend meaningful model/API budget

### Step 12 - First Workflow: Renter Lead Intake

Minimum version:

1. Renter sends WhatsApp message.
2. OpenClaw asks up to 5 qualifying questions.
3. OpenClaw calls `/ai/lead-intake`.
4. Supabase creates/updates lead.
5. Operator sees lead in dashboard.
6. OpenClaw drafts a reply but does not auto-send non-template messages.

### Testing Checklist

- Gateway starts and dashboard opens.
- Telegram/WebChat test passes.
- WhatsApp QR pairing works with dedicated account.
- Unknown sender blocked or paired.
- Allowed sender can start renter intake.
- Supabase lead row created once with idempotency.
- Bad inputs rejected by backend.
- CRM stage transition validated.
- Message log created.
- Operator can disable automation quickly.
- `openclaw security audit --deep` run and issues resolved.

### Production Checklist

- dedicated number/account
- opt-in and unsubscribe handling
- rate limits
- message template policy
- no broad filesystem/shell tools
- no broad browser profile
- no service-role key in agent env
- Sentry/observability
- Supabase audit table
- Paperclip approvals for risky actions
- legal/compliance review for screening/fair housing
- backup/restore and credential rotation

## 10. Suggested Additional Tools

| Tool | Role with OpenClaw | Recommendation |
|---|---|---|
| Hermes | Reasoning, ranking, matching, memory | Use after listings/leads exist. |
| Paperclip | Approvals, budgets, audit, task control | Add before broad outbound automation. |
| Postiz | Social distribution and campaign scheduling | Use for listing/seller growth. |
| Supabase | Source of truth | Required; all canonical state lives here. |
| Infobip/Twilio | Official WhatsApp Business channels | Prefer for compliant production WhatsApp where possible. |
| Resend/SendGrid | Email sending | Use deterministic backend for sends. |
| Google Calendar | Showing scheduling | Use read/suggest first, create after confirmation. |
| Stripe | Payments/bookings | Deterministic backend only; no AI direct money movement. |
| Firecrawl/Apify | Scraping/enrichment | Use only where source terms allow. |
| Browserbase/Playwright | Controlled browser actions | Prefer for isolated browser automation. |
| Sentry | Errors | Required for production. |
| PostHog | Funnel analytics | Track lead-to-showing-to-booking conversion. |
| Cloudflare Turnstile | Anti-bot | Public forms. |
| FingerprintJS | Fraud/device risk | Fake leads, abuse, payment risk. |

## 11. Risk Audit

| Risk | Severity | Finding | Mitigation |
|---|---:|---|---|
| Account ban risk | Critical | WhatsApp Web automation can violate platform expectations and trigger bans. | Dedicated number, opt-in, low volume, consider Infobip/Twilio for production. |
| WhatsApp spam | Critical | Automated follow-up can become spam fast. | Templates, suppression list, consent, rate limits, Paperclip approval. |
| Scraping/TOS | High | Facebook/MLS/listing portals may forbid scraping. | Use allowed sources, partnerships, user-submitted listings, legal review. |
| Skill security | High | Skills can include scripts, env vars, network calls. | Review code, sandbox, limited credentials, install only needed skills. |
| Malicious plugin/skill | High | Public registries are supply-chain risk. | Pin versions, inspect archives, no auto-update in production. |
| Hallucinated actions | High | Agent may invent facts, availability, pricing, or legal claims. | Ground in Supabase, validate outputs, human approval for public/high-risk messages. |
| Privacy/documents | Critical | Real-estate docs include IDs, leases, financial info. | Private storage, signed URLs, no raw docs in prompts unless necessary. |
| CRM corruption | High | Bad stage updates or duplicate contacts damage ops. | Constrained APIs, idempotency, state machine validation. |
| Payment/booking risk | Critical | AI should not move money or promise refunds/deposits. | Deterministic Stripe backend and human approval. |
| Over-automation | High | Too much too early creates support and legal debt. | Start one workflow, draft-only, expand after proof. |
| Screening compliance | Critical | Buyer/renter screening can create discrimination/fair-housing risk. | Rule-based criteria, legal review, no protected-class reasoning. |

## 12. Scoring for mdeai

| Dimension | Score | Interpretation |
|---|---:|---|
| Product fit | 86/100 | Very strong as WhatsApp/action layer for real-estate operations. |
| Setup difficulty | 58/100 | Easy local start, harder secure production with WhatsApp, skills, APIs, and monitoring. Higher score means easier. |
| Production readiness | 62/100 | Official docs are mature, but mdeai needs security, provider, and workflow validation. |
| Risk level | 84/100 | High because it can message, scrape, browse, and execute. Higher score means riskier. |
| Fastest revenue impact | 72/100 | Strong if used for lead response and showing coordination after listings exist. |
| Long-term moat | 88/100 | Strong if mdeai builds a safe WhatsApp-first execution layer around verified inventory and CRM state. |

## 13. Final Recommendation

Should mdeai use OpenClaw? Yes. It is the right execution layer for WhatsApp-first real-estate operations, but only behind constrained APIs, Supabase state, and approval gates.

Use order:

```text
1. Supabase rentals + lead CRM
2. Postiz for approved listing promotion
3. Hermes for ranking / summaries / memory
4. OpenClaw for one approved execution workflow
5. Paperclip before broad automation, risky outbound, or payments
```

Exact first workflow:

> WhatsApp renter intake -> OpenClaw asks qualifying questions -> Supabase lead created -> Hermes ranks matching listings -> OpenClaw drafts next message -> human/operator approves send.

Skills worth testing:

- `real-estate-skill`
- `real-estate-agent`
- `real-estate-investing`
- `lease-abstraction-specialist`
- `camino-real-estate` only after Colombia coverage verification

Do not automate yet:

- cold outbound lead generation
- Facebook/MLS scraping without permission
- autonomous WhatsApp broadcasts
- payment/refund/deposit actions
- legal/lease advice delivery
- renter/buyer screening decisions
- final listing publish from unreviewed AI copy

Simplest MVP:

```text
One OpenClaw gateway
One dedicated WhatsApp number
One mdeai renter-intake skill
One constrained Supabase API endpoint
One operator dashboard queue
Draft-only outbound replies
No scraping, no payments, no legal docs, no autonomous publishing
```

Bottom line: OpenClaw can be a real advantage for mdeai because Medellin real estate is WhatsApp-heavy and follow-up-heavy. The win is not "autonomous agents everywhere." The win is one reliable execution worker that captures leads, keeps CRM state clean, drafts follow-ups, and schedules showings without creating legal, spam, or data-loss incidents.

## Source List

### Official OpenClaw

- https://docs.openclaw.ai/
- https://docs.openclaw.ai/start/getting-started
- https://docs.openclaw.ai/channels
- https://docs.openclaw.ai/channels/whatsapp
- https://docs.openclaw.ai/tools/skills
- https://docs.openclaw.ai/tools/clawhub
- https://docs.openclaw.ai/gateway/configuration-reference
- https://docs.openclaw.ai/gateway/security
- https://github.com/openclaw/openclaw
- https://github.com/openclaw/clawhub
- https://clawhub.ai/plugins

### ClawHub Real-Estate Skills

- https://clawhub.ai/ivangdavila/real-estate-skill
- https://clawhub.ai/james-southendsolutions/camino-real-estate
- https://clawhub.ai/1kalin/afrexai-real-estate-engine
- https://clawhub.ai/ivangdavila/real-estate-agent
- https://clawhub.ai/ivangdavila/real-estate-investing

### Skills.sh Real-Estate Skills

- https://skills.sh/?q=real+estate
- https://skills.sh/nomadamas/k-skill/real-estate-search
- https://skills.sh/personamanagmentlayer/pcl/real-estate-expert
- https://skills.sh/travisjneuman/.claude/real-estate-analyzer
- https://skills.sh/reggiechan74/vp-real-estate/lease-abstraction-specialist
- https://skills.sh/openaccountant/skills/rental-property

### Community / Practical Real-Estate Sources

- https://www.reddit.com/r/dubairealestate/comments/1r3lwar/anybody_using_openclaw_in_realestate_workflows/
- https://www.reddit.com/r/AI_Agents/comments/1rpi3tf/i_spent_5_days_going_deep_on_openclaw_trying_to/
- https://www.reddit.com/r/RealEstateTechnology/comments/1s55fq2/anyone_actually_using_openclaw_for_real_estate/
- https://www.reinventing.ai/openclaw-for-real-estate-agents
- https://blink.new/blog/openclaw-for-real-estate-agents-automation-2026
- https://www.tryopenclaw.ai/industries/real-estate-agents/
- https://www.upwork.com/services/product/development-it-openclaw-setup-ai-automation-for-real-estate-teams-2025851520056810334
- https://www.tidalsoftware.ai/blog/openclaw-for-real-estate-agents
- https://www.ampere.sh/blog/openclaw-for-real-estate-agents
- https://launchclaw.app/for/real-estate-agents
- https://managemyclaw.com/ai-for-real-estate-agents/
- https://getaiform.com/blog/openclaw-real-estate-ai-lead-qualification-dashform-2026

### Additional Context / Risk Sources

- https://launchmyopenclaw.com/openclaw-clawhub-guide
- https://launchmyopenclaw.com/openclaw-skills-guide
- https://openclawconsult.com/lab/openclaw-real-estate-us
- https://www.clawctl.com/usecases/real-estate/showing-scheduling
- https://www.tryopenclaw.ai/blog/openclaw-crm-integration/
- https://clawbots.com/guides/openclaw-for-real-estate.html
- https://clawport.io/blog/openclaw-real-estate-agents
- https://www.techradar.com/pro/what-is-openclaw
- https://www.techradar.com/pro/how-to-safely-experiment-with-openclaw
- https://www.techradar.com/pro/5-popular-openclaw-integrations-that-will-level-up-your-productivity
- https://arxiv.org/abs/2603.00902
- https://arxiv.org/abs/2603.24414
- https://arxiv.org/abs/2604.08377
