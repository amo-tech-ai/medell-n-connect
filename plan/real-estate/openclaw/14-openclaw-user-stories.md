# OpenClaw × mdeai — Real-World User Stories

**Author:** AI Automation Architect
**Date:** 2026-05-07
**Status:** Active — ready for validation with real users
**Companion doc:** [`14-openclaw-production-plan.md`](14-openclaw-production-plan.md)

---

## Overview

These are concrete, name-based user stories grounded in the Medellín market. Each story maps
to a specific workflow in the production plan. Written in plain language so founders and team
can validate they match real user needs before building.

**Characters:**
- **Camila** — 28-year-old expat from Toronto relocating to Medellín for 6 months
- **Andrés** — 42-year-old local landlord with 3 apartments in El Poblado
- **María** — Marketing manager at a Colombian craft beer brand, potential sponsor
- **Carlos** — 55-year-old local retiree, looking to rent long-term in Laureles
- **Sofia** — 24-year-old content creator, 45k Instagram followers, hosts Medellín experiences
- **Juan** — 35-year-old mdeai operations manager monitoring the system
- **Diego** — Local DJ / event host, running monthly events at a Poblado venue

---

## Story 1: Camila Finds an Apartment at 11pm

**Actor:** Camila (tenant / expat lead)
**Trigger:** Camila searches "mdeai medellín apartment" on her phone at 11:03pm Toronto time
**System:** OpenClaw concierge agent on WhatsApp

### The story

Camila just got her remote work visa approved. She lands in Medellín in 3 weeks and needs a
furnished 1BR in El Poblado, budget $1,200–1,800/month USD, Wi-Fi required, minimum 3 months.

She WhatsApps +14168003103 (the mdeai number from the website):

> "Hi! I'm moving to Medellín in 3 weeks. Looking for a furnished 1BR in Poblado, $1,200–1,800,
> need good Wi-Fi. Can you help?"

**What happens (< 60 seconds):**

1. OpenClaw gateway receives the message (2:03am COT — within operating hours)
2. mdeai-concierge agent activates:
   - Checks Supabase: new lead (never contacted before) → creates contact record
   - Reads her message: budget ✅, neighborhood ✅, timeline ✅, furnished ✅
   - Hermes scores: 87/100 (budget strong, clear intent, specific criteria)
   - Queries Supabase apartments: 3 matching results
3. Agent replies in < 45 seconds:

> "Hi Camila! 👋 Welcome to mdeai — I'm your Medellín rental concierge. Great news — I found 3
> apartments that match your search:
>
> 🏠 **El Poblado Centro** — 1BR furnished, 120 Mbps fiber, pool + gym — **$1,450/mo USD**
> 📍 Walking distance to Parque Lleras
>
> 🏠 **Provenza Premium** — 1BR furnished, 200 Mbps fiber, coworking building — **$1,650/mo USD**
> 📍 2 blocks from the best cafés
>
> 🏠 **Manila District** — 1BR semi-furnished, 80 Mbps cable — **$1,250/mo USD**
> 📍 Quiet street, 10 min walk to Parque Bello Horizonte
>
> Want photos and availability for any of these? Or tell me more about your priorities and I'll
> narrow it down! 🙌"

4. Camila replies: "Yes please! Option 2 looks amazing, can I see photos and when can I visit?"

5. Concierge:
   - Sends photo links from Supabase Storage
   - Notes: "booking intent detected" → creates Paperclip task: "Human follow-up: Camila — Provenza Premium viewing"
   - Juan gets a Telegram alert: "High-score lead (87) wants viewing for Provenza Premium"

6. Supabase logs: contact created, thread active, score 87, status='qualified'

**Outcome:** Lead qualified at 2am with zero human involvement. Juan follows up at 9am.
**Revenue impact:** Camila books. $1,650/month. mdeai earns platform fee.

---

## Story 2: Andrés Gets a New Tenant Inquiry Without Lifting a Finger

**Actor:** Andrés (landlord / host)
**Trigger:** Camila's inquiry in Story 1
**System:** OpenClaw + Supabase + Paperclip (host notification)

### The story

Andrés has his Provenza Premium apartment listed on mdeai. He published the listing 2 weeks ago
and forgot about it — he's busy with his other job.

At 2:03am, while he's asleep, the concierge handles Camila's inquiry automatically.
At 2:05am, a Supabase realtime event fires and creates a Paperclip task:
"New qualified lead for Provenza Premium — Camila, score 87, viewing requested."

**What happens next morning:**

At 8:30am, Andrés opens his mdeai host dashboard (`/host/dashboard`). He sees:
- New lead notification: "Camila (87/100) — interested in Provenza Premium — wants to visit"
- Lead details: budget $1,650, 3+ months, Canadian expat, fully remote worker
- Concierge transcript: "Excellent match, high-intent inquiry"

Andrés taps "Confirm viewing" → selects Thursday 3pm. The system:
1. Books the showing
2. Sends Camila a WA confirmation automatically
3. Creates a T-24h reminder cron for both Camila and Andrés

**Outcome:** Andrés gets a qualified tenant inquiry. He didn't have to monitor WhatsApp, respond at 2am, or manually qualify. His time investment: 30 seconds to confirm the showing.

---

## Story 3: Carlos Gets a Personalized Follow-up (Not a Spam Blast)

**Actor:** Carlos (local tenant, price-sensitive)
**Trigger:** Carlos WhatsApped 3 days ago, got options, never replied
**System:** OpenClaw follow-up agent + Paperclip approval

### The story

Three days ago, Carlos messaged mdeai asking about long-term rentals in Laureles under $700/month.
The concierge gave him 2 options. He went quiet. His score: 62/100 (lower budget, longer-term,
lower urgency signal). Status: 'inbound_wa'.

**What happens today (Day 4, 9:00am):**

Paperclip routine `follow-up-stale-leads` fires. OpenClaw follow-up agent checks:
- Carlos: score 62, last_contacted 3 days ago, follow_up_count 0, not suppressed

Agent drafts a follow-up using his conversation context:
> "Hola Carlos! 👋 ¿Seguís buscando apartamento en Laureles? Tuve un cliente que canceló su
> reserva en [building], entonces quedó disponible el 1° de junio — precio especial de $680/mes.
> ¿Te interesa verlo? 📞"

The draft appears in Paperclip board: "APPROVE: Follow-up to Carlos — Laureles vacancy offer"
Juan reviews in 10 minutes, approves. Message is sent.

**What happens with the follow-up:**
Carlos replies: "Sí, me interesa. ¿Puedo verlo el viernes?"
Concierge handles it instantly. Viewing booked.

**Key safety features that fired:**
- ✅ Suppression list checked before draft created
- ✅ Human approved the message before it was sent
- ✅ Message sent at 9:15am COT (within 8am–9pm window)
- ✅ Follow-up count incremented (max 2 before 'cold' status)
- ✅ Full Supabase log: who, when, what, approved by whom

**Outcome:** Lead that was going cold is re-engaged. Personalized, not spammy. 100% compliant.

---

## Story 4: María Gets a Sponsor Outreach That Doesn't Feel Like Spam

**Actor:** María (potential sponsor — craft beer brand)
**Trigger:** Discovery agent found her brand at a Medellín event
**System:** OpenClaw discovery → Hermes scoring → Paperclip approval → outreach

### The story

María is the marketing manager for *Cerveza Altiplano* — a Medellín craft beer brand with
3,000 Instagram followers and a history of sponsoring local music events. They have $5,000/month
in local marketing budget.

**Day 1 — Discovery:**
OpenClaw discovery agent scrapes public Instagram posts from #cervezamedellin. Finds Altiplano.
Apollo.io enrichment: finds María's LinkedIn + company email.
Hermes scores: 74/100 (local brand ✅, events ✅, budget estimated ✅, previous sponsor history ✅).
Paperclip task created: "Review sponsor prospect: Cerveza Altiplano (score 74)"

**Day 2 — Approval:**
Juan reviews in Paperclip. Sees Altiplano's public profile. Approves: "Yes, good fit."
Contact status: 'approved'. Outreach agent picks it up.

**Day 3 — Outreach:**
Outreach agent drafts:
> "Hola María! Vi que Cerveza Altiplano estuvo en varios eventos de Medellín este año — increíble
> presencia de marca en la escena local. 🍺
>
> En mdeai organizamos eventos con 200–500 asistentes en El Poblado y Laureles — perfiles que
> encajan exactamente con tu cliente ideal.
>
> ¿Tenés 15 minutos para ver cómo podría funcionar una alianza para el próximo trimestre?
> Sponsors actuales están viendo 340% ROI promedio en brand recall."

Appears in Paperclip: "APPROVE: First-touch outreach to María (Cerveza Altiplano)"
Juan reviews the personalized message → approves → message sent via WhatsApp.

María replies: "Hola! Sí, me interesa. Mandame más info." → Paperclip task for Juan: human follow-up.

**Key features:**
- ✅ Discovery was read-only (no DMs until approved)
- ✅ Double approval (once for prospect, once for message)
- ✅ Personalized using her real brand activity
- ✅ Message sent at 10am (operating hours)
- ✅ "Reply STOP" included at bottom of first message
- ✅ All logged to Supabase with paperclip_task_id

**Outcome:** Cold outreach that feels like a warm referral. 1 in 4 approved contacts reply.

---

## Story 5: Diego's Event Goes Live on 4 Social Platforms in 2 Hours

**Actor:** Diego (event host / DJ)
**Trigger:** Diego publishes his event via mdeai wizard
**System:** OpenClaw events agent + Postiz + WhatsApp broadcast

### The story

Diego is hosting his monthly "Noches de Salsa" at a Poblado venue on June 14. He creates the
event in mdeai's wizard: `500-peso tickets + early bird 20% off, capacity 150, 4 hours, DJ set`.

He clicks "Publish". Status flips to 'active'.

**What happens automatically:**

1. Supabase realtime event fires → edge fn `event-promote-trigger` → Paperclip task created:
   "Promote: Noches de Salsa — June 14, El Poblado"

2. OpenClaw `mdeai-events` agent reads the task:
   - Fetches event details from Supabase
   - Calls Hermes: "Draft 3 social posts + 1 WhatsApp announcement for this event"
   - Hermes returns:
     - Instagram: "🕺 Salsa returns to Poblado! Noches de Salsa with DJ Diego — June 14 🎶
       Early bird tickets: 20% off until June 7. Link in bio 👆 #salsaMedellín #NochesEnPoblado"
     - Facebook: "🎊 Our favourite monthly event is back! Noches de Salsa with DJ Diego..."
     - LinkedIn: "Event announcement: Noches de Salsa — cultural nightlife experience..."
     - WhatsApp: "🎉 New event on mdeai! Noches de Salsa — June 14, El Poblado. 🎟️ bit.ly/noches14"
   - Posts drafts to Paperclip as task comments

3. Juan reviews in Paperclip (takes 5 minutes) → approves all 4

4. Agent receives approval:
   - `postiz-agent posts:create --platform instagram --content "..." --schedule "18:00 today"`
   - `postiz-agent posts:create --platform facebook --content "..." --schedule "18:05 today"`
   - `postiz-agent posts:create --platform linkedin --content "..." --schedule "09:00 tomorrow"`
   - `postiz-agent posts:create --platform tiktok --content "..." --schedule "19:00 today"`
   - WhatsApp broadcast to opted-in contacts (send immediately)

5. All 4 social posts scheduled. WhatsApp sent to 247 opted-in contacts.

6. Supabase logs: 4 postiz_jobs, 247 outreach_messages, 1 agent_run

**Outcome:** Diego's event is live on 4 platforms + WhatsApp in under 2 hours. No manual posting.
Diego's only job: create the event in the wizard.

---

## Story 6: Sofia Is Discovered as a Potential Influencer Partner

**Actor:** Sofia (Instagram creator, 45k followers)
**Trigger:** Signal collector agent scans #medellínlifestyle
**System:** OpenClaw signal-collector + Hermes scoring + discovery workflow

### The story

Sofia has never heard of mdeai. She posts daily about Medellín lifestyle — café reviews, apartment
tours, event coverage. Her audience is 80% expats and digital nomads. Perfect mdeai demographic.

**What happens without Sofia knowing:**

OpenClaw signal-collector (runs every 6 hours) scans public Instagram posts tagged
`#medellínlifestyle #apartamentomedellin #expatmedellin`. Finds Sofia's latest post:
a reel showing an El Poblado apartment tour with caption "Hidden gem! DM me for the contact 🏠"

Agent extracts: handle `@sofiamedellin_`, 45k followers, 6.2% engagement rate, business account,
bio mentions "partnerships: sofia@lifeinmde.com".

Hermes scores her: 81/100 (high followers ✅, high engagement ✅, exact mdeai niche ✅, business account ✅).

Paperclip task created: "Review influencer prospect: @sofiamedellin_ (score 81)"

Juan reviews: "Yes, great fit for apartments content partnership."

Outreach agent drafts a partnership message (not just a cold DM — a collaboration proposal with
specific value: free listing placement + revenue share for bookings from her audience).

Double approved → WhatsApp (her number from bio contact page) → Sofia replies in 2 days.

**Outcome:** Authentic creator partnership discovered from organic content. Zero cold scraping risk
(public data only). Sofia becomes a content partner — 3 posts/month about mdeai apartments.

---

## Story 7: Juan Monitors the Entire System from Telegram

**Actor:** Juan (mdeai operations manager)
**Trigger:** Morning check-in, 9:00am COT
**System:** OpenClaw + Paperclip + Supabase → all alerts via Telegram

### The story

Juan's job is to keep the AI marketing machine running and approve outbound actions. He doesn't
need to log into 5 separate dashboards — everything comes to his Telegram.

**His morning feed (Telegram, 9:00am):**

```
🤖 mdeai Systems — Daily Report

✅ OpenClaw: online (uptime 99.8%)
✅ Hermes: online
✅ Paperclip: online
✅ Postiz: online (3 posts queued for today)
✅ Supabase: online

📊 Yesterday's results:
• Contacts discovered: 34
• Leads scored ≥70: 12
• WhatsApp replies: 6
• Outreach approved: 5
• Messages sent: 5
• Viewing requests: 3
• Posts published: 3

⚠️ Needs your review (4 items):
1. Sponsor prospect: Cerveza Altiplano (score 74) — approve?
2. Follow-up draft: Carlos Rodríguez (Laureles, $680) — approve?
3. Event promo: Noches de Salsa June 14 — 4 posts — approve?
4. Influencer prospect: @sofiamedellin_ (score 81) — approve?

💰 Agent costs yesterday:
• Concierge: $2.40
• Discovery: $8.70
• Outreach: $3.20
• Content: $4.10
• TOTAL: $18.40 (monthly pace: $552 vs $375 budget ⚠️ review)
```

Juan taps each item. Paperclip web UI opens. He reviews drafts, approves or edits. 15 minutes total.

**Budget alert response:**
Discovery ran a 3-hour scraping session that used more tokens than expected. Juan:
1. Opens Paperclip → Discovery agent budget settings → reduces max runs from 5 to 3/hour
2. Sets a $12/day hard cap on discovery agent
3. Slack message to team: "Discovery cost spiked — capped at $12/day for this week"

**WA session check:**
Juan sees a warning: "WhatsApp session reconnected 3 times in last 24h — possible instability"
He SSHes to VPS, checks logs, sees rate limit warnings. Reduces outreach from 5/day to 3/day.

**Outcome:** Juan spends 15–30 minutes/morning approving AI actions instead of doing manual outreach.
He has full visibility, full control, and full compliance.

---

## Story 8: Camila Gets a No-Show Recovery Message (Event she didn't attend)

**Actor:** Camila (event ticket buyer)
**Trigger:** Event scan shows Camila didn't check in despite buying a ticket
**System:** OpenClaw + Supabase (ticket-validate edge fn) + follow-up agent

### The story

Camila bought a ticket to "Noches de Salsa" (Diego's event from Story 5). She paid $8 via Stripe.
Day of the event: she forgets and goes out with friends instead. No check-in registered.

**What happens 2 hours after event ends:**

Supabase query (run by rules-engine cron): find tickets purchased but not scanned for events
that ended in the last 4 hours.
Camila's ticket: bought, not scanned.

Supabase edge fn creates Paperclip task: "No-show recovery: Camila — Noches de Salsa"
OpenClaw event agent picks it up.

Draft message:
> "Hi Camila! 👋 Looks like you missed Noches de Salsa last night — hope you're doing well!
> Diego put on an amazing show. 🎶
>
> We're saving you early-bird access to the next one (July 12). Want in? Same venue, same vibe.
> Early bird tickets: $6 until June 30. 🎟️ mdeai.co/events/noches-julio"

Appears in Paperclip. Juan approves. Message sent next morning (9am).

Camila replies: "Oh no I totally forgot! Yes please!" → books July ticket.

**Outcome:** No-show converted to repeat ticket buyer. Message felt caring, not automated.
Revenue: $6 ticket + goodwill for future bookings.

---

## Story 9: Content Machine Posts While Everyone Sleeps

**Actor:** mdeai social accounts (IG, FB, LinkedIn, TikTok)
**Trigger:** Paperclip routine `generate-content` at 07:00 COT (12:00 UTC)
**System:** OpenClaw content agent + Hermes + Postiz

### The story

It's Thursday. The mdeai team has a full day of sales calls. Nobody has time to post on social media.

At 7:00am COT, Paperclip fires the `generate-content` routine:

OpenClaw content agent wakes:
1. Reads today's context from Supabase:
   - 2 new apartments just listed (El Poblado 1BR, Laureles 2BR)
   - Event this weekend: Noches de Salsa (88 tickets sold, 62 left)
   - Recent sponsor: Cerveza Altiplano just signed (announcement approved)
   - Trending this week: #DigitalNomadMedellin hashtag (3k posts)

2. Hermes drafts 3 posts tailored to current context:

**Post 1 (Instagram + TikTok) — 6:00pm:**
> "POV: Your new home in El Poblado has a rooftop view like this 🌇
> Fully furnished 1BR • Fast Wi-Fi • Pool • Starting at $1,450/mo
> DM us or tap the link in bio to see more ✨ #ExpatMedellín #DigitalNomadMedellin #Poblado"
> [Photo: rooftop sunset from the listing]

**Post 2 (Facebook) — 12:00pm:**
> "🎊 We're excited to welcome @CervezaAltiplano as our newest sponsor!
> Their craft beers will be flowing at all upcoming mdeai events. 🍺
> Check out our event calendar at mdeai.co/events"

**Post 3 (LinkedIn) — 9:00am:**
> "Why Laureles is becoming Medellín's top neighborhood for remote workers and professionals:
> ✅ Lower cost than El Poblado (20–35% cheaper)
> ✅ Better restaurants per block than anywhere in the city
> ✅ 10 min from el metro
> We just listed a 2BR in the heart of Laureles — link below."

3. All 3 drafts posted to Paperclip as comments by 7:08am COT.

4. Juan reviews over his morning coffee (15 min). Approves Post 1 and 3 as-is. Edits Post 2
   slightly: "Add the Altiplano logo mention." Agent updates and resubmits. Juan approves.

5. `postiz-agent posts:create` called for each approved post with optimal timing.

6. Posts publish automatically:
   - LinkedIn: 9:00am (peak professional time)
   - Facebook: 12:00pm (lunchtime engagement peak)
   - Instagram + TikTok: 6:00pm (evening engagement peak)

7. Next morning, analytics pulled: `postiz-agent analytics:post <job_id>` for each post.
   Results stored in `marketing.social_posts` table for Hermes optimization.

**Outcome:** 3 high-quality, on-brand social posts across 4 platforms with zero manual writing.
Team time invested: 15 minutes of approval in the morning. Result: consistent brand presence.

---

## Story 10: Suppression Works — Carlos Says Stop, Gets Stopped Immediately

**Actor:** Carlos (tenant lead who opted out)
**Trigger:** Carlos replies "STOP" to a follow-up message
**System:** OpenClaw suppression handler + Supabase

### The story

Two weeks ago, Carlos (from Story 3) viewed the Laureles apartment. He decided it wasn't right.
He's now getting a second follow-up message about a different listing. He's annoyed.

He replies: "STOP. No me escribas más."

**What happens in < 5 seconds:**

1. OpenClaw gateway receives "STOP. No me escribas más."
2. mdeai-concierge agent checks: message contains STOP keyword (also checks Spanish variants:
   "basta", "no más", "no me escribas", "cancelar", "eliminarme")
3. Immediate actions (no human approval needed — this is compliance):
   - POST → Supabase edge fn `wa-delivery-log`: {action:'suppression_add', reason:'stop_keyword'}
   - INSERT → marketing.suppression_list: {wa_number: Carlos's number, reason:'stop_keyword', added_by:'openclaw_auto'}
   - UPDATE → marketing.contacts: {status:'suppressed'}
   - Cancel any pending outreach tasks for Carlos in Paperclip
4. Agent sends confirmation:
   > "Entendido, Carlos. Te eliminé de nuestra lista. No recibirás más mensajes de mdeai.
   > Si en algún momento querés retomar la búsqueda, escribinos de nuevo.
   > ¡Que te vaya bien! 🙏"

5. Juan receives Telegram alert: "⚠️ Carlos added to suppression list (STOP keyword received)"

**What happens if someone tries to send to Carlos tomorrow:**
Every outreach check queries `marketing.suppression_list`. Carlos's number matches.
Message blocked before draft even created. Logged to `marketing.errors` for audit.

**Outcome:** Zero opt-out violations. Zero regulatory risk. Carlos is never contacted again unless
he re-initiates contact. Ley 1581/2012 (Colombia GDPR equivalent) compliance maintained.

---

## Story 11: WA Number Gets Warned — Juan Pauses Outreach in 5 Minutes

**Actor:** Juan (operations manager)
**Trigger:** OpenClaw logs show unusual WhatsApp behavior warning
**System:** OpenClaw monitoring + Telegram alert + Paperclip pause

### The story

It's a Wednesday afternoon. The outreach agent has been running for 2 weeks at 5 messages/day.
Suddenly, 3 messages in a row fail to deliver. Unusual. Then one bounces with a "temporary block"
error from Baileys.

**What happens:**

1. OpenClaw agent catches delivery failures → logs to Supabase: {status:'failed', error:'temporary_block'}
2. marketing.errors: 3 errors in 10 minutes → alert threshold triggered
3. Supabase edge fn → Paperclip task: "⚠️ ALERT: WhatsApp delivery failures detected — possible rate limit or ban warning"
4. Juan's Telegram: "⚠️ WARNING: WhatsApp session showing possible restriction. Check immediately."

**Juan's response (5 minutes):**

1. Paperclip board: pauses `qualify-leads` routine (disables further outreach)
2. SSH to VPS: `docker logs openclaw-gateway --tail 50 | grep whatsapp`
3. Sees: "Baileys rate-limit: too many messages to new recipients"
4. Action: reduce outreach to 2 messages/day. Wait 48 hours before resuming.
5. In Paperclip: updates outreach agent budget cap down to 2 runs/day
6. Slack to team: "WA outreach paused 48h — rate limit warning. Concierge (inbound) still running."

**48 hours later:**
Gradual resume. 2 messages/day for 1 week. No further warnings. Back to 5/day.

**Outcome:** Near-ban averted. 5-minute human response. Zero messages lost that weren't caught.
This is why human-in-the-loop governance matters — the system caught the signal, Juan acted fast.

---

## Story 12: The Full E15 Growth Machine Day (Future state — Month 3)

**Actor:** The entire mdeai system
**Trigger:** 07:00 COT, a regular Tuesday
**No human needed until 9:00am approval window**

### The story

It's 3 months into the E15 Growth Machine being fully operational. Here's what happens
automatically before Juan has his first coffee:

**07:00 COT — Content machine fires:**
- Hermes drafts 3 posts based on overnight data (2 new listings, 1 upcoming event, 1 sponsor renewal)
- Posts queued in Paperclip for morning review

**08:00 COT — Discovery fires:**
- firecrawl scrapes Eventbrite COL, public LinkedIn venue pages, Instagram event tags
- Apollo enriches 18 new business contacts
- Hermes scores all 18: 7 score ≥70 → Paperclip tasks created for review
- 11 score <70 → archived with reason in Supabase

**08:30 COT — Hermes optimization runs (weekly):**
- Reads last 7 days of lead_scores, conversion outcomes, reply rates
- Identifies: "leads in Sabaneta converting 40% better than expected — increase neighborhood weight from 20 to 25"
- Drafts weight update proposal → Paperclip task for Juan's approval

**09:00 COT — Juan opens Telegram:**
```
📋 Morning Queue — 12 items for approval

Content:
✅ Instagram + TikTok (sunset reel, new listing Poblado)
✅ Facebook (Cerveza Altiplano event promo)
✅ LinkedIn (Sabaneta neighborhood guide)

Discovery:
👥 7 new prospects — view batch

Optimization:
🔧 Hermes proposes: increase Sabaneta weight 20→25 (view analysis)

Outreach:
📱 4 approved contacts — review drafts
```

Juan approves all content (2 min), reviews and approves 5 of 7 prospects (3 min),
reads Hermes optimization proposal and approves (2 min), reviews outreach drafts —
edits 2, approves all 4 (5 min).

**09:15 COT — Everything executes:**
- 3 posts schedule in Postiz
- 5 prospects added to outreach queue (tomorrow's batch, not immediate)
- Hermes weights updated in Supabase: Sabaneta weight = 25
- 4 WhatsApp messages sent (staggered: 10am, 11am, 2pm, 4pm)

**Results by end of day:**
- 3 social posts published at peak times
- 4 personalized outreach messages sent
- 2 replies received → 2 new Paperclip tasks for human follow-up
- 7 new contacts in CRM (5 to outreach queue)
- Hermes updated → tomorrow's scores will be more accurate

**Juan's total active time:** 12 minutes.

**Outcome:** A full marketing operation running 24/7 with 12 minutes of human oversight per day.
This is the E15 Growth Machine at full speed.

---

## Validation Checklist

Before building each workflow, validate with real users:

| Story | Validate with | Key question |
|-------|---------------|--------------|
| 1 — Concierge | Camila (real expat) | "Would a WhatsApp reply at 2am feel helpful or intrusive?" |
| 2 — Landlord | Andrés (real landlord) | "Does this notification actually save you time?" |
| 3 — Follow-up | Carlos (local tenant) | "Does this follow-up feel personal or spammy?" |
| 4 — Sponsor outreach | María (real marketer) | "Would you reply to this message?" |
| 5 — Event promo | Diego (real event host) | "Does the auto-promotion content represent your event correctly?" |
| 6 — Influencer | Sofia (real creator) | "Does this partnership pitch feel authentic?" |
| 7 — Operations | Juan | "Does the Telegram morning report give you what you need?" |
| 8 — No-show | Event buyer | "Does this feel caring or annoying?" |
| 9 — Content | mdeai team | "Would you approve these posts as written?" |
| 10 — Suppression | Carlos | "Did STOP work immediately as expected?" |
| 11 — WA warning | Juan | "Was the alert clear enough to act in 5 minutes?" |
| 12 — Full machine | Founders | "Is the 12 min/day oversight realistic and sufficient?" |

---

*Companion: [`14-openclaw-production-plan.md`](14-openclaw-production-plan.md)*
*All characters are based on real Medellín market personas. Names are representative.*
