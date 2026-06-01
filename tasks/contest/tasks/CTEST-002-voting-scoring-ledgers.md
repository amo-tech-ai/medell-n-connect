---
id: CTEST-002
title: Voting and judge scoring ledgers
status: Draft
priority: P0
phase: Contest trust foundation
effort: 2-3d
depends_on:
  - CTEST-001
skill:
  - mde-supabase
docs:
  - ../docs/01-mermaid-diagrams.md
  - ../../../plan/contests/docs/13-security-checklist.md
repo_refs:
  - /home/sk/mdeai/github/contest/helios-server
---

# CTEST-002 — Voting And Judge Scoring Ledgers

## Goal

Create the deterministic voting and scoring truth layer. AI may summarize anomalies, but it never inserts, edits, deletes, or overrides vote/scoring truth.

## Tables / RPCs

| Object | Purpose |
|---|---|
| `voting_windows` | Vote type, start/end, round, weight, limits. |
| `vote_tokens` | Signed/hashed eligibility or share tokens. |
| `vote_ledger` | Append-only canonical votes. |
| `vote_receipts` | Public-safe receipt hash/tiny id. |
| `vote_fraud_signals` | Deterministic anomaly records. |
| `vote_reviews` | Human review decisions. |
| `judge_panels` | Judge assignments. |
| `judge_scores` | Append-only submitted scores. |
| `score_formulas` | Versioned formulas/weights. |
| `score_snapshots` | Locked leaderboard/final results. |
| `submit_contest_vote()` | Validates and inserts one vote. |
| `submit_judge_score()` | Validates and inserts one score. |
| `lock_score_snapshot()` | Creates deterministic snapshot. |

## Pattern Sources

| Repo | Use |
|---|---|
| Helios Server | Vote hash, voter hash, freeze/tally concepts. |
| OpenStreamPoll | Live QR/vote UX later, not official vote security. |

## Acceptance Criteria

- [ ] Vote ledger rows are append-only.
- [ ] Closed voting window rejects votes.
- [ ] Duplicate vote token/session/user rule rejects correctly.
- [ ] Paid vote credits cannot be minted here; CTEST-003 owns payment-derived credits.
- [ ] Judge score locks prevent post-submit mutation.
- [ ] Winner snapshot is deterministic SQL from locked inputs.
- [ ] AI has read-only access through safe views, not write access.

## Tests / Proof

- [ ] SQL: insert valid free vote through RPC.
- [ ] SQL: duplicate vote rejected.
- [ ] SQL: late vote rejected.
- [ ] SQL: direct insert denied for anon/authenticated non-service role.
- [ ] SQL: score formula snapshot matches expected result.
- [ ] Audit proof: vote and score events create audit rows.

## Do Not Do

- Do not implement public voting UI yet.
- Do not implement Helios cryptography in MVP.
- Do not let AI determine winners.
