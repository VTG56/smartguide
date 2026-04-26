# SmartGuide

SmartGuide is a lab manual assistant built with a React frontend and a FastAPI backend. It lets a user upload a lab manual PDF, extracts and chunks the manual text, stores semantic embeddings in ChromaDB, and answers questions using a Retrieval-Augmented Generation (RAG) flow with Gemini.

## Current Status

The project is past the initial UI scaffold and basic upload stage. PDF upload, backend processing, chunking, embeddings, vector storage, and a working chat endpoint are implemented. Some frontend pages are still prototypes or use static placeholder data.

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- React Markdown for rendering assistant responses

### Backend

- FastAPI
- PyPDF2 for PDF text extraction
- Google GenAI SDK for embeddings and chat generation
- ChromaDB persistent vector store
- python-dotenv for local environment configuration

## Completed Features

### Frontend

- Dashboard layout with sidebar navigation.
- Upload page for selecting and uploading PDF lab manuals.
- Frontend PDF validation before upload.
- Upload success state showing extracted page count, character count, and text preview.
- Chat page connected to the backend `/chat` API.
- Chat history passed to the backend with each request.
- Markdown rendering for assistant answers.
- Loading indicator, error toast, clear-chat action, and quick prompt chips.
- Source display for retrieved chunks returned by the backend.
- Basic pages for dashboard, lab experiments, viva preparation, troubleshooting, reports, and settings navigation.

### Backend

- FastAPI application with CORS enabled for frontend integration.
- Health check endpoint: `GET /`.
- PDF upload endpoint: `POST /upload-lab-manual`.
- Text extraction from uploaded PDFs.
- Text cleanup for whitespace, broken hyphenated lines, and repeated newlines.
- Configurable word chunking with overlap.
- Chunk boundary metadata:
  - `id`
  - `chunk_index`
  - `start_word`
  - `end_word`
  - `prev_chunk_id`
  - `next_chunk_id`
- In-memory chunk cache for inspection through `GET /chunks`.
- Gemini embedding generation with `gemini-embedding-001`.
- Persistent ChromaDB vector storage in `./chroma_db`.
- Semantic search over uploaded chunks.
- RAG chat endpoint: `POST /chat`.
- Gemini chat response generation with `gemini-2.5-flash`.
- Source previews returned with chat responses.
- Reset endpoint: `DELETE /reset`, which clears ChromaDB and in-memory chunks.
- Temporary uploaded PDF cleanup after processing.
- Basic error handling for invalid files, failed processing, empty chat queries, and reset failures.

## Remaining Work

### Frontend Gaps

- The dashboard still describes the app as an early UI scaffold even though the backend RAG flow now exists.
- The `/solver` page is still a static demo and is not connected to the live chat endpoint.
- The `/topics` page uses hard-coded experiment cards instead of extracting experiments from uploaded manuals.
- Search and filter controls on the lab experiments page are visual only.
- The viva preparation page uses static sample questions instead of generated questions from uploaded content.
- Troubleshooting, reports, settings, and catch-all pages route to placeholder screens.
- The upload page does not show `chunks_created`, `embeddings_status`, or `vectors_stored`, even though the backend returns them.
- The frontend tracks upload state using `localStorage`, but it does not check the actual backend collection state.
- Backend URL is hard-coded as `http://localhost:8000`; it should move to an environment variable.
- There is no authentication, user profile, or per-user document separation.

### Backend Gaps

- ChromaDB persists vectors, but document metadata is minimal and does not store filename, upload time, page number, or subject.
- Uploading a new PDF clears only in-memory chunks; old ChromaDB vectors are not cleared before upserting new chunks unless `/reset` is called separately.
- PDF chunk metadata is word-based only; chunks are not mapped back to PDF pages.
- The chat endpoint assumes `GEMINI_API_KEY` is configured, but startup does not fail fast or expose configuration health.
- No automated tests are currently present for upload, chunking, embeddings, vector search, or chat behavior.
- No request size limit or production upload storage strategy is configured.
- No rate limiting, authentication, or abuse protection.
- No structured logging or monitoring.
- No deployment configuration for frontend, backend, or ChromaDB data persistence.
- DOCX, PPT, and TXT are shown as future formats but are not implemented.

### Product Gaps

- No multi-manual support.
- No document management page to list, rename, delete, or re-index uploaded manuals.
- No experiment extraction pipeline.
- No generated viva question bank.
- No report-writing workflow.
- No citations that include page numbers.
- No feedback mechanism to mark answers as useful or incorrect.
- No offline fallback when Gemini is unavailable.

## Project Structure

```text
smartguide/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── services/
│   │   │   ├── embedding_service.py
│   │   │   ├── pdf_processor.py
│   │   │   └── vector_store.py
│   │   └── utils/
│   │       └── text_cleaner.py
│   ├── README.md
│   ├── TESTING.md
│   └── requirements.txt
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
├── package.json
└── README.md
```

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

Run the backend:

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
5. The backend extracts text, creates overlapping chunks, embeds them, and stores vectors in ChromaDB.
6. Open Chat with AI.
7. Ask questions about the uploaded manual.
8. The backend retrieves relevant chunks and generates an answer with source previews.

## API Summary

| Method | Endpoint | Status | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | Complete | Health check |
| `POST` | `/upload-lab-manual` | Complete | Upload and process a PDF |
| `GET` | `/chunks` | Complete | Inspect current in-memory chunks |
| `POST` | `/chat` | Complete | Ask questions using RAG |
| `DELETE` | `/reset` | Complete | Clear ChromaDB and in-memory chunks |

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | None | Required for embeddings and chat |
| `CHUNK_SIZE` | `500` | Target words per chunk |
| `CHUNK_OVERLAP_WORDS` | `100` | Overlap between adjacent chunks |

## Recommended Next Steps

1. Clear ChromaDB automatically before indexing a replacement manual, or add multi-document support.
2. Update frontend pages so dashboard, solver, topics, and viva prep reflect the live RAG implementation.
3. Display upload embedding status and vector count in the upload UI.
4. Add automated backend tests for chunking, upload validation, reset, and chat guard behavior.
5. Move frontend API base URL into environment configuration.
6. Add page-aware citations by tracking PDF page metadata during chunking.
