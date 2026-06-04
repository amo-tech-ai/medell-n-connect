---
doc_id: CONTEST-OPENCLAW-ARCH
title: Contest OS — OpenClaw operations & growth execution architecture
version: 1.0.0
date: 2026-05-17
status: Spec — execution layer design (0% contest OpenClaw skills shipped)
canonical_prd: ./prdv2-contest.md
mastra_intake: ./mastra-intake-workflow.md
audit: ./01-contests-audit.md
openclaw_skill: ../../../.claude/skills/open-claw/SKILL.md
vps_runbook: ../../../.claude/skills/mde-hostinger/SKILL.md
official_docs: https://docs.openclaw.ai/llms.txt
---

# Contest OS — OpenClaw architecture plan

**Core insight:** OpenClaw is mdeai’s **approved execution runtime** for Contest OS — not a chatbot. It runs long-running, channel-facing, browser-backed jobs **after** Mastra proposes and humans (or Paperclip) approve. Votes, fraud enforcement, scoring, and contestant state stay in **Supabase + edge functions**.

**Research basis:** [OpenClaw docs index](https://docs.openclaw.ai/llms.txt) (gateway, automation/cron, tasks ledger, browser CLI, channels/WhatsApp, ClawHub skills); repo [`prdv2-contest.md`](./prdv2-contest.md) §12; tasks **021–023**, **067–070**, **022**; [`mastra-intake-workflow.md`](./mastra-intake-workflow.md); Hostinger VPS per [`mde-hostinger`](../../../.claude/skills/mde-hostinger/SKILL.md).

---

## 1. OpenClaw overview

### What it is

**OpenClaw** is a **self-hosted gateway** that connects messaging channels (WhatsApp, Telegram, Slack, …) and **tool surfaces** (browser, shell, skills) to AI agents. One **Gateway** process runs on your infrastructure (mde: **Hostinger VPS** `2.24.69.242`); operators and automations interact via CLI, cron, and webhooks.

```text
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Channels    │────▶│  OpenClaw       │────▶│  Skills / tools  │
│  WA, TG, …   │     │  Gateway        │     │  browser, cron   │
└──────────────┘     └────────┬────────┘     └────────┬─────────┘
                              │                          │
                              ▼                          ▼
                     ┌─────────────────┐     ┌──────────────────┐
                     │  Task ledger    │     │  External APIs   │
                     │  (audit trail)  │     │  Twilio, Gemini  │
                     └─────────────────┘     └──────────────────┘
```

### Core architecture (from official docs)

| Component | Role |
|-----------|------|
| **Gateway** | Single long-lived process; routes messages; runs agent turns |
| **Channels** | WhatsApp, Telegram, etc. — **execution surface**, not source of truth |
| **Skills** | `SKILL.md` packages in workspace / ClawHub — **workflow recipes** |
| **Cron / Task Flow** | **When** detached work runs |
| **Tasks (`openclaw tasks`)** | **Activity ledger** — queued → running → terminal (not the scheduler) |
| **Browser tool / CLI** | CDP-backed tabs, snapshot, screenshot, navigate — **visual ops** |
| **Hooks / standing orders** | Event-driven automation chains |
| **Approvals CLI** | Human gate before risky actions |

### Strengths (for Contest OS)

- **WhatsApp-native** execution (LATAM: ~95% reach per [`prd.md`](../../../prd.md))
- **Scheduled + long-running** jobs (4h leaderboard, T-12h event reminders)
- **Browser automation** for leaderboard embed screenshots, export captures
- **Skill composability** — one skill per operational workflow (broadcast, finals-ops)
- **Detached task ledger** — audit what ran, success/fail, cancel/kill switch
- **Self-hosted** — data and channel session stay on your VPS

### Weaknesses & limits

| Risk | Mitigation |
|------|------------|
| **ClawHub malicious skills** ([Tom's Hardware, 2026](https://www.tomshardware.com/tech-industry/cyber-security/malicious-moltbot-skill-targets-crypto-users-on-clawhub)) | **Pin only mde-authored skills**; no community install in prod |
| **Browser + shell = high privilege** | `tools.profile` allowlists; no prod shell on contest VPS |
| **WA account ban / spam** | Templates, rate limits, opt-out, human approval before broadcast |
| **VPS single point of failure** | [`023-pg-cron-backstop`](../../archive/023-pg-cron-backstop.md) for critical tallies/messages |
| **Model-invented URLs** | URL allowlist in skills ([022](./tasks/022-leaderboard-broadcast-skill.md)) |
| **Not transactional** | Never call `vote-cast` or mutate `vote.entities` from OpenClaw |

### Deployment pattern (mdeai)

| Item | Value |
|------|--------|
| Host | Hostinger VPS — see **`mde-hostinger`** |
| Config | `~/.openclaw/openclaw.json` |
| Workspace | `~/.openclaw/workspace` |
| Contest skills | `~/.openclaw/skills/{leaderboard-broadcast, finals-ops, …}/` |
| Inbound receipts | Edge **`openclaw-delivery-webhook`** ([067](../../archive/067-openclaw-delivery-webhook.md)) |
| Outbound dispatch | Edge **`openclaw-send-outreach`** / campaign approve ([064](../../archive/064-openclaw-outreach-edge-fns.md)) |

---

## 2. OpenClaw vs Mastra vs edges vs Hermes vs Supabase

### Responsibility matrix

| System | Owns | Must NEVER own |
|--------|------|----------------|
| **Supabase Postgres** | `vote.*` state, tallies, audit_log, RLS truth | — |
| **Edge functions** | Votes, money, eligibility, approve/reject, webhooks, idempotency | Open-ended LLM final decisions |
| **Mastra** | Orchestration, proposals, memory, captions **drafts**, workflow planning | WA send, browser post, vote INSERT |
| **Hermes** | Read-side features (momentum, affinity, fraud **features**) | Blocking vote path; outbound sends |
| **OpenClaw** | **Approved** sends, screenshots, browser flows, cron execution, delivery attempts | Authoritative mutations, winner selection, shadow blocks |
| **Paperclip** (optional) | Governance approvals for high-risk jobs | Product state |

### Critical flow (correct separation)

```text
Event: "Send 4h leaderboard to WA community"

1. pg_cron OR OpenClaw cron fires (schedule)
2. Edge OR Mastra builds payload: top-5 tally, contest meta, UTM URL (read-only SQL)
3. Mastra leaderboard-caption-workflow → caption PROPOSAL (Zod)
4. Organizer / Paperclip APPROVE → row in marketing.campaign_approvals
5. Edge openclaw-dispatch-job → VPS with signed job envelope
6. OpenClaw skill: screenshot embed → attach image → Twilio/WA send
7. openclaw-delivery-webhook → marketing.delivery_logs
8. vote.* unchanged except growth.communications log
```

### What OpenClaw is BEST at

1. **Time-based operations** — reminders, broadcasts, finals countdowns  
2. **Channel execution** — WhatsApp templates, community posts (post-approval)  
3. **Visual capture** — leaderboard/finalist/sponsor report screenshots  
4. **Multi-step external actions** — navigate → snapshot → upload → notify  
5. **Operational glue** — connect Mastra output to real-world delivery  

### What OpenClaw should NEVER own

- Vote casting, tally writes, fraud **enforcement** (only notify humans)  
- Contestant `approved` / `published` without edge RPC  
- Unapproved mass DMs, cold IG/TikTok spam ([069](../../events/069-openclaw-influencer-outreach-browser.md) = **warm contacts only**)  
- Installing unvetted ClawHub skills in production  
- Legal commitments (contracts, refunds) without human sign-off  

---

## 3. Core OpenClaw features for Contest OS

| Capability | Contest value | Implementation sketch |
|------------|---------------|------------------------|
| **Cron** | 4h leaderboard, daily digests | `0 */4 * * *` per [022](./tasks/022-leaderboard-broadcast-skill.md) |
| **Browser** | Mobile embed screenshots | `openclaw browser` → `mdeai.co/vote/:slug/leaderboard?embed=true` |
| **Tasks ledger** | Prove job ran / failed | Correlate `openclaw_job_id` ↔ `delivery_logs` |
| **WhatsApp channel** | Community virality | Twilio/bridge; template-only outbound |
| **Skills** | One workflow = one skill | `leaderboard-broadcast`, `finals-ops`, `intake-reminder` |
| **Approvals** | Organizer confirm before send | Paperclip + `campaign_approvals` + OpenClaw `approvals` CLI |
| **Retries** | Transient Twilio failures | Exponential backoff; max 3; log each attempt |
| **Kill switch** | Spam / incident | Env `OPENCLAW_CONTEST_PAUSED=1` checked at skill start |
| **Hooks** | React to edge webhooks | e.g. fraud burst → enqueue OpenClaw notify job |
| **Peekaboo / visual** | Story cards (future) | Branded PNG pipeline → Storage → WA media message |

**Operational value:** Turns Contest OS from “dashboard + manual WA copy-paste” into **repeatable production ops** with audit trail — the differentiator vs Choicely/Launchpad6 static portals.

---

## 4. Contestant automation systems

| Workflow | Trigger | OpenClaw action | Approval |
|----------|---------|-----------------|----------|
| **Onboarding reminder** | Draft 24h idle | WA template “te falta foto” | Auto if template pre-approved |
| **Incomplete application** | completeness &lt; 70%, 48h | Personalized checklist message | Mastra drafted → organizer optional |
| **Finalist announcement** | `entities.status → finalist` | WA + optional story screenshot | **Required** |
| **Campaign reminder** | voting window T-48h | Share link + UTM | Required |
| **Rank change** | Δ rank ≥ 3 places (Hermes) | “Subiste al #4” DM | Auto template band |
| **Engagement coaching** | Low share rate | Mastra tips → WA digest | Propose-only in chat |
| **Sponsor mission** | sponsor.placement active | Branded CTA in broadcast | Sponsor + organizer |
| **Event-day reminder** | T-24h / T-2h finals ticket | Template + QR deep link | Auto for ticket holders |

**Escalation:** 3 failed sends → ops Slack/email; never retry more than 5x/day/phone.

**Analytics:** `growth.communications` + `delivery_logs` → dashboard: sent, delivered, read, opt-out rate.

---

## 5. Social media automation

### Safe automation ladder

| Tier | Allowed | Gate |
|------|---------|------|
| **L0** | Generate caption/image **draft** in Mastra | N/A |
| **L1** | Screenshot leaderboard for **manual** post | Organizer uploads |
| **L2** | Schedule via **Postiz** after approval | [063](../../archive/063-postiz-schedule-posts-edge-fn.md) |
| **L3** | OpenClaw browser post | **Organizer + brand checklist** — Phase 4+ only |

### Platform workflows (design)

| Platform | Workflow | NEVER automate |
|----------|----------|----------------|
| **Instagram** | Story PNG from leaderboard snapshot; caption draft | Cold DMs; follow/unfollow bots |
| **TikTok** | Reminder to contestant “post your link” via WA | Auto-post without creator OAuth |
| **Facebook** | Group admin **manual** share; OpenClaw prepares asset pack | Spamming groups |
| **WhatsApp** | Community broadcast, vote CTAs | Unapproved bulk; non-template blasts |

### Example chain — viral leaderboard

```text
Tally update (Realtime) → Hermes flags momentum spike
→ Mastra: caption + UTM proposal
→ Organizer Apply
→ OpenClaw: screenshot mobile leaderboard → WA Community
→ delivery_webhook logs read receipts
→ pg_cron backstop if VPS down (static text fallback)
```

---

## 6. WhatsApp automation system

### Message classes

| Class | Recipient | Template required | Rate cap |
|-------|-----------|-------------------|----------|
| **Transactional** | Contestant, buyer | Yes (Infobip/Meta) | Per user 1/min |
| **Organizer ops** | Sofía, staff | Yes | 100/day/org |
| **Community broadcast** | WA Community | Yes + sponsor line | 6/day/contest |
| **Fraud alert** | Admin | Internal | Unlimited internal |
| **Judge** | Rubric reminders | Yes | Event-scoped |

### LATAM best practices

- Spanish-first (es-CO Paisa tone in Mastra drafts)  
- Explicit opt-out: “Responde STOP”  
- Habeas Data reference on first contact ([018](./tasks/018-contestant-intake-form.md))  
- No promotional sends 21:00–08:00 COT unless finals night override  
- Store `contact_hash` not raw phone in logs where possible  

### Architecture

```text
Mastra proposal → campaign_approve edge → openclaw-send-outreach
→ VPS skill → Twilio/WA → delivery webhook (067) → delivery_logs
```

**Anti-spam:** duplicate job_id rejection; per-contest daily send budget; Twilio error circuit breaker.

---

## 7. Event-day operations automation

**Highest operational ROI** after leaderboard broadcast.

### Timeline (Miss Elegance finals)

| Time | Workflow | Actors notified |
|------|----------|-----------------|
| **T-24h** | Ticket + dress code reminder | Contestants + buyers |
| **T-12h** | Attendance confirm ([070](../../events/070-openclaw-no-show-recovery.md)) | Ticket holders |
| **T-2h** | Backstage check-in list to door lead | Roberto + organizer |
| **T-30m** | Judges: rubric live link | Judges |
| **T-15m** | MC rundown + sponsor reads | Emcee |
| **T-0** | “Voting closes in 15m” WA | Audience |
| **T+winner** | Winner card screenshot (no spoiler until announce) | **Hold until organizer release** |

### Fallback

- VPS down → edge sends **text-only** fallback via Supabase cron  
- Judge portal down → SMS backup list (manual export)  
- Emergency: `OPENCLAW_CONTEST_PAUSED` + manual ops runbook  

---

## 8. Organizer operations automation

| Workflow | Schedule | Output |
|----------|----------|--------|
| Moderation queue alert | Every 30m if pending &gt; 5 | WA/email digest |
| Fraud investigation pack | On `fraud_signals` high | Screenshot + Hermes narrative + links |
| Nightly ops summary | 22:00 COT | Votes, top movers, flags |
| Campaign approval nudge | Pending &gt; 24h | Paperclip + WA ping |
| Contestant approval batch | — | **Human only**; OpenClaw notifies after edge approve |

---

## 9. Sponsor automation systems

| Workflow | Trigger | Deliverable |
|----------|---------|-------------|
| Daily ROI digest | Cron | PDF/screenshot pack → email |
| Activation reminder | Contract signed, low impressions | WA to sponsor rep |
| Branded broadcast | Placement live | Inject sponsor line in [022](./tasks/022-leaderboard-broadcast-skill.md) |
| Engagement alert | CPL threshold | Mastra summary → OpenClaw notify |

**Never:** auto-charge, auto-contract sign, auto brand approval without human.

---

## 10. Screenshot + visual automation

### Pipeline

```text
1. Edge provides signed embed URL + viewport (390×844)
2. OpenClaw browser: navigate → wait networkidle → snapshot PNG
3. Optional: overlay sponsor logo (ImageMagick on VPS — pinned version)
4. Upload to Supabase Storage growth-assets/
5. Attach to WA / return URL for Postiz
6. Log asset_id in growth.communications
```

### Asset types

| Asset | Cadence | Branding |
|-------|---------|----------|
| Leaderboard mobile | 4h | Sponsor subtitle |
| Finalist card | On finalist event | Contest + sponsor |
| Winner card | Once on release | Full sponsor lockup |
| Sponsor report | Daily | Sponsor-only |

**Peekaboo** (OpenClaw org repo): evaluate for macOS capture; Linux VPS uses **browser screenshot** primary.

---

## 11. Browser automation use cases

| Use case | Tool | Notes |
|----------|------|-------|
| Leaderboard embed capture | `openclaw browser snapshot` | SSRF policy — only `mdeai.co` allowlist |
| Admin export verification | Login via **organizer session cookie** — dangerous; defer | Use edge CSV export instead |
| Sponsor dashboard capture | Read-only public ROI link | Prefer API |
| Social posting (L3) | Full browser | Phase 4 + legal review |
| Ops monitoring | Snapshot public status page | Health check only |

**Rule:** Prefer **edge-generated CSV/PDF** over scraping admin UI.

---

## 12. OpenClaw safety + governance

### Mandatory controls

| Control | Implementation |
|---------|----------------|
| **Approval gate** | No broadcast without `campaign_approvals.status=approved` |
| **HMAC webhooks** | [067](../../archive/067-openclaw-delivery-webhook.md) |
| **Audit log** | `growth.communications`, `openclaw_job_id`, `ai_runs` for Mastra leg |
| **Rate limits** | Per contest, per channel, per day |
| **Kill switch** | Env + `openclaw tasks cancel` |
| **URL allowlist** | `mdeai.co`, `wa.me` links only in outbound |
| **Skill pinning** | Git-deployed skills only — no ClawHub prod |
| **Role permissions** | VPS SSH restricted; gateway token rotated |
| **Spam prevention** | Templates, opt-out, duplicate detection |
| **Rollback** | Cannot unsend WA — issue correction template instead |

### OpenClaw must NEVER automate

- Vote submission or paid vote checkout  
- Auto-approve contestants  
- Auto-reject moderation without human on `needs_review`  
- Mass cold outreach ([069](../../events/069-openclaw-influencer-outreach-browser.md) warm-only)  
- Posting defamatory or unreviewed AI content  
- Shell commands on prod DB  

### Legal / social risks

- **Ley 1581/2012** — consent before marketing WA  
- **Meta/Twilio policy** — template registration  
- **Defamation** — human review on finalist/winner assets  
- **Election-like manipulation** — document hybrid scoring on Trust page  

---

## 13. OpenClaw + Hermes + Mastra

### Growth loop example

```text
Hermes: contestant_id=42 momentum +180% (1h)
    ↓
Mastra: "Laura trending — propose WA blast + IG story draft"
    ↓
Organizer: Approve in admin / Paperclip
    ↓
OpenClaw: screenshot rank #2 card → WA Community + schedule Postiz
    ↓
delivery_logs: delivered/read metrics
    ↓
Hermes: measure uplift; feed next cycle
```

### Role split (one table)

| Step | Hermes | Mastra | OpenClaw |
|------|--------|--------|----------|
| Detect trend | ✅ features | interprets | — |
| Draft message | — | ✅ proposal | — |
| Approve | — | — | human/edge |
| Send / capture | — | — | ✅ execute |
| Measure | ✅ metrics | summary | logs |

---

## 14. Phased implementation plan

| Phase | Scope | Tasks | ROI | Risk |
|-------|--------|-------|-----|------|
| **0 Core** | VPS + gateway + WA channel | [021](../../archive/021-openclaw-vps-provision.md) | Foundation | Medium |
| **1 MVP** | Delivery webhook + leaderboard broadcast | 067, 022, 023 | **High** — virality | Medium (spam) |
| **2 Post-MVP** | Intake reminders, attendance | Mastra intake + 070 | High | Low |
| **3 Growth** | Sponsor digests, finalist assets | 064, Postiz | Medium | Medium |
| **4 Advanced** | Finals ops timeline, browser L3 social | Custom finals-ops skill | High | **High** — over-automate |
| **5 Enterprise** | Multi-contest orchestration | Per-org skill namespaces | Medium | Ops complexity |

### Ship first (immediate ROI)

1. **067** delivery webhook (closed loop)  
2. **022** leaderboard broadcast (4h WA)  
3. **023** pg_cron backstop  
4. Mastra caption proposal ([prdv2](./prdv2-contest.md) F.4) — no send without approve  

### Overengineering (defer)

- Auto IG/TikTok posting  
- Browser admin scraping  
- AI auto-moderation via OpenClaw (use edge `moderate-asset` + Mastra)  
- Multi-channel simultaneous blast without soak test  

### Dangerous too early

- Influencer browser DMs at scale  
- Finals winner message before organizer release  
- Any skill with shell+DB from ClawHub  

---

## 15. Real-world examples

### Miss Elegance Colombia 2026

| Moment | Chain |
|--------|-------|
| Launch | Organizer approves first broadcast → OpenClaw 4h leaderboard × 21 days |
| Laura applies | Mastra intake reminders only (no WA until consent template) |
| Mid-contest spike | Hermes momentum → Mastra caption → 1-click approve → WA blast |
| Finals night | T-12h attendance ([070](../../events/070-openclaw-no-show-recovery.md)); T-15m judge ping |
| Winner | Organizer clicks publish → edge freezes tally → OpenClaw winner asset **after** signal |

### Medellín nightlife contest (lighter)

- Shorter intake; skip ID waiver variant  
- Leaderboard broadcast only; no judge portal OpenClaw  
- Postiz for IG stories; WA for votes  

### Influencer competition

- **Warm-only** outreach skill; max 20 DMs/day  
- Referral `?ref=` in all captions  
- Fraud agent narrative attached to admin WA on burst  

### Sponsor-driven campaign

- Sponsor line in every 4h broadcast  
- Daily ROI screenshot email  
- No auto contract negotiation  

---

## 16. Success criteria

| KPI category | Metric | Target (MVP) |
|--------------|--------|--------------|
| **Operational** | Broadcast success rate | ≥ 95% over 7d soak |
| **Operational** | VPS uptime during live contest | ≥ 99% |
| **Automation** | Jobs with full audit trail | 100% logged |
| **Engagement** | WA read rate on broadcasts | ≥ 40% |
| **Engagement** | Vote uplift 2h post-broadcast | +5% vs control (A/B) |
| **Reliability** | pg_cron backstop activation | &lt; 2% of sends |
| **Sponsor** | ROI digest delivery | 100% on schedule |
| **Spam** | Opt-out / complaint rate | &lt; 0.1% |
| **Spam** | Twilio policy violations | 0 |
| **Safety** | Unapproved sends | 0 |
| **Safety** | vote.* mutations from OpenClaw | 0 (CI guard) |

---

## 17. Repo task map (OpenClaw × contests)

| ID | File | Role |
|----|------|------|
| 021 | [`archive/021-openclaw-vps-provision.md`](../../archive/021-openclaw-vps-provision.md) | VPS + gateway |
| 022 | [`contests/tasks/022-leaderboard-broadcast-skill.md`](./tasks/022-leaderboard-broadcast-skill.md) | **P0** WA broadcast |
| 023 | [`contests/tasks/023-pg-cron-backstop.md`](./tasks/023-pg-cron-backstop.md) | Failover |
| 067 | [`archive/067-openclaw-delivery-webhook.md`](../../archive/067-openclaw-delivery-webhook.md) | Delivery receipts |
| 068 | [`archive/068-openclaw-whatsapp-concierge.md`](../../archive/068-openclaw-whatsapp-concierge.md) | Inbound concierge |
| 069 | [`events/069-openclaw-influencer-outreach-browser.md`](../069-openclaw-influencer-outreach-browser.md) | Warm outreach only |
| 070 | [`events/070-openclaw-no-show-recovery.md`](../070-openclaw-no-show-recovery.md) | Attendance |

**Blocked until:** `vote.*` schema (**010**), contest live, G1–G5 for platform stability.

---

## 18. Recommended OpenClaw skills (mde-authored)

| Skill name | Cron | Purpose |
|------------|------|---------|
| `leaderboard-broadcast` | `0 */4 * * *` | [022](./tasks/022-leaderboard-broadcast-skill.md) |
| `contest-intake-reminder` | Daily 10:00 COT | Draft nudges (post Mastra plan) |
| `finals-ops-timeline` | Event-relative | §7 table |
| `fraud-ops-notify` | On webhook | Admin pack, no enforcement |
| `sponsor-roi-digest` | Daily | Screenshot + email |

Install via **git deploy to VPS**, not ClawHub pull.

---

## 19. Research links (official)

| Resource | URL |
|----------|-----|
| Docs index | https://docs.openclaw.ai/llms.txt |
| Automation / cron | https://docs.openclaw.ai/automation/cron-jobs.md |
| Background tasks | https://docs.openclaw.ai/automation/tasks.md |
| Browser CLI | https://docs.openclaw.ai/cli/browser.md |
| WhatsApp | https://docs.openclaw.ai/channels/whatsapp.md |
| Main repo | https://github.com/openclaw/openclaw |
| ClawHub | https://github.com/openclaw/clawhub |
| Peekaboo (visual) | https://github.com/openclaw/Peekaboo |

---

## 20. Related mdeai docs

| Doc | Role |
|-----|------|
| [`prdv2-contest.md`](./prdv2-contest.md) §12 | Contest OpenClaw summary |
| [`mastra-intake-workflow.md`](./mastra-intake-workflow.md) | Intake proposals → OpenClaw reminders |
| [`01-contests-audit.md`](./01-contests-audit.md) | 0% shipped truth |
| [`../../../.claude/skills/open-claw/SKILL.md`](../../../.claude/skills/open-claw/SKILL.md) | Gateway CLI reference |
| [`../openclaw/events-openclaw-prd.md`](../openclaw/events-openclaw-prd.md) | **Events + marketing** OpenClaw PRD (canonical horizontal) |
| [`../../../tasks/openclaw/`](../../../tasks/openclaw/) | Platform OpenClaw runbooks |

---

## 21. Next build artifact

After **010** + **022** spec sign-off:

1. Implement **067** + **openclaw-dispatch** edge contract (job envelope schema).  
2. Deploy **leaderboard-broadcast** skill to VPS; 7-day soak with kill switch.  
3. Add CI: static scan — OpenClaw skills must not reference `vote-cast` or `supabase.service_role` INSERT on `vote.votes`.

**Do not** start browser social posting until leaderboard soak passes §16 targets.
