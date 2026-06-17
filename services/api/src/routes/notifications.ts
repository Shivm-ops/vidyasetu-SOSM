import { FastifyInstance } from "fastify";

export async function notificationRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  app.get("/", authenticate, async (request, reply) => {
    const { page = 1, limit = 20 } = request.query as any;
    const userId = request.user!.userId;

    const [notifications, unreadCount] = await Promise.all([
      app.prisma.userNotification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      app.prisma.userNotification.count({ where: { userId, isRead: false } }),
    ]);

    return reply.send({ success: true, data: notifications, meta: { unreadCount } });
  });

  app.patch("/:id/read", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    await app.prisma.userNotification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });

    return reply.send({ success: true });
  });

  app.patch("/read-all", authenticate, async (request, reply) => {
    const userId = request.user!.userId;

    await app.prisma.userNotification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return reply.send({ success: true });
  });
}
