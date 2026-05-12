const express = require("express");
const authController = require("../controllers/auth.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");
const { Joi, validate } = require("../middleware/validate");

const router = express.Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  full_name: Joi.string().max(100).allow(""),
  role: Joi.string().valid("admin", "analyst", "viewer").default("analyst"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

router.post("/register", authMiddleware, requireRole("admin"), validate(registerSchema), authController.register);
router.post("/login", loginLimiter, validate(loginSchema), authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.post("/refresh", validate(refreshSchema), authController.refresh);
router.get("/me", authMiddleware, authController.me);

module.exports = router;