# Diagrams — mdeai platform

Per [`.claude/skills/mermaid-diagrams/`](../../.claude/skills/mermaid-diagrams/). Mermaid sources for tasks, ADRs, and onboarding.

**Audit (2026-05-21):** [`AUDIT-2026-05-21.md`](./AUDIT-2026-05-21.md) — not 100% correct before fixes; **~92/100** after v7 alignment pass.

**Canonical planning:** [`plan/prd/`](../prd/README.md) v7 — not `_legacy/`.

| File | What it shows | Canon doc |
|------|---------------|-----------|
| [01-system-architecture.md](./01-system-architecture.md) | Phase-1 topology (live vs planned) | `prd/02`, `prd/03` |
| [02-roberto-event-flow.md](./02-roberto-event-flow.md) | Host wizard + HITL sequence | `prd/05` |
| [03-camila-chat-flow.md](./03-camila-chat-flow.md) | Router + rental-search + MapContext | `prd/04`, `prd/06` |
| [04-event-publishing.md](./04-event-publishing.md) | Publish → ticket → wallet | `prd/05` |
| [05-camila-buy-ticket.md](./05-camila-buy-ticket.md) | Stripe checkout + webhook (parallel) | `prd/05` |
| [06-openclaw-integration.md](./06-openclaw-integration.md) | OpenClaw Phase 2+ (not MVP) | `advanced.md` |
| [07-deployment.md](./07-deployment.md) | Vercel + cutover gates | `prd/09` |
| [08-week-1-bootstrap.md](./08-week-1-bootstrap.md) | F01–F06 deps (Done) | `prd/10`, F01–F06 |

**Convention:** ` ```mermaid ` blocks only; title + 1–2 line context above.

**When to update:** Any change to agent roster, MAP-001, or MVP exit — same PR as code or plan.
