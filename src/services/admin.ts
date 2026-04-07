import { turso } from '@/lib/turso';
import type { MatriarchProfile } from '@/types';

export const AdminService = {
  /**
   * 📊 Absolute System Pulse: Board-level aggregates.
   */
  getSystemMetrics: async () => {
    try {
      const [menQ, womenQ, verifiedQ, topicsQ] = await Promise.all([
        turso.execute("SELECT COUNT(*) as count FROM profiles WHERE role = 'man'"),
        turso.execute("SELECT COUNT(*) as count FROM profiles WHERE role = 'woman'"),
        turso.execute("SELECT COUNT(*) as count FROM profiles WHERE is_verified = 1"),
        turso.execute("SELECT COUNT(*) as count FROM forum_topics")
      ]);

      return {
        totalMen: Number(menQ.rows[0]?.count || 0),
        totalWomen: Number(womenQ.rows[0]?.count || 0),
        verifiedProfiles: Number(verifiedQ.rows[0]?.count || 0),
        totalForumTopics: Number(topicsQ.rows[0]?.count || 0)
      };
    } catch (err) {
      console.error("ADMIN_METRICS_ERROR:", err);
      return { totalMen: 0, totalWomen: 0, verifiedProfiles: 0, totalForumTopics: 0 };
    }
  },

  /**
   * 🔍 Sovereign Roster Search: Deep DB text-search for profiles.
   */
  searchProfiles: async (queryText: string = "", limit: number = 50): Promise<MatriarchProfile[]> => {
    try {
      let sql = "SELECT * FROM profiles";
      let args: any[] = [];

      if (queryText && queryText.trim() !== '') {
        // Simple fuzzy search against name or city
        sql += " WHERE full_name LIKE ? OR city LIKE ? OR user_id LIKE ?";
        const wildcard = `%${queryText}%`;
        args = [wildcard, wildcard, wildcard];
      }

      sql += " ORDER BY created_at DESC LIMIT ?";
      args.push(limit);

      const r = await turso.execute({ sql, args });
      return r.rows as unknown as MatriarchProfile[];
    } catch (err) {
      console.error("ADMIN_SEARCH_ERROR:", err);
      return [];
    }
  },

  /**
   * 🛡️ Data Manipulation: Override profile properties manually.
   */
  updateProfileStatus: async (userId: string, updates: Partial<MatriarchProfile>) => {
    try {
      const setClauses: string[] = [];
      const args: any[] = [];
      
      Object.entries(updates).forEach(([key, value]) => {
        setClauses.push(`${key} = ?`);
        args.push(value);
      });

      if (setClauses.length === 0) return false;

      const sql = `UPDATE profiles SET ${setClauses.join(', ')} WHERE user_id = ?`;
      args.push(userId);

      await turso.execute({ sql, args });
      return true;
    } catch (err) {
      console.error("ADMIN_UPDATE_PROFILE_ERROR:", err);
      return false;
    }
  },

  /**
   * 🧪 Absolute Excision: Removes a user from the db fully.
   * Note: This does not delete their Supabase Auth Identity, merely their Matriarch access.
   */
  deleteUserRecord: async (userId: string) => {
    try {
      // Best-effort cascade delete starting with profiles. 
      // If FKs aren't strict, we should manually rip out sub-tables if needed.
      // But for now, deleting the profile stops access.
      await turso.execute({ sql: "DELETE FROM profiles WHERE user_id = ?", args: [userId] });
      return true;
    } catch (err) {
      console.error("ADMIN_DELETE_ERROR:", err);
      return false;
    }
  },

  /**
   * 🔥 Forum Purge: Nuke abusive or rogue forum topics instantly.
   */
  purgeForumTopic: async (topicId: string) => {
    try {
      await turso.batch([
        { sql: "DELETE FROM forum_replies WHERE topic_id = ?", args: [topicId] },
        { sql: "DELETE FROM forum_topics_likes WHERE topic_id = ?", args: [topicId] },
        { sql: "DELETE FROM forum_topics_saves WHERE topic_id = ?", args: [topicId] },
        { sql: "DELETE FROM forum_topics WHERE id = ?", args: [topicId] }
      ], "write");
      return true;
    } catch (err) {
      console.error("ADMIN_PURGE_FORUM_ERROR:", err);
      return false;
    }
  }
};
