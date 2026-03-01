const roadmap = [
  {
    phase: 'Phase 1',
    title: 'Frontend Prototype',
    status: 'active',
    items: ['UI/UX Design', 'Component Architecture', 'Routing Setup'],
  },
  {
    phase: 'Phase 2',
    title: 'RAG Pipeline',
    status: 'upcoming',
    items: ['Document Parsing', 'Vector Embeddings', 'LLM Integration'],
  },
  {
    phase: 'Phase 3',
    title: 'Production Ready',
    status: 'upcoming',
    items: ['Analytics Dashboard', 'User Authentication', 'Deployment'],
  },
];

const stats = [
  { value: '3', label: 'Core Modules' },
  { value: '6', label: 'UI Pages' },
  { value: '0', label: 'Documents Indexed' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Asymmetric */}
      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Left - Large Title */}
            <div className="lg:col-span-3 animate-in">
              <span className="section-label block mb-4">Academic RAG Platform</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Smart learning,
                <br />
                <span className="text-slate-400">powered by AI</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Upload your study materials, explore topics contextually, and solve questions 
                with retrieval-augmented generation.
              </p>
            </div>

            {/* Right - Info Block */}
            <div className="lg:col-span-2 space-y-6 animate-in" style={{ animationDelay: '0.1s' }}>
              <div className="card-editorial p-6">
                <span className="section-number">01</span>
                <h3 className="font-bold text-slate-800 mt-2 mb-1">Multi-Document Upload</h3>
                <p className="text-sm text-slate-500">PDF, DOCX, PPT parsing with intelligent chunking</p>
              </div>
              <div className="card-editorial p-6">
                <span className="section-number">02</span>
                <h3 className="font-bold text-slate-800 mt-2 mb-1">Topic Explanations</h3>
                <p className="text-sm text-slate-500">Context-aware explanations from your materials</p>
              </div>
              <div className="card-editorial p-6">
                <span className="section-number">03</span>
                <h3 className="font-bold text-slate-800 mt-2 mb-1">Question Solving</h3>
                <p className="text-sm text-slate-500">Step-by-step solutions using LLM + retrieval</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center lg:text-left">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-10">
            <span className="section-number">04</span>
            <div>
              <span className="section-label block">Development Timeline</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Project Roadmap</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roadmap.map((phase, i) => (
              <div
                key={i}
                className={`card-editorial p-6 hover-lift ${
                  phase.status === 'active' ? 'border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`tag ${phase.status === 'active' ? 'tag-core' : 'bg-slate-100 text-slate-500'}`}>
                    {phase.phase}
                  </span>
                  {phase.status === 'active' && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-3">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-500">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p className="text-sm text-slate-400">&copy; 2026 SmartGuide &mdash; Academic RAG Project</p>
        </div>
      </footer>
    </div>
  );
}
