from functools import lru_cache
from langchain_openai import ChatOpenAI
from config import get_settings

settings = get_settings()

@lru_cache(maxsize=16)
def get_llm(temperature: float = 0.7, max_tokens: int = 1500, json_mode: bool = False) -> ChatOpenAI:
    model_kwargs = {}
    if json_mode:
        model_kwargs["response_format"] = {"type": "json_object"}

    return ChatOpenAI(
        model=settings.ai_model_name,
        temperature=temperature,
        max_tokens=max_tokens,
        api_key=settings.openai_api_key,
        timeout=30,
        max_retries=2,
        model_kwargs=model_kwargs if json_mode else None
    )
