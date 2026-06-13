/**
 * API Service — Chat & Upload helpers
 *
 * Backend calls use Vite env configuration with a local fallback.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Send a chat message to the RAG backend.
 *
 * @param {string} query – The user's question.
 * @param {Array<{role: string, content: string}>} history – Prior messages.
 * @param {string | null} systemOverride â€“ Optional page-specific system instruction.
 * @returns {Promise<{answer: string, sources: Array}>}
 */
export async function sendMessage(query, history = [], systemOverride = null) {
  const payload = {
    query,
    history,
  };

  if (systemOverride) {
    payload.system_override = systemOverride;
  }

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Failed to get response from SmartGuide.");
  }

  return res.json();
}

/**
 * Reset all data on the backend (ChromaDB + in-memory chunks).
 *
 * @returns {Promise<{status: string, message: string}>}
 */
export async function resetData() {
  const res = await fetch(`${API_BASE_URL}/reset`, { method: "DELETE" });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Reset request failed");
  }

  return res.json();
}
