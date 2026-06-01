# mdeai — workspace

Planning + execution workspace for the mdeai app (Medellín AI concierge: events, rentals, restaurants, maps). This root directory is the **planning/workspace repo**; the application and its migrations live in a separate nested repo. Read this before doing git work here — the layout is deliberately split across repos.

## Repository architecture

Three distinct git contexts, kept separate on purpose:

| Layer | Path | Repo | Tracks |
|---|---|---|---|
| **Workspace repo** (this one) | `/home/sk/mdeai/` | local-only (`main`) | `tasks/`, `plan/`, `docs/`, planning markdown, audits, evidence |
| **Application repo** | `mdeapp/` | `github.com/amo-tech-ai/mdeapp` | Next.js app `src/`, `e2e/`, **`supabase/migrations/`** |
| **Migration remediation** | `mdeapp/` branch `data/DATA-048-migration-realign` | (in the app repo) | the canonical migration set + DATA-048 prefix realign / split |
| **Live database** | Supabase `zkwcbyxiwklihegjhuql` | — | production schema (source of truth the migrations must reproduce) |

The workspace repo and the app repo are **siblings**, not nested in each other's history. `mdeapp/` is git-ignored here so it is never committed into the workspace repo.

### Where things live
- **DATA migration docs** (DATA-048 prefix realign, DATA-050 out-of-band base tables, evidence) → `tasks/data/` in *this* repo.
- **Migration SQL itself** → `mdeapp/supabase/migrations/` on branch `data/DATA-048-migration-realign` (commit `7f60a84`). The root `supabase` symlink points there and is git-ignored here.
- **Strategy / PRD / audits** → `plan/`.

## Migration branch strategy

All Supabase migration-history work happens on a dedicated `data/*` branch in the **mdeapp** repo, never mixed with UI/feature branches. DATA-048 aligned repo↔remote prefixes and split the tangled `20260524140000` file. DATA-050 (open) backfills migrations for production tables that were created out-of-band (direct SQL, never migration-tracked) so a fresh clone can replay the schema. **No `db push` / `migration repair` runs without explicit human approval** — see `tasks/data/tasks-data/DATA-050-*.md`.

## git-ignored here (and why)

See [.gitignore](.gitignore) for the annotated list. Summary:
- **Secrets** — `.env.local` (real Maps/Gemini/Stripe/Supabase keys).
- **Nested repos** — `mdeapp/`, `CopilotKit/`, `github/`, `.wt-*` worktrees.
- **`supabase` symlink** — real migration tree is in the mdeapp repo.
- **`.claude/` + `.agents/`** — currently held back: their scraped `mde-maps` reference docs embed the project's **real** Google Maps API keys. Track only after scrubbing.
- **Heavy/asset/cache dirs** — `services/`, `screenshots/`, `drafts/`, editor caches.

## Known follow-ups
- This repo is **local-only** — add a private remote for backup (see DATA docs / review notes).
- A real Google Maps key once leaked into a committed console-error audit; it has been redacted. Rotate the key if its exposure window is uncertain.
- Decide whether to version reusable AI workflows (`.claude/skills/`, `.agents/`) after scrubbing the embedded keys.
