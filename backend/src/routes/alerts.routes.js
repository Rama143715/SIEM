const express = require("express");
const alertsController = require("../controllers/alerts.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { Joi, validate } = require("../middleware/validate");

const router = express.Router();

const createAlertSchema = Joi.object({
  title: Joi.string().max(255).required(),
  severity: Joi.string().valid("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO").required(),
  status: Joi.string().valid("open", "acknowledged", "resolved").default("open"),
  source_name: Joi.string().allow(""),
  detail: Joi.string().allow(""),
  rule_id: Joi.string().uuid().allow(null),
  log_ids: Joi.array().items(Joi.number().integer()).default([]),
  occurrence: Joi.number().integer().min(1).default(1),
  assigned_to: Joi.string().uuid().allow(null),
});

const updateAlertSchema = Joi.object({
  status: Joi.string().valid("open", "acknowledged", "resolved"),
  assigned_to: Joi.string().uuid().allow(null),
  title: Joi.string().max(255),
  detail: Joi.string().allow(""),
  severity: Joi.string().valid("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"),
  occurrence: Joi.number().integer().min(1),
}).min(1);

const bulkAcknowledgeSchema = Joi.object({
  ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
});

router.use(authMiddleware);
router.get("/", requireRole("viewer", "analyst", "admin"), alertsController.listAlerts);
router.post("/", requireRole("analyst", "admin"), validate(createAlertSchema), alertsController.createAlert);
router.get("/:id", requireRole("viewer", "analyst", "admin"), alertsController.getAlert);
router.patch("/:id", requireRole("analyst", "admin"), validate(updateAlertSchema), alertsController.updateAlert);
router.delete("/:id", requireRole("admin"), alertsController.deleteAlert);
router.post("/:id/acknowledge", requireRole("analyst", "admin"), alertsController.acknowledgeAlert);
router.post("/:id/resolve", requireRole("admin"), alertsController.resolveAlert);
router.post("/bulk-acknowledge", requireRole("analyst", "admin"), validate(bulkAcknowledgeSchema), alertsController.bulkAcknowledge);

module.exports = router;
