import { Link } from 'react-router-dom';

export default function NotImplemented() {
  return (
    <section className="py-20 px-6 flex items-center justify-center min-h-[70vh]">
      <div className="glass-card rounded-2xl p-12 max-w-md w-full text-center">
        <div className="text-5xl mb-6">🚧</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Module Under Development
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          This feature will be implemented in the upcoming development phase.
        </p>
        <Link to="/" className="btn-primary inline-block text-base">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
