---
id: CTEST-001
title: Supabase contest core schema and RLS
status: Draft
priority: P0
phase: Contest data foundation
effort: 1-2d
depends_on:
  - CTEST-000
skill:
  - mde-supabase
docs:
  - ../docs/MVP-SCOPE.md
  - ../docs/01-mermaid-diagrams.md
---

# CTEST-001 — Supabase Contest Core Schema And RLS

## Goal

Add the deterministic contest/event/contestant data model before UI or AI workflows.

## Tables

| Table | Purpose | RLS |
|---|---|---|
| `contest_orgs` | Organizer tenant/group settings | Org members/admins |
| `contest_memberships` | Organizer/admin/staff role membership | User can read own; admin manages |
| `contests` | Contest shell, rules summary, status | Public read when published; org write |
| `contest_rounds` | Rounds, categories, scoring windows | Public read when published |
| `contestants` | Contestant profile, status, division | Public read when approved |
| `contestant_assets` | Photos/docs/media metadata | Approved media public; docs private |
| `contestant_social_links` | Share handles and UTM sources | Public subset only |
| `contest_events` | Finals/rehearsal/interview events | Public published read |
| `contest_audit_events` | Append-only non-ledger audit | Admin/org read |

## Files / Modules

| Area | Expected path |
|---|---|
| Migration | `mdeapp/supabase/migrations/<timestamp>_contest_core.sql` |
| Generated types | Existing Supabase type workflow if present |
| Docs/evidence | `tasks/contest/notes/CTEST-001-evidence.md` |

## Supabase Rules

- Every new table has RLS enabled.
- Every exposed table has at least one policy.
- RLS policies use `(SELECT auth.uid())` where user id is referenced.
- Service-role writes stay server-only.
- Public reads expose only published/approved records.
- Contestant private docs are not exposed through public storage policies.

## Acceptance Criteria

- [ ] Migration creates all core tables.
- [ ] RLS enabled on every table.
- [ ] Policies cover anonymous, contestant, organizer, judge/staff, and admin access as applicable.
- [ ] Status columns support `draft`, `review`, `published`, `closed`, `archived`.
- [ ] `contest_audit_events` records sensitive create/update/publish actions.

## Tests / Proof

- [ ] SQL proof: table list.
- [ ] SQL proof: `pg_policies` rows for each table.
- [ ] Negative proof: anon cannot read drafts.
- [ ] Negative proof: contestant cannot edit another contestant.
- [ ] Positive proof: published contest and approved contestant are publicly readable.

## Do Not Do

- Do not add voting/payment tables here.
- Do not add pgvector until SQL search is proven.
- Do not allow direct client writes to audit tables.
