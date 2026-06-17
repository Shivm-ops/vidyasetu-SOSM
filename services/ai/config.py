from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "VidyaSetu AI Service"
    app_version: str = "1.0.0"
    debug: bool = False
    port: int = 8000
    host: str = "0.0.0.0"

    # LLM
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    huggingface_api_key: str = ""
    ai_model_name: str = "gpt-4o-mini"
    ai_temperature: float = 0.7
    ai_max_tokens: int = 1500

    # Vector DB (Qdrant)
    vector_db_url: str = "http://localhost:6333"
    vector_db_collection: str = "vidyasetu_knowledge"
    embedding_model: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Database
    database_url: str = ""

    # API
    api_url: str = "http://localhost:3001"
    api_secret: str = ""
    jwt_secret: str = ""

    # AWS
    aws_region: str = "ap-south-1"
    s3_bucket_name: str = ""

    class Config:
        env_file = "../../.env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
