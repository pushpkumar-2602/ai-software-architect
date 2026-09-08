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


# ============================================================
# Global component holders
# ============================================================
classifier: Optional[RequirementClassifier] = None



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize ML model and vector store on startup."""
    global classifier

    try:
        classifier = RequirementClassifier()
        print("Requirement classifier loaded successfully")
    except FileNotFoundError:
        print("WARNING: Classifier model not found. "
              "Run 'python classifier/train.py' first.")

   

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

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "classifier_loaded": classifier is not None
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
