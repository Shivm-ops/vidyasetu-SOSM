import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import { authPlugin } from "./plugins/auth.js";
import { redisPlugin } from "./plugins/redis.js";
import { dbPlugin } from "./plugins/db.js";

import { authRoutes } from "./routes/auth.js";
import { studentRoutes } from "./routes/students.js";
import { teacherRoutes } from "./routes/teachers.js";
import { schoolRoutes } from "./routes/schools.js";
import { curriculumRoutes } from "./routes/curriculum.js";
import { assessmentRoutes } from "./routes/assessments.js";
import { attendanceRoutes } from "./routes/attendance.js";
import { progressRoutes } from "./routes/progress.js";
import { careerRoutes } from "./routes/career.js";
import { communityRoutes } from "./routes/community.js";
import { wellbeingRoutes } from "./routes/wellbeing.js";
import { notificationRoutes } from "./routes/notifications.js";
import { analyticsRoutes } from "./routes/analytics.js";
import { uploadRoutes } from "./routes/uploads.js";
import { parentRoutes } from "./routes/parents.js";
import { complianceRoutes } from "./routes/compliance.js";
import intelligenceRoutes from "./routes/intelligence.js";

import { factoryRoutes } from "./routes/factory.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
      transport:
        process.env.NODE_ENV === "development"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    },
    trustProxy: true,
    bodyLimit: 10 * 1024 * 1024, // 10MB
  });

  // Security
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://fonts.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://cdn.vidyasetu.in"],
        connectSrc: ["'self'", process.env.AI_SERVICE_URL ?? "http://localhost:8000"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  });

  // CORS
  await app.register(cors, {
    origin: (process.env.CORS_ORIGINS ?? "").split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // Rate Limiting
  await app.register(rateLimit, {
    global: true,
    max: 200,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      success: false,
      message: "Too many requests. Please try again later.",
    }),
  });

  // File Upload
  await app.register(multipart, {
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  });

  // JWT
  await app.register(jwt, {
    secret: process.env.JWT_SECRET!,
    sign: { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRES_IN ?? "15m" },
    verify: { algorithms: ["HS256"] },
  });

  // OpenAPI / Swagger
  if (process.env.NODE_ENV !== "production") {
    await app.register(swagger, {
      openapi: {
        info: {
          title: "VidyaSetu API",
          description: "Bridging Knowledge, Skills, Career and Community",
          version: "1.0.0",
        },
        servers: [{ url: process.env.API_URL ?? "http://localhost:3001" }],
        components: {
          securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
          },
        },
      },
    });
    await app.register(swaggerUi, {
      routePrefix: "/docs",
      uiConfig: { docExpansion: "list" },
    });
  }

  // Custom Plugins
  await app.register(dbPlugin);
  await app.register(redisPlugin);
  await app.register(authPlugin);

  // Language detection hook
  app.addHook("onRequest", async (request) => {
    const lang = request.headers["accept-language"];
    if (lang?.startsWith("mr")) request.lang = "mr";
    else if (lang?.startsWith("hi")) request.lang = "hi";
    else request.lang = "en";
  });

  // Health check
  app.get("/health", { logLevel: "warn" }, async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION ?? "1.0.0",
  }));

  // API Routes
  const prefix = "/api/v1";
  await app.register(authRoutes, { prefix: `${prefix}/auth` });
  await app.register(studentRoutes, { prefix: `${prefix}/students` });
  await app.register(teacherRoutes, { prefix: `${prefix}/teachers` });
  await app.register(parentRoutes, { prefix: `${prefix}/parents` });
  await app.register(schoolRoutes, { prefix: `${prefix}/schools` });
  await app.register(curriculumRoutes, { prefix: `${prefix}/curriculum` });
  await app.register(assessmentRoutes, { prefix: `${prefix}/assessments` });
  await app.register(attendanceRoutes, { prefix: `${prefix}/attendance` });
  await app.register(progressRoutes, { prefix: `${prefix}/progress` });
  await app.register(careerRoutes, { prefix: `${prefix}/career` });
  await app.register(communityRoutes, { prefix: `${prefix}/community` });
  await app.register(wellbeingRoutes, { prefix: `${prefix}/wellbeing` });
  await app.register(notificationRoutes, { prefix: `${prefix}/notifications` });
  await app.register(analyticsRoutes, { prefix: `${prefix}/analytics` });
  await app.register(uploadRoutes, { prefix: `${prefix}/uploads` });
  await app.register(complianceRoutes, { prefix: `${prefix}/compliance` });
  await app.register(intelligenceRoutes, { prefix: `${prefix}/intelligence` });
  await app.register(factoryRoutes, { prefix: `${prefix}/factory` });

  return app;
}
