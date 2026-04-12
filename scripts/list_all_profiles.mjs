import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

// Check ALL profiles regardless of role—look for anyone with incomplete onboarding
const all = await turso.execute("SELECT user_id, full_name, role, onboarding_status, created_at FROM profiles ORDER BY created_at DESC");
console.log(`\nALL ${all.rows.length} profiles:\n`);
all.rows.forEach(r => {
  console.log(`  [${r.role?.toString().padEnd(5)}] [${(r.onboarding_status || 'NULL').toString().padEnd(12)}] ${r.full_name} (${String(r.user_id).slice(0,12)}...)`);
});
