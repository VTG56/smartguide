import { useNavigate } from 'react-router-dom';

const topics = [
  {
    title: 'Database Normalization',
    subject: 'DBMS',
    description:
      '1NF, 2NF, 3NF, BCNF — decomposition techniques and functional dependencies.',
  },
  {
    title: 'Operating Systems Scheduling',
    subject: 'OS',
    description:
      'CPU scheduling algorithms — FCFS, SJF, Round Robin, Priority Scheduling.',
  },
  {
    title: 'Computer Networks OSI Model',
    subject: 'CN',
    description:
      'Seven-layer architecture — Physical, Data Link, Network, Transport, Session, Presentation, Application.',
  },
];

export default function Topics() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          <span className="gradient-text">Topic Explorer</span>
        </h1>
        <p className="text-slate-500 mb-10">
          Browse and search topics extracted from your knowledge base.
        </p>

        {/* Search Bar */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search topics…"
            className="input-modern w-full"
          />
        </div>

        {/* Topic Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t) => (
            <div
              key={t.title}
              className="glass-card rounded-2xl p-6 flex flex-col gap-3"
            >
              <span className="text-xs font-semibold tracking-wide uppercase text-[var(--color-primary-500)]">
                {t.subject}
              </span>
              <h3 className="text-base font-bold text-slate-800">{t.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                {t.description}
              </p>
              <button
                onClick={() => navigate('/not-implemented')}
                className="btn-secondary text-sm mt-2"
              >
                Explain Topic
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
