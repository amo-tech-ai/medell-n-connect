---
id: CTEST-003
title: Tickets and paid-vote payment-derived schema
status: Draft
priority: P0
phase: Contest payments foundation
effort: 2-3d
depends_on:
  - CTEST-001
  - CTEST-002
skill:
  - mde-supabase
  - mde-stripe
docs:
  - ../docs/01-mermaid-diagrams.md
repo_refs:
  - /home/sk/mdeai/github/events/Hi.Events
---

# CTEST-003 — Tickets And Paid-Vote Payment-Derived Schema

## Goal

Add tickets, QR check-in, and paid vote credit state where Stripe owns money and Supabase stores webhook-derived truth.

## Tables / Functions

| Object | Purpose |
|---|---|
| `contest_ticket_tiers` | General/VIP/media/sponsor ticket tiers and capacity. |
| `contest_ticket_orders` | Pending/paid/refunded/cancelled ticket orders. |
| `contest_tickets` | Issued QR-bearing tickets. |
| `contest_check_ins` | Append-only QR scan records. |
| `paid_vote_products` | Vote bundle products. |
| `paid_vote_orders` | Stripe checkout/session mapping. |
| `paid_vote_credits` | Webhook-issued vote credits. |
| `stripe_webhook_events` | Idempotency log. |
| `issue_ticket_from_paid_order()` | Creates tickets only after webhook proof. |
| `consume_paid_vote_credit()` | Moves paid credit into vote flow safely. |
| `check_in_ticket()` | Validates QR and logs scan. |

## Pattern Sources

| Repo | Use |
|---|---|
| Hi.Events | Ticket tier, attendee, check-in, order status patterns. |
| EVT-01 | Existing mdeai ticket checkout/webhook port pattern. |

## Acceptance Criteria

- [ ] Checkout creates pending order only.
- [ ] Webhook signature verification is required for paid status.
- [ ] Duplicate webhook is idempotent.
- [ ] QR ticket is issued only after paid webhook.
- [ ] Duplicate QR scan is rejected or logged as duplicate without granting second entry.
- [ ] Paid vote credits are issued from webhook-derived state only.

## Tests / Proof

- [ ] Stripe fixture creates paid ticket order.
- [ ] Duplicate Stripe event does not double-issue tickets or credits.
- [ ] Invalid signature rejected.
- [ ] SQL proof for ticket issued and check-in logged.
- [ ] SQL proof for paid vote credit consumed once.

## Do Not Do

- Do not fulfill payment from success URL.
- Do not store Stripe secret keys in browser/client source.
- Do not implement Stripe Connect until sponsor payouts require it.
