---
title: GitHub — Mastra template text-to-sql
repo: https://github.com/mastra-ai/template-text-to-sql
score: 85
traffic: green
journeys: [J2]
personas: [Camila, Sofía]
---

# template-text-to-sql

## At a glance

| | |
|---|---|
| **What it is** | Agent introspects DB schema, converts natural language → SQL, runs against SQLite sample. |
| **Purpose** | Teaches **structured query tools** — mdeai already does this with **fixed Zod tools**, not free-form SQL. |
| **Goals** | Validate tool design: schema in prompt, parameterized queries, no hallucinated columns. |
| **What it does** | Studio chat → SQL → tabular results. |
| **Benefits** | Informs `search-rentals` / `search-events` parameter design and eval scorers. |
| **mdeai** | **Supabase + RLS** — never expose raw NL2SQL to Camila in Phase 1. |

---

## Score: 85/100 🟢

Conceptual alignment with rental search; **−15** because NL2SQL on prod Supabase is a security risk.

---

## Learn → adapt

| Template lesson | mdeai implementation |
|-----------------|----------------------|
| Schema introspection tool | Static Zod on `search-rentals` inputs |
| Ground answers in query results | `faithfulness` scorer + tool JSON cards |
| Example queries in README | Golden set in [`../examples/evals/`](../examples/evals/00-index.md) |

**Roberto:** Event search uses same pattern — `search-events`, not ad-hoc SQL.

---

## Domain matrix

| Domain | Application |
|--------|-------------|
| Rentals | 🟢 Core — SQL tools today |
| Events | 🟢 `search-events` |
| Restaurants | 🟡 SQL + future Grounding |
| Maps | — |
| Contests | — |

---

## User stories

**Camila:** As Camila, “2BR under $80 in Laureles” maps to **typed filters**, not generated SQL — so RLS always applies.

**Sofía:** As Sofía, I use the template’s example queries as **J12 dataset** rows for `tool-call-accuracy`.

---

## Journey — J2 (mdeai vs template)

| Step | text-to-sql template | mdeai |
|------|----------------------|-------|
| Ask | NL → SQL | NL → `search-rentals` tool args |
| Execute | SQLite | Supabase RPC/query in tool |
| Show | Table in Studio | CopilotKit cards on `/rentals` |

**Playbook:** [`../examples/domains/01-real-estate-rentals.md`](../examples/domains/01-real-estate-rentals.md).
