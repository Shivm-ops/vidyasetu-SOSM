# VIDYASETU — COMPLETE PRODUCTION READINESS AUDIT
## Conducted by: Principal Software Architect + CTO + Cybersecurity Auditor + DevOps Engineer + Education Domain Expert

**Audit Date:** June 2026  
**Codebase State:** Scaffolded (not production-ready)  
**Overall Production Readiness Score: 34 / 100**

---

## EXECUTIVE SUMMARY

VidyaSetu has a strong architectural vision and a comprehensive data model foundation. The scaffold demonstrates good domain understanding, correct choice of technologies, and thoughtful Marathi-first design. However, **it is not production-deployable in its current state.**

Critical security vulnerabilities exist that would expose 5 million children's personal data. The DPDP Act 2023 compliance posture is near zero. The AI service is completely unauthenticated. Student data endpoints have IDOR vulnerabilities. The infrastructure lacks WAF, auto-scaling, read replicas, and disaster recovery. The offline system is conceptual — no actual implementation exists.

A minimum of 14–20 weeks of engineering work is required before this platform can safely serve real students and teachers.

---

## PRODUCTION READINESS SCORECARD

| Domain | Score | Status |
|--------|-------|--------|
| Security | 22/100 | 🔴 CRITICAL |
| DPDP Compliance | 8/100 | 🔴 CRITICAL |
| Authentication/Authorization | 35/100 | 🔴 CRITICAL |
| Database Design | 55/100 | 🟡 HIGH |
| AI Platform | 38/100 | 🟡 HIGH |
| API Completeness | 45/100 | 🟡 HIGH |
| Flutter Mobile | 40/100 | 🟡 HIGH |
| Infrastructure | 38/100 | 🟡 HIGH |
| Scalability | 30/100 | 🔴 CRITICAL |
| Offline System | 20/100 | 🔴 CRITICAL |
| Education Workflows | 42/100 | 🟡 HIGH |
| Government Integration | 15/100 | 🔴 CRITICAL |
| Parent Adoption | 30/100 | 🟡 HIGH |
| Teacher UX | 45/100 | 🟡 HIGH |
| Disaster Recovery | 10/100 | 🔴 CRITICAL |
| **OVERALL** | **34/100** | **🔴 NOT PRODUCTION READY** |

---

# PART 1: CRITICAL SECURITY FINDINGS

## SEC-001 [CRITICAL] — OTP Uses Non-Cryptographic Random

**File:** `services/api/src/routes/auth.ts:270`

```typescript
// VULNERABLE
const otp = Math.floor(100000 + Math.random() * 900000).toString();
```

`Math.random()` in Node.js is not a CSPRNG (Cryptographically Secure Pseudo-Random Number Generator). While Node.js's `Math.random()` uses xorshift128+, it is not suitable for security-critical values like OTPs.

**Fix:**
```typescript
import { randomInt } from "crypto";
const otp = randomInt(100000, 999999).toString();
```

---

## SEC-002 [CRITICAL] — AI Service Has Zero Authentication

**File:** `services/ai/main.py:51-57`

```python
# CRITICAL: Open to the entire internet
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # ← Anyone can call this
    allow_credentials=True,
    allow_methods=["*"],        # ← Including destructive methods
    allow_headers=["*"],
)
```

The AI service runs on port 8000 with no JWT verification, no API key, no IP allowlist. Any person on the internet can:
1. Run unlimited LLM queries at VidyaSetu's cost (financial attack)
2. Submit malicious prompts (prompt injection against child users)
3. Harvest conversation history if queries are stored

**Fix — Add service-to-service auth middleware:**
```python
from fastapi import Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

async def verify_service_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.api_secret,
            algorithms=["HS256"]
        )
        if payload.get("service") != "vidyasetu-api":
            raise HTTPException(status_code=403)
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401)

# Apply to all routers
app.include_router(tutor_router, prefix="/api/v1", dependencies=[Depends(verify_service_token)])
```

---

## SEC-003 [CRITICAL] — IDOR: Any Student Can Access Any Student's Data

**File:** `services/api/src/routes/students.ts:21`

```typescript
// VULNERABLE — no ownership check
app.get("/:id/dashboard", authenticate, async (request, reply) => {
  const { id } = request.params as { id: string };
  // request.user.userId is NEVER compared to the student being accessed
  const student = await app.prisma.student.findUnique({ where: { id } });
```

A logged-in student with id `A` can call `GET /students/B/dashboard` and receive B's progress, mood history, badges, and school data. This is an Insecure Direct Object Reference (IDOR) affecting 5 million children.

**Fix:**
```typescript
app.get("/:id/dashboard", authenticate, async (request, reply) => {
  const { id } = request.params as { id: string };
  const requestingUser = request.user!;

  // Ownership check: students can only see own data
  // Teachers/Admins can see their school's students
  if (requestingUser.role === "STUDENT") {
    const student = await app.prisma.student.findFirst({
      where: { id, userId: requestingUser.userId }
    });
    if (!student) {
      return reply.code(403).send({ success: false, message: "Forbidden" });
    }
  } else if (requestingUser.role === "TEACHER") {
    // Verify student belongs to teacher's school
    const student = await app.prisma.student.findFirst({
      where: { id, user: { schoolId: requestingUser.schoolId } }
    });
    if (!student) {
      return reply.code(403).send({ success: false, message: "Forbidden" });
    }
  }
```

---

## SEC-004 [CRITICAL] — Password Hash Leaked in /auth/me Response

**File:** `services/api/src/routes/auth.ts:311-338`

```typescript
// VULNERABLE — returns entire user object including passwordHash
const user = await app.prisma.user.findUnique({
  where: { id: request.user!.userId },
  // No select — returns ALL fields including passwordHash
  include: { student: {...}, teacher: true, ... }
});
return reply.send({ success: true, data: user });
// data.passwordHash IS in the response
```

**Fix:**
```typescript
const user = await app.prisma.user.findUnique({
  where: { id: request.user!.userId },
  select: {
    id: true,
    role: true,
    firstName: true,
    lastName: true,
    firstNameMarathi: true,
    lastNameMarathi: true,
    phone: true,
    email: true,
    profilePhotoUrl: true,
    preferredLanguage: true,
    schoolId: true,
    isVerified: true,
    // passwordHash: NEVER
    student: { select: { id: true, grade: true, stage: true, studentId: true, learningPoints: true } },
    teacher: { select: { id: true, employeeId: true, subjects: true } },
    parent: { select: { id: true } },
  },
});
```

---

## SEC-005 [CRITICAL] — Race Condition in Student ID Generation

**File:** `services/api/src/routes/auth.ts:145-146`

```typescript
const studentCount = await app.prisma.student.count();
const studentId = `VS-${new Date().getFullYear()}-${String(studentCount + 1).padStart(5, "0")}`;
// RACE: Two simultaneous registrations get studentCount=1000
// Both generate VS-2024-01001 → unique constraint violation crashes registration
```

With 5M expected students and NGO bulk-registration scenarios, concurrent registrations are routine.

**Fix:**
```typescript
// Use PostgreSQL sequence for atomic ID generation
// Add to schema:
// model StudentIdSequence { ... }
// Or use a DB sequence directly:
const result = await app.prisma.$queryRaw<[{nextval: bigint}]>`
  SELECT nextval('student_id_seq')
`;
const seq = result[0].nextval;
const studentId = `VS-${new Date().getFullYear()}-${String(seq).padStart(6, "0")}`;
```

**Required Prisma migration:**
```sql
CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1 INCREMENT 1;
```

---

## SEC-006 [CRITICAL] — No Brute-Force Protection on Login

**File:** `services/api/src/routes/auth.ts:44`

The global rate limit is 200 requests/minute per IP. An attacker targeting a specific phone number can:
- Rotate through multiple IPs (residential proxies)
- Use a 6-digit OTP = 1,000,000 combinations
- At 200 req/min per IP with 10 IPs = 2000 req/min = 8.3 hours to brute-force

**Fix — Per-identifier lockout:**
```typescript
app.post("/login", {
  config: { rateLimit: { max: 5, timeWindow: "15 minutes", keyGenerator: (req) => {
    const body = req.body as any;
    return `login:${body.identifier}`; // Per phone/email, not per IP
  }}}
}, async (request, reply) => {
  const body = loginSchema.parse(request.body);

  // Track failed attempts in Redis
  const failKey = `login_fail:${body.identifier}`;
  const failures = parseInt(await app.redis.get(failKey) ?? "0");
  
  if (failures >= 5) {
    return reply.code(429).send({
      success: false,
      message: "Account temporarily locked. Try in 15 minutes."
    });
  }

  const isValid = await bcrypt.compare(body.password, user.passwordHash);
  if (!isValid) {
    await app.redis.multi()
      .incr(failKey)
      .expire(failKey, 900) // 15 min
      .exec();
    return reply.code(401).send({ success: false, message: "Invalid credentials" });
  }
  
  // On success, clear failures
  await app.redis.del(failKey);
```

---

## SEC-007 [CRITICAL] — Content Security Policy Disabled

**File:** `services/api/src/app.ts:44-46`

```typescript
await app.register(helmet, {
  contentSecurityPolicy: false, // ← XSS protection OFF
});
```

CSP is the primary browser defense against XSS attacks. Disabling it means any injected script runs freely, including stealing JWT tokens from localStorage, keylogging student inputs, or redirecting to phishing sites.

**Fix:**
```typescript
await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://cdn.vidyasetu.in"],
      connectSrc: ["'self'", process.env.AI_SERVICE_URL!],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});
```

---

## SEC-008 [HIGH] — Assessment IDOR: Any Student Sees Any Student's Results

**File:** `services/api/src/routes/assessments.ts:257`

```typescript
app.get("/:id/results/:studentId", authenticate, async (request, reply) => {
  const { id: assessmentId, studentId } = request.params as { ... };
  // No check: is the authenticated user authorized to view THIS studentId's results?
```

Any authenticated user can enumerate `studentId` values and read all students' exam results.

---

## SEC-009 [HIGH] — Swagger UI Exposed in Production

**File:** `services/api/src/app.ts:93-96`

```typescript
await app.register(swaggerUi, {
  routePrefix: "/docs", // ← Always enabled, no env check
});
```

Swagger UI exposes full API schema, all endpoints, request/response formats — a roadmap for attackers.

**Fix:**
```typescript
if (process.env.NODE_ENV !== "production") {
  await app.register(swaggerUi, { routePrefix: "/docs" });
}
```

---

## SEC-010 [HIGH] — File Upload: No MIME Type Validation

**File:** `services/api/src/routes/uploads.ts`

The presigned URL is generated based solely on the `contentType` header from the client request, which can be spoofed. A user can claim `contentType: "image/jpeg"` and upload an `.exe` file.

**Fix:**
```typescript
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  profiles: ["image/jpeg", "image/png", "image/webp"],
  content: ["video/mp4", "application/pdf", "audio/mpeg", "audio/mp4"],
  homework: ["image/jpeg", "image/png", "application/pdf"],
  documents: ["application/pdf", "image/jpeg", "image/png"],
};

const allowed = ALLOWED_MIME_TYPES[body.folder] ?? [];
if (!allowed.includes(body.contentType)) {
  return reply.code(400).send({
    success: false,
    message: `Content type ${body.contentType} not allowed in ${body.folder}`
  });
}
```

---

## SEC-011 [HIGH] — Aadhaar Hash Uses SHA-256 (Reversible)

**File:** `packages/db/prisma/schema.prisma:389`

```prisma
aadhaarHash  String?  // Hashed Aadhaar
// Comment says SHA-256 — but Aadhaar is 12 digits = 10^12 possibilities
// SHA-256 of 12-digit numbers can be rainbow-tabled in hours
```

**Fix — Use HMAC-SHA256 with a secret:**
```typescript
import { createHmac } from "crypto";

function hashAadhaar(aadhaar: string): string {
  return createHmac("sha256", process.env.AADHAAR_HMAC_SECRET!)
    .update(aadhaar)
    .digest("hex");
}
// Add AADHAAR_HMAC_SECRET to .env — rotatable per security incident
```

---

## SEC-012 [HIGH] — JWT Algorithm Not Locked

**File:** `services/api/src/app.ts:72-75`

```typescript
await app.register(jwt, {
  secret: process.env.JWT_SECRET!,
  sign: { expiresIn: process.env.JWT_EXPIRES_IN ?? "15m" },
  // algorithm not specified — defaults to HS256, but not hardened
});
```

Without explicit algorithm locking, the service may be vulnerable to algorithm confusion attacks if `@fastify/jwt` ever changes defaults.

**Fix:**
```typescript
await app.register(jwt, {
  secret: process.env.JWT_SECRET!,
  sign: { algorithm: "HS256", expiresIn: "15m" },
  verify: { algorithms: ["HS256"] }, // Reject all other algorithms
});
```

---

## SEC-013 [HIGH] — Hardcoded Secrets in docker-compose.yml

**File:** `docker-compose.yml:12,62-63`

```yaml
POSTGRES_PASSWORD: vidyasetu_pass
JWT_SECRET: dev-secret-at-least-32-characters-long
JWT_REFRESH_SECRET: dev-refresh-secret-at-least-32-chars
```

These are committed to version control. Even "dev" secrets are dangerous because developers often reuse them in staging/production due to laziness.

**Fix:** Use Docker secrets or `.env` files never committed to git:
```yaml
environment:
  JWT_SECRET_FILE: /run/secrets/jwt_secret
secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

---

## SEC-014 [MEDIUM] — OTP Verification Has No Attempt Counter

**File:** `services/api/src/routes/auth.ts:286-304`

```typescript
// Redis key expires in 10 min
// No limit on verification attempts
// 6-digit OTP = 1,000,000 combinations
// At 200 req/min global limit, attacker has 2000 tries in 10 min = 0.2% probability
// With multiple sessions = higher probability over time
```

**Fix:** Add attempt counter:
```typescript
const attemptsKey = `otp_attempts:${phone}:${purpose}`;
const attempts = parseInt(await app.redis.get(attemptsKey) ?? "0");
if (attempts >= 3) {
  return reply.code(429).send({ success: false, message: "OTP expired due to too many attempts" });
}
await app.redis.multi().incr(attemptsKey).expire(attemptsKey, 600).exec();
```

---

# PART 2: DPDP ACT 2023 COMPLIANCE AUDIT

## DPDP-001 [CRITICAL] — No Parent Consent Model

The DPDP Act 2023 requires **verifiable parental consent** before processing personal data of children under 18. VidyaSetu processes data of children as young as 6 years old (Class 1).

**Current state:** No `ParentConsent` model exists. No consent collection mechanism. No consent withdrawal tracking.

**Required Prisma additions:**
```prisma
model ParentConsent {
  id                String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  studentId         String   @db.Uuid
  student           Student  @relation(fields: [studentId], references: [id])
  parentUserId      String   @db.Uuid
  parentUser        User     @relation(fields: [parentUserId], references: [id])
  consentVersion    String   // "1.0", "1.1" — version of privacy policy consented to
  consentGivenAt    DateTime
  consentMethod     String   // OTP_VERIFIED, SCHOOL_FORM, DIGITAL_SIGNATURE
  ipAddress         String?
  deviceFingerprint String?
  isWithdrawn       Boolean  @default(false)
  withdrawnAt       DateTime?
  withdrawnReason   String?
  dataCategories    String[] // What data was consented: ["academic", "biometric", "behavioral"]
  legalBasis        String   // CONSENT, LEGITIMATE_INTEREST
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([studentId])
  @@index([parentUserId])
  @@map("parent_consents")
}

model DataProcessingRecord {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  entityType      String   // Student, Teacher
  entityId        String   @db.Uuid
  purpose         String   // EDUCATIONAL, SCHOLARSHIP, ANALYTICS, AI_TUTOR
  legalBasis      String
  dataCategories  String[]
  retentionPeriod Int      // days
  thirdPartyShared Boolean @default(false)
  thirdParties    String[]
  createdAt       DateTime @default(now())

  @@map("data_processing_records")
}
```

---

## DPDP-002 [CRITICAL] — No Data Retention Enforcement

**Schema and code gap:** The `isDeleted` flag on User and the `deletedAt` timestamp exist, but there is no automated purge after 90 days. Data of deleted/withdrawn students remains in the database forever.

**Required implementation:**
```typescript
// Scheduled job (run daily via AWS EventBridge):
export async function purgeExpiredData() {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  
  // Find users marked deleted > 90 days ago
  const usersToDelete = await prisma.user.findMany({
    where: { isDeleted: true, deletedAt: { lt: ninetyDaysAgo } },
    select: { id: true, student: { select: { id: true } } }
  });

  for (const user of usersToDelete) {
    await prisma.$transaction([
      // Anonymize — don't fully delete, preserve aggregate data
      prisma.user.update({
        where: { id: user.id },
        data: {
          phone: null,
          email: null,
          firstName: "DELETED",
          lastName: "USER",
          firstNameMarathi: null,
          passwordHash: null,
          profilePhotoUrl: null,
          fcmToken: null,
        }
      }),
      // Hard-delete sensitive child data
      prisma.moodCheckIn.deleteMany({ where: { studentId: user.student?.id } }),
      prisma.aiConversation.deleteMany({ where: { studentId: user.student?.id } }),
    ]);
  }
}
```

---

## DPDP-003 [CRITICAL] — CloudFront Serves Outside India (Data Localization)

**File:** `infrastructure/terraform/main.tf:153`

```hcl
price_class = "PriceClass_All"
# This serves content from edge locations OUTSIDE India
# Student data/content cached in Singapore, US, EU — violates data localization
```

**Fix:**
```hcl
price_class = "PriceClass_200"  # Only Asia, Middle East, Africa edges
# Or more strict:
# Use CloudFront with origin shield in ap-south-1 (Mumbai)
# For child PII — never cache on CDN, only serve from origin
```

---

## DPDP-004 [HIGH] — No Grievance Redressal Mechanism

DPDP requires a designated Grievance Officer and a mechanism for users to raise data complaints. No such feature exists in the portal.

**Required:**
- Add `GrievanceTicket` model
- Add `/grievance` API routes
- Add Grievance Officer contact in UI

---

## DPDP-005 [HIGH] — Aadhaar Hashing Insufficient

See SEC-011. Aadhaar stored with standard SHA-256 is vulnerable to rainbow table attacks given the small (12-digit) input space.

---

## DPDP-006 [MEDIUM] — Audit Logs Miss Sensitive Operations

**Current AuditLog:** Generic `action`, `entityType`, `entityId`. Missing:
- WHO accessed student data (read operations)
- AI conversation access logs
- Data export events
- Password reset events
- Parent consent give/withdraw events

**Fix — Add purpose and outcome fields:**
```prisma
model AuditLog {
  // ... existing fields ...
  purpose       String?  // WHY was this accessed
  outcome       String?  // SUCCESS, FAILURE, PARTIAL
  dataAccessed  String[] // Specific fields accessed (for read operations)
  @@index([entityType, entityId, createdAt]) // For DPDP reporting
}
```

---

# PART 3: DATABASE DESIGN AUDIT

## DB-001 [CRITICAL] — Missing Taluka in Geographic Hierarchy

Maharashtra's official hierarchy is: **State → District → Taluka → Village**. The schema has State → District → **Block** → Village, conflating Taluka and Block. Government reports require Taluka-level data for UDISE+ and school inspections.

**Fix:**
```prisma
model Taluka {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String
  nameMarathi String?
  code        String   @unique
  districtId  String   @db.Uuid
  district    District @relation(fields: [districtId], references: [id])
  villages    Village[]
  schools     School[]
  createdAt   DateTime @default(now())

  @@map("talukas")
}

// Update Village:
model Village {
  talukaId    String   @db.Uuid
  taluka      Taluka   @relation(fields: [talukaId], references: [id])
  // Remove blockId — Maharashtra doesn't use blocks for school administration
}

// Update School:
model School {
  talukaId    String?  @db.Uuid
  taluka      Taluka?  @relation(fields: [talukaId], references: [id])
}
```

---

## DB-002 [CRITICAL] — CareerGoal Missing Unique Constraint

**File:** `packages/db/prisma/schema.prisma:930`

```prisma
model CareerGoal {
  // No @@unique([studentId, careerPathId])
  // A student can set the same career goal multiple times
  // The career route in auth.ts Line 177 uses a broken .catch() upsert
```

**Fix:**
```prisma
model CareerGoal {
  // ... existing fields ...
  @@unique([studentId, careerPathId])
  @@map("career_goals")
}
```

---

## DB-003 [HIGH] — AuditLog Will Reach 1B Rows With No Partitioning

At 5M students taking daily actions, AuditLog will accumulate ~1 billion rows per year. A full-table query will take minutes.

**Fix — Add PostgreSQL table partitioning:**
```sql
-- In migration:
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE TABLE audit_logs_2024_q1 PARTITION OF audit_logs
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
-- Auto-create future partitions via pg_partman extension
```

---

## DB-004 [HIGH] — Missing Critical Indexes

The following high-frequency query patterns have no supporting indexes:

```prisma
// Missing indexes:
model AttendanceRecord {
  @@index([date])                          // "All absences today" query
  @@index([studentId, date])               // Student attendance history
}

model LessonCompletion {
  @@index([lessonId])                      // "How many completed this lesson"
  @@index([completedAt])                   // Daily active user counts
}

model PointTransaction {
  @@index([pointsId])                      // Transaction history lookup
  @@index([createdAt])                     // Weekly/monthly point resets
}

model UserNotification {
  @@index([userId, createdAt])             // Notification feed pagination
}

model AssessmentAttempt {
  @@index([assessmentId, submittedAt])     // "All submissions for this exam"
}

model AIConversation {
  @@index([teacherId])                     // Teacher AI usage
  @@index([createdAt])                     // Cost reporting by date
}
```

---

## DB-005 [HIGH] — School.medium Array is Unqueryable

```prisma
model School {
  medium  Medium[]  // PostgreSQL array — cannot create a foreign key or index on elements
}
```

Querying "all Marathi medium schools in Pune district" requires a slow `ANY(medium)` array operation. At 50,000 schools this is acceptable, but it breaks proper normalization.

**Fix:**
```prisma
model SchoolMedium {
  id       String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  schoolId String @db.Uuid
  school   School @relation(fields: [schoolId], references: [id])
  medium   Medium
  @@unique([schoolId, medium])
  @@map("school_mediums")
}
```

---

## DB-006 [HIGH] — Denormalized totalStudents/totalTeachers on School

```prisma
model School {
  totalStudents Int @default(0)  // Never updated by any code!
  totalTeachers Int @default(0)  // Never updated by any code!
}
```

These are never maintained. The attendance dashboard will show 0 students for all schools.

**Fix:** Remove these fields. Compute at query time using `_count` or maintain via Prisma middleware:
```typescript
// Prisma middleware to auto-update counts:
prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.model === "Enrollment" && ["create", "update", "delete"].includes(params.action)) {
    const schoolId = /* extract from context */;
    const count = await prisma.student.count({ where: { user: { schoolId } } });
    await prisma.school.update({ where: { id: schoolId }, data: { totalStudents: count } });
  }
  return result;
});
```

---

## DB-007 [HIGH] — TimetableSlot.teacherId is Not a Proper FK

```prisma
model TimetableSlot {
  teacherId    String   @db.Uuid  // No @relation! Not linked to Teacher or User
  // This is just a UUID stored in a column — no referential integrity
```

**Fix:**
```prisma
model TimetableSlot {
  teacherId    String   @db.Uuid
  teacher      Teacher  @relation(fields: [teacherId], references: [id])
  @@index([teacherId])
}
```

---

## DB-008 [HIGH] — Homework.sectionId Missing FK Relation

```prisma
model Homework {
  sectionId    String    @db.Uuid  // No @relation declared
  // References section but no foreign key constraint
```

**Fix:**
```prisma
model Homework {
  sectionId    String    @db.Uuid
  section      Section   @relation(fields: [sectionId], references: [id])
  @@index([sectionId])
}
```

---

## DB-009 [MEDIUM] — MoodCheckIn Has No Daily Unique Constraint

A student can submit hundreds of mood check-ins per day. The wellbeing alert trigger (3 bad moods in 7 days) becomes meaningless — a single bad day floods the alert system.

**Fix:**
```prisma
model MoodCheckIn {
  date     DateTime @db.Date  // Add date column
  // ...
  @@unique([studentId, date])  // One check-in per student per day
}
```

---

## DB-010 [MEDIUM] — No ReportCard Model

Maharashtra schools must issue term-end report cards (Progress Card) per SSC Board format. There's no `ReportCard`, `SubjectMarks`, or `TermResult` model. Teachers cannot enter final term marks.

**Required models:**
```prisma
model TermResult {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  studentId     String   @db.Uuid
  student       Student  @relation(fields: [studentId], references: [id])
  academicYear  String
  term          Int      // 1 or 2
  grade         Int
  subjectMarks  SubjectMark[]
  totalMarks    Float?
  percentage    Float?
  rank          Int?
  grade_result  String?  // PASS, FAIL, DISTINCTION
  isPublished   Boolean  @default(false)
  publishedAt   DateTime?
  createdAt     DateTime @default(now())
  @@unique([studentId, academicYear, term])
  @@map("term_results")
}

model SubjectMark {
  id            String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  termResultId  String     @db.Uuid
  termResult    TermResult @relation(fields: [termResultId], references: [id])
  subjectCode   String
  marksObtained Float
  totalMarks    Float
  grade         String?    // A+, A, B+, B, C, D
  isAbsent      Boolean    @default(false)
  @@map("subject_marks")
}
```

---

## DB-011 [MEDIUM] — Missing StudentTransfer Model

When a student changes schools (common in migrant worker families), there's no way to transfer their record. The enrollment just goes inactive with no audit trail of where they transferred to/from.

```prisma
model StudentTransfer {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  studentId     String   @db.Uuid
  fromSchoolId  String   @db.Uuid
  toSchoolId    String?  @db.Uuid  // null if transferred out of system
  transferDate  DateTime
  reason        String?
  tcNumber      String?  // Transfer Certificate number
  approvedById  String?  @db.Uuid
  createdAt     DateTime @default(now())
  @@map("student_transfers")
}
```

---

## DB-012 [MEDIUM] — No SchoolCalendar or AcademicEvent Model

Schools need to define holidays, exam weeks, and special event days. Attendance management requires knowing if a day is a holiday (should not mark absent). Without this, attendance percentage calculations are wrong.

```prisma
model AcademicCalendar {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  schoolId    String?  @db.Uuid  // null = applies to all schools in district
  districtId  String?  @db.Uuid
  academicYear String
  eventDate   DateTime @db.Date
  eventType   String   // HOLIDAY, EXAM, FUNCTION, HALF_DAY
  name        String
  nameMarathi String?
  createdAt   DateTime @default(now())
  @@unique([schoolId, eventDate])
  @@map("academic_calendars")
}
```

---

## DB-013 [MEDIUM] — SkillPassport.projects Uses Json[] (PostgreSQL-Specific Anti-Pattern)

```prisma
model SkillPassport {
  projects Json[] @default([])
  // Json[] in PostgreSQL becomes a jsonb[] column
  // Cannot query inside individual JSON objects
  // Cannot index on project titles/dates
```

**Fix:**
```prisma
model StudentProject {
  id            String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  skillPassportId String      @db.Uuid
  skillPassport SkillPassport @relation(fields: [skillPassportId], references: [id])
  title         String
  titleMarathi  String?
  description   String?
  completedAt   DateTime?
  certificateUrl String?
  skills        String[]
  createdAt     DateTime      @default(now())
  @@map("student_projects")
}
```

---

# PART 4: SCALABILITY AUDIT

## SCALE-001 [CRITICAL] — No PgBouncer / Connection Pool

At 5M students × peak 10% concurrent = 500K active users. Each Fastify worker opens its own Prisma connection pool (default 10 connections). With 10 API replicas, that's 100 connections. PostgreSQL default max_connections=100 — we will hit connection exhaustion immediately.

**Fix — Add PgBouncer to terraform:**
```hcl
resource "aws_ecs_service" "pgbouncer" {
  name            = "vidyasetu-pgbouncer"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.pgbouncer.arn
  desired_count   = 2
}
```

**pgbouncer.ini:**
```ini
[databases]
vidyasetu_db = host=rds.endpoint.ap-south-1.rds.amazonaws.com dbname=vidyasetu_db

[pgbouncer]
pool_mode = transaction          # Best for web workloads
max_client_conn = 10000          # Accept 10K concurrent clients
default_pool_size = 20           # 20 server connections per db
min_pool_size = 5
reserve_pool_size = 5
listen_port = 5432
```

**Prisma change:**
```
DATABASE_URL=postgresql://user:pass@pgbouncer:5432/vidyasetu_db?pgbouncer=true&connection_limit=1
```

---

## SCALE-002 [CRITICAL] — No RDS Read Replicas

All 500K concurrent reads hit the same primary RDS instance. Analytics queries (school snapshots, leaderboards) will block student reads.

**Fix — Terraform read replica:**
```hcl
resource "aws_db_instance" "postgres_replica" {
  count                  = 2
  identifier             = "vidyasetu-${var.environment}-replica-${count.index}"
  replicate_source_db    = aws_db_instance.postgres.id
  instance_class         = "db.r6g.large"
  publicly_accessible    = false
  skip_final_snapshot    = true
  performance_insights_enabled = true
}
```

**API routing:** Use separate `DATABASE_READ_URL` pointing to replica for all read queries in analytics, curriculum, and progress routes.

---

## SCALE-003 [CRITICAL] — Analytics Snapshot Job Will Exhaust Connections

**File:** `services/api/src/routes/analytics.ts:53-70`

```typescript
const updates = await Promise.allSettled(
  schools.map(async (school) => { /* 4 DB queries per school */ })
);
// At 50,000 schools × 4 queries = 200,000 concurrent DB queries
// This will exhaust all connections and crash PostgreSQL
```

**Fix — Use a batch worker with concurrency control:**
```typescript
import PQueue from "p-queue";

const queue = new PQueue({ concurrency: 50 }); // Max 50 concurrent

for (const school of schools) {
  queue.add(() => snapshotSchool(school.id));
}
await queue.onIdle();
```

---

## SCALE-004 [HIGH] — LLM Instance Created Per Request

**File:** `services/ai/agents/marathi_tutor.py:70-76`

```python
def get_llm() -> ChatOpenAI:
    return ChatOpenAI(  # New instance EVERY call
        model=settings.ai_model_name,
        ...
    )
```

Each tutoring request creates a new `ChatOpenAI` object, establishing a new HTTP connection to OpenAI. At 500 concurrent AI sessions this creates 500 new connections per second.

**Fix:**
```python
from functools import lru_cache

@lru_cache(maxsize=1)
def get_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.ai_model_name,
        temperature=settings.ai_temperature,
        max_tokens=settings.ai_max_tokens,
        api_key=settings.openai_api_key,
        timeout=30,
        max_retries=2,
    )
```

---

## SCALE-005 [HIGH] — Redis Has No Cluster Mode

**File:** `infrastructure/terraform/main.tf:94`

```hcl
num_cache_clusters = var.environment == "production" ? 2 : 1
# num_cache_clusters ≠ cluster mode
# This is replication (primary + replica), NOT cluster mode
# One shard = one thread = ~100K ops/sec maximum
# VidyaSetu needs > 500K ops/sec at peak (session checks + caching)
```

**Fix:**
```hcl
resource "aws_elasticache_replication_group" "redis" {
  # ... existing config ...
  num_node_groups         = 3  # 3 shards
  replicas_per_node_group = 1  # 1 replica per shard
  automatic_failover_enabled = true
  cluster_mode_enabled    = true  # Enable cluster mode
}
```

---

## SCALE-006 [HIGH] — AI Follow-Up Questions Generate Extra LLM Call

**File:** `services/ai/agents/marathi_tutor.py:105-117`

Every tutor response makes **2 separate LLM API calls**: one for the main answer, one for follow-up questions. This doubles cost and latency.

**Fix — Combine into structured output:**
```python
from pydantic import BaseModel

class TutorOutput(BaseModel):
    answer: str
    follow_up_questions: list[str]

def generate_response_with_followups(state: TutorState) -> TutorState:
    llm = get_llm().with_structured_output(TutorOutput)
    # Single call returns both answer and follow-ups
    output = llm.invoke(messages)
    return {
        **state,
        "response": output.answer,
        "follow_up_questions": output.follow_up_questions[:3]
    }
```

**Cost saving: 50% reduction in AI API costs.**

---

## SCALE-007 [HIGH] — No Message Queue for Notifications/SMS

Attendance marking triggers parent SMS notifications synchronously:
```typescript
// From attendance.ts:
await app.redis.lpush("notifications:attendance", JSON.stringify({...}));
// Redis LPUSH is fire-and-forget — nothing consumes this queue
// No worker process implemented to send SMS
```

No worker exists to consume the notification queue. Absent SMS alerts are never sent.

**Fix — Implement proper queue with BullMQ:**
```typescript
// In a separate worker service:
import { Worker } from "bullmq";

const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    const { type, studentIds, date } = job.data;
    if (type === "ABSENT_ALERT") {
      for (const studentId of studentIds) {
        const parent = await getParentPhone(studentId);
        await smsService.send(parent.phone, buildAbsentMessage(studentId, date));
      }
    }
  },
  { connection: redis, concurrency: 20 }
);
```

---

# PART 5: AI PLATFORM AUDIT

## AI-001 [CRITICAL] — RAG Collection Is Empty — Tutor Will Hallucinate

**File:** `services/ai/utils/rag.py:31-39`

The Qdrant collection is created empty on startup. There is **no content ingestion pipeline** anywhere in the codebase. When `build_rag_context` is called, it returns an empty string — the tutor has no curriculum knowledge and will hallucinate answers based solely on the LLM's training data.

For Class 1-4 Marathi students asking about textbook content, hallucinated answers could be factually incorrect, violating Maharashtra State Board curriculum.

**Fix — Build content ingestion pipeline:**
```python
# services/ai/scripts/ingest_curriculum.py
from utils.rag import upsert_document
from db import get_lessons_with_content  # New function

async def ingest_all_lessons():
    lessons = await get_lessons_with_content()
    for lesson in lessons:
        for content in lesson.contents:
            if content.language == "MARATHI" and content.body:
                upsert_document(
                    collection_name=settings.vector_db_collection,
                    doc_id=str(content.id),
                    text=content.body,
                    metadata={
                        "grade": str(lesson.chapter.grade),
                        "subject": lesson.chapter.subject.code,
                        "chapter": lesson.chapter.title,
                        "lesson_id": str(lesson.id),
                        "language": "mr",
                    }
                )
    print(f"Ingested {len(lessons)} lessons")
```

---

## AI-002 [CRITICAL] — No Token Budget Per Student

A student can start an AI tutoring session and keep it running indefinitely. At ~500 tokens per exchange × 100 exchanges = 50,000 tokens per session = ~$0.025 per session at gpt-4o-mini rates. With 5M students × even 0.1% using AI daily = 5,000 daily sessions = $125/day. No safeguard exists.

**Fix:**
```python
DAILY_TOKEN_BUDGET = {
    "FOUNDATION": 5000,   # Class 1-4: ~10 exchanges
    "DISCOVERY": 8000,    # Class 5-8: ~16 exchanges
    "CAREER": 12000,      # Class 9-12: ~24 exchanges
}

async def check_and_deduct_tokens(student_id: str, stage: str, tokens: int) -> bool:
    key = f"daily_tokens:{student_id}:{date.today().isoformat()}"
    used = int(await redis.get(key) or 0)
    budget = DAILY_TOKEN_BUDGET[stage]
    if used + tokens > budget:
        return False
    await redis.multi_exec()
        .incrby(key, tokens)
        .expire(key, 86400)  # Reset daily
    return True
```

---

## AI-003 [HIGH] — No Hallucination Guardrails for Child Safety

The system prompt says "never provide incorrect information" — this is an instruction to the LLM that has zero enforcement. LLMs hallucinate regardless of such instructions.

**Critical scenarios:**
- Child asks about medication dosage (medical question)
- Child asks about violent news event
- Child asks leading question that could produce harmful content

**Fix — Add content filter layer:**
```python
BLOCKED_TOPICS = [
    "medicine", "drugs", "violence", "political", "religion",
    "adult", "suicide", "self-harm"
]

CONFIDENCE_CHECK_PROMPT = """
Rate the factual confidence of this answer on a scale of 0-1.
If confidence < 0.8 or topic is outside school curriculum, return REDIRECT.
Answer: {answer}
Rating:"""

async def validate_response(answer: str, grade: int) -> str:
    # Check for blocked topics
    answer_lower = answer.lower()
    for topic in BLOCKED_TOPICS:
        if topic in answer_lower:
            return f"हे प्रश्न माझ्या अभ्यास विषयाबाहेर आहे. कृपया तुमच्या शिक्षकांना विचारा."
    return answer
```

---

## AI-004 [HIGH] — No Marathi-Specific NLP Validation

The system uses `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` for embeddings. While this model supports Marathi, it was trained on Wikipedia-quality Marathi text. Maharashtra State Board textbooks use specific Marathi vocabulary (श्रेणी, गुणोत्तर, etc.) that may not be well-represented.

**Recommendation:** Fine-tune embeddings on Maharashtra State Board textbook content, or use a Marathi-specific model like `l3cube-pune/marathi-bert-v2`.

---

## AI-005 [HIGH] — Synchronous RAG in Async LangGraph

**File:** `services/ai/agents/marathi_tutor.py:79-88`

```python
def retrieve_context(state: TutorState) -> TutorState:  # Synchronous function
    context = build_rag_context(...)  # Synchronous Qdrant call
    return {**state, "rag_context": context}

# But this is called in:
final_state = await graph.ainvoke(initial_state)  # Async graph
# Sync node inside async graph blocks the event loop
```

**Fix:**
```python
async def retrieve_context(state: TutorState) -> TutorState:
    from asyncio import get_event_loop
    loop = get_event_loop()
    context = await loop.run_in_executor(None, build_rag_context,
        state["messages"][-1].content,
        state["student_grade"],
        state.get("subject")
    )
    return {**state, "rag_context": context}
```

---

## AI-006 [HIGH] — No Fallback When OpenAI Is Down

The AI tutor has a single LLM provider (OpenAI). OpenAI has documented outage incidents. During an outage, all AI features silently fail with a 500 error. For rural students who may have traveled to a connectivity point specifically to use the AI tutor, this is unacceptable.

**Fix — Add Hugging Face fallback:**
```python
from langchain_huggingface import HuggingFaceEndpoint

async def get_llm_with_fallback():
    try:
        llm = ChatOpenAI(model="gpt-4o-mini", api_key=settings.openai_api_key)
        await llm.ainvoke([HumanMessage(content="test")])  # Quick health check
        return llm
    except Exception:
        logger.warning("OpenAI unavailable, falling back to HuggingFace")
        return HuggingFaceEndpoint(
            repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
            huggingfacehub_api_token=settings.huggingface_api_key,
        )
```

---

# PART 6: INFRASTRUCTURE AUDIT

## INFRA-001 [CRITICAL] — No WAF (Web Application Firewall)

The API is exposed directly to the internet with no WAF. At 5M students (target for attackers), no protection against:
- SQL injection (though Prisma helps)
- XSS payloads
- DDoS amplification attacks
- Bot traffic scraping content

**Fix:**
```hcl
resource "aws_wafv2_web_acl" "main" {
  name  = "vidyasetu-waf"
  scope = "REGIONAL"

  default_action { allow {} }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "RateLimitRule"
    priority = 2
    action { block {} }
    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }
    visibility_config { ... }
  }
}
```

---

## INFRA-002 [CRITICAL] — No Disaster Recovery Plan

**Current state:**
- RDS backup retention: 7 days ✅
- No cross-region backup ❌
- No RTO/RPO defined ❌
- No DR runbook ❌
- No failover testing ❌

For a platform serving government schools, downtime during exam season is politically and educationally catastrophic.

**Fix:**
```hcl
# Cross-region backup
resource "aws_db_instance_automated_backups_replication" "dr" {
  source_db_instance_arn = aws_db_instance.postgres.arn
  retention_period       = 7
  # Replicate to ap-southeast-1 (Singapore) as DR region
}

# RDS Multi-AZ for automatic failover
resource "aws_db_instance" "postgres" {
  multi_az = true  # Missing from current config!
}
```

---

## INFRA-003 [CRITICAL] — RDS Not Multi-AZ

**File:** `infrastructure/terraform/main.tf:52-79`

```hcl
resource "aws_db_instance" "postgres" {
  # multi_az is NOT set — defaults to false
  # Single AZ = single point of failure
  # If ap-south-1a AZ goes down, entire platform is offline
}
```

**Fix:** Add `multi_az = true` to `aws_db_instance.postgres`.

---

## INFRA-004 [HIGH] — No Application Load Balancer

There is no ALB defined in Terraform. ECS services have no way to distribute traffic across multiple API containers, defeating horizontal scaling.

**Fix:**
```hcl
resource "aws_lb" "api" {
  name               = "vidyasetu-api-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
}

resource "aws_lb_target_group" "api" {
  name        = "vidyasetu-api-tg"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
  }
}
```

---

## INFRA-005 [HIGH] — S3 Bucket Has No Security Hardening

**File:** `infrastructure/terraform/main.tf:128-140`

```hcl
resource "aws_s3_bucket" "content" {
  bucket = "vidyasetu-content-${var.environment}"
  # No versioning
  # No public access block
  # No bucket policy
  # No lifecycle rules for old content
  # CORS allows all origins: allowed_origins = ["*"]
}
```

**Fix:**
```hcl
resource "aws_s3_bucket_versioning" "content" {
  bucket = aws_s3_bucket.content.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_public_access_block" "content" {
  bucket                  = aws_s3_bucket.content.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "content" {
  bucket = aws_s3_bucket.content.id
  rule {
    id     = "delete-old-uploads"
    status = "Enabled"
    expiration { days = 365 }
    filter { prefix = "temp/" }
  }
}
```

---

## INFRA-006 [HIGH] — No CloudWatch Alarms or Monitoring

No CloudWatch alarms are defined for:
- API error rate > 5%
- RDS CPU > 80%
- Redis eviction rate
- ECS task failures
- AI service latency > 10s

**Fix:**
```hcl
resource "aws_cloudwatch_metric_alarm" "api_errors" {
  alarm_name          = "vidyasetu-api-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 100
  alarm_actions       = [aws_sns_topic.alerts.arn]
}
```

---

## INFRA-007 [HIGH] — Docker Compose Mounts Source Code as Volume in "Production"

```yaml
volumes:
  - ./services/api/src:/app/src  # ← This makes production == development mode
```

This mounts source TypeScript files directly into the container. In production, the built `dist/` should be in the image. This also means any file system write to the host's `src/` directory changes production behavior.

---

## INFRA-008 [HIGH] — No Kubernetes Readiness (ECS Limitations)

Current setup uses ECS Fargate. For 5M students, ECS has scale limitations and lacks:
- Custom resource scheduling
- Istio service mesh for mTLS between services
- Horizontal Pod Autoscaling based on custom metrics (student login rate)
- Job queues for batch processing

**Recommendation:** Plan EKS migration at 500K active users milestone.

---

## INFRA-009 [MEDIUM] — CloudFront Using Default Certificate

```hcl
viewer_certificate {
  cloudfront_default_certificate = true  # Uses *.cloudfront.net
  # vidyasetu.in will serve with a CloudFront certificate
  # Browsers will warn about certificate mismatch
```

**Fix:**
```hcl
viewer_certificate {
  acm_certificate_arn      = aws_acm_certificate.cdn.arn
  ssl_support_method       = "sni-only"
  minimum_protocol_version = "TLSv1.2_2021"
}
```

---

# PART 7: EDUCATION WORKFLOW GAPS

## EDU-001 — No Balbharati Content Mapping

The curriculum model has no mapping to Maharashtra State Board (Balbharati) textbook chapter numbers, page numbers, or official learning objectives. Teachers cannot verify that platform content aligns with the prescribed curriculum.

**Required field additions:**
```prisma
model Chapter {
  balbharatiChapterNo Int?    // Official chapter number from textbook
  balbharatiPageStart Int?    // Starting page in textbook
  balbharatiPageEnd   Int?    // Ending page in textbook
  learningObjectives  String[] // Official learning objectives from curriculum
  competencies        String[] // Competency codes from Maharashtra curriculum
}
```

---

## EDU-002 — No Teacher Timetable Conflict Detection

```typescript
// A teacher can be assigned to multiple sections at the same time
// No validation in TimetableSlot creation
// Result: Teacher "assigned" to Class 7A and 8B simultaneously at 9:00 AM
```

**Fix:**
```typescript
// Validate before creating timetable slot:
const conflict = await prisma.timetableSlot.findFirst({
  where: {
    teacherId: body.teacherId,
    dayOfWeek: body.dayOfWeek,
    academicYear: body.academicYear,
    OR: [
      { startTime: { lte: body.startTime }, endTime: { gt: body.startTime } },
      { startTime: { lt: body.endTime }, endTime: { gte: body.endTime } },
    ]
  }
});
if (conflict) {
  return reply.code(409).send({
    success: false,
    message: "Teacher has a conflicting class at this time"
  });
}
```

---

## EDU-003 — No Co-curricular Activity Tracking

Maharashtra State Board requires tracking of:
- Sports participation
- Cultural events
- NSS/NCC participation
- Annual Day performances

None of these are in the schema. Government reporting (UDISE+) requires co-curricular data.

---

## EDU-004 — Assessment Has No Re-attempt Policy

```prisma
model Assessment {
  // No maxAttempts field
  // No retakePolicy field
}
```

Students can only attempt once (by code logic). Real-world: practice tests allow unlimited retakes, diagnostic tests allow 2, board-practice exams allow 3. This is hardcoded in the business logic with no configuration.

---

## EDU-005 — No Fee Management (Even Minimal)

Government schools track:
- Mid-day meal registration
- Scholarship receipt confirmation
- Activity fee collection

Zero fee management exists. For NGO/CSR partners who need to report on scholarship disbursements, there's no financial tracking.

---

# PART 8: GOVERNMENT INTEGRATION GAPS

## GOV-001 [CRITICAL] — No UDISE+ Integration

UDISE+ (Unified District Information System for Education) is mandatory for all schools receiving government grants. The schema has `udiseCode` but no:
- UDISE+ API client
- Data format mapping (UDISE+ uses specific CSV/XML formats)
- Automated annual enrollment submission
- Student movement tracking format

---

## GOV-002 [HIGH] — No Samagra Shiksha Integration

Maharashtra uses Samagra Shiksha Abhiyan for fund flow and reporting. VidyaSetu has no integration with this national portal.

---

## GOV-003 [HIGH] — Missing Taluka/Cluster/BRC/CRC Hierarchy

Maharashtra's school supervision hierarchy:
- State → Division → District → **Taluka** → **Block Resource Centre (BRC)** → **Cluster Resource Centre (CRC)** → School

The current schema skips Taluka, BRC, and CRC. District education officers supervise through BRCs and CRCs. Without this hierarchy, the admin portal cannot serve Block Education Officers (BEO) and Cluster Resource Persons (CRP).

---

## GOV-004 [HIGH] — No Government Reporting Formats

Required reports not implementable with current schema:
1. School Report Card (SRC) format
2. Child Tracking System (CTS) for out-of-school children
3. National Achievement Survey (NAS) data format
4. DISE Annual Survey format

---

# PART 9: PARENT ADOPTION GAPS

## PAR-001 — SMS OTP Not Implemented

```typescript
// services/api/src/routes/auth.ts:275
// In production: send via SMS service
app.log.info({ phone, otp, purpose }, "OTP generated");
// OTP is only LOGGED — never SENT to the parent's phone
```

Rural parents with feature phones (no smartphones) cannot receive OTPs. Registration for parents is broken.

**Fix — Integrate Fast2SMS (cheapest SMS in India, ₹0.15/SMS):**
```typescript
import axios from "axios";

async function sendOTPviaFast2SMS(phone: string, otp: string): Promise<void> {
  await axios.post("https://www.fast2sms.com/dev/bulkV2", {
    authorization: process.env.SMS_API_KEY,
    variables_values: otp,
    route: "otp",
    numbers: phone,
    language: "unicode",  // Supports Marathi Unicode
  });
}
```

---

## PAR-002 — WhatsApp Integration Completely Missing

The PRD lists WhatsApp integration as a requirement. Rural parents in Maharashtra primarily use WhatsApp. The schema has a `WhatsApp Business API` section in `.env.example` but zero implementation.

**Required:** WhatsApp webhook handler, message templates for attendance alerts and exam results.

---

## PAR-003 — Voice Call Feature Not Implemented

The "Aai-Baba Voice Mode" (automated weekly voice calls in Marathi) is described in the PRD but has no implementation — no call provider integration, no TTS for Marathi, no scheduling system.

**Recommended:** Integrate Exotel (Indian telephony, supports Marathi TTS) for automated voice summaries.

---

## PAR-004 — Parent Registration Flow Unclear

The `registerStudentSchema` has `parentPhone` as optional. But there is no actual Parent creation triggered from this — when a student registers, no parent account is created. Parents cannot use the system.

**Fix:** When `parentPhone` is provided during student registration, auto-create a pending parent account and send OTP to link the accounts.

---

# PART 10: RURAL CONNECTIVITY ISSUES

## RURAL-001 [CRITICAL] — Flutter App Hardcodes localhost

**File:** `mobile/lib/core/network/dio_client.dart:16`

```dart
baseUrl: '${const String.fromEnvironment('API_URL', defaultValue: 'http://localhost:3001')}/api/v1',
```

`String.fromEnvironment` values must be provided at compile time via `--dart-define`. No `--dart-define=API_URL=https://api.vidyasetu.in` is defined in any build script. The default `localhost:3001` will be used in all builds, making the app non-functional for any real user.

**Fix:**
```dart
// lib/core/config/app_config.dart
class AppConfig {
  static const apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://api.vidyasetu.in',  // Production default
  );
}
// Build command: flutter build apk --dart-define=API_URL=https://api.vidyasetu.in
```

---

## RURAL-002 — No Adaptive Video Quality for 2G/3G

Rural Maharashtra has widespread 2G connectivity (BSNL dominates). HLS video exists in the schema (`videoUrlHLS`) but:
- No adaptive bitrate variants (1080p, 720p, 360p, 144p) are generated
- No network-aware quality selection in Flutter
- No low-bandwidth mode (audio-only fallback)

**Fix:** Use AWS Elastic Transcoder to create multiple quality variants, implement Flutter `connectivity_plus` to auto-select quality.

---

## RURAL-003 — Offline Sync Has No Conflict Resolution

**File:** `mobile/lib/core/storage/local_storage.dart:46-51`

```dart
static Future<void> queueProgressSync(Map data) async {
  final queue = _progressBox.get('sync_queue', ...) as List;
  queue.add(data);
  await _progressBox.put('sync_queue', queue);
  // No conflict resolution strategy
  // If student completes lesson offline, then marks it complete online
  // before sync, duplicate completion records will be created
```

---

## RURAL-004 — No Progressive Download for Large Videos

50MB lesson videos will time out on 2G connections (2G = ~250 Kbps = 1600 seconds for 50MB). No chunked download or resume capability.

---

## RURAL-005 — Raspberry Pi Hub Has No Software Implementation

The OfflineHub model exists, but there is no actual software for the Raspberry Pi device:
- No local API server
- No content sync script
- No student authentication against local DB
- No offline→online progress sync mechanism

This is the most critical rural infrastructure gap — the core promise of "offline school learning" has zero code backing it.

---

# PART 11: FLUTTER MOBILE APP GAPS

## MOB-001 — No Foundation Stage (Class 1-4) UX

The Flutter app shows a subject grid with text labels. Class 1-4 students:
- Cannot read fluently
- Need picture-based navigation
- Need voice guidance
- Cannot type search queries

**Required:** A separate UI mode for grade <= 4 with:
- Large emoji/image-based subject selection
- Voice navigation (TTS reads screen elements)
- No text input — only tap/swipe
- Parent-assisted mode UI

---

## MOB-002 — No Accessibility Implementation

- No `Semantics` widgets for screen reader support
- No font size scaling respect
- No high contrast mode
- No motor accessibility (tap targets < 48dp in some places)

Maharashtra has ~2% disabled school-age population. DPDP requires accessible design.

---

## MOB-003 — No Error State / Empty State Handling

All screens show a simple loading spinner. No:
- Offline error state ("Check your internet connection")
- Empty state for no lessons ("No lessons yet")
- Network timeout retry UI
- Partial data load states

---

## MOB-004 — No Push Notification Handler

```dart
// firebase_messaging is in pubspec.yaml but has zero implementation
// No notification permission request
// No foreground/background message handler
// No deep link from notification to specific content
```

---

## MOB-005 — No Biometric Authentication

Rural students share devices with siblings. No biometric lock (fingerprint/face) to prevent unauthorized access to another student's account.

---

# PART 12: TEACHER PORTAL GAPS

## TEACH-001 — AI Lesson Plan Generator Not Implemented

The teacher portal UI shows an "AI Lesson Plan" button but the API route `/api/v1/teachers/:id/lesson-plans` creates a basic LessonPlan with no AI generation. The AI service has no `/teacher/lesson-plan` endpoint.

---

## TEACH-002 — No Question Paper Print/Export

Teachers need to print question papers for offline exams (no internet in classroom). No PDF generation exists.

**Fix:** Integrate `@react-pdf/renderer` for web and `pdf_render` for Flutter.

---

## TEACH-003 — Student Risk Identification Not Implemented

The PRD requires "Student Risk Identification" (students at risk of dropout or failure). No algorithm, no model, no UI for this critical welfare feature.

**Required:** A student risk scoring model based on:
- Attendance drops > 20% in 2 weeks
- Quiz scores trending downward
- No login for > 7 days
- Multiple consecutive sad/anxious moods

---

## TEACH-004 — No WhatsApp Broadcast to Parents

Teacher communication is limited to in-app announcements. Rural parents don't check the app. WhatsApp broadcasts to parent groups are how communication actually works in Maharashtra schools.

---

# PART 13: EXACT CODE CHANGES REQUIRED

## Change 1 — Fix OTP Security (auth.ts)

```typescript
// BEFORE:
const otp = Math.floor(100000 + Math.random() * 900000).toString();

// AFTER:
import { randomInt } from "crypto";
const otp = randomInt(100000, 999999).toString();
```

## Change 2 — Fix AI Service CORS (ai/main.py)

```python
# BEFORE:
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)

# AFTER:
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)
```

## Change 3 — Fix IDOR in Students Route (students.ts)

```typescript
// Add after authenticate hook, before any data fetch:
async function assertStudentAccess(
  app: FastifyInstance,
  request: FastifyRequest,
  studentId: string
): Promise<void> {
  const { role, userId, schoolId } = request.user!;
  
  if (role === "STUDENT") {
    const student = await app.prisma.student.findFirst({
      where: { id: studentId, userId },
    });
    if (!student) throw { statusCode: 403, message: "Forbidden" };
  }
  
  if (role === "TEACHER" || role === "SCHOOL_ADMIN" || role === "PRINCIPAL") {
    const student = await app.prisma.student.findFirst({
      where: { id: studentId, user: { schoolId } },
    });
    if (!student) throw { statusCode: 403, message: "Forbidden" };
  }
  
  // PARENT: check parentLinks
  if (role === "PARENT") {
    const parent = await app.prisma.parent.findFirst({ where: { userId } });
    const link = await app.prisma.parentStudent.findFirst({
      where: { parentId: parent!.id, studentId },
    });
    if (!link) throw { statusCode: 403, message: "Forbidden" };
  }
}
```

## Change 4 — Fix Flutter API URL (dio_client.dart)

```dart
// lib/core/config/app_config.dart (new file):
class AppConfig {
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://api.vidyasetu.in',
  );
  static const String aiUrl = String.fromEnvironment(
    'AI_URL',
    defaultValue: 'https://ai.vidyasetu.in',
  );
  static const String environment = String.fromEnvironment(
    'ENV',
    defaultValue: 'production',
  );
  static bool get isProduction => environment == 'production';
}

// In dio_client.dart:
baseUrl: '${AppConfig.apiUrl}/api/v1',
```

## Change 5 — Fix LLM Instance Per Request (marathi_tutor.py)

```python
from functools import lru_cache

@lru_cache(maxsize=1)
def get_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.ai_model_name,
        temperature=settings.ai_temperature,
        max_tokens=settings.ai_max_tokens,
        api_key=settings.openai_api_key,
        timeout=30,
        max_retries=2,
    )
```

## Change 6 — Add Missing Prisma Relations

```prisma
// Fix Homework missing relation:
model Homework {
  sectionId   String  @db.Uuid
  section     Section @relation(fields: [sectionId], references: [id])
  @@index([sectionId, dueDate])
}

// Fix TimetableSlot missing teacher relation:
model TimetableSlot {
  teacher     Teacher @relation(fields: [teacherId], references: [id])
  @@unique([sectionId, dayOfWeek, periodNumber, academicYear])
}

// Section model needs reverse relation for Homework:
model Section {
  homeworks   Homework[]
}
```

## Change 7 — Add DPDP Parent Consent (new migration)

See DPDP-001 for full model definition. Additionally update registration:

```typescript
// In POST /auth/register/student:
// If parentPhone provided, create consent record:
if (body.parentPhone) {
  await app.prisma.parentConsent.create({
    data: {
      studentId: user.student!.id,
      parentUserId: parentUser.id,  // after creating parent
      consentVersion: "1.0",
      consentGivenAt: new Date(),
      consentMethod: "SCHOOL_FORM",
      dataCategories: ["academic", "attendance", "behavioral"],
      legalBasis: "CONSENT",
      ipAddress: request.ip,
    }
  });
}
```

## Change 8 — Fix Swagger in Production (app.ts)

```typescript
// Only register Swagger in non-production:
if (process.env.NODE_ENV !== "production") {
  await app.register(swagger, { openapi: { ... } });
  await app.register(swaggerUi, { routePrefix: "/docs" });
}
```

## Change 9 — Fix Assessment IDOR (assessments.ts)

```typescript
// GET /:id/results/:studentId
app.get("/:id/results/:studentId", authenticate, async (request, reply) => {
  const { id: assessmentId, studentId } = request.params as { id: string; studentId: string };
  const { role, userId, schoolId } = request.user!;

  // Students can only see their own results:
  if (role === "STUDENT") {
    const student = await app.prisma.student.findFirst({ where: { userId } });
    if (!student || student.id !== studentId) {
      return reply.code(403).send({ success: false, message: "Forbidden" });
    }
  }
```

## Change 10 — Add Per-Identifier Rate Limiting (app.ts)

```typescript
await app.register(rateLimit, {
  global: true,
  max: 200,
  timeWindow: "1 minute",
  keyGenerator: (req) => {
    // For auth routes, rate limit per identifier
    if (req.url?.startsWith("/api/v1/auth/login")) {
      return `login:${(req.body as any)?.identifier ?? req.ip}`;
    }
    if (req.url?.startsWith("/api/v1/auth/send-otp")) {
      return `otp:${(req.body as any)?.phone ?? req.ip}`;
    }
    return req.ip;
  },
});
```

---

# PART 14: EXACT PRISMA SCHEMA CHANGES REQUIRED

```prisma
// ============================================================
// ADDITION 1: ParentConsent (DPDP required)
// ============================================================
model ParentConsent {
  id                String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  studentId         String   @db.Uuid
  student           Student  @relation(fields: [studentId], references: [id])
  parentUserId      String   @db.Uuid
  consentVersion    String   @default("1.0")
  consentGivenAt    DateTime
  consentMethod     String
  ipAddress         String?
  isWithdrawn       Boolean  @default(false)
  withdrawnAt       DateTime?
  dataCategories    String[]
  legalBasis        String   @default("CONSENT")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  @@index([studentId])
  @@map("parent_consents")
}

// ============================================================
// ADDITION 2: Taluka (Government hierarchy)
// ============================================================
model Taluka {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String
  nameMarathi String?
  code        String   @unique
  districtId  String   @db.Uuid
  district    District @relation(fields: [districtId], references: [id])
  villages    Village[]
  schools     School[]
  createdAt   DateTime @default(now())
  @@map("talukas")
}

// ============================================================
// ADDITION 3: TermResult (Report cards)
// ============================================================
model TermResult {
  id            String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  studentId     String       @db.Uuid
  student       Student      @relation(fields: [studentId], references: [id])
  academicYear  String
  term          Int
  grade         Int
  subjectMarks  SubjectMark[]
  totalMarks    Float?
  percentage    Float?
  rank          Int?
  result        String?
  isPublished   Boolean      @default(false)
  publishedAt   DateTime?
  createdAt     DateTime     @default(now())
  @@unique([studentId, academicYear, term])
  @@map("term_results")
}

model SubjectMark {
  id            String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  termResultId  String     @db.Uuid
  termResult    TermResult @relation(fields: [termResultId], references: [id])
  subjectCode   String
  marksObtained Float
  totalMarks    Float
  grade         String?
  isAbsent      Boolean    @default(false)
  @@map("subject_marks")
}

// ============================================================
// ADDITION 4: AcademicCalendar (Holiday/exam scheduling)
// ============================================================
model AcademicCalendar {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  schoolId    String?  @db.Uuid
  school      School?  @relation(fields: [schoolId], references: [id])
  districtId  String?  @db.Uuid
  academicYear String
  eventDate   DateTime @db.Date
  eventType   String   // HOLIDAY, EXAM, FUNCTION, HALF_DAY, SPORTS
  name        String
  nameMarathi String?
  isStateWide Boolean  @default(false)
  createdAt   DateTime @default(now())
  @@unique([schoolId, eventDate])
  @@map("academic_calendars")
}

// ============================================================
// ADDITION 5: StudentTransfer
// ============================================================
model StudentTransfer {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  studentId     String   @db.Uuid
  student       Student  @relation(fields: [studentId], references: [id])
  fromSchoolId  String   @db.Uuid
  toSchoolId    String?  @db.Uuid
  transferDate  DateTime
  reason        String?
  tcNumber      String?
  approvedById  String?  @db.Uuid
  createdAt     DateTime @default(now())
  @@index([studentId])
  @@map("student_transfers")
}

// ============================================================
// MODIFICATION 1: Fix missing indexes
// ============================================================
model AttendanceRecord {
  // Add:
  @@index([date])
  @@index([studentId, date])
}

model LessonCompletion {
  // Add:
  @@index([lessonId])
  @@index([completedAt])
}

model PointTransaction {
  // Add:
  @@index([pointsId])
}

// ============================================================
// MODIFICATION 2: Fix missing FK on TimetableSlot
// ============================================================
model TimetableSlot {
  teacher      Teacher  @relation(fields: [teacherId], references: [id])
  @@unique([sectionId, dayOfWeek, periodNumber, academicYear])
}

// ============================================================
// MODIFICATION 3: Fix missing FK on Homework
// ============================================================
model Homework {
  section      Section  @relation(fields: [sectionId], references: [id])
  @@index([sectionId, dueDate])
}

// ============================================================
// MODIFICATION 4: CareerGoal unique constraint
// ============================================================
model CareerGoal {
  @@unique([studentId, careerPathId])
}

// ============================================================
// MODIFICATION 5: MoodCheckIn one-per-day
// ============================================================
model MoodCheckIn {
  date     DateTime @db.Date @default(dbgenerated("CURRENT_DATE"))
  @@unique([studentId, date])
}

// ============================================================
// MODIFICATION 6: Remove denormalized counts from School
// ============================================================
model School {
  // Remove: totalStudents Int @default(0)
  // Remove: totalTeachers Int @default(0)
  // These will be computed via _count in queries
}
```

---

# TOP 100 IMPROVEMENTS REQUIRED BEFORE PRODUCTION DEPLOYMENT

## CRITICAL SECURITY (Must fix before any real users)
1. Replace `Math.random()` with `crypto.randomInt()` for OTP generation
2. Add JWT authentication to the AI service (service-to-service tokens)
3. Fix IDOR vulnerability: Add ownership checks on all student data endpoints
4. Remove `passwordHash` from `/auth/me` and all user responses
5. Fix OTP verification: Add attempt counter (max 3 attempts before expiry)
6. Re-enable Content Security Policy with appropriate directives
7. Add per-identifier rate limiting on login and OTP endpoints (not just per-IP)
8. Restrict CORS on AI service to only accept from API service
9. Replace SHA-256 Aadhaar hashing with HMAC-SHA256 using secret key
10. Move secrets from docker-compose.yml to Docker secrets / AWS Secrets Manager
11. Fix IDOR on `GET /assessments/:id/results/:studentId`
12. Disable Swagger UI in production environments
13. Add MIME type validation on S3 presigned URL generation
14. Lock JWT algorithm to `HS256` explicitly in verify config
15. Add brute-force lockout: 5 failed attempts → 15-minute lockout per identifier

## DPDP COMPLIANCE (Legal requirement — mandatory)
16. Create `ParentConsent` Prisma model and collection flow
17. Implement consent withdrawal API and data erasure cascade
18. Build automated 90-day PII purge job for soft-deleted users
19. Replace `PriceClass_All` with `PriceClass_200` on CloudFront (data localization)
20. Implement `GrievanceTicket` model and Grievance Officer portal
21. Add `DataProcessingRecord` model for DPDP Article 7 compliance
22. Build consent dashboard for parents (view/withdraw consent)
23. Add audit events for all data access (not just mutations)
24. Create privacy policy versioning system — consent must be re-collected on policy changes
25. Implement Right to Data Portability: export all student data as JSON/PDF

## DATABASE FIXES
26. Add Taluka model to the geographic hierarchy
27. Create `TermResult` and `SubjectMark` models for report cards
28. Add `AcademicCalendar` model for holiday/exam scheduling
29. Add `StudentTransfer` model with TC number tracking
30. Fix broken FK: `TimetableSlot.teacherId` → add `@relation`
31. Fix broken FK: `Homework.sectionId` → add `@relation`
32. Add `@@unique([studentId, careerPathId])` to CareerGoal
33. Add `@@index([date])` to AttendanceRecord
34. Add `@@index([lessonId])` and `@@index([completedAt])` to LessonCompletion
35. Add `@@index([pointsId])` to PointTransaction
36. Add `@@unique([studentId, date])` to MoodCheckIn (one per day)
37. Remove denormalized `totalStudents`/`totalTeachers` from School model
38. Implement table partitioning on `audit_logs` (partition by month)
39. Replace `School.medium Medium[]` with `SchoolMedium` junction table
40. Replace `SkillPassport.projects Json[]` with `StudentProject` model
41. Add PostgreSQL sequence for atomic `studentId` generation
42. Add `@@unique([sectionId, dayOfWeek, periodNumber, academicYear])` to TimetableSlot

## SCALABILITY
43. Add PgBouncer connection pooler between API and RDS
44. Add RDS read replicas (minimum 2) and route read queries to replicas
45. Enable ElastiCache Redis cluster mode (3 shards)
46. Enable RDS Multi-AZ for automatic failover
47. Batch the analytics snapshot job with max concurrency of 50
48. Cache `GET /curriculum/subjects` (doesn't change — cache 1 hour in Redis)
49. Cache `GET /career/paths` (changes rarely — cache 6 hours)
50. Add CDN (CloudFront) in front of API for GET endpoints

## AI COST OPTIMIZATION
51. Cache LLM instance using `@lru_cache` — stop creating new instances per request
52. Combine main response + follow-up questions into single structured LLM call
53. Implement per-student daily token budget (5000/8000/12000 by stage)
54. Build curriculum content ingestion pipeline to populate Qdrant
55. Add confidence scoring — refuse to answer questions with confidence < 0.7
56. Add topic scope guard — refuse non-curriculum questions
57. Implement response caching: cache identical questions with same context for 24h
58. Use `gpt-4o-mini` for simple queries, reserve `gpt-4o` for complex ones only
59. Add HuggingFace Mixtral as OpenAI fallback
60. Fix async RAG: make `retrieve_context` async to avoid blocking event loop

## INFRASTRUCTURE
61. Add AWS WAF with OWASP managed rule sets
62. Add AWS Application Load Balancer for API traffic distribution
63. Add S3 bucket versioning and public access block
64. Add S3 lifecycle rules for temp files and old content
65. Add AWS Shield Standard (free) for DDoS protection
66. Add CloudWatch alarms for API error rate, RDS CPU, Redis eviction
67. Add AWS Certificate Manager certificate for CloudFront and ALB
68. Remove source code volume mounts from production docker-compose
69. Add ECS auto-scaling policy based on CPU and request count
70. Implement cross-region backup to ap-southeast-1 for DR

## MISSING IMPLEMENTATIONS
71. Implement actual SMS sending via Fast2SMS (OTP and absent alerts)
72. Implement WhatsApp Business API webhook for parent notifications
73. Build parent registration flow triggered from student registration
74. Implement Raspberry Pi offline hub software (local API + sync)
75. Fix Flutter app API URL (`String.fromEnvironment` with production default)
76. Implement push notification handler in Flutter (firebase_messaging)
77. Build Foundation Stage (Class 1-4) picture-based UI in Flutter
78. Add accessibility: `Semantics` widgets and minimum 48dp tap targets in Flutter
79. Implement adaptive video quality selection based on connectivity
80. Add Balbharati content mapping fields to Chapter model

## EDUCATION WORKFLOW
81. Build term-end report card generation (PDF, Maharashtra State Board format)
82. Implement teacher timetable conflict detection on slot creation
83. Build student risk identification algorithm (attendance + quiz trends)
84. Add UDISE+ data export endpoint in government-required format
85. Add re-attempt policy configuration on Assessment model
86. Build question paper PDF export for offline printing
87. Implement co-curricular activity tracking (sports, NSS, NCC)
88. Add school-level academic calendar management
89. Build BRC/CRC hierarchy for government supervisor access
90. Implement student transfer workflow with TC number generation

## PARENT / TEACHER UX
91. Build Aai-Baba Voice Mode using Exotel + Marathi TTS
92. Add WhatsApp broadcast feature for teacher-to-parent communication
93. Implement parent-teacher meeting scheduling
94. Build AI lesson plan generator API endpoint (currently UI stub only)
95. Add detailed error states and offline states in Flutter app
96. Implement biometric app lock in Flutter (for shared-device households)

## MONITORING & OPERATIONS
97. Add structured logging with correlation IDs across all services
98. Implement distributed tracing (AWS X-Ray or OpenTelemetry)
99. Create on-call runbook for top 10 incident scenarios
100. Add automated load testing (k6 or Locust) in CI pipeline — simulate 10K concurrent students before every major deployment

---

## PHASE-WISE IMPLEMENTATION ROADMAP

### Phase 0 — Security Hardening (Weeks 1-3, BEFORE ANY REAL DATA)
- Complete: SEC-001 through SEC-014
- Complete: DPDP-001 through DPDP-006
- Complete: IDOR fixes on all endpoints
- Complete: Production secret management

### Phase 1 — Data Foundation (Weeks 4-6)
- Complete: All database fixes (DB-001 through DB-013)
- Add missing models (Taluka, TermResult, AcademicCalendar, StudentTransfer)
- Build data migration scripts
- Implement PgBouncer + read replicas

### Phase 2 — Core Features (Weeks 7-10)
- Fix Flutter API URL and offline mode
- Implement SMS and WhatsApp notifications
- Build parent registration flow
- Implement term result entry and report cards
- Build student risk identification
- Complete attendance holiday-awareness

### Phase 3 — AI Production Hardening (Weeks 11-13)
- Build Qdrant curriculum ingestion pipeline
- Add token budgets, content filters, hallucination guards
- Optimize LLM calls (single structured call)
- Add OpenAI fallback to HuggingFace

### Phase 4 — Infrastructure Production (Weeks 13-16)
- Deploy WAF, ALB, Multi-AZ RDS
- Configure Redis cluster mode
- Set up CloudWatch alarms and on-call runbooks
- Disaster recovery testing

### Phase 5 — Government Readiness (Weeks 17-20)
- Taluka/BRC/CRC hierarchy implementation
- UDISE+ export format
- Maharashtra government report generation
- DEO/BEO/CRP portal features
