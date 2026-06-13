import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from '../services/api';

const TROUBLESHOOTING_SYSTEM_OVERRIDE = `You are SmartGuide's lab troubleshooting assistant.
Use ONLY the retrieved context from the uploaded lab manual to help the student troubleshoot the lab issue.
Do not invent apparatus, circuit behavior, formulas, readings, procedures, or causes that are not supported by the retrieved manual context.
If the manual does not contain enough information to troubleshoot the issue, clearly say that the uploaded manual does not provide enough information and suggest checking the relevant experiment procedure, connections, apparatus, and observations manually.
Format the response in Markdown.

For the answer, use this structure:

## Likely Issue

Briefly explain what may be going wrong based only on the manual context.

## Step-by-Step Troubleshooting

1. First check...
2. Then verify...
3. Next try...

## What to Recheck in the Manual

* Apparatus
* Circuit connections
* Procedure
* Observation table
* Precautions

## Safety / Precaution Note

Mention any relevant safety or precaution instruction only if present in the manual context.`;

const quickIssues = [
  'My output voltage is zero',
  'The LED is not glowing',
  'My circuit output is not coming',
  'The readings are fluctuating',
  'The waveform is distorted',
];

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

export default function QuestionSolver() {
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [error, setError] = useState('');

  const noManualAnswer = answer.toLowerCase().includes('no lab manual has been uploaded');

  async function handleSubmit() {
    const trimmedIssue = issue.trim();

    if (!trimmedIssue) {
      setError('Please describe the lab issue first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await sendMessage(trimmedIssue, [], TROUBLESHOOTING_SYSTEM_OVERRIDE);
      const generatedAnswer = data?.answer?.trim();

      if (!generatedAnswer) {
        throw new Error('SmartGuide returned an empty response.');
      }

      setAnswer(generatedAnswer);
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err) {
      setError(err.message || 'Failed to generate troubleshooting steps.');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setIssue('');
    setError('');
  }

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="mb-10">
          <span className="section-label block mb-2">Manual-grounded troubleshooting</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Lab Error Solver</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Describe the issue you are facing in the lab. SmartGuide will use the uploaded manual
            to suggest step-by-step troubleshooting.
          </p>
        </div>

        <div className="divider mb-10" />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-editorial p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-sm">Describe Your Lab Issue</h2>
                  <p className="text-xs text-slate-400">Add the symptom, failed output, or observation</p>
                </div>
              </div>

              <textarea
                rows={8}
                value={issue}
                onChange={(event) => setIssue(event.target.value)}
                placeholder="Example: My output voltage is zero... The LED is not glowing... The CRO waveform is not stable..."
                disabled={loading}
                className="input-editorial w-full resize-none mb-4"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`btn-editorial btn-solid flex-1 justify-center ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {loading ? 'Analyzing...' : 'Get Troubleshooting Steps'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="btn-editorial"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="card-editorial p-5">
              <h3 className="font-semibold text-slate-700 text-sm mb-4">Quick Issues</h3>
              <div className="flex flex-wrap gap-2">
                {quickIssues.map((quickIssue) => (
                  <button
                    key={quickIssue}
                    type="button"
                    onClick={() => setIssue(quickIssue)}
                    disabled={loading}
                    className="px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    {quickIssue}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {error && (
              <div className="card-editorial p-5 bg-red-50 border-red-200">
                <h3 className="font-semibold text-red-800 text-sm mb-1">Solver Error</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!answer && !loading && (
              <div className="card-editorial p-8 min-h-[380px] flex items-center justify-center text-center">
                <div>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-md bg-blue-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="font-bold text-slate-800 mb-2">Troubleshooting guidance will appear here</h2>
                  <p className="text-sm text-slate-500 max-w-md">
                    Enter a lab issue and SmartGuide will retrieve relevant manual context before suggesting checks.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="card-editorial p-8 min-h-[380px] flex items-center justify-center text-center">
                <div>
                  <div className="w-10 h-10 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <h2 className="font-bold text-slate-800 mb-2">Analyzing the issue</h2>
                  <p className="text-sm text-slate-500">
                    Retrieving manual context and preparing troubleshooting steps.
                  </p>
                </div>
              </div>
            )}

            {answer && (
              <div className="card-editorial p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-bold text-slate-800">Troubleshooting Guidance</h2>
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
