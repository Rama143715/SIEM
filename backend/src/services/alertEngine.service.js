const crypto = require("node:crypto");
const redis = require("../config/redis");
const ruleModel = require("../models/rule.model");
const alertModel = require("../models/alert.model");
const socketBus = require("../sockets/socketBus");
const notifier = require("./notifier.service");
const { detectSimpleCorrelation } = require("./correlation.service");
const logger = require("../utils/logger");

let enabledRules = [];
let reloader = null;
const recentLogs = [];
const MAX_RECENT_LOGS = 5000;

function toString(value) {
  return String(value || "");
}

function matchesField(fieldValue, operator, expected) {
  const actual = toString(fieldValue).toLowerCase();
  const exp = toString(expected).toLowerCase();

  if (operator === "equals") {
    return actual === exp;
  }

  if (operator === "regex") {
    return new RegExp(expected, "i").test(toString(fieldValue));
  }

  return actual.includes(exp);
}

async function evaluatePatternRule(rule, log) {
  const conditions = rule.conditions || {};
  const field = conditions.field || "message";
  const operator = conditions.operator || "contains";
  const value = conditions.value || conditions.pattern || "";

  return matchesField(log[field], operator, value);
}

async function evaluateRegexRule(rule, log) {
  const pattern = rule.conditions?.pattern || rule.conditions?.value;
  if (!pattern) {
    return false;
  }

  return new RegExp(pattern, "i").test(toString(log.message));
}

async function evaluateFieldMatchRule(rule, log) {
  const { field, operator = "contains", value } = rule.conditions || {};
  if (!field) {
    return false;
  }

  return matchesField(log[field], operator, value);
}

async function evaluateThresholdRule(rule, log) {
  const conditions = rule.conditions || {};
  const field = conditions.field || "message";
  const operator = conditions.operator || "contains";
  const value = conditions.value || "";
  const threshold = Number(conditions.threshold || 1);
  const timeWindowSeconds = Number(conditions.timeWindowSeconds || 60);

  if (!matchesField(log[field], operator, value)) {
    return false;
  }

  const discriminator = toString(log.ip_src || log.user_name || log.source_name || "global");
  const key = `threshold:${rule.id}:${discriminator}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, timeWindowSeconds);
  }

  return count >= threshold;
}

async function evaluateCorrelationRule(rule, log) {
  const detection = detectSimpleCorrelation(log, recentLogs);

  if (!detection.triggered) {
    return false;
  }

  return true;
}

function buildAlertPayload(rule, log) {
  return {
    title: `${rule.name} triggered`,
    severity: rule.severity,
    status: "open",
    source_name: log.source_name,
    detail: `${rule.description || "Detection rule triggered"}. Message: ${log.message}`,
    rule_id: rule.id,
    log_ids: [log.id],
    occurrence: 1,
  };
}

async function runActions(actions = [], alert, log) {
  for (const action of actions) {
    if (!action || !action.type) {
      continue;
    }

    if (action.type === "webhook" && action.url) {
      await notifier.sendWebhook(action.url, { alert, log });
    }

    if (action.type === "email" && action.email) {
      await notifier.sendEmail(action.email, `SIEM Alert: ${alert.title}`, alert.detail || "");
    }
  }
}

async function triggerAlert(rule, log) {
  const hash = crypto.createHash("sha256").update(`${rule.id}:${log.source_name}:${log.message}`).digest("hex");
  const dedupKey = `alert:dedup:${rule.id}:${hash}`;
  const existingAlertId = await redis.get(dedupKey);

  if (existingAlertId) {
    const alert = await alertModel.incrementAlertOccurrence(existingAlertId);
    if (alert) {
      socketBus.emitNewAlert(alert);
    }
    return alert;
  }

  const alertPayload = buildAlertPayload(rule, log);
  const alert = await alertModel.createAlert(alertPayload);
  await redis.setex(dedupKey, 300, alert.id);

  await runActions(rule.actions || [], alert, log);
  socketBus.emitNewAlert(alert);
  return alert;
}

async function evaluateRule(rule, log) {
  const type = String(rule.type || "pattern").toLowerCase();

  if (type === "pattern") {
    return evaluatePatternRule(rule, log);
  }

  if (type === "threshold") {
    return evaluateThresholdRule(rule, log);
  }

  if (type === "regex") {
    return evaluateRegexRule(rule, log);
  }

  if (type === "field_match") {
    return evaluateFieldMatchRule(rule, log);
  }

  if (type === "correlation") {
    return evaluateCorrelationRule(rule, log);
  }

  return false;
}

async function evaluateLog(log) {
  recentLogs.unshift(log);
  if (recentLogs.length > MAX_RECENT_LOGS) {
    recentLogs.length = MAX_RECENT_LOGS;
  }

  for (const rule of enabledRules) {
    try {
      const matched = await evaluateRule(rule, log);
      if (matched) {
        await triggerAlert(rule, log);
      }
    } catch (error) {
      logger.error({ message: "Rule evaluation failed", ruleId: rule.id, error: error.message });
    }
  }
}

async function evaluateLogs(logs = []) {
  for (const log of logs) {
    await evaluateLog(log);
  }
}

async function reloadRules() {
  enabledRules = await ruleModel.listEnabledRules();
}

async function start() {
  await reloadRules();

  if (!reloader) {
    reloader = setInterval(async () => {
      try {
        await reloadRules();
      } catch (error) {
        logger.error({ message: "Rule reload failed", error: error.message });
      }
    }, 60000);
  }
}

module.exports = {
  start,
  evaluateLogs,
  reloadRules,
};