import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function hunt() {
  const r = await turso.execute(`
    SELECT user_id, full_name, role, onboarding_status, created_at 
    FROM profiles 
    WHERE role IS NULL 
    OR role = '' 
    OR onboarding_status IS NULL 
    OR (onboarding_status != 'COMPLETED' AND onboarding_status != 'complete')
  `);
  console.log("--- SUSPICIOUS / MISSING PROFILES ---");
  console.log(JSON.stringify(r.rows, null, 2));
}

hunt();
