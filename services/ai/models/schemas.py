from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from enum import Enum


class Language(str, Enum):
    MARATHI = "mr"
    ENGLISH = "en"
    HINDI = "hi"


class AgentType(str, Enum):
    MARATHI_TUTOR = "marathi_tutor"
    HOMEWORK_HELPER = "homework_helper"
    CAREER_COUNSELOR = "career_counselor"
    TEACHER_ASSISTANT = "teacher_assistant"
    PARENT_ASSISTANT = "parent_assistant"
    SCHOLARSHIP_FINDER = "scholarship_finder"
    STORY_TELLER = "story_teller"
    QUIZ_GENERATOR = "quiz_generator"


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class TutorRequest(BaseModel):
    session_id: str
    student_id: str
    grade: int = Field(ge=1, le=12)
    subject: Optional[str] = None
    question: str
    language: Language = Language.MARATHI
    history: List[ChatMessage] = []
    context: Optional[str] = None  # lesson content for RAG


class TutorResponse(BaseModel):
    session_id: str
    answer: str
    follow_up_questions: List[str] = []
    related_topics: List[str] = []
    difficulty_feedback: Optional[str] = None
    audio_url: Optional[str] = None


class CareerCounselorRequest(BaseModel):
    session_id: str
    student_id: str
    grade: int
    interests: List[str] = []
    top_subjects: List[str] = []
    question: str
    language: Language = Language.MARATHI
    history: List[ChatMessage] = []


class CareerCounselorResponse(BaseModel):
    session_id: str
    advice: str
    recommended_paths: List[str] = []
    next_steps: List[str] = []
    scholarships: List[str] = []


class TeacherAssistantRequest(BaseModel):
    session_id: str
    teacher_id: str
    subject: str
    grade: int
    topic: str
    task: Literal["lesson_plan", "quiz", "activity", "remedial", "summary"]
    language: Language = Language.MARATHI
    additional_context: Optional[str] = None


class TeacherAssistantResponse(BaseModel):
    session_id: str
    content: str
    structured_output: Optional[dict] = None


class StoryRequest(BaseModel):
    student_id: str
    grade: int
    topic: Optional[str] = None
    moral: Optional[str] = None
    language: Language = Language.MARATHI
    length: Literal["short", "medium", "long"] = "short"


class StoryResponse(BaseModel):
    title: str
    story: str
    moral: str
    questions: List[str] = []


class QuizGenerationRequest(BaseModel):
    subject: str
    grade: int
    chapter: str
    num_questions: int = Field(default=10, ge=3, le=30)
    difficulty: Literal["easy", "medium", "hard"] = "medium"
    question_types: List[str] = ["MCQ", "TRUE_FALSE", "FILL_BLANK"]
    language: Language = Language.MARATHI


class GeneratedQuestion(BaseModel):
    question_text: str
    question_type: str
    options: Optional[List[dict]] = None
    correct_answer: str
    explanation: str
    difficulty: str
    bloom_level: str


class QuizGenerationResponse(BaseModel):
    subject: str
    chapter: str
    questions: List[GeneratedQuestion]
    generated_at: str


class ParentReportRequest(BaseModel):
    parent_id: str
    student_id: str
    language: Language = Language.MARATHI
    report_type: Literal["weekly", "monthly", "exam"] = "weekly"


class ParentReportResponse(BaseModel):
    student_name: str
    report_period: str
    attendance_summary: str
    academic_summary: str
    behavioral_insights: str
    recommendations: List[str]
    positive_highlights: List[str]
