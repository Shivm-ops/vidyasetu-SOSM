import { FastifyInstance } from "fastify";
import { z } from "zod";

const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  targetDays: z.number().int().min(1).max(365).default(21),
});

export async function wellbeingRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  app.get("/goals/:studentId", authenticate, async (request, reply) => {
    const { studentId } = request.params as { studentId: string };

    const goals = await app.prisma.wellbeingGoal.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });

    return reply.send({ success: true, data: goals });
  });

  app.post("/goals", authenticate, async (request, reply) => {
    const body = createGoalSchema.parse(request.body);
    const userId = request.user!.userId;

    const student = await app.prisma.student.findFirst({ where: { userId } });
    if (!student) return reply.code(403).send({ success: false, message: "Student not found" });

    const goal = await app.prisma.wellbeingGoal.create({
      data: { studentId: student.id, ...body },
    });

    return reply.code(201).send({ success: true, data: goal });
  });

  app.patch("/goals/:id/checkin", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    const goal = await app.prisma.wellbeingGoal.update({
      where: { id },
      data: {
        currentDays: { increment: 1 },
      },
    });

    if (goal.currentDays >= goal.targetDays) {
      await app.prisma.wellbeingGoal.update({
        where: { id },
        data: { isCompleted: true, completedAt: new Date() },
      });
    }

    return reply.send({ success: true, data: goal });
  });

  app.get("/mood-trends/:studentId", authenticate, async (request, reply) => {
    const { studentId } = request.params as { studentId: string };
    const { days = 30 } = request.query as { days?: number };

    const moods = await app.prisma.moodCheckIn.findMany({
      where: {
        studentId,
        createdAt: { gte: new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "asc" },
    });

    return reply.send({ success: true, data: moods });
  });
}
