import { createClient } from '@libsql/client';

/**
 * Matriarch Turso Client (LibSQL)
 * Handles Edge-ready SQLite interactions.
 */

const url = import.meta.env.VITE_TURSO_DATABASE_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

const isConfigured = !!(url && authToken);

if (!isConfigured) {
  console.warn("MATRIARCH_TURSO: Missing Turso credentials in environment. Site is in MOCK mode.");
}

// 🛡️ SAFETY GUARD: Prevent URL_INVALID crash if variables are missing
export const turso = isConfigured 
  ? createClient({
      url: url,
      authToken: authToken,
    })
  : {
      execute: async () => ({ rows: [], columns: [] }),
      batch: async () => [],
      close: () => {},
    } as any;

/**
 * Helper to handle JSON serialization for SQLite
 */
export const tursoHelpers = {
  serialize: (val: any) => JSON.stringify(val),
  deserialize: (val: string | null) => {
    if (!val) return null;
    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  }
};
