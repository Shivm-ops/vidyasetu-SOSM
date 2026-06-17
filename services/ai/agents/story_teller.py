"""
AI Story Teller for Foundation Stage (Class 1-4)
Generates age-appropriate stories in Marathi with moral values
"""
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from config import get_settings
from models.schemas import StoryRequest, StoryResponse

settings = get_settings()

STORY_SYSTEM = """तुम्ही विद्यासेतूचे बालकथाकार आहात. इयत्ता {grade} च्या मुलांसाठी (वय {age_range}) सुंदर कथा लिहा.

कथा लिहिताना:
- महाराष्ट्रातील गावातील पार्श्वभूमी वापरा
- पात्रे: शेतकरी, शाळकरी मुले, प्राणी, निसर्ग
- सरळ सोपी मराठी भाषा
- नैतिक मूल्ये: प्रामाणिकपणा, मेहनत, मैत्री, आदर
- {length_guide}

कथा संरचना:
1. शीर्षक (Title)
2. कथा (Story)
3. नैतिक धडा (Moral): एक वाक्य
4. समज तपासा (Comprehension Questions): 3 प्रश्न"""

LENGTH_GUIDE = {
    "short": "कथा 150-200 शब्दांची असावी",
    "medium": "कथा 300-400 शब्दांची असावी",
    "long": "कथा 500-600 शब्दांची असावी",
}

AGE_RANGE = {1: "6-7", 2: "7-8", 3: "8-9", 4: "9-10"}


from utils.llm import get_llm

async def generate_story(request: StoryRequest) -> StoryResponse:
    llm = get_llm(temperature=0.9)

    system = STORY_SYSTEM.format(
        grade=request.grade,
        age_range=AGE_RANGE.get(request.grade, "6-10"),
        length_guide=LENGTH_GUIDE.get(request.length, LENGTH_GUIDE["short"]),
    )

    topic_prompt = f"विषय: {request.topic}" if request.topic else "तुम्ही स्वतः एक सुंदर विषय निवडा"
    moral_prompt = f"नैतिक धडा: {request.moral}" if request.moral else ""

    prompt = f"""एक सुंदर बालकथा लिहा.
{topic_prompt}
{moral_prompt}

खाली दिलेल्या format मध्ये उत्तर द्या:

शीर्षक: [कथेचे शीर्षक]

कथा:
[कथा येथे लिहा]

नैतिक धडा: [एक वाक्य]

प्रश्न:
1. [प्रश्न १]
2. [प्रश्न २]
3. [प्रश्न ३]"""

    response = await llm.ainvoke([
        SystemMessage(content=system),
        HumanMessage(content=prompt),
    ])

    text = response.content
    lines = text.split("\n")

    title = ""
    story_lines = []
    moral = ""
    questions = []

    current_section = None
    for line in lines:
        line = line.strip()
        if line.startswith("शीर्षक:"):
            title = line.replace("शीर्षक:", "").strip()
        elif line.startswith("कथा:"):
            current_section = "story"
        elif line.startswith("नैतिक धडा:"):
            moral = line.replace("नैतिक धडा:", "").strip()
            current_section = "moral"
        elif line.startswith("प्रश्न:"):
            current_section = "questions"
        elif current_section == "story" and line:
            story_lines.append(line)
        elif current_section == "questions" and line and line[0].isdigit():
            q = line.lstrip("0123456789. ").strip()
            if q:
                questions.append(q)

    return StoryResponse(
        title=title or "एक सुंदर कथा",
        story="\n".join(story_lines),
        moral=moral or "मेहनत करणाऱ्याला यश मिळते.",
        questions=questions[:3],
    )
