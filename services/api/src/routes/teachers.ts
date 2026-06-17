import { FastifyInstance } from "fastify";
import { z } from "zod";

const generateLessonPlanSchema = z.object({
  lessonId: z.string().uuid(),
  planDate: z.string().datetime(),
  notes: z.string().optional(),
});

export async function teacherRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  // GET /api/v1/teachers/:id/dashboard
  app.get("/:id/dashboard", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    const [teacher, sections, recentAttendance, pendingHomework] = await Promise.all([
      app.prisma.teacher.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePhotoUrl: true,
              school: { select: { name: true, nameMarathi: true } },
            },
          },
        },
      }),
      app.prisma.section.findMany({
        where: { teacherId: (await app.prisma.teacher.findUnique({ where: { id }, select: { userId: true } }))!.userId },
        include: {
          classGrade: { select: { grade: true } },
          _count: { select: { enrollments: true } },
        },
      }),
      app.prisma.attendanceRecord.findMany({
        where: {
          takenById: id,
          date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { date: "desc" },
        take: 10,
      }),
      app.prisma.homework.count({
        where: {
          teacherId: id,
          dueDate: { gte: new Date() },
        },
      }),
    ]);

    if (!teacher) {
      return reply.code(404).send({ success: false, message: "Teacher not found" });
    }

    return reply.send({
      success: true,
      data: { teacher, sections, recentAttendance, pendingHomework },
    });
  });

  // GET /api/v1/teachers/:id/students - all students taught by teacher
  app.get("/:id/students", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    const teacher = await app.prisma.teacher.findUnique({ where: { id }, select: { userId: true } });
    if (!teacher) return reply.code(404).send({ success: false, message: "Teacher not found" });

    const sections = await app.prisma.section.findMany({
      where: { teacherId: teacher.userId },
      include: {
        enrollments: {
          where: { isActive: true, academicYear: getCurrentAcademicYear() },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    firstNameMarathi: true,
                    phone: true,
                    profilePhotoUrl: true,
                  },
                },
                learningPoints: { select: { totalPoints: true, level: true } },
              },
            },
          },
        },
        classGrade: { select: { grade: true } },
      },
    });

    return reply.send({ success: true, data: sections });
  });

  // POST /api/v1/teachers/:id/lesson-plans
  app.post("/:id/lesson-plans", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = generateLessonPlanSchema.parse(request.body);

    const plan = await app.prisma.lessonPlan.create({
      data: {
        teacherId: id,
        lessonId: body.lessonId,
        planDate: new Date(body.planDate),
        notes: body.notes,
      },
    });

    return reply.code(201).send({ success: true, data: plan });
  });

  // GET /api/v1/teachers/:id/analytics
  app.get("/:id/analytics", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    const teacher = await app.prisma.teacher.findUnique({ where: { id }, select: { userId: true } });
    if (!teacher) return reply.code(404).send({ success: false, message: "Teacher not found" });

    const sections = await app.prisma.section.findMany({
      where: { teacherId: teacher.userId },
      include: {
        enrollments: {
          where: { isActive: true },
          include: { student: { select: { id: true } } },
        },
      },
    });

    const studentIds = sections.flatMap((s) => s.enrollments.map((e) => e.student.id));

    const [avgAttendance, lessonCompletions, avgScore] = await Promise.all([
      getAvgAttendance(app, studentIds),
      app.prisma.lessonCompletion.count({ where: { studentId: { in: studentIds } } }),
      getAvgAssessmentScore(app, studentIds),
    ]);

    return reply.send({
      success: true,
      data: {
        totalStudents: studentIds.length,
        sections: sections.length,
        avgAttendance,
        lessonCompletions,
        avgScore,
      },
    });
  });
}

async function getAvgAttendance(app: FastifyInstance, studentIds: string[]): Promise<number> {
  if (studentIds.length === 0) return 0;
  const records = await app.prisma.attendanceRecord.groupBy({
    by: ["status"],
    where: { studentId: { in: studentIds } },
    _count: { _all: true },
  });
  const summary = records.reduce((acc, r) => ({ ...acc, [r.status]: r._count._all }), {} as Record<string, number>);
  const total = Object.values(summary).reduce((a, b) => a + b, 0);
  const present = (summary.PRESENT ?? 0) + (summary.LATE ?? 0);
  return total > 0 ? Math.round((present / total) * 100) : 0;
}

async function getAvgAssessmentScore(app: FastifyInstance, studentIds: string[]): Promise<number> {
  if (studentIds.length === 0) return 0;
  const attempts = await app.prisma.assessmentAttempt.aggregate({
    where: { studentId: { in: studentIds }, submittedAt: { not: null } },
    _avg: { percentScore: true },
  });
  return Math.round(attempts._avg.percentScore ?? 0);
}

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  return now.getMonth() + 1 >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}
