const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const redis = require("../config/redis");
const env = require("../config/env");
const { createAccessToken, createRefreshToken } = require("../utils/tokens");
const { writeAuditLog } = require("../services/audit.service");

const PASSWORD_ROTATION_DAYS = 15;

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const passwordChangedAt = user.password_changed_at || user.created_at || new Date().toISOString();
  const changedAtTime = new Date(passwordChangedAt).getTime();
  const expiresAt = new Date(changedAtTime + PASSWORD_ROTATION_DAYS * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.max(Math.ceil((expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)), 0);

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    password_changed_at: passwordChangedAt,
    password_expires_at: expiresAt.toISOString(),
    password_rotation_days: PASSWORD_ROTATION_DAYS,
    password_days_remaining: daysRemaining,
    password_change_required: daysRemaining === 0,
  };
}

async function register(request, response, next) {
  try {
    const { email, password, full_name, role } = request.body;
    const existing = await userModel.findUserByEmail(email);

    if (existing) {
      return response.status(409).json({ error: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userModel.createUser({
      email,
      passwordHash,
      fullName: full_name,
      role,
      isActive: true,
    });

    await writeAuditLog({
      userId: request.user?.id || null,
      action: "user.create",
      target: "user",
      targetId: user.id,
      ipAddress: request.ip,
      metadata: { email: user.email, role: user.role },
    });

    return response.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
}

async function login(request, response, next) {
  try {
    const { email, password } = request.body;
    const user = await userModel.findUserByEmail(email);

    if (!user || !user.is_active) {
      return response.status(401).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({ error: "Invalid credentials." });
    }

    const access = createAccessToken(user);
    const refresh = createRefreshToken(user);

    await writeAuditLog({
      userId: user.id,
      action: "login",
      target: "auth",
      targetId: user.id,
      ipAddress: request.ip,
      metadata: {},
    });

    return response.json({
      access_token: access.token,
      refresh_token: refresh.token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(request, response, next) {
  try {
    const token = String(request.headers.authorization || "").replace("Bearer ", "");

    if (!token) {
      return response.status(400).json({ error: "Token is required." });
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
    const expiresIn = Math.max(Math.floor(payload.exp - Date.now() / 1000), 1);
    await redis.setex(`blacklist:token:${payload.jti}`, expiresIn, "1");

    await writeAuditLog({
      userId: request.user?.id || null,
      action: "logout",
      target: "auth",
      targetId: request.user?.id || null,
      ipAddress: request.ip,
      metadata: {},
    });

    return response.json({ message: "Logged out successfully." });
  } catch (error) {
    return next(error);
  }
}

async function refresh(request, response, next) {
  try {
    const { refresh_token } = request.body;

    if (!refresh_token) {
      return response.status(400).json({ error: "refresh_token is required." });
    }

    const payload = jwt.verify(refresh_token, env.JWT_REFRESH_SECRET);
    const user = await userModel.findUserById(payload.sub);

    if (!user || !user.is_active) {
      return response.status(401).json({ error: "Invalid refresh token." });
    }

    const access = createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return response.json({ access_token: access.token });
  } catch (error) {
    return response.status(401).json({ error: "Invalid refresh token." });
  }
}

async function me(request, response) {
  const user = await userModel.findUserById(request.user.id);
  return response.json({ user: sanitizeUser(user) });
}

async function updateProfile(request, response, next) {
  try {
    const existing = await userModel.findUserByEmail(request.body.email);
    if (existing && existing.id !== request.user.id) {
      return response.status(409).json({ error: "Email already exists." });
    }

    const user = await userModel.updateProfile(request.user.id, {
      email: request.body.email,
      fullName: request.body.full_name,
    });

    await writeAuditLog({
      userId: request.user.id,
      action: "profile.update",
      target: "user",
      targetId: request.user.id,
      ipAddress: request.ip,
      metadata: { email: user.email },
    });

    return response.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function changePassword(request, response, next) {
  try {
    const { current_password, new_password } = request.body;
    const user = await userModel.findUserCredentialsById(request.user.id);

    if (!user) {
      return response.status(404).json({ error: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(current_password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({ error: "Current password is incorrect." });
    }

    const passwordHash = await bcrypt.hash(new_password, 12);
    const updated = await userModel.updatePassword(request.user.id, passwordHash);

    await writeAuditLog({
      userId: request.user.id,
      action: "password.change",
      target: "user",
      targetId: request.user.id,
      ipAddress: request.ip,
      metadata: { rotationDays: PASSWORD_ROTATION_DAYS },
    });

    return response.json({
      message: "Password changed successfully.",
      user: sanitizeUser(updated),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  me,
  updateProfile,
  changePassword,
};
