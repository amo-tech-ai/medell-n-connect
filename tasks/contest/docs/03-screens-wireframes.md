---
title: Contest Screens and Wireframes
status: Draft
date: 2026-05-25
skills:
  - mde-wireframe
  - copilotkit
---

# Contest Screens and Wireframes

These are low-fidelity implementation wireframes for the contest task pack. Phase 1 remains English-only.

## Screen Inventory

| Order | Path | Persona | Purpose | MVP |
|---:|---|---|---|---|
| 1 | `/host/contests/new` | Roberto | AI-assisted contest creation wizard | Yes |
| 2 | `/host/contests` | Roberto | Organizer contest list and status | Yes |
| 3 | `/contests/[slug]` | Fan/Contestant | Public contest page, contestants, tickets, voting CTA | Yes |
| 4 | `/contests/[slug]/contestants/[id]` | Fan | Contestant profile and share/vote links | Yes |
| 5 | `/contests/[slug]/vote` | Fan | Free/paid voting entry point | Yes |
| 6 | `/me/tickets` | Andres/Miguel | Ticket QR wallet | Reuse existing event task pattern |
| 7 | `/admin/contests` | Patricia | Contest ops dashboard | Yes |
| 8 | `/admin/contests/[id]/votes` | Patricia | Vote audit and fraud review | Yes |
| 9 | `/admin/contests/[id]/scores` | Judge/Patricia | Judge scoring and score lock | Yes |
| 10 | `/sponsors` | Patricia | Sponsor CRM and proposal queue | Yes |
| 11 | `/sponsors/proposals/[id]` | Patricia | AI proposal draft preview and approval | Yes |
| 12 | `/live/contests/[id]` | Producer | Live control and overlays | Post-MVP |

## 1. Roberto Contest Wizard

```text
Path: /host/contests/new
Persona: Roberto

┌──────────────────────────────────────────────────────────────────┐
│ Header: New contest                                               │
├───────────────┬──────────────────────────────────┬───────────────┤
│ Steps         │ Form canvas                       │ Copilot panel │
│ 1 Basics      │ Contest name                      │ "I can draft  │
│ 2 Venue       │ Date / time                       │ Miss Medellin │
│ 3 Contestants │ Divisions / rounds                │ Finals setup" │
│ 4 Tickets     │ Ticket tiers                      │               │
│ 5 Voting      │ Free/paid voting windows          │ Approval card │
│ 6 Review      │ Publish preview                   │               │
└───────────────┴──────────────────────────────────┴───────────────┘
```

States: draft, missing required fields, ready for approval, approved, rejected.

## 2. Public Contest Page

```text
Path: /contests/miss-medellin-finals
Persona: Fan

┌─────────────────────────────────────────────────────────────┐
│ Miss Medellin Beauty Contest Finals                         │
│ Date · Venue · Buy tickets · Vote now                       │
├─────────────────────────────────────────────────────────────┤
│ Contestants grid                                             │
│ [Photo][Name][District][Vote] [Photo][Name][District][Vote] │
│ [Photo][Name][District][Vote] [Photo][Name][District][Vote] │
├───────────────────────────┬─────────────────────────────────┤
│ Schedule                  │ Sponsor highlights              │
│ Rehearsal / final rounds  │ VIP sponsor cards               │
└───────────────────────────┴─────────────────────────────────┘
```

States: unpublished, published, voting closed, sold out, empty contestants.

## 3. Voting Page

```text
Path: /contests/[slug]/vote
Persona: Fan

┌─────────────────────────────────────────────────────┐
│ Vote for Miss Medellin                              │
├─────────────────────────────────────────────────────┤
│ Voting window status: Open until 8:30 PM            │
│                                                     │
│ Contestant selected: [Name + photo]                 │
│ [Free vote] [Buy vote pack]                         │
│                                                     │
│ Receipt panel after submit                          │
│ hash: vote_...                                      │
└─────────────────────────────────────────────────────┘
```

States: eligible, already voted, paid credits available, closed window, suspicious/review.

## 4. Patricia Admin Dashboard

```text
Path: /admin/contests
Persona: Patricia

┌────────────────────────────────────────────────────────────┐
│ Admin contests                                             │
├──────────────┬─────────────────────────────────────────────┤
│ Filters      │ Table: Contest · Status · Votes · Revenue   │
│ Status       │ Actions: Review · Freeze · Publish          │
│ Date         │                                             │
│ Risk level   │                                             │
└──────────────┴─────────────────────────────────────────────┘
```

Use TanStack Table. Required states: loading, empty, error, success, filtered no results.

## 5. Sponsor CRM

```text
Path: /sponsors
Persona: Patricia

┌─────────────────────────────────────────────────────────────┐
│ Sponsors                                                    │
├──────────────┬───────────────────────┬──────────────────────┤
│ Pipeline     │ Sponsor lead table    │ AI proposal preview  │
│ New          │ Brand · fit · package │ Draft only           │
│ Qualified    │ Status · next step    │ Approve / edit       │
│ Proposal     │                       │                      │
└──────────────┴───────────────────────┴──────────────────────┘
```

MVP rule: no automatic outreach. AI proposal drafts only.

## Mobile Notes

| Screen | Mobile behavior |
|---|---|
| Contest wizard | Stepper becomes top tabs; Copilot panel collapses into drawer. |
| Public contest page | Hero, CTAs, contestant cards single column. |
| Voting page | Sticky bottom vote button; receipt panel inline. |
| Admin tables | Priority columns only; detail drawer for row actions. |
| Sponsor CRM | Pipeline tabs above list; proposal preview in full-screen sheet. |
