export default function AssetGrid({ assets = [] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="mb-3 text-sm font-semibold">Asset Health</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <article key={`${asset.asset}-${asset.last_event}`} className="rounded-lg border border-slate-700 bg-slate-800/70 p-3">
            <p className="font-medium">{asset.asset || "unknown"}</p>
            <p className="text-xs text-slate-400">Last event: {asset.last_event ? new Date(asset.last_event).toLocaleString() : "N/A"}</p>
            <p className="mt-2 text-xs">
              <span className={`rounded-full px-2 py-0.5 ${asset.status === "degraded" ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                {asset.status}
              </span>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}