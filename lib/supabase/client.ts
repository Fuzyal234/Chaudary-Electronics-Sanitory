import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client (anon key). Safe to expose — row-level security on
 * the database is the real access boundary. Returns `null` when env vars are
 * absent so the storefront still renders from the static seed and the admin
 * panel can show a "not configured" state instead of crashing.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anon);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anon as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
