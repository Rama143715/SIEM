import { useMemo } from "react";

const severities = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];

export default function LogFilters({ filters, onChange, onSearch, onToggleStreaming, isStreaming, onAnalyzeSelected, selectedCount }) {
  const severitySet = useMemo(() => new Set(filters.severity || []), [filters.severity]);

  return (
    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {severities.map((severity) => (
          <button
            key={severity}
            onClick={() => {
              const current = filters.severity || [];
              const next = severitySet.has(severity)
                ? current.filter((item) => item !== severity)
                : [...current, severity];
              onChange("severity", next);
            }}
            className={`rounded-full px-3 py-1 text-xs ${severitySet.has(severity) ? "bg-sky-600/40 text-sky-100" : "bg-slate-800 text-slate-300"}`}
          >
            {severity}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <input value={filters.search || ""} onChange={(e) => onChange("search", e.target.value)} placeholder="Search logs" className="rounded bg-slate-800 px-3 py-2 text-sm" />
        <input value={filters.source || ""} onChange={(e) => onChange("source", e.target.value)} placeholder="Source" className="rounded bg-slate-800 px-3 py-2 text-sm" />
        <input type="datetime-local" value={filters.from || ""} onChange={(e) => onChange("from", e.target.value)} className="rounded bg-slate-800 px-3 py-2 text-sm" />
        <input type="datetime-local" value={filters.to || ""} onChange={(e) => onChange("to", e.target.value)} className="rounded bg-slate-800 px-3 py-2 text-sm" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onSearch} className="rounded bg-sky-600 px-3 py-2 text-sm font-semibold hover:bg-sky-500">Apply Filters</button>
        <button onClick={onToggleStreaming} className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">{isStreaming ? "Pause Stream" : "Resume Stream"}</button>
        <button
          onClick={onAnalyzeSelected}
          disabled={selectedCount === 0}
          className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Analyze Selected ({selectedCount})
        </button>
      </div>
    </div>
  );
}