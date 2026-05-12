CREATE TABLE IF NOT EXISTS log_sources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(50),
  ip_address  INET,
  api_key     VARCHAR(64) UNIQUE,
  is_active   BOOLEAN DEFAULT true,
  last_seen   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);