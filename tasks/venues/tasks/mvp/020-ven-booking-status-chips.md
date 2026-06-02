---
task_id: ven-020
mvp_step: 020
title: Booking status chips on detail panels
layer: UI
priority: P1
status: Not Started
depends_on: [VEN-021]
skills: [shadcn, copilotkit-develop]
doc: ../docs/02-booking-whatsapp.md
description: Status chip on Cafe/Restaurant/Nightlife detail when user has pending booking.
---

# VEN-19 — Booking status chips


## At a glance

| | |
|---|---|
| **For** | Sarah, Carlos, Tourist |
| **Surface** | `/chat` under booking |
| **Layer** | UI |

## What we're building

Status chips reflecting real DB status — pending, sent, confirmed, needs_user, cancelled.

## Features

- No fake confirmed state
- Poll or subscribe to row updates

## Agents & tools

None

## Workflows

Reflects Patricia + WA pipeline

## User journey

1. User submits booking → Pending chip.
2. Patricia sends WA → Sent.
3. Venue confirms → Confirmed chip.

## Acceptance

- [ ] Chip reflects DB status for current user + place_id
- [ ] Copy matches doc 02 table — no false "Confirmed"
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-020](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-020-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Status chips reflect DB status |
| **MCP** | — |
| **Chrome DevTools** | pending/confirmed on detail panels |
| **Playwright** | Status transition mock |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Realtime or poll for status updates

