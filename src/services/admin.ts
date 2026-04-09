import { turso } from '@/lib/turso';
import type { MatriarchProfile } from '@/types';

// 🛡️ THE CACHING SHIELD: Defensive state management to prevent network saturation.
const TTL = 5000; 
let metricsCache: { data: any, timestamp: number } | null = null;
let rosterCache: { data: MatriarchProfile[], timestamp: number } | null = null;

/**
 * 🛠️ DEEP NORMALIZATION LAYER:
 * Standardizes raw Turso rows into valid MatriarchProfile objects.
 * Defensive against double-stringified JSON and legacy field mapping.
 */
const normalizeProfile = (row: any): MatriarchProfile => {
  let photos: string[] = [];
  
  if (row.photos) {
    try {
      // Defensive: Handle potentially double-stringified JSON from mixed client imports
      let parsed = row.photos;
      while (typeof parsed === 'string' && (parsed.startsWith('[') || parsed.startsWith('"'))) {
        parsed = JSON.parse(parsed);
      }
      photos = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      photos = [row.photos]; // Fallback for raw string URLs
    }
  } else if (row.image_url) {
    photos = [row.image_url as string];
  }

  // Clean empty values and protocol fragments
  photos = photos.filter(Boolean).map(url => {
    if (typeof url !== 'string') return url;
    let u = url.trim();
    if (u.startsWith('//')) u = 'https:' + u;
    return u;
  });

  return {
    ...row,
    photos: photos.length > 0 ? photos : [],
    is_verified: row.is_verified === 1 || row.is_verified === true,
  } as unknown as MatriarchProfile;
};

export const AdminService = {
  /**
   * 📊 Absolute System Pulse: Board-level aggregates.
   */
  getSystemMetrics: async () => {
    const now = Date.now();
    if (metricsCache && (now - metricsCache.timestamp < TTL)) {
      return metricsCache.data;
    }

    try {
      const [menQ, womenQ, verifiedQ, topicsQ] = await Promise.all([
        turso.execute("SELECT COUNT(*) as count FROM profiles WHERE role = 'man'"),
        turso.execute("SELECT COUNT(*) as count FROM profiles WHERE role = 'woman'"),
        turso.execute("SELECT COUNT(*) as count FROM profiles WHERE is_verified = 1"),
        turso.execute("SELECT COUNT(*) as count FROM forum_topics")
      ]);

      const data = {
        totalMen: Number(menQ.rows[0]?.count || 0),
        totalWomen: Number(womenQ.rows[0]?.count || 0),
        verifiedProfiles: Number(verifiedQ.rows[0]?.count || 0),
        totalForumTopics: Number(topicsQ.rows[0]?.count || 0)
      };

      metricsCache = { data, timestamp: now };
      return data;
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
        sql += " WHERE full_name LIKE ? OR city LIKE ? OR user_id LIKE ?";
        const wildcard = `%${queryText}%`;
        args = [wildcard, wildcard, wildcard];
      }

      sql += " ORDER BY created_at DESC LIMIT ?";
      args.push(limit);

      const r = await turso.execute({ sql, args });
      return r.rows.map(normalizeProfile);
    } catch (err) {
      console.error("ADMIN_SEARCH_ERROR:", err);
      return [];
    }
  },

  /**
   * 🧪 Absolute Excision: Removes a user from the db fully.
   * Clear all caches to ensure immediate consistency across views.
   */
  deleteUserRecord: async (userId: string) => {
    if (!userId) return false;
    try {
      await turso.batch([
        { sql: "DELETE FROM forum_replies WHERE user_id = ?", args: [userId] },
        { sql: "DELETE FROM forum_topics_likes WHERE user_id = ?", args: [userId] },
        { sql: "DELETE FROM forum_topics_saves WHERE user_id = ?", args: [userId] },
        { sql: "DELETE FROM profiles WHERE user_id = ?", args: [userId] }
      ]);
      
      // Nuclear cache invalidation
      metricsCache = null;
      rosterCache = null;
      return true;
    } catch (err) {
      console.error("ADMIN_DELETE_ERROR (userId: " + userId + "):", err);
      return false;
    }
  },

  /**
   * 🎨 Visual Curation Index: Fetch all profile identifying data.
   */
  getAllCurationProfiles: async (): Promise<MatriarchProfile[]> => {
    const now = Date.now();
    // Use a slightly shorter TTL or check freshness
    if (rosterCache && (now - rosterCache.timestamp < 2000)) { 
      return rosterCache.data;
    }

    try {
      const r = await turso.execute("SELECT * FROM profiles ORDER BY created_at DESC");
      if (r.rows.length === 0) {
         console.warn("ADMIN_CURATION: Registry returned 0 rows.");
      }
      const data = r.rows.map(normalizeProfile);
      rosterCache = { data, timestamp: now };
      return data;
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
      const profiles = r.rows.map(normalizeProfile);
      
      const photoMap = new Map<string, { user_id: string, created_at: string }>();
      const toDelete: string[] = [];

      profiles.forEach(p => {
        const photoUrl = p.photos?.[0];
        if (!photoUrl) return;

        if (photoMap.has(photoUrl)) {
          const existing = photoMap.get(photoUrl)!;
          if (p.created_at < existing.created_at) {
            toDelete.push(existing.user_id);
            photoMap.set(photoUrl, { user_id: p.user_id, created_at: p.created_at as string });
          } else {
            toDelete.push(p.user_id);
          }
        } else {
          photoMap.set(photoUrl, { user_id: p.user_id, created_at: p.created_at as string });
        }
      });

      if (toDelete.length === 0) return { deletedCount: 0 };

      const chunks = [];
      for (let i = 0; i < toDelete.length; i += 20) {
        chunks.push(toDelete.slice(i, i + 20));
      }

      for (const chunk of chunks) {
        const batch = chunk.flatMap(id => [
          { sql: "DELETE FROM forum_replies WHERE user_id = ?", args: [id] },
          { sql: "DELETE FROM profiles WHERE user_id = ?", args: [id] }
        ]);
        await turso.batch(batch);
      }

      metricsCache = null;
      rosterCache = null;

      return { deletedCount: toDelete.length };
    } catch (err) {
      console.error("ADMIN_BULK_DEDUPE_ERROR:", err);
      throw err;
    }
  },

  purgeForumTopic: async (topicId: string) => {
    try {
      await turso.batch([
        { sql: "DELETE FROM forum_replies WHERE topic_id = ?", args: [topicId] },
        { sql: "DELETE FROM forum_topics_likes WHERE topic_id = ?", args: [topicId] },
        { sql: "DELETE FROM forum_topics_saves WHERE topic_id = ?", args: [topicId] },
        { sql: "DELETE FROM forum_topics WHERE id = ?", args: [topicId] }
      ]);
      metricsCache = null;
      return true;
    } catch (err) {
      console.error("ADMIN_PURGE_FORUM_ERROR:", err);
      return false;
    }
  }
};
