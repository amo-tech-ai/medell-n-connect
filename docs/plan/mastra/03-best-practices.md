---
title: Mastra + CopilotKit — mdeapp best practices
project: mdeapp
studio: npm run dev:agent (port from terminal, often 4112–4113)
model: gemini-3.5-flash
copilotkit: 1.55.2
pattern: CopilotKit Pattern 1 (in-process AG-UI)
updated: 2026-05-21
supersedes_notes_from: tasks/mastra/02-best-old.md (legacy my-mastra-app)
official_docs_reviewed:
  - https://mastra.ai/guides/build-your-ui/copilotkit
  - https://docs.copilotkit.ai/mastra/quickstart
  - https://docs.copilotkit.ai/mastra/coding-agents
  - https://docs.copilotkit.ai/mastra/custom-look-and-feel/slots
  - https://docs.copilotkit.ai/mastra/custom-look-and-feel/headless-ui
  - https://docs.copilotkit.ai/mastra/programmatic-control
  - https://docs.copilotkit.ai/mastra/inspector
  - https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering
  - https://docs.copilotkit.ai/mastra/generative-ui/state-rendering
  - https://docs.copilotkit.ai/mastra/generative-ui/your-components/display-only
  - https://docs.copilotkit.ai/mastra/generative-ui/your-components/interactive
  - https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps
  - https://docs.copilotkit.ai/mastra/generative-ui/a2ui
  - https://docs.copilotkit.ai/mastra/frontend-tools
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write
  - https://docs.copilotkit.ai/mastra/agent-app-context
  - https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow
  - https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based
related:
  - tasks/mastra/01-studio.md
  - .claude/skills/mastra/SKILL.md
  - .claude/skills/copilotkit-integrations/references/integrations/mastra.md
  - plan/audit/05-copilotkit-mastra-setup-checklist.md
  - CopilotKit/docs/content/docs/integrations/mastra/ (vendored MDX)
---

# Mastra + CopilotKit — mdeapp best practices

Authoritative guide for **Phase 1** Mastra work in `mdeapp/`. Distills `02-best-old.md` (legacy `/home/sk/mde/my-mastra-app/`), the **mastra** and **copilotkit-integrations** skills, MCP verification cadence, and vendored **CopilotKit/examples** — corrected for what ships today.

| Doc | Use when |
|-----|----------|
| **This file** | How to build, wire, and extend agents correctly |
| [`04-user-stories.md`](04-user-stories.md) | Personas, journeys, acceptance criteria for CopilotKit + Mastra |
| [`01-studio.md`](01-studio.md) | What Studio tabs should list (inventory) |
| [`02-best-old.md`](02-best-old.md) | Historical legacy audit only — do not copy env/ports/models |
| [`mastra` skill](.claude/skills/mastra/SKILL.md) | API lookup — never trust memory; use MCP or `node_modules/@mastra/*/dist/docs/` |
| [`mastra.md` integration](.claude/skills/copilotkit-integrations/references/integrations/mastra.md) | Pattern 1 route, `useCoAgent`, package pins |

---

## 1. Architecture (non-negotiable)

### Pattern 1 only for `mdeapp`

| Pattern | mdeapp? | Wire |
|---------|---------|------|
| **1. In-process** | **Yes** | Next `POST /api/copilotkit` → `CopilotRuntime({ agents: getLocalAgentsWithLogging({ mastra }) })` |
| **2. Separate Mastra server** | No (legacy) | `runtimeUrl="http://localhost:4111/chat"` + `registerCopilotKit` on Mastra server |

**Reference implementation:** `CopilotKit/examples/integrations/mastra/` — same route shape as `mdeapp/src/app/api/copilotkit/route.ts`.

```text
Camila / Tourist (browser)
  → CopilotSidebar + useCoAgent({ name: "conciergeAgent" })   # camelCase map key
  → POST /api/copilotkit
  → LoggingMastraAgent.run() → Mastra Agent.stream()
  → tools (Supabase / pg) + optional workflows
  → logAgentRunForTurn → public.ai_runs
```

**Studio** (`npm run dev:agent`) is for Sofía to debug agents/workflows/tools. **Production chat** does not require Studio port — Pattern 1 runs agents inside Next.js.

### Personas → agents (Phase 1)

| Persona | Surface | CopilotKit `agent` key | Mastra `id` |
|---------|---------|------------------------|-------------|
| Camila / Tourist | `/`, later `/chat` | `conciergeAgent` | `concierge-agent` |
| Router (headless dispatch) | internal / future `/chat` | `routerAgent` | `router-agent` |
| Rental specialist | `/rentals` (W5+) | `rentalAgent` | `rental-agent` |
| Events specialist | events path (W5+) | `eventAgent` | `event-agent` |
| Sofía smoke | `/` day-1 | `pingAgent` | `ping-agent` |
| Eval / rerank | Studio / batch | `evaluationAgent` | `evaluation-agent` |

**Invariant:** `useCoAgent({ name })` must equal the key in `Mastra({ agents: { conciergeAgent } })`, **not** `agent.id` (`concierge-agent`).

---

## 2. Repository layout

```text
mdeapp/src/mastra/
├── index.ts                    # Mastra({ agents, workflows, storage })
├── agents/
│   ├── index.ts                # exports + pingAgent
│   ├── router.ts
│   ├── concierge.ts
│   ├── rental-agent.ts
│   ├── event-agent.ts
│   └── evaluation.ts
├── workflows/                  # 3 product workflows (+ descriptions for Studio)
├── tools/                      # classify + 4 search tools; audit-wrapper, risk-levels
├── lib/
│   ├── models.ts               # FLASH_MODEL = google("gemini-3.5-flash")
│   ├── agent-memory.ts         # createThreadMemory(schema)
│   ├── log-agent-run.ts        # ai_runs mapping
│   └── ai-runs.ts
└── copilotkit/
    └── logging-mastra-agent.ts # F13 — wrap getLocalAgents

mdeapp/src/app/api/copilotkit/route.ts
mdeapp/src/app/layout.tsx       # <CopilotKit agent="pingAgent" />
mdeapp/src/lib/types.ts         # MdeState — keep in sync with agent Zod
```

**Do not** put agent definitions under `src/app/` or register agents only in Studio — Studio reads `index.ts`.

---

## 3. Models (Gemini only)

Single registry: `mdeapp/src/mastra/lib/models.ts`.

| Constant | Value | When |
|----------|-------|------|
| `FLASH_MODEL` | `google("gemini-3.5-flash")` | **All Phase 1 agents** (default) |
| `PRO_MODEL` | `google("gemini-3.1-pro-preview")` | Roberto host form-fill (F34) if Flash struggles |

- Docs: [Gemini 3.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash)
- Env: `GOOGLE_GENERATIVE_AI_API_KEY` in `mdeapp/.env.local` (not `GOOGLE_API_KEY`, not legacy `GEMINI_API_KEY` in app code)
- **Never** use `gemini-2.5-*`, `gemini-3.1-flash-lite-preview`, or OpenAI in `mdeapp/src/mastra/**` (CLAUDE.md hard rule)

**MCP before changing model IDs:** `mastra` MCP → `searchMastraDocs` / `readMastraDocs`; Gemini → `gemini-api-docs-mcp__search_docs`.

---

## 4. Agents

### Current roster (6)

| Agent | Tools | Workflows | Memory / processors |
|-------|------:|-----------|---------------------|
| `pingAgent` | 0 | — | in-memory LibSQL; F02 wiring |
| `routerAgent` | 1 (`classify-intent`) | rental + event | stateless by design |
| `conciergeAgent` | 4 search | — | working memory + PromptInjection + TokenLimiter(8192) |
| `rentalAgent` | `search-rentals` | — | working memory |
| `eventAgent` | `search-events` | — | working memory |
| `evaluationAgent` | 0 | — | JSON rerank instructions only |

### Best practices

1. **One file per agent** — `new Agent({ id, name, instructions, model: FLASH_MODEL, tools, workflows?, memory?, inputProcessors? })`.
2. **Instructions are product spec** — Medellín neighborhoods, follow-up preservation, “never invent listings” live in `instructions`, not in Studio UI.
3. **Router stays lean** — classify → dispatch workflow; no prose UX (Concierge owns UX).
4. **Concierge is the multi-tool hub** — four search tools; do not split into four agents (see `mdeai-concierge.md`).
5. **Register every agent** in `src/mastra/index.ts` `agents: { ... }` or Studio will not list it.

### Working memory (recommended pattern)

Ported from legacy; aligned with CopilotKit **shared state** examples:

| Example | Pattern | mdeapp use |
|---------|---------|------------|
| `CopilotKit/examples/integrations/mastra/` | Zod schema + `Memory` + `useCoAgent<MdeState>` | `pingAgent` / `MdeState` |
| `CopilotKit/examples/canvas/mastra/` | Rich Zod `AgentState` + canvas tools | W4+ Roberto draft / MAP canvas (future) |
| `CopilotKit/examples/canvas/mastra-pm/` | Kanban `AgentStateSchema` + `useCoAgent` | Reference for structured project state |

```typescript
// lib/agent-memory.ts — shared LibSQL file store
export function createThreadMemory<T extends ZodRawShape>(schema: ZodObject<T>) {
  return new Memory({
    storage: sharedStore,
    options: {
      workingMemory: { enabled: true, scope: "thread", schema },
      lastMessages: 20,
    },
  });
}
```

**Sync rule:** Zod working-memory schema ↔ `src/lib/types.ts` ↔ `useCoAgent<T>` on the same surface.

**Beta note:** `@ts-expect-error` on `memory` may be required until `@mastra/memory` and `@mastra/core` recall types align (same as `pingAgent`).

### Anti-patterns

- Copying **weather-agent** or **7-agent** legacy roster into `mdeapp`
- Using string model IDs (`google/gemini-2.5-flash`) instead of `@ai-sdk/google` `google("gemini-3.5-flash")`
- Mismatching `concierge-agent` (id) vs `conciergeAgent` (CopilotKit name)

---

## 5. Workflows

### Current (3)

| Workflow | Steps | Persona effect |
|----------|-------|----------------|
| `rental-search-workflow` | search → format → rerank | Camila gets “Best for” rental cards |
| `event-discovery-workflow` | search → format | Event cards from Supabase |
| `concierge-routing-workflow` | classify → dispatch | Deterministic routing without LLM cost in step 1 |

### Best practices (from legacy + Mastra docs)

- `createWorkflow({ id, description, inputSchema, outputSchema })` then `.then(step).then(...)` then **`.commit()`** before export.
- Every step: `createStep({ id, inputSchema, outputSchema, execute })` — typed IO, no `any`.
- Add **`description`** on the workflow (Studio “Description” column was empty in legacy screenshots).
- **Router agent** binds workflows: `workflows: { rentalSearchWorkflow, eventDiscoveryWorkflow }` — matches official dispatch pattern.
- Prefer **try/catch inside steps** returning `{ results: [], error? }` over failing the whole run on DB blips (backlog).

**Do not port** `weather-workflow` to `mdeapp`.

---

## 6. Tools

### Current (5)

| Tool ID | Data | Fallback |
|---------|------|----------|
| `classify-intent` | passthrough (router) | — |
| `search-rentals` | `DATABASE_URL` (pg pool) | mock cards |
| `search-events` | Supabase `events` | mock / fallback |
| `search-restaurants` | Supabase `restaurants` | curated fallback |
| `search-attractions` | Supabase + logic | fallback |

### Best practices

- `createTool({ id, description, inputSchema, outputSchema, execute })` — Studio Tools tab reads these.
- **Supabase from tools:** prefer `SUPABASE_URL` + `SUPABASE_ANON_KEY`; never add `SUPABASE_SERVICE_ROLE_KEY` to `mdeapp/src/**` (hook blocks it). Privileged reads → edge function.
- **Rentals:** optional `DATABASE_URL`; without it, mocks keep Studio and demos alive.
- **Export** from `tools/index.ts` for discoverability.
- Wrap risky DB tools with `audit-wrapper` + `risk-levels` (F13) when enabling writes.
- **Maps (Phase 1):** Grounding Lite / Places live in `tasks/maps/` (MAP-002+), not as Studio MCP yet — see [`tasks/maps/notes.md`](../maps/notes.md).

### `classify-intent`

Keep in `tools/classify-intent.ts` (done). Router calls it first; confidence ≥ 0.6 before workflow dispatch.

---

## 7. CopilotKit integration

### Official docs — two patterns (read this first)

CopilotKit documents **two** Mastra integration shapes. **mdeapp uses only Pattern 1.**

| Source | Pattern | `runtimeUrl` | Mastra wire | mdeapp? |
|--------|---------|--------------|-------------|---------|
| [CopilotKit Mastra quickstart](https://docs.copilotkit.ai/mastra/quickstart) | **1 — in-process** | `/api/copilotkit` (relative) | `MastraAgent.getLocalAgents({ mastra })` in Next route | **Yes** — add `getLocalAgentsWithLogging` |
| [Mastra: Using CopilotKit](https://mastra.ai/guides/build-your-ui/copilotkit) | **2 — separate server** | `http://localhost:4111/chat` | `registerCopilotKit({ path: '/chat', resourceId })` in `Mastra({ server.apiRoutes })` | **No** — legacy `my-mastra-app` only |

**Mastra Pattern 2 deployment note** ([guide](https://mastra.ai/guides/build-your-ui/copilotkit)): `mastra build` must set `bundler.externals: ['@copilotkit/runtime']` or deploy returns 500. **Irrelevant for mdeapp** (`next build` bundles the route, not `mastra build` for chat).

**UI Dojo (examples):** [ui-dojo.mastra.ai](https://ui-dojo.mastra.ai/) — SaaS + canvas demos; compare to `CopilotKit/examples/canvas/mastra*` locally.

**Vendored MDX (offline):** `CopilotKit/docs/content/docs/integrations/mastra/` — same content as docs.copilotkit.ai when MCP is flaky.

### Official doc index → mdeai task

| Doc | URL | mdeai adaptation |
|-----|-----|------------------|
| Introduction | [docs.copilotkit.ai/mastra/](https://docs.copilotkit.ai/mastra/) | AG-UI overview; features map to W3–W7 (generative UI, HITL, shared state) |
| Quickstart | [quickstart](https://docs.copilotkit.ai/mastra/quickstart) | Match `mdeapp` route + layout; swap OpenAI → `google("gemini-3.5-flash")`; env `GOOGLE_GENERATIVE_AI_API_KEY` |
| Coding agents | [coding-agents](https://docs.copilotkit.ai/mastra/coding-agents) | CopilotKit MCP for IDE agents — **not** product runtime; use `.mcp.json` `copilotkit` + `mastra` for Sofía |
| Prebuilt components | [prebuilt-components](https://docs.copilotkit.ai/mastra/prebuilt-components) | Phase 1: `CopilotSidebar` @ 1.55.2 — not v2 `CopilotChat` until Phase 2 migration |
| Slots | [custom-look-and-feel/slots](https://docs.copilotkit.ai/mastra/custom-look-and-feel/slots) | **Phase 2+** (v2 slots on `CopilotChat`). Phase 1: Tailwind on sidebar + Paisa tokens (F07) |
| Headless UI | [custom-look-and-feel/headless-ui](https://docs.copilotkit.ai/mastra/custom-look-and-feel/headless-ui) | **Phase 2+** — uses `useAgent` / v2. Do not mix with v1 `useCoAgent` on same surface |
| Programmatic control | [programmatic-control](https://docs.copilotkit.ai/mastra/programmatic-control) | `copilotkit.runAgent()` — **v2** API. Phase 1 chat is sidebar-driven; use for admin scripts / MAP batch later |
| Inspector | [inspector](https://docs.copilotkit.ai/mastra/inspector) | Sofía debug: AG-UI events, agent state, frontend tools — enable in dev; auto-off in production build |
| AG-UI | [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) | Tool events, streaming — Camila map pins correlate `toolCallId` (see `mdeai-concierge.md`) |
| Copilot runtime | [copilot-runtime](https://docs.copilotkit.ai/mastra/copilot-runtime) | Debug `POST /api/copilotkit` — F13 logging wrapper |
| Shared state | [shared-state](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) | `useCoAgent<MdeState>` ↔ agent Zod working memory |
| Generative UI | [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) | Roberto cards (W4), rental/event cards (W5+) |
| HITL | [human-in-the-loop](https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow) | Roberto `renderAndWaitForResponse` publish gate |
| Frontend tools | [frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools) | W3+ `useCopilotAction` on `/host/event/new` |
| App context | [agent-app-context](https://docs.copilotkit.ai/mastra/agent-app-context) | Concierge: neighborhood, locale, map viewport (W6) |

> **URL note:** `docs.copilotkit.ai/mastra/build-with-agents` is not in the current Mastra doc tree; use [coding-agents](https://docs.copilotkit.ai/mastra/coding-agents) (MCP setup for dev agents) or [Introduction](https://docs.copilotkit.ai/mastra/) for agent features overview.

### Quickstart checklist (mdeai vs upstream)

Upstream quickstart assumes OpenAI + optional Enterprise license. **mdeapp deltas:**

| Quickstart step | Official default | mdeapp |
|-----------------|------------------|--------|
| Model | `openai("gpt-5.4")` etc. | `FLASH_MODEL` = `google("gemini-3.5-flash")` only |
| API key | `OPENAI_API_KEY` | `GOOGLE_GENERATIVE_AI_API_KEY` in `mdeapp/.env.local` |
| Agent export | `myAgent` | Six keys: `pingAgent`, `conciergeAgent`, … |
| Provider `agent` prop | `myAgent` | `pingAgent` (W1) → `conciergeAgent` (`/chat`) |
| Runtime agents | `MastraAgent.getLocalAgents` | `getLocalAgentsWithLogging` → `ai_runs` |
| Dev command | `npm run dev` (UI + agent) | Same: `cd mdeapp && npm run dev` |
| Styles | `@copilotkit/react-ui/v2/styles.css` in latest docs | Phase 1: v1 sidebar styles per `integrations/mastra` example |

### UI customization (slots & headless)

**Slots** ([docs](https://docs.copilotkit.ai/mastra/custom-look-and-feel/slots)): override sub-components of `CopilotChat` — Tailwind string, props object, or full React replacement; nested slots for message toolbar, input, etc.

**mdeai Phase 1:** stay on **`CopilotSidebar`** + global CSS variables (`--copilot-kit-primary-color` → Paisa teal in `page.tsx`). Do not adopt v2 slot APIs until CopilotKit v2 migration (Phase 2).

**Headless UI** ([docs](https://docs.copilotkit.ai/mastra/custom-look-and-feel/headless-ui)): build chat from hooks (`useAgent`, message list, input) with no prebuilt chrome.

**mdeai:** defer to W7+ or `/chat` redesign. If you need custom message rendering before v2, use **`useCoAgentStateRender`** (v1 co-agent pattern) as in `CopilotKit/examples/canvas/mastra/`.

### Programmatic control (no chat UI)

[Programmatic control](https://docs.copilotkit.ai/mastra/programmatic-control) documents triggering agents outside the sidebar via **`copilotkit.runAgent({ agent })`** (orchestrates frontend tools + follow-ups) vs low-level **`agent.runAgent()`**.

**mdeai use cases (later):**

- Patricia: batch “re-score last rental turn” from `/admin`
- MAP: refresh concierge state after map bounds change without user typing

**Phase 1 constraint:** docs target **CopilotKit v2** (`useAgent`, `useCopilotKit` from `react-core/v2`). mdeapp is pinned to **1.55.2** + `useCoAgent` — do not import v2 hooks on production surfaces until migration plan exists.

### Inspector (Sofía / Lucía)

[Inspector](https://docs.copilotkit.ai/mastra/inspector) overlays dev-only debug UI:

| Panel | Use for mdeai |
|-------|----------------|
| AG-UI events | Verify `tool-input-available` / `tool-output-available` pairing for map cards |
| Available agents | Confirm six map keys (`conciergeAgent`, not `concierge-agent`) |
| Agent state | Watch `useCoAgent` working memory update on `/` |
| Frontend tools | W3+ host `useCopilotAction` registrations |
| Context | Readables / app context on `/chat` (W6) |

Disable with `enableInspector={false}` on `<CopilotKit>`. **Production builds disable automatically** per CopilotKit docs. Enterprise docs mention `publicLicenseKey` — optional; not required for local Pattern 1 smoke.

**Also use:** Mastra Studio (`npm run dev:agent`) for agent/workflow/tool introspection — complementary to CopilotKit Inspector (backend vs frontend wire).

### Coding agents / MCP (dev only)

[Coding agents](https://docs.copilotkit.ai/mastra/coding-agents) describes wiring **CopilotKit’s MCP server** so IDE agents can search CopilotKit docs — parallel to mdeai’s:

```jsonc
// .mcp.json (repo root)
{ "mcpServers": {
  "copilotkit": { "type": "http", "url": "https://mcp.copilotkit.ai/mcp" },
  "mastra": { "type": "stdio", "command": "npx", "args": ["-y", "@mastra/mcp-docs-server@latest"] }
}}
```

**Rule:** MCP docs for **authoring**; `CopilotKit/examples/integrations/mastra/` + `mdeapp/src/**` for **truth** when they disagree.

### Packages (pinned)

```json
"@copilotkit/react-core": "1.55.2",
"@copilotkit/react-ui": "1.55.2",
"@copilotkit/runtime": "1.55.2",
"@ag-ui/mastra": "beta"
```

Phase 1 hooks: `useCoAgent`, `useCopilotAction`, `CopilotSidebar` — **no v2** `useAgent` / `useFrontendTool` on the same page.

### Route (canonical)

```typescript
// mdeapp/src/app/api/copilotkit/route.ts
const runtime = new CopilotRuntime({
  agents: getLocalAgentsWithLogging({ mastra }),
});
```

`getLocalAgentsWithLogging` extends `MastraAgent` so each turn writes **`public.ai_runs`** (`log-agent-run.ts`). Do not rely on Mastra `server.middleware` alone — middleware runs on the **Mastra HTTP server**, not on Next `/api/copilotkit`.

### Which CopilotKit example to copy

| Example path | Copy for mdeapp | Skip |
|--------------|-----------------|------|
| [`integrations/mastra/`](/home/sk/mdeai/CopilotKit/examples/integrations/mastra/) | **Baseline** — route, `Mastra({ agents })`, `useCoAgent`, Zod memory | Weather tool/agent |
| [`canvas/mastra/`](/home/sk/mdeai/CopilotKit/examples/canvas/mastra/) | Generative UI: `useCopilotAction`, `useCoAgentStateRender`, canvas state updates | OpenAI model — use Gemini |
| [`canvas/mastra-pm/`](/home/sk/mdeai/CopilotKit/examples/canvas/mastra-pm/) | Kanban + shared state shape discipline | PM-specific tools |
| [`canvas/gemini/`](/home/sk/mdeai/CopilotKit/examples/canvas/gemini/) | UI chrome ideas only | **Python ADK** agent — not Mastra |

### Agent-native UI patterns (generative UI, state, HITL, context)

CopilotKit’s [Introduction](https://docs.copilotkit.ai/mastra/) groups **shared state**, **generative UI**, and **human-in-the-loop** — the three pillars of agent-native UX. Full user journeys: [`04-user-stories.md`](04-user-stories.md).

**Phase 1 hook map:** official docs increasingly show **v2** APIs (`useRenderTool`, `useComponent`, `useHumanInTheLoop`, `useInterrupt`). **mdeapp @ 1.55.2** uses the equivalent **v1 co-agent** patterns proven in `CopilotKit/examples/integrations/mastra/`:

| Official doc (v2-forward) | mdeapp Phase 1 (v1.55.2) | Must match |
|---------------------------|---------------------------|------------|
| [Tool rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) `useRenderTool` | `useCopilotAction({ name, available: "disabled", render })` | **Tool `id` === action `name`** (e.g. `search-events`) |
| [Display-only](https://docs.copilotkit.ai/mastra/generative-ui/your-components/display-only) `useComponent` | Same `useCopilotAction` + `render` (no handler) | Agent tool or frontend-only action |
| [Interactive](https://docs.copilotkit.ai/mastra/generative-ui/your-components/interactive) | `useCopilotAction` with `handler` or `renderAndWaitForResponse` | User input returns to agent |
| [State rendering](https://docs.copilotkit.ai/mastra/generative-ui/state-rendering) | `useCoAgentStateRender` + `useCoAgent` | Zod schema in agent === TS type in UI |
| [Shared state read](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) | `useCoAgent<T>({ name, initialState })` → `state` | Works only with **Pattern 1** `getLocalAgents` |
| [Shared state write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write) | `useCoAgent` → `setState` | Roberto wizard fields; Camila map selection |
| [Frontend tools](https://docs.copilotkit.ai/mastra/frontend-tools) | `useCopilotAction({ handler })` (runs in browser) | W3 host wizard — no Mastra `execute` |
| [Tool-based HITL](https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based) | `renderAndWaitForResponse({ respond, status })` | Roberto publish (W4) |
| [Interrupt HITL](https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow) | Mastra tool `suspend()` + CopilotKit `useInterrupt` | **Phase 2** — prefer `renderAndWaitForResponse` in W4 |
| [Agent app context](https://docs.copilotkit.ai/mastra/agent-app-context) | `useCopilotReadable` (v1) / `useAgentContext` (v2) | Map bounds, locale, logged-in host |
| [MCP Apps](https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps) | MAP-002 Grounding Lite UI in chat | Phase 2 — not generic MCP docs server |
| [A2UI](https://docs.copilotkit.ai/mastra/generative-ui/a2ui) | Declarative JSON UI from agent | **Defer** — prefer typed React cards (Paisa) |

#### Tool rendering (backend tool → chat card)

**Official:** Mastra `createTool` on agent; frontend `useRenderTool({ name: "weatherInfo", render })`.  
**mdeai:** Mastra `search-events` on `conciergeAgent`; frontend:

```tsx
useCopilotAction({
  name: "search-events", // must equal tool id
  available: "disabled",
  parameters: [/* mirror tool inputs */],
  render: ({ args, status }) => <EventResultsCard args={args} status={status} />,
});
```

**Personas:** Camila (rentals/events), Tourist (restaurants/attractions). **Tasks:** F15, F17, MAP-001 pins from `tool-output-available` (see `mdeai-concierge.md`).

**Rule:** Never parse prose for prices/URLs — cards render **tool output** only.

#### State rendering (working memory → app UI)

**Official:** Zod `workingMemory.schema` on `Memory`; `useCoAgentStateRender` paints session progress.  
**mdeai:** `createThreadMemory(conciergeWorkingMemorySchema)`; sync schema to `src/lib/types.ts`.

| Surface | Agent | State type | UI reads |
|---------|-------|------------|----------|
| `/` (W1) | `pingAgent` | `MdeState` | Debug panel |
| `/host/event/new` (W3–4) | `hostEventAgent` | `EventDraftState` | Wizard steps (F33/F36) |
| `/chat` (W6) | `conciergeAgent` | Concierge memory + `MapState` | Map + sidebar (F19, MAP-001) |
| `/rentals` (W5) | `rentalAgent` | Rental memory | Listing grid + chat |

**Example:** `CopilotKit/examples/canvas/mastra/` — rich `AgentState` + `useCoAgentStateRender` for canvas items (reference for MAP + Roberto preview).

#### Frontend tools (browser executes)

**Official:** `useFrontendTool` — agent calls, client runs (theme, navigation, form fields).  
**mdeai v1:** `useCopilotAction({ name: "setVenue", handler })` on `/host/event/new`.

**Roberto journey:** “Set venue to Comuna 13 rooftop” → agent calls frontend tool → wizard updates without DB write until publish HITL.

#### Human-in-the-loop

| Pattern | When | mdeai |
|---------|------|-------|
| **Tool-based** ([doc](https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based)) | Standalone UI collects input; `respond()` resumes agent | **`renderAndWaitForResponse`** — publish ticket tiers (W4) |
| **Interrupt** ([doc](https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow)) | Mastra tool calls `suspend()` mid-`execute` | Phase 2 for `preview_and_publish` inside Mastra tool |

**Example:** `integrations/mastra` `go_to_moon` + `MoonCard` — copy pattern for `ApprovalPanel` / publish sheet.

#### Agent app context (readables)

**Official:** `useAgentContext({ description, value })` — current page, user, colleagues.  
**mdeai:** On `/chat`, pass **map viewport**, **neighborhood filter**, **auth user id** (non-PII) so Camila does not re-ask “where in Medellín?”.

**Requires Pattern 1** — remote `:4111/chat` agents do not receive app readables the same way ([shared-state read callout](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read)).

#### Defer: MCP Apps & A2UI

- **[MCP Apps](https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps):** interactive widgets from MCP servers — align with MAP-002 Grounding Lite, not `@mastra/mcp-docs-server` (dev docs only).
- **[A2UI](https://docs.copilotkit.ai/mastra/generative-ui/a2ui):** declarative JSON UI — skip Phase 1; use Paisa React cards for consistent brand.

#### Feature viewer demos (sanity-check UX)

| Demo | URL path | mdeai analogue |
|------|----------|----------------|
| Tool rendering | [feature/backend_tool_rendering](https://feature-viewer.copilotkit.ai/mastra/feature/backend_tool_rendering) | Rental/event cards |
| Shared state | [feature/shared_state](https://feature-viewer.copilotkit.ai/mastra/feature/shared_state) | `useCoAgent` on `/rentals`, `/chat` |
| HITL | [feature/human_in_the_loop](https://feature-viewer.copilotkit.ai/mastra/feature/human_in_the_loop) | Roberto publish |
| Agentic chat | [feature/agentic_chat](https://feature-viewer.copilotkit.ai/mastra/feature/agentic_chat) | Concierge multi-tool |

**Journey specs:** [`04-user-stories.md`](04-user-stories.md).

### Switching default chat agent

```tsx
// layout.tsx — day-1
<CopilotKit runtimeUrl="/api/copilotkit" agent="pingAgent">

// Camila concierge smoke
<CopilotKit runtimeUrl="/api/copilotkit" agent="conciergeAgent">
```

`getLocalAgentsWithLogging` exposes **all** registered agents to the runtime; the `agent` prop selects the default for the sidebar.

---

## 8. Processors

**Implemented on `conciergeAgent` only** (legacy parity):

| Processor | Role |
|-----------|------|
| `PromptInjectionDetector` | `model: FLASH_MODEL` on input |
| `TokenLimiter(8192)` | cap context |

**Backlog (from legacy §7):** PII sanitizer on input; output formatter enforcing max 5 cards + URLs. Use `@mastra/core/processors` — verify API in Mastra MCP before adding.

---

## 9. Storage & memory persistence

| Layer | mdeapp today | Target (task) |
|-------|--------------|---------------|
| Mastra `storage` | `LibSQLStore` `:memory:` | F13+ Postgres / Supabase pooler |
| Agent thread memory | `agent-memory.ts` → `file:mastra-agent-memory.db` | Same store as Mastra storage when F13 lands |
| Product audit | `ai_runs` via CopilotKit hook | ✅ F13 |

**Legacy** used `PostgresStore` + `DATABASE_URL` on :54322 — correct for production, not yet wired in `mdeapp/index.ts`.

---

## 10. Observability

| Signal | Where | Who cares |
|--------|-------|-----------|
| `ai_runs` rows | `log-agent-run.ts` after each CopilotKit turn | Patricia / billing |
| Studio traces | `mastra dev` DefaultExporter (when enabled) | Sofía |
| `mastra_ai_spans` | Mastra observability exporter | F20+ |

**Legacy** had `Observability` + `SensitiveDataFilter` in `my-mastra-app/index.ts` — add OTLP + SensitiveDataFilter before prod (backlog).

**Smoke:** `cd mdeapp && npm test` includes agent registry + `gemini-3.5-flash` model assertion.

---

## 11. MCP & documentation cadence

Before implementing or changing Mastra/CopilotKit/Gemini integration code:

| Need | MCP / source |
|------|----------------|
| Mastra API | `.mcp.json` → `npx -y @mastra/mcp-docs-server@latest` (`searchMastraDocs`, `readMastraDocs`) |
| CopilotKit | `https://mcp.copilotkit.ai/mcp` (`search-docs`) |
| Gemini models | `gemini-api-docs-mcp__search_docs` |
| Installed truth | `mdeapp/node_modules/@mastra/core/dist/docs/` |
| mdeai wiring | `.claude/skills/copilotkit-integrations/references/integrations/mastra.md` |
| Checklist | `plan/audit/05-copilotkit-mastra-setup-checklist.md` |

**Skill rule:** Read `.claude/skills/mastra/SKILL.md` first — do not trust training-data Mastra APIs.

**Dev-only MCP:** `@mastra/mcp-docs-server` is for **documentation**, not product Maps tools. Product Maps → MAP-002 Grounding Lite, `mde-maps` skill.

---

## 12. Environment & startup

| Variable | Required for | Notes |
|----------|--------------|-------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | All agents | Gemini via `@ai-sdk/google` |
| `SUPABASE_URL` + `SUPABASE_ANON_KEY` | Event/restaurant/attraction tools | Real rows |
| `DATABASE_URL` | Live rentals | Optional; mock without it |

**Commands (mdeapp only):**

```bash
cd mdeapp && npm run dev          # Next + mastra dev (concurrently)
cd mdeapp && npm run dev:agent    # Studio only
cd mdeapp && npm run floor        # lint + typecheck + build + test + audit
```

**Do not use** legacy `scripts/mastra-start.sh` / port 4111 `my-mastra-app` for Phase 1 truth — that tree is frozen except P0 security.

**Verify Studio:**

```bash
curl -s http://localhost:<port>/api/agents | jq 'to_entries[] | {id: .key, model: .value.modelId}'
# Expect gemini-3.5-flash for all six agents
```

---

## 13. Legacy vs mdeapp (migration checklist)

When porting from `/home/sk/mde/my-mastra-app/`:

| Legacy | mdeapp action |
|--------|----------------|
| 7 agents + weather | 6 agents, no weather |
| `gemini-2.5-flash` / `2.5-pro` strings | `lib/models.ts` → `gemini-3.5-flash` |
| `PostgresStore` in index | LibSQL until F13; plan pooler URL |
| `registerCopilotKit` :4111 | Pattern 1 `/api/copilotkit` only |
| `ai-runs-middleware` on `/chat` | `LoggingMastraAgent` |
| 4 workflows | 3 workflows |
| 7 tools (weather, ping) | 5 tools |
| Workspace + 5 skills | Not ported — optional Phase 2 |
| 3 weather scorers | Not ported — add rental/concierge scorers later |
| OpenAI translation scorer | Avoid in prod agents; Gemini-only |

---

## 14. Backlog (ordered)

1. **F13** — Postgres `storage` + align `createThreadMemory` store with Mastra storage (Camila’s history survives redeploy).
2. **MAP-002** — Grounding Lite `MCPClient` on `conciergeAgent` (J9); not `@mastra/mcp-docs-server`.
3. **Tool streaming** — `writer` progress on `search-rentals` / Grounding tools when p95 latency warrants UX.
4. **MAP-001** — vis.gl map + `useCoAgentStateRender` (pattern from `canvas/mastra`).
5. **Default UI agent** — flip `layout.tsx` to `conciergeAgent` when `/chat` is ready.
6. **Workflow smoke** — `streamVNext` on `concierge-routing-workflow` in CI (J6).
7. **Scorers** — rental relevance + follow-up memory retention (replace weather scorers).
8. **Semantic recall** — pgvector (VDB-02); optional `maxTokens` / `temperature` per agent.
9. **Processors** — PII sanitizer on concierge input.

---

## 15. Quick verification (Sofía)

| Check | Pass criteria |
|-------|----------------|
| Studio agents | 6 rows, models `gemini-3.5-flash` |
| Studio workflows | 3 rows, descriptions non-empty |
| Studio tools | 5 tools visible |
| `npm run floor` | exit 0 |
| CopilotKit chat | POST `/api/copilotkit` 200; `ai_runs` row with `copilotkit-pattern-1` |
| Agent name | `useCoAgent({ name: "conciergeAgent" })` matches `mastra.listAgents()` key |

---

## 16. CopilotKit runtime, AG-UI, and Mastra backend (docs → mdeai)

Full user stories per feature: [`04-user-stories.md`](04-user-stories.md) (Feature catalog + J1–J11). Official Mastra **agent examples** (one doc each): [`examples/00-index.md`](examples/00-index.md).

### 16.1 Copilot Runtime (Pattern 1)

**Doc:** [copilot-runtime](https://docs.copilotkit.ai/mastra/copilot-runtime)

| Rule | mdeai |
|------|-------|
| One runtime per Next app | `src/app/api/copilotkit/route.ts` |
| `ExperimentalEmptyAdapter` | Mastra owns orchestration |
| Agent map | `MastraAgent.getLocalAgents({ mastra })` wrapped by `getLocalAgentsWithLogging` |
| Never Pattern 2 in prod | No `registerCopilotKit` on `:4111` for mdeapp traffic |

**Persona:** Sofía proves chat via POST `/api/copilotkit` + `ai_runs` row — not only Studio `:411x`.

### 16.2 AG-UI

**Doc:** [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) · [blog](https://mastra.ai/blog/copilotkitmastra)

| Event | mdeai use |
|-------|-----------|
| Text stream | Sidebar / chat |
| Tool input/output | Rental/event/restaurant cards |
| State | `useCoAgent` ↔ working memory |

**Persona:** Lucía traces `tool-output-available` when cards disagree with DB.

### 16.3 Tools ([Using Tools](https://mastra.ai/docs/v0/agents/using-tools))

- **Five tools** in `mdeapp/src/mastra/tools/` — shared by agents and workflow steps.
- **Descriptions** must say when to call (neighborhood, price, cuisine) — router/concierge rely on this.
- **Output schema** is what CopilotKit renders — never parse model prose for IDs/URLs.

**Personas:** Camila (`search-rentals`), Tourist (`search-restaurants` / `search-attractions`).

### 16.4 Memory (full stack)

**Docs:** [overview](https://mastra.ai/docs/v0/memory/overview) · [threads](https://mastra.ai/docs/v0/memory/threads-and-resources) · [working memory](https://mastra.ai/docs/v0/memory/working-memory) · [conversation history](https://mastra.ai/docs/v0/memory/conversation-history) · [processors](https://mastra.ai/docs/v0/memory/memory-processors) · [Postgres](https://mastra.ai/docs/v0/memory/storage/memory-with-pg)

- `createThreadMemory` in `lib/agent-memory.ts` — Zod `scope: "thread"`, `lastMessages: 20`.
- **F13 / J10:** single `PostgresStore` on `Mastra` + agent memory; pass `thread` + `resource` from CopilotKit route.
- CopilotKit: Zod = `useCoAgent<T>` = agent file = `lib/types.ts`.
- **Processors:** add `ToolCallFilter` + `TokenLimiter` on `Memory` when context cost spikes; concierge already has agent-level `TokenLimiter(8192)`.

**Personas:** Camila (J2, J10), Roberto (`EventDraftState` J5), Patricia (`mastra_messages` audit).

### 16.5 Networks ([Agent Networks](https://mastra.ai/docs/v0/agents/networks)) — deferred

Phase 1 uses **router + workflows + concierge tools**, not `.network()`. Phase 2: multi-specialist host research network.

### 16.6 Workflows

| Doc | mdeai workflow | Persona |
|-----|----------------|---------|
| [overview](https://mastra.ai/docs/v0/workflows/overview) | 3 registered workflows | Camila via router |
| [workflow-state](https://mastra.ai/docs/v0/workflows/workflow-state) | Not used yet | Roberto progress (Phase 2) |
| [agents-and-tools](https://mastra.ai/docs/v0/workflows/agents-and-tools) | Steps call `searchRentals` etc. | Shared with agents |
| [suspend-and-resume](https://mastra.ai/docs/v0/workflows/suspend-and-resume) | Phase 2 publish | Roberto |
| [human-in-the-loop](https://mastra.ai/docs/v0/workflows/human-in-the-loop) | `suspendSchema` + UI | Roberto |
| [snapshots](https://mastra.ai/docs/v0/workflows/snapshots) | Needs Postgres storage | Sofía / F13 |

**HITL split:** Phase 1 Roberto publish = CopilotKit `renderAndWaitForResponse`; Phase 2 can add Mastra `suspend()` on `preview_and_publish` with snapshots once F13 lands.

### 16.7 Streaming ([overview](https://mastra.ai/docs/v0/streaming/overview))

| Doc | mdeai rule |
|-----|------------|
| [events](https://mastra.ai/docs/v0/streaming/events) | `text-delta`, `tool-call`, `tool-result` mirror AG-UI; Lucía correlates Inspector ↔ Studio |
| [tool-streaming](https://mastra.ai/docs/v0/streaming/tool-streaming) | `await writer.write()` in `search-rentals` for slow DB; custom types for skeleton cards |
| [workflow-streaming](https://mastra.ai/docs/v0/streaming/workflow-streaming) | `streamVNext` in Studio for J6; `resumeStreamVNext` with workflow HITL after F13 |

**Product path:** Camila never calls `conciergeAgent.stream()` from React — CopilotKit runtime streams via [AG-UI](https://docs.copilotkit.ai/mastra/ag-ui). Use Mastra `.stream()` in Studio, scripts, and workflow CI.

**Personas:** Camila (sidebar tokens), Sofía (workflow stream in Studio), Lucía (`tool-call` vs `tool-output-available`).

### 16.8 MCP ([overview](https://mastra.ai/docs/v0/mcp/overview))

| Class | mdeai |
|-------|-------|
| `MCPClient` | Phase 2: Grounding Lite on `conciergeAgent` (MAP-002) — [`04-user-stories.md` J9](04-user-stories.md) |
| `MCPServer` | **Not Phase 1** — no npm publish of mde tools ([publishing guide](https://mastra.ai/docs/v0/mcp/publishing-mcp-server)) |
| Dev MCP | `.mcp.json` `mastra` + `copilotkit` — docs only, not product tools |

**Static vs dynamic:** Phase 1 = `getTools()` at agent build for Grounding; multi-tenant host keys → `getToolsets()` per `generate()` (Phase 3).

**Do not** register `@mastra/mcp-docs-server` in Studio as a “product” MCP — it is for Sofía authoring ([§11 MCP cadence](#11-mcp--documentation-cadence)).

### 16.9 RAG (Phase 2 — not rental search)

**Docs:** [overview](https://mastra.ai/docs/v0/rag/overview) · [chunking](https://mastra.ai/docs/v0/rag/chunking-and-embedding) · [vector DBs](https://mastra.ai/docs/v0/rag/vector-databases) · [retrieval](https://mastra.ai/docs/v0/rag/retrieval)

- Phase 1 listings/events = **Supabase tools**, not vector RAG.
- Phase 2: host policy PDFs for `hostEventAgent` (J11), `PgVector` on same Postgres as F13.

### 16.10 Server, storage, deployment

| Doc | mdeai |
|-----|-------|
| [Mastra Server](https://mastra.ai/docs/v0/server-db/mastra-server) | Studio `:411x` only — not prod CopilotKit target |
| [Runtime Context](https://mastra.ai/docs/v0/server-db/runtime-context) | `host-id`, locale, tier from Next route |
| [Custom API routes](https://mastra.ai/docs/v0/server-db/custom-api-routes) | Product AI = `/api/copilotkit`, not Hono custom routes |
| [Storage](https://mastra.ai/docs/v0/server-db/storage) | F13: messages, snapshots, traces in Postgres |
| [Deployment](https://mastra.ai/docs/v0/deployment/overview) | Vercel Next framework integration |

### 16.11 Doc quick index

| URL | Topic |
|-----|--------|
| https://docs.copilotkit.ai/mastra/copilot-runtime | Runtime |
| https://docs.copilotkit.ai/mastra/ag-ui | AG-UI |
| https://mastra.ai/blog/copilotkitmastra | Partnership + starter |
| https://mastra.ai/docs/v0/agents/using-tools | Tools |
| https://mastra.ai/docs/v0/agents/agent-memory | Memory |
| https://mastra.ai/docs/v0/agents/networks | Networks |
| https://mastra.ai/docs/v0/workflows/overview | Workflows |
| https://mastra.ai/docs/v0/workflows/workflow-state | State |
| https://mastra.ai/docs/v0/workflows/agents-and-tools | Steps + tools |
| https://mastra.ai/docs/v0/workflows/suspend-and-resume | Suspend |
| https://mastra.ai/docs/v0/workflows/human-in-the-loop | HITL |
| https://mastra.ai/docs/v0/workflows/snapshots | Snapshots |
| https://mastra.ai/docs/v0/streaming/overview | Streaming |
| https://mastra.ai/docs/v0/streaming/events | Stream events |
| https://mastra.ai/docs/v0/streaming/tool-streaming | Tool `writer` |
| https://mastra.ai/docs/v0/streaming/workflow-streaming | Workflow stream |
| https://mastra.ai/docs/v0/mcp/overview | MCPClient / MCPServer |
| https://mastra.ai/docs/v0/mcp/publishing-mcp-server | Publish MCP (deferred) |
| https://mastra.ai/docs/v0/memory/overview | Memory |
| https://mastra.ai/docs/v0/memory/threads-and-resources | Threads |
| https://mastra.ai/docs/v0/memory/working-memory | Working memory |
| https://mastra.ai/docs/v0/memory/conversation-history | History |
| https://mastra.ai/docs/v0/memory/memory-processors | Processors |
| https://mastra.ai/docs/v0/memory/storage/memory-with-pg | Postgres memory |
| https://mastra.ai/docs/v0/rag/overview | RAG |
| https://mastra.ai/docs/v0/rag/chunking-and-embedding | Chunking |
| https://mastra.ai/docs/v0/rag/vector-databases | Vector store |
| https://mastra.ai/docs/v0/rag/retrieval | Retrieval |
| https://mastra.ai/docs/v0/server-db/mastra-server | Mastra server |
| https://mastra.ai/docs/v0/server-db/runtime-context | RuntimeContext |
| https://mastra.ai/docs/v0/server-db/custom-api-routes | Custom routes |
| https://mastra.ai/docs/v0/server-db/storage | MastraStorage |
| https://mastra.ai/docs/v0/deployment/overview | Deploy |

---

## Related links

### Official (reviewed for this doc)

- [CopilotKit Mastra — Introduction](https://docs.copilotkit.ai/mastra/)
- [CopilotKit Mastra — Quickstart](https://docs.copilotkit.ai/mastra/quickstart) (Pattern 1 — **mdeapp**)
- [CopilotKit Mastra — Copilot Runtime](https://docs.copilotkit.ai/mastra/copilot-runtime)
- [CopilotKit Mastra — AG-UI](https://docs.copilotkit.ai/mastra/ag-ui)
- [Mastra blog — CopilotKit + Mastra](https://mastra.ai/blog/copilotkitmastra)
- **Mastra agents:** [tools](https://mastra.ai/docs/v0/agents/using-tools) · [memory](https://mastra.ai/docs/v0/agents/agent-memory) · [networks](https://mastra.ai/docs/v0/agents/networks)
- **Mastra workflows:** [overview](https://mastra.ai/docs/v0/workflows/overview) · [state](https://mastra.ai/docs/v0/workflows/workflow-state) · [agents & tools](https://mastra.ai/docs/v0/workflows/agents-and-tools) · [suspend/resume](https://mastra.ai/docs/v0/workflows/suspend-and-resume) · [HITL](https://mastra.ai/docs/v0/workflows/human-in-the-loop) · [snapshots](https://mastra.ai/docs/v0/workflows/snapshots)
- **Mastra streaming:** [overview](https://mastra.ai/docs/v0/streaming/overview) · [events](https://mastra.ai/docs/v0/streaming/events) · [tool streaming](https://mastra.ai/docs/v0/streaming/tool-streaming) · [workflow streaming](https://mastra.ai/docs/v0/streaming/workflow-streaming)
- **Mastra MCP:** [overview](https://mastra.ai/docs/v0/mcp/overview) · [publishing MCP server](https://mastra.ai/docs/v0/mcp/publishing-mcp-server)
- **Mastra memory:** [overview](https://mastra.ai/docs/v0/memory/overview) · [threads](https://mastra.ai/docs/v0/memory/threads-and-resources) · [working memory](https://mastra.ai/docs/v0/memory/working-memory) · [history](https://mastra.ai/docs/v0/memory/conversation-history) · [processors](https://mastra.ai/docs/v0/memory/memory-processors) · [Postgres](https://mastra.ai/docs/v0/memory/storage/memory-with-pg)
- **Mastra RAG:** [overview](https://mastra.ai/docs/v0/rag/overview) · [chunking](https://mastra.ai/docs/v0/rag/chunking-and-embedding) · [vector DBs](https://mastra.ai/docs/v0/rag/vector-databases) · [retrieval](https://mastra.ai/docs/v0/rag/retrieval)
- **Mastra server/deploy:** [server](https://mastra.ai/docs/v0/server-db/mastra-server) · [runtime context](https://mastra.ai/docs/v0/server-db/runtime-context) · [custom routes](https://mastra.ai/docs/v0/server-db/custom-api-routes) · [storage](https://mastra.ai/docs/v0/server-db/storage) · [deployment](https://mastra.ai/docs/v0/deployment/overview)
- **Generative UI:** [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) · [state-rendering](https://docs.copilotkit.ai/mastra/generative-ui/state-rendering) · [display-only](https://docs.copilotkit.ai/mastra/generative-ui/your-components/display-only) · [interactive](https://docs.copilotkit.ai/mastra/generative-ui/your-components/interactive) · [mcp-apps](https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps) · [a2ui](https://docs.copilotkit.ai/mastra/generative-ui/a2ui)
- **App control:** [frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools) · [shared state read](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) · [shared state write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write) · [agent-app-context](https://docs.copilotkit.ai/mastra/agent-app-context)
- **HITL:** [interrupt-flow](https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow) · [tool-based](https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based)
- [CopilotKit — Coding agents / MCP](https://docs.copilotkit.ai/mastra/coding-agents)
- [CopilotKit — Slots](https://docs.copilotkit.ai/mastra/custom-look-and-feel/slots)
- [CopilotKit — Headless UI](https://docs.copilotkit.ai/mastra/custom-look-and-feel/headless-ui)
- [CopilotKit — Programmatic control](https://docs.copilotkit.ai/mastra/programmatic-control)
- [CopilotKit — Inspector](https://docs.copilotkit.ai/mastra/inspector)
- [Mastra — Using CopilotKit](https://mastra.ai/guides/build-your-ui/copilotkit) (Pattern 2 — legacy reference)
- [Mastra UI Dojo](https://ui-dojo.mastra.ai/)
- **User journeys:** [`04-user-stories.md`](04-user-stories.md)
- **Agent examples (mdeai):** [`examples/00-index.md`](examples/00-index.md) — agents, [memory template/schema](https://mastra.ai/examples/v0/memory/working-memory-schema), [browser](https://mastra.ai/docs/browser/overview), WhatsApp
- **Domain playbooks:** [`examples/domains/00-index.md`](examples/domains/00-index.md) — rentals, events, restaurants, contests, Google Maps
- **Platform features:** [`examples/features/00-index.md`](examples/features/00-index.md) — memory, agents, workspace
- **Workflows:** [`examples/workflows/00-index.md`](examples/workflows/00-index.md) — control flow, HITL, snapshots, schedules
- **Streaming / MCP / Editor:** [`examples/streaming/00-index.md`](examples/streaming/00-index.md) · [`examples/mcp/00-index.md`](examples/mcp/00-index.md) · [`examples/editor/00-index.md`](examples/editor/00-index.md)
- **Workspace (VPS):** [`examples/workspace/00-index.md`](examples/workspace/00-index.md)
- **RAG (host docs, Phase 2):** [`examples/rag/00-index.md`](examples/rag/00-index.md)

### mdeai repo

- Mastra Studio overview: https://mastra.ai/docs/studio/overview
- Vendored CopilotKit MDX: `CopilotKit/docs/content/docs/integrations/mastra/`
- mdeai concierge production notes: `.claude/skills/mastra/references/mdeai-concierge.md`
- CopilotKit integration skill: `.claude/skills/copilotkit-integrations/references/integrations/mastra.md`
- Coverage matrix: `tasks/core/my-mastra-app-coverage.md`
- CopilotKit × Mastra audit: `plan/audit/05-copilotkit-mastra-setup-checklist.md`
