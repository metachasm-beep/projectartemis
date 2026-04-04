import { turso } from './turso';

const schema = `
CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    woman_user_id TEXT NOT NULL,
    man_user_id TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    current_comm_mode TEXT DEFAULT 'PROMPT_INTRO',
    selected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    chat_opened_at DATETIME,
    closed_at DATETIME,
    prompts_completed BOOLEAN DEFAULT 0,
    delayed_unlock_at DATETIME,
    UNIQUE(woman_user_id, man_user_id)
);

CREATE TABLE IF NOT EXISTS match_state_history (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL,
    from_status TEXT,
    to_status TEXT,
    changed_by_user_id TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS communication_mode_history (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL,
    mode TEXT NOT NULL,
    changed_by_user_id TEXT NOT NULL,
    reason_code TEXT,
    effective_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL UNIQUE,
    is_open BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender_user_id TEXT NOT NULL,
    body TEXT NOT NULL,
    body_hash TEXT,
    moderation_status TEXT DEFAULT 'PENDING',
    flagged_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME,
    FOREIGN KEY(conversation_id) REFERENCES conversations(id)
);

CREATE TABLE IF NOT EXISTS woman_prompts (
    id TEXT PRIMARY KEY,
    woman_id TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prompt_responses (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL,
    prompt_id TEXT NOT NULL,
    responder_user_id TEXT NOT NULL,
    response_body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(match_id) REFERENCES matches(id),
    FOREIGN KEY(prompt_id) REFERENCES woman_prompts(id)
);

CREATE TABLE IF NOT EXISTS call_requests (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL,
    call_type TEXT NOT NULL,
    requested_by_user_id TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS message_receipts (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    delivered_at DATETIME,
    read_at DATETIME,
    FOREIGN KEY(message_id) REFERENCES messages(id)
);

CREATE TABLE IF NOT EXISTS blocks (
    blocker_user_id TEXT NOT NULL,
    blocked_user_id TEXT NOT NULL,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(blocker_user_id, blocked_user_id)
);

CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    reporter_user_id TEXT NOT NULL,
    reported_user_id TEXT NOT NULL,
    context_type TEXT,
    context_id TEXT,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_matches_woman ON matches(woman_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_man ON matches(man_user_id);
`;

async function setup() {
  console.log("MATRIARCH: Provisioning Messaging Sanctuary Schema...");
  const statements = schema.split(';').filter(s => s.trim() !== '');
  for (const statement of statements) {
    try {
      await turso.execute(statement);
    } catch (e) {
      console.error("Statement failed:", statement.substring(0, 50), e);
    }
  }
  console.log("MATRIARCH: Sanctuary Provisioned.");
}

setup();
