import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function findUsers() {
  const names = ['Srishti', 'Sristi', 'Shristi', 'Thethem', 'Thetham'];
  console.log(`--- SURGICAL SEARCH FOR: ${names.join(', ')} ---`);
  
  const results = [];
  for (const name of names) {
    const r = await turso.execute({
      sql: "SELECT * FROM profiles WHERE full_name LIKE ?",
      args: [`%${name}%`]
    });
    results.push(...r.rows);
  }

  if (results.length === 0) {
    console.log("No matches found in 'profiles' table.");
    // Check pending_claims just in case
    try {
        const claims = await turso.execute("SELECT * FROM pending_claims");
        console.log(`\nChecked ${claims.rows.length} pending claims...`);
        const claimMatches = claims.rows.filter(c => names.some(n => String(c.metadata || '').includes(n)));
        console.log(`Found ${claimMatches.length} matching claims.`);
        if (claimMatches.length > 0) console.log(JSON.stringify(claimMatches, null, 2));
    } catch (e) {
        console.log("No pending_claims table or error searching it.");
    }
  } else {
    console.log(`Found ${results.length} matches:`);
    console.log(JSON.stringify(results, null, 2));
  }
}

findUsers();
