"""
Embedding Service — Google Gemini text-embedding-004

Provides functions for embedding text chunks and single queries using
the Google GenAI SDK (new google-genai package).
"""

import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

# Configure the GenAI client once at module level
_api_key = os.getenv("GEMINI_API_KEY")
_client = genai.Client(api_key=_api_key) if _api_key else None

EMBEDDING_MODEL = "gemini-embedding-001"


def _ensure_configured():
    """Raise early if the API key is missing."""
    global _client
    if not _client:
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. "
                "Add it to your .env file or export it as an environment variable."
            )
        _client = genai.Client(api_key=key)


def embed_text(text: str) -> list[float]:
    """
    Embed a single piece of text using Gemini text-embedding-004.

    Args:
        text: The text string to embed.

    Returns:
        A list of floats representing the embedding vector.
    """
    _ensure_configured()
    result = _client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config={
            "task_type": "RETRIEVAL_DOCUMENT",
        },
    )
    return result.embeddings[0].values


def embed_query(query: str) -> list[float]:
    """
    Embed a user query (uses task_type RETRIEVAL_QUERY for better search).

    Args:
        query: The search query string.

    Returns:
        A list of floats representing the query embedding vector.
    """
    _ensure_configured()
    result = _client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=query,
        config={
            "task_type": "RETRIEVAL_QUERY",
        },
    )
    return result.embeddings[0].values


def embed_chunks(chunks: list[dict]) -> list[dict]:
    """
    Embed a list of text chunks. Each chunk dict must have a "text" key.
    Attaches the embedding vector under chunk["embedding"].

    Args:
        chunks: List of chunk dictionaries with at least a "text" field.

    Returns:
        The same list with "embedding" field added to each chunk.
    """
    _ensure_configured()

    for chunk in chunks:
        result = _client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=chunk["text"],
            config={
                "task_type": "RETRIEVAL_DOCUMENT",
            },
        )
        chunk["embedding"] = result.embeddings[0].values

    return chunks
