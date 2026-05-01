import { turso } from '@/lib/turso';
import type { MatriarchProfile } from '@/types';

// 🛡️ THE CACHING SHIELD: Defensive state management to prevent network saturation.
const TTL = 5000; 
let metricsCache: { data: any, timestamp: number } | null = null;

/**
 * 🛠️ DEEP NORMALIZATION LAYER:
 * Standardizes raw Turso rows into valid MatriarchProfile objects.
 * Optimized for high-throughput and standard JSON formats.
 */
const normalizeProfile = (row: any): MatriarchProfile => {
  if (!row) return {} as MatriarchProfile;
  
  let photos: string[] = [];
  const rawPhotos = row.photos || row.avatar_url || row.image_url;
  
  try {
    if (typeof rawPhotos === 'string' && rawPhotos.startsWith('[')) {
      photos = JSON.parse(rawPhotos);
    } else if (Array.isArray(rawPhotos)) {
      photos = rawPhotos;
    } else if (rawPhotos) {
      photos = [rawPhotos];
    }
  } catch (e) {
    console.warn("Normalize Recovery: Falling back to seed avatar.");
  }

  const finalPhotos = photos.filter(u => u && typeof u === 'string' && u.includes('.')).length > 0
    ? photos.filter(u => u && typeof u === 'string' && u.includes('.'))
    : [`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user_id || row.full_name || 'anon'}`];

  return {
    ...row,
    photos: finalPhotos,
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

    const safeCount = async (sql: string, args: any[] = []) => {
      try {
        const res = await turso.execute({ sql, args });
        const row: any = res.rows[0];
        if (!row) return 0;
        return Number(row.count ?? row['count(*)'] ?? Object.values(row)[0] ?? 0);
      } catch (err) {
        console.warn(`Admin Metrics Isolation: Query failed [${sql.slice(0, 30)}...]`, err);
        return 0;
      }
    };

    try {
      const [totalMen, totalWomen, verifiedProfiles] = await Promise.all([
        safeCount("SELECT COUNT(*) as count FROM profiles WHERE role = 'man'"),
        safeCount("SELECT COUNT(*) as count FROM profiles WHERE role = 'woman'"),
        safeCount("SELECT COUNT(*) as count FROM profiles WHERE is_verified = 1")
      ]);

      const data = { totalMen, totalWomen, verifiedProfiles, totalForumTopics: 0 };
      metricsCache = { data, timestamp: now };
      return data;
    } catch (err) {
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
   * 🧪 Absolute Excision (Recursive Purge)
   */
  deleteUserRecord: async (userId: string) => {
    if (!userId) return false;
    try {
      await turso.batch([
        { sql: "DELETE FROM profiles WHERE user_id = ?", args: [userId] },
        { sql: "DELETE FROM messages WHERE sender_user_id = ?", args: [userId] },
        { sql: "DELETE FROM matches WHERE woman_user_id = ? OR man_user_id = ?", args: [userId, userId] },
        { sql: "DELETE FROM conversations WHERE id LIKE ?", args: [`%${userId}%`] }
      ], "write");
      
      metricsCache = null;
      return true;
    } catch (err) {
      console.error("ADMIN_PURGE_ERROR:", err);
      return false;
    }
  },

  /**
   * ⚔️ The Culling: Sweeps inactive profiles.
   */
  executeGlobalCulling: async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const res = await turso.execute({
            sql: "SELECT user_id FROM profiles WHERE role = 'man' AND updated_at < ?",
            args: [thirtyDaysAgo.toISOString()]
        });
        
        const toDelete = res.rows.map(r => String(r.user_id));
        let count = 0;
        for (const id of toDelete) {
            if (await AdminService.deleteUserRecord(id)) count++;
        }
        
        return { success: true, purged: count };
    } catch(err) {
        return { success: false, purged: 0 };
    }
  },

  /**
   * 👁️ Sovereign Eyes: Global communication surveillance.
   */
  getGlobalCommunications: async () => {
     try {
        const sql = `
          SELECT 
            c.id as conv_id,
            m.*,
            m.id as id,
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
          ORDER BY last_message_at DESC LIMIT 100
        `;
        const res = await turso.execute(sql);
        return res.rows.map(row => ({
          ...row,
          id: row.id || row.conv_id
        }));
     } catch (err) {
        return [];
     }
  },

  /**
   * 🛠️ Sovereign Mutation
   */
  updateProfileStatus: async (userId: string, data: Partial<MatriarchProfile>) => {
    try {
      const allowedFields = ['is_verified', 'role', 'tokens', 'payment_status'];
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
      args.push(userId);
      
      await turso.execute({ sql: `UPDATE profiles SET ${setClause.join(', ')} WHERE user_id = ?`, args });
      metricsCache = null;
      return true;
    } catch (err) {
      return false;
    }
  },

  sendDirectAdminMessage: async (userId: string, body: string) => {
    try {
      const convId = `admin_conv_${userId}`;
      await turso.execute({
        sql: "INSERT OR IGNORE INTO conversations (id, match_id) VALUES (?, NULL)",
        args: [convId]
      });
      await turso.execute({
        sql: "INSERT INTO messages (id, conversation_id, sender_user_id, body, created_at) VALUES (?, ?, 'ADMIN', ?, ?)",
        args: [`msg_sys_${Date.now()}`, convId, body, new Date().toISOString()]
      });
      return true;
    } catch (err) {
      return false;
    }
  },

  updateUserTokens: async (userId: string, amount: number) => {
    try {
      await turso.execute({
        sql: "UPDATE profiles SET tokens = tokens + ? WHERE user_id = ?",
        args: [amount, userId]
      });
      return true;
    } catch (err) {
      return false;
    }
  },

  sendSovereignBroadcast: async (title: string, body: string) => {
    try {
        const res = await turso.execute("SELECT user_id FROM profiles WHERE role = 'man'");
        const ids = res.rows.map(r => String(r.user_id));
        const fullMsg = `[SOVEREIGN_BROADCAST]: ${title}\n\n${body}`;
        for (const id of ids) {
            await AdminService.sendDirectAdminMessage(id, fullMsg);
        }
        return { success: true, count: ids.length };
    } catch(err) {
        return { success: false, count: 0 };
    }
  },

  getPendingAuraClaims: async () => {
    try {
      const res = await turso.execute(`
        SELECT c.*, p.full_name, p.city as user_city, p.photos as user_photos
        FROM pending_claims c
        JOIN profiles p ON c.user_id = p.user_id
        WHERE c.status = 'pending'
        ORDER BY c.created_at DESC
      `);
      return res.rows;
    } catch (err) {
      return [];
    }
  },

  resolveAuraClaim: async (claimId: string, approved: boolean) => {
    try {
      const claimRes = await turso.execute({ sql: "SELECT * FROM pending_claims WHERE id = ?", args: [claimId] });
      const claim: any = claimRes.rows[0];
      if (!claim) return false;

      if (!approved) {
        await turso.execute({ sql: "UPDATE pending_claims SET status = 'rejected' WHERE id = ?", args: [claimId] });
        await AdminService.sendDirectAdminMessage(claim.user_id, `Your tithe [UTR: ${claim.submitted_utr}] could not be verified.`);
        return true;
      }

      const meta = JSON.parse(claim.metadata || '{}');
      const amount = meta.amount || 49;
      
      await turso.batch([
        { sql: "UPDATE pending_claims SET status = 'approved' WHERE id = ?", args: [claimId] },
        { sql: "UPDATE profiles SET tokens = tokens + ?, is_verified = 1 WHERE user_id = ?", args: [amount, claim.user_id] }
      ], "write");

      const message = meta.type === 'verification' 
        ? `Your Verification Tithe [UTR: ${claim.submitted_utr}] has been approved. Your Identity Seal is now active.`
        : `Your tithe [UTR: ${claim.submitted_utr}] has been verified. ${amount} Aura tokens credited, and your Identity Seal is now active.`;

      await AdminService.sendDirectAdminMessage(claim.user_id, message);
      metricsCache = null;
      return true;
    } catch (err) {
      return false;
    }
  },

  /**
   * 🧹 SIGINT Sanitation: Removes specific messages or entire threads.
   */
  deleteMessage: async (messageId: string) => {
    try {
      await turso.execute({ sql: "DELETE FROM messages WHERE id = ?", args: [messageId] });
      return true;
    } catch (err) {
      return false;
    }
  },

  deleteConversation: async (conversationId: string) => {
    try {
      await turso.batch([
        { sql: "DELETE FROM messages WHERE conversation_id = ?", args: [conversationId] },
        { sql: "DELETE FROM conversations WHERE id = ?", args: [conversationId] }
      ], "write");
      return true;
    } catch (err) {
      return false;
    }
  }
};
