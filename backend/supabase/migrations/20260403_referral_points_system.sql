-- ============================================================
-- MATRIARCH — Referral & Points System Migration
-- ============================================================

-- 1. Update Profiles Table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS points INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 2. Create Point Transactions Table (Ledger)
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES public.users(id) ON DELETE CASCADE,
    delta         INT NOT NULL,
    transaction_type TEXT NOT NULL, -- 'referral_credit', 'rank_boost', 'filter_unlock', 'registration_bonus'
    notes         TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_point_transactions_user ON public.point_transactions(user_id);

-- 3. Create Unique Referral Code Function (Optional but good for DB level checks)
-- We'll mostly handle generation in the backend for simplicity.

-- 4. Create a view for point balances if needed, though profiles should be fine.

-- 5. Seed initial points for existing accounts (Optional)
UPDATE public.profiles SET points = 100 WHERE points IS NULL OR points = 0;
