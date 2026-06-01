---
title: Mastra + CopilotKit — user stories & journeys
project: mdeapp
model: gemini-3.5-flash
copilotkit: 1.55.2
updated: 2026-05-21
mastra_docs:
  - https://mastra.ai/blog/copilotkitmastra
  - https://mastra.ai/docs/v0/agents/using-tools
  - https://mastra.ai/docs/v0/agents/agent-memory
  - https://mastra.ai/docs/v0/agents/networks
  - https://mastra.ai/docs/v0/workflows/overview
  - https://mastra.ai/docs/v0/workflows/workflow-state
  - https://mastra.ai/docs/v0/workflows/agents-and-tools
  - https://mastra.ai/docs/v0/workflows/suspend-and-resume
  - https://mastra.ai/docs/v0/workflows/human-in-the-loop
  - https://mastra.ai/docs/v0/workflows/snapshots
  - https://mastra.ai/docs/v0/streaming/overview
  - https://mastra.ai/docs/v0/streaming/events
  - https://mastra.ai/docs/v0/streaming/tool-streaming
  - https://mastra.ai/docs/v0/streaming/workflow-streaming
  - https://mastra.ai/docs/v0/mcp/overview
  - https://mastra.ai/docs/v0/mcp/publishing-mcp-server
  - https://mastra.ai/docs/v0/memory/overview
  - https://mastra.ai/docs/v0/memory/threads-and-resources
  - https://mastra.ai/docs/v0/memory/working-memory
  - https://mastra.ai/docs/v0/memory/conversation-history
  - https://mastra.ai/docs/v0/memory/memory-processors
  - https://mastra.ai/docs/v0/memory/storage/memory-with-pg
  - https://mastra.ai/docs/v0/rag/overview
  - https://mastra.ai/docs/v0/rag/chunking-and-embedding
  - https://mastra.ai/docs/v0/rag/vector-databases
  - https://mastra.ai/docs/v0/rag/retrieval
  - https://mastra.ai/docs/v0/server-db/mastra-server
  - https://mastra.ai/docs/v0/server-db/runtime-context
  - https://mastra.ai/docs/v0/server-db/custom-api-routes
  - https://mastra.ai/docs/v0/server-db/storage
  - https://mastra.ai/docs/v0/deployment/overview
  - https://mastra.ai/docs/evals/overview
  - https://mastra.ai/docs/evals/built-in-scorers
  - https://mastra.ai/docs/evals/custom-scorers
  - https://mastra.ai/docs/evals/running-in-ci
  - https://mastra.ai/docs/evals/evals-with-memory
  - https://mastra.ai/docs/evals/datasets/overview
  - https://mastra.ai/docs/evals/datasets/running-experiments
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/copilot-runtime
  - https://docs.copilotkit.ai/mastra/ag-ui
related:
  - tasks/mastra/index-mastra.md
  - tasks/mastra/03-best-practices.md
  - tasks/mastra/01-studio.md
  - tasks/mastra/examples/00-index.md
  - tasks/mastra/examples/evals/00-index.md
  - plan/prd.md
  - CLAUDE.md
---

# Mastra + CopilotKit — user stories & journeys

Real-world **personas**, **journeys**, **features**, and **acceptance criteria** for mdeai’s agent-native stack. Implementation rules: [`03-best-practices.md`](03-best-practices.md).

**Implementation order & grades (Core → Priority → Advanced):** [`index-mastra.md`](index-mastra.md) — **start here for what to build next.**  
**Task index:** same file — hub for all split docs.  
**Official agent examples:** [`examples/00-index.md`](examples/00-index.md) — agents, memory template/schema, browser, WhatsApp.  
**Domain playbooks:** [`examples/domains/00-index.md`](examples/domains/00-index.md) — rentals, events, restaurants, contests (deferred), Google Maps.  
**Evals:** [`examples/evals/00-index.md`](examples/evals/00-index.md) — scorers, CI, datasets (J12).  
**GitHub refs:** [`github/index-github.md`](github/index-github.md) — ui-dojo, HITL, Apify, templates (scored 🟢🟡🔴).

**Stack:** Next.js `mdeapp` → [Copilot Runtime](https://docs.copilotkit.ai/mastra/copilot-runtime) `/api/copilotkit` → [AG-UI](https://docs.copilotkit.ai/mastra/ag-ui) events → Mastra agents/workflows/tools ([CopilotKit + Mastra blog](https://mastra.ai/blog/copilotkitmastra)).

---

## Personas (quick reference)

| Persona | Goal | Primary surface | Default `agent` key |
|---------|------|-----------------|------------------------|
| **Camila** | Find apartment + chat | `/rentals`, `/chat` | `conciergeAgent` / `rentalAgent` |
| **Roberto** | Create & sell events | `/host/event/new` | `hostEventAgent` (W3+) |
| **Tourist** | Restaurants & things to do | `/chat` | `conciergeAgent` |
| **Andrés / Miguel** | Buy tickets | Stripe checkout | *(minimal Mastra — payment path)* |
| **Patricia** | Ops / billing | `/admin/*` | — (reads `ai_runs`) |
| **Sofía** | Ship quality | Studio + Inspector | all agents |
| **Lucía** | E2E regression | Playwright | critical journeys below |

---

## Journey map (Phase 1)

```text
                    ┌─────────────────────────────────────────┐
                    │         POST /api/copilotkit            │
                    │    getLocalAgentsWithLogging(mastra)    │
                    └─────────────────────────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
   pingAgent (W1)              conciergeAgent (W5–6)            hostEventAgent (W3–4)
   "/" smoke                   "/chat" + "/rentals"              "/host/event/new"
        │                               │                               │
        │                    ┌──────────┴──────────┐                    │
        │                    ▼                     ▼                    │
        │              rentalAgent            eventAgent                 │
        │              specialist             specialist                 │
        │                    │                     │                    │
        └────────────────────┴─────────────────────┴────────────────────┘
                                        │
                              routerAgent (optional W6)
                              classify → workflows
```

---

## Feature catalog — CopilotKit backend (mdeai)

### Copilot Runtime

**Doc:** [copilot-runtime](https://docs.copilotkit.ai/mastra/copilot-runtime)  
**mdeai file:** `mdeapp/src/app/api/copilotkit/route.ts`

| Concept | Official behavior | mdeai example |
|---------|-------------------|---------------|
| `CopilotRuntime` | Bridges UI ↔ agents | Built per `POST` with `getLocalAgentsWithLogging({ mastra })` |
| `ExperimentalEmptyAdapter` | No second orchestrator | Required — Mastra is the brain |
| `runtimeUrl` | Frontend POST target | `/api/copilotkit` (relative, follows Next port) |
| Multi-agent map | Keys = `useCoAgent({ name })` | `conciergeAgent`, `rentalAgent`, … |
| Logging | Optional middleware | `LoggingMastraAgent` → `ai_runs` (not Mastra server middleware) |

**User story — Runtime health (Sofía):**  
As Sofía, when CopilotKit returns 500, I inspect the Next route first (agent map keys, `mastra` import), not Mastra Studio — Pattern 1 runs agents inside Next.

**Journey:** `curl -X POST localhost:3001/api/copilotkit` → 400 without body is OK; browser chat → 200 + stream.

---

### AG-UI protocol

**Doc:** [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui)  
**Spec:** [ag-ui.com](https://ag-ui.com)

| Event family | What Camila sees | mdeai handling |
|--------------|------------------|----------------|
| Text deltas | Streaming reply in sidebar | CopilotKit default |
| `tool-input-available` | “Searching…” | Map `toolCallId` → tool name |
| `tool-output-available` | Rental/event cards | `useCopilotAction` render + map pins |
| State snapshot | Wizard / map sync | `useCoAgent` working memory |

**User story — Tool correlation (Lucía):**  
As Lucía, when a card shows wrong data, I open Inspector AG-UI events and confirm `tool-output-available` JSON matches Supabase tool output — not model prose.

**Real-world rule (production):** Pins and prices come from **tool output fields** only (`mdeai-concierge.md`).

---

### Blog + starter (greenfield reference)

**Doc:** [Building agentic copilots with CopilotKit and Mastra](https://mastra.ai/blog/copilotkitmastra)

| Artifact | Use for mdeai |
|----------|---------------|
| `npx create-ag-ui-app@latest --mastra` | Spike new UX — **do not** replace `mdeapp` wholesale |
| [AG-UI Canvas + Mastra](https://go.copilotkit.ai/ag-ui-canvas-mastra) | Canvas pattern for MAP / Roberto preview |
| UI Dojo | Design reviews with stakeholders |

---

## Feature catalog — Mastra agents (mdeai)

### Using tools

**Doc:** [Using Tools](https://mastra.ai/docs/v0/agents/using-tools)

| mdeai tool | Persona journey | Real data |
|------------|-----------------|-----------|
| `search-rentals` | Camila J2 | `DATABASE_URL` or mock |
| `search-events` | Camila J3 | Supabase `events` |
| `search-restaurants` | Tourist J4 | Supabase `restaurants` |
| `search-attractions` | Tourist J4 | Supabase + fallbacks |
| `classify-intent` | Router J6 | Passthrough label |

**User story — Search without hallucination:**  
As Camila, when I ask for “2BR in Laureles under $80,” I see cards whose IDs and URLs came from `search-rentals` execute output — the model never invents a Zillow link.

**Studio:** Tools tab shows schemas; test invoke before wiring CopilotKit render.

**Pattern:** `createTool({ id, description, inputSchema, outputSchema, execute })` — descriptions drive when Gemini calls the tool ([Mastra tools doc](https://mastra.ai/docs/v0/agents/using-tools)).

---

### Agent memory (summary)

Full breakdown: **Feature catalog — Mastra memory** below. Agents use `createThreadMemory()` in `mdeapp/src/mastra/lib/agent-memory.ts` (Zod schema, `scope: "thread"`, `lastMessages: 20`). **F13** aligns `Mastra({ storage })` with Postgres — see **J10**.

---

### Agent networks (vs mdeai router)

**Doc:** [Agent Networks](https://mastra.ai/docs/v0/agents/networks)

Mastra **networks** use `.network()` with sub-agents on one routing agent. **mdeai does not use networks in Phase 1** — we use:

| Mastra network concept | mdeai equivalent |
|------------------------|------------------|
| Routing agent + `agents: {}` | `routerAgent` + workflows (lighter) |
| `workflows: {}` on agent | `routerAgent.workflows` |
| `tools: {}` on agent | `conciergeAgent` four search tools |
| Network memory required | Per-agent `createThreadMemory` |

**User story — Why not network yet:**  
As Sofía, we keep `routerAgent` workflow dispatch until we need LLM-picked sub-agents (research + writing pairs). Camila’s concierge is **one agent, four tools** — matches Mastra blog “specialized agents” without network overhead.

**Phase 2 candidate:** Multi-agent network for host + sponsor + venue research on Roberto enterprise events.

---

## Feature catalog — Mastra memory (mdeai)

Mastra memory = **working memory** (structured scratchpad) + **conversation history** + optional **semantic recall** ([overview](https://mastra.ai/docs/v0/memory/overview)). CopilotKit `useCoAgent<T>` mirrors working-memory Zod in the browser; Mastra persists threads when `thread` + `resource` are passed on each run.

### Memory overview

**Doc:** [Memory overview](https://mastra.ai/docs/v0/memory/overview)

| Memory type | mdeai Phase 1 | Persona benefit |
|-------------|---------------|-----------------|
| Working memory | Zod via `createThreadMemory` | Camila “compare listing 1 and 3” |
| Conversation history | `lastMessages: 20` | Multi-turn chat without repeating budget |
| Semantic recall | **Not yet** (VDB-02 / pgvector) | “What did I ask last week about Laureles?” |

**User story — Three layers, one context window:**  
As Sofía, I know Gemini sees working memory + recent messages combined; if tokens blow up, memory processors trim before the model call — separate from concierge’s `TokenLimiter` on the agent stream.

**Storage today:** `LibSQLStore` file `mastra-agent-memory.db` per agent memory; main `Mastra({ storage: ":memory:" })` for workflows/traces — **misaligned for production** ([storage](https://mastra.ai/docs/v0/server-db/storage)).

---

### Threads and resources

**Doc:** [Threads and Resources](https://mastra.ai/docs/v0/memory/threads-and-resources)

| ID | mdeai source (target) | Example |
|----|------------------------|---------|
| `thread` | CopilotKit thread / chat session id | `chat-${sessionId}` |
| `resource` | Supabase `auth.users.id` | Camila’s user UUID |

**Rule:** Without both IDs on `.generate()` / runtime bridge, Mastra **does not** persist recall ([docs warning](https://mastra.ai/docs/v0/memory/threads-and-resources)).

**User story — Chat titles (Patricia):**  
As Patricia, I want thread `generateTitle: true` so support can find “Laureles 2BR under $80” in `mastra_threads` instead of `thread-uuid-…`.

**CopilotKit Pattern 1:** Next route must forward `threadId` + `resourceId` from Supabase session into Mastra agent calls (F13 + auth middleware).

**Phase 2:** `resource`-scoped working memory so Camila’s rental preferences follow her across `/rentals` and `/chat` threads ([working memory scopes](https://mastra.ai/docs/v0/memory/working-memory)).

---

### Working memory

**Doc:** [Working Memory](https://mastra.ai/docs/v0/memory/working-memory)

| Agent | Zod / schema fields | CopilotKit type |
|-------|---------------------|-----------------|
| `conciergeAgent` | `lastIntent`, queries, `lastRentalResults`, … | `ConciergeState` in `lib/types.ts` |
| `rentalAgent` | `lastQuery`, `lastResults`, `selectedListingId` | Rental working memory |
| `eventAgent` | `lastQuery`, `lastResults`, `selectedEventId` | Event working memory |
| `hostEventAgent` (W3+) | `EventDraftState` | Wizard + `useCoAgent` ([write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write)) |

**mdeai pattern:** `schema` (not Markdown template) — same shape in agent file, `lib/types.ts`, and `useCoAgent<T>`.

**User story — Roberto wizard sync (J5):**  
As Roberto, when the agent sets `venueName` in working memory, the `/host/event/new` form updates without me retyping — agent Zod = UI state.

**User story — Thread vs resource scope:**  
As Camila, my **thread** memory resets per new chat tab; **resource** scope (Phase 2) remembers “I always want furnished” across sessions.

---

### Conversation history

**Doc:** [Message history](https://mastra.ai/docs/memory/message-history) · **mdeai:** [examples/features/07-message-history.md](examples/features/07-message-history.md)

**mdeai:** `lastMessages: 20` in `createThreadMemory` — enough for budget → results → follow-up without sending full tool JSON every turn.

**User story — Shorter context, lower cost:**  
As Patricia, if token spend spikes on `/chat`, we lower `lastMessages` or add `ToolCallFilter` on memory processors so old `search-rentals` dumps drop out of context but working memory keeps listing IDs.

---

### Memory processors

**Doc:** [Memory Processors](https://mastra.ai/docs/memory/memory-processors) · **mdeai deep dive:** [examples/features/06-memory-processors.md](examples/features/06-memory-processors.md)

| Processor | mdeai today | Target |
|-----------|-------------|--------|
| `TokenLimiter` on **Memory** | Not on Memory yet | Trim retrieved messages before LLM |
| `TokenLimiter` on **concierge agent** | `8192` in `concierge.ts` | Output/stream guard |
| `ToolCallFilter` | — | Drop verbose tool blobs from history |
| `PromptInjectionDetector` | concierge input | Security (not memory processor) |
| Custom PII filter | Backlog | Strip phone/email from recalled messages |

**User story — Order matters:**  
As Sofía, I chain `ToolCallFilter` then `TokenLimiter` last ([docs](https://mastra.ai/docs/v0/memory/memory-processors)) so trimming happens after tool noise is removed.

---

### Postgres memory (F13)

**Doc:** [Storage](https://mastra.ai/docs/memory/storage) · [Memory with PostgreSQL](https://mastra.ai/docs/v0/memory/storage/memory-with-pg) · **mdeai:** [examples/features/08-storage.md](examples/features/08-storage.md)

**Target (F13):**

```text
Mastra({ storage: PostgresStore(DATABASE_URL) })
createThreadMemory → same PostgresStore (not separate file DB)
semanticRecall → PgVector + fastembed (Phase 2, VDB-02)
```

**User story — Survive redeploy (J10):**  
As Camila, when Vercel cold-starts, turn 11 still remembers turns 1–10 — `mastra_messages` on Supabase Postgres, not `:memory:` LibSQL.

**User story — Semantic recall (Phase 2):**  
As a Tourist, “that restaurant you suggested yesterday” pulls the right turn via `semanticRecall.topK` without Camila re-pasting the name.

**Acceptance (J10):** `thread` = session id, `resource` = user id; CopilotKit chat after redeploy recalls last intent.

---

## Feature catalog — Mastra RAG (mdeai)

Phase 1 search is **Supabase SQL tools**, not vector RAG. Mastra RAG docs describe Phase 2+ **host docs**, **policy KB**, and **evaluation corpora**.

### RAG overview

**Doc:** [RAG overview](https://mastra.ai/docs/rag/overview) · **mdeai:** [examples/rag/01-overview.md](examples/rag/01-overview.md)

| Phase 1 (now) | Phase 2 (RAG) |
|---------------|---------------|
| `search-rentals` → Postgres | Host upload PDF → chunk → embed |
| `search-events` → Supabase | Sponsor policy RAG for Roberto |
| Grounding MCP (MAP-002) | Complements, not replaces, listings SQL |

**User story — Why SQL first:**  
As Camila, listing price and URL must come from `rentals` rows with RLS — vector similarity alone cannot replace transactional search.

---

### Chunking and embedding

**Doc:** [Chunking and Embedding](https://mastra.ai/docs/rag/chunking-and-embedding) · **mdeai:** [examples/rag/02-chunking-and-embedding.md](examples/rag/02-chunking-and-embedding.md)

**mdeai candidate corpus:** Roberto’s venue contracts, Medellín AI host guidelines, sponsor T&Cs.

**User story — Host help (J11):**  
As Roberto, I upload a PDF venue rules doc; chunks use `semantic-markdown` strategy; embeddings land in pgvector index `host-docs`.

---

### Vector databases

**Doc:** [Vector Databases](https://mastra.ai/docs/rag/vector-databases) · **mdeai:** [examples/rag/03-vector-databases.md](examples/rag/03-vector-databases.md)

**mdeai choice:** `PgVector` on existing Supabase Postgres ([memory-with-pg](https://mastra.ai/docs/v0/memory/storage/memory-with-pg)) — one `DATABASE_URL`, no separate Pinecone bill for Phase 2.

**Metadata filters:** `{ hostId: robertoUserId }` so RAG never returns another host’s contract chunks.

---

### Retrieval

**Doc:** [Retrieval](https://mastra.ai/docs/rag/retrieval) · **mdeai:** [examples/rag/04-retrieval.md](examples/rag/04-retrieval.md) · GraphRAG: [05-graph-rag.md](examples/rag/05-graph-rag.md)

| Pattern | mdeai use |
|---------|-----------|
| `pgVector.query` + `topK` | Internal admin “search policy” |
| `createVectorQueryTool` | `hostEventAgent` answers “max capacity for rooftop events?” |
| Re-rank (`@mastra/rag`) | Optional on host doc Q&A |
| Graph RAG | Defer |

**User story — Policy Q&A (Roberto):**  
As Roberto, I ask “what’s our refund policy for rain?” and the agent calls `vectorQueryTool` with filter `{ category: "refund" }` — answer cites chunk metadata, not invented policy.

**Not for:** Camila rental cards (use `search-rentals` tool output).

---

## Feature catalog — Server, storage & deployment (mdeai)

### Pattern 1 vs Mastra Server

| Pattern | URL | mdeai |
|---------|-----|-------|
| **CopilotKit Pattern 1** | Next `POST /api/copilotkit` | **Production** — Camila, Roberto |
| **Mastra Server** (`mastra build`) | `:4111` Hono | **Dev only** — Studio + legacy reference |
| **Mastra Cloud** | Managed | Evaluate vs Vercel for agent-only deploy |

**Doc:** [Mastra Server](https://mastra.ai/docs/v0/server-db/mastra-server) · [Deployment overview](https://mastra.ai/docs/v0/deployment/overview)

**User story — No second production port (Sofía):**  
As Sofía, I never point production CopilotKit `runtimeUrl` at `:4111` — Pattern 2 is frozen in `/home/sk/mde/my-mastra-app`; mdeapp agents run **inside** Next ([copilot-runtime](https://docs.copilotkit.ai/mastra/copilot-runtime)).

**Deployment path:** [With a Web Framework](https://mastra.ai/docs/v0/deployment/overview) = Vercel Next.js + `mastra` imported in API route, not standalone Hono on VM.

---

### Runtime context

**Doc:** [Runtime Context](https://mastra.ai/docs/v0/server-db/runtime-context)

| Key | Set from | Affects |
|-----|----------|---------|
| `user-tier` | Supabase profile | Tool limits (future) |
| `locale` | `Accept-Language` / user pref | Instructions (English Phase 1) |
| `host-id` | Auth on `/host/event/new` | RLS in tools |
| `copilotkit-pattern` | Middleware | `ai_runs` logging |

**User story — Enterprise host (Roberto):**  
As Roberto (enterprise tier), `runtimeContext.set("user-tier", "enterprise")` enables stricter `evaluationAgent` rerank or extra workflow steps — without forking agent binaries.

**CopilotKit:** Pass `runtimeContext` from `api/copilotkit/route.ts` when bridging `MastraAgent` (F13).

**Not the same as:** working memory — runtime context is per-request; memory persists across turns ([overview](https://mastra.ai/docs/v0/memory/overview)).

---

### Custom API routes

**Doc:** [Custom API Routes](https://mastra.ai/docs/v0/server-db/custom-api-routes)

**mdeai:** Product HTTP for AI = **`/api/copilotkit`** (Next), not `registerApiRoute` on Mastra server.

**Valid Mastra custom routes (Phase 2 ops):** `GET /health/agents` on standalone server for Patricia — or keep health in Next `route.ts`.

**User story — Webhook isolation (Andrés):**  
Stripe finalize stays **Supabase edge** — not a Mastra custom route — so ticket money never shares agent server middleware.

---

### MastraStorage

**Doc:** [Storage](https://mastra.ai/docs/v0/server-db/storage)

| Table / use | mdeai Phase 1 | F13 target |
|-------------|---------------|------------|
| `mastra_messages` / threads | File LibSQL + `:memory:` main | Postgres |
| `workflow_snapshots` | Ephemeral | Postgres (Roberto suspend) |
| `mastra_ai_spans` / traces | Studio local | Patricia observability |
| `mastra_resources` | — | Resource-scoped working memory |

**User story — Patricia debug:**  
As Patricia, when Camila reports wrong recall, I query `mastra_messages` for `thread_id` and compare to CopilotKit `ai_runs` — same user, two audit trails.

**Query format:** Prefer `format: "v2"` for UIMessage-shaped rows when building admin UI.

---

## Feature catalog — Mastra workflows (mdeai)

### Workflows overview

**Doc:** [Workflows overview](https://mastra.ai/docs/workflows/overview) · [Control flow](https://mastra.ai/docs/workflows/control-flow) · **mdeai:** [examples/workflows/01-control-flow.md](examples/workflows/01-control-flow.md)

| Workflow | Steps | Persona | Output |
|----------|-------|---------|--------|
| `rental-search-workflow` | search → format → rerank | Camila via router | ≤5 cards + Best-for labels |
| `event-discovery-workflow` | search → format | Camila via router | Event cards |
| `concierge-routing-workflow` | classify → dispatch | Internal / batch | Deterministic branch |

**User story — Deterministic rental cards:**  
As Camila, when the router dispatches `rental-search-workflow`, I get the same card shape every time — rerank step applies “Best for remote work” labels from rules + scores, not free-form LLM labels.

**Studio:** Run workflow with `{ neighborhood: "Laureles", maxPricePerNight: 80 }` before testing chat.

---

### Workflow state

**Doc:** [Workflow state](https://mastra.ai/docs/v0/workflows/workflow-state)

**mdeai today:** Steps pass data via `inputSchema`/`outputSchema` chains (rental search → format → rerank). **Workflow-level `stateSchema`** not used yet.

**User story — Future progress bar (Roberto):**  
As Roberto, during long host onboarding, a workflow `stateSchema` could track `{ step: "venue" | "tiers" | "preview" }` for a progress UI without stuffing everything into agent working memory.

**Phase 2:** Add `stateSchema` to `rental-search-workflow` for `processedCount` when merging DB + Places enrichment.

---

### Agents and tools inside workflow steps

**Doc:** [Agents and Tools in workflows](https://mastra.ai/docs/workflows/agents-and-tools) · **mdeai:** [examples/workflows/02-agents-and-tools.md](examples/workflows/02-agents-and-tools.md)

| Pattern | mdeai usage |
|---------|-------------|
| Call `searchRentals()` in step `execute` | `rental-search-workflow` step 1 |
| Call tool `.execute({ context })` | Same helpers as agent tools |
| Agent-as-step | **Defer** — `evaluationAgent` rerank could become step 3 LLM judge |

**User story — Shared search helper:**  
As Sofía, `search-rentals` logic is imported by both `rentalAgent` and the workflow step — one Supabase/mock path, no duplicate SQL.

---

### Suspend & resume + snapshots + HITL

**Docs:** [suspend-and-resume](https://mastra.ai/docs/workflows/suspend-and-resume) · [human-in-the-loop](https://mastra.ai/docs/workflows/human-in-the-loop) · [snapshots](https://mastra.ai/docs/workflows/snapshots) · **mdeai:** [04-suspend](examples/workflows/04-suspend-and-resume.md) · [05-HITL](examples/workflows/05-human-in-the-loop.md) · [03-snapshots](examples/workflows/03-snapshots.md)

| Mechanism | Official | mdeai Phase 1 | mdeai Phase 2 |
|-----------|----------|---------------|---------------|
| `suspend()` in tool/step | Pause workflow; persist snapshot | — | `preview_and_publish` Mastra tool |
| `resume({ resumeData })` | Continue from suspended step | — | After Roberto approves |
| `suspendSchema` / `resumeSchema` | Payload for UI | — | Publish sheet copy |
| CopilotKit `renderAndWaitForResponse` | Frontend HITL | **J5 Roberto publish** | Same |
| CopilotKit `useInterrupt` | Maps to tool `suspend()` | — | Align with Mastra native HITL |
| Snapshots in `workflow_snapshots` | Needs durable `storage` | LibSQL memory only | F13 Postgres |

**User story — Roberto publish gate (J5):**  
As Roberto, when I click “Publish,” I see an approval panel; until I confirm, no row is written to `events` — workflow stays suspended or frontend HITL blocks the tool result.

**User story — Deploy safety (Sofía):**  
As Sofía, after Vercel redeploy, in-flight suspended publishes must resume from Postgres snapshots (F13), not vanish with `:memory:` storage.

**Real-world example:** Mastra doc’s `approval-step` with `{ confirm, approver }` maps to Roberto's “Publish event to Medellín AI calendar?” sheet.

---

## Feature catalog — Mastra streaming (mdeai)

CopilotKit already streams Camila’s chat over [AG-UI](https://docs.copilotkit.ai/mastra/ag-ui). Mastra streaming docs describe the **same lifecycle** on the agent/workflow side before the runtime bridges it to the browser.

### Streaming overview

**Doc:** [Streaming overview](https://mastra.ai/docs/streaming/overview) · **mdeai:** [examples/streaming/01-overview.md](examples/streaming/01-overview.md)

| API | When mdeai uses it | Persona |
|-----|------------------|---------|
| `agent.stream()` | Studio chat tab, smoke scripts | Sofía |
| `agent.streamLegacy()` | **Do not** — V1 models only | — |
| `run.stream()` / `streamVNext()` | Studio workflow runs | Sofía, Patricia (ops) |
| `agent.network()` stream | Phase 2 only | — |

**User story — Tokens in sidebar (Camila):**  
As Camila, I see the concierge reply appear word-by-word in `/chat`, not a blank wait then a wall of text — CopilotKit consumes Mastra’s stream via Pattern 1 runtime.

**User story — Studio workflow run (Sofía):**  
As Sofía, I run `rental-search-workflow` in Studio with **Stream** and watch `step-start` → `step-finish` before wiring the router in production.

**mdeai path:** Product chat = `POST /api/copilotkit` (no direct `conciergeAgent.stream()` in React). Direct `.stream()` is for **debugging** and CI, not the default UI path.

---

### Streaming events

**Doc:** [Streaming events](https://mastra.ai/docs/v0/streaming/events)

| Mastra event | AG-UI / CopilotKit analogue | mdeai moment |
|--------------|---------------------------|--------------|
| `start` | Run begins | Camila sends first message |
| `text-delta` | Text chunks in sidebar | Concierge explains Laureles |
| `tool-call` | Tool invoked (name + args) | `search-rentals` with neighborhood |
| `tool-result` | Tool output | JSON → rental cards |
| `step-start` / `step-finish` | — (workflow-only) | Router → `rental-search-workflow` in Studio |
| `finish` | Run complete + usage | Patricia reads `ai_runs` tokens |

**User story — Inspector correlation (Lucía):**  
As Lucía, when a card is missing, I compare Mastra `tool-call` payload (Studio or logs) with CopilotKit Inspector `tool-output-available` — same `toolCallId` / tool name (`search-rentals`).

**Network events** (`routing-agent-start`, `agent-execution-start`, …): only if Phase 2 adopts [networks](https://mastra.ai/docs/v0/agents/networks). Phase 1 router uses workflow events, not network stream types.

---

### Tool streaming

**Doc:** [Tool streaming](https://mastra.ai/docs/v0/streaming/tool-streaming)

| Pattern | mdeai fit | Persona |
|---------|-----------|---------|
| `writer.write({ type, status })` in `execute` | “Searching Supabase…” before rows return | Camila |
| `writer.custom({ type: "data-tool-progress" })` | Skeleton rental cards in chat | Camila |
| Pipe `agent.stream().textStream` → `writer` | Sub-agent summary inside tool | Phase 2 enrichment |

**User story — Progress while DB is slow:**  
As Camila, when `search-rentals` hits a cold Supabase pool, I still see “Searching Laureles…” in the thread instead of a frozen spinner — tool emits `pending` then `success` via `writer` (MAP/backlog: add to `search-rentals.ts` when p95 > 2s).

**Rule:** Always `await writer.write(...)` — otherwise `WritableStream is locked` ([tool streaming doc](https://mastra.ai/docs/v0/streaming/tool-streaming)).

**CopilotKit:** Map custom chunk types in `useCopilotAction` render or a dedicated progress component; keep **listing IDs** in final `tool-result` only.

---

### Workflow streaming

**Doc:** [Workflow streaming](https://mastra.ai/docs/v0/streaming/workflow-streaming)

| Pattern | mdeai workflow | Persona |
|---------|----------------|---------|
| `run.streamVNext({ inputData })` | `rental-search-workflow`, `event-discovery-workflow` | Sofía in Studio |
| Step `writer` in `execute` | Per-step “Fetched 12 rows, reranking…” | Patricia ops dashboard (Phase 2) |
| `resumeStreamVNext` after `suspend` | Roberto publish pipeline | Roberto + Sofía (F13) |

**User story — Headless router quality (J6):**  
As Sofía, I stream `concierge-routing-workflow` with `{ message: "apartments in Envigado" }` and assert events: `workflow-step-start` (classify) → `workflow-step-start` (dispatch) → success — without opening the browser.

**User story — Resume stream after HITL (Roberto, Phase 2):**  
As Roberto, after I approve publish, the workflow stream resumes with `resumeStreamVNext` so the host UI can show “Publishing…” then “Live” without starting a new run.

---

## Feature catalog — Mastra MCP (mdeai)

**Docs:** [MCP overview](https://mastra.ai/docs/v0/mcp/overview) · [Publishing an MCP server](https://mastra.ai/docs/v0/mcp/publishing-mcp-server)

### Two MCP worlds in mdeai

| Kind | Examples | Product? |
|------|----------|----------|
| **Dev / IDE MCP** | `.mcp.json` → `mastra` docs server, `copilotkit` HTTP MCP, Supabase MCP, `google-maps-code-assist` | Authoring only — Sofía, not Camila |
| **Product MCP (`MCPClient`)** | Google Grounding Lite, future Places MCP | Tourist `/chat` — **MAP-002** |
| **Expose mdeai (`MCPServer`)** | Publish agents/tools to Cursor | **Not Phase 1** — internal SaaS is web app, not npm MCP package |

**Do not confuse:** `@mastra/mcp-docs-server` (npx docs) with **Maps Grounding** (`mapstools.googleapis.com/mcp` per `tasks/maps/notes.md`).

---

### MCPClient — consuming external tools

**Doc:** [MCP overview — MCPClient](https://mastra.ai/docs/v0/mcp/overview)

| Approach | mdeai use |
|----------|-----------|
| `await mcp.getTools()` static | Single-tenant dev agent spike |
| `await mcp.getToolsets()` per request | Multi-tenant host org keys (Phase 3) |
| Registry (Smithery, Klavis, …) | Evaluate for sponsor CRM — not W1–W6 |

**User story — Tourist grounded restaurants (J9 / MAP-002):**  
As a Tourist on `/chat`, when I ask “best arepas near Poblado,” `conciergeAgent` calls a **Grounding Lite MCP tool** (not hallucinated venue names) and cards show attribution + `placeId` for the map pin.

**Journey (Phase 2)**

1. Add `MCPClient` in `src/mastra/mcp/grounding-lite-client.ts` (URL + field mask).
2. Merge tools: `{ ...localTools, ...(await groundingClient.getTools()) }` on `conciergeAgent` only.
3. CopilotKit [MCP Apps](https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps) or tool-rendering for widget.
4. Lucía E2E: message → `tool-call` → card with grounded source.

**Acceptance:** Every Places/Grounding call includes `X-Goog-FieldMask` (cost + schema); pins use `mapId` on parent `<Map>` (MAP-001).

---

### MCPServer — publishing mdeai (deferred)

**Doc:** [Publishing an MCP Server](https://mastra.ai/docs/v0/mcp/publishing-mcp-server)

mdeai **does not** ship `npx @mdeai/mcp-server` in Phase 1. Andrés buys tickets on the web; Camila chats in the app — not via Cursor MCP.

**When it would matter:** Internal Patricia tooling (“query leads from Claude Desktop”) or partner white-label — then expose `search-rentals` + `search-events` via `MCPServer` + `mcpServers` on `Mastra({})`.

**User story — Partner integrator (future):**  
As a partner dev, I run `npx -y @medellin-ai/mcp-tools` and get read-only event search — same schemas as `search-events` tool, RLS-safe service account.

---

### Dev MCP vs product MCP (Sofía)

| MCP | Purpose | Journey |
|-----|---------|---------|
| `user-mastra` (stdio docs) | Verify `streamVNext` API before coding | Sofía authoring |
| `user-supabase` | RLS audit on `events` / rentals | Patricia / Sofía |
| CopilotKit coding-agents | Search CK docs | Sofía |
| Grounding Lite (product) | Live place data | Tourist J4 / J9 |

---

## Official Mastra agent examples (separate docs)

Each example has its own file under [`examples/`](examples/) with user stories, mdeai file paths, and CopilotKit notes.

| Example doc | Source | mdeai takeaway |
|-------------|--------|----------------|
| [01-calling-agents](examples/01-calling-agents.md) | [calling-agents](https://mastra.ai/examples/v0/agents/calling-agents) | Prod = CopilotKit; Studio/`getAgent` for smoke |
| [02-system-prompt](examples/02-system-prompt.md) | [system-prompt](https://mastra.ai/examples/v0/agents/system-prompt) | Specialist agents > per-turn voice swap |
| [03-supervisor-agent](examples/03-supervisor-agent.md) | [supervisor-agent](https://mastra.ai/examples/v0/agents/supervisor-agent) | Router+workflows now; host copy pipeline later |
| [04-image-analysis](examples/04-image-analysis.md) | [image-analysis](https://mastra.ai/examples/v0/agents/image-analysis) | Roberto venue/flyer → `hostEventAgent` W4+ |
| [05-runtime-context](examples/05-runtime-context.md) | [runtime-context](https://mastra.ai/examples/v0/agents/runtime-context) | Tier/surface/host-id on `/api/copilotkit` |
| [06-ai-sdk-v5-integration](examples/06-ai-sdk-v5-integration.md) | [ai-sdk-v5](https://mastra.ai/examples/v0/agents/ai-sdk-v5-integration) | Reference only; Pattern 1 in Phase 1 |
| [07-whatsapp-chat-bot](examples/07-whatsapp-chat-bot.md) | [whatsapp](https://mastra.ai/examples/v0/agents/whatsapp-chat-bot) | Phase 2+ channel; same `conciergeAgent` brain |
| [08-working-memory-template](examples/08-working-memory-template.md) | [WM template](https://mastra.ai/examples/v0/memory/working-memory-template) | Admin/ops only — not Camila |
| [09-working-memory-schema](examples/09-working-memory-schema.md) | [WM schema](https://mastra.ai/examples/v0/memory/working-memory-schema) | **`createThreadMemory`** — Phase 1 |
| [browser/](examples/browser/00-index.md) | [Browser docs](https://mastra.ai/docs/browser/overview) | Defer — use Maps APIs + Playwright E2E |
| [domains/](examples/domains/00-index.md) | Vertical playbooks | Rentals, events, restaurants, maps |

---

## Official Mastra platform features (separate docs)

Deep dives under [`examples/features/`](examples/features/00-index.md). Summaries remain in **Feature catalog — Mastra memory** above; do not duplicate full tables here.

| Feature doc | Source | mdeai takeaway |
|-------------|--------|----------------|
| [01-background-tasks](examples/features/01-background-tasks.md) | [background-tasks](https://mastra.ai/docs/agents/background-tasks) | Slow `search-*` after F13; `streamUntilIdle` admin-only |
| [02-a2a](examples/features/02-a2a.md) | [a2a](https://mastra.ai/docs/agents/a2a) | Partner agents Phase 3 — not `:4111` prod |
| [03-acp](examples/features/03-acp.md) | [acp](https://mastra.ai/docs/agents/acp) | Sofía dev codemods — not Vercel |
| [04-signals](examples/features/04-signals.md) | [signals](https://mastra.ai/docs/agents/signals) | Stripe/WhatsApp inject thread (alpha) |
| [05-workspace](examples/features/05-workspace.md) | [workspace](https://mastra.ai/docs/workspace/overview) | VPS enrichment — not Camila chat |
| [06-memory-processors](examples/features/06-memory-processors.md) | [memory-processors](https://mastra.ai/docs/memory/memory-processors) | `ToolCallFilter` on `/chat` Phase 2 |
| [07-message-history](examples/features/07-message-history.md) | [message-history](https://mastra.ai/docs/memory/message-history) | `lastMessages: 20`; client sends new msg only |
| [08-storage](examples/features/08-storage.md) | [storage](https://mastra.ai/docs/memory/storage) | **F13** unify Postgres |
| [09-semantic-recall](examples/features/09-semantic-recall.md) | [semantic-recall](https://mastra.ai/docs/memory/semantic-recall) | VDB-02 — not MAP-002 Grounding |
| [10-multi-user-threads](examples/features/10-multi-user-threads.md) | [multi-user-threads](https://mastra.ai/docs/memory/multi-user-threads) | Roberto + co-host `event_*` resource |
| [11-observational-memory](examples/features/11-observational-memory.md) | [observational-memory](https://mastra.ai/docs/memory/observational-memory) | Long `/chat` after F13 PG |

---

## Official Mastra workflows (separate docs)

[`examples/workflows/`](examples/workflows/00-index.md) — deep dives; catalog above in **Feature catalog — Mastra workflows**.

| Doc | Source | mdeai takeaway |
|-----|--------|----------------|
| [wf: control-flow](examples/workflows/01-control-flow.md) | [control-flow](https://mastra.ai/docs/workflows/control-flow) | `.then()` rental pipeline |
| [wf: agents-tools](examples/workflows/02-agents-and-tools.md) | [agents-and-tools](https://mastra.ai/docs/workflows/agents-and-tools) | Shared `search-rentals` helper |
| [wf: snapshots](examples/workflows/03-snapshots.md) | [snapshots](https://mastra.ai/docs/workflows/snapshots) | F13 + Roberto publish |
| [wf: suspend](examples/workflows/04-suspend-and-resume.md) | [suspend-and-resume](https://mastra.ai/docs/workflows/suspend-and-resume) | Phase 2 server resume |
| [wf: HITL](examples/workflows/05-human-in-the-loop.md) | [human-in-the-loop](https://mastra.ai/docs/workflows/human-in-the-loop) | J5 CK `renderAndWaitForResponse` |
| [wf: time-travel](examples/workflows/06-time-travel.md) | [time-travel](https://mastra.ai/docs/workflows/time-travel) | Sofía debug rerank |
| [wf: errors](examples/workflows/07-error-handling.md) | [error-handling](https://mastra.ai/docs/workflows/error-handling) | `ai_runs` + retries |
| [wf: scheduled](examples/workflows/08-scheduled-workflows.md) | [scheduled-workflows](https://mastra.ai/docs/workflows/scheduled-workflows) | VPS only — not Vercel |

---

## Streaming, Editor, MCP, Workspace, RAG (separate docs)

| Index | Topics |
|-------|--------|
| [streaming/](examples/streaming/00-index.md) | [overview](https://mastra.ai/docs/streaming/overview), [events](https://mastra.ai/docs/streaming/events), [workflow-streaming](https://mastra.ai/docs/streaming/workflow-streaming), [background-task-streaming](https://mastra.ai/docs/streaming/background-task-streaming) |
| [editor/](examples/editor/00-index.md) | [tools](https://mastra.ai/docs/editor/tools), [prompts](https://mastra.ai/docs/editor/prompts) |
| [mcp/](examples/mcp/00-index.md) | [overview](https://mastra.ai/docs/mcp/overview), [mcp-apps](https://mastra.ai/docs/mcp/mcp-apps) |
| [workspace/](examples/workspace/00-index.md) | [overview](https://mastra.ai/docs/workspace/overview), filesystem, sandbox, LSP, skills, search — VPS only |
| [rag/](examples/rag/00-index.md) | [overview](https://mastra.ai/docs/rag/overview), chunking, vector DB, retrieval, GraphRAG — J11 Roberto |
| [evals/](examples/evals/00-index.md) | [overview](https://mastra.ai/docs/evals/overview), built-in/custom scorers, CI, memory evals, datasets — J12 Lucía, Sofía |

### Evals (separate docs)

[`examples/evals/`](examples/evals/00-index.md) — deep dives; full stories in each file.

| Doc | Source | mdeai takeaway |
|-----|--------|----------------|
| [evals: overview](examples/evals/01-overview.md) | [overview](https://mastra.ai/docs/evals/overview) | Live + trace + CI scoring; `mastra_scorers` table |
| [evals: built-in](examples/evals/02-built-in-scorers.md) | [built-in-scorers](https://mastra.ai/docs/evals/built-in-scorers) | `tool-call-accuracy` on concierge/router |
| [evals: custom](examples/evals/03-custom-scorers.md) | [custom-scorers](https://mastra.ai/docs/evals/custom-scorers) | Card Zod + `evaluationAgent` label enum |
| [evals: CI](examples/evals/04-running-in-ci.md) | [running-in-ci](https://mastra.ai/docs/evals/running-in-ci) | F09 Vitest + `runEvals` thresholds |
| [evals: memory](examples/evals/05-evals-with-memory.md) | [evals-with-memory](https://mastra.ai/docs/evals/evals-with-memory) | J10 thread/resource in evals |
| [evals: datasets](examples/evals/06-datasets-overview.md) | [datasets/overview](https://mastra.ai/docs/evals/datasets/overview) | `rental-search-golden` versioned |
| [evals: experiments](examples/evals/07-running-experiments.md) | [running-experiments](https://mastra.ai/docs/evals/datasets/running-experiments) | Compare prompt/model on workflow |

---

## Mastra × CopilotKit matrix (doc → journey)

| Doc | Feature | Journey ID | Persona |
|-----|---------|------------|---------|
| [copilot-runtime](https://docs.copilotkit.ai/mastra/copilot-runtime) | Runtime bridge | J1 | Sofía |
| [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) | SSE tool events | J2, J4 | Camila, Lucía |
| [using-tools](https://mastra.ai/docs/v0/agents/using-tools) | `createTool` | J2–J4 | Camila, Tourist |
| [agent-memory](https://mastra.ai/docs/v0/agents/agent-memory) | Working memory | J2, J3, J5 | Camila, Roberto |
| [networks](https://mastra.ai/docs/v0/agents/networks) | Multi-agent routing | — (Phase 2) | — |
| [workflows/overview](https://mastra.ai/docs/v0/workflows/overview) | Step pipelines | J2, J3, J6 | Camila |
| [workflow-state](https://mastra.ai/docs/v0/workflows/workflow-state) | Cross-step state | Phase 2 | Roberto |
| [agents-and-tools](https://mastra.ai/docs/v0/workflows/agents-and-tools) | Step calls tool | J2, J6 | Camila |
| [suspend-and-resume](https://mastra.ai/docs/v0/workflows/suspend-and-resume) | Pause workflow | J5 (Phase 2 backend) | Roberto |
| [human-in-the-loop](https://mastra.ai/docs/v0/workflows/human-in-the-loop) | Approval gates | J5 | Roberto |
| [snapshots](https://mastra.ai/docs/v0/workflows/snapshots) | Durable pause | F13 | Sofía |
| [copilotkitmastra blog](https://mastra.ai/blog/copilotkitmastra) | Stack story | All | Product |
| [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) | Chat cards | J2–J4 | All search personas |
| [interrupt-flow](https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow) | Native suspend UI | Phase 2 | Roberto |
| [streaming/overview](https://mastra.ai/docs/v0/streaming/overview) | `agent.stream()` | J1, J2, J8 | Camila, Sofía |
| [streaming/events](https://mastra.ai/docs/v0/streaming/events) | `tool-call` / `text-delta` | J2, J4, J8 | Lucía |
| [streaming/tool-streaming](https://mastra.ai/docs/v0/streaming/tool-streaming) | `writer` in tools | J2 (Phase 2 UX) | Camila |
| [streaming/workflow-streaming](https://mastra.ai/docs/v0/streaming/workflow-streaming) | `streamVNext` | J6, J5 Phase 2 | Sofía, Roberto |
| [mcp/overview](https://mastra.ai/docs/v0/mcp/overview) | `MCPClient` | J9, MAP-002 | Tourist |
| [mcp/publishing-mcp-server](https://mastra.ai/docs/v0/mcp/publishing-mcp-server) | `MCPServer` npm | — (deferred) | — |
| [memory/overview](https://mastra.ai/docs/v0/memory/overview) | 3 memory types | J2, J10 | Camila |
| [memory/threads-and-resources](https://mastra.ai/docs/v0/memory/threads-and-resources) | `thread` + `resource` | J10 | Camila, Sofía |
| [memory/working-memory](https://mastra.ai/docs/v0/memory/working-memory) | Zod schema | J2, J5 | Camila, Roberto |
| [memory/conversation-history](https://mastra.ai/docs/v0/memory/conversation-history) | `lastMessages: 20` | J2, J4 | Camila |
| [memory/memory-processors](https://mastra.ai/docs/v0/memory/memory-processors) | `ToolCallFilter` | Phase 2 | Patricia |
| [memory/storage/memory-with-pg](https://mastra.ai/docs/v0/memory/storage/memory-with-pg) | Postgres + pgvector | J10, F13 | Sofía |
| [rag/overview](https://mastra.ai/docs/v0/rag/overview) | Chunk → embed → query | J11 | Roberto |
| [rag/chunking-and-embedding](https://mastra.ai/docs/v0/rag/chunking-and-embedding) | Host PDF ingest | J11 | Roberto |
| [rag/vector-databases](https://mastra.ai/docs/v0/rag/vector-databases) | `PgVector` | J11 | Sofía |
| [rag/retrieval](https://mastra.ai/docs/v0/rag/retrieval) | `createVectorQueryTool` | J11 | Roberto |
| [server-db/mastra-server](https://mastra.ai/docs/v0/server-db/mastra-server) | Hono `:411x` dev | J1 | Sofía |
| [server-db/runtime-context](https://mastra.ai/docs/v0/server-db/runtime-context) | Per-request keys | J5, J10 | Roberto |
| [server-db/custom-api-routes](https://mastra.ai/docs/v0/server-db/custom-api-routes) | Defer (use Next) | — | — |
| [server-db/storage](https://mastra.ai/docs/v0/server-db/storage) | `mastra_messages` | J10, J7 | Patricia |
| [deployment/overview](https://mastra.ai/docs/v0/deployment/overview) | Vercel + Next | F06 | Sofía |
| [ex: calling-agents](examples/01-calling-agents.md) | `getAgent` / CopilotKit | J1, J2, J6 | Sofía |
| [ex: system-prompt](examples/02-system-prompt.md) | `instructions` + runtime system | J4, J5 | Tourist, Roberto |
| [ex: supervisor](examples/03-supervisor-agent.md) | Tool wraps agent | J6, host Phase 2 | Roberto |
| [ex: image-analysis](examples/04-image-analysis.md) | Multimodal generate | J5 | Roberto |
| [ex: runtime-context](examples/05-runtime-context.md) | Dynamic agent config | J10, J5 | All |
| [ex: ai-sdk-v5](examples/06-ai-sdk-v5-integration.md) | `format: aisdk` | Phase 2 | Sofía |
| [ex: whatsapp](examples/07-whatsapp-chat-bot.md) | Webhook workflow | Phase 2+ | Camila |
| [ex: WM schema](examples/09-working-memory-schema.md) | Zod working memory | J2, J5, J10 | Camila, Roberto |
| [ex: WM template](examples/08-working-memory-template.md) | Markdown WM | — | Patricia |
| [browser](examples/browser/00-index.md) | AgentBrowser | Phase 2+ | Lucía |
| [domain: rentals](examples/domains/01-real-estate-rentals.md) | `search-rentals` | J2 | Camila |
| [domain: maps](examples/domains/05-google-maps.md) | MAP-001/002 | J2, J9 | Camila, Tourist |
| [feat: background-tasks](examples/features/01-background-tasks.md) | Async tools | J2 Phase 2 | Camila |
| [feat: storage](examples/features/08-storage.md) | Postgres | J10, F13 | Sofía |
| [feat: message-history](examples/features/07-message-history.md) | Threads | J2, J10 | Camila |
| [feat: semantic-recall](examples/features/09-semantic-recall.md) | Vector recall | J4, J11 | Tourist |
| [feat: observational-memory](examples/features/11-observational-memory.md) | Observer/Reflector | J2, J4 | Camila |
| [feat: signals](examples/features/04-signals.md) | Webhook → thread | J5 Phase 2 | Roberto |
| [feat: workspace](examples/features/05-workspace.md) | FS + sandbox | — | Sofía VPS |
| [wf: control-flow](examples/workflows/01-control-flow.md) | `.then()` chain | J2, J6 | Camila |
| [wf: HITL](examples/workflows/05-human-in-the-loop.md) | Publish gate | J5 | Roberto |
| [wf: snapshots](examples/workflows/03-snapshots.md) | Durable pause | J5, F13 | Roberto |
| [stream: events](examples/streaming/02-events.md) | tool-call/result | J2, J8 | Lucía |
| [stream: wf](examples/streaming/03-workflow-streaming.md) | `writer` progress | J6 | Sofía |
| [mcp: overview](examples/mcp/01-overview.md) | Grounding MAP-002 | J9 | Tourist |
| [editor: prompts](examples/editor/02-prompts.md) | Prompt blocks | Phase 2 | Patricia |
| [workspace](examples/workspace/00-index.md) | FS + sandbox | VPS | Sofía |
| [rag: overview](examples/rag/01-overview.md) | Doc RAG | J11 | Roberto |
| [rag: retrieval](examples/rag/04-retrieval.md) | host policy tool | J11 | Roberto |
| [evals: overview](examples/evals/01-overview.md) | Scorers live + CI | J12 | Lucía, Sofía |
| [evals: built-in](examples/evals/02-built-in-scorers.md) | tool-call-accuracy | J12 | Lucía |
| [evals: CI](examples/evals/04-running-in-ci.md) | `runEvals` | J8, J12 | Lucía |
| [evals: datasets](examples/evals/06-datasets-overview.md) | golden sets | J12 | Sofía |

---

## End-to-end journeys (numbered)

## J1 — Day-1 wiring (Sofía / any dev)

**Story:** As Sofía, I open the homepage and send one message so I know CopilotKit, Mastra, and Gemini are connected before we ship Camila’s flows.

| Field | Detail |
|-------|--------|
| **Persona** | Sofía (smoke) |
| **Surface** | `/` |
| **Agent** | `pingAgent` |
| **CopilotKit** | [Quickstart](https://docs.copilotkit.ai/mastra/quickstart) Pattern 1 |
| **Shared state** | [read](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) — `useCoAgent<MdeState>` |
| **Example** | `CopilotKit/examples/integrations/mastra/` |

**Journey**

1. `cd mdeapp && npm run dev` — UI + Mastra Studio port in terminal.
2. Open `/` — `CopilotSidebar` visible, `agent="pingAgent"`.
3. User: “ping” → agent replies briefly; `MdeState` may update in debug UI.
4. Patricia checks `ai_runs`: row for `ping-agent`, `gemini-3.5-flash`, `copilotkit-pattern-1`.

**Acceptance**

- [ ] `POST /api/copilotkit` returns 200
- [ ] Studio lists 6 agents, all `gemini-3.5-flash`
- [ ] `npm run floor` passes

**Task:** F02 (Done), F13 evidence.

---

## J2 — Camila finds a rental (multi-turn)

**Story:** As Camila, I describe budget, neighborhood, and bedrooms in chat, see ≤5 rental cards with real links, ask “when can I view?”, and the agent **stays in rental context** without restarting.

| Field | Detail |
|-------|--------|
| **Persona** | Camila |
| **Surface** | `/rentals` (chat + grid), later `/chat` |
| **Agent** | `conciergeAgent` or `rentalAgent` |
| **Mastra tools** | `search-rentals` — [Using Tools](https://mastra.ai/docs/v0/agents/using-tools) |
| **Mastra workflow** | `rental-search-workflow` — [overview](https://mastra.ai/docs/v0/workflows/overview), [agents & tools in steps](https://mastra.ai/docs/v0/workflows/agents-and-tools) |
| **Memory** | [working-memory](https://mastra.ai/docs/v0/memory/working-memory) + [threads](https://mastra.ai/docs/v0/memory/threads-and-resources) — `createThreadMemory` |
| **Runtime / AG-UI** | [copilot-runtime](https://docs.copilotkit.ai/mastra/copilot-runtime), [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) |
| **Streaming** | [events](https://mastra.ai/docs/v0/streaming/events) (`text-delta`, `tool-call`, `tool-result`) | J2, J8 |
| **Tool progress (Phase 2)** | [tool-streaming](https://mastra.ai/docs/v0/streaming/tool-streaming) `writer` on `search-rentals` | J2 |
| **Generative UI** | [Tool rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) |
| **Shared state** | [read](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) / [write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write) |
| **Example** | `integrations/mastra` weather card pattern → `RentalCard` |

**Journey**

1. Camila opens `/rentals`, sidebar: “2BR in Laureles under $80/night for June.”
2. Agent calls `search-rentals` → Mastra tool returns cards (Supabase or mock).
3. **Generative UI:** `useCopilotAction({ name: "search-rentals", available: "disabled", render })` shows Paisa cards with `source_url`, `schedule_viewing_url`.
4. Camila: “show cheaper” → agent reuses **working memory** `lastQuery`, tightens `maxPricePerNight`.
5. Camila: “when can I view?” → answers from `selectedListingId` / top pick — **no new blind search**.
6. Optional: map pins from lat/lng in tool output (MAP-001).

**Acceptance**

- [ ] Follow-up “when can I view?” does not reset to chitchat (router/concierge instructions)
- [ ] Cards show max 5 listings; prices/URLs match tool JSON (never invented)
- [ ] `ai_runs` logs `concierge-agent` or `rental-agent`
- [ ] Inspector shows `tool-input-available` / `tool-output-available` pairs (Sofía)

**Tasks:** F17, F46 (MVP thin), MAP-001, F19.

---

## J3 — Camila discovers events this weekend

**Story:** As Camila, I ask what’s on in Medellín this weekend, see event cards with venue and time, then ask “any cheaper tickets?” without losing the event context.

| Field | Detail |
|-------|--------|
| **Persona** | Camila |
| **Surface** | `/chat` or `/rentals` sidebar |
| **Agent** | `conciergeAgent` or `eventAgent` |
| **Mastra tools** | `search-events` |
| **Workflow** | `event-discovery-workflow` |
| **Generative UI** | [Tool rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) — `search-events` action name |
| **Data** | Supabase `events`, Bogota date windows |

**Journey**

1. “What’s on this weekend in Poblado?” → `search-events` with `dateWindow: this_weekend`.
2. Chat renders event cards (`startsAt` in local time copy).
3. “Any cheaper?” → `maxPricePerTicket` reduced, same category/neighborhood from memory.
4. Click-through to ticket flow (Andrés journey — Stripe, out of Mastra scope).

**Acceptance**

- [ ] `dateWindow` resolves in America/Bogota (not UTC midnight surprise)
- [ ] Empty DB → honest message + relaxed filter (agent instructions)
- [ ] Tool name `search-events` === `useCopilotAction` name

**Tasks:** F14/F15, event-discovery workflow (ported).

---

## J4 — Tourist asks concierge (multi-intent)

**Story:** As a Tourist, I use one chat for “dinner in Laureles” and “salsa night Saturday” without the app forgetting which topic I’m on.

| Field | Detail |
|-------|--------|
| **Persona** | Tourist |
| **Surface** | `/chat` |
| **Agent** | `conciergeAgent` |
| **Tools** | `search-restaurants`, `search-attractions`, `search-events`, `search-rentals` |
| **Processors** | Prompt injection + 8k token limit |
| **App context** | [Agent app context](https://docs.copilotkit.ai/mastra/agent-app-context) — neighborhood, map bounds |
| **Example** | Feature viewer [agentic chat](https://feature-viewer.copilotkit.ai/mastra/feature/agentic_chat) |

**Journey**

1. “Best bandeja paisa in Laureles?” → `search-restaurants`.
2. “What about a salsa event Saturday?” → `search-events`; memory tracks `lastIntent`.
3. Map shows restaurant pins + event pins (per-category merge — see `mdeai-concierge.md`).
4. Follow-up “what time does it start?” → quotes `startsAt` from memory, no re-search.

**Acceptance**

- [ ] Four tools registered on agent; Studio shows tool count 4
- [ ] No payment or booking claims in prose (commission model = links out)
- [ ] Grounding attribution when MAP-002 adds Maps-backed answers

**Tasks:** F19, MAP-002, MAP-001.

---

## J5 — Roberto creates an event (wizard + HITL publish)

**Story:** As Roberto, I describe my event in natural language, see the wizard fill from AI, review a preview, and **approve publish** before anything goes live.

| Field | Detail |
|-------|--------|
| **Persona** | Roberto |
| **Surface** | `/host/event/new` |
| **Agent** | `hostEventAgent` (W3+) |
| **Mastra tools** | `set_event_basics`, `set_venue`, `add_ticket_tier`, `preview_and_publish` |
| **Shared state** | `EventDraftState` — Zod in agent, `useCoAgent` on wizard ([write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write)) |
| **Frontend tools** | [Frontend tools](https://docs.copilotkit.ai/mastra/frontend-tools) — form field updates in browser |
| **HITL (CopilotKit)** | [Tool-based HITL](https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based) — `renderAndWaitForResponse` |
| **HITL (Mastra, Phase 2)** | [suspend/resume](https://mastra.ai/docs/v0/workflows/suspend-and-resume), [HITL](https://mastra.ai/docs/v0/workflows/human-in-the-loop), [snapshots](https://mastra.ai/docs/v0/workflows/snapshots) on `preview_and_publish` |
| **Example** | `integrations/mastra` `go_to_moon` / `MoonCard`; `canvas/mastra` for rich state |

**Journey**

1. Roberto: “Salsa night for 200 at a rooftop in Comuna 13, $20 tickets.”
2. Agent calls backend tools → updates `EventDraftState` (title, capacity, venue).
3. Frontend tools adjust wizard steps (date picker, image slot) without service-role in browser.
4. **State rendering:** wizard panel mirrors `useCoAgent<EventDraftState>` (title, tiers, venue).
5. Agent calls `preview_and_publish` → **HITL UI** (`ApprovalPanel`) with `respond(approved | rejected)`.
6. On approve → edge fn / server action writes Supabase `events` (deterministic, not LLM).

**Acceptance**

- [ ] `EventDraftState` single schema: agent Zod = `lib/types.ts` = wizard (F33)
- [ ] Publish blocked until HITL `respond({ approved: true })`
- [ ] No ticket inventory mutation from chat prose alone
- [ ] `hostEventAgent` uses `gemini-3.5-flash` (or `PRO_MODEL` only if Flash fails on long form)

**Tasks:** F33, F34, F36, F38, W4 HITL.

---

## J6 — Router dispatch (headless quality path)

**Story:** As the platform, when a power user hits `/chat` with `routerAgent`, we classify intent once and run the right workflow without the router writing long prose.

| Field | Detail |
|-------|--------|
| **Persona** | Camila (via router) / Sofía (test) |
| **Surface** | `/chat` (optional entry) |
| **Agent** | `routerAgent` (workflows, not Mastra [networks](https://mastra.ai/docs/v0/agents/networks) in Phase 1) |
| **Tools** | `classify-intent` |
| **Workflows** | `rental-search-workflow`, `event-discovery-workflow` |
| **Rule** | confidence ≥ 0.6 → dispatch; follow-ups inherit intent |

**Journey**

1. “2BR Poblado under 90” → classify `rental_search` → `rentalSearchWorkflow` → formatted cards returned to UI via workflow output (then render in chat).
2. “when can I view?” after rental turn → still `rental_search` (instruction preservation).
3. “salsa tonight” after events turn → `event_discovery`, not rental.

**Acceptance**

- [ ] Router does not call both workflows in one turn
- [ ] Studio shows 2 workflows on router agent
- [ ] Workflow smoke in CI (backlog)

**Tasks:** F18, F46.

---

## J7 — Patricia audits AI usage

**Story:** As Patricia, I see every CopilotKit turn in `ai_runs` with agent name, model, and duration so I can reconcile Gemini cost and debug spikes.

| Field | Detail |
|-------|--------|
| **Persona** | Patricia |
| **Surface** | `/admin/*` (read-only SQL / dashboard) |
| **Mechanism** | `LoggingMastraAgent` → `logAgentRunForTurn` |
| **Not** | Mastra Studio alone (engineering traces) |

**Acceptance**

- [ ] Row per sidebar turn with `metadata.integration: copilotkit-pattern-1`
- [ ] `agent_name` matches kebab id (`concierge-agent`, not map key)

**Task:** F13 (Done).

---

## J8 — Lucía E2E regression

**Story:** As Lucía, I run Playwright against J1 + J2 critical paths so we never merge a broken `/api/copilotkit`.

| Field | Detail |
|-------|--------|
| **Persona** | Lucía |
| **Tooling** | Playwright + [Inspector](https://docs.copilotkit.ai/mastra/inspector) on failure |

**Scenarios**

1. Homepage loads; sidebar sends message; response non-empty.
2. `/rentals` — search message → card region visible (or mock fallback banner).
3. Console: no uncaught AG-UI errors.

**Tasks:** W3+ Playwright suite.

---

## J12 — Lucía & Sofía scorer regression (evals)

**Story:** As Lucía and Sofía, we run **Mastra scorers** and **dataset experiments** so tool-card regressions fail in CI before Camila sees wrong listings on `/rentals`.

| Field | Detail |
|-------|--------|
| **Personas** | Lucía (gates), Sofía (wiring) |
| **Docs** | [`examples/evals/00-index.md`](examples/evals/00-index.md) |
| **Agents** | `conciergeAgent`, `routerAgent`, `evaluationAgent` |
| **Workflow** | `rental-search-workflow` |
| **Package** | `@mastra/evals` + `runEvals` from `@mastra/core/evals` |

**Scenarios**

1. Golden dataset: “2BR Laureles under $80” → `search-rentals` called → ≥1 card → `bestForLabel` in allowed set.
2. `tool-call-accuracy` ≥ threshold on concierge intent set (restaurants vs rentals).
3. After F13: memory eval with shared `thread` + `resource` for recall turn.

**Acceptance**

- [ ] `npm run test` includes at least one `runEvals` (F09)
- [ ] Scorer results persisted when storage configured
- [ ] J8 Playwright still runs — evals do not replace UI smoke

**Tasks:** W2 F09 Vitest · eval datasets in `mdeapp/src/__tests__/fixtures/`

**Deep dives:** [01-overview](examples/evals/01-overview.md) · [04-running-in-ci](examples/evals/04-running-in-ci.md) — not duplicated here.

---

## J9 — Tourist grounded places via MCP (MAP-002)

**Story:** As a Tourist, I ask for restaurants near a neighborhood and get **grounded** results with map pins — sourced from Google Grounding Lite MCP, not invented names.

| Field | Detail |
|-------|--------|
| **Persona** | Tourist |
| **Surface** | `/chat` |
| **Agent** | `conciergeAgent` |
| **Mastra MCP** | [MCP overview](https://mastra.ai/docs/v0/mcp/overview) — `MCPClient.getTools()` merged into agent |
| **Local tools today** | `search-restaurants`, `search-attractions` (Supabase) |
| **Streaming** | [tool-streaming](https://mastra.ai/docs/v0/streaming/tool-streaming) optional progress while MCP round-trip |
| **CopilotKit** | [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) or [mcp-apps](https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps) |
| **Maps** | [`tasks/maps/notes.md`](../maps/notes.md), MAP-001 `mapId` |

**Journey**

1. Tourist: “Romantic dinner walking distance from Parque Lleras.”
2. `conciergeAgent` selects Grounding MCP tool (description emphasizes live Places data).
3. Stream: `tool-call` → optional `writer` “Querying Maps…” → `tool-result` with `placeId`, rating, URI.
4. CopilotKit renders attraction/restaurant card; map pin from tool output field.
5. Follow-up: “cheaper option?” — [agent memory](https://mastra.ai/docs/v0/agents/agent-memory) retains `lastResults`.

**Acceptance**

- [ ] No listing URL or `placeId` from model text alone
- [ ] Field mask on every Grounding/Places call
- [ ] Studio **MCP Servers** tab shows configured client (after MAP-002)
- [ ] Inspector shows `tool-result` matching card DOM

**Tasks:** MAP-002, MAP-001, F19 (concierge surface).

---

## J10 — Durable memory across redeploy (F13)

**Story:** As Camila, I return to `/chat` after a Vercel deploy and the concierge still remembers my last rental search and selected listing — memory lives in Postgres, not ephemeral LibSQL.

| Field | Detail |
|-------|--------|
| **Persona** | Camila |
| **Surface** | `/chat`, `/rentals` |
| **Agent** | `conciergeAgent` |
| **Memory docs** | [overview](https://mastra.ai/docs/v0/memory/overview), [threads-and-resources](https://mastra.ai/docs/v0/memory/threads-and-resources), [memory-with-pg](https://mastra.ai/docs/v0/memory/storage/memory-with-pg) |
| **Storage** | [MastraStorage](https://mastra.ai/docs/v0/server-db/storage) — `mastra_messages`, `mastra_threads` |
| **CopilotKit** | Runtime passes `thread` + `resource` from Supabase session |
| **Deployment** | [overview](https://mastra.ai/docs/v0/deployment/overview) — framework deploy on Vercel |

**Journey**

1. Camila logs in → `resource` = Supabase user id; CopilotKit session → `thread` id.
2. First message: “2BR Laureles under $80” → `search-rentals` → working memory updates (`lastResults`).
3. Vercel redeploy (cold start).
4. Camila: “schedule viewing for listing 2” → agent recalls `selectedListingId` from same `thread`/`resource`.
5. Patricia verifies row in `mastra_messages` and `ai_runs` for same user.

**Acceptance**

- [ ] `Mastra({ storage: PostgresStore })` matches `createThreadMemory` store (no `file:mastra-agent-memory.db` in prod)
- [ ] `:memory:` LibSQL removed from production `mastra/index.ts`
- [ ] `thread` + `resource` passed on every CopilotKit agent invocation
- [ ] Optional: `generateTitle: true` on threads for Patricia support UI

**Tasks:** F13, auth session wiring on `/api/copilotkit`.

---

## J11 — Roberto queries host policy docs (RAG, Phase 2)

**Story:** As Roberto, I ask the event wizard “what’s the rain refund policy?” and get an answer grounded in uploaded host guidelines — not generic LLM advice.

| Field | Detail |
|-------|--------|
| **Persona** | Roberto |
| **Surface** | `/host/event/new` |
| **Agent** | `hostEventAgent` |
| **RAG** | [overview](https://mastra.ai/docs/v0/rag/overview) → [chunking](https://mastra.ai/docs/v0/rag/chunking-and-embedding) → [PgVector](https://mastra.ai/docs/v0/rag/vector-databases) → [retrieval](https://mastra.ai/docs/v0/rag/retrieval) |
| **Tool** | `createVectorQueryTool` with `filter: { hostId }` |
| **Not used for** | Ticket prices or public event listings (Supabase tools) |

**Journey**

1. Roberto uploads `venue-rules.pdf` → ingest job chunks + embeds to `host-docs` index.
2. In wizard chat: “Can I cancel if it rains?”
3. Agent calls vector query tool → topK chunks with `metadata.hostId = roberto`.
4. Reply cites policy snippet; HITL unchanged for publish ([J5](https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based)).

**Acceptance**

- [ ] Answers include source chunk id / doc name in UI
- [ ] No cross-host leakage (metadata filter enforced)
- [ ] Rental/event search still uses SQL tools, not RAG

**Tasks:** Phase 2 / VDB-02 after F13 Postgres.

---

## Use-case matrix (CopilotKit UI × persona)

See also **Mastra × CopilotKit matrix** above for backend/workflow docs.

| CopilotKit capability | Doc | Camila | Roberto | Tourist | Sofía |
|----------------------|-----|--------|---------|---------|-------|
| Tool rendering | [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) | ✅ rentals/events | ✅ preview card | ✅ restaurants | test |
| State rendering | [state-rendering](https://docs.copilotkit.ai/mastra/generative-ui/state-rendering) | ✅ map/listing | ✅ wizard | — | test |
| Display-only components | [display-only](https://docs.copilotkit.ai/mastra/generative-ui/your-components/display-only) | cards | preview | attraction card | — |
| Interactive components | [interactive](https://docs.copilotkit.ai/mastra/generative-ui/your-components/interactive) | schedule CTA | tier editor | — | — |
| Frontend tools | [frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools) | — | ✅ wizard | — | — |
| Shared state read/write | [read](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) / [write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write) | ✅ | ✅ | partial | — |
| Agent app context | [agent-app-context](https://docs.copilotkit.ai/mastra/agent-app-context) | map/locale | host id | tourist mode | — |
| HITL tool-based | [tool-based](https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based) | — | ✅ publish | — | — |
| HITL interrupt | [interrupt-flow](https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow) | Phase 2 | optional | — | — |
| MCP Apps | [mcp-apps](https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps) | Phase 2 maps | — | grounding | — |
| A2UI | [a2ui](https://docs.copilotkit.ai/mastra/generative-ui/a2ui) | — | — | — | — |
| Inspector | [inspector](https://docs.copilotkit.ai/mastra/inspector) | — | — | — | ✅ |
| Copilot Runtime | [copilot-runtime](https://docs.copilotkit.ai/mastra/copilot-runtime) | via chat | via chat | via chat | ✅ |
| AG-UI events | [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) | cards stream | publish stream | cards | debug |
| Mastra stream events | [streaming/events](https://mastra.ai/docs/v0/streaming/events) | text + tools | wizard stream | tools | Studio |
| Tool stream `writer` | [tool-streaming](https://mastra.ai/docs/v0/streaming/tool-streaming) | Phase 2 | — | MCP wait | — |
| Workflow `streamVNext` | [workflow-streaming](https://mastra.ai/docs/v0/streaming/workflow-streaming) | via router | publish resume | — | J6 |
| Product MCP tools | [mcp/overview](https://mastra.ai/docs/v0/mcp/overview) | — | — | J9 | dev MCP only |
| Publish MCPServer | [publishing-mcp-server](https://mastra.ai/docs/v0/mcp/publishing-mcp-server) | — | — | — | — |
| Working memory (Zod) | [working-memory](https://mastra.ai/docs/v0/memory/working-memory) | ✅ | ✅ wizard | partial | — |
| Thread + resource IDs | [threads-and-resources](https://mastra.ai/docs/v0/memory/threads-and-resources) | J10 | J10 | J10 | ✅ |
| Postgres memory | [memory-with-pg](https://mastra.ai/docs/v0/memory/storage/memory-with-pg) | J10 | J10 | — | F13 |
| RAG / vector search | [rag/retrieval](https://mastra.ai/docs/v0/rag/retrieval) | — | J11 | — | VDB-02 |
| Runtime context | [runtime-context](https://mastra.ai/docs/v0/server-db/runtime-context) | tier/locale | host-id | tourist | middleware |
| Vercel deploy | [deployment/overview](https://mastra.ai/docs/v0/deployment/overview) | preview URL | preview | preview | ✅ |
| Scorers / CI evals | [evals/overview](https://mastra.ai/docs/evals/overview) | J12 | J12 | — | ✅ |
| Datasets / experiments | [datasets/overview](https://mastra.ai/docs/evals/datasets/overview) | — | — | — | J12 |

---

## Real-world examples (repo + demos)

| Example | What to steal | Persona journey |
|---------|---------------|-----------------|
| [`CopilotKit/examples/integrations/mastra/`](../../CopilotKit/examples/integrations/mastra/) | `useCopilotAction` disabled render, `renderAndWaitForResponse`, `useCoAgent` | J1, J2, J5 |
| [`CopilotKit/examples/canvas/mastra/`](../../CopilotKit/examples/canvas/mastra/) | `useCoAgentStateRender`, plan steps, canvas tools | J5 preview, MAP canvas |
| [`CopilotKit/examples/canvas/mastra-pm/`](../../CopilotKit/examples/canvas/mastra-pm/) | Kanban `AgentStateSchema` discipline | Admin task boards (future) |
| [Feature viewer — shared state](https://feature-viewer.copilotkit.ai/mastra/feature/shared_state) | UX reference for J2/J5 | Camila, Roberto |
| [Feature viewer — HITL](https://feature-viewer.copilotkit.ai/mastra/feature/human_in_the_loop) | UX reference for J5 | Roberto |
| [UI Dojo](https://ui-dojo.mastra.ai/) | SaaS vs canvas product patterns | Product design reviews — [`github/02-ui-dojo.md`](github/02-ui-dojo.md) |
| [assistant-ui/mastra-hitl](https://github.com/assistant-ui/mastra-hitl) | Plan approve execute | Roberto J5 — [`github/04-assistant-ui-mastra-hitl.md`](github/04-assistant-ui-mastra-hitl.md) |
| [template-text-to-sql](https://github.com/mastra-ai/template-text-to-sql) | NL → structured query | SQL tool discipline — [`github/06-template-text-to-sql.md`](github/06-template-text-to-sql.md) |
| [Apify Mastra MCP](https://github.com/apify/actor-mastra-mcp-agent) | External Actors | VPS enrichment — [`github/05-apify-mcp-agent.md`](github/05-apify-mcp-agent.md) |
| [mastra-system-check](https://github.com/goldk3y/mastra-system-check) | 66-rule Mastra lint skill | Sofía PR gate — [`github/14-mastra-system-check.md`](github/14-mastra-system-check.md) |
| [AgentStack](https://github.com/ssdeanx/AgentStack) | Multi-agent monorepo | **Do not import** — [`github/15-agentstack.md`](github/15-agentstack.md) |
| [Mastra + CopilotKit blog](https://mastra.ai/blog/copilotkitmastra) | Pitch + starter `create-ag-ui-app` | Onboarding |
| Mastra workflow HITL doc | `suspend` + `resumeData` | J5 publish (Phase 2 backend) | Roberto |
| Mastra streaming overview | `text-delta` / workflow steps | J2 sidebar, J6 Studio | Camila, Sofía |
| Mastra MCP overview | `MCPClient` vs dev docs server | J9 MAP-002 | Tourist |

### mdeai code anchors (real files)

| Journey | Mastra | CopilotKit |
|---------|--------|------------|
| J1 ping | `agents/index.ts` → `pingAgent` | `layout.tsx`, `page.tsx` |
| J2 rentals | `agents/rental-agent.ts`, `tools/search-rentals.ts`, `workflows/rental-search-workflow.ts` | `useCopilotAction` name `search-rentals` (W5) |
| J3 events | `agents/event-agent.ts`, `tools/search-events.ts`, `workflows/event-discovery-workflow.ts` | `search-events` render (W5) |
| J4 concierge | `agents/concierge.ts`, 4 tools | `layout` agent `conciergeAgent` (W6) |
| J5 host | `hostEventAgent` + tools (W3) | `renderAndWaitForResponse` on publish |
| J6 router | `agents/router.ts`, `tools/classify-intent.ts` | Optional `/chat` agent `routerAgent` |
| J8 E2E | — | Playwright + Inspector stream events |
| J12 evals | `evaluationAgent`, workflows | — | `runEvals` + datasets (F09) |
| J9 MCP maps | `mcp/grounding-lite-client.ts` (MAP-002) | `conciergeAgent` + MCP Apps |
| J10 memory | `lib/agent-memory.ts`, `mastra/index.ts` `storage` | `api/copilotkit` thread/resource |
| J11 RAG | `hostEventAgent` + vector tool (Phase 2) | — |
| Runtime | `mastra/index.ts` | `api/copilotkit/route.ts`, `logging-mastra-agent.ts` |
| Streaming debug | any agent in Studio | AG-UI in browser |

---

## Phase timeline (stories × weeks)

| Week | Journeys unlocked | Default `layout.tsx` agent |
|------|-------------------|----------------------------|
| W1 | J1 | `pingAgent` |
| W3–W4 | J5 | `hostEventAgent` on `/host/event/new` only |
| W5 | J2, J3 | `rentalAgent` / `eventAgent` on `/rentals` |
| W6 | J4, J6, J7 | `conciergeAgent` on `/chat` |
| W6+ | J9 (MAP-002) | Grounding MCP on concierge |
| F13 | J10 | Postgres memory + thread/resource |
| Phase 2 | J11 | Host policy RAG |
| W8+ | Patricia admin views | `mastra_messages` / traces |

---

## Out of scope (Phase 1 stories)

- **A2UI** declarative widgets — use React cards ([a2ui](https://docs.copilotkit.ai/mastra/generative-ui/a2ui) deferred).
- **CopilotKit v2-only** headless/slots/programmatic — Phase 2 migration.
- **Pattern 2** separate Mastra server chat ([Mastra CopilotKit guide](https://mastra.ai/guides/build-your-ui/copilotkit)) — legacy only.
- **Weather agent** — demo removed from `mdeapp`.
- **WhatsApp / OpenClaw** — Phase 2+ channels.
- **Publishing mdeai as npm MCPServer** — [publishing-mcp-server](https://mastra.ai/docs/v0/mcp/publishing-mcp-server) deferred unless partner API needed.
- **Direct `agent.network()` streaming** — use router + workflows in Phase 1.
- **Standalone Mastra Server as prod CopilotKit target** — use Pattern 1 on Vercel ([deployment overview](https://mastra.ai/docs/v0/deployment/overview)).
- **RAG for rental listings** — SQL tools remain source of truth for Camila cards.

---

## Related

- Implementation rules: [`03-best-practices.md`](03-best-practices.md)
- Studio inventory: [`01-studio.md`](01-studio.md)
- Port matrix: [`tasks/core/my-mastra-app-coverage.md`](../core/my-mastra-app-coverage.md)
- Maps playbook: [`tasks/maps/notes.md`](../maps/notes.md)
