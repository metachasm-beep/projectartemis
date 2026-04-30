-- Matriarch Turso Registry Upgrade: 003
-- Influencer & Affiliate System
-- Adds: is_influencer flag, pending_balance, coupon_codes, coupon_uses

-- 1. Extend profiles with influencer fields
ALTER TABLE profiles ADD COLUMN is_influencer BOOLEAN DEFAULT 0;
ALTER TABLE profiles ADD COLUMN pending_balance REAL DEFAULT 0.0;

-- 2. Coupon Codes Registry
-- Each influencer gets one canonical code, created by an admin.
-- discount_pct is stored for audit purposes (always 50 in practice).
CREATE TABLE IF NOT EXISTS coupon_codes (
    code TEXT PRIMARY KEY,                   -- Stored UPPERCASE e.g. 'SAKSHAM50'
    influencer_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    discount_pct INTEGER NOT NULL DEFAULT 50, -- Percentage discount (fixed at 50)
    is_active BOOLEAN DEFAULT 1,
    created_by TEXT NOT NULL,               -- Admin user_id who issued it
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Coupon Usage Ledger
-- One row per payment claim that used a coupon code.
CREATE TABLE IF NOT EXISTS coupon_uses (
    id TEXT PRIMARY KEY,
    coupon_code TEXT NOT NULL REFERENCES coupon_codes(code),
    user_id TEXT NOT NULL REFERENCES profiles(user_id),  -- Paying user
    original_amount REAL NOT NULL,           -- Pre-discount price
    discounted_amount REAL NOT NULL,         -- Amount actually paid
    commission_earned REAL NOT NULL,         -- 10% of discounted_amount
    payment_utr TEXT,                        -- UTR reference from the claim
    approved_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_coupon_uses_coupon ON coupon_uses(coupon_code);
CREATE INDEX IF NOT EXISTS idx_coupon_uses_user ON coupon_uses(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_codes_influencer ON coupon_codes(influencer_id);
