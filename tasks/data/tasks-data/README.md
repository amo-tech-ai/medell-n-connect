# Data tasks (MVP steps 01–25)

Build **in order**. **Canonical folder:** `tasks/data/tasks-data/`. Auth: [`INDEX.md`](INDEX.md).

**Live audit:** [`../audit-supabase.md`](../audit-supabase.md) · **Plan:** [`../supabase-plan.md`](../supabase-plan.md) · **Index:** [`INDEX-data.md`](INDEX-data.md)

**Linear:** [Data view](https://linear.app/sanjiovani/view/data-54425dec37b9) — filter `label:track:data` · titles `DATA-### — …` · SAN-325 = DATA-001 … SAN-359 = DATA-033 · resync [`scripts/linear-import-data-tasks.mjs`](../../../scripts/linear-import-data-tasks.mjs)

| Step | File | Domain | Priority |
|------|------|--------|----------|
| 01–08 | data-001 … data-008 | Venues + cache | P0–P1 |
| 09–11 | data-009 … data-011 | Venue migrations + security | P0–P1 |
| 12–18 | data-012 … data-018 | Events schema | P0–P2 |
| 19–25 | data-019 … data-025 | **Rentals schema** | P0–P2 |
| 26–32 | data-026 … data-032 | **Trips schema** | P0–P2 |
| 33–34 | data-033 … data-034 | **Maps schema** | P1–P2 |

## Dependency graph

```text
data-001 → data-002 → data-009 (venues M1–M3 incl. rental price_daily indexes)
data-001 → data-012 (events) → data-013/016/018
data-001 → data-019 (rentals) → data-020 → data-021
data-001 → data-026 (trips) → data-027 → data-029 → data-028
data-026 → data-030 (golden queries)
data-026 → data-031/032 (P2 indexes)
data-001 → data-034 (maps geo inventory) → data-009 / MAP-012
data-033 (route_cache) → MAP-011
MAP-005 → data-007 (cache hit-rate audit) → data-008
data-019 → data-023 (rental golden queries; after data-009 M3)
data-019 → data-022/024/025 (P2)
data-001 → data-007 → data-008
VEC-001 · EVP-003 · AUTH-* · TRIP-* · MAP-005+ (parallel)
```

## Skills

| Skill | Use for |
|-------|---------|
| `mde-supabase` | migrations, RLS, edge fn audit |
| `mde-task-lifecycle` | phase gates |
| `task-verifier` | Done evidence |
| `pgvector` | VEC-001 with data-001 |
