---
title: Mastra Studio — mdeai structure
project: mdeapp
studio_url: http://localhost:4111
api_url: http://localhost:4111/api
swagger_url: http://localhost:4111/swagger-ui
source: mdeapp/src/mastra/index.ts
model_default: gemini-3.5-flash
updated: 2026-05-21
---

# Mastra Studio — mdeai structure

**Canonical app:** `mdeapp/`. Start with `cd mdeapp && npm run dev:agent` (or `npm run dev` for UI + agent).

Studio port is **whatever the terminal prints** (often **4112–4113** if 4111 is taken). Legacy `my-mastra-app` on another port still shows **gemini-2.5-*** — ignore that for Phase 1.

**Model (all agents):** [`gemini-3.5-flash`](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash) via `mdeapp/src/mastra/lib/models.ts` → `google("gemini-3.5-flash")`.

| URL | Purpose |
|-----|---------|
| http://localhost:4111 | Studio UI (agents, workflows, tools, …) — **port from terminal** |
| http://localhost:4111/agents | Agents list (Studio SPA) |
| http://localhost:4111/api | REST API root |
| http://localhost:4111/api/agents | List agents (JSON) |
| http://localhost:4111/api/openapi.json | OpenAPI spec |
| http://localhost:4111/swagger-ui | Swagger UI — **open in a new tab** (see § Troubleshooting) |
| http://localhost:4111/openapi | OpenAPI redirect/spec (alternate) |

> **Port:** Use whatever `mastra dev` prints (`4111`, `4112`, … if 4111 is taken). Do not hardcode 4112 unless your terminal says so.

Registration lives in `src/mastra/index.ts`.

---

## Troubleshooting Studio console errors

### `No routes matched location "/swagger-ui"` (404 in Studio)

**Not a broken server.** Mastra Studio is a React SPA; **in-app** navigation to `/swagger-ui` hits React Router, which has no route → ErrorBoundary 404.

**Fix:** Open Swagger in a **new browser tab** (full document load, not client-side nav):

```text
http://localhost:4111/swagger-ui
```

Or use the API directly:

```text
http://localhost:4111/api/openapi.json
http://localhost:4111/api/agents
```

Verified 2026-05-22: `curl /swagger-ui` → 200 Swagger HTML; spec loads from `url: '/api/openapi.json'`.

Official ref: [Mastra Studio overview](https://mastra.ai/docs/studio/overview) (mentions `localhost:4111/swagger-ui` for **direct** visit).

### `GET /refresh-events net::ERR_CONNECTION_REFUSED`

Mastra dev server stopped or restarted (e.g. after `.env.local` change). **Fix:**

```bash
cd /home/sk/mdeai/mdeapp && npm run dev:agent
```

Hard-refresh Studio (`Ctrl+Shift+R`). If errors persist, close old Studio tabs — browser may still be connected to a dead process on 4111/4112 while a new instance runs on another port.

### `GET /refresh-events net::ERR_INCOMPLETE_CHUNKED_ENCODING`

Same root cause as CONNECTION_REFUSED — Mastra SSE stream cut when dev server restarted. Kill stale processes, restart agent, hard-refresh.

### `Set GOOGLE_API_KEY to use this provider`

Studio Google provider expects **`GOOGLE_API_KEY`** (not only `GOOGLE_GENERATIVE_AI_API_KEY`). Both should be in `mdeapp/.env.local`, then restart `dev:agent`.

### `posthog.com` / `ERR_TIMED_OUT`

Mastra Studio telemetry — **safe to ignore** in local dev (ad blocker or offline).

### `background-redux-new.js` / `invalid ciphertext size`

**Browser extension** (password manager) — not Mastra. Ignore or disable extension on localhost.

### `Matched leaf route at "/" does not have an element`

React Router dev warning inside bundled Studio — **cosmetic** on `mastra@1.1.0-alpha.3`; does not block agents chat if API is up.

---

## What we added beyond the Mastra bootstrap

Stock `create mastra` gives you agents, tools, and Studio. **mdeai-specific** layers:

| Layer | mdeapp today | Legacy `my-mastra-app` | Task |
|-------|--------------|------------------------|------|
| **Workspace + skills** | ✅ 5 skills + read-only FS (`F13b`) | ✅ 5 skills + read-only FS tools | **F13b Done** |
| **Supabase auth on Studio** | ❌ | ✅ `MastraAuthSupabase` | post-MVP |
| **`ai_runs` middleware** | ✅ via CopilotKit logging | ✅ `/chat` middleware | F13 / MASTRA-004 |
| **Product agents** | ✅ 6 agents | ✅ 7 (+ weather) | — |
| **Product workflows** | ✅ 3 workflows | ✅ 4 (+ weather) | — |
| **Supabase-backed tools** | ✅ 4 search tools | ✅ same | — |
| **Concierge guardrails** | ✅ processors | ✅ same | — |
| **Thread memory** | ✅ Zod WM on concierge | ✅ same | — |
| **Postgres storage** | ❌ `:memory:` LibSQL | ✅ PostgresStore | MASTRA-003 |

**Why Studio showed "No skills" (pre-F13b):** `src/mastra/index.ts` had **no** `workspace:` — fixed in F13b with `workspaces.ts` + `Mastra({ workspace })`.

### Workspace `fs/list?path=/` → 403 Forbidden

**Expected.** Mastra `LocalFilesystem` denies listing the workspace root (`Permission denied: access on /`). The skills subtree is exposed:

```text
GET /api/workspaces/{id}/fs/list?path=skills  → 200 (5 skill directories)
GET /api/workspaces/{id}/fs/list?path=/      → 403
```

Use Studio **Skills** tab or Files under `skills/` — not `/`. Does not block agent chat or CopilotKit.

Also kill stale Mastra PIDs if Studio tab still points at an old port (4112/4113) after restart — causes `refresh-events` ERR_CONNECTION_REFUSED / INCOMPLETE_CHUNKED_ENCODING. Hard-refresh after `npm run dev:agent`.

---

### Workspace + skills (mdeapp)

Configured in `src/mastra/workspaces.ts` and passed into `new Mastra({ workspace })` in `index.ts`.

```text
my-mastra-app/workspace/
└── skills/
    ├── mde-prompt-qa/       # prompt/reply QA
    ├── mde-safe-actions/    # no fake bookings, payments, WhatsApp sends
    ├── mde-rental-quality/  # listing quality bar
    ├── mde-followup-logic/  # intent continuity (mirrors concierge prompts)
    └── mde-event-review/    # event listing review
```

**Design choices (intentional):**

- **`LocalFilesystem` only** — no `LocalSandbox`, so shell/process workspace tools never appear.
- **Writes disabled** — `WRITE_FILE`, `EDIT_FILE`, `DELETE`, `MKDIR`, `AST_EDIT` all `{ enabled: false }`.
- **`skills: ['skills']`** — Mastra loads every `SKILL.md` under `workspace/skills/` (Studio shows **5**).
- **Override path** — `MDE_MASTRA_WORKSPACE` env if you need a different disk root.

**Important:** These are **Mastra workspace skills** (agent playbooks on disk), not Cursor `.claude/skills`. They do **not** show under an agent’s “Skills” row in the Agents table — they show under **Workspaces → Skills** in Studio.

**Drift risk:** Concierge already encodes follow-up rules in `agents/concierge.ts` instructions *and* in `mde-followup-logic/SKILL.md`. Until an agent explicitly uses workspace skill retrieval in runs, the files are **documentation + Studio visibility**, not guaranteed runtime behavior. Prefer one source of truth long term (instructions **or** skills, not both).

### Memory vs workspace skills

| Mechanism | Purpose | Agents |
|-----------|---------|--------|
| **Working memory** (Zod schema, thread scope) | Runtime state: `lastIntent`, `lastRentalResults`, `selectedListingId`, … | Concierge, rental, event |
| **Workspace skills** | Large static playbooks (QA, safety, quality) | App-level workspace (all agents *may* read if Mastra routes to them) |
| **`lastMessages: 20`** | Recent chat history window | Concierge (and similar on rental/event) |

Router and ping agents have **no** memory config.

---

## Studio sidebar (navigation tree)

Mastra Studio groups features into three sections. What you see in the UI maps to code as follows.

### PRIMITIVES

| Studio item | In this repo | Notes |
|-------------|--------------|-------|
| **Agents** | 7 agents | `src/mastra/agents/` |
| **Workflows** | 4 workflows | `src/mastra/workflows/` |
| **Processors** | 2 processors | Used on **Concierge Agent** only (`src/mastra/agents/concierge.ts`) |
| **MCP Servers** | *(none registered)* | Grounding Lite client exists in `lib/maps-grounding-client.ts` but is **not** wired as a Studio MCP server yet |
| **Tools** | 7 tools | `src/mastra/tools/` |
| **Workspaces** | 1 workspace | `src/mastra/workspaces.ts` → `workspace/` on disk |
| **Request Context** | Studio editor | Presets optional via `mastra dev --request-context-presets` |

### EVALUATION

| Studio item | In this repo | Notes |
|-------------|--------------|-------|
| **Scorers** | 3 scorers | `src/mastra/scorers/weather-scorer.ts` (weather demo + custom translation judge) |
| **Datasets** | — | Not configured in code |
| **Experiments** | — | Not configured in code |

### OBSERVABILITY

| Studio item | In this repo | Notes |
|-------------|--------------|-------|
| **Metrics** | Default exporter | `Observability` in `index.ts`; service name `mdeai-mastra` |
| Traces / runs (via API) | Supabase `ai_runs` | Middleware `lib/ai-runs-middleware.ts` on `/chat` |

---

## Agents (6 — mdeapp)

| Studio name | ID | Model | Tools | Workflows | Processors / memory |
|-------------|-----|-------|------:|----------:|---------------------|
| Ping Agent | `ping-agent` | `gemini-3.5-flash` | 0 | — | in-memory LibSQL |
| Router Agent | `router-agent` | `gemini-3.5-flash` | 1 (`classify-intent`) | 2 (rental + event) | — |
| Concierge Agent | `concierge-agent` | `gemini-3.5-flash` | 4 (search-*) | — | Prompt injection + token limiter; **working memory** |
| Rental Agent | `rental-agent` | `gemini-3.5-flash` | 1 (`search-rentals`) | — | working memory |
| Event Agent | `event-agent` | `gemini-3.5-flash` | 1 (`search-events`) | — | working memory |
| Evaluation Agent | `evaluation-agent` | `gemini-3.5-flash` | 0 | — | — |

**Models** (`mdeapp/src/mastra/lib/models.ts`): `FLASH_MODEL` = `CONCIERGE_MODEL` = `REASONING_MODEL` = `PLANNING_MODEL` = `google("gemini-3.5-flash")`. Optional later: `PRO_MODEL` = `gemini-3.1-pro-preview` for host form-fill only.

**Legacy `my-mastra-app` (7 agents, do not copy models):** still uses `gemini-2.5-flash` / `2.5-pro` + Weather Agent — frozen reference only.

**Production routing (intended):**

- **Router** → classify + dispatch `rental-search-workflow` / `event-discovery-workflow` when confidence ≥ 0.6.
- **Concierge** → multi-tool Medellín UX (rentals, events, restaurants, attractions) with follow-up memory.
- **Rental / Event** → specialist agents for deeper single-domain turns.
- **Ping** → health checks; **Weather** → scaffold/demo; **Evaluation** → listing quality copy.

---

## Workflows (3 — mdeapp)

| Studio name | ID | Steps | File |
|-------------|-----|------:|------|
| rental-search-workflow | `rental-search-workflow` | 3 | `mdeapp/src/mastra/workflows/rental-search-workflow.ts` |
| event-discovery-workflow | `event-discovery-workflow` | 2 | `mdeapp/src/mastra/workflows/event-discovery-workflow.ts` |
| concierge-routing-workflow | `concierge-routing-workflow` | 2 | `mdeapp/src/mastra/workflows/concierge-routing-workflow.ts` |

**Step IDs (for debugging in Studio run view):**

| Workflow | Steps |
|----------|--------|
| `rental-search-workflow` | `search-rentals` → `format-rental-cards` → `rerank-rentals` |
| `event-discovery-workflow` | `search-events` → `format-event-cards` |
| `concierge-routing-workflow` | `classify-intent` → `dispatch-intent` |

Each workflow has a top-level `description` on `createWorkflow()` (visible in Studio).

---

## Tools (5 — mdeapp)

| Tool ID | Studio description (from code) | Used by |
|---------|----------------------------------|---------|
| `classify-intent` | Pick one intent; call first | Router Agent |
| `search-rentals` | Search Medellín rentals (neighborhood, beds, price) | Concierge, Rental Agent; workflows |
| `search-events` | Search mdeai DB events (category, neighborhood, …) | Concierge, Event Agent; workflows |
| `search-restaurants` | Search `public.restaurants` in Supabase | Concierge Agent |
| `search-attractions` | Tours, viewpoints, day trips (live tourist source) | Concierge Agent |

**Not in Studio tools list (library only):**

- `maps-grounding-client.ts` — Grounding Lite MCP wrapper (GROUNDING-001 not shipped as Mastra tool yet).
- `google-places-client.ts` — Places API New + field masks (enrichment path).

---

## Processors (2)

Registered on **Concierge Agent** only:

| Processor | Hook | Role |
|-----------|------|------|
| Prompt Injection Detector | `input` | Block / flag injection on user messages |
| Token Limiter | `step`, `stream`, `result` | Cap context at 8192 tokens |

---

## Workspace (1)

| Field | Value |
|-------|--------|
| Studio label | `workspace-ws-mpfbp` (runtime id; may vary per machine) |
| Base path | `my-mastra-app/workspace/` (override: `MDE_MASTRA_WORKSPACE`) |
| Filesystem | Read-only pattern — write/edit/delete/mkdir **disabled** in `workspaces.ts` |
| Skills folder | `workspace/skills/` |

### Skills (5)

| Skill directory | Purpose |
|-----------------|--------|
| `mde-prompt-qa` | Prompt / reply quality checks |
| `mde-safe-actions` | Guardrails for mutations, payments, WhatsApp |
| `mde-rental-quality` | Rental listing quality |
| `mde-followup-logic` | Multi-turn intent preservation |
| `mde-event-review` | Event listing review |

Studio **Skills** tab shows count **5**; **Files** tab shows the `skills/` tree.

---

## Scorers (3)

| Scorer | Type | Target |
|--------|------|--------|
| Tool Call Appropriateness | Prebuilt | Expects `get-weather` (weather demo) |
| Completeness | Prebuilt | General output completeness |
| Translation Quality | Custom LLM judge | Non-English location names → English |

---

## MCP Servers

**Studio:** empty list for this project.

**Code (not exposed in Studio):**

- Grounding Lite endpoint configured in `lib/maps-grounding-client.ts` (`https://mapstools.googleapis.com/mcp`).
- Whitelist: `lib/allowedGroundingTools.ts`.

---

## Server & auth

| Setting | Value |
|---------|--------|
| Port | `4112` default (`PORT` / `MASTRA_PORT` / `server.port` in `index.ts`) |
| Auth | `MastraAuthSupabase` when `SUPABASE_URL` + `SUPABASE_ANON_KEY` in `.env` |
| Middleware | `aiRunsMiddleware` → logs to `public.ai_runs` |

---

## Quick map: Studio → source files

```text
mdeapp/
├── src/mastra/
│   ├── index.ts              # registers 6 agents + 3 workflows
│   ├── agents/               # ping, router, concierge, rental, event, evaluation
│   ├── workflows/            # rental-search, event-discovery, concierge-routing
│   ├── tools/                # classify-intent + 4 search tools
│   └── lib/
│       ├── models.ts         # google("gemini-3.5-flash") — single source of truth
│       ├── agent-memory.ts
│       └── log-agent-run.ts  # ai_runs (CopilotKit turns)
```

Legacy reference (frozen): `my-mastra-app/` — 7 agents, 4 workflows, 2.5 models, weather demo.

---

## Related docs

- **[Mastra best practices (mdeapp)](03-best-practices.md)** — how to build agents, CopilotKit Pattern 1, examples map
- **[User stories & journeys](04-user-stories.md)** — memory, RAG, server/storage, deploy, streaming, MCP, workflows, HITL + J1–J12
- **[Agent examples index](examples/00-index.md)** — agents, memory, browser, WhatsApp
- **[Platform features](examples/features/00-index.md)** — memory, agents, workspace
- **[Workflows](examples/workflows/00-index.md)** · **[Streaming](examples/streaming/00-index.md)** · **[MCP](examples/mcp/00-index.md)** · **[Editor](examples/editor/00-index.md)**
- **[Workspace](examples/workspace/00-index.md)** (VPS) · **[RAG](examples/rag/00-index.md)** (J11 host docs) · **[Evals](examples/evals/00-index.md)** (J12 scorers, datasets, Studio **Evaluate** tab)
- **[Domain playbooks](examples/domains/00-index.md)** — rentals, events, restaurants, contests (deferred), Google Maps
- [Mastra Studio overview](https://mastra.ai/docs/studio/overview)
- [mdeai routing skill](../../.claude/skills/mastra-routing/SKILL.md)
- Repo audit: `docs/101-report-audit.md` (platform-wide)
