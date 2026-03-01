import { useNavigate } from 'react-router-dom';

const experiments = [
  {
    title: "Ohm's Law Verification",
    subject: 'Physics',
    tags: ['circuit', 'measurements'],
    description: 'Verify Ohm\'s law by plotting V-I characteristics and calculating resistance from the slope.',
    size: 'large',
  },
  {
    title: 'Determination of Viscosity',
    subject: 'Physics',
    tags: ['fluid', 'measurements'],
    description: 'Measure the coefficient of viscosity of a liquid using Stokes\' method with falling sphere.',
    size: 'small',
  },
  {
    title: 'BJT Characteristics',
    subject: 'Electronics',
    tags: ['circuit', 'transistor'],
    description: 'Study input and output characteristics of a bipolar junction transistor in CE configuration.',
    size: 'small',
  },
  {
    title: 'SQL Lab Experiment 3',
    subject: 'Computer Science',
    tags: ['database', 'queries'],
    description: 'Practice SQL joins, nested queries, and aggregate functions on sample databases.',
    size: 'medium',
  },
  {
    title: 'OS Shell Programming',
    subject: 'Computer Science',
    tags: ['scripting', 'unix'],
    description: 'Write shell scripts for process management, file operations, and system automation.',
    size: 'medium',
  },
  {
    title: 'Tensile Strength Test',
    subject: 'Mechanical',
    tags: ['materials', 'testing'],
    description: 'Determine tensile strength and yield point of mild steel using UTM machine.',
    size: 'small',
  },
];

const tagStyles = {
  circuit: 'tag-core',
  measurements: 'tag-theory',
  fluid: 'tag-theory',
  transistor: 'tag-lab',
  database: 'tag-core',
  queries: 'tag-pyq',
  scripting: 'tag-lab',
  unix: 'tag-theory',
  materials: 'tag-theory',
  testing: 'tag-lab',
};

export default function Topics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <span className="section-label block mb-2">Lab Manual</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Lab Experiments</h1>
            <p className="text-slate-500 mt-2 max-w-md">
              Browse experiments from your lab manual. Click to get step-by-step procedure guidance and explanations.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search experiments..."
              className="input-editorial w-full"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Physics', 'Electronics', 'CS', 'Mechanical'].map((filter) => (
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

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          {experiments.map((experiment, i) => (
            <div
              key={i}
              className={`card-editorial hover-lift ${
                experiment.size === 'large' ? 'sm:col-span-2 lg:col-span-2' : ''
              } ${experiment.size === 'medium' ? 'lg:row-span-1' : ''}`}
            >
              <div className="p-6">
                {/* Subject */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {experiment.subject}
                  </span>
                  <div className="flex gap-1.5">
                    {experiment.tags.map((tag) => (
                      <span key={tag} className={`tag ${tagStyles[tag] || 'bg-slate-100 text-slate-500'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 mb-2">{experiment.title}</h3>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed mb-5">
                  {experiment.description}
                </p>

                {/* Action */}
                <button
                  onClick={() => navigate('/not-implemented')}
                  className="btn-editorial text-sm w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Open Lab Assistant
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-md">
          <div className="flex items-start gap-4">
            <span className="text-2xl">🧪</span>
            <div>
              <h4 className="font-semibold text-slate-700 mb-1">Experiments from your lab manual</h4>
              <p className="text-sm text-slate-500">
                Once the conversational RAG backend is integrated, you can ask questions about 
                apparatus, procedures, observations, and viva topics for each experiment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
