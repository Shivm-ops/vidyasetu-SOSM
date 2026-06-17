import { prisma, Prisma } from "@vidyasetu/db";

/**
 * Searches for users soft-deleted (isDeleted = true) more than 90 days ago
 * and permanently purges their PII and sensitive records, leaving only
 * anonymized statistics.
 */
export async function purgeExpiredData(): Promise<{ purgedCount: number }> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  // Find users marked deleted > 90 days ago
  const usersToDelete = await prisma.user.findMany({
    where: {
      isDeleted: true,
      deletedAt: { lt: ninetyDaysAgo },
    },
    select: {
      id: true,
      student: { select: { id: true } },
      teacher: { select: { id: true } },
      parent: { select: { id: true } },
    },
  });

  let purgedCount = 0;

  for (const user of usersToDelete) {
    const studentId = user.student?.id;
    const teacherId = user.teacher?.id;
    const parentId = user.parent?.id;

    // Retrieve AI Conversations for this user role
    const conversationWhere: any = {};
    if (studentId) conversationWhere.studentId = studentId;
    else if (teacherId) conversationWhere.teacherId = teacherId;
    else if (parentId) conversationWhere.parentId = parentId;

    let conversationIds: string[] = [];
    if (studentId || teacherId || parentId) {
      const conversations = await prisma.aIConversation.findMany({
        where: conversationWhere,
        select: { id: true },
      });
      conversationIds = conversations.map((c) => c.id);
    }

    await prisma.$transaction([
      // 1. Delete AI Messages and Feedback
      ...(conversationIds.length > 0
        ? [
            prisma.aIMessage.deleteMany({
              where: { conversationId: { in: conversationIds } },
            }),
            prisma.aIFeedback.deleteMany({
              where: { conversationId: { in: conversationIds } },
            }),
            prisma.aIConversation.deleteMany({
              where: { id: { in: conversationIds } },
            }),
          ]
        : []),

      // 2. Delete Student Mood Check-Ins
      ...(studentId
        ? [prisma.moodCheckIn.deleteMany({ where: { studentId } })]
        : []),

      // 3. Anonymize User PII
      prisma.user.update({
        where: { id: user.id },
        data: {
          phone: null,
          email: null,
          firstName: "DELETED",
          lastName: "USER",
          firstNameMarathi: null,
          lastNameMarathi: null,
          passwordHash: null,
          profilePhotoUrl: null,
          fcmToken: null,
          deviceInfo: Prisma.DbNull,
        },
      }),
    ]);

    purgedCount++;
  }

  return { purgedCount };
}
