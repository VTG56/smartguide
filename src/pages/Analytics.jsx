import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from '../services/api';

const VIVA_SYSTEM_OVERRIDE = `You are SmartGuide's viva preparation assistant.
Generate viva-style questions and concise answers using ONLY the retrieved context from the uploaded lab manual.
Do not invent experiments, apparatus, readings, formulas, or procedures that are not present in the context.
If the manual context is insufficient, clearly say that the uploaded manual does not contain enough information.
Format the response in Markdown.

Output format:

## Viva Questions

For each question:

### Q1. [Question]

**Answer:** [Concise answer based on the manual]

After the questions, add:

## Revision Tips

* 3 to 5 short tips based on the manual content.

If sources are available, the frontend will display them separately.`;

const questionTypes = [
  { label: 'Mixed', value: 'mixed' },
  { label: 'Basic', value: 'basic' },
  { label: 'Conceptual', value: 'conceptual' },
  { label: 'Procedure-based', value: 'procedure-based' },
  { label: 'Troubleshooting', value: 'troubleshooting' },
];

function buildVivaQuery(questionType) {
  if (questionType === 'mixed') {
    return 'Generate 10 viva questions and concise answers based only on the uploaded lab manual.';
  }

  return `Generate 10 ${questionType} viva questions and concise answers based only on the uploaded lab manual.`;
}

function SourcesUsed({ sources }) {
  if (!sources?.length) return null;

  return (
    <div className="card-editorial p-6">
      <h3 className="font-bold text-slate-800 mb-4">Sources Used</h3>
      <div className="space-y-3">
        {sources.map((source, index) => (
          <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-md">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Chunk {source.chunk_index ?? index + 1}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {source.text_preview || source.preview || 'No preview available.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [questionType, setQuestionType] = useState('mixed');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [error, setError] = useState('');

  const noManualAnswer = answer.toLowerCase().includes('no lab manual has been uploaded');

  async function handleGenerate() {
    setLoading(true);
    setError('');

    try {
      const data = await sendMessage(
        buildVivaQuery(questionType),
        [],
        VIVA_SYSTEM_OVERRIDE,
      );

      const generatedAnswer = data?.answer?.trim();
      if (!generatedAnswer) {
        throw new Error('SmartGuide returned an empty response.');
      }

      setAnswer(generatedAnswer);
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err) {
      setError(err.message || 'Failed to generate viva questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div>
            <span className="section-label block mb-2">Practical Exam Prep</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Viva Preparation</h1>
            <p className="text-slate-500 mt-2 max-w-xl">
              Generate viva-style questions and concise answers from the uploaded lab manual.
            </p>
          </div>
          <span className="tag bg-blue-50 text-blue-600 self-start">Manual-grounded</span>
        </div>

        <div className="divider mb-10" />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="card-editorial p-6">
              <h2 className="font-bold text-slate-800 mb-4">Question Focus</h2>
              <div className="space-y-2 mb-6">
                {questionTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setQuestionType(type.value)}
                    disabled={loading}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      questionType === type.value
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className={`btn-editorial btn-solid w-full justify-center ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Generating...' : 'Generate Viva Questions'}
              </button>
            </div>

            <div className="card-editorial p-5 bg-blue-50 border-blue-100">
              <h3 className="font-semibold text-blue-800 text-sm mb-2">How it works</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                SmartGuide asks the existing RAG chat pipeline to retrieve relevant manual chunks,
                then Gemini formats viva questions from that retrieved context.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="card-editorial p-5 bg-red-50 border-red-200">
                <h3 className="font-semibold text-red-800 text-sm mb-1">Generation Error</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!answer && !loading && (
              <div className="card-editorial p-8 min-h-[300px] flex items-center justify-center text-center">
                <div>
                  <h2 className="font-bold text-slate-800 mb-2">Ready to generate viva practice</h2>
                  <p className="text-sm text-slate-500 max-w-md">
                    Upload a lab manual first, then generate questions grounded in the indexed manual content.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="card-editorial p-8 min-h-[300px] flex items-center justify-center text-center">
                <div>
                  <div className="w-10 h-10 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <h2 className="font-bold text-slate-800 mb-2">Generating viva questions</h2>
                  <p className="text-sm text-slate-500">
                    Retrieving manual context and preparing a Markdown study set.
                  </p>
                </div>
              </div>
            )}

            {answer && (
              <div className="card-editorial p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-bold text-slate-800">Generated Viva Set</h2>
                    <p className="text-xs text-slate-400 mt-1">Generated through SmartGuide RAG chat</p>
                  </div>
                  {noManualAnswer && (
                    <Link to="/upload" className="btn-editorial text-sm flex-shrink-0">
                      Upload Manual
                    </Link>
                  )}
                </div>

                <div className="prose prose-sm max-w-none prose-slate prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </div>
            )}

            <SourcesUsed sources={sources} />
          </div>
        </div>
      </div>
    </div>
  );
}
