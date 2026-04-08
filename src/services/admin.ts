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
   */
  deleteUserRecord: async (userId: string) => {
    try {
      await turso.batch([
        { sql: "DELETE FROM forum_replies WHERE user_id = ?", args: [userId] },
        { sql: "DELETE FROM forum_topics_likes WHERE user_id = ?", args: [userId] },
        { sql: "DELETE FROM forum_topics_saves WHERE user_id = ?", args: [userId] },
        { sql: "DELETE FROM profiles WHERE user_id = ?", args: [userId] }
      ], "write");
      return true;
    } catch (err) {
      console.error("ADMIN_DELETE_ERROR:", err);
      return false;
    }
  },

  /**
   * 🎨 Visual Curation Index: Fetch all profile identifying data.
   * Optimized with a schema-resilient normalization layer.
   */
  getAllCurationProfiles: async (): Promise<MatriarchProfile[]> => {
    try {
      const r = await turso.execute("SELECT * FROM profiles ORDER BY created_at DESC");
      
      return r.rows.map(row => {
        // Normalization Layer: Bridge between 'photos' (JSON) and 'image_url' (String)
        let photos: string[] = [];
        
        if (row.photos) {
          photos = typeof row.photos === 'string' ? JSON.parse(row.photos) : row.photos;
        } else if (row.image_url) {
          photos = [row.image_url as string];
        }

        return {
          ...row,
          photos
        } as unknown as MatriarchProfile;
      });
    } catch (err) {
      console.error("ADMIN_CURATION_FETCH_ERROR:", err);
      return [];
    }
  },

  /**
   * 🌪️ Purge Protocol: Automated removal of visual asset clones.
   */
  performBulkDedupe: async () => {
    try {
      const r = await turso.execute("SELECT * FROM profiles");
      const rows = r.rows as unknown as any[];
      const profiles = rows.map(row => {
        let photos: string[] = [];
        if (row.photos) {
          photos = typeof row.photos === 'string' ? JSON.parse(row.photos) : row.photos;
        } else if (row.image_url) {
          photos = [row.image_url as string];
        }
        return { ...row, photos };
      });

      const photoMap = new Map<string, { user_id: string, created_at: string }>();
      const toDelete: string[] = [];

      profiles.forEach(p => {
        const photoUrl = (p.photos as string[])?.[0];
        if (!photoUrl) return;

        if (photoMap.has(photoUrl)) {
          const existing = photoMap.get(photoUrl)!;
          if (p.created_at < existing.created_at) {
            // New one is older
            toDelete.push(existing.user_id);
            photoMap.set(photoUrl, { user_id: p.user_id as string, created_at: p.created_at as string });
          } else {
            // Existing is older
            toDelete.push(p.user_id as string);
          }
        } else {
          photoMap.set(photoUrl, { user_id: p.user_id as string, created_at: p.created_at as string });
        }
      });

      if (toDelete.length === 0) return { deletedCount: 0 };

      // Chunk deletes to avoid hitting transaction limits if huge
      const chunks = [];
      for (let i = 0; i < toDelete.length; i += 20) {
        chunks.push(toDelete.slice(i, i + 20));
      }

      for (const chunk of chunks) {
        const batch = chunk.flatMap(id => [
          { sql: "DELETE FROM forum_replies WHERE user_id = ?", args: [id] },
          { sql: "DELETE FROM profiles WHERE user_id = ?", args: [id] }
        ]);
        await turso.batch(batch, "write");
      }

      return { deletedCount: toDelete.length };
    } catch (err) {
      console.error("ADMIN_BULK_DEDUPE_ERROR:", err);
      throw err;
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
