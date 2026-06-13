# SmartGuide Backend Testing

This backend testing guide covers the FastAPI service. For the full project checklist, see the root [TESTING.md](../TESTING.md).

## Prerequisites

- Python is installed.
- A virtual environment exists in `backend/venv`.
- Dependencies are installed with `pip install -r requirements.txt`.
- `backend/.env` contains:

```env
GEMINI_API_KEY=your_key_here
CHUNK_SIZE=500
CHUNK_OVERLAP_WORDS=100
```

## Start Backend

```bash
cd backend
```

Windows:

```powershell
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

Unix/macOS:

```bash
source venv/bin/activate
uvicorn app.main:app --reload
```

Expected URLs:

- Backend: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Manual Backend Tests

### A. Health Check

Open:

```text
http://localhost:8000
```

Expected response:

```json
{
  "status": "Lab Manual Conversational Assistant API is running"
}
```

### B. Fail-Fast API Key Check

1. Temporarily rename `backend/.env`.
2. Restart the backend in a fresh terminal.
3. Expected: backend startup fails with a missing `GEMINI_API_KEY` error.
4. Restore `backend/.env`.

### C. Upload PDF

Use Swagger at `http://localhost:8000/docs` or curl:

```bash
curl -X POST "http://localhost:8000/upload-lab-manual" \
  -F "file=@/path/to/lab_manual.pdf"
```

Expected fields:

- `status: "success"`
- `pages`
- `total_characters`
- `chunks_created`
- `embeddings_status`
- `vectors_stored`
- `text_preview`

### D. Reject Non-PDF

Try uploading a `.txt` file to `/upload-lab-manual`.

Expected:

```json
{
  "detail": "Only PDF files are allowed."
}
```

The current validation checks the filename extension. A file renamed to `.pdf` but containing invalid PDF data may fail later during PDF processing with a processing error.

### E. Inspect Chunks

Call:

```bash
curl http://localhost:8000/chunks
```

Expected:

- `total_chunks > 0` after upload.
- chunks include `id`, `chunk_index`, `start_word`, `end_word`, `prev_chunk_id`, and `next_chunk_id`.

### F. Chat With Manual

```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"What experiments are covered?\",\"history\":[]}"
```

Expected:

- `answer`
- `sources`

### G. Chat Guard With No Manual

1. Call `DELETE /reset`.
2. Call `POST /chat`.

Expected: response asks the user to upload a manual first and returns an empty `sources` array.

### H. Reset

```bash
curl -X DELETE "http://localhost:8000/reset"
```

Expected:

- success message
- `GET /chunks` returns `total_chunks: 0`
- `/chat` no-manual guard triggers

### I. Auto-Wipe Old Vectors

1. Upload PDF #1.
2. Ask a question specific to PDF #1.
3. Upload PDF #2.
4. Ask the same PDF #1 question.
5. Expected: answer should not use old PDF #1 content.
6. Ask a PDF #2-specific question.
7. Expected: answer should use PDF #2 content.

## Endpoints Summary

| Method | Endpoint | Expected Status |
| --- | --- | --- |
| `GET` | `/` | available |
| `POST` | `/upload-lab-manual` | available |
| `GET` | `/chunks` | available |
| `POST` | `/chat` | available |
| `DELETE` | `/reset` | available |
