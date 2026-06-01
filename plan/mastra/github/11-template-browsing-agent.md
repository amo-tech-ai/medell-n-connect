---
title: GitHub — Mastra template browsing agent
repo: https://github.com/mastra-ai/template-browsing-agent
score: 28
traffic: red
personas: [Lucía]
---

# template-browsing-agent (Browserbase)

## At a glance

| | |
|---|---|
| **What it is** | Mastra + **Browserbase Stagehand** — navigate, click, extract web pages. |
| **Purpose** | Headless browser automation reference. |
| **Goals** | Understand when **not** to use this for mdeai listings. |
| **What it does** | AI-driven browser sessions for scraping/interaction. |
| **Benefits** | Lucía E2E ideas only — prod uses **Places API + Supabase**. |
| **mdeai** | **Skip** for rental/restaurant hot path ([`../examples/browser/00-index.md`](../examples/browser/00-index.md)). |

---

## Score: 28/100 🔴

Conflicts with cost, reliability, and MAP-002 Grounding strategy.

---

## Learn → adapt

| Use | Don't use |
|-----|-----------|
| Competitor QA in CI (VPS) | Camila live search |
| One-off Patricia audit | Facebook login scraping |

---

## Domain matrix

| Domain | Verdict |
|--------|---------|
| Rentals | 🔴 — `search-rentals` |
| Events | 🔴 |
| Restaurants | 🔴 — Grounding MCP |
| Maps | 🟡 — only if Places gap |

---

## User story

**Lucía:** As Lucía, I might run Browserbase in a **staging** smoke script — never in `mdeapp` Vercel runtime.

**Maps playbook:** [`../examples/domains/05-google-maps.md`](../examples/domains/05-google-maps.md).
