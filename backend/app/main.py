from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from app.services.pdf_processor import extract_pdf_text
from app.utils.text_cleaner import clean_text

app = FastAPI(title="Lab Manual Conversational Assistant", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

DEFAULT_CHUNK_SIZE = 500
DEFAULT_CHUNK_OVERLAP_WORDS = 100

# Global in-memory storage for text chunks
chunks_storage = []


def _safe_int_from_env(env_key, default_value):
    """Read integer env var with fallback to default value."""
    raw_value = os.getenv(env_key)
    if raw_value is None:
        return default_value

    try:
        return int(raw_value)
    except (TypeError, ValueError):
        return default_value


def get_chunking_config():
    """Load chunk size and overlap from env with safe fallback behavior."""
    chunk_size = _safe_int_from_env("CHUNK_SIZE", DEFAULT_CHUNK_SIZE)
    overlap_words = _safe_int_from_env("CHUNK_OVERLAP_WORDS", DEFAULT_CHUNK_OVERLAP_WORDS)

    if chunk_size <= 0:
        chunk_size = DEFAULT_CHUNK_SIZE

    if overlap_words < 0:
        overlap_words = DEFAULT_CHUNK_OVERLAP_WORDS

    if overlap_words >= chunk_size:
        fallback_overlap = DEFAULT_CHUNK_OVERLAP_WORDS
        if fallback_overlap >= chunk_size:
            fallback_overlap = max(0, chunk_size // 5)
        overlap_words = fallback_overlap

    return chunk_size, overlap_words


CHUNK_SIZE, CHUNK_OVERLAP_WORDS = get_chunking_config()


def sanitize_text(text):
    """
    Remove problematic Unicode characters that can't be encoded in UTF-8.
    Handles surrogate characters and other encoding issues.
    
    Args:
        text: Text to sanitize
        
    Returns:
        Sanitized text safe for UTF-8 encoding
    """
    # Remove surrogate characters and other problematic Unicode
    sanitized = text.encode('utf-8', errors='ignore').decode('utf-8', errors='ignore')
    return sanitized


def create_chunks(text, chunk_size=DEFAULT_CHUNK_SIZE, overlap_words=DEFAULT_CHUNK_OVERLAP_WORDS):
    """
    Split text into overlapping chunks.
    Preserves context by keeping overlap_words shared words between chunks.
    
    Args:
        text: Full text to chunk
        chunk_size: Target number of words per chunk
        overlap_words: Number of words to overlap between adjacent chunks
        
    Returns:
        List of chunk dictionaries with id, text, length, and boundary metadata
    """
    if chunk_size <= 0:
        chunk_size = DEFAULT_CHUNK_SIZE

    if overlap_words < 0:
        overlap_words = DEFAULT_CHUNK_OVERLAP_WORDS

    if overlap_words >= chunk_size:
        fallback_overlap = DEFAULT_CHUNK_OVERLAP_WORDS
        if fallback_overlap >= chunk_size:
            fallback_overlap = max(0, chunk_size // 5)
        overlap_words = fallback_overlap

    words = text.split()
    chunks = []
    stride = chunk_size - overlap_words
    chunk_index = 0

    for start in range(0, len(words), stride):
        end = min(start + chunk_size, len(words))
        chunk_words = words[start:end]
        if not chunk_words:
            continue

        chunk_text = " ".join(chunk_words)

        # Sanitize chunk text to prevent encoding errors
        chunk_text = sanitize_text(chunk_text)

        chunk = {
            "id": str(uuid.uuid4()),
            "text": chunk_text,
            "length": len(chunk_text),
            "chunk_index": chunk_index,
            "start_word": start,
            "end_word": end
        }
        chunks.append(chunk)

        chunk_index += 1

        # Last chunk reached; stop to avoid duplicate trailing windows.
        if end >= len(words):
            break

    for index, chunk in enumerate(chunks):
        chunk["prev_chunk_id"] = chunks[index - 1]["id"] if index > 0 else None
        chunk["next_chunk_id"] = chunks[index + 1]["id"] if index < len(chunks) - 1 else None

    return chunks


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "Lab Manual Conversational Assistant API is running"}


@app.post("/upload-lab-manual")
async def upload_lab_manual(file: UploadFile = File(...)):
    """
    Upload a laboratory manual PDF and extract text content.
    Creates text chunks and stores them in memory.
    
    Args:
        file: PDF file to upload
        
    Returns:
        JSON response with extracted text info and chunk count
    """
    # Validate file extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Save file temporarily
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # Extract text from PDF
        pages, raw_text = extract_pdf_text(file_path)
        
        # Clean extracted text
        cleaned_text = clean_text(raw_text)
        
        # Generate overlapping chunks with global config defaults.
        chunks = create_chunks(
            cleaned_text,
            chunk_size=CHUNK_SIZE,
            overlap_words=CHUNK_OVERLAP_WORDS,
        )
        
        # Clear previous chunks and store new ones
        global chunks_storage
        chunks_storage = chunks
        
        # Generate preview
        preview = cleaned_text[:1000] + ("..." if len(cleaned_text) > 1000 else "")
        
        return JSONResponse({
            "status": "success",
            "pages": pages,
            "text_preview": preview,
            "total_characters": len(cleaned_text),
            "chunks_created": len(chunks)
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    
    finally:
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)


@app.get("/chunks")
async def get_chunks():
    """
    Retrieve all stored text chunks.
    
    Returns:
        JSON response with list of all chunks
    """
    return JSONResponse({
        "status": "success",
        "total_chunks": len(chunks_storage),
        "chunks": chunks_storage
    })