import { createClient } from '@libsql/client';

let _turso: any = null;

export function getTurso() {
  if (!_turso) {
    const url = process.env.TURSO_DB_URL || process.env.VITE_TURSO_DATABASE_URL || 'libsql://dummy.turso.io';
    const authToken = process.env.TURSO_DB_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN || '';
    
    _turso = createClient({
      url,
      authToken,
    });
  }
  return _turso;
}
