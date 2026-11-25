# MASE V2 — Multi-Agent Simulation Engine

> **Status: Phase 0 — Project Initialization**
>
> The repository currently contains only the planned directory structure and documentation. No functional MASE components, application code, or dependencies have been implemented or installed yet.

---

## A. Project Introduction

**MASE V2 (Multi-Agent Simulation Engine)** is an AI engineering final-year project developed by a team of three students. It is a multi-agent AI orchestration engine that receives user requests and intelligently selects specialized AI agents to accomplish tasks.

### What Problem It Solves

Many LLM-based applications rely on either a single general-purpose prompt or a fixed, hardcoded chain of agents. Both approaches have clear limitations:

- **Fixed heavy pipelines** waste tokens, money, and time by running multiple expensive agents on simple requests.
- **Single-agent setups** struggle on complex tasks that benefit from structured division of labor, critique, source verification, or document grounding.
- **Lack of observability** makes it difficult to inspect why an agent pipeline succeeded or failed, or to compare alternative agent configurations objectively.

### Why Multi-Agent Orchestration & Learned Routing

Multi-agent orchestration breaks complex requests into focused roles—such as generating ideas, critiquing weaknesses, verifying facts, or extracting citations—coordinated through a shared architecture.

The core innovation of MASE V2 is its **Learned Router**. Instead of relying solely on static `if/else` rules or always invoking the maximum number of agents, the Learned Router predicts which valid agent configuration will best balance three competing objectives for a given request:

- **Response quality**
- **Execution cost**
- **Latency**

### Academic Objective

The main academic objective of MASE V2 is to design, implement, and empirically evaluate an observable multi-agent orchestration engine where routing decisions are informed by offline machine learning trained on structured execution traces and benchmark evaluations.

---

## B. How MASE Works

A typical request flows through MASE V2 as follows:

1. **User Request:** The user submits a request (and optionally uploads a document) through the React frontend.
2. **API Reception:** FastAPI receives the request, validates its schema, and forwards it to the engine.
3. **Routing Decision:** The **Learned Router** selects a valid configuration of agents suited to the request.
4. **Orchestration:** The **Orchestrator** takes the selected configuration and manages execution order, agent dependencies, and workflow completion.
5. **Agent Communication:** Specialized agents exchange structured messages through the **Message Bus** and read/write intermediate context in **Shared Memory**.
6. **External Capabilities:** Agents access external tools and capabilities (such as LLM APIs, web search, or PDF parsing) through the **Adapter Layer**.
7. **Response Synthesis:** The system combines the agents' outputs into a final structured response returned to the user.
8. **Trace Capture:** Execution events, messages, timings, and costs are saved in the **Trace Store** for **Simulation Replay** and **Evaluation**.
9. **Offline Router Training:** An offline ML pipeline uses benchmark results and historical traces to train and improve future routing decisions.

### Router vs. Orchestrator

- **Learned Router (Selection):** Decides *which* valid agent configuration should handle a request, optimizing for quality, cost, and latency.
- **Orchestrator (Execution):** Executes the chosen configuration—managing step ordering, dependencies, parallel or sequential execution, and state transitions.

> **Note on Training:** Model training does **not** occur automatically after every user request. Routing models are trained and evaluated **offline** using curated datasets, execution traces, and benchmark runs.

---

## C. Core Components

- **Learned Router:** Selects an appropriate agent configuration for an incoming request based on learned trade-offs between quality, cost, and latency.
- **Orchestrator:** Coordinates the execution lifecycle of the selected agents, enforcing dependencies and execution order.
- **Agent Registry:** Maintains metadata about available agents, their capabilities, input/output contracts, and valid configurations.
- **Message Bus:** Provides structured, traceable message passing between agents during a simulation run.
- **Shared Memory:** Stores shared session context, intermediate artifacts, and state accessible to collaborating agents.
- **Adapter Layer:** Abstracts external integrations (e.g., LLM providers, search tools, PDF extraction) behind clean interfaces so core logic stays decoupled.
- **Trace Store & Simulation Replay:** Persists step-by-step execution events, messages, and metrics so past runs can be replayed, inspected, and debugged.
- **Evaluation Framework:** Benchmarks agent configurations and routing strategies against quality, cost, and latency metrics.

---

## D. Main Services

MASE V2 organizes its specialized agents around three primary user-facing services:

### 1. Brainstorm Engine

Generates, evaluates, critiques, and improves ideas through structured multi-agent collaboration (e.g., ideator, critic, refiner).

- **Example request:** *"Propose 5 monetization ideas for a campus carpooling app and critique the feasibility of each."*
- **Expected result:** A structured list of ideas accompanied by feasibility critiques, identified risks, and refined recommendations.

### 2. Research Engine

Searches for information, analyzes sources, verifies facts, and produces structured research reports.

- **Example request:** *"Compare the main consensus mechanisms used in modern Layer-1 blockchains with recent trade-offs."*
- **Expected result:** A synthesized research report comparing the mechanisms, highlighting verified facts, and citing the analyzed sources.

### 3. Document Analyzer

Processes PDF documents, extracts information, analyzes content, verifies claims, and produces summaries with page references.

- **Example request:** *"Summarize the methodology and key experimental limitations of this uploaded PDF paper."*
- **Expected result:** A structured summary of the methodology and limitations with explicit page references (e.g., `p. 4`, `pp. 7–8`) grounded in the document.

---

## E. Repository Structure

```text
MASE/
│
├── backend/
│   ├── api/
│   ├── core/
│   │   ├── orchestrator/
│   │   ├── registry/
│   │   ├── message_bus/
│   │   └── memory/
│   ├── agents/
│   ├── services/
│   │   ├── brainstorm/
│   │   ├── research/
│   │   └── document_analyzer/
│   ├── adapters/
│   ├── router/
│   ├── database/
│   └── schemas/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── hooks/
│
├── ml/
│   ├── datasets/
│   ├── training/
│   ├── evaluation/
│   └── models/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── architecture/
│   ├── conception/
│   └── diagrams/
│
├── scripts/
│
├── README.md
└── .gitignore
```

### Folder Descriptions

#### `backend/`
- `backend/api/` — Will contain FastAPI routes, WebSocket endpoints, and request/response handling.
- `backend/core/` — Will house the core MASE orchestration engine independent of specific services.
- `backend/core/orchestrator/` — Will contain execution logic responsible for scheduling agents, respecting dependencies, and coordinating workflows.
- `backend/core/registry/` — Will manage agent definitions, capabilities, and valid agent configuration schemas.
- `backend/core/message_bus/` — Will implement structured, traceable inter-agent messaging.
- `backend/core/memory/` — Will manage shared working memory and intermediate state across agent steps.
- `backend/agents/` — Will contain reusable agent abstractions and specialized agent implementations.
- `backend/services/` — Will contain the high-level service workflows built on top of the core engine.
- `backend/services/brainstorm/` — Will implement the Brainstorm Engine workflow (idea generation, critique, and refinement).
- `backend/services/research/` — Will implement the Research Engine workflow (information retrieval, source analysis, and fact verification).
- `backend/services/document_analyzer/` — Will implement the Document Analyzer workflow (PDF ingestion, claim verification, and page-referenced summaries).
- `backend/adapters/` — Will provide clean adapter interfaces to external APIs and tools (e.g., LLM providers, search, PDF parsing).
- `backend/router/` — Will contain the runtime router interface that loads trained routing models and selects agent configurations.
- `backend/database/` — Will contain database models, connection setup, migrations, and trace storage persistence.
- `backend/schemas/` — Will define shared Pydantic data contracts for requests, responses, messages, and trace events.

#### `frontend/`
- `frontend/components/` — Will contain reusable React UI components (chat panels, trace viewers, agent graphs, file uploaders).
- `frontend/pages/` — Will contain top-level application views (workspace, simulation replay, evaluation dashboard).
- `frontend/services/` — Will contain API and WebSocket client modules for communicating with the FastAPI backend.
- `frontend/hooks/` — Will contain custom React hooks for state management, streaming updates, and API queries.

#### `ml/`
- `ml/datasets/` — Will store dataset preparation scripts and structured benchmark/trace datasets used for router training.
- `ml/training/` — Will contain scripts and experiments used to train the learned routing models.
- `ml/evaluation/` — Will contain evaluation scripts and metrics for comparing routing strategies on quality, cost, and latency.
- `ml/models/` — Will hold model loading/export utilities and local trained model artifacts (ignored by Git when large).

#### `tests/`
- `tests/unit/` — Will contain isolated unit tests for core components, agents, adapters, and router utilities.
- `tests/integration/` — Will contain integration tests verifying interactions across the orchestrator, message bus, database, and APIs.
- `tests/e2e/` — Will contain end-to-end tests simulating full user requests across the system.

#### `docs/`
- `docs/architecture/` — Will contain architecture decision records (ADRs) and system design documentation.
- `docs/conception/` — Will contain project conception documents, specifications, and academic reports.
- `docs/diagrams/` — Will contain technical diagrams explaining system architecture, workflows, and component interactions.

#### `scripts/`
- `scripts/` — Will contain developer utility scripts (e.g., data seeding, benchmark runners, local dev helpers).

---

## F. Planned Technical Stack

> **Note:** The technologies below are **planned** for the project and have **not** been installed or configured yet.

| Layer | Planned Technologies |
| :--- | :--- |
| **Backend & API** | Python, FastAPI, WebSockets |
| **Frontend** | React, TypeScript |
| **Database** | PostgreSQL |
| **LLM & Document Processing** | LLM APIs, PyMuPDF |
| **ML & Retrieval** | Sentence Transformers, scikit-learn, FAISS *(optional)*, PyTorch *(optional, for advanced router experiments)* |
| **Testing** | pytest |

---

## G. Team Responsibilities

The project is developed by a team of three engineering students with provisional ownership areas:

- **Student 1 — Backend & Architecture:** Responsible for the MASE Core, orchestrator, registry, message bus, APIs, database, and shared memory.
- **Student 2 — Agents & Services:** Responsible for Brainstorm, Research, Document Analyzer, and external adapters.
- **Student 3 — Machine Learning & Evaluation:** Responsible for routing strategies, benchmark datasets, model training, and performance evaluation.

**Shared Responsibilities:** Frontend integration, simulation replay, testing, and documentation.

---

## H. Development Phases

1. **Project Initialization** *(Current)* — Establish repository structure, conventions, `.gitignore`, and foundational documentation.
2. **Conception & Architecture** — Finalize system diagrams, data schemas, agent contracts, and database design.
3. **Core Engine Implementation** — Build the orchestrator, agent registry, message bus, shared memory, and FastAPI/WebSocket API.
4. **Agent Services Development** — Implement Brainstorm, Research, and Document Analyzer services along with required adapters.
5. **Replay & Observability** — Implement trace persistence, simulation replay, and frontend inspection views.
6. **Router Training & Evaluation** — Collect benchmark traces, train offline routing models, and evaluate quality/cost/latency trade-offs.
7. **Integration, Testing & Final Presentation** — Complete end-to-end testing, polish the UI, and finalize academic documentation and demo.

---

## I. Current Project Status

**Status: Phase 0 — Project Initialization**

- The repository currently contains only the planned structure and documentation.
- No functional MASE components have been implemented yet.
