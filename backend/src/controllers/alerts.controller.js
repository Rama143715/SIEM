const alertModel = require("../models/alert.model");
const { writeAuditLog } = require("../services/audit.service");

async function listAlerts(request, response, next) {
  try {
    const alerts = await alertModel.listAlerts({
      status: request.query.status,
      severity: request.query.severity,
    });

    return response.json({ alerts });
  } catch (error) {
    return next(error);
  }
}

async function createAlert(request, response, next) {
  try {
    const alert = await alertModel.createAlert(request.body);

    await writeAuditLog({
      userId: request.user.id,
      action: "alert.create",
      target: "alert",
      targetId: alert.id,
      ipAddress: request.ip,
      metadata: { severity: alert.severity },
    });

    return response.status(201).json({ alert });
  } catch (error) {
    return next(error);
  }
}

async function getAlert(request, response, next) {
  try {
    const alert = await alertModel.getAlertById(request.params.id);
    if (!alert) {
      return response.status(404).json({ error: "Alert not found." });
    }

    return response.json({ alert });
  } catch (error) {
    return next(error);
  }
}

async function updateAlert(request, response, next) {
  try {
    const alert = await alertModel.updateAlert(request.params.id, request.body);
    if (!alert) {
      return response.status(404).json({ error: "Alert not found." });
    }

    await writeAuditLog({
      userId: request.user.id,
      action: "alert.update",
      target: "alert",
      targetId: alert.id,
      ipAddress: request.ip,
      metadata: request.body,
    });

    return response.json({ alert });
  } catch (error) {
    return next(error);
  }
}

async function deleteAlert(request, response, next) {
  try {
    await alertModel.deleteAlert(request.params.id);

    await writeAuditLog({
      userId: request.user.id,
      action: "alert.delete",
      target: "alert",
      targetId: request.params.id,
      ipAddress: request.ip,
      metadata: {},
    });

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function acknowledgeAlert(request, response, next) {
  try {
    const alert = await alertModel.updateAlert(request.params.id, {
      status: "acknowledged",
      assigned_to: request.user.id,
    });

    if (!alert) {
      return response.status(404).json({ error: "Alert not found." });
    }

    await writeAuditLog({
      userId: request.user.id,
      action: "alert.acknowledge",
      target: "alert",
      targetId: alert.id,
      ipAddress: request.ip,
      metadata: {},
    });

    return response.json({ alert });
  } catch (error) {
    return next(error);
  }
}

async function resolveAlert(request, response, next) {
  try {
    const alert = await alertModel.updateAlert(request.params.id, {
      status: "resolved",
      resolved_by: request.user.id,
      resolved_at: new Date(),
    });

    if (!alert) {
      return response.status(404).json({ error: "Alert not found." });
    }

    await writeAuditLog({
      userId: request.user.id,
      action: "alert.resolve",
      target: "alert",
      targetId: alert.id,
      ipAddress: request.ip,
      metadata: {},
    });

    return response.json({ alert });
  } catch (error) {
    return next(error);
  }
}

async function bulkAcknowledge(request, response, next) {
  try {
    const ids = request.body.ids || [];
    const alerts = await alertModel.bulkAcknowledge(ids, request.user.id);

    await writeAuditLog({
      userId: request.user.id,
      action: "alert.bulk_acknowledge",
      target: "alert",
      targetId: null,
      ipAddress: request.ip,
      metadata: { count: alerts.length },
    });

    return response.json({ alerts });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listAlerts,
  createAlert,
  getAlert,
  updateAlert,
  deleteAlert,
  acknowledgeAlert,
  resolveAlert,
  bulkAcknowledge,
};