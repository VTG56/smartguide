import { Link, useLocation } from 'react-router-dom';

const pageContent = {
  '/troubleshooting': {
    icon: '🔧',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    label: 'Lab Support',
    title: 'Lab Error Diagnosis Module',
    description: 'Troubleshoot common lab errors and get solutions for experimental issues.',
    examples: [
      'Incorrect or fluctuating readings',
      'Apparatus calibration issues',
      'Unexpected voltage or current values',
      'Compilation errors in code labs',
      'Incorrect graph slope or intercept',
      'Error margin exceeding limits',
    ],
  },
  '/reports': {
    icon: '📄',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    label: 'Lab Reports',
    title: 'Report Writing Assistant',
    description: 'Get help writing your lab reports with proper format and content.',
    examples: [
      'Writing observations clearly',
      'Performing calculations step-by-step',
      'Plotting graphs with proper labels',
      'Drafting conclusions from results',
      'Error analysis and discussion',
      'Formatting tables and diagrams',
    ],
  },
  '/settings': {
    icon: '⚙️',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    label: 'Configuration',
    title: 'Settings',
    description: 'Configure your SmartGuide preferences and account settings.',
    examples: [
      'Select your branch/semester',
      'Choose lab subjects',
      'Notification preferences',
      'Theme customization',
      'Export conversation history',
      'Account management',
    ],
  },
  default: {
    icon: '🚧',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    label: 'Development Status',
    title: 'Module Under Development',
    description: 'This feature will be implemented in the upcoming development phase.',
    examples: [],
  },
};

export default function NotImplemented() {
  const location = useLocation();
  const content = pageContent[location.pathname] || pageContent.default;

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-6">
      <div className="card-editorial p-10 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full ${content.iconBg} flex items-center justify-center`}>
            <span className="text-3xl">{content.icon}</span>
          </div>
          <span className="section-label block mb-3">{content.label}</span>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            {content.title}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {content.description}
          </p>
        </div>

        {content.examples.length > 0 && (
          <div className="mb-8 p-4 bg-slate-50 rounded-md">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Planned Features
            </h4>
            <ul className="space-y-2">
              {content.examples.map((example, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 bg-amber-50 border border-amber-100 rounded-md mb-8">
          <p className="text-xs text-amber-700 text-center">
            Under Development — Coming in Phase 2
          </p>
        </div>

        <div className="text-center">
          <Link to="/" className="btn-editorial btn-solid inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
