---
title: Feature — ACP Agent Client Protocol (mdeai)
source: https://mastra.ai/docs/agents/acp
journeys: []
personas: [Sofía]
phase: dev-only
---

# ACP (Agent Client Protocol) — mdeai

**Official:** [ACP](https://mastra.ai/docs/agents/acp) · `@mastra/acp`

Wrap **coding agents** (Claude Code, Codex, Amp) as Mastra tools or subagents over stdio — workspace-scoped file access.

---

## mdeai today vs target

| Item | Today | Target |
|------|-------|--------|
| `AcpAgent` in `mdeapp` | **No** — product agents are Gemini + Supabase tools | Optional **Sofía** dev supervisor on VPS |
| Vercel serverless | **Unfit** — long-lived ACP processes | Hostinger / local only |
| CopilotKit | N/A for end users | Patricia never sees ACP in `/chat` |

**Use ACP for:** repo maintenance, migration scripts, task-spec generation — not Camila rentals.

---

## Features & use cases

| Capability | mdeai use case |
|------------|----------------|
| `createACPTool` | “Fix lint in `mdeapp/src/mastra/agents`” from internal ops agent |
| `AcpAgent` subagent | Supervisor delegates file edits with `onPermissionRequest` |
| `workspace` + `LocalFilesystem` | Sandboxed to `mdeai/` clone on Sofía’s machine |
| `persistSession: false` | One-shot codemod per PR |

---

## User stories

**Sofía**  
As Sofía, I run a **local** Mastra workspace agent that calls Codex via ACP to implement F13 migration files — permissions gated to `./mdeapp` and `./supabase/migrations`.

**Patricia**  
As Patricia, I do **not** need ACP on production — audit trails stay in `ai_runs` and Supabase, not arbitrary shell on Vercel.

---

## Journey — internal codemod (dev)

1. Sofía: `mastra dev` + workspace with `skills/` pointing at `.claude/skills/`.
2. Parent agent: “Add thread/resource to copilotkit route per F13 spec.”
3. `codeAgent` ACP session edits `route.ts`; permission callback auto-allows writes under `mdeapp/`.
4. Sofía runs `npm run typecheck` outside ACP.

**CopilotKit:** No production wiring.

**Related:** [05-workspace](05-workspace.md) · [../browser/03-browser-viewer.md](../browser/03-browser-viewer.md)
