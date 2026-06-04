---
title: GitHub — AgentStack (reference architecture)
repo: https://github.com/ssdeanx/AgentStack
score: 38
traffic: red
phase: 3+ / VPS
personas: [Sofía, Patricia]
---

# AgentStack (ssdeanx)

## At a glance

| | |
|---|---|
| **What it is** | Large **“production-grade” multi-agent monorepo** on Mastra: claims 50+ tools, 25+ agents, A2A/MCP, RAG, observability, governance — plus **Convex**, **better-auth**, Storybook, `conductor/`, OpenClaw/Gemini CLI docs. |
| **Purpose** | Full **parallel product** (financial / enterprise orchestration), not a component library for mdeai. |
| **Goals** | Study router + workflow + MCP patterns — **do not vendor into `mdeapp`**. |
| **What it does** | Separate app stack (`app/`, `src/`, `ui/`) with its own auth, DB, and agent catalog. |
| **Benefits** | Validates multi-agent direction for **Hermes/OpenClaw VPS** — same problem class, different market. |
| **mdeai** | You already have **6 focused agents** + CopilotKit; AgentStack is **scope creep** if imported wholesale. |

**Quality:** Ambitious architecture, **low reuse value** as copy-paste components (~32 GitHub stars, 400 commits, 1 open PR — active but not battle-tested like CopilotKit/Mastra official).

---

## Score: 38/100 🔴

| Factor | Pts | Why low for mdeai |
|--------|-----|-------------------|
| Revenue | 8 | Finance/enterprise focus, not Medellín rentals/events |
| CK Pattern 1 | 5 | Own UI/orchestration — not CK 1.55.2 sidebar |
| Gemini / Supabase | 8 | Mixed providers; Convex ≠ your Supabase RLS |
| Copy cost | 2 | Massive merge conflict surface |
| Breadth | 15 | Ideas only (router, A2A) |

---

## Are they “quality components”?

| Question | Answer |
|----------|--------|
| Can we npm install AgentStack UI widgets? | **No** — not a published component package for mdeai. |
| Can we drop in their agents? | **No** — 25 agents wrong domain, wrong tools, wrong auth. |
| Is the code production-proven for us? | **Unproven for mdeai** — different data plane (Convex), different personas. |
| What *is* worth stealing? | **Patterns**, not files — see table below. |

### Worth studying (patterns only)

| AgentStack idea | mdeai mapping | Where |
|-----------------|---------------|--------|
| Router → specialists | `routerAgent` + workflows | [`../examples/03-supervisor-agent.md`](../examples/03-supervisor-agent.md) |
| MCP + A2A orchestration | MAP-002, Phase 3 partners | [`../examples/mcp/01-overview.md`](../examples/mcp/01-overview.md), [`../features/02-a2a.md`](../examples/features/02-a2a.md) |
| RAG pipelines | J11 host docs | [`../examples/rag/00-index.md`](../examples/rag/00-index.md) |
| Observability / governance | `ai_runs`, scorers, Patricia | [`../examples/evals/00-index.md`](../examples/evals/00-index.md) |
| `conductor/` workflows | VPS batch jobs | [`12-mastra-claw-workshop.md`](12-mastra-claw-workshop.md) |
| 50+ tools | **Anti-pattern** for Phase 1 — Camila needs 4–5 SQL/Maps tools | [`../03-best-practices.md`](../03-best-practices.md) |

### Do not import

- Convex backend (mdeai = Supabase `zkwcbyxiwklihegjhuql`)
- better-auth stack (mdeai auth path is Supabase Auth + PRD)
- Bulk agent definitions (violates gemini-only, focused personas)
- Financial intelligence agents
- OpenClaw wiring into Vercel `mdeapp`

---

## vs mdeai stack

```text
mdeapp (ship):
  Next.js 16 → CopilotKit 1.55.2 → Mastra (6 agents, 3 workflows) → Supabase RLS

AgentStack (reference):
  Next app → own orchestration layer → 25+ agents → Convex + MCP + A2A → finance/ops
```

**Closer VPS cousin:** OpenClaw + [`../examples/workspace/00-index.md`](../examples/workspace/00-index.md) — not AgentStack in prod UI.

---

## Domain matrix

| Domain | AgentStack relevance |
|--------|----------------------|
| Rentals | 🔴 — use `search-rentals`, not AgentStack tools |
| Events | 🟡 — workflow ideas only; Roberto uses CK HITL |
| Restaurants | 🔴 |
| Maps | 🔴 — use Grounding MCP |
| Contests | 🔴 |

---

## User stories

**Sofía:** As Sofía, I skim AgentStack `src/mastra` (if present) for **folder naming** only — then implement in `mdeapp` per best-practices, without adding dependencies.

**Patricia:** As Patricia, AgentStack’s “governance” docs inform **admin observability** Phase 3 — not Week 1–7.

**Camila / Roberto:** **No story** — they never interact with AgentStack; stealing agents would break grounded cards and event publish flows.

---

## Journey — when to open the repo

1. Designing Phase 3 **multi-tenant host ops** or partner A2A.  
2. Compare router confidence thresholds with [`classify-intent`](../../../mdeapp/src/mastra/tools/classify-intent.ts).  
3. Stop before copying files — write an mdeai task spec instead.

**Internal draft (longer analysis):** [`../../../drafts/tasks/prompts/mastra/plans/github/26-agrnt-stack.md`](../../../drafts/tasks/prompts/mastra/plans/github/26-agrnt-stack.md)

**Source:** [ssdeanx/AgentStack](https://github.com/ssdeanx/AgentStack)
