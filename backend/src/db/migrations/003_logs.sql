CREATE TABLE IF NOT EXISTS logs (
  id          BIGSERIAL,
  source_id   UUID REFERENCES log_sources(id),
  source_name VARCHAR(100),
  severity    VARCHAR(20) NOT NULL,
  category    VARCHAR(50),
  message     TEXT NOT NULL,
  raw_log     TEXT,
  ip_src      INET,
  ip_dst      INET,
  user_name   VARCHAR(100),
  host_name   VARCHAR(100),
  session_id  VARCHAR(64),
  extra_data  JSONB DEFAULT '{}',
  ts          TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, ts)
) PARTITION BY RANGE (ts);

CREATE TABLE IF NOT EXISTS logs_default PARTITION OF logs DEFAULT;

CREATE INDEX IF NOT EXISTS idx_logs_severity ON logs(severity);
CREATE INDEX IF NOT EXISTS idx_logs_ts ON logs(ts DESC);
CREATE INDEX IF NOT EXISTS idx_logs_source ON logs(source_name);
CREATE INDEX IF NOT EXISTS idx_logs_ip_src ON logs(ip_src);
CREATE INDEX IF NOT EXISTS idx_logs_message_fts ON logs USING gin(to_tsvector('english', message));