import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function huntMeher() {
  const r = await turso.execute("SELECT * FROM profiles WHERE full_name LIKE '%Meher%'");
  console.log("--- MEHER HUNT RESULTS ---");
  console.log(JSON.stringify(r.rows, null, 2));
}

huntMeher();
