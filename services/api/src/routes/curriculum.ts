import { FastifyInstance } from "fastify";
import { z } from "zod";

import { importCurriculum } from "../../../../packages/db/scripts/import-curriculum";

const completeLessonSchema = z.object({
  timeSpentSecs: z.number().int().min(0),
  watchPercent: z.number().min(0).max(100).optional(),
  isOffline: z.boolean().optional(),
});

export async function curriculumRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  // POST /api/v1/curriculum/import (Phase 4: Bulk Importer)
  app.post("/import", authenticate, async (request, reply) => {
    try {
      const payload = request.body;
      const stats = await importCurriculum(payload, app.prisma as any);
      return reply.send({
        success: true,
        message: "Curriculum imported successfully.",
        data: stats
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, message: error.message });
    }
  });

  // GET /api/v1/curriculum/subjects?grade=5&stage=DISCOVERY
  app.get("/subjects", authenticate, async (request, reply) => {
    const { grade, stage } = request.query as {
      grade?: number;
      stage?: string;
    };

    const subjects = await app.prisma.subject.findMany({
      where: {
        ...(grade && { grade: Number(grade) }),
        ...(stage && { stage: stage as any }),
      },
      include: {
        _count: { select: { chapters: true } },
      },
      orderBy: { name: "asc" },
    });

    return reply.send({ success: true, data: subjects });
  });

  // GET /api/v1/curriculum/subjects/:subjectCode/chapters
  app.get("/subjects/:subjectCode/chapters", authenticate, async (request, reply) => {
    const { subjectCode } = request.params as { subjectCode: string };
    const { grade } = request.query as { grade?: number };

    const subject = await app.prisma.subject.findUnique({
      where: { code: subjectCode },
    });

    if (!subject) {
      return reply.code(404).send({ success: false, message: "Subject not found" });
    }

    const chapters = await app.prisma.chapter.findMany({
      where: {
        subjectId: subject.id,
        ...(grade && { grade: Number(grade) }),
      },
      include: {
        _count: { select: { lessons: true } },
        lessons: {
          select: {
            id: true,
            title: true,
            titleMarathi: true,
            orderIndex: true,
            estimatedMinutes: true,
            difficultyLevel: true,
            contentType: true,
            status: true,
          },
          where: { status: "PUBLISHED" },
          orderBy: { orderIndex: "asc" },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    return reply.send({ success: true, data: { subject, chapters } });
  });

  // GET /api/v1/curriculum/lessons/:id
  app.get("/lessons/:id", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };
    const lang = request.lang ?? "mr";

    const lesson = await app.prisma.lesson.findUnique({
      where: { id },
      include: {
        contents: {
          where: {
            language: lang === "mr" ? "MARATHI" : lang === "hi" ? "HINDI" : "ENGLISH",
          },
          orderBy: { orderIndex: "asc" },
        },
        activities: true,
        chapter: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!lesson) {
      return reply.code(404).send({ success: false, message: "Lesson not found" });
    }

    return reply.send({ success: true, data: lesson });
  });

  // POST /api/v1/curriculum/lessons/:id/complete
  app.post("/lessons/:id/complete", authenticate, async (request, reply) => {
    const { id: lessonId } = request.params as { id: string };
    const body = completeLessonSchema.parse(request.body);
    const userId = request.user!.userId;

    const student = await app.prisma.student.findFirst({
      where: { userId },
    });

    if (!student) {
      return reply.code(404).send({ success: false, message: "Student not found" });
    }

    const lesson = await app.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { chapter: { include: { subject: true } } },
    });

    if (!lesson) {
      return reply.code(404).send({ success: false, message: "Lesson not found" });
    }

    // Points for completing a lesson
    const pointsEarned = calculateLessonPoints(lesson.difficultyLevel, body.watchPercent);

    const completion = await app.prisma.lessonCompletion.upsert({
      where: { studentId_lessonId: { studentId: student.id, lessonId } },
      create: {
        studentId: student.id,
        lessonId,
        timeSpentSecs: body.timeSpentSecs,
        watchPercent: body.watchPercent,
        pointsEarned,
        isOffline: body.isOffline ?? false,
      },
      update: {
        timeSpentSecs: { increment: body.timeSpentSecs },
        watchPercent: body.watchPercent,
        isOffline: body.isOffline ?? false,
      },
    });

    // Update progress and points in parallel
    await Promise.all([
      updateStudentProgress(app, student.id, lesson.chapter.subjectId, lesson.chapter.grade),
      awardPoints(app, student.id, pointsEarned, "LESSON_COMPLETE", lessonId),
      updateStreak(app, student.id),
    ]);

    // Check for badges
    await checkAndAwardBadges(app, student.id);

    return reply.code(201).send({
      success: true,
      data: { completion, pointsEarned },
    });
  });

  // GET /api/v1/curriculum/offline-bundle?grade=5
  app.get("/offline-bundle", authenticate, async (request, reply) => {
    const { grade } = request.query as { grade?: number };

    const lessons = await app.prisma.lesson.findMany({
      where: {
        status: "PUBLISHED",
        ...(grade && { chapter: { grade: Number(grade) } }),
        contents: { some: { isOfflineAvailable: true } },
      },
      include: {
        contents: {
          where: { isOfflineAvailable: true },
          select: {
            id: true,
            language: true,
            contentType: true,
            videoUrl: true,
            audioUrl: true,
            fileUrl: true,
            fileSizeBytes: true,
          },
        },
        chapter: {
          include: { subject: { select: { name: true, nameMarathi: true, code: true } } },
        },
      },
      take: 100,
    });

    return reply.send({
      success: true,
      data: lessons,
      meta: { downloadable: lessons.length },
    });
  });
}

function calculateLessonPoints(difficulty: string, watchPercent?: number): number {
  const basePoints: Record<string, number> = {
    VERY_EASY: 5,
    EASY: 10,
    MEDIUM: 15,
    HARD: 20,
    VERY_HARD: 25,
  };
  const base = basePoints[difficulty] ?? 10;
  const bonus = watchPercent && watchPercent >= 90 ? 5 : 0;
  return base + bonus;
}

async function updateStudentProgress(
  app: FastifyInstance,
  studentId: string,
  subjectId: string,
  grade: number
) {
  const subject = await app.prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) return;

  const academicYear = getCurrentAcademicYear();
  const completedCount = await app.prisma.lessonCompletion.count({
    where: {
      studentId,
      lesson: { chapter: { subjectId, grade } },
    },
  });

  const totalCount = await app.prisma.lesson.count({
    where: { status: "PUBLISHED", chapter: { subjectId, grade } },
  });

  await app.prisma.studentProgress.upsert({
    where: {
      studentId_subjectCode_grade_academicYear: {
        studentId,
        subjectCode: subject.code,
        grade,
        academicYear,
      },
    },
    create: {
      studentId,
      subjectCode: subject.code,
      grade,
      academicYear,
      lessonsCompleted: completedCount,
      totalLessons: totalCount,
      lastActivityAt: new Date(),
    },
    update: {
      lessonsCompleted: completedCount,
      totalLessons: totalCount,
      lastActivityAt: new Date(),
    },
  });
}

async function awardPoints(
  app: FastifyInstance,
  studentId: string,
  points: number,
  reason: string,
  entityId?: string
) {
  const existing = await app.prisma.learningPoints.findUnique({
    where: { studentId },
  });

  if (!existing) return;

  const newTotal = existing.totalPoints + points;
  const newLevel = calculateLevel(newTotal);

  await app.prisma.learningPoints.update({
    where: { studentId },
    data: {
      totalPoints: { increment: points },
      weeklyPoints: { increment: points },
      monthlyPoints: { increment: points },
      level: newLevel,
      levelName: getLevelName(newLevel),
      transactions: {
        create: { points, reason, entityId },
      },
    },
  });
}

async function updateStreak(app: FastifyInstance, studentId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = await app.prisma.learningStreak.findUnique({
    where: { studentId },
  });

  if (!streak) {
    await app.prisma.learningStreak.create({
      data: { studentId, currentStreak: 1, longestStreak: 1, lastActiveDate: today },
    });
    return;
  }

  const lastDate = streak.lastActiveDate;
  if (!lastDate) {
    await app.prisma.learningStreak.update({
      where: { studentId },
      data: { currentStreak: 1, lastActiveDate: today },
    });
    return;
  }

  const daysDiff = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 0) return; // already updated today
  if (daysDiff === 1) {
    const newStreak = streak.currentStreak + 1;
    await app.prisma.learningStreak.update({
      where: { studentId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActiveDate: today,
      },
    });
  } else {
    await app.prisma.learningStreak.update({
      where: { studentId },
      data: { currentStreak: 1, lastActiveDate: today },
    });
  }
}

async function checkAndAwardBadges(app: FastifyInstance, studentId: string) {
  const [points, streak, completions] = await Promise.all([
    app.prisma.learningPoints.findUnique({ where: { studentId } }),
    app.prisma.learningStreak.findUnique({ where: { studentId } }),
    app.prisma.lessonCompletion.count({ where: { studentId } }),
  ]);

  const allBadges = await app.prisma.badge.findMany();
  const earnedBadgeIds = (
    await app.prisma.studentBadge.findMany({
      where: { studentId },
      select: { badgeId: true },
    })
  ).map((b) => b.badgeId);

  for (const badge of allBadges) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    const criteria = badge.criteria as any;
    if (!criteria) continue;

    let shouldAward = false;
    if (criteria.type === "streak" && streak && streak.currentStreak >= criteria.value) {
      shouldAward = true;
    } else if (criteria.type === "lessons" && completions >= criteria.value) {
      shouldAward = true;
    } else if (criteria.type === "points" && points && points.totalPoints >= criteria.value) {
      shouldAward = true;
    }

    if (shouldAward) {
      await app.prisma.studentBadge.create({
        data: { studentId, badgeId: badge.id, context: `Earned via ${criteria.type}` },
      });
    }
  }
}

function calculateLevel(totalPoints: number): number {
  if (totalPoints < 100) return 1;
  if (totalPoints < 300) return 2;
  if (totalPoints < 600) return 3;
  if (totalPoints < 1000) return 4;
  if (totalPoints < 1500) return 5;
  if (totalPoints < 2500) return 6;
  if (totalPoints < 4000) return 7;
  if (totalPoints < 6000) return 8;
  if (totalPoints < 9000) return 9;
  return 10;
}

function getLevelName(level: number): string {
  const names = [
    "नवशिक्या",      // Beginner
    "विद्यार्थी",    // Student
    "जिज्ञासू",      // Curious
    "अभ्यासक",       // Scholar
    "हुशार",         // Smart
    "प्रतिभावान",    // Talented
    "तज्ञ",          // Expert
    "गुणवान",        // Gifted
    "विचारवंत",      // Thinker
    "विद्यासेतू तारा", // VidyaSetu Star
  ];
  return names[level - 1] ?? "विद्यासेतू तारा";
}

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}
