import SeverityBadge from "../shared/SeverityBadge";
import StatusBadge from "../shared/StatusBadge";

export default function IncidentTable({ incidents, onOpen }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900 text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Severity</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Assigned</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950/60">
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td className="px-4 py-3 font-mono text-xs">{incident.id}</td>
              <td className="px-4 py-3">{incident.title}</td>
              <td className="px-4 py-3"><SeverityBadge severity={incident.severity} /></td>
              <td className="px-4 py-3"><StatusBadge status={incident.status} /></td>
              <td className="px-4 py-3 text-xs text-slate-400">{incident.assigned_to || "unassigned"}</td>
              <td className="px-4 py-3">
                <button onClick={() => onOpen(incident)} className="rounded bg-sky-600 px-2 py-1 text-xs font-semibold">View</button>
              </td>
            </tr>
          ))}
          {incidents.length === 0 ? (
            <tr>
              <td className="px-4 py-4 text-sm text-slate-400" colSpan={6}>No incidents found.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}