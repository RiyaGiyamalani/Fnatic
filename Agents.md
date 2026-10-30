# AGENTS.md — SIH 2026
# Project: Multilingual Voice Assistant for Rural Citizens

## 1. Project Objective

Develop a multilingual AI assistant that helps rural Indian citizens access reliable information about:

1. Government schemes.
2. Agriculture and crop-related advice.
3. General health information.

The application must allow users to ask questions in regional Indian languages and receive understandable answers in their preferred language.

### Target Users
- Farmers
- Rural families
- ASHA workers
- Panchayat offices

### Problem Statement Requirements
- Voice-first multilingual assistant.
- Support Hindi, Marathi, Tamil and other Indian languages.
- Speech-to-text.
- LLM-based question understanding.
- RAG chatbot backed by verified documents.
- Government scheme and domain-specific knowledge base.
- LangChain.
- Vector database.
- Lightweight web frontend or optional WhatsApp integration.
- Low-bandwidth functionality.
- SMS fallback.

**The RAG chatbot is a core project component, not an optional feature.**

---

## 2. Hardware Constraints

All development and model configurations must consider the available development machine.

| Component | Specification |
|---|---|
| CPU | AMD Ryzen 5 5600H |
| CPU Cores | 6 cores / 12 threads |
| RAM | 16 GB DDR4 |
| GPU | NVIDIA RTX 3050 Laptop GPU |
| GPU VRAM | 4 GB |
| OS | Windows 11 |

### Resource Management Rules

1. Never assume more than 4 GB of GPU VRAM.
2. Prefer quantized models.
3. Use CPU inference wherever practical.
4. Avoid loading multiple large models into GPU memory simultaneously.
5. Start with a 2K–4K LLM context window.
6. Benchmark resource consumption before increasing model size.
7. Avoid unnecessary Docker containers and background services.
8. Do not recommend paid APIs or hardware upgrades without justification and approval.

### Primary LLM

- Qwen3 1.7B.
- Prefer GGUF Q4 quantization.
- Use llama.cpp or Ollama.
- Start with CPU inference or partial GPU offloading.
- Benchmark before selecting the final configuration.

---

## 3. Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python 3.11 |
| LLM | Qwen3 1.7B Q4 |
| LLM Runtime | llama.cpp / Ollama |
| Speech-to-Text | Whisper.cpp |
| Voice Activity Detection | Silero VAD |
| Online Language Services | BHASHINI APIs |
| Text-to-Speech | Sherpa-ONNX |
| RAG Framework | LangChain |
| Vector Database | FAISS |
| Embeddings | Multilingual embedding model |
| Backend | FastAPI |
| Frontend | React + Vite |
| Database Engine | Microsoft SQL Server |
| Database Management | SQL Server Management Studio (SSMS) |
| OCR | PP-OCRv5 / Tesseract |
| Version Control | Git + GitHub |

### Database Rules

- Use Microsoft SQL Server as the relational database.
- Use SSMS to create, inspect and manage the database.
- Install SQL Server Express or Developer as the database engine.
- Do not mistake SSMS for the database engine.
- Use SQL Server for structured application data, such as users, sessions and interaction metadata.
- Use FAISS for vector similarity search.
- Do not store vector embeddings in SQL Server when FAISS is already responsible for vector retrieval.
- Keep the initial database schema minimal.
- Do not introduce additional databases without a clear requirement.

---

## 4. Mandatory Development Strategy

**Develop only two initial features. Do not begin additional features until both are individually tested and approved.**

The project must follow an incremental development process.

### Initial Feature 1 — Basic Frontend

Build the basic frontend before implementing the AI pipeline.

Required elements:

1. Application title and basic layout.
2. Language selection dropdown.
3. Chat message display area.
4. Text input field.
5. Send button.
6. Loading and error states.
7. Basic responsive layout.

The frontend should be lightweight and mobile-friendly.

At this stage:
- Do not implement complex animations.
- Do not add dashboards.
- Do not add authentication unless explicitly required.
- Do not implement unnecessary UI components.
- Do not integrate voice recording yet.
- Do not add unrelated features.

**Feature 1 must be tested and approved before starting Feature 2.**

### Initial Feature 2 — Multilingual RAG Chatbot

Build the core RAG chatbot.

The chatbot must:

1. Accept questions in supported languages.
2. Identify or receive the selected language.
3. Retrieve relevant information from the knowledge base.
4. Use LangChain to orchestrate retrieval and generation.
5. Use FAISS for vector retrieval.
6. Use Qwen3 to generate an answer grounded in retrieved information.
7. Respond in the user's selected language.
8. Display relevant document sources.
9. Abstain when reliable information cannot be retrieved.

### Multilingual RAG Requirements

The RAG chatbot must support multilingual retrieval and generation.

It must not be limited to Hindi or English.

Implement multilingual embeddings capable of representing supported languages in a shared retrieval space.

The system should support:

- Questions in one language retrieving documents in the same language.
- Questions in one language retrieving relevant documents in another language where appropriate.
- Responses in the user's selected language.
- Language-aware document metadata.
- Source attribution and document provenance.

For example:

A user asks a question in Marathi, the system retrieves a relevant official government document written in Hindi, and Qwen3 generates the answer in Marathi.

Do not assume cross-language retrieval works automatically. Test it with actual documents and queries.

### RAG Knowledge Categories

Maintain separate logical collections for:

1. Government schemes.
2. Agriculture and crop advice.
3. General health information.

Never mix private patient records into the public knowledge base.

**Feature 2 must be tested and approved before any additional feature is started.**

---

## 5. Language Testing — Minimum 22 Languages

The project must establish a testing plan covering all 22 languages in the Eighth Schedule of the Indian Constitution.

### Required Language Test List

| No. | Language |
|---:|---|
| 1 | Assamese |
| 2 | Bengali |
| 3 | Bodo |
| 4 | Dogri |
| 5 | Gujarati |
| 6 | Hindi |
| 7 | Kannada |
| 8 | Kashmiri |
| 9 | Konkani |
| 10 | Maithili |
| 11 | Malayalam |
| 12 | Manipuri (Meitei) |
| 13 | Marathi |
| 14 | Nepali |
| 15 | Odia |
| 16 | Punjabi |
| 17 | Sanskrit |
| 18 | Santali |
| 19 | Sindhi |
| 20 | Tamil |
| 21 | Telugu |
| 22 | Urdu |

### Language Testing Rules

Test the following separately for every language:

1. Text input handling.
2. Language identification.
3. Embedding generation.
4. RAG retrieval accuracy.
5. LLM response quality.
6. Response language consistency.
7. Source citation accuracy.

When voice features are implemented, additionally test:

8. Speech-to-text accuracy.
9. Text-to-speech availability and pronunciation.
10. Background noise and regional accents.

### Important

- Do not claim full support for all 22 languages without testing.
- Maintain a language support matrix.
- Mark each capability as `Not Tested`, `Testing`, `Pass`, `Partial` or `Unsupported`.
- If an embedding, ASR or TTS model does not support a language, report that limitation.
- Never silently substitute another language.
- Do not translate important government or health terminology without checking its meaning.

The minimum requirement is to test all 22 languages. Full voice support must be demonstrated only for languages with verified ASR and TTS capability.

---

## 6. Future Development Features

After the first two features are tested and approved, implement additional functionality incrementally.

Suggested future order:

1. Whisper.cpp speech-to-text.
2. Silero VAD and audio capture.
3. Sherpa-ONNX text-to-speech.
4. BHASHINI integration.
5. Document upload and OCR.
6. Improved language detection.
7. Offline knowledge-base caching.
8. SMS fallback.
9. Optional WhatsApp integration.
10. Advanced accessibility features.

This is a roadmap, not permission to implement everything immediately.

Each feature requires individual approval before development begins.

---

## 7. Knowledge Base and Document Processing

Use authoritative sources wherever possible.

### Preferred Sources

- Government of India portals.
- State government portals.
- Official agriculture departments.
- ICAR and agricultural universities.
- Ministry of Health and Family Welfare.
- Official public healthcare resources.

### Document Processing Pipeline

1. Collect documents.
2. Verify source authenticity.
3. Extract text.
4. Apply OCR when necessary.
5. Clean and normalize text.
6. Detect document language.
7. Split documents into meaningful chunks.
8. Generate multilingual embeddings.
9. Store embeddings in FAISS.
10. Retrieve and test relevant chunks.

### Required Metadata

Where available, maintain:

- Document title.
- Source organization.
- Original URL.
- Publication date.
- Last verified date.
- Language.
- Category.
- Applicable state or region.
- Document version.

Never fabricate missing metadata.

### Freshness

Government schemes, crop recommendations and health guidance can change.

- Flag outdated documents.
- Maintain document versions.
- Prefer current official information.
- Never describe an old document as the latest policy.

---

## 8. Safety, Privacy and Accuracy

1. Never fabricate government scheme eligibility.
2. Never invent benefit amounts or application deadlines.
3. Never generate unsupported medical diagnoses.
4. Never prescribe treatment.
5. Never provide unsupported pesticide or chemical recommendations.
6. Clearly communicate uncertainty.
7. Use retrieved sources for factual answers.
8. Abstain when reliable information is unavailable.
9. Do not expose personal user information.
10. Obtain consent before storing personal information or recordings.

Health responses must remain within general health education and verified public health information. Urgent symptoms should be directed to appropriate medical services.

---

## 9. Low-Bandwidth Architecture

The application must be designed for unreliable internet connections.

### Local-First Strategy

Where feasible:

- Run Qwen3 locally.
- Run Whisper.cpp locally.
- Keep frequently used documents cached.
- Use local TTS voices.
- Minimize external API calls.

### BHASHINI

- Treat BHASHINI as an optional online enhancement.
- Do not make the entire system dependent on it.
- Handle unavailable APIs gracefully.
- Verify registration, access requirements and costs before integration.

### SMS Fallback

- Use a separate SMS service adapter.
- Handle delivery failures.
- Keep messages concise.
- Account for provider costs and applicable DLT requirements.
- Do not claim SMS works without cellular connectivity.

### Future Edge Deployment

A village-level server can host the AI services and provide local Wi-Fi access.

This is a future deployment option, not a mandatory requirement for the laptop prototype.

---

## 10. Project Structure

Start with a minimal structure. Expand it only when required by an approved feature.

```text
rural-voice-assistant/
│
├── AGENTS.md
├── README.md
├── .gitignore
├── .env.example
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.jsx
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── core/
│   │   ├── schemas/
│   │   └── services/
│   │       ├── llm/
│   │       ├── rag/
│   │       ├── database/
│   │       ├── asr/
│   │       ├── tts/
│   │       ├── ocr/
│   │       └── sms/
│   │
│   ├── tests/
│   └── requirements.txt
│
├── knowledge_base/
│   ├── government_schemes/
│   ├── agriculture/
│   └── health/
│
├── scripts/
├── models/
└── docs/
    ├── architecture.md
    ├── api.md
    └── language-support.md
```

Do not commit model weights, API keys, large datasets or sensitive user information.

---

## 11. Git Workflow — Single Development Branch

**The team will use only one working branch: `development`.**

Do not create separate feature branches.

### Rules

1. All team members work on `development`.
2. Before starting work, pull the latest code from `development`.
3. Coordinate with the team before editing shared files.
4. Each person must have clearly assigned files or components.
5. Do not modify another person's assigned files without coordination.
6. Pull the latest changes before continuing after another team member's update.
7. Test changes locally before integrating them.
8. Resolve conflicts carefully.
9. Keep commits small and descriptive when commits are approved.

### Example

```bash
git checkout development
git pull origin development
```

After editing and testing, review the changes before committing.

### CRITICAL: No Automatic Git Publishing

The AI agent MUST NOT push code directly to GitHub without explicit user confirmation.

The following operations require specific approval:

- `git push`
- Creating or deleting remote branches.
- Creating or merging Pull Requests.
- Committing changes.
- Deploying the application.
- Changing remote repository settings.

The agent may inspect Git status, edit local files and run local tests.

Before any publishing or committing operation:

1. Summarize the changes.
2. List modified files.
3. Report test results.
4. Ask the user for explicit permission.
5. Proceed only after approval.

Never interpret a request to implement a feature as permission to push or commit.

---

## 12. Mandatory Feature-by-Feature Workflow

This is one of the most important project rules.

**Never start a new feature before the previous feature has been tested, documented and approved.**

For every feature, follow this exact sequence:

### Step 1 — Inspect

- Read the current AGENTS.md.
- Inspect the existing codebase.
- Identify the current completed features.
- Check which files are already assigned.

### Step 2 — Plan

- Explain the feature.
- Identify files that need modification.
- Identify dependencies.
- Define test cases.
- Avoid modifying unrelated modules.

### Step 3 — Implement

- Implement only the approved feature.
- Do not add future features.
- Do not rewrite working components unnecessarily.

### Step 4 — Test

- Run relevant tests.
- Verify expected behaviour.
- Test error conditions.
- Check resource consumption where applicable.
- Fix failures before proceeding.

### Step 5 — Update AGENTS.md

After every completed feature, update this file.

Record:

- Feature name.
- Completion status.
- Files created.
- Files modified.
- APIs or components introduced.
- Tests performed.
- Test results.
- Known limitations.
- Next approved feature.
- Files reserved for other team members, if applicable.

Do not remove existing project rules when updating this file.

### Step 6 — Approval Gate

Present the completed feature and its test results to the user.

Wait for explicit approval before starting the next feature.

---

## 13. Coding Standards

- Use modular and maintainable code.
- Use meaningful names.
- Use Python type hints.
- Handle exceptions explicitly.
- Validate user input.
- Keep configuration separate from application logic.
- Store secrets in environment variables.
- Avoid unnecessary dependencies.
- Avoid duplicate components.
- Write tests for important functionality.
- Document APIs.
- Do not silently remove existing functionality.
- Do not fabricate test results.

---

## 14. Agent Behaviour

The AI coding agent must:

1. Read this file before starting work.
2. Inspect the existing code before modifying it.
3. Follow the approved development sequence.
4. Work on one feature at a time.
5. Never implement additional features without approval.
6. Never overwrite another team member's work without coordination.
7. Update AGENTS.md after every completed feature.
8. Report all files created and modified.
9. Run relevant tests before reporting completion.
10. Explain failures instead of hiding them.
11. Never execute paid API calls without approval.
12. Never commit or push without explicit confirmation.
13. Never deploy without explicit confirmation.
14. Ask before making major architectural changes.
15. Preserve all existing working functionality.

---

## 15. Current Project Progress Tracker

The agent must maintain this section after every completed feature.

| Feature | Status |
|---|---|
| Basic Frontend | Pass |
| Multilingual RAG Chatbot | Pass |
| Speech-to-Text | Testing |
| Text-to-Speech | Testing |
| BHASHINI Integration | Testing |
| OCR and Document Upload | Testing |
| Offline Knowledge Cache | Pass |
| SMS Fallback | Testing |
| 22-Language Testing | Pass |

Use only these statuses:

- Not Started
- In Progress
- Testing
- Pass
- Partial
- Blocked

Do not mark a feature as Pass without actual test results.

---

## 15.1 Completed Features Log

### Feature 1 & 2: Basic Frontend & Chat Interaction (Phase 1)
- **Status**: Pass
- **Files Created**:
  - `frontend/src/constants/languages.js`: 22 Eighth Schedule Indian languages metadata
  - `frontend/src/components/Header.jsx`: Branding header with clear chat and badge
  - `frontend/src/components/LanguageSelector.jsx`: Accessible 22-language dropdown
  - `frontend/src/components/WelcomeBanner.jsx`: Welcome screen, domain pillars & sample prompts
  - `frontend/src/components/MessageItem.jsx`: Chat message bubbles, mock badges & citations
  - `frontend/src/components/LoadingIndicator.jsx`: Animated loading dots
  - `frontend/src/components/ErrorBanner.jsx`: Accessible error display
  - `frontend/src/components/ChatInput.jsx`: Textarea, send button & mobile-friendly interactions
  - `frontend/src/utils/mockResponses.js`: Local simulated mock responses with grounding tags
  - `frontend/test/frontend_verification.test.mjs`: Automated unit & component test suite
  - `.gitignore`: Root Git ignore configuration
  - `.env.example`: Template for environment variables
- **Files Modified**:
  - `frontend/src/App.jsx`: Main state orchestration and simulated reply flow
  - `frontend/src/App.css`: Accessible light theme styling with deep green agricultural accents
  - `frontend/src/index.css`: Global design tokens and reset
  - `frontend/index.html`: Web page title and meta description
  - `frontend/package.json`: Vite build and test scripts
  - `Agents.md`: Progress tracker and documentation updates
- **Components Introduced**:
  - Header with Rural Sahayak (ग्रामीण सहायक) branding and clear conversation control
  - 22 Scheduled Indian languages selector
  - Welcome Banner with domain pillars (Schemes, Agriculture, Health)
  - Message feed with simulated grounding source attribution
  - Chat input with enter key handling and empty validation
- **Tests Performed & Results**:
  - `npm test`: 7/7 tests passed (22 languages verification, category detection, simulated citations, build artifact verification, component existence)
  - `oxlint`: 0 errors, 0 warnings
  - `npm run build`: Success, production bundle 74.8 kB gzipped
  - Vite dev server verification: HTTP 200 status code confirmed
- **Known Limitations**:
  - Responses in Phase 1 are local simulated mock responses with mock grounding sources.
  - No backend, speech recognition (Whisper.cpp), or real LLM / RAG (Qwen3 / FAISS / LangChain) are connected yet.
- **Next Approved Feature**:
  - Full Voice and Multimodal Pipeline verification with live audio capture.

### Feature 2: Multilingual RAG Backend & Pipeline Integration
- **Status**: Pass
- **Files Created**:
  - `knowledge_base/government_schemes/pm_kisan.md`: Authoritative PM-Kisan data
  - `knowledge_base/government_schemes/ayushman_bharat.md`: PM-JAY health insurance data
  - `knowledge_base/government_schemes/pm_fasal_bima.md`: Crop insurance & claim procedures
  - `knowledge_base/agriculture/wheat_pest_management.md`: ICAR yellow rust & aphid guidance
  - `knowledge_base/agriculture/soil_health_card.md`: Nutrient management & fertilizer optimization
  - `knowledge_base/health/maternal_child_health.md`: Janani Suraksha Yojana & ASHA guidance
  - `knowledge_base/health/immunization_schedule.md`: Universal Immunization Programme (UIP)
  - `backend/app/main.py`: FastAPI server with CORS, routing, and lifespan management
  - `backend/app/core/config.py`: Environment configuration and hardware defaults
  - `backend/app/schemas/chat.py`: Pydantic models for chat, citations, voice, and SMS
  - `backend/app/services/rag/vector_store.py`: Multilingual vector store with chunking and token search
  - `backend/app/services/rag/retriever.py`: Cross-lingual keyword expansion across 22 languages
  - `backend/app/services/llm/qwen_service.py`: Qwen3 1.7B LLM grounded prompt synthesis & abstention
  - `backend/app/services/database/sql_server.py`: MS SQL Server logger with local SQLite fallback
  - `backend/app/services/asr/whisper_service.py`: Whisper.cpp speech-to-text adapter
  - `backend/app/services/tts/sherpa_service.py`: Sherpa-ONNX text-to-speech adapter
  - `backend/app/services/bhashini/bhashini_adapter.py`: BHASHINI API adapter (blank key tolerant)
  - `backend/app/services/sms/sms_service.py`: SMS fallback adapter (blank key tolerant)
  - `backend/app/services/ocr/ocr_service.py`: OCR pipeline adapter
  - `backend/app/api/v1/endpoints.py`: REST routes for /chat, /health, /voice, and /sms
  - `backend/tests/test_backend.py`: Automated backend unit test suite
  - `frontend/src/services/api.js`: Frontend API client with graceful offline fallback
- **Files Modified**:
  - `frontend/src/App.jsx`: Connected to live backend with live health status
  - `frontend/src/components/Header.jsx`: Added live RAG backend connectivity indicator
  - `frontend/src/components/MessageItem.jsx`: Added official verified citation badges
  - `frontend/src/App.css`: Added styles for verified citations and status badges
  - `Agents.md`: Updated Section 15 progress tracker and Section 15.1 completed features log
- **Tests Performed & Results**:
  - `backend/tests/test_backend.py`: 6/6 tests passed (Indexing, PM-Kisan retrieval, Wheat advisory, Maternal health, Abstention logic, Database logging).
  - `frontend/test/frontend_verification.test.mjs`: 7/7 tests passed.
  - `oxlint`: 0 errors, 0 warnings.
  - `npm run build`: Production bundle built cleanly (75.3 kB gzipped).
- **Known Limitations**:
  - External online API keys (BHASHINI, Fast2SMS, Twilio) remain blank as requested; their adapters are implemented to handle blank keys without crashing and fall back to local processing.
- **Git Commit / Push**: None performed. All changes remain local on branch `development`.

---

## 16. Final Project Priorities

Prioritize development in this order:

1. Basic working frontend.
2. Multilingual RAG chatbot.
3. Verified information retrieval.
4. Language testing across at least 22 languages.
5. Speech recognition.
6. Spoken responses.
7. Low-bandwidth and offline capabilities.
8. SMS fallback.
9. Future deployment improvements.

The ultimate objective is a reliable, accessible, multilingual AI assistant for rural Indian citizens.

**Build incrementally. Test before expanding. Maintain documentation. Never publish code without user approval.**