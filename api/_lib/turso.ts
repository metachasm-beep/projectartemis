import { createClient } from '@libsql/client';

const url = process.env.TURSO_DB_URL || process.env.VITE_TURSO_DATABASE_URL || '';
const authToken = process.env.TURSO_DB_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN || '';

if (!url || !authToken) {
  console.warn('⚠️ TURSO_DB_URL and TURSO_DB_AUTH_TOKEN must be set (or VITE_ counterparts)');
}

export const turso = createClient({
  url,
  authToken,
});
