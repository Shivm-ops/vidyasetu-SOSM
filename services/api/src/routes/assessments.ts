import { FastifyInstance } from "fastify";
import { z } from "zod";
import { assertStudentAccess } from "../middleware/security.js";

const submitAttemptSchema = z.object({
  answers: z.array(
    z.object({
      assessmentItemId: z.string().uuid(),
      answerText: z.string().optional(),
      answerOptionId: z.string().optional(),
    })
  ),
  timeSpentSecs: z.number().int().min(0),
});

export async function assessmentRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  // GET /api/v1/assessments?grade=8&subjectCode=MATH
  app.get("/", authenticate, async (request, reply) => {
    const { grade, subjectCode, type } = request.query as {
      grade?: number;
      subjectCode?: string;
      type?: string;
    };

    const assessments = await app.prisma.assessment.findMany({
      where: {
        isPublished: true,
        ...(grade && { grade: Number(grade) }),
        ...(subjectCode && { subjectCode }),
        ...(type && { assessmentType: type as any }),
        OR: [
          { startTime: null },
          { startTime: { lte: new Date() } },
        ],
      },
      include: {
        _count: { select: { items: true, attempts: true } },
        createdBy: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reply.send({ success: true, data: assessments });
  });

  // GET /api/v1/assessments/:id
  app.get("/:id", authenticate, async (request, reply) => {
    const { id } = request.params as { id: string };

    const assessment = await app.prisma.assessment.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            question: {
              select: {
                id: true,
                questionType: true,
                questionText: true,
                questionTextMarathi: true,
                questionImageUrl: true,
                options: true,
                timeSeconds: true,
                difficulty: true,
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!assessment) {
      return reply.code(404).send({ success: false, message: "Assessment not found" });
    }

    // Randomize if needed
    if (assessment.isRandomized) {
      assessment.items.sort(() => Math.random() - 0.5);
    }

    // Remove correct answers from response
    const sanitized = {
      ...assessment,
      items: assessment.items.map((item) => ({
        ...item,
        question: {
          ...item.question,
          options: Array.isArray(item.question.options)
            ? (item.question.options as any[]).map(({ isCorrect, explanation, ...opt }) => opt)
            : item.question.options,
        },
      })),
    };

    return reply.send({ success: true, data: sanitized });
  });

  // POST /api/v1/assessments/:id/start
  app.post("/:id/start", authenticate, async (request, reply) => {
    const { id: assessmentId } = request.params as { id: string };
    const userId = request.user!.userId;

    const student = await app.prisma.student.findFirst({ where: { userId } });
    if (!student) {
      return reply.code(403).send({ success: false, message: "Only students can take assessments" });
    }

    const existing = await app.prisma.assessmentAttempt.findFirst({
      where: {
        studentId: student.id,
        assessmentId,
        submittedAt: null,
      },
    });

    if (existing) {
      return reply.send({ success: true, data: existing });
    }

    const attempt = await app.prisma.assessmentAttempt.create({
      data: { studentId: student.id, assessmentId },
    });

    return reply.code(201).send({ success: true, data: attempt });
  });

  // POST /api/v1/assessments/:id/submit
  app.post("/:id/submit", authenticate, async (request, reply) => {
    const { id: assessmentId } = request.params as { id: string };
    const body = submitAttemptSchema.parse(request.body);
    const userId = request.user!.userId;

    const student = await app.prisma.student.findFirst({ where: { userId } });
    if (!student) {
      return reply.code(403).send({ success: false, message: "Student not found" });
    }

    const attempt = await app.prisma.assessmentAttempt.findFirst({
      where: { studentId: student.id, assessmentId, submittedAt: null },
    });

    if (!attempt) {
      return reply.code(404).send({ success: false, message: "No active attempt found" });
    }

    const assessment = await app.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        items: {
          include: { question: true },
        },
      },
    });

    if (!assessment) {
      return reply.code(404).send({ success: false, message: "Assessment not found" });
    }

    // Grade answers
    let totalEarned = 0;
    const answerRecords = body.answers.map((ans) => {
      const item = assessment.items.find((i) => i.id === ans.assessmentItemId);
      if (!item) return null;

      const question = item.question;
      let isCorrect = false;
      let marksAwarded = 0;

      if (question.questionType === "MCQ" && ans.answerOptionId) {
        const options = question.options as any[];
        const selected = options?.find((o: any) => o.id === ans.answerOptionId);
        isCorrect = selected?.isCorrect ?? false;
      } else if (
        ["TRUE_FALSE", "FILL_BLANK"].includes(question.questionType) &&
        ans.answerText
      ) {
        isCorrect =
          question.correctAnswer?.toLowerCase() === ans.answerText.toLowerCase();
      }

      if (isCorrect) {
        marksAwarded = item.marks;
        totalEarned += marksAwarded;
      }

      return {
        attemptId: attempt.id,
        assessmentItemId: ans.assessmentItemId,
        answerText: ans.answerText,
        answerOptionId: ans.answerOptionId,
        isCorrect,
        marksAwarded,
      };
    }).filter(Boolean);

    const percentScore = (totalEarned / assessment.totalMarks) * 100;
    const isPassed = totalEarned >= assessment.passingMarks;

    await app.prisma.$transaction([
      app.prisma.studentAnswer.createMany({
        data: answerRecords as any,
        skipDuplicates: true,
      }),
      app.prisma.assessmentAttempt.update({
        where: { id: attempt.id },
        data: {
          submittedAt: new Date(),
          timeSpentSecs: body.timeSpentSecs,
          marksObtained: totalEarned,
          percentScore,
          isPassed,
        },
      }),
    ]);

    // Award points for quiz
    const pointsEarned = isPassed ? Math.round(percentScore / 5) : 2;
    const lp = await app.prisma.learningPoints.findUnique({
      where: { studentId: student.id },
    });
    if (lp) {
      await app.prisma.learningPoints.update({
        where: { studentId: student.id },
        data: {
          totalPoints: { increment: pointsEarned },
          weeklyPoints: { increment: pointsEarned },
          transactions: {
            create: {
              points: pointsEarned,
              reason: isPassed ? "QUIZ_PASS" : "QUIZ_ATTEMPT",
              entityId: assessmentId,
            },
          },
        },
      });
    }

    return reply.send({
      success: true,
      data: {
        marksObtained: totalEarned,
        totalMarks: assessment.totalMarks,
        percentScore: Math.round(percentScore),
        isPassed,
        pointsEarned,
      },
    });
  });

  // GET /api/v1/assessments/:id/results/:studentId
  app.get("/:id/results/:studentId", authenticate, async (request, reply) => {
    const { id: assessmentId, studentId } = request.params as {
      id: string;
      studentId: string;
    };
    await assertStudentAccess(app, request, studentId);

    const attempt = await app.prisma.assessmentAttempt.findFirst({
      where: { assessmentId, studentId, submittedAt: { not: null } },
      include: {
        answers: {
          include: {
            assessmentItem: {
              include: {
                question: {
                  select: {
                    questionText: true,
                    questionTextMarathi: true,
                    options: true,
                    correctAnswer: true,
                    explanation: true,
                    explanationMarathi: true,
                  },
                },
              },
            },
          },
        },
        assessment: true,
      },
      orderBy: { submittedAt: "desc" },
    });

    if (!attempt) {
      return reply.code(404).send({ success: false, message: "Attempt not found" });
    }

    return reply.send({ success: true, data: attempt });
  });
}
