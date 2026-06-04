---
title: Wireframes and UI Systems
status: Strategic appendix
date: 2026-05-24
related:
  - ./prd-event-contest.md
---

# Wireframes and UI Systems

The UI should be mobile-first for fans and contestants, work-focused for Roberto and Patricia, and card-driven where AI proposes work that needs approval.

## UI Principles

| Principle | Product meaning |
|---|---|
| Mobile-first public flows | Voting, WhatsApp links, contestant profiles, and ticket display must work on phones. |
| Operational dashboards stay dense | Roberto and Patricia need scan-friendly tables, filters, and alerts. |
| AI cards show actions | CopilotKit cards should propose specific drafts with approve/edit/reject controls. |
| Realtime displays derive from DB | Leaderboards and live dashboards read from snapshots/views. |
| No hidden autonomy | Every sensitive action shows a status, owner, and audit id. |

## Contestant Dashboard

```text
Header: profile completion, contest status
Primary: voting link, share buttons, next event/rehearsal
Cards: Bio polish, missing docs, campaign ideas, sponsor fit
Footer: rules, support, privacy
```

## Sponsor Dashboard

```text
Header: package tier, deliverables, payment status
Main: ROI metrics, campaign calendar, activation checklist
Cards: Sponsor ROI report, content approvals, event-day logistics
Sidebar: contract, invoice, contacts
```

## Organizer Dashboard

```text
Left nav: Contest, Contestants, Voting, Tickets, Sponsors, Campaigns, Live, Audit
Top strip: publish status, vote window, ticket sales, approvals blocked
Main: selected operational table/dashboard
Right: CopilotKit assistant and approval cards
```

## Voting Experience

```text
Contest header
Contestant portrait/video
Story and social proof
Free vote CTA
Paid vote bundle CTA
Share to WhatsApp
Rules/transparency link
```

## Live Contest Dashboard

| Panel | Purpose |
|---|---|
| Check-in | Door count, VIP arrivals, duplicate scans. |
| Voting | Open windows, vote rate, anomaly flags. |
| Judge scoring | Completion by category/judge. |
| Overlays | Sponsor and leaderboard queue. |
| Alerts | Payment, stream, scanner, moderation alerts. |

## Livestream Overlay

```text
Lower-third: contestant name and sponsor
Corner: QR vote code
Ticker: next segment or sponsor CTA
Moment card: locked leaderboard snapshot when approved
Fallback: static sponsor/event slate
```

## WhatsApp Engagement Dashboard

| Section | Shows |
|---|---|
| Templates | Approved, pending, rejected. |
| Segments | Contestants, fans, ticket holders, sponsors, organizers. |
| Batches | Draft, approved, sending, delivered, failed. |
| Opt-outs | Count, reason, compliance status. |
| Deep links | Vote/ticket/reminder link health. |

## AI Campaign Workspace

```text
Campaign brief
Audience segment
AI-generated variants
Approval diff
Postiz schedule preview
WhatsApp batch preview
UTM and QR links
Performance after launch
```

## Sponsorship CRM

| Column | Meaning |
|---|---|
| New lead | OpenClaw/ADK/source-backed draft. |
| Qualified | Human-reviewed sponsor fit. |
| Proposal | AI draft approved or in review. |
| Negotiation | Contract/payment discussion. |
| Active | Deliverables underway. |
| Reported | ROI delivered. |
| Renewal | Next contest opportunity. |

## Influencer Management Dashboard

| Card | Purpose |
|---|---|
| InfluencerMatchCard | Fit score, location, public evidence, audience hypothesis. |
| OutreachDraftCard | Draft message requiring approval. |
| CampaignBriefCard | Deliverables, dates, tracking link. |
| PerformanceCard | Views, clicks, votes, tickets attributed. |

## CopilotKit Card System

| Card type | Required fields |
|---|---|
| Draft card | Proposed content, source, target object, edit controls. |
| Approval card | Diff, risk, approve/edit/reject, audit id. |
| Alert card | Severity, evidence, recommended action, escalation. |
| Report card | Metrics, explanation, export/share action. |
| Live card | Current state, next action, producer/admin control. |

