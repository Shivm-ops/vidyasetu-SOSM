import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { JWTPayload } from "../types/index.js";

export const authPlugin = fp(async (app: FastifyInstance) => {
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const payload = (await request.jwtVerify()) as JWTPayload;

        // Check session blacklist in Redis
        const isBlacklisted = await app.redis.get(
          `blacklist:${payload.sessionId}`
        );
        if (isBlacklisted) {
          return reply.code(401).send({ success: false, message: "Session expired" });
        }

        request.user = payload;
      } catch (err) {
        reply.code(401).send({ success: false, message: "Unauthorized" });
      }
    }
  );

  app.decorate(
    "authorizeRoles",
    (...roles: string[]) =>
      async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.user) {
          return reply.code(401).send({ success: false, message: "Unauthorized" });
        }
        if (!roles.includes(request.user.role)) {
          return reply.code(403).send({ success: false, message: "Forbidden" });
        }
      }
  );
});

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeRoles: (
      ...roles: string[]
    ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
