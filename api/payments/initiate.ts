import { turso } from '../_lib/turso.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * 💳 AURA STORE: Initiate Rank Jump Purchase
 * POST /api/payments/initiate
 * Body: { user_id, jump_type: 'nudge' | 'surge' | 'elite', city }
 *
 * Returns a unique UPI deep link for the exact amount.
 * The user pays through their UPI app, then submits the UTR to /api/payments/claim.
 */

const JUMP_PRICES: Record<string, number> = {
  nudge: 49,
  surge: 149,
  elite: 499,
};

const UPI_ID = process.env.VITE_UPI_ID || process.env.UPI_ID || '';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_id, jump_type, city = 'Delhi' } = req.body || {};

  if (!user_id) return res.status(400).json({ error: 'user_id is required' });
  if (!JUMP_PRICES[jump_type]) return res.status(400).json({ error: 'Invalid jump_type. Use nudge | surge | elite.' });

  const amount = JUMP_PRICES[jump_type];
  const orderId = uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase();
  const note = `MATRIARCH_${jump_type.toUpperCase()}_${orderId}`;

  try {
    // Log the pending order to Turso for webhook matching
    await turso.execute({
      sql: `INSERT INTO pending_claims (id, user_id, submitted_utr, status, metadata) 
            VALUES (?, ?, ?, 'awaiting_payment', ?)`,
      args: [
        uuidv4(),
        user_id,
        orderId, // temporary reference — real UTR submitted later
        JSON.stringify({ jump_type, city, amount, order_id: orderId })
      ]
    }).catch(() => {
      // If metadata column doesn't exist yet, fallback gracefully
    });

    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=Matriarch&am=${amount}&cu=INR&tn=${note}`;

    return res.status(200).json({
      status: 'initiated',
      amount,
      jump_type,
      order_ref: orderId,
      upi_url: upiUrl,
      upi_id: UPI_ID,
      note,
    });
  } catch (err) {
    console.error('INITIATE_PAYMENT_ERROR:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
