const path = require("node:path");
const dotenv = require("dotenv");
const Joi = require("joi");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const schema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),
  FRONTEND_URL: Joi.string().uri().required(),
  ANTHROPIC_API_KEY: Joi.string().allow(""),
  SYSLOG_UDP_PORT: Joi.number().default(514),
  SYSLOG_TCP_PORT: Joi.number().default(514),
  SMTP_HOST: Joi.string().allow(""),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().allow(""),
  SMTP_PASS: Joi.string().allow(""),
  ALERT_FROM_EMAIL: Joi.string().allow(""),
  GEOIP_DB_PATH: Joi.string().allow(""),
}).unknown(true);

const { error, value } = schema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Environment validation failed: ${error.message}`);
}

module.exports = value;