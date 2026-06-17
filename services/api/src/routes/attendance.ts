import { FastifyInstance } from "fastify";
import { z } from "zod";

const markAttendanceSchema = z.object({
  sectionId: z.string().uuid(),
  date: z.string().datetime(),
  records: z.array(
    z.object({
      studentId: z.string().uuid(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY"]),
      remarks: z.string().optional(),
    })
  ),
});

export async function attendanceRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  // POST /api/v1/attendance/mark - Teacher marks attendance
  app.post("/mark", authenticate, async (request, reply) => {
    const body = markAttendanceSchema.parse(request.body);
    const teacherId = request.user!.userId;

    const teacher = await app.prisma.teacher.findFirst({
      where: { userId: teacherId },
    });
    if (!teacher) {
      return reply.code(403).send({ success: false, message: "Teacher not found" });
    }

    const date = new Date(body.date);
    date.setHours(0, 0, 0, 0);

    // Upsert all attendance records in a transaction
    const results = await app.prisma.$transaction(
      body.records.map((r) =>
        app.prisma.attendanceRecord.upsert({
          where: {
            studentId_sectionId_date: {
              studentId: r.studentId,
              sectionId: body.sectionId,
              date,
            },
          },
          create: {
            studentId: r.studentId,
            sectionId: body.sectionId,
            date,
            status: r.status,
            takenById: teacher.id,
            remarks: r.remarks,
          },
          update: {
            status: r.status,
            takenById: teacher.id,
            remarks: r.remarks,
          },
        })
      )
    );

    // Send absent notifications to parents
    const absentStudents = body.records.filter((r) => r.status === "ABSENT");
    if (absentStudents.length > 0) {
      await app.redis.lpush(
        "notifications:attendance",
        JSON.stringify({
          type: "ABSENT_ALERT",
          date: date.toISOString(),
          studentIds: absentStudents.map((s) => s.studentId),
        })
      );
    }

    return reply.send({
      success: true,
      message: `Attendance marked for ${results.length} students`,
      data: { count: results.length },
    });
  });

  // GET /api/v1/attendance/section/:sectionId
  app.get("/section/:sectionId", authenticate, async (request, reply) => {
    const { sectionId } = request.params as { sectionId: string };
    const { date, month, year } = request.query as {
      date?: string;
      month?: number;
      year?: number;
    };

    let dateFilter: any = {};

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      dateFilter = {
        gte: d,
        lt: new Date(d.getTime() + 24 * 60 * 60 * 1000),
      };
    } else if (month && year) {
      dateFilter = {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      };
    }

    const records = await app.prisma.attendanceRecord.findMany({
      where: {
        sectionId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
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
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return reply.send({ success: true, data: records });
  });

  // GET /api/v1/attendance/student/:studentId/summary
  app.get("/student/:studentId/summary", authenticate, async (request, reply) => {
    const { studentId } = request.params as { studentId: string };
    const { academicYear = getCurrentAcademicYear() } = request.query as {
      academicYear?: string;
    };

    const [yearStart] = academicYear.split("-");
    const fromDate = new Date(parseInt(yearStart), 5, 1); // June 1
    const toDate = new Date();

    const records = await app.prisma.attendanceRecord.groupBy({
      by: ["status"],
      where: {
        studentId,
        date: { gte: fromDate, lte: toDate },
      },
      _count: { _all: true },
    });

    const summary = records.reduce(
      (acc, r) => ({ ...acc, [r.status]: r._count._all }),
      {} as Record<string, number>
    );
    const total = Object.values(summary).reduce((a, b) => a + b, 0);
    const present = (summary.PRESENT ?? 0) + (summary.LATE ?? 0);
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return reply.send({
      success: true,
      data: { summary, total, present, percentage, academicYear },
    });
  });
}

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}
