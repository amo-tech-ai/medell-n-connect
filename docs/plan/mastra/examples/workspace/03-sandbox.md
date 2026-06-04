---
title: Workspace — Sandbox (mdeai)
source: https://mastra.ai/docs/workspace/sandbox
personas: [Sofía]
phase: 2+ / VPS
---

# Workspace sandbox — mdeai

## At a glance

| | |
|---|---|
| **What it is** | A **command runner** — `execute_command`, optional background processes (`get_process_output`, `kill_process`). |
| **Purpose** | Run shell scripts (lint, transform CSV, call CLI) inside a working directory you control. |
| **Goals** | Isolation (Local, E2B, Daytona, Modal), timeouts, optional OS sandboxing on local. |
| **What it does** | Agent runs `npm run`, `python ingest.py`, etc.; output truncated for token limits. |
| **Benefits** | Pairs with filesystem when both point at same folder; background jobs for long imports. |
| **mdeai** | **Never** on Vercel serverless prod agents. |

**Official:** [Sandbox](https://mastra.ai/docs/workspace/sandbox)

---

## mdeai use cases

| Command class | Example |
|---------------|---------|
| Data transform | `node scripts/normalize-rentals.mjs` |
| Mastra smoke | `npm run typecheck` in clone (Sofía) |
| Firecrawl CLI | Via [BrowserViewer](../browser/03-browser-viewer.md) + CDP, not raw shell on prod |

`tools[EXECUTE_COMMAND].requireApproval: true` for anything non-readonly.

---

## User stories

**Sofía**  
As Sofía, a workspace agent runs `execute_command('pnpm exec tsx ingest.ts')` on the VPS after CSV drop — stdout capped at 2000 tokens so Gemini does not drown.

**Patricia**  
As Patricia, `execute_command` is **disabled** unless `requestContext.allowExecution === 'true'` — prevents accidental prod shell from misconfigured agent.

**Camila**  
As Camila, no sandbox — I cannot trigger shell from `/chat`; prevents prompt-injection → `rm -rf`.

---

## Journey — background import

1. `execute_command({ command: 'node ingest.mjs', background: true })` → PID.
2. `get_process_output({ pid, wait: true })` until exit 0.
3. On failure, `onError` workflow logs to Patricia Slack ([../workflows/07-error-handling.md](../workflows/07-error-handling.md)).

**CopilotKit:** N/A.

**Related:** [02-filesystem](02-filesystem.md) · [../features/03-acp.md](../features/03-acp.md)
