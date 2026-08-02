# ============================================================
# File: ml-service/Dockerfile
# ============================================================
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python classifier/train.py

RUN mkdir -p /root/.cache/chroma/onnx_models/all-MiniLM-L6-v2 && \
    curl -L --retry 15 --retry-delay 5 --retry-all-errors --continue-at - \
    -o /root/.cache/chroma/onnx_models/all-MiniLM-L6-v2/onnx.tar.gz \
    https://chroma-onnx-models.s3.amazonaws.com/all-MiniLM-L6-v2/onnx.tar.gz

RUN python -c "from rag.vector_store import ArchitectureVectorStore; ArchitectureVectorStore()"

EXPOSE 8000

CMD ["python3", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]