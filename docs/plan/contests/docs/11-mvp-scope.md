---
title: MVP Scope
status: Strategic appendix
date: 2026-05-24
related:
  - ./01-mvp-simplicity-rules.md
  - ./06-task-implementation-order.md
  - ./roadmap.md
---

# MVP Scope

This is the execution slice for a first **Miss Medellin Beauty Contest Finals** pilot. It deliberately removes advanced automation and livestream complexity so the team can prove the contest trust loop first.

## MVP Goal

Run one credible beauty contest where:

- Roberto can create and publish the contest/event.
- Contestants can onboard and share profiles.
- Fans can vote and buy tickets.
- Judges can submit scores.
- Patricia can audit votes, payments, approvals, and winner snapshots.
- Sponsors can receive proposal drafts and one basic ROI report.

## In Scope

| Area | MVP capability | Proof required |
|---|---|---|
| Contest setup | Create contest, rounds, categories, rules, dates | Route proof + SQL row proof |
| Contestants | Application, profile, approval, public profile | Browser proof + SQL proof |
| Voting | Free vote, paid vote bundle, voting window, fraud signals | API proof + SQL ledger proof |
| Stripe tickets | General/VIP ticket checkout, webhook fulfillment, QR token | Stripe test proof + SQL proof |
| Judge scoring | Judge assignment, score submission, locked snapshot | SQL formula proof |
| Winner publish | Human-approved winner announcement from locked snapshot | Approval row + browser proof |
| WhatsApp reminders | Approved template reminders and secure links | Sandbox/provider proof |
| Sponsor proposal drafts | Three sponsor packages and deliverables checklist | CopilotKit approval card proof |
| Admin/moderation | Approval queue, vote review, contestant review | Browser proof |
| Testing gates | Unit, integration, browser, local runtime | Evidence file per task |

## Out Of Scope For MVP

| Deferred item | Target phase | Reason |
|---|---|---|
| OpenClaw daily scraping | Post-MVP/Advanced | Legal/TOS and spam risk. |
| Autonomous Instagram/LinkedIn DMs | Advanced | Brand and platform risk. |
| Postiz automated publishing | Post-MVP | Useful, but manual social posting is enough for pilot. |
| Livestream overlays | Post-MVP | Run voting/ticket trust first. |
| Full livestream production suite | Advanced | Provider and ops complexity. |
| Influencer automation | Post-MVP | Start with sponsor proposal drafts and manual influencer list. |
| Sponsor marketplace | Enterprise | Needs multiple contests and sponsor demand proof. |
| Complex pgvector memory | Post-MVP | SQL-first proof matters more. |
| Kubernetes/self-hosted CopilotKit | Enterprise | Too much ops before revenue proof. |
| Multi-city franchise controls | Enterprise | Single contest proof first. |

## MVP Agent Limit

| Agent | Allowed MVP work |
|---|---|
| `contestHostAgent` | Draft contest/event fields and approval requests. |
| `sponsorAgent` | Draft sponsor packages and fit summaries. |
| `marketingAgent` | Draft WhatsApp/social copy only; no autonomous publishing. |
| `votingIntegrityAgent` | Summarize SQL fraud signals; never modify votes. |
| `venueAgent` | Grounded venue/sponsor geography through ADK/Maps. |

No additional agent should be added unless a task proves a clear MVP blocker that the existing agents cannot cover.

## MVP Data Boundary

| Truth | Owner |
|---|---|
| Contest state | Supabase |
| Contestant state | Supabase |
| Votes | Supabase append-only ledger |
| Paid votes and tickets | Stripe webhook + Supabase fulfillment |
| Judge scores | Supabase append-only ledger |
| Winner snapshot | Supabase SQL/RPC |
| Sponsor proposal state | Supabase approvals |
| WhatsApp sends | Provider webhook + Supabase audit |

## MVP Exit Criteria

| Gate | Evidence |
|---|---|
| Contest published | Browser route + SQL contest row. |
| Contestants visible | Public profile route + approved contestant rows. |
| Free vote works | Vote API success + ledger row. |
| Duplicate/late vote blocked | Negative API proof + no ledger mutation. |
| Paid vote works | Stripe test webhook + paid vote/order row. |
| Ticket checkout works | Stripe test webhook + QR token row. |
| QR scan works | Valid/duplicate/invalid scan proof. |
| Judge scoring works | Score rows + locked snapshot. |
| Winner announcement gated | Approval row tied to snapshot id. |
| WhatsApp reminder works | Sandbox/provider send and delivery evidence. |
| Sponsor proposal ready | Proposal draft + approval card. |
| Local runtime works | `npm run dev` boot + relevant surface responds. |

