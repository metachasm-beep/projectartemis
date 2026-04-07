import { createClient } from '@libsql/client';
import { loadEnv } from 'vite';

async function main() {
  const env = loadEnv('development', process.cwd(), '');
  const turso = createClient({
    url: env.VITE_TURSO_DATABASE_URL || "",
    authToken: env.VITE_TURSO_AUTH_TOKEN || "",
  });

  console.log("🚀 Applying live schema alterations for Aura Tipping...");

  try {
    // Graceful column addition. SQLite ALTER TABLE ADD COLUMN does not support IF NOT EXISTS natively, but we'll try. 
    // The most stable option in LibSQL without blowing up the script on duplicate runs is ignoring the exception natively.
    try {
      console.log("Adding total_aura_earned to forum_topics...");
      await turso.execute("ALTER TABLE forum_topics ADD COLUMN total_aura_earned INTEGER DEFAULT 0;");
      console.log("✅ total_aura_earned appended successfully.");
    } catch (e: any) {
      if (e.message && e.message.includes("duplicate column name")) {
        console.log("⚡ total_aura_earned already exists. Skipping.");
      } else {
        throw e;
      }
    }

    console.log("Creating forum_tips tracking ledger...");
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS forum_tips (
        id TEXT PRIMARY KEY,
        topic_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ forum_tips ledger provisioned.");

  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
}

main();
