import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co"; // Fallback to prevent fatal crash
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error("CRITICAL: Supabase credentials missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
