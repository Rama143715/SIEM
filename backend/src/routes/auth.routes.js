const express = require("express");
const authController = require("../controllers/auth.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");
const { Joi, validate } = require("../middleware/validate");

const router = express.Router();

const emailSchema = Joi.string().email({ tlds: { allow: false } }).required();

const registerSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().min(8).required(),
  full_name: Joi.string().max(100).allow(""),
  role: Joi.string().valid("admin", "analyst", "viewer").default("analyst"),
});

const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

const profileSchema = Joi.object({
  email: emailSchema,
  full_name: Joi.string().max(100).allow(""),
});

const passwordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).required().invalid(Joi.ref("current_password")).messages({
    "any.invalid": "New password must be different from current password.",
  }),
});

router.post("/register", authMiddleware, requireRole("admin"), validate(registerSchema), authController.register);
router.post("/login", loginLimiter, validate(loginSchema), authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.post("/refresh", validate(refreshSchema), authController.refresh);
router.get("/me", authMiddleware, authController.me);
router.patch("/profile", authMiddleware, validate(profileSchema), authController.updateProfile);
router.patch("/password", authMiddleware, validate(passwordSchema), authController.changePassword);

module.exports = router;
