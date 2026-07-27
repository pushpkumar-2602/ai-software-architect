"""
============================================================
File: ml-service/app.py
Purpose: FastAPI service providing ML classification
         and RAG query endpoints
============================================================
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from classifier.predict import RequirementClassifier
from rag.vector_store import ArchitectureVectorStore

# ============================================================
# Global component holders
# ============================================================
classifier: Optional[RequirementClassifier] = None
vector_store: Optional[ArchitectureVectorStore] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize ML model and vector store on startup."""
    global classifier, vector_store

    try:
        classifier = RequirementClassifier()
        print("Requirement classifier loaded successfully")
    except FileNotFoundError:
        print("WARNING: Classifier model not found. "
              "Run 'python classifier/train.py' first.")

    vector_store = ArchitectureVectorStore()
    print("Vector store initialized successfully")

    yield
    # (no teardown needed)


# ============================================================
# Initialize FastAPI App
# ============================================================
app = FastAPI(
    title="AI Software Architect - ML Service",
    description="ML Classification and RAG for architectural patterns",
    version="1.0.0",
    lifespan=lifespan,
)


# ============================================================
# Request/Response Models
# ============================================================
class ClassifyRequest(BaseModel):
    text: str


class ClassifyResponse(BaseModel):
    category: str
    confidence: float
    all_probabilities: dict


class BatchClassifyRequest(BaseModel):
    texts: List[str]


class RagQueryRequest(BaseModel):
    query: str
    scale: str
    top_k: Optional[int] = 5


class RagQueryResponse(BaseModel):
    patterns: List[str]


# ============================================================
# Endpoints
# ============================================================

@app.post("/classify", response_model=ClassifyResponse)
async def classify_requirement(request: ClassifyRequest):
    """
    Classifies a single requirement text into a category.

    Categories: FRONTEND, BACKEND, DATABASE, CLOUD,
    AUTHENTICATION, PAYMENT, NOTIFICATION, RECOMMENDATION,
    ANALYTICS, INTEGRATION, OTHER
    """
    if classifier is None:
        raise HTTPException(
            status_code=503,
            detail="Classifier not initialized. "
                   "Train the model first."
        )

    result = classifier.predict(request.text)
    return ClassifyResponse(**result)


@app.post("/classify/batch")
async def classify_batch(request: BatchClassifyRequest):
    """Classifies multiple requirement texts at once."""
    if classifier is None:
        raise HTTPException(
            status_code=503,
            detail="Classifier not initialized."
        )

    results = classifier.predict_batch(request.texts)
    return {"classifications": results}


@app.post("/rag/query", response_model=RagQueryResponse)
async def query_patterns(request: RagQueryRequest):
    """
    Queries the vector database for relevant
    architectural patterns based on project description
    and scale level.
    """
    if vector_store is None:
        raise HTTPException(
            status_code=503,
            detail="Vector store not initialized."
        )

    patterns = vector_store.query(
        query_text=request.query,
        scale=request.scale,
        top_k=request.top_k
    )

    return RagQueryResponse(patterns=patterns)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "classifier_loaded": classifier is not None,
        "vector_store_loaded": vector_store is not None
    }


# ============================================================
# Run Server
# ============================================================
if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
