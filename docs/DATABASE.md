# VIDYASETU — Database Design

## Entity Relationship Overview

```
Geography:        State → District → Block → Village
Institution:      Village → School → ClassGrade → Section
Users:            User (base) → Student / Teacher / Parent / SchoolAdmin / Mentor
Enrollment:       Student ←→ Section (via Enrollment)
Curriculum:       Subject → Chapter → Lesson → LessonContent
Assessment:       Assessment → AssessmentItem → QuestionBankItem
Student Activity: LessonCompletion, AssessmentAttempt, AttendanceRecord
Progress:         StudentProgress, LearningStreak
Gamification:     LearningPoints, Badge, StudentBadge, SkillPassport
Career:           CareerPath, CareerGoal, Scholarship, ScholarshipApplication
Community:        VillageLearningCircle, VLCMember, CommunityPost, Mentorship
Wellbeing:        MoodCheckIn, WellbeingGoal
AI:               AIConversation → AIMessage, AIFeedback
Offline:          OfflineHub, OfflineSyncLog
Analytics:        SchoolAnalyticsSnapshot
Audit:            AuditLog, UserSession
```

## Key Design Decisions

### 1. User polymorphism via single table
All user types (Student, Teacher, Parent) share the `users` table for authentication,
and have dedicated profile tables (`students`, `teachers`, `parents`) for role-specific data.
This simplifies auth while keeping domain logic separate.

### 2. Soft deletes on User
`isDeleted + deletedAt` columns — never hard-delete user records.
DPDP Act requires 90-day retention before purge.

### 3. Aadhaar hashing
Aadhaar is stored as a SHA-256 hash (`aadhaarHash`) — never in plaintext.

### 4. Multilingual content
- `nameMarathi`, `titleMarathi`, `descriptionMarathi` columns on all content entities
- `language` enum on `LessonContent` — same lesson can have Marathi + English + Hindi content
- `preferredLanguage` on `User` — API serves correct language automatically

### 5. Academic year
Stored as "2024-25" string (not a date range). Simplifies queries and reporting.
Helper function: June-May academic year convention for Maharashtra.

### 6. JSON for flexible data
- `QuestionBankItem.options` — MCQ options as JSON (array of `{id, text, isCorrect, explanation}`)
- `CareerPath.roadmapSteps` — career roadmap steps
- `SkillPassport.skills` — skill levels map (`{"coding": 3, "math": 4}`)
- `User.deviceInfo` — push notification device details

### 7. Unique constraints for business rules
- `Enrollment`: (studentId, sectionId, academicYear) unique
- `AttendanceRecord`: (studentId, sectionId, date) unique
- `LessonCompletion`: (studentId, lessonId) unique
- `StudentBadge`: (studentId, badgeId) unique
- `ScholarshipApplication`: (studentId, scholarshipId) unique

## Performance Indexes

Key indexes created:
```sql
-- Most frequently filtered
CREATE INDEX idx_users_school ON users(schoolId);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_grade ON students(grade);
CREATE INDEX idx_attendance_section_date ON attendance_records(sectionId, date);
CREATE INDEX idx_lesson_completions_student ON lesson_completions(studentId);
CREATE INDEX idx_ai_conversations_student ON ai_conversations(studentId);
CREATE INDEX idx_notifications_user_read ON user_notifications(userId, isRead);

-- Full-text search (Marathi)
CREATE INDEX idx_lessons_title_trgm ON lessons USING gin(title_marathi gin_trgm_ops);
CREATE INDEX idx_users_name_trgm ON users USING gin(first_name_marathi gin_trgm_ops);
```

## Estimated Sizes at Scale

| Table | Rows | Size estimate |
|-------|------|---------------|
| users | 5.6M | ~2 GB |
| students | 5M | ~1 GB |
| attendance_records | 500M+ | ~40 GB |
| lesson_completions | 100M+ | ~8 GB |
| assessment_attempts | 50M | ~4 GB |
| ai_conversations | 10M | ~500 MB |
| audit_logs | 1B+ | ~80 GB (partitioned by month) |
