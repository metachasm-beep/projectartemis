import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function check() {
  const names = ['Deepak Kashyap', 'Nitish Uniyal', 'Meher Chopra', 'METACHASM'];
  for (const name of names) {
    const r = await turso.execute({
      sql: "SELECT photos FROM profiles WHERE full_name = ?",
      args: [name]
    });
    console.log(`${name}: ${JSON.stringify(r.rows[0]?.photos)}`);
  }
}

check();
