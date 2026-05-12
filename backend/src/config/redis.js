const Redis = require("ioredis");
const env = require("./env");

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redis.on("error", (error) => {
  console.error("Redis error:", error.message);
});

module.exports = redis;