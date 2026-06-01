---
title: GitHub — mastra-claw-workshop
repo: https://github.com/smthomas/mastra-claw-workshop
score: 32
traffic: red
personas: [Sofía]
---

# mastra-claw-workshop

## At a glance

| | |
|---|---|
| **What it is** | Bootstrapped Mastra project for **OpenClaw / claw** workshop — agents, tools, workflows, scorers in Studio. |
| **Purpose** | Aligns with **VPS OpenClaw** enrichment path — not `mdeapp` Vercel. |
| **Goals** | Skills + workspace patterns on server. |
| **What it does** | `pnpm dev` → Studio `:4111`. |
| **Benefits** | Same agent primitives as mdeai without CopilotKit layer. |
| **mdeai** | [`../examples/workspace/00-index.md`](../examples/workspace/00-index.md) |

---

## Score: 32/100 🔴

Prod users never hit this deploy target.

---

## Learn → adapt

| Workshop | mdeai |
|----------|-------|
| `.agents/skills/mastra` | Cursor skills pack — already in repo |
| Scorers in project | J12 evals on `mdeapp` only |
| Studio testing | Sofía local debug |

---

## User story

**Sofía:** As Sofía, I run claw-workshop on VPS next to OpenClaw for batch jobs — Camila still uses Next.js CopilotKit.

**Workspace:** VPS-only per CLAUDE.md Hostinger rules.
