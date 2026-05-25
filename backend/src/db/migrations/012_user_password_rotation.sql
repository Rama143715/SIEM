ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ DEFAULT NOW();

UPDATE users
SET password_changed_at = COALESCE(password_changed_at, updated_at, created_at, NOW());
