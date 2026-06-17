import { FastifyInstance } from "fastify";

export async function analyticsRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  app.get("/school/:schoolId", authenticate, async (request, reply) => {
    const { schoolId } = request.params as { schoolId: string };

    const [snapshots, gradeWise, topStudents] = await Promise.all([
      app.prisma.schoolAnalyticsSnapshot.findMany({
        where: { schoolId },
        orderBy: { snapshotDate: "desc" },
        take: 30,
      }),
      app.prisma.student.groupBy({
        by: ["grade"],
        where: { user: { schoolId } },
        _count: { _all: true },
        orderBy: { grade: "asc" },
      }),
      app.prisma.learningPoints.findMany({
        where: {
          student: { user: { schoolId } },
        },
        orderBy: { totalPoints: "desc" },
        take: 10,
        include: {
          student: {
            include: {
              user: {
                select: { firstName: true, lastName: true, firstNameMarathi: true },
              },
            },
          },
        },
      }),
    ]);

    return reply.send({
      success: true,
      data: { snapshots, gradeWise, topStudents },
    });
  });

  app.get("/district/:districtId", authenticate, async (request, reply) => {
    const { districtId } = request.params as { districtId: string };

    const schools = await app.prisma.school.findMany({
      where: { districtId, isActive: true },
      include: {
        analyticsSnapshot: {
          orderBy: { snapshotDate: "desc" },
          take: 1,
        },
        _count: { select: { users: true } },
      },
    });

    return reply.send({ success: true, data: schools });
  });

  // GET /api/v1/analytics/admin (Phase 3 Intelligence Analytics)
  app.get("/admin", authenticate, async (request, reply) => {
    // 1. Most Weak Concepts (Count of students with NOT_STARTED or LEARNING)
    const weakConceptsRaw = await app.prisma.studentConceptMastery.groupBy({
      by: ["conceptId"],
      where: { status: { in: ["NOT_STARTED", "LEARNING"] } },
      _count: { _all: true },
      orderBy: { _count: { conceptId: "desc" } },
      take: 5
    });
    
    // Fetch names for these concepts
    const concepts = await app.prisma.concept.findMany({
      where: { id: { in: weakConceptsRaw.map(c => c.conceptId) } },
      select: { id: true, name: true }
    });
    const weakConcepts = weakConceptsRaw.map(wc => ({
      conceptName: concepts.find(c => c.id === wc.conceptId)?.name || "Unknown",
      count: wc._count._all
    }));

    // 2. Most Popular Skills
    const popularSkillsRaw = await app.prisma.skillEnrollment.groupBy({
      by: ["skillPathId"],
      _count: { _all: true },
      orderBy: { _count: { skillPathId: "desc" } },
      take: 5
    });
    
    const skills = await app.prisma.skillPath.findMany({
      where: { id: { in: popularSkillsRaw.map(s => s.skillPathId) } },
      select: { id: true, name: true }
    });
    const popularSkills = popularSkillsRaw.map(ps => ({
      skillName: skills.find(s => s.id === ps.skillPathId)?.name || "Unknown",
      enrollments: ps._count._all
    }));

    // 3. Most Popular Careers (Mocked traversal from DNA Profiles for speed)
    const popularCareers = [
      { name: "Software Engineer", interestCount: 450 },
      { name: "Agriculture Scientist", interestCount: 380 },
      { name: "Civil Engineer", interestCount: 290 },
      { name: "Doctor", interestCount: 250 },
      { name: "Teacher", interestCount: 150 }
    ];

    // 4. Village Performance Ranking (Mocked)
    const villageRanking = [
      { villageName: "Shirur", impactScore: 8500 },
      { villageName: "Baramati", impactScore: 7200 },
      { villageName: "Junnar", impactScore: 6100 },
      { villageName: "Bhor", impactScore: 4500 }
    ];

    return reply.send({
      success: true,
      data: {
        weakConcepts,
        popularSkills,
        popularCareers,
        villageRanking
      }
    });
  });

  // Cron-style endpoint to refresh snapshots (called by background job)
  app.post("/snapshots/refresh", authenticate, async (request, reply) => {
    const schools = await app.prisma.school.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updates = await Promise.allSettled(
      schools.map(async (school) => {
        const [totalStudents, presentToday, lessonsCompleted, activeStudents] =
          await Promise.all([
            app.prisma.student.count({ where: { user: { schoolId: school.id } } }),
            app.prisma.attendanceRecord.count({
              where: { section: { classGrade: { schoolId: school.id } }, date: today, status: "PRESENT" },
            }),
            app.prisma.lessonCompletion.count({
              where: {
                student: { user: { schoolId: school.id } },
                completedAt: { gte: today },
              },
            }),
            app.prisma.lessonCompletion.groupBy({
              by: ["studentId"],
              where: {
                student: { user: { schoolId: school.id } },
                completedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
              },
            }).then((r) => r.length),
          ]);

        const attendancePct = totalStudents > 0 ? (presentToday / totalStudents) * 100 : 0;

        return app.prisma.schoolAnalyticsSnapshot.upsert({
          where: { schoolId_snapshotDate: { schoolId: school.id, snapshotDate: today } },
          create: {
            schoolId: school.id,
            snapshotDate: today,
            totalStudents,
            presentToday,
            avgAttendancePct: attendancePct,
            lessonsCompleted,
            activeStudents,
          },
          update: {
            totalStudents,
            presentToday,
            avgAttendancePct: attendancePct,
            lessonsCompleted,
            activeStudents,
          },
        });
      })
    );

    const succeeded = updates.filter((r) => r.status === "fulfilled").length;
    return reply.send({ success: true, data: { refreshed: succeeded, total: schools.length } });
  });
}
