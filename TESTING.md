# SmartGuide Testing Guide

This guide covers manual testing for the current local SmartGuide prototype.

## 1. Prerequisites

### Backend

- Python is installed.
- A virtual environment has been created.
- Backend requirements are installed.
- `backend/.env` contains a valid Gemini API key:

```env
GEMINI_API_KEY=your_key_here
CHUNK_SIZE=500
CHUNK_OVERLAP_WORDS=100
```

### Frontend

- `npm install` has completed.
- Optional root `.env` contains:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The frontend also works without root `.env` because `src/services/api.js` falls back to `http://localhost:8000`.

## 2. Start Commands

### Backend

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

### Frontend

From the project root:

```bash
npm run dev
```

Expected URL:

- Frontend: `http://localhost:5173`

## 3. Backend Feature Tests

### A. Health Check

Open:

```text
http://localhost:8000
```

Expected: JSON status message.

### B. Fail-Fast API Key Check

1. Temporarily remove or rename `backend/.env`.
2. Restart backend in a fresh terminal.
3. Expected: backend fails with a missing `GEMINI_API_KEY` error.
4. Restore `backend/.env` after the test.

### C. Upload PDF

Use Swagger docs or the frontend Upload page.

Expected response fields:

- `status`
- `pages`
- `total_characters`
- `chunks_created`
- `embeddings_status`
- `vectors_stored`
- `text_preview`

### D. Reject Non-PDF

Upload a `.txt` file.

Expected: clean `400` response with:

```json
{
  "detail": "Only PDF files are allowed."
}
```

Current behavior is filename-extension based. A non-PDF renamed to `.pdf` may fail during PDF processing instead.

### E. Inspect Chunks

Call `GET /chunks` after upload.

Expected:

- `total_chunks > 0`
- chunks include metadata such as `id`, `chunk_index`, `start_word`, `end_word`, `prev_chunk_id`, and `next_chunk_id`

### F. Chat With Manual

POST to `/chat`:

```json
{
  "query": "What experiments are covered?",
  "history": []
}
```

Expected:

- `answer`
- `sources`

### G. Chat Guard With No Manual

1. Call `DELETE /reset`.
2. POST to `/chat`.

Expected: backend returns the no-manual message and an empty sources list.

### H. Reset

Call `DELETE /reset`.

Expected:

- success message
- `GET /chunks` returns zero chunks
- `/chat` no-manual guard triggers

### I. Auto-Wipe Old Vectors

1. Upload PDF #1.
2. Ask a PDF #1-specific question.
3. Upload PDF #2.
4. Ask the same PDF #1 question.
5. Expected: answer should not use old PDF #1 content.
6. Ask a PDF #2-specific question.
7. Expected: answer should use PDF #2 content.

## 4. Frontend Feature Tests

### A. Dashboard / Sidebar

Open the frontend.

Expected:

- no stale prototype, demo, or phase text in primary UI
- navigation appears polished

### B. Upload Page

1. Select a non-PDF.
2. Expected: frontend validation appears.
3. Select a valid PDF.
4. Upload it.

Expected success UI:

- pages shown
- characters shown
- chunks shown
- vectors shown
- embedding status shown
- text preview shown
- Start Chatting button routes to `/chat`

### C. Chat Page

Ask a question about the uploaded manual.

Expected:

- loading indicator
- Markdown answer
- source snippets
- chat history passed with later requests
- quick prompt chips fill the input
- clear chat works

### D. Viva Prep

1. Open Viva Prep.
2. Click Generate Viva Questions.

Expected:

- loading state
- generated Markdown viva questions
- concise answers
- sources shown if returned
- no hardcoded fake questions shown as generated output

### E. Solver

1. Open Error Solver.
2. Submit empty input.
3. Expected: validation error.
4. Enter:

```text
My output voltage is zero
```

5. Submit.

Expected:

- loading state
- troubleshooting guidance in Markdown
- sources shown if returned
- answer grounded in uploaded manual

### F. Topics / Experiment Explainer

1. Open Experiment Explainer.
2. Click Explain Experiment 1.

Expected:

- loading state
- Markdown explanation
- sources shown if returned

Click List Precautions or Explain Procedure.

Expected:

- response updates for selected card

Search for `procedure`.

Expected:

- cards filter by title/description
- no card routes to `/not-implemented`

### G. Env API URL

1. Confirm frontend works with no root `.env` because fallback exists.
2. Create root `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

3. Restart frontend.
4. Confirm upload/chat still work.

## 5. Error Handling Tests

### A. Backend Off

Stop backend, then try upload, chat, Viva Prep, Solver, and Experiment Explainer.

Expected: clean frontend error message.

### B. No Manual Uploaded

1. Reset backend.
2. Try Chat, Viva Prep, Solver, and Experiment Explainer.

Expected:

- backend no-manual message appears
- frontend does not crash

### C. Missing API Key

1. Remove or rename `backend/.env`.
2. Restart backend.

Expected: backend does not start.

## 6. Final Pre-Submission Checklist

- [ ] Backend starts successfully.
- [ ] Frontend starts successfully.
- [ ] Upload PDF works.
- [ ] Upload stats show correctly.
- [ ] Chat answers from uploaded manual.
- [ ] Sources display.
- [ ] New upload clears old manual.
- [ ] Viva Prep works.
- [ ] Solver works.
- [ ] Topics cards work.
- [ ] Reset works.
- [ ] No hardcoded frontend API URL except env fallback, env example, or docs.
- [ ] No visible stale prototype/demo/phase text.
- [ ] README is accurate.
- [ ] Backend README is accurate.
- [ ] Testing docs are updated.
- [ ] `.env` files are not committed.
- [ ] `.env.example` is committed.
- [ ] `chroma_db` is ignored if appropriate.
- [ ] `temp_uploads` is ignored if appropriate.
- [ ] `venv` and `node_modules` are ignored.
