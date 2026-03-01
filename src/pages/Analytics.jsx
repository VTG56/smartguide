import { useState } from 'react';

const vivaQuestions = [
  {
    id: 1,
    question: "What is Ohm's Law and how do you verify it experimentally?",
    answer: "Ohm's Law states that the current through a conductor is directly proportional to the voltage across it, provided temperature remains constant (V = IR). To verify experimentally: set up a circuit with a resistor, ammeter (in series), voltmeter (in parallel), and variable power supply. Record multiple V-I readings, plot a graph, and confirm linear relationship.",
    experiment: "Ohm's Law Verification",
    subject: 'Physics',
  },
  {
    id: 2,
    question: "What precautions should be taken while measuring viscosity?",
    answer: "Key precautions: (1) Ensure the liquid is at uniform temperature throughout, (2) Use spheres of known density and diameter, (3) Release the sphere gently without initial velocity, (4) Start timing only after sphere attains terminal velocity, (5) Repeat measurements for accuracy.",
    experiment: 'Determination of Viscosity',
    subject: 'Physics',
  },
  {
    id: 3,
    question: "Why is the emitter-base junction forward biased in CE configuration?",
    answer: "The emitter-base junction is forward biased to reduce the barrier potential and allow charge carriers (electrons in NPN) to flow from emitter to base. This is essential for transistor action where these carriers are then swept into the collector by the reverse-biased collector-base junction.",
    experiment: 'BJT Characteristics',
    subject: 'Electronics',
  },
  {
    id: 4,
    question: "What is the difference between INNER JOIN and LEFT JOIN?",
    answer: "INNER JOIN returns only the rows that have matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right table; unmatched rows show NULL values for right table columns.",
    experiment: 'SQL Lab Experiment 3',
    subject: 'Computer Science',
  },
  {
    id: 5,
    question: "What is the purpose of shebang (#!) in shell scripts?",
    answer: "The shebang (#!) at the beginning of a shell script specifies the interpreter that should execute the script. For example, #!/bin/bash tells the system to use the Bash shell. Without it, the script would be executed by the default shell which may cause compatibility issues.",
    experiment: 'OS Shell Programming',
    subject: 'Computer Science',
  },
];

export default function Analytics() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <span className="section-label block mb-2">Practical Exam Prep</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Viva Preparation</h1>
            <p className="text-slate-500 mt-2 max-w-md">
              Prepare for your practical exam viva with probable questions and answers 
              from your lab experiments.
            </p>
          </div>
          <span className="tag bg-amber-50 text-amber-600">Coming Soon</span>
        </div>

        <div className="divider mb-10" />

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎓</span>
            <p className="text-sm text-blue-700">
              Auto-generated from lab manual — Full viva question bank will be available after RAG integration.
            </p>
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-4">
          {vivaQuestions.map((item) => (
            <div key={item.id} className="card-editorial overflow-hidden">
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full p-6 text-left flex items-start gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                  {item.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="tag bg-slate-100 text-slate-600 text-xs">{item.subject}</span>
                    <span className="text-xs text-slate-400">{item.experiment}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 leading-snug">
                    {item.question}
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                    expandedId === item.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedId === item.id && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  <div className="ml-12 p-4 bg-slate-50 rounded-md">
                    <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-md">
          <div className="flex items-start gap-4">
            <span className="text-2xl">❓</span>
            <div>
              <h4 className="font-semibold text-slate-700 mb-1">Viva Question Bank — Under Development</h4>
              <p className="text-sm text-slate-500">
                Questions shown above are sample placeholders. The full question bank will be 
                auto-generated from your lab manual after the conversational AI backend is integrated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
