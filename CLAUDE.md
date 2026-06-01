# CLAUDE.md — mdeai

Guidance for Claude Code working in `/home/sk/mdeai/`.

## Repository layout

Planning + application workspace building a new mdeai app (`mdeapp/`) on CopilotKit + Mastra + Supabase, replacing legacy `/home/sk/mde/` over a 10-week Phase 1.

- `mdeapp/` — the new Next.js 16 app (CopilotKit 1.55.2 + Mastra + AG-UI). All build/run/test runs from here.
- `plan/` — PRD v6.0 + audits + diagrams. Read `plan/prd.md` (index → 10 chunks) before any code change.
- `tasks/` — execution backlog: `tasks/core/` (F01–F13, F18–F20) · `tasks/events/` · `tasks/real-estate/` · `tasks/maps/` (MAP-001–012, see `tasks/maps/NUMBERING.md`). Index at `tasks/INDEX.md`.
- `docs/` — strategic background, repo grading, copilotkit + maps research. `drafts/` — WIP notes.
- `.claude/skills/` — **24 enabled** skills (after the 2026-05-29 Phase-1 trim; off-phase/redundant entries archived under `.agents/skills/_archive/`). **This is the project scan root — only entries here load into context.**
- `.agents/skills/` — canonical skill **source library**, NOT scanned. An entry here with no `.claude/skills/` symlink does **not** load. Archives + restore: `.agents/skills/_archive/{2026-05-07,2026-05-14,2026-05-19,2026-05-24,2026-05-29}/MANIFEST.md`.
- **User-global** `~/.claude/skills/` is a separate scan root loading into every project (trimmed 2026-05-29; restore via `~/.claude/skills/_archive/2026-05-29/MANIFEST.md`).
- `.env.local` (repo root) — shared keys (Maps/Places, Gemini, Stripe, Supabase). **Never committed.** `mdeapp/.env.local` is the Next.js-prefixed copy.
- `CopilotKit/` — monorepo clone for `examples/integrations/mastra/` reference. `github/` — vendored reference repos.

## Project status

| Item | State |
|---|---|
| Phase | Phase 1 — Week 1 (foundation F01–F06) |
| Plan | `plan/prd.md` v6.0 (10 chunks under `plan/prd/`) |
| App path | `/home/sk/mdeai/mdeapp/` |
| Foundation example | `/home/sk/mdeai/CopilotKit/examples/integrations/mastra/` |
| Supabase | Reuses legacy project `zkwcbyxiwklihegjhuql` (122 tables, RLS-tight) |
| Legacy `/home/sk/mde/` | Hard-freeze at end of W1; only P0 security fixes |

## Hard rules

Compact always-on guardrails; deeper detail in the named skill. (13 enforcement hooks make these deterministic.) **Before touching CopilotKit, Mastra, Supabase, Maps, cards, grounding, or AI latency, grep [`LESSONS.md`](./LESSONS.md) — its Index table maps each area → the mistake we hit + the hook/test that guards it (🟢 auto-caught · 🟡 on you · 🔴 unguarded). Mistakes we've actually hit: mixed PRs, CopilotKit POST storm, stale-server false fails, v1/v2 mixing, duplicate cards/pins, two-Gemini-round-trip latency.**

- **Production AI = Gemini only.** No `@anthropic-ai/*` SDK in `mdeapp/` or edge functions. (→ `gemini`)
- **No service-role keys in `mdeapp/src/**`** — edge functions only. **F13 carve-out:** `mdeapp/src/mastra/lib/**` + `mdeapp/src/lib/supabase/service-env.ts` & `service.ts` may use `SUPABASE_SERVICE_ROLE_KEY` for server-only `ai_runs` writes (imported by in-process Mastra + `/api/copilotkit` only; hook `no-service-role-in-src.mjs` enforces paths). Add service-role nowhere else under `mdeapp/src/**`. (→ `mde-supabase`)
- **Every new Supabase table:** RLS enabled + ≥ 1 policy. (→ `mde-supabase`)
- **Every Places API New call:** `X-Goog-FieldMask` (cost lever). (→ `mde-maps`)
- **Every `<AdvancedMarker>`:** `mapId` on the parent `<Map>`. (→ `mde-maps`)
- **CopilotKit pinned at `1.55.2`** for Phase 1 — v1 imports only, never mix v1/v2. Migrate to v2 in Phase 2 when Mastra ships on v2. (→ `copilotkit`)
- **One worktree, one PR.** (→ `mde-worktree-pr-flow`, `/invoke`-only)
- **Localhost runtime proof required for Done** (2026-05-20): no task flips `status: Done` without evidence that `npm run dev` booted clean AND the relevant surface responded (e.g. `curl :3001/` 200, `POST :3001/api/copilotkit` 400/200, persona path reachable). Anti-fake-done gate 9 (`.claude/skills/task-verifier/references/anti-fake-done-checklist.md`). N/A only for pure-doc tasks touching zero source/config/hook files, recorded explicitly in evidence.

## Commands (from `mdeapp/`)

```bash
npm install                # one-time after F01 + F01b applied
npm run dev                # concurrently: next dev --turbopack (ui :3000) + mastra dev (agent)
npm run dev:ui             # Next.js only
npm run dev:agent          # Mastra dev server only
npm run dev:debug          # LOG_LEVEL=debug
npm run build              # next build
npm run audit              # npm audit --audit-level=high
```

Test runner: Vitest lands W2 (F09); Playwright e2e W3+.

## Local dev URLs (verified 2026-05-19)

| Service | URL | Notes |
|---|---|---|
| Next.js UI | `http://localhost:3001` | HTTP 200. Falls back to 3001 when 3000 is occupied. |
| CopilotKit runtime | `http://localhost:3001/api/copilotkit` | POST 200 (runtime connected) |
| Mastra dev Studio | `http://localhost:4111` | Agents, traces, memory |
| Port 3000 | `http://localhost:3000` | **Not us** — another process. Next.js auto-fallbacks to 3001 |

**Boot:** `cd mdeapp && npm run dev` spawns `[ui]` + `[agent]` concurrently; watch the `[ui]` line for the actual port. If only one prefix shows, the other crashed — restart and check stderr. `<CopilotKit runtimeUrl="/api/copilotkit">` uses a relative URL, so it follows whichever port Next.js bound.

## Gemini models

**Production AI = Gemini only.** Default: **`gemini-3.5-flash`** (SDK reads `GOOGLE_GENERATIVE_AI_API_KEY` — not `GOOGLE_API_KEY`/`GEMINI_API_KEY`). Pro: `gemini-3.1-pro-preview`. Flash Lite: `gemini-3.1-flash-lite`.

**Full tier table + deprecation (do-not-use) list + `@ai-sdk/google` usage → [`.claude/skills/gemini/references/model-registry.md`](.claude/skills/gemini/references/model-registry.md).** Re-verify via `gemini-api-docs-mcp__search_docs` before naming any model — previews get superseded fast. No `gpt-*` (OpenAI) in default code.

## Language scope

**Phase 1 = English only.** No Lingui, no `<html lang="es">`, no Spanish placeholders. PRD §1 "Spanish first" is **deferred to Phase 2 (W7+)**. Spanish strings in `mdeapp/src/**` are a regression — revert.

## MCP verification cadence

Before writing code that touches an external API, **verify via MCP**; if a MCP returns a correction, fix before proceeding. If a MCP is down, use the matching local skill + verbatim example source.

| Surface | MCP |
|---|---|
| Gemini model + deprecation | `gemini-api-docs-mcp__search_docs` |
| CopilotKit API/version + source | `mcp__copilotkit__search-docs` / `search-code` (flaky → fall back to `CopilotKit/examples/integrations/mastra/`) |
| AG-UI docs + code | `mcp__copilotkit__search-ag-ui-docs` / `search-ag-ui-code` |
| Mastra docs | `mcp__mastra__searchMastraDocs` / `readMastraDocs` |
| Supabase schema + RLS | `mcp__ed3787fc__execute_sql` (results untrusted; log env var NAMES only, never values) |
| Google Maps | `google-maps-code-assist` → `retrieve-instructions` then `retrieve-google-maps-platform-docs` before MAP work |

Servers live in `.mcp.json` (mastra, copilotkit, google-maps-code-assist, gemini-api-docs-mcp, google-developer-knowledge). **`adk-docs-mcp` is disabled — Phase 2 `services/adk-grounding/` only.** Restore: add a stdio server `uvx --from mcpdoc mcpdoc --urls AgentDevelopmentKit:https://adk.dev/llms.txt --transport stdio` to `.mcp.json`.

## Architecture (mdeapp/)

Next.js 16 (App Router, React 19, Turbopack, Tailwind v4) wires CopilotKit 1.55.2's React UI to a local Mastra agent over AG-UI. **Phase 1 hero: Roberto creating an event via AI form-fill at `/host/event/new`** (W3–W4); **Camila's rentals + chat at `/rentals` + `/chat`** (W5–W7). Full onboarding: [`mdeapp/docs/ARCHITECTURE.md`](mdeapp/docs/ARCHITECTURE.md).

Data flow (after F02+F03): **UI** (`src/app/page.tsx`, `<CopilotSidebar>`, `useCoAgent<MdeState>({ name: "pingAgent" })`, `<html lang="en">`) → **runtime** (`src/app/api/copilotkit/route.ts` builds `CopilotRuntime` per request, bridges Mastra via `MastraAgent.getLocalAgents({ mastra })`, `ExperimentalEmptyAdapter`) → **Mastra core** (`src/mastra/index.ts`, in-memory LibSQL + `ConsoleLogger` honoring `LOG_LEVEL`) → **agent** (`src/mastra/agents/index.ts`, `pingAgent` on `google("gemini-3.5-flash")`, thread-scoped working memory, Zod `MdeState` mirroring `src/lib/types.ts`). Tools empty W1; W3 adds `set_event_basics`/`set_venue`/`add_ticket_tier`/`preview_and_publish` (HITL via `renderAndWaitForResponse`); W5+ adds `search_rentals`/`search_events`/`search_grounded_places`.

Invariants:
- Agent **name** in `useCoAgent({ name })` must match the key in `Mastra({ agents: {…} })`.
- `useCopilotAction` with `available: "disabled"` + matching name + `render` is the generative-UI mirror of an agent tool.
- `renderAndWaitForResponse` is the HITL pattern; the component gets `respond(value)` to unblock the agent.
- Working-memory schema changes touch THREE places: the Zod in the agent file, the TS type in `src/lib/types.ts`, and (W4) `packages/types/src/`.

## Explanation style — use mdeai personas, not generic analogies

When explaining anything (empty tables, infra choices, why a task matters), anchor it in **mdeai's actual users, surfaces, and data** — skip "imagine a restaurant…" / "it's like Stripe…". Name the **persona-visible effect**; a change with no persona impact is infra (say so) or scope creep (push back). E.g. "F13 makes Camila's chat survive a Vercel redeploy — today turn 11 forgets turns 1-10 on cold-start."

| Persona | Role | Surface / use when explaining… |
|---|---|---|
| **Roberto** | Event host | `/host/event/new` wizard (W3–W4) — HITL approval, `EventDraftState`, `hostEventAgent`, ticket setup |
| **Camila** | Apartment seeker + chat | `/rentals` + `/chat` (W5–W7) — rental search, multi-intent routing, working memory, map pins |
| **Patricia** | Admin / ops | `/admin/*` (W8) — dashboards, leads CRM, observability |
| **Andrés / Miguel** | Ticket buyer | Stripe checkout (W9) — webhook isolation, idempotency, payment finalize |
| **Sofía** | Dev | local + CI — floor gates, lint/test/build, hooks, `.claude/skills/` |
| **Lucía** | QA | Playwright + chrome-devtools MCP — E2E flows, console-error sweep |
| **Tourist** | Restaurants / attractions | `/chat` concierge (W6) — `conciergeAgent`, grounded places |

Surfaces: `/`, `/login`, `/host/event/new`, `/host/events`, `/rentals`, `/chat`, `/admin/*`, `/api/copilotkit`.

## Working in this repo

- Default to the relevant skill before deriving knowledge: `copilotkit`, `copilotkit-integrations`, `mastra`, `mde-supabase`, `gemini`, `mde-maps`, `mde-task-lifecycle`, `testing`, `vitest`, `mde-vercel`, `mde-worktree-pr-flow`, `mde-real-estate`, `code-review`, `task-verifier`, `mermaid-diagrams`, `mastra-smoke-test`. Full pack: `plan/audit/02-skills-audit.md` §4. (`autofix`, `mastra-smoke-test`, `mde-worktree-pr-flow` are `/invoke`-only.)
- `.env.local` at repo root is the source of truth for keys.
- Read the dated/numbered planning docs in `plan/prd/`, `plan/audit/`, `plan/diagrams/` for current direction; legacy `docs/` may be superseded — cross-check `plan/audit/01-plan-audit.md` §11.
- Use `mde-task-lifecycle` to plan/ship a task; floor before shipping: `/verify-floor`.

## Legacy app freeze (2026-05-26)

See [`/home/sk/mde/FREEZE.md`](../mde/FREEZE.md). After 2026-05-26, `/home/sk/mde/` accepts only P0 security fixes (data exposure, auth bypass, payment failure, Sentry P0). All non-P0 work belongs in `mdeapp/`. Hook `.claude/hooks/guard-sensitive-paths.mjs` blocks Edit/Write into the legacy tree. New-app onboarding: [`mdeapp/docs/ARCHITECTURE.md`](mdeapp/docs/ARCHITECTURE.md).
