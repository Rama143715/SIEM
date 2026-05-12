CREATE TABLE IF NOT EXISTS audit_log (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID REFERENCES users(id),
  action     VARCHAR(100),
  target     VARCHAR(100),
  target_id  VARCHAR(100),
  ip_address INET,
  metadata   JSONB DEFAULT '{}',
  ts         TIMESTAMPTZ DEFAULT NOW()
);