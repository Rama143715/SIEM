const styles = {
  CRITICAL: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  HIGH: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  MEDIUM: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  LOW: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  INFO: "bg-sky-500/20 text-sky-300 border-sky-500/40",
};

export default function SeverityBadge({ severity = "INFO" }) {
  const key = String(severity).toUpperCase();
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${styles[key] || styles.INFO}`}>
      {key}
    </span>
  );
}