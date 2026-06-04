# Hermes Agent Real Estate Intelligence Report - mdeai / ILM

Date: 2026-05-07

Scope: Hermes Agent as the reasoning, memory, ranking, and orchestration layer for a Medellin-focused, rentals-first real-estate marketplace covering rentals, buyers, sellers, landlords, property managers, agents, lead generation, lifecycle sales, CRM intelligence, investment analysis, lease review, property matching, fraud/scam detection, recommendations, and workflow orchestration.

Reviewed local prior report: `/home/sk/mde/tasks/real-estate/104.1-hermes-real-estate.md`.

Recommended architecture:

```text
Supabase = source of truth
Hermes = reasoning / ranking / memory
OpenClaw = execution / actions / WhatsApp
Postiz = social growth / listing promotion
Paperclip = governance / approvals / budgets / audit
```

## 1. Executive Summary

Hermes Agent is an open-source, self-improving agent runtime from Nous Research. Official docs describe it as an autonomous agent with persistent memory, skills, tool use, MCP support, web/browser tools, cron jobs, delegation, goals, kanban, messaging gateways, API server support, and multi-provider model routing.

The problem it solves for mdeai is not execution. It solves judgment and continuity:

- remembering renter/buyer/landlord preferences across sessions
- ranking properties against messy human preferences
- summarizing conversations and lease documents
- prioritizing stale leads
- identifying likely scams or weak listings
- creating reusable playbooks from repeated operations
- deciding when to delegate execution to OpenClaw, publishing to Postiz, or approval to Paperclip

Real estate is a strong fit because property search is preference-heavy, lead lifecycles are long, and decisions depend on accumulated context: budget, neighborhood taste, move-in date, financing status, trust signals, past follow-ups, listing quality, and risk.

Recommendation: mdeai should use Hermes soon, but narrowly. It should come after the basic Supabase rentals data/lead model exists and before broad OpenClaw automation. Start with read-only ranking and lead intelligence, not autonomous actions.

Best first Hermes workflow:

> Given a renter lead and verified Supabase listings, rank the top 5 matches with reasons, missing data, risk flags, and the recommended next question.

Do not use Hermes as canonical memory, CRM, fraud authority, legal advisor, payment actor, or autonomous screening decision-maker.

## 2. Source Quality Notes

| Source type | Confidence | Notes |
|---|---:|---|
| Official Hermes docs | High | Best source for features, setup, memory, skills, MCP, cron, API server, WhatsApp/email, providers. |
| NousResearch GitHub | High | Confirms active repo, MIT license, architecture surface, Hermes function-calling heritage, adapter repos. |
| Hermes Paperclip adapter | Medium-high | Confirms Paperclip-managed Hermes agent path. Exact production maturity needs version-specific smoke test. |
| Secondary tutorials | Medium-low | Useful for practical use cases, but mostly generic business workflows and promotion. |
| Awesome lists/blogs | Low-medium | Useful for ecosystem discovery; not proof of production readiness. |
| Prior local report | Medium | Directionally right but too optimistic on fastest revenue impact and production readiness. |

## 3. Verified Facts vs Assumptions

### Verified Facts

- Hermes has persistent memory stored under `~/.hermes/memories/`, plus session search and external memory provider support.
- Hermes skills are `SKILL.md`-based documents under `~/.hermes/skills/`, support progressive disclosure, and can be installed from official sources, skills.sh, GitHub, ClawHub, URLs, and other registries.
- Hermes supports MCP stdio and HTTP servers, tool filtering, dynamic tool refresh, and can also expose Hermes messaging as an MCP server.
- Hermes supports subagent delegation, with up to 3 concurrent subagents by default; delegation is synchronous and not a durable queue.
- Hermes supports cron jobs through the gateway daemon, including edit, pause, resume, run, remove, and status flows.
- Hermes supports goals and a judge loop with a turn budget.
- Hermes supports kanban/multi-agent board workflows.
- Hermes supports browser automation, web search/extract/crawl, and multiple web providers including Firecrawl, SearXNG, Tavily, Exa, and Parallel.
- Hermes exposes an OpenAI-compatible API server with Chat Completions, Responses, Runs, Jobs, health checks, bearer auth, and SSE progress.
- Hermes WhatsApp uses a Baileys/WhatsApp Web bridge, not the official WhatsApp Business API, and docs warn about ban risk.
- Hermes supports email messaging and many gateway platforms.
- Hermes supports many providers/models, including Nous Portal, OpenRouter, Anthropic, OpenAI, Z.AI, Kimi, MiniMax, Qwen/DashScope, Hugging Face, Bedrock, DeepSeek, Vercel AI Gateway, and custom OpenAI-compatible endpoints.

### Assumptions For mdeai

- Hermes can rank and reason over real-estate data once mdeai exposes clean Supabase read APIs or MCP tools.
- Hermes can store useful user preferences, but canonical lead/listing/customer facts must remain in Supabase.
- Hermes should make recommendations and drafts; deterministic backend services should commit CRM/payment/listing state.
- Hermes can delegate to OpenClaw/Postiz/Paperclip only through constrained tool/API surfaces.

### Needs Verification

- Performance and cost of Hermes ranking on real mdeai listing/lead data.
- Whether built-in or external memory is sufficient for multi-tenant real-estate memory isolation.
- Whether Hermes WhatsApp bridge is appropriate for production in Colombia vs Twilio/Infobip/OpenClaw.
- Exact Hermes-Paperclip adapter compatibility with installed Paperclip version.
- Whether any public real-estate skills are high-quality enough to install directly.
- Accuracy of investment, ROI, fraud, and lease-risk scoring on Medellin-specific data.

## 4. Core Features

### Memory

Hermes memory is useful for durable preference context: preferred neighborhoods, budget bands, commute style, pet/furniture requirements, past objections, and landlord/property notes. Official docs distinguish small curated memory from broader session search. This is valuable, but mdeai should not rely on Hermes memory as the system of record.

Recommended use:

- save stable user preferences and workflow conventions
- retrieve past conversations for summaries
- mirror important canonical facts from Supabase into prompt context on demand

Avoid:

- storing IDs, lease docs, payment data, or final CRM state only in Hermes memory

### Skills

Hermes skills are reusable playbooks. For mdeai they should encode repeatable judgment workflows:

- rental ranking
- renter qualification
- buyer qualification
- lease abstraction
- investment underwriting
- scam risk review
- listing quality review
- follow-up prioritization

Keep skills narrow and auditable. Do not create one giant "real estate brain" skill.

### MCP Support

MCP is the right path for safe data access. mdeai should expose a narrow MCP/API surface:

- read verified listings
- read lead summary
- read CRM history
- write draft recommendation
- create review task

Do not expose direct SQL writes, service-role Supabase keys, or payment actions.

### Delegation

Delegation helps with parallel research and analysis:

- one subagent compares neighborhoods
- one checks listing anomalies
- one summarizes lease terms

But Hermes delegation is synchronous, not a durable production queue. Use Trigger.dev, pg_cron, or Paperclip for durable orchestration.

### Tool Gateway

Nous Tool Gateway can route web search, extraction, image generation, TTS, and browser automation through Nous-managed infrastructure. This reduces setup friction but introduces subscription/vendor dependency. For mdeai, use it for early research and analysis; use direct providers for production cost/control if needed.

### Goals

Goals are useful for long-running analytical tasks, such as "rank all stale leads and produce a follow-up plan." They should not be used to chase customer-facing outcomes indefinitely without stop conditions.

### Kanban

Hermes kanban can organize AI workstreams, but mdeai should not duplicate its actual product/task tracker. Use kanban for agent research/planning work, not canonical CRM pipeline state.

### Cron Jobs

Good use cases:

- weekly market summary
- daily stale-lead prioritization
- renewal reminder research
- listing-quality drift checks

Critical scheduling and retries should still live in pg_cron/Trigger.dev, with Hermes as the analyst.

### Browser Support

Browser automation is useful for research and verification. It is risky for scraping, login-gated content, financial actions, and undocumented workflows. Prefer Firecrawl/Apify/source APIs for repeatable extraction.

### Web Search

Hermes can use Firecrawl, SearXNG, Tavily, Exa, Parallel, or the Nous Tool Gateway. For real estate, web search supports:

- neighborhood research
- market comparables
- seller/buyer education
- source-backed listing checks

Use trusted source lists. Open web search alone is not enough for pricing or legal decisions.

### Plugins

Hermes plugins extend providers, context, memory, and integrations. This is powerful but increases attack surface. For mdeai, install only production-needed plugins and pin versions.

### Context References

Context references let Hermes inject files, folders, URLs, diffs, and line ranges. Useful for analyst/operator work, but production app calls should pass structured JSON rather than arbitrary local file context.

### API / Server Support

The API server is one of the best integration points for mdeai. It exposes OpenAI-compatible endpoints plus runs/jobs APIs. Keep it localhost/private by default, use bearer auth, narrow CORS, and never expose full terminal-capable Hermes to the public internet.

### WhatsApp / Email Support

Hermes supports WhatsApp and email messaging. For mdeai, Hermes should not be the primary WhatsApp execution layer if OpenClaw is already selected for channel actions. Use Hermes WhatsApp only for internal/operator testing or small sandbox workflows. Production WhatsApp should be handled by OpenClaw or official providers, with Hermes as the reasoning layer.

### Self-Improving / Self-Evolution

Hermes can create/update skills from experience; Nous also has a self-evolution repo focused on optimizing skills/prompts/code with DSPy/GEPA. Treat this as promising but controlled. In production, self-created skills should go through review before affecting customer workflows.

### Provider / Model Routing

Hermes supports many providers and OpenRouter routing controls. mdeai should use:

- strong model for final ranking/reasoning
- cheaper model for classification and lead summaries
- explicit provider allow/deny policies for privacy
- budget monitoring via Paperclip/provider dashboards

## 5. Real Estate Lifecycle Use Cases

### A. Lead Generation

Hermes can:

- enrich inbound leads from structured data
- classify renter vs buyer vs seller vs landlord intent
- score opportunity quality
- prioritize high-value leads
- identify missing context before handoff

Do not use Hermes to cold-contact leads. Hermes should score and recommend; OpenClaw or a human executes approved outreach.

### B. Lead Qualification

Hermes can extract:

- budget
- move-in date
- neighborhoods
- property type
- financing status
- urgency
- must-haves
- objections
- document readiness
- close likelihood

Use deterministic schemas and confidence scores. Low confidence should trigger the next question, not a guessed CRM state.

### C. Search And Matching

Best-fit Hermes use:

- rental ranking
- buyer-property matching
- neighborhood analysis
- remote-work fit
- WiFi suitability if data exists
- investment score if rents/costs are reliable
- tradeoff explanation

Hermes should rank Supabase listings. It should not invent unavailable inventory.

### D. Seller Workflow

Hermes can:

- analyze listing completeness
- draft pricing-research questions
- identify likely target buyer/renter segment
- draft marketing strategy
- flag weak photos/descriptions
- recommend Postiz campaign angles

Final pricing and public listing claims require human/operator approval.

### E. Purchase Workflow

Hermes can:

- maintain buyer checklist
- explain financing steps
- track transaction milestones
- summarize inspection issues
- flag contract deadlines
- produce buyer/agent next-action list

It should not give legal/financial advice as authority or submit offers without professional review.

### F. Lease Workflow

Hermes is a strong lease abstraction assistant:

- extract rent/deposit/dates/renewal/termination clauses
- explain confusing clauses
- detect missing terms
- flag unusual obligations
- produce a human-review checklist

It should never replace local legal review.

### G. CRM Intelligence

High-value mdeai workflows:

- stale lead detection
- follow-up prioritization
- lead stage recommendations
- churn/loss-risk signals
- "next best question"
- operator daily queue

Hermes should output recommendations and confidence; Supabase backend validates and stores state transitions.

### H. Fraud / Scam Detection

Hermes can assist with:

- suspicious pricing
- inconsistent listing details
- duplicate descriptions
- mismatched neighborhoods
- missing ownership/landlord data
- risky payment language
- trust score explanation

Duplicate image detection needs vision/image tooling and source images. Scam score should be advisory, with human review for publish/block decisions.

## 6. User-Based Use Cases

| User | Best Hermes role | Practical workflows |
|---|---|---|
| Renters | Recommendation brain | Remember preferences, rank rentals, explain tradeoffs, suggest next question. |
| Buyers | Property analyst | Match properties, compare financing readiness, explain neighborhood/ROI tradeoffs. |
| Sellers | Listing strategist | Analyze listing quality, draft positioning, recommend buyer segment and campaign. |
| Landlords | Lead-quality analyst | Score renters, summarize lead threads, suggest follow-up timing. |
| Property managers | Ops intelligence | Renewal lists, maintenance triage summaries, portfolio/listing drift analysis. |
| Real estate agents | Copilot | Lead prioritization, property comparison, follow-up prep, market research. |
| Investors | Underwriting assistant | ROI assumptions, long-term vs short-term rental comparison, risk flags. |
| Internal mdeai operators | Primary early user | Daily lead queue, risk review, stale leads, matching quality, market reports. |

## 7. Real-World Examples

### Laureles Rental Match

```text
User asks: "Find a Laureles apartment under $1,500"
Supabase provides verified listings
Hermes ranks by budget, location, furnished status, availability, remote-work fit
Hermes returns top 5 with reasons and missing data
OpenClaw drafts next WhatsApp question or showing request
```

### Remembered Buyer Preferences

```text
Buyer previously preferred quiet streets, elevator, low HOA, near metro
Hermes recalls stable preferences
New listing arrives
Hermes compares fit and explains why it is or is not worth sending
```

### Renter Close Likelihood

```text
Lead has budget, move-in date, documents, and replied within 10 minutes
Hermes scores close likelihood high
Supabase queues lead for operator follow-up
OpenClaw sends approved next-step message
```

### Medellin Investment Opportunity

```text
Hermes compares asking price, expected rent, neighborhood trend, liquidity, fees
Outputs investment memo with assumptions and confidence
Paperclip requires review before sending to investor
```

### Lease Risk Summary

```text
Lease uploaded to private storage
Backend extracts text safely
Hermes abstracts clauses and risk flags
Human reviews before renter receives summary
```

### Stale CRM Prioritization

```text
Cron job identifies 84 stale leads
Hermes groups by likelihood and next action
Operator sees top 15 today
OpenClaw drafts approved follow-ups
```

### Airbnb vs Long-Term ROI

```text
Hermes compares monthly rent, occupancy assumptions, platform fees, cleaning, utilities, seasonality
Outputs scenario table
Flags assumptions that need verified local data
```

### Delegate Showing Scheduling

```text
Hermes decides lead is qualified and listing is good fit
Hermes creates showing request payload
OpenClaw contacts landlord/agent after approval
Supabase stores showing state
```

### Postiz Campaign Handoff

```text
Hermes drafts campaign angle and audience
Paperclip approves public claims
Postiz schedules the approved campaign
Supabase stores campaign IDs and attribution
```

### Paperclip Escalation

```text
Hermes detects refund/legal/identity/payment language
Hermes creates escalation task
Paperclip requires approval
OpenClaw does not send until approved
```

## 8. Recommended Skills For Real Estate

These are recommended skills to build or source. Public skills can be inspected via Hermes Skills Hub, skills.sh, GitHub, or ClawHub, but mdeai should own the production versions.

| Skill | URL | Purpose | Real estate value | Risk notes | Score |
|---|---|---|---|---|---:|
| mde-rental-ranking | https://hermes-agent.nousresearch.com/docs/user-guide/features/skills | Rank verified rental listings against renter preferences. | Core MVP matching layer. | Requires clean listing data and eval set. | 95 |
| mde-lead-qualification | https://hermes-agent.nousresearch.com/docs/user-guide/features/memory | Extract budget, urgency, documents, intent, next question. | Direct lead-to-showing impact. | Bias and hallucinated stage risk. | 94 |
| mde-crm-intelligence | https://hermes-agent.nousresearch.com/docs/user-guide/features/cron | Daily stale-lead and follow-up prioritization. | High operator ROI. | Needs deterministic CRM state machine. | 92 |
| mde-lease-abstraction | https://skills.sh/reggiechan74/vp-real-estate/lease-abstraction-specialist | Extract lease terms and risk checklist. | Useful for renter/landlord trust. | Legal review required; do not automate advice. | 86 |
| mde-investment-analysis | https://skills.sh/openaccountant/skills/rental-property | Calculate rental-property metrics and assumptions. | Good buyer/investor expansion. | Data quality and financial advice risk. | 82 |
| mde-neighborhood-intelligence | https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search | Research neighborhood fit, amenities, commute, safety caveats. | Strong recommendation quality. | Source drift and subjective claims. | 84 |
| mde-fraud-scam-review | https://hermes-agent.nousresearch.com/docs/user-guide/features/browser | Detect suspicious pricing/details/images/language. | Important trust layer. | False positives; needs vision/data sources. | 88 |
| mde-seller-onboarding | https://hermes-agent.nousresearch.com/docs/user-guide/features/goals | Guide seller through listing details, pricing questions, marketing handoff. | Good for supply acquisition. | Public claims need approval. | 80 |
| mde-market-report | https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search | Weekly Medellin market summary from trusted sources. | Good content and operator insight. | Must cite sources and avoid thin web claims. | 78 |
| mde-property-comparison | https://hermes-agent.nousresearch.com/docs/reference/tools-reference | Side-by-side tradeoff analysis for shortlist. | Very useful for buyers/renters. | Can over-weight noisy attributes. | 90 |

Highest-value first skills:

1. `mde-rental-ranking`
2. `mde-lead-qualification`
3. `mde-crm-intelligence`
4. `mde-fraud-scam-review`
5. `mde-lease-abstraction`

## 9. Workflows And Automations

### Rental Recommendation Engine

Supabase listing inventory + lead profile -> Hermes ranking -> explanation -> operator/lead view. Use an offline eval set before public launch.

### Buyer Lifecycle Orchestration

Hermes tracks buyer readiness, preferences, financing questions, and next required action. OpenClaw schedules viewings only after approval.

### Seller Onboarding

Hermes collects missing listing data, photo checklist, positioning, and target buyer/renter profile. Postiz gets only approved campaign assets.

### Lead Prioritization

Daily job sends Hermes the open leads. Hermes groups by urgency/fit/close-likelihood and returns an operator queue.

### Investor Opportunity Detection

Hermes compares verified listing price, expected rent, costs, neighborhood data, and assumptions. Human review required.

### Renewal Reminder Automation

pg_cron detects upcoming lease dates. Hermes drafts renewal strategy and next message. OpenClaw sends approved message.

### CRM Intelligence

Hermes finds stalled stages, missing data, contradictory preferences, and next best action.

### Market Report Generation

Hermes reads trusted sources weekly and drafts a market update. Postiz distributes only after human review.

### Property Comparison

Hermes creates side-by-side comparison with fit score, tradeoffs, questions to ask, and risks.

### AI Concierge

Hermes chooses the next best recommendation or clarification question; OpenClaw delivers through WhatsApp; Supabase logs all canonical facts.

## 10. Setup Plan

### Step 1 - Install Hermes

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc
hermes setup
hermes model
hermes
```

Verify plain chat before adding gateway, cron, skills, or MCP.

### Step 2 - Configure Models / Providers

Start with one reliable provider:

```bash
hermes model
```

Production defaults:

- strong model for ranking/lease summaries
- cheaper model for lead classification
- provider allowlist for privacy
- minimum 64K context model
- model/provider cost monitored externally

### Step 3 - Configure Memory

```bash
hermes memory setup
hermes memory status
```

Start with built-in memory. Add Supermemory/Honcho/Mem0 only after multi-tenant isolation requirements are clear.

### Step 4 - Connect Supabase

Preferred:

- mdeai backend API or MCP server
- read-only listing/lead tools
- write-only draft/recommendation tools
- no direct service-role key in Hermes

Expose structured schemas, not raw database access.

### Step 5 - Connect OpenClaw

Hermes should hand off execution:

- send approved WhatsApp message
- schedule showing
- collect missing data
- update CRM through backend

OpenClaw executes; Hermes reasons.

### Step 6 - Connect Postiz

Hermes drafts campaign strategy and copy. Postiz schedules only approved content. Store campaign IDs and attribution in Supabase.

### Step 7 - Connect Paperclip

Use Paperclip for:

- high-risk WhatsApp
- public campaign approval
- lease/legal/payment escalations
- budget control
- audit trail

### Step 8 - Configure MCP

Recommended MCP servers/tools:

- mdeai Supabase read API
- Postiz campaign API wrapper
- Paperclip approval/task API
- optional Firecrawl/Apify research tools

Filter tools aggressively.

### Step 9 - Configure Web Search

Use:

- Firecrawl for extract/crawl
- SearXNG for private/free search
- Tavily/Exa for research
- trusted source lists for market reports

### Step 10 - Configure Skills

Create local skills first:

```bash
mkdir -p ~/.hermes/skills/real-estate/mde-rental-ranking
mkdir -p ~/.hermes/skills/real-estate/mde-lead-qualification
```

Audit any installed community skill:

```bash
hermes skills inspect <skill>
hermes skills audit
```

### Step 11 - Configure Cron Jobs

Start with non-customer-facing jobs:

```bash
hermes cron list
hermes cron status
```

Good first job:

```text
Every weekday at 8 AM, analyze open rental leads from the mdeai lead export and produce a top-15 follow-up queue. Do not send messages.
```

### Step 12 - Configure Goals / Kanban

Use goals/kanban for internal analysis projects, not production CRM state.

### First Recommended Workflow

```text
Supabase lead + verified listings
-> Hermes ranks top matches and next question
-> result stored as recommendation_draft
-> operator reviews in dashboard
-> OpenClaw drafts WhatsApp response
-> Paperclip approval if risky
```

### Testing Checklist

- install completes and `hermes doctor` passes
- model provider works
- memory add/replace/remove verified
- session resume works
- mdeai listing tool returns only public/safe fields
- Hermes ranking output validates against schema
- no hallucinated listing IDs allowed
- costs measured for 20 sample rankings
- fraud/lease outputs include confidence and "human review required"
- OpenClaw/Postiz/Paperclip handoffs use idempotency keys

### Production Checklist

- private network or localhost API
- bearer auth and narrow CORS
- no terminal/file tools in public-facing API profile
- profile isolation by environment/tenant if needed
- Supabase remains source of truth
- structured outputs validated by backend
- Sentry/PostHog traces
- Paperclip approval for risky workflows
- provider budget caps
- memory retention policy
- legal review for lease/screening/finance flows

## 11. Suggested Additional Tools

| Tool | Role with Hermes | Recommendation |
|---|---|---|
| OpenClaw | Execution, WhatsApp, browser/channel actions | Use after Hermes can recommend safely. |
| Postiz | Listing promotion and social distribution | Use for approved seller/listing campaigns. |
| Paperclip | Approvals, budgets, audit | Add before broad side-effect automation. |
| Supabase | Source of truth | Required. |
| pgvector | Semantic retrieval over listings/leads/docs | Useful once data volume grows. |
| Tavily | Web search/extract | Good research backend. |
| Exa | Semantic web search | Good for market/neighborhood research. |
| Trigger.dev | Durable workflows/retries | Use for production jobs. |
| Firecrawl | Web extract/crawl | Good for source-backed research and permitted crawling. |
| Apify | Scraping actors | Use only with source/TOS review. |
| Browserbase | Isolated browser automation | Safer than local browser state. |
| PostHog | Product/funnel analytics | Required for lead-to-revenue learning. |
| Sentry | Error monitoring | Required before production. |
| Stripe | Payments | Deterministic backend only. |
| FingerprintJS | Fraud/device risk | Useful for fake leads/payment abuse. |
| Cloudflare Turnstile | Anti-bot | Use on public forms. |

## 12. Risk Audit

| Risk | Severity | Finding | Mitigation |
|---|---:|---|---|
| Over-engineering | High | Hermes can tempt the team to move business logic out of Supabase. | Keep Hermes as recommendation layer. |
| Hallucinated recommendations | High | It may invent fit, availability, or pricing rationale. | Validate listing IDs/facts against Supabase. |
| Autonomous decision risk | Critical | It should not approve legal, financial, screening, or payment decisions. | Paperclip/human approvals and deterministic backend. |
| Memory corruption | High | Bad facts can persist and affect future ranking. | Memory review, expiry, source tags, Supabase as truth. |
| Bad data source risk | High | Web market data may be stale or unreliable. | Trusted sources, citations, confidence, human review. |
| Privacy/document risk | Critical | Leases, IDs, financing docs are sensitive. | Private storage, minimal extraction, retention policy. |
| Lead-scoring bias | Critical | Qualification can create discriminatory outcomes. | Avoid protected-class inference; audit scoring rules. |
| Legal/compliance risk | Critical | Lease/finance advice may be regulated. | "Not legal advice", professional review, jurisdiction checks. |
| Cost escalation | High | Large context + web/browser/delegation can be expensive. | model routing, caps, Paperclip/provider budgets. |
| Model routing risk | Medium | Cheapest/fallback providers may have weaker privacy/quality. | provider allow/deny list and eval set. |
| Tool exposure | Critical | API server can expose terminal/file/web tools. | private bind, auth, profiles, restricted toolsets. |

## 13. Comparison

| System | Reasoning | Memory | Automation | Operations | Production readiness | Real estate fit |
|---|---|---|---|---|---|---|
| Hermes | Strong multi-step reasoning and ranking. | Strong persistent memory plus session search/providers. | Strong analysis automation; moderate execution. | Good analyst/orchestrator. | Medium-high if private and constrained. | Best intelligence layer. |
| OpenClaw | Lower reasoning; stronger action routing. | Operational/session context. | Strong WhatsApp/browser/channel execution. | Good execution worker. | Medium with guardrails. | Best action/channel layer. |
| Paperclip | Governance reasoning, not domain analysis. | Audit/task memory. | Controls automation. | Strong approvals/budgets/tasks. | Medium-high for internal ops. | Best control layer. |
| Traditional CRM | Weak AI reasoning. | Strong records. | Rules/workflows. | Mature pipeline ops. | High. | Necessary system of record or CRM UI. |
| LangChain/CrewAI | Flexible framework. | Whatever you build. | Strong if engineered well. | Requires more custom infra. | Varies widely. | Good for custom systems, slower to ship. |

Practical read: Hermes should not replace a CRM or Supabase. It should sit above the data model as the intelligence layer and below approval/execution systems.

## 14. Scoring for mdeai

| Dimension | Score | Interpretation |
|---|---:|---|
| Product fit | 90/100 | Excellent for ranking, memory, lead intelligence, lease summaries, and CRM prioritization. |
| Setup difficulty | 65/100 | Local setup is straightforward; safe production integration is harder. Higher score means easier. |
| Production readiness | 70/100 | Strong docs/features, but mdeai needs evals, privacy controls, and constrained tools. |
| Risk level | 74/100 | High if allowed to decide or act autonomously. Higher score means riskier. |
| Fastest revenue impact | 72/100 | Good via better lead matching/follow-up, but not as immediate as listing/contact loop or Postiz campaigns. |
| Long-term moat | 92/100 | Strong if mdeai builds proprietary listing/lead memory, matching quality, and trust scoring. |

## 15. Final Recommendation

Should mdeai use Hermes? Yes. It is the right reasoning, ranking, and memory layer for mdeai.

Should Hermes come before or after OpenClaw? Before broad OpenClaw automation. Hermes should first prove it can rank listings and prioritize leads safely. OpenClaw should execute only once Hermes recommendations are validated and the action path is constrained.

Recommended order:

```text
1. Supabase rentals + lead CRM
2. Hermes read-only ranking and lead intelligence
3. Postiz for approved listing promotion
4. OpenClaw for one narrow execution workflow
5. Paperclip before risky side effects and budgeted automation
```

Exact first workflow:

> Rental recommendation draft: Supabase lead profile + verified listings -> Hermes top 5 matches with explanations, missing info, risk flags, confidence, and next question -> operator review -> OpenClaw drafts WhatsApp reply.

Highest-value skills:

- `mde-rental-ranking`
- `mde-lead-qualification`
- `mde-crm-intelligence`
- `mde-fraud-scam-review`
- `mde-lease-abstraction`

Do not automate yet:

- final renter/buyer screening decisions
- legal/lease advice delivery without review
- investment recommendations as financial advice
- payment/refund/deposit workflows
- autonomous listing publish
- cold outbound or WhatsApp broadcast
- direct CRM state writes without backend validation

Simplest MVP architecture:

```text
Supabase verified listings/leads
-> backend sends safe JSON context to Hermes
-> Hermes returns structured recommendation draft
-> backend validates listing IDs and schema
-> operator reviews
-> OpenClaw drafts/sends only approved message
-> Supabase logs recommendation, message, and outcome
```

Bottom line: Hermes is one of the highest-leverage tools for mdeai, but only if it is treated as an analyst, not an autonomous operator. Its moat is memory plus ranking plus reusable real-estate skills over mdeai's proprietary Medellin data.

## Source List

### Official Hermes Docs

- https://hermes-agent.nousresearch.com/docs/
- https://hermes-agent.nousresearch.com/docs/getting-started/quickstart
- https://hermes-agent.nousresearch.com/docs/getting-started/installation
- https://hermes-agent.nousresearch.com/docs/user-guide/features/overview
- https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
- https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway
- https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp
- https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation
- https://hermes-agent.nousresearch.com/docs/user-guide/features/cron
- https://hermes-agent.nousresearch.com/docs/user-guide/features/goals
- https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban
- https://hermes-agent.nousresearch.com/docs/user-guide/features/browser
- https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search
- https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins
- https://hermes-agent.nousresearch.com/docs/user-guide/features/context-references
- https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server
- https://hermes-agent.nousresearch.com/docs/reference/skills-catalog
- https://hermes-agent.nousresearch.com/docs/reference/tools-reference
- https://hermes-agent.nousresearch.com/docs/reference/toolsets-reference
- https://hermes-agent.nousresearch.com/docs/reference/model-catalog
- https://hermes-agent.nousresearch.com/docs/user-guide/messaging/whatsapp
- https://hermes-agent.nousresearch.com/docs/user-guide/messaging/email
- https://hermes-agent.nousresearch.com/docs/integrations/providers
- https://hermes-agent.nousresearch.com/docs/user-guide/features/provider-routing

### GitHub

- https://github.com/NousResearch/hermes-agent
- https://github.com/NousResearch/Hermes-Function-Calling
- https://github.com/NousResearch/hermes-paperclip-adapter
- https://github.com/NousResearch/hermes-agent-self-evolution
- https://github.com/orgs/NousResearch/repositories

### Secondary / Ecosystem Sources

- https://www.hostinger.com/tutorials/hermes-agent-use-cases
- https://tosea.ai/blog/hermes-agent-self-improving-ai-guide
- https://www.mindstudio.ai/blog/5-autonomous-tasks-hermes-agent-handles-better-than-openclaw-real-output-examples
- https://medium.com/@creativeaininja/hermes-agent-the-open-source-ai-agent-that-actually-remembers-what-it-learned-yesterday-278441cd1870
- https://github.com/0xNyk/awesome-hermes-agent
- https://turingpost.substack.com/p/ai-101-hermes-agent-openclaws-rival
- https://allcleardigital.com/blog/hermes-agent-business-use-cases
- https://yuv.ai/blog/hermes-agent
- https://supermemory.ai/blog/supermemory-will-make-your-hermes-agent-crazy-powerful/
- https://www.news.aakashg.com/p/hermes-agent-guide
- https://www.mindstudio.ai/blog/what-is-hermes-agent-openclaw-alternative
- https://ai-hermes-agent.com/use-cases
- https://userorbit.com/blog/getting-started-with-hermes-agent

### Related Real-Estate Skill Sources

- https://skills.sh/?q=real+estate
- https://skills.sh/reggiechan74/vp-real-estate/lease-abstraction-specialist
- https://skills.sh/openaccountant/skills/rental-property
