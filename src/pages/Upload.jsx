const supportedFormats = [
  { ext: 'PDF', icon: '📄', status: 'pending' },
  { ext: 'DOCX', icon: '📝', status: 'pending' },
  { ext: 'PPT', icon: '📊', status: 'pending' },
  { ext: 'TXT', icon: '📃', status: 'pending' },
];

export default function Upload() {
  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <span className="section-label block mb-2">Document Management</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Upload Documents</h1>
          <p className="text-slate-500 mt-2 max-w-lg">
            Add your academic materials to build a personalized knowledge base for 
            intelligent retrieval and question solving.
          </p>
        </div>

        <div className="divider mb-10" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drop Zone */}
            <div className="card-editorial border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-700 mb-2">Drop files here or click to browse</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Supports PDF, DOCX, PPT, and TXT files up to 50MB
                </p>
                <button disabled className="btn-editorial btn-solid opacity-50 cursor-not-allowed">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Select Files
                </button>
              </div>
            </div>

            {/* Upload Queue */}
            <div className="card-editorial p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Upload Queue</h3>
                <span className="text-sm text-slate-400">0 files</span>
              </div>
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400">No files selected</p>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Supported Formats */}
            <div className="card-editorial p-6">
              <h3 className="font-bold text-slate-800 mb-4">Supported Formats</h3>
              <div className="space-y-3">
                {supportedFormats.map((format) => (
                  <div key={format.ext} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{format.icon}</span>
                      <span className="font-medium text-slate-700">{format.ext}</span>
                    </div>
                    <span className="tag bg-amber-50 text-amber-600 text-[10px]">Soon</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="card-editorial p-6 bg-slate-50">
              <div className="flex items-start gap-3">
                <span className="text-xl">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-slate-700 text-sm mb-1">Integration Pending</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    RAG pipeline integration is pending. Document parsing, chunking, and 
                    vector storage will be connected in Phase 2.
                  </p>
                </div>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="card-editorial p-6">
              <h3 className="font-bold text-slate-800 mb-4">Processing Pipeline</h3>
              <div className="space-y-3">
                {['Upload', 'Parse', 'Chunk', 'Embed', 'Index'].map((step, i) => (
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
