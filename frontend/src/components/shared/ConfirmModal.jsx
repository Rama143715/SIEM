export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{message}</p>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">Cancel</button>
          <button onClick={onConfirm} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500">Confirm</button>
        </div>
      </div>
    </div>
  );
}