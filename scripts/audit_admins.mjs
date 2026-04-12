import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function auditAdmins() {
  const r = await turso.execute("SELECT user_id, full_name, role, photos FROM profiles WHERE role = 'admin'");
  console.log("--- ADMIN PROFILES ---");
  console.log(JSON.stringify(r.rows, null, 2));
}

auditAdmins();
