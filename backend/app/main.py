from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uuid

from dotenv import load_dotenv

load_dotenv()

from app.services.pdf_processor import extract_pdf_text
from app.utils.text_cleaner import clean_text
from app.services.embedding_service import embed_chunks
from app.services.vector_store import (
    upsert_chunks,
    search_similar,
    clear_collection,
    collection_count,
)

from google import genai
from google.genai import types

# Configure Gemini client for chat generation
_api_key = os.getenv("GEMINI_API_KEY")
_genai_client = genai.Client(api_key=_api_key) if _api_key else None

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


# ─────────────────────────────────────────────
# Pydantic models for request bodies
# ─────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    query: str
    history: list[ChatMessage] = []


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "Lab Manual Conversational Assistant API is running"}


@app.post("/upload-lab-manual")
async def upload_lab_manual(file: UploadFile = File(...)):
    """
    Upload a laboratory manual PDF and extract text content.
    Creates text chunks, generates embeddings, and stores them in ChromaDB.
    
    Args:
        file: PDF file to upload
        
    Returns:
        JSON response with extracted text info, chunk count, and embedding status
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

        # ── Phase 3 & 4: Embed chunks and upsert into ChromaDB ──
        embeddings_status = "skipped"
        vectors_stored = 0
        try:
            embedded_chunks = embed_chunks(chunks)
            vectors_stored = upsert_chunks(embedded_chunks)
            embeddings_status = "success"
        except Exception as embed_err:
            embeddings_status = f"failed: {str(embed_err)}"
        
        # Generate preview
        preview = cleaned_text[:1000] + ("..." if len(cleaned_text) > 1000 else "")
        
        return JSONResponse({
            "status": "success",
            "pages": pages,
            "text_preview": preview,
            "total_characters": len(cleaned_text),
            "chunks_created": len(chunks),
            "embeddings_status": embeddings_status,
            "vectors_stored": vectors_stored,
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


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Conversational RAG chat endpoint.
    
    1. Embeds the user query via Gemini
    2. Retrieves top 5 similar chunks from ChromaDB
    3. Builds a system prompt with the retrieved context
    4. Sends conversation history + system prompt to Gemini Flash
    5. Returns the assistant answer with source citations
    """
    # Guard: Check if any documents are indexed
    if collection_count() == 0:
        return JSONResponse({
            "answer": (
                "No lab manual has been uploaded yet. "
                "Please upload a PDF first on the Upload page, "
                "then come back and ask me anything!"
            ),
            "sources": [],
        })

    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        # Step 1 & 2: Retrieve relevant chunks
        similar_chunks = search_similar(query, top_k=5)

        # Step 3: Build system prompt with context
        context_parts = []
        sources = []
        for hit in similar_chunks:
            context_parts.append(hit["text"])
            sources.append({
                "chunk_index": hit["metadata"].get("chunk_index", -1),
                "text_preview": hit["text"][:100] + ("..." if len(hit["text"]) > 100 else ""),
            })

        context_text = "\n\n---\n\n".join(context_parts) if context_parts else "No relevant context found."

        system_prompt = (
            "You are an intelligent assistant for lab manuals. "
            "Use ONLY the following context to answer the user's question. "
            "If the answer is not in the context, say \"I don't have information about that in the manual.\"\n\n"
            f"Context:\n{context_text}"
        )

        # Step 4: Build conversation for Gemini
        gemini_contents = []

        # Add history
        for msg in request.history:
            role = "user" if msg.role == "user" else "model"
            gemini_contents.append(
                types.Content(role=role, parts=[types.Part(text=msg.content)])
            )

        # Add current user query
        gemini_contents.append(
            types.Content(role="user", parts=[types.Part(text=query)])
        )

        # Call Gemini Flash via new SDK
        response = _genai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=gemini_contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
            ),
        )

        answer = response.text

        return JSONResponse({
            "answer": answer,
            "sources": sources,
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.delete("/reset")
async def reset():
    """
    Clear the ChromaDB collection and in-memory chunks.
    """
    global chunks_storage
    try:
        clear_collection()
        chunks_storage = []
        return JSONResponse({
            "status": "success",
            "message": "All data has been cleared successfully.",
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failed: {str(e)}")