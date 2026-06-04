---
title: Product reference — Retrip workspace
url: https://retrip.ai/
score: 38
traffic: yellow
personas: [Roberto, Patricia]
domains: [events]
---

# Retrip.ai (product reference, not GitHub)

## At a glance

| | |
|---|---|
| **What it is** | **Travel agency quote workspace** — AI parses operator text/PDF into structured services → professional PDF quote. |
| **Purpose** | **UX benchmark** for Roberto’s event wizard + ticket tiers — not a code dependency. |
| **Goals** | Pipeline UI: intake → AI structure → human edit → export. |
| **What it does** | Orders, quotes, team pipeline, PDF output (Spanish-first product). |
| **Benefits** | Shows “operator paste → structured line items” Roberto needs for sponsor packages / ticket tiers. |
| **mdeai** | Events/hosting only; Camila rentals use listing cards, not PDF quotes. |

---

## Score: 38/100 🟡

Vertical mismatch (travel agencies); high UX value for **host commercial** flows.

---

## Learn → adapt (no integration)

| Retrip pattern | mdeai Roberto |
|----------------|---------------|
| Paste messy operator text | Paste venue contract → `hostEventAgent` form-fill |
| AI structures services | Tools: `set_venue`, `add_ticket_tier` |
| Team pipeline states | `/host/events` list + Patricia admin |
| PDF quote | Event preview PDF / Stripe checkout summary |

**Phase 1 language:** English UI per CLAUDE.md — borrow workflow, not Spanish copy.

---

## User stories

**Roberto:** As Roberto, I paste ticket rules from a venue email and the wizard proposes tiers I can edit before publish — like Retrip’s service parser.

**Patricia:** As Patricia, I see which host quotes are draft vs sent — analogous to Retrip pipeline columns.

---

## Journey — host quote (inspiration)

1. Roberto pastes unstructured text into sidebar.
2. Agent extracts tiers + dates into `EventDraftState`.
3. Preview card (CK generative UI).
4. HITL publish ([`04-assistant-ui-mastra-hitl.md`](04-assistant-ui-mastra-hitl.md) patterns).

**Events playbook:** [`../examples/domains/02-events-hosting.md`](../examples/domains/02-events-hosting.md).
