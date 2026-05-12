const express = require("express");
const multer = require("multer");
const logsController = require("../controllers/logs.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { ingestLimiter } = require("../middleware/rateLimiter");
const { Joi, validate } = require("../middleware/validate");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const ingestSchema = Joi.object({
  source_api_key: Joi.string().required(),
  logs: Joi.array().items(
    Joi.object({
      severity: Joi.string().valid("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO").default("INFO"),
      category: Joi.string().allow(""),
      message: Joi.string().required(),
      raw: Joi.string().allow(""),
      raw_log: Joi.string().allow(""),
      ip_src: Joi.string().allow(""),
      ip_dst: Joi.string().allow(""),
      user_name: Joi.string().allow(""),
      host_name: Joi.string().allow(""),
      session_id: Joi.string().allow(""),
      extra_data: Joi.object().default({}),
      ts: Joi.date().optional(),
    }),
  ).min(1).required(),
});

const ingestSingleSchema = Joi.object({
  source_api_key: Joi.string().required(),
  log: Joi.object({
    severity: Joi.string().valid("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO").default("INFO"),
    category: Joi.string().allow(""),
    message: Joi.string().required(),
    raw: Joi.string().allow(""),
    raw_log: Joi.string().allow(""),
    ip_src: Joi.string().allow(""),
    ip_dst: Joi.string().allow(""),
    user_name: Joi.string().allow(""),
    host_name: Joi.string().allow(""),
    session_id: Joi.string().allow(""),
    extra_data: Joi.object().default({}),
    ts: Joi.date().optional(),
  }).required(),
});

router.use(authMiddleware);

router.get("/", requireRole("viewer", "analyst", "admin"), logsController.listLogs);
router.get("/export", requireRole("viewer", "analyst", "admin"), logsController.exportLogs);
router.get("/:id", requireRole("viewer", "analyst", "admin"), logsController.getLogById);

router.post("/ingest", requireRole("analyst", "admin"), ingestLimiter, validate(ingestSchema), logsController.ingestBulk);
router.post("/ingest/single", requireRole("analyst", "admin"), ingestLimiter, validate(ingestSingleSchema), logsController.ingestSingle);
router.post("/ingest/upload", requireRole("analyst", "admin"), ingestLimiter, upload.single("file"), logsController.uploadFile);

module.exports = router;