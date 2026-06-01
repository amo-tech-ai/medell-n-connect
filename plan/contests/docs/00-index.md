---
title: Contest Docs Index
status: Strategic appendix
date: 2026-05-24
---

# Contest Docs Index

This folder contains the master contest PRD pack plus separate improvement docs for MVP execution, CopilotKit Cloud, Gemini, testing, database strategy, UI, OpenClaw, automations, governance, proof gates, and security.

## Read First

| Doc | Purpose |
|---|---|
| [MVP-SCOPE.md](./MVP-SCOPE.md) | Audit-friendly short MVP scope and defer list. |
| [11-mvp-scope.md](./11-mvp-scope.md) | Smallest executable MVP slice. Read this before implementation planning. |
| [12-task-proof-gates.md](./12-task-proof-gates.md) | Evidence requirements for task Done status. |
| [13-security-checklist.md](./13-security-checklist.md) | Security gates for votes, paid votes, WhatsApp, scraping, outreach, moderation, and winners. |
| [14-github-repo-audit-roadmap.md](./14-github-repo-audit-roadmap.md) | Repo audit and implementation roadmap from contest/event/AI open-source references. |

## Master Docs

| Doc | Purpose |
|---|---|
| [prd-event-contest.md](./prd-event-contest.md) | Full production-grade PRD for the AI contest/event/sponsorship platform. Use as source material, not the MVP task list. |
| [architecture.md](./architecture.md) | System architecture, database boundaries, security, ledgers, and diagrams. |
| [roadmap.md](./roadmap.md) | Core/MVP/post-MVP/advanced/enterprise roadmap and staged plan. |

## Separate Improvement Docs

| # | Doc | Purpose |
|---:|---|---|
| 1 | [01-mvp-simplicity-rules.md](./01-mvp-simplicity-rules.md) | Keep the MVP realistic, modular, and not overengineered. |
| 2 | [02-copilotkit-cloud-strategy.md](./02-copilotkit-cloud-strategy.md) | CopilotKit Cloud vs self-hosted strategy and migration path. |
| 3 | [03-gemini-35-flash-agent-features.md](./03-gemini-35-flash-agent-features.md) | Gemini 3.5 Flash model/workflow strategy with implementation-time verification caveats. |
| 4 | [04-continuous-testing-strategy.md](./04-continuous-testing-strategy.md) | Playwright, Chrome DevTools MCP, workflow replay, AI eval, and stress testing plan. |
| 5 | [05-database-strategy.md](./05-database-strategy.md) | SQL, pgvector, AI memory, cache, realtime, audit, and anti-fraud data placement. |
| 6 | [06-task-implementation-order.md](./06-task-implementation-order.md) | Correct task sequence with dependencies, blockers, risk, effort, and MVP priority. |
| 7 | [07-wireframes-ui-systems.md](./07-wireframes-ui-systems.md) | Mobile-first wireframes, dashboards, CopilotKit cards, approvals, and live UI concepts. |
| 8 | [08-openclaw-outreach-strategy.md](./08-openclaw-outreach-strategy.md) | Instagram/sponsor/influencer discovery and draft-only outreach governance. |
| 9 | [09-top-mvp-automations.md](./09-top-mvp-automations.md) | Ranked automation pool with explicit MVP and post-MVP cut line. |
| 10 | [10-ai-governance-rules.md](./10-ai-governance-rules.md) | Strict AI allowed/forbidden actions and approval architecture. |
| 11 | [11-mvp-scope.md](./11-mvp-scope.md) | MVP-only extraction: contest setup, contestants, voting, tickets, judging, WhatsApp, sponsor drafts. |
| 12 | [12-task-proof-gates.md](./12-task-proof-gates.md) | Route, SQL, API, browser, local runtime, and negative-test evidence standards. |
| 13 | [13-security-checklist.md](./13-security-checklist.md) | Implementation security checklist for trust-sensitive contest surfaces. |
| 14 | [14-github-repo-audit-roadmap.md](./14-github-repo-audit-roadmap.md) | Practical GitHub repo audit, reuse decisions, and mdeai roadmap tasks. |

## MVP vs Post-MVP Boundary

| MVP | Post-MVP / Advanced |
|---|---|
| Contest setup, contestants, voting, Stripe tickets, judge scoring, WhatsApp reminders, sponsor proposal drafts | OpenClaw daily scraping, autonomous DMs, Postiz automation, livestream overlays, influencer automation, sponsor marketplace |
