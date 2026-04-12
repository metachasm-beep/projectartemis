import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function audit() {
  try {
    const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("--- TABLES IN DATABASE ---");
    for (const row of tables.rows) {
      const count = await turso.execute(`SELECT COUNT(*) as c FROM "${row.name}"`);
      console.log(`${String(row.name).padEnd(20)}: ${count.rows[0].c} rows`);
    }

    console.log("\n--- DETAILED PROFILES SCAN ---");
    const profiles = await turso.execute("SELECT user_id, full_name, role, onboarding_status, created_at FROM profiles");
    profiles.rows.forEach(r => {
      console.log(`[${r.role}] [${r.onboarding_status || 'NULL'}] ${r.full_name} (${r.user_id})`);
    });

    console.log("\n--- PENDING CLAIMS SCAN ---");
    try {
      const claims = await turso.execute("SELECT * FROM pending_claims");
      claims.rows.forEach(r => console.log(`Claim: ${JSON.stringify(r)}`));
    } catch (e) { console.log("pending_claims table missing or empty"); }

  } catch (err) {
    console.error("AUDIT_ERROR:", err);
  }
}

audit();
