import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { resolveSupabaseConfig } from "../../../lib/supabaseConfig";

/**
 * The Staff Workspace runs in the same browser as the public site, which signs
 * visitors in anonymously. A second client with its own storageKey keeps the two
 * sessions from clobbering each other: signing in as staff must never end a
 * Participant's anonymous session, and vice versa.
 *
 * detectSessionInUrl is enabled here and nowhere else, because password recovery
 * returns through a URL fragment.
 */
export const STAFF_STORAGE_KEY = "bossbaby-staff-auth";

const config = resolveSupabaseConfig(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const isStaffBackendConfigured = config !== null;

export const staffSupabase: SupabaseClient | null = config
  ? createClient(config.url, config.anonKey, {
      auth: {
        storageKey: STAFF_STORAGE_KEY,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireStaffSupabase(): SupabaseClient {
  if (!staffSupabase) {
    throw new Error(
      "Supabase backend is not configured. Add a valid HTTP(S) VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }
  return staffSupabase;
}

export function requireStaffConfig(): { url: string; anonKey: string } {
  if (!config) throw new Error("Supabase backend is not configured.");
  return config;
}

export async function currentStaffSession(): Promise<Session | null> {
  if (!staffSupabase) return null;
  const { data, error } = await staffSupabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
