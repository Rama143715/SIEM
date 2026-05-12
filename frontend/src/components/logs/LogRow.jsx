import SeverityBadge from "../shared/SeverityBadge";

export default function LogRow({ log, selected, onSelect }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={selected} onChange={() => onSelect(log.id)} className="mt-1" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={log.severity} />
            <span className="text-xs text-slate-400">{new Date(log.ts).toLocaleString()}</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{log.source_name}</span>
          </div>
          <p className="break-words text-sm">{log.message}</p>
          <details className="mt-2 text-xs text-slate-400">
            <summary className="cursor-pointer">Raw details</summary>
            <pre className="mt-2 overflow-auto rounded bg-slate-950 p-2">{JSON.stringify(log, null, 2)}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}