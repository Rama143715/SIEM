CREATE TABLE IF NOT EXISTS incidents (
  id           VARCHAR(20) PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  severity     VARCHAR(20) NOT NULL,
  status       VARCHAR(30) DEFAULT 'open',
  assigned_to  UUID REFERENCES users(id),
  alert_ids    UUID[],
  log_ids      BIGINT[],
  ai_summary   TEXT,
  timeline     JSONB DEFAULT '[]',
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  resolved_at  TIMESTAMPTZ
);