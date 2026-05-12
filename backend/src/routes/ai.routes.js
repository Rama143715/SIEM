const express = require("express");
const aiController = require("../controllers/ai.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimiter");
const { Joi, validate } = require("../middleware/validate");

const router = express.Router();

const analyzeSchema = Joi.object({
  analysis_type: Joi.string().valid("threat_hunt", "anomaly", "forensics", "compliance", "ioc", "triage", "incident").required(),
  logs: Joi.array().items(Joi.object()).default([]),
  raw_text: Joi.string().allow(""),
  incident_id: Joi.string().allow("", null),
  model: Joi.string().allow(""),
}).or("logs", "raw_text");

router.use(authMiddleware);

router.post("/analyze", requireRole("analyst", "admin"), aiLimiter, validate(analyzeSchema), aiController.analyze);
router.get("/history", requireRole("viewer", "analyst", "admin"), aiController.history);
router.get("/analyses/:id", requireRole("viewer", "analyst", "admin"), aiController.getAnalysis);

module.exports = router;