const crypto = require("node:crypto");
const db = require("../config/database");

function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(String(apiKey)).digest("hex");
}

async function getSourceByApiKey(apiKey) {
  const hash = hashApiKey(apiKey);
  const query = `
    SELECT id, name, type, ip_address, is_active, created_at, last_seen
    FROM log_sources
    WHERE api_key = $1 AND is_active = true
    LIMIT 1
  `;

  const { rows } = await db.query(query, [hash]);
  return rows[0] || null;
}

async function touchSource(id) {
  await db.query("UPDATE log_sources SET last_seen = NOW() WHERE id = $1", [id]);
}

async function createSource(payload) {
  const apiKey = payload.api_key ? hashApiKey(payload.api_key) : null;
  const query = `
    INSERT INTO log_sources (name, type, ip_address, api_key, is_active)
    VALUES ($1,$2,$3,$4,COALESCE($5,true))
    RETURNING id, name, type, ip_address, is_active, last_seen, created_at
  `;

  const values = [payload.name, payload.type || null, payload.ip_address || null, apiKey, payload.is_active !== false];
  const { rows } = await db.query(query, values);
  return rows[0];
}

module.exports = {
  hashApiKey,
  getSourceByApiKey,
  touchSource,
  createSource,
};