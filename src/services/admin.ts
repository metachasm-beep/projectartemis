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
      const [menQ, womenQ, verifiedQ, tokensQ] = await Promise.all([
        turso.execute("SELECT COUNT(*) as count FROM profiles WHERE role = 'man'"),
        turso.execute("SELECT COUNT(*) as count FROM profiles WHERE role = 'woman'"),
        turso.execute("SELECT COUNT(*) as count FROM profiles WHERE is_verified = 1"),
        turso.execute("SELECT SUM(tokens) as total FROM profiles")
      ]);

      const data = {
        totalMen: Number(menQ.rows[0]?.count || 0),
        totalWomen: Number(womenQ.rows[0]?.count || 0),
        verifiedProfiles: Number(verifiedQ.rows[0]?.count || 0),
        totalTokens: Number(tokensQ.rows[0]?.total || 0)
      };

      metricsCache = { data, timestamp: now };
      return data;
    } catch (err) {
      console.error("ADMIN_METRICS_ERROR:", err);
      return { totalMen: 0, totalWomen: 0, verifiedProfiles: 0, totalTokens: 0 };
    }
  },

  /**
   * 🗺️ Geographic Census: Extracts top 10 city populations for targeted campaigns.
   */
  getCityCensus: async () => {
    try {
      const res = await turso.execute(`
        SELECT city, COUNT(*) as count 
        FROM profiles 
        WHERE city IS NOT NULL AND city != '' 
        GROUP BY city 
        ORDER BY count DESC 
        LIMIT 10
      `);
      return res.rows.map(r => ({ city: String(r.city), count: Number(r.count) }));
    } catch(e) {
      console.error("ADMIN_CENSUS_ERROR:", e);
      return [];
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
      // 🍷 Identity & Messaging Cleanup (Self-Contained)
      console.log(`ADMIN_SERVICE: Executing Deep Purge traversal for identity: ${userId}`);
      
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
   * ⚔️ The Culling: Sweeps inactive 'man' profiles and reflows ranks.
   */
  executeGlobalCulling: async () => {
    console.log("ADMIN_SERVICE: Commencing The Culling Sequence.");
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const res = await turso.execute({
            sql: "SELECT user_id FROM profiles WHERE role = 'man' AND updated_at < ?",
            args: [thirtyDaysAgo.toISOString()]
        });
        
        const toDelete = res.rows.map(r => r.user_id as string);
        let purgedCount = 0;
        
        for (const id of toDelete) {
            const success = await AdminService.deleteUserRecord(id);
            if(success) purgedCount++;
        }
        
        // Final Rank Polish
        await import('./sanctuary').then(m => m.SanctuaryService.recalculateGlobalRanks());
        
        return { success: true, purged: purgedCount };
    } catch(err) {
        console.error("ADMIN_CULLING_ERROR:", err);
        return { success: false, purged: 0 };
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

  /**
   * 👁️ Sovereign Eyes: Global communication surveillance logic.
   */
  getGlobalCommunications: async () => {
     try {
        const sql = `
          SELECT 
            c.id as conv_id,
            m.id as id,
            m.current_comm_mode,
            pw.full_name as woman_name, 
            pw.photos as woman_photos,
            pm.full_name as man_name, 
            pm.photos as man_photos,
            (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
            (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at
          FROM conversations c
          LEFT JOIN matches m ON c.match_id = m.id
          LEFT JOIN profiles pw ON m.woman_user_id = pw.user_id OR (c.match_id IS NULL AND substr(c.id, 12) = pw.user_id AND pw.role = 'woman')
          LEFT JOIN profiles pm ON m.man_user_id = pm.user_id OR (c.match_id IS NULL AND substr(c.id, 12) = pm.user_id AND pm.role = 'man')
          WHERE last_message IS NOT NULL
          ORDER BY last_message_at DESC NULLS LAST
        `;
        const res = await turso.execute(sql);
        
        // Post-process to handle Admin specific labels
        return res.rows.map(row => {
          if (!row.id && row.conv_id.startsWith('admin_conv_')) {
             return {
                ...row,
                id: row.conv_id, // Use conv_id as pseudo match id for selectedMatch logic
                current_comm_mode: 'SOVEREIGN_TRANSMISSION',
                woman_name: row.woman_name || 'The Matriarch',
                man_name: row.man_name || 'Sanctuary Aspirant'
             };
          }
          return row;
        });
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
  },

  /**
   * 🛠️ Sovereign Profile Mutation: 
   * Directly updates verification, roles, and aura tokens.
   */
  updateProfileStatus: async (userId: string, data: Partial<MatriarchProfile>) => {
    try {
      const allowedFields = ['is_verified', 'role', 'tokens', 'payment_utr', 'payment_status'];
      const setClause: string[] = [];
      const args: any[] = [];

      for (const field of allowedFields) {
        if (data[field as keyof MatriarchProfile] !== undefined) {
          let val = data[field as keyof MatriarchProfile];
          if (field === 'is_verified') val = val ? 1 : 0;
          setClause.push(`${field} = ?`);
          args.push(val);
        }
      }

      if (setClause.length === 0) return true;

      const sql = `UPDATE profiles SET ${setClause.join(', ')} WHERE user_id = ?`;
      args.push(userId);
      
      await turso.execute({ sql, args });
      // Reset caches
      metricsCache = null;
      rosterCache = null;
      return true;
    } catch (err) {
      console.error("ADMIN_UPDATE_STATUS_ERROR:", err);
      return false;
    }
  },

  /**
   * 🛡️ Sovereign Transmission:
   * Delivers a direct administrative message to a user.
   * Creates an "ADMIN_CONV" with match_id = NULL if it doesn't exist.
   */
  sendDirectAdminMessage: async (userId: string, body: string) => {
    if (!userId || !body.trim()) return false;

    try {
      // 1. Locate or Invoke Admin Conversation
      // We look for a conversation with match_id NULL that involves this user and 'ADMIN'
      // Wait, matches table usually defines the pair. For Admin sessions, we'll use a special match.
      // Or simply: Look for a conversation where ID starts with 'admin_conv_' + userId
      const convId = `admin_conv_${userId}`;
      
      // Check if conversation exists (idempotent check)
      const checkRes = await turso.execute({
        sql: "SELECT id FROM conversations WHERE id = ?",
        args: [convId]
      });

      if (checkRes.rows.length === 0) {
        console.log(`ADMIN_SERVICE: Invoking new Sovereign Bridge for user: ${userId}`);
        await turso.execute({
          sql: "INSERT INTO conversations (id, match_id) VALUES (?, NULL)",
          args: [convId]
        });
      }

      // 2. Transmit Message
      const msgId = `msg_sys_${Date.now()}`;
      const now = new Date().toISOString();
      await turso.execute({
        sql: "INSERT INTO messages (id, conversation_id, sender_user_id, body, created_at) VALUES (?, ?, 'ADMIN', ?, ?)",
        args: [msgId, convId, body, now]
      });

      return true;
    } catch (err) {
      console.error("ADMIN_DIRECT_MSG_ERROR:", err);
      return false;
    }
  },

  /**
   * 💎 Aura Token Allocation: Atomic Adjustment
   */
  updateUserTokens: async (userId: string, amount: number) => {
    try {
      const res = await turso.execute({
        sql: "UPDATE profiles SET tokens = tokens + ? WHERE user_id = ?",
        args: [amount, userId]
      });
      return res.rowsAffected > 0;
    } catch (err) {
      console.error("ADMIN_TOKEN_UPDATE_ERROR:", err);
      return false;
    }
  },

  /**
   * 📢 Sovereign Broadcast: Force-involves the Admin direct-message system to push a manifesto or ultimatum to ALL men.
   */
  sendSovereignBroadcast: async (title: string, body: string) => {
    try {
        console.log(`ADMIN_SERVICE: Initiating Sovereign Broadcast: ${title}`);
        const res = await turso.execute("SELECT user_id FROM profiles WHERE role = 'man'");
        const maleIds = res.rows.map(r => String(r.user_id));
        
        const fullMessage = `[SOVEREIGN_BROADCAST]: ${title}\n\n${body}`;
        let successCount = 0;
        
        for (const userId of maleIds) {
            const success = await AdminService.sendDirectAdminMessage(userId, fullMessage);
            if(success) successCount++;
        }
        
        return { success: true, count: successCount };
    } catch(err) {
        console.error("ADMIN_BROADCAST_ERROR:", err);
        return { success: false, count: 0 };
    }
  },

  /**
   * 🏦 Tithe Ledger: Retrieve all financial and transaction audit logs.
   */
  getFinancialAudits: async () => {
    try {
      const result = await turso.execute(`
        SELECT p.*, prof.full_name as user_name 
        FROM protocol_audits p
        LEFT JOIN profiles prof ON p.user_id = prof.user_id
        WHERE p.action LIKE 'MONETIZATION%' OR p.action = 'PAYMENT_CLAIM'
        ORDER BY p.created_at DESC LIMIT 500
      `);
      return result.rows;
    } catch (err) {
      console.error("ADMIN_FINANCIAL_AUDITS_ERROR:", err);
      return [];
    }
  },

  /**
   * 🛡️ Identity Audit Lifecycle:
   * Fetches users with pending biometric verification evidence.
   */
  getPendingAudits: async () => {
    try {
      const sql = `
        SELECT a.*, p.full_name, p.photos as profile_photos, p.is_verified
        FROM protocol_audits a
        JOIN profiles p ON a.user_id = p.user_id
        WHERE a.status = 'PENDING'
        ORDER BY a.created_at ASC
      `;
      const res = await turso.execute(sql);
      return res.rows;
    } catch (err) {
      console.error("ADMIN_GET_AUDITS_ERROR:", err);
      return [];
    }
  },

  /**
   * ⚖️ Sovereign Judgment:
   * Resolves a pending audit, sealing the verification if approved.
   */
  resolveAudit: async (auditId: string, userId: string, approved: boolean) => {
    try {
      if (approved) {
        await turso.batch([
          { sql: "UPDATE profiles SET is_verified = 1 WHERE user_id = ?", args: [userId] },
          { sql: "UPDATE protocol_audits SET status = 'APPROVED' WHERE id = ?", args: [auditId] }
        ], "write");
      } else {
        await turso.execute({ 
           sql: "UPDATE protocol_audits SET status = 'REJECTED' WHERE id = ?", 
           args: [auditId] 
        });
      }
      
      // Reset caches
      metricsCache = null;
      rosterCache = null;
      return true;
    } catch (err) {
      console.error("ADMIN_RESOLVE_AUDIT_ERROR:", err);
      return false;
    }
  },

  /**
   * 👑 Global Rank Ritual:
   * Triggers a system-wide re-calculation of the absolute rank sequence.
   */
  recalculateAllRanks: async () => {
    try {
       const { SanctuaryService } = await import('@/services/sanctuary');
       await SanctuaryService.recalculateGlobalRanks();
       return true;
    } catch (err) {
       console.error("ADMIN_RECALC_RANK_ERROR:", err);
       return false;
    }
  }
};
