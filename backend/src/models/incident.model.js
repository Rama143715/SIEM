const db = require("../config/database");

async function getNextIncidentId(client = db) {
  const query = `
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 5) AS INTEGER)), 0) + 1 AS next_id
    FROM incidents
  `;

  const { rows } = await client.query(query);
  const value = String(rows[0].next_id).padStart(3, "0");
  return `INC-${value}`;
}

async function createIncident(payload, creatorId) {
  return db.withTransaction(async (client) => {
    const id = await getNextIncidentId(client);
    const query = `
      INSERT INTO incidents (id, title, description, severity, status, assigned_to, alert_ids, log_ids, ai_summary, timeline, created_by)
      VALUES ($1,$2,$3,$4,COALESCE($5, 'open'),$6,$7,$8,$9,COALESCE($10, '[]'::jsonb),$11)
      RETURNING *
    `;

    const values = [
      id,
      payload.title,
      payload.description || null,
      payload.severity,
      payload.status || "open",
      payload.assigned_to || null,
      payload.alert_ids || [],
      payload.log_ids || [],
      payload.ai_summary || null,
      JSON.stringify(payload.timeline || []),
      creatorId,
    ];

    const { rows } = await client.query(query, values);
    return rows[0];
  });
}

async function listIncidents() {
  const { rows } = await db.query("SELECT * FROM incidents ORDER BY created_at DESC LIMIT 500");
  return rows;
}

async function getIncidentById(id) {
  const { rows } = await db.query("SELECT * FROM incidents WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

async function updateIncident(id, updates = {}) {
  const fields = [];
  const values = [];
  let idx = 1;

  const allowed = ["title", "description", "severity", "status", "assigned_to", "alert_ids", "log_ids", "ai_summary", "resolved_at"];

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      fields.push(`${key} = $${idx}`);
      values.push(updates[key]);
      idx += 1;
    }
  }

  if (!fields.length) {
    return getIncidentById(id);
  }

  values.push(id);
  const query = `
    UPDATE incidents
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = $${idx}
    RETURNING *
  `;

  const { rows } = await db.query(query, values);
  return rows[0] || null;
}

async function addTimelineEntry(id, entry) {
  const query = `
    UPDATE incidents
    SET timeline = timeline || $2::jsonb, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const payload = JSON.stringify([entry]);
  const { rows } = await db.query(query, [id, payload]);
  return rows[0] || null;
}

module.exports = {
  createIncident,
  listIncidents,
  getIncidentById,
  updateIncident,
  addTimelineEntry,
};