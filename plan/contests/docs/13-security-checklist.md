---
title: Contest Security Checklist
status: Strategic appendix
date: 2026-05-24
related:
  - ./05-database-strategy.md
  - ./10-ai-governance-rules.md
  - ./12-task-proof-gates.md
---

# Contest Security Checklist

This checklist must be attached to every implementation task that touches votes, paid votes, tickets, WhatsApp, scraping, sponsor outreach, moderation, or winner publishing.

## Votes

| Check | Required |
|---|---|
| Append-only ledger | `vote_ledger` cannot be updated/deleted by app roles. |
| Voting window validation | Server checks start/end/status before accepting vote. |
| Token validation | QR/WhatsApp/web vote tokens are signed/hashed and expire. |
| Duplicate prevention | Unique constraints or RPC idempotency block duplicate votes. |
| Rate limits | Per user/device/IP where legally appropriate. |
| Audit | Accepted and rejected vote attempts create reviewable events. |
| AI boundary | AI can summarize anomalies but cannot write votes. |

## Paid Votes

| Check | Required |
|---|---|
| Stripe webhook required | Redirect success page never mints votes. |
| Signature verification | Webhook signature checked before fulfillment. |
| Idempotency | Stripe event id stored and replay-safe. |
| Metadata validation | contest/window/contestant/bundle metadata validated. |
| Refund/dispute handling | Paid vote status can be reviewed without mutating original ledger. |
| Fraud review | Stripe Radar signals and internal anomaly signals are recorded. |

## Tickets and QR Check-In

| Check | Required |
|---|---|
| Signed QR tokens | QR cannot be forged from visible ids. |
| Server validation | Scanner validates against server/API. |
| Duplicate scan handling | Duplicate returns warning, not second entry. |
| Staff role gate | Scanner route requires staff/admin event permission. |
| Offline fallback | Export list and supervisor override with reason code. |
| Audit | Every scan and override is logged. |

## WhatsApp

| Check | Required |
|---|---|
| Opt-in | Audience consent source stored. |
| Opt-out | Stop/unsubscribe path honored across campaigns. |
| Template compliance | Outbound reminders use approved templates. |
| Deep-link expiry | Voting/ticket links expire and are scoped. |
| PII minimization | Avoid unnecessary private data in message body. |
| Delivery webhooks | Provider delivery/failure events stored. |
| AI boundary | AI drafts; human approves batches. |

## Scraping and OpenClaw

| Check | Required |
|---|---|
| Legal/TOS review | Source category approved before scraping. |
| Source allowlist | Jobs restricted to approved domains/platforms/categories. |
| Public data only | No private/account-only scraping by default. |
| Rate limits | Per-source and per-campaign quotas. |
| Evidence logging | URL, timestamp, extracted fields, and output hash stored. |
| Draft-only | No outbound send from OpenClaw without approval id. |
| Kill switch | Patricia/admin can pause campaign/org/global automation. |

## Sponsor Outreach

| Check | Required |
|---|---|
| Contact source | Contact data has source evidence and purpose. |
| Human approval | Outreach draft requires approval before send. |
| Opt-out | Sponsor opt-out suppresses future outreach. |
| No bulk spam | Batch size and cadence limited. |
| Contract boundary | AI never sends final contract autonomously. |
| Payment boundary | AI never creates/collects money without Stripe/human approval. |

## Moderation

| Check | Required |
|---|---|
| Review queue | Contestant/media/comment flags enter moderation queue. |
| Human decision | Bans, disqualifications, and removals require reviewer. |
| Evidence | Moderation decision stores reason and evidence. |
| Appeal path | Serious actions have appeal/review path if business requires. |
| AI boundary | AI summarizes and recommends, never enforces alone. |

## Winner Publishing

| Check | Required |
|---|---|
| Locked formula | Formula version locked before scoring/voting closes. |
| Locked inputs | Score snapshot records input ids and formula version. |
| Human approval | Winner announcement tied to approval row. |
| Public explanation | Display deterministic formula/explanation. |
| No AI override | AI can explain snapshot, not alter it. |

