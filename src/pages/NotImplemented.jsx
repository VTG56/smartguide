import { Link } from 'react-router-dom';

export default function NotImplemented() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-6">
      <div className="card-editorial p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <span className="section-label block mb-3">Development Status</span>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Module Under Development
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          This feature will be implemented in the upcoming development phase. 
          Check back later for updates.
        </p>
        <Link to="/" className="btn-editorial btn-solid inline-flex">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Overview
        </Link>
      </div>
    </div>
  );
}
