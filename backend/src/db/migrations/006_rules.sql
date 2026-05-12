CREATE TABLE IF NOT EXISTS rules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL UNIQUE,
  description  TEXT,
  severity     VARCHAR(20) NOT NULL,
  type         VARCHAR(30),
  conditions   JSONB NOT NULL,
  actions      JSONB DEFAULT '[]',
  is_enabled   BOOLEAN DEFAULT true,
  mitre_tactic VARCHAR(100),
  mitre_tech   VARCHAR(100),
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);