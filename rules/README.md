# Rules

Rules are **enforceable constraints** that govern how the platform is built.

## Purpose

Rules ensure consistency, security, and maintainability across the codebase.

## Hierarchy

```
Rules > Prompts
```

If a prompt conflicts with a rule, **the rule wins**.

## Rule Files

| File | Scope |
|------|-------|
| [supabase.md](./supabase.md) | Database, RLS, security |
| [edge-functions.md](./edge-functions.md) | Serverless functions, AI |
| [frontend.md](./frontend.md) | React, UI, state |
| [backend.md](./backend.md) | Data, APIs, consistency |

## Related

- [Prompts](../docs/prompts/README.md) — Feature specifications
- [Progress Tracker](../docs/progress-tracker/progress.md) — Implementation status
