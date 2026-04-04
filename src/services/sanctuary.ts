import { turso } from '@/lib/turso';
import { v4 as uuidv4 } from 'uuid';

export const SanctuaryService = {
  /**
   * 🏹 Discovery Feed: Curated Resonance Rails.
   */
  getRailFeed: async (womanId: string, type: 'imperial' | 'truth' | 'rising' | 'nearby' | 'shortlist', city?: string) => {
    let sql = "";
    let args: any[] = [];

    // Convert discovery algorithms to dynamic percentile rank logic
    if (type === 'imperial') {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND is_verified = 1 ORDER BY (rowid - (COALESCE(rank_boost_count, 0) * 10)) ASC LIMIT 10";
    } else if (type === 'truth') {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND is_verified = 1 ORDER BY created_at DESC LIMIT 10";
    } else if (type === 'rising') {
       sql = "SELECT * FROM profiles WHERE role = 'man' ORDER BY created_at DESC LIMIT 10";
    } else if (type === 'nearby' && city) {
       // "rowid" naturally increments as users join. (low rowid = joined early = better base rank)
       // rank_boost_count acts as the "token_bonus" which subtracts from rowid to artificially lower their absolute rank.
       sql = "SELECT * FROM profiles WHERE role = 'man' AND city = ? ORDER BY (rowid - COALESCE(rank_boost_count, 0)) ASC LIMIT 10";
       args = [city];
    } else if (type === 'shortlist') {
       sql = "SELECT p.* FROM profiles p JOIN shortlists s ON p.user_id = s.man_user_id WHERE s.woman_user_id = ? ORDER BY s.created_at DESC";
       args = [womanId];
    }
    
    if (!sql) return [];
    const r = await turso.execute({ sql, args });
    return r.rows;
  },

  /**
   * 📔 Shortlist Protocol: Save for intentional connection.
   */
  saveToShortlist: async (womanId: string, manId: string) => {
    const id = `short_${uuidv4()}`;
    await turso.execute({
      sql: "INSERT INTO shortlists (id, woman_user_id, man_user_id) VALUES (?, ?, ?)",
      args: [id, womanId, manId]
    });
    // Trigger signal
    await SanctuaryService.trackSignal(manId, 'save', womanId);
    return true;
  },

  unshortlist: async (womanId: string, manId: string) => {
    await turso.execute({
      sql: "DELETE FROM shortlists WHERE woman_user_id = ? AND man_user_id = ?",
      args: [womanId, manId]
    });
    return true;
  },

  /**
   * 📉 Sanctuary Signals: The Feedback Loop.
   */
  trackSignal: async (manId: string, type: 'impression' | 'visit' | 'save', womanId?: string) => {
    const id = `sig_${uuidv4()}`;
    turso.execute({
      sql: "INSERT INTO profile_analytics (id, man_user_id, woman_user_id, metric_type) VALUES (?, ?, ?, ?)",
      args: [id, manId, womanId || null, type]
    }).catch(e => console.warn("Signal Silent Failure:", e));
  },

  getSignalMetrics: async (userId: string) => {
    const r = await turso.execute({
      sql: `
        SELECT 
          metric_type, 
          COUNT(*) as count
        FROM profile_analytics 
        WHERE man_user_id = ? 
        AND created_at >= date('now', '-30 days')
        GROUP BY metric_type
      `,
      args: [userId]
    });
    
    const metrics: Record<string, number> = { impression: 0, visit: 0, save: 0 };
    r.rows.forEach((row: any) => {
       metrics[row.metric_type] = row.count;
    });
    return metrics;
  },

  /**
   * 👑 Sovereign Metrics: For Women's Dashboard only.
   */
  getSovereignMetrics: async (womanId: string) => {
    const [matchRes, sessionRes] = await Promise.all([
       turso.execute({ sql: "SELECT COUNT(*) as count FROM matches WHERE woman_user_id = ?", args: [womanId] }),
       turso.execute({ sql: "SELECT total_session_seconds FROM profiles WHERE user_id = ?", args: [womanId] })
    ]);
    
    return {
       matches: Number(matchRes.rows[0]?.count || 0),
       sessionSeconds: Number(sessionRes.rows[0]?.total_session_seconds || 0)
    };
  },

  trackSessionTime: async (userId: string, deltaSeconds: number) => {
     await turso.execute({
        sql: "UPDATE profiles SET total_session_seconds = total_session_seconds + ? WHERE user_id = ?",
        args: [deltaSeconds, userId]
     });
  },

  /**
   * 📈 High-Integrity Rank Reward: The Ledger Protocol.
   */
  rewardRank: async (userId: string, delta: number, reason: string) => {
    const logId = `rank_log_${uuidv4()}`;
    await turso.batch([
      {
        sql: "INSERT INTO rank_logs (id, user_id, delta, reason) VALUES (?, ?, ?, ?)",
        args: [logId, userId, delta, reason]
      },
      {
        sql: "UPDATE profiles SET rank_boost_count = rank_boost_count + ? WHERE user_id = ?",
        args: [delta, userId]
      }
    ], "write");
    return true;
  },

  getRankHistory: async (userId: string) => {
    const r = await turso.execute({
      sql: "SELECT * FROM rank_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      args: [userId]
    });
    return r.rows;
  },

  /**
   * 💎 AURA Tokenomics: Percentile Leap Protocol.
   */
  purchaseJump: async (userId: string, jumpType: 'nudge' | 'surge' | 'elite', city: string) => {
    // 1. Calculate N (Density)
    const nRes = await turso.execute({ sql: "SELECT COUNT(*) as density FROM profiles WHERE role='man' AND city = ?", args: [city] });
    const density = Number(nRes.rows[0]?.density || 100); // fallback to 100
    
    // 2. Assign P (Jump Power) Modeled on the Tier System
    let power = 0;
    if (jumpType === 'nudge') power = 0.05;
    if (jumpType === 'surge') power = 0.15;
    if (jumpType === 'elite') power = 0.50;

    // 3. Apply the leap (P * N). 
    // Example: Delhi has 10,000 men. A 15% Surge = 1,500 jump.
    // If we were adding base multiplier mechanics we'd calculate base rank first.
    const leapBonus = Math.floor(power * density);

    // 4. Update the token_bonus (reusing rank_boost_count)
    await SanctuaryService.rewardRank(userId, leapBonus, `Tiered Jump Executed: ${jumpType.toUpperCase()}`);
    return leapBonus;
  },

  // NOTE: AURA token purchases & wallet deductions would go here.
  // Until an `aura_balance` column is formally migrated, we handle balance virtually on the frontend.
  purchaseSealOfExcellence: async (userId: string) => {
     // A massive artificial jump bridging them past the entire density bracket entirely.
     await SanctuaryService.rewardRank(userId, 999999, "Seal of Excellence Acquired");
     return true;
  }
};
