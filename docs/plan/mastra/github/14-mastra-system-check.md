---
title: GitHub — mastra-system-check (audit skill)
repo: https://github.com/goldk3y/mastra-system-check
score: 82
traffic: green
personas: [Sofía, Lucía]
journeys: [J8, J12]
---

# mastra-system-check

## At a glance

| | |
|---|---|
| **What it is** | Claude Code **skill** (not runtime code): **66 rules** in 10 categories — config, agents, workflows, memory, tools, prompts, security, performance. |
| **Purpose** | Pre-flight **lint for Mastra projects** before merge or “Done” — complements [`../../.claude/skills/task-verifier/`](../../.claude/skills/task-verifier/). |
| **Goals** | Catch missing storage, wrong model format, workflows without `.commit()`, empty `RequestContext`, security processor order. |
| **What it does** | `npx mastra-system-check` or install to `~/.claude/skills/`; triggers on “validate mastra”, “production checklist”. |
| **Benefits** | Sofía gets consistent agent/workflow review without re-deriving rules from Mastra docs each PR. |
| **mdeai** | **Adopt the skill** with an **mdeai overlay** (Gemini, CopilotKit route, no OpenAI defaults, RLS). |

**Not** UI components — **quality gate tooling only.**

---

## Score: 82/100 🟢

| Factor | Pts | Note |
|--------|-----|------|
| Revenue | 18 | Indirect — prevents broken `/api/copilotkit` |
| CK / Pattern 1 | 20 | Needs custom rules for `route.ts` + agent name match |
| Gemini / Supabase | 22 | Override OpenAI-centric examples in rules |
| Copy cost | 12 | `npx` install, low |
| Breadth | 10 | 10 categories align with `mdeapp/src/mastra/` |

---

## Quality assessment

| Aspect | Verdict |
|--------|---------|
| **Maintainer maturity** | Small repo (~10 stars) but focused scope, versioned (1.1.0), MIT |
| **Rule depth** | High — mirrors official Mastra failure modes (storage, `.commit()`, `provider/model`) |
| **mdeai fit** | **High as process** — poor as blind copy-paste (OpenAI examples in fixes) |
| **vs task-verifier** | Complementary: system-check = Mastra structure; task-verifier = task spec + localhost proof |

---

## Learn → adapt for mdeai

### Install (optional)

```bash
npx mastra-system-check
# or
curl -fsSL https://raw.githubusercontent.com/goldk3y/mastra-system-check/main/install.sh | bash
```

### mdeai overlay checklist (add to run after system-check)

| mastra-system-check rule | mdeai override |
|--------------------------|--------------|
| `openai/gpt-4o` model format | `google/gemini-3.5-flash` via [`mdeapp/src/mastra/lib/models.ts`](../../../mdeapp/src/mastra/lib/models.ts) |
| LibSQL file DB | F13 → **Postgres** same project as Supabase |
| Mastra server prod | **Pattern 1** — `mdeapp/src/app/api/copilotkit/route.ts` only |
| Agent registry | Keys must match `useCoAgent({ name })` kebab ids |
| Service role | **Never** in `mdeapp/src/**` — edge functions only |
| Tools | `search-rentals` must use RLS client, field masks on Places |
| Observability | Conditional — align with `ai_runs` + Studio traces |

### Quick four checks (from upstream README — still valid)

1. `storage:` in `mastra/index.ts` → F13 Postgres path  
2. `GOOGLE_GENERATIVE_AI_API_KEY` in env — not only `OPENAI_API_KEY`  
3. Models use `google/gemini-3.5-flash`  
4. Workflows registered in `mdeapp/src/mastra/workflows/` and committed per Mastra API  

---

## Domain use cases

| Domain | How the skill helps |
|--------|---------------------|
| Rentals | `tool-*.md` rules → Zod on `search-rentals`, error handling |
| Events | `workflow-*.md` + HITL — CK publish path documented separately |
| Restaurants | `agent-*.md` — concierge tool descriptions |
| Maps | `security-*.md` — no secrets in tool payloads |
| Contests | — |

---

## User stories

**Sofía:** As Sofía, before marking F02–F13 Done, I run “Mastra system check on `mdeapp/`” plus mdeai overlay so we never ship wrong model id or missing storage.

**Lucía:** As Lucía, I map CRITICAL/HIGH findings to Playwright gaps (e.g. tool not registered → J8 fails).

**Patricia:** As Patricia, security category prompts PII processors before long `/chat` threads (Phase 2).

---

## Journey — J12 + J8 gate

1. PR touches `mdeapp/src/mastra/**`.
2. Run mastra-system-check (Claude skill or manual rule pass).
3. Apply mdeai overlay table above.
4. `npm run build` + J8 Playwright on `/api/copilotkit`.
5. task-verifier evidence for Done.

**Evals:** [`../examples/evals/04-running-in-ci.md`](../examples/evals/04-running-in-ci.md).

---

## Do not assume

- Skill knows CopilotKit — it does **not**; read [`01-copilotkit-mastra-integration.md`](01-copilotkit-mastra-integration.md).
- All 66 rules apply in Phase 1 — observability rules are **conditional** per upstream docs.

**Source:** [goldk3y/mastra-system-check](https://github.com/goldk3y/mastra-system-check)
