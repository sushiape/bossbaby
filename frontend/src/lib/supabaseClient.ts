import { createClient, type Session } from "@supabase/supabase-js";
import { resolveSupabaseConfig } from "./supabaseConfig";

const config = resolveSupabaseConfig(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const isSupabaseConfigured = config !== null;
export const supabase = config
  ? createClient(config.url, config.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null;

export function requireSupabaseConfig(): { url: string; anonKey: string } {
  if (!config) {
    throw new Error(
      "You Pick backend is not configured. Add a valid HTTP(S) VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }
  return config;
}

export async function currentSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function ensureAnonymousParticipant(): Promise<Session> {
  if (!supabase) requireSupabaseConfig();
  const existing = await currentSession();
  if (existing) return existing;
  const { data, error } = await supabase!.auth.signInAnonymously();
  if (error || !data.session) throw error ?? new Error("Anonymous sign-in returned no session.");
  return data.session;
}
