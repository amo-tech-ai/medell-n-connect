---
doc_id: REAL-ESTATE-INDEX
title: Real estate V2 — topological build order
version: 1.0
date: 2026-05-15
---

# Real estate — build order (RE-001 → RE-040)

Single global spine: each task lists one predecessor in YAML `implementation_predecessor` / `dependencies[0]`.

| # | ID | Phase | Title | Predecessor |
|---|-----|-------|-------|-------------|
| 001 | RE-001 | CORE | Seed 25 verified listings | — |
| 002 | RE-002 | CORE | Admin auth guards on `/admin/*` | RE-001 |
| 003 | RE-003 | CORE | Public contact → landlord inbox / lead | RE-002 |
| 004 | RE-004 | CORE | Rentals edge + UI API contract sync | RE-003 |
| 005 | RE-005 | CORE | Commerce RLS review (leads, showings, pay) | RE-004 |
| 006 | RE-006 | CORE | Unified lead-capture edge | RE-005 |
| 007 | RE-007 | CORE | Places proxy + field-mask registry | RE-006 |
| 008 | RE-008 | CORE | places_cache migration + TTL | RE-007 |
| 009 | RE-009 | CORE | Showings / applications schema verify | RE-008 |
| 010 | RE-010 | CORE | Mastra storage + Supabase auth wire | RE-009 |
| 011 | RE-011 | CORE | Intake FilterJson ↔ DB query parity | RE-010 |
| 012 | RE-012 | CORE | Rental filter + RLS negative tests | RE-011 |
| 013 | RE-013 | MVP | Concierge / rentals → Mastra SSE | RE-012 |
| 014 | RE-014 | MVP | rental-search-workflow ≤5 cards + pins | RE-013 |
| 015 | RE-015 | MVP | Showing scheduler E2E | RE-014 |
| 016 | RE-016 | MVP | Application wizard + landlord summary | RE-015 |
| 017 | RE-017 | MVP | Stripe rental webhook + idempotency | RE-016 |
| 018 | RE-018 | MVP | booking-create edge | RE-017 |
| 019 | RE-019 | MVP | Landlord dashboard MVP | RE-018 |
| 020 | RE-020 | MVP | Admin listing moderation queue | RE-019 |
| 021 | RE-021 | MVP | Renter→landlord smoke E2E | RE-020 |
| 022 | RE-022 | MVP | First paid booking gate | RE-021 |
| 023 | RE-023 | POST_MVP | Deprecate edge ai-router (rentals) | RE-022 |
| 024 | RE-024 | POST_MVP | rental-search Places enrich step | RE-023 |
| 025 | RE-025 | POST_MVP | neighborhood-intelligence workflow | RE-024 |
| 026 | RE-026 | POST_MVP | Maps attribution on listing cards | RE-025 |
| 027 | RE-027 | POST_MVP | Rental eval golden set (50 queries) | RE-026 |
| 028 | RE-028 | POST_MVP | Mastra memory field audit | RE-027 |
| 029 | RE-029 | POST_MVP | Hermes offline ranking job | RE-028 |
| 030 | RE-030 | POST_MVP | Lease review workflow (propose-only) | RE-029 |
| 031 | RE-031 | POST_MVP | Lifestyle scores persist on listings | RE-030 |
| 032 | RE-032 | POST_MVP | Bilingual lease disclaimer UX | RE-031 |
| 033 | RE-033 | ADVANCED | Paperclip approval + budget gate | RE-032 |
| 034 | RE-034 | ADVANCED | OpenClaw sandbox WhatsApp intake | RE-033 |
| 035 | RE-035 | ADVANCED | OpenClaw approved template sends | RE-034 |
| 036 | RE-036 | ADVANCED | Hermes weekly market snapshot | RE-035 |
| 037 | RE-037 | ADVANCED | Postiz listing promotion pilot | RE-036 |
| 038 | RE-038 | ADVANCED | Rentals scope in `npm run floor` | RE-037 |
| 039 | RE-039 | ADVANCED | Concurrent lead / checkout load test | RE-038 |
| 040 | RE-040 | ADVANCED | Multi-city expansion playbook | RE-039 |

**Folders:** `tasks/real-estate/V2-tasks/{core,mvp,post-mvp,advanced}/`

**Process:** `/process-task RE-NNN` via `mde-task-lifecycle` when prompt files exist under `tasks/prompts/`.
