import { FastifyInstance } from "fastify";

export async function progressRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  app.get("/:studentId", authenticate, async (request, reply) => {
    const { studentId } = request.params as { studentId: string };

    const [progress, streak, points, recentActivity] = await Promise.all([
      app.prisma.studentProgress.findMany({
        where: { studentId },
        orderBy: { updatedAt: "desc" },
      }),
      app.prisma.learningStreak.findUnique({ where: { studentId } }),
      app.prisma.learningPoints.findUnique({
        where: { studentId },
        include: {
          transactions: { orderBy: { createdAt: "desc" }, take: 10 },
        },
      }),
      app.prisma.lessonCompletion.findMany({
        where: { studentId },
        include: {
          lesson: {
            include: {
              chapter: {
                include: { subject: { select: { name: true, nameMarathi: true, code: true } } },
              },
            },
          },
        },
        orderBy: { completedAt: "desc" },
        take: 10,
      }),
    ]);

    return reply.send({
      success: true,
      data: { progress, streak, points, recentActivity },
    });
  });
}
