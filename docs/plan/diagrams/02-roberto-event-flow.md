# 02 — Roberto creates an event via AI form-fill + HITL approval

> Phase-1 hero flow (PR-3). Roberto at `/host/event/new`; `hostEventAgent` fills the form via `useCopilotAction` handlers; HITL commits via `approval-commit` + `decide_approval()`. **UI: English Phase 1** (input may be Spanish). Canon: [`plan/prd/05-events-ticketing.md`](../prd/05-events-ticketing.md).

```mermaid
sequenceDiagram
    actor Roberto
    participant UI as /host/event/new
    participant CK as CopilotKit
    participant RT as /api/copilotkit
    participant MAS as hostEventAgent
    participant GEM as Gemini 3.5 Flash
    participant APR as approval-commit edge
    participant SB as Supabase

    Roberto->>UI: describes event in natural language
    UI->>CK: CopilotSidebar submit
    CK->>RT: AG-UI stream
    RT->>MAS: agent.run(messages)
    MAS->>GEM: parse → structured fields
    GEM-->>MAS: title, date, venue_query, tiers[]

    MAS-->>CK: useCopilotAction set_event_basics
    CK->>UI: form fields update
    MAS-->>CK: useCopilotAction set_venue
    CK->>UI: venue + place_id from tool
    loop ticket tiers
      MAS-->>CK: useCopilotAction add_ticket_tier
      CK->>UI: tier row added
    end

    MAS-->>CK: renderAndWaitForResponse preview_and_publish
    CK->>UI: ApprovalPanel Approve / Edit / Reject
    Roberto->>UI: Approve
    UI->>APR: POST approval-commit draft + trace
    APR->>SB: decide_approval APPROVED
    SB->>SB: INSERT events + event_tickets
    SB-->>UI: eventId
    UI-->>Roberto: published → /host/events/{eventId}
```
