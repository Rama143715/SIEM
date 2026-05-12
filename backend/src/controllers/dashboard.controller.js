const db = require("../config/database");
const redis = require("../config/redis");

async function getStats(request, response, next) {
  try {
    const cached = await redis.get("siem:stats:dashboard");
    if (cached) {
      return response.json(JSON.parse(cached));
    }

    const query = `
      SELECT
        COUNT(*) FILTER (WHERE severity = 'CRITICAL')::int AS critical,
        COUNT(*) FILTER (WHERE severity = 'HIGH')::int AS high,
        COUNT(*)::int AS events_today
      FROM logs
      WHERE ts >= NOW() - INTERVAL '24 hours'
    `;

    const openAlertsQuery = `SELECT COUNT(*)::int AS open_alerts FROM alerts WHERE status != 'resolved'`;
    const blockedQuery = `SELECT COUNT(*)::int AS blocked FROM alerts WHERE status = 'resolved'`;

    const [[events], [openAlerts], [blocked]] = await Promise.all([
      db.query(query).then((res) => res.rows),
      db.query(openAlertsQuery).then((res) => res.rows),
      db.query(blockedQuery).then((res) => res.rows),
    ]);

    const eps = Number(await redis.get("siem:stats:eps") || 0);
    const threatsHourRaw = await redis.get("siem:stats:threats:hour");

    const payload = {
      critical: events.critical || 0,
      high: events.high || 0,
      openAlerts: openAlerts.open_alerts || 0,
      blocked: blocked.blocked || 0,
      eventsToday: events.events_today || 0,
      eps,
      threatsHour: threatsHourRaw ? JSON.parse(threatsHourRaw) : {},
    };

    await redis.setex("siem:stats:dashboard", 5, JSON.stringify(payload));
    return response.json(payload);
  } catch (error) {
    return next(error);
  }
}

async function getTimeline(request, response, next) {
  try {
    const query = `
      SELECT date_trunc('hour', ts) AS hour_bucket, COUNT(*)::int AS count
      FROM logs
      WHERE ts >= NOW() - INTERVAL '24 hours'
      GROUP BY hour_bucket
      ORDER BY hour_bucket ASC
    `;

    const { rows } = await db.query(query);
    return response.json({ timeline: rows });
  } catch (error) {
    return next(error);
  }
}

async function getTopSources(request, response, next) {
  try {
    const query = `
      SELECT source_name, COUNT(*)::int AS count
      FROM logs
      WHERE ts >= NOW() - INTERVAL '24 hours'
      GROUP BY source_name
      ORDER BY count DESC
      LIMIT 10
    `;

    const { rows } = await db.query(query);
    return response.json({ sources: rows });
  } catch (error) {
    return next(error);
  }
}

async function getSeverityDistribution(request, response, next) {
  try {
    const query = `
      SELECT severity, COUNT(*)::int AS count
      FROM logs
      WHERE ts >= NOW() - INTERVAL '24 hours'
      GROUP BY severity
      ORDER BY count DESC
    `;

    const { rows } = await db.query(query);
    return response.json({ severity: rows });
  } catch (error) {
    return next(error);
  }
}

async function getAssets(request, response, next) {
  try {
    const query = `
      SELECT source_name AS asset,
             MAX(ts) AS last_event,
             COUNT(*) FILTER (WHERE severity IN ('CRITICAL', 'HIGH'))::int AS high_events,
             COUNT(*)::int AS total_events
      FROM logs
      GROUP BY source_name
      ORDER BY total_events DESC
      LIMIT 25
    `;

    const { rows } = await db.query(query);
    const assets = rows.map((row) => ({
      ...row,
      status: row.high_events > 5 ? "degraded" : "healthy",
    }));

    return response.json({ assets });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getStats,
  getTimeline,
  getTopSources,
  getSeverityDistribution,
  getAssets,
};
