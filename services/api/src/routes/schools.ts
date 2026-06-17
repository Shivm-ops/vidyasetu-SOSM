import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function schoolRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  app.get("/:id", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    const school = await app.prisma.school.findUnique({
      where: { id },
      include: {
        district: true,
        classes: {
          include: {
            sections: {
              include: { _count: { select: { enrollments: true } } },
            },
          },
          orderBy: { grade: "asc" },
        },
        _count: { select: { users: true } },
      },
    });

    if (!school) return reply.code(404).send({ success: false, message: "School not found" });
    return reply.send({ success: true, data: school });
  });

  app.get("/:id/dashboard", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    const [school, todaySnapshot, recentAnnouncements] = await Promise.all([
      app.prisma.school.findUnique({
        where: { id },
        include: { district: true, _count: { select: { users: true } } },
      }),
      app.prisma.schoolAnalyticsSnapshot.findFirst({
        where: { schoolId: id },
        orderBy: { snapshotDate: "desc" },
      }),
      app.prisma.announcement.findMany({
        where: { schoolId: id, isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    if (!school) return reply.code(404).send({ success: false, message: "School not found" });

    return reply.send({
      success: true,
      data: { school, todaySnapshot, recentAnnouncements },
    });
  });

  app.get("/:id/students", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { grade, search, page = 1, limit = 50 } = request.query as any;

    const students = await app.prisma.student.findMany({
      where: {
        user: { schoolId: id, isDeleted: false },
        ...(grade && { grade: Number(grade) }),
        ...(search && {
          user: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      },
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
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: [{ grade: "asc" }, { createdAt: "asc" }],
    });

    const total = await app.prisma.student.count({
      where: { user: { schoolId: id, isDeleted: false } },
    });

    return reply.send({
      success: true,
      data: students,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  });

  app.get("/", authenticate, async (request, reply) => {
    const { districtId, search, page = 1, limit = 20 } = request.query as any;

    const schools = await app.prisma.school.findMany({
      where: {
        isActive: true,
        ...(districtId && { districtId }),
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
      include: { district: { select: { name: true } } },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { name: "asc" },
    });

    const total = await app.prisma.school.count({ where: { isActive: true } });

    return reply.send({
      success: true,
      data: schools,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  });
}
