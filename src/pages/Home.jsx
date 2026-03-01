const capabilities = [
  {
    num: '01',
    title: 'Experiment Theory',
    description: 'Understand the underlying principles and concepts behind each lab experiment.',
  },
  {
    num: '02',
    title: 'Procedure Guidance',
    description: 'Step-by-step instructions for apparatus setup, readings, and observations.',
  },
  {
    num: '03',
    title: 'Common Mistakes & Fixes',
    description: 'Learn about typical errors, troubleshooting tips, and error margin analysis.',
  },
  {
    num: '04',
    title: 'Viva Preparation',
    description: 'Prepare for practical exam viva with probable questions and answers.',
  },
  {
    num: '05',
    title: 'Report Writing',
    description: 'Assistance with observations, calculations, graphs, and conclusions.',
  },
];

const agentFlow = [
  'User Query',
  'AI Agent',
  'Lab Knowledge Base',
  'Response Synthesizer',
  'Safe Output',
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Left - Large Title */}
            <div className="lg:col-span-3 animate-in">
              <span className="section-label block mb-4">Lab Manual AI Companion</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                SmartGuide
                <br />
                <span className="text-slate-400">Your Lab Assistant</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Ask questions about experiments, procedures, readings, and viva topics. 
                Get step-by-step guidance for your practical lab sessions.
              </p>
            </div>

            {/* Right - Current Phase Card */}
            <div className="lg:col-span-2 space-y-6 animate-in" style={{ animationDelay: '0.1s' }}>
              <div className="card-editorial p-6 border-l-2 border-l-blue-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="tag tag-core">Current Phase</span>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Phase 1 – UI Scaffold</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Conversational engine integration in progress. Frontend prototype ready 
                  for RAG pipeline connection.
                </p>
              </div>
              <div className="card-editorial p-6 bg-slate-50">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Agent Flow</h4>
                <div className="flex flex-wrap gap-2">
                  {agentFlow.map((step, i) => (
                    <span key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium">{step}</span>
                      {i < agentFlow.length - 1 && <span className="text-slate-300">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="section-number">01</span>
            <div>
              <span className="section-label block">What SmartGuide Can Do</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Supported Capabilities</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap, i) => (
              <div key={i} className="card-editorial p-6 hover-lift">
                <span className="section-number">{cap.num}</span>
                <h3 className="font-bold text-slate-800 mt-2 mb-2">{cap.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-20 border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="section-number">02</span>
            <div>
              <span className="section-label block">Architecture Overview</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">How It Works</h2>
            </div>
          </div>

          <div className="card-editorial p-8">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
              {agentFlow.map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="px-6 py-4 bg-white border border-slate-200 rounded-md text-center min-w-[140px]">
                    <span className="text-sm font-semibold text-slate-700">{step}</span>
                  </div>
                  {i < agentFlow.length - 1 && (
                    <svg className="w-5 h-5 text-slate-300 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500 mt-6">
              Dummy agent flow — Conversational RAG backend will be integrated in Phase 2.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p className="text-sm text-slate-400">&copy; 2026 SmartGuide &mdash; Lab Manual AI Companion</p>
        </div>
      </footer>
    </div>
  );
}
