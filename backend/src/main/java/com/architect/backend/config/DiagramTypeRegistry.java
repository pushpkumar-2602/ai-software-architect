package com.architect.backend.config;

import java.util.LinkedHashMap;
import java.util.Map;

public class DiagramTypeRegistry {

    public record DiagramSpec(String displayName, String syntaxGuide) {}

    public static final Map<String, DiagramSpec> TYPES = new LinkedHashMap<>();

    static {
        TYPES.put("system-architecture", new DiagramSpec(
                "High-Level System Architecture Diagram",
                "Use Mermaid flowchart syntax (flowchart TD). Show the main components " +
                "(frontend, backend/API, database, external services) and communication direction."
        ));

        TYPES.put("er-diagram", new DiagramSpec(
                "Entity Relationship Diagram",
                "Use Mermaid erDiagram syntax. Show 3-6 core tables with key columns and " +
                "relationships (one-to-many, many-to-many) using proper crow's foot notation."
        ));

        TYPES.put("use-case", new DiagramSpec(
                "UML Use Case Diagram",
                "Use Mermaid flowchart syntax to approximate a use case diagram: actors as " +
                "rectangles on the left, use cases as rounded nodes, connected by lines."
        ));

        TYPES.put("sequence-main-flow", new DiagramSpec(
                "UML Sequence Diagram for the main user flow",
                "Use Mermaid sequenceDiagram syntax. Show the primary user action (e.g. placing " +
                "an order, booking, submitting a request) across participants: User, Frontend, " +
                "Backend, Database, and any relevant external service."
        ));

        TYPES.put("class-diagram", new DiagramSpec(
                "UML Class Diagram",
                "Use Mermaid classDiagram syntax. Show 3-6 core domain classes with key " +
                "attributes and methods, and their relationships (inheritance, composition, association)."
        ));

                TYPES.put("activity-diagram", new DiagramSpec(
                "UML Activity Diagram for the main business process",
                "Use Mermaid flowchart syntax (flowchart TD) with decision diamonds " +
                "for branching logic, representing the step-by-step activity flow."
        ));

        TYPES.put("state-diagram", new DiagramSpec(
                "UML State Diagram for the primary entity's lifecycle",
                "Use Mermaid stateDiagram-v2 syntax. Show the states the main entity " +
                "(e.g. an order, appointment, ticket) moves through and the transitions between them."
        ));

        TYPES.put("component-diagram", new DiagramSpec(
                "UML Component Diagram",
                "Use Mermaid flowchart syntax (flowchart LR) grouping related nodes with " +
                "subgraphs to represent software modules (frontend, backend, database, auth, " +
                "external services) and their dependencies."
        ));

        TYPES.put("deployment-diagram", new DiagramSpec(
                "UML Deployment Diagram",
                "Use Mermaid flowchart syntax (flowchart TD) with subgraphs representing " +
                "physical/cloud nodes (e.g. containers, load balancer, database server) and " +
                "what runs on each."
        ));

        TYPES.put("dfd-context", new DiagramSpec(
                "Data Flow Diagram - Context Level (Level 0)",
                "Use Mermaid flowchart syntax (flowchart LR). Show the system as a single " +
                "process node, with external entities around it and labeled arrows showing data flow direction."
        ));

        TYPES.put("microservices-communication", new DiagramSpec(
                "Microservices Communication Diagram",
                "Use Mermaid flowchart syntax (flowchart LR). Show each microservice as a node, " +
                "and label arrows with how they communicate (REST, message queue, pub/sub)."
        ));

        TYPES.put("network-architecture", new DiagramSpec(
                "Network / Infrastructure Architecture Diagram",
                "Use Mermaid flowchart syntax (flowchart TD) with subgraphs for network zones. " +
                "Show internet, load balancer, API gateway, application servers, database, and caching layer."
        ));

        TYPES.put("security-architecture", new DiagramSpec(
                "Security Architecture Diagram",
                "Use Mermaid flowchart syntax (flowchart TD). Show authentication, " +
                "authorization, encryption points, and where security controls sit relative " +
                "to the request flow."
        ));

        TYPES.put("cicd-pipeline", new DiagramSpec(
                "CI/CD Pipeline Diagram",
                "Use Mermaid flowchart syntax (flowchart LR). Show the pipeline stages from " +
                "code commit through build, test, containerization, and deployment."
        ));

        TYPES.put("sdlc-workflow", new DiagramSpec(
                "SDLC Workflow Diagram",
                "Use Mermaid flowchart syntax (flowchart TD). Show the software development " +
                "life cycle phases from requirements gathering through deployment and maintenance, in order."
        ));

        TYPES.put("user-journey", new DiagramSpec(
                "User Journey Diagram",
                "Use Mermaid journey syntax EXACTLY in this shape, with no deviations:\n" +
                "journey\n" +
                "    title A short title\n" +
                "    section Section Name\n" +
                "      Task name: 5: Actor\n" +
                "      Another task: 3: Actor\n" +
                "    section Another Section\n" +
                "      Task name: 4: Actor\n" +
                "Every line under a section MUST be a task line in the format " +
                "'Task name: score: Actor' where score is 1-5. Never leave a section " +
                "with no task lines under it."
        ));

        TYPES.put("api-interaction", new DiagramSpec(
                "API Interaction Diagram",
                "Use Mermaid flowchart syntax (flowchart LR). Show how a client request " +
                "travels through gateway, backend, cache, database, and any external APIs."
        ));

        TYPES.put("infrastructure-diagram", new DiagramSpec(
                "Cloud Infrastructure Diagram",
                "Use Mermaid flowchart syntax (flowchart TD) with subgraphs. Show load " +
                "balancing, compute, database, caching, storage, and monitoring components."
        ));
        
    }
}
