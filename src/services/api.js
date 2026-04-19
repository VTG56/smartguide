/**
 * API Service — Chat & Upload helpers
 *
 * All backend calls hit http://localhost:8000
 */

const API_BASE = "http://localhost:8000";

/**
 * Send a chat message to the RAG backend.
 *
 * @param {string} query – The user's question.
 * @param {Array<{role: string, content: string}>} history – Prior messages.
 * @returns {Promise<{answer: string, sources: Array}>}
 */
export async function sendMessage(query, history = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Chat request failed");
  }

  return res.json();
}

/**
 * Reset all data on the backend (ChromaDB + in-memory chunks).
 *
 * @returns {Promise<{status: string, message: string}>}
 */
export async function resetData() {
  const res = await fetch(`${API_BASE}/reset`, { method: "DELETE" });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Reset request failed");
  }

  return res.json();
}
