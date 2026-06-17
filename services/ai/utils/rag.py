from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
from typing import List, Optional
import uuid
import logging

from config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

_embedding_model: Optional[SentenceTransformer] = None
_qdrant_client: Optional[QdrantClient] = None


def get_embedding_model() -> SentenceTransformer:
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer(settings.embedding_model)
    return _embedding_model


def get_qdrant_client() -> QdrantClient:
    global _qdrant_client
    if _qdrant_client is None:
        _qdrant_client = QdrantClient(url=settings.vector_db_url)
    return _qdrant_client


def ensure_collection_exists(collection_name: str, vector_size: int = 384):
    client = get_qdrant_client()
    collections = [c.name for c in client.get_collections().collections]
    if collection_name not in collections:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )
        logger.info(f"Created Qdrant collection: {collection_name}")


def embed_text(text: str) -> List[float]:
    model = get_embedding_model()
    return model.encode(text, normalize_embeddings=True).tolist()


def upsert_document(
    collection_name: str,
    doc_id: str,
    text: str,
    metadata: dict,
):
    client = get_qdrant_client()
    vector = embed_text(text)
    client.upsert(
        collection_name=collection_name,
        points=[
            PointStruct(
                id=doc_id,
                vector=vector,
                payload={"text": text, **metadata},
            )
        ],
    )


def search_similar(
    collection_name: str,
    query: str,
    top_k: int = 5,
    filters: Optional[dict] = None,
) -> List[dict]:
    client = get_qdrant_client()
    query_vector = embed_text(query)

    from qdrant_client.models import Filter, FieldCondition, MatchValue

    qdrant_filter = None
    if filters:
        conditions = [
            FieldCondition(key=k, match=MatchValue(value=v))
            for k, v in filters.items()
        ]
        qdrant_filter = Filter(must=conditions)

    results = client.search(
        collection_name=collection_name,
        query_vector=query_vector,
        limit=top_k,
        query_filter=qdrant_filter,
        with_payload=True,
    )

    return [
        {
            "id": str(r.id),
            "score": r.score,
            "text": r.payload.get("text", ""),
            "metadata": {k: v for k, v in r.payload.items() if k != "text"},
        }
        for r in results
    ]


def build_rag_context(query: str, grade: int, subject: Optional[str] = None) -> str:
    """Retrieve relevant curriculum content for RAG."""
    filters = {"grade": str(grade)}
    if subject:
        filters["subject"] = subject

    results = search_similar(
        collection_name=settings.vector_db_collection,
        query=query,
        top_k=3,
        filters=filters if filters else None,
    )

    if not results:
        return ""

    context_parts = [f"[{i+1}] {r['text']}" for i, r in enumerate(results)]
    return "\n\n".join(context_parts)
