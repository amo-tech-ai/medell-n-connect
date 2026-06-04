---
title: 01 — Starting from scratch with CopilotKit + Mastra (plan only, no code)
date: 2026-05-19
author: Claude
status: Plan — awaiting user confirmation before any code is written
related:
  - /home/sk/mde/docs/100-AUDIT-FORENSIC-ARCHITECTURE-2026-05-19.md (forensic audit, picks Option D)
  - /home/sk/mde/docs/102-repos-plan.md (repo-pickup grades)
---

# 01 — Starting from scratch with CopilotKit + Mastra

> **TL;DR.** Yes — start from the official `CopilotKit/examples/integrations/mastra/` repo. That single example is mdeai's foundation. We copy 4 of its files, throw away its weather demo, and keep using the same Supabase project as legacy `mde/`. Week 1 ends with a "Hola" echo working in the browser. No legacy code is touched. No production traffic moves.

---

## 1. Direct answer: yes, use `examples/integrations/mastra`

[https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra)

This is the only example in the official CopilotKit monorepo that uses Mastra (mdeai's existing agent framework). It pins CopilotKit at `1.55.2`, wires `@ag-ui/mastra` for the protocol bridge, and exercises every primitive mdeai will use in the next 10 weeks (sidebar, frontend actions, generative UI, human-in-the-loop, shared state).

**Why this and not the others:**

- All 23 showcases (`langgraph-*`, `crewai-*`, `pydantic-ai`, `adk`, `agno`, `strands`, `llamaindex`) use a **different agent framework**. Picking any of them means throwing away mdeai's 7 existing Mastra agents.
- All 4 community repos in `/home/sk/mde/github/copilotkit/` run Python ADK or LangGraph — same problem.
- `examples/v2/react-router/` is Vite-native but uses `@tanstack/ai` instead of Mastra. Not worth abandoning Mastra to get Vite back.
- `examples/canvas/mastra/` and `canvas/mastra-pm/` are also Mastra-shaped but they're **canvas/board apps**, not generic chat shells. They're useful as **pattern references** in week 3+ (working-memory schema), not as the day-1 base.

---

## 2. Two paths to choose between before day 1

Both work. Pick one in the next conversation turn:

### Path A — "Just clone the example folder" *(recommended)*

```bash
cp -r /home/sk/mde/CopilotKit/examples/integrations/mastra /home/sk/mdeai/app
cd /home/sk/mdeai/app
rm -rf .git docker docker-compose.test.yml Dockerfile fixtures
git init
```

- **Time to running echo:** ~10 minutes
- **Trade-off:** copies a Next.js project (the official one). mdeai's legacy was Vite — but Next.js is the framework the example targets natively. Adapting Next.js back to Vite costs ~1 week with zero functional benefit.
- **Net dependency added:** CopilotKit 1.55.2 × 3, AG-UI × 2, Next.js 16, Mastra `beta`, Gemini SDK.

### Path B — "Use `create-next-app` then add CopilotKit"

```bash
npx create-next-app@latest /home/sk/mdeai/app --typescript --tailwind --app
# then add CopilotKit + Mastra + AG-UI manually
```

- **Time to running echo:** ~1–2 hours (more wiring, easier to drift from the example's exact shape)
- **Trade-off:** cleaner starting tree, but you re-discover every wiring decision the example already solved.

**Recommendation: Path A.** The example is small (5 source files, 1,000 LoC, MIT-licensed) and the official maintainers test it on every CopilotKit release. Adopting it verbatim costs less than re-doing the same wiring.

---

## 3. Where the new app lives

| Path | Status | Use |
|---|---|---|
| `/home/sk/mde/` | Legacy production app | Stays as-is until cutover |
| `/home/sk/mdeai/` | New project root (already has `docs/`, `drafts/`, `plan/`) | Plans + docs |
| `/home/sk/mdeai/mdeapp/` | **New app code** (does not exist yet) | Path A or B lands here |
| `/home/sk/mdeai-app/` | Bootstrapped earlier this turn (incomplete) | **Decision needed — see §4** |

---

## 4. Decision needed: `/home/sk/mdeai-app/`

Earlier in this turn I started bootstrapping at `/home/sk/mdeai-app/` (sibling to `mde/`) before you asked me to stop and write a plan. That folder now contains:

- The CopilotKit example, partially rewritten (Gemini agent, mdeai page shell, package.json renamed)
- No `node_modules`, no `.env.local`, no `.git`

**Three options:**

| Option | Action |
|---|---|
| (i) Move it | `mv /home/sk/mdeai-app /home/sk/mdeai/app` — keep the work, just relocate |
| (ii) Delete it | `rm -rf /home/sk/mdeai-app` — start fresh from the example |
| (iii) Keep both | Pin `/home/sk/mdeai/mdeapp/` for the real build; leave `/home/sk/mdeai-app/` as a scratch directory |

**Recommended:** (i) move. The work done so far is a clean conversion of the example — no legacy code mixed in. Throwing it away costs ~30 minutes to redo.

---

## 5. What's in the example today (5 files that matter)

These are the files that drive the architecture. Lengths are exact from the local copy.

| File | LoC | What it does | Action |
|---|---:|---|---|
| `src/app/api/copilotkit/route.ts` | 29 | Mounts `CopilotRuntime` + `MastraAgent.getLocalAgents`. **This is the magic.** | Keep as-is |
| `src/mastra/index.ts` | 19 | Registers Mastra agents with the runtime | Replace `weatherAgent` with `pingAgent` (week 1), then `hostEventAgent` (week 3) |
| `src/mastra/agents/index.ts` | 31 | Defines `weatherAgent` (OpenAI + LibSQL memory + Zod state) | Replace with `pingAgent` using Gemini |
| `src/mastra/tools/index.ts` | 107 | Defines `weatherTool` (fetches open-meteo) | Delete contents; tools come from `my-mastra-app/` in week 3 |
| `src/app/page.tsx` | 123 | Sidebar + 3 demos (`weatherTool` render, `setThemeColor` action, `go_to_moon` HITL) | Replace with empty mdeai shell; demos return in week 3 |

Also:
- `src/app/layout.tsx` — `<CopilotKit runtimeUrl="/api/copilotkit" agent="weatherAgent">` — change `agent` to `pingAgent`
- `src/components/{weather,moon,proverbs}.tsx` — demo components, delete
- `src/lib/types.ts` — `AgentState` Zod type, replace shape

---

## 6. Week 1 — day by day (planning only, no implementation)

> Goal: end of week 1, you type "hola" in a sidebar at `http://localhost:3000` and Gemini replies in Spanish. Nothing else. No Supabase reads. No Maps. No legacy code touched.

### Day 1 — Bootstrap

1. Decide §2 (Path A vs B) and §4 (what to do with `/home/sk/mdeai-app/`)
2. Land the working tree at `/home/sk/mdeai/mdeapp/`
3. Strip the example's `weatherAgent` → replace with `pingAgent` (Gemini, empty tools, echo only)
4. Strip demo components (`weather.tsx`, `moon.tsx`, `proverbs.tsx`)
5. Rewrite `src/app/page.tsx` as a 50-line mdeai sidebar shell

### Day 2 — Env + boot

1. Copy `.env.local` from `/home/sk/mde/.env.local` and rename `VITE_*` → `NEXT_PUBLIC_*`
2. Add `GOOGLE_GENERATIVE_AI_API_KEY=<value from legacy GEMINI_API_KEY>` — this is the env var name `@ai-sdk/google` reads by default. Do **not** rename `GEMINI_API_KEY` itself; just create the new var and paste the same key value. (Note: this is different from `GOOGLE_API_KEY` which `@copilotkit/agent`'s `BuiltInAgent` would read in v2; we are on v1.55.2 with raw `@ai-sdk/google`.)
3. Strip the example's `weatherAgent` and replace with `pingAgent`: `model: google("gemini-3.5-flash")` (do not use `gemini-2.0-flash-exp` — it is a deprecated preview)
4. Ensure `Memory.workingMemory.options` includes `scope: "thread"` (per-conversation state, matches example exactly)
5. `npm install` — first run, expect ~3 minutes
6. `npm run dev` — runs `concurrently` (`dev:ui` Next.js + `dev:agent` Mastra). Both come up; UI on `:3000`. If you only see one, that's a `concurrently` install issue, not a CopilotKit issue.
7. Open browser, type "hola", see Gemini reply in Spanish

### Day 3 — Git + Vercel preview

1. `git init` + first commit
2. Create `mdeai/mdeai-app` GitHub repo (private)
3. Push, hook up Vercel preview deploy
4. Verify preview URL boots, sidebar echoes

### Day 4 — Tests baseline

1. Install Vitest + Playwright (later — week 1 day 4 can be just one Vitest smoke test that imports the runtime endpoint and asserts it loads)
2. Add `floor` script (`lint + build + test`) to `package.json`

### Day 5 — Lessons + tidy + freeze date

1. Document any wiring surprises in `docs/`
2. Set the **hard freeze date** for legacy `/home/sk/mde/` — end of this week
3. Stage week 2 work (foundation primitives: `<CopilotKitGate>`, route shell)

**End-of-week-1 success looks like:**

- Local: type message in sidebar, get a Gemini echo, no console errors
- Preview: same on Vercel preview URL
- Repo: pushed, CI green
- Legacy `/home/sk/mde/` untouched

---

## 7. Reference repos — read these in later weeks, not week 1

These are **pattern references** for when specific features come up. Don't open them before week 3.

| When | Repo | Why |
|---|---|---|
| Week 3 (host pilot agent) | `CopilotKit/examples/canvas/mastra/src/mastra/agents/index.ts` | Working-memory Zod schema on `Memory.workingMemory` |
| Week 4 (approvals UI) | `CopilotKit/examples/showcases/banking/src/lib/copilot-context.tsx` | Role-based action context |
| Week 4 (card render shells) | `CopilotKit/examples/showcases/generative-ui/src/components/weather-card.tsx` | `useCopilotAction({ render })` shape |
| Week 6 (grounded search) | `/home/sk/mde/github/maps/grounding-lite-mcp-sample-app/api/grounded-search.ts` | MCP grounded place lookup |
| Week 5 (place card UI) | `/home/sk/mde/github/maps/extended-component-library` | Web component `<gmp-place-overview>` |
| Week 8 (event ticketing patterns) | `/home/sk/mde/github/events/Hi.Events` | **Pattern reference only — AGPL-v3 license** |
| Week 3 (event-planning prompts) | `/home/sk/mde/github/events/event-planner-os/SKILL.md` | 20+ event-type planning templates |

---

## 8. Repos to ignore (don't waste time)

| Repo | Reason |
|---|---|
| `examples/v1/*` | Marked legacy in CopilotKit README |
| `examples/v2/*` | Experimental + no Mastra integration |
| `examples/integrations/{langgraph-*, crewai-*, pydantic-ai, adk, agno, strands-python, llamaindex*, ms-agent-framework-*, agent-spec, a2a-a2ui}` | Wrong agent framework |
| `examples/showcases/multi-agent-canvas` | LangGraph |
| `examples/showcases/a2a-travel` | A2A + ADK |
| `github/copilotkit/agent-studio-starter` | Python LangGraph + k8s |
| `github/copilotkit/ag-ui-adk-grounding-app` | Python ADK |
| `github/copilotkit/with-agent-spec` | Agent Spec + FastAPI |
| `github/copilotkit/mastra-react` | Empty Vite template, name is misleading |
| `github/events/eventraa` | Create-React-App + Mongo |
| `github/maps/react-wrapper` | **Archived** — redirects to vis.gl |
| `github/maps/codelab-maps-platform-101-react-js` | Codelab tutorial only |

---

## 9. License reminders

| Source | License | What you can do |
|---|---|---|
| CopilotKit examples | MIT | Copy code verbatim into mdeai. Keep the LICENSE file at repo root. |
| `@vis.gl/react-google-maps` | MIT | Import as npm dep. |
| `@googlemaps/*` packages | Apache-2.0 | Import as npm dep. |
| `grounding-lite-mcp-sample-app` | Apache-2.0 | Copy code patterns. |
| `event-planner-os` | MIT (per README) | Copy template text. |
| **Hi.Events** | **AGPL-v3** | ⚠️ **Patterns only. Do NOT copy source files.** AGPL would force mdeai to also be AGPL. Read it to understand their schema, then write fresh code. |

---

## 10. What does NOT get built in week 1

To stop scope creep, here's the explicit "not yet" list for week 1:

- ❌ Supabase reads (week 2 — `apartments` query)
- ❌ Maps mount (week 5)
- ❌ Mastra agents from legacy (week 3 — when we copy `conciergeAgent`, `rentalAgent`, `eventAgent`)
- ❌ Stripe / payments (week 8)
- ❌ Auth (week 2)
- ❌ Spanish copy beyond sidebar labels (week 5 — Lingui)
- ❌ Approvals / HITL (week 4)
- ❌ Edge function forensic (week 5)
- ❌ Any change to `/home/sk/mde/` (frozen end of week 1)

---

## 11. Decision checklist (answer before I start coding)

Please confirm or override each:

1. **Path:** `/home/sk/mdeai/mdeapp/` for the new app code? (Yes/No)
2. **Existing `/home/sk/mdeai-app/`:** move it (`mv` to `/home/sk/mdeai/mdeapp/`), delete it, or keep it as scratch?
3. **Bootstrap method:** Path A (clone example folder — recommended) or Path B (`create-next-app`)?
4. **Framework:** Next.js 16 (matches example) or insist on Vite?
5. **Repo name on GitHub:** `mdeai/mdeai-app`? Other?
6. **Public or private:** Private during build, public at cutover? Or always private?
7. **Vercel project:** New Vercel project linked to new repo, or land under the existing mdeai Vercel project as a second app?
8. **Hard-freeze date for legacy `/home/sk/mde/`:** end of week 1? Different?

---

## 12. What I will NOT do without explicit confirmation

- Delete `/home/sk/mdeai-app/` (the work I bootstrapped earlier)
- Push to GitHub
- Create a Vercel project
- Touch any file under `/home/sk/mde/`
- Add any production-shaped secret to a committed file
- Run `npm install` on a path you haven't confirmed

---

## 13. One-paragraph summary

> Start from `CopilotKit/examples/integrations/mastra/`. Copy it to `/home/sk/mdeai/mdeapp/`. Replace the weather demo with a Gemini-backed `pingAgent`. Point the new app's `.env.local` at the same Supabase project as legacy mde. End of week 1 you type "hola" in a sidebar and Gemini responds. Nothing else changes. Legacy mde keeps running untouched until cutover at week 10.
