Yes — **atef-ataya/ai-event-planner** appears to use Google ADK as the orchestration layer around Gemini/GPT for event planning tasks like venue selection, decor ideas, PDF generation, and voice interactions, with Streamlit as the UI shell. For mdeai, the best move is to reuse the agentic planning pattern, not the UI, and then wire it into your Supabase + Maps + Stripe + WhatsApp stack.[github](https://github.com/atef-ataya/ai-event-planner/actions)[MDEAI-MASTER-PRD.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

## What ADK is doing here

The repo description says it “Plan[s] events using Google ADK + Gemini + GPT: venues, decor, PDF, voice & more” and is built with Streamlit. That strongly implies ADK is acting as the agent workflow layer that routes user intent into tool-using subtasks instead of doing everything in one prompt. In mdeai terms, that maps cleanly to “CopilotKit = AI UI” and “Mastra/ADK = orchestration,” while Gemini handles reasoning and content generation.[MDEAI-MASTER-PRD.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)[github](https://github.com/atef-ataya/ai-event-planner/actions)

## What to copy for mdeai

Copy the **agent decomposition**: one agent for venue discovery, one for agenda drafting, one for decor/production checklist, one for PDF or proposal output, and one for voice/chat capture. Copy the idea of structured event planning outputs, because that fits mdeai’s future event vertical better than a free-form chat assistant. Do not copy the Streamlit-first UX if the product is intended to live inside mdeai’s chat canvas and map UI.[github](https://github.com/atef-ataya/ai-event-planner/actions)[MDEAI-MASTER-PRD.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

## Best repo set for mdeai

|Rank|Repo|Score /100|Category|Best features|Weaknesses|Best mdeai use case|Workflow to copy|Tech stack|License risk|Full URL|
|---|---|---|---|---|---|---|---|---|---|---|
|1|pretix/pretix|98|Ticketing platforms|Best-in-class open-source ticket shop for complex events [github](https://github.com/pretix/pretix).|Heavy compared with a custom MVP.|Tickets, add-ons, promo codes, attendee passes.|Event setup → ticket types → checkout → issuance → fulfillment.|Python/Django [github](https://github.com/pretix/pretix).|Medium|[https://github.com/pretix/pretix](https://github.com/pretix/pretix)|
|2|fossasia/eventyay|96|Event management platform|Full event ecosystem and public-event tooling github+1.|Split across multiple repos.|Core organizer system and public event pages.|Event publish → sessions → speakers → attendee flow.|Open Event stack github+1.|Medium|[https://github.com/fossasia/eventyay](https://github.com/fossasia/eventyay)|
|3|fossasia/open-event-server|95|Event backend|Strong API-first event backend github+1.|Backend only.|mdeai event data model and APIs.|API-first events, tickets, speakers, check-in.|API server stack [github](https://github.com/fossasia/open-event-frontend).|Medium|[https://github.com/fossasia/open-event-server](https://github.com/fossasia/open-event-server)|
|4|fossasia/eventyay-checkin|93|QR check-in systems|Dedicated check-in flow github+1.|Narrow scope.|Door scanning and badge validation.|QR scan → attendee lookup → check-in state.|Event check-in app [github](https://github.com/fossasia/eventyay-checkin/issues).|Low|[https://github.com/fossasia/eventyay-checkin](https://github.com/fossasia/eventyay-checkin)|
|5|indico/indico|92|Conference apps|Enterprise-grade conference workflows github+1.|Broader and older architecture.|Multi-track conferences, speaker review, scheduling.|Call for papers → review → scheduling → sessions.|Python ecosystem github+1.|Medium|[https://github.com/indico/indico](https://github.com/indico/indico)|
|6|atef-ataya/ai-event-planner|91|AI event planners|ADK + Gemini/GPT event planning [github](https://github.com/atef-ataya/ai-event-planner/actions).|Demo-level, not production event ops.|AI planner inside CopilotKit.|Intent → tool calls → plan output.|Streamlit, Google ADK, Gemini, GPT [github](https://github.com/atef-ataya/ai-event-planner/actions).|Low|[https://github.com/atef-ataya/ai-event-planner](https://github.com/atef-ataya/ai-event-planner)|
|7|warrenshiv/AIEventPlanner|88|AI event planners|GPT-based theme, schedule, and budget suggestions [github](https://github.com/warrenshiv/AIEventPlanner).|Simple and likely toy-sized.|Event planning assistant baseline.|Prompt → schedule → budget.|Node + OpenAI [github](https://github.com/warrenshiv/AIEventPlanner).|Low|[https://github.com/warrenshiv/AIEventPlanner](https://github.com/warrenshiv/AIEventPlanner)|
|8|yoanbernabeu/OpenStreamPoll|86|Live event engagement|Live polling / audience participation [yoanbernabeu.github](https://yoanbernabeu.github.io/OpenStreamPoll/).|Smaller project.|Live finals voting and sponsor activations.|Join room → vote → live results.|Web app [yoanbernabeu.github](https://yoanbernabeu.github.io/OpenStreamPoll/).|Low|[https://github.com/yoanbernabeu/OpenStreamPoll](https://github.com/yoanbernabeu/OpenStreamPoll)|
|9|GDGVIT/live-poll|85|Live event engagement|Quiz/poll portal [github](https://github.com/GDGVIT/live-poll).|Lightweight.|Contest voting and audience engagement.|Poll creation → audience vote → leaderboard.|Web portal [github](https://github.com/GDGVIT/live-poll).|Low|[https://github.com/GDGVIT/live-poll](https://github.com/GDGVIT/live-poll)|
|10|attendize/Attendize|84|Ticketing platforms|Strong ticketing workflows [github](https://github.com/Attendize/Attendize).|Security/maintenance concerns per recent commentary [hi](https://blog.hi.events/top-5-open-source-event-ticketing-platforms/).|Quick-start ticketing core.|Ticket creation → order → attendee → QR.|Laravel/PHP [github](https://github.com/Attendize/Attendize).|Medium|[https://github.com/Attendize/Attendize](https://github.com/Attendize/Attendize)|
|11|open-event-manager/open-event-manager|82|Event management platforms|Simple create/manage public/private events [github](https://github.com/open-event-manager/open-event-manager).|Thin compared with eventyay/pretix.|Lightweight organizer CRUD.|Event create → manage location → publish.|Shell/install-based [github](https://github.com/open-event-manager/open-event-manager).|Low|[https://github.com/open-event-manager/open-event-manager](https://github.com/open-event-manager/open-event-manager)|
|12|eventalapp/evental|81|Event management platforms|Modern event manager UI [github](https://github.com/eventalapp/evental).|Less proven at scale.|Public event pages and organizer dashboard.|Publish event → manage attendees.|Next.js/TypeScript stack [github](https://github.com/eventalapp/evental).|Low|[https://github.com/eventalapp/evental](https://github.com/eventalapp/evental)|
|13|andersonmcalpine/groupplan|80|Event planning apps|Group planning coordination.|Not event-commerce oriented.|Collaborative planning for sponsor teams.|Shared checklist → voting → plan finalization.|Likely JS/web app.|Low|[https://github.com/andersonmcalpine/groupplan](https://github.com/andersonmcalpine/groupplan)|
|14|benjaminematton/venue-concierge|79|Venue discovery|Venue-oriented assistant concept.|Limited evidence of production depth.|Venue discovery and shortlist workflows.|Search venue → compare → save.|Likely modern web stack.|Low|[https://github.com/benjaminematton/venue-concierge](https://github.com/benjaminematton/venue-concierge)|
|15|ArokyaMatthew/Eventflow.ai|78|AI event planners|AI event flow concepts.|Likely early-stage.|Event flow generation.|Needs likely agent/tool pipeline.|AI/web app.|Low|[https://github.com/ArokyaMatthew/Eventflow.ai](https://github.com/ArokyaMatthew/Eventflow.ai)|
|16|pd5114-PJWSTK/EventFlow-AI|77|AI event planners|AI planning and workflow automation.|Early-stage.|Planning workflow prototype.|Prompt → plan → schedule.|AI/web app.|Low|[https://github.com/pd5114-PJWSTK/EventFlow-AI](https://github.com/pd5114-PJWSTK/EventFlow-AI)|
|17|cuentadeservicio377-cell/hermes-business-os|76|Agent workflow examples|Business-OS style automation.|Not event-specific.|Back-office workflow orchestration.|Task routing → approval → audit.|Likely orchestration-focused stack.|Low|[https://github.com/cuentadeservicio377-cell/hermes-business-os](https://github.com/cuentadeservicio377-cell/hermes-business-os)|
|18|thevillanelle/gather|75|Event planning apps|Group gathering coordination.|Likely basic.|Social planning and invites.|Invite → RSVP → itinerary.|Web app.|Low|[https://github.com/thevillanelle/gather](https://github.com/thevillanelle/gather)|
|19|RenukaReddy03/EventMate|74|Event planning apps|General event helper.|Unknown maturity.|Lightweight planning assistant.|Draft plan → reminders → tracking.|Web app.|Low|[https://github.com/RenukaReddy03/EventMate](https://github.com/RenukaReddy03/EventMate)|
|20|chris-suryo/glenn-events|73|Event management / promo|Event promo concepts.|Less proven.|Promo landing pages and lead capture.|Landing page → CTA → RSVP.|Web stack.|Low|[https://github.com/chris-suryo/glenn-events](https://github.com/chris-suryo/glenn-events)|

## Real-world examples

For a Medellín fashion/beauty contest finals event, pretix or Attendize can handle ticketing, eventyay/check-in can handle gate scanning, OpenStreamPoll or live-poll can handle audience voting, and Open-Pomelli-style automation can generate social posts and sponsor creatives. Indico is strongest when you need conference-grade program management, reviewer workflows, and session scheduling rather than a simple ticket page. The ADK event planner repo is best used as the prototype for mdeai’s “ask in natural language → get a structured plan” experience.github+7

## AI features to use

Use the ADK pattern for task decomposition, but keep the actual execution in mdeai’s existing architecture: CopilotKit for chat UI, Mastra or similar orchestration for multi-step workflows, Gemini for reasoning/content, and Supabase for canonical state. The high-value AI features to ship first are venue ranking, sponsor matching, campaign copy generation, event schedule drafting, and automated follow-up messages, because these map directly to revenue and operational lift. Avoid building a “chatbot that answers questions” without persistence, checkout, or workflows; the repo set above shows that event systems win when AI is attached to concrete objects like tickets, venues, sessions, polls, and attendees.github+1[MDEAI-MASTER-PRD.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)[github](https://github.com/atef-ataya/ai-event-planner/actions)

## What to use from ADK

From **atef-ataya/ai-event-planner**, use:

- Intent decomposition into sub-agents for venues, decor, schedule, PDF, and voice.[github](https://github.com/atef-ataya/ai-event-planner/actions)
    
- Structured outputs instead of raw chat text.[github](https://github.com/atef-ataya/ai-event-planner/actions)
    
- A multi-tool planning loop rather than a one-shot prompt.[github](https://github.com/atef-ataya/ai-event-planner/actions)
    

Do not use:

- Streamlit as the product shell for mdeai.
    
- A single-screen demo mindset.
    
- Any workflow that does not persist results to Supabase or trigger downstream actions.
    

## Best implementation path

1. Add an mdeai event-planning copilot that accepts a brief and returns venue shortlist, budget, timeline, sponsors, ticketing plan, and promo plan.
    
2. Use Google ADK only if you want agent graphs and multi-tool planning at the orchestration layer; otherwise keep the same idea inside Mastra.
    
3. Wire outputs into Supabase tables for events, sponsors, campaigns, tickets, QR passes, and polls.
    
4. Use Stripe for paid ticketing and sponsor packages.
    
5. Use WhatsApp for reminders and sharing.
    
6. Use Playwright to validate the full path from brief → event draft → ticket purchase → QR scan → live poll.
    

The mdeai PRD already prefers a tool-registry architecture where adding a vertical means one tool entry, one card component, and one pin-row entry, so your event stack should follow that same pattern rather than creating a separate app silo.MDEAI-ROADMAP.md+1

Would you like the next pass to be a scored CSV-style table for all 30+ repos you pasted, or a trimmed “top 20 only” architecture map with exact mdeai tables and endpoints?