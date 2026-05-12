CREATE TABLE IF NOT EXISTS ai_analyses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  analysis_type VARCHAR(50),
  input_data    TEXT,
  output_data   TEXT,
  tokens_used   INTEGER,
  related_logs  BIGINT[],
  incident_id   VARCHAR(20) REFERENCES incidents(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);