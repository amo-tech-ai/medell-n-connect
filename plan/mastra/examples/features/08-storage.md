---
title: Feature — Storage (mdeai)
source: https://mastra.ai/docs/memory/storage
journeys: [J10]
personas: [Sofía, Patricia, Camila]
phase: F13
task: F13
---

# Storage — mdeai

**Official:** [Storage](https://mastra.ai/docs/memory/storage)

`Mastra({ storage })` backs threads, messages, workflow snapshots, traces, and **background tasks**. Agents inherit instance storage unless overridden.

**Catalog:** [`../../04-user-stories.md`](../../04-user-stories.md) § Postgres memory (F13).

---

## mdeai today vs target

| Store | Path / config | Holds |
|-------|---------------|-------|
| Agent memory file | `file:mastra-agent-memory.db` via `createThreadMemory` | Messages + WM per agent |
| Mastra instance | `LibSQLStore({ url: ":memory:" })` in `mastra/index.ts` | Workflows, traces — **lost on cold start** |
| **F13 target** | `PostgresStore(DATABASE_URL)` shared | Everything + bg tasks + snapshots |

**Studio rule:** use **absolute** `file:/path/to/mastra.db` when Next + `mastra dev` share DB.

**Misalignment today:** Camila’s chat can persist in the file DB while workflow snapshots vanish in `:memory:` — J10 fixes one Postgres.

---

## Features & use cases

| Capability | mdeai use case |
|------------|----------------|
| Instance-level `PostgresStore` | Single `mastra_messages` for Patricia dashboards |
| Agent-level override | Isolate `evaluationAgent` eval corpus (Phase 2) |
| `MastraCompositeStore` | Memory on PG, observability on ClickHouse (scale) |
| Thread + resource IDs | Camila UUID owns all `/chat` threads |
| Large attachments | Roberto flyer → S3 URL processor before save (Dynamo limits) |

---

## User stories

**Camila (J10)**  
As Camila, my chat history survives a Vercel redeploy because `mastra_messages` lives on Supabase Postgres, not ephemeral LibSQL.

**Sofía**  
As Sofía, `mastra dev` and `next dev` point at the same absolute `mastra.db` path so Studio and localhost CopilotKit show identical threads.

**Patricia**  
As Patricia, I join `mastra_threads.metadata` with `events.id` for ops filters — requires consistent `resourceId` = host user id.

---

## Journey — F13 unify storage

1. Migrate `Mastra({ storage: PostgresStore })`.
2. Point `createThreadMemory` at **same** store (remove isolated file DB).
3. CopilotKit route: `thread` + `resource` from session.
4. Verify: redeploy → same thread recalls messages ([07-message-history](07-message-history.md)).
5. Enable [01-background-tasks](01-background-tasks.md) + workflow snapshots.

**CopilotKit:** No storage adapter in React — all persistence server-side in `route.ts` bridge.

**Acceptance (F13)**

- [ ] One Postgres URL for Mastra + agent memory
- [ ] Evidence: `npm run dev` + multi-turn chat + redeploy recall

**Related:** [09-semantic-recall](09-semantic-recall.md) (needs vector on PG) · [11-observational-memory](11-observational-memory.md) (PG/libsql/mongo only)
