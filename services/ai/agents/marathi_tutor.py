"""
Marathi AI Tutor Agent using LangGraph with RAG
Supports Class 1-12, multilingual (Marathi primary)
"""
from typing import TypedDict, List, Optional, Annotated
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
import operator

from config import get_settings
from utils.rag import build_rag_context
from models.schemas import TutorRequest, TutorResponse, ChatMessage

settings = get_settings()


class TutorState(TypedDict):
    messages: Annotated[List, operator.add]
    student_grade: int
    subject: Optional[str]
    language: str
    rag_context: str
    response: str
    follow_up_questions: List[str]


SYSTEM_PROMPT_MARATHI = """तुम्ही विद्यासेतूचे AI शिक्षक आहात. तुम्ही इयत्ता {grade} च्या विद्यार्थ्यांना {subject} शिकवता.

तुमच्याबद्दल:
- तुम्ही प्रेमळ, संयमी आणि उत्साही शिक्षक आहात
- तुम्ही मराठीत उत्तर द्याल
- तुम्ही सोप्या भाषेत समजावून सांगाल
- ग्रामीण महाराष्ट्रातील मुलांसाठी स्थानिक उदाहरणे वापराल
- प्रत्येक उत्तरानंतर एक प्रश्न विचाराल

अभ्यास संदर्भ:
{context}

नियम:
- कधीही चुकीची माहिती देऊ नका
- विद्यार्थ्याला प्रोत्साहन द्या
- कठीण संकल्पना सोप्या उदाहरणांनी समजवा
- उत्तर {grade} च्या स्तरावर असावे"""

SYSTEM_PROMPT_ENGLISH = """You are VidyaSetu's AI Teacher for Class {grade} students studying {subject}.

Your personality:
- Warm, patient, encouraging teacher
- Use simple language appropriate for rural Maharashtra students
- Give local and relatable examples from village life
- Always end with an engaging follow-up question

Curriculum Context:
{context}

Rules:
- Never provide incorrect information
- Celebrate student curiosity
- Break complex concepts into simple steps
- Keep explanations at Class {grade} level"""


def get_system_prompt(grade: int, subject: str, language: str, context: str) -> str:
    template = SYSTEM_PROMPT_MARATHI if language == "mr" else SYSTEM_PROMPT_ENGLISH
    return template.format(grade=grade, subject=subject or "सामान्य", context=context or "")


from utils.llm import get_llm as _get_llm

def get_llm() -> ChatOpenAI:
    return _get_llm(
        temperature=settings.ai_temperature,
        max_tokens=settings.ai_max_tokens,
    )


def retrieve_context(state: TutorState) -> TutorState:
    last_message = state["messages"][-1] if state["messages"] else None
    query = last_message.content if last_message else ""

    context = build_rag_context(
        query=query,
        grade=state["student_grade"],
        subject=state.get("subject"),
    )
    return {**state, "rag_context": context}


def generate_response(state: TutorState) -> TutorState:
    llm = get_llm()
    system_prompt = get_system_prompt(
        grade=state["student_grade"],
        subject=state.get("subject", ""),
        language=state["language"],
        context=state["rag_context"],
    )

    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    response = llm.invoke(messages)
    return {**state, "response": response.content}


def generate_follow_ups(state: TutorState) -> TutorState:
    llm = get_llm()

    prompt = f"""Based on this tutoring conversation about Class {state['student_grade']} {state.get('subject', '')},
generate 3 short follow-up questions a student might ask next.
Language: {'Marathi' if state['language'] == 'mr' else 'English'}
Last answer: {state['response'][:200]}

Return only 3 questions, one per line."""

    result = llm.invoke([HumanMessage(content=prompt)])
    questions = [q.strip() for q in result.content.strip().split("\n") if q.strip()][:3]
    return {**state, "follow_up_questions": questions}


def build_tutor_graph() -> StateGraph:
    workflow = StateGraph(TutorState)

    workflow.add_node("retrieve", retrieve_context)
    workflow.add_node("respond", generate_response)
    workflow.add_node("follow_ups", generate_follow_ups)

    workflow.set_entry_point("retrieve")
    workflow.add_edge("retrieve", "respond")
    workflow.add_edge("respond", "follow_ups")
    workflow.add_edge("follow_ups", END)

    return workflow.compile()


_tutor_graph = None


def get_tutor_graph():
    global _tutor_graph
    if _tutor_graph is None:
        _tutor_graph = build_tutor_graph()
    return _tutor_graph


async def run_tutor(request: TutorRequest) -> TutorResponse:
    graph = get_tutor_graph()

    lc_messages = [
        HumanMessage(content=m.content) if m.role == "user" else AIMessage(content=m.content)
        for m in request.history
    ]
    lc_messages.append(HumanMessage(content=request.question))

    initial_state: TutorState = {
        "messages": lc_messages,
        "student_grade": request.grade,
        "subject": request.subject,
        "language": request.language.value,
        "rag_context": "",
        "response": "",
        "follow_up_questions": [],
    }

    final_state = await graph.ainvoke(initial_state)

    return TutorResponse(
        session_id=request.session_id,
        answer=final_state["response"],
        follow_up_questions=final_state["follow_up_questions"],
        related_topics=[],
    )
