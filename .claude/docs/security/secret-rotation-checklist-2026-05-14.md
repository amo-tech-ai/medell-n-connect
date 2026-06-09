---
title: Secret rotation checklist — 2026-05-14
description: Tracks the rotation of secrets found in `.claude/settings.local.json` permission rules during the 2026-05-14 cleanup phase. Human-driven; do NOT automate.
category: security
status: Open
auditor: Claude Code Opus 4.7 (1M context)
discovered: 2026-05-14
---

# Secret rotation checklist — 2026-05-14

> **Source incident.** Three classes of plaintext secrets were embedded inside
> permission allow-rules in `.claude/settings.local.json` (canonical + two worktree
> copies). All occurrences were redacted on disk via regex match — the value never
> appeared in transcripts. **Rotation is still required** because the redacted
> values lived on disk for an unknown duration before discovery.
>
> File is gitignored (`/home/sk/.config/git/ignore` line 1). The Google API key
> never reached tracked history; the GitHub PAT reached two commits on a local-only
> branch — see §3 below.

## 0. Hard rules

- **Never paste secrets** into `.claude/settings.local.json` permission rules.
- **Never paste secrets** into any markdown, doc, or skill in this repo.
- Production secrets live in **Infisical only** (source of truth at `localhost:80`).
  Vercel + Supabase pull from Infisical via sync.
- This document never quotes a secret value — only patterns and instructions.

## 1. Google API keys (2 distinct keys flagged)

The redacted Google keys were used in cURL permission rules for both
`generativelanguage.googleapis.com` (Gemini) and `maps.googleapis.com` (Maps).

### Steps

- [ ] **Identify both keys.** Google Cloud Console → APIs & Services → Credentials.
      Two keys are flagged: one for Gemini calls, one for Maps JS/Web Service.
- [ ] **Regenerate each key** (⋮ → Regenerate key). The old value becomes invalid.
- [ ] **Re-apply restrictions** on the new keys:
  - Maps key: HTTP-referrer for `https://www.mdeai.co/*`,
    `https://mdeai-git-*.vercel.app/*`, and `http://localhost:8080/*`.
    API allowlist: Maps JS, Places, Directions, Geocoding only.
  - Gemini key: server-side only; restrict to Generative Language API.
- [ ] **Store new values in Infisical** under `mdeai/prod` and `mdeai/dev`:
      `GOOGLE_MAPS_API_KEY`, `GEMINI_API_KEY`. Sync to Supabase Edge Function
      secrets and Vercel env via the existing App Connections.
- [ ] **Verify Maps loads in production**: visit `https://www.mdeai.co/explore`,
      open browser devtools → Network → confirm `maps.googleapis.com/maps/api/js`
      returns 200 with the new key referenced.
- [ ] **Verify Gemini works**: call `/ai-router` edge function in preview, confirm
      `200 success: true` in the response envelope.
- [ ] **Never paste the new key** into `.claude/settings.local.json`. Use wildcard
      patterns instead: `Bash(curl * Authorization: Bearer * *)`.

## 2. GitHub Personal Access Token

The redacted PAT appeared in `git ls-remote` and `git push` permission rules.

### Steps

- [ ] **Revoke immediately.** https://github.com/settings/tokens → find the token
      with prefix `ghp_bZTn…` (40 chars) → Delete. If unsure which one, revoke all
      classic PATs and reissue fresh fine-grained tokens for known consumers.
- [ ] **Check the audit log.** https://github.com/settings/security-log — filter
      to the date the PAT was first known to exist; look for unexpected clones,
      branch creations, or token uses from unfamiliar IPs.
- [ ] **Reissue if needed.** Prefer fine-grained PAT scoped only to
      `amo-tech-ai/mdeai`. Minimum scopes: `contents:write`, `pull-requests:write`.
      OIDC is preferred over a long-lived PAT for CI flows.
- [ ] **Store new PAT in Infisical** under a per-purpose name
      (`MDEAI_DEPLOY_PAT` or similar). Never in `.env`.

## 3. Local-only branch cleanup

The PAT also reached two commits on a local-only branch.

- **Commits:** `fc8ac3e`, `2753344` ("Document patched Codex Linux installer", 2026-05-01).
- **File containing the PAT:** `tasks/plan/07.md` (no longer present in `main`).
- **Branch:** `fix/chat-production-hardening` (LOCAL ONLY).
- **`origin/main` reachable?** Confirmed **NO** via
  `git merge-base --is-ancestor fc8ac3e origin/main` → false.

### Decision tree

- [ ] **Branch is abandoned →** delete it locally:
      ```bash
      git branch -D fix/chat-production-hardening
      ```
      No history rewrite needed; the commits become unreachable and will be GC'd.

- [ ] **Branch is still needed →** rewrite history BEFORE pushing:
      ```bash
      git checkout fix/chat-production-hardening
      pip install git-filter-repo  # or apt install git-filter-repo
      git filter-repo --path tasks/plan/07.md --invert-paths
      git checkout -b fix/chat-production-hardening-clean
      # Verify the PAT is gone from history:
      git log -G 'ghp_[A-Za-z0-9]{30,40}' --all
      # Only THEN push:
      git push -u origin fix/chat-production-hardening-clean
      ```
      Do **not** push the original branch name.

- [ ] **Push history was checked.** Run
      `git reflog --date=iso fix/chat-production-hardening` and inspect for any
      remote-push entries. If the branch was ever pushed (even briefly), treat
      the PAT as exposed — finish the revoke + audit-log review in §2.

## 4. JWT-shaped tokens (12 per file)

Twelve `eyJ…eyJ…sig` tokens were redacted from each settings.local.json copy —
likely short-lived Supabase access tokens stored inside saved curl commands.

- [ ] **No action required if already expired.** Supabase access tokens are
      short-lived (default 1 h). Check the `exp` claim of a sample
      (decode at `jwt.io` against the redaction backup if needed) — if all are past
      `exp`, no rotation needed.
- [ ] **If any are still valid** (anon key, service role key, etc.) → rotate in
      Supabase dashboard → Settings → API. Sync new values via Infisical.

## 5. Verification commands (run after rotation)

```bash
# A. Confirm settings.local.json is clean.
node -e '
const fs=require("fs");
const re=/AIzaSy[A-Za-z0-9_-]{30,40}|ghp_[A-Za-z0-9]{30,40}|sk_(live|test)_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9]{20,}|eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g;
for (const f of [
  "/home/sk/mde/.claude/settings.local.json",
  "/home/sk/mde/.claude/worktrees/agitated-torvalds-2259f2/.claude/settings.local.json",
  "/home/sk/mde/.claude/worktrees/nervous-northcutt-7a51d0/.claude/settings.local.json",
]) {
  const n=(fs.readFileSync(f,"utf8").match(re)||[]).length;
  console.log(f, "secret matches:", n);
}'
# Expected: 0 for every file.

# B. Confirm no AIzaSy / ghp_ in tracked git history.
git log --all --full-history -G 'AIzaSy[A-Za-z0-9_-]{30,40}' --oneline   # expect empty
git log --all --full-history -G 'ghp_[A-Za-z0-9]{30,40}' --oneline       # expect empty AFTER §3 cleanup

# C. Confirm gitignore covers settings.local.json.
git check-ignore -v .claude/settings.local.json   # expect a match line

# D. Smoke: Maps loads on prod.
curl -fsSL "https://www.mdeai.co/" -o /dev/null -w "%{http_code}\n"   # expect 200

# E. Smoke: Gemini routing returns 200 in preview.
# (Use the deployed preview URL; do NOT paste the new key here.)
```

## 6. When this checklist can be marked Done

All three apply:
- All boxes above checked.
- `.claude/settings.local.json` and both worktree copies still pass §5.A scan after
  one normal session of work (proves nobody re-pasted a key into permission rules).
- `git log -G '<pattern>' --all` returns empty for every pattern.

Move this file to `.claude/docs/security/_archive/secret-rotation-checklist-2026-05-14-done.md`
once complete. Add the closure date and the new key fingerprints (first 4 chars only).
