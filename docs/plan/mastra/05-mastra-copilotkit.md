---
title: CopilotKit + Mastra — production feature map & gap analysis
date: 2026-05-22
updated: 2026-05-22
status: Canonical planning supplement
copilotkit: 1.55.2
pattern: Pattern 1 in-process (AG-UI)
phase: Phase 1 English · v1 hooks only · no CK v2
related:
  - 03-best-practices.md
  - mastra-roadmap.md
  - prd-mastra.md
  - ../../tasks/mastra/INDEX.md
  - ../../tasks/copilotkit/INDEX.md
official_docs:
  - https://mastra.ai/guides/build-your-ui/copilotkit
  - https://docs.copilotkit.ai/mastra/
  - https://docs.copilotkit.ai/mastra/ag-ui
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write
  - https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow
  - https://docs.copilotkit.ai/mastra/inspector
  - https://docs.ag-ui.com/concepts/state
coverage_estimate: 68-72% of full CK+Mastra production surface planned for Phase 1
forensic_accuracy: 85/100
---

# CopilotKit + Mastra — what we planned vs what production needs

> **One sentence:** CopilotKit + Mastra is **not** “chat UI only” — but Phase 1 also does **not** require a full collaborative enterprise state system on day 1. MVP needs **typed shared state, AG-UI streaming integrity, frontend tools, HITL, and pin↔card contracts**. MASTRA-001…005 cover **orchestration wiring**; the remaining CK surface lives in **MAP-***, **F33–F46**, and [`tasks/copilotkit/BACKLOG-ck-gaps.md`](../../tasks/copilotkit/BACKLOG-ck-gaps.md).

**Read with:** [`03-best-practices.md`](03-best-practices.md) · [`tasks/mastra/audit/03-top-summary.md`](../../tasks/mastra/audit/03-top-summary.md)

---

## Forensic verdict (2026-05-22, corrected)

| Area | Score | Notes |
|------|------:|-------|
| Architecture direction | **92** | Pattern 1, router-first, maps geo-only — validated |
| MVP sequencing | **95** | MAP-001 → router → deterministic flows — validated |
| CopilotKit production understanding | **82** | Gap is executable specs + E2E, not wrong stack |
| Mastra production understanding | **85** | Workflows/tools planned; storage correctly deferred |
| Task completeness | **72** | CK-001…007 backlog closes biggest executable holes |
| Production readiness realism | **88** | Foundation correct; `/chat` + tests still missing |
| **Overall forensic accuracy** | **85/100** | Directionally correct; prior pass overstated urgency of advanced shared state |
| **Platform implementation** | **52–58/100** | `/chat` absent; not prod-ready |

### Strongest rule (verified across PRD, MVP, roadmap)

```text
MAP shell first → router second → deterministic rental/ticket flows → memory/evals later
```

**Do not build PostgresStore before `/chat` + `routerAgent` are proven.**

### What the corrected audit changed

| Prior claim | Correction |
|-------------|------------|
| “Full collaborative shared state is MVP-critical” | **Partially wrong** — see § MVP shared state vs Phase 2 below |
| “12 feature groups completely missing” | **Misleading** — ~5 missing specs, ~5 partially planned, ~2 intentionally deferred |
| “Architecture too incomplete” | **Overstated** — runtime, example repo, orchestration strategy, and sequencing are already correct |
| Biggest gaps | **Executable specs, E2E, AG-UI validation, typed state contracts** — not more agents or workflows |

---

## Three vendored examples — same runtime, different UI focus

All three use **CopilotKit chat + Mastra + AG-UI Pattern 1** (`POST /api/copilotkit` → `MastraAgent.getLocalAgents({ mastra })`). **Copy patterns from canvas examples; do not copy their package versions.**

| Example | CK pin | Role for mdeapp | Task refs |
|---------|--------|-----------------|-----------|
| [`integrations/mastra`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | **1.55.2** | **Runtime canon** — sidebar + `useCoAgent` | F01 ✅ F02 |
| [`canvas/mastra`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra) | ~1.10 ⚠️ | Zod state, cards, HITL, planning tools | MAP-001 · F50 · EVP-008 |
| [`canvas/mastra-pm`](https://github.com/CopilotKit/CopilotKit/tree/main/examples/canvas/mastra-pm) | ~1.10 ⚠️ | Multi-field draft / wizard state | EVP-008–010 |

**Official docs truth:** The hardest production work is **state sync, UI rendering, AG-UI streaming, tool rendering, workflow interruption, and frontend/backend consistency** — not registering another agent.

---

## Core architecture (official + mdeai)

| Layer | Owns | mdeai Pattern 1 |
|-------|------|-----------------|
| **Supabase** | Data, RLS, edges, tickets | SQL tools, `ai_runs`, `mastra_messages` |
| **Mastra** | Orchestration, workflows, tools | `routerAgent` → workflows |
| **CopilotKit** | UI, SSE, shared state, HITL render | `useCoAgent`, `useCopilotAction`, sidebar |
| **Maps** | Geo display only | MapContext ← tool output, not LLM coords |

**Official:** [Mastra × CopilotKit guide](https://mastra.ai/guides/build-your-ui/copilotkit) · [CK Mastra index](https://docs.copilotkit.ai/mastra/) · [AG-UI state](https://docs.ag-ui.com/concepts/state)

---

## MVP shared state vs Phase 2+ (critical correction)

### MUST-HAVE for Phase 1 MVP

| Need | Why | Where planned |
|------|-----|---------------|
| Typed map/chat UI state | Pins, cards, agent context | CK-002 · MAP-001 contracts |
| Pin↔card synchronization | Camila rental UX | CK-002 · CK-005 Playwright |
| Frontend → agent writes | User edits draft / map focus | F33–F36 · CK-003 |
| Agent → frontend reads | Cards, progress, map highlights | F46 · MAP-007 |
| Minimal working memory | Roberto draft, rental thread context | F34 · agent Zod schemas |

### NOT MVP-critical (Phase 2+ — document only)

| Deferred | Reason |
|----------|--------|
| Collaborative multi-user state | No multi-editor MVP persona |
| CRDT-style sync / optimistic reconciliation | Over-engineering for W1–W6 |
| Realtime thread replay | Needs MASTRA-003 + CK-008 |
| Multi-tab live synchronization | Post-MVP |
| Advanced resumable workflows beyond Roberto HITL | F37/F38 covers publish gate only |
| Distributed / enterprise state | Phase 2+ |

---

## What MASTRA-001…005 cover (~35% of CK surface)

| ID | Covers | Does not cover |
|----|--------|----------------|
| MASTRA-001 | Router/workflow Vitest, tool mocks | SSE lifecycle, Playwright |
| MASTRA-002 | Nested `routerAgent` on `/chat` | Full pin↔card sync E2E |
| MASTRA-003 | PostgresStore, threads persistence | — (post-MVP) |
| MASTRA-004 | `ai_runs.user_id`, tool audit | AG-UI event logging |
| MASTRA-005 | `check:mastra` agent-name gate | Inspector, MCP UI |

**Note:** `npm run verify:mastra` is **not** in `package.json` today — MASTRA-005 proposes `check:mastra`. `npm run floor` **is** the current gate.

---

## Coverage map — 12 feature groups (reclassified)

**Answer:** Current tasks cover **~68–72%** of full CopilotKit+Mastra production architecture for Phase 1. Strategy is **substantially correct**; gaps are mostly **missing executable specs and E2E proof**, not wrong architecture.

| Status | Count | Meaning |
|--------|------:|---------|
| **Completely missing** (need new CK specs) | ~5 | SSE smoke, MapUiState contract, Playwright sync, streaming validator, Inspector hook |
| **Partially planned** | ~5 | HITL, frontend tools, tool rendering, observability, canvas patterns |
| **Intentionally deferred** | ~2 | Threads/durable replay, MCP generative UI |

| # | Feature group | Status | Phase 1 coverage | Where it lives / gap |
|---|---------------|--------|------------------|----------------------|
| 1 | **AG-UI events / SSE** | 🔴 Missing spec | Partial impl | **CK-001** · **CK-007** |
| 2 | **Shared state / working memory** | 🟡 Partial | MVP slice only | MAP-001 · F34 · **CK-002** · `canvas/mastra`, `canvas/mastra-pm` |
| 3 | **Threads / resume** | ⏸ Deferred | Correct deferral | MASTRA-003 · **CK-008** post-MVP |
| 4 | **HITL interrupt / resume** | 🟡 Partial | Planned | EVP-011/012 · **CK-004** · `showcases/banking` |
| 5 | **Inspector / debug** | 🔴 Missing spec | Dev-only | **CK-006** · Sofía W1 |
| 6 | **Frontend tools** | 🟡 Partial | Planned | **CK-003** · MAP-007 · F46 |
| 7 | **Programmatic control** | ⏸ Deferred | Phase 2+ | Patricia/admin |
| 8 | **MCP generative UI** | ⏸ Deferred | Phase 2+ | Places + MAP-002 first |
| 9 | **canvas/mastra-pm patterns** | 🟡 Partial | Planned | EVP-008–010 |
| 10 | **canvas/mastra patterns** | 🟡 Partial | Planned | F50 → MAP-001/007 |
| 11 | **Runtime observability** | 🟡 Partial | Planned | F13 · MASTRA-004 · F20 |
| 12 | **Streaming / tool lifecycle** | 🔴 Missing spec | Partial | F24/F46 · **CK-007** |

---

## Hidden risks (verified)

### 1. Fake-ready drift — #1 systemic risk

Docs and tasks may say “integrated” while UI still uses `pingAgent` on `/`. **Mitigation:** task-verifier + anti-fake-done gate 9 + [`prd-mastra.md`](prd-mastra.md) §2.5 fake-ready table.

### 2. CopilotKit shared-state desync

Known class: [CopilotKit #3426](https://github.com/CopilotKit/CopilotKit/issues/3426) (Mastra integration context propagation).

**Symptom:** Tool completes; map pins or cards never update.

**Mitigation:** **CK-002** typed contract + **CK-005** Playwright (not only MASTRA-002 grep).

### 3. SSE / AG-UI phase integrity

Chat-central architecture depends on SSE phases (`handoff` → tool → render → done). **Not fully covered by MASTRA-001 Vitest alone.**

**Mitigation:** **CK-001** (manual/Inspector smoke) + **CK-007** (lifecycle validator).

### 4. MASTRA-003 strategic weight

Correctly **deferred from MVP demo**, but **strategically ~81/100** — durable threads, HITL resume across redeploys, evals, and Patricia dashboards assume PostgresStore. **Prod cutover blocked until MASTRA-003 + cold-start test.**

---

## Corrected execution order (full platform)

| Order | Work | Task IDs | Persona |
|------:|------|----------|---------|
| 1 | Map + `/chat` shell + contracts | **MAP-001** | Camila, Tourist |
| 2 | Router/workflow CI smoke | **MASTRA-001** | Sofía |
| 3 | `routerAgent` on `/chat` | **MASTRA-002** | Camila |
| 4 | Grounding + attribution | **MAP-002** | Tourist |
| 5 | Rental WF + cards + pins E2E | **F46** + **CK-002/CK-005** | Camila |
| 6 | Roberto wizard + HITL | **F33–F38** + **CK-004** | Roberto |
| 7 | Ticket checkout + webhook | **EVT-01**, F11 | Andrés |
| 8 | `user_id` + audit | **MASTRA-004** | Patricia |
| 9 | PR gate | **MASTRA-005** | Sofía |
| 10 | AG-UI dev validation | **CK-001, CK-006, CK-007** | Sofía, Lucía |
| 11 | PostgresStore + threads | **MASTRA-003** + **CK-008** | Camila |
| 12 | Evals / admin | **F20**, W8+ | Patricia, Lucía |
| 13 | OpenClaw / Hermes / MCP UI | **advanced.md** | — |

**Parallel allowed:** MASTRA-001 + MAP-001 · MASTRA-005 + MASTRA-001 (after F09) · CK-006 with dev boot (any time).

---

## CK gap backlog — MUST ADD NOW vs POST-MVP

Executable specs: [`tasks/copilotkit/BACKLOG-ck-gaps.md`](../../tasks/copilotkit/BACKLOG-ck-gaps.md)

### 🔴 MUST ADD NOW (Phase 1 MVP)

| ID | Title | MVP? | Maps to |
|----|-------|------|---------|
| **CK-001** | AG-UI SSE smoke tests | 🔴 hard | MASTRA-002 · [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) |
| **CK-002** | Typed `MapUiState` + pin↔card contract | 🔴 hard | MAP-001 · F46 · `canvas/mastra` |
| **CK-003** | Frontend tool actions (map focus / modals) | 🟡 soft | MAP-007 · [frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools) |
| **CK-004** | HITL interrupt/resume acceptance (Roberto) | 🔴 hard | EVP-011/012 · `showcases/banking` |
| **CK-005** | Playwright pin↔card sync E2E | 🔴 hard | CK-002 · Lucía |
| **CK-006** | Inspector integration (dev) | 🟡 soft | [inspector](https://docs.copilotkit.ai/mastra/inspector) · Sofía |
| **CK-007** | AG-UI streaming lifecycle validator | 🔴 hard | CK-001 · F46 |

### 🟡 POST-MVP (document only — no Phase 1 DoD)

| ID | Title |
|----|-------|
| **CK-008** | Thread hydration after MASTRA-003 |
| — | Durable threads · replayable sessions · MCP generative UI |
| — | Advanced programmatic control · collaborative multi-user state |
| — | Realtime multi-tab sync · AG-UI full replay · CRDT complexity |

**Naming note:** Older drafts (`docs/copilotkit-plan.md`) used CK-005/006/007 for rental cards / map read / vis.gl. **Canonical Phase 1 IDs** for production-gap work are **CK-001…008 in `BACKLOG-ck-gaps.md`**; F46/MAP tasks still own rental card **product** delivery — CK backlog owns **validation and contracts**.

---

## Phase 1 constraints (do not violate)

| Rule | Source |
|------|--------|
| CopilotKit **1.55.2** only | CLAUDE.md |
| **v1 hooks:** `useCoAgent`, `useCopilotAction`, `CopilotSidebar` | 03-best-practices.md |
| **No CK v2** (`useAgent`, `useFrontendTool` from v2 paths) | Phase 2 migration |
| **Pattern 1 only** — no `:4111` prod runtime | copilotkit-integrations ref |
| **Gemini `gemini-3.5-flash` only** | CLAUDE.md |
| **English UI** — no Lingui Phase 1 | CLAUDE.md |

Many showcase docs target **CK v2** — verify against vendored **1.55.2** examples before copying API shapes.

---

## Doc index — official CopilotKit Mastra

| Topic | URL | mdeai when |
|-------|-----|------------|
| Quickstart | [quickstart](https://docs.copilotkit.ai/mastra/quickstart) | F01 Pattern 1 |
| AG-UI | [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) | CK-001, CK-007 |
| Shared state read | [in-app-agent-read](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read) | MAP, F34, CK-002 |
| Shared state write | [in-app-agent-write](https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-write) | Roberto wizard |
| Tool rendering | [tool-rendering](https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering) | F24, F46 |
| State rendering | [state-rendering](https://docs.copilotkit.ai/mastra/generative-ui/state-rendering) | MAP progress |
| HITL interrupt | [interrupt-flow](https://docs.copilotkit.ai/mastra/human-in-the-loop/interrupt-flow) | CK-004, F38 |
| HITL tool-based | [tool-based](https://docs.copilotkit.ai/mastra/human-in-the-loop/tool-based) | F37 |
| Frontend tools | [frontend-tools](https://docs.copilotkit.ai/mastra/frontend-tools) | CK-003, MAP-007 |
| Inspector | [inspector](https://docs.copilotkit.ai/mastra/inspector) | CK-006 |
| Threads | [threads](https://docs.copilotkit.ai/mastra/threads) | CK-008, MASTRA-003 |
| Programmatic control | [programmatic-control](https://docs.copilotkit.ai/mastra/programmatic-control) | Phase 2 |
| MCP apps | [mcp-apps](https://docs.copilotkit.ai/mastra/generative-ui/mcp-apps) | Phase 2 |
| Troubleshooting | [common-issues](https://docs.copilotkit.ai/mastra/troubleshooting/common-issues) | Lucía |

---

## Final answer (corrected)

| Question | Answer |
|----------|--------|
| Is the MASTRA/CK audit substantially correct? | **Yes (~85%)** |
| Was the prior pass 100% correct? | **No** — overstated advanced shared-state urgency |
| Is it 100% complete for production CK+Mastra? | **No (~68–72% planned)** — mostly executable specs + E2E |
| Is the roadmap architecturally wrong? | **No** — foundation, sequencing, and example choice are correct |
| Biggest missing concept? | **AG-UI correctness + typed state contracts + sync tests** — not more agents |
| Biggest blocker? | **MAP-001** (`/chat` absent on disk) |
| Biggest systemic risk? | **Fake-ready drift** |
| Correct strategy? | **Deterministic flows first; advanced memory/collaboration last** |

**Maintainers:** When adding CK features, update this file + [`tasks/copilotkit/BACKLOG-ck-gaps.md`](../../tasks/copilotkit/BACKLOG-ck-gaps.md) + bound F/MAP task — avoid orphan bullet lists in chat only.
