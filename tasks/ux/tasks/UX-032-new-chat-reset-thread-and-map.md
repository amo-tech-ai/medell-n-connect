---
id: UX-032
title: New chat resets thread, working memory, results, and map pins
status: Not Started
priority: P2
phase: MVP — session hygiene
effort: 2-4h
owner: claude
legacy_from: UX-006
depends_on: []
blocks: []
skill: [mde-task-lifecycle, copilotkit-integrations, mde-maps, testing]
related:
  - ../UX-006-new-chat-reset-thread-and-map.md
  - ../tests/23-live-audit.md
description: "New chat" is Link href="/" only — leaves CopilotKit thread, working memory, result cards, and map pins. Real reset required.
---

# UX-032 — New chat reset (from UX-006)

## Purpose

**Camila** finishes a rental search, clicks New chat, expects a clean slate — today she keeps old pins, filters, and messages.

## Root cause (verified)

`chat-nav-rail.tsx:24-30` — client nav to `/` without clearing:

- CopilotKit thread / messages
- `useCoAgent<ConciergeWorkingMemory>()` state
- Map pins (`useMapContext`)
- Rich card registrar counts

## Files

| File | Change |
|------|--------|
| `src/components/chat/chat-nav-rail.tsx` | Reset handler vs bare Link |
| `src/components/chat/chat-center-panel.tsx` | Wire reset callback |
| `src/platform/maps/map-context.tsx` | Clear pins API |
| `src/components/chat/rich-card-results-context.tsx` | Reset counts |

## Acceptance

- [ ] New chat → empty message list, zero pins, cleared working memory filters.
- [ ] Rental fast-path still works on next message.
- [ ] Playwright or manual evidence in `tasks/testing/evidence/<date>/`.

## Flow diagram

```mermaid
sequenceDiagram
    participant U as User
    participant Nav as New chat
    participant CK as CopilotKit thread
    participant Mem as Working memory
    participant Map as Map pins

    U->>Nav: click New chat
    Nav->>CK: new threadId / clear messages
    Nav->>Mem: reset ConciergeWorkingMemory
    Nav->>Map: clear pins + selection
    Nav-->>U: empty chat + empty map
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Still Link only | 🔴 confirmed |
| UX-006 parent spec | Accurate — still needed |
