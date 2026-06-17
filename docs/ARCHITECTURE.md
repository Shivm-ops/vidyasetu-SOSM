# VIDYASETU — System Architecture

## Overview

VidyaSetu is a monorepo-based, microservices-ready educational platform built for scale:
- **5M+ Students** | **100K Teachers** | **500K Parents** | **10K Schools**
- **Marathi-first**, Offline-first, Mobile-first
- **DPDP Act 2023** compliant

---

## High-Level Architecture

```
                        ┌─────────────────────────────────────────────┐
                        │              CLIENTS                        │
                        │  Android App │ Smart TV │ PWA │ Web Portals │
                        └──────────────────┬──────────────────────────┘
                                           │
                        ┌──────────────────▼──────────────────────────┐
                        │            CLOUDFLARE CDN / WAF             │
                        └──────────────────┬──────────────────────────┘
                                           │
              ┌────────────────────────────┼───────────────────────────┐
              │                            │                           │
    ┌─────────▼──────────┐   ┌────────────▼───────┐   ┌──────────────▼─────┐
    │  Fastify API       │   │  FastAPI AI Service │   │  Next.js Web Apps  │
    │  :3001             │   │  :8000              │   │  :3000-3004        │
    │  (Node.js 20)      │   │  (Python 3.11)      │   │  (Next.js 14)      │
    └─────────┬──────────┘   └────────────┬────────┘   └────────────────────┘
              │                            │
    ┌─────────▼──────────┐   ┌────────────▼────────┐
    │  PostgreSQL 16     │   │  Qdrant Vector DB   │
    │  (Primary DB)      │   │  (RAG / Embeddings) │
    └────────────────────┘   └─────────────────────┘
              │
    ┌─────────▼──────────┐
    │  Redis 7           │
    │  (Cache / Sessions │
    │   / Queues)        │
    └────────────────────┘
```

---

## Repository Structure

```
vidyasetu/
├── apps/
│   ├── web/          # Student portal (Next.js 14, Port 3000)
│   ├── teacher/      # Teacher portal (Next.js 14, Port 3002)
│   ├── parent/       # Parent portal (Next.js 14, Port 3004)
│   └── admin/        # School admin portal (Next.js 14, Port 3003)
├── services/
│   ├── api/          # Fastify REST API (Node.js, Port 3001)
│   └── ai/           # FastAPI AI agents (Python, Port 8000)
├── packages/
│   ├── db/           # Prisma schema + client (shared)
│   ├── ui/           # Shared React components
│   └── config/       # Shared TS/ESLint configs
├── mobile/           # Flutter app (Android/iOS)
├── infrastructure/
│   ├── docker/       # Dockerfiles
│   ├── terraform/    # AWS infrastructure
│   └── github/       # CI/CD workflows
└── docs/             # Architecture, API, Database docs
```

---

## Technology Decisions

### Frontend: Next.js 14 (App Router)
- Server components for SEO + performance
- Tailwind CSS + custom VidyaSetu design tokens
- Marathi/Devanagari font optimization (Noto Sans Devanagari)
- React Query for server state
- Zustand for client state (auth, language preference)

### Backend: Fastify (Node.js 20)
- **Why Fastify over Express**: 3x faster, built-in TypeScript, schema validation
- JWT authentication with Redis blacklisting
- Role-Based Access Control (STUDENT, TEACHER, PARENT, SCHOOL_ADMIN, etc.)
- Prisma ORM for type-safe DB access
- Redis for session management, caching, and job queues

### Database: PostgreSQL 16
- Full-text search with `pg_trgm` extension (Marathi search)
- UUID primary keys via `gen_random_uuid()`
- Comprehensive audit log table
- Soft deletes on User table
- Composite indexes for performance at 5M+ rows

### AI Service: FastAPI + LangGraph
- **LangGraph** for multi-step agent workflows (Retrieve → Respond → Follow-ups)
- **Qdrant** vector DB for RAG (curriculum content embedded with sentence-transformers)
- Multilingual embedding model: `paraphrase-multilingual-MiniLM-L12-v2`
- Marathi-primary system prompts
- Agents: Marathi Tutor, Career Counselor, Quiz Generator, Story Teller

### Mobile: Flutter
- Single codebase for Android (primary) and iOS
- Riverpod for state management
- GoRouter for navigation
- Hive for offline storage
- Dio for HTTP (with auto-refresh interceptor)

---

## Security Architecture

### Authentication Flow
```
Client → POST /auth/login → Fastify
  → Verify credentials (bcrypt)
  → Generate JWT (15min) + Refresh Token (30 days)
  → Store session in Redis
  → Store RefreshToken in UserSession table
  → Return tokens

Protected Route:
  → Extract Bearer token
  → Verify JWT signature
  → Check Redis blacklist (logout invalidation)
  → Attach user payload to request
```

### RBAC Matrix

| Resource         | STUDENT | TEACHER | PARENT | SCHOOL_ADMIN | SUPER_ADMIN |
|------------------|---------|---------|--------|--------------|-------------|
| Own progress     | R       | —       | R      | R            | RW          |
| Class attendance | —       | RW      | R      | RW           | RW          |
| Assessments      | R+take  | CRUD    | R      | R            | CRUD        |
| Student data     | own     | R       | own    | RW           | RW          |
| School data      | —       | R       | —      | RW           | RW          |

### DPDP Act 2023 Compliance
- Student data classified as **Sensitive Personal Data**
- Parent consent required for students under 18
- Data localization: AWS Mumbai region only
- Aadhaar stored as SHA-256 hash only
- Audit logs for all data access/modification
- Right to deletion: soft delete with 90-day purge

---

## Offline Architecture

```
Student Device (Android)
  ├── Hive Local DB (lessons, progress)
  ├── Background sync worker (WorkManager)
  └── Sync Queue (pending completions, mood check-ins)
              ↕ (WiFi sync)
School Offline Hub (Raspberry Pi)
  ├── Nginx + Node.js API (local)
  ├── PostgreSQL (local mirror)
  └── Content cache (videos, PDFs)
              ↕ (periodic sync)
AWS Mumbai (cloud)
```

---

## Scalability

### Horizontal Scaling Plan
- **API**: ECS Fargate, auto-scale on CPU > 70%
- **AI**: GPU instances (g4dn.xlarge) for inference
- **Database**: RDS Multi-AZ with read replicas
- **Cache**: ElastiCache Redis cluster mode

### Estimated Load at Scale
| Service  | Requests/sec | Peak | Strategy |
|----------|-------------|------|----------|
| API      | 5,000       | 20K  | ECS autoscale |
| AI Chat  | 500         | 2K   | Queue + async |
| CDN      | 50,000      | 200K | CloudFront |
| DB       | 2,000       | 8K   | PgBouncer + read replicas |
