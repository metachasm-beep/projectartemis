import { createClient } from '@libsql/client';
import { loadEnv } from 'vite';

async function main() {
  const env = loadEnv('development', process.cwd(), '');
  const turso = createClient({
    url: env.VITE_TURSO_DATABASE_URL || "",
    authToken: env.VITE_TURSO_AUTH_TOKEN || "",
  });

  console.log("🚀 Initializing Matriarch Turso DB migrations for Community Forums...");

  const queries = [
    `
    CREATE TABLE IF NOT EXISTS forum_circles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS forum_circle_members (
      circle_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (circle_id, user_id)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS forum_topics (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      circle_id TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT,
      author_avatar TEXT,
      likes_count INTEGER DEFAULT 0,
      replies_count INTEGER DEFAULT 0,
      total_aura_earned INTEGER DEFAULT 0,
      is_flagged BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS forum_topics_likes (
       topic_id TEXT NOT NULL,
       user_id TEXT NOT NULL,
       PRIMARY KEY (topic_id, user_id)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS forum_topics_saves (
       topic_id TEXT NOT NULL,
       user_id TEXT NOT NULL,
       PRIMARY KEY (topic_id, user_id)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS forum_replies (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT,
      author_avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS forum_tips (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `
  ];

  try {
    // using execute since some turso library versions don't expose executeMultiple easily.
    for (const q of queries) {
      await turso.execute(q);
    }
    console.log("✅ Forum tables successfully provisioned in Turso.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
}

main();
