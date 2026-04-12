import { turso } from '../_lib/turso.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * 💳 AURA STORE: Claim a rank-jump via UTR verification.
 * POST /api/payments/claim
 * Body: { user_id, utr, jump_type, city }
 *
 * Workflow:
 * 1. Check if the UTR exists in `received_payments` (logged by MacroDroid/tecno-bridge).
 * 2. If found → calculate rank bonus via density-aware tier logic and update `profiles`.
 * 3. If not yet found → queue as 'pending' for webhook to resolve.
 */

const JUMP_POWER: Record<string, number> = {
  nudge: 0.05,
  surge: 0.15,
  elite: 0.50,
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { user_id, utr, jump_type = 'nudge', city = 'Delhi' } = req.body || {};

    if (!user_id || !utr) {
      return res.status(400).json({ error: 'user_id and utr are required.' });
    }
    if (utr.length < 12 || !/^\d+$/.test(utr)) {
      return res.status(400).json({ error: 'UTR must be a 12-digit numeric string.' });
    }
    if (!JUMP_POWER[jump_type]) {
      return res.status(400).json({ error: 'Invalid jump_type.' });
    }

    // ── Rate limiting ──
    const rateLimitRes = await turso.execute({
      sql: `SELECT COUNT(*) as count FROM pending_claims WHERE user_id = ? AND status = 'pending' AND created_at > datetime('now', '-2 minutes')`,
      args: [user_id]
    });
    if (Number(rateLimitRes.rows[0].count) >= 3) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait before retrying.' });
    }

    // ── Check if already claimed ──
    const existingRes = await turso.execute({
      sql: `SELECT * FROM received_payments WHERE utr = ?`,
      args: [utr]
    });

    if (existingRes.rows.length > 0) {
      const payment: any = existingRes.rows[0];

      if (payment.is_claimed) {
        return res.status(400).json({ error: 'This UTR has already been claimed.' });
      }

      // ── Payment verified: calculate leap bonus ──
      const densityRes = await turso.execute({
        sql: `SELECT COUNT(*) as density FROM profiles WHERE role = 'man' AND city = ?`,
        args: [city]
      });
      const density = Number(densityRes.rows[0]?.density || 1000);
      const leapBonus = Math.floor(JUMP_POWER[jump_type] * density);

      // ── Atomic batch: credit tokens + rank_score, mark payment as claimed ──
      const logId = `rank_log_${uuidv4()}`;
      await turso.batch([
        {
          sql: `UPDATE received_payments SET is_claimed = 1 WHERE utr = ?`,
          args: [utr]
        },
        {
          sql: `UPDATE profiles SET tokens = tokens + ?, rank_score = rank_score + ?, updated_at = ? WHERE user_id = ?`,
          args: [payment.amount, leapBonus, new Date().toISOString(), user_id]
        },
        {
          sql: `INSERT INTO rank_logs (id, user_id, delta, reason) VALUES (?, ?, ?, ?)`,
          args: [logId, user_id, leapBonus, `AURA Jump: ${jump_type.toUpperCase()} | UTR: ${utr}`]
        }
      ], 'write');

      // Trigger global re-rank
      try {
        const all = await turso.execute(`
          SELECT user_id, ROW_NUMBER() OVER (
            ORDER BY is_verified DESC, rank_score DESC, created_at ASC, user_id ASC
          ) as new_rank FROM profiles WHERE role = 'man'
        `);
        const updates = all.rows.map((r: any) => ({
          sql: `UPDATE profiles SET absolute_rank = ? WHERE user_id = ?`,
          args: [r.new_rank, r.user_id]
        }));
        if (updates.length > 0) await turso.batch(updates, 'write');
      } catch (rankErr) {
        console.warn('RANK_REFLOW_WARN (non-critical):', rankErr);
      }

      return res.status(200).json({
        status: 'success',
        message: `${jump_type.toUpperCase()} jump executed. +${leapBonus} rank points credited.`,
        leap_bonus: leapBonus,
        tokens_credited: payment.amount
      });
    } else {
      // ── Payment not yet logged by MacroDroid ──
      const dupCheck = await turso.execute({
        sql: `SELECT id FROM pending_claims WHERE user_id = ? AND submitted_utr = ?`,
        args: [user_id, utr]
      });
      if (dupCheck.rows.length === 0) {
        await turso.execute({
          sql: `INSERT INTO pending_claims (id, user_id, submitted_utr, status) VALUES (?, ?, ?, 'pending')`,
          args: [uuidv4(), user_id, utr]
        });
      }
      return res.status(202).json({
        status: 'pending',
        message: 'Transaction logged. Your jump will be activated automatically once the payment is confirmed.'
      });
    }
  } catch (error) {
    console.error('CLAIM_ERROR:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
