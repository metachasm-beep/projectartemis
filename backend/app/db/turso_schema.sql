-- Matriarch Turso Registry Schema (LibSQL/SQLite)
-- This is the Single Source of Truth for Sanctuary Data.

-- Profiles Table (Shared Identity)
CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,
    full_name TEXT,
    date_of_birth TEXT, -- ISO Date
    city TEXT,
    bio TEXT,
    photos TEXT, -- JSON Array of URLs
    role TEXT NOT NULL, -- 'man', 'woman', 'admin'
    onboarding_status TEXT DEFAULT 'PENDING',
    is_verified BOOLEAN DEFAULT 0,
    aadhaar_verified BOOLEAN DEFAULT 0,
    points INTEGER DEFAULT 0,
    tokens INTEGER DEFAULT 0,
    rank_score REAL DEFAULT 0.0,
    rank_tier TEXT DEFAULT 'Aspirant',
    occupation TEXT,
    height INTEGER,
    referred_by_id TEXT, -- User who invited them
    data_processing_consent TEXT, -- JSON Object
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Male Rank Profiles (Petitioner Specifics)
CREATE TABLE IF NOT EXISTS male_rank_profiles (
    user_id TEXT PRIMARY KEY REFERENCES profiles(user_id) ON DELETE CASCADE,
    rank_score REAL DEFAULT 0.0,
    rank_tier TEXT DEFAULT 'Aspirant',
    profile_completeness REAL DEFAULT 0.0,
    referral_count INTEGER DEFAULT 0,
    last_active DATETIME,
    boost_active_until DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Administrative Reports/Audit Logs
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL REFERENCES profiles(user_id),
    reported_id TEXT NOT NULL REFERENCES profiles(user_id),
    reason TEXT,
    evidence_url TEXT,
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Mutual Blocks
CREATE TABLE IF NOT EXISTS blocks (
    blocker_id TEXT NOT NULL REFERENCES profiles(user_id),
    blocked_id TEXT NOT NULL REFERENCES profiles(user_id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id)
);

-- Point Transactions (Ledger)
CREATE TABLE IF NOT EXISTS point_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(user_id),
    delta INTEGER NOT NULL,
    transaction_type TEXT NOT NULL, -- 'referral', 'boost', 'ad_reward'
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Selection Events (Discovery tracing)
CREATE TABLE IF NOT EXISTS selection_events (
    id TEXT PRIMARY KEY,
    woman_id TEXT NOT NULL,
    man_id TEXT NOT NULL REFERENCES profiles(user_id),
    action TEXT NOT NULL, -- 'skip', 'save', 'match'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Communications/Resonances
CREATE TABLE IF NOT EXISTS resonances (
    id TEXT PRIMARY KEY,
    woman_id TEXT NOT NULL,
    man_id TEXT NOT NULL REFERENCES profiles(user_id),
    comm_mode TEXT NOT NULL DEFAULT 'none',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Legal Document Versions
CREATE TABLE IF NOT EXISTS legal_document_versions (
    id TEXT PRIMARY KEY,
    document_type TEXT NOT NULL, -- 'tos', 'privacy', 'aadhaar'
    version TEXT NOT NULL,
    content TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Consent Logs (DPDP 2023 Compliance)
CREATE TABLE IF NOT EXISTS consent_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    version TEXT NOT NULL,
    ip_address TEXT,
    device_info TEXT,
    accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages (Sanctuary Dialogue)
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    resonance_id TEXT NOT NULL REFERENCES resonances(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES profiles(user_id),
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);