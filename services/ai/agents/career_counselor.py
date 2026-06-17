"""
AI Career Counselor for VidyaSetu
Helps students in Class 9-12 discover career paths suited for rural Maharashtra
"""
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from typing import List

from config import get_settings
from models.schemas import CareerCounselorRequest, CareerCounselorResponse, ChatMessage

settings = get_settings()

CAREER_SYSTEM_MARATHI = """तुम्ही विद्यासेतूचे करिअर मार्गदर्शक आहात. तुम्ही ग्रामीण महाराष्ट्रातील इयत्ता {grade} च्या विद्यार्थ्यांना करिअर निवडीसाठी मदत करता.

विद्यार्थ्याची माहिती:
- इयत्ता: {grade}
- आवडीचे विषय: {interests}
- चांगले विषय: {top_subjects}

तुम्ही मार्गदर्शन करताना:
1. विद्यार्थ्याच्या पार्श्वभूमीचा विचार करा (ग्रामीण महाराष्ट्र)
2. ITI, Polytechnic, Government Jobs यांचा विचार करा
3. शेती-आधारित करिअर पर्याय द्या
4. उपलब्ध शिष्यवृत्ती सांगा
5. स्थानिक उदाहरणे वापरा
6. मराठीत बोला

करिअर श्रेणी:
- अभियांत्रिकी (Engineering)
- वैद्यकीय (Medical/Nursing/Pharmacy)
- शासकीय सेवा (Government Jobs - MPSC, Police, Army)
- ITI / Diploma
- कृषी (Agriculture/Horticulture)
- उद्योजकता (Entrepreneurship)
- शिक्षण क्षेत्र (Teaching - TET, NET)
- तंत्रज्ञान (IT/Technology)
- कला/क्रीडा (Arts/Sports)"""


from utils.llm import get_llm

async def run_career_counselor(request: CareerCounselorRequest) -> CareerCounselorResponse:
    llm = get_llm(temperature=0.7)

    system = CAREER_SYSTEM_MARATHI.format(
        grade=request.grade,
        interests=", ".join(request.interests) if request.interests else "माहीत नाही",
        top_subjects=", ".join(request.top_subjects) if request.top_subjects else "माहीत नाही",
    ) if request.language.value == "mr" else f"""You are VidyaSetu's AI Career Counselor for Class {request.grade} students from rural Maharashtra.

Student Profile:
- Grade: {request.grade}
- Interests: {', '.join(request.interests) if request.interests else 'Not specified'}
- Strong subjects: {', '.join(request.top_subjects) if request.top_subjects else 'Not specified'}

Guide with awareness of:
1. Rural Maharashtra context
2. ITI, Polytechnic, Government Jobs pathways
3. Agriculture-related careers
4. Available government scholarships for Maharashtra students
5. Local examples and role models"""

    history_messages = [
        HumanMessage(content=m.content) if m.role == "user" else AIMessage(content=m.content)
        for m in request.history
    ]
    messages = [
        SystemMessage(content=system),
        *history_messages,
        HumanMessage(content=request.question),
    ]

    response = await llm.ainvoke(messages)

    # Extract structured info from response
    advice_text = response.content

    # Parse recommendations (simple heuristic - in prod use structured output)
    lines = advice_text.split("\n")
    recommended_paths = [
        line.lstrip("•-123456789. ").strip()
        for line in lines
        if any(kw in line.lower() for kw in ["career", "करिअर", "path", "क्षेत्र"])
    ][:4]

    return CareerCounselorResponse(
        session_id=request.session_id,
        advice=advice_text,
        recommended_paths=recommended_paths[:3] if recommended_paths else [],
        next_steps=[],
        scholarships=[],
    )
