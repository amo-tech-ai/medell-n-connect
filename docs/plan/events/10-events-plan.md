# mdeai Event AI Platform Plan

## Best overall architecture

```text
CopilotKit = AI user interface
Mastra = main agent/workflow brain
Google ADK = Google Maps/Search sidecar
Google Maps + Places = venue/location intelligence
Supabase = source of truth
pgvector = personalization/search memory
Stripe = tickets/payments
Hermes = scoring/recommendations
OpenClaw = approved execution: WhatsApp, screenshots, reminders
```

Core rule: **Supabase owns truth. AI proposes. Humans approve. OpenClaw executes only approved jobs.** 

---

# 1. Best GitHub repos to use

| Rank | Repo                                                                                                                                                               | Score | Best use                                         |
| ---: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----: | ------------------------------------------------ |
|    1 | [https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) |    99 | Main AI UI + Mastra foundation                   |
|    2 | [https://github.com/google/adk-python](https://github.com/google/adk-python)                                                                                       |    94 | Google ADK sidecar for Maps/Search agents        |
|    3 | [https://github.com/google/adk-samples](https://github.com/google/adk-samples)                                                                                     |    92 | ADK implementation examples                      |
|    4 | [https://github.com/visgl/react-google-maps](https://github.com/visgl/react-google-maps)                                                                           |    96 | React Google Maps, Advanced Markers, InfoWindows |
|    5 | [https://github.com/atef-ataya/ai-event-planner](https://github.com/atef-ataya/ai-event-planner)                                                                   |    88 | ADK multi-agent event planning ideas             |
|    6 | [https://github.com/SamurAIGPT/Open-Pomelli](https://github.com/SamurAIGPT/Open-Pomelli)                                                                           |    89 | AI campaign/creative studio ideas                |
|    7 | [https://github.com/yoanbernabeu/OpenStreamPoll](https://github.com/yoanbernabeu/OpenStreamPoll)                                                                   |    84 | Live polls, Q&A, audience voting                 |
|    8 | [https://github.com/HiEventsDev/hi.events](https://github.com/HiEventsDev/hi.events)                                                                               |    80 | Ticketing/QR/check-in reference only             |
|    9 | [https://github.com/thepriyanshumishra/match-my-sponser-web](https://github.com/thepriyanshumishra/match-my-sponser-web)                                           |    94 | Sponsor marketplace UX                           |
|   10 | [https://github.com/altr2026/altr_sponsorship_mvp](https://github.com/altr2026/altr_sponsorship_mvp)                                                               |    92 | Sponsor lifecycle + ROI strategy                 |

CopilotKit is built for agentic UI and generative app experiences, while ADK is Google’s open-source toolkit for building and deploying agents. ([GitHub][1])

---

# 2. Core tech stack

| Layer               | Tool                                | Score | Why                                             |
| ------------------- | ----------------------------------- | ----: | ----------------------------------------------- |
| Frontend            | Next.js + React + Tailwind + shadcn |    92 | Fast product UI                                 |
| AI UI               | CopilotKit                          |    99 | Chat, generative cards, human approval          |
| Agent brain         | Mastra                              |    96 | Workflows, tools, routing                       |
| Google intelligence | ADK sidecar                         |    94 | Maps/Search grounding without replacing Mastra  |
| Maps                | vis.gl React Google Maps            |    96 | Advanced markers, InfoWindows, map UX           |
| Database            | Supabase Postgres                   |    98 | Events, tickets, leads, sponsors                |
| Search memory       | pgvector                            |    90 | Personalized recommendations                    |
| Payments            | Stripe                              |    95 | Tickets, sponsors                               |
| Automation          | OpenClaw                            |    82 | WhatsApp, reminders, screenshots after approval |
| Scoring             | Hermes                              |    88 | Sponsor fit, venue fit, ranking, fraud signals  |

vis.gl supports Google Maps React components like `Map`, `Marker`, `AdvancedMarker`, and `InfoWindow`. ([GitHub][2])

---

# 3. Core features to build first

| Feature                 | Use case                                     | Priority |
| ----------------------- | -------------------------------------------- | -------- |
| AI event discovery chat | “What’s happening in Laureles tonight?”      | P0       |
| Real-time map pins      | Show events, venues, restaurants nearby      | P0       |
| Event cards in chat     | User sees event details without leaving chat | P0       |
| Host event wizard       | Roberto creates event by chat                | P0       |
| Venue picker + Places   | Select real venues with `place_id`           | P0       |
| Ticket checkout         | Stripe ticket purchase                       | P0       |
| QR wallet + scanner     | Buyer enters event with phone QR             | P0       |
| Lead capture            | Rentals/events/sponsor inquiry saved         | P0       |
| Admin approval gates    | AI cannot publish/send alone                 | P0       |
| Basic sponsor slots     | Bronze/Silver/Gold/Premium                   | P1       |

Your venue docs say MVP should focus on linking events to trusted places, enriching with Places, showing venue maps, and connecting that to tickets and QR scanning. 

---

# 4. Advanced features later

| Advanced feature                   | Use case                                          | Build phase |
| ---------------------------------- | ------------------------------------------------- | ----------- |
| AI campaign builder                | Generate 14-day WhatsApp/Instagram/TikTok plan    | Phase 2     |
| Open-Pomelli-style creative studio | Posters, stories, sponsor ads, videos             | Phase 2–3   |
| OpenStreamPoll                     | Live Q&A, audience voting, crowd favorite         | Phase 2–3   |
| Sponsor AI matching                | Match brands to events                            | Phase 3     |
| Hermes scoring                     | Sponsor fit, venue fit, no-show risk              | Phase 3     |
| OpenClaw WhatsApp automation       | Reminders, reports, leaderboard screenshots       | Phase 3     |
| Influencer outreach                | Warm outreach only after consent/reply            | Phase 3–4   |
| Contest engine                     | Beauty contests, weighted judges, audience voting | Phase 3     |
| pgvector personalization           | “Events like what I attended before”              | Phase 3     |
| Dynamic pricing                    | Ticket price suggestions                          | Phase 4     |

Campaign builder should follow a safe **Generate → Review → Submit for Approval** flow, not auto-posting. 

---

# 5. Real-world mdeai examples

## Example 1 — City event discovery

User asks:

> “What’s happening in El Poblado tonight?”

System:

* Mastra classifies event intent
* Supabase searches approved events
* ADK/Maps enriches venue context
* CopilotKit renders EventCards
* Map shows pins

Result:

* events
* distance
* price
* venue
* ticket CTA
* nearby restaurants

---

## Example 2 — Roberto creates an event

Roberto types:

> “Create a rooftop fashion mixer in Provenza for 120 people next Friday, GA 50k COP, VIP 150k COP.”

System:

* hostEventAgent fills draft
* Places validates venue
* capacity validator checks ticket total
* approval panel appears
* Roberto approves
* event publishes

---

## Example 3 — Sponsor matching

Event:

> Medellín Fashion Rooftop, 120 people, creators, beauty/fashion audience

Hermes recommends:

* cosmetics brands
* salons
* jewelry brands
* fashion boutiques
* beverage sponsors

Then Open-Pomelli-style tool generates:

* sponsor deck
* IG creative
* WhatsApp flyer
* branded event banner

Sponsor scoring formula should combine audience match, industry relevance, local presence, sponsorship history, and budget fit. 

---

## Example 4 — OpenClaw automation

After approval:

* T-24h: send WhatsApp directions
* T-2h: remind staff
* After event: send sponsor ROI report
* For contests: send leaderboard screenshot

OpenClaw is best for scheduled operations, WhatsApp execution, browser screenshots, long-running jobs, and marketing automation after approval. 

---

# 6. Implementation roadmap

## Phase 1 — MVP foundation

| Order | Build                        | Why                      |
| ----: | ---------------------------- | ------------------------ |
|     1 | Supabase event/ticket schema | Source of truth          |
|     2 | CopilotKit + Mastra runtime  | AI UI foundation         |
|     3 | `/chat` with event discovery | Main user experience     |
|     4 | MapContext + vis.gl map pins | Real-time city interface |
|     5 | EventCard generative UI      | Better than text replies |
|     6 | Host event wizard            | Roberto can publish      |
|     7 | Venue picker + Places        | No fake venues           |
|     8 | Stripe checkout              | Revenue                  |
|     9 | QR ticket wallet             | Buyer experience         |
|    10 | Staff QR scanner             | Event-day proof          |

---

## Phase 2 — Marketing + engagement

| Order | Build                                  |
| ----: | -------------------------------------- |
|     1 | Campaign builder UI                    |
|     2 | `campaign-generate-plan` edge function |
|     3 | AI post timeline                       |
|     4 | Admin approval queue                   |
|     5 | Open-Pomelli-style creative generator  |
|     6 | OpenStreamPoll-style live Q&A/polls    |
|     7 | Basic sponsor packages                 |

The campaign generator should create draft posts using Gemini, write them to `marketing.posts`, and keep them as drafts until approved. 

---

## Phase 3 — Sponsor intelligence

| Order | Build                         |
| ----: | ----------------------------- |
|     1 | Sponsor profile pages         |
|     2 | Sponsor dashboard             |
|     3 | Sponsor-event AI matching     |
|     4 | Hermes sponsor scoring        |
|     5 | ROI reports                   |
|     6 | OpenClaw approved outreach    |
|     7 | Sponsor discovery pipeline    |
|     8 | Co-branded campaign generator |

The sponsorship system already identifies missing sponsor chat intents, sponsor dashboard, AI functions, and Stripe secrets as key blockers. 

---

## Phase 4 — Advanced automation

| Order | Build                          |
| ----: | ------------------------------ |
|     1 | OpenClaw WhatsApp reminders    |
|     2 | Sponsor report screenshots     |
|     3 | Influencer warm outreach       |
|     4 | Contest leaderboard broadcasts |
|     5 | Post-event AI summaries        |
|     6 | pgvector personalization       |
|     7 | Venue utilization analytics    |
|     8 | Advanced no-show prediction    |

Influencer outreach must be warm only: WhatsApp/email first, then IG/TikTok DM only after a positive reply. 

---

# 7. What to avoid

| Avoid                               | Why                             |
| ----------------------------------- | ------------------------------- |
| ADK replacing Mastra                | Creates two brains              |
| OpenClaw controlling payments/votes | Unsafe                          |
| Auto-publishing campaigns           | Ban/legal risk                  |
| Auto-scraping LinkedIn heavily      | TOS/account risk                |
| Building contests before tickets    | Too much fraud/legal complexity |
| Copying Hi.Events code              | AGPL/license + wrong stack      |
| Adding 20 agents early              | Overengineering                 |

---

# Final recommendation

Build this order:

```text
1. Events + tickets
2. Chat + map discovery
3. Venue intelligence
4. Campaign builder
5. Sponsor matching
6. OpenClaw automation
7. Contests + live engagement
8. Advanced personalization
```

Best product positioning:

```text
mdeai = AI city concierge + event OS for Medellín
```

Best technical strategy:

```text
Mastra owns orchestration.
CopilotKit owns UI.
ADK owns Google tool intelligence.
Supabase owns truth.
OpenClaw only executes approved operations.
Hermes scores and recommends.
```

[1]: https://github.com/CopilotKit/CopilotKit?utm_source=chatgpt.com "CopilotKit"
[2]: https://github.com/visgl/react-google-maps?utm_source=chatgpt.com "visgl/react-google-maps: React components and hooks for ..."
