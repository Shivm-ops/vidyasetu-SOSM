import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { JWTPayload } from "../types/index.js";
import { randomInt } from "crypto";

const loginSchema = z.object({
  identifier: z.string().min(1),  // phone or email
  password: z.string().min(6),
  deviceId: z.string().optional(),
});

const registerStudentSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  firstNameMarathi: z.string().optional(),
  lastNameMarathi: z.string().optional(),
  grade: z.number().int().min(1).max(12),
  schoolId: z.string().uuid(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.string().datetime().optional(),
  parentPhone: z.string().optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const sendOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  purpose: z.enum(["LOGIN", "REGISTER", "RESET_PASSWORD"]),
});

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
  purpose: z.enum(["LOGIN", "REGISTER", "RESET_PASSWORD"]),
});

export async function authRoutes(app: FastifyInstance) {
  // POST /api/v1/auth/login
  app.post("/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const failKey = `login_fail:${body.identifier}`;
    const failures = parseInt((await app.redis.get(failKey)) ?? "0", 10);
    if (failures >= 5) {
      return reply.code(429).send({
        success: false,
        message: "Account temporarily locked due to too many failed login attempts. Try again in 15 minutes."
      });
    }

    const user = await app.prisma.user.findFirst({
      where: {
        OR: [
          { phone: body.identifier },
          { email: body.identifier },
        ],
        isActive: true,
        isDeleted: false,
      },
      include: {
        student: { select: { id: true, grade: true, stage: true, studentId: true } },
        teacher: { select: { id: true, employeeId: true } },
        parent: { select: { id: true } },
        schoolAdmin: { select: { id: true, role: true } },
      },
    });

    if (!user || !user.passwordHash) {
      await app.redis.multi().incr(failKey).expire(failKey, 900).exec();
      return reply.code(401).send({ success: false, message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(body.password, user.passwordHash);
    if (!isValid) {
      await app.redis.multi().incr(failKey).expire(failKey, 900).exec();
      return reply.code(401).send({ success: false, message: "Invalid credentials" });
    }

    await app.redis.del(failKey);

    const sessionId = crypto.randomUUID();
    const payload: JWTPayload = {
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId ?? undefined,
      sessionId,
    };

    const accessToken = app.jwt.sign(payload);
    const refreshToken = app.jwt.sign(
      { ...payload, type: "refresh" },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d" }
    );

    // Store session
    await app.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken,
        sessionId,
        deviceId: body.deviceId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await app.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return reply.send({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          firstNameMarathi: user.firstNameMarathi,
          profilePhotoUrl: user.profilePhotoUrl,
          preferredLanguage: user.preferredLanguage,
          schoolId: user.schoolId,
          student: user.student,
          teacher: user.teacher,
          parent: user.parent,
          schoolAdmin: user.schoolAdmin,
        },
      },
    });
  });

  // POST /api/v1/auth/register/student
  app.post("/register/student", async (request, reply) => {
    const body = registerStudentSchema.parse(request.body);

    const existing = await app.prisma.user.findFirst({
      where: { phone: body.phone },
    });
    if (existing) {
      return reply.code(409).send({ success: false, message: "Phone already registered" });
    }

    const passwordHash = await bcrypt.hash(
      body.password,
      parseInt(process.env.BCRYPT_ROUNDS ?? "12")
    );

    const stage =
      body.grade <= 4 ? "FOUNDATION" : body.grade <= 8 ? "DISCOVERY" : "CAREER";

    const result = await app.prisma.$queryRaw<[{ nextval: bigint }]>`
      SELECT nextval('student_id_seq')
    `;
    const seq = result[0].nextval;
    const studentId = `VS-${new Date().getFullYear()}-${String(seq).padStart(5, "0")}`;

    const user = await app.prisma.user.create({
      data: {
        role: "STUDENT",
        phone: body.phone,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        firstNameMarathi: body.firstNameMarathi,
        lastNameMarathi: body.lastNameMarathi,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        schoolId: body.schoolId,
        student: {
          create: {
            studentId,
            grade: body.grade,
            stage: stage as any,
          },
        },
      },
      include: {
        student: true,
      },
    });

    // Initialize gamification
    await Promise.all([
      app.prisma.learningPoints.create({
        data: { studentId: user.student!.id, totalPoints: 0 },
      }),
      app.prisma.learningStreak.create({
        data: { studentId: user.student!.id },
      }),
      app.prisma.skillPassport.create({
        data: { studentId: user.student!.id },
      }),
    ]);

    return reply.code(201).send({
      success: true,
      message: "Registration successful",
      data: { userId: user.id, studentId },
    });
  });

  // POST /api/v1/auth/refresh
  app.post("/refresh", async (request, reply) => {
    const { refreshToken } = refreshSchema.parse(request.body);

    let payload: JWTPayload & { type?: string };
    try {
      payload = app.jwt.verify(refreshToken) as any;
    } catch {
      return reply.code(401).send({ success: false, message: "Invalid refresh token" });
    }

    if (payload.type !== "refresh") {
      return reply.code(401).send({ success: false, message: "Invalid token type" });
    }

    const session = await app.prisma.userSession.findUnique({
      where: { refreshToken },
    });

    if (!session || session.expiresAt < new Date()) {
      return reply.code(401).send({ success: false, message: "Session expired" });
    }

    const newSessionId = crypto.randomUUID();
    const newPayload: JWTPayload = {
      userId: payload.userId,
      role: payload.role,
      schoolId: payload.schoolId,
      sessionId: newSessionId,
    };

    const newAccessToken = app.jwt.sign(newPayload);
    const newRefreshToken = app.jwt.sign(
      { ...newPayload, type: "refresh" },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d" }
    );

    await app.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        sessionId: newSessionId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return reply.send({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  });

  // POST /api/v1/auth/logout
  app.post(
    "/logout",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      if (!request.user) return reply.code(401).send({ success: false });

      // Blacklist session
      await app.redis.setex(
        `blacklist:${request.user.sessionId}`,
        15 * 60, // 15 mins (matches access token expiry)
        "1"
      );

      await app.prisma.userSession.deleteMany({
        where: { userId: request.user.userId },
      });

      return reply.send({ success: true, message: "Logged out successfully" });
    }
  );

  // POST /api/v1/auth/send-otp
  app.post("/send-otp", async (request, reply) => {
    const { phone, purpose } = sendOtpSchema.parse(request.body);
    const otp = randomInt(100000, 1000000).toString();

    await app.redis.setex(`otp:${phone}:${purpose}`, 600, otp); // 10 min

    // In production: send via SMS service
    app.log.info({ phone, otp, purpose }, "OTP generated");

    return reply.send({
      success: true,
      message: "OTP sent successfully",
      // Remove in production:
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  });

  // POST /api/v1/auth/verify-otp
  app.post("/verify-otp", async (request, reply) => {
    const { phone, otp, purpose } = verifyOtpSchema.parse(request.body);
    const attemptsKey = `otp_attempts:${phone}:${purpose}`;

    const attempts = parseInt((await app.redis.get(attemptsKey)) ?? "0", 10);
    if (attempts >= 3) {
      return reply.code(429).send({
        success: false,
        message: "OTP verification locked due to too many failed attempts.",
      });
    }

    const stored = await app.redis.get(`otp:${phone}:${purpose}`);

    if (!stored || stored !== otp) {
      await app.redis.multi().incr(attemptsKey).expire(attemptsKey, 600).exec();
      const remaining = 3 - (attempts + 1);
      return reply.code(400).send({
        success: false,
        message: `Invalid or expired OTP. ${remaining} attempts remaining.`,
      });
    }

    await app.redis.del(`otp:${phone}:${purpose}`);
    await app.redis.del(attemptsKey);
    const verifiedToken = app.jwt.sign(
      { phone, purpose, verified: true },
      { expiresIn: "10m" }
    );

    return reply.send({
      success: true,
      data: { verifiedToken },
    });
  });

  // GET /api/v1/auth/me
  app.get(
    "/me",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const user = await app.prisma.user.findUnique({
        where: { id: request.user!.userId },
        include: {
          student: {
            include: {
              learningPoints: true,
              skillPassport: true,
            },
          },
          teacher: true,
          parent: {
            include: {
              children: {
                include: {
                  student: { include: { user: true } },
                },
              },
            },
          },
        },
      });

      if (!user) {
        return reply.code(404).send({ success: false, message: "User not found" });
      }

      delete (user as any).passwordHash;
      if (user.parent?.children) {
        for (const childLink of user.parent.children) {
          if (childLink.student?.user) {
            delete (childLink.student.user as any).passwordHash;
          }
        }
      }

      return reply.send({ success: true, data: user });
    }
  );
}
