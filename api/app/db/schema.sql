-- Matriarch PWA Schema (PostgreSQL)

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL, -- male_demo, etc.
    full_name TEXT,
    age INT,
    bio TEXT,
    image_url TEXT,
    rank_score FLOAT DEFAULT 0.0,
    rank_tier TEXT DEFAULT 'mid',
    is_aadhaar_verified BOOLEAN DEFAULT FALSE,
    is_elite BOOLEAN DEFAULT FALSE,
    profile_completeness INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consent Logs (Indian DPDP 2023 Compliance)
CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'tos', 'privacy', 'aadhaar'
    version TEXT NOT NULL,
    accepted_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    metadata JSONB
);

-- Discovery Feed Logs (Audit/180-day retention)
CREATE TABLE IF NOT EXISTS discovery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    woman_id TEXT NOT NULL,
    man_id TEXT NOT NULL REFERENCES profiles(user_id),
    action TEXT NOT NULL, -- 'seen', 'skipped', 'matched'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    woman_id TEXT NOT NULL,
    man_id TEXT NOT NULL REFERENCES profiles(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active'
);

-- Sample Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
