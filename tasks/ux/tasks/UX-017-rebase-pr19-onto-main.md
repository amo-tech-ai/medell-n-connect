---
id: UX-017
title: Rebase PR #19 onto main; resolve conflicts
status: Not Started
priority: P1
phase: MVP — hybrid search ship
effort: 3-6h
owner: claude
depends_on: [UX-015, UX-013, UX-014]
blocks: []
sequence: after G1 + P0 on main
skill: [mde-task-lifecycle, mde-worktree-pr-flow, mastra, testing]
related:
  - ../tests/24-mde-audit.md
  - ../tests/19-PR-19-MIS-AUDIT.md
  - https://github.com/amo-tech-ai/mdeapp/pull/19
description: PR #19 targets merged branch feat/search-003-restaurants — MERGE CONFLICT with main. Rebase onto origin/main; verify with npm test + e2e/rich-card-dedup (golden-queries-smoke NOT on main disk).
---

# UX-017 — Rebase PR #19 onto `main`

## Plain-English problem

PR #19 has good code (348 tests, golden 8/8) but GitHub shows **CONFLICTING** because base branch `#18` already merged to `main`. Cannot merge until rebase.

## User impact

- **Camila:** rental + event hybrid search blocked in prod.
- **Sofía:** stack hygiene failure — should have rebased when #18 merged.

## Root cause

**KNOWN (audit M1/M2).** Base `feat/search-003-restaurants` stale; conflict files include `search-restaurants.ts`, `search-grounded-places.ts`, `concierge.ts`, `package.json`.

## Workflow

1. `git fetch origin && git checkout feat/mis-rental-event-search`
2. `git rebase origin/main`
3. Resolve conflicts — prefer #19 intelligence modules + main’s merged SEARCH-003 + UX P0 fixes.
4. `npm test` → expect pass count ≥ main baseline.
5. `npm run test:e2e e2e/rich-card-dedup.spec.ts` (script exists on main).
6. Force-push rebase; change PR base to `main` in GitHub UI.
7. Optional: restore `scripts/intelligence/golden-queries-smoke.ts` from #19 branch as follow-up — **not on main today**.

## Acceptance criteria

- [ ] PR #19 mergeable clean against `main`.
- [ ] `npm test` green post-rebase.
- [ ] `npm run test:e2e e2e/rich-card-dedup.spec.ts` green (existing — no golden-queries script on main).
- [ ] PR base branch = `main` in GitHub.
- [ ] Merge only after UX-015 (#17) and UX-013/014 on main.

## Flow diagram

```mermaid
flowchart TD
  PR19[PR #19 MIS hybrid] --> Base{base branch}
  Base -->|stale| S003[feat/search-003-restaurants]
  Base -->|target| Main[origin/main]
  S003 -->|CONFLICTING| Block[❌ blocked]
  Main --> Rebase[git rebase origin/main]
  Rebase --> Test[npm test + e2e dedup]
  Test --> Merge[Ready to merge]

  style Block fill:#fde2e2,stroke:#c0392b
  style Merge fill:#e7f6e7,stroke:#27ae60
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| golden-queries-smoke on disk | 🔴 Missing on main |
| rich-card-dedup e2e | ✅ exists |
| Merge conflict | 🔴 Expected until rebase |
