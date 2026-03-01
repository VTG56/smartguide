const metrics = [
  { label: 'Topic Coverage', value: 0 },
  { label: 'Questions Solved', value: 0 },
  { label: 'Mastery Score', value: 0 },
];

export default function Analytics() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          <span className="gradient-text">Learning Analytics</span>
        </h1>
        <p className="text-slate-500 mb-12">
          Track your academic progress across topics and questions.
        </p>

        <div className="glass-card rounded-2xl p-8 space-y-8">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  {m.label}
                </span>
                <span className="text-sm font-bold text-slate-400">
                  {m.value}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-xl p-5 mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            📊 Learning Analytics Module &mdash; Under Development
          </p>
        </div>
      </div>
    </section>
  );
}
