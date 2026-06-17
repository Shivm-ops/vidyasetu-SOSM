import { FastifyInstance } from "fastify";

export async function parentRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  app.get("/:id/children", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    const parent = await app.prisma.parent.findUnique({
      where: { id },
      include: {
        children: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    firstName: true, lastName: true,
                    firstNameMarathi: true, profilePhotoUrl: true,
                    school: { select: { name: true, nameMarathi: true } },
                  },
                },
                learningPoints: true,
                progress: { take: 5, orderBy: { updatedAt: "desc" } },
              },
            },
          },
        },
      },
    });

    if (!parent) return reply.code(404).send({ success: false, message: "Parent not found" });

    return reply.send({ success: true, data: parent.children });
  });

  app.get("/:id/child/:studentId/summary", authenticate, async (request, reply) => {
    const { studentId } = request.params as { id: string; studentId: string };

    const [student, attendance, recentAssessments, moodHistory] = await Promise.all([
      app.prisma.student.findUnique({
        where: { id: studentId },
        include: {
          user: {
            select: {
              firstName: true, lastName: true, firstNameMarathi: true,
              profilePhotoUrl: true,
              school: { select: { name: true, nameMarathi: true } },
            },
          },
          learningPoints: true,
          progress: true,
          badges: { include: { badge: true }, orderBy: { earnedAt: "desc" }, take: 5 },
        },
      }),
      app.prisma.attendanceRecord.groupBy({
        by: ["status"],
        where: {
          studentId,
          date: { gte: new Date(new Date().getFullYear(), 5, 1) },
        },
        _count: { _all: true },
      }),
      app.prisma.assessmentAttempt.findMany({
        where: { studentId, submittedAt: { not: null } },
        include: { assessment: { select: { title: true, subjectCode: true } } },
        orderBy: { submittedAt: "desc" },
        take: 5,
      }),
      app.prisma.moodCheckIn.findMany({
        where: { studentId, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        orderBy: { createdAt: "desc" },
        take: 7,
      }),
    ]);

    const summary = attendance.reduce((acc, r) => ({ ...acc, [r.status]: r._count._all }), {} as any);
    const total = Object.values(summary as Record<string, number>).reduce((a: number, b: number) => a + b, 0);
    const present = (summary.PRESENT ?? 0) + (summary.LATE ?? 0);

    return reply.send({
      success: true,
      data: {
        student,
        attendance: { summary, total, present, percentage: total > 0 ? Math.round((present / total) * 100) : 0 },
        recentAssessments,
        moodHistory,
      },
    });
  });
}
