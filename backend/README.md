# SmartGuide Backend

FastAPI backend for the SmartGuide lab manual assistant. It accepts PDF lab manuals, extracts and cleans text, creates overlapping chunks, embeds the chunks with Gemini, stores them in ChromaDB, and serves a RAG chat endpoint.

## Current Status

The backend has completed the main prototype RAG path:

- Upload PDF.
- Extract text.
- Clean text.
- Create overlapping chunks.
- Generate Gemini embeddings.
- Store vectors in persistent ChromaDB.
- Retrieve similar chunks for a user query.
- Generate answers with Gemini using retrieved manual context.

It still needs stronger document management, automated tests, page-aware citations, and production hardening.

## Project Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── routes/
│   │   ├── __init__.py
│   │   └── upload.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── embedding_service.py
│   │   ├── pdf_processor.py
│   │   └── vector_store.py
│   └── utils/
│       ├── __init__.py
│       └── text_cleaner.py
├── requirements.txt
├── README.md
└── TESTING.md
```

## Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
GEMINI_API_KEY=your_api_key_here
```

Optional chunking settings:

```env
CHUNK_SIZE=500
CHUNK_OVERLAP_WORDS=100
```

## Running

```bash
uvicorn app.main:app --reload
```

Custom host and port:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Server:

```text
http://localhost:8000
```

Interactive docs:

```text
http://localhost:8000/docs
```

## API Endpoints

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

Processing steps:

1. Validate the file extension is `.pdf`.
2. Save the upload temporarily.
3. Extract text with PyPDF2.
4. Clean extracted text.
5. Create overlapping chunks.
6. Store chunks in memory.
7. Generate embeddings with Gemini.
8. Upsert vectors into ChromaDB.
9. Delete the temporary uploaded file.

Example response:

```json
{
  "status": "success",
  "pages": 25,
  "text_preview": "Experiment 1: Verification of Ohm's Law...",
  "total_characters": 45328,
  "chunks_created": 18,
  "embeddings_status": "success",
  "vectors_stored": 18
}
```

Known limitation: new uploads replace the in-memory chunk list but do not automatically clear old ChromaDB vectors. Use `DELETE /reset` before uploading a replacement manual until multi-document indexing is implemented.

### `GET /chunks`

Returns the chunks currently held in memory.

Example response shape:

```json
{
  "status": "success",
  "total_chunks": 18,
  "chunks": []
}
```

### `POST /chat`

Runs the conversational RAG flow.

Request body:

```json
{
  "query": "What apparatus is needed for Ohm's law?",
  "history": [
    {
      "role": "user",
      "content": "What experiments are in this manual?"
    },
    {
      "role": "assistant",
      "content": "The manual includes..."
    }
  ]
}
```

Processing steps:

1. Check that the ChromaDB collection has indexed chunks.
2. Embed the user query with Gemini.
3. Retrieve the top 5 similar chunks from ChromaDB.
4. Build a context-only system instruction.
5. Send the prompt and conversation history to Gemini.
6. Return the answer and source chunk previews.

Example response:

```json
{
  "answer": "The apparatus required includes...",
  "sources": [
    {
      "chunk_index": 3,
      "text_preview": "Apparatus required: resistor, ammeter, voltmeter..."
    }
  ]
}
```

### `DELETE /reset`

Clears the ChromaDB collection and the in-memory chunks.

Example response:

```json
{
  "status": "success",
  "message": "All data has been cleared successfully."
}
```

## Completed

- FastAPI app initialization.
- CORS setup for frontend access.
- PDF upload validation.
- PDF text extraction.
- Text cleaning utility.
- Configurable chunk size and overlap.
- Chunk metadata for boundaries and neighbor links.
- Temporary upload cleanup.
- In-memory chunk inspection endpoint.
- Gemini embedding service.
- Gemini query embedding service.
- ChromaDB persistent collection.
- Similarity search.
- Gemini-powered chat generation.
- Source previews in chat responses.
- Data reset endpoint.
- Swagger/OpenAPI docs through FastAPI.

## Remaining

- Add automated test suite.
- Clear or version ChromaDB data correctly on new uploads.
- Add multi-document support.
- Store document metadata such as filename, upload time, subject, and page ranges.
- Track page numbers for citations.
- Improve startup checks for missing `GEMINI_API_KEY`.
- Add request size limits and safer upload handling.
- Add structured logging.
- Add authentication and per-user document isolation.
- Add rate limiting.
- Add deployment configuration.
- Add support for DOCX, PPT, and TXT if those formats remain in scope.

## Dependencies

- `fastapi`
- `uvicorn`
- `pypdf2`
- `python-multipart`
- `requests`
- `google-genai`
- `chromadb`
- `python-dotenv`

## Quick Test

Health check:

```bash
curl http://localhost:8000/
```

Upload PDF:

```bash
curl -X POST "http://localhost:8000/upload-lab-manual" \
  -F "file=@/path/to/lab_manual.pdf"
```

Chat:

```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"What experiments are covered?\",\"history\":[]}"
```

Reset:

```bash
curl -X DELETE "http://localhost:8000/reset"
```
