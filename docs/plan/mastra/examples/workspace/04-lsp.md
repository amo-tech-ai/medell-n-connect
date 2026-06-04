---
title: Workspace — LSP inspection (mdeai)
source: https://mastra.ai/docs/workspace/lsp
personas: [Sofía]
phase: dev-only
---

# Workspace LSP — mdeai

## At a glance

| | |
|---|---|
| **What it is** | Language-server **symbol intelligence** — hover types, go-to-definition, implementations. |
| **Purpose** | Help agents navigate codebases without reading entire files into context. |
| **Goals** | Faster, accurate refactors in `mdeapp/` and `supabase/` from agent-assisted tasks. |
| **What it does** | Tool `lsp_inspect` (renamable) with `path`, `line`, `match: '<<<symbol'`. |
| **Benefits** | Complements `grep` + `read_file`; TS/Python/Go/Rust built-in; custom servers (PHP, Ruby). |
| **mdeai** | Sofía/dev agents on repo clone — **not** Camila concierge. |

**Official:** [LSP inspection](https://mastra.ai/docs/workspace/lsp)

---

## User stories

**Sofía**  
As Sofía, before changing `copilotkit/route.ts`, an internal agent `lsp_inspect`s `getLocalAgentsWithLogging` to find the definition in `@ag-ui/mastra` usage — smaller context than full file dump.

**Camila / Roberto**  
No LSP in product — they use the app, not the monorepo.

---

## Journey — safe F13 edit assist

1. Workspace on `mdeai/` clone, `lsp: true`.
2. Agent inspects `createThreadMemory` definition + callers.
3. Human (Sofía) applies patch; `npm run typecheck` via sandbox.

**CopilotKit:** N/A.

**Related:** [01-overview](01-overview.md) · [02-filesystem](02-filesystem.md)
