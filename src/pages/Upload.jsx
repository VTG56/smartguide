import { useState } from 'react';
import { Link } from 'react-router-dom';

const supportedFormats = [
  { ext: 'PDF', icon: '📄', status: 'active' },
  { ext: 'DOCX', icon: '📝', status: 'pending' },
  { ext: 'PPT', icon: '📊', status: 'pending' },
  { ext: 'TXT', icon: '📃', status: 'pending' },
];

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file only');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResponse(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('http://localhost:8000/upload-lab-manual', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);

      localStorage.setItem('smartguide_uploaded', 'true');

    } catch (err) {
      setError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="mb-10">
          <span className="section-label block mb-2">Lab Manual Upload</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Upload Lab Manual</h1>
          <p className="text-slate-500 mt-2 max-w-lg">
            Upload your lab manual PDFs to enable SmartGuide to answer questions about
            experiments, procedures, apparatus, and viva topics.
          </p>
        </div>

        <div className="divider mb-10" />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-editorial border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-700 mb-2">Select a PDF file to upload</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Only PDF files are currently supported
                </p>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />

                <label htmlFor="file-input" className="btn-editorial btn-solid inline-flex items-center gap-2 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Select PDF File
                </label>

                {selectedFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md inline-block">
                    <p className="text-sm text-green-700 font-medium">
                      📄 {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedFile && (
              <div className="text-center">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`btn-editorial btn-solid px-8 py-3 text-base ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {uploading ? 'Uploading...' : 'Upload to Backend'}
                </button>
              </div>
            )}

            {error && (
              <div className="card-editorial p-6 bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-red-800 text-sm mb-1">Upload Error</h4>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {response && response.status === 'success' && (
              <div className="card-editorial p-6 bg-green-50 border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-xl">✅</span>
                  <div>
                    <h4 className="font-semibold text-green-800 text-sm mb-1">Upload Successful!</h4>
                    <p className="text-sm text-green-600">Your PDF has been processed by the backend.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-md border border-green-100">
                    <p className="text-xs text-slate-500 mb-1">Total Pages</p>
                    <p className="text-2xl font-bold text-slate-800">{response.pages}</p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-green-100">
                    <p className="text-xs text-slate-500 mb-1">Total Chars</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {response.total_characters >= 1000
                        ? (response.total_characters / 1000).toFixed(1) + 'k'
                        : response.total_characters}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-green-100">
                    <p className="text-xs text-slate-500 mb-1">Chunks</p>
                    <p className="text-2xl font-bold text-slate-800">{response.chunks_created}</p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-green-100">
                    <p className="text-xs text-slate-500 mb-1">Vectors</p>
                    <p className="text-2xl font-bold text-slate-800">{response.vectors_stored}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md border border-green-100 mb-4">
                  <p className="text-xs text-slate-500 mb-2 font-semibold">Text Preview:</p>
                  <div className="bg-slate-50 p-3 rounded text-xs text-slate-700 max-h-40 overflow-y-auto font-mono leading-relaxed whitespace-pre-wrap">
                    {response.text_preview}
                  </div>
                </div>

                <div className="text-right">
                  <Link to="/chat" className="btn-editorial btn-solid px-6 py-2 inline-flex items-center gap-2">
                    Start Chatting
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card-editorial p-6">
              <h3 className="font-bold text-slate-800 mb-4">Supported Formats</h3>
              <div className="space-y-3">
                {supportedFormats.map((format) => (
                  <div key={format.ext} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{format.icon}</span>
                      <span className="font-medium text-slate-700">{format.ext}</span>
                    </div>
                    {format.status === 'active' ? (
                      <span className="tag bg-green-50 text-green-600 text-[10px]">Active</span>
                    ) : (
                      <span className="tag bg-amber-50 text-amber-600 text-[10px]">Soon</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-editorial p-6 bg-blue-50 border-blue-100">
              <div className="flex items-start gap-3">
                <span className="text-xl">🧪</span>
                <div>
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">Backend Connected</h4>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Your PDF will be sent to the FastAPI backend at localhost:8000 for processing.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-editorial p-6">
              <h3 className="font-bold text-slate-800 mb-4">Processing Pipeline</h3>
              <div className="space-y-3">
                {['Upload Manual', 'Parse Text', 'Create Chunks', 'Generate Embeddings', 'Sync Vector DB'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="section-number">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm text-slate-600">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}