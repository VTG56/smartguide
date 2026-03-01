export default function QuestionSolver() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          <span className="gradient-text">Question Solver</span>
        </h1>
        <p className="text-slate-500 mb-10">
          Paste any academic question and get a step-by-step solution.
        </p>

        {/* Question Input */}
        <textarea
          rows={5}
          placeholder="Type or paste your question here…"
          className="input-modern w-full resize-none mb-6"
        />

        <button className="btn-primary w-full text-base mb-10">
          Solve Question
        </button>

        {/* Placeholder Result */}
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🔬</div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            Solution Output
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Solution engine will be connected to LLM backend in Phase 2.
          </p>
        </div>
      </div>
    </section>
  );
}
