import { turso } from '@/lib/turso';
import { v4 as uuidv4 } from 'uuid';

export const SanctuaryService = {
  /**
   * 🏹 Discovery Feed: Curated Resonance Rails.
   */
  getRailFeed: async (womanId: string, type: 'imperial' | 'truth' | 'rising' | 'nearby' | 'shortlist', city?: string) => {
    let sql = "";
    let args: any[] = [];

    // Order: Rank 1 -> Rank N (Ascending)
    if (type === 'imperial') {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND is_verified = 1 ORDER BY absolute_rank ASC LIMIT 20";
    } else if (type === 'truth') {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND is_verified = 1 ORDER BY absolute_rank ASC LIMIT 20";
    } else if (type === 'rising') {
       sql = "SELECT * FROM profiles WHERE role = 'man' ORDER BY created_at DESC, absolute_rank ASC LIMIT 20";
    } else if (type === 'nearby' && city) {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND city = ? ORDER BY absolute_rank ASC LIMIT 20";
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
    const [matchRes, sessionRes, viewsRes, savesRes, interactionsRes] = await Promise.all([
       turso.execute({ sql: "SELECT COUNT(*) as count FROM matches WHERE woman_user_id = ?", args: [womanId] }),
       turso.execute({ sql: "SELECT total_session_seconds, consecutive_days FROM profiles WHERE user_id = ?", args: [womanId] }),
       turso.execute({ sql: "SELECT COUNT(*) as count FROM profile_analytics WHERE woman_user_id = ? AND metric_type = 'impression'", args: [womanId] }), // Her profile views
       turso.execute({ sql: "SELECT COUNT(*) as count FROM shortlists WHERE woman_user_id = ?", args: [womanId] }), // Profiles she saved
       turso.execute({ sql: "SELECT COUNT(*) as count FROM profile_analytics WHERE woman_user_id = ? AND metric_type = 'visit'", args: [womanId] }) // Visits tracking
    ]);
    
    return {
       matches: Number(matchRes.rows[0]?.count || 0),
       sessionSeconds: Number(sessionRes.rows[0]?.total_session_seconds || 0),
       activeStreak: Number(sessionRes.rows[0]?.consecutive_days || 0),
       profileViews: Number(viewsRes.rows[0]?.count || 0),
       profilesEngaged: Number(interactionsRes.rows[0]?.count || 0),
       saves: Number(savesRes.rows[0]?.count || 0),
       profileCompleteness: 94 // Defaulting until column is provisioned
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
        sql: "UPDATE profiles SET rank_score = rank_score + ? WHERE user_id = ?",
        args: [delta, userId]
      }
    ], "write");
    
    // 👑 Trigger Global Re-ranking to maintain exclusive integrity
    await SanctuaryService.recalculateGlobalRanks();
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
  /**
   * 💎 AURA Tokenomics: Percentile Leap Protocol.
   * Logic: 1 INR = 1 Aura Token.
   * Jump percentage of the total male population.
   */
  purchaseJump: async (userId: string, jumpPercent: number) => {
    // 1. Calculate N (Total Men)
    const nRes = await turso.execute({ sql: "SELECT COUNT(*) as density FROM profiles WHERE role='man'" });
    const totalMen = Number(nRes.rows[0]?.density || 100);
    
    // 2. Calculate Bonus Required.
    // Every 'rank_score' point effectively competes against others.
    // To jump 'X' percentage of 'N' people, we award a bonus.
    // We'll use a standard weight: 100 points per 1% jump of the total population.
    const jumpPoints = Math.floor((jumpPercent / 100) * totalMen * 10); 

    // 4. Update the rank_score
    await SanctuaryService.rewardRank(userId, jumpPoints, `Aura Jump Executed: ${jumpPercent}% Population Leap`);
    return jumpPoints;
  },

  purchaseSealOfExcellence: async (userId: string) => {
     // The ultimate seal: A 1,000,000 point boost to virtually guarantee Rank #1 position.
     await SanctuaryService.rewardRank(userId, 1000000, "Seal of Excellence Acquired");
     return true;
  },

  /**
   * 🏆 Global Leaderboard: Fetch the rooted ascent of men.
   */
  getLeaderboard: async (limit: number = 100) => {
    const r = await turso.execute({
      sql: `
        SELECT user_id, full_name, age, city, photos, is_verified, absolute_rank
        FROM profiles 
        WHERE role = 'man'
        ORDER BY absolute_rank ASC 
        LIMIT ?
      `,
      args: [limit]
    });
    return r.rows;
  },

  /**
   * 🌊 Global Rank Reflow: Ensures absolute exclusivity (Only 1 profile per rank).
   * Priority: Verified (1/0) > Boosts (Desc) > Loyalty (Created Asc) > UID (Tie-breaker).
   */
  recalculateGlobalRanks: async () => {
    try {
      // 🌊 Sovereign Atomic Reflow: One statement to re-index the entire sanctuary.
      // Priority: Verified Status > Rank Score (Integrity+Tokens) > Seniority > Deterministic UID.
      await turso.execute(`
        WITH ranked AS (
          SELECT user_id, 
          ROW_NUMBER() OVER (
            ORDER BY 
              COALESCE(is_verified, 0) DESC, 
              COALESCE(rank_score, 0) DESC, 
              COALESCE(created_at, '9999-12-31') ASC, 
              user_id ASC
          ) as new_rank
          FROM profiles
          WHERE role = 'man'
        )
        UPDATE profiles
        SET absolute_rank = ranked.new_rank
        FROM ranked
        WHERE profiles.user_id = ranked.user_id;
      `);
    } catch (err) {
      console.error("RANK_REFLOW_CRITICAL_FAILURE:", err);
    }
  },

  /**
   * 🛡️ Biometric Ledger: Seal the verification into the database.
   */
  verifyProfile: async (userId: string) => {
    await turso.execute({
      sql: "UPDATE profiles SET is_verified = 1 WHERE user_id = ?",
      args: [userId]
    });
    // Trigger rank reflow as verified profiles get priority
    await SanctuaryService.recalculateGlobalRanks();
    return true;
  },

  /**
   * 📑 Audit Trail: Store biometric evidence for high-integrity synchronization.
   */
  uploadVerificationEvidence: async (userId: string, evidence: Blob | string) => {
    const auditId = `audit_${uuidv4()}`;
    // In a production environment, 'evidence' would be stored as an encrypted hash or secure URL
    // Here we log the high-integrity event for the "Architect" to review.
    await turso.execute({
      sql: "INSERT INTO protocol_audits (id, user_id, action, metadata) VALUES (?, ?, ?, ?)",
      args: [auditId, userId, 'BIOMETRIC_SYNC', JSON.stringify({
        timestamp: new Date().toISOString(),
        evidence_sealed: true,
        payload_hash: typeof evidence === 'string' ? evidence : 'BLOB_ESTABLISHED',
        protocol_version: '1.0'
      })]
    }).catch(e => console.warn("Audit Log Silent Failure (Schema may not exist):", e));
    
    return true;
  },

  /**
   * 📉 Resonance Decay Protocol:
   * Penalizes rank_score for prolonged sanctuary absence.
   * Logic: -2% per day beyond a 3-day grace period.
   */
  applyRankDecay: async (userId: string, totalInactivityDays: number) => {
    if (totalInactivityDays < 3) return 0;
    
    // Calculate penalty (2% compounds per day beyond grace)
    const penaltyRatio = 0.02 * (totalInactivityDays - 3);
    const cappedPenalty = Math.min(penaltyRatio, 0.50); // Cap at 50% max loss
    
    await turso.execute({
      sql: "UPDATE profiles SET rank_score = rank_score - (rank_score * ?), updated_at = ? WHERE user_id = ?",
      args: [cappedPenalty, new Date().toISOString(), userId]
    });
    
    await SanctuaryService.recalculateGlobalRanks();
    return cappedPenalty;
  },

  /**
   * 📑 Dossier Resonance Sync:
   * Rewards rank_score based on profile integrity/completeness.
   */
  syncIntegrityBonus: async (userId: string, integrityScore: number) => {
    // Logic: Every 10% integrity grants 500 rank points.
    // We only reward for milestones reached.
    const bonus = Math.floor(integrityScore / 10) * 500;
    
    await SanctuaryService.rewardRank(userId, bonus, `Dossier Calibration Bonus: ${integrityScore}% Integrity`);
    return bonus;
  },

  /**
   * 👑 Tier Brackets (Absolute Population Based):
   * Maps current absolute_rank to high-status designations.
   */
  getTierFromRank: (rank: number, total: number) => {
    if (rank <= 10) return { id: 'choice', name: 'The Choice', color: 'mat-gold-foil' };
    
    const percentile = (rank / total) * 100;
    
    if (percentile <= 5) return { id: 'ascendant', name: 'Ascendant', color: 'mat-gold' };
    if (percentile <= 15) return { id: 'paragon', name: 'Paragon', color: 'mat-wine-soft' };
    if (percentile <= 30) return { id: 'noble', name: 'Noble', color: 'mat-wine' };
    if (percentile <= 60) return { id: 'vanguard', name: 'Vanguard', color: 'mat-rose' };
    return { id: 'aspirant', name: 'Aspirant', color: 'mat-slate' };
  },

  /**
   * 🛡️ Sovereign Protection: Report, Block, and Filter.
   */
  reportUser: async (actorId: string, targetId: string, reason: string) => {
    const id = `report_${uuidv4()}`;
    await turso.execute({
      sql: "INSERT INTO user_interactions (id, actor_id, target_id, interaction_type, reason) VALUES (?, ?, ?, 'report', ?)",
      args: [id, actorId, targetId, reason]
    });
    return true;
  },

  blockUser: async (actorId: string, targetId: string) => {
    const id = `block_${uuidv4()}`;
    await turso.execute({
      sql: "INSERT INTO user_interactions (id, actor_id, target_id, interaction_type) VALUES (?, ?, ?, 'block')",
      args: [id, actorId, targetId]
    });
    return true;
  },

  setNeverShow: async (actorId: string, targetId: string) => {
    const id = `filter_${uuidv4()}`;
    await turso.execute({
      sql: "INSERT INTO user_interactions (id, actor_id, target_id, interaction_type) VALUES (?, ?, ?, 'never_show')",
      args: [id, actorId, targetId]
    });
    return true;
  }
};
