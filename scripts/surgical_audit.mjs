import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function audit() {
  const count = await turso.execute("SELECT COUNT(*) as c FROM profiles");
  console.log(`Total profiles: ${count.rows[0].c}`);

  const meherById = await turso.execute({
    sql: "SELECT * FROM profiles WHERE user_id = ?",
    args: ['187f65a5-7c97-45c9-97fc-9afc4eef04ee']
  });
  console.log("\n--- MEHER BY ID ---");
  console.log(JSON.stringify(meherById.rows, null, 2));

  const admins = await turso.execute("SELECT user_id, full_name, role, photos FROM profiles WHERE role = 'admin'");
  console.log("\n--- ALL ADMINS ---");
  console.log(JSON.stringify(admins.rows, null, 2));
}

audit();
