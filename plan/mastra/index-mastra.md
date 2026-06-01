---
title: Mastra task pack — master index (mdeai)
project: mdeapp
copilotkit: 1.55.2
model: gemini-3.5-flash
updated: 2026-05-21
score_version: 1
---

# Mastra + CopilotKit — master index

## At a glance

| | |
|---|---|
| **What this folder is** | Planning playbooks: Mastra + CopilotKit → mdeai personas, journeys, acceptance — **not** `mdeapp` source. **Executable tasks:** [`tasks/mastra/`](../../tasks/mastra/INDEX.md). |
| **Purpose** | Pick what to build next without re-reading 70+ markdown files. |
| **Goals** | One **graded** priority table + clear **implementation order** + stable folder layout. |
| **Read order** | **[`summary.md`](summary.md)** (plain language) → this file → [`github/`](github/index-github.md) or `examples/` tier → deep doc → [`04-user-stories.md`](04-user-stories.md) for journeys only. |
| **Rules** | [`03-best-practices.md`](03-best-practices.md) · **Studio:** [`01-studio.md`](01-studio.md) |

**Prod path:** `POST /api/copilotkit` → Pattern 1 · **Model:** `gemini-3.5-flash` only · **App:** `mdeapp/src/mastra/`

---

## Folder map (`plan/mastra/` + `tasks/mastra/`)

**Planning** is under `plan/mastra/` (this tree). **Executable specs:** [`tasks/mastra/INDEX.md`](../../tasks/mastra/INDEX.md) (MASTRA-001…005).

```text
plan/mastra/
├── prd-mastra.md                ← Master PRD (16 sections, CTO playbook)
├── mastra-roadmap.md            ← Core / MVP / post-MVP / advanced lanes
├── audit/00-supabase-mastra-audit.md  ← Supabase + Mastra storage go/no-go
├── index-mastra.md              ← YOU ARE HERE — scores, seq, full map
├── 03-best-practices.md         ← Implementation law (Pattern 1, agents, tools)
├── 05-mastra-copilotkit.md      ← CK+AG-UI gap map (85/100 forensic), coverage ~70%, backlog CK-001…008
├── 04-user-stories.md           ← J1–J12 journeys + CK matrix (catalog only)
├── 01-studio.md                 ← Mastra Studio :4111 (Sofía debug)
├── 02-best-old.md               ← Archive — ignore
│
├── github/                      ← External repos (learn / adapt / skip)
│   ├── index-github.md          ← GitHub hub + 🟢🟡🔴 scorecard
│   ├── 01-copilotkit-mastra-integration.md
│   ├── 02-ui-dojo.md … 15-agentstack.md
│   └── 99-github-backlog.md
│
└── examples/                    ← Official Mastra docs + mdeai playbooks
    ├── 00-index.md              ← Agent examples (01–09)
    ├── 01-calling-agents.md … 09-working-memory-schema.md
    ├── domains/                 ← Rentals, events, restaurants, maps, contests
    ├── workflows/               ← Control flow, HITL, snapshots, errors
    ├── features/                ← Memory, storage, A2A, signals, workspace ptr
    ├── streaming/               ← AG-UI events, workflow stream
    ├── mcp/                     ← Grounding MCP, MCP Apps
    ├── evals/                   ← Scorers, CI, datasets
    ├── rag/                     ← Host policy (J11)
    ├── workspace/               ← VPS / OpenClaw only
    ├── browser/                 ← Phase 2+ — skip for Places
    └── editor/                  ← Studio prompts — Phase 2+
```

| Branch | Index file | What it answers |
|--------|------------|-----------------|
| **GitHub repos** | [`github/index-github.md`](github/index-github.md) | Which clone to study? Score /100? Import or skip? |
| **Mastra features** | This file + `examples/*/00-index.md` | Which doc topic to implement next? |
| **Acceptance** | [`04-user-stories.md`](04-user-stories.md) | What does Done mean per persona? |

**Vendored code (not under `tasks/`):** [`../../CopilotKit/examples/integrations/mastra/`](../../CopilotKit/examples/integrations/mastra/) · [`../../github/events/`](../../github/events/) (legacy event ideas)

---

## How to read the tables

| Column | Meaning |
|--------|---------|
| **Tier** | **Core** = Phase 1 ship blockers · **Priority** = same phase, next in queue · **Advanced** = Phase 2+ revenue/ops · **Deferred** = post-MVP or non-Vercel |
| **Grade** | **A** must ship for persona MVP · **B** should ship same phase · **C** quality/ops enabler · **D** Studio/VPS/dev-only · **F** explicitly out of Phase 1 |
| **Seq** | Suggested **implementation order** (lower = sooner). Tie-break: Camila/Roberto revenue paths first. |
| **Week** | PRD alignment (W1 foundation → W7 chat). **Task** = foundation backlog id when known. |
| **Status** | ✅ in repo today · 🔨 partial · 📋 spec only · ⏸ deferred |
| **Score** | **0–100** composite importance for mdeai Phase 1 (higher = ship sooner). See rubric below. |
| **Benefit** | One-line **persona-visible** payoff (Camila cards, Roberto publish, Lucía gates, etc.). |

**Do not implement bottom-up from Mastra docs** — follow **Seq** then **Score**; deep docs are reference, not a backlog.

---

## Score rubric (/100)

Weighted for **Medellín AI Phase 1** (rentals + events + chat), not generic Mastra completeness.

| Factor | Max pts | What raises the score |
|--------|---------|------------------------|
| **Revenue path** | 35 | Directly on Camila `/rentals`, Roberto `/host/event/new`, or Tourist `/chat` conversion |
| **Ship blocker** | 25 | App cannot demo or merge without it (Pattern 1, tools, workflows, HITL) |
| **Trust / quality** | 20 | Grounded data, memory survive redeploy, CI catches regressions (Lucía/Sofía) |
| **Ready today** | 10 | Already in `mdeapp` or F0x task — benefit per hour is high |
| **Breadth** | 10 | Multiple personas or surfaces |

**Bands:** 90–100 = ship now · 75–89 = same phase queue · 60–74 = Phase 2 worth it · 40–59 = ops/debug only · under 40 = defer / not Vercel prod

---

## Complete scorecard (all docs, sorted by score)

| Score | Doc | Tier | Benefit (mdeai) |
|------:|-----|------|-----------------|
| **98** | [`03-best-practices.md`](03-best-practices.md) | Core | Pattern 1 + agent names — wrong wiring = silent 404 for every persona |
| **98** | [`examples/01-calling-agents.md`](examples/01-calling-agents.md) | Core | Registers agents CopilotKit can call — J1 smoke for Sofía |
| **96** | [`examples/09-working-memory-schema.md`](examples/09-working-memory-schema.md) | Core | Camila/Roberto state sync across turns — same Zod in agent + `types.ts` |
| **95** | [`examples/domains/01-real-estate-rentals.md`](examples/domains/01-real-estate-rentals.md) | Core | Camila gets real listings, not hallucinated apartments — commission path |
| **95** | [`04-user-stories.md`](04-user-stories.md) | Core | Acceptance for J1–J12 — what “done” means per persona |
| **94** | [`examples/workflows/01-control-flow.md`](examples/workflows/01-control-flow.md) | Core | `rental-search-workflow` pipeline — search → format → rerank |
| **93** | [`examples/streaming/02-events.md`](examples/streaming/02-events.md) | Core | Sidebar shows cards when `tool-output-available` fires — Lucía can assert |
| **92** | [`examples/workflows/02-agents-and-tools.md`](examples/workflows/02-agents-and-tools.md) | Core | Steps reuse `search-rentals` — one tool truth for cards |
| **91** | CopilotKit tool rendering (CK matrix in `04-user-stories`) | Core | Camila sees rental cards in sidebar, not JSON prose |
| **90** | [`examples/workflows/05-human-in-the-loop.md`](examples/workflows/05-human-in-the-loop.md) | Core | Roberto approves publish — revenue without accidental go-live |
| **88** | [`examples/domains/02-events-hosting.md`](examples/domains/02-events-hosting.md) | Priority | Roberto event wizard + tickets — host MRR |
| **82** | [`examples/02-system-prompt.md`](examples/02-system-prompt.md) | Priority | Tourist vs host tone — fewer wrong-tool turns |
| **80** | [`features/08-storage.md`](examples/features/08-storage.md) | Priority | F13: Camila turn 11 remembers turn 1 after Vercel cold start |
| **78** | [`features/07-message-history.md`](examples/features/07-message-history.md) | Priority | Thread continuity on `/chat` — multi-turn budget/neighborhood |
| **76** | [`examples/domains/05-google-maps.md`](examples/domains/05-google-maps.md) | Priority | Map pins + `mapId` — Tourist trusts restaurant locations |
| **76** | [`mcp/01-overview.md`](examples/mcp/01-overview.md) | Priority | Grounding Lite MCP — grounded names, not invented venues (J9) |
| **74** | [`examples/domains/03-restaurants-tourist.md`](examples/domains/03-restaurants-tourist.md) | Priority | Tourist concierge on `/chat` — discovery + map |
| **72** | [`examples/03-supervisor-agent.md`](examples/03-supervisor-agent.md) | Priority | `routerAgent` — “events vs rentals” stays on intent (J6) |
| **72** | [`evals/04-running-in-ci.md`](examples/evals/04-running-in-ci.md) | Priority | F09: PR fails before Camila sees broken `search-rentals` |
| **70** | [`evals/02-built-in-scorers.md`](examples/evals/02-built-in-scorers.md) | Priority | `tool-call-accuracy` — model must call SQL tools |
| **70** | [`streaming/01-overview.md`](examples/streaming/01-overview.md) | Priority | End-to-end stream mental model for Sofía debugging |
| **68** | [`workflows/07-error-handling.md`](examples/workflows/07-error-handling.md) | Priority | Failed search → `ai_runs` row Patricia can inspect |
| **65** | [`evals/01-overview.md`](examples/evals/01-overview.md) | Priority | Quality metrics when prompts/models change |
| **62** | [`examples/05-runtime-context.md`](examples/05-runtime-context.md) | Advanced | Enterprise host tier / `hostId` without duplicate agents |
| **62** | [`mcp/02-mcp-apps.md`](examples/mcp/02-mcp-apps.md) | Priority | Rich map UI in chat for Tourist (MAP apps) |
| **58** | [`workflows/03-snapshots.md`](examples/workflows/03-snapshots.md) | Advanced | Resume Roberto publish after server crash (post-F13) |
| **58** | [`evals/03-custom-scorers.md`](examples/evals/03-custom-scorers.md) | Priority | Card Zod + `bestForLabel` enum — deterministic CI |
| **56** | [`workflows/04-suspend-and-resume.md`](examples/workflows/04-suspend-and-resume.md) | Advanced | Server-side HITL resume — Phase 2 backend for J5 |
| **55** | [`features/11-observational-memory.md`](examples/features/11-observational-memory.md) | Advanced | Long `/chat` without re-asking budget every turn |
| **55** | [`evals/06-datasets-overview.md`](examples/evals/06-datasets-overview.md) | Advanced | Versioned golden queries for concierge regression |
| **54** | [`rag/04-retrieval.md`](examples/rag/04-retrieval.md) | Advanced | Roberto policy answers cite host docs (J11) |
| **52** | [`features/01-background-tasks.md`](examples/features/01-background-tasks.md) | Advanced | Slow search off hot path — sidebar stays responsive |
| **52** | [`rag/01-overview.md`](examples/rag/01-overview.md) | Advanced | Host KB — not rental cards (avoids wrong architecture) |
| **50** | [`features/09-semantic-recall.md`](examples/features/09-semantic-recall.md) | Advanced | Chat recall over embeddings — separate from SQL search |
| **50** | [`evals/07-running-experiments.md`](examples/evals/07-running-experiments.md) | Advanced | Compare prompt versions on full dataset |
| **50** | [`rag/03-vector-databases.md`](examples/rag/03-vector-databases.md) | Advanced | PgVector on same Supabase project as F13 |
| **48** | [`examples/04-image-analysis.md`](examples/04-image-analysis.md) | Advanced | Roberto flyer upload → wizard fields (W4+) |
| **48** | [`features/06-memory-processors.md`](examples/features/06-memory-processors.md) | Advanced | Trim tool noise from long concierge threads |
| **48** | [`evals/05-evals-with-memory.md`](examples/evals/05-evals-with-memory.md) | Advanced | CI tests multi-turn recall with real `threadId` |
| **48** | [`rag/02-chunking-and-embedding.md`](examples/rag/02-chunking-and-embedding.md) | Advanced | Policy PDFs → chunks for J11 |
| **45** | [`streaming/03-workflow-streaming.md`](examples/streaming/03-workflow-streaming.md) | Advanced | Studio shows workflow steps — Sofía debug router |
| **45** | [`01-studio.md`](01-studio.md) | Priority | Trace tools without hitting prod — Sofía only |
| **42** | [`features/10-multi-user-threads.md`](examples/features/10-multi-user-threads.md) | Advanced | Co-host shares event thread — Roberto + staff |
| **40** | *backlog* `features/12-request-context.md` | Advanced | Tier/locale on `/api/copilotkit` middleware |
| **38** | *backlog* `features/13-agent-processors.md` | Advanced | PII/injection guard on concierge |
| **35** | [`streaming/04-background-task-streaming.md`](examples/streaming/04-background-task-streaming.md) | Advanced | Progress while background search runs |
| **32** | [`workflows/06-time-travel.md`](examples/workflows/06-time-travel.md) | Advanced | Replay failed rerank step — Sofía only |
| **28** | [`editor/01-tools.md`](examples/editor/01-tools.md) | Deferred | Non-dev tool edits in Studio — not prod path |
| **28** | [`examples/08-working-memory-template.md`](examples/08-working-memory-template.md) | Advanced | Freeform WM — optional Patricia ops |
| **26** | [`editor/02-prompts.md`](examples/editor/02-prompts.md) | Deferred | Studio prompt versions — Phase 2 product team |
| **25** | [`browser/01-overview.md`](examples/browser/01-overview.md) | Deferred | Headless scrape — not hot path vs Places API |
| **25** | [`workflows/08-scheduled-workflows.md`](examples/workflows/08-scheduled-workflows.md) | Deferred | VPS cron enrichment — not Vercel |
| **22** | [`browser/02-agent-browser.md`](examples/browser/02-agent-browser.md) | Deferred | Agent drives browser — Lucía Phase 2 |
| **22** | [`workspace/05-skills.md`](examples/workspace/05-skills.md) | Deferred | VPS agent playbooks — OpenClaw |
| **20** | [`rag/05-graph-rag.md`](examples/rag/05-graph-rag.md) | Deferred | Graph policy — overkill for Phase 1 |
| **20** | [`browser/03-browser-viewer.md`](examples/browser/03-browser-viewer.md) | Deferred | Debug browser sessions in Studio |
| **18** | [`examples/07-whatsapp-chat-bot.md`](examples/07-whatsapp-chat-bot.md) | Deferred | Colombia channel — Phase 2+ |
| **18** | [`workspace/01-overview.md`](examples/workspace/01-overview.md) | Deferred | VPS workspace — not `mdeapp` deploy |
| **16** | [`workspace/03-sandbox.md`](examples/workspace/03-sandbox.md) | Deferred | Isolated code run on VPS |
| **15** | [`features/05-workspace.md`](examples/features/05-workspace.md) | Deferred | Pointer only — enrichment not chat |
| **12** | [`examples/06-ai-sdk-v5-integration.md`](examples/06-ai-sdk-v5-integration.md) | Deferred | CopilotKit v2 — Phase 2 only |
| **10** | [`features/03-acp.md`](examples/features/03-acp.md) | Deferred | Dev codemods — zero Camila impact |
| **8** | [`features/02-a2a.md`](examples/features/02-a2a.md) | Deferred | External partner agents |
| **8** | [`features/04-signals.md`](examples/features/04-signals.md) | Deferred | Stripe/WhatsApp inject — alpha |
| **5** | [`domains/04-contests-deferred.md`](examples/domains/04-contests-deferred.md) | Deferred | Contests post-MVP |
| **5** | [`02-best-old.md`](02-best-old.md) | Deferred | Superseded — do not implement |
| **98** | [`github/01-copilotkit-mastra-integration.md`](github/01-copilotkit-mastra-integration.md) | Core | Vendored CK+Mastra — prod clone target |
| **85** | [`github/06-template-text-to-sql.md`](github/06-template-text-to-sql.md) | Core | Typed search tools — not NL2SQL on prod |
| **82** | [`github/14-mastra-system-check.md`](github/14-mastra-system-check.md) | Priority | 66-rule PR audit skill + mdeai overlay |
| **78** | [`github/02-ui-dojo.md`](github/02-ui-dojo.md) | Priority | UI framework compare — CK page only |
| **72** | [`github/04-assistant-ui-mastra-hitl.md`](github/04-assistant-ui-mastra-hitl.md) | Priority | HITL UX → Roberto CK publish |
| **68** | [`github/09-template-docs-chatbot.md`](github/09-template-docs-chatbot.md) | Advanced | MCP docs server — J11 |
| **58** | [`github/05-apify-mcp-agent.md`](github/05-apify-mcp-agent.md) | Advanced | Airbnb/FB scrape — VPS only |
| **55** | [`github/13-bunsdev-mastra-starter.md`](github/13-bunsdev-mastra-starter.md) | Priority | Onboarding folder layout |
| **52** | [`github/03-personal-assistant-mcp.md`](github/03-personal-assistant-mcp.md) | Advanced | Multi-MCP ops patterns |
| **48** | [`github/07-tanstack-travel-assistant.md`](github/07-tanstack-travel-assistant.md) | Advanced | Network/stream ideas — not TanStack prod |
| **45** | [`github/10-mastra-meeting-assistant.md`](github/10-mastra-meeting-assistant.md) | Deferred | Internal meetings |
| **38** | [`github/08-retrip-product-reference.md`](github/08-retrip-product-reference.md) | Advanced | Quote workspace UX — Roberto inspiration |
| **38** | [`github/15-agentstack.md`](github/15-agentstack.md) | Deferred | **Do not import** — patterns only |
| **32** | [`github/12-mastra-claw-workshop.md`](github/12-mastra-claw-workshop.md) | Deferred | OpenClaw VPS |
| **28** | [`github/11-template-browsing-agent.md`](github/11-template-browsing-agent.md) | Deferred | Use Places not Browserbase |

**Meta indexes** (`examples/*/00-index.md`, [`github/index-github.md`](github/index-github.md), this file): navigation only — inherit scores from children.

---

## Implementation order (top 25)

Ship in this order unless a task file explicitly blocks you.

| Seq | Score | Tier | Topic | Benefit | Doc | Status |
|-----|------:|------|-------|---------|-----|--------|
| 1 | 98 | Core | CopilotKit runtime + Pattern 1 | All personas reach agents | [`03-best-practices.md`](03-best-practices.md) | ✅ |
| 2 | 98 | Core | Agents register + `pingAgent` | J1 smoke | [`01-calling-agents`](examples/01-calling-agents.md) | ✅ |
| 3 | 95 | Core | Tools `search-rentals` / `search-events` | Grounded cards | [`domains/01`](examples/domains/01-real-estate-rentals.md) | ✅ |
| 4 | 93 | Core | Workflows control-flow + agents-in-steps | Rental pipeline | [`wf/01`](examples/workflows/01-control-flow.md), [`wf/02`](examples/workflows/02-agents-and-tools.md) | ✅ |
| 5 | 96 | Core | Working memory Zod schema | Cross-turn state | [`09-WM-schema`](examples/09-working-memory-schema.md) | ✅ |
| 6 | 93 | Core | AG-UI streaming / tool events | Cards in sidebar | [`streaming/02-events`](examples/streaming/02-events.md) | 🔨 |
| 7 | 91 | Core | CopilotKit tool rendering + cards | Camila sees UI | [`04-user-stories`](04-user-stories.md) § CK | 📋 |
| 8 | 95 | Priority | `rentalAgent` + workflow | `/rentals` MVP | [`domains/01`](examples/domains/01-real-estate-rentals.md) | ✅ |
| 9 | 90 | Priority | `hostEventAgent` + HITL | Roberto publish | [`wf/05-HITL`](examples/workflows/05-human-in-the-loop.md), [`domains/02`](examples/domains/02-events-hosting.md) | 📋 |
| 10 | 82 | Priority | System prompts | Fewer wrong tools | [`02-system-prompt`](examples/02-system-prompt.md) | 🔨 |
| 11 | 74 | Priority | `conciergeAgent` + 4 tools | Tourist `/chat` | [`domains/03`](examples/domains/03-restaurants-tourist.md) | 🔨 |
| 12 | 72 | Priority | `routerAgent` + routing WF | Intent stickiness | [`03-supervisor`](examples/03-supervisor-agent.md) | 🔨 |
| 13 | 78 | Priority | Message history + threads | Multi-turn chat | [`features/07`](examples/features/07-message-history.md) | 🔨 |
| 14 | 80 | Priority | Postgres storage F13 | Survive redeploy | [`features/08`](examples/features/08-storage.md) | 🔨 |
| 15 | 76 | Priority | Maps + Grounding MCP | Real venues | [`domains/05`](examples/domains/05-google-maps.md), [`mcp/01`](examples/mcp/01-overview.md) | 📋 |
| 16 | 68 | Priority | Workflow errors + `ai_runs` | Patricia debug | [`wf/07`](examples/workflows/07-error-handling.md) | 🔨 |
| 17 | 72 | Priority | Vitest + `runEvals` | PR quality gate | [`evals/04`](examples/evals/04-running-in-ci.md) | 📋 |
| 18 | 70 | Priority | Playwright J8 | No broken `/api/copilotkit` | [`04-user-stories`](04-user-stories.md) § J8 | 📋 |
| 19 | 70 | Priority | `evaluationAgent` rerank | Better card order | [`evals/02`](examples/evals/02-built-in-scorers.md) | ✅ |
| 20 | 62 | Advanced | Runtime context | Tier / hostId | [`05-runtime-context`](examples/05-runtime-context.md) | 📋 |
| 21 | 57 | Advanced | Snapshots + suspend | Server HITL resume | [`wf/03`](examples/workflows/03-snapshots.md), [`wf/04`](examples/workflows/04-suspend-and-resume.md) | 📋 |
| 22 | 52 | Advanced | Host policy RAG | Roberto policy Q&A | [`rag/`](examples/rag/00-index.md) | 📋 |
| 23 | 53 | Advanced | Semantic recall + OM | Long chat memory | [`features/09`](examples/features/09-semantic-recall.md), [`11`](examples/features/11-observational-memory.md) | ⏸ |
| 24 | 52 | Advanced | Background tasks | Fast sidebar | [`features/01`](examples/features/01-background-tasks.md) | ⏸ |
| 25 | 55 | Advanced | Datasets + experiments | Prompt A/B | [`evals/06`](examples/evals/06-datasets-overview.md) | 📋 |

**GitHub learnings (parallel track):**

| Seq | Score | Topic | Doc |
|-----|------:|-------|-----|
| G0 | 98 | Vendored CopilotKit × Mastra | [`github/01-copilotkit-mastra`](github/01-copilotkit-mastra-integration.md) |
| G1 | 82 | mastra-system-check on PRs | [`github/14-mastra-system-check`](github/14-mastra-system-check.md) |
| G2 | 85 | text-to-sql discipline | [`github/06-text-to-sql`](github/06-template-text-to-sql.md) |
| G3 | 72 | HITL reference | [`github/04-assistant-ui-mastra-hitl`](github/04-assistant-ui-mastra-hitl.md) |
| G4 | 78 | ui-dojo CK compare | [`github/02-ui-dojo`](github/02-ui-dojo.md) |

Full GitHub order: [`github/index-github.md`](github/index-github.md) § Implementation order.

**After seq 25:** workspace/VPS, browser, editor, A2A, WhatsApp, contests, AgentStack — see **Deferred** tables below.

---

## Tier summary (folder × grade)

| Tier | Count (docs) | When | Personas |
|------|----------------|------|----------|
| **Core** | ~15 topics | W1–W5 MVP | Sofía, Camila, Roberto |
| **Priority** | ~20 topics | W3–W7 + F09/F13 | Camila, Tourist, Lucía |
| **Advanced** | ~25 topics | Phase 2 | Roberto RAG, Patricia |
| **Deferred** | ~15 topics | Phase 3+ / VPS only | WhatsApp, contests, A2A |

---

## Core docs (root — read first)

| File | Tier | Grade | Role | Seq |
|------|------|-------|------|-----|
| [`index-mastra.md`](index-mastra.md) | Core | A | **This hub** — priority & order | 0 |
| [`03-best-practices.md`](03-best-practices.md) | Core | A | Implementation law | 1 |
| [`04-user-stories.md`](04-user-stories.md) | Core | A | Journeys J1–J12 catalog (link out, don’t duplicate) | 2 |
| [`01-studio.md`](01-studio.md) | Priority | D | Sofía debug `:4111` | 90 |
| [`02-best-old.md`](02-best-old.md) | Deferred | F | Archive — use `03-best-practices` | — |

---

## `examples/` — agent & memory (root of examples/)

| Score | Doc | Tier | Benefit | Status |
|------:|-----|------|---------|--------|
| 98 | [01-calling-agents](examples/01-calling-agents.md) | Core | Agent registry for CopilotKit | ✅ |
| 96 | [09-working-memory-schema](examples/09-working-memory-schema.md) | Core | Zod WM ↔ `types.ts` | ✅ |
| 82 | [02-system-prompt](examples/02-system-prompt.md) | Priority | Per-persona instructions | 🔨 |
| 72 | [03-supervisor-agent](examples/03-supervisor-agent.md) | Priority | Router / classify dispatch | 🔨 |
| 62 | [05-runtime-context](examples/05-runtime-context.md) | Advanced | `hostId`, tier on runtime | 📋 |
| 48 | [04-image-analysis](examples/04-image-analysis.md) | Advanced | Flyer → event fields | 📋 |
| 28 | [08-working-memory-template](examples/08-working-memory-template.md) | Advanced | Freeform WM optional | ⏸ |
| 12 | [06-ai-sdk-v5-integration](examples/06-ai-sdk-v5-integration.md) | Deferred | CK v2 migration | ⏸ |
| 18 | [07-whatsapp-chat-bot](examples/07-whatsapp-chat-bot.md) | Deferred | WA channel Colombia | ⏸ |

**Index:** [`examples/00-index.md`](examples/00-index.md)

---

## `examples/features/` — platform capabilities

| Score | Doc | Tier | Benefit | Status |
|------:|-----|------|---------|--------|
| 80 | [08-storage](examples/features/08-storage.md) | Priority | F13 Postgres persistence | 🔨 |
| 78 | [07-message-history](examples/features/07-message-history.md) | Priority | Thread turns on `/chat` | 🔨 |
| 55 | [11-observational-memory](examples/features/11-observational-memory.md) | Advanced | Long-thread facts | ⏸ |
| 52 | [01-background-tasks](examples/features/01-background-tasks.md) | Advanced | Non-blocking search | ⏸ |
| 50 | [09-semantic-recall](examples/features/09-semantic-recall.md) | Advanced | Embedding recall ≠ SQL | ⏸ |
| 48 | [06-memory-processors](examples/features/06-memory-processors.md) | Advanced | Shrink tool noise | 📋 |
| 42 | [10-multi-user-threads](examples/features/10-multi-user-threads.md) | Advanced | Co-host events | ⏸ |
| 15 | [05-workspace](examples/features/05-workspace.md) | Deferred | VPS only pointer | ⏸ |
| 8 | [02-a2a](examples/features/02-a2a.md) | Deferred | External agents | ⏸ |
| 10 | [03-acp](examples/features/03-acp.md) | Deferred | Dev tooling | ⏸ |
| 8 | [04-signals](examples/features/04-signals.md) | Deferred | Webhook → thread | ⏸ |

**Backlog:** `12-request-context.md` · `13-agent-processors.md`  
**Index:** [`examples/features/00-index.md`](examples/features/00-index.md)

---

## `examples/workflows/`

| Score | Doc | Tier | Benefit | Status |
|------:|-----|------|---------|--------|
| 94 | [01-control-flow](examples/workflows/01-control-flow.md) | Core | `.then()` rental pipeline | ✅ |
| 92 | [02-agents-and-tools](examples/workflows/02-agents-and-tools.md) | Core | Steps call shared tools | ✅ |
| 90 | [05-human-in-the-loop](examples/workflows/05-human-in-the-loop.md) | Core | Roberto publish approve | CK ✅ |
| 68 | [07-error-handling](examples/workflows/07-error-handling.md) | Priority | Failed step → `ai_runs` | 🔨 |
| 58 | [03-snapshots](examples/workflows/03-snapshots.md) | Advanced | Crash-safe publish | 📋 |
| 56 | [04-suspend-and-resume](examples/workflows/04-suspend-and-resume.md) | Advanced | Server resume | 📋 |
| 32 | [06-time-travel](examples/workflows/06-time-travel.md) | Advanced | Debug replay | 📋 |
| 25 | [08-scheduled-workflows](examples/workflows/08-scheduled-workflows.md) | Deferred | VPS cron | ⏸ |

**Index:** [`examples/workflows/00-index.md`](examples/workflows/00-index.md)

---

## `examples/domains/` — vertical playbooks (revenue)

| Score | Doc | Tier | Benefit | Persona |
|------:|-----|------|---------|---------|
| 95 | [01-real-estate-rentals](examples/domains/01-real-estate-rentals.md) | Core | Commission rentals | Camila |
| 88 | [02-events-hosting](examples/domains/02-events-hosting.md) | Priority | Ticket revenue | Roberto |
| 74 | [03-restaurants-tourist](examples/domains/03-restaurants-tourist.md) | Priority | Discovery chat | Tourist |
| 76 | [05-google-maps](examples/domains/05-google-maps.md) | Priority | Pins + grounding | Camila, Tourist |
| 5 | [04-contests-deferred](examples/domains/04-contests-deferred.md) | Deferred | Post-MVP | — |

**Backlog:** `06-tickets-stripe` · `08-admin-patricia` · `09-search-quality`  
**Index:** [`examples/domains/00-index.md`](examples/domains/00-index.md)

---

## `examples/streaming/` · `mcp/` · `evals/` (per-file scores)

| Score | Doc | Benefit |
|------:|-----|---------|
| 93 | [streaming/02-events](examples/streaming/02-events.md) | `tool-call` → CopilotKit cards |
| 70 | [streaming/01-overview](examples/streaming/01-overview.md) | Stream debugging model |
| 45 | [streaming/03-workflow-streaming](examples/streaming/03-workflow-streaming.md) | Studio step visibility |
| 35 | [streaming/04-background-task-streaming](examples/streaming/04-background-task-streaming.md) | Progress on slow jobs |
| 76 | [mcp/01-overview](examples/mcp/01-overview.md) | Grounding MCP tools |
| 62 | [mcp/02-mcp-apps](examples/mcp/02-mcp-apps.md) | Map UI in chat |
| 72 | [evals/04-running-in-ci](examples/evals/04-running-in-ci.md) | Vitest `runEvals` gate |
| 70 | [evals/02-built-in-scorers](examples/evals/02-built-in-scorers.md) | Tool-call accuracy |
| 65 | [evals/01-overview](examples/evals/01-overview.md) | Scorer strategy |
| 58 | [evals/03-custom-scorers](examples/evals/03-custom-scorers.md) | Card schema scorer |
| 55 | [evals/06-datasets-overview](examples/evals/06-datasets-overview.md) | Golden query sets |
| 50 | [evals/07-running-experiments](examples/evals/07-running-experiments.md) | Prompt A/B batch |
| 48 | [evals/05-evals-with-memory](examples/evals/05-evals-with-memory.md) | Multi-turn CI memory |

---

## `examples/rag/` · `workspace/` · `browser/` · `editor/` (per-file scores)

| Score | Doc | Benefit |
|------:|-----|---------|
| 54 | [rag/04-retrieval](examples/rag/04-retrieval.md) | Policy answers with citations |
| 52 | [rag/01-overview](examples/rag/01-overview.md) | Host KB architecture |
| 50 | [rag/03-vector-databases](examples/rag/03-vector-databases.md) | PgVector on Supabase |
| 48 | [rag/02-chunking](examples/rag/02-chunking-and-embedding.md) | PDF → chunks |
| 20 | [rag/05-graph-rag](examples/rag/05-graph-rag.md) | Deferred complexity |
| 18 | [workspace/01-overview](examples/workspace/01-overview.md) | VPS enrichment only |
| 16 | [workspace/02-filesystem](examples/workspace/02-filesystem.md) | Agent file access VPS |
| 20 | [workspace/03-sandbox](examples/workspace/03-sandbox.md) | Safe code exec VPS |
| 12 | [workspace/04-lsp](examples/workspace/04-lsp.md) | Code intelligence VPS |
| 22 | [workspace/05-skills](examples/workspace/05-skills.md) | Disk playbooks VPS |
| 18 | [workspace/06-search](examples/workspace/06-search.md) | Repo search VPS |
| 25 | [browser/01-overview](examples/browser/01-overview.md) | Not Places hot path |
| 22 | [browser/02-agent-browser](examples/browser/02-agent-browser.md) | Headless agent |
| 20 | [browser/03-browser-viewer](examples/browser/03-browser-viewer.md) | Studio browser debug |
| 28 | [editor/01-tools](examples/editor/01-tools.md) | Studio tool editor |
| 26 | [editor/02-prompts](examples/editor/02-prompts.md) | Studio prompt versions |

---

## Journey quick map

| ID | Score | Persona | Surface | Benefit |
|----|------:|---------|---------|---------|
| J1 | 98 | Sofía | `/` | Prove stack boots |
| J2 | 95 | Camila | `/rentals` | Search → cards → commission |
| J4 | 74 | Tourist | `/chat` | Restaurants + events in one chat |
| J5 | 90 | Roberto | `/host/event/new` | Create event + safe publish |
| J6 | 72 | Sofía | router | Right workflow per intent |
| J8 | 70 | Lucía | E2E | No merge broken runtime |
| J9 | 76 | Tourist | `/chat` | Grounded map places |
| J10 | 79 | Camila | memory | Threads survive redeploy |
| J11 | 54 | Roberto | host RAG | Policy from uploaded docs |
| J12 | 71 | Lucía, Sofía | CI | Scorers block tool regressions |

Full acceptance: [`04-user-stories.md`](04-user-stories.md)

---

## How to organize this folder better

### What works today (keep)

```text
tasks/mastra/
  index-mastra.md          ← master hub (this file)
  03-best-practices.md     ← law
  04-user-stories.md       ← journeys only (link to splits)
  01-studio.md
  github/                ← external repos (scored playbooks)
  examples/              ← Mastra docs + mdeai verticals
```

**Rules:** `examples/01–09` = Mastra **agent** examples · `examples/*/` = Mastra **product** docs · `github/` = **third-party** repos (never blind copy).

### Recommended changes (low churn)

| Action | Why |
|--------|-----|
| **Use this file as the only priority source** | Sub-indexes stay topical; grades live here to avoid drift. |
| **Move `02-best-old.md` → `_archive/02-best-old.md`** | One less “which best practices?” confusion |
| **Add one line at top of `04-user-stories.md`** | “Priority order → [`index-mastra.md`](index-mastra.md)” |
| **Prefix backlog files with `99-`** | e.g. `domains/99-contests-deferred.md` sorts after live domains |

### Optional refactor (higher churn — do when bored)

| Action | Result |
|--------|--------|
| Rename `examples/01–09` → `examples/agents/01–09` | Clear split: agent examples vs platform docs |
| Add `tasks/mastra/README.md` symlink → `index-mastra.md` | GitHub default landing |
| Merge tiny pointers (`features/05-workspace.md`) into parent `00-index` only | Fewer one-line files |

### Do not do

- Duplicate full user-story tables in every subdoc (already in `04-user-stories.md`).
- Implement **workspace**, **browser**, or **RAG** before **seq 1–19** unless a task file says otherwise.
- Point prod Camila traffic at `:4111` Mastra server routes.

---

## `github/` — external repos (full index)

**Hub:** [`github/index-github.md`](github/index-github.md) — traffic lights, domain matrix, Apify/Airbnb notes, do-not-copy list.

| Dot | Score | Repository | Playbook | mdeai benefit |
|-----|------:|------------|----------|---------------|
| 🟢 | 98 | [CopilotKit/CopilotKit — mastra example](https://github.com/CopilotKit/CopilotKit) (vendored) | [01-copilotkit-mastra](github/01-copilotkit-mastra-integration.md) | **Ship target** — Pattern 1 |
| 🟢 | 85 | [mastra-ai/template-text-to-sql](https://github.com/mastra-ai/template-text-to-sql) | [06-text-to-sql](github/06-template-text-to-sql.md) | `search-rentals` tool discipline |
| 🟢 | 82 | [goldk3y/mastra-system-check](https://github.com/goldk3y/mastra-system-check) | [14-mastra-system-check](github/14-mastra-system-check.md) | PR audit — 66 rules |
| 🟡 | 78 | [mastra-ai/ui-dojo](https://github.com/mastra-ai/ui-dojo) | [02-ui-dojo](github/02-ui-dojo.md) | [ui-dojo.mastra.ai](https://ui-dojo.mastra.ai/) CK compare |
| 🟡 | 72 | [assistant-ui/mastra-hitl](https://github.com/assistant-ui/mastra-hitl) | [04-mastra-hitl](github/04-assistant-ui-mastra-hitl.md) | Roberto approve-to-publish UX |
| 🟡 | 68 | [mastra-ai/template-docs-chatbot](https://github.com/mastra-ai/template-docs-chatbot) | [09-docs-chatbot](github/09-docs-chatbot.md) | Host policy MCP (J11) |
| 🟡 | 58 | [apify/actor-mastra-mcp-agent](https://github.com/apify/actor-mastra-mcp-agent) | [05-apify-mcp](github/05-apify-mcp-agent.md) | VPS enrichment — Airbnb/FB groups |
| 🟡 | 55 | [BunsDev/mastra-starter](https://github.com/BunsDev/mastra-starter) | [13-mastra-starter](github/13-bunsdev-mastra-starter.md) | Contributor onboarding |
| 🟡 | 52 | [mastra-ai/personal-assistant-example](https://github.com/mastra-ai/personal-assistant-example) | [03-personal-assistant](github/03-personal-assistant-mcp.md) | Multi-MCP orchestration |
| 🟡 | 48 | [ataschz/tanstack-start-mastra-example](https://github.com/ataschz/tanstack-start-mastra-example) | [07-tanstack-travel](github/07-tanstack-travel-assistant.md) | Router/stream ideas |
| 🟡 | 45 | [dgalarza/mastra-meeting-assistant](https://github.com/dgalarza/mastra-meeting-assistant) | [10-meeting-assistant](github/10-mastra-meeting-assistant.md) | Ops calendar — defer |
| 🟡 | 38 | [Retrip](https://retrip.ai/) (product) | [08-retrip](github/08-retrip-product-reference.md) | Host quote workspace UX |
| 🟡 | 38 | [ssdeanx/AgentStack](https://github.com/ssdeanx/AgentStack) | [15-agentstack](github/15-agentstack.md) | **Not components** — read only |
| 🔴 | 32 | [smthomas/mastra-claw-workshop](https://github.com/smthomas/mastra-claw-workshop) | [12-claw-workshop](github/12-claw-workshop.md) | OpenClaw VPS |
| 🔴 | 28 | [mastra-ai/template-browsing-agent](https://github.com/mastra-ai/template-browsing-agent) | [11-browsing-agent](github/11-browsing-agent.md) | Skip — use Grounding/Places |
| 🔴 | 15 | Backlog (canvas, EventFlow, …) | [99-github-backlog](github/99-github-backlog.md) | Phase 3+ |

**Also in `04-user-stories`:** CopilotKit canvas examples · UI Dojo · real-world table — links to `github/` playbooks.

---

## Sub-index registry (`tasks/mastra/`)

| Path | Scope |
|------|--------|
| [`github/index-github.md`](github/index-github.md) | External GitHub repos — learn/adapt/skip |
| [`examples/00-index.md`](examples/00-index.md) | Agent + memory examples |
| [`examples/features/00-index.md`](examples/features/00-index.md) | Memory, storage, A2A, signals |
| [`examples/workflows/00-index.md`](examples/workflows/00-index.md) | Workflow patterns |
| [`examples/domains/00-index.md`](examples/domains/00-index.md) | Rentals, events, maps, tourist |
| [`examples/streaming/00-index.md`](examples/streaming/00-index.md) | AG-UI stream alignment |
| [`examples/mcp/00-index.md`](examples/mcp/00-index.md) | MCP client + apps |
| [`examples/evals/00-index.md`](examples/evals/00-index.md) | Scorers, CI, datasets |
| [`examples/rag/00-index.md`](examples/rag/00-index.md) | Host policy vectors |
| [`examples/workspace/00-index.md`](examples/workspace/00-index.md) | VPS sandbox |
| [`examples/browser/00-index.md`](examples/browser/00-index.md) | Phase 2 automation |
| [`examples/editor/00-index.md`](examples/editor/00-index.md) | Studio editor |

---

## Repo anchors (implementation)

| Need | Path |
|------|------|
| **Planning hub** | `plan/mastra/index-mastra.md` |
| **Execution tasks** | `tasks/mastra/INDEX.md` |
| **GitHub playbooks** | `plan/mastra/github/` |
| **Feature playbooks** | `plan/mastra/examples/` |
| Mastra instance | `mdeapp/src/mastra/index.ts` |
| Agents | `mdeapp/src/mastra/agents/` |
| Workflows | `mdeapp/src/mastra/workflows/` |
| Tools | `mdeapp/src/mastra/tools/` |
| CopilotKit runtime | `mdeapp/src/app/api/copilotkit/route.ts` |
| CK + Mastra reference (🟢 98) | `CopilotKit/examples/integrations/mastra/` |
| Maps tasks | [`tasks/maps/notes.md`](../maps/notes.md) |
| PRD / tasks backlog | [`tasks/INDEX.md`](../INDEX.md) · [`plan/prd.md`](../../plan/prd.md) |
