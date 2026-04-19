"""
Vector Store Service — ChromaDB (persistent local storage)

Manages the lab_manual_chunks collection in ChromaDB.
Provides upsert and similarity-search functionality.
"""

import chromadb
from app.services.embedding_service import embed_query

CHROMA_PATH = "./chroma_db"
COLLECTION_NAME = "lab_manual_chunks"

# Persistent client — data survives server restarts
_client = chromadb.PersistentClient(path=CHROMA_PATH)


def _get_collection():
    """Get or create the ChromaDB collection."""
    return _client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def upsert_chunks(chunks: list[dict]) -> int:
    """
    Upsert embedded chunks into ChromaDB.

    Each chunk dict must contain:
      - id (str)
      - text (str)
      - embedding (list[float])
      - chunk_index (int)
      - start_word (int)
      - end_word (int)

    Args:
        chunks: List of chunk dicts with embeddings already attached.

    Returns:
        The number of chunks upserted.
    """
    collection = _get_collection()

    ids = [chunk["id"] for chunk in chunks]
    documents = [chunk["text"] for chunk in chunks]
    embeddings = [chunk["embedding"] for chunk in chunks]
    metadatas = [
        {
            "chunk_index": chunk["chunk_index"],
            "start_word": chunk["start_word"],
            "end_word": chunk["end_word"],
        }
        for chunk in chunks
    ]

    collection.upsert(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(ids)


def search_similar(query: str, top_k: int = 5) -> list[dict]:
    """
    Embed a query and retrieve the top_k most similar chunks from ChromaDB.

    Args:
        query: The user's question string.
        top_k: Number of nearest neighbors to return.

    Returns:
        List of dicts: { id, text, metadata, distance }
    """
    collection = _get_collection()

    # Guard: if the collection is empty, return nothing
    if collection.count() == 0:
        return []

    query_embedding = embed_query(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    # Flatten ChromaDB's nested list structure
    hits = []
    for i in range(len(results["ids"][0])):
        hits.append(
            {
                "id": results["ids"][0][i],
                "text": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i],
            }
        )

    return hits


def clear_collection():
    """Delete and recreate the collection (used by /reset endpoint)."""
    _client.delete_collection(name=COLLECTION_NAME)
    # Recreate so subsequent operations don't fail
    _get_collection()


def collection_count() -> int:
    """Return the number of documents in the collection."""
    return _get_collection().count()
