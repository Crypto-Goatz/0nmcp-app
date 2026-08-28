import { createClient } from "@supabase/supabase-js"

// NO FALLBACK. This read `process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yaehbwimocvvnnlojkxe
// .supabase.co"` until 2026-08-28 — a default pointing at a Supabase project
// that has been DELETED (its DNS does not resolve, while sibling Supabase hosts
// answer 401 on the identical probe). A missing env would have bound this app to
// a host that cannot answer, and every caller that drops `error` would have
// rendered that as an empty result. Every other client in this repo already used
// `process.env.NEXT_PUBLIC_SUPABASE_URL!` with no fallback; this file was the one
// second source of truth for which database the app talks to.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Checked where a client is CREATED, not at module load: a throw at import time
// fails `next build` on a machine that has no env, which is a different bug.
function requireUrl(): string {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured (there is no default — the project this file used to fall back to has been deleted)")
  return SUPABASE_URL
}

/** Browser-safe client (anon key, respects RLS) */
export function getBrowserClient() {
  return createClient(requireUrl(), SUPABASE_ANON_KEY)
}

/** Server-side admin client (service role, bypasses RLS) */
export function getServiceClient() {
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured")
  }
  return createClient(requireUrl(), SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
