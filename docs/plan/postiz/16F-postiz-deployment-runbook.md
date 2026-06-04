---
task_id: 16F-postiz-deployment-runbook
title: Postiz on Hostinger — deployment runbook & 502 triage
phase: PHASE-2-MARKETING
priority: P1
status: Not Started
estimated_effort: 0.5 day
area: ops
skill:
  - mde-paperclip
  - postiz
  - mde-hostinger
subagents:
  - mdeai-planner
edge_function: null
schema_tables: []
depends_on:
  - '063-postiz-schedule-posts-edge-fn'
  - '16E-postiz-integration-discovery-cron'
mermaid_diagram: null
---

<!-- task-summary -->
> **What:** Postiz on Hostinger — deployment runbook & 502 triage
> **Why:** The audit (tasks/trio/postiz-paperclip-openclaw-audit.md §1, §7 finding F12) flagged that Postiz is deployed on Hostinger with no documented operations playbook. The 502s observed are reproducible…
> **Tools:** `mde-paperclip` · `postiz` · `mde-hostinger`
> **Success Criteria:**
> - `tasks/hostinger/postiz-runbook.md` exists and covers sections A-G.
> - All `<REDACTED>` placeholders are clearly marked — zero real secrets in the file.
> - Healthcheck one-liner verified against live deploy.
> - Three 502 fixes applied to live `docker-compose.yml` on the VPS (separate change, but refere…
> **PHASE-2-MARKETING · P1 · Not Started · Effort: 0.5 day**
> **Depends on:** 063-postiz-schedule-posts-edge-fn, 16E-postiz-integration-discovery-cron

## Summary

| Aspect | Details |
|---|---|
| **Phase** | PHASE-2-MARKETING |
| **Deliverable** | Documented runbook (markdown) for deploying Postiz on Hostinger VPS, applying TLS, generating an API key, and triaging the 3 most common 502s |
| **Real-world** | Today `postiz-6buz.srv1641664.hstgr.cloud` returns 502 intermittently (audit §1). No one on the team has the documented sequence to bring it back. This runbook fixes that |

## Description

**Why this exists.** The audit (`tasks/trio/postiz-paperclip-openclaw-audit.md` §1, §7 finding F12) flagged that Postiz is deployed on Hostinger with no documented operations playbook. The 502s observed are reproducible (frontend container can outpace backend startup; Redis disconnect kills BullMQ workers; Postgres role drift). Operators currently SSH in and guess.

**What this delivers.** A markdown file `tasks/hostinger/postiz-runbook.md` covering:

### A. First-time deploy (from Hostinger one-click template)

1. Spin up Hostinger Docker template (preconfigured `docker-compose.yml` with postgres + redis + postiz frontend + postiz backend + workers).
2. Copy `.env.example` → `.env`; populate (see §B).
3. Generate `JWT_SECRET` via `openssl rand -base64 64`; set as `JWT_SECRET=` and **also** as `BACKEND_INTERNAL_URL` peer.
4. Run `docker compose up -d` and tail `docker compose logs -f postiz-backend` until `Nest application successfully started`.
5. Browse to `https://${PUBLIC_HOST}` → register first user (becomes super-admin).
6. Generate API key from Settings → Integrations → API → "Generate" — copy once (never displayed again).
7. Store API key in Supabase secrets as `POSTIZ_API_KEY` (header form is raw `Authorization: <key>` — NOT Bearer; see audit §2).

### B. Required env vars (no secrets in this doc — placeholders only)

```
DATABASE_URL=postgresql://postiz:<REDACTED>@postgres:5432/postiz
REDIS_URL=redis://redis:6379
JWT_SECRET=<REDACTED 64-char>
FRONTEND_URL=https://postiz-6buz.srv1641664.hstgr.cloud
NEXT_PUBLIC_BACKEND_URL=https://postiz-6buz.srv1641664.hstgr.cloud/api
BACKEND_INTERNAL_URL=http://postiz-backend:3000
STORAGE_PROVIDER=local            # or 's3' if R2 attached
UPLOAD_DIRECTORY=/uploads
NEXT_PUBLIC_UPLOAD_DIRECTORY=/uploads
# OPTIONAL — only if you want Postiz UI's "AI write content" button:
OPENAI_API_KEY=<REDACTED>
# OAuth provider keys per channel — populate as integrations are added:
X_API_KEY=<REDACTED>
X_API_SECRET=<REDACTED>
# ...repeat for FB, IG, LinkedIn, etc.
```

**Never** add `OPENAI_API_KEY` unless the team explicitly wants Postiz UI to call OpenAI directly — our pipeline drafts content via Claude/Gemini in `hermes-content-drafter` (see audit §8) and feeds finished copy to Postiz.

### C. TLS / domain

- Hostinger panel → SSL → enable Let's Encrypt for the deploy hostname.
- Confirm `curl -I https://${PUBLIC_HOST}/api/health` returns `200 OK` with valid cert.
- Add the host to `paperclip-bridge` allowlist (`docker/paperclip-bridge/app/config/allowed-hosts.ts`).

### D. The 3 reproducible 502s

| Symptom | Cause | Fix |
|---|---|---|
| 502 immediately after `docker compose up`, clears in ~60s | Frontend container ready before backend Nest finishes bootstrap | Add `depends_on: { postiz-backend: { condition: service_healthy } }` to frontend service in compose; add `/api/health` healthcheck to backend |
| 502 after several days, clears on `docker restart redis` | Redis maxmemory-policy default evicts BullMQ job state under load | Set `--maxmemory 512mb --maxmemory-policy noeviction` in redis service |
| Random 502 spikes during posting | Worker container crashed silently (OOM); BullMQ jobs stuck in `delayed` | Add `restart: unless-stopped` + `mem_limit: 1g` to worker service; add log shipper to surface OOMs |

### E. Backup & restore

- Nightly `pg_dump` of `postiz` DB to Hostinger object storage (already configured in template — verify cron in `crontab -l` on host).
- Test restore quarterly: `docker compose down`; `pg_restore` to a scratch DB; `docker compose up`.

### F. API key rotation

1. Generate new key in UI.
2. Update Supabase secret `POSTIZ_API_KEY`.
3. Wait 60s for edge fn cold-start propagation.
4. Revoke old key in UI.
5. Run `postiz-discover-integrations` (16E) manually — confirms new key works.

### G. Health check (one-liner for status page)

```bash
# Returns 200 if frontend, backend, postgres, redis all up
curl -s -o /dev/null -w '%{http_code}\n' https://${PUBLIC_HOST}/api/health
```

## Acceptance Criteria

- [ ] `tasks/hostinger/postiz-runbook.md` exists and covers sections A-G.
- [ ] All `<REDACTED>` placeholders are clearly marked — zero real secrets in the file.
- [ ] Healthcheck one-liner verified against live deploy.
- [ ] Three 502 fixes applied to live `docker-compose.yml` on the VPS (separate change, but referenced).
- [ ] API key rotation procedure tested end-to-end at least once (rotate, verify, revoke).
- [ ] Linked from `tasks/trio/postiz-paperclip-openclaw-audit.md` §1.

## See also

- [`tasks/trio/postiz-paperclip-openclaw-audit.md`](postiz-paperclip-openclaw-audit.md) §1 deployment, §7 finding F12
- [`16E-postiz-integration-discovery-cron.md`](16E-postiz-integration-discovery-cron.md) — depends on a working deploy
- `mde-hostinger` skill — Hostinger VPS conventions
