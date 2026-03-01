const stats = [
  { value: '0%', label: 'Topic Coverage', change: null },
  { value: '0', label: 'Questions Solved', change: null },
  { value: '0', label: 'Documents Uploaded', change: null },
  { value: '—', label: 'Mastery Score', change: null },
];

const recentActivity = [
  { type: 'system', message: 'Analytics module initialized', time: 'Just now' },
  { type: 'info', message: 'Awaiting document uploads to begin tracking', time: '—' },
  { type: 'info', message: 'Progress metrics will appear after first interaction', time: '—' },
];

export default function Analytics() {
  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <span className="section-label block mb-2">Performance Tracking</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Learning Analytics</h1>
            <p className="text-slate-500 mt-2 max-w-md">
              Track your academic progress across topics, questions, and mastery levels.
            </p>
          </div>
          <span className="tag bg-slate-100 text-slate-500">Under Development</span>
        </div>

        <div className="divider mb-10" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="stat-block hover-lift">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <div className="lg:col-span-2 card-editorial p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800">Learning Progress</h3>
                <p className="text-sm text-slate-400">Weekly activity overview</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-editorial text-xs btn-solid">Week</button>
                <button className="btn-editorial text-xs">Month</button>
              </div>
            </div>
            <div className="chart-placeholder h-56">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm">Chart will appear after data collection</p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card-editorial p-6">
            <h3 className="font-bold text-slate-800 mb-1">Recent Activity</h3>
            <p className="text-sm text-slate-400 mb-6">Your learning timeline</p>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="timeline-item relative pb-4">
                  {i < recentActivity.length - 1 && <div className="timeline-connector" />}
                  <p className="text-sm text-slate-600">{activity.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Breakdown */}
          <div className="card-editorial p-6">
            <h3 className="font-bold text-slate-800 mb-1">Topic Breakdown</h3>
            <p className="text-sm text-slate-400 mb-6">Coverage by subject</p>
            <div className="space-y-4">
              {['DBMS', 'OS', 'CN', 'DSA'].map((subject) => (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">{subject}</span>
                    <span className="text-sm font-bold text-slate-400">0%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mastery Levels */}
          <div className="card-editorial p-6">
            <h3 className="font-bold text-slate-800 mb-1">Mastery Levels</h3>
            <p className="text-sm text-slate-400 mb-6">Skill assessment</p>
            <div className="chart-placeholder h-32">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className="text-xs">No data yet</p>
              </div>
            </div>
          </div>

          {/* Question Stats */}
          <div className="card-editorial p-6">
            <h3 className="font-bold text-slate-800 mb-1">Question Stats</h3>
            <p className="text-sm text-slate-400 mb-6">Solver performance</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-md">
                <div className="text-2xl font-bold text-slate-800">0</div>
                <div className="text-xs text-slate-500">Attempted</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-md">
                <div className="text-2xl font-bold text-slate-800">0</div>
                <div className="text-xs text-slate-500">Solved</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-md">
                <div className="text-2xl font-bold text-slate-800">—</div>
                <div className="text-xs text-slate-500">Avg. Time</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-md">
                <div className="text-2xl font-bold text-slate-800">—</div>
                <div className="text-xs text-slate-500">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-start gap-4">
            <span className="text-2xl">📊</span>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Analytics Module — Under Development</h4>
              <p className="text-sm text-blue-600">
                Full analytics and progress tracking will be available after RAG pipeline integration 
                in Phase 2. This dashboard currently displays placeholder data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
