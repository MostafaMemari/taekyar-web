import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: Redis };

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) {
    return new Proxy({} as Redis, {
      get() {
        return () => Promise.reject(new Error("REDIS_URL is not set"));
      },
    });
  }

  return new Redis(url, { maxRetriesPerRequest: 2 });
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
