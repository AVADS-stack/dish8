import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Validate the anon key looks like a JWT (starts with eyJ)
const isValidKey = supabaseUrl && supabaseAnonKey && supabaseAnonKey.startsWith("eyJ");

export const supabase = isValidKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => !!supabase;

// Log config status in development
if (import.meta.env.DEV) {
  if (!supabaseUrl) console.warn("[Dish8] VITE_SUPABASE_URL not set — using localStorage fallback");
  else if (!supabaseAnonKey) console.warn("[Dish8] VITE_SUPABASE_ANON_KEY not set — using localStorage fallback");
  else if (!isValidKey) console.warn("[Dish8] VITE_SUPABASE_ANON_KEY is invalid (should start with 'eyJ'). Get it from Supabase Dashboard → Settings → API → anon public key");
  else console.info("[Dish8] Supabase connected:", supabaseUrl);
}
