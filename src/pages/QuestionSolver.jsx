export default function QuestionSolver() {
  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <span className="section-label block mb-2">AI-Powered</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Question Solver</h1>
          <p className="text-slate-500 mt-2 max-w-lg">
            Paste any academic question and receive step-by-step solutions powered by 
            retrieval-augmented generation.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Question Input</h3>
                  <p className="text-xs text-slate-400">Type or paste your question below</p>
                </div>
              </div>

              <textarea
                rows={8}
                placeholder="Example: Explain the difference between 2NF and 3NF in database normalization with an example..."
                className="input-editorial w-full resize-none mb-4"
              />

              <div className="flex items-center gap-3">
                <button className="btn-editorial btn-solid flex-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Solve Question
                </button>
                <button className="btn-editorial">
                  Clear
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="card-editorial p-5">
              <h4 className="font-semibold text-slate-700 text-sm mb-4">Solver Options</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" defaultChecked />
                  Include step-by-step explanation
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  Show source references
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  Include related topics
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel - Result */}
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
                    <h3 className="font-bold text-slate-800 text-sm">Solution Output</h3>
                    <p className="text-xs text-slate-400">AI-generated response</p>
                  </div>
                </div>
                <span className="tag bg-amber-50 text-amber-600">Pending</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-600 mb-2">No Solution Yet</h4>
                <p className="text-sm text-slate-400 max-w-xs">
                  Enter a question and click "Solve Question" to generate a solution.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-xs text-slate-400 text-center">
                  Solution engine will be connected to LLM backend in Phase 2
                </p>
              </div>
            </div>

            {/* Context Sources */}
            <div className="card-editorial p-5">
              <h4 className="font-semibold text-slate-700 text-sm mb-3">Context Sources</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                  <span className="text-lg">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 truncate">No documents indexed</p>
                    <p className="text-xs text-slate-400">Upload documents to enable retrieval</p>
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
