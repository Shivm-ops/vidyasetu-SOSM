import { FastifyInstance } from "fastify";
import { z } from "zod";
import { purgeExpiredData } from "../services/retention.js";

const consentSchema = z.object({
  studentId: z.string().uuid(),
  consentVersion: z.string().default("1.0"),
  consentMethod: z.enum(["OTP_VERIFIED", "SCHOOL_FORM", "DIGITAL_SIGNATURE"]),
  dataCategories: z.array(z.string()).default(["academic", "attendance", "behavioral"]),
});

const deletionRequestSchema = z.object({
  reason: z.string().max(1000).optional(),
});

const grievanceSchema = z.object({
  subject: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
});

const resolveGrievanceSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  resolution: z.string().min(5).max(5000).optional(),
});

export async function complianceRoutes(app: FastifyInstance) {
  const authenticate = { preHandler: [app.authenticate] };

  // POST /api/v1/compliance/consent
  app.post("/consent", authenticate, async (request, reply) => {
    const body = consentSchema.parse(request.body);
    const userId = request.user!.userId;

    // Check if the student exists and is linked to parent if parent
    const student = await app.prisma.student.findUnique({
      where: { id: body.studentId },
    });

    if (!student) {
      return reply.code(404).send({ success: false, message: "Student not found" });
    }

    if (request.user!.role === "PARENT") {
      const parent = await app.prisma.parent.findFirst({ where: { userId } });
      if (!parent) {
        return reply.code(403).send({ success: false, message: "Parent profile not found" });
      }

      const link = await app.prisma.parentStudent.findFirst({
        where: { parentId: parent.id, studentId: body.studentId },
      });

      if (!link) {
        return reply.code(403).send({ success: false, message: "Not authorized to give consent for this student" });
      }
    }

    const consent = await app.prisma.parentConsent.create({
      data: {
        studentId: body.studentId,
        parentUserId: userId,
        consentVersion: body.consentVersion,
        consentGivenAt: new Date(),
        consentMethod: body.consentMethod,
        ipAddress: request.ip,
        dataCategories: body.dataCategories,
        legalBasis: "CONSENT",
      },
    });

    // Write to audit log (DPDP-006)
    await app.prisma.auditLog.create({
      data: {
        userId,
        action: "CREATE",
        entityType: "ParentConsent",
        entityId: consent.id,
        newValue: consent as any,
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
        purpose: "RECORD_PARENTAL_CONSENT",
        outcome: "SUCCESS",
        dataAccessed: ["consentMethod", "consentVersion"],
      },
    });

    return reply.status(201).send({
      success: true,
      message: "Parent consent recorded successfully.",
      data: consent,
    });
  });

  // POST /api/v1/compliance/request-deletion
  app.post("/request-deletion", authenticate, async (request, reply) => {
    const body = deletionRequestSchema.parse(request.body);
    const userId = request.user!.userId;

    await app.prisma.$transaction([
      app.prisma.dataDeletionRequest.create({
        data: {
          userId,
          status: "PENDING",
          reason: body.reason,
        },
      }),
      app.prisma.user.update({
        where: { id: userId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      }),
      app.prisma.userSession.deleteMany({
        where: { userId },
      }),
    ]);

    // Write audit log
    await app.prisma.auditLog.create({
      data: {
        userId,
        action: "DELETE",
        entityType: "User",
        entityId: userId,
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
        purpose: "REQUEST_DATA_DELETION",
        outcome: "SUCCESS",
      },
    });

    return reply.send({
      success: true,
      message: "Data deletion request received. Account has been soft-deleted and scheduled for purge in 90 days.",
    });
  });

  // POST /api/v1/compliance/purge-expired
  app.post(
    "/purge-expired",
    { preHandler: [app.authenticate, app.authorizeRoles("SUPER_ADMIN")] },
    async (request, reply) => {
      const { purgedCount } = await purgeExpiredData();

      await app.prisma.auditLog.create({
        data: {
          userId: request.user!.userId,
          action: "DELETE",
          entityType: "System",
          purpose: "PURGE_EXPIRED_DATA",
          outcome: "SUCCESS",
          ipAddress: request.ip,
          newValue: { purgedCount } as any,
        },
      });

      return reply.send({
        success: true,
        message: `Successfully purged ${purgedCount} soft-deleted user records.`,
      });
    }
  );

  // POST /api/v1/compliance/grievance
  app.post("/grievance", authenticate, async (request, reply) => {
    const body = grievanceSchema.parse(request.body);
    const userId = request.user!.userId;

    const ticket = await app.prisma.grievanceTicket.create({
      data: {
        userId,
        subject: body.subject,
        description: body.description,
        status: "OPEN",
      },
    });

    return reply.status(201).send({
      success: true,
      message: "Grievance ticket registered successfully.",
      data: ticket,
    });
  });

  // GET /api/v1/compliance/grievance
  app.get("/grievance", authenticate, async (request, reply) => {
    const { userId, role, schoolId } = request.user!;

    let tickets;
    if (role === "SUPER_ADMIN") {
      tickets = await app.prisma.grievanceTicket.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "TEACHER" || role === "SCHOOL_ADMIN" || role === "PRINCIPAL") {
      tickets = await app.prisma.grievanceTicket.findMany({
        where: {
          user: { schoolId },
        },
        include: {
          user: { select: { firstName: true, lastName: true, role: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Students and parents can only see their own tickets
      tickets = await app.prisma.grievanceTicket.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    }

    return reply.send({ success: true, data: tickets });
  });

  // PATCH /api/v1/compliance/grievance/:id
  app.patch("/grievance/:id", {
    preHandler: [app.authenticate, app.authorizeRoles("SUPER_ADMIN", "TEACHER", "SCHOOL_ADMIN", "PRINCIPAL")]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = resolveGrievanceSchema.parse(request.body);
    const resolverUserId = request.user!.userId;

    const ticket = await app.prisma.grievanceTicket.findUnique({ where: { id } });
    if (!ticket) {
      return reply.code(404).send({ success: false, message: "Grievance ticket not found" });
    }

    // Teachers/admins can only resolve tickets from their school
    if (request.user!.role !== "SUPER_ADMIN") {
      const ticketCreator = await app.prisma.user.findUnique({
        where: { id: ticket.userId },
        select: { schoolId: true }
      });
      if (ticketCreator?.schoolId !== request.user!.schoolId) {
        return reply.code(403).send({ success: false, message: "Not authorized to modify tickets outside your school" });
      }
    }

    const updated = await app.prisma.grievanceTicket.update({
      where: { id },
      data: {
        status: body.status,
        resolution: body.resolution,
        resolvedById: resolverUserId,
        resolvedAt: ["RESOLVED", "CLOSED"].includes(body.status) ? new Date() : null,
      },
    });

    return reply.send({
      success: true,
      message: "Grievance ticket updated successfully.",
      data: updated,
    });
  });
}
