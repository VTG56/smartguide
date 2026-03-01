export default function Upload() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          <span className="gradient-text">Upload Documents</span>
        </h1>
        <p className="text-slate-500 mb-10">
          Add your academic materials to build a personalised knowledge base.
        </p>

        {/* Drag & Drop Area */}
        <div className="glass-card rounded-2xl p-10 text-center border-2 border-dashed border-slate-300 mb-6">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-slate-600 font-medium mb-1">
            Drag &amp; Drop files here
          </p>
          <p className="text-sm text-slate-400">
            PDF / DOCX / PPT support will be enabled in upcoming milestone.
          </p>
        </div>

        {/* Disabled Upload Button */}
        <button
          disabled
          className="btn-primary w-full opacity-50 cursor-not-allowed text-base"
        >
          Upload Files
        </button>

        {/* Info Box */}
        <div className="glass-card rounded-xl p-5 mt-8 flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <p className="text-sm text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">Note:</span>{' '}
            RAG pipeline integration pending. Document parsing, chunking, and
            vector storage will be connected in the next development phase.
          </p>
        </div>
      </div>
    </section>
  );
}
