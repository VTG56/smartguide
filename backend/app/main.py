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

# Global in-memory storage for text chunks
chunks_storage = []


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


def create_chunks(text, chunk_size=500):
    """
    Split text into chunks of approximately chunk_size words.
    Ensures chunks don't break mid-word.
    
    Args:
        text: Full text to chunk
        chunk_size: Target number of words per chunk (default: 500)
        
    Returns:
        List of chunk dictionaries with id, text, and length
    """
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size):
        chunk_words = words[i:i + chunk_size]
        chunk_text = " ".join(chunk_words)
        
        # Sanitize chunk text to prevent encoding errors
        chunk_text = sanitize_text(chunk_text)
        
        chunk = {
            "id": str(uuid.uuid4()),
            "text": chunk_text,
            "length": len(chunk_text)
        }
        chunks.append(chunk)
    
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
        
        # Generate chunks
        chunks = create_chunks(cleaned_text, chunk_size=500)
        
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