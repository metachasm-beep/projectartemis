import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const r = await turso.execute("SELECT COUNT(*) as total, role FROM profiles GROUP BY role");
console.log('\nTotal profiles by role in TURSO:');
r.rows.forEach(row => console.log(`  ${row.role}: ${row.total}`));

const gaze = await turso.execute("SELECT user_id, full_name FROM profiles WHERE user_id LIKE 'gaze-%'");
console.log(`\nGaze profiles: ${gaze.rows.length}`);
gaze.rows.forEach(r => console.log(`  ${r.user_id} - ${r.full_name}`));
