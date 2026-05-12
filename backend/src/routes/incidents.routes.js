const express = require("express");
const incidentsController = require("../controllers/incidents.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { Joi, validate } = require("../middleware/validate");

const router = express.Router();

const createIncidentSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(""),
  severity: Joi.string().valid("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO").required(),
  status: Joi.string().valid("open", "acknowledged", "resolved").default("open"),
  assigned_to: Joi.string().uuid().allow(null),
  alert_ids: Joi.array().items(Joi.string().uuid()).default([]),
  log_ids: Joi.array().items(Joi.number().integer()).default([]),
  ai_summary: Joi.string().allow(""),
  timeline: Joi.array().items(Joi.object()).default([]),
});

const updateIncidentSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().allow(""),
  severity: Joi.string().valid("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"),
  status: Joi.string().valid("open", "acknowledged", "resolved"),
  assigned_to: Joi.string().uuid().allow(null),
  alert_ids: Joi.array().items(Joi.string().uuid()),
  log_ids: Joi.array().items(Joi.number().integer()),
  ai_summary: Joi.string().allow(""),
  resolved_at: Joi.date(),
}).min(1);

const timelineSchema = Joi.object({
  type: Joi.string().default("note"),
  note: Joi.string().required(),
  metadata: Joi.object().default({}),
});

const assignSchema = Joi.object({
  assigned_to: Joi.string().uuid().required(),
});

const linkLogsSchema = Joi.object({
  log_ids: Joi.array().items(Joi.number().integer()).min(1).required(),
});

router.use(authMiddleware);

router.get("/", requireRole("viewer", "analyst", "admin"), incidentsController.listIncidents);
router.post("/", requireRole("analyst", "admin"), validate(createIncidentSchema), incidentsController.createIncident);
router.get("/:id", requireRole("viewer", "analyst", "admin"), incidentsController.getIncident);
router.patch("/:id", requireRole("analyst", "admin"), validate(updateIncidentSchema), incidentsController.updateIncident);
router.post("/:id/timeline", requireRole("analyst", "admin"), validate(timelineSchema), incidentsController.addTimelineEntry);
router.post("/:id/assign", requireRole("analyst", "admin"), validate(assignSchema), incidentsController.assignIncident);
router.post("/:id/link-logs", requireRole("analyst", "admin"), validate(linkLogsSchema), incidentsController.linkLogs);
router.post("/:id/close", requireRole("admin"), incidentsController.closeIncident);

module.exports = router;
