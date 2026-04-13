import { createClient } from '@libsql/client';

async function forceReflow() {
  const client = createClient({
    url: 'libsql://matriarch-metachasm-beep.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzUzMjAzMzIsImlkIjoiMDE5ZDU5NTMtYzAwMS03YjhkLTkzZDYtZDM3YzMzN2EzMDVkIiwicmlkIjoiN2IyY2ExMzctZmU4NC00YTQ5LWJiZjctYWYyODQzZWIxNDlmIn0.7PIfrrat-NpZDA7p3Ewsku2DtNuMwvKsGpHhQTp43i06mh44NLj4a5uaL69lPwocH-VyXBc6cqw7ccO0AduQAg'
  });

  console.log("🌊 INITIATING EMERGENCY SOVEREIGN REFLOW...");
  
  try {
    // 1. Reset all ranks to a neutral state to break any sequential locks
    await client.execute("UPDATE profiles SET absolute_rank = 9999 WHERE role = 'man'");
    console.log("RESET: All ranks set to neutral zone.");

    // 2. Perform the atomic re-index
    await client.execute(`
      WITH ranked AS (
        SELECT user_id, 
        ROW_NUMBER() OVER (
          ORDER BY 
            is_verified DESC, 
            rank_score DESC, 
            created_at ASC, 
            user_id ASC
        ) as new_rank
        FROM profiles
        WHERE role = 'man'
      )
      UPDATE profiles
      SET absolute_rank = ranked.new_rank
      FROM ranked
      WHERE profiles.user_id = ranked.user_id
    `);
    console.log("CERTIFIED: Atomic re-indexing complete.");

    // 3. Verification
    const res = await client.execute("SELECT full_name, absolute_rank FROM profiles WHERE role='man' ORDER BY absolute_rank ASC LIMIT 10");
    console.log("--- 🏆 CURRENT TOP STANDINGS ---");
    console.table(res.rows);

  } catch (err) {
    console.error("REFLOW_CRITICAL_FAILURE:", err.message);
  }
}

forceReflow();
