import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from '../services/api';

const TOPIC_SYSTEM_OVERRIDE = `You are SmartGuide's experiment explainer assistant.
Use ONLY the retrieved context from the uploaded lab manual.
Do not invent experiments, readings, apparatus, formulas, observations, procedures, or precautions that are not present in the retrieved manual context.
If the uploaded manual does not contain enough information for the selected topic, clearly say that the manual does not provide enough information.
Format the response in Markdown.

When explaining experiments, use this structure wherever possible:

## Overview

Briefly explain what the selected topic or experiment is about.

## Aim

Mention the aim if present in the manual.

## Apparatus / Requirements

List apparatus, components, software, tools, or materials if present.

## Theory

Explain the theory in simple language using only manual context.

## Procedure

Give step-by-step procedure if present.

## Observations / Results

Mention observations, tables, outputs, or expected results if present.

## Precautions

List precautions if present.

## Quick Revision Points

Add 3 to 5 short revision points based only on the manual.`;

const topicCards = [
  {
    title: 'Explain Experiment 1',
    description: 'Get the aim, theory, procedure, and key points for Experiment 1.',
    query: 'Explain Experiment 1 from the uploaded manual. Include aim, theory, apparatus, procedure, observations, and precautions if available.',
  },
  {
    title: 'Explain Experiment 2',
    description: 'Get a structured explanation of Experiment 2.',
    query: 'Explain Experiment 2 from the uploaded manual. Include aim, theory, apparatus, procedure, observations, and precautions if available.',
  },
  {
    title: 'Explain Experiment 3',
    description: 'Get a structured explanation of Experiment 3.',
    query: 'Explain Experiment 3 from the uploaded manual. Include aim, theory, apparatus, procedure, observations, and precautions if available.',
  },
  {
    title: 'Summarize Aim and Apparatus',
    description: 'List aims and required equipment from the manual.',
    query: 'Summarize the aim and apparatus sections from the uploaded lab manual. Organize the answer experiment-wise if possible.',
  },
  {
    title: 'Explain Procedure',
    description: 'Get step-by-step procedures from the manual.',
    query: 'Explain the lab procedures from the uploaded manual in clear step-by-step form. Organize experiment-wise if possible.',
  },
  {
    title: 'List Precautions',
    description: 'Find safety and experimental precautions.',
    query: 'List the precautions mentioned in the uploaded lab manual. Organize them experiment-wise if possible.',
  },
  {
    title: 'Explain Theory',
    description: 'Understand the theory behind the experiments.',
    query: 'Explain the theory sections from the uploaded lab manual in simple student-friendly language. Include formulas only if present in the manual.',
  },
  {
    title: 'Record Writing Points',
    description: 'Prepare lab-record style points.',
    query: 'Based on the uploaded manual, give lab record writing points including aim, apparatus, procedure, observations, result, and precautions wherever available.',
  },
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

export default function Topics() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loadingCard, setLoadingCard] = useState(null);
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const noManualAnswer = answer.toLowerCase().includes('no lab manual has been uploaded');
  const filteredCards = topicCards.filter((card) =>
    `${card.title} ${card.description}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  async function handleTopicClick(card) {
    setSelectedTopic(card);
    setLoadingCard(card.title);
    setError('');
    setAnswer('');
    setSources([]);

    try {
      const data = await sendMessage(card.query, [], TOPIC_SYSTEM_OVERRIDE);
      const generatedAnswer = data?.answer?.trim();

      if (!generatedAnswer) {
        throw new Error('SmartGuide returned an empty response.');
      }

      setAnswer(generatedAnswer);
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err) {
      setError(err.message || 'Failed to generate topic explanation.');
    } finally {
      setLoadingCard(null);
    }
  }

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div>
            <span className="section-label block mb-2">Manual-grounded topic explainer</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Experiment Explainer</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Use quick study cards to ask SmartGuide about the uploaded lab manual.
            </p>
          </div>
          <span className="tag bg-blue-50 text-blue-600 self-start">Study shortcuts</span>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md mb-8">
          <p className="text-sm text-blue-700">
            These cards use the uploaded manual through SmartGuide's RAG assistant. They are study shortcuts,
            not automatic experiment extraction.
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search study cards..."
            className="input-editorial w-full"
          />
        </div>

        <div className="divider mb-10" />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            {filteredCards.length === 0 ? (
              <div className="card-editorial p-6 text-center">
                <p className="text-sm text-slate-500">No matching study cards found.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {filteredCards.map((card) => {
                  const isLoading = loadingCard === card.title;
                  const isAnyLoading = Boolean(loadingCard);

                  return (
                    <button
                      key={card.title}
                      type="button"
                      onClick={() => handleTopicClick(card)}
                      disabled={isAnyLoading}
                      className={`card-editorial p-5 text-left hover-lift transition ${
                        selectedTopic?.title === card.title ? 'border-blue-200 bg-blue-50/40' : ''
                      } ${isAnyLoading && !isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h2 className="font-bold text-slate-800">{card.title}</h2>
                        {isLoading && (
                          <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4">{card.description}</p>
                      <span className="text-xs font-semibold text-blue-600">
                        {isLoading ? 'Generating...' : 'Open with SmartGuide'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            {error && (
              <div className="card-editorial p-5 bg-red-50 border-red-200">
                <h3 className="font-semibold text-red-800 text-sm mb-1">Topic Error</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!selectedTopic && !loadingCard && (
              <div className="card-editorial p-8 min-h-[360px] flex items-center justify-center text-center">
                <div>
                  <h2 className="font-bold text-slate-800 mb-2">Choose a study card</h2>
                  <p className="text-sm text-slate-500 max-w-md">
                    Pick a prompt card to generate a manual-grounded explanation with sources.
                  </p>
                </div>
              </div>
            )}

            {loadingCard && (
              <div className="card-editorial p-8 min-h-[360px] flex items-center justify-center text-center">
                <div>
                  <div className="w-10 h-10 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <h2 className="font-bold text-slate-800 mb-2">Generating explanation</h2>
                  <p className="text-sm text-slate-500">
                    Retrieving manual context for {loadingCard}.
                  </p>
                </div>
              </div>
            )}

            {answer && selectedTopic && !loadingCard && (
              <div className="card-editorial p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-bold text-slate-800">
                      SmartGuide Explanation: {selectedTopic.title}
                    </h2>
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
