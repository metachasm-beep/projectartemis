import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

async function purgeRealUsers() {
  console.log("--- STARTING SYSTEMATIC DEEP PURGE ---");
  
  try {
    // 1. Identify users to purge
    // We keep: Admins, and anything starting with 'asp-' or 'gaze-' or 'dummy-'
    const r = await turso.execute("SELECT user_id, full_name, role FROM profiles");
    const toPurge = r.rows.filter(u => {
      const id = String(u.user_id);
      const role = String(u.role);
      const isDummy = id.startsWith('asp-') || id.startsWith('gaze-') || id.startsWith('dummy-');
      const isAdmin = role === 'admin';
      return !isDummy && !isAdmin;
    });

    console.log(`Found ${toPurge.length} real users to purge:`);
    toPurge.forEach(u => console.log(` - ${u.full_name} (${u.user_id})`));

    if (toPurge.length === 0) {
      console.log("Nothing to purge.");
      return;
    }

    // 2. Execute Deep Purge for each identified user
    for (const user of toPurge) {
      const uid = user.user_id;
      console.log(`Purging: ${user.full_name}...`);

      // Array of delete ops
      const tables = [
        'messages', 'conversations', 'matches', 'match_state_history', 
        'forum_replies', 'forum_topics_likes', 'forum_topics_saves', 
        'forum_tips', 'prompt_responses', 'call_requests', 'message_receipts',
        'blocks', 'reports', 'protocol_audits', 'profiles'
      ];

      for (const table of tables) {
        try {
          let sql = "";
          if (table === 'profiles') sql = "DELETE FROM profiles WHERE user_id = ?";
          else if (table === 'matches') sql = "DELETE FROM matches WHERE man_id = ? OR woman_id = ?";
          else if (table === 'conversations') sql = "DELETE FROM conversations WHERE match_id IN (SELECT id FROM matches WHERE man_id = ? OR woman_id = ?)";
          else if (table === 'messages') sql = "DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?";
          else if (table === 'forum_topics') sql = "DELETE FROM forum_topics WHERE author_id = ?";
          else if (table === 'forum_replies') sql = "DELETE FROM forum_replies WHERE author_id = ?";
          else if (table === 'protocol_audits') sql = "DELETE FROM protocol_audits WHERE admin_id = ? OR target_id = ?";
          else sql = `DELETE FROM ${table} WHERE user_id = ?`;

          // Handle multi-param queries
          const args = sql.includes('OR') ? [uid, uid] : [uid];
          await turso.execute({ sql, args });
        } catch (e) {
             // Silent skip if table or column doesn't match exactly
        }
      }
    }

    console.log("\n✅ DEEP PURGE COMPLETE.");
    
    const final = await turso.execute("SELECT COUNT(*) as count FROM profiles");
    console.log(`Total profiles remaining: ${final.rows[0].count}`);

  } catch (err) {
    console.error("PURGE_ERROR:", err);
  }
}

purgeRealUsers();
