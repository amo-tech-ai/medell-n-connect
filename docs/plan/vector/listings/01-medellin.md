[![Provenza, en El Poblado (Medellín) una de las calles más cool del mundo](https://images.openai.com/static-rsc-4/pGjBdtgJQkLl1Q4cspYTj5m0mFFqd9zcZzgCniLwUYJZp8Fy5BawvmSKoz3myn_A3GNFspqv39R4orzkFk_sMkN67MwdZ0w4ru65HkRJ0H3_j2zAcQGcw3S8J61Cbn9Ee7P4wfLUKafnEPI3RlOq8KIJ_yETirZsvECptqhHi4k?purpose=inline)](https://vivirenelpoblado.com/provenza-en-el-poblado-medellin-una-de-las-calles-mas-cool-del-mundo/?utm_source=chatgpt.com)

# Medellín Neighborhood Research Report for mdeai

## Summary

Best MVP dataset: **Laureles, El Poblado, Envigado, Sabaneta, Belén, Manila, Provenza, Ciudad del Río, Estadio, La Floresta**.

Best use: create **neighborhood summary embeddings** for Supabase pgvector so users can search by lifestyle, not only filters.

Example:

```text
“quiet area near cafés for remote work, not too touristy”
→ Laureles, La Floresta, Envigado, Manila
```

## Top source quality table

|Source|Type|Score|Best use|
|---|--:|--:|---|
|Medellin Guru|Expat/neighborhood guide|92|Cost, safety, walkability, expat comparisons|
|TomPlanMyTrip|Travel/local guide|90|Practical neighborhood pros/cons|
|Reddit r/digitalnomad / r/medellin|User forum|86|Real concerns, safety, noise, authenticity|
|MDE Community|Expat guide|84|Digital nomad/expat framing|
|Primavera Realty|Real estate guide|82|Rental buyer/foreigner positioning|
|Dannybooboo coworking guide|Blog|78|Cafés/coworking signals|
|Instagram/Facebook groups|Social proof|70|Trend signals, not reliable alone|

Medellin Guru explicitly compares popular neighborhoods by cost, safety, and walkability, and notes the author has lived in several Medellín metro areas. ([Medellin Guru](https://medellinguru.com/best-neighborhoods-in-medellin/ "5 Best Neighborhoods in Medellín: A Guide to Choosing a Neighborhood")) TomPlanMyTrip gives practical “who should stay where” guidance, including Laureles for restaurants without Poblado tourist prices, El Poblado for easy stays, Belén for budget, and Envigado for longer stays. ([Tomplanmytrip: Colombia Travel agency](https://www.tomplanmytrip.com/where-to-stay-medellin/ "Where To Stay in Medellin: Easily Find The Perfect District"))

## Neighborhood semantic profiles

|Neighborhood|Best for|Semantic tags|Watch-outs|
|---|---|---|---|
|**Laureles**|Remote workers, expats, walkability|calm, flat, green, cafés, local, residential, community, restaurants|Some areas far from metro; prices rising|
|**El Poblado**|First-timers, nightlife, luxury|upscale, international, easy, restaurants, hotels, nightlife, English-friendly|Expensive, touristy, noisy near Lleras/Provenza|
|**Manila**|Poblado access without chaos|walkable, cafés, boutique, calmer, near Provenza|Still Poblado pricing|
|**Provenza**|Nightlife, food, luxury stays|trendy, nightlife, restaurants, rooftops, social|Noise, tourist concentration|
|**Envigado**|Families, calm long stays|local, residential, safe-feeling, traditional, family, parks|Fewer cafés/coworking than Laureles/Poblado|
|**Sabaneta**|Budget/value, local life|affordable, metro access, local, quieter, practical|Farther from central Medellín|
|**Belén**|Budget renters, local practicality|affordable, local, services, less touristy, connected|Safety varies by sub-zone|
|**Ciudad del Río**|Modern lifestyle, professionals|modern, arts, MAMM, restaurants, central, apartments|Smaller zone, limited inventory|
|**Estadio / La 70**|Sports, nightlife, metro|stadium, bars, local nightlife, metro, affordable food|Noise on party streets|
|**La Floresta**|Quiet long stays|residential, local, walkable, calmer, parks|Less inventory, fewer international amenities|

Laureles is repeatedly described as walkable, leafy, residential, calm, café-rich, and popular with expats. ([Medellin Guru](https://medellinguru.com/guide-to-laureles/ "Laureles Medellín Guide: Living, Safety & Things to Do 2025")) El Poblado is described as the most popular and upscale foreigner area, with many hotels and furnished apartments. ([Medellin Guru](https://medellinguru.com/el-poblado-vs-laureles/ "El Poblado vs Laureles: Which is the Better Neighborhood to Live in?"))

## Best pgvector content to create

Create one embedding row per neighborhood:

```text
Neighborhood: Laureles
Best for: digital nomads, remote workers, long stays, café lifestyle
Vibe: calm, leafy, flat, residential, local but expat-friendly
Pros: walkable, restaurants, parks, cafés, community
Cons: prices rising, some areas far from metro
Avoid if: you want luxury nightlife every night
Good match for queries: quiet remote work, cafés, walkable, not too touristy
```

## Recommended Supabase structure

```sql
neighborhood_profiles
- id
- name
- city
- summary
- best_for text[]
- vibe_tags text[]
- pros text[]
- cons text[]
- safety_notes text
- transport_notes text
- coworking_notes text
- nightlife_level int
- tourist_level int
- budget_level int
- walkability_level int
- embedding vector
- sources jsonb
```

## What to embed first

1. Neighborhood summaries
    
2. Rental listing descriptions
    
3. Café/coworking notes
    
4. Safety and noise notes
    
5. User preference profiles
    

Do **not** embed payment data, IDs, private user info, or raw noisy comments.

## Real-world mdeai matching examples

|User query|Best matches|
|---|---|
|“quiet remote work area near cafés”|Laureles, La Floresta, Manila|
|“luxury apartment near nightlife”|Provenza, El Poblado|
|“family-friendly and calm”|Envigado, Sabaneta|
|“cheaper but still practical”|Belén, Sabaneta, Estadio|
|“first time in Medellín, easy and safe-feeling”|El Poblado, Manila, Laureles|
|“local vibe, less touristy”|Envigado, La Floresta, Belén|

Digital nomads care heavily about internet, workspaces, safety, walkability, cafés, restaurants, and social life. ([EVERYPLACE®](https://everyplace.co/blog/medellin-best-neighborhoods-for-digital-nomads/ "Medellin’s Best Neighborhoods for Digital Nomads: A Guide for Remote Workers - EVERYPLACE®"))

## Final recommendation

For mdeai MVP:

```text
Use Supabase pgvector for neighborhood meaning.
Use SQL/PostGIS for facts: price, bedrooms, distance, availability.
Use Maps for pins/routes.
Use Mastra to combine results.
```

Best first build: **10 neighborhood profile embeddings + 50 rental listing embeddings**.