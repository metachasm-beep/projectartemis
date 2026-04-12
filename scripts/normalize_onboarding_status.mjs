import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function normalize() {
  const r = await turso.execute("UPDATE profiles SET onboarding_status = 'COMPLETED' WHERE onboarding_status = 'complete' OR onboarding_status IS NULL");
  console.log(`Normalized rows: ${r.rowsAffected}`);
}

normalize();
