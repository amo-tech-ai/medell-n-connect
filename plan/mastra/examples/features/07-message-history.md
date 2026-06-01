---
title: Feature — Message history (mdeai)
source: https://mastra.ai/docs/memory/message-history
journeys: [J2, J10]
personas: [Camila, Sofía, Patricia]
phase: 1 partial → F13
---

# Message history — mdeai

**Official:** [Message history](https://mastra.ai/docs/memory/message-history)

Recent turns persisted per **thread** + **resource**; Mastra prepends `lastMessages` before each LLM call. UI can `recall()` for sidebars.

**Catalog:** [`../../04-user-stories.md`](../../04-user-stories.md) § Conversation history.

---

## mdeai implementation

**File:** `mdeapp/src/mastra/lib/agent-memory.ts`

```typescript
options: { lastMessages: 20, workingMemory: { ... } }
```

| Surface | thread (target) | resource (target) |
|---------|-----------------|-------------------|
| `/chat` | CopilotKit session / thread id | Supabase `auth.users.id` |
| `/` ping | ephemeral smoke | dev user |
| Studio | auto-generated | auto |

**Critical CopilotKit rule (official):** send **only the new message** from the client — not full history — or ordering bugs and double tokens.

---

## Features & use cases

| Capability | mdeai use case |
|------------|----------------|
| `lastMessages: 20` | Budget → results → “compare 1 and 3” without re-asking |
| `generateTitle: true` | Patricia finds “Laureles 2BR” in `mastra_threads` |
| `memory.recall()` | Admin UI transcript for support |
| `cloneThread()` | Sofía branches Roberto’s wizard before risky publish test |
| `deleteMessages()` | GDPR delete for Camila account |

---

## User stories

**Camila (J2)**  
As Camila, my third message “show parking for #2” still sees the first search turn in context — up to 20 messages — so the agent knows which listing I mean.

**Sofía (J10)**  
As Sofía, after Vercel redeploy, `mastra_messages` on Postgres still has turns 1–10 when CopilotKit passes the same `thread` + `resource` ([08-storage](08-storage.md)).

**Patricia**  
As Patricia, I query `listThreads({ filter: { resourceId: camilaId } })` to audit abuse reports — app-layer auth must verify resource access (official warning).

---

## Journey — J2 multi-turn rentals

1. Turn 1: “2BR Laureles under $80” → persisted user + assistant + tool messages.
2. Turn 2: tool `search-rentals` result stored.
3. Turn 3: “compare 1 and 3” — `MessageHistory` loads last 20; WM has IDs.
4. CopilotKit POST carries **latest user text only**; runtime adds memory scope.

**Acceptance**

- [ ] F13: thread + resource on every CopilotKit-bridged run
- [ ] No client-side full-history replay in `useCopilotChat` config

**Related:** [08-storage](08-storage.md) · [06-memory-processors](06-memory-processors.md) · [../domains/01-real-estate-rentals.md](../domains/01-real-estate-rentals.md)
