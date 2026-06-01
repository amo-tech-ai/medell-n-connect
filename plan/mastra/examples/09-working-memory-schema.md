---
title: Example — Working Memory with Schema (mdeai)
source: https://mastra.ai/examples/v0/memory/working-memory-schema
journeys: [J2, J3, J4, J5, J10]
personas: [Camila, Roberto, Tourist]
phase: 1
---

# Working Memory with Schema — mdeai

**Official:** [Working Memory with Schema](https://mastra.ai/examples/v0/memory/working-memory-schema)

Zod `schema` defines working memory as **JSON** the agent updates via `updateWorkingMemory` — type-safe and programmatically readable.

---

## mdeai implementation (Phase 1)

**File:** `mdeapp/src/mastra/lib/agent-memory.ts`

```typescript
createThreadMemory(schema) → Memory({
  workingMemory: { enabled: true, scope: "thread", schema },
  lastMessages: 20,
})
```

| Agent | Schema purpose | CopilotKit type |
|-------|----------------|-----------------|
| `conciergeAgent` | `lastIntent`, rental/event/restaurant results | Match in `lib/types.ts` |
| `rentalAgent` | `lastQuery`, `lastResults`, `selectedListingId` | J2 |
| `eventAgent` | `lastQuery`, `lastResults`, `selectedEventId` | J3 |
| `hostEventAgent` (W3+) | `EventDraftState` | J5 wizard |
| `pingAgent` | `MdeState` (`lastQuery`, `hint`) | J1 |

**Triple sync rule:** agent Zod = `lib/types.ts` = `useCoAgent<T>` ([shared state](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read)).

---

## User stories

**Camila (J2)**  
As Camila, after `search-rentals` returns three listings, working memory stores listing IDs so “schedule #2” refers to the correct row without re-querying Laureles.

**Roberto (J5)**  
As Roberto, `EventDraftState` in working memory drives the wizard — title, venue, tiers stay aligned when I edit in the form or in chat.

**Tourist (J4)**  
As a Tourist, `lastIntent` and `lastRestaurantResults` prevent the concierge from answering a restaurant follow-up with rental cards.

**Sofía (J10)**  
As Sofía, Postgres storage persists the same JSON schema after redeploy — not the todo-list shape from the official example, but the same **schema mechanism**.

---

## vs official todo-list example

| Official field | mdeai field |
|--------------|-------------|
| `items[].title` | `lastResults[].title` / listing id |
| `items[].status` | `selectedListingId` / `lastIntent` |
| `items[].due` | `EventDraftState.startDate` (host) |

Official output is **prose formatted** from JSON; mdeai uses **generative UI** from tool output, not memory prose.

---

## Journey — J2 follow-up

1. Camila: “2BR Laureles under $80.”
2. Tool fills `lastResults` in working memory (schema).
3. Camila: “compare 1 and 3.”
4. Agent reads schema JSON — no hallucinated listing URLs.
5. CopilotKit `useCoAgent` may show debug panel with same JSON (Sofía).

**Acceptance**

- [ ] Schema in agent file matches `lib/types.ts`
- [ ] `thread` + `resource` on runtime (F13)
- [ ] Never set both `template` and `schema` on same Memory instance

---

## CopilotKit note

Working memory updates flow over AG-UI state events when configured — UI renders **tools** for cards, **state** for wizard fields. Official [schema example](https://mastra.ai/examples/v0/memory/working-memory-schema) storage blob under `toolInvocations.args.memory` is Mastra-internal; product validation is Inspector + DB row.

**Related:** [`../04-user-stories.md`](../04-user-stories.md) memory catalog · [08-template](08-working-memory-template.md) (when not to use)
