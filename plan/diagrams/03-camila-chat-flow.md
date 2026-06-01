# 03 — Camila rental chat + comparative turn

> `/chat` three-panel (PR-1 + PR-5). **routerAgent** dispatches **rental-search** workflow; pins via **MapContext** (read-only `useCoAgentState`). MVP search = **keyword/filters**, not pgvector. Canon: [`plan/prd/04-maps-grounding.md`](../prd/04-maps-grounding.md), [`06-rentals-leads.md`](../prd/06-rentals-leads.md).

```mermaid
sequenceDiagram
    actor Camila
    participant UI as /chat 3-panel
    participant CK as CopilotKit
    participant RT as /api/copilotkit
    participant RTR as routerAgent
    participant WF as rental-search workflow
    participant TOOL as search_rentals tool
    participant SB as Supabase apartments
    participant MAP as MapContext

    Camila->>UI: apartments near coworking under $800
    UI->>CK: submit
    CK->>RT: AG-UI stream
    RT->>RTR: classify intent rental_search
    RTR->>WF: run(filters)
    WF->>TOOL: search_rentals Zod in/out
    TOOL->>SB: keyword + filters 25 listings MVP
    SB-->>TOOL: rows
    TOOL-->>WF: ToolResponse cards + pins
    WF-->>CK: useCopilotAction render RentalCard
    CK->>UI: cards column
    CK->>MAP: mergePinsByCategory rental
    MAP->>UI: map column pins

    Camila->>UI: which is cheapest?
    UI->>CK: submit
    CK->>RT: stream with map state readable
    RT->>RTR: follow-up
    Note over RTR: read pins/prices from context<br/>no search_rentals call
    RTR-->>CK: answer from visible pins
    CK-->>UI: highlight cheapest card
```
