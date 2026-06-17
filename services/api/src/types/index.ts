import { FastifyRequest } from "fastify";
import { UserRole, Language } from "@vidyasetu/db";

export interface JWTPayload {
  userId: string;
  role: UserRole;
  schoolId?: string;
  sessionId: string;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: JWTPayload;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  file: NodeJS.ReadableStream;
}

export type SupportedLanguage = "mr" | "en" | "hi";

declare module "fastify" {
  interface FastifyRequest {
    lang?: SupportedLanguage;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: JWTPayload;
  }
}
