# Pre-push secret checklist

Run this **every time before adding a remote or pushing** the workspace repo
(`/home/sk/mdeai`). This repo holds planning docs, audits, and evidence — and a real
Google Maps key once leaked into a committed audit file here. The steps below make a
repeat impossible to do silently.

> Rule of thumb: the repo may only leave this machine **after the scan passes and the
> remote is confirmed private.**

## The checklist

- [ ] **1. Run the secret scan — must exit 0.**
  ```bash
  bash scripts/verify-no-secrets.sh
  echo "exit=$?"   # expect: exit=0  and  "✓ PASS"
  ```
  A non-zero exit prints the offending `file:line` (value masked). Remove the secret,
  scrub history if it was ever committed (step 5), and re-run until it passes.

- [ ] **2. Confirm `.env*` is ignored (never committed).**
  ```bash
  git check-ignore -v .env .env.local .env.production   # each prints a .gitignore rule
  git ls-files | grep -E '(^|/)\.env($|\.)' || echo "OK: no .env* tracked"
  ```

- [ ] **3. Confirm `.claude/` and `.agents/` are ignored.**
  These hold `mde-maps` reference docs scraped from Google, which embed **real** Maps
  API keys. They must stay untracked until scrubbed.
  ```bash
  git check-ignore -v .claude .agents      # both print a .gitignore rule
  git ls-files | grep -E '^\.(claude|agents)/' || echo "OK: neither tracked"
  ```

- [ ] **4. Confirm no Google key (`AIza<35 chars>`) in tracked files.**
  ```bash
  git grep -lE 'AIza[0-9A-Za-z_-]{35}' && echo "✗ FOUND — stop" || echo "OK: none tracked"
  ```

- [ ] **5. Confirm no secret survives in git history (every blob, reachable + dangling).**
  Prints a **count only** — never the secret value. Expect `0`.
  ```bash
  git cat-file --batch-all-objects --batch-check='%(objectname) %(objecttype)' \
    | awk '$2=="blob"{print $1}' \
    | git cat-file --batch 2>/dev/null \
    | grep -acE 'AIza[0-9A-Za-z_-]{35}|(sk|rk)_live_[0-9A-Za-z]{16,}'
  git fsck --full --unreachable 2>&1 | grep -i dangling || echo "OK: no dangling objects"
  ```
  If the count is non-zero: the key is in history. Redact the file, then
  `git commit --amend` (or `git filter-repo`), `git reflog expire --expire=now --all`,
  `git gc --prune=now`, and re-run this step until it reports `0`.

- [ ] **6. Push only to a PRIVATE remote.**
  This repo is intended to be local-only or backed up to a **private** remote. Before
  the first push, confirm the remote is private:
  ```bash
  git remote -v                              # review the URL
  gh repo view <owner>/<repo> --json visibility -q .visibility   # expect: PRIVATE
  ```
  Never push to a public remote. If unsure, do not push — ask the repo owner.

## Notes

- The scan deliberately matches secret **value shapes**, not env-var **names**. Docs
  that mention `DATABASE_URL` or `SUPABASE_SERVICE_ROLE` as prose are fine; only real
  values (keys, JWTs, live Stripe keys, remote DB URLs with passwords) fail it.
- Local/docker `DATABASE_URL` examples (`localhost`, `127.0.0.1:54322`, docker-service
  `postgres`) are allowed — they carry no production blast radius.
- Key rotation is **deferred by owner decision** (2026-06-01). This checklist is the
  compensating control: as long as the leaked key never re-enters git or a remote, and
  the Google Cloud restrictions hold (see `google-maps-key-restrictions.md`), the
  exposure stays contained without rotating.
