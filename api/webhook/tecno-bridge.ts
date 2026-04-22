import { getTurso } from '../_lib/turso.js';

// MacroDroid / SMS-Forward webhook POST endpoint
// Receives parsed bank notification text and stores payment records.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const turso = getTurso();

  try {
    const { notification_text } = req.body || {};

    if (!notification_text) {
      return res.status(200).send('OK');
    }

    // Regex 1: Extract 12-digit UTR
    const utrMatch = notification_text.match(/\b\d{12}\b/);
    const utr = utrMatch ? utrMatch[0] : null;

    // Regex 2: Extract amount (handles ₹, Rs, Rs.)
    const amountMatch = notification_text.match(/(?:₹|Rs\.?)\s?([\d,.]+)/);
    const amountStr = amountMatch ? amountMatch[1].replace(/,/g, '') : null;
    const amount = amountStr ? parseFloat(amountStr) : null;

    if (!utr || !amount) {
      return res.status(200).send('OK');
    }

    // 1. Store payment in received_payments (idempotent)
    try {
      await turso.execute({
        sql: `INSERT INTO received_payments (utr, amount, raw_text, is_claimed) VALUES (?, ?, ?, 0)`,
        args: [utr, amount, notification_text],
      });
    } catch (e: any) {
      if (e.message?.includes('UNIQUE constraint failed')) {
        console.log('Duplicate UTR received, skipping:', utr);
        return res.status(200).send('OK');
      }
      throw e;
    }

    // 2. Check if a user already submitted this UTR as pending
    const pendingRes = await turso.execute({
      sql: `SELECT * FROM pending_claims WHERE submitted_utr = ? AND status = 'pending'`,
      args: [utr],
    });

    if (pendingRes.rows.length > 0) {
      const claim: any = pendingRes.rows[0];
      const userId = claim.user_id;
      const metadata = (() => { try { return JSON.parse(claim.metadata || '{}'); } catch { return {}; } })();
      const jumpType = metadata.jump_type || 'nudge';
      const city = metadata.city || 'Delhi';

      // Calculate density-aware rank leap
      const densityRes = await turso.execute({
        sql: `SELECT COUNT(*) as density FROM profiles WHERE role = 'man' AND city = ?`,
        args: [city]
      });
      const density = Number(densityRes.rows[0]?.density || 1000);
      const jumpPower: Record<string, number> = { nudge: 0.05, surge: 0.15, elite: 0.50 };
      const leapBonus = Math.floor((jumpPower[jumpType] || 0.05) * density);

      await turso.batch([
        {
          sql: `UPDATE received_payments SET is_claimed = 1 WHERE utr = ?`,
          args: [utr],
        },
        {
          sql: `UPDATE pending_claims SET status = 'approved' WHERE id = ?`,
          args: [claim.id],
        },
        {
          // Credit both tokens (real INR value) and rank_score (competitive leap)
          sql: `UPDATE profiles SET tokens = COALESCE(tokens, 0) + ?, rank_score = COALESCE(rank_score, 0) + ?, updated_at = ? WHERE user_id = ?`,
          args: [amount, leapBonus, new Date().toISOString(), userId],
        }
      ], 'write');

      // Trigger global re-rank (async, non-critical)
      turso.execute(`
        SELECT user_id, ROW_NUMBER() OVER (
          ORDER BY is_verified DESC, rank_score DESC, created_at ASC, user_id ASC
        ) as new_rank FROM profiles WHERE role = 'man'
      `).then(all => {
        const updates = all.rows.map((r: any) => ({
          sql: `UPDATE profiles SET absolute_rank = ? WHERE user_id = ?`,
          args: [r.new_rank, r.user_id]
        }));
        if (updates.length > 0) return turso.batch(updates, 'write');
      }).catch(e => console.warn('WEBHOOK_RANK_REFLOW_WARN:', e));

      console.log(`✅ WEBHOOK: Credited ₹${amount} + ${leapBonus} rank points to ${userId} via UTR ${utr}`);
    }

    return res.status(200).send('200 OK');

  } catch (error) {
    console.error('WEBHOOK_ERROR:', error);
    return res.status(200).send('OK'); // Always 200 to prevent MacroDroid retry loops
  }
}
