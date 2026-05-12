import SeverityBadge from "../shared/SeverityBadge";
import StatusBadge from "../shared/StatusBadge";

export default function AlertCard({ alert, onAcknowledge, onResolve }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{alert.title}</h3>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={alert.severity} />
          <StatusBadge status={alert.status} />
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-300">{alert.detail || "No detail provided."}</p>
      <p className="mt-2 text-xs text-slate-400">Source: {alert.source_name || "unknown"} | Created: {new Date(alert.created_at).toLocaleString()}</p>

      <div className="mt-4 flex gap-2">
        <button onClick={() => onAcknowledge(alert.id)} className="rounded bg-amber-600 px-3 py-1.5 text-xs font-semibold hover:bg-amber-500">Acknowledge</button>
        <button onClick={() => onResolve(alert.id)} className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-500">Resolve</button>
      </div>
    </article>
  );
}