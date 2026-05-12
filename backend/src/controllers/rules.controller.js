const ruleModel = require("../models/rule.model");
const { writeAuditLog } = require("../services/audit.service");
const alertEngine = require("../services/alertEngine.service");

async function listRules(request, response, next) {
  try {
    const rules = await ruleModel.listRules();
    return response.json({ rules });
  } catch (error) {
    return next(error);
  }
}

async function createRule(request, response, next) {
  try {
    const rule = await ruleModel.createRule(request.body, request.user.id);
    await alertEngine.reloadRules();

    await writeAuditLog({
      userId: request.user.id,
      action: "rule.create",
      target: "rule",
      targetId: rule.id,
      ipAddress: request.ip,
      metadata: { name: rule.name },
    });

    return response.status(201).json({ rule });
  } catch (error) {
    return next(error);
  }
}

async function getRule(request, response, next) {
  try {
    const rule = await ruleModel.getRuleById(request.params.id);
    if (!rule) {
      return response.status(404).json({ error: "Rule not found." });
    }

    return response.json({ rule });
  } catch (error) {
    return next(error);
  }
}

async function updateRule(request, response, next) {
  try {
    const rule = await ruleModel.updateRule(request.params.id, request.body);
    if (!rule) {
      return response.status(404).json({ error: "Rule not found." });
    }

    await alertEngine.reloadRules();

    await writeAuditLog({
      userId: request.user.id,
      action: "rule.update",
      target: "rule",
      targetId: rule.id,
      ipAddress: request.ip,
      metadata: request.body,
    });

    return response.json({ rule });
  } catch (error) {
    return next(error);
  }
}

async function deleteRule(request, response, next) {
  try {
    await ruleModel.deleteRule(request.params.id);
    await alertEngine.reloadRules();

    await writeAuditLog({
      userId: request.user.id,
      action: "rule.delete",
      target: "rule",
      targetId: request.params.id,
      ipAddress: request.ip,
      metadata: {},
    });

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function toggleRule(request, response, next) {
  try {
    const rule = await ruleModel.getRuleById(request.params.id);
    if (!rule) {
      return response.status(404).json({ error: "Rule not found." });
    }

    const updated = await ruleModel.updateRule(request.params.id, {
      is_enabled: !rule.is_enabled,
    });

    await alertEngine.reloadRules();
    return response.json({ rule: updated });
  } catch (error) {
    return next(error);
  }
}

async function testRule(request, response, next) {
  try {
    const { rule, sample_logs } = request.body;

    if (!rule || !Array.isArray(sample_logs)) {
      return response.status(400).json({ error: "rule and sample_logs[] are required." });
    }

    const pattern = String(rule?.conditions?.value || rule?.conditions?.pattern || "").toLowerCase();

    const matches = sample_logs.filter((log) => {
      const message = String(log.message || "").toLowerCase();
      return pattern && message.includes(pattern);
    });

    return response.json({
      triggered: matches.length > 0,
      matched_count: matches.length,
      matched_logs: matches,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listRules,
  createRule,
  getRule,
  updateRule,
  deleteRule,
  toggleRule,
  testRule,
};