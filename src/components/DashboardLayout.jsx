import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen noise-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-md hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-slate-800">SmartGuide</span>
          <div className="w-10" />
        </div>
      </header>

      <main className="main-content relative z-10">
        <div className="lg:hidden h-14" /> {/* Mobile header spacer */}
        <Outlet />
      </main>
    </div>
  );
}
