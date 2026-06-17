import { FastifyInstance } from "fastify";
import { z } from "zod";

const setGoalSchema = z.object({
  careerPathId: z.string().uuid(),
  targetYear: z.number().int().optional(),
  notes: z.string().optional(),
});

const applyScholarshipSchema = z.object({
  scholarshipId: z.string().uuid(),
  documentsUrl: z.array(z.string().url()).optional(),
  notes: z.string().optional(),
});

export async function careerRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  // GET /api/v1/career/paths?category=ENGINEERING&grade=10
  app.get("/paths", authenticate, async (request, reply) => {
    const { category, grade } = request.query as { category?: string; grade?: number };

    const paths = await app.prisma.careerPath.findMany({
      where: {
        ...(category && { category: category as any }),
      },
      include: { _count: { select: { careerGoals: true } } },
      orderBy: [{ isPopular: "desc" }, { name: "asc" }],
    });

    return reply.send({ success: true, data: paths });
  });

  // GET /api/v1/career/paths/:id
  app.get("/paths/:id", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    const path = await app.prisma.careerPath.findUnique({ where: { id } });
    if (!path) return reply.code(404).send({ success: false, message: "Career path not found" });

    return reply.send({ success: true, data: path });
  });

  // POST /api/v1/career/goals - student sets a career goal
  app.post("/goals", authenticate, async (request, reply) => {
    const body = setGoalSchema.parse(request.body);
    const userId = request.user!.userId;

    const student = await app.prisma.student.findFirst({ where: { userId } });
    if (!student) return reply.code(403).send({ success: false, message: "Only students can set goals" });

    const goal = await app.prisma.careerGoal.upsert({
      where: {
        // Prisma doesn't support compound unique without it in schema; use findFirst + create
        id: "non-existent-id",
      },
      create: {
        studentId: student.id,
        careerPathId: body.careerPathId,
        targetYear: body.targetYear,
        notes: body.notes,
      },
      update: {
        targetYear: body.targetYear,
        notes: body.notes,
      },
    }).catch(async () => {
      const existing = await app.prisma.careerGoal.findFirst({
        where: { studentId: student.id, careerPathId: body.careerPathId },
      });
      if (existing) {
        return app.prisma.careerGoal.update({
          where: { id: existing.id },
          data: { targetYear: body.targetYear, notes: body.notes },
        });
      }
      return app.prisma.careerGoal.create({
        data: {
          studentId: student.id,
          careerPathId: body.careerPathId,
          targetYear: body.targetYear,
          notes: body.notes,
        },
      });
    });

    return reply.code(201).send({ success: true, data: goal });
  });

  // GET /api/v1/career/scholarships
  app.get("/scholarships", authenticate, async (request, reply) => {
    const { grade, castCategory } = request.query as {
      grade?: number;
      castCategory?: string;
    };

    const scholarships = await app.prisma.scholarship.findMany({
      where: {
        isActive: true,
        ...(grade && { grade: { has: Number(grade) } }),
        ...(castCategory && {
          OR: [
            { castCategory: { has: castCategory } },
            { castCategory: { has: "ALL" } },
          ],
        }),
        OR: [
          { deadline: null },
          { deadline: { gte: new Date() } },
        ],
      },
      orderBy: { deadline: "asc" },
    });

    return reply.send({ success: true, data: scholarships });
  });

  // POST /api/v1/career/scholarships/apply
  app.post("/scholarships/apply", authenticate, async (request, reply) => {
    const body = applyScholarshipSchema.parse(request.body);
    const userId = request.user!.userId;

    const student = await app.prisma.student.findFirst({ where: { userId } });
    if (!student) return reply.code(403).send({ success: false, message: "Student not found" });

    const existing = await app.prisma.scholarshipApplication.findUnique({
      where: { studentId_scholarshipId: { studentId: student.id, scholarshipId: body.scholarshipId } },
    });

    if (existing) {
      return reply.code(409).send({ success: false, message: "Already applied" });
    }

    const application = await app.prisma.scholarshipApplication.create({
      data: {
        studentId: student.id,
        scholarshipId: body.scholarshipId,
        documentsUrl: body.documentsUrl ?? [],
        notes: body.notes,
      },
    });

    return reply.code(201).send({ success: true, data: application });
  });

  // GET /api/v1/career/recommendations/:studentId
  app.get("/recommendations/:studentId", authenticate, async (request, reply) => {
    const { studentId } = request.params as { studentId: string };

    const student = await app.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        progress: { orderBy: { avgScore: "desc" }, take: 3 },
        careerGoals: { include: { careerPath: true } },
      },
    });

    if (!student) return reply.code(404).send({ success: false, message: "Student not found" });

    // Simple recommendation: top subjects -> matching careers
    const topSubjects = student.progress.map((p) => p.subjectCode);
    const recommendedPaths = await app.prisma.careerPath.findMany({
      where: { isPopular: true },
      take: 6,
      orderBy: { name: "asc" },
    });

    const eligibleScholarships = await app.prisma.scholarship.findMany({
      where: {
        isActive: true,
        grade: { has: student.grade },
        deadline: { gte: new Date() },
      },
      take: 5,
    });

    return reply.send({
      success: true,
      data: {
        recommendedCareerPaths: recommendedPaths,
        eligibleScholarships,
        topSubjects,
        currentGoals: student.careerGoals,
      },
    });
  });
}
