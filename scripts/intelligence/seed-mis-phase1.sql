-- MIS Phase 1 seed — human QA editorial scores (source=human_qa)
-- Run: via Supabase SQL or scripts/intelligence/verify-mis-phase1.mjs

-- neighborhood_profiles (8 priority hoods + Astorga)
INSERT INTO public.neighborhood_profiles (
  neighborhood_id, nightlife_density, safety_perception, digital_nomad_friendliness,
  tourist_density, noise_level, luxury_index, local_authenticity, rooftop_density,
  transit_quality, food_quality, gym_coworking_proximity, summary, evidence, source
)
SELECT n.id,
  CASE n.slug
    WHEN 'provenza' THEN 0.92 WHEN 'el-poblado' THEN 0.85 WHEN 'laureles' THEN 0.55
    WHEN 'manila' THEN 0.70 WHEN 'envigado' THEN 0.45 WHEN 'sabaneta' THEN 0.35
    WHEN 'centro' THEN 0.40 WHEN 'astorga' THEN 0.25 ELSE 0.50 END,
  COALESCE(n.safety_score, 0.7),
  COALESCE(n.nomad_score, 0.6),
  CASE n.slug WHEN 'provenza' THEN 0.88 WHEN 'centro' THEN 0.65 WHEN 'astorga' THEN 0.30 ELSE 0.55 END,
  CASE n.slug WHEN 'provenza' THEN 0.80 WHEN 'laureles' THEN 0.45 WHEN 'astorga' THEN 0.35 ELSE 0.55 END,
  CASE n.slug WHEN 'provenza' THEN 0.90 WHEN 'el-poblado' THEN 0.82 WHEN 'astorga' THEN 0.40 ELSE 0.55 END,
  CASE n.slug WHEN 'laureles' THEN 0.78 WHEN 'astorga' THEN 0.82 WHEN 'centro' THEN 0.72 ELSE 0.55 END,
  CASE n.slug WHEN 'provenza' THEN 0.88 WHEN 'el-poblado' THEN 0.75 ELSE 0.35 END,
  0.65, 0.80, 0.60,
  'Editorial Phase 1 profile for ' || n.name,
  jsonb_build_object('source', 'editorial', 'qa', 'MIS-M1'),
  'editorial'
FROM public.neighborhoods n
WHERE n.slug IN ('provenza','el-poblado','laureles','envigado','sabaneta','manila','centro','astorga')
ON CONFLICT (neighborhood_id) DO NOTHING;
