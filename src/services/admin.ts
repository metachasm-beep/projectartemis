import { turso } from '@/lib/turso';
import type { MatriarchProfile } from '@/types';

// 🛡️ THE CACHING SHIELD: Defensive state management to prevent network saturation.
const TTL = 5000; 
let metricsCache: { data: any, timestamp: number } | null = null;
let rosterCache: { data: MatriarchProfile[], timestamp: number } | null = null;

/**
 * 🛠️ DEEP NORMALIZATION LAYER:
 * Standardizes raw Turso rows into valid MatriarchProfile objects.
 * Defensive against double-stringified JSON, single-quoted arrays, and legacy lists.
 */
const normalizeProfile = (row: any): MatriarchProfile => {
  if (!row) return {} as MatriarchProfile;
  
  const rawPhotos: any = row.photos || row.avatar_url || row.image_url || row.image || row.photo || row.avatar || row.profile_picture;
  let photos: string[] = [];
  
  if (rawPhotos) {
    let p = rawPhotos;
    
    // 🛡️ RECURSIVE MULTI-MODE DE-STRINGIFIER
    try {
      let limit = 5;
      while (typeof p === 'string' && limit > 0) {
        let trimmed = p.trim();
        
        // Mode 1: Standard / Double-Stringified JSON
        if (trimmed.startsWith('[') || trimmed.startsWith('"') || trimmed.startsWith('{')) {
          try {
            // Fix single-quoted "fake" JSON arrays (common JS .toString() output)
            if (trimmed.startsWith('[') && trimmed.includes("'") && !trimmed.includes('"')) {
              trimmed = trimmed.replace(/'/g, '"');
            }
            p = JSON.parse(trimmed);
            limit--;
            continue;
          } catch (e) {
             // Fall through to other modes
          }
        }

        // Mode 2: Comma-Separated Literals
        if (trimmed.includes(',') && !trimmed.includes('[') && !trimmed.includes('{')) {
           p = trimmed.split(',').map(s => s.trim());
           break;
        }

        // Mode 3: Bracketed list without valid JSON quotes
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
           p = trimmed.slice(1, -1).split(',').map(s => s.trim());
           break;
        }

        break;
      }
    } catch (e) {
      console.warn("Normalize: Recovery attempt failed", e);
    }

    // Convert result to cleaned array
    const rawArray = Array.isArray(p) ? p : [p];
    photos = rawArray
      .filter(u => u && typeof u === 'string')
      .map(u => {
         // Scrub any remaining single/double quotes or brackets from the URL itself
         return u.trim().replace(/^['"\[]+|['"\]]+$/g, '');
      })
      .filter(u => (u.startsWith('http') || u.startsWith('https')) && u.includes('.'));
  }

  // 🎭 Final Fallback: Generator
  const finalPhotos = photos.length > 0 
    ? photos 
    : [`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user_id || row.id || row.full_name || 'anon'}`];

  return {
    ...row,
    photos: finalPhotos,
    is_verified: row.is_verified === 1 || row.is_verified === true || row.verified === 1,
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
   * 🔍 Sovereign Roster Search: Deep DB multi-parameter search for profiles.
   */
  searchProfiles: async (options: {
    query?: string;
    role?: 'man' | 'woman' | 'admin' | 'all';
    isVerified?: boolean | 'all';
    city?: string;
    minTokens?: number;
    dateSort?: 'newest' | 'oldest';
    limit?: number;
  } = {}): Promise<MatriarchProfile[]> => {
    const { 
      query = "", 
      role = 'all', 
      isVerified = 'all', 
      city = "", 
      minTokens = 0, 
      dateSort = 'newest', 
      limit = 1000 
    } = options;

    try {
      let sql = "SELECT * FROM profiles WHERE 1=1";
      const args: any[] = [];

      if (query && query.trim() !== '') {
        sql += " AND (full_name LIKE ? OR user_id LIKE ?)";
        const wildcard = `%${query.trim()}%`;
        args.push(wildcard, wildcard);
      }

      if (role !== 'all') {
        sql += " AND role = ?";
        args.push(role);
      }

      if (isVerified !== 'all') {
        sql += " AND is_verified = ?";
        args.push(isVerified ? 1 : 0);
      }

      if (city && city.trim() !== '') {
        sql += " AND city LIKE ?";
        args.push(`%${city.trim()}%`);
      }

      if (minTokens > 0) {
        sql += " AND tokens >= ?";
        args.push(minTokens);
      }

      sql += ` ORDER BY created_at ${dateSort === 'newest' ? 'DESC' : 'ASC'} LIMIT ?`;
      args.push(limit);

      const r = await turso.execute({ sql, args });
      return r.rows.map(normalizeProfile);
    } catch (err) {
      console.error("ADMIN_SEARCH_ERROR:", err);
      return [];
    }
  },

  /**
   * 🧪 Absolute Excision (Resilient Deep Purge): 
   * Removes a user from EVERY sanctuary table.
   * Uses sequential execution to survive missing optional tables (e.g. forum, matches).
   */
  deleteUserRecord: async (userId: string) => {
    if (!userId) return false;
    
    // 🛡️ INTERNAL PURGE PROTOCOL: Silently executes deletes, ignoring missing table errors.
    const silentDelete = async (sql: string, args: any[]) => {
      try {
        await turso.execute({ sql, args });
      } catch (err: any) {
        // Ignore "no such table" errors (code: SQLITE_ERROR)
        if (err?.message?.includes('no such table')) {
          return;
        }
        console.warn(`ADMIN_PURGE_WARNING on table: ${sql.split(' ')[2]}`, err);
      }
    };

    try {
      console.log(`ADMIN_SERVICE: Executing Resilient Deep Purge for identity: ${userId}`);
      
      // 🗳️ Community Forums & Social
      await silentDelete("DELETE FROM forum_replies WHERE author_id = ?", [userId]);
      await silentDelete("DELETE FROM forum_topics_likes WHERE user_id = ?", [userId]);
      await silentDelete("DELETE FROM forum_topics_saves WHERE user_id = ?", [userId]);
      await silentDelete("DELETE FROM forum_tips WHERE sender_id = ? OR receiver_id = ?", [userId, userId]);
      await silentDelete("DELETE FROM forum_topics WHERE author_id = ?", [userId]);
      await silentDelete("DELETE FROM forum_circles WHERE created_by = ?", [userId]);
      await silentDelete("DELETE FROM forum_circle_members WHERE user_id = ?", [userId]);
      
      // 💬 Messaging & Communication
      await silentDelete("DELETE FROM messages WHERE sender_user_id = ?", [userId]);
      await silentDelete("DELETE FROM message_receipts WHERE user_id = ?", [userId]);
      await silentDelete("DELETE FROM prompt_responses WHERE responder_user_id = ?", [userId]);
      await silentDelete("DELETE FROM call_requests WHERE requested_by_user_id = ?", [userId]);
      
      // 💎 Matches & Relationships
      await silentDelete("DELETE FROM match_state_history WHERE changed_by_user_id = ?", [userId]);
      await silentDelete("DELETE FROM matches WHERE woman_user_id = ? OR man_user_id = ?", [userId, userId]);
      await silentDelete("DELETE FROM blocks WHERE blocker_user_id = ? OR blocked_user_id = ?", [userId, userId]);
      await silentDelete("DELETE FROM reports WHERE reporter_user_id = ? OR reported_user_id = ?", [userId, userId]);
      
      // 👤 Primary Identity (Always required)
      const res = await turso.execute({ sql: "DELETE FROM profiles WHERE user_id = ?", args: [userId] });
      
      // Nuclear cache invalidation
      metricsCache = null;
      rosterCache = null;
      return true;
    } catch (err) {
      console.error("ADMIN_RESILIENT_PURGE_ERROR (userId: " + userId + "):", err);
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
   * 🌪️ Purge Protocol (Resilient Dedupe):
   * Automated removal of visual asset clones using the Resilient Deep Purge protocol.
   */
  performBulkDedupe: async () => {
    try {
      const r = await turso.execute("SELECT * FROM profiles");
      const allProfiles = r.rows.map(normalizeProfile);
      
      console.log(`ADMIN_BULK_PURGE: Scanning ${allProfiles.length} profiles for visual collisions...`);
      
      const photoMap = new Map<string, { user_id: string, created_at: string }>();
      const toDelete: string[] = [];

      allProfiles.forEach(p => {
        const photoUrl = p.photos?.[0];
        if (!photoUrl) return;

        if (photoMap.has(photoUrl)) {
          const existing = photoMap.get(photoUrl)!;
          // Compare created_at to keep the original (earliest) record
          if (p.created_at < existing.created_at) {
            toDelete.push(existing.user_id);
            photoMap.set(photoUrl, { user_id: p.user_id, created_at: p.created_at });
          } else {
            toDelete.push(p.user_id);
          }
        } else {
          photoMap.set(photoUrl, { user_id: p.user_id, created_at: p.created_at });
        }
      });

      if (toDelete.length === 0) {
        console.log("ADMIN_BULK_PURGE: Sanctuary is already pure. No collisions detected.");
        return { deletedCount: 0 };
      }

      console.log(`ADMIN_BULK_PURGE: Commencing resilient excision for ${toDelete.length} redundant identities.`);

      let successfulDeletes = 0;
      for (const id of toDelete) {
        const success = await AdminService.deleteUserRecord(id);
        if (success) successfulDeletes++;
      }

      metricsCache = null;
      rosterCache = null;

      return { deletedCount: successfulDeletes };
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
  },

  /**
   * 👁️ Sovereign Eyes: Global communication surveillance logic.
   */
  getGlobalCommunications: async () => {
     try {
        const sql = `
          SELECT 
            m.*, 
            pw.full_name as woman_name, 
            pw.photos as woman_photos,
            pm.full_name as man_name, 
            pm.photos as man_photos,
            (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
            (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at
          FROM matches m
          JOIN profiles pw ON m.woman_user_id = pw.user_id
          JOIN profiles pm ON m.man_user_id = pm.user_id
          JOIN conversations c ON c.match_id = m.id
          ORDER BY last_message_at DESC NULLS LAST
        `;
        const res = await turso.execute(sql);
        return res.rows;
     } catch (err) {
        console.error("ADMIN_GLOBAL_COMM_ERROR:", err);
        return [];
     }
  },

  getMatchMessages: async (matchId: string) => {
     try {
        const sql = `
          SELECT msg.* 
          FROM messages msg
          JOIN conversations c ON msg.conversation_id = c.id
          WHERE c.match_id = ?
          ORDER BY msg.created_at ASC
        `;
        const res = await turso.execute({ sql, args: [matchId] });
        return res.rows;
     } catch (err) {
        console.error("ADMIN_MATCH_MSG_ERROR:", err);
        return [];
     }
  }
};
