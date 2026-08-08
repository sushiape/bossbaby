import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const SUGGESTIONS_TABLE = 'suggestions';
export const VOTES_TABLE = 'youpick_votes';

export const isSupabaseConfigured = Boolean(supabase);

export default supabase;