import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    icon: '📄',
    title: 'Multi-Document Upload',
    description:
      'Upload PDFs, DOCX, and PPT files. The RAG pipeline will parse, chunk, and index your academic materials for intelligent retrieval.',
  },
  {
    icon: '📚',
    title: 'Topic-Wise Explanations',
    description:
      'Get structured, contextual explanations for any academic topic, generated from your uploaded study materials using an LLM.',
  },
  {
    icon: '🧠',
    title: 'Intelligent Question Solving',
    description:
      'Paste any question and receive step-by-step solutions powered by retrieval-augmented generation from your knowledge base.',
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">
            Core Capabilities
          </h2>
          <p className="text-center text-slate-500 mb-14 max-w-lg mx-auto">
            Designed for students and educators — powered by modern AI
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
