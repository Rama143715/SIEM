export default function IncidentModal({ incident, open, onClose }) {
  if (!open || !incident) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{incident.id} - {incident.title}</h3>
          <button onClick={onClose} className="rounded border border-slate-700 px-3 py-1.5 text-sm">Close</button>
        </div>

        <p className="text-sm text-slate-300">{incident.description || "No description."}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <p>Severity: <span className="font-semibold">{incident.severity}</span></p>
          <p>Status: <span className="font-semibold">{incident.status}</span></p>
          <p>Assigned: <span className="font-semibold">{incident.assigned_to || "unassigned"}</span></p>
          <p>Created: <span className="font-semibold">{new Date(incident.created_at).toLocaleString()}</span></p>
        </div>

        <div className="mt-4">
          <h4 className="mb-2 text-sm font-semibold">Timeline</h4>
          <pre className="max-h-60 overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-300">{JSON.stringify(incident.timeline || [], null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}