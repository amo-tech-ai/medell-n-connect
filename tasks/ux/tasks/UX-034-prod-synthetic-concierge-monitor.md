---
id: UX-034
title: Production synthetic monitor for conciergeAgent
status: Not Started
priority: P2
phase: MVP — observability
effort: 3-5h
owner: claude
legacy_from: UX-009
depends_on: [UX-015, UX-001]
blocks: []
skill: [mde-task-lifecycle, mde-vercel, testing, playwright-cli]
related:
  - ../UX-009-prod-synthetic-concierge-monitor.md
  - UX-031-live-audit-vertical-smoke.md
description: Scheduled prod smoke — café + event concierge requests; alert on RUN_ERROR. Outage was invisible until manual QA (F-1).
---

# UX-034 — Prod synthetic concierge monitor (from UX-009)

## Purpose

**Sofía** gets paged when prod concierge breaks — not **Tourist** discovering silence first.

## Gap (verified)

- No `e2e/concierge-agent-smoke.spec.ts`
- No Vercel cron / GitHub scheduled workflow for concierge
- Existing `smoke:*` scripts are manual only (`package.json`)

## Implementation options

| Option | Pros |
|--------|------|
| Playwright against prod URL | Full UI path |
| Vercel Cron + `curl` POST `/api/copilotkit` | Lightweight |
| Extend UX-031 matrix as CI scheduled job | Reuses scenarios |

## Acceptance

- [ ] Scheduled run ≥1/day against prod (or preview with prod-like env).
- [ ] Alert on RUN_ERROR / empty stream / non-200.
- [ ] Document runbook in task evidence.

## Flow diagram

```mermaid
flowchart LR
  Cron[Vercel Cron / GH Actions] --> Smoke[concierge smoke]
  Smoke --> Prod[https://www.mdeai.co]
  Prod -->|fail| Alert[Notify Sofía]
  Prod -->|pass| OK[Green dashboard]
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| UX-001 same-origin fix | ✅ prerequisite met |
| Monitor exists | ❌ not implemented |
| Depends UX-015 | 🟡 stable error path helps debug failures |
