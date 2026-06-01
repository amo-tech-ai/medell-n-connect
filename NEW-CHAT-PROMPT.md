# New chat session prompt — mdeai

> Copy the block below into the new chat. Start the chat with the working directory set to **`/home/sk/mdeai/`** (NOT `/home/sk/mde/` — that's legacy frozen).

---

## Quick-start (paste this into the new chat)

```
I'm working in /home/sk/mdeai/ on the new mdeai app (CopilotKit 1.55.2 + Mastra + Supabase + Gemini 3.5 Flash). Phase 1, Week 1.

Read these BEFORE doing anything else (in order):

1. /home/sk/mdeai/SESSION-NOTES-2026-05-19.md  ← 5-min hand-off; full state of play
2. /home/sk/mdeai/CLAUDE.md                    ← project rules + Gemini model registry + MCP cadence
3. /home/sk/mdeai/plan/prd.md                  ← PRD v6.0 index (10 chunks under plan/prd/)
4. /home/sk/mdeai/tasks/INDEX.md               ← current task status (F01 In Progress, F01b Done, F02–F06 Not Started)
5. /home/sk/mdeai/plan/audit/03-plan-audit.md  ← latest audit (96/100 spec, 42/100 execution)

Then confirm you understand:
- App path is /home/sk/mdeai/mdeapp/ (NOT /home/sk/mde/ which is legacy frozen).
- CopilotKit pinned at 1.55.2 (NOT v2 — Mastra integration only documented at this version).
- Gemini model is gemini-3.5-flash (released 2026-05-19; supersedes 2.5-flash). Env var: GOOGLE_GENERATIVE_AI_API_KEY.
- Working memory uses scope: "thread" (matches the official example verbatim).
- Mastra agent name is pingAgent in W1 (W3+ adds hostEventAgent, etc.). The current example still has weatherAgent on disk — that's the F02 work.
- Supabase project zkwcbyxiwklihegjhuql is REUSED from legacy. Same 122 tables, RLS-tight.

The 6 foundation tasks (F01–F06) are specified at /home/sk/mdeai/tasks/core/. Week 1 wall-clock: ~2.5 hours.

Next action: I want to execute F01 disk strip + F02 + F03 + F04 + F05 in sequence to boot a Spanish "hola" echo from Gemini.

Do NOT:
- Write code in /home/sk/mde/ (legacy is frozen).
- Use gemini-2.0-flash-exp or gemini-2.5-flash (deprecated/superseded — use 3.5-flash).
- Use @ai-sdk/openai (we use @ai-sdk/google with the Gemini SDK).
- Use v2 CopilotKit hooks (useFrontendTool) — use v1 (useCopilotAction, <CopilotKit>, useCoAgent).
- Run `claude mcp` without telling me — the copilotkit-mcp endpoint is currently down.
- Skip the RLS-gate hook check at end of any turn (paste an MCP query result).

Verify the 22-skill Phase 1 pack is loaded and you have access to the working MCPs (gemini-api-docs-mcp, mastra, supabase, google-maps-code-assist). Then ask me which option to start with (A, B, or C from SESSION-NOTES §8).
```

---

## Why this prompt format

| Why | Detail |
|---|---|
| **Folder explicit** | New chat's working directory matters — without specifying `/home/sk/mdeai/`, an autoload of `/home/sk/mde/CLAUDE.md` could send the new session down the legacy path. |
| **Read order matters** | SESSION-NOTES first (5 min context), then CLAUDE.md (rules), then PRD (architecture), then tasks (what to do). Reverses the temptation to skim PRD first. |
| **Hard rules upfront** | The five `Do NOT` lines pre-empt the most likely mistakes based on findings from this session's audits. |
| **Explicit next action** | Removes ambiguity. The new chat shouldn't re-derive what to do. |
| **Confirmation gate** | Asks the agent to verify pins + MCPs before doing anything destructive. |

---

## Pre-flight checklist before pasting

Before opening the new chat, confirm on disk:

- [ ] `/home/sk/mdeai/SESSION-NOTES-2026-05-19.md` exists (was just written)
- [ ] `/home/sk/mdeai/CLAUDE.md` exists with Gemini 3.x registry
- [ ] `/home/sk/mdeai/tasks/INDEX.md` shows F01 = In Progress, F01b = Done
- [ ] `/home/sk/mdeai/mdeapp/package.json` exists with Next.js `16.2.6` + CopilotKit `1.55.2` pins
- [ ] Working directory set to `/home/sk/mdeai/` (not `/home/sk/mde/`)

If any of these fail, fix them in this session before handing off — don't make the new chat debug your setup.

---

## What the new chat should NOT have to do

- Re-derive the plan (it's in `plan/prd/`)
- Re-grade skills (already done at `plan/audit/02-skills-audit.md`)
- Re-verify model deprecations (already in `CLAUDE.md` Gemini registry)
- Re-establish the v1.55.2 vs v2 decision (PRD §12 callout)
- Re-audit the tasks (already done at `tasks/audit/01-audit.md`)

---

## If the new chat asks questions you can't answer here

It will likely ask the **5 open user decisions** from `plan/prd/10-summary.md` §11 (also in `SESSION-NOTES-2026-05-19.md` §10):

1. GitHub repo name confirmation
2. Vercel project decision
3. Legacy freeze date confirmation
4. `clawg-ui` + `clawpilot` review or defer
5. `/home/sk/mdeai-app/` (half-built sibling): delete / keep / archive

If you don't have answers, tell the new chat "defer all five — start with Option A from session notes §8". That gets F01 → F05 executed without blocking on org decisions.
