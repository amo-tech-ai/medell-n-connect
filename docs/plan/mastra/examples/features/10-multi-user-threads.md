---
title: Feature — Multi-user threads (mdeai)
source: https://mastra.ai/docs/memory/multi-user-threads
journeys: [J5+]
personas: [Roberto, co-host]
phase: 2+
---

# Multi-user threads — mdeai

**Official:** [Multi-user threads](https://mastra.ai/docs/memory/multi-user-threads)

Several humans share **one thread** + **one resource** (e.g. `doc_${eventId}`); speaker identity in `<turn author_id="…">` tags or observational memory.

**Not** Camila’s default — her chats are single-user per thread.

---

## mdeai use cases

| Scenario | `resourceId` | Participants |
|----------|--------------|--------------|
| Event co-editing | `event_${eventId}` | Roberto (host) + co-organizer |
| Sponsor review thread | `sponsor_${dealId}` | Roberto + Patricia (admin) |
| Group planning (Phase 3) | `trip_${groupId}` | Multiple tourists |

**Security:** build `<turn>` tags from **auth context**, never from client body — prevents impersonation (official).

---

## Features & use cases

| Layer | When |
|-------|------|
| `lastMessages` only | Short co-host session; verbatim who-said-what |
| Observational memory | Long event planning — [11-observational-memory](11-observational-memory.md) |
| WM template with Participants list | When OM unsupported — [08-working-memory-template](../08-working-memory-template.md) |

Prefer **OM OR WM**, not both (official).

---

## User stories

**Roberto**  
As Roberto, my co-host Maria adds ticket tiers in the **same** wizard thread; the agent addresses us by name and respects her `functional_role=finance` tag.

**Patricia**  
As Patricia, I join a sponsor thread as `functional_role=admin` read-only — signals or turns marked from server auth, not Maria pretending to be Patricia.

**Camila**  
As Camila, I do **not** use multi-user threads on `/rentals` — one user, one resource.

---

## Journey — shared event draft thread

1. `resourceId = event_42`, `threadId = event_42`.
2. Roberto sends: `<turn author_name="Roberto" functional_role="host">` add VIP tier.
3. Maria sends: `<turn author_name="Maria" functional_role="finance">` cap at 50 seats.
4. `hostEventAgent` updates `EventDraftState` + responds to both.
5. CopilotKit: separate browser sessions, same server-built turns.

**CopilotKit:** `useCoAgent<EventDraftState>` still one state blob — conflict resolution in agent instructions.

**Related:** [../domains/02-events-hosting.md](../domains/02-events-hosting.md) · [11-observational-memory](11-observational-memory.md)
