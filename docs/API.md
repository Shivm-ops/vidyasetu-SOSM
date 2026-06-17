# VIDYASETU API Documentation

Base URL: `http://localhost:3001/api/v1`
Interactive Docs: `http://localhost:3001/docs` (Swagger UI)

All responses follow:
```json
{ "success": true, "data": {...}, "pagination": {...} }
{ "success": false, "message": "Error message", "errors": {...} }
```

---

## Authentication

### POST /auth/login
```json
// Request
{ "identifier": "9876543210", "password": "mypassword", "deviceId": "android-uuid" }

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": { "id": "uuid", "role": "STUDENT", "firstName": "Ravi", ... }
  }
}
```

### POST /auth/register/student
```json
{ "phone": "9876543210", "password": "...", "firstName": "Ravi", "lastName": "Patil",
  "firstNameMarathi": "रवि", "grade": 8, "schoolId": "uuid" }
```

### POST /auth/send-otp
```json
{ "phone": "9876543210", "purpose": "LOGIN" }
```

### POST /auth/refresh
```json
{ "refreshToken": "eyJ..." }
```

### GET /auth/me *(Auth required)*
Returns full user profile with student/teacher/parent details.

---

## Students

| Method | Path | Description |
|--------|------|-------------|
| GET | `/students` | List students (teachers/admin only) |
| GET | `/students/:id/dashboard` | Student dashboard data |
| GET | `/students/:id/progress` | Learning progress |
| GET | `/students/:id/badges` | Earned badges |
| GET | `/students/:id/skill-passport` | Digital skill passport |
| POST | `/students/:id/mood` | Submit mood check-in |
| PATCH | `/students/:id/profile` | Update profile |

---

## Curriculum

| Method | Path | Description |
|--------|------|-------------|
| GET | `/curriculum/subjects?grade=8` | Subjects for grade |
| GET | `/curriculum/subjects/:code/chapters` | Chapters with lessons |
| GET | `/curriculum/lessons/:id` | Lesson detail + content |
| POST | `/curriculum/lessons/:id/complete` | Mark lesson complete (awards points) |
| GET | `/curriculum/offline-bundle?grade=5` | Offline download manifest |

### Complete Lesson Request
```json
{ "timeSpentSecs": 1800, "watchPercent": 95, "isOffline": false }
```
**Response** includes `pointsEarned` based on difficulty and completion %.

---

## Assessments

| Method | Path | Description |
|--------|------|-------------|
| GET | `/assessments?grade=8&subjectCode=MATH` | Available assessments |
| GET | `/assessments/:id` | Assessment with questions (answers stripped) |
| POST | `/assessments/:id/start` | Start attempt |
| POST | `/assessments/:id/submit` | Submit answers + auto-grade |
| GET | `/assessments/:id/results/:studentId` | View results with explanations |

### Submit Assessment
```json
{
  "answers": [
    { "assessmentItemId": "uuid", "answerOptionId": "b" },
    { "assessmentItemId": "uuid", "answerText": "भारत" }
  ],
  "timeSpentSecs": 1200
}
```

---

## Attendance

| Method | Path | Description |
|--------|------|-------------|
| POST | `/attendance/mark` | Mark class attendance (teacher) |
| GET | `/attendance/section/:id?date=2024-06-01` | Get attendance for section |
| GET | `/attendance/student/:id/summary` | Student's annual attendance % |

### Mark Attendance
```json
{
  "sectionId": "uuid",
  "date": "2024-06-01T00:00:00Z",
  "records": [
    { "studentId": "uuid", "status": "PRESENT" },
    { "studentId": "uuid", "status": "ABSENT", "remarks": "आजारी" }
  ]
}
```

---

## Career

| Method | Path | Description |
|--------|------|-------------|
| GET | `/career/paths?category=ENGINEERING` | Career paths |
| POST | `/career/goals` | Set career goal |
| GET | `/career/scholarships?grade=10&castCategory=SC` | Find scholarships |
| POST | `/career/scholarships/apply` | Apply for scholarship |
| GET | `/career/recommendations/:studentId` | AI-powered recommendations |

---

## AI Service (Port 8000)

### POST /api/v1/tutor/chat
```json
{
  "session_id": "uuid",
  "student_id": "uuid",
  "grade": 8,
  "subject": "MATH",
  "question": "भिन्न संख्या म्हणजे काय?",
  "language": "mr",
  "history": []
}
```

### POST /api/v1/tutor/story (Class 1-5)
```json
{ "student_id": "uuid", "grade": 3, "topic": "प्रामाणिकपणा", "language": "mr", "length": "short" }
```

### POST /api/v1/tutor/generate-quiz
```json
{
  "subject": "गणित",
  "grade": 7,
  "chapter": "भिन्न संख्या",
  "num_questions": 10,
  "difficulty": "medium",
  "language": "mr"
}
```

### POST /api/v1/career/counsel
```json
{
  "session_id": "uuid",
  "student_id": "uuid",
  "grade": 10,
  "interests": ["गणित", "विज्ञान"],
  "top_subjects": ["MATH", "SCIENCE"],
  "question": "मला इंजिनियर व्हायचे आहे, काय करावे?",
  "language": "mr"
}
```

---

## Rate Limits

| Tier | Limit |
|------|-------|
| Global API | 200 req/min per IP |
| Auth endpoints | 10 req/min per IP |
| AI Chat | 30 req/min per user |
| File Upload | 10 req/min per user |
