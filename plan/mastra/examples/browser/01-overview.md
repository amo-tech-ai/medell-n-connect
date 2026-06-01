---
title: Browser overview (mdeai)
source: https://mastra.ai/docs/browser/overview
journeys: [J8]
personas: [Lucía, Sofía]
phase: 2+
---

# Browser overview — mdeai

**Official:** [Browser overview](https://mastra.ai/docs/browser/overview)

Mastra attaches a **browser provider** to an `Agent` — tools for navigate, snapshot, click, type, screenshot. Providers: **AgentBrowser** (Playwright + a11y refs), **Stagehand** (Browserbase + NL selectors), **BrowserViewer** (CLI + CDP).

---

## Phase 1: out of product path

| Persona | Need | Phase 1 tool |
|---------|------|--------------|
| Camila | Rental cards | `search-rentals` + CopilotKit render |
| Roberto | Publish event | Supabase + HITL |
| Tourist | Restaurants | `search-restaurants` / Grounding MCP |
| Lucía | Regression | **Playwright** against Next.js, not Mastra browser agent |

**Why defer:** Browser agents add latency, infra (Chromium, CDP), and compliance risk (scraping Zillow) — PRD hero flows are API-first.

---

## User stories (Phase 2+)

**Lucía — publish smoke (J8 extension)**  
As Lucía, I use Playwright for `/host/event/new` publish path; a Mastra `AgentBrowser` is only for **optional** “click through Roberto’s draft on staging” if we need agent-driven QA beyond scripts.

**Sofía — competitor price check (internal)**  
As Sofía, a **non-prod** browser agent snapshots a public listing page for Patricia’s ops research — never writes to `rentals` without human approval.

**Tourist — JS-heavy site (edge case)**  
As a Tourist, if a venue only publishes menu on a SPA, Phase 2 browser tool could extract text **after** Grounding MCP fails — fallback only.

---

## Real-world mapping

```text
Official:  Agent({ browser: AgentBrowser() }) → browser_snapshot, browser_click
mdeai W1:  conciergeAgent({ tools: { search-rentals, ... } }) — no browser
mdeai W2+: optional enrichmentAgent with browser — staging only
```

| Surface | Browser agent? |
|---------|----------------|
| `/chat` prod | No |
| Studio screencast | Yes — when experimenting locally |
| Vercel serverless | Hard — need CDP/Browserbase ([overview](https://mastra.ai/docs/browser/overview)) |

---

## CopilotKit note

Browser tools are **Mastra agent tools**, not CopilotKit frontend tools. If ever exposed to Camila, cards still come from normalized tool JSON — same rule as `search-rentals`. CopilotKit would render a “browser task in progress” via [tool-streaming](../04-user-stories.md) `writer`, not live browser embed in sidebar (unless custom UI).

**Related:** [02-agent-browser](02-agent-browser.md) · [domains/05-google-maps.md](../domains/05-google-maps.md)
