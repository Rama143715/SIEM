const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);
router.get("/stats", requireRole("viewer", "analyst", "admin"), dashboardController.getStats);
router.get("/timeline", requireRole("viewer", "analyst", "admin"), dashboardController.getTimeline);
router.get("/top-sources", requireRole("viewer", "analyst", "admin"), dashboardController.getTopSources);
router.get("/severity", requireRole("viewer", "analyst", "admin"), dashboardController.getSeverityDistribution);
router.get("/assets", requireRole("viewer", "analyst", "admin"), dashboardController.getAssets);

module.exports = router;