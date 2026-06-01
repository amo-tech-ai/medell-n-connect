---
title: Workspace — Overview (mdeai)
source: https://mastra.ai/docs/workspace/overview
personas: [Sofía, Patricia, Camila]
phase: 2+ / VPS
---

# Workspace overview — mdeai

## At a glance

| | |
|---|---|
| **What it is** | A Mastra `Workspace` bundles optional **filesystem**, **sandbox** (shell), **LSP** (code intelligence), **search** (BM25/vector), and **skills** (instruction packs) into tools the agent can call. |
| **Purpose** | Let agents do **ops and enrichment** work on files and scripts in a bounded directory — not replace your product database. |
| **Goals** | Safe automation (approvals, read-before-write), reuse `.claude/skills/` patterns, batch jobs off the Vercel request path. |
| **What it does** | Registers tools like `read_file`, `write_file`, `execute_command`, `skill`, workspace `search` on agents that have `workspace` assigned. |
| **Benefits** | One config for file + command + search; tool policies per path; skills match [agentskills.io](https://agentskills.io). |
| **mdeai does NOT** | Attach workspace to `conciergeAgent` on production Vercel — serverless + shell = wrong fit. |

**Official:** [Workspaces](https://mastra.ai/docs/workspace/overview) · `@mastra/core@1.1.0+`

---

## mdeai today vs target

| Surface | Workspace? | Why |
|---------|------------|-----|
| `/chat`, `/rentals` | **No** | `search-rentals`, Places, Grounding MCP |
| `/host/event/new` | **No** | Supabase + CopilotKit HITL |
| Hostinger OpenClaw / cron | **Yes** | Listing CSV → SQL seeds |
| Sofía local Mastra | **Yes** | F13 migrations, eval scripts |

---

## Configuration patterns (mdeai picks)

| Scenario | Pattern | Where |
|----------|---------|-------|
| Local enrichment | `LocalFilesystem` + `LocalSandbox` same `./workspace` | VPS |
| Bulk scrape summarize | `mounts` S3 + `E2BSandbox` | Phase 2 ops |
| Read-only policy corpus | `filesystem` only + `bm25: true` | Host docs ingest helper |
| Skills for agents | `skills: ['.agents/skills/mde-firecrawl']` | Point at repo skill dirs |

---

## User stories

**Sofía**  
As Sofía, I run a **VPS-only** Mastra agent with workspace so OpenClaw can normalize scraped listings into JSONL before a human merges to Supabase — Camila’s prod agent never gets `execute_command`.

**Patricia**  
As Patricia, I set `requireApproval: true` on `WRITE_FILE` so an ops agent cannot overwrite `/supabase/migrations` without a human click in Studio.

**Camila**  
As Camila, I never see workspace tools — my apartment cards always come from `search-rentals` with RLS, same as today.

---

## Journey — VPS enrichment (not CopilotKit)

1. Nightly cron on Hostinger starts Mastra with `Workspace({ filesystem, sandbox })`.
2. Agent `read_file('/incoming/listings.csv')` → validate → `write_file('/out/seed.sql')`.
3. Sofía reviews PR; `mdeapp` deploy unchanged.
4. Camila’s next `/chat` query hits updated Postgres via existing tool.

**CopilotKit:** `/api/copilotkit` has **no** workspace — Pattern 1 stays in-process agents only.

**Related:** [02-filesystem](02-filesystem.md) · [03-sandbox](03-sandbox.md) · [05-skills](05-skills.md)
