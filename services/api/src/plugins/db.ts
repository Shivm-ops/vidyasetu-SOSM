import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { prisma } from "@vidyasetu/db";

export const dbPlugin = fp(async (app: FastifyInstance) => {
  await prisma.$connect();
  try {
    await prisma.$executeRawUnsafe('CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1 INCREMENT 1;');
  } catch (err) {
    app.log.error(err, "Failed to ensure student_id_seq exists");
  }
  app.decorate("prisma", prisma);
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
  app.log.info("Database connected");
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}
