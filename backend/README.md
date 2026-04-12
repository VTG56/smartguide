# Lab Manual Conversational Assistant - Backend

## Overview

FastAPI backend for uploading laboratory manual PDFs and extracting text content.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app & endpoints
│   ├── routes/
│   │   └── __init__.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── pdf_processor.py    # PDF extraction logic
│   └── utils/
│       ├── __init__.py
│       └── text_cleaner.py     # Text cleaning utilities
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Installation

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

## Running the Server

### Start the development server with auto-reload:

```bash
uvicorn app.main:app --reload
```

### Or specify custom host/port:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Server will be available at: `http://localhost:8000`

## Chunking Configuration

Chunking is globally configurable through environment variables.

- `CHUNK_SIZE` (default: `500`)
- `CHUNK_OVERLAP_WORDS` (default: `100`)

Behavior notes:

- Chunks are generated with overlap to preserve context across boundaries.
- If env values are invalid (non-integer, negative, overlap >= chunk size), backend auto-falls back to safe values.

Example:

```bash
CHUNK_SIZE=500 CHUNK_OVERLAP_WORDS=100 uvicorn app.main:app --reload
```

## Testing the Endpoint

### Option 1: Using FastAPI Interactive Docs

1. Visit `http://localhost:8000/docs`
2. Scroll to the `POST /upload-lab-manual` endpoint
3. Click "Try it out"
4. Click "Choose File" and upload a PDF
5. Click "Execute"

### Option 2: Using Python requests

```python
import requests

files = {'file': open('path/to/your/lab_manual.pdf', 'rb')}
response = requests.post('http://localhost:8000/upload-lab-manual', files=files)
print(response.json())
```

### Option 3: Using curl

```bash
curl -X POST "http://localhost:8000/upload-lab-manual" \
  -H "accept: application/json" \
  -F "file=@/path/to/lab_manual.pdf"
```

### Option 4: Using VS Code REST Client

Create a file `test.http`:

```http
POST http://localhost:8000/upload-lab-manual
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="lab_manual.pdf"
Content-Type: application/pdf

< /path/to/lab_manual.pdf
------WebKitFormBoundary--
```

## API Endpoints

### GET `/` (Health Check)

Returns server status.

**Response:**

```json
{
  "status": "Lab Manual Conversational Assistant API is running"
}
```

### POST `/upload-lab-manual`

Upload a PDF file and extract text content.

**Parameters:**

- `file` (required): PDF file

**Response:**

```json
{
  "status": "success",
  "pages": 25,
  "text_preview": "Experiment 1: Verification of Ohm's Law...",
  "total_characters": 45328
}
```

**Error Responses:**

- `400 Bad Request`: File is not a PDF
- `500 Internal Server Error`: PDF processing failed

## Dependencies

- **fastapi**: Web framework
- **uvicorn**: ASGI server
- **pypdf2**: PDF text extraction
- **python-multipart**: Form data handling

## Features

✅ PDF file upload validation
✅ Text extraction from PDFs
✅ Intelligent text cleaning
✅ CORS enabled for frontend integration
✅ Temporary file cleanup
✅ Error handling
✅ Interactive API documentation
✅ Overlapping chunk generation for boundary context preservation
✅ Chunk boundary metadata (`chunk_index`, `start_word`, `end_word`, `prev_chunk_id`, `next_chunk_id`)

## Next Steps (Future)

- Add LangChain for text processing
- Implement FAISS vector database
- Add conversation endpoints
- Add authentication
