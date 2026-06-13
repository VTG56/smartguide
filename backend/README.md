# SmartGuide Backend

FastAPI backend for SmartGuide. It accepts PDF lab manuals, extracts and cleans text, creates overlapping chunks, embeds them with Gemini, stores them in ChromaDB, and serves a manual-grounded `/chat` endpoint.

## Tech Stack

- FastAPI
- PyPDF2
- Google GenAI SDK
- ChromaDB persistent vector store
- python-dotenv
- python-multipart

## Environment Variables

Create `backend/.env`:

```env
GEMINI_API_KEY=your_key_here
CHUNK_SIZE=500
CHUNK_OVERLAP_WORDS=100
```

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Yes | None | Gemini embeddings and chat generation |
| `CHUNK_SIZE` | No | `500` | Target words per chunk |
| `CHUNK_OVERLAP_WORDS` | No | `100` | Word overlap between adjacent chunks |

The backend fails fast on startup if `GEMINI_API_KEY` is missing.

## Setup

```bash
cd backend
python -m venv venv
```

Windows activation:

```powershell
.\venv\Scripts\activate
```

Unix/macOS activation:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
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

## Endpoint List

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `POST` | `/upload-lab-manual` | Upload, process, embed, and index a PDF |
| `GET` | `/chunks` | Inspect current in-memory chunks |
| `POST` | `/chat` | RAG chat over the uploaded manual |
| `DELETE` | `/reset` | Clear ChromaDB and in-memory chunks |

## Endpoint Examples

### `GET /`

Health check.

Example response:

```json
{
  "status": "Lab Manual Conversational Assistant API is running"
}
```

### `POST /upload-lab-manual`

Uploads a PDF manual and processes it.

Processing behavior:

1. Validates the filename has a `.pdf` extension.
2. Clears existing ChromaDB vectors and in-memory chunks.
3. Saves the upload temporarily.
4. Extracts text with PyPDF2.
5. Cleans text.
6. Creates overlapping word chunks.
7. Generates Gemini embeddings with `gemini-embedding-001`.
8. Upserts vectors into ChromaDB.
9. Deletes the temporary uploaded file.

Example response:

```json
{
  "status": "success",
  "pages": 25,
  "text_preview": "Experiment 1: ...",
  "total_characters": 45328,
  "chunks_created": 18,
  "embeddings_status": "success",
  "vectors_stored": 18
}
```

### `GET /chunks`

Returns the current in-memory chunk cache.

Example response shape:

```json
{
  "status": "success",
  "total_chunks": 18,
  "chunks": [
    {
      "id": "chunk-id",
      "text": "chunk text",
      "length": 1200,
      "chunk_index": 0,
      "start_word": 0,
      "end_word": 500,
      "prev_chunk_id": null,
      "next_chunk_id": "next-id"
    }
  ]
}
```

### `POST /chat`

Runs the RAG flow over the currently indexed manual.

Request body:

```json
{
  "query": "What apparatus is needed?",
  "history": [
    {
      "role": "user",
      "content": "What experiments are covered?"
    },
    {
      "role": "assistant",
      "content": "The manual covers..."
    }
  ]
}
```

Specialized frontend views may pass `system_override`:

```json
{
  "query": "Generate viva questions from this manual.",
  "history": [],
  "system_override": "You are SmartGuide's viva preparation assistant..."
}
```

`system_override` changes the hidden instruction used for that request, but it does not create a separate endpoint. Viva Prep, Error Solver, and Experiment Explainer still use the same retrieval and Gemini generation flow as normal chat.

Example response:

```json
{
  "answer": "The apparatus required includes...",
  "sources": [
    {
      "chunk_index": 3,
      "text_preview": "Apparatus required: ..."
    }
  ]
}
```

If no manual is indexed, `/chat` returns a no-manual message with an empty `sources` array.

### `DELETE /reset`

Clears ChromaDB and in-memory chunks.

Example response:

```json
{
  "status": "success",
  "message": "All data has been cleared successfully."
}
```

## Vector Isolation

SmartGuide currently works in single-manual mode. Uploading a new PDF clears the previous ChromaDB collection and in-memory chunks before indexing the replacement manual. This is intentional to reduce cross-manual hallucination.

`clear_collection()` is written to be safe when the collection exists or does not exist, so reset and first-run upload paths can recreate the collection cleanly.

## Chunking

Chunking is word-based and configured by:

- `CHUNK_SIZE`
- `CHUNK_OVERLAP_WORDS`

Each chunk includes:

- `id`
- `text`
- `length`
- `chunk_index`
- `start_word`
- `end_word`
- `prev_chunk_id`
- `next_chunk_id`

Chroma metadata stores chunk boundary fields, but page-number metadata is not currently stored.

## Limitations

- PDF upload only.
- Single-manual indexing only.
- No page-number citations.
- No multi-manual filtering or document management.
- Minimal document metadata.
- Basic error handling.
- No authentication, rate limiting, or production deployment setup.
