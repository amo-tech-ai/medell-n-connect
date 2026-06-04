# Worktree organization — v0.4.0 (2026-06-04)

> **TL;DR**  
> Keep **`mde-worktree-pr-flow`**. Run **3 guards** before every new worktree. Split **mdeai** (docs) vs **mdeapp** (code) into separate trees/PRs. Use **june-4 slices** for the dirty planning repo.

---

## What we did

| Add | Script | Why |
|-----|--------|-----|
| 🔴 Gitignore hard fail | `guard-gitignore-worktrees.sh` | Stops `.worktrees/` 3 GB leak |
| 🟡 No nested trees | `guard-worktree-context.sh` | `GIT_DIR ≠ GIT_COMMON` → don't `worktree add` again |
| 🟡 Weekly tidy | `tidy-worktrees.sh` | `fetch --prune` + `worktree prune` |

**Docs:** `.agents/skills/mde-worktree-pr-flow/references/worktree-safety-v040.md`  
**Skipped:** replacing skill, submodule managers, merge-expert packs.

**Optional:** [linear-worktree](https://www.skills.sh/mblode/agent-skills/linear-worktree) sibling dirs — not required; we use `.worktrees/wt-san-NNN-slug`.

---

## Before every new worktree

```bash
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh
bash .agents/skills/mde-worktree-pr-flow/scripts/guard-worktree-context.sh
bash .agents/skills/mde-worktree-pr-flow/scripts/verify-clean.sh
```

---

## Two repos — don't mix

| Repo | Remote | Work here for |
|------|--------|----------------|
| `/home/sk/mdeai` | `mdeai` | `tasks/`, `plan/`, `sitemap.md` |
| `/home/sk/mdeapp` or `mde-wt-search-clean` | `mdeapp` | `src/`, tests, Supabase |

**One worktree · one goal · one PR** per repo.

---

## Dirty planning tree → june-4 slices

See `tasks/commit/june-4/COMMIT-PLAN.md` — slices 3–6 still pending (plan move, tasks import, MCP, scripts).

---

## Suggested layout (going forward)

```text
/home/sk/mdeai/                    # planning main or docs branch
  .worktrees/wt-san-546-ops-journey/   # next docs-only slice

/home/sk/mde-wt-search-clean/      # mdeapp main @ ae9a1e6
  OR mdeapp/.worktrees/wt-san-XXX/     # next app feature
```

Remove prunable trees after backup: `tidy-worktrees.sh` then `audit-worktrees.sh`.
