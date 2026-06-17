from fastapi import APIRouter, HTTPException, Depends
from slowapi import Limiter
from slowapi.util import get_remote_address

from models.schemas import (
    TutorRequest, TutorResponse,
    StoryRequest, StoryResponse,
    QuizGenerationRequest, QuizGenerationResponse,
)
from agents.rag_tutor import run_rag_tutor
from agents.story_teller import generate_story
from agents.quiz_generator import generate_quiz

router = APIRouter(prefix="/tutor", tags=["AI Tutor"])


@router.post("/chat", response_model=TutorResponse)
async def chat_with_tutor(request: TutorRequest):
    """Chat with the Marathi AI Tutor using RAG Architecture."""
    try:
        return await run_rag_tutor(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/story", response_model=StoryResponse)
async def generate_story_endpoint(request: StoryRequest):
    """Generate an age-appropriate story in Marathi (Class 1-4)."""
    if request.grade > 5:
        raise HTTPException(status_code=400, detail="Story generation is for Class 1-5 only")
    try:
        return await generate_story(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-quiz", response_model=QuizGenerationResponse)
async def generate_quiz_endpoint(request: QuizGenerationRequest):
    """Generate curriculum-aligned quiz questions."""
    try:
        return await generate_quiz(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
