---
title: Example — Working Memory with Template (mdeai)
source: https://mastra.ai/examples/v0/memory/working-memory-template
journeys: [J4]
personas: [Patricia, Tourist]
phase: 2-optional
---

# Working Memory with Template — mdeai

**Official:** [Working Memory with Template](https://mastra.ai/examples/v0/memory/working-memory-template)

Working memory uses a **Markdown template** the agent updates over time (todo lists, profiles). Requires `thread` + `resource` on each call and durable `storage`.

---

## Template vs schema (mdeai choice)

| Approach | Mastra | mdeai |
|----------|--------|-------|
| **Schema (Zod)** | [working-memory-schema](09-working-memory-schema.md) | **✅ Phase 1** — `createThreadMemory(schema)` |
| **Template (Markdown)** | This example | **Not used** — harder to sync with `useCoAgent<T>` |

**Rule:** CopilotKit shared state needs JSON-shaped types → prefer **schema**, not Markdown template.

---

## When template might help

| Use case | Persona | Phase |
|----------|---------|-------|
| Patricia support scratchpad (“open questions”, “escalation notes”) | Patricia | 2 |
| Long-form tourist trip journal in chat | Tourist | 2 |
| Host runbook in prose (venue quirks) | Roberto | 2 |

**Not for:** `lastResults` rental IDs, `EventDraftState`, or map pins — use Zod fields.

---

## User stories

**Patricia — support template (Phase 2)**  
As Patricia, an internal `supportAgent` uses a template with `## Active tickets` / `## Resolved` so Mastra memory matches how ops thinks — not exposed to Camila in prod chat.

**Tourist — trip notes (Phase 2)**  
As a Tourist, a markdown working memory block tracks “neighborhoods visited” and “restaurants tried” when we do not want strict Zod keys yet — migrate to schema once UI binds fields.

**Sofía — do not mix**  
As Sofía, I do not add a Markdown template to `conciergeAgent` while `ConciergeState` Zod already exists — one working-memory mode per agent ([docs](https://mastra.ai/docs/v0/memory/working-memory): template **or** schema, not both).

---

## Real-world mdeai mapping

```text
Official:  template: "# Todo List\n## Active Items\n..."
mdeai:     createThreadMemory(z.object({ lastQuery, lastResults, ... }))
           lib/agent-memory.ts + agents/concierge.ts, rental-agent.ts
```

| Feature | Template example | mdeai equivalent |
|---------|------------------|------------------|
| `generateTitle: true` | Thread titles in Studio | J10 — Patricia support UI |
| `thread` + `resource` | Required | F13 CopilotKit pass-through |
| Persisted todo list | Markdown in memory tool | `lastResults[]` JSON in Zod |

---

## Journey — optional Patricia ops agent

1. Admin opens internal `/admin/support-chat` (future).
2. `thread` = ticket id, `resource` = agent user id.
3. Template memory accumulates investigation notes.
4. No CopilotKit rental cards — text only.

**Acceptance**

- [ ] Not used on `conciergeAgent` / `rentalAgent` in Phase 1
- [ ] If adopted, separate agent key — not mixed with Camila production thread

---

## CopilotKit note

`useCoAgent` expects typed state — mirror **schema** in `lib/types.ts`, not rendered Markdown. Template example is for **Studio-only** or **admin** agents.

**Related:** [09-working-memory-schema](09-working-memory-schema.md) · [`../04-user-stories.md`](../04-user-stories.md) J10
