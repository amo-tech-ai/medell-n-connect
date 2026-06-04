---
doc: 07-contracts-schemas
purpose: Shared Zod contracts — single source of typed truth
depends_on: 02-core-architecture.md
replaces: _legacy/05 Zod sections, scattered types in agents
audience: all engineers — PR-1 starts here
complexity: M
generates_tasks: MAP-000, platform/contracts PR, Vitest schema tests
---

# 07 — Shared contracts + schemas

> [← Rentals](./06-rentals-leads.md) · [Next: Repo layout →](./08-repo-code-organization.md)

## Document spec

| Field | Value |
|-------|-------|
| **Implementation impact** | **Blocks every vertical** — implement first |
| **Tasks** | PR-1, schema Vitest, lint drift checks |

---

## 1. Why contracts first

Prevents:

- Frontend/backend schema drift  
- Agent tool output incompatible with cards/map  
- Duplicate `normalize-tool-output` logic  

**Rule:** Mastra tool output and `useCopilotAction` parameters import the **same** Zod schemas from `platform/contracts/`.

---

## 2. Directory

```text
mdeapp/src/platform/contracts/
  map-pin.ts          # MapPin, PinCategory
  tool-response.ts  # ToolResponse envelope
  event-draft.ts      # EventDraftState
  approval.ts         # ApprovalPayload, HITL result
  place-card.ts       # Grounded place / venue card fields
  index.ts            # re-exports
```

---

## 3. Core types (minimum)

### MapPin

```ts
// category, id, lat, lng, title, subtitle?, placeId?, placeUri?
```

### ToolResponse

```ts
// { text?, cards?, pins?, metadata?, traceId? }
```

### EventDraftState

```ts
// sync with hostEventAgent working memory + useCoAgent
```

### ApprovalPayload

```ts
// action, draft snapshot, approver role
```

---

## 4. Sync rules (3 places)

| Schema | 1 Agent Zod | 2 `platform/contracts` | 3 UI `useCoAgent` / action params |
|--------|-------------|--------------------------|-----------------------------------|
| EventDraft | ✅ | ✅ | ✅ |
| MapState (read) | optional | ✅ | ✅ |

**Test:** `vitest` import contracts + `safeParse` fixture JSON from sample tool outputs.

---

## 5. Monorepo deferral

Do **not** create `packages/types/` until:

- `mdeapp` edge functions  
- `mdeapp/src/mastra/tools`  
- optional shared CI package  

all import identical schemas. Until then: **copy via single `platform/contracts` import path**.

---

## 6. Forbidden patterns

- Duplicating interfaces in `components/` without importing contracts  
- `z.any()` on tool boundaries  
- LLM JSON parsed without Zod safeParse  

---

## 7. PR-1 exit criteria

- [ ] All contract files exist  
- [ ] Vitest: 100% parse on golden fixtures  
- [ ] One mock tool returns `ToolResponse` → card render smoke  
- [ ] One mock tool returns pins → MapContext merge smoke  

---

## 8. Related

- Map merge: [04-maps-grounding.md](./04-maps-grounding.md)  
- Agent memory: [03-runtime-orchestration.md](./03-runtime-orchestration.md)
