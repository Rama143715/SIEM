import ReactMarkdown from "react-markdown";

export default function AnalysisPanel({ output, loading }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="mb-3 text-sm font-semibold">Analysis Output</h3>
      {loading ? <p className="text-sm text-slate-400">Running analysis...</p> : null}
      {!loading && !output ? <p className="text-sm text-slate-400">No analysis generated yet.</p> : null}
      {output ? <article className="prose prose-invert max-w-none text-sm"><ReactMarkdown>{output}</ReactMarkdown></article> : null}
    </div>
  );
}