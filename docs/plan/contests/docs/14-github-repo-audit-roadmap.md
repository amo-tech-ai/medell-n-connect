---
title: GitHub Repo Audit and Roadmap Plan
status: Strategic appendix
date: 2026-05-24
related:
  - ./MVP-SCOPE.md
  - ./12-task-proof-gates.md
  - ./13-security-checklist.md
---

# GitHub Repo Audit + Roadmap Plan

Evidence inspected:

| Source | Evidence |
|---|---|
| Local clones | `/home/sk/mdeai/CopilotKit`, `/home/sk/mdeai/github/contest/*`, `/home/sk/mdeai/github/events/Hi.Events`, `/home/sk/mdeai/github/adk/adk-samples` |
| Local commit snapshots | CopilotKit `c2d2046`, Helios `c7d5e60`, OpenStreamPoll `a0d03b6`, Hi.Events `106b397`, ADK samples `964b975` |
| GitHub API/raw metadata | Postiz, Trigger.dev, photo-contest, TanStack Table, React Email, Playwright, React Scan |
| Scope rule | Use repos as reference architectures. Do not copy/paste apps into mdeai. |

Source repos:

| Repo | URL |
|---|---|
| CopilotKit Mastra Integration | https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra |
| CopilotKit A2A Travel Showcase | https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel |
| Helios Server | https://github.com/benadida/helios-server |
| OpenStreamPoll | https://github.com/yoanbernabeu/OpenStreamPoll |
| Hi.Events | https://github.com/HiEventsDev/hi.events |
| Postiz | https://github.com/gitroomhq/postiz-app |
| Google ADK Samples | https://github.com/google/adk-samples |
| Trigger.dev | https://github.com/triggerdotdev/trigger.dev |
| Photography Contest ReactJS | https://github.com/atharva-narkhede/Photography_Contest_ReactJS |
| Photo Contest CMS | https://github.com/nak-sued-webmasters/photo-contest |
| OpenClaw Web Scraper Plugin | https://github.com/hvkeyn/openclaw-plugin-web-scraper |
| Decodo OpenClaw Skill | https://github.com/Decodo/decodo-openclaw-skill |
| OpenClaw Ultra Scraping | https://github.com/LeoYeAI/openclaw-ultra-scraping |
| TanStack Table | https://github.com/TanStack/table |
| React Email | https://github.com/resend/react-email |
| Playwright | https://github.com/microsoft/playwright |
| React Scan | https://github.com/aidenybai/react-scan |

## 1. Executive Summary

The foundation for mdeai contests should be the existing CopilotKit + Mastra pattern already aligned with `mdeapp`, not a copied contest app. The contest vertical should borrow deterministic voting ideas from Helios, live-event UI ideas from OpenStreamPoll, ticket/check-in workflow ideas from Hi.Events, admin table patterns from TanStack Table, email template patterns from React Email, and proof discipline from Playwright.

MVP should not include autonomous scraping, autonomous social publishing, full live overlays, or multi-agent swarms. For Miss Medellin Beauty Contest Finals, the first production slice is: organizer contest setup, contestant profiles, deterministic vote ledger, Stripe paid votes/tickets, QR check-in, judge scoring, WhatsApp share/vote links, sponsor proposal drafts, and Playwright proof.

## 2. Repo Score Table

| Repo | Score /100 | Use Level | Best Feature | Use For mdeai | Avoid |
|---|---:|---|---|---|---|
| CopilotKit Mastra Integration | 96 | FOUNDATION | Next.js + CopilotKit + Mastra bridge | Contest AI workspace, approval cards, agent state | OpenAI default, weather demo domain |
| Playwright | 96 | FOUNDATION | Reliable browser E2E and traces | Vote, payment, QR, admin proof gates | Treating browser checks as optional |
| TanStack Table | 94 | FOUNDATION | Headless data grids | Sponsor CRM, contestants, vote audit, moderation queues | Copying demo styling blindly |
| Helios Server | 93 | STRONG REFERENCE | End-to-end verifiable voting concepts | Vote receipts, audit trail, tally freeze concepts | Importing full crypto election system into MVP |
| Hi.Events | 91 | STRONG REFERENCE | Event ticketing and QR check-in | Ticket tiers, orders, check-in, attendee ops | Copying AGPL code into proprietary app |
| React Email | 90 | STRONG REFERENCE | React-based email templates | Sponsor proposal emails, ticket confirmations | Making email primary over WhatsApp in Colombia |
| OpenStreamPoll | 88 | POST-MVP | OBS overlays and QR live voting | Live finals second-screen and overlays | Using IP/browser fingerprint as vote truth |
| Google ADK Samples | 88 | STRONG REFERENCE | Agent workflows, HITL, geo/location examples | Venue/sponsor geo intelligence | Treating samples as supported product code |
| Trigger.dev | 86 | POST-MVP | Durable jobs, waits, HITL, queues | Future long-running sponsor/search jobs | Adding workflow platform before Supabase queues prove insufficient |
| Postiz | 84 | POST-MVP | Social scheduling and campaign API | Approved campaign scheduling after MVP | AGPL code copy, autonomous publishing |
| React Scan | 83 | POST-MVP | React render/perf diagnostics | Leaderboard/dashboard perf checks | Shipping dev-only tooling to users |
| OpenClaw Web Scraper Plugin | 78 | POST-MVP | Search/fetch/crawl tools | Sponsor discovery sandbox | Unapproved scraping/outreach |
| Decodo OpenClaw Skill | 76 | POST-MVP | Structured SERP/universal scraping | Paid sponsor enrichment pipeline | CAPTCHA/proxy-heavy workflows in MVP |
| OpenClaw Ultra Scraping | 72 | POST-MVP | Advanced adaptive scraping | Deep enrichment only after legal review | Anti-bot bypass by default |
| Photography Contest ReactJS | 62 | UI INSPIRATION | Basic gallery/contest views | Contestant card and photo gallery ideas | CRA/Mongo/Firebase/client auth patterns |
| Photo Contest CMS | 45 | AVOID | Airtable-backed old photo contest | Historical cautionary reference | Archived, no tests, old jQuery/Airtable stack |
| CopilotKit A2A Travel Showcase | 74 | POST-MVP | A2A agent visualization and HITL | Future sponsor/venue/marketing agent collaboration | Multi-service swarm in MVP, latest imports mismatch |

## 3. Deep Repo Analysis

### CopilotKit Mastra Integration

- Purpose: Starter for CopilotKit UI connected to Mastra agents through AG-UI.
- Best features: `CopilotKit` provider, `/api/copilotkit` runtime, `useCoAgent`, generative UI cards, `renderAndWaitForResponse`.
- Reuse: Runtime shape, local agent bridge, shared state, approval-card pattern.
- Do not reuse: OpenAI model default, weather domain, demo copy.
- Best mdeai use case: Roberto creates Miss Medellin finals through an AI-assisted contest setup workspace.
- Risks/blockers: Must keep CopilotKit pinned to the project version and use Gemini only.
- License concerns: MIT; safe to reference.
- Testing quality: Starter-level; add mdeai tests.
- Suggested tasks: `CONTEST-AI-001` CopilotKit contest workspace; `CONTEST-AI-002` approval card primitives.
- Final score: 96.

### CopilotKit A2A Travel Showcase

- Purpose: Multi-agent A2A demo with CopilotKit/AG-UI and specialized agents.
- Best features: Agent collaboration visualization, budget approval flow, structured cards.
- Reuse: UI mental model for future sponsor, venue, and marketing agent collaboration.
- Do not reuse: Multi-port service topology, OpenAI dependency, multiple agent frameworks in MVP.
- Best mdeai use case: Post-MVP activation planner where sponsor, venue, and campaign agents collaborate on a finals weekend plan.
- Risks/blockers: Overengineering and ops complexity.
- License concerns: CopilotKit MIT, but verify all nested agent dependencies before reuse.
- Testing quality: Demo-oriented.
- Suggested tasks: `POSTMVP-A2A-001` evaluate A2A only after MVP workflow proof.
- Final score: 74.

### Helios Server

- Purpose: Apache-licensed end-to-end verifiable election system.
- Best features: Cast vote model, vote hash/tinyhash, voter hash, encrypted tally, frozen election lifecycle, vote verification command.
- Reuse: Concepts for append-only vote receipts, audit snapshots, tally freeze, no post-tally voter mutation.
- Do not reuse: Full cryptographic election stack for beauty-contest MVP.
- Best mdeai use case: Fans receive a vote receipt for Miss Medellin public voting while Supabase retains deterministic vote truth.
- Risks/blockers: Complex crypto UX; can confuse consumer voting if introduced too early.
- License concerns: Apache-2.0; concept reuse is safe.
- Testing quality: Django tests and management commands exist; still not directly portable.
- Suggested tasks: `VOTE-001` vote ledger; `VOTE-006` receipt hash; `VOTE-010` tally freeze.
- Final score: 93.

### OpenStreamPoll

- Purpose: MIT Symfony live polling app for streamers with OBS and QR support.
- Best features: Active poll lifecycle, OBS browser source, QR source, simple admin, poll result view.
- Reuse: Overlay routes, QR live poll UX, "only one active poll" idea for live moments.
- Do not reuse: IP/user-agent visitor ID as security boundary; PHP/Symfony code.
- Best mdeai use case: During evening gown round, audience scans a QR and sees live engagement on screen.
- Risks/blockers: Live overlays are public and unforgiving; weak voter identity for paid or official voting.
- License concerns: MIT; pattern reuse safe.
- Testing quality: Unit tests for entities/services; no mdeai-stack E2E.
- Suggested tasks: `POSTMVP-LIVE-001` overlay prototype; `POSTMVP-LIVE-002` QR second-screen smoke.
- Final score: 88.

### Hi.Events

- Purpose: AGPL event ticketing and management platform.
- Best features: Ticket types, attendee management, Stripe, QR check-in, check-in logs, refunds, webhooks, event dashboard.
- Reuse: Domain model patterns for event, order, attendee, ticket, check-in list, capacity, webhook logs.
- Do not reuse: Source code unless mdeai accepts AGPL obligations; full platform scope.
- Best mdeai use case: VIP ticket QR for Miss Medellin finals at Plaza Mayor.
- Risks/blockers: Huge codebase; AGPL; far more feature surface than MVP needs.
- License concerns: AGPL-3.0 plus attribution clause; copy no code into proprietary mdeai.
- Testing quality: Unit workflow present; large production-style app.
- Suggested tasks: `TICKET-001` ticket tiers; `TICKET-002` Stripe checkout; `TICKET-004` QR check-in logs.
- Final score: 91.

### Postiz

- Purpose: AGPL social media scheduling platform with public API/SDK ecosystem.
- Best features: Social account integrations, scheduling UX, campaign calendar, approval-friendly external API.
- Reuse: Integration/API idea after MVP, campaign state model, status sync.
- Do not reuse: AGPL app code; autonomous publishing; broad social auth scope in MVP.
- Best mdeai use case: Patricia approves contestant vote-push posts and schedules them after legal/brand review.
- Risks/blockers: Social platform policy risk, token storage, AGPL copy risk, operational history shows Postiz can be infra-heavy.
- License concerns: AGPL-3.0; integrate via API/SaaS or isolate if self-hosting.
- Testing quality: Jest scripts and monorepo tests exist; not inspected deeply.
- Suggested tasks: `POSTMVP-SOCIAL-001` Postiz draft sync; `POSTMVP-SOCIAL-002` approved schedule status.
- Final score: 84.

### Google ADK Samples

- Purpose: Apache-licensed sample agents across Python, TypeScript, Go, Java, Kotlin, Android.
- Best features: HITL examples, travel/location patterns, marketing agency, retail location strategy, realtime conversational agent.
- Reuse: Agent structure and geo reasoning patterns for sponsor/venue intelligence.
- Do not reuse: Random sample agents or unsupported demo code as product modules.
- Best mdeai use case: Find fashion sponsors near Provenza or venue package ideas near El Poblado.
- Risks/blockers: Samples change quickly; model/API names must be re-verified before coding.
- License concerns: Apache-2.0.
- Testing quality: Mixed by sample; use as patterns, not proof.
- Suggested tasks: `GEO-001` Places/Routes adapter; `GEO-003` sponsor heatmap; `AI-EVAL-002` grounded geo evals.
- Final score: 88.

### Trigger.dev

- Purpose: Apache workflow/job automation platform for durable AI tasks.
- Best features: Long-running jobs, retries, queues, HITL waitpoints, observability, environments.
- Reuse: Future workflow architecture vocabulary and retry/HITL model.
- Do not reuse: Full platform in MVP unless Supabase Edge Functions/queues fail.
- Best mdeai use case: Daily sponsor search and enrichment jobs once OpenClaw is approved.
- Risks/blockers: Additional vendor/platform surface, cost/ops, overengineering.
- License concerns: Apache-2.0.
- Testing quality: Strong monorepo scripts including Playwright and Vitest.
- Suggested tasks: `POSTMVP-JOBS-001` compare Trigger.dev vs Supabase queues after MVP.
- Final score: 86.

### Photography Contest ReactJS

- Purpose: MERN-style photo contest frontend with galleries, contest joins, upload, voting, admin.
- Best features: Basic contest/gallery flow, admin create contest, contestant photos.
- Reuse: UI inspiration for contestant cards and gallery states.
- Do not reuse: CRA, bootstrap-heavy layout, backend/API assumptions, voting/auth patterns.
- Best mdeai use case: Fan browses contestant photos before voting.
- Risks/blockers: Frontend-only in local clone, weak production posture.
- License concerns: MIT.
- Testing quality: CRA test setup only; no strong E2E evidence.
- Suggested tasks: `UI-002` contestant gallery wireframe.
- Final score: 62.

### Photo Contest CMS

- Purpose: Archived Airtable/jQuery photo contest webapp.
- Best features: Minimal rating/gallery concept.
- Reuse: Nothing beyond historical UX caution.
- Do not reuse: Airtable as truth, jQuery/Bootstrap v4 alpha, no tests, archived code.
- Best mdeai use case: Avoid as architecture; maybe compare why Supabase-ledger is needed.
- Risks/blockers: Archived since 2017; no production-grade path.
- License concerns: MIT, but not useful.
- Testing quality: `npm test` is placeholder.
- Suggested tasks: None.
- Final score: 45.

### OpenClaw Web Scraper Plugin

- Purpose: MIT OpenClaw plugin exposing DuckDuckGo search, fetch, and batch crawl tools.
- Best features: Simple agent-facing search/fetch/crawl tool split.
- Reuse: Adapter boundary and tool naming for sponsor discovery sandbox.
- Do not reuse: Unapproved scraping execution, remote scraper credentials, broad crawl powers.
- Best mdeai use case: Draft sponsor leads for salons, fashion brands, and nightlife venues.
- Risks/blockers: Compliance, source permission, bot/crawl load, audit logging.
- License concerns: MIT; verify remote scraper dependency separately.
- Testing quality: Build script only visible; add mdeai sandbox tests.
- Suggested tasks: `POSTMVP-OPENCLAW-001` allowed-source lead discovery sandbox.
- Final score: 78.

### Decodo OpenClaw Skill

- Purpose: OpenClaw skill for Decodo scraping API: Google SERP, universal scrape, Amazon, YouTube, Reddit.
- Best features: Structured SERP and universal extraction via paid API.
- Reuse: Optional paid enrichment provider behind an approval-gated adapter.
- Do not reuse: CAPTCHA/proxy-heavy behavior for MVP; consumer platform scraping without review.
- Best mdeai use case: Enrich approved sponsor prospects after Patricia approves search criteria.
- Risks/blockers: Legal/TOS, cost, proxy reputation, data provenance.
- License concerns: README says MIT; confirm package/repo license before vendor use.
- Testing quality: Minimal dependency footprint; no strong local tests seen.
- Suggested tasks: `POSTMVP-OPENCLAW-002` enrichment provider abstraction.
- Final score: 76.

### OpenClaw Ultra Scraping

- Purpose: Advanced OpenClaw scraping skill with browser, stealth, adaptive selectors, proxy rotation.
- Best features: Deep extraction and adaptive element tracking.
- Reuse: Only as a late-stage enrichment option in a sandbox.
- Do not reuse: Cloudflare/CAPTCHA bypass defaults, broad crawl modes, autonomous daily runs.
- Best mdeai use case: Enterprise lead enrichment after legal review and allowlist.
- Risks/blockers: Highest scraping compliance risk in the set.
- License concerns: MIT.
- Testing quality: Script/tool oriented; mdeai needs its own replay tests.
- Suggested tasks: `ENTERPRISE-OPENCLAW-001` legal-reviewed scraping lab.
- Final score: 72.

### TanStack Table

- Purpose: MIT headless table/datagrid library.
- Best features: Sorting, filtering, row selection, server-side-friendly state.
- Reuse: Install library/patterns for admin tables.
- Do not reuse: Copy internal library code; overbuild grid features before data model stabilizes.
- Best mdeai use case: Patricia reviews contestants, sponsor leads, vote anomalies, and check-ins in dense dashboards.
- Risks/blockers: v9/alpha default branch; choose stable package version deliberately.
- License concerns: MIT.
- Testing quality: Strong library test/lint setup.
- Suggested tasks: `ADMIN-001` TanStack-backed audit table; `SPONSOR-003` CRM table.
- Final score: 94.

### React Email

- Purpose: MIT React components/templates for email.
- Best features: Email-safe primitives, preview tooling, provider examples.
- Reuse: Email templates for sponsor proposals, ticket confirmations, judge invites.
- Do not reuse: Email as replacement for WhatsApp-first Colombian workflows.
- Best mdeai use case: Sponsor proposal email draft generated by AI and approved by Patricia.
- Risks/blockers: Provider deliverability and unsubscribe/compliance.
- License concerns: MIT.
- Testing quality: Active monorepo with tests and examples.
- Suggested tasks: `EMAIL-001` sponsor proposal template; `EMAIL-002` ticket confirmation template.
- Final score: 90.

### Playwright

- Purpose: Apache browser automation and E2E testing framework.
- Best features: Isolated browser contexts, traces, screenshots/videos, locators, MCP/CLI support.
- Reuse: Direct dependency for mdeai E2E proof.
- Do not reuse: Fragile selectors; uncontrolled external network tests.
- Best mdeai use case: Lucía proves vote, Stripe test checkout, QR check-in, and admin scoring before a live finals event.
- Risks/blockers: Needs deterministic test data and stable local server boot.
- License concerns: Apache-2.0.
- Testing quality: Excellent.
- Suggested tasks: `TEST-001` Playwright setup; `TEST-004` voting E2E; `TEST-006` QR check-in E2E.
- Final score: 96.

### React Scan

- Purpose: React performance analyzer.
- Best features: Visual render hot-spot detection, Next.js setup guidance, E2E in repo.
- Reuse: Dev-only performance checks for realtime dashboards and leaderboards.
- Do not reuse: Production script by default; premature perf tuning.
- Best mdeai use case: Diagnose slow live leaderboard renders before post-MVP live overlays.
- Risks/blockers: Dev tool; may add noise if enabled globally.
- License concerns: MIT.
- Testing quality: Playwright E2E present.
- Suggested tasks: `POSTMVP-PERF-001` React Scan dev-only check.
- Final score: 83.

## 4. Patterns To Reuse

### AI UI

- Use CopilotKit Mastra integration for the runtime route, `useCoAgent`, shared state, and human approval cards.
- Use A2A travel only as a future visualization reference; MVP should have a small agent count.

### Mastra Workflows

- Build deterministic tools with policy wrappers: draft, validate, queue approval, commit via controlled API.
- Keep contest setup, sponsor proposal, and marketing draft workflows separate from vote and payment truth.

### Voting Integrity

- Borrow Helios concepts: vote receipt hash, cast vote audit, freeze before tally, no voter-list mutation after tally start.
- Implement in Supabase SQL with append-only ledger rows, constraints, RPCs, audit tables, and admin snapshots.

### Live Voting / OBS Overlays

- Borrow OpenStreamPoll overlay routes and QR display concept.
- Keep official vote truth separate from livestream engagement polls.

### Ticketing / QR Check-In

- Borrow Hi.Events concepts: ticket tiers, order status, attendee status, QR check-in log, capacity.
- Implement mdeai-specific Stripe Checkout and webhook-only fulfillment.

### Sponsor CRM

- Use TanStack Table for dense review queues.
- Model sponsor prospects, proposal drafts, approval states, outreach logs, and ROI events in Supabase.

### OpenClaw Scraping

- Reuse adapter boundaries: search, fetch, enrich, summarize, queue draft.
- Require allowlist, quotas, audit logs, and human approval before outreach.

### Social Scheduling

- Integrate Postiz only after manual AI campaign drafts work.
- Postiz should receive approved content only; no autonomous campaign launch.

### Google Maps / ADK

- Use ADK samples for workflow shape and grounded tool calls.
- Places/Routes calls must use field masks and cache/place IDs in SQL.

### Tables/Admin Dashboards

- TanStack Table is the standard for admin grids: contestants, votes, sponsors, check-ins, moderation.

### Email

- React Email is suitable for sponsor proposals and ticket emails.
- WhatsApp remains primary for reminders and fan engagement.

### Testing

- Playwright is a foundation dependency.
- Every task needs route, SQL, API, browser, and negative proof where applicable.

## 5. Roadmap Additions

| Order | Task ID | Task | Repo Inspiration | Skill/Tech | MVP/Post-MVP | Test Required |
|---:|---|---|---|---|---|---|
| 1 | CONTEST-001 | Contest route namespace and feature flag | CopilotKit Mastra | Next.js, mde-task-lifecycle | MVP | Route 200, no nav regression |
| 2 | CONTEST-002 | Contest/event schema and RLS | Helios, Hi.Events | Supabase SQL | MVP | SQL constraints, RLS deny/allow |
| 3 | CONTEST-003 | Contestant profile model and UI | Photography Contest | Next.js, storage | MVP | Upload validation, browser profile flow |
| 4 | AI-001 | CopilotKit contest workspace | CopilotKit Mastra | CopilotKit, Mastra, Gemini | MVP | `/api/copilotkit` probe, card render |
| 5 | ADMIN-001 | TanStack admin tables | TanStack Table | React table | MVP | Sorting/filtering/empty/error states |
| 6 | VOTE-001 | Append-only vote ledger | Helios | Supabase RPC | MVP | Duplicate vote, closed window, audit row |
| 7 | VOTE-002 | Public free voting UI | Helios, OpenStreamPoll | Next.js, Supabase | MVP | Mobile browser vote E2E |
| 8 | STRIPE-001 | Paid votes and ticket checkout | Hi.Events | Stripe | MVP | Webhook fixture, idempotency, no client fulfillment |
| 9 | TICKET-001 | QR ticket issuance | Hi.Events | Stripe, QR | MVP | QR generated only after paid webhook |
| 10 | TICKET-002 | QR check-in log | Hi.Events | Supabase RPC | MVP | Duplicate scan rejected/logged |
| 11 | JUDGE-001 | Judge scoring and lock | Helios freeze concept | SQL, admin UI | MVP | Score formula, lock, no post-lock edit |
| 12 | SPONSOR-001 | Sponsor CRM and package builder | Hi.Events, TanStack | Supabase, tables | MVP | CRUD + RLS + approval state |
| 13 | SPONSOR-002 | AI sponsor proposal drafts | React Email, CopilotKit | Gemini, React Email | MVP | Draft-only, approval required |
| 14 | WHATSAPP-001 | WhatsApp vote/share links | OpenStreamPoll QR concept | WhatsApp provider | MVP | Opt-in, signed link, template proof |
| 15 | TEST-001 | Playwright foundation | Playwright | Playwright | MVP | Local boot + smoke spec |
| 16 | TEST-002 | Vote/payment/check-in E2E | Playwright | Playwright, Stripe fixtures | MVP | Trace on failure |
| 17 | GEO-001 | Sponsor geo discovery draft | ADK samples | ADK, Maps, Places | Post-MVP unless pilot needs | Field mask, cache, source proof |
| 18 | LIVE-001 | OpenStreamPoll-style live overlay | OpenStreamPoll | Realtime, OBS browser source | Post-MVP | Overlay route, QR, non-official vote boundary |
| 19 | OPENCLAW-001 | Lead discovery sandbox | OpenClaw plugins | OpenClaw | Post-MVP | Allowlist, quota, audit replay |
| 20 | POSTIZ-001 | Approved campaign scheduling | Postiz | Postiz API | Post-MVP | Approval, status sync, rollback |
| 21 | JOBS-001 | Durable background workflow evaluation | Trigger.dev | Trigger.dev/Supabase queue | Post-MVP | Retry/idempotency comparison |
| 22 | PERF-001 | Realtime dashboard perf scan | React Scan | React Scan | Post-MVP | Dev-only perf capture |

## 6. Code Reuse Decision

| Repo | Copy Code? | Copy Pattern? | Why |
|---|---|---|---|
| CopilotKit Mastra Integration | Limited | Yes | Local Phase 1 foundation already follows this shape; adapt to Gemini. |
| CopilotKit A2A Travel | No | Later | Useful multi-agent UI, too complex for MVP. |
| Helios Server | No | Yes | Strong integrity concepts, but crypto stack is not MVP-friendly. |
| OpenStreamPoll | No | Yes | Overlay/QR pattern useful, PHP stack and voter identity not portable. |
| Hi.Events | No | Yes | AGPL code risk; event operations model is excellent. |
| Postiz | No | Yes/API | AGPL; integrate through approved API/SaaS after MVP. |
| Google ADK Samples | No | Yes | Samples inform agent/geo workflow, not production modules. |
| Trigger.dev | No | Later | Platform useful if background jobs outgrow Supabase queues. |
| Photography Contest ReactJS | No | UI only | Old/simple frontend; weak production patterns. |
| Photo Contest CMS | No | No | Archived Airtable/jQuery app. |
| OpenClaw Web Scraper | No | Yes | Tool boundary useful; execution must be sandboxed. |
| Decodo OpenClaw Skill | No | Later | Provider abstraction useful after legal/cost review. |
| OpenClaw Ultra Scraping | No | Rarely | High compliance risk; enterprise lab only. |
| TanStack Table | Install package | Yes | Use stable package, not source copy. |
| React Email | Install package | Yes | Use components/templates with mdeai branding. |
| Playwright | Install package | Yes | Core proof framework. |
| React Scan | Dev dependency later | Yes | Dev-only perf diagnosis. |

## 7. MVP Implementation Plan

1. CopilotKit + Mastra workspace: create contest assistant, approval cards, sponsor draft card, and deterministic tool policy registry.
2. Supabase contest/vote schema: contests, contestants, contest_events, vote_windows, vote_ledger, paid_vote_orders, judge_scores, audit_events.
3. Contestant profile UI: public contestant page, admin approval, media validation, vote CTA.
4. Voting ledger: append-only free votes, signed voter/session rules, anomaly signals, read-only leaderboard snapshots.
5. Stripe paid votes/tickets: Checkout Sessions, webhook-only fulfillment, idempotency, audit logs.
6. QR check-in: ticket QR issuance, check-in RPC, duplicate scan rejection, staff UI.
7. Sponsor proposal drafts: sponsor CRM, package builder, Gemini draft generation, React Email preview, manual send.
8. WhatsApp share/vote links: opt-in templates, signed links, contestant/fan reminders.
9. Playwright tests: route smoke, public voting, paid vote webhook fixture, QR scan, judge score lock, sponsor draft approval.

## 8. Post-MVP Plan

- OpenStreamPoll-style live overlays for non-official audience engagement and OBS.
- Helios-style public receipt page and stronger voter verifiability.
- OpenClaw daily sponsor discovery after legal/TOS review, allowlists, and quotas.
- Postiz scheduling after manual campaign drafts prove useful.
- ADK sponsor geo intelligence for Provenza, Laureles, El Poblado, Plaza Mayor, Comuna 13, and tourism packages.
- React Scan performance checks for live dashboards and realtime leaderboards.
- Advanced analytics for sponsor ROI, contestant growth, QR/ticket attribution, and campaign lift.

## 9. Red Flags

| Risk | Repos affected | Mitigation |
|---|---|---|
| AGPL contamination | Hi.Events, Postiz | Do not copy code; use concepts or API integration. |
| Voting overcomplexity | Helios | Start with deterministic SQL ledger; add receipts later. |
| Weak vote identity | OpenStreamPoll, simple contest apps | Use signed links, rate limits, audit logs, and paid vote webhook proof. |
| Old/insecure stack | Photo Contest CMS, Photography Contest ReactJS | UI inspiration only. |
| Scraping compliance | OpenClaw plugins, Decodo, Ultra Scraping | Allowlist, legal review, quotas, audit log, human approval. |
| Overengineering | A2A Travel, Trigger.dev, livestream overlays | Keep post-MVP unless paid pilot requires them. |
| Payment truth drift | Hi.Events inspiration, Stripe integration | Stripe owns money; Supabase stores webhook-derived state. |
| AI control risk | CopilotKit/Mastra/ADK/OpenClaw/Postiz | AI drafts and recommends; humans approve sensitive actions. |

## 10. Final Recommendation

Learn and implement in this order:

1. CopilotKit Mastra Integration: build the AI contest workspace inside `mdeapp`.
2. Helios: design the Supabase vote ledger, receipt hash, and freeze rules.
3. Hi.Events: model tickets, attendees, orders, capacity, and QR check-in.
4. TanStack Table: build Patricia's admin review surfaces.
5. Playwright: wire proof gates before calling MVP tasks Done.
6. React Email: add sponsor proposal and ticket templates after sponsor CRM exists.
7. ADK Samples: add venue/sponsor geo intelligence after core contest/voting works.
8. OpenStreamPoll: add live overlays only after official voting and QR flows are stable.
9. Postiz: integrate approved campaign scheduling only after manual drafts convert.
10. OpenClaw plugins: add sponsor discovery only with source allowlists and approval queues.
11. Trigger.dev: evaluate only when Supabase queues/Edge Functions are insufficient.
12. React Scan: use as a dev-only performance tool for realtime surfaces.
13. Photo contest repos: use as UI cautionary examples, not architecture.

The first mdeai milestone should be boring and provable: Miss Medellin contest setup, contestants, votes, paid votes/tickets, QR check-in, judge scoring, sponsor proposal drafts, WhatsApp share links, and Playwright proof.
