const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const env = require("../config/env");

function extractToken(authHeader = "") {
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7);
}

async function authMiddleware(request, response, next) {
  try {
    const token = extractToken(request.headers.authorization);

    if (!token) {
      return response.status(401).json({ error: "Missing authorization token." });
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
    const blacklisted = await redis.get(`blacklist:token:${payload.jti}`);

    if (blacklisted) {
      return response.status(401).json({ error: "Token has been revoked." });
    }

    request.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      jti: payload.jti,
    };

    next();
  } catch (error) {
    return response.status(401).json({ error: "Invalid or expired token." });
  }
}

function requireRole(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({ error: "Unauthorized." });
    }

    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ error: "Insufficient permissions." });
    }

    return next();
  };
}

module.exports = {
  authMiddleware,
  requireRole,
};