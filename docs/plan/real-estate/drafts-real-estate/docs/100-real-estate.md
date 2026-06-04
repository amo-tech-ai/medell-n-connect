# AI Real Estate Tool Report — OpenClaw, Paperclip, Hermes, Postiz

**Date:** 2026-05-08  
**Context:** mdeai / ILM, Medellin-focused AI concierge, rentals-first marketplace, WhatsApp-first operations  
**Scope:** rentals, purchases, buyers, sellers, landlords, property managers, agents, marketplace operations

## Source Quality Notes

This report uses current web sources and separates official claims from community/speculative claims.

| Tool | Source confidence | Notes |
|---|---:|---|
| OpenClaw | Medium-high | Official docs exist and are detailed. Real-estate-specific usage evidence is mostly blog/community and needs validation. |
| Paperclip | Medium | Product site and GitHub repo are strong; docs are active/thin in places. Treat as promising but still maturing. |
| Hermes | High | Official Nous Research docs and GitHub repo are clear. Real-estate usage is an application fit, not an official vertical. |
| Postiz | High | Official product/docs/API/CLI/MCP/GitHub sources are concrete. Best-defined production surface among the four. |

## Additional Source Pass — OpenClaw And Hermes Use Cases

The extra source pass mostly strengthens the same conclusion: OpenClaw is useful when the work is repetitive, cross-app, scheduled, and action-oriented; Hermes is useful when the work needs memory, reusable skills, research, subagents, and judgment. None of the additional sources prove that OpenClaw or Hermes is a turnkey real-estate platform. They are automation layers that mdeai must constrain with its own Supabase data model, approval gates, and legal/privacy rules.

| Source | Type | Useful signal for mdeai | Reliability |
|---|---|---|---|
| Hostinger OpenClaw use cases | Vendor/tutorial | Concrete general workflows: brand mention monitoring, client onboarding, KPI snapshots, browser/admin tasks, safe shell commands, reporting. Maps well to property ops, landlord onboarding, and dashboard alerts. | Medium-high; vendor source, practical but not real-estate-specific. |
| OpenClaw showcase | Official/community showcase | Shows users running OpenClaw for WhatsApp, email summaries, Supabase/mail-reader tools, daily cron, CRM sync, Notion/document research. | Medium; useful examples, mostly social proof. |
| Awesome OpenClaw Use Cases GitHub | Community repo | Lists local CRM, meeting notes/action items, event confirmations, knowledge base/RAG, market research. Strong pattern fit for leads/agents/property managers. | Medium; community-curated. |
| Reddit OpenClaw use cases | Community anecdotes | Good for observing practical user pain/risk, but not reliable enough for architecture claims. | Low-medium. |
| KDnuggets OpenClaw use cases | Blog/secondary | Identifies business operations, CRM-style tasks, research pipelines, daily briefings, multi-agent systems. | Medium. |
| Tencent Cloud OpenClaw use cases | Vendor/secondary | Mentions customer inquiry handling, appointment scheduling, invoice processing, social management, competitor analysis, reporting. | Medium; broad and promotional. |
| GreenNode OpenClaw use cases | Thin fetched page | Page shell loaded but content was too thin in fetched output. | Low; needs verification. |
| Sphere 100 OpenClaw use cases | Agency blog | Large use-case list; useful for inspiration, not proof. | Medium-low. |
| LinkedIn Matthew Berman OpenClaw post | Creator/anecdote | Strong transcript examples for CRM, knowledge base, meeting action items, approvals, security review. | Medium-low; anecdotal but detailed. |
| o-mega top OpenClaw use cases | Blog/secondary | Detailed personal CRM and lead follow-up patterns that map to agents/landlords. | Medium-low; verify before relying. |
| roadmap.sh OpenClaw | Roadmap/community | Confirms learning/deployment interest; fetched content was mostly shell. | Low for product evaluation. |
| Substack OpenClaw guide | Creator/blog | Strong lead-form -> research -> proposal -> CRM -> Slack -> follow-up workflow example; maps to seller/agent workflows. | Medium-low. |
| Medium OpenClaw ideas | Blog/secondary | Reinforces multi-agent, sysadmin, app-building, life-manager patterns. | Medium-low. |
| AI Agent Store listing | Directory | Confirms "awesome use cases" repo as idea catalog, not an autonomous tool. | Medium-low. |
| Hostinger Hermes use cases | Vendor/tutorial | Very useful: persistent memory, skills, parallel subagents, terminal/SSH/Docker backends, MCP/API pipelines, cron, research/data processing. | Medium-high. |
| Hermes official user stories | Official/community gallery | Shows research briefs, watchdog use, personal assistant, self-improving skills, Firecrawl integrations, etc. | Medium-high, still use-case gallery. |
| Hermes Skills Hub | Official | Shows 681 skills across categories, including productivity/maps/social/devops/research; useful for capability discovery. | High for ecosystem inventory. |
| Hermes Reddit threads | Community | Useful anecdotal evidence for automated research loops and infrastructure management. | Low-medium. |

### Added Implications For mdeai

1. **OpenClaw can help with CRM-style real-estate operations, but only if it is constrained.** The additional sources repeatedly point to personal/local CRM, lead follow-up, email/calendar ingestion, and action-item extraction. For mdeai, that means OpenClaw can assist with landlord follow-up, agent reminders, stale renter leads, and WhatsApp handoffs. It should not own canonical lead state.
2. **OpenClaw is strongest for "operator assistant" jobs before autonomous customer-facing jobs.** Start with internal summaries, reminders, dashboard snapshots, and draft replies. Move to outbound WhatsApp only after opt-in, templates, approvals, and logs exist.
3. **Hermes is stronger than OpenClaw for compounding knowledge.** Hostinger and official Hermes sources emphasize memory, skills, scheduled jobs, subagents, and research. For mdeai, Hermes should learn neighborhood, listing, landlord, and buyer/renter preference patterns over time.
4. **Use-case blogs are inspiration, not proof.** Many lists are generic, promotional, or anecdotal. They validate patterns, not production readiness.
5. **The original adoption order still stands.** These sources make OpenClaw more interesting for CRM/ops, but also reinforce why it needs Paperclip-style approval and Supabase as the source of truth.

## 1. Executive Summary

### What Each Tool Does

| Tool | What it does | Best fit for mdeai real estate |
|---|---|---|
| OpenClaw | Self-hosted execution/gateway layer for chat channels, tools, skills, and actions. Official docs list WhatsApp, Telegram, Slack, Discord, Signal, Teams, LINE, WeChat, and more. | WhatsApp execution, approved follow-up, channel routing, listing monitoring, operator assistant actions. |
| Paperclip | Control plane for AI-run work: goals, agents, tickets, budgets, heartbeats, governance, approvals, audit trails. | Approval gates, budgets, stale lead routines, escalation, "do not send without approval" guardrails. |
| Hermes | Nous Research agent with memory, skills, MCP, tools, cron, messaging, delegation, and web/research capabilities. | Ranking, matching, lead summaries, preference memory, listing explanations, scam-risk reasoning, lease-summary support. |
| Postiz | Social media scheduling platform with Public API, CLI, MCP, media upload, integrations, and analytics. | Listing promotion, seller campaigns, neighborhood content, agent social calendars, market report distribution. |

### Which Tool First?

**Do not adopt any of the four before the basic rentals loop works:** listing detail -> contact -> `landlord_inbox` -> landlord reply.

After that:

1. **Postiz first for fastest revenue impact.** It can promote verified listings and seller/landlord acquisition campaigns without touching core marketplace state.
2. **Hermes second for product moat.** Use it once mdeai has enough listing/lead data to improve matching, ranking, summaries, and scam-risk explanations.
3. **OpenClaw third for WhatsApp execution.** It is powerful but risky; use only after manual WhatsApp workflows are proven and scoped.
4. **Paperclip becomes mandatory once OpenClaw or Hermes can cause side effects.** Use it as the governance layer before broad outbound automation, payments, or publishing.

Practical read: **Postiz is the easiest first win, Hermes is the strongest long-term intelligence layer, OpenClaw is the action layer, Paperclip is the safety/control layer.**

## 2. Comparison Table

| Tool | Core purpose | Best real estate use cases | Strengths | Weaknesses | Setup difficulty | Cost/risk | Production readiness | Score /100 | Recommendation |
|---|---|---|---|---|---|---|---|---:|---|
| Postiz | Social scheduling and analytics | Listing promotion, seller campaigns, agent content, open-house posts, market snapshots | Clear API/CLI/MCP, self-host/cloud paths, 32 supported platforms in docs, analytics endpoints | Not CRM, not marketplace brain, not WhatsApp ops | Low-medium | Low-medium; platform/account risk if spammy | High for social scheduling | 88 | Adopt first after listing/contact loop, for growth |
| Hermes | Reasoning, memory, skills, MCP agent | Ranking, matching, lead summaries, lease summaries, scam-risk explanation, buyer preference memory | Strong memory/docs, skills, MCP filtering, cron, web/tools, extensible | Needs eval datasets; hallucination risk; too heavy for simple CRUD | Medium | Medium model/runtime cost; privacy risk if raw PII sent | Medium-high for internal intelligence | 84 | Adopt for ranking/summarization after real data exists |
| OpenClaw | Channel execution, messaging, tools, skills | WhatsApp intake/follow-up, approved showing coordination, listing monitoring, operator automation | WhatsApp/Web channel support, allowlists/pairing, media handling, multi-channel gateway | High side-effect risk; WhatsApp Web/Baileys not Twilio Business API; security/TOS concerns | Medium-high | High if granted broad accounts/files/tools | Medium for controlled ops, not autonomous marketplace core | 82 | Use after manual WhatsApp workflow is proven and gated |
| Paperclip | Governance/control plane for AI labor | Approval gates, budgets, stale lead queue, outbound/publishing/payment approvals, task audit | Goals, agents, budgets, heartbeats, tickets, audit/governance model | Overhead before volume; docs thinner than repo/site; not a user-facing revenue tool | Medium | Medium process overhead; lowers automation risk | Medium, fast-moving | 78 | Use lightweight early for approvals; full rollout later |

## 3. Features By Tool

### OpenClaw

**Key features**

- Chat-channel gateway. Official docs say OpenClaw can talk through many chat apps; WhatsApp is listed as a supported channel.
- WhatsApp Web/Baileys channel with QR pairing, allowlists, group policy, media handling, chunking, reaction controls, credential storage, and a production-ready status in docs.
- Skills system with `SKILL.md` folders, managed skills, workspace overrides, and skill list injection into the prompt.
- Model-agnostic routing and self-hosted gateway model.

**APIs / MCP / CLI / integrations**

- CLI commands in docs include `openclaw channels login --channel whatsapp`, `openclaw plugins install @openclaw/whatsapp`, and `openclaw gateway`.
- Integrations include WhatsApp, Telegram, Slack, Discord, Signal, Teams, LINE, WeChat, etc.
- The user-provided ecosystem links include ClawWork and skills directories, but real-estate-specific skills need verification.

**Automation capabilities**

- WhatsApp intake and outbound replies.
- Browser/listing monitoring where allowed.
- CRM updates through signed adapters.
- Operator assistant for repetitive real estate workflows.

**Real estate relevance**

OpenClaw is most useful as the "hands" of mdeai: approved WhatsApp follow-ups, showing reminders, landlord nudges, listing checks, and agent/operator tasks. It should **not** be the source of truth and should not send unapproved high-risk messages.

### Paperclip

**Key features**

- Product site and GitHub describe org charts, goals, tickets, budgets, heartbeats, governance, cost control, multi-company isolation, and audit trails.
- GitHub README says Paperclip is a Node.js server and React UI to orchestrate AI agents, assign goals, and track work/costs.
- Product docs frame it as a control plane where agents can be hired, delegated to, and approved.

**APIs / MCP / CLI / integrations**

- Product/docs reference `paperclipai` CLI and quickstart/onboarding.
- GitHub repo includes server, UI, CLI, skills, adapters, Docker, releases, and tests.
- Paperclip GitHub org includes a Hermes adapter fork, suggesting cross-agent adapter patterns, but production readiness for mdeai requires verification.

**Automation capabilities**

- Approval queue for outbound messages, listing publications, payment-risk actions, and agent-created tasks.
- Cost and budget enforcement for Hermes/OpenClaw jobs.
- Stale lead routines and escalation.

**Real estate relevance**

Paperclip is the "board/control room." It matters once agents can publish, message, schedule, scrape, or touch money. Before that, it is overhead.

### Hermes

**Key features**

- Persistent memory via `MEMORY.md` and `USER.md`, bounded and injected at session start.
- Skills system with progressive disclosure and `SKILL.md` format.
- MCP integration with include/exclude filters and tool exposure controls.
- Built-in tools: code execution, cron jobs, delegation, web/media controls, messaging, and more.
- Official GitHub README lists docs for messaging gateway, security, tools, skills, memory, MCP, cron, context files, and CLI reference.

**APIs / MCP / CLI / integrations**

- CLI: install/setup via `hermes setup` and repo scripts.
- MCP: connect servers and filter tools, including dangerous actions like Stripe deletes.
- Messaging platforms and gateway support are documented.

**Automation capabilities**

- Lead scoring and summaries.
- Renter/buyer preference memory.
- Listing match explanations.
- Lease/contract summary draft, not legal advice.
- Scam-risk reasoning with citations and deterministic checks.

**Real estate relevance**

Hermes is the "brain." It should rank, summarize, remember, and explain. It should not directly approve leases, decide fraud, publish listings, or send outbound messages.

### Postiz

**Key features**

- Public API for integrations/channels, posts, upload, and analytics.
- CLI wraps the Public API and supports social posting automation across 28+ platforms.
- MCP server exposes tools such as `integrationList`, `integrationSchema`, `schedulePostTool`, image/video generation helpers, and platform trigger tools.
- Official docs list 32 supported platforms in the Public API overview.
- API auth supports API key and OAuth2; cloud and self-hosted base URLs are documented.

**APIs / MCP / CLI / integrations**

- Public API base:
  - Cloud: `https://api.postiz.com/public/v1`
  - Self-hosted: `https://{NEXT_PUBLIC_BACKEND_URL}/public/v1`
- Important endpoints:
  - `GET /public/v1/integrations`
  - `POST /public/v1/posts`
  - `POST /public/v1/upload`
  - `GET /public/v1/analytics/{integration}`
  - `GET /public/v1/analytics/post/{postId}`
- CLI commands include `integrations:list`, `posts:create`, `posts:list`, `posts:delete`, `analytics:platform`, `analytics:post`, and `upload`.

**Automation capabilities**

- Schedule listing posts.
- Publish seller campaigns.
- Import or link social metrics.
- Generate AI-assisted post media through agent/MCP workflows.

**Real estate relevance**

Postiz is the "distribution layer." It helps acquire renters, landlords, sellers, buyers, and agents through consistent social campaigns. It does not manage leads or property truth.

## 4. Real Estate Use Cases By User

### Renters

- Hermes: rank rentals by budget, neighborhood, furnished status, commute, Wi-Fi, stay length, and lifestyle fit.
- OpenClaw: WhatsApp intake and follow-up after consent.
- Paperclip: approve sensitive outbound follow-ups or deposit/payment-adjacent messaging.
- Postiz: promote new listings and neighborhood guides that attract renters.

### Buyers

- Hermes: match purchase intent, explain tradeoffs, rank options under a budget, compare neighborhoods, produce due diligence checklists.
- OpenClaw: request missing details from agents after approval.
- Paperclip: approve broker outreach, high-value offer workflows, and payment/escrow-adjacent steps.
- Postiz: publish buyer education content and new purchase inventory.

### Sellers

- Hermes: draft listing descriptions, seller intake summary, comp/risk notes.
- Paperclip: approve listing copy, valuation claims, and outbound campaign.
- Postiz: distribute property launch posts across Instagram, Facebook, LinkedIn, X, Google Business, etc.
- OpenClaw: answer inbound seller WhatsApp questions and route to agents.

### Landlords

- OpenClaw: WhatsApp lead notifications, reminder nudges, showing coordination.
- Hermes: summarize lead quality and missing questions.
- Paperclip: approve non-template outbound messages and high-risk renter handling.
- Postiz: promote verified rentals.

### Property Managers

- OpenClaw: tenant/vendor follow-up, stale listing checks, bulk operational reminders.
- Hermes: summarize issue types, prioritize lead/maintenance queues.
- Paperclip: task routing, budget controls, approval gates, audit.
- Postiz: promote available units and monthly inventory highlights.

### Real Estate Agents

- Hermes: buyer/renter qualification, listing match explanations, lead summaries.
- OpenClaw: CRM updates, WhatsApp follow-up, showing reminders.
- Postiz: agent content calendar, listing presentations, open-house posts.
- Paperclip: approve campaigns, monitor costs, ensure no agent sends unapproved legal/payment messages.

### Internal mdeai Operators

- Paperclip: daily approval queue, stale leads, budget limits, audit trail.
- Hermes: daily digest, lead scoring, anomaly detection.
- OpenClaw: execute approved WhatsApp/channel tasks.
- Postiz: schedule and measure growth campaigns.

## 5. Real-World Examples

### WhatsApp renter intake -> AI qualifies lead -> showing scheduled

1. Renter messages mdeai on WhatsApp: "Need a furnished 1BR in Laureles under $1,200."
2. OpenClaw receives the message and sends a signed intake payload to Supabase.
3. Hermes summarizes preferences and ranks matching apartments.
4. Supabase creates `landlord_inbox` / lead rows.
5. Paperclip approval is required before non-template follow-up.
6. OpenClaw sends approved showing options.

### Seller submits property -> AI creates listing -> Postiz publishes to social

1. Seller submits property photos and details.
2. Hermes drafts listing copy and flags missing facts.
3. Operator or Paperclip approves copy and media.
4. Supabase stores canonical listing data.
5. Postiz schedules posts to Instagram, Facebook, LinkedIn, X, and Google Business.
6. Post analytics are linked back to the listing/campaign.

### Buyer asks for Laureles apartment under $180k -> Hermes ranks options

1. Buyer asks for a Laureles apartment under `$180k`.
2. Hermes ranks inventory by price, location, rental potential, risk signals, and preference fit.
3. UI shows deterministic listing data plus Hermes explanation.
4. OpenClaw only contacts agents after buyer consent and approval policy.

### OpenClaw monitors listings -> scam signals detected

1. OpenClaw or a safer crawler monitors approved listing sources.
2. Supabase stores observed listing snapshots.
3. Hermes compares price, photos, duplicate text, location, and stale signals.
4. High-risk listing is blocked from publication until human approval.

### Paperclip approves high-risk outbound messages or payments

1. Hermes drafts a message about deposit, lease, or payment.
2. Paperclip queues it for approval with source data and risk flags.
3. Operator approves/rejects.
4. OpenClaw or Postiz executes only approved action.
5. Audit log records who approved, when, and what was sent.

### Postiz schedules property marketing posts

1. mdeai selects three verified listings and a neighborhood guide.
2. Hermes drafts captions.
3. Operator approves.
4. Postiz schedules to Instagram, Facebook, LinkedIn, X, and Google Business.
5. Analytics feed weekly ROI review.

## 6. Architecture Recommendation

```text
Supabase = source of truth
  listings, landlord_profiles, leads, showings, applications, bookings,
  payments, leases, audit logs, campaign rows

Hermes = reasoning / ranking / memory / matching
  lead summary, buyer/renter preferences, listing explanations,
  scam-risk reasoning, lease summary drafts

Paperclip = governance / approvals / budgets / task management
  approval queue, spend caps, stale lead routines, operator review,
  rollback and audit

OpenClaw = execution / scraping / messaging / browser actions
  WhatsApp, approved follow-up, channel execution, listing monitoring,
  browser workflows behind allowlists

Postiz = social media scheduling / property promotion / content distribution
  listing launches, seller campaigns, agent content, analytics
```

### Operating Rule

**Hermes proposes. Paperclip approves. OpenClaw executes. Postiz distributes. Supabase records the truth.**

## 7. Implementation Plan

### Phase 1: Rentals MVP

Build first:

- verified listings
- public listing detail
- landlord profile display
- contact/lead capture
- landlord inbox
- manual WhatsApp handoff
- basic analytics

Use now:

- **Postiz optional** for simple listing promotion after listings are real.
- **No OpenClaw automation yet**, except sandbox/internal tests.
- **No full Paperclip rollout yet.**
- **No Hermes ranking beyond simple internal experiments** unless data exists.

### Phase 2: Lead CRM + WhatsApp Automation

Add:

- lead state machine
- lead reminders
- landlord notifications
- showing scheduler
- WhatsApp templates and opt-in handling

Use:

- OpenClaw for approved WhatsApp execution.
- Paperclip for outbound approval gates and budget limits.
- Hermes for lead summaries and qualification.

### Phase 3: Buyer/Seller Marketplace

Add:

- seller intake
- purchase listings
- buyer search and saved criteria
- agent marketplace
- seller campaigns
- property manager dashboards

Use:

- Hermes for buyer/seller matching, summaries, and explanations.
- Postiz for seller/listing launch campaigns.
- OpenClaw for agent/broker coordination after consent.
- Paperclip for high-risk approvals.

### Phase 4: AI Orchestration With OpenClaw + Hermes + Paperclip

Add:

- signed adapters
- correlation IDs
- agent audit rows
- approval queues
- cost caps
- stale lead routines
- safe rollback

Use:

- Hermes for reasoning and drafting.
- Paperclip for governance and operator approval.
- OpenClaw for approved execution.

### Phase 5: Social Growth Engine With Postiz

Add:

- listing campaigns
- weekly market reports
- agent/seller content packs
- open-house/event content
- campaign analytics
- attribution back to leads/bookings

Use:

- Postiz as the distribution platform.
- Hermes for content drafts and campaign analysis.
- Paperclip for approval.
- Supabase for attribution.

## 8. Risk Audit

| Risk | Severity | What can go wrong | Mitigation |
|---|---:|---|---|
| Legal / lease advice | High | AI gives legal advice or invents lease terms. | AI summaries only; lawyer-reviewed templates; disclaimers; human approval. |
| Scraping / TOS | High | Listing sources block or sue; scraped data is inaccurate. | Prefer owned/user-submitted inventory and partnerships; approved sources only; cache evidence; obey robots/TOS where required. |
| WhatsApp spam | High | Numbers blocked; users complain; brand damage. | Opt-in, templates, rate limits, allowlists, suppression list, Paperclip approval. |
| Data privacy | High | Phone numbers, IDs, leases, and payments leak to agents. | Supabase RLS, signed URLs, data minimization, no raw ID docs to Hermes/OpenClaw, retention policy. |
| AI hallucination | High | Fake amenities, fake prices, wrong legal/financial claims. | Source-grounded outputs, citations, deterministic fields, human review before publication. |
| Payment / booking risk | High | Agent sends wrong payment link, duplicate charge, or deposit commitment. | Stripe-only deterministic flows, idempotency, no agent-created payment actions without approval. |
| Over-engineering | Critical | Team spends months wiring agents before revenue loop works. | Manual beta first; adopt tools only when workflow volume proves the need. |
| Security / prompt injection | High | OpenClaw/Hermes act on malicious listing/user content. | Tool allowlists, sandboxes, signed adapters, no service-role keys in agents, output review. |
| Social platform risk | Medium | Postiz campaigns violate platform rules or overpost. | Platform-specific schemas, content review, rate limits, avoid spammy automation. |

## 9. Final Recommendation

### Which Tool Should Be Adopted First?

**Postiz first**, after the basic rentals loop works. It is the safest and fastest path to revenue support because it drives demand and landlord/seller acquisition without modifying marketplace core logic.

### Which Should Wait?

- **OpenClaw should wait until WhatsApp workflows are manually proven.** It is valuable but risky because it can take side effects.
- **Full Paperclip rollout should wait until multiple agents/workflows exist.** Use lightweight approval rules earlier, but avoid turning the whole company into an agent org chart before volume.

### Which Is Optional?

- **Postiz is optional if organic/social growth is not the current bottleneck**, but it is still the easiest commercial win.
- **Paperclip is optional while operations are manual**, but becomes necessary when OpenClaw/Hermes can send, publish, or affect money.

### Which Gives Fastest Revenue Impact?

**Postiz + verified listings + lead capture**. Publishing real listings and seller/landlord campaigns can create immediate demand/supply signals.

### Which Gives Strongest Long-Term Moat?

**Hermes + verified marketplace data + scam/risk intelligence + preference memory.** The defensible asset is not the agent tool; it is mdeai's structured Medellin real-estate data, renter/buyer preference memory, landlord response history, and trust layer.

### Best Practical Stack

1. Ship rentals MVP.
2. Add Postiz for growth.
3. Add Hermes for ranking and summaries.
4. Add Paperclip approval gates.
5. Add OpenClaw for approved WhatsApp execution.

This order is intentionally conservative. It optimizes for revenue, safety, and operational simplicity.

## Source List

### OpenClaw

- Official site: https://openclaw.ai/
- Official showcase: https://openclaw.ai/showcase
- Official docs FAQ: https://docs.openclaw.ai/help/faq
- Official channel docs: https://docs.openclaw.ai/channels
- Official WhatsApp docs: https://docs.openclaw.ai/channels/whatsapp
- Official skills docs: https://docs.openclaw.ai/tools/skills
- Official configuration reference: https://docs.openclaw.ai/gateway/configuration-reference
- GitHub repository: https://github.com/openclaw/openclaw
- Community docs: https://clawdocs.org/
- ClawWork GitHub: https://github.com/HKUDS/ClawWork
- Hostinger OpenClaw use cases: https://www.hostinger.com/tutorials/openclaw-use-cases
- Hostinger Colombia OpenClaw product page: https://www.hostinger.com/co/openclaw
- Awesome OpenClaw use cases GitHub: https://github.com/hesamsheikh/awesome-openclaw-usecases
- Reddit 87 OpenClaw use cases: https://www.reddit.com/r/openclaw/comments/1sjr3ep/my_87_use_cases_for_openclaw_they_became_more/
- KDnuggets OpenClaw use cases: https://www.kdnuggets.com/7-practical-openclaw-use-cases-you-should-know
- Tencent Cloud OpenClaw use cases: https://www.tencentcloud.com/techpedia/140889
- GreenNode OpenClaw business use cases, fetched content thin: https://greennode.ai/blog/openclaw-use-cases-for-business
- Sphere 100 OpenClaw use cases: https://www.sphereinc.com/blogs/100-openclaw-use-cases-you-can-try-today/
- LinkedIn Matthew Berman OpenClaw use-case post: https://www.linkedin.com/posts/matthewberman_ive-spent-254-billion-tokens-perfecting-activity-7429622549661028352-X6um/
- o-mega OpenClaw use cases: https://o-mega.ai/articles/top-50-openclaw-use-cases-2026-rankings
- roadmap.sh OpenClaw page: https://roadmap.sh/openclaw
- Substack OpenClaw use-case guide: https://aiblewmymind.substack.com/p/openclaw-ai-agent-use-cases-guide
- Medium OpenClaw ideas: https://medium.com/data-science-in-your-pocket/the-craziest-openclaw-ideas-you-can-try-in-real-life-2bd36b9de5a3
- AI Agent Store awesome OpenClaw use cases listing: https://aiagentstore.ai/ai-agent/awesome-openclaw-use-cases
- Blink real-estate blog, community/vendor source: https://blink.new/blog/openclaw-for-real-estate-agents-automation-2026
- Reddit Dubai real-estate discussion, community source: https://www.reddit.com/r/dubairealestate/comments/1r3lwar/anybody_using_openclaw_in_realestate_workflows/
- Reddit RealEstateTechnology thread, fetched page had thin usable content and needs verification: https://www.reddit.com/r/RealEstateTechnology/comments/1s55fq2/anyone_actually_using_openclaw_for_real_estate/
- Skills directory search, useful for ecosystem discovery but no verified real-estate match in fetched content: https://skills.sh/?q=real+estate
- Claw skills GitHub integration page, fetched content was thin: https://clawskills.sh/openclaw/integrations/github

### Paperclip

- Product site: https://paperclip.ing/
- Docs: https://docs.paperclip.ing/
- GitHub organization: https://github.com/paperclipai
- GitHub repository: https://github.com/paperclipai/paperclip
- Archived/alternate docs repo listed by GitHub org: https://github.com/paperclipai/docs
- Paperclip docs repo listed by GitHub org: https://github.com/paperclipai/paperclip-docs
- Hermes Paperclip adapter listed in GitHub org: https://github.com/paperclipai/hermes-paperclip-adapter

### Hermes

- Official docs: https://hermes-agent.nousresearch.com/docs/
- GitHub repository: https://github.com/NousResearch/hermes-agent
- Official user stories/use cases: https://hermes-agent.nousresearch.com/docs/user-stories
- Official Skills Hub: https://hermes-agent.nousresearch.com/docs/skills
- Memory docs: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
- Skills docs: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- MCP docs: https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp
- Tools reference: https://hermes-agent.nousresearch.com/docs/reference/tools-reference
- Nous Research: https://nousresearch.com/
- Hostinger Hermes use cases: https://www.hostinger.com/tutorials/hermes-agent-use-cases
- Reddit Hermes top use cases: https://www.reddit.com/r/hermesagent/comments/1sgvxju/im_curious_what_are_your_top_3_use_cases_for/
- Reddit Hermes use cases: https://www.reddit.com/r/hermesagent/comments/1si07o1/what_are_your_use_cases_for_hermes_agent/

### Postiz

- Product site: https://postiz.com/
- Introduction docs: https://docs.postiz.com/introduction
- Public API docs: https://docs.postiz.com/public-api/introduction
- MCP docs: https://docs.postiz.com/mcp/introduction
- CLI docs: https://docs.postiz.com/cli/introduction
- Post analytics API: https://docs.postiz.com/public-api/analytics/post
- List integrations API: https://docs.postiz.com/public-api/integrations/list
- Create post API: https://docs.postiz.com/public-api/posts/create
- OAuth2 docs: https://docs.postiz.com/public-api/oauth
- GitHub app repo: https://github.com/gitroomhq/postiz-app
- GitHub agent/CLI repo: https://github.com/gitroomhq/postiz-agent
