const format = require("pg-format");
const db = require("../config/database");

const ALLOWED_SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];

function normalizeSeverity(severity = "INFO") {
  const safeSeverity = String(severity).toUpperCase();
  return ALLOWED_SEVERITIES.includes(safeSeverity) ? safeSeverity : "INFO";
}

async function createLogsBatch(logs) {
  if (!Array.isArray(logs) || logs.length === 0) {
    return [];
  }

  const values = logs.map((log) => [
    log.source_id || null,
    log.source_name || "unknown",
    normalizeSeverity(log.severity),
    log.category || null,
    log.message,
    log.raw_log || null,
    log.ip_src || null,
    log.ip_dst || null,
    log.user_name || null,
    log.host_name || null,
    log.session_id || null,
    JSON.stringify(log.extra_data || {}),
    log.ts || new Date(),
  ]);

  const query = format(
    `INSERT INTO logs
    (source_id, source_name, severity, category, message, raw_log, ip_src, ip_dst, user_name, host_name, session_id, extra_data, ts)
    VALUES %L
    RETURNING id, source_name, severity, category, message, ip_src, ip_dst, user_name, host_name, ts`,
    values,
  );

  const { rows } = await db.query(query);
  return rows;
}

function buildLogsFilterQuery(filters = {}) {
  const clauses = [];
  const values = [];
  let index = 1;

  if (filters.severity?.length) {
    clauses.push(`severity = ANY($${index}::text[])`);
    values.push(filters.severity.map((item) => normalizeSeverity(item)));
    index += 1;
  }

  if (filters.source) {
    clauses.push(`source_name ILIKE $${index}`);
    values.push(`%${filters.source}%`);
    index += 1;
  }

  if (filters.search) {
    clauses.push(`to_tsvector('english', message) @@ plainto_tsquery('english', $${index})`);
    values.push(filters.search);
    index += 1;
  }

  if (filters.ip) {
    clauses.push(`(CAST(ip_src AS TEXT) = $${index} OR CAST(ip_dst AS TEXT) = $${index})`);
    values.push(filters.ip);
    index += 1;
  }

  if (filters.from) {
    clauses.push(`ts >= $${index}`);
    values.push(filters.from);
    index += 1;
  }

  if (filters.to) {
    clauses.push(`ts <= $${index}`);
    values.push(filters.to);
    index += 1;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return { where, values, index };
}

async function listLogs(filters = {}) {
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 100, 1), 500);
  const offset = (page - 1) * limit;

  const { where, values, index } = buildLogsFilterQuery(filters);

  const dataQuery = `
    SELECT id, source_id, source_name, severity, category, message, raw_log, ip_src, ip_dst, user_name, host_name, session_id, extra_data, ts
    FROM logs
    ${where}
    ORDER BY ts DESC
    LIMIT $${index} OFFSET $${index + 1}
  `;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM logs
    ${where}
  `;

  const dataValues = [...values, limit, offset];
  const [dataResult, countResult] = await Promise.all([
    db.query(dataQuery, dataValues),
    db.query(countQuery, values),
  ]);

  return {
    logs: dataResult.rows,
    total: countResult.rows[0]?.total || 0,
    page,
    limit,
  };
}

async function getLogById(id) {
  const query = `
    SELECT id, source_id, source_name, severity, category, message, raw_log, ip_src, ip_dst, user_name, host_name, session_id, extra_data, ts
    FROM logs
    WHERE id = $1
    LIMIT 1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
}

module.exports = {
  normalizeSeverity,
  createLogsBatch,
  listLogs,
  getLogById,
};