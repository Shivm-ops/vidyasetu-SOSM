from fastapi import APIRouter, HTTPException
from models.schemas import CareerCounselorRequest, CareerCounselorResponse
from agents.career_counselor import run_career_counselor

router = APIRouter(prefix="/career", tags=["AI Career Counselor"])


@router.post("/counsel", response_model=CareerCounselorResponse)
async def career_counseling(request: CareerCounselorRequest):
    """AI Career Counselor for Class 9-12 students."""
    try:
        return await run_career_counselor(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
