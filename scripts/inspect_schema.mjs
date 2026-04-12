import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const result = await turso.execute("PRAGMA table_info(profiles)");
result.rows.forEach(row => console.log(row.name, '->', row.type));
