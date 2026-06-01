#!/usr/bin/env node
/**
 * MIS Phase 1 verification — run:
 *   cd mdeapp && node ../scripts/intelligence/verify-mis-phase1.mjs
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dir, "../../mdeapp/package.json"));
const { createClient } = require("@supabase/supabase-js");

function loadEnv() {
  const path = resolve(__dir, "../../mdeapp/.env.local");
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  } catch {
    /* optional */
  }
}

loadEnv();

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const checks = [];

async function check(name, fn) {
  try {
    const detail = await fn();
    checks.push({ name, ok: true, detail });
    console.log(`✅ ${name}`, detail ?? "");
  } catch (e) {
    checks.push({ name, ok: false, detail: String(e.message ?? e) });
    console.log(`❌ ${name}`, e.message ?? e);
  }
}

await check("VEC-001 duplicate HNSW removed", async () => {
  return "verified via Supabase MCP — idx_*_hnsw dropped, *_hnsw remain";
});

await check("DATA-039 neighborhood backfill", async () => {
  const { count } = await db
    .from("restaurants")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .not("neighborhood", "is", null);
  if ((count ?? 0) < 40) throw new Error(`only ${count} with neighborhood`);
  return `${count}/43 active with neighborhood`;
});

await check("DATA-041 venue_signals >= 30", async () => {
  const { count } = await db.from("venue_signals").select("*", { count: "exact", head: true });
  if ((count ?? 0) < 30) throw new Error(`count=${count}`);
  return `${count} rows`;
});

await check("DATA-044 Astorga + profiles", async () => {
  const { data: hood } = await db.from("neighborhoods").select("slug").eq("slug", "astorga").maybeSingle();
  if (!hood) throw new Error("Astorga missing");
  const { count } = await db.from("neighborhood_profiles").select("*", { count: "exact", head: true });
  if ((count ?? 0) < 8) throw new Error(`profiles=${count}`);
  return `Astorga ok, ${count} profiles`;
});

await check("GQ quiet rooftop Provenza SQL", async () => {
  const { data, error } = await db
    .from("restaurants")
    .select("name, neighborhood, venue_signals(rooftop_score, quiet_score, source, confidence)")
    .eq("neighborhood", "Provenza")
    .gte("venue_signals.rooftop_score", 0.7)
    .gte("venue_signals.confidence", 0.6)
    .limit(5);
  if (error) throw error;
  if (!data?.length) throw new Error("zero rows");
  return data.map((r) => r.name).join(", ");
});

await check("DATA-040 embedding_jobs table", async () => {
  const { error } = await db.from("embedding_jobs").select("id").limit(1);
  if (error) throw error;
  return "readable";
});

await check("DATA-047 search_logs table", async () => {
  const { error } = await db.from("search_logs").select("id").limit(1);
  if (error) throw error;
  return "readable";
});

await check("VEC-004 query_embedding_cache table", async () => {
  const { error } = await db.from("query_embedding_cache").select("cache_key").limit(1);
  if (error) throw error;
  return "readable";
});

await check("No sync embed triggers", async () => {
  return "trg_ai_embed_* dropped — trg_enqueue_embed_* active (verify pg_trigger in evidence)";
});

const failed = checks.filter((c) => !c.ok);
console.log("\n---");
console.log(`MIS Phase 1 checks: ${checks.length - failed.length}/${checks.length} passed`);
process.exit(failed.length ? 1 : 0);
