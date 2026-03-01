import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">SmartGuide</span>
          <br />
          <span className="text-slate-800">AI Question Bank</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-xl mx-auto mb-10">
          Multi-Source Academic Learning Assistant
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/upload" className="btn-primary text-base">
            Get Started
          </Link>
          <Link to="/not-implemented" className="btn-secondary text-base">
            View Architecture
          </Link>
        </div>
      </div>
    </section>
  );
}
