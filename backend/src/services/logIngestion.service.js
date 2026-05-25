const fs = require("node:fs");
const Bull = require("bull");
const maxmind = require("maxmind");
const redis = require("../config/redis");
const env = require("../config/env");
const logModel = require("../models/log.model");
const socketBus = require("../sockets/socketBus");
const alertEngine = require("./alertEngine.service");
const logger = require("../utils/logger");

const LOG_BATCH_SIZE = 50;
const FLUSH_INTERVAL_MS = 100;
const ingestBuffer = [];
let flushTimer = null;
let geoReader = null;

const ingestionQueue = new Bull("log-ingestion", env.REDIS_URL, {
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});

function ensureGeoReader() {
  if (geoReader || !env.GEOIP_DB_PATH) {
    return geoReader;
  }

  if (!fs.existsSync(env.GEOIP_DB_PATH)) {
    return null;
  }

  geoReader = maxmind.openSync(env.GEOIP_DB_PATH);
  return geoReader;
}

function mapSeverity(rawSeverity) {
  return logModel.normalizeSeverity(rawSeverity);
}

function enrichGeo(log) {
  const reader = ensureGeoReader();
  if (!reader || !log.ip_src) {
    return log;
  }

  try {
    const geo = reader.get(log.ip_src);
    return {
      ...log,
      extra_data: {
        ...(log.extra_data || {}),
        geo,
      },
    };
  } catch {
    return log;
  }
}

function normalizeLog(log = {}, defaultSource = "api") {
  const normalized = {
    source_id: log.source_id || null,
    source_name: log.source_name || defaultSource,
    severity: mapSeverity(log.severity),
    category: log.category || "general",
    message: String(log.message || log.raw_log || ""),
    raw_log: log.raw_log || log.raw || null,
    ip_src: log.ip_src || null,
    ip_dst: log.ip_dst || null,
    user_name: log.user_name || null,
    host_name: log.host_name || null,
    session_id: log.session_id || null,
    extra_data: log.extra_data || {},
    ts: log.ts || new Date(),
  };

  return enrichGeo(normalized);
}

async function updateDashboardStats(insertedLogs = []) {
  const batchSize = insertedLogs.length;
  const current = await redis.incrby("siem:stats:eps", batchSize);
  await redis.expire("siem:stats:eps", 2);

  const cached = await redis.get("siem:stats:dashboard");
  if (cached) {
    const stats = JSON.parse(cached);
    stats.eventsToday = Number(stats.eventsToday || 0) + batchSize;
    stats.eps = current;
    await redis.setex("siem:stats:dashboard", 5, JSON.stringify(stats));
    socketBus.emitStatsUpdate(stats);
  }

  const hourBucket = new Date().toISOString().slice(0, 13);
  const threatsInBatch = insertedLogs.filter((log) => ["CRITICAL", "HIGH"].includes(String(log.severity || "").toUpperCase())).length;
  const threatsHourly = await redis.get("siem:stats:threats:hour");
  const parsed = threatsHourly ? JSON.parse(threatsHourly) : {};
  parsed[hourBucket] = Number(parsed[hourBucket] || 0) + threatsInBatch;
  await redis.setex("siem:stats:threats:hour", 60, JSON.stringify(parsed));
}

async function flushBuffer() {
  if (!ingestBuffer.length) {
    return;
  }

  const batch = ingestBuffer.splice(0, LOG_BATCH_SIZE);

  try {
    const insertedLogs = await logModel.createLogsBatch(batch);
    if (insertedLogs.length > 0) {
      socketBus.emitNewLogs(insertedLogs);
      await alertEngine.evaluateLogs(insertedLogs);
      await updateDashboardStats(insertedLogs);
    }
  } catch (error) {
    logger.error({ message: "Log batch insert failed", error: error.message });
  }
}

function scheduleFlush() {
  if (flushTimer) {
    return;
  }

  flushTimer = setInterval(flushBuffer, FLUSH_INTERVAL_MS);
}

async function ingest(log, defaultSource = "api") {
  const normalized = normalizeLog(log, defaultSource);

  if (!normalized.message) {
    return;
  }

  ingestBuffer.push(normalized);

  if (ingestBuffer.length >= LOG_BATCH_SIZE) {
    await flushBuffer();
  }
}

async function ingestBulk(logs = [], defaultSource = "api") {
  for (const log of logs) {
    await ingest(log, defaultSource);
  }
}

async function queueIngestion(payload) {
  await ingestionQueue.add(payload, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 250,
    },
  });
}

async function start() {
  scheduleFlush();

  ingestionQueue.process(async (job) => {
    const { sourceId, rawLog, receivedAt } = job.data;
    const sourceName = rawLog?.source_name || sourceId || "queue";

    await ingest({
      source_id: sourceId || null,
      source_name: sourceName,
      message: rawLog.message || rawLog.raw || "",
      raw_log: rawLog.raw || rawLog.raw_log || null,
      severity: rawLog.severity || "INFO",
      category: rawLog.category || "general",
      ip_src: rawLog.ip_src || null,
      ip_dst: rawLog.ip_dst || null,
      user_name: rawLog.user_name || null,
      host_name: rawLog.host_name || null,
      session_id: rawLog.session_id || null,
      extra_data: {
        ...(rawLog.extra_data || {}),
        receivedAt,
      },
      ts: rawLog.ts || new Date(),
    }, sourceName);
  });
}

module.exports = {
  start,
  ingest,
  ingestBulk,
  queueIngestion,
  flushBuffer,
};
