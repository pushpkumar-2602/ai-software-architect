"""
============================================================
File: ml-service/rag/vector_store.py
Purpose: Manages the ChromaDB vector store for
         architectural pattern retrieval
============================================================
"""

import chromadb
from chromadb.config import Settings


class ArchitectureVectorStore:
    """
    Manages architectural patterns in ChromaDB for
    Retrieval-Augmented Generation (RAG).
    """

    def __init__(self):
        # Initialize ChromaDB (embedded mode - no server needed)
        self.client = chromadb.Client(Settings(
            anonymized_telemetry=False
        ))

        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="architecture_patterns",
            metadata={"hnsw:space": "cosine"}
        )

        # Load patterns if collection is empty
        if self.collection.count() == 0:
            self._load_initial_patterns()

    def _load_initial_patterns(self):
        """Loads predefined architectural patterns into ChromaDB."""

        patterns = [
            # ------ SMALL SCALE PATTERNS ------
            {
                "id": "mono-small-001",
                "document": (
                    "Monolithic Architecture for Small Scale: "
                    "Single deployable unit. Spring Boot application "
                    "with embedded Tomcat. Single PostgreSQL instance. "
                    "Session-based authentication. Simple vertical "
                    "scaling. Suitable for up to 100 concurrent users. "
                    "Deploy on single EC2 t3.medium or equivalent."
                ),
                "metadata": {
                    "scale": "SMALL",
                    "category": "architecture",
                    "pattern": "monolithic"
                }
            },
            {
                "id": "db-small-001",
                "document": (
                    "Database for Small Scale: Single PostgreSQL "
                    "instance. No read replicas needed. Simple "
                    "indexing strategy. Weekly backups. Connection "
                    "pool of 10-20 connections. Consider SQLite for "
                    "prototyping."
                ),
                "metadata": {
                    "scale": "SMALL",
                    "category": "database",
                    "pattern": "single-instance"
                }
            },

            # ------ MEDIUM SCALE PATTERNS ------
            {
                "id": "micro-medium-001",
                "document": (
                    "Microservices for Medium Scale: Decompose into "
                    "5-10 services. API Gateway (Spring Cloud Gateway "
                    "or Kong). Service discovery with Eureka or "
                    "Consul. Load balancer (Nginx or ALB). Redis "
                    "caching layer. RabbitMQ for async messaging. "
                    "Suitable for 10,000 concurrent users. "
                    "Horizontal scaling with 2-3 instances per "
                    "service."
                ),
                "metadata": {
                    "scale": "MEDIUM",
                    "category": "architecture",
                    "pattern": "microservices"
                }
            },
            {
                "id": "db-medium-001",
                "document": (
                    "Database for Medium Scale: PostgreSQL with "
                    "read replicas. Connection pooling with PgBouncer "
                    "(100+ connections). Proper indexing strategy. "
                    "Consider database-per-service pattern. Redis "
                    "for session store and caching. Daily automated "
                    "backups with point-in-time recovery."
                ),
                "metadata": {
                    "scale": "MEDIUM",
                    "category": "database",
                    "pattern": "read-replicas"
                }
            },
            {
                "id": "auth-medium-001",
                "document": (
                    "Authentication for Medium Scale: JWT-based "
                    "stateless authentication. OAuth2 with Spring "
                    "Security. Refresh token rotation. Rate limiting "
                    "on auth endpoints. Redis for token blacklisting. "
                    "Consider Keycloak for enterprise SSO."
                ),
                "metadata": {
                    "scale": "MEDIUM",
                    "category": "authentication",
                    "pattern": "jwt-oauth2"
                }
            },

            # ------ LARGE SCALE PATTERNS ------
            {
                "id": "dist-large-001",
                "document": (
                    "Distributed Architecture for Large Scale: "
                    "Event-driven microservices. Apache Kafka for "
                    "event streaming. CQRS pattern (Command Query "
                    "Responsibility Segregation). Saga pattern for "
                    "distributed transactions. Circuit breaker "
                    "(Resilience4j). Service mesh (Istio). "
                    "Kubernetes orchestration. CDN for static "
                    "assets. Multi-AZ deployment. Suitable for "
                    "1M+ concurrent users."
                ),
                "metadata": {
                    "scale": "LARGE",
                    "category": "architecture",
                    "pattern": "event-driven"
                }
            },
            {
                "id": "db-large-001",
                "document": (
                    "Database for Large Scale: Sharded PostgreSQL "
                    "or distributed database (CockroachDB, "
                    "YugabyteDB). Read replicas per shard. "
                    "Elasticsearch for search. Redis Cluster for "
                    "distributed caching. Event sourcing for "
                    "audit trail. Consider polyglot persistence "
                    "(different databases for different services)."
                ),
                "metadata": {
                    "scale": "LARGE",
                    "category": "database",
                    "pattern": "sharding"
                }
            },
            {
                "id": "payment-large-001",
                "document": (
                    "Payment System for Large Scale: PCI-DSS "
                    "compliant isolated service. Idempotent "
                    "payment processing. Saga pattern for "
                    "distributed transactions. Dead letter queue "
                    "for failed payments. Stripe or Adyen "
                    "integration. Separate database for financial "
                    "data. Encryption at rest and in transit."
                ),
                "metadata": {
                    "scale": "LARGE",
                    "category": "payment",
                    "pattern": "saga"
                }
            },

            # ------ ENTERPRISE SCALE PATTERNS ------
            {
                "id": "global-ent-001",
                "document": (
                    "Global Enterprise Architecture: Multi-region "
                    "active-active deployment. Global load balancing "
                    "(Cloudflare or AWS Global Accelerator). "
                    "Geo-replicated databases (CockroachDB or "
                    "Spanner). Event-driven with Kafka across "
                    "regions. Feature flags for gradual rollouts. "
                    "Zero-downtime deployments. Chaos engineering "
                    "practices. SLA 99.99%."
                ),
                "metadata": {
                    "scale": "ENTERPRISE",
                    "category": "architecture",
                    "pattern": "global-distributed"
                }
            },
            {
                "id": "observ-ent-001",
                "document": (
                    "Observability for Enterprise: Distributed "
                    "tracing (Jaeger/Zipkin). Centralized logging "
                    "(ELK Stack or Datadog). Metrics (Prometheus + "
                    "Grafana). Alerting (PagerDuty). SLI/SLO "
                    "monitoring. Cost monitoring. Automated "
                    "incident response runbooks."
                ),
                "metadata": {
                    "scale": "ENTERPRISE",
                    "category": "observability",
                    "pattern": "full-observability"
                }
            }
        ]

        # Add all patterns to ChromaDB
        self.collection.add(
            ids=[p["id"] for p in patterns],
            documents=[p["document"] for p in patterns],
            metadatas=[p["metadata"] for p in patterns]
        )

        print(f"Loaded {len(patterns)} architectural patterns "
              f"into ChromaDB")

    def query(self, query_text: str, scale: str,
              top_k: int = 5) -> list:
        """
        Queries ChromaDB for relevant architectural patterns.

        Args:
            query_text: The project description or requirement
            scale: Scale level (SMALL/MEDIUM/LARGE/ENTERPRISE)
            top_k: Number of results to return

        Returns:
            List of relevant pattern documents
        """
        results = self.collection.query(
            query_texts=[query_text],
            n_results=top_k,
            where={"scale": scale}
        )

        if results and results['documents'] and results['documents'][0]:
            return results['documents'][0]

        # Fallback: query without scale filter
        results = self.collection.query(
            query_texts=[query_text],
            n_results=top_k
        )

        return results['documents'][0] if results['documents'] else []
