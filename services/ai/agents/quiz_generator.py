"""
AI Quiz Generator - generates curriculum-aligned questions in Marathi/English
"""
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from datetime import datetime
import json

from config import get_settings
from models.schemas import QuizGenerationRequest, QuizGenerationResponse, GeneratedQuestion

settings = get_settings()


QUIZ_GENERATION_PROMPT = """Generate {num_questions} {difficulty} difficulty questions for:
- Subject: {subject}
- Grade: {grade}
- Chapter: {chapter}
- Language: {language}
- Question types to include: {question_types}

Maharashtra State Board curriculum aligned.
{marathi_instruction}

Return a JSON array of questions with this exact structure:
[
  {{
    "question_text": "...",
    "question_type": "MCQ|TRUE_FALSE|FILL_BLANK|SHORT_ANSWER",
    "options": [
      {{"id": "a", "text": "...", "isCorrect": false}},
      {{"id": "b", "text": "...", "isCorrect": true}},
      {{"id": "c", "text": "...", "isCorrect": false}},
      {{"id": "d", "text": "...", "isCorrect": false}}
    ],
    "correct_answer": "...",
    "explanation": "...",
    "difficulty": "easy|medium|hard",
    "bloom_level": "REMEMBER|UNDERSTAND|APPLY|ANALYZE"
  }}
]

Return ONLY valid JSON, no other text."""


from utils.llm import get_llm

async def generate_quiz(request: QuizGenerationRequest) -> QuizGenerationResponse:
    llm = get_llm(temperature=0.8, json_mode=True)

    marathi_instruction = (
        "Write ALL questions and answers in Marathi (Devanagari script). "
        "Use Maharashtra State Board Marathi curriculum vocabulary."
        if request.language.value == "mr"
        else ""
    )

    prompt = QUIZ_GENERATION_PROMPT.format(
        num_questions=request.num_questions,
        difficulty=request.difficulty,
        subject=request.subject,
        grade=request.grade,
        chapter=request.chapter,
        language="Marathi" if request.language.value == "mr" else "English",
        question_types=", ".join(request.question_types),
        marathi_instruction=marathi_instruction,
    )

    response = await llm.ainvoke([
        SystemMessage(content="You are an expert Maharashtra State Board question paper setter."),
        HumanMessage(content=prompt),
    ])

    try:
        data = json.loads(response.content)
        questions_data = data if isinstance(data, list) else data.get("questions", [])
        questions = [GeneratedQuestion(**q) for q in questions_data]
    except (json.JSONDecodeError, KeyError, TypeError):
        questions = []

    return QuizGenerationResponse(
        subject=request.subject,
        chapter=request.chapter,
        questions=questions,
        generated_at=datetime.utcnow().isoformat(),
    )
