import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import Redis from "ioredis";

export const redisPlugin = fp(async (app: FastifyInstance) => {
  const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_TLS === "true" ? {} : undefined,
    lazyConnect: true,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

  await redis.connect();
  app.decorate("redis", redis);
  app.addHook("onClose", async () => {
    await redis.quit();
  });
  app.log.info("Redis connected");
});

declare module "fastify" {
  interface FastifyInstance {
    redis: Redis;
  }
}
