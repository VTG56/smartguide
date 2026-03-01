export default function QuestionSolver() {
  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <span className="section-label block mb-2">Conversational AI</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ask SmartGuide</h1>
          <p className="text-slate-500 mt-2 max-w-lg">
            Ask questions about your lab experiments — procedures, apparatus setup, 
            observations, calculations, and viva topics.
          </p>
        </div>

        <div className="divider mb-10" />

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <div className="card-editorial p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Your Question</h3>
                  <p className="text-xs text-slate-400">Ask about your lab experiment</p>
                </div>
              </div>

              <textarea
                rows={8}
                placeholder="Example: What is the procedure for verifying Ohm's law? What apparatus do I need and how do I record the observations?"
                className="input-editorial w-full resize-none mb-4"
              />

              <div className="flex items-center gap-3">
                <button className="btn-editorial btn-solid flex-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Ask SmartGuide
                </button>
                <button className="btn-editorial">
                  Clear
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="card-editorial p-5">
              <h4 className="font-semibold text-slate-700 text-sm mb-4">Quick Prompts</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                  Explain the procedure step by step
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                  What are common mistakes to avoid?
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                  Help me write the conclusion
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Response */}
          <div className="space-y-6">
            <div className="card-editorial p-6 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">SmartGuide Response</h3>
                    <p className="text-xs text-slate-400">AI-generated guidance</p>
                  </div>
                </div>
                <span className="tag bg-blue-50 text-blue-600">Demo</span>
              </div>

              <div className="flex-1 bg-slate-50 rounded-md p-4">
                <div className="prose prose-sm text-slate-600">
                  <p className="font-medium text-slate-700 mb-3">Example Response:</p>
                  <p><strong>Step 1:</strong> Set up the circuit as shown in the diagram with ammeter in series and voltmeter in parallel.</p>
                  <p><strong>Step 2:</strong> Vary the rheostat to get different current readings.</p>
                  <p><strong>Step 3:</strong> Record voltage and current readings for each setting.</p>
                  <p><strong>Step 4:</strong> Plot V-I graph with voltage on X-axis and current on Y-axis.</p>
                  <p><strong>Step 5:</strong> Calculate resistance from the slope of the graph.</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-xs text-slate-400 text-center">
                  Live conversational RAG backend will be integrated in Phase 2.
                </p>
              </div>
            </div>

            {/* Experiment Context */}
            <div className="card-editorial p-5">
              <h4 className="font-semibold text-slate-700 text-sm mb-3">Experiment Context</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                  <span className="text-lg">🧪</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 truncate">No experiment selected</p>
                    <p className="text-xs text-slate-400">Select from Lab Experiments page</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
