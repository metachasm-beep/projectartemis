import { createClient } from '@libsql/client';

/**
 * Matriarch Turso Client (LibSQL)
 * Handles Edge-ready SQLite interactions.
 */

const url = import.meta.env.VITE_TURSO_DATABASE_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.warn("MATRIARCH_TURSO: Missing Turso credentials in environment.");
}

export const turso = createClient({
  url: url || "",
  authToken: authToken || "",
});

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
