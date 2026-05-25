const express = require("express");
const collectorController = require("../controllers/collector.controller");
const { ingestLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/events", ingestLimiter, collectorController.ingestEvents);
router.post("/event", ingestLimiter, collectorController.ingestEvents);

module.exports = router;
