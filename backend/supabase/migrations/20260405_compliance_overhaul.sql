-- ============================================================
-- MATRIARCH — DPDP Compliance Migration (2026.04.05)
-- Target: Supabase (PostgreSQL)
-- ============================================================

-- 1. Update Consent Logs for forensic metadata
ALTER TABLE public.consent_logs 
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS device_info TEXT;

-- 2. Update Profiles for granular data processing consent
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS data_processing_consent JSONB DEFAULT '{
    "analytics_accepted": true,
    "ads_accepted": true,
    "ranking_accepted": true
}'::JSONB;

-- 3. Update RLS (if needed) for consent logs
-- Ensure users can only see their own consent logs
DROP POLICY IF EXISTS "Users view own consent logs" ON public.consent_logs;
CREATE POLICY "Users view own consent logs"
    ON public.consent_logs FOR SELECT 
    USING (auth.uid()::TEXT = user_id::TEXT);

-- 4. Add index for better audit reporting
CREATE INDEX IF NOT EXISTS idx_consent_logs_metadata ON public.consent_logs(ip_address, accepted_at);

COMMENT ON COLUMN public.consent_logs.ip_address IS 'Captures the originating IP for DPDP proof of consent';
COMMENT ON COLUMN public.consent_logs.device_info IS 'Captures the User-Agent or device model';
COMMENT ON COLUMN public.profiles.data_processing_consent IS 'Granular consent flags for Ads, Analytics, and Ranking Algorithms';
