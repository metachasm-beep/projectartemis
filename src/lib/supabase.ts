import { createClient } from "@supabase/supabase-js";

// Safe extraction of environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Aggressive validation to prevent the library from throwing fatal errors during boot
const validUrl = (supabaseUrl && typeof supabaseUrl === 'string' && supabaseUrl.startsWith("http")) 
  ? supabaseUrl 
  : "https://missing-project-config.supabase.co";

const validKey = (supabaseAnonKey && typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 20) 
  ? supabaseAnonKey 
  : "missing-anon-key-placeholder-must-be-long-enough-to-pass-internal-checks";

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("MATRIARCH_BOOT: Supabase credentials missing. UI is in OFFLINE/STUB mode.");
}

export const supabase = createClient(validUrl, validKey);
