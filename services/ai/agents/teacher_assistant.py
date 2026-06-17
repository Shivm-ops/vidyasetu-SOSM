"""
AI Teacher Assistant Agent
Generates lesson plans, activities, and summaries for teachers in Marathi/English
"""
import json
from langchain_core.messages import SystemMessage, HumanMessage
from config import get_settings
from models.schemas import TeacherAssistantRequest, TeacherAssistantResponse
from utils.llm import get_llm

settings = get_settings()

LESSON_PLAN_PROMPT = """Generate a comprehensive 45-minute lesson plan for:
- Subject: {subject}
- Grade: Class {grade}
- Topic: {topic}
- Language: {language}

{marathi_instruction}

Return a JSON object with this exact structure:
{{
  "title": "Lesson title",
  "objective": "What students will learn",
  "duration": "45 minutes",
  "sections": [
    {{
      "name": "Introduction (5 mins)",
      "content": "...",
      "duration_mins": 5
    }},
    {{
      "name": "Core Concept (20 mins)",
      "content": "...",
      "duration_mins": 20
    }},
    {{
      "name": "Activity/Engagement (15 mins)",
      "content": "...",
      "duration_mins": 15
    }},
    {{
      "name": "Summary & Homework (5 mins)",
      "content": "...",
      "duration_mins": 5
    }}
  ]
}}

Return ONLY valid JSON, no other text.
"""

GENERAL_TASK_PROMPT = """You are an expert Teacher Assistant for Maharashtra State Board.
Task: Generate a {task} for {subject}, Grade {grade}, Topic: {topic}.
Language: {language}
Additional Context: {context}

{marathi_instruction}

Return your response in clear, formatted Markdown.
"""

async def generate_teacher_assistant_response(request: TeacherAssistantRequest) -> TeacherAssistantResponse:
    marathi_instruction = (
        "Write ALL content in Marathi (Devanagari script). "
        "Use Maharashtra State Board Marathi curriculum vocabulary and local village examples where possible."
        if request.language.value == "mr"
        else ""
    )

    if request.task == "lesson_plan":
        llm = get_llm(temperature=0.7, json_mode=True)
        prompt = LESSON_PLAN_PROMPT.format(
            subject=request.subject,
            grade=request.grade,
            topic=request.topic,
            language="Marathi" if request.language.value == "mr" else "English",
            marathi_instruction=marathi_instruction,
        )
    else:
        llm = get_llm(temperature=0.7, json_mode=False)
        prompt = GENERAL_TASK_PROMPT.format(
            task=request.task,
            subject=request.subject,
            grade=request.grade,
            topic=request.topic,
            language="Marathi" if request.language.value == "mr" else "English",
            context=request.additional_context or "None",
            marathi_instruction=marathi_instruction,
        )

    response = await llm.ainvoke([
        SystemMessage(content="You are an expert Teacher Assistant helping educators in rural Maharashtra."),
        HumanMessage(content=prompt),
    ])

    structured_output = None
    content = response.content

    if request.task == "lesson_plan":
        try:
            structured_output = json.loads(response.content)
            content = "Lesson plan generated successfully in structured format."
        except (json.JSONDecodeError, TypeError):
            # Fallback
            structured_output = None
            content = response.content

    return TeacherAssistantResponse(
        session_id=request.session_id,
        content=content,
        structured_output=structured_output
    )
