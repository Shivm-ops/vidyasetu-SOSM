import uuid
from typing import Optional

from models.schemas import TutorRequest, TutorResponse
from agents.marathi_tutor import run_tutor

# Mock DB interaction since this is an example
# In production, we would query the `KnowledgeBaseArticle` Prisma table
KNOWLEDGE_BASE = {
    "what is photosynthesis?": "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.",
    "प्रकाशसंश्लेषण म्हणजे काय?": "प्रकाशसंश्लेषण ही अशी प्रक्रिया आहे ज्याद्वारे वनस्पती सूर्यप्रकाश, पाणी आणि कार्बन डायऑक्साइड वापरून ऑक्सिजन आणि शर्कराच्या स्वरूपात ऊर्जा निर्माण करतात.",
}

async def run_rag_tutor(request: TutorRequest) -> TutorResponse:
    """
    RAG Architecture Workflow:
    1. Check Local Knowledge Base (Cost $0)
    2. If found, return instantly.
    3. If not found, fallback to expensive AI call.
    4. Save new AI answer to Knowledge Base.
    """
    latest_message = request.messages[-1].content.strip().lower()

    # 1. Search Knowledge Base (Mocking vector search with simple dict lookup)
    if latest_message in KNOWLEDGE_BASE:
        print(f"RAG Cache HIT! Cost saved for query: {latest_message}")
        answer = KNOWLEDGE_BASE[latest_message]
        
        return TutorResponse(
            session_id=request.session_id,
            reply=answer,
            suggested_questions=[
                "या प्रक्रियेत कोणते वायू वापरले जातात?",
                "वनस्पतींना सूर्यप्रकाशाची आवश्यकता का असते?"
            ],
            language=request.language
        )
    
    # 2. If not found, call standard LangChain Tutor
    print(f"RAG Cache MISS. Calling LLM for: {latest_message}")
    ai_response = await run_tutor(request)
    
    # 3. Save back to Knowledge Base to optimize future costs
    KNOWLEDGE_BASE[latest_message] = ai_response.reply
    
    return ai_response
