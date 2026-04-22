import { getTurso } from '../_lib/turso.js';
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

const JUMP_AMOUNTS: Record<string, number> = {
  nudge: 49,
  surge: 149,
  elite: 499,
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const turso = getTurso();

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

    // ── Check if already claimed / pending ──
    const dupCheck = await turso.execute({
      sql: `SELECT id FROM pending_claims WHERE user_id = ? AND submitted_utr = ?`,
      args: [user_id, utr]
    });

    if (dupCheck.rows.length === 0) {
      const metadataStr = JSON.stringify({ type: 'aura', jump_type, city, amount: JUMP_AMOUNTS[jump_type] });
      await turso.execute({
        sql: `INSERT INTO pending_claims (id, user_id, submitted_utr, status, metadata) VALUES (?, ?, ?, 'pending', ?)`,
        args: [uuidv4(), user_id, utr, metadataStr]
      });
    }

    return res.status(202).json({
      status: 'pending',
      message: 'Transaction logged. Your rank jump will be activated once the Admin manually validates your UTR.'
    });

  } catch (error) {
    console.error('CLAIM_ERROR:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
