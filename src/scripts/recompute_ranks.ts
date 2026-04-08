import { createClient } from '@libsql/client';

const turso = createClient({
  url: "libsql://matriarch-metachasm-beep.aws-ap-south-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzUzMjAzMzIsImlkIjoiMDE5ZDU5NTMtYzAwMS03YjhkLTkzZDYtZDM3YzMzN2EzMDVkIiwicmlkIjoiN2IyY2ExMzctZmU4NC00YTQ5LWJiZjctYWYyODQzZWIxNDlmIn0.7PIfrrat-NpZDA7p3Ewsku2DtNuMwvKsGpHhQTp43i06mh44NLj4a5uaL69lPwocH-VyXBc6cqw7ccO0AduQAg"
});

async function recomputeRanks() {
  console.log("Commencing the Recompute Ritual...");
  
  // 1. Fetch all men
  const result = await turso.execute("SELECT user_id, is_verified, rank_score, created_at FROM profiles WHERE role = 'man'");
  const men = result.rows.map(r => ({
    user_id: r.user_id as string,
    is_verified: Number(r.is_verified) || 0,
    rank_score: Number(r.rank_score) || 0,
    created_at: r.created_at as string
  }));

  console.log(`Fetched ${men.length} aspirants for ranking.`);

  // 2. Sort by Doctrine: Verified First, then Score, then Seniority
  men.sort((a, b) => {
    // 1. Seal of Excellence (is_verified)
    if (b.is_verified !== a.is_verified) {
      return b.is_verified - a.is_verified;
    }
    // 2. Rank Score
    if (b.rank_score !== a.rank_score) {
      return b.rank_score - a.rank_score;
    }
    // 3. Seniority (Tie breaker - oldest first)
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  // 3. Prepare Batch Update
  console.log("Calculating exclusive absolute ranks...");
  const updates = men.map((man, index) => {
    const rank = index + 1;
    return {
      sql: "UPDATE profiles SET absolute_rank = ? WHERE user_id = ?",
      args: [rank, man.user_id]
    };
  });

  // 4. Execute in batches of 50 to avoid payload limits
  const batchSize = 50;
  for (let i = 0; i < updates.length; i += batchSize) {
    const chunk = updates.slice(i, i + batchSize);
    console.log(`Updating ranks for batch ${Math.floor(i / batchSize) + 1}...`);
    await turso.batch(chunk, "write");
  }

  console.log("The Exclusive Ranking Ritual is complete.");
}

recomputeRanks().catch(err => {
  console.error("Ritual failed:", err);
  process.exit(1);
});
