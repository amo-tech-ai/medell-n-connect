# Paperclip AI Real Estate Governance Report - mdeai / ILM

Date: 2026-05-07

Scope: Paperclip AI as the governance, budget, approval, and task-management layer for a Medellin-focused rentals-first marketplace using Supabase, Hermes, OpenClaw, Postiz, WhatsApp, payments, lead CRM, showings, contracts, and scam detection.

## 1. Executive Summary

Paperclip AI is an open-source control plane for running teams of AI agents as an "AI company." The official docs and GitHub repo describe it as a Node.js server plus React UI that manages companies, agents, goals, projects, issues/tasks, approvals, budgets, heartbeats, adapter-based runtimes, skills, activity logs, and deployment modes.

The problem it solves is not "better AI." It solves orchestration discipline: who owns the task, what agent is allowed to run, what budget remains, what needs human approval, what happened during the run, and how work resumes after a heartbeat.

For mdeai, Paperclip fits as a governance/control plane only after there are real side effects to govern: outbound WhatsApp messages, Postiz publishing, OpenClaw scraping/browser actions, Hermes lease/ranking jobs, payment/refund workflows, fraud reviews, and stale lead follow-up. It should not be used as the first real-estate system. It adds process overhead before the marketplace has enough lead volume.

Recommendation: use Paperclip later, not first. The simplest first Paperclip use case is an approval queue for high-risk real-estate actions:

- high-risk WhatsApp outbound message before OpenClaw sends it
- refund/payment action before Stripe changes money state
- suspicious listing before publish or promotion
- monthly AI budget caps for Hermes/OpenClaw/Postiz automation

Do not use Paperclip to run the whole marketplace, replace Supabase state, or automate legal/payment decisions.

## 2. Evidence Quality

| Source type | Confidence | Notes |
|---|---:|---|
| Official docs and paperclip-docs repo | High | Best source for features, API, CLI, adapters, budgets, execution policies, deployment modes. |
| paperclip main GitHub repo | High | Confirms architecture, quickstart, roadmap, adapter/runtime scope, license, telemetry, requirements. |
| Hermes Paperclip adapter repo | High-medium | Confirms adapter exists and capabilities; small repo footprint means production maturity still needs live validation. |
| OpenClaw adapter docs and issue 134 | Medium | Confirms runtime path and real setup caveats; UI selection and adapter behavior still require version-specific verification. |
| Codebridge, Hostinger, Zeabur, MindStudio | Medium-low | Useful for practical interpretation, but vendor/blog sources. Use as supporting context only. |
| Reddit | Low | Useful signals about user confusion/adapters, not reliable implementation proof. |

## 3. Verified Facts vs Assumptions

### Verified Facts

- Paperclip is positioned as a control plane for AI-run companies with agents, tasks, approvals, budgets, and dashboard oversight.
- It supports companies, agents, projects, issues, approvals, costs, routines, secrets, activity, dashboard state, CLI, API, skills, and adapters.
- Agents run in heartbeats rather than continuously by default.
- Budgets can warn and hard-stop at configured thresholds.
- Approval types include hire approvals, CEO strategy approvals, budget override approvals, and general board approval requests.
- Built-in adapters include Claude, Codex, Gemini, Cursor, OpenCode, Pi, Hermes, OpenClaw Gateway, process, and HTTP, but docs say OpenClaw Gateway, process, and HTTP are runtime-functional while UI selection is "Coming soon."
- Paperclip supports `local_trusted`, authenticated private, and authenticated public deployment modes.
- The API uses `/api`, company scoping, bearer tokens, board auth, agent auth, and `X-Paperclip-Run-Id` for run-linked mutating requests.

### Assumptions for mdeai

- Paperclip can govern mdeai agent workflows if mdeai writes/bridges Supabase lead/listing/payment events into Paperclip issues and approvals.
- Paperclip will need custom mdeai skills and adapter payloads for real-estate-specific workflows.
- Supabase should remain the source of truth; Paperclip should store operational task/audit state, not canonical listing/payment state.

### Needs Verification

- Exact OpenClaw adapter behavior in the installed Paperclip version.
- Whether the OpenClaw invite flow or `openclaw_gateway` API configuration is the best current path.
- Whether Hermes adapter package version matches the Paperclip server version used in production.
- Whether Postiz should be integrated through HTTP adapter, process adapter, CLI, MCP, or a custom job service.
- Whether Paperclip's internal audit log is sufficient for financial/legal compliance, or only operator debugging.

## 4. Core Features

### Dashboard

The dashboard shows agent status, task counts, month spend, budget utilization, pending approvals, budget incidents, and recent activity. For mdeai, this is useful for operator supervision: which automation failed, which leads are blocked, whether AI spend is climbing, and which approvals are waiting.

Real-estate fit: high for internal ops, low for renters/buyers/sellers.

### Companies

A Paperclip company is an isolated operating unit with its own identity, goal, agents, tasks, budgets, members, invites, and exports/imports. For mdeai, use one company for "mdeai Real Estate Ops" first. Do not split into separate companies for renters, buyers, sellers, and landlords until workflows are mature.

### Agents

Agents are AI employees with roles, reporting lines, adapters, budgets, permissions, skills, and heartbeat settings. For mdeai:

- CEO/Ops Manager agent: triages queue, creates tasks, escalates approvals.
- Hermes Analyst: read-only ranking, lead summary, listing matching.
- OpenClaw Operator: approved WhatsApp/browser/scraping actions.
- Postiz Publisher: approved campaign scheduling.
- Compliance Reviewer: human or AI-assisted review queue, not autonomous final authority.

### Projects

Projects group work, issues, goals, budget envelopes, execution workspaces, and task boards. For mdeai:

- Rentals MVP Ops
- Lead CRM and WhatsApp
- Verified Inventory
- Buyer/Seller Expansion
- Marketing Campaigns

### Tasks / Issues

Issues are the core work objects. They support statuses, priorities, assignees, comments, documents, attachments, blockers, approvals, checkout locks, and heartbeat context. This maps well to real-estate ops:

- "Lead L-123 stale for 24h"
- "Listing R-902 missing photos"
- "Scam score high; review before publish"
- "Buyer B-77 needs Laureles shortlist under $180k"
- "Refund request requires human approval"

### Skills

Skills are company-level Markdown packages assigned to agents. Paperclip can import skills from GitHub, local paths, raw URLs, and skills.sh-style sources. For mdeai, create short, domain-specific skills:

- `mde-rental-lead-triage`
- `mde-listing-quality-review`
- `mde-whatsapp-safe-reply`
- `mde-payment-refund-approval`
- `mde-scam-risk-review`
- `mde-postiz-listing-campaign`

Keep skills narrow. Do not create giant "real estate agent" prompts that blend legal, payments, marketing, and customer support.

### Execution Policies

Execution policies enforce review and approval stages before an issue can truly be marked done. This is one of Paperclip's strongest fits for mdeai. Use it for:

- OpenClaw outbound messages above risk threshold
- Postiz publication to public channels
- any payment/refund/payout action
- suspicious listing publication
- lease/contract summary delivery

### Monthly Budgets

Paperclip supports company, agent, and project budget policies with warn thresholds and hard stops. For mdeai:

- company budget: total AI automation cap
- Hermes budget: ranking/reasoning cap
- OpenClaw budget: execution/actions cap
- Postiz publisher budget: content-generation/publishing cap
- project budget: campaign or launch experiment cap

Budgets are necessary once agents run unattended. Before that, a manual spreadsheet cap is enough.

### API

Paperclip exposes JSON API endpoints for companies, agents, issues, approvals, costs, routines, secrets, activity, and dashboard health. This is the integration surface mdeai should use. Supabase triggers/edge functions should create Paperclip issues for risky or stale workflows, not let agents poll everything blindly.

### CLI

The CLI supports onboarding, running local instances, managing context profiles, company operations, agent operations, issues, approvals, dashboards, activity, and heartbeats. For mdeai, use the CLI for local validation and emergency operations, not as the production integration path.

### Adapters

Adapters connect Paperclip to runtimes. Official docs describe adapters for Claude, Codex, Gemini, Cursor, OpenCode, Pi, Hermes, OpenClaw Gateway, process, HTTP, and external adapters. For mdeai:

- Hermes: use `hermes_local` or the Hermes adapter when ranking/memory workflows exist.
- OpenClaw: use `openclaw_gateway` only after a smoke test proves session persistence and payload correctness.
- Postiz: likely HTTP adapter or a small process/job wrapper; no official Postiz Paperclip adapter was verified.
- Supabase: do not run as an agent. Integrate by API/webhooks/jobs.

### Deployment

Paperclip supports local trusted, authenticated private, and authenticated public modes. For mdeai:

- local trusted: research only
- authenticated private over Tailscale/VPN: staging
- authenticated public: only after auth, secrets, backups, monitoring, and network isolation are proven

### Hermes Adapter

The Hermes adapter lets Paperclip run Hermes Agent as a managed employee with persistent memory, skills, transcript parsing, model routing, MCP support, and session state. This is the best intelligence pairing for mdeai, but should be read-only at first.

### Custom / Local Process Adapter

The process adapter runs arbitrary local commands with injected `PAPERCLIP_*` context and environment variables. It is useful for custom wrappers, but docs mark UI selection as not fully available in the current adapter picker. Use API/import configuration and smoke tests before relying on it.

## 5. Paperclip Use Cases for Real Estate

| User | Best Paperclip role | Useful workflows |
|---|---|---|
| Renters | Indirect only | Escalate stale lead, approve risky WhatsApp reply, track showing coordination tasks. |
| Buyers | Indirect only | Assign Hermes to rank buyer matches, require human review before investment/financial claims. |
| Sellers | Approval/control | Approve listing copy, Postiz campaign, price-change recommendations, seller follow-up. |
| Landlords | Approval/control | Approve tenant-facing messages, showing proposals, document requests, payout exceptions. |
| Property managers | Ops control | Bulk stale listing tasks, tenant issue queues, missing-photo tasks, maintenance triage, budget caps. |
| Agents | Sales ops | Assign follow-ups, review lead quality, approve public claims, monitor campaign performance. |
| Internal mdeai operators | Primary user | Dashboard, approvals, budgets, error triage, task ownership, audit trails, escalation. |

Paperclip is not a customer-facing renter app. It is the internal ops cockpit.

## 6. Real-World Examples

### A. High-Risk WhatsApp Approval

1. Supabase lead message gets high-risk classification: price negotiation, legal claim, refund, or personal document request.
2. Edge function creates Paperclip issue with `approval` execution policy.
3. Hermes drafts a safe reply.
4. Human/operator approves or edits.
5. OpenClaw sends the approved WhatsApp message.
6. Supabase stores message ID, approval ID, and send status.

### B. Monthly AI Spend Hard Stop

1. Hermes ranking agent posts cost events to Paperclip.
2. Agent hits monthly cap.
3. Paperclip pauses the agent and creates a budget incident.
4. mdeai falls back to deterministic search.
5. Human reviews before raising cap.

### C. Buyer Matching

1. Buyer asks for Laureles apartment under $180k.
2. Supabase creates buyer-search job.
3. Paperclip assigns Hermes Analyst.
4. Hermes returns ranked shortlist and explanation.
5. Human or deterministic validator checks factual fields before response.

### D. Stale Renter Lead

1. `lead_last_contacted_at` exceeds SLA.
2. Supabase scheduled job creates Paperclip issue.
3. Paperclip assigns OpenClaw Operator.
4. OpenClaw sends only an approved template.
5. Supabase updates lead stage and audit log.

### E. Payment / Refund Approval

1. Refund request is created in Supabase.
2. Paperclip issue requires board approval.
3. Human approves or rejects.
4. Stripe action is executed by deterministic backend code, not an AI agent.
5. Paperclip and Supabase store cross-referenced IDs.

### F. Postiz Campaign Monitoring

1. Seller listing approved.
2. Paperclip creates campaign task.
3. Hermes drafts copy.
4. Human approves.
5. Postiz schedules campaign.
6. Analytics return to Supabase and optionally to Paperclip activity.

### G. Listing Quality / Scam Task

1. Listing has no photos, stale price, duplicate images, suspiciously low rent, or mismatched neighborhood.
2. Supabase creates Paperclip review issue.
3. Hermes summarizes risk.
4. Human reviews.
5. Publish/promotion remains blocked until resolved.

## 7. Integration Architecture

```text
Supabase = source of truth
- users, profiles, listings, leads, showings, payments, documents, CRM states
- canonical audit IDs and business state

Hermes = intelligence
- ranking, summaries, matching, scam reasoning, lease-review summaries
- read-only first; writes only drafts/recommendations

OpenClaw = execution
- WhatsApp, browser actions, scraping/monitoring, approved follow-up
- no direct money movement or unsupervised legal messaging

Postiz = distribution
- listing promotion, seller campaigns, social scheduling, analytics
- publish only after approval for claims/media

Paperclip = governance/control plane
- issues, approvals, budgets, execution policies, run logs, task ownership
- not the customer database and not the payment authority
```

### Data Flow

1. Supabase event or scheduled job detects work.
2. Backend/edge function creates Paperclip issue with linked Supabase IDs.
3. Paperclip assigns task to the right agent.
4. Hermes/OpenClaw/Postiz adapter performs bounded work.
5. Paperclip stores run transcript, cost, approval state, and task status.
6. mdeai backend writes final canonical status back to Supabase.

### Where Approvals Happen

Approvals happen in Paperclip for decisions, but execution must happen in deterministic mdeai services for money, contracts, documents, and final publish state.

### Where Logs Should Be Stored

- Supabase: canonical business audit log, user-visible message/payment/listing states.
- Paperclip: agent run logs, task comments, approval decisions, budget incidents.
- Sentry/OpenTelemetry: runtime errors, latency, traces.
- PostHog: funnel analytics and conversion events.

### What Should Not Be Automated

- final lease/legal advice
- payments, refunds, deposits, payouts without deterministic backend and human approval
- identity/document decisions
- unapproved outbound WhatsApp messages
- scraping that violates source terms
- public listing claims not grounded in Supabase facts
- price promises or availability guarantees

## 8. Setup Plan

### Local Install

```bash
npx paperclipai onboard --yes
# or from source:
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
pnpm dev
```

Requirements verified from official repo: Node.js 20+, pnpm 9.15+ for source development. Local API defaults to `http://localhost:3100/api`.

### Environment Variables

Minimum likely needs:

```bash
PAPERCLIP_API_URL=http://localhost:3100
PAPERCLIP_API_KEY=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
```

Production likely needs, depending on deployment:

```bash
PAPERCLIP_TELEMETRY_DISABLED=1
DATABASE_URL=postgres://...
BETTER_AUTH_SECRET=...
AUTH_PUBLIC_BASE_URL=https://paperclip.example.com
OPENCLAW_GATEWAY_TOKEN=...
POSTIZ_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Exact env var names for production must be verified against the installed Paperclip deployment docs/config schema before launch.

### Company Setup

Create one company:

- Name: `mdeai Real Estate Ops`
- Mission: `Safely operate Medellin rentals-first real estate workflows with human approval for sensitive actions.`
- Do not create multiple companies until workflows have volume.

### Agent Setup

Start with three agents:

| Agent | Adapter | Permissions | Budget |
|---|---|---|---:|
| Ops Manager | Claude/Codex/Hermes | can create tasks, cannot send external messages | low |
| Hermes Analyst | Hermes | read-only analysis | low-medium |
| OpenClaw Operator | OpenClaw Gateway | approved templates/actions only | low |

Add Postiz Publisher later via HTTP/process/custom integration.

### Budget Setup

- Company cap: small pilot cap.
- Hermes Analyst cap: ranking/summaries.
- OpenClaw Operator cap: WhatsApp/actions.
- Postiz Publisher cap: campaign generation/scheduling.
- Hard stop enabled at 100%.
- Warn at 70-80%.

### Project Setup

Create projects in this order:

1. Rentals Manual Beta
2. Lead CRM and WhatsApp
3. Listing Quality and Scam Review
4. Seller/Buyer Marketplace
5. Social Growth Campaigns

### Execution Policy Setup

Require human approval for:

- outbound WhatsApp outside safe template set
- public social posts
- payment/refund/payout actions
- listing publication when scam score is elevated
- lease/contract summaries sent to users

### Hermes Adapter Setup

Use `hermes_local` only after Hermes is installed and smoke-tested:

- install Hermes Agent
- set model/provider
- enable only needed toolsets
- start with `terminal,file,web` disabled unless required
- persist sessions only for non-sensitive workflows
- use checkpoints for file-writing tasks

### OpenClaw Adapter Setup

Needs verification. Official docs describe `openclaw_gateway` over `ws://` or `wss://`, device auth, token/password/header auth, session-key strategies, and auto-pairing. However, docs also say direct UI selection is "Coming soon."

Safe setup path:

1. Validate local OpenClaw Gateway.
2. Configure via invite/API/import, not UI-only assumptions.
3. Use private network first.
4. Use one test agent.
5. Send one approved template message.
6. Verify Paperclip run ID, OpenClaw session key, Supabase lead event, and WhatsApp delivery state.

### Postiz Integration Strategy

No official Postiz Paperclip adapter verified.

Use one of:

- HTTP adapter to a small mdeai `postiz-campaign-worker`
- process adapter that calls Postiz CLI for local tests
- Supabase job/Trigger.dev worker that calls Postiz API after Paperclip approval

Recommended: Paperclip approves; deterministic worker calls Postiz.

### Supabase Logging / Audit Strategy

Add a Supabase table or extend existing audit tables:

```text
ai_control_events
- id
- entity_type
- entity_id
- paperclip_company_id
- paperclip_issue_id
- paperclip_approval_id
- paperclip_run_id
- agent_name
- action_type
- status
- risk_level
- created_at
- metadata jsonb
```

Every Paperclip-triggered external action should have a Supabase correlation row.

### Production Deployment Checklist

- Authenticated private deployment first.
- No public exposure until login/session config is proven.
- External Postgres, backups, restore test.
- Secrets stored as references, not plain adapter config.
- Sentry enabled for Paperclip bridge workers.
- Supabase RLS unaffected; service-role usage isolated in backend only.
- Budget policies enabled before heartbeats.
- OpenClaw/Postiz actions gated by approvals.
- All money movement remains deterministic and idempotent.
- Kill switch for all automation.

## 9. Best Additional Tools

| Tool | Use with Paperclip | Recommendation |
|---|---|---|
| Trigger.dev | Reliable jobs, retries, workflows | Good default for app-side orchestration. |
| pg_cron | Simple Supabase-native scheduled checks | Good for stale leads/listings when logic is SQL-simple. |
| Sentry | Error monitoring | Required before production automation. |
| PostHog | Funnel/product analytics | Required for lead/revenue visibility. |
| Infobip or Twilio | WhatsApp provider | Required for compliant WhatsApp workflows. |
| Stripe | Payments/refunds/deposits | Use deterministic backend, not AI direct action. |
| Resend/SendGrid | Email | Useful for landlord/admin fallbacks. |
| Firecrawl/Apify | Listing enrichment/scraping | Use carefully; TOS and data quality risks. |
| FingerprintJS | Fraud/device risk | Useful for rental scams, fake leads, payment abuse. |
| Cloudflare Turnstile | Anti-bot | Use on public lead/listing forms. |
| OpenTelemetry/Grafana | Traces/metrics | Needed once agents run in production. |

## 10. Risk Audit

| Risk | Severity | Finding | Mitigation |
|---|---:|---|---|
| Over-engineering | Critical | Paperclip before lead volume adds process without revenue. | Start with one approval queue only. |
| Adapter maturity | High | OpenClaw/process/http UI maturity is mixed; version-specific behavior matters. | Smoke test exact version and keep deterministic fallback. |
| Security | High | Agents may receive broad secrets/tools. | Least-privilege adapters, secret refs, private network, audit logs. |
| Agent runaway | High | Heartbeats can still loop or create excess work. | Budgets, hard stops, max iterations, issue limits. |
| Budget overrun | High | AI costs can spike on ranking/scraping/content loops. | Company/agent/project caps before enabling schedules. |
| Hallucinated actions | High | Agents may invent listing facts or legal/payment claims. | Ground outputs in Supabase facts; human approval for public/high-risk outputs. |
| Payment/refund | Critical | AI-driven money movement is unsafe. | Paperclip approves only; backend executes idempotent Stripe actions. |
| WhatsApp spam | High | OpenClaw can amplify outbound messaging. | Opt-in, templates, rate limits, approval gates, unsubscribe handling. |
| Scraping/TOS | High | OpenClaw/Firecrawl/Apify workflows may violate terms. | Prefer partnerships/user-submitted listings; review source terms. |
| Privacy/documents | Critical | Real estate docs include IDs, leases, financial data. | Private storage, signed URLs, retention limits, no raw docs in prompts unless required. |
| False sense of audit | Medium | Paperclip audit is not automatically legal/compliance-grade. | Store canonical audit in Supabase too. |

## 11. Scoring for mdeai

| Dimension | Score | Interpretation |
|---|---:|---|
| Product fit | 78/100 | Strong internal ops fit once automation exists; poor customer-facing MVP fit. |
| Setup difficulty | 62/100 | Moderate to high; easy local start, harder production/adapters/security. Higher score means easier. |
| Production readiness | 64/100 | Promising but must be proven with exact adapters, auth, backups, monitoring. |
| Risk level | 72/100 | High if used for side effects too early. Higher score means riskier. |
| Fastest revenue impact | 38/100 | Low direct impact; Postiz/lead capture/listings beat it for revenue. |
| Long-term moat | 82/100 | Strong if mdeai becomes an AI-operated marketplace with auditable workflows. |

## 12. Final Recommendation

Should mdeai use Paperclip? Yes, but as an internal governance layer, not as the first real-estate product system.

Use it after:

1. rentals listings exist
2. lead capture works
3. showing flow works
4. manual WhatsApp workflow is proven
5. Supabase audit/logging is stable
6. at least two agent/tool workflows need coordination

Use it before broad OpenClaw automation, not before Postiz or the basic rentals MVP. The practical order is:

1. Supabase rentals + lead CRM
2. Postiz for approved listing promotion
3. Hermes for ranking/summaries
4. Paperclip approval/budget queue
5. OpenClaw side-effect automation behind Paperclip gates

First exact use case:

> Create a Paperclip approval issue whenever a renter/landlord workflow wants to send a non-template WhatsApp message, publish a risky listing, or execute a payment/refund action.

Avoid:

- Paperclip as canonical CRM
- Paperclip as payment executor
- autonomous legal/lease advice
- direct public OpenClaw actions without approval
- multi-company org charts before one workflow is working
- giving agents broad Supabase service-role access

Simplest MVP version:

- One Paperclip company
- Three agents maximum
- One project: `Rentals Manual Beta`
- One approval policy: `Human approval before external side effects`
- One budget cap per agent
- Supabase correlation table
- Deterministic workers execute approved actions

Bottom line: Paperclip is valuable for mdeai only when the business has enough agent side effects to need governance. It is not a launch accelerator. It is the brake, dashboard, and accountability layer you add before automation becomes dangerous.

## Source List

### Official Docs

- https://docs.paperclip.ing/#/
- https://docs.paperclip.ing/#/guides/getting-started/five-minute-path
- https://docs.paperclip.ing/#/guides/day-to-day/dashboard
- https://docs.paperclip.ing/#/guides/org/agents
- https://docs.paperclip.ing/#/guides/projects-workflow/projects
- https://docs.paperclip.ing/#/guides/power/execution-policy
- https://docs.paperclip.ing/#/how-to/set-monthly-budget
- https://docs.paperclip.ing/#/administration/company
- https://docs.paperclip.ing/#/reference/api/overview
- https://docs.paperclip.ing/#/reference/cli/overview
- https://docs.paperclip.ing/#/reference/skills
- https://docs.paperclip.ing/#/reference/deploy/overview
- https://docs.paperclip.ing/#/reference/adapters/overview
- https://docs.paperclip.ing/#/reference/adapters/hermes-local
- https://docs.paperclip.ing/#/reference/adapters/process
- https://docs.paperclip.ing/#/reference/adapters/openclaw-gateway

### Official GitHub / Raw Docs

- https://github.com/paperclipai/paperclip
- https://github.com/paperclipai
- https://github.com/paperclipai/companies
- https://github.com/paperclipai/companies-tool
- https://github.com/paperclipai/paperclip-docs
- https://github.com/paperclipai/hermes-paperclip-adapter
- https://github.com/paperclipai/paperclip/blob/master/adapter-plugin.md
- https://github.com/paperclipai/paperclip/issues/134
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/guides/welcome/what-is-paperclip.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/guides/getting-started/five-minute-path.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/guides/day-to-day/dashboard.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/guides/org/agents.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/guides/projects-workflow/projects.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/guides/power/execution-policy.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/how-to/set-monthly-budget.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/administration/company.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/api/overview.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/api/agents.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/api/issues.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/api/approvals.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/api/costs.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/api/dashboard.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/api/activity.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/api/authentication.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/cli/overview.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/skills.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/deploy/overview.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/adapters/overview.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/adapters/hermes-local.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/adapters/process.md
- https://raw.githubusercontent.com/paperclipai/paperclip-docs/main/docs/reference/adapters/openclaw-gateway.md

### Secondary / Community Sources

- https://paperclipai-paperclip.mintlify.app/agents/process-adapter
- https://www.codebridge.tech/articles/openclaw-paperclip-integration-how-to-connect-configure-and-test-it
- https://hindsight.vectorize.io/sdks/integrations/paperclip
- https://www.reddit.com/r/PaperClip_AI/comments/1sv8usj/i_made_a_tiny_paperclip_adapter_for_customlocal/
- https://www.reddit.com/r/openclaw/comments/1s7bixn/openclaw_paperclip_work_together/
- https://www.mindstudio.ai/blog/what-is-paperclip-zero-human-ai-company-framework
- https://www.mindstudio.ai/blog/build-multi-agent-company-paperclip-claude-code
- https://www.hostinger.com/tutorials/what-is-paperclip-ai
- https://zeabur.com/blogs/deploy-paperclip-ai-agent-orchestration
- https://medium.com/neuralnotions/paperclip-ai-open-source-platform-focused-on-turning-ai-agents-into-a-company-de3ed4066edf
- https://pub.towardsai.net/paperclip-the-open-source-operating-system-for-zero-human-companies-2c16f3f22182
