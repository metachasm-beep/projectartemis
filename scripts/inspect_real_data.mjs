import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function inspect() {
  const all = await turso.execute("SELECT * FROM profiles");
  console.log(`Total rows in profiles: ${all.rows.length}`);
  
  console.log("\nRAW DATA FOR NON-DUMMY MEN:");
  all.rows.filter(r => r.role === 'man' && !String(r.user_id).startsWith('asp-')).forEach(r => {
    console.log(`- ${r.full_name} (${r.user_id}):`);
    console.log(`  Photos (raw): ${r.photos}`);
  });

  console.log("\nNON-DUMMY WOMEN (should be more than 7 if users signed up?):");
  all.rows.filter(r => r.role === 'woman' && !String(r.user_id).startsWith('gaze-')).forEach(r => {
    console.log(`- ${r.full_name} (${r.user_id})`);
  });
}

inspect();
