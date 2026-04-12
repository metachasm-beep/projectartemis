import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const all = await turso.execute("SELECT user_id, full_name, role, onboarding_status, photos, created_at FROM profiles ORDER BY created_at DESC LIMIT 80");
const women = all.rows.filter(r => r.role === 'woman');
console.log(`\nTotal rows: ${all.rows.length}, Women: ${women.length}\n`);
women.forEach(r => {
  console.log(`  [${r.onboarding_status || 'NULL'}] ${r.full_name} (${r.user_id}) - photos: ${String(r.photos).slice(0,60)}`);
});
