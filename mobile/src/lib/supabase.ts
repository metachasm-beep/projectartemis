import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cgjtpevnmwxyusowfani.supabase.co";
const supabaseAnonKey = "sb_publishable_dyOcTPE4SXlGHyX2FfJ0tQ_G-NyA8Kq";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
