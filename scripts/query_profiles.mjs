import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const result = await turso.execute("SELECT user_id, full_name, role, photos FROM profiles ORDER BY created_at DESC LIMIT 50");
result.rows.forEach(row => {
  console.log(JSON.stringify({ id: row.user_id, name: row.full_name, role: row.role, photos: row.photos }));
});
