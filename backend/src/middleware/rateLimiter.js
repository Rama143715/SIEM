const redis = require("../config/redis");

function createRedisRateLimiter({ keyPrefix, windowSeconds, maxRequests, keySelector, message }) {
  return async (request, response, next) => {
    try {
      const dynamicKey = keySelector(request);
      const route = request.baseUrl || request.path;
      const key = `ratelimit:${keyPrefix}:${dynamicKey}:${route}`;
      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }

      const ttl = await redis.ttl(key);
      response.setHeader("X-RateLimit-Limit", String(maxRequests));
      response.setHeader("X-RateLimit-Remaining", String(Math.max(maxRequests - count, 0)));
      response.setHeader("X-RateLimit-Reset", String(ttl));

      if (count > maxRequests) {
        return response.status(429).json({ error: message || "Rate limit exceeded." });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

const loginLimiter = createRedisRateLimiter({
  keyPrefix: "ip",
  windowSeconds: 60,
  maxRequests: 10,
  keySelector: (request) => request.ip,
  message: "Too many login attempts. Please retry later.",
});

const ingestLimiter = createRedisRateLimiter({
  keyPrefix: "ingest",
  windowSeconds: 60,
  maxRequests: 1000,
  keySelector: (request) => request.body.source_api_key || request.ip,
  message: "Ingestion rate limit exceeded.",
});

const aiLimiter = createRedisRateLimiter({
  keyPrefix: "ai",
  windowSeconds: 60,
  maxRequests: 20,
  keySelector: (request) => request.user?.id || request.ip,
  message: "AI analysis rate limit exceeded.",
});

module.exports = {
  createRedisRateLimiter,
  loginLimiter,
  ingestLimiter,
  aiLimiter,
};