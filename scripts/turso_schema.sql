-- Matriarch Turso SQL Schema Migration

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, 
    name TEXT,
    aura_balance INTEGER DEFAULT 0,
    last_topup TIMESTAMP
);

CREATE TABLE IF NOT EXISTS received_payments (
    utr TEXT PRIMARY KEY,
    amount REAL,
    raw_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_claimed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pending_claims (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    submitted_utr TEXT,
    status TEXT DEFAULT 'pending', -- 'pending' or 'approved'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
