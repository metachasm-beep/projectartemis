-- ============================================================
-- MATRIARCH — Production Database Schema
-- Target: Supabase (PostgreSQL)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================== ENUMS ================================

CREATE TYPE user_role AS ENUM ('woman', 'man');
CREATE TYPE match_status AS ENUM ('active', 'unmatched');
CREATE TYPE comm_mode AS ENUM (
    'none', 'chat', 'voice_request', 'video_request',
    'delayed_unlock', 'qa_mode', 'prompt_intro'
);
CREATE TYPE report_status AS ENUM ('open', 'under_review', 'resolved', 'dismissed');

-- ===================== USERS ================================

CREATE TABLE IF NOT EXISTS public.users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone       TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE,
    role        user_role NOT NULL,
    firebase_uid TEXT UNIQUE,
    is_active   BOOLEAN DEFAULT TRUE,
    is_banned   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== PROFILES ============================

CREATE TABLE IF NOT EXISTS public.profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    full_name               TEXT,
    bio                     TEXT,
    avatar_url              TEXT,
    date_of_birth           DATE,
    age                     INT,
    city                    TEXT,
    state                   TEXT,
    country                 TEXT DEFAULT 'IN',
    -- Aadhaar
    aadhaar_verified        BOOLEAN DEFAULT FALSE,
    aadhaar_last_4          TEXT,
    aadhaar_verification_id TEXT,
    aadhaar_verified_at     TIMESTAMPTZ,
    -- Completeness
    completeness_score      INT DEFAULT 0,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== FEMALE PREFERENCES ==================

CREATE TABLE IF NOT EXISTS public.female_preferences (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    min_age                INT DEFAULT 18,
    max_age                INT DEFAULT 50,
    max_distance_km        INT DEFAULT 50,
    aadhaar_verified_only  BOOLEAN DEFAULT FALSE,
    updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== MALE RANK PROFILES ==================

CREATE TABLE IF NOT EXISTS public.male_rank_profiles (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                   UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    rank_score                FLOAT DEFAULT 0,
    profile_completeness_weight FLOAT DEFAULT 0,
    verification_bonus        FLOAT DEFAULT 0,
    referral_bonus            FLOAT DEFAULT 0,
    ad_watch_bonus            FLOAT DEFAULT 0,
    paid_boost_bonus          FLOAT DEFAULT 0,
    moderation_penalty        FLOAT DEFAULT 0,
    inactivity_penalty        FLOAT DEFAULT 0,
    daily_ad_credits_used     INT DEFAULT 0,
    last_ad_credit_reset      TIMESTAMPTZ,
    boost_active_until        TIMESTAMPTZ,
    is_visible                BOOLEAN DEFAULT TRUE,
    is_shadowbanned           BOOLEAN DEFAULT FALSE,
    updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== RANK EVENTS (Immutable Ledger) =======

CREATE TABLE IF NOT EXISTS public.rank_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_type  TEXT NOT NULL,
    delta       FLOAT NOT NULL,
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_rank_events_user ON public.rank_events(user_id);

-- ===================== MATCHES =============================

CREATE TABLE IF NOT EXISTS public.matches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    woman_id        UUID REFERENCES public.users(id) ON DELETE CASCADE,
    man_id          UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status          match_status DEFAULT 'active',
    comm_mode       comm_mode DEFAULT 'none',
    comm_mode_set_at TIMESTAMPTZ,
    comm_mode_unlocked BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(woman_id, man_id)
);
CREATE INDEX idx_matches_woman ON public.matches(woman_id);
CREATE INDEX idx_matches_man ON public.matches(man_id);

-- ===================== SELECTION EVENTS ====================

CREATE TABLE IF NOT EXISTS public.selection_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    woman_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
    man_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action      TEXT NOT NULL, -- match, skip, save, report, block
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_selection_events_woman ON public.selection_events(woman_id);

-- ===================== CONSENT LOGS ========================

CREATE TABLE IF NOT EXISTS public.consent_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES public.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    version       TEXT NOT NULL,
    accepted_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_consent_logs_user ON public.consent_logs(user_id);

-- ===================== LEGAL DOCUMENT VERSIONS =============

CREATE TABLE IF NOT EXISTS public.legal_document_versions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type TEXT NOT NULL,
    version       TEXT NOT NULL,
    content_url   TEXT NOT NULL,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(document_type, version)
);

-- Seed initial legal docs
INSERT INTO public.legal_document_versions (document_type, version, content_url, is_active)
VALUES
  ('tos',             '2026.04.01', 'https://matriarch.app/legal/tos',      TRUE),
  ('privacy',         '2026.04.01', 'https://matriarch.app/legal/privacy',  TRUE),
  ('aadhaar_consent', '1.0.0',      'https://matriarch.app/legal/aadhaar',  TRUE)
ON CONFLICT DO NOTHING;

-- ===================== REPORTS =============================

CREATE TABLE IF NOT EXISTS public.reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id     UUID REFERENCES public.users(id),
    reported_id     UUID REFERENCES public.users(id),
    reason          TEXT NOT NULL,
    evidence_url    TEXT,
    status          report_status DEFAULT 'open',
    resolved_by     UUID REFERENCES public.users(id),
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== BLOCKS ==============================

CREATE TABLE IF NOT EXISTS public.blocks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id  UUID REFERENCES public.users(id),
    blocked_id  UUID REFERENCES public.users(id),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

-- ===================== SAFETY PROFILES =====================

CREATE TABLE IF NOT EXISTS public.user_safety_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID UNIQUE REFERENCES public.users(id),
    risk_score      FLOAT DEFAULT 0,
    report_count    INT DEFAULT 0,
    block_count     INT DEFAULT 0,
    fraud_signals   INT DEFAULT 0,
    last_reviewed   TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== RLS POLICIES ========================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own record"
    ON public.users FOR SELECT USING (auth.uid()::TEXT = id::TEXT);

CREATE POLICY "Profiles viewable by authenticated"
    ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY "Women see their own matches"
    ON public.matches FOR SELECT USING (auth.uid()::TEXT = woman_id::TEXT OR auth.uid()::TEXT = man_id::TEXT);
