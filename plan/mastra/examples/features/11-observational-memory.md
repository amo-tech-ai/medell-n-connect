---
title: Feature — Observational memory (mdeai)
source: https://mastra.ai/docs/memory/observational-memory
journeys: [J2, J4]
personas: [Camila, Tourist]
phase: 2
requires: F13 Postgres (or libsql/mongo per official)
---

# Observational memory — mdeai

**Official:** [Observational memory](https://mastra.ai/docs/memory/observational-memory) (`@mastra/memory@1.1.0+`)

Background **Observer** + **Reflector** compress long threads into a dense observation log — replaces stuffing raw history when chats exceed `lastMessages`.

**Uploaded reference:** same doc as [mastra.ai/docs/memory/observational-memory](https://mastra.ai/docs/memory/observational-memory).

---

## mdeai today vs target

| Item | Today | Target |
|------|-------|--------|
| `observationalMemory` | **Off** | `conciergeAgent` on `/chat` after F13 PG |
| Default observer model | Official default `gemini-2.5-flash` | Align with policy: **`gemini-3.5-flash`** or explicit config |
| Client history | N/A | Send **only new message** (official warning) |
| Storage | File libsql | `@mastra/pg` with Camila threads |

**vs semantic recall:** OM compresses **conversation**; semantic recall **retrieves** similar past messages. Can combine after token/cost review.

**vs working memory:** OM is automatic facts; WM Zod is **structured product state** (listing IDs, `EventDraftState`) — keep WM for CopilotKit sync.

---

## Features & use cases

| Capability | mdeai use case |
|------------|----------------|
| `observationalMemory: true` | Camila 30+ turn rental negotiation |
| `temporalMarkers: true` | “User returned after 2 days” on concierge |
| Custom observer `instruction` | Teach `<turn>` tags for multi-user host threads |
| `scope: 'resource'` + OM | Preferences survive new chat tabs |

---

## User stories

**Camila (J2)**  
As Camila, after fifteen messages narrowing Laureles → Envigado → parking, observational memory keeps “max $75, needs parking” without sending all fifteen turns to Gemini each time.

**Tourist (J4)**  
As a Tourist, long restaurant debate compresses to “prefers rooftop, Provenza, $$” while `lastRestaurantResults` stays in working memory for card re-render.

**Sofía**  
As Sofía, I monitor observer token cost in `mastra_ai_spans` when Patricia reports `/chat` bill spikes — tune OM vs lower `lastMessages`.

---

## Journey — long concierge thread

1. Days 1–3: multiple `search-rentals` + follow-ups → thread grows past 20 messages.
2. Observer runs after threshold → observations stored.
3. Day 4: Camila opens app — new message only from CopilotKit.
4. Agent context = observations + WM `selectedListingId` + recent `lastMessages`.
5. UI cards still from fresh tool calls when prices may have changed.

**CopilotKit:** `useCoAgent` shows WM; observations are **not** typically mirrored client-side.

**Acceptance**

- [ ] PG storage + OM enabled on staging
- [ ] Observer model documented in `CLAUDE.md` Gemini table
- [ ] Multi-user host threads use `<turn>` tags if OM attribution drifts

**Related:** [10-multi-user-threads](10-multi-user-threads.md) · [09-semantic-recall](09-semantic-recall.md) · [06-memory-processors](06-memory-processors.md)
