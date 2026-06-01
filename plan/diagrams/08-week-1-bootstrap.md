# 08 — Week 1 bootstrap task dependency graph

> The 6 foundation tasks (F01–F06) and their order. F01 + F02 + F03 are Day 1; F04 + F05 are Day 2; F06 is Day 3. End-of-week-1 = "hola" echoes in Vercel preview.

```mermaid
flowchart TB
    F01[F01 — Bootstrap mdeapp<br/>cp examples/integrations/mastra]
    F02[F02 — pingAgent<br/>Gemini 3.5 Flash + scope:thread]
    F03[F03 — Strip demos<br/>rewrite page.tsx + layout.tsx]
    F04[F04 — Wire .env.local<br/>Supabase + Maps + Gemini]
    F05[F05 — Boot verification<br/>npm install + npm run dev + hola echo]
    F06[F06 — Git + GitHub + Vercel preview]

    F01 --> F02
    F01 --> F03
    F02 --> F05
    F03 --> F05
    F04 --> F05
    F01 -.skips deletes that F03 owns.-> F04
    F05 --> F06

    classDef day1 fill:#c8e6c9,stroke:#2e7d32
    classDef day2 fill:#fff9c4,stroke:#f57f17
    classDef day3 fill:#e1f5fe,stroke:#0277bd
    class F01,F02,F03 day1
    class F04,F05 day2
    class F06 day3
```

## Critical-path notes

- **F01 is blocking** for F02 + F03 (you need the example tree present before edits).
- **F02 + F03 + F04 are parallelizable on day 2.** Different files, no conflicts.
- **F05 (boot) must follow all three** — if F02 / F03 / F04 are incomplete, dev server fails.
- **F06 is gated by F05 passing.** Do not push a broken bootstrap to GitHub.

## Estimated wall-clock

| Day | Tasks | Wall-clock |
|---|---|---|
| Day 1 (~2h) | F01 + F02 + F03 | 30 min + 45 min + 45 min |
| Day 2 (~1h) | F04 + F05 | 20 min + 40 min (incl. `npm install`) |
| Day 3 (~30m) | F06 | git + gh + Vercel hookup |
