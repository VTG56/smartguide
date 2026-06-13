# SmartGuide

SmartGuide is a lab manual assistant that lets users upload a PDF lab manual and ask questions using a Gemini-powered Retrieval-Augmented Generation (RAG) pipeline.

## Current Status

SmartGuide currently supports a local, single-manual RAG workflow. A user can upload one PDF manual, index it into ChromaDB, ask manual-grounded questions, and use focused frontend tools for viva preparation, troubleshooting, and experiment explanation. Uploading a replacement manual clears the previous in-memory chunks and ChromaDB vectors to reduce cross-manual hallucination.

This is a local academic project prototype, not a production deployment.

## Features

- Upload a PDF lab manual.
- Validate PDF selection in the frontend before upload.
- Extract, clean, chunk, embed, and index manual text.
- View upload processing stats:
  - page count
  - character count
  - chunks created
  - vectors stored
  - embedding status
  - text preview
- Chat with the uploaded manual through the RAG backend.
- Render assistant answers as Markdown.
- Display source snippets from retrieved chunks.
- Preserve chat history during a chat session.
- Use quick prompt chips on the Chat page.
- Generate viva-style questions from the uploaded manual.
- Use the Solver page for manual-grounded troubleshooting guidance.
- Use the Experiment Explainer page for prompt-card study shortcuts.
- Reset indexed data with `DELETE /reset`.

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- React Markdown

### Backend

- FastAPI
- PyPDF2
- Google GenAI SDK
- ChromaDB persistent vector store
- python-dotenv

## Architecture Overview

```text
PDF Upload
  -> Text Extraction
  -> Text Cleanup
  -> Chunking
  -> Gemini Embeddings
  -> ChromaDB Storage
  -> Semantic Retrieval
  -> Gemini Answer Generation
  -> Frontend Markdown + Sources
```

Specialized frontend pages such as Viva Prep, Solver, and Experiment Explainer reuse the same `/chat` endpoint with a `system_override`. They do not create separate backend endpoints and still use the same ChromaDB retrieval flow.

## Project Structure

```text
smartguide/
|-- backend/
|   |-- app/
|   |   |-- main.py
|   |   |-- services/
|   |   |   |-- embedding_service.py
|   |   |   |-- pdf_processor.py
|   |   |   `-- vector_store.py
|   |   `-- utils/
|   |       `-- text_cleaner.py
|   |-- README.md
|   |-- TESTING.md
|   `-- requirements.txt
|-- src/
|   |-- components/
|   |-- pages/
|   |   |-- Analytics.jsx
|   |   |-- ChatPage.jsx
|   |   |-- Home.jsx
|   |   |-- QuestionSolver.jsx
|   |   |-- Topics.jsx
|   |   `-- Upload.jsx
|   `-- services/
|       `-- api.js
|-- .env.example
|-- package.json
|-- README.md
`-- TESTING.md
```

## Environment Variables

### Frontend

Create an optional root `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

If this variable is not set, the frontend falls back to `http://localhost:8000`.

### Backend

Create `backend/.env`:

```env
GEMINI_API_KEY=your_key_here
CHUNK_SIZE=500
CHUNK_OVERLAP_WORDS=100
```

`GEMINI_API_KEY` is required. `CHUNK_SIZE` and `CHUNK_OVERLAP_WORDS` are optional and default to `500` and `100`.

## Setup

### Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\activate
```

Activate the virtual environment on Unix/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `backend/.env` with `GEMINI_API_KEY`, then start the backend:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

API docs:

```text
http://localhost:8000/docs
```

### Frontend

From the project root:

```bash
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Main Workflow

1. Start the backend on `localhost:8000`.
2. Start the frontend on `localhost:5173`.
3. Open the Upload Manual page.
4. Upload a PDF lab manual.
5. Review upload stats and embedding status.
6. Open Chat with AI and ask questions about the manual.
7. Use Viva Prep to generate viva-style questions from the manual.
8. Use Error Solver for manual-grounded troubleshooting guidance.
9. Use Experiment Explainer prompt cards for study shortcuts.
10. Uploading a new manual replaces the currently indexed manual.

## API Summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `POST` | `/upload-lab-manual` | Upload and process a PDF manual |
| `GET` | `/chunks` | Inspect current in-memory chunks |
| `POST` | `/chat` | Ask questions using RAG |
| `DELETE` | `/reset` | Clear ChromaDB vectors and in-memory chunks |

## Limitations and Future Scope

- Single-manual mode only.
- No authentication or per-user document isolation.
- No page-number citations.
- No multi-manual document management.
- No automatic experiment extraction pipeline.
- PDF-only upload; DOCX, PPT, and TXT are not implemented.
- No offline fallback when Gemini is unavailable.
- No production deployment configuration.
- No rate limiting or abuse protection.
- Basic error handling only.

## Testing

See [TESTING.md](TESTING.md) for the full manual testing checklist.
