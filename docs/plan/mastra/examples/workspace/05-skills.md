---
title: Workspace — Skills (mdeai)
source: https://mastra.ai/docs/workspace/skills
personas: [Sofía, Patricia]
phase: 2+
---

# Workspace skills — mdeai

## At a glance

| | |
|---|---|
| **What it is** | Folders with `SKILL.md` ([Agent Skills spec](https://agentskills.io)) — reusable instructions + optional `references/`, `scripts/`, `assets/`. |
| **Purpose** | Teach runtime agents **how** to run tasks (Firecrawl, Supabase audit) without stuffing all skills into one system prompt. |
| **Goals** | Parity with `.claude/skills/` for VPS agents; load on demand via `skill` tool. |
| **What it does** | `skills: ['skills']` on Workspace → tools `skill`, `skill_read`, `skill_search`. |
| **Benefits** | Version skills independently; `skill_search` when BM25 enabled; same-named skill tie-break rules. |
| **mdeai** | Repo skills at `.agents/skills/` / `.claude/skills/` for **ops** agents — prod concierge keeps inline instructions Phase 1. |

**Official:** [Workspace skills](https://mastra.ai/docs/workspace/skills)

---

## mdeai skill candidates

| Skill dir | Agent | Use |
|-----------|-------|-----|
| `mde-firecrawl` | Enrichment | Scrape listing sites on VPS |
| `mde-supabase` | Ops | RLS audit scripts |
| `mde-maps` | Internal QA | Field mask checklist |
| `copilotkit` | Sofía | Pattern 1 debug |

---

## User stories

**Sofía**  
As Sofía, a VPS agent calls `skill({ name: 'mde-firecrawl' })` only when the job needs scraping — keeps token budget low vs loading 33 skills every turn.

**Patricia**  
As Patricia, published `brand-voice` prompt block (Editor) and workspace `SKILL.md` stay in sync via PR — different surfaces, same tone rules.

**Camila**  
As Camila, concierge instructions stay in `concierge.ts` until Editor Phase 2 — I get consistent English tool-output policy without skill-load latency.

---

## Journey — on-demand Firecrawl skill

1. Cron: “Enrich pending listings.”
2. Agent: `skill('mde-firecrawl')` → reads SKILL.md.
3. `skill_read('references/scrape-rules.md')`.
4. Sandbox runs scrape CLI per skill script section.
5. Filesystem writes `out/listings.jsonl`.

**CopilotKit:** Prod agents do not call `skill` tool in Phase 1.

**Related:** [06-search](06-search.md) · [../editor/02-prompts.md](../editor/02-prompts.md)
