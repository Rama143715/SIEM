const express = require("express");
const rulesController = require("../controllers/rules.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { Joi, validate } = require("../middleware/validate");

const router = express.Router();

const ruleSchema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().allow(""),
  severity: Joi.string().valid("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO").required(),
  type: Joi.string().valid("pattern", "threshold", "regex", "field_match", "correlation").required(),
  conditions: Joi.object().required(),
  actions: Joi.array().items(Joi.object()).default([]),
  is_enabled: Joi.boolean().default(true),
  mitre_tactic: Joi.string().allow(""),
  mitre_tech: Joi.string().allow(""),
});

const updateRuleSchema = Joi.object({
  name: Joi.string().max(255),
  description: Joi.string().allow(""),
  severity: Joi.string().valid("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"),
  type: Joi.string().valid("pattern", "threshold", "regex", "field_match", "correlation"),
  conditions: Joi.object(),
  actions: Joi.array().items(Joi.object()),
  is_enabled: Joi.boolean(),
  mitre_tactic: Joi.string().allow(""),
  mitre_tech: Joi.string().allow(""),
}).min(1);

const testRuleSchema = Joi.object({
  rule: Joi.object({
    conditions: Joi.object().required(),
  }).required(),
  sample_logs: Joi.array().items(Joi.object({ message: Joi.string().required() })).min(1).required(),
});

router.use(authMiddleware);
router.get("/", requireRole("viewer", "analyst", "admin"), rulesController.listRules);
router.post("/", requireRole("admin"), validate(ruleSchema), rulesController.createRule);
router.get("/:id", requireRole("viewer", "analyst", "admin"), rulesController.getRule);
router.put("/:id", requireRole("admin"), validate(updateRuleSchema), rulesController.updateRule);
router.delete("/:id", requireRole("admin"), rulesController.deleteRule);
router.post("/:id/toggle", requireRole("admin"), rulesController.toggleRule);
router.post("/test", requireRole("admin"), validate(testRuleSchema), rulesController.testRule);

module.exports = router;
