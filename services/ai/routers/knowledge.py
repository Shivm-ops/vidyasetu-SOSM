import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge & Content Layer"],
)

# -----------------------------------------------------------------------------
# Pydantic Models
# -----------------------------------------------------------------------------

class TeachTopicInput(BaseModel):
    topic_name: str
    class_grade: int
    subject: str

class ContentRecommendationInput(BaseModel):
    student_id: str
    current_topic: str
    performance_score: int

class CareerExplorerInput(BaseModel):
    category: Optional[str] = None
    
class ScholarshipFinderInput(BaseModel):
    student_id: str
    income: float
    caste_category: str
    district: str

# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------

@router.post("/teach-topic")
async def teach_topic(data: TeachTopicInput):
    """
    AI Teaching Engine + Village Context Engine
    Generates a 9-part structured explanation for any given topic.
    """
    logger.info(f"Generating teaching content for topic: {data.topic_name}")
    
    # Mocking Village Context for "Photosynthesis"
    village_analogy = "Sugarcane and Mango Trees making food using sunlight"
    
    if "प्रकाशसंश्लेषण" in data.topic_name or "photosynthesis" in data.topic_name.lower():
        return {
            "status": "success",
            "quality_control": "DRAFT", # Teacher must review AI output before it goes live to students
            "content": {
                "simple_explanation": "प्रकाशसंश्लेषण म्हणजे वनस्पती स्वतःचे अन्न तयार करण्याची प्रक्रिया.",
                "story_based": "एका छोट्याशा गावात एक आंब्याचे झाड होते...",
                "village_context": f"जसे आपण चुलीवर स्वयंपाक करतो, तसेच {village_analogy} पानांमध्ये स्वयंपाक करतात.",
                "real_life_examples": ["उसाची शेती", "घरातील कुंडीतील रोप"],
                "visual_prompts": ["सूर्यप्रकाश पानावर पडतानाचे चित्र"],
                "practice_questions": [
                    {"q": "वनस्पती अन्न कुठे तयार करतात?", "a": "पानांमध्ये"}
                ],
                "quiz_questions": [
                    {"q": "प्रकाशसंश्लेषणासाठी काय आवश्यक आहे?", "options": ["सूर्यप्रकाश", "माती", "खत"], "answer": "सूर्यप्रकाश"}
                ],
                "activities": ["एका पानाला काळ्या कागदाने झाकून ठेवा आणि ३ दिवसांनी पहा."],
                "project_ideas": ["वनस्पती आणि सूर्यप्रकाश यावर प्रयोग करणे."]
            }
        }
    
    # Generic fallback
    return {
        "status": "success",
        "content": {
            "simple_explanation": f"{data.topic_name} ची सोपी माहिती.",
            "village_context": "गावातील उदाहरणासह स्पष्टीकरण.",
            "practice_questions": [],
            "activities": []
        }
    }


@router.post("/recommend")
async def get_content_recommendations(data: ContentRecommendationInput):
    """
    Content Recommendation Engine
    Uses the Topic Knowledge Graph to suggest the Next Best Action.
    """
    logger.info(f"Generating recommendations for student {data.student_id}")
    
    # If performance is low, recommend prerequisite (Recovery Path)
    if data.performance_score < 50:
        return {
            "action": "RECOVERY",
            "recommended_topic": "Fractions Basics",
            "reason": "Before moving forward, let's strengthen the foundation."
        }
    
    return {
        "action": "NEXT_LESSON",
        "recommended_topic": "Decimals and Percentages",
        "reason": "You have mastered Fractions, ready for the next step!"
    }


@router.post("/career-explorer")
async def explore_careers(data: CareerExplorerInput):
    """
    Career Knowledge Base
    Retrieves careers based on category (Agriculture, Engineering, etc.)
    """
    logger.info(f"Exploring careers in category: {data.category}")
    
    # Mock Career Profiles
    return {
        "status": "success",
        "careers": [
            {
                "title": "Agriculture Scientist (कृषी शास्त्रज्ञ)",
                "category": "Agriculture",
                "income_range": "₹4L - ₹12L per year",
                "education": ["B.Sc Agriculture", "M.Sc Agriculture"],
                "skills": ["Research", "Biology", "Soil Analysis"]
            },
            {
                "title": "Solar Technician (सौर तंत्रज्ञ)",
                "category": "Technology",
                "income_range": "₹2L - ₹6L per year",
                "education": ["ITI / Diploma in Electrical"],
                "skills": ["Electrical wiring", "Problem solving"]
            }
        ]
    }


@router.post("/scholarship-finder")
async def find_scholarships(data: ScholarshipFinderInput):
    """
    Scholarship Recommendation Engine
    Matches student to scholarship knowledge base.
    """
    logger.info(f"Finding scholarships for student {data.student_id}")
    
    return {
        "status": "success",
        "matches": [
            {
                "name": "MahaDBT Post Matric Scholarship",
                "eligibility": "Income < ₹2.5L",
                "deadline": "2024-12-31",
                "required_docs": ["Income Certificate", "Caste Certificate", "Aadhaar"]
            }
        ]
    }
