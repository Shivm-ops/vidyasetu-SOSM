import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from models.schemas import TeacherAssistantRequest, TeacherAssistantResponse
from agents.teacher_assistant import generate_teacher_assistant_response

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/intelligence",
    tags=["Educational Intelligence Engine"],
)

# -----------------------------------------------------------------------------
# Pydantic Models
# -----------------------------------------------------------------------------

class StudentPerformanceInput(BaseModel):
    student_id: str
    class_grade: int
    subject: str
    topic: str
    quiz_scores: List[float]

class GrowthEngineMetrics(BaseModel):
    learning_xp: int
    skill_xp: int
    career_xp: int
    innovation_xp: int
    community_xp: int
    growth_level: str

class CareerProfileInput(BaseModel):
    student_id: str
    learning_score: int
    skill_score: int
    interests: List[str]

class ProjectBuilderInput(BaseModel):
    problem_statement: str

class VoiceReportInput(BaseModel):
    student_name: str
    lessons_completed: int
    skills_learned: int
    attendance_percent: int

# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------

@router.post("/learning-recovery")
async def generate_learning_recovery(data: StudentPerformanceInput):
    """
    Adaptive Learning Engine
    Analyzes quiz scores to detect weak/strong concepts and generates a recovery plan.
    """
    logger.info(f"Generating learning recovery plan for {data.student_id}")
    
    # Mock AI logic for Phase 3
    weak_concepts = ["Fractions", "Decimals"] if data.subject == "Mathematics" else ["Unknown"]
    
    return {
        "status": "success",
        "analysis": {
            "weak_concepts": weak_concepts,
            "strong_concepts": ["Addition", "Multiplication"],
            "learning_velocity": 0.8
        },
        "recovery_plan": {
            "daily_missions": [f"Practice 10 {c} questions" for c in weak_concepts],
            "recommended_lessons": ["Basic Fractions Video", "Decimal Division Interactive"]
        }
    }


@router.post("/daily-briefing")
async def generate_daily_briefing(data: GrowthEngineMetrics):
    """
    AI Learning Brain
    Acts as Personal Growth Coach, generating a daily Marathi briefing based on 5-pillar stats.
    """
    logger.info("Generating daily briefing")
    
    # Simple logic: Find the lowest XP pillar
    pillars = {
        "अभ्यास (Learning)": data.learning_xp,
        "कौशल्ये (Skills)": data.skill_xp,
        "करिअर (Career)": data.career_xp,
        "नावीन्य (Innovation)": data.innovation_xp,
        "समाज (Community)": data.community_xp
    }
    
    lowest_pillar = min(pillars, key=pillars.get)
    
    briefing_marathi = f"नमस्कार! तू सध्या {data.growth_level} लेव्हल वर आहेस. आज आपण '{lowest_pillar}' मध्ये प्रगती करूया. आजची मिशन पूर्ण करून तुझी लेव्हल वाढव!"
    
    return {
        "status": "success",
        "briefing_text": briefing_marathi,
        "focus_area": lowest_pillar
    }


@router.post("/career-match")
async def generate_career_match(data: CareerProfileInput):
    """
    Career Match Engine
    Matches student profile to optimal careers.
    """
    logger.info(f"Generating career match for {data.student_id}")
    
    return {
        "status": "success",
        "career_matches": [
            {
                "career": "Agriculture Scientist",
                "match_score": 92,
                "reason": "Strong interest in nature and high science learning scores."
            },
            {
                "career": "Drone Pilot",
                "match_score": 85,
                "reason": "Good spatial awareness skills."
            }
        ]
    }


@router.post("/project-builder")
async def generate_project_plan(data: ProjectBuilderInput):
    """
    AI Project Builder
    Generates a structured solution and project plan for a given problem.
    """
    logger.info(f"Building project for problem: {data.problem_statement}")
    
    return {
        "status": "success",
        "project": {
            "problem": data.problem_statement,
            "solution": "Low-cost water filter using charcoal, sand, and pebbles.",
            "plan_steps": [
                "Gather materials (plastic bottle, charcoal, sand).",
                "Cut the bottle in half.",
                "Layer the materials.",
                "Test with muddy water."
            ],
            "impact_metrics": ["Litres of water purified per day", "Cost per filter"]
        }
    }


@router.post("/voice-report")
async def generate_voice_report(data: VoiceReportInput):
    """
    Parent Voice Reports
    Generates a text summary in Marathi, which would normally be passed to a TTS engine (like Google/AWS).
    """
    logger.info("Generating parent voice report text")
    
    text = (
        f"नमस्कार. या आठवड्यात तुमच्या {data.student_name} ने "
        f"{data.lessons_completed} धडे पूर्ण केले. "
        f"{data.skills_learned} नवीन कौशल्ये शिकली. "
        f"उपस्थिती {data.attendance_percent} टक्के आहे. "
        f"अभिनंदन."
    )
    
    return {
        "status": "success",
        "report_text_marathi": text,
        "audio_url": None # In a real implementation, this would be an S3 URL to the generated MP3
    }

@router.post("/teacher-assistant", response_model=TeacherAssistantResponse)
async def teacher_assistant_endpoint(request: TeacherAssistantRequest):
    """
    Teacher Assistant
    Generates lesson plans, quizzes, and activities.
    """
    logger.info(f"Generating teacher assistant response for {request.task}")
    try:
        return await generate_teacher_assistant_response(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
