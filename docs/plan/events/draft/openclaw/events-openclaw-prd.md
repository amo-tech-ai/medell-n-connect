---
doc_id: EVENTS-OPENCLAW-PRD
title: OpenClaw — Event Operations + Marketing Automation Plan
version: 1.0.0
date: 2026-05-17
status: Active — implementation spec (0% production skills shipped)
pillar: Events + Tickets + Contest OS
supersedes: ./events-openclaw.md, ./Events.md (narrative only)
related:
  - ../contests/openclaw-contests.md
  - ../events-prd-v2-mastra-maps-automation.md
  - ../events-roadmap.md
  - ../../openclaw/docs/14.2-openclaw.md
official_docs: https://docs.openclaw.ai/llms.txt
---

# OpenClaw — Event Operations + Marketing Automation Plan

**Project:** mdeai.co · **Scope:** Events OS + Contest OS + Sponsor surfaces (execution only)

---

## 1. Executive summary

### What OpenClaw is best used for

OpenClaw is a **self-hosted AI gateway** that connects **channels** (WhatsApp, Telegram, Slack, …), **browser automation**, **cron scheduling**, and **SKILL.md workflows** to AI agents. For mdeai it is the **approved execution layer** — the “hands” that run after Supabase truth and Mastra proposals are fixed.

| Best fit | Why it matters |
|----------|----------------|
| **Scheduled operations** | 4h leaderboard broadcasts, T-24h directions, countdowns |
| **WhatsApp execution** | LATAM-primary channel ([`prd.md`](../../../prd.md)) |
| **Browser screenshots** | Leaderboard embeds, sponsor ROI captures, story assets |
| **Long-running jobs** | Multi-step: read DB → render → send → log delivery |
| **Marketing automation** | Postiz handoff, campaign assets (post-approval) |

### Why it matters for Events + Contest OS

- **Events:** Ticket reminders, venue directions, staff/finals ops, post-event sponsor reports — without building a second messaging stack.
- **Contests:** Viral leaderboard WA broadcasts, contestant reminders, finalist/winner announcements ([`openclaw-contests.md`](../contests/openclaw-contests.md)).
- **ROI:** Replaces manual copy-paste for organizers who run 1–3 events/quarter — estimated **8–15 hours saved per event** once skills are stable.

### Where it creates ROI (ordered)

1. **Leaderboard + countdown WA** (contest virality)  
2. **Ticket / attendance reminders** (no-show reduction)  
3. **Sponsor daily/weekly ROI screenshots** (renewal)  
4. **Post-event summary** (retention)  
5. **Finals-night ops timeline** (production quality)

### What it must never control

| Forbidden | Owner |
|-----------|--------|
| Payments, refunds | Stripe + edges |
| Votes, tallies, winners | `vote-cast`, triggers, admin |
| Ticket validation, check-ins | `ticket-validate` |
| Fraud enforcement | Edges + human |
| Contestant approve/reject | `contest-approve` |
| Authoritative DB writes from skills | Supabase edges only |
| Public posts / bulk WA without approval | Governance |

**Ship gate:** Deterministic ticketing green ([`tasks/todo.md`](../../todo.md) G1–G5) **before** OpenClaw outbound at scale ([`events-prd-v2`](../events-prd-v2-mastra-maps-automation.md) §13, [`events-roadmap.md`](../events-roadmap.md)).

---

## 2. Research summary

Sources reviewed via web fetch + official OpenClaw docs + repo docs. Verdict: **adapt patterns, avoid unverified ClawHub skills**.

| Source | Key feature | Event planning | Marketing | Automation idea | Risk | mdeai |
|--------|-------------|----------------|-------------|-----------------|------|-------|
| [OpenClaw Playbook — event mgmt](https://www.openclawplaybook.ai/guides/how-to-use-openclaw-for-event-management/) | HEARTBEAT RSVP checks, reminder sequences | Pre/during/post comms | Email/WA sequences | **Adapt** reminder cadence in skills | Generic copy | **Adapt** |
| [OpenClaw Playbook — planners](https://www.openclawplaybook.ai/guides/openclaw-for-event-planners/) | Vendor table, timelines | Coordination | — | Vendor status file | — | **Adapt** lightly |
| [Tencent — event mgmt](https://www.tencentcloud.com/techpedia/141401) | Registration, reminders | Ops | Campaign timing | **Adapt** WA focus | — | **Adapt** |
| [afrexai event-mgmt (Clawbot)](https://clawbot.ai/skills/afrexai-event-management.html) | Generic event skill | Checklists | — | Do not install wholesale | Unvetted skill | **Avoid** |
| [Luma event-manager skill](https://github.com/openclaw/skills/tree/main/skills/mariovallereyes/luma-event-manager) | Scrape Luma | Discovery | — | Optional **research** only | Scraping ToS | **Defer** |
| [Fast.io marketing skills](https://fast.io/resources/top-openclaw-skills-marketing-automation/) | Asset hub, browser competitor watch | — | Content ops | Asset pipeline to Storage | ClawHub | **Adapt** asset flow only |
| [Ampere — event planners](https://www.ampere.sh/blog/openclaw-for-event-planners) | WA + calendar positioning | Planning | Outreach | Messaging narrative | — | **Adapt** |
| [NYC Claw — planners](https://nycclaw.com/for/event-planners) | Industry landing | — | — | — | Marketing fluff | **Skip** |
| [Medium — 2M views marketing](https://medium.com/@rithikmotupalli/how-an-openclaw-agent-automated-marketing-and-got-2-million-views-in-2-weeks-c77d6ebb5ea8) | Autonomous posting | — | Viral loops | **Do not copy** — no unapproved posting | Ban risk | **Avoid** |
| [Reddit wedding planner OSS](https://www.reddit.com/r/automation/comments/1rks49r/) | Community patterns | Personal events | — | UX ideas only | — | **Reference** |
| [openclaw/openclaw](https://github.com/openclaw/openclaw) | Gateway, channels, cron, tasks | Core runtime | — | **Use** official only | — | **Copy** arch |
| [OpenClaw docs](https://docs.openclaw.ai/llms.txt) | Tasks ledger, browser CLI, approvals | — | — | **Canonical** | — | **Use** |
| [VoltAgent awesome-skills](https://github.com/VoltAgent/awesome-openclaw-skills) | Curated list | Discovery | Marketing cats | Reference only | Mixed quality | **Reference** |
| [Verge — ClawHub security](https://www.theverge.com/news/874011/openclaw-ai-skill-clawhub-extensions-security-nightmare) | Malicious skills | — | — | — | **Critical** | **Avoid ClawHub prod** |
| [Tom's Hardware — ClawHub](https://www.tomshardware.com/tech-industry/cyber-security/malicious-moltbot-skill-targets-crypto-users-on-clawhub) | Skill malware | — | — | — | **Critical** | **Internal skills only** |
| [Playwright](https://playwright.dev/docs/intro) | Browser automation | QA smoke | Screenshots | **Use** via OpenClaw browser | — | **Use** |
| [Mastra workflows](https://mastra.ai/docs/workflows/overview) | Orchestration | Proposals | Campaign plans | **Mastra proposes, OC executes** | — | **Integrate** |
| [WhatsApp Business](https://developers.facebook.com/docs/whatsapp/) | Templates, policies | Reminders | Campaigns | Infisical + templates | Policy | **Required** |

---

## 3. OpenClaw capability map

| Capability | What it does | mdeai use |
|------------|-------------|-----------|
| **Channels** | WA, Telegram, Slack, … | WhatsApp primary; Telegram optional |
| **Workflows / Task Flow** | Multi-step detached runs | Broadcast, finals-ops chains |
| **Skills** | `SKILL.md` + tools | One skill per operational workflow |
| **Scheduling** | Cron, standing orders | `0 */4 * * *` leaderboard |
| **Browser** | CDP snapshot, navigate | `mdeai.co` embed screenshots |
| **Screenshots** | PNG from browser/Peekaboo | Leaderboard, sponsor reports |
| **Social** | Postiz skill (approved) | Schedule after human approve |
| **WhatsApp** | Twilio/bridge + templates | Community + transactional |
| **Reporting** | Aggregate logs + images | Sponsor PDF/email pack |
| **Long-running jobs** | Tasks: queued → terminal | Correlates `openclaw_job_id` |
| **Approvals** | CLI + Paperclip + DB row | No public send without |
| **Retries** | Skill-level backoff | Max 3; circuit breaker |
| **Monitoring** | `openclaw tasks audit`, VPS logs | Pager on fail streak |
| **Logs** | `growth.communications`, `delivery_logs`, `ai_runs` | Full audit chain |

---

## 4. OpenClaw vs Mastra vs Supabase vs Hermes

| System | Owns | Never owns |
|--------|------|------------|
| **Supabase + edges** | Events, tickets, orders, attendees, check-ins, `vote.*`, audit_log, campaign_approvals | — |
| **Mastra** | Intent routing, proposals, memory, caption drafts, workflow plans | WA send, vote INSERT, Stripe |
| **Hermes** | Momentum, affinity, fraud **features**, recommendations | Blocking paths, outbound |
| **OpenClaw** | Execute approved jobs: send, screenshot, browser, cron | Truth, payments, votes, validation, winners |
| **Paperclip** (opt.) | Approval records for high-risk jobs | Product state |

```text
Hermes (signal) → Mastra (proposal) → Human/edge (approve) → OpenClaw (execute) → Webhook (log) → PostHog (metrics)
```

---

## 5. Event planning workflows

| Workflow | Trigger | Executor | Approval |
|----------|---------|----------|----------|
| **Event creation checklist** | `events.status=draft` | Mastra proposes tasks; OC optional nudge | Organizer |
| **Venue coordination** | Venue linked | WA directions T-24h ([venues](../venues/venue-automation-strategy.md)) | Template |
| **Vendor reminders** | Phase 2 — `event_vendors` | OC cron | Organizer |
| **Sponsor reminders** | Contract signed | OC digest | Sponsor opt-in |
| **Performer reminders** | Schedule row | OC T-2h | Internal |
| **Staff scheduling** | Staff link rotated | Edge 034; OC ping | Auto internal |
| **Ticket sales push** | Sales &lt; 50% cap by T-7d | OC + Mastra copy | **Required** |
| **Event-day ops** | Timeline offsets | `finals-ops` skill | **Required** |
| **Post-event report** | `events.status=closed` | OC screenshot + email | Auto to organizer |

---

## 6. Event marketing workflows

| Campaign | Channels | Approval | UTM |
|----------|----------|----------|-----|
| Announcement | WA community, Postiz | Required | `?utm_campaign=launch` |
| Countdown | WA T-7d, T-1d | Required | per phase |
| Ticket urgency | WA when 90% cap | Required | `utm_source=wa` |
| Sponsor co-brand | Broadcast footer | Sponsor + organizer | sponsor_id |
| Finalist / winner | WA + assets | **Required** | — |
| Influencer | Warm list only ([069](../069-openclaw-influencer-outreach-browser.md)) | Per-DM approve | tracked |
| IG/TikTok/FB | Postiz schedule | Per-post approve | platform rules |

**Never:** autonomous viral posting without human sign-off ([Medium case study pattern — avoid](https://medium.com/@rithikmotupalli/how-an-openclaw-agent-automated-marketing-and-got-2-million-views-in-2-weeks-c77d6ebb5ea8)).

---

## 7. Contest OS workflows

Consolidated from [`openclaw-contests.md`](../contests/openclaw-contests.md):

| Workflow | Schedule / trigger | Skill |
|----------|-------------------|-------|
| Application reminders | 24h idle draft | `contestant-reminder` |
| Incomplete profile | completeness &lt; threshold | `contestant-reminder` |
| Leaderboard broadcast | `0 */4 * * *` | `leaderboard-broadcast` ([022](../contests/tasks/022-leaderboard-broadcast-skill.md)) |
| Finalist announcement | On status change | `finalist-announcement` |
| Voting deadline | T-48h, T-4h | `event-countdown` |
| Judge reminder | T-30m | `judge-reminder` |
| Fraud alert | Webhook from edge | `fraud-alert-notifier` |
| Sponsor activation | Daily | `sponsor-report` |
| Winner announcement | Organizer release | `finalist-announcement` (variant) |

**Backstop:** [`023`](../contests/tasks/023-pg-cron-backstop.md) if VPS down.

---

## 8. Browser automation use cases

| Use case | URL allowlist | Output |
|----------|---------------|--------|
| Leaderboard screenshot | `mdeai.co/vote/*/leaderboard?embed=true` | PNG → WA |
| Sponsor ROI capture | `mdeai.co/sponsor/dashboard/*` | PDF appendix |
| Social story card | Render service or template URL | 1080×1920 |
| Event dashboard | `/host/events/:id` | Email embed |
| QA smoke | `/events`, `/vote` | CI artifact |
| Social publish | OAuth only Phase 4 | Postiz preferred |
| Export download | Prefer edge CSV | OC fallback only |

**Tool:** `openclaw browser` + Playwright patterns; SSRF policy per [OpenClaw browser docs](https://docs.openclaw.ai/cli/browser).

---

## 9. WhatsApp + channel strategy

| Channel | Role | MVP |
|---------|------|-----|
| **WhatsApp** | Primary LATAM | Yes |
| **Email** | Sponsor B2B | Yes (edge) |
| **Telegram** | Optional community | Defer |
| **SMS** | Fallback | Defer |

**Rules:**

- Meta/Twilio **approved templates** for outbound initiations  
- `contact_hash` in logs; minimize raw phone retention  
- Rate limits: see §10  
- **Kill switch:** `OPENCLAW_EVENTS_PAUSED=1` checked at skill entry  
- **Escalation:** 3 failures → ops alert; manual send playbook  

**Inbound:** [`068`](../../archive/068-openclaw-whatsapp-concierge.md) classifies replies; never auto-changes ticket state.

---

## 10. Social media automation

| Tier | Allowed | Gate |
|------|---------|------|
| Draft caption/image | Mastra | — |
| Organizer review | UI | Required |
| Schedule Postiz | Edge 063 | `campaign_approvals` |
| Auto-post to IG/TikTok | OpenClaw/Postiz | Per-post approve |
| Cold DM outreach | — | **Forbidden** |

**Anti-spam:** max 6 WA broadcasts/contest/day; UTM on every link; allowlist domains; no hashtag spam bots.

**Performance:** `growth.communications` + Postiz analytics + PostHog UTM events.

---

## 11. OpenClaw skills to build (internal only)

Deploy via **git to VPS** — never ClawHub pull in production.

| Skill | Trigger | Input | Output | Approval? | Owner | Logs | Rollback | Metric |
|-------|---------|-------|--------|-----------|-------|------|----------|--------|
| `leaderboard-broadcast` | cron `0 */4 * * *` | contest_id | WA msg + PNG | **Yes** | Growth | comm + delivery | cancel task | read rate |
| `finalist-announcement` | edge webhook | entity_ids | WA + asset | **Yes** | Organizer | audit | correction template | engagement |
| `contestant-reminder` | daily 10am | draft entities | WA template | Template pre-approved | Ops | comm | stop cron | completion % |
| `event-countdown` | T-7d,-1d,-1h | event_id | WA | Opt-in | Organizer | comm | — | ticket sales |
| `sponsor-report` | daily 8am | sponsor_campaign_id | email+PNG | Auto to contract | Sponsor | delivery | resend | renewal |
| `staff-reminder` | T-2h | event_id, staff_ids | WA | Internal | Ops | comm | — | scan rate |
| `judge-reminder` | T-30m | judge_ids | WA/email | Yes | Organizer | comm | — | scores in |
| `event-day-ops` | timeline | event_id | sequential WA | **Yes** | Ops | task log | pause skill | on-time % |
| `social-story-generator` | on-demand | tally snapshot | PNG | **Yes** | Marketing | storage | delete asset | shares |
| `post-event-report` | status=closed | event_id | PDF/email | Auto organizer | Ops | comm | — | NPS |
| `fraud-alert-notifier` | fraud signal | signal_id | admin WA | Auto internal | Security | audit | — | MTTR |
| `ticket-sales-push` | cap threshold | event_id | WA | **Yes** | Organizer | comm | — | sell-through |

---

## 12. MVP plan (safe, high-ROI)

| # | Workflow | Why safe |
|---|----------|----------|
| 1 | **067** delivery webhook | Closed-loop; no user-facing risk |
| 2 | **022** leaderboard screenshot + WA | Read-only tally; approved caption; allowlisted URL |
| 3 | Finalist/winner announcement | Human trigger only |
| 4 | Sponsor report capture | Read-only dashboard; B2B email |
| 5 | Event countdown WA | Pre-approved templates; opt-in organizers |
| 6 | Post-event summary | After close; no inventory impact |

**Dependencies:** 021 VPS, 059 marketing schema, G1–G5 for ticket truth.

**Not in MVP:** cold outreach, auto social post, influencer browser, Luma scrape.

---

## 13. Advanced plan

- Full **event-day-ops** timeline (finals, pageants)  
- Postiz + OpenClaw social publishing (L2 approve)  
- Influencer warm outreach ([069](../069-openclaw-influencer-outreach-browser.md))  
- Multi-event org dashboards  
- Crisis workflow: pause all skills + organizer SMS  
- Realtime ops: Hermes spike → Mastra draft → OC blast (approved)  

---

## 14. Production hardening

| Control | Implementation |
|---------|----------------|
| Isolated VPS | Hostinger dedicated OpenClaw ([mde-hostinger](../../../.claude/skills/mde-hostinger/SKILL.md)) |
| Docker | Compose per service; no root gateway |
| Service accounts | Edge dispatch uses HMAC secret; VPS no Supabase service role in skills |
| Browser profiles | `openclaw` profile; allowlist `mdeai.co` |
| Secrets | Infisical; rotate quarterly |
| Audit | `growth.communications`, `marketing.delivery_logs`, `ai_runs` |
| Approvals | `marketing.campaign_approvals` + Paperclip optional |
| Kill switch | Env flag + `openclaw tasks cancel` |
| Retries | Max 3; exponential backoff |
| Monitoring | Uptime on gateway; alert on 3 failed tasks |
| Manual fallback | pg_cron text-only ([023](../contests/tasks/023-pg-cron-backstop.md)); organizer copy deck |

---

## 15. Risk review

| Risk | Severity | Mitigation |
|------|----------|------------|
| ClawHub malicious skills | **Critical** | Internal skills only; [Verge](https://www.theverge.com/news/874011/openclaw-ai-skill-clawhub-extensions-security-nightmare) |
| Credential leak on VPS | High | Infisical; minimal env; no keys in skills repo |
| Browser drift / SSRF | High | Allowlist; `browser doctor` in CI |
| Social platform ban | High | No auto-post MVP |
| WhatsApp spam / ban | High | Templates, limits, opt-out |
| Hallucinated URLs | High | Mastra allowlist + skill assert |
| Unauthorized posting | Critical | Approval row required |
| Wrong audience | High | `campaign_id` + test send |
| Event-day failure | High | Backstop + manual runbook |

---

## 16. Real-world examples

### Miss Elegance Colombia (pageant + finals)

```text
Hermes: vote velocity spike contestant #42
→ Mastra: leaderboard-caption-workflow proposal + UTM
→ Sofía approves in admin (campaign_approvals)
→ Edge: openclaw-dispatch-job(contest_id, template=leaderboard_v3)
→ OpenClaw: browser screenshot embed → Twilio WA community
→ 067 webhook: delivered/read → delivery_logs
→ PostHog: utm_campaign=leaderboard_v3 clicks
```

**Finals night:** `event-day-ops` T-24h directions → T-12h attendance ([070](../070-openclaw-no-show-recovery.md)) → T-15m judges → hold winner asset until organizer publish.

### Medellín nightlife concert

- Countdown only; no contest  
- Ticket sales push at 80% cap  
- Nearby POI in app (EVT-044) — not OpenClaw  

### Sponsor activation (Postobón-style)

- Daily `sponsor-report` screenshot of impressions + check-in proxy  
- Renewal call uses same PDF  

---

## 17. Score /100

| Dimension | Score | Note |
|-----------|------:|------|
| Event planning | 78 | Strong checklists; not a full Cvent replacement |
| Event marketing | 85 | WA + screenshots excellent for LATAM |
| Contest operations | 88 | Leaderboard broadcast = killer feature |
| WhatsApp automation | 82 | Policy risk if templates skipped |
| Browser automation | 80 | Screenshot path proven pattern |
| Social automation | 55 | Defer auto-post; Postiz safer |
| Sponsor reporting | 86 | High renewal leverage |
| Production readiness | 52 | 0% skills shipped; needs 067+022 soak |
| Security | 70 | Good if ClawHub banned |
| ROI for MVP | **90** | 022+067 highest leverage |
| Long-term strategic value | 84 | Event OS execution engine moat |

**Weighted overall (strategy):** **78/100**  
**Weighted overall (implementation today):** **48/100**

---

## 18. Final recommendation

### Should mdeai use OpenClaw?

**Yes** — as the **execution layer only**, after ticketing spine and approval infrastructure exist.

### Ship first (8–12 weeks after G1–G5)

1. [`067-openclaw-delivery-webhook`](../../archive/067-openclaw-delivery-webhook.md) + job envelope edge  
2. [`022-leaderboard-broadcast`](../contests/tasks/022-leaderboard-broadcast-skill.md) + 7-day soak  
3. [`023-pg-cron-backstop`](../contests/tasks/023-pg-cron-backstop.md)  
4. Event countdown + post-event report skills  
5. [`070`](../070-openclaw-no-show-recovery.md) attendance (ticket vertical)

### Defer

- Luma/Eventbrite scrape skills  
- Auto IG/TikTok posting  
- Multi-channel blast  
- ClawHub community skills  
- MASTRA-007 coupling before ticket edges reconciled  

### Overengineering

- Full Cvent-style venue booking via OpenClaw  
- AI autonomous “event planner” without human calendar  
- 2M-views style unsupervised marketing  

### Dangerous

- Unapproved mass WA  
- Skills with shell + service role  
- Winner announcement before organizer release  
- Scraping Ticketmaster/Luma at scale without API  

### Fastest ROI

**Leaderboard broadcast + delivery webhook** — directly drives contest votes and sponsor-visible engagement; reuses existing [`prdv2-contest.md`](../contests/prdv2-contest.md) §12 design.

---

## Appendix A — Repo task map

| ID | File |
|----|------|
| 021 | [`archive/021-openclaw-vps-provision.md`](../../archive/021-openclaw-vps-provision.md) |
| 022 | [`contests/tasks/022-leaderboard-broadcast-skill.md`](../contests/tasks/022-leaderboard-broadcast-skill.md) |
| 023 | [`contests/tasks/023-pg-cron-backstop.md`](../contests/tasks/023-pg-cron-backstop.md) |
| 064 | [`archive/064-openclaw-outreach-edge-fns.md`](../../archive/064-openclaw-outreach-edge-fns.md) |
| 067–068 | [`archive/067`](../../archive/067-openclaw-delivery-webhook.md), [`068`](../../archive/068-openclaw-whatsapp-concierge.md) |
| 069–070 | [`069`](../069-openclaw-influencer-outreach-browser.md), [`070`](../070-openclaw-no-show-recovery.md) |

## Appendix B — Dispatch contract (sketch)

```typescript
// Edge → VPS (HMAC signed)
interface OpenClawJobEnvelope {
  job_id: string;
  skill: string; // e.g. leaderboard-broadcast
  campaign_approval_id: string;
  payload: Record<string, unknown>;
  callback_url: string; // openclaw-delivery-webhook
  url_allowlist: string[];
  kill_switch_check: true;
}
```

## Appendix C — Official references

- https://docs.openclaw.ai/llms.txt  
- https://docs.openclaw.ai/automation/cron-jobs.md  
- https://docs.openclaw.ai/automation/tasks.md  
- https://docs.openclaw.ai/channels/whatsapp.md  
- https://github.com/openclaw/openclaw  
