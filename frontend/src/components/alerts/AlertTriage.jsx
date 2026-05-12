export default function AlertTriage({ onBulkAcknowledge, selectedCount }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div>
        <h3 className="text-sm font-semibold">Alert Triage</h3>
        <p className="text-xs text-slate-400">Bulk SOC actions for selected alerts.</p>
      </div>
      <button
        onClick={onBulkAcknowledge}
        disabled={selectedCount === 0}
        className="rounded bg-sky-600 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        Bulk Acknowledge ({selectedCount})
      </button>
    </div>
  );
}