import { createClient } from '@libsql/client';

const url = process.env.TURSO_DB_URL || '';
const authToken = process.env.TURSO_DB_AUTH_TOKEN || '';

if (!url || !authToken) {
  console.warn('⚠️ TURSO_DB_URL and TURSO_DB_AUTH_TOKEN must be set');
}

export const turso = createClient({
  url,
  authToken,
});
