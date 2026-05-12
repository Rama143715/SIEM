const styles = {
  open: "bg-rose-500/20 text-rose-300",
  acknowledged: "bg-amber-500/20 text-amber-300",
  resolved: "bg-emerald-500/20 text-emerald-300",
};

export default function StatusBadge({ status = "open" }) {
  const value = String(status).toLowerCase();
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles[value] || styles.open}`}>
      {value}
    </span>
  );
}