---
title: BrowserViewer (mdeai)
source: https://mastra.ai/docs/browser/browser-viewer
journeys: []
personas: [Sofía]
phase: 2+ workspace
---

# BrowserViewer — mdeai

**Official:** [BrowserViewer](https://mastra.ai/docs/browser/browser-viewer)

Launches Chrome, injects **CDP URL** into CLI tools (`agent-browser`, `browser-use`, `browse-cli`) via `workspace_execute_command`. Screencast to Studio.

---

## mdeai fit

| Official | mdeai |
|----------|-------|
| `Workspace` + `BrowserViewer` | **Not in mdeapp** — CopilotKit product, not Mastra workspace agent |
| CLI browser-use | Sofía local experiments; Hermes/VPS separate from Phase 1 |
| Thread-scoped browser | Different from Camila `thread` memory — workspace threads |

Phase 1 builder workflow: **Cursor + Playwright CLI + chrome-devtools skill**, not Mastra BrowserViewer.

---

## User stories

**Sofía — local repro**  
As Sofía, I use `browser-use` on a preview deploy to repro a map pin bug while watching Studio screencast — does not ship to production runtime.

**OpenClaw / VPS (deferred)**  
As ops, WhatsApp or enrichment bots on Hostinger might use CLI browser patterns — out of `mdeapp` freeze ([`mvp.md`](../../../mvp.md)).

**Camila / Roberto**  
No user-facing BrowserViewer — web app only.

---

## Real-world mapping

```text
Official:  workspace_execute_command("browser-use open ...") → CDP inject
mdeai:     npm run dev + Playwright test OR cursor-ide-browser MCP in Cursor
```

---

## When to adopt

- Internal **enrichment** worktree with Mastra `Workspace`
- **Not** for `/api/copilotkit` serverless bundle size and cold start

**Related:** [01-overview](01-overview.md) · [07-whatsapp-chat-bot](../07-whatsapp-chat-bot.md) (channel, not viewer)
