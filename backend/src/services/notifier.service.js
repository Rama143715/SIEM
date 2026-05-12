const nodemailer = require("nodemailer");
const env = require("../config/env");
const logger = require("../utils/logger");

let transporter = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
}

async function sendWebhook(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }
  } catch (error) {
    logger.error({ message: "Webhook notification failed", error: error.message, url });
  }
}

async function sendEmail(to, subject, text) {
  const mailer = getTransporter();

  if (!mailer) {
    return;
  }

  try {
    await mailer.sendMail({
      from: env.ALERT_FROM_EMAIL || env.SMTP_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    logger.error({ message: "Email notification failed", error: error.message, to });
  }
}

module.exports = {
  sendWebhook,
  sendEmail,
};