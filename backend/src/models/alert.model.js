const db = require("../config/database");

async function createAlert(payload) {
  const query = `
    INSERT INTO alerts (title, severity, status, source_name, detail, rule_id, log_ids, occurrence, assigned_to)
    VALUES ($1, $2, COALESCE($3, 'open'), $4, $5, $6, $7, COALESCE($8, 1), $9)
    RETURNING *
  `;

  const values = [
    payload.title,
    payload.severity,
    payload.status || "open",
    payload.source_name || null,
    payload.detail || null,
    payload.rule_id || null,
    payload.log_ids || [],
    payload.occurrence || 1,
    payload.assigned_to || null,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
}

async function listAlerts(filters = {}) {
  const clauses = [];
  const values = [];
  let idx = 1;

  if (filters.status) {
    clauses.push(`status = $${idx}`);
    values.push(filters.status);
    idx += 1;
  }

  if (filters.severity) {
    clauses.push(`severity = $${idx}`);
    values.push(filters.severity);
    idx += 1;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const query = `
    SELECT *
    FROM alerts
    ${where}
    ORDER BY created_at DESC
    LIMIT 500
  `;

  const { rows } = await db.query(query, values);
  return rows;
}

async function getAlertById(id) {
  const { rows } = await db.query("SELECT * FROM alerts WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

async function updateAlert(id, updates = {}) {
  const fields = [];
  const values = [];
  let idx = 1;

  const allowed = ["status", "assigned_to", "title", "detail", "severity", "occurrence"];

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      fields.push(`${key} = $${idx}`);
      values.push(updates[key]);
      idx += 1;
    }
  }

  if (fields.length === 0) {
    return getAlertById(id);
  }

  values.push(id);
  const query = `
    UPDATE alerts
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = $${idx}
    RETURNING *
  `;

  const { rows } = await db.query(query, values);
  return rows[0] || null;
}

async function deleteAlert(id) {
  await db.query("DELETE FROM alerts WHERE id = $1", [id]);
}

async function bulkAcknowledge(ids = [], userId = null) {
  if (!ids.length) {
    return [];
  }

  const query = `
    UPDATE alerts
    SET status = 'acknowledged', assigned_to = COALESCE(assigned_to, $2), updated_at = NOW()
    WHERE id = ANY($1::uuid[])
    RETURNING *
  `;

  const { rows } = await db.query(query, [ids, userId]);
  return rows;
}

async function incrementAlertOccurrence(id) {
  const query = `
    UPDATE alerts
    SET occurrence = occurrence + 1, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
}

module.exports = {
  createAlert,
  listAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
  bulkAcknowledge,
  incrementAlertOccurrence,
};