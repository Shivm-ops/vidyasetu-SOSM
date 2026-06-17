"""
VidyaSetu AI Service
FastAPI application serving all AI agents
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import sentry_sdk

from config import get_settings
from routers.tutor import router as tutor_router
from routers.career import router as career_router
from routers.intelligence import router as intelligence_router
from routers.knowledge import router as knowledge_router
from routers.voice import router as voice_router
from utils.rag import ensure_collection_exists

settings = get_settings()
logger = logging.getLogger(__name__)

if not settings.debug:
    sentry_sdk.init(dsn="", traces_sample_rate=0.1)

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting VidyaSetu AI Service...")
    try:
        ensure_collection_exists(settings.vector_db_collection)
        logger.info(f"Qdrant collection '{settings.vector_db_collection}' ready")
    except Exception as e:
        logger.warning(f"Could not connect to Qdrant: {e}")
    yield
    logger.info("Shutting down VidyaSetu AI Service...")


app = FastAPI(
    title="VidyaSetu AI Service",
    description="AI-powered education platform for rural India - Marathi-first",
    version=settings.app_version,
    lifespan=lifespan,
)

import os
import jwt
from fastapi import Security, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def verify_service_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    try:
        secret = settings.jwt_secret or settings.api_secret
        if not secret:
            raise HTTPException(status_code=500, detail="JWT secret not configured")
        
        payload = jwt.decode(
            credentials.credentials,
            secret,
            algorithms=["HS256"]
        )
        if payload.get("service") != "vidyasetu-api":
            raise HTTPException(status_code=403, detail="Forbidden: Invalid service identifier")
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid service token")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3002,http://localhost:3003,http://localhost:3004").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "vidyasetu-ai",
        "version": settings.app_version,
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error"},
    )


# Register routers
app.include_router(tutor_router, prefix="/api/v1", dependencies=[Depends(verify_service_token)])
app.include_router(career_router, prefix="/api/v1", dependencies=[Depends(verify_service_token)])
app.include_router(intelligence_router, prefix="/api/v1", dependencies=[Depends(verify_service_token)])
app.include_router(knowledge_router, prefix="/api/v1", dependencies=[Depends(verify_service_token)])
app.include_router(voice_router, prefix="/api/v1", dependencies=[Depends(verify_service_token)])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        workers=1 if settings.debug else 4,
    )
