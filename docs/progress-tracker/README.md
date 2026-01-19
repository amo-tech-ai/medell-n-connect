# Progress Tracker

This is the **single source of truth** for all prompts, tasks, and implementation progress.

## Purpose

- Track every prompt and its implementation status
- Link tasks back to their parent prompts
- Provide a clear view of project progress

## Status Options

| Status | Meaning |
|--------|---------|
| `todo` | Not started |
| `doing` | In progress |
| `blocked` | Waiting on dependency |
| `done` | Completed |

## Rules

1. **Every prompt must be listed** in the progress tracker
2. **Every task must link** back to a prompt
3. **This file is the only tracker** — no other tracking systems

## Files

- [progress.md](./progress.md) — The actual tracker table

## Related

- [Prompts](../prompts/README.md) — Feature specifications
- [Rules](../../rules/README.md) — Build constraints
