import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

async function debug() {
  const turso = createClient({
    url: process.env.VITE_TURSO_DATABASE_URL || "",
    authToken: process.env.VITE_TURSO_AUTH_TOKEN || "",
  });

  const r = await turso.execute("SELECT * FROM profiles LIMIT 5");
  console.log("RAW ROWS:", JSON.stringify(r.rows, null, 2));

  r.rows.forEach((row, i) => {
    console.log(`\n--- Profile ${i} ---`);
    console.log(`photos type: ${typeof row.photos}`);
    console.log(`photos value: ${row.photos}`);
  });
}

debug();
