import { FastifyInstance } from "fastify";
import { z } from "zod";
import { assertStudentAccess } from "../middleware/security.js";

const updateProfileSchema = z.object({
  firstNameMarathi: z.string().optional(),
  lastNameMarathi: z.string().optional(),
  preferredLanguage: z.enum(["MARATHI", "ENGLISH", "HINDI"]).optional(),
  fcmToken: z.string().optional(),
});

const moodCheckInSchema = z.object({
  mood: z.enum(["VERY_HAPPY", "HAPPY", "NEUTRAL", "SAD", "VERY_SAD", "ANXIOUS", "EXCITED", "TIRED"]),
  note: z.string().max(500).optional(),
  isExamPeriod: z.boolean().optional(),
});

export async function studentRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  // GET /api/v1/students/:id/dashboard
  app.get("/:id/dashboard", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    await assertStudentAccess(app, request, id);

    const [student, recentLessons, todayAttendance, upcomingAssessments, moodHistory] =
      await Promise.all([
        app.prisma.student.findUnique({
          where: { id },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                firstNameMarathi: true,
                profilePhotoUrl: true,
                preferredLanguage: true,
              },
            },
            learningPoints: true,
            progress: { orderBy: { updatedAt: "desc" }, take: 5 },
            badges: {
              include: { badge: true },
              orderBy: { earnedAt: "desc" },
              take: 5,
            },
          },
        }),
        app.prisma.lessonCompletion.findMany({
          where: { studentId: id },
          include: {
            lesson: {
              include: { chapter: { include: { subject: true } } },
            },
          },
          orderBy: { completedAt: "desc" },
          take: 5,
        }),
        app.prisma.attendanceRecord.findFirst({
          where: {
            studentId: id,
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),
        app.prisma.assessment.findMany({
          where: {
            grade: (await app.prisma.student.findUnique({ where: { id }, select: { grade: true } }))!.grade,
            startTime: { gte: new Date() },
            isPublished: true,
          },
          orderBy: { startTime: "asc" },
          take: 3,
        }),
        app.prisma.moodCheckIn.findMany({
          where: { studentId: id },
          orderBy: { createdAt: "desc" },
          take: 7,
        }),
      ]);

    if (!student) {
      return reply.code(404).send({ success: false, message: "Student not found" });
    }

    const attendancePct = await getAttendancePercentage(app, id);

    return reply.send({
      success: true,
      data: {
        student,
        recentLessons,
        todayAttendance,
        upcomingAssessments,
        moodHistory,
        attendancePercentage: attendancePct,
      },
    });
  });

  // GET /api/v1/students/:id/dashboard-stats (Vidyasetu V2)
  app.get("/:id/dashboard-stats", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    await assertStudentAccess(app, request, id);

    const student = await app.prisma.student.findUnique({
      where: { id },
      select: {
        learningScore: true,
        skillScore: true,
        careerReadinessScore: true,
        innovationScore: true,
        communityImpactScore: true,
        overallGrowthScore: true,
      }
    });

    if (!student) {
      return reply.code(404).send({ success: false, message: "Student not found" });
    }

    // Mock recent activities for the new V2 OS Modules Dashboard
    return reply.send({
      success: true,
      data: {
        scores: student,
        todayLearning: { title: "अपूर्णांक", type: "MATH", progress: 65 },
        todayGoal: { title: "दररोज २ धडे वाचा", target: 2, current: 1 },
        todayQuiz: { title: "विज्ञान सराव", status: "PENDING" },
        newSkill: { title: "आर्थिक साक्षरता (Financial Literacy)", level: "BEGINNER" },
        todayInnovation: { title: "पाणी वाचवणे (Water Saving Model)", status: "IN_PROGRESS" },
        villageProject: { title: "शेततळे माहिती", impact: 50 },
      }
    });
  });

  // GET /api/v1/students/:id/profile-scores (Vidyasetu V2)
  app.get("/:id/profile-scores", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    await assertStudentAccess(app, request, id);

    const student = await app.prisma.student.findUnique({
      where: { id },
      select: {
        learningScore: true,
        skillScore: true,
        careerReadinessScore: true,
        innovationScore: true,
        communityImpactScore: true,
        overallGrowthScore: true,
      }
    });

    return reply.send({ success: true, data: student });
  });

  // GET /api/v1/students/:id/progress
  app.get("/:id/progress", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    await assertStudentAccess(app, request, id);
    const { academicYear = getCurrentAcademicYear() } = request.query as {
      academicYear?: string;
    };

    const progress = await app.prisma.studentProgress.findMany({
      where: { studentId: id, academicYear },
      orderBy: { updatedAt: "desc" },
    });

    const completionsBySubject = await app.prisma.lessonCompletion.groupBy({
      by: ["lessonId"],
      where: { studentId: id },
      _count: { _all: true },
    });

    const streakData = await app.prisma.learningStreak.findUnique({
      where: { studentId: id },
    });

    return reply.send({
      success: true,
      data: { progress, completionsBySubject, streak: streakData },
    });
  });

  // GET /api/v1/students/:id/badges
  app.get("/:id/badges", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    await assertStudentAccess(app, request, id);

    const badges = await app.prisma.studentBadge.findMany({
      where: { studentId: id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    });

    return reply.send({ success: true, data: badges });
  });

  // POST /api/v1/students/:id/mood
  app.post("/:id/mood", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    await assertStudentAccess(app, request, id);
    const body = moodCheckInSchema.parse(request.body);

    const checkIn = await app.prisma.moodCheckIn.create({
      data: { studentId: id, ...body },
    });

    // If consecutive bad moods, flag for counselor
    const recentBadMoods = await app.prisma.moodCheckIn.count({
      where: {
        studentId: id,
        mood: { in: ["SAD", "VERY_SAD", "ANXIOUS"] },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    if (recentBadMoods >= 3) {
      // Queue notification to teacher/counselor
      await app.redis.lpush(
        "wellbeing:alerts",
        JSON.stringify({ studentId: id, alert: "CONSECUTIVE_BAD_MOOD", count: recentBadMoods })
      );
    }

    return reply.code(201).send({ success: true, data: checkIn });
  });

  // PATCH /api/v1/students/:id/profile
  app.patch("/:id/profile", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    await assertStudentAccess(app, request, id);
    const body = updateProfileSchema.parse(request.body);

    const student = await app.prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      return reply.code(404).send({ success: false, message: "Student not found" });
    }

    await app.prisma.user.update({
      where: { id: student.userId },
      data: body,
    });

    return reply.send({ success: true, message: "Profile updated" });
  });

  // GET /api/v1/students/:id/skill-passport
  app.get("/:id/skill-passport", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    await assertStudentAccess(app, request, id);

    const passport = await app.prisma.skillPassport.findUnique({
      where: { studentId: id },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                firstNameMarathi: true,
                profilePhotoUrl: true,
              },
            },
            badges: { include: { badge: true } },
            learningPoints: true,
          },
        },
      },
    });

    return reply.send({ success: true, data: passport });
  });

  // GET /api/v1/students (for school admin/teachers)
  app.get("/", authenticate, async (request, reply) => {
    const {
      page = 1,
      limit = 20,
      grade,
      search,
      sectionId,
    } = request.query as {
      page?: number;
      limit?: number;
      grade?: number;
      search?: string;
      sectionId?: string;
    };

    const { role, schoolId } = request.user!;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { user: { isDeleted: false } };
    
    // Scoping check for school administration
    if (role !== "SUPER_ADMIN") {
      if (schoolId) {
        where.user = { ...where.user, schoolId };
      } else {
        return reply.code(403).send({ success: false, message: "Forbidden: Account lacks associated school context." });
      }
    }

    if (grade) where.grade = Number(grade);
    if (search) {
      where.user = {
        ...where.user,
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } },
        ],
      };
    }
    if (sectionId) {
      where.enrollments = {
        some: {
          sectionId,
          isActive: true,
          academicYear: getCurrentAcademicYear(),
        },
      };
    }

    const [students, total] = await Promise.all([
      app.prisma.student.findMany({
        where,
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
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      app.prisma.student.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: students,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  });
}

async function getAttendancePercentage(
  app: FastifyInstance,
  studentId: string
): Promise<number> {
  const currentYear = getCurrentAcademicYear();
  const [present, total] = await Promise.all([
    app.prisma.attendanceRecord.count({
      where: { studentId, status: "PRESENT" },
    }),
    app.prisma.attendanceRecord.count({ where: { studentId } }),
  ]);
  return total === 0 ? 0 : Math.round((present / total) * 100);
}

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}
