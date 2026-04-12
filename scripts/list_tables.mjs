import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function listTables() {
  const r = await turso.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("--- DATABASE TABLES ---");
  console.log(r.rows.map(row => row.name));
}

listTables();
