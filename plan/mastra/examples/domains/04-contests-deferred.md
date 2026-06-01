---
title: Domain — Contests (deferred)
phase: post-MVP
personas: [Roberto, Patricia]
---

# Contests — deferred (mdeai)

**Status:** Out of Phase 1 MVP ([`mvp.md`](../../../../mvp.md), [`plan/prd/01-executive-strategy.md`](../../../../plan/prd/01-executive-strategy.md)). Legacy edge fns frozen; Miss Elegance–style vertical is **months**, not weeks.

---

## Why separate from events

| Events (Roberto) | Contests (future) |
|------------------|-------------------|
| `events` + tickets + Stripe | Contestant entries, judging, moderation |
| `hostEventAgent` wizard | Photo upload, Turnstile, jury workflows |
| J5 HITL publish | Multi-round voting, sponsor rules |

Reuse **patterns**, not agents: same CopilotKit Pattern 1, same F13 memory, same HITL ideas.

---

## Suggested user stories (when greenlit)

1. **Contestant** — As a contestant, I submit entry photo + bio; agent helps format caption (English); publish blocked until moderation HITL.
2. **Judge** — As Patricia, I score entries via admin UI; Mastra `evaluationAgent`-style rubric scorer.
3. **Host** — As Roberto (sponsor host), I configure contest rules via RAG on legal PDF ([J11](../../04-user-stories.md)).
4. **Moderation** — Photo pipeline + human review before public gallery (plan risk register).

---

## Mastra building blocks (future)

| Piece | Reuse from Phase 1 |
|-------|---------------------|
| Working memory schema | Contestant draft state |
| `suspend` / snapshots | Round deadlines |
| Image analysis | Entry photo QA |
| Custom API route | Webhook ingest (not WhatsApp prod) |
| Maps | Venue map for live finals (3D — Phase 3+ per maps tasks) |

---

## CopilotKit note

Separate `agent` key (e.g. `contestAgent`) — never mix with `hostEventAgent` sidebar on same page without explicit switch.

**Related:** [02-events-hosting](02-events-hosting.md) · `plan/events/contests/` (when present)
