import { FastifyInstance, FastifyRequest } from "fastify";

/**
 * Asserts that the authenticated user has access to view/mutate the specified student's data.
 * Throws a 403 Forbidden error if access is denied.
 */
export async function assertStudentAccess(
  app: FastifyInstance,
  request: FastifyRequest,
  studentId: string
): Promise<void> {
  const user = request.user;
  if (!user) {
    const err = new Error("Unauthorized") as any;
    err.statusCode = 401;
    throw err;
  }

  const { role, userId, schoolId } = user;

  // SUPER_ADMIN has global access
  if (role === "SUPER_ADMIN") {
    return;
  }

  if (role === "STUDENT") {
    const student = await app.prisma.student.findFirst({
      where: { id: studentId, userId },
    });
    if (!student) {
      const err = new Error("Forbidden: Cannot access other student's data") as any;
      err.statusCode = 403;
      throw err;
    }
    return;
  }

  if (role === "TEACHER" || role === "SCHOOL_ADMIN" || role === "PRINCIPAL") {
    if (!schoolId) {
      const err = new Error("Forbidden: School ID not set for staff") as any;
      err.statusCode = 403;
      throw err;
    }
    const student = await app.prisma.student.findFirst({
      where: {
        id: studentId,
        user: { schoolId },
      },
    });
    if (!student) {
      const err = new Error("Forbidden: Student does not belong to your school") as any;
      err.statusCode = 403;
      throw err;
    }
    return;
  }

  if (role === "PARENT") {
    const parent = await app.prisma.parent.findFirst({
      where: { userId },
    });
    if (!parent) {
      const err = new Error("Forbidden: Parent record not found") as any;
      err.statusCode = 403;
      throw err;
    }

    const link = await app.prisma.parentStudent.findFirst({
      where: {
        parentId: parent.id,
        studentId,
      },
    });
    if (!link) {
      const err = new Error("Forbidden: Not linked to this student") as any;
      err.statusCode = 403;
      throw err;
    }
    return;
  }

  // Deny all other roles by default
  const err = new Error("Forbidden: Access denied for your role") as any;
  err.statusCode = 403;
  throw err;
}
