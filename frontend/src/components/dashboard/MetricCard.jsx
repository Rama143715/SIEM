export default function MetricCard({ title, value, color = "blue", trend = null }) {
  const colorMap = {
    red: "from-rose-600/40 to-rose-500/10 border-rose-500/40",
    amber: "from-amber-600/40 to-amber-500/10 border-amber-500/40",
    blue: "from-sky-600/40 to-sky-500/10 border-sky-500/40",
    green: "from-emerald-600/40 to-emerald-500/10 border-emerald-500/40",
  };

  return (
    <article className={`rounded-xl border bg-gradient-to-br p-4 ${colorMap[color] || colorMap.blue}`}>
      <p className="text-xs uppercase tracking-wider text-slate-300">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {trend !== null ? <p className="mt-2 text-xs text-slate-300">Trend: {trend > 0 ? `+${trend}%` : `${trend}%`}</p> : null}
    </article>
  );
}