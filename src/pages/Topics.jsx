import { useNavigate } from 'react-router-dom';

const topics = [
  {
    title: 'Database Normalization',
    subject: 'DBMS',
    tags: ['theory', 'core'],
    description: '1NF, 2NF, 3NF, BCNF — decomposition techniques and functional dependencies.',
    size: 'large',
  },
  {
    title: 'CPU Scheduling Algorithms',
    subject: 'Operating Systems',
    tags: ['theory', 'pyq'],
    description: 'FCFS, SJF, Round Robin, Priority Scheduling — process management fundamentals.',
    size: 'small',
  },
  {
    title: 'OSI Model Layers',
    subject: 'Computer Networks',
    tags: ['core'],
    description: 'Seven-layer architecture from Physical to Application layer.',
    size: 'small',
  },
  {
    title: 'Binary Search Trees',
    subject: 'Data Structures',
    tags: ['theory', 'lab'],
    description: 'Insertion, deletion, traversal operations with O(log n) complexity analysis.',
    size: 'medium',
  },
  {
    title: 'SQL Joins & Subqueries',
    subject: 'DBMS',
    tags: ['lab', 'pyq'],
    description: 'Inner, outer, cross joins and correlated subqueries with practical examples.',
    size: 'medium',
  },
  {
    title: 'TCP/IP Protocol Suite',
    subject: 'Computer Networks',
    tags: ['core', 'theory'],
    description: 'Transport and Network layer protocols — TCP, UDP, IP addressing.',
    size: 'small',
  },
];

const tagStyles = {
  theory: 'tag-theory',
  lab: 'tag-lab',
  pyq: 'tag-pyq',
  core: 'tag-core',
};

export default function Topics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <span className="section-label block mb-2">Knowledge Base</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Topic Explorer</h1>
            <p className="text-slate-500 mt-2 max-w-md">
              Browse topics extracted from your uploaded materials. Click to get contextual explanations.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search topics..."
              className="input-editorial w-full"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Theory', 'Lab', 'PYQ'].map((filter) => (
              <button
                key={filter}
                className={`btn-editorial text-sm ${filter === 'All' ? 'btn-solid' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="divider mb-10" />

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          {topics.map((topic, i) => (
            <div
              key={i}
              className={`card-editorial hover-lift ${
                topic.size === 'large' ? 'sm:col-span-2 lg:col-span-2' : ''
              } ${topic.size === 'medium' ? 'lg:row-span-1' : ''}`}
            >
              <div className="p-6">
                {/* Subject */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {topic.subject}
                  </span>
                  <div className="flex gap-1.5">
                    {topic.tags.map((tag) => (
                      <span key={tag} className={`tag ${tagStyles[tag]}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 mb-2">{topic.title}</h3>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed mb-5">
                  {topic.description}
                </p>

                {/* Action */}
                <button
                  onClick={() => navigate('/not-implemented')}
                  className="btn-editorial text-sm w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Explain Topic
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-md">
          <div className="flex items-start gap-4">
            <span className="text-2xl">📚</span>
            <div>
              <h4 className="font-semibold text-slate-700 mb-1">Topics are auto-extracted</h4>
              <p className="text-sm text-slate-500">
                Once you upload documents, topics will be automatically identified and indexed 
                for exploration. This feature requires RAG pipeline integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
