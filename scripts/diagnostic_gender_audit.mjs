import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function diagnosticAudit() {
  const res = await turso.execute("SELECT user_id, full_name, role, photos FROM profiles WHERE user_id LIKE 'dummy-%' ORDER BY role, user_id");
  console.log(`Auditing ${res.rows.length} dummy profiles...`);
  
  res.rows.forEach(r => {
    const photos = JSON.parse(r.photos || '[]');
    console.log(`[${r.role.toUpperCase()}] ID: ${r.user_id} | Name: ${r.full_name} | Photo: ${photos[0]}`);
  });
}

diagnosticAudit();
