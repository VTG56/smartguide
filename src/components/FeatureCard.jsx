export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card rounded-2xl p-8 flex flex-col items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-[rgba(51,97,255,0.08)] flex items-center justify-center text-2xl">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-800">{title}</h3>

      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>

      <span className="mt-auto inline-block text-xs font-semibold text-[var(--color-teal-600)] bg-[rgba(4,200,177,0.08)] px-3 py-1 rounded-full">
        Coming in Phase 2
      </span>
    </div>
  );
}
