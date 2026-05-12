const db = require("../config/database");

async function listRules() {
  const { rows } = await db.query("SELECT * FROM rules ORDER BY created_at DESC");
  return rows;
}

async function listEnabledRules() {
  const { rows } = await db.query("SELECT * FROM rules WHERE is_enabled = true ORDER BY created_at DESC");
  return rows;
}

async function createRule(payload, createdBy) {
  const query = `
    INSERT INTO rules (name, description, severity, type, conditions, actions, is_enabled, mitre_tactic, mitre_tech, created_by)
    VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,COALESCE($7, true),$8,$9,$10)
    RETURNING *
  `;

  const values = [
    payload.name,
    payload.description || null,
    payload.severity,
    payload.type,
    JSON.stringify(payload.conditions || {}),
    JSON.stringify(payload.actions || []),
    payload.is_enabled !== false,
    payload.mitre_tactic || null,
    payload.mitre_tech || null,
    createdBy,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
}

async function getRuleById(id) {
  const { rows } = await db.query("SELECT * FROM rules WHERE id = $1 LIMIT 1", [id]);
  return rows[0] || null;
}

async function updateRule(id, payload = {}) {
  const fields = [];
  const values = [];
  let idx = 1;

  const map = {
    name: "name",
    description: "description",
    severity: "severity",
    type: "type",
    conditions: "conditions",
    actions: "actions",
    is_enabled: "is_enabled",
    mitre_tactic: "mitre_tactic",
    mitre_tech: "mitre_tech",
  };

  for (const [key, column] of Object.entries(map)) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const isJson = key === "conditions" || key === "actions";
      fields.push(`${column} = $${idx}${isJson ? "::jsonb" : ""}`);
      values.push(isJson ? JSON.stringify(payload[key]) : payload[key]);
      idx += 1;
    }
  }

  if (!fields.length) {
    return getRuleById(id);
  }

  values.push(id);
  const query = `
    UPDATE rules
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = $${idx}
    RETURNING *
  `;

  const { rows } = await db.query(query, values);
  return rows[0] || null;
}

async function deleteRule(id) {
  await db.query("DELETE FROM rules WHERE id = $1", [id]);
}

module.exports = {
  listRules,
  listEnabledRules,
  createRule,
  getRuleById,
  updateRule,
  deleteRule,
};