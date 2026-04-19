import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../services/api";
import ReactMarkdown from 'react-markdown';

/* ─── Tiny robot avatar SVG ──────────────────────────────── */
function RobotAvatar() {
  return (
    <div className="chat-avatar flex-shrink-0">
      <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
        <rect width="36" height="36" rx="10" fill="url(#botGrad)" />
        <path
          d="M18 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 8v3"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect x="10" y="11" width="16" height="14" rx="4" fill="#fff" fillOpacity=".25" />
        <circle cx="14.5" cy="18" r="2" fill="#fff" />
        <circle cx="21.5" cy="18" r="2" fill="#fff" />
        <path
          d="M14 24c1.333 1 6.667 1 8 0"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="botGrad" x1="0" y1="0" x2="36" y2="36">
            <stop stopColor="#3361ff" />
            <stop offset="1" stopColor="#04c8b1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Typing indicator (3 bouncing dots) ─────────────────── */
function TypingIndicator() {
  return (
    <div className="chat-row assistant">
      <RobotAvatar />
      <div className="chat-bubble assistant">
        <span className="typing-dots">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
}

/* ─── Collapsible sources list ───────────────────────────── */
function Sources({ sources }) {
  const [open, setOpen] = useState(false);
  if (!sources || sources.length === 0) return null;

  return (
    <div className="chat-sources">
      <button
        className="chat-sources-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>Sources ({sources.length})</span>
      </button>

      {open && (
        <ul className="chat-sources-list">
          {sources.map((s, i) => (
            <li key={i}>
              <span className="chat-source-badge">Chunk {s.chunk_index}</span>
              <span className="chat-source-text">{s.text_preview}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Error toast ────────────────────────────────────────── */
function ErrorToast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="chat-error-toast animate-slide-down">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-auto opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN CHAT PAGE
   ════════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Check if a manual has been uploaded (tracked via localStorage)
  const hasUploaded = typeof window !== "undefined" && localStorage.getItem("smartguide_uploaded") === "true";

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Build history array for the API (exclude the latest user msg)
  function buildHistory() {
    return messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
  }

  async function handleSend() {
    const query = input.trim();
    if (!query || loading) return;

    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const history = buildHistory();
      const data = await sendMessage(query, history);

      const assistantMsg = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleClear() {
    setMessages([]);
    setError(null);
  }

  /* ── Quick prompts ─── */
  const quickPrompts = [
    "What experiments are covered in this manual?",
    "Explain the procedure step by step",
    "What apparatus do I need?",
    "What are common mistakes to avoid?",
  ];

  function handleQuickPrompt(prompt) {
    setInput(prompt);
    inputRef.current?.focus();
  }

  /* ── RENDER ────────────────────────────────────────────── */
  return (
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">Ask SmartGuide</h1>
            <p className="text-xs text-slate-400">RAG-powered lab assistant</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button onClick={handleClear} className="chat-clear-btn" title="Clear chat">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </header>

      {/* Error toast */}
      {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}

      {/* Message area */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && !loading ? (
          /* ── Empty State ── */
          <div className="chat-empty">
            <div className="chat-empty-icon">
              <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16">
                <rect width="48" height="48" rx="16" fill="url(#emptyGrad)" fillOpacity=".12" />
                <path
                  d="M24 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM24 14v2"
                  stroke="url(#emptyGrad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect x="14" y="16" width="20" height="16" rx="5" stroke="url(#emptyGrad)" strokeWidth="1.5" />
                <circle cx="19.5" cy="24" r="2" fill="url(#emptyGrad)" />
                <circle cx="28.5" cy="24" r="2" fill="url(#emptyGrad)" />
                <path d="M20 29c1.333 1.333 6.667 1.333 8 0" stroke="url(#emptyGrad)" strokeWidth="1.2" strokeLinecap="round" />
                <defs>
                  <linearGradient id="emptyGrad" x1="0" y1="0" x2="48" y2="48">
                    <stop stopColor="#3361ff" />
                    <stop offset="1" stopColor="#04c8b1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {hasUploaded ? (
              <>
                <h2 className="text-lg font-bold text-slate-700 mb-1">Ask me anything!</h2>
                <p className="text-sm text-slate-400 max-w-sm">
                  Your lab manual is loaded. Type a question below and I'll find the answer using
                  the uploaded content.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-slate-700 mb-1">Welcome to SmartGuide Chat</h2>
                <p className="text-sm text-slate-400 max-w-sm">
                  Upload a lab manual first on the <strong>Upload</strong> page, then come back
                  and ask me anything!
                </p>
              </>
            )}

            {/* Quick prompt chips */}
            <div className="chat-quick-prompts">
              {quickPrompts.map((p) => (
                <button key={p} className="chat-chip" onClick={() => handleQuickPrompt(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Message bubbles ── */
          <div className="chat-bubbles-wrapper">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.role}`}>
                {msg.role === "assistant" && <RobotAvatar />}
                <div>
                  <div className={`chat-bubble ${msg.role}`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded dark:prose-invert">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "assistant" && <Sources sources={msg.sources} />}
                </div>
              </div>
            ))}
            {loading && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <div className="chat-input-inner">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your lab manual…"
            rows={1}
            disabled={loading}
            className="chat-textarea"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="chat-send-btn"
            title="Send message"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          SmartGuide uses RAG to answer from your uploaded lab manual. Responses may not be perfect.
        </p>
      </div>
    </div>
  );
}
