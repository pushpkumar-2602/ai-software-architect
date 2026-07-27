# AI Software Architect — ML Service

FastAPI microservice providing two capabilities for the AI Software
Architect project:

1. **Requirement Classifier** — TF-IDF + Logistic Regression model that
   categorizes a requirement sentence into one of: `FRONTEND`, `BACKEND`,
   `DATABASE`, `CLOUD`, `AUTHENTICATION`, `PAYMENT`, `NOTIFICATION`,
   `RECOMMENDATION`, `ANALYTICS`, `INTEGRATION`.
2. **RAG pattern retrieval** — an embedded ChromaDB vector store seeded
   with architectural patterns for each scale level (SMALL / MEDIUM /
   LARGE / ENTERPRISE), queryable by free-text description.

No LLM calls happen in this service — it's fully self-contained and free
to run.

## Setup

```bash
cd ml-service
pip install -r requirements.txt

# Train the classifier (creates classifier/model/classifier.pkl)
python classifier/train.py
```

## Run

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Docs available at: http://localhost:8000/docs

## Endpoints

| Method | Path              | Purpose                                  |
|--------|-------------------|-------------------------------------------|
| POST   | `/classify`       | Classify a single requirement string      |
| POST   | `/classify/batch` | Classify a list of requirement strings    |
| POST   | `/rag/query`      | Retrieve architecture patterns for a scale|
| GET    | `/health`         | Health check                              |

### Example: classify

```bash
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "User should be able to reset password via email"}'
```

```json
{
  "category": "AUTHENTICATION",
  "confidence": 0.6567,
  "all_probabilities": { "AUTHENTICATION": 0.6567, "...": 0.0 }
}
```

### Example: RAG query

```bash
curl -X POST http://localhost:8000/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "online food delivery app", "scale": "LARGE", "top_k": 3}'
```

## Notes on this demo build

- The training set in `data/requirements_dataset.csv` has ~80 rows
  (8 per category) — enough to prove the pipeline end-to-end, but too
  small for high held-out accuracy. Add more labeled examples per
  category before relying on this for anything beyond a demo.
- ChromaDB runs in embedded mode (no separate server) and seeds itself
  with the built-in patterns on first startup — nothing to configure.
- This container was verified for syntax/logic in a sandboxed
  environment without internet access, so `pip install` could not be
  executed here. Run the install step above in your own environment
  before starting the server.

## Docker

```bash
docker build -t architect-ml-service .
docker run -p 8000:8000 architect-ml-service
```
