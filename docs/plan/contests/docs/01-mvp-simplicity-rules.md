---
title: MVP Simplicity Rules
status: Strategic appendix
date: 2026-05-24
related:
  - ./prd-event-contest.md
  - ./architecture.md
  - ./roadmap.md
---

# MVP Simplicity Rules

The contest MVP should feel ambitious to users and boring to operate. Roberto should be able to run a credible beauty contest, Patricia should be able to audit it, and fans should be able to vote and buy tickets without the team operating a complex AI platform before product-market proof.

## Rule

Do not overengineer the MVP.

## MVP Priorities

| Priority | Meaning for Miss Medellin Finals |
|---|---|
| Fast iteration | Ship the contest, voting, sponsorship, and WhatsApp flows in thin vertical slices. |
| Operational simplicity | Keep one app, one database, one orchestration layer, and clear approval gates. |
| Production reliability | Vote, payment, ticket, and score paths must work when AI is unavailable. |
| Low infrastructure complexity | Prefer Next.js, Supabase, Stripe, CopilotKit Cloud, and Mastra before new services. |
| Minimal agent count | Start with 3-5 agents, not a swarm. |
| Deterministic workflows | SQL and Stripe own truth. |
| Approval-based automations | AI creates drafts and review queues; humans approve sensitive actions. |

## Avoid In MVP

| Avoid | Why |
|---|---|
| Autonomous multi-agent swarms | Hard to debug when Roberto is trying to publish a contest. |
| Excessive microservices | Slows delivery and multiplies deployment risk. |
| Autonomous outbound messaging | Sponsor spam risk and WhatsApp/social compliance risk. |
| Complex memory systems | Premature before the product has real contest usage. |
| Advanced AI orchestration | Mastra workflows are enough for MVP. |
| Overbuilt vector architecture | SQL filters and simple pgvector use are enough early. |
| Kubernetes | Too much ops for one contest vertical. |
| Fully custom streaming stack | Use a provider later; MVP can start with lightweight overlays and links. |

## Prefer In MVP

| Prefer | Implementation shape |
|---|---|
| Modular monolith | Build inside `mdeapp/` with domain folders and shared contracts. |
| Supabase-first architecture | PostgreSQL, RLS, RPCs, Realtime, and audit rows. |
| Edge/API routes | Sensitive vote/payment/approval commits go through server routes. |
| Queue-based workflows | Use job tables and status transitions before heavy worker infrastructure. |
| Approval-driven AI | CopilotKit cards show diffs and approve/reject actions. |
| Human-in-the-loop systems | Patricia can stop, freeze, approve, or reject. |
| Simple integrations | Stripe Checkout, WhatsApp templates, Postiz drafts, OpenClaw draft-only. |

## MVP Scope

| Included | Not included early |
|---|---|
| Beauty contest setup | Multi-city franchise admin |
| Contestant onboarding | Native mobile apps |
| Public and paid voting | Autonomous winner selection |
| Judge scoring | AI judge replacement |
| Sponsorship workflows | Full sponsor marketplace |
| AI marketing drafts | Autonomous social publishing |
| WhatsApp engagement | Complex channel automation |
| Event management | Full production livestream suite |
| Basic influencer workflows | Automated Instagram DM campaigns |

## Minimal Agent Set

| Agent | MVP job |
|---|---|
| `contestHostAgent` | Help Roberto create contest/event drafts and approval requests. |
| `sponsorAgent` | Draft sponsor packages and lead-fit summaries. |
| `marketingAgent` | Draft WhatsApp/social campaigns and Postiz schedules. |
| `votingIntegrityAgent` | Summarize deterministic vote anomaly signals. |
| `venueAgent` | Use ADK/Maps for grounded venue and sponsor geography. |

## Done Standard

No MVP task is Done without:

- Localhost runtime proof.
- DB or API evidence for touched truth paths.
- Browser proof for touched UI surfaces.
- Approval gate proof for sensitive actions.
- Explicit note that votes, money, and winners remain deterministic.

