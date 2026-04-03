-- ============================================================
-- MATRIARCH — Blueprint Alignment Migration
-- Expands the schema to support the Master Blueprint requirements.
-- ============================================================

-- ===================== REWARDS & REFERRALS ===================

CREATE TABLE IF NOT EXISTS public.referrals (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id   UUID REFERENCES public.users(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    total_claims  INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referral_claims (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id   UUID REFERENCES public.referrals(id) ON DELETE CASCADE,
    claimant_id   UUID UNIQUE REFERENCES public.users(id), -- One claim per user
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== WALLET & MONETIZATION =================

CREATE TABLE IF NOT EXISTS public.wallet_ledger (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount        FLOAT NOT NULL, -- Sovereign Credits
    transaction_type TEXT NOT NULL, -- refill, boost_purchase, reward_claim
    notes         TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES public.users(id),
    amount_paid     FLOAT NOT NULL, -- Real currency
    currency        TEXT DEFAULT 'INR',
    gateway_tx_id   TEXT UNIQUE,
    status          TEXT DEFAULT 'pending', -- pending, success, failed
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.boost_purchases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE,
    boost_type      TEXT NOT NULL,
    cost_credits    FLOAT NOT NULL,
    duration_hours  INT NOT NULL,
    active_at       TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rewarded_ad_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE,
    ad_network      TEXT DEFAULT 'mock_network',
    credits_earned  FLOAT DEFAULT 5.0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== DISCOVERY TRACKING ====================

CREATE TABLE IF NOT EXISTS public.discovery_actions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    woman_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
    man_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- skip, save, view
    feedback    TEXT, -- Optional skip reason
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_discovery_actions_woman ON public.discovery_actions(woman_id);
CREATE INDEX idx_discovery_actions_man ON public.discovery_actions(man_id);

-- ===================== COMMUNICATION LAYER ===================

CREATE TABLE IF NOT EXISTS public.conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id        UUID UNIQUE REFERENCES public.matches(id) ON DELETE CASCADE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id       UUID REFERENCES public.users(id),
    content         TEXT NOT NULL,
    message_type    TEXT DEFAULT 'text', -- text, voice, intro_response
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);

-- ===================== MODERATION & SAFETY ===================

CREATE TABLE IF NOT EXISTS public.moderation_cases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_user_id UUID REFERENCES public.users(id),
    report_ids      UUID[] DEFAULT '{}',
    severity_level  TEXT DEFAULT 'low',
    summary         TEXT,
    assigned_admin  UUID REFERENCES public.users(id),
    status          TEXT DEFAULT 'open', -- open, investigating, sanctioned, closed
    sanction_type   TEXT, -- warning, shadowban, suspension, ban
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.grievance_tickets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES public.users(id),
    subject         TEXT NOT NULL,
    description     TEXT NOT NULL,
    status          TEXT DEFAULT 'submitted', -- submitted, in_progress, resolved
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== RLS UPDATES ===========================

ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own wallet"
    ON public.wallet_ledger FOR SELECT USING (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY "Users view own referrals"
    ON public.referrals FOR SELECT USING (auth.uid()::TEXT = referrer_id::TEXT);

CREATE POLICY "Participants see conversation messages"
    ON public.messages FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            JOIN public.matches m ON c.match_id = m.id
            WHERE c.id = conversation_id
            AND (auth.uid()::TEXT = m.woman_id::TEXT OR auth.uid()::TEXT = m.man_id::TEXT)
        )
    );
