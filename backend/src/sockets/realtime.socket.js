const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const env = require("../config/env");
const socketBus = require("./socketBus");

function extractToken(socket) {
  const authHeader = socket.handshake.auth?.token || socket.handshake.headers.authorization || "";
  if (!authHeader) {
    return null;
  }

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return authHeader;
}

module.exports = (io) => {
  socketBus.setIO(io);

  io.use(async (socket, next) => {
    try {
      const token = extractToken(socket);

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = jwt.verify(token, env.JWT_SECRET);
      socket.user = {
        id: payload.sub,
        role: payload.role,
      };

      await redis.setex(`session:${socket.user.id}`, 3600, JSON.stringify({
        socketId: socket.id,
        lastSeen: new Date().toISOString(),
      }));

      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);

    socket.on("subscribe_logs", ({ filters } = {}) => {
      socket.data.logFilters = filters || {};
      socket.join("log_stream");
    });

    socket.on("unsubscribe_logs", () => {
      socket.leave("log_stream");
    });

    socket.on("disconnect", async () => {
      await redis.del(`session:${socket.user.id}`);
    });
  });
};