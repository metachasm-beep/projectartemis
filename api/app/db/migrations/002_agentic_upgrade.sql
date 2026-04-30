-- Matriarch Turso Registry Upgrade: 002
-- Hardening for Agentic Sanctuary Architecture and Playbook

-- 1. Add missing columns to profiles
ALTER TABLE profiles ADD COLUMN skills TEXT DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN active_brainstorm_id TEXT;

-- 2. Create Verification Plans table (Missing from 001)
CREATE TABLE IF NOT EXISTS verification_plans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    steps TEXT NOT NULL, -- JSON Array of {id, label, status, detail}
    current_step_id TEXT,
    status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'HALTED', 'SEALED'
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Protocol Audits table (Missing from 001)
CREATE TABLE IF NOT EXISTS protocol_audits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create female_preferences table (Missing from 001)
CREATE TABLE IF NOT EXISTS female_preferences (
    user_id TEXT PRIMARY KEY REFERENCES profiles(user_id) ON DELETE CASCADE,
    min_age INTEGER DEFAULT 18,
    max_age INTEGER DEFAULT 99,
    min_height_cm INTEGER DEFAULT 0,
    max_distance_km INTEGER DEFAULT 100,
    cities TEXT DEFAULT '[]',
    intentions TEXT DEFAULT '[]',
    verified_only BOOLEAN DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create point_transactions if not exists (Double check)
CREATE TABLE IF NOT EXISTS point_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    delta INTEGER NOT NULL,
    transaction_type TEXT NOT NULL, 
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
