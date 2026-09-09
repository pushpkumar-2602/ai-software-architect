# AI Software Architect

An AI-powered full-stack application that turns a plain-text software project idea into a structured software architecture package using specialized AI agents.

**Live Demo:** https://architect-frontend-j2mw.onrender.com
**GitHub:** https://github.com/pushpkumar-2602/ai-software-architect

---

## Overview

AI Software Architect allows a user to describe a software project, select its expected scale, and automatically generate:

- Functional and non-functional requirements
- System architecture
- Database design
- DevOps recommendations
- 17 engineering diagrams
- Persistent project history
- PNG exports of generated diagrams

The system uses multiple specialized AI agents coordinated by a Spring Boot backend. Generated results are stored in PostgreSQL so they can be viewed again without making another AI request.

---

## Architecture

```text
                    ┌─────────────────┐
                    │     Browser     │
                    └────────┬────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ React + Vite        │
                  │ Frontend + Nginx    │
                  └──────────┬──────────┘
                             │ REST
                             ▼
                  ┌─────────────────────┐
                  │ Spring Boot Backend │
                  │ Java 17             │
                  └──────┬──────┬───────┘
                         │      │
               ┌─────────┘      └──────────┐
               ▼                           ▼
      ┌─────────────────┐         ┌────────────────┐
      │ Neon PostgreSQL │         │  Gemini API    │
      │                 │         │ AI Generation  │
      └─────────────────┘         └────────────────┘
                         │
                         ▼
                  ┌─────────────────┐
                  │ FastAPI ML      │
                  │ Microservice    │
                  └─────────────────┘
```

### Generation Flow

```text
Project Description
        │
        ▼
   Spring Boot
        │
        ├── Requirement Analyst Agent
        ├── System Architect Agent
        ├── Database Architect Agent
        └── DevOps Planner Agent
                    │
                    ▼
               Gemini API
                    │
                    ▼
          Architecture Result
                    │
                    ▼
             PostgreSQL
```

For diagrams:

```text
Project
   │
   ▼
DiagramAgent
   │
   ▼
Gemini generates Mermaid syntax
   │
   ▼
Mermaid.js
   │
   ▼
Rendered SVG
   │
   ▼
PNG Export
```

---

## Features

### AI Architecture Generation

Four specialized agents analyze the same project description:

- **Requirement Analyst** — functional and non-functional requirements
- **System Architect** — architecture pattern, services and REST endpoints
- **Database Architect** — tables, relationships and indexing
- **DevOps Planner** — testing, security risks and deployment timeline

The agents are coordinated by `OrchestrationService`.

### Scale-Aware Architecture

Users can select:

- Small
- Medium
- Large
- Enterprise

The selected scale is included in the AI prompts so the generated architecture can adapt accordingly.

### 17 Engineering Diagrams

A reusable `DiagramAgent` generates Mermaid syntax for multiple diagram types, including:

- System Architecture
- ER Diagram
- Use Case
- Sequence
- Class
- Activity
- State
- Component
- Deployment
- Data Flow
- Microservices Communication
- Network Architecture
- Security Architecture
- CI/CD Pipeline
- SDLC Workflow
- User Journey
- API Interaction
- Infrastructure Diagram

### Project History

Generated projects and diagrams are stored in PostgreSQL.

Users can:

- View previous projects
- Reopen generated architectures
- View previously generated diagrams
- Delete projects

Previously generated results do not require another Gemini API call.

### Diagram Export

Generated Mermaid diagrams are rendered as SVG in the browser and can be exported as PNG images.

### Rate-Limit Handling

Gemini `429` responses are handled with exponential backoff. The frontend also prevents multiple diagram-generation requests from running simultaneously.

---

## Technology Stack

| Layer               | Technology                   |
| ------------------- | ---------------------------- |
| Frontend            | React 19, Vite, JavaScript   |
| Styling             | Plain CSS                    |
| Diagram Rendering   | Mermaid.js                   |
| Backend             | Spring Boot, Java 17         |
| HTTP Client         | Spring WebClient             |
| ORM                 | Spring Data JPA / Hibernate  |
| Database            | PostgreSQL                   |
| Production Database | Neon                         |
| ML Service          | Python, FastAPI              |
| ML Model            | TF-IDF + Logistic Regression |
| AI                  | Google Gemini API            |
| Containerization    | Docker + Docker Compose      |
| Deployment          | Render                       |
| Version Control     | Git + GitHub                 |

---

## Project Structure

```text
ai-software-architect/
│
├── backend/
│   └── src/main/java/com/architect/backend/
│       ├── controller/
│       │   └── HelloController.java
│       │
│       ├── entity/
│       │   ├── Project.java
│       │   ├── ArchitectureResult.java
│       │   └── Diagram.java
│       │
│       ├── repository/
│       │   ├── ProjectRepository.java
│       │   ├── ArchitectureResultRepository.java
│       │   └── DiagramRepository.java
│       │
│       ├── service/
│       │   ├── GeminiService.java
│       │   ├── MlServiceClient.java
│       │   └── OrchestrationService.java
│       │
│       ├── agent/
│       │   ├── RequirementAnalystAgent.java
│       │   ├── SystemArchitectAgent.java
│       │   ├── DatabaseArchitectAgent.java
│       │   ├── DevOpsPlannerAgent.java
│       │   └── DiagramAgent.java
│       │
│       └── config/
│           ├── WebConfig.java
│           └── DiagramTypeRegistry.java
│
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── DiagramViewer.jsx
│       ├── App.css
│       └── main.jsx
│
├── ml-service/
│   ├── app.py
│   ├── classifier/
│   │   ├── train.py
│   │   ├── predict.py
│   │   └── model/
│   └── data/
│       └── requirements_dataset.csv
│
├── docker-compose.yml
└── README.md
```

---

## Important Backend Components

### `OrchestrationService`

Coordinates the four core AI agents and combines their outputs into one `ArchitectureResult`.

### `GeminiService`

Handles communication with the Gemini API and includes retry/backoff logic for rate limits.

### `DiagramAgent`

A generic agent reused for all diagram types instead of creating a separate Java class for every diagram.

### `DiagramTypeRegistry`

Stores the diagram type, display name and Mermaid syntax instructions. Adding another diagram type only requires adding a new registry entry.

---

## Database

The application uses three main entities:

### `projects`

Stores the original project information.

```text
id
project_name
description
expected_users
created_at
```

### `architecture_results`

Stores the generated architecture.

```text
id
project_id
requirements
architecture
database
devops
created_at
```

### `diagrams`

Stores generated Mermaid diagrams.

```text
id
project_id
diagram_type
mermaid_code
created_at
```

Relationships:

```text
Project
 ├── 1 ArchitectureResult
 └── N Diagrams
```

---

## Main API Endpoints

| Method | Endpoint                         | Purpose                |
| ------ | -------------------------------- | ---------------------- |
| POST   | `/projects`                      | Create a project       |
| GET    | `/projects`                      | List projects          |
| GET    | `/projects/{id}`                 | Get a project          |
| DELETE | `/projects/{id}`                 | Delete project         |
| POST   | `/projects/{id}/generate`        | Generate architecture  |
| GET    | `/projects/{id}/result`          | Get saved architecture |
| POST   | `/projects/{id}/diagrams/{type}` | Generate a diagram     |
| GET    | `/projects/{id}/diagrams`        | Get saved diagrams     |
| GET    | `/check-ml`                      | Check ML service       |
| GET    | `/test-gemini`                   | Test Gemini connection |

---

## Running Locally

### Prerequisites

- Java 17
- Python 3.x
- Node.js
- PostgreSQL
- Docker Desktop
- Google Gemini API key

### Docker Compose

The easiest way to run the complete system:

```bash
git clone https://github.com/pushpkumar-2602/ai-software-architect.git

cd ai-software-architect

export GEMINI_API_KEY="your_api_key"

docker-compose up --build
```

Then open:

```text
http://localhost:5173
```

### Run Services Individually

#### ML Service

```bash
cd ml-service

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

python classifier/train.py

python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

#### Backend

```bash
cd backend

./mvnw spring-boot:run
```

#### Frontend

```bash
cd frontend

npm install
npm run dev
```

---

## Environment Variables

```text
GEMINI_API_KEY
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
APP_ML_SERVICE_URL
VITE_API_URL
```

The application uses environment-based URLs so the same code can run locally, in Docker, and in production.

---

## Deployment

The project is deployed using:

- **Render** — frontend, backend and ML service
- **Neon** — managed PostgreSQL database
- **GitHub** — source control and automatic deployment

The deployed architecture is:

```text
Browser
   ↓
Render Frontend
   ↓
Render Backend
   ├──→ Neon PostgreSQL
   ├──→ Render ML Service
   └──→ Gemini API
```

---

## Current Limitations

- No authentication or authorization
- All API endpoints are currently public
- The ML classifier is independently deployed but is not currently part of the main architecture-generation pipeline
- Only PNG diagram export is implemented
- No automated backend/frontend test suite yet
- The four core agents currently run sequentially
- Backend REST endpoints are currently grouped in one controller
- Render free-tier services can sleep after inactivity

---

## Future Improvements

- Add authentication and per-user projects
- Integrate the ML classifier into the AI generation pipeline
- Run independent AI agents in parallel
- Add automated unit and integration tests
- Split the large controller into dedicated controllers
- Add pagination for project history
- Add more robust Mermaid validation
- Support additional diagram export formats

---

## Project Goal

The main goal of this project was to build a real, deployed, multi-service AI application while learning the underlying engineering concepts.

It combines:

**React → Spring Boot → AI Agents → Gemini → PostgreSQL → Python ML Service → Docker → Cloud Deployment**

The project also focuses on engineering decisions such as service separation, persistence, environment-based configuration, retry handling, reusable AI components, and production deployment.
