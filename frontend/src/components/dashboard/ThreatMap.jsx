export default function ThreatMap({ sources = [] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="mb-3 text-sm font-semibold">Top Sources (Threat Map View)</h3>
      <div className="grid gap-2">
        {sources.map((source) => (
          <div key={source.source_name} className="flex items-center justify-between rounded-lg bg-slate-800/70 px-3 py-2 text-sm">
            <span>{source.source_name}</span>
            <span className="font-semibold text-sky-300">{source.count}</span>
          </div>
        ))}
        {sources.length === 0 ? <p className="text-sm text-slate-400">No source activity available.</p> : null}
      </div>
    </div>
  );
}