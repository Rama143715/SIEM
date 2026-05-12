const incidentModel = require("../models/incident.model");
const { writeAuditLog } = require("../services/audit.service");

async function listIncidents(request, response, next) {
  try {
    const incidents = await incidentModel.listIncidents();
    return response.json({ incidents });
  } catch (error) {
    return next(error);
  }
}

async function createIncident(request, response, next) {
  try {
    const incident = await incidentModel.createIncident(request.body, request.user.id);

    await writeAuditLog({
      userId: request.user.id,
      action: "incident.create",
      target: "incident",
      targetId: incident.id,
      ipAddress: request.ip,
      metadata: { severity: incident.severity },
    });

    return response.status(201).json({ incident });
  } catch (error) {
    return next(error);
  }
}

async function getIncident(request, response, next) {
  try {
    const incident = await incidentModel.getIncidentById(request.params.id);
    if (!incident) {
      return response.status(404).json({ error: "Incident not found." });
    }

    return response.json({ incident });
  } catch (error) {
    return next(error);
  }
}

async function updateIncident(request, response, next) {
  try {
    const incident = await incidentModel.updateIncident(request.params.id, request.body);
    if (!incident) {
      return response.status(404).json({ error: "Incident not found." });
    }

    await writeAuditLog({
      userId: request.user.id,
      action: "incident.update",
      target: "incident",
      targetId: incident.id,
      ipAddress: request.ip,
      metadata: request.body,
    });

    return response.json({ incident });
  } catch (error) {
    return next(error);
  }
}

async function addTimelineEntry(request, response, next) {
  try {
    const entry = {
      ...request.body,
      at: new Date().toISOString(),
      by: request.user.id,
    };

    const incident = await incidentModel.addTimelineEntry(request.params.id, entry);

    if (!incident) {
      return response.status(404).json({ error: "Incident not found." });
    }

    await writeAuditLog({
      userId: request.user.id,
      action: "incident.timeline.add",
      target: "incident",
      targetId: incident.id,
      ipAddress: request.ip,
      metadata: entry,
    });

    return response.json({ incident });
  } catch (error) {
    return next(error);
  }
}

async function assignIncident(request, response, next) {
  try {
    const incident = await incidentModel.updateIncident(request.params.id, {
      assigned_to: request.body.assigned_to,
    });

    if (!incident) {
      return response.status(404).json({ error: "Incident not found." });
    }

    return response.json({ incident });
  } catch (error) {
    return next(error);
  }
}

async function linkLogs(request, response, next) {
  try {
    const incident = await incidentModel.getIncidentById(request.params.id);
    if (!incident) {
      return response.status(404).json({ error: "Incident not found." });
    }

    const merged = Array.from(new Set([...(incident.log_ids || []), ...(request.body.log_ids || [])]));
    const updated = await incidentModel.updateIncident(request.params.id, { log_ids: merged });
    return response.json({ incident: updated });
  } catch (error) {
    return next(error);
  }
}

async function closeIncident(request, response, next) {
  try {
    const incident = await incidentModel.updateIncident(request.params.id, {
      status: "resolved",
      resolved_at: new Date(),
    });

    if (!incident) {
      return response.status(404).json({ error: "Incident not found." });
    }

    await writeAuditLog({
      userId: request.user.id,
      action: "incident.close",
      target: "incident",
      targetId: incident.id,
      ipAddress: request.ip,
      metadata: {},
    });

    return response.json({ incident });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listIncidents,
  createIncident,
  getIncident,
  updateIncident,
  addTimelineEntry,
  assignIncident,
  linkLogs,
  closeIncident,
};