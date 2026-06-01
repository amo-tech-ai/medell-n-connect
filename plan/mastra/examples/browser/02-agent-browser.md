---
title: AgentBrowser (mdeai)
source: https://mastra.ai/docs/browser/agent-browser
journeys: []
personas: [Lucía]
phase: 2+
---

# AgentBrowser — mdeai

**Official:** [AgentBrowser](https://mastra.ai/docs/browser/agent-browser)

Playwright-based automation with **accessibility refs** (`@e1`, `@e2` from `browser_snapshot`). Vision models can use `browser_screenshot`.

---

## Feature summary

| Tool pattern | mdeai analogue |
|--------------|----------------|
| `browser_snapshot` | Playwright `page.accessibility` / DOM snapshot in E2E |
| `browser_click` @ref | Playwright `getByRole` in Lucía’s tests |
| `browser_screenshot` | `browser_take_screenshot` in chrome-devtools skill |
| `cdpUrl` remote | CI Playwright against preview URL |

---

## User stories

**Lucía — parity with Playwright**  
As Lucía, Mastra AgentBrowser does **not** replace `mdeapp/playwright/` — we keep one E2E stack; AgentBrowser is only for agent-autonomous flows (e.g. “verify host publish button exists”).

**Patricia — listing QA (internal)**  
As Patricia, an ops agent opens our own `/rentals` preview, snapshots, confirms pins render — **not** scraping third-party sites in prod.

**Camila**  
As Camila, I never wait on Chromium boot in chat — sub-second `search-rentals` only.

---

## Suggested mdeai use cases (Phase 2+)

| Use case | Agent | Guardrail |
|----------|-------|-----------|
| Host event page visual QA | `qaAgent` + browser | Staging URL only |
| MAP pin spot-check | Compare snapshot vs `MapContext` | Manual trigger |
| Restaurant menu fallback | `conciergeAgent` + browser tool | After MCP miss; cite URL |

**Install:** `npx playwright install chromium` per [official note](https://mastra.ai/docs/browser/agent-browser).

---

## Journey — staging visual QA (sketch)

1. Sofía deploys Vercel preview.
2. Internal `qaAgent` with `AgentBrowser({ headless: true })`.
3. Navigate `/rentals?mock=1` → snapshot → assert marker refs in text.
4. No CopilotKit — headless script or Studio.

**Acceptance**

- [ ] Not in `mastra/index.ts` Phase 1 agents list
- [ ] No scraping login-gated listing sites
- [ ] Gemini vision only if screenshot tool enabled

---

## CopilotKit note

Do not expose `browser_*` tools to `conciergeAgent` in CopilotKit without rate limits — token cost and SSRF risk. Prefer server-side Places/Grounding ([domains/05-google-maps.md](../domains/05-google-maps.md)).

**Related:** [01-overview](01-overview.md) · [03-browser-viewer](03-browser-viewer.md)
