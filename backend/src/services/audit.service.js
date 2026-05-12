const db = require("../config/database");

async function writeAuditLog({ userId = null, action, target = null, targetId = null, ipAddress = null, metadata = {} }) {
  const query = `
    INSERT INTO audit_log (user_id, action, target, target_id, ip_address, metadata)
    VALUES ($1, $2, $3, $4, $5, $6::jsonb)
  `;

  await db.query(query, [userId, action, target, targetId, ipAddress, JSON.stringify(metadata)]);
}

module.exports = {
  writeAuditLog,
};