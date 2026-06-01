# DATA-041 — Human QA sign-off (venue_signals)

**Gate:** MIS-M1 editorial · **Owner:** Patricia  
**Audit date:** 2026-05-31 · **Rows live:** 30 venue_signals (20 restaurant + 10 anchor café/nightlife)

## Summary

| Check | Result |
|-------|--------|
| Restaurant signals with evidence | ✅ 20/20 |
| Anchor signals with evidence | ⚠️ 0/10 — Phase 1b before café hybrid |
| Rooftop leaders plausible | ✅ Relato 0.91, O.C.I. 0.96, Sambombi 0.85 |
| hidden_gem leaders | Mondongos Laureles 0.70, El Botánico 0.621 |
| No null confidence on restaurant rows | ✅ all ≥ 0.75 |

**Engineering pre-check:** PASS pending Patricia editorial spot-check on bold claims (O.C.I. rooftop 0.96, Carmen cocktail 0.85).

## Row audit (MCP export 2026-05-30)

| # | Name | Hood | rooftop | quiet | nomad | cocktail | hidden_gem | nightlife | conf | source | Eng ✓ |
|---|------|------|---------|-------|-------|----------|------------|-----------|------|--------|-------|
| 1 | O.C.I. | El Poblado | 0.96 | 0.78 | 0.30 | 0.88 | 0.55 | 0.50 | 0.94 | human_qa | ☐ |
| 2 | Relato | Provenza | 0.91 | 0.82 | 0.35 | 0.75 | 0.40 | 0.45 | 0.92 | human_qa | ☐ |
| 3 | Sambombi Bistró Local | Provenza | 0.85 | 0.75 | 0.40 | 0.70 | 0.50 | 0.55 | 0.90 | human_qa | ☐ |
| 4 | Verdeo | El Poblado | 0.78 | 0.65 | 0.54 | 0.57 | 0.63 | 0.43 | 0.75 | editorial | ☐ |
| 5 | La Sere by Juanma | El Poblado | 0.76 | 0.64 | 0.44 | 0.52 | 0.49 | 0.43 | 0.75 | editorial | ☐ |
| 6 | Alambique | El Poblado | 0.72 | 0.68 | 0.30 | 0.90 | 0.45 | 0.55 | 0.87 | human_qa | ☐ |
| 7 | Dos Santos Cantina | El Poblado | 0.65 | 0.60 | 0.35 | 0.82 | 0.50 | 0.70 | 0.86 | human_qa | ☐ |
| 8 | Rocoto | Laureles | 0.55 | 0.72 | 0.45 | 0.65 | 0.60 | 0.40 | 0.88 | human_qa | ☐ |
| 9 | Mamasita Medallo | El Poblado | 0.50 | 0.58 | 0.40 | 0.75 | 0.48 | 0.65 | 0.85 | human_qa | ☐ |
| 10 | Carmen | El Poblado | 0.40 | 0.70 | 0.25 | 0.85 | 0.45 | 0.35 | 0.93 | human_qa | ☐ |
| 11 | El Cielo | El Poblado | 0.35 | 0.65 | 0.20 | 0.80 | 0.50 | 0.30 | 0.91 | human_qa | ☐ |
| 12 | Mondongos Laureles | Laureles | 0.30 | 0.55 | 0.35 | 0.55 | **0.70** | 0.45 | 0.89 | human_qa | ☐ |
| 13–20 | Editorial batch (Cuzco, Moshi, Click Clack, …) | Medellín | 0.29–0.47 | … | … | … | 0.42–0.62 | … | 0.75 | editorial | ☐ |

## Sign-off

| Role | Name | Date | Verdict |
|------|------|------|---------|
| Editorial QA (Patricia) | | | ☐ Pass ☐ Fail |
| Engineering (Sofía) | auto pre-check 2026-05-30 | 2026-05-30 | ☐ Pass pending commit |

**Fail action:** Downgrade confidence or fix evidence row; do not mark MIS-M1 Done.
